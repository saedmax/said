"""Google Patents search tool via SerpApi.

V1 has no free, key-less patent search API, so this tool is a stub until a
SERPAPI_API_KEY is provided. See https://serpapi.com/google-patents-api for
the underlying API this wraps.
"""

import os

import requests

SERPAPI_URL = "https://serpapi.com/search"


def search_patents(query: str, max_results: int = 5) -> list[dict]:
    api_key = os.getenv("SERPAPI_API_KEY")
    if not api_key:
        return [
            {
                "title": "Patent search not configured",
                "summary": (
                    "Set SERPAPI_API_KEY in your .env file to enable real Google "
                    "Patents search. Skipping patent search for this run."
                ),
                "url": None,
                "source": "patents_stub",
            }
        ]

    resp = requests.get(
        SERPAPI_URL,
        params={
            "engine": "google_patents",
            "q": query,
            "api_key": api_key,
            "num": max_results,
        },
        timeout=20,
    )
    resp.raise_for_status()
    data = resp.json()

    results = []
    for p in (data.get("organic_results") or [])[:max_results]:
        results.append(
            {
                "title": p.get("title"),
                "summary": p.get("snippet"),
                "url": p.get("patent_link") or p.get("link"),
                "source": "patents",
            }
        )
    return results
