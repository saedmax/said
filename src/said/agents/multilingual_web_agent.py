"""Factory for web-search agents that search in another language.

The default web_agent only searches in English. To surface non-English
sources (e.g. Chinese research/industry coverage a query wouldn't
otherwise reach), each of these agents first translates the query into a
target language via Gemini, then searches the web pinned to that
language's region. Add a new language by calling make_web_agent_node with
a language name, a DuckDuckGo region code, and a source tag, then wiring
the returned node into the graph alongside web_agent_zh below.
"""

from said.llm import translate_query
from said.state import ResearchState
from said.tools.web_search import search_web


def make_web_agent_node(language: str, region: str, source_tag: str):
    def node(state: ResearchState) -> dict:
        query = state["query"]
        try:
            translated_query = translate_query(query, language)
        except Exception as e:
            return {
                "web_results": [
                    {
                        "title": f"{source_tag}: translation failed",
                        "summary": str(e),
                        "source": "error",
                    }
                ]
            }

        try:
            results = search_web(translated_query, region=region)
            for r in results:
                r["source"] = source_tag
                r["translated_query"] = translated_query
        except Exception as e:
            results = [
                {
                    "title": f"{source_tag}: search failed",
                    "summary": str(e),
                    "source": "error",
                }
            ]

        return {"web_results": results}

    return node


web_agent_zh_node = make_web_agent_node(
    "Chinese (Simplified)", region="cn-zh", source_tag="web_zh"
)
