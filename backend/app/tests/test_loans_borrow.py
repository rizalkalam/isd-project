import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.user import UserRole


async def get_token(email: str, role: UserRole = UserRole.STUDENT) -> str:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        await ac.post(
            "/api/v1/auth/register",
            json={"email": email, "password": "password123", "role": role},
        )
        response = await ac.post(
            "/api/v1/auth/login",
            data={"username": email, "password": "password123"},
        )
        return response.json()["access_token"]


async def create_title_with_copy(librarian_token: str, isbn: str) -> int:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        title_res = await ac.post(
            "/api/v1/titles/",
            json={"title": "Borrow Test Book", "author": "Test Author", "isbn": isbn},
            headers={"Authorization": f"Bearer {librarian_token}"},
        )
        title_id = title_res.json()["id"]
        await ac.post(
            f"/api/v1/titles/{title_id}/copies",
            json={"barcode": f"BARCODE-{isbn}"},
            headers={"Authorization": f"Bearer {librarian_token}"},
        )
        return title_id


@pytest.mark.asyncio
async def test_student_can_request_borrow():
    student_token = await get_token("borrow_student1@example.com")
    librarian_token = await get_token("borrow_lib1@example.com", UserRole.LIBRARIAN)
    title_id = await create_title_with_copy(librarian_token, "ISBN-BORROW-1")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/loans/request",
            json={"title_id": title_id},
            headers={"Authorization": f"Bearer {student_token}"},
        )

    assert response.status_code == 201
    loan = response.json()
    assert loan["status"] == "PENDING"
    assert loan["title_id"] == title_id


@pytest.mark.asyncio
async def test_borrow_unavailable_title_returns_409():
    student1_token = await get_token("borrow_s1_no_copy@example.com")
    student2_token = await get_token("borrow_s2_no_copy@example.com")
    librarian_token = await get_token("borrow_lib_no_copy@example.com", UserRole.LIBRARIAN)
    title_id = await create_title_with_copy(librarian_token, "ISBN-NOCOPY-1")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # First borrow succeeds
        r1 = await ac.post(
            "/api/v1/loans/request",
            json={"title_id": title_id},
            headers={"Authorization": f"Bearer {student1_token}"},
        )
        assert r1.status_code == 201

        # Second borrow fails — no more available copies
        r2 = await ac.post(
            "/api/v1/loans/request",
            json={"title_id": title_id},
            headers={"Authorization": f"Bearer {student2_token}"},
        )
        assert r2.status_code == 409


@pytest.mark.asyncio
async def test_double_borrow_prevented_concurrently():
    student1_token = await get_token("concurrent1@example.com")
    student2_token = await get_token("concurrent2@example.com")
    librarian_token = await get_token("concurrent_lib@example.com", UserRole.LIBRARIAN)
    title_id = await create_title_with_copy(librarian_token, "ISBN-CONCURRENT-1")

    transport = ASGITransport(app=app)

    async def borrow_request(token: str):
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            return await ac.post(
                "/api/v1/loans/request",
                json={"title_id": title_id},
                headers={"Authorization": f"Bearer {token}"},
            )

    results = await asyncio.gather(
        borrow_request(student1_token),
        borrow_request(student2_token),
        return_exceptions=True,
    )

    statuses = [r.status_code for r in results if not isinstance(r, Exception)]
    assert 201 in statuses
    assert 409 in statuses
