import said.agents.multilingual_web_agent as mwa


def test_web_agent_zh_translates_and_tags_results(monkeypatch):
    monkeypatch.setattr(mwa, "translate_query", lambda query, language: "translated-query")

    def fake_search_web(query, region):
        assert query == "translated-query"
        assert region == "cn-zh"
        return [{"title": "t", "summary": "s", "url": "http://x", "source": "web"}]

    monkeypatch.setattr(mwa, "search_web", fake_search_web)

    result = mwa.web_agent_zh_node({"query": "original query"})

    assert len(result["web_results"]) == 1
    assert result["web_results"][0]["source"] == "web_zh"
    assert result["web_results"][0]["translated_query"] == "translated-query"


def test_web_agent_zh_reports_translation_failure(monkeypatch):
    def fail(query, language):
        raise RuntimeError("boom")

    monkeypatch.setattr(mwa, "translate_query", fail)

    result = mwa.web_agent_zh_node({"query": "original query"})

    assert result["web_results"][0]["source"] == "error"
