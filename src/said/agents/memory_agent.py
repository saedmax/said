"""Memory agent: persists this run's raw results into the vector store."""

from said.state import ResearchState
from said.storage.vectorstore import add_results


def memory_agent_node(state: ResearchState) -> dict:
    query = state["query"]
    run_id = state.get("run_id", "unknown")
    all_results = (
        state.get("web_results", [])
        + state.get("paper_results", [])
        + state.get("patent_results", [])
    )
    add_results(run_id, query, all_results)
    return {}
