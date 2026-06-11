from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import get_session
from app.api import deps
from app.models.loan import Loan, LoanCreate, LoanRead, LoanStatus, LoanStatusUpdate, LoanReadWithDetails
from app.models.copy import Copy, CopyStatus
from app.models.title import Title
from app.models.user import User, UserRole

router = APIRouter()

# Valid state transitions for the loan lifecycle
_VALID_TRANSITIONS = {
    LoanStatus.PENDING: {LoanStatus.APPROVED, LoanStatus.REJECTED},
    LoanStatus.APPROVED: {LoanStatus.ACTIVE},
    LoanStatus.ACTIVE: {LoanStatus.RETURNED},
}


@router.post("/request", response_model=LoanRead, status_code=status.HTTP_201_CREATED)
async def request_loan(
    *,
    session: AsyncSession = Depends(get_session),
    loan_in: LoanCreate,
    current_user: User = Depends(deps.check_role(UserRole.STUDENT)),
):
    # Pessimistic locking: find and lock an available copy for this title
    statement = (
        select(Copy)
        .where(Copy.title_id == loan_in.title_id, Copy.status == CopyStatus.AVAILABLE)
        .limit(1)
        .with_for_update()
    )
    result = await session.exec(statement)
    copy = result.first()

    if not copy:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No available copies for this title.",
        )

    # Reserve the copy immediately to prevent double-borrowing
    copy.status = CopyStatus.BORROWED
    session.add(copy)

    loan = Loan(
        copy_id=copy.id,
        title_id=loan_in.title_id,
        user_id=current_user.id,
        status=LoanStatus.PENDING,
    )
    session.add(loan)
    await session.commit()
    await session.refresh(loan)
    return loan


@router.get("/", response_model=List[LoanReadWithDetails])
async def list_loans(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(deps.check_role(UserRole.LIBRARIAN)),
):
    result = await session.exec(select(Loan))
    loans = result.all()

    enriched = []
    for loan in loans:
        title_res = await session.exec(select(Title).where(Title.id == loan.title_id))
        title = title_res.first()
        user_res = await session.exec(select(User).where(User.id == loan.user_id))
        user = user_res.first()
        enriched.append(
            LoanReadWithDetails(
                id=loan.id,
                copy_id=loan.copy_id,
                title_id=loan.title_id,
                user_id=loan.user_id,
                status=loan.status,
                created_at=loan.created_at,
                updated_at=loan.updated_at,
                due_date=loan.due_date,
                book_title=title.title if title else "Unknown",
                book_author=title.author if title else "Unknown",
                student_email=user.email if user else "Unknown",
            )
        )
    return enriched


@router.get("/overdue", response_model=List[LoanReadWithDetails])
async def list_overdue_loans(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(deps.check_role(UserRole.LIBRARIAN)),
):
    now = datetime.utcnow()
    result = await session.exec(
        select(Loan).where(
            Loan.status == LoanStatus.ACTIVE,
            Loan.due_date < now,
        )
    )
    loans = result.all()

    enriched = []
    for loan in loans:
        title_res = await session.exec(select(Title).where(Title.id == loan.title_id))
        title = title_res.first()
        user_res = await session.exec(select(User).where(User.id == loan.user_id))
        user = user_res.first()
        enriched.append(
            LoanReadWithDetails(
                id=loan.id,
                copy_id=loan.copy_id,
                title_id=loan.title_id,
                user_id=loan.user_id,
                status=loan.status,
                created_at=loan.created_at,
                updated_at=loan.updated_at,
                due_date=loan.due_date,
                book_title=title.title if title else "Unknown",
                book_author=title.author if title else "Unknown",
                student_email=user.email if user else "Unknown",
            )
        )
    return enriched


@router.get("/dashboard-stats")
async def get_dashboard_stats(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(deps.check_role(UserRole.LIBRARIAN)),
):
    now = datetime.utcnow()
    result = await session.exec(select(Loan))
    all_loans = result.all()

    active = sum(1 for loan in all_loans if loan.status == LoanStatus.ACTIVE)
    pending = sum(1 for loan in all_loans if loan.status == LoanStatus.PENDING)
    overdue = sum(
        1 for loan in all_loans
        if loan.status == LoanStatus.ACTIVE
        and loan.due_date is not None
        and loan.due_date < now
    )
    total = len(all_loans)

    return {"active": active, "pending": pending, "overdue": overdue, "total": total}


@router.get("/my", response_model=List[LoanReadWithDetails])
async def get_my_loans(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(deps.check_role(UserRole.STUDENT)),
):
    result = await session.exec(
        select(Loan).where(Loan.user_id == current_user.id).order_by(Loan.created_at.desc())
    )
    loans = result.all()

    enriched = []
    for loan in loans:
        title_res = await session.exec(select(Title).where(Title.id == loan.title_id))
        title = title_res.first()
        user_res = await session.exec(select(User).where(User.id == loan.user_id))
        user = user_res.first()
        enriched.append(
            LoanReadWithDetails(
                id=loan.id,
                copy_id=loan.copy_id,
                title_id=loan.title_id,
                user_id=loan.user_id,
                status=loan.status,
                created_at=loan.created_at,
                updated_at=loan.updated_at,
                due_date=loan.due_date,
                book_title=title.title if title else "Unknown",
                book_author=title.author if title else "Unknown",
                student_email=user.email if user else "Unknown",
            )
        )
    return enriched


@router.put("/{loan_id}/status", response_model=LoanRead)
async def update_loan_status(
    *,
    session: AsyncSession = Depends(get_session),
    loan_id: int,
    status_update: LoanStatusUpdate,
    current_user: User = Depends(deps.check_role(UserRole.LIBRARIAN)),
):
    result = await session.exec(select(Loan).where(Loan.id == loan_id))
    loan = result.first()

    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    new_status = status_update.status
    allowed = _VALID_TRANSITIONS.get(loan.status, set())
    if new_status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot transition from {loan.status} to {new_status}.",
        )

    # Release the copy when rejected or returned
    if new_status in (LoanStatus.REJECTED, LoanStatus.RETURNED):
        copy_res = await session.exec(select(Copy).where(Copy.id == loan.copy_id))
        copy = copy_res.first()
        if copy:
            copy.status = CopyStatus.AVAILABLE
            session.add(copy)

    if new_status == LoanStatus.ACTIVE:
        loan.due_date = datetime.utcnow() + timedelta(days=14)
    loan.status = new_status
    loan.updated_at = datetime.utcnow()
    session.add(loan)
    await session.commit()
    await session.refresh(loan)
    return loan
