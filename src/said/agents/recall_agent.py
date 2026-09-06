"""Recall agent: surfaces related evidence from prior research runs."""

import uuid

from said.state import ResearchState
from said.storage.vectorstore import query_similar


def recall_agent_node(state: ResearchState) -> dict:
    query = state["query"]
    run_id = uuid.uuid4().hex[:12]

    matches = query_similar(query, n_results=5)
    if not matches:
        prior_context = "(no related prior research found)"
    else:
        lines = []
        for m in matches:
            meta = m["metadata"]
            lines.append(
                f"- [{meta.get('source')}] {meta.get('title')} ({meta.get('url')}) "
                f"— from prior query: \"{meta.get('query')}\"\n  {m['text'][:300]}"
            )
        prior_context = "\n".join(lines)

    return {"run_id": run_id, "prior_context": prior_context}
