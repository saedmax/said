"""arXiv search tool."""

import arxiv


def search_arxiv(query: str, max_results: int = 5) -> list[dict]:
    client = arxiv.Client()
    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.Relevance,
    )
    results = []
    for r in client.results(search):
        results.append(
            {
                "title": r.title,
                "authors": [a.name for a in r.authors],
                "summary": r.summary,
                "url": r.entry_id,
                "published": str(r.published.date()) if r.published else None,
                "source": "arxiv",
            }
        )
    return results
