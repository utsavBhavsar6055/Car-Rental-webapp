from .retrieval import search_documents


query = "How much security deposit is required?"


print("Searching for:")
print(query)

print("\nRetrieving relevant documents...\n")


results = search_documents(
    query,
    limit=5
)


for i, result in enumerate(results):

    print("=" * 60)
    print(f"RESULT {i + 1}")
    print("=" * 60)

    print(result.content)
    print()