from pathlib import Path

from ..database import SessionLocal
from .models import DocumentChunk
from .chunking import (
    extract_text_from_docx,
    chunk_text
)
from .embeddings import create_embedding


# DOCX location:
# backend/documents/Car_Rental_RAG_Knowledge_Base (1).docx

FILE_PATH = (
    Path(__file__).resolve().parent.parent
    / "documents"
    / "Car_Rental_RAG_Knowledge_Base (1).docx"
)


def ingest_document():

    print("Starting document ingestion...")

    # Check whether document exists
    if not FILE_PATH.exists():
        print(f"ERROR: Document not found:")
        print(FILE_PATH)
        return

    print(f"Document found: {FILE_PATH}")

    db = SessionLocal()

    try:

        # -----------------------------------
        # 1. Extract text from DOCX
        # -----------------------------------

        text = extract_text_from_docx(FILE_PATH)

        print("Document text extracted successfully.")
        print(f"Text length: {len(text)} characters")

        # -----------------------------------
        # 2. Split text into chunks
        # -----------------------------------

        chunks = chunk_text(text)

        print(f"Total chunks created: {len(chunks)}")

        # Re-ingestion must replace stale chunks rather than duplicate them.
        db.query(DocumentChunk).delete()

        # -----------------------------------
        # 3. Create embeddings
        # 4. Store chunks + embeddings
        # -----------------------------------

        for index, chunk in enumerate(chunks):

            print(
                f"Processing chunk "
                f"{index + 1}/{len(chunks)}"
            )

            # Generate embedding
            embedding = create_embedding(chunk)

            # Create database record
            document_chunk = DocumentChunk(
                content=chunk,
                embedding=embedding,
                metadata_json={
                    "source": "car_rental_policy",
                    "chunk_index": index
                }
            )

            db.add(document_chunk)

        # -----------------------------------
        # 5. Save everything
        # -----------------------------------

        db.commit()

        print()
        print("====================================")
        print("DOCUMENT INGESTION SUCCESSFUL")
        print("====================================")
        print(f"Total chunks stored: {len(chunks)}")

    except Exception as e:

        db.rollback()

        print()
        print("====================================")
        print("INGESTION FAILED")
        print("====================================")
        print(f"Error: {e}")

    finally:

        db.close()


if __name__ == "__main__":
    ingest_document()