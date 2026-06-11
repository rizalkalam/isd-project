from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select, or_, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import get_session
from app.api import deps
from app.models.title import Title, TitleBase, TitleUpdate, TitleReadWithAvailability
from app.models.copy import Copy, CopyCreate, CopyStatus
from app.models.user import UserRole

router = APIRouter()

@router.get("/search", response_model=List[TitleReadWithAvailability])
async def search_titles(
    *,
    session: AsyncSession = Depends(get_session),
    query: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    if not query:
        statement = select(Title).offset(skip).limit(limit)
    else:
        # Search by title, author, or isbn
        search_filter = or_(
            Title.title.ilike(f"%{query}%"),
            Title.author.ilike(f"%{query}%"),
            Title.isbn.ilike(f"%{query}%"),
        )
        statement = select(Title).where(search_filter).offset(skip).limit(limit)
    
    result = await session.exec(statement)
    titles = result.all()
    
    # Enrich with availability
    # In a real system, we'd subtract active loans.
    # For now, we count copies with status AVAILABLE.
    enriched_titles = []
    for title in titles:
        # Count available copies
        copies_statement = select(func.count()).select_from(Copy).where(
            Copy.title_id == title.id,
            Copy.status == CopyStatus.AVAILABLE
        )
        count_result = await session.exec(copies_statement)
        available_count = count_result.one()
        
        enriched_titles.append(
            TitleReadWithAvailability(
                **title.dict(),
                available_copies=available_count
            )
        )
        
    return enriched_titles

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

@router.put("/{title_id}", response_model=Title)
async def update_title(
    *,
    session: AsyncSession = Depends(get_session),
    title_id: int,
    title_in: TitleUpdate,
    current_user = Depends(deps.check_role(UserRole.LIBRARIAN)),
):
    result = await session.exec(select(Title).where(Title.id == title_id))
    title = result.first()
    if not title:
        raise HTTPException(status_code=404, detail="Title not found")
    
    if title_in.isbn is not None and title_in.isbn != title.isbn:
        # Check if new ISBN already exists
        result = await session.exec(select(Title).where(Title.isbn == title_in.isbn))
        existing_title = result.first()
        if existing_title:
            raise HTTPException(
                status_code=400,
                detail="A book with this ISBN already exists.",
            )
            
    title_data = title_in.dict(exclude_unset=True)
    for key, value in title_data.items():
        setattr(title, key, value)
        
    session.add(title)
    await session.commit()
    await session.refresh(title)
    return title

@router.delete("/{title_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_title(
    *,
    session: AsyncSession = Depends(get_session),
    title_id: int,
    current_user = Depends(deps.check_role(UserRole.LIBRARIAN)),
):
    result = await session.exec(select(Title).where(Title.id == title_id))
    title = result.first()
    if not title:
        raise HTTPException(status_code=404, detail="Title not found")
        
    await session.delete(title)
    await session.commit()
    return None

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
