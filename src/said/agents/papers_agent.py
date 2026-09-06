"""Scientific papers agent: queries arXiv, Semantic Scholar, and Crossref."""

from said.state import ResearchState
from said.tools.arxiv_tool import search_arxiv
from said.tools.crossref import search_crossref
from said.tools.semantic_scholar import search_semantic_scholar


def papers_agent_node(state: ResearchState) -> dict:
    query = state["query"]
    results = []
    for fn in (search_arxiv, search_semantic_scholar, search_crossref):
        try:
            results.extend(fn(query))
        except Exception as e:
            results.append(
                {"title": f"{fn.__name__} failed", "summary": str(e), "source": "error"}
            )
    return {"paper_results": results}
