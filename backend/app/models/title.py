from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship

class TitleBase(SQLModel):
    title: str = Field(index=True)
    author: str = Field(index=True)
    isbn: str = Field(unique=True, index=True)
    cover_url: Optional[str] = None

class TitleUpdate(SQLModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    cover_url: Optional[str] = None

class Title(TitleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    copies: List["Copy"] = Relationship(back_populates="title", cascade_delete=True)

from app.models.copy import Copy # Type hinting
