from sqlalchemy import Column, Integer, Text, JSON
from pgvector.sqlalchemy import Vector

from ..database import Base


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)

    content = Column(Text, nullable=False)

    embedding = Column(Vector(384), nullable=False)

    metadata_json = Column("metadata", JSON)
