"""Command-line entry point: `said "your research question"`."""

import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(override=True)

from said.graph import build_graph  # noqa: E402
from said.storage.db import save_run  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="SAID multi-agent research assistant")
    parser.add_argument("query", help="Research question to investigate")
    parser.add_argument("-o", "--output", help="Path to save the markdown report", default=None)
    args = parser.parse_args()

    app = build_graph()
    result = app.invoke({"query": args.query})

    save_run(args.query, result)

    report = result.get("report", "(no report generated)")
    print(report)

    if args.output:
        Path(args.output).write_text(report, encoding="utf-8")
        print(f"\nReport saved to {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
