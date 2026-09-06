"""Shared helpers for turning raw tool results into LLM-readable text."""


def format_results(results: list[dict]) -> str:
    if not results:
        return "(none)"
    lines = []
    for r in results:
        title = r.get("title") or "(no title)"
        url = r.get("url") or ""
        summary = (r.get("summary") or "")[:400]
        lines.append(f"- {title} ({url})\n  {summary}")
    return "\n".join(lines)
