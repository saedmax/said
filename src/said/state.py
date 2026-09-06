"""Shared state passed between nodes in the research graph."""

import operator
from typing import Annotated, TypedDict


class ResearchState(TypedDict, total=False):
    query: str
    web_results: Annotated[list[dict], operator.add]
    paper_results: Annotated[list[dict], operator.add]
    patent_results: Annotated[list[dict], operator.add]
    evidence: str
    analysis: str
    report: str
