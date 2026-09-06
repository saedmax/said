"""Gemini LLM client used by every agent."""

import os

from langchain_google_genai import ChatGoogleGenerativeAI


def get_llm(temperature: float = 0.2) -> ChatGoogleGenerativeAI:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Copy .env.example to .env and add your key."
        )
    model = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
    return ChatGoogleGenerativeAI(model=model, google_api_key=api_key, temperature=temperature)


def extract_text(response) -> str:
    """Normalize a chat response's content into plain text.

    Some Gemini models return content as a list of structured blocks
    (e.g. [{"type": "text", "text": "...", "extras": {...}}]) instead of
    a plain string.
    """
    content = response.content
    if isinstance(content, str):
        return content
    parts = []
    for block in content:
        if isinstance(block, dict):
            if block.get("type") == "text":
                parts.append(block.get("text", ""))
        else:
            parts.append(str(block))
    return "".join(parts)
