import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class FirebaseService:
    def __init__(self):
        self.db = None
        self.initialize_firebase()
    
    def initialize_firebase(self):
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred, {
                    'projectId': settings.FIREBASE_PROJECT_ID,
                })
            
            self.db = firestore.client()
            logger.info("Firebase initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {e}")
            raise
    
    def get_collection(self, collection_name: str):
        """Get a Firestore collection reference"""
        return self.db.collection(collection_name)
    
    def add_document(self, collection_name: str, data: dict):
        """Add a document to a collection"""
        try:
            doc_ref = self.db.collection(collection_name).add(data)
            return doc_ref[1].id
        except Exception as e:
            logger.error(f"Error adding document: {e}")
            raise
    
    def get_document(self, collection_name: str, doc_id: str):
        """Get a document by ID"""
        try:
            doc = self.db.collection(collection_name).document(doc_id).get()
            if doc.exists:
                return {"id": doc.id, **doc.to_dict()}
            return None
        except Exception as e:
            logger.error(f"Error getting document: {e}")
            raise
    
    def get_all_documents(self, collection_name: str):
        """Get all documents from a collection"""
        try:
            docs = self.db.collection(collection_name).stream()
            return [{"id": doc.id, **doc.to_dict()} for doc in docs]
        except Exception as e:
            logger.error(f"Error getting documents: {e}")
            raise
    
    def update_document(self, collection_name: str, doc_id: str, data: dict):
        """Update a document"""
        try:
            self.db.collection(collection_name).document(doc_id).update(data)
            return True
        except Exception as e:
            logger.error(f"Error updating document: {e}")
            raise
    
    def delete_document(self, collection_name: str, doc_id: str):
        """Delete a document"""
        try:
            self.db.collection(collection_name).document(doc_id).delete()
            return True
        except Exception as e:
            logger.error(f"Error deleting document: {e}")
            raise

firebase_service = FirebaseService()
