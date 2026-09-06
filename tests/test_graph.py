from said.formatting import format_results
from said.graph import build_graph


def test_graph_compiles():
    app = build_graph()
    assert app is not None


def test_format_results_empty():
    assert format_results([]) == "(none)"


def test_format_results_basic():
    text = format_results([{"title": "Paper A", "url": "http://x", "summary": "abc"}])
    assert "Paper A" in text
    assert "http://x" in text
