import pytest
from httpx import AsyncClient
from app.main import app
from app.models.user import UserRole

@pytest.fixture
async def librarian_token():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Register a librarian
        await ac.post(
            "/api/v1/auth/register",
            json={"email": "librarian@example.com", "password": "password123", "role": UserRole.LIBRARIAN},
        )
        # Login
        response = await ac.post(
            "/api/v1/auth/login",
            data={"username": "librarian@example.com", "password": "password123"},
        )
        return response.json()["access_token"]

@pytest.fixture
async def student_token():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Register a student
        await ac.post(
            "/api/v1/auth/register",
            json={"email": "student@example.com", "password": "password123", "role": UserRole.STUDENT},
        )
        # Login
        response = await ac.post(
            "/api/v1/auth/login",
            data={"username": "student@example.com", "password": "password123"},
        )
        return response.json()["access_token"]

@pytest.mark.asyncio
async def test_create_title_librarian(librarian_token):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/titles/",
            json={
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "isbn": "9780743273565",
                "cover_url": "https://example.com/gatsby.jpg"
            },
            headers={"Authorization": f"Bearer {librarian_token}"}
        )
    assert response.status_code == 201
    assert response.json()["title"] == "The Great Gatsby"
    assert response.json()["isbn"] == "9780743273565"

@pytest.mark.asyncio
async def test_create_title_student_denied(student_token):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/titles/",
            json={
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "isbn": "9780743273565",
            },
            headers={"Authorization": f"Bearer {student_token}"}
        )
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_get_titles():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/titles/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_add_copy_librarian(librarian_token):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Create a title first
        title_res = await ac.post(
            "/api/v1/titles/",
            json={
                "title": "1984",
                "author": "George Orwell",
                "isbn": "9780451524935",
            },
            headers={"Authorization": f"Bearer {librarian_token}"}
        )
        title_id = title_res.json()["id"]

        # Add a copy
        response = await ac.post(
            f"/api/v1/titles/{title_id}/copies",
            json={"barcode": "123456789"},
            headers={"Authorization": f"Bearer {librarian_token}"}
        )
    assert response.status_code == 201
    assert response.json()["barcode"] == "123456789"
    assert response.json()["title_id"] == title_id
    assert response.json()["status"] == "AVAILABLE"
