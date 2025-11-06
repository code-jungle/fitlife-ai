from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    
    @classmethod
    def get_client(cls) -> AsyncIOMotorClient:
        if cls.client is None:
            mongo_url = os.environ['MONGO_URL']
            cls.client = AsyncIOMotorClient(mongo_url)
        return cls.client
    
    @classmethod
    def get_db(cls):
        client = cls.get_client()
        db_name = os.environ['DB_NAME']
        return client[db_name]
    
    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()
            cls.client = None

def get_database():
    return Database.get_db()
