import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.user import UserRole

@pytest.fixture
async def librarian_token():
    # This fixture might be shared, but let's use a base function
    return await get_token("base_librarian@example.com")

async def get_token(email: str):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Register a librarian
        await ac.post(
            "/api/v1/auth/register",
            json={"email": email, "password": "password123", "role": UserRole.LIBRARIAN},
        )
        # Login
        response = await ac.post(
            "/api/v1/auth/login",
            data={"username": email, "password": "password123"},
        )
        return response.json()["access_token"]

@pytest.mark.asyncio
async def test_search_titles_by_title():
    token = await get_token("title_search@example.com")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Seed a book
        await ac.post(
            "/api/v1/titles/",
            json={
                "title": "Search Test Book",
                "author": "Author A",
                "isbn": "ISBN-SEARCH-1",
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        
        # Search by title
        response = await ac.get("/api/v1/titles/search?query=Search Test")
        
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert any(b["title"] == "Search Test Book" for b in results)

@pytest.mark.asyncio
async def test_search_titles_by_author():
    token = await get_token("author_search@example.com")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Seed a book
        await ac.post(
            "/api/v1/titles/",
            json={
                "title": "Author Test Book",
                "author": "Unique Author Name",
                "isbn": "ISBN-SEARCH-2",
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        
        # Search by author
        response = await ac.get("/api/v1/titles/search?query=Unique Author")
        
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert any(b["author"] == "Unique Author Name" for b in results)

@pytest.mark.asyncio
async def test_search_titles_availability():
    token = await get_token("avail_search@example.com")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Create a title
        title_res = await ac.post(
            "/api/v1/titles/",
            json={
                "title": "Availability Test Book",
                "author": "Author B",
                "isbn": "ISBN-SEARCH-3",
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        title_id = title_res.json()["id"]

        # Add 2 copies
        await ac.post(
            f"/api/v1/titles/{title_id}/copies",
            json={"barcode": "BARCODE-S1"},
            headers={"Authorization": f"Bearer {token}"}
        )
        await ac.post(
            f"/api/v1/titles/{title_id}/copies",
            json={"barcode": "BARCODE-S2"},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        # Search and check availability
        response = await ac.get("/api/v1/titles/search?query=Availability Test")
        
    assert response.status_code == 200
    results = response.json()
    book = next(b for b in results if b["id"] == title_id)
    assert book["available_copies"] == 2
