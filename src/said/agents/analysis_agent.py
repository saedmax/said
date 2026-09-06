"""Analysis agent: synthesizes verified evidence into a structured analysis."""

from said.llm import get_llm
from said.state import ResearchState

ANALYSIS_PROMPT = """You are a senior research analyst. Given the verified evidence below about the
query "{query}", produce a structured analysis covering:

1. Key findings
2. Areas of agreement across sources
3. Contradictions or open questions
4. Gaps in current knowledge
5. Recommended next research steps

Evidence:
{evidence}
"""


def analysis_agent_node(state: ResearchState) -> dict:
    llm = get_llm()
    prompt = ANALYSIS_PROMPT.format(query=state["query"], evidence=state.get("evidence", ""))
    response = llm.invoke(prompt)
    return {"analysis": response.content}
