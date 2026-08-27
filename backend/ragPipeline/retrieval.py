from ..database import SessionLocal
from .models import DocumentChunk
from .embeddings import create_embedding


def search_documents(query: str, limit: int = 5):

    db = SessionLocal()

    try:
        # Convert user's question into an embedding
        query_embedding = create_embedding(query)

        # Find the most similar chunks
        results = (
            db.query(DocumentChunk)
            .order_by(
                DocumentChunk.embedding.cosine_distance(
                    query_embedding
                )
            )
            .limit(limit)
            .all()
        )

        return results

    finally:
        db.close()