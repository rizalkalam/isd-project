from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship

class CopyStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    BORROWED = "BORROWED"
    LOST = "LOST"

class CopyBase(SQLModel):
    title_id: int = Field(foreign_key="title.id")
    status: CopyStatus = Field(default=CopyStatus.AVAILABLE)
    barcode: str = Field(unique=True, index=True)

class CopyCreate(SQLModel):
    barcode: str

class Copy(CopyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    title: "Title" = Relationship(back_populates="copies")

from app.models.title import Title # Type hinting
