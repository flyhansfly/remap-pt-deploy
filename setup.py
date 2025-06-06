from setuptools import setup, find_packages

setup(
    name="remap-pt-backend",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi[all]==0.109.2",
        "uvicorn==0.27.1",
        "gunicorn==21.2.0",
        "pydantic==2.11.4",
        "pydantic-settings==2.1.0",
        "python-dotenv==1.0.1",
        "python-dateutil==2.9.0.post0",
        "python-multipart==0.0.9",
        "openai==1.79.0",
        "requests==2.32.3",
        "langchain==0.2.17",
        "langchain-openai==0.1.25",
        "langchain-community==0.2.19",
        "passlib[bcrypt]==1.7.4",
        "python-jose[cryptography]==3.4.0",
        "databases[postgresql]==0.9.0",
        "asyncpg==0.30.0",
        "SQLAlchemy==2.0.41",
        "alembic==1.13.1",
        "redis==5.0.1",
        "uuid==1.30",
        "typing-extensions==4.13.2",
        "aiohttp==3.11.18",
    ],
) 