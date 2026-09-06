"""LangGraph wiring for the multi-agent research pipeline.

    recall_agent (semantic search over past runs)
       |
       v
    manager
       |
       +--> web_agent -------+
       +--> web_agent_zh ----+
       +--> papers_agent ----+--> evidence_agent --> memory_agent --> analysis_agent --> report_agent
       +--> patent_agent ----+
"""

from langgraph.graph import END, START, StateGraph

from said.agents.analysis_agent import analysis_agent_node
from said.agents.evidence_agent import evidence_agent_node
from said.agents.manager import manager_node
from said.agents.memory_agent import memory_agent_node
from said.agents.multilingual_web_agent import web_agent_zh_node
from said.agents.papers_agent import papers_agent_node
from said.agents.patent_agent import patent_agent_node
from said.agents.recall_agent import recall_agent_node
from said.agents.report_agent import report_agent_node
from said.agents.web_agent import web_agent_node
from said.state import ResearchState


def build_graph():
    graph = StateGraph(ResearchState)

    graph.add_node("recall_agent", recall_agent_node)
    graph.add_node("manager", manager_node)
    graph.add_node("web_agent", web_agent_node)
    graph.add_node("web_agent_zh", web_agent_zh_node)
    graph.add_node("papers_agent", papers_agent_node)
    graph.add_node("patent_agent", patent_agent_node)
    graph.add_node("evidence_agent", evidence_agent_node)
    graph.add_node("memory_agent", memory_agent_node)
    graph.add_node("analysis_agent", analysis_agent_node)
    graph.add_node("report_agent", report_agent_node)

    graph.add_edge(START, "recall_agent")
    graph.add_edge("recall_agent", "manager")
    graph.add_edge("manager", "web_agent")
    graph.add_edge("manager", "web_agent_zh")
    graph.add_edge("manager", "papers_agent")
    graph.add_edge("manager", "patent_agent")
    graph.add_edge("web_agent", "evidence_agent")
    graph.add_edge("web_agent_zh", "evidence_agent")
    graph.add_edge("papers_agent", "evidence_agent")
    graph.add_edge("patent_agent", "evidence_agent")
    graph.add_edge("evidence_agent", "memory_agent")
    graph.add_edge("memory_agent", "analysis_agent")
    graph.add_edge("analysis_agent", "report_agent")
    graph.add_edge("report_agent", END)

    return graph.compile()
