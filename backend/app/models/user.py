from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel

class UserRole(str, Enum):
    STUDENT = "STUDENT"
    LIBRARIAN = "LIBRARIAN"

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    role: UserRole = Field(default=UserRole.STUDENT)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
