"""Report generator agent: writes the final markdown report."""

from said.llm import get_llm
from said.state import ResearchState

REPORT_PROMPT = """Write a final research report in markdown for the query: "{query}".

Use the analysis below as your primary source. Structure the report with a title, an executive
summary, sections matching the analysis, a sources section listing every URL/DOI you were given,
and a short "limitations" section. Be precise and avoid inventing sources.

Analysis:
{analysis}
"""


def report_agent_node(state: ResearchState) -> dict:
    llm = get_llm()
    prompt = REPORT_PROMPT.format(query=state["query"], analysis=state.get("analysis", ""))
    response = llm.invoke(prompt)
    return {"report": response.content}
