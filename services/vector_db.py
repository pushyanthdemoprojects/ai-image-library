import os
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

def upsert_image_embedding(image_id, embedding, caption, category, tags):
    index.upsert(vectors=[{
        "id": str(image_id),
        "values": embedding,
        "metadata": {"caption": caption, "category": category, "tags": tags},
    }])

def semantic_search(query_embedding, top_k=10):
    results = index.query(vector=query_embedding, top_k=top_k, include_metadata=True)
    return [
        {"image_id": int(m["id"]), "score": m["score"], "metadata": m["metadata"]}
        for m in results["matches"]
    ]

def get_full_results(query_embedding, db_session, top_k=10):
    from models.image import Image
    matches = semantic_search(query_embedding, top_k)
    ids_in_order = [m["image_id"] for m in matches]
    images = db_session.query(Image).filter(Image.id.in_(ids_in_order)).all()
    images_by_id = {img.id: img for img in images}
    return [images_by_id[i] for i in ids_in_order if i in images_by_id]