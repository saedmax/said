"""General web search tool, backed by DuckDuckGo (free, no API key required)."""

from ddgs import DDGS


def search_web(query: str, max_results: int = 5) -> list[dict]:
    results = []
    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=max_results):
            results.append(
                {
                    "title": r.get("title"),
                    "summary": r.get("body"),
                    "url": r.get("href"),
                    "source": "web",
                }
            )
    return results
