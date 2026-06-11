from enum import Enum
from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel


class LoanStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    ACTIVE = "ACTIVE"
    RETURNED = "RETURNED"


class LoanBase(SQLModel):
    copy_id: int = Field(foreign_key="copy.id")
    title_id: int = Field(foreign_key="title.id")
    user_id: int = Field(foreign_key="user.id")
    status: LoanStatus = Field(default=LoanStatus.PENDING)


class LoanCreate(SQLModel):
    title_id: int


class LoanStatusUpdate(SQLModel):
    status: LoanStatus


class LoanRead(LoanBase):
    id: int
    created_at: datetime
    updated_at: datetime
    due_date: Optional[datetime] = None


class LoanReadWithDetails(SQLModel):
    id: int
    copy_id: int
    title_id: int
    user_id: int
    status: LoanStatus
    created_at: datetime
    updated_at: datetime
    book_title: str
    book_author: str
    student_email: str
    due_date: Optional[datetime] = None


class Loan(LoanBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    due_date: Optional[datetime] = Field(default=None)
