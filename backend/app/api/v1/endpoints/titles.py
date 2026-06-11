from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import get_session
from app.api import deps
from app.models.title import Title, TitleBase
from app.models.copy import Copy, CopyCreate, CopyStatus
from app.models.user import UserRole

router = APIRouter()

@router.get("/", response_model=List[Title])
async def get_titles(
    session: AsyncSession = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
):
    result = await session.exec(select(Title).offset(skip).limit(limit))
    titles = result.all()
    return titles

@router.post("/", response_model=Title, status_code=status.HTTP_201_CREATED)
async def create_title(
    *,
    session: AsyncSession = Depends(get_session),
    title_in: TitleBase,
    current_user = Depends(deps.check_role(UserRole.LIBRARIAN)),
):
    # Check if ISBN already exists
    result = await session.exec(select(Title).where(Title.isbn == title_in.isbn))
    existing_title = result.first()
    if existing_title:
        raise HTTPException(
            status_code=400,
            detail="A book with this ISBN already exists.",
        )
    
    db_obj = Title.from_orm(title_in)
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

@router.post("/{title_id}/copies", response_model=Copy, status_code=status.HTTP_201_CREATED)
async def add_copy(
    *,
    session: AsyncSession = Depends(get_session),
    title_id: int,
    copy_in: CopyCreate,
    current_user = Depends(deps.check_role(UserRole.LIBRARIAN)),
):
    # Check if title exists
    result = await session.exec(select(Title).where(Title.id == title_id))
    title = result.first()
    if not title:
        raise HTTPException(status_code=404, detail="Title not found")
    
    # Check if barcode already exists
    result = await session.exec(select(Copy).where(Copy.barcode == copy_in.barcode))
    existing_copy = result.first()
    if existing_copy:
        raise HTTPException(status_code=400, detail="Copy with this barcode already exists")

    db_obj = Copy(title_id=title_id, barcode=copy_in.barcode, status=CopyStatus.AVAILABLE)
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj
