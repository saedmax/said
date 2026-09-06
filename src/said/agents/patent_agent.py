"""Patent agent."""

from said.state import ResearchState
from said.tools.patents import search_patents


def patent_agent_node(state: ResearchState) -> dict:
    try:
        results = search_patents(state["query"])
    except Exception as e:
        results = [{"title": "patent search failed", "summary": str(e), "source": "error"}]
    return {"patent_results": results}
