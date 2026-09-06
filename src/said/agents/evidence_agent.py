"""Evidence/verification agent: dedupes and sanity-checks raw results."""

from said.formatting import format_results
from said.llm import extract_text, get_llm
from said.state import ResearchState

EVIDENCE_PROMPT = """You are an evidence verification agent for a scientific research assistant.
You are given raw search results from the web, academic papers, and patents about a research query.

Your job:
1. Remove duplicate or near-duplicate items.
2. Flag any results that look irrelevant, low-quality, or contradictory.
3. Produce a clean, deduplicated evidence list grouped by source type (web / papers / patents),
   with a one-line note on reliability for each item.

Query: {query}

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
        web=format_results(state.get("web_results", [])),
        papers=format_results(state.get("paper_results", [])),
        patents=format_results(state.get("patent_results", [])),
    )
    response = llm.invoke(prompt)
    return {"evidence": extract_text(response)}
