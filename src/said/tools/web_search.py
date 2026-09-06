"""General web search tool, backed by DuckDuckGo (free, no API key required)."""

from ddgs import DDGS


def search_web(query: str, max_results: int = 5, region: str = "us-en") -> list[dict]:
    """Search the web. `region` pins the language/locale (e.g. "us-en", "cn-zh",
    "sa-ar") so results don't silently depend on the machine's own network
    location."""
    results = []
    with DDGS() as ddgs:
        for r in ddgs.text(query, region=region, max_results=max_results):
            results.append(
                {
                    "title": r.get("title"),
                    "summary": r.get("body"),
                    "url": r.get("href"),
                    "source": "web",
                }
            )
    return results
