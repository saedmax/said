"""Gemini LLM client used by every agent."""

import os

from langchain_google_genai import ChatGoogleGenerativeAI


def get_llm(temperature: float = 0.2) -> ChatGoogleGenerativeAI:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Copy .env.example to .env and add your key."
        )
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    return ChatGoogleGenerativeAI(model=model, google_api_key=api_key, temperature=temperature)
