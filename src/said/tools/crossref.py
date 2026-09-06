"""Crossref search tool (free, no API key required)."""

import requests

API_URL = "https://api.crossref.org/works"


def search_crossref(query: str, rows: int = 5) -> list[dict]:
    params = {"query": query, "rows": rows}
    resp = requests.get(API_URL, params=params, timeout=20)
    resp.raise_for_status()
    items = resp.json().get("message", {}).get("items", [])

    results = []
    for it in items:
        title_list = it.get("title") or [None]
        date_parts = (
            (it.get("published-print") or it.get("published-online") or {})
            .get("date-parts", [[None]])
        )
        results.append(
            {
                "title": title_list[0],
                "authors": [
                    f"{a.get('given', '')} {a.get('family', '')}".strip()
                    for a in it.get("author", []) or []
                ],
                "doi": it.get("DOI"),
                "url": it.get("URL"),
                "year": date_parts[0][0] if date_parts and date_parts[0] else None,
                "source": "crossref",
            }
        )
    return results
