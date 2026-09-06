"""Semantic Scholar search tool (free, no API key required)."""

import requests

API_URL = "https://api.semanticscholar.org/graph/v1/paper/search"


def search_semantic_scholar(query: str, limit: int = 5) -> list[dict]:
    params = {
        "query": query,
        "limit": limit,
        "fields": "title,abstract,authors,year,url,externalIds",
    }
    resp = requests.get(API_URL, params=params, timeout=20)
    resp.raise_for_status()
    data = resp.json()

    results = []
    for p in data.get("data", []):
        external_ids = p.get("externalIds") or {}
        results.append(
            {
                "title": p.get("title"),
                "authors": [a.get("name") for a in p.get("authors", []) or []],
                "summary": p.get("abstract"),
                "url": p.get("url"),
                "year": p.get("year"),
                "doi": external_ids.get("DOI"),
                "source": "semantic_scholar",
            }
        )
    return results
