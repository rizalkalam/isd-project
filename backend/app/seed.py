import asyncio
from sqlmodel import SQLModel, select
from app.db.session import engine, AsyncSession
from app.models.user import User, UserRole
from app.models.title import Title
from app.models.copy import Copy, CopyStatus
from app.models.loan import Loan  # ensure Loan table is created
from app.core.security import get_password_hash

async def init_db():
    async with engine.begin() as conn:
        # Create tables
        await conn.run_sync(SQLModel.metadata.create_all)

async def seed_data():
    async with AsyncSession(engine) as session:
        # Check if users already exist
        result = await session.exec(select(User).limit(1))
        if result.first():
            print("Database already seeded.")
            return

        print("Seeding database...")

        # Create Users
        librarian = User(
            email="admin@lms.com",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.LIBRARIAN
        )
        student = User(
            email="student@lms.com",
            hashed_password=get_password_hash("student123"),
            role=UserRole.STUDENT
        )
        session.add(librarian)
        session.add(student)

        # Create Titles
        titles = [
            Title(
                title="The Great Gatsby",
                author="F. Scott Fitzgerald",
                isbn="9780743273565",
                cover_url="https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg"
            ),
            Title(
                title="1984",
                author="George Orwell",
                isbn="9780451524935",
                cover_url="https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg"
            ),
            Title(
                title="To Kill a Mockingbird",
                author="Harper Lee",
                isbn="9780061120084",
                cover_url="https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg"
            )
        ]
        for t in titles:
            session.add(t)
        
        await session.flush() # Get IDs

        # Create Copies for each title
        for t in titles:
            for i in range(1, 4):
                copy = Copy(
                    title_id=t.id,
                    barcode=f"{t.isbn}-{i}",
                    status=CopyStatus.AVAILABLE
                )
                session.add(copy)

        await session.commit()
        print("Database seeded successfully.")

async def main():
    await init_db()
    await seed_data()

if __name__ == "__main__":
    asyncio.run(main())
