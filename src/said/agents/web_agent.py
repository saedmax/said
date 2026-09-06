"""Web research agent."""

from said.state import ResearchState
from said.tools.web_search import search_web


def web_agent_node(state: ResearchState) -> dict:
    try:
        results = search_web(state["query"])
    except Exception as e:
        results = [{"title": "web search failed", "summary": str(e), "source": "error"}]
    return {"web_results": results}
