"""Evidence/verification agent: dedupes and sanity-checks raw results."""

from said.formatting import format_results
from said.llm import extract_text, get_llm
from said.state import ResearchState

EVIDENCE_PROMPT = """You are an evidence verification agent for a scientific research assistant.
You are given raw search results from the web, academic papers, and patents about a research query.

You are also given related findings retrieved from prior research runs stored in the system's
memory. Treat them as background context, not fresh evidence — note where they corroborate or
conflict with the new results.

Your job:
1. Remove duplicate or near-duplicate items.
2. Flag any results that look irrelevant, low-quality, or contradictory.
3. Produce a clean, deduplicated evidence list grouped by source type (web / papers / patents),
   with a one-line note on reliability for each item.
4. Add a short section noting how the new results relate to prior research (if any).

Query: {query}

Related findings from prior research runs:
{prior_context}

Web results:
{web}

Paper results:
{papers}

Patent results:
{patents}

Return your output as a well-organized markdown evidence list."""


def evidence_agent_node(state: ResearchState) -> dict:
    llm = get_llm()
    prompt = EVIDENCE_PROMPT.format(
        query=state["query"],
        prior_context=state.get("prior_context", "(none)"),
        web=format_results(state.get("web_results", [])),
        papers=format_results(state.get("paper_results", [])),
        patents=format_results(state.get("patent_results", [])),
    )
    response = llm.invoke(prompt)
    return {"evidence": extract_text(response)}
