import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_register():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/auth/register",
            json={"email": "test@example.com", "password": "password123", "role": "STUDENT"},
        )
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_login():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # First register
        await ac.post(
            "/api/v1/auth/register",
            json={"email": "test2@example.com", "password": "password123", "role": "STUDENT"},
        )
        # Then login
        response = await ac.post(
            "/api/v1/auth/login",
            data={"username": "test2@example.com", "password": "password123"},
        )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "refresh_token" in response.cookies
