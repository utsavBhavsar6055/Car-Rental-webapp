from docx import Document
import re


def extract_text_from_docx(file_path):

    document = Document(file_path)

    paragraphs = []

    for paragraph in document.paragraphs:

        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    return "\n".join(paragraphs)

def chunk_text(text, chunk_size=180):
    """Keep policy headings with their content for focused retrieval."""
    paragraphs = [paragraph.strip() for paragraph in text.splitlines() if paragraph.strip()]
    chunks = []
    section = []

    def add_section(values):
        words = " ".join(values).split()
        for start in range(0, len(words), chunk_size):
            chunk = " ".join(words[start:start + chunk_size]).strip()
            if chunk:
                chunks.append(chunk)

    for paragraph in paragraphs:
        if re.match(r"^\d+(?:\.\d+)*\.?\s+", paragraph) and section:
            add_section(section)
            section = []
        section.append(paragraph)

    add_section(section)
    return chunks