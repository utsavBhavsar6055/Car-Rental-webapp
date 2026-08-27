from pathlib import Path

from .chunking import extract_text_from_docx, chunk_text


file_path = (
    Path(__file__).resolve().parent.parent
    / "documents"
    / "Car_Rental_RAG_Knowledge_Base (1).docx"
)

text = extract_text_from_docx(file_path)

print("Text length:", len(text))

chunks = chunk_text(text)

print("Number of chunks:", len(chunks))

for i, chunk in enumerate(chunks[:3]):

    print("\n================")
    print("CHUNK", i + 1)
    print("================")

    print(chunk[:500])
    