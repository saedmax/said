"""Chroma-backed vector store for semantic recall across research runs.

Every result gathered by the web/papers/patent agents gets embedded and
stored here after a run completes, tagged with the query that produced it.
Future runs query this store first so the evidence agent can build on
prior research instead of starting from zero each time.
"""

import os
from pathlib import Path
from typing import Iterable

os.environ.setdefault("ANONYMIZED_TELEMETRY", "False")

import chromadb  # noqa: E402
from chromadb.config import Settings  # noqa: E402

VECTOR_DB_PATH = Path.cwd() / "data" / "chroma"
COLLECTION_NAME = "research_results"

_client = None
_collection = None


def reset() -> None:
    """Drop the cached client/collection so a new VECTOR_DB_PATH takes effect."""
    global _client, _collection
    _client = None
    _collection = None


def _get_collection():
    global _client, _collection
    if _collection is None:
        VECTOR_DB_PATH.mkdir(parents=True, exist_ok=True)
        _client = chromadb.PersistentClient(
            path=str(VECTOR_DB_PATH),
            settings=Settings(anonymized_telemetry=False),
        )
        _collection = _client.get_or_create_collection(COLLECTION_NAME)
    return _collection


def _doc_text(result: dict) -> str:
    title = result.get("title") or ""
    summary = result.get("summary") or ""
    return f"{title}\n{summary}".strip()


def add_results(run_id: str, query: str, results: Iterable[dict]) -> None:
    collection = _get_collection()
    docs, ids, metadatas = [], [], []
    for i, r in enumerate(results):
        text = _doc_text(r)
        if not text:
            continue
        docs.append(text)
        ids.append(f"{run_id}-{i}")
        metadatas.append(
            {
                "run_id": run_id,
                "query": query,
                "title": r.get("title") or "",
                "url": r.get("url") or "",
                "source": r.get("source") or "",
            }
        )
    if docs:
        collection.add(documents=docs, ids=ids, metadatas=metadatas)


def query_similar(query: str, n_results: int = 5) -> list[dict]:
    collection = _get_collection()
    count = collection.count()
    if count == 0:
        return []

    result = collection.query(query_texts=[query], n_results=min(n_results, count))
    matches = []
    for doc, meta, dist in zip(
        result["documents"][0], result["metadatas"][0], result["distances"][0]
    ):
        matches.append({"text": doc, "metadata": meta, "distance": dist})
    return matches
