"""
MongoDB Database Service for Scheme Sathi (SIH PS 26092).
Provides enterprise connection management, automated schema indexing,
data seeding/migration from JSON archives, and live cluster health monitoring.
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logger = logging.getLogger("scheme_sathi.db")

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017/scheme_sathi_sih")
DB_NAME = os.environ.get("MONGO_DB_NAME", "scheme_sathi_sih")


def mongo_to_dict(doc: Any) -> Any:
    """Recursively converts MongoDB BSON types (ObjectId, datetime) to standard JSON-serializable Python types."""
    if isinstance(doc, list):
        return [mongo_to_dict(item) for item in doc]
    elif isinstance(doc, dict):
        res = {}
        for k, v in doc.items():
            if k == "_id" and isinstance(v, ObjectId):
                continue
            res[k] = mongo_to_dict(v)
        return res
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()
    return doc


class DatabaseService:
    _instance: Optional["DatabaseService"] = None

    def __init__(self):
        self.uri = MONGO_URI
        self.client: Optional[MongoClient] = None
        self.db = None
        self.is_connected = False
        self._connect()

    @classmethod
    def get_instance(cls) -> "DatabaseService":
        if cls._instance is None:
            cls._instance = DatabaseService()
        return cls._instance

    def _connect(self):
        try:
            self.client = MongoClient(
                self.uri,
                serverSelectionTimeoutMS=2500,
                connectTimeoutMS=2500,
                socketTimeoutMS=2500
            )
            # Verify connectivity with a quick ping
            self.client.admin.command("ping")
            self.db = self.client[DB_NAME]
            self.is_connected = True
            logger.info(f"MongoDB successfully connected to: {self.uri} [DB: {DB_NAME}]")
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            self.is_connected = False
            self.db = None
            logger.warning(f"MongoDB connection failed: {e}. Falling back to atomic JSON persistence.")

    def check_connection(self) -> bool:
        if not self.client:
            self._connect()
        try:
            if self.client:
                self.client.admin.command("ping")
                self.is_connected = True
                return True
        except Exception:
            self.is_connected = False
        return False

    @property
    def users(self):
        return self.db["users"] if self.is_connected and self.db is not None else None

    @property
    def schemes(self):
        return self.db["schemes"] if self.is_connected and self.db is not None else None

    @property
    def applications(self):
        return self.db["applications"] if self.is_connected and self.db is not None else None

    @property
    def partners(self):
        return self.db["partners"] if self.is_connected and self.db is not None else None

    @property
    def aadhaar_registry(self):
        return self.db["aadhaar_registry"] if self.is_connected and self.db is not None else None

    @property
    def predictions(self):
        return self.db["predictions"] if self.is_connected and self.db is not None else None

    def _safe_create_index(self, collection, keys, **kwargs):
        if collection is None:
            return
        try:
            collection.create_index(keys, **kwargs)
        except Exception as e:
            logger.debug(f"Index creation skipped on {collection.name}: {e}")

    def init_and_seed(self):
        """
        Seeds MongoDB collections with statutory government schemes,
        channel partners, default users, and previous applications from JSON archives.
        """
        if not self.check_connection() or self.db is None:
            logger.warning("MongoDB unavailable for seeding. Local JSON files will be used.")
            return False

        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        data_dir = os.path.join(base_dir, "data")

        try:
            # Safe indexing
            self._safe_create_index(self.users, "id", sparse=True)
            self._safe_create_index(self.users, "phone_number", sparse=True)
            self._safe_create_index(self.users, "email", sparse=True)

            self._safe_create_index(self.schemes, "id", sparse=True)
            self._safe_create_index(self.applications, "registration_id", sparse=True)
            self._safe_create_index(self.partners, "id", sparse=True)
            self._safe_create_index(self.aadhaar_registry, "aadhaar_number", sparse=True)

            # Clean up any bad scheme records without code
            self.schemes.delete_many({"code": None})

            # 1. Seed / Upsert Schemes (15 statutory programs)
            schemes_file = os.path.join(data_dir, "government_schemes.json")
            if os.path.exists(schemes_file):
                with open(schemes_file, "r", encoding="utf-8") as f:
                    schemes_data = json.load(f)
                for s in schemes_data:
                    s_id = s.get("id", "")
                    code = s.get("code") or f"NSFDC-{s_id.upper()}"
                    s["code"] = code
                    self.schemes.update_one({"code": code}, {"$set": s}, upsert=True)

            # 2. Seed / Upsert Channel Partners
            partners_file = os.path.join(data_dir, "channel_partners.json")
            if os.path.exists(partners_file):
                with open(partners_file, "r", encoding="utf-8") as f:
                    partners_data = json.load(f)
                for p in partners_data:
                    p_id = p.get("id")
                    if p_id:
                        self.partners.update_one({"id": p_id}, {"$set": p}, upsert=True)

            # 3. Seed / Upsert Users
            users_file = os.path.join(data_dir, "users.json")
            if os.path.exists(users_file):
                with open(users_file, "r", encoding="utf-8") as f:
                    users_data = json.load(f)
                for u in users_data:
                    query = {}
                    if u.get("email"):
                        query["email"] = u["email"]
                    elif u.get("phone_number"):
                        query["phone_number"] = u["phone_number"]
                    elif u.get("id"):
                        query["id"] = u["id"]
                    if query:
                        self.users.update_one(query, {"$set": u}, upsert=True)

            # 4. Seed / Upsert Applications
            apps_file = os.path.join(data_dir, "registered_applications.json")
            if os.path.exists(apps_file):
                with open(apps_file, "r", encoding="utf-8") as f:
                    apps_data = json.load(f)
                for a in apps_data:
                    ref_id = a.get("registration_id")
                    if ref_id:
                        self.applications.update_one({"registration_id": ref_id}, {"$set": a}, upsert=True)

            # 5. Seed / Upsert Aadhaar Registry
            aadhaar_file = os.path.join(data_dir, "aadhaar_registry.json")
            if os.path.exists(aadhaar_file):
                with open(aadhaar_file, "r", encoding="utf-8") as f:
                    aadhaar_data = json.load(f)
                for rec in aadhaar_data:
                    a_num = rec.get("aadhaar_number")
                    if a_num:
                        self.aadhaar_registry.update_one({"aadhaar_number": a_num}, {"$set": rec}, upsert=True)

            return True
        except Exception as e:
            logger.error(f"Error seeding MongoDB: {e}")
            return False

    def get_stats(self) -> Dict[str, Any]:
        """Returns live MongoDB cluster statistics and collection document counts."""
        if not self.check_connection() or self.db is None:
            return {
                "connected": False,
                "engine": "JSON Fallback (MongoDB Offline)",
                "database": DB_NAME,
                "counts": {}
            }

        try:
            return {
                "connected": True,
                "engine": "MongoDB (Direct Native Driver)",
                "database": DB_NAME,
                "uri": self.uri.split("@")[-1] if "@" in self.uri else self.uri,
                "collections": self.db.list_collection_names(),
                "counts": {
                    "users": self.users.count_documents({}),
                    "schemes": self.schemes.count_documents({}),
                    "applications": self.applications.count_documents({}),
                    "partners": self.partners.count_documents({}),
                    "aadhaar_registry": self.aadhaar_registry.count_documents({}),
                    "predictions": self.predictions.count_documents({}) if self.predictions is not None else 0
                }
            }
        except Exception as e:
            return {
                "connected": False,
                "engine": "Error querying MongoDB stats",
                "error": str(e)
            }


# Singleton accessor
db_service = DatabaseService.get_instance()
