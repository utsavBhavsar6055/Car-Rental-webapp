# 🚗 AI Car Rental Assistant

An AI-powered car rental web application with a **Retrieval-Augmented Generation (RAG)** pipeline that provides context-aware answers about rental policies, pricing, insurance, mileage, driver requirements, deposits, pickup/return rules, and cancellations.

The application combines a conversational AI chatbot with **semantic document retrieval using embeddings and PostgreSQL + pgvector**. Instead of relying only on the LLM's internal knowledge, the system retrieves relevant information from the car rental knowledge base and provides that context to the LLM before generating a response.

---

## ✨ Features

### 🤖 AI Chatbot

- Conversational AI assistant for car rental queries
- Context-aware responses
- Natural language question answering
- Designed to answer questions using the rental policy knowledge base
- Reduces hallucinations by grounding responses in retrieved information

### 🧠 Retrieval-Augmented Generation (RAG)

- DOCX-based knowledge ingestion
- Automatic document text extraction
- Document chunking
- Embedding generation
- Vector storage using PostgreSQL + pgvector
- Semantic similarity search
- Retrieval of the most relevant document chunks
- Retrieved context passed to the LLM

### 🚘 Car Rental Information

The knowledge base covers:

- Daily, weekly, and monthly rental rates
- Mileage limits
- Additional mileage charges
- Additional driver fees
- Young driver surcharge
- Child seat fees
- Collision Damage Waiver (CDW)
- Insurance and protection plans
- Third-party liability coverage
- Roadside assistance
- Driver age requirements
- Required rental documents
- Security deposits
- Credit-card pre-authorizations
- Fuel policies
- Late return policies
- Cross-border travel restrictions
- Cancellation policies
- No-show fees
- Refund processing

### 🔐 Authentication

- JWT-based authentication
- Secure user authentication
- Protected API endpoints

### 🗄️ Database

- PostgreSQL relational database
- SQLAlchemy ORM
- pgvector extension for vector similarity search
- Stores document chunks and embeddings

---

# 🧠 RAG Architecture

The RAG pipeline works as follows:

```text
                    USER
                     │
                     ▼
              Chatbot / React
                     │
                     ▼
                  FastAPI
                     │
                     ▼
              User Question
                     │
                     ▼
            Embedding Model
                     │
                     ▼
           Query Vector
                     │
                     ▼
        PostgreSQL + pgvector
                     │
                     ▼
          Similarity Search
                     │
                     ▼
          Relevant Document
                Chunks
                     │
                     ▼
              Retrieved
               Context
                     │
                     ▼
                  LLM
                     │
                     ▼
             Final Response
