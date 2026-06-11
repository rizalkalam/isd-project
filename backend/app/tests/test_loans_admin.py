import pytest
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


async def setup_pending_loan(student_email: str, lib_email: str, isbn: str):
    """Create a title with one copy and a pending loan. Returns (loan_id, lib_token, title_id)."""
    librarian_token = await get_token(lib_email, UserRole.LIBRARIAN)
    student_token = await get_token(student_email)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        title_res = await ac.post(
            "/api/v1/titles/",
            json={"title": "Admin Test Book", "author": "Admin Author", "isbn": isbn},
            headers={"Authorization": f"Bearer {librarian_token}"},
        )
        title_id = title_res.json()["id"]

        await ac.post(
            f"/api/v1/titles/{title_id}/copies",
            json={"barcode": f"BARCODE-ADMIN-{isbn}"},
            headers={"Authorization": f"Bearer {librarian_token}"},
        )

        loan_res = await ac.post(
            "/api/v1/loans/request",
            json={"title_id": title_id},
            headers={"Authorization": f"Bearer {student_token}"},
        )
        assert loan_res.status_code == 201
        return loan_res.json()["id"], librarian_token, title_id


@pytest.mark.asyncio
async def test_librarian_can_approve_loan():
    loan_id, librarian_token, _ = await setup_pending_loan(
        "admin_student1@example.com", "admin_lib1@example.com", "ISBN-ADMIN-1"
    )
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.put(
            f"/api/v1/loans/{loan_id}/status",
            json={"status": "APPROVED"},
            headers={"Authorization": f"Bearer {librarian_token}"},
        )
    assert response.status_code == 200
    assert response.json()["status"] == "APPROVED"


@pytest.mark.asyncio
async def test_librarian_can_reject_loan():
    loan_id, librarian_token, _ = await setup_pending_loan(
        "admin_student2@example.com", "admin_lib2@example.com", "ISBN-ADMIN-2"
    )
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.put(
            f"/api/v1/loans/{loan_id}/status",
            json={"status": "REJECTED"},
            headers={"Authorization": f"Bearer {librarian_token}"},
        )
    assert response.status_code == 200
    assert response.json()["status"] == "REJECTED"


@pytest.mark.asyncio
async def test_librarian_can_mark_returned():
    loan_id, librarian_token, _ = await setup_pending_loan(
        "admin_student3@example.com", "admin_lib3@example.com", "ISBN-ADMIN-3"
    )
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        await ac.put(
            f"/api/v1/loans/{loan_id}/status",
            json={"status": "APPROVED"},
            headers={"Authorization": f"Bearer {librarian_token}"},
        )
        await ac.put(
            f"/api/v1/loans/{loan_id}/status",
            json={"status": "ACTIVE"},
            headers={"Authorization": f"Bearer {librarian_token}"},
        )
        response = await ac.put(
            f"/api/v1/loans/{loan_id}/status",
            json={"status": "RETURNED"},
            headers={"Authorization": f"Bearer {librarian_token}"},
        )
    assert response.status_code == 200
    assert response.json()["status"] == "RETURNED"


@pytest.mark.asyncio
async def test_availability_restores_after_return():
    loan_id, librarian_token, title_id = await setup_pending_loan(
        "admin_student4@example.com", "admin_lib4@example.com", "ISBN-ADMIN-4"
    )
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Verify copy is unavailable while loan is pending
        search_res = await ac.get("/api/v1/titles/search?query=ISBN-ADMIN-4")
        books = search_res.json()
        book = next((b for b in books if b["id"] == title_id), None)
        assert book is not None
        assert book["available_copies"] == 0

        # Full lifecycle
        await ac.put(f"/api/v1/loans/{loan_id}/status", json={"status": "APPROVED"}, headers={"Authorization": f"Bearer {librarian_token}"})
        await ac.put(f"/api/v1/loans/{loan_id}/status", json={"status": "ACTIVE"}, headers={"Authorization": f"Bearer {librarian_token}"})
        await ac.put(f"/api/v1/loans/{loan_id}/status", json={"status": "RETURNED"}, headers={"Authorization": f"Bearer {librarian_token}"})

        # Verify copy is available again
        search_res = await ac.get("/api/v1/titles/search?query=ISBN-ADMIN-4")
        books = search_res.json()
        book = next((b for b in books if b["id"] == title_id), None)
        assert book is not None
        assert book["available_copies"] == 1


@pytest.mark.asyncio
async def test_student_cannot_update_loan_status():
    loan_id, _, _ = await setup_pending_loan(
        "unauth_student@example.com", "unauth_lib@example.com", "ISBN-UNAUTH-1"
    )
    student_token = await get_token("unauth_student_login@example.com", UserRole.STUDENT)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.put(
            f"/api/v1/loans/{loan_id}/status",
            json={"status": "APPROVED"},
            headers={"Authorization": f"Bearer {student_token}"},
        )
    assert response.status_code == 403
