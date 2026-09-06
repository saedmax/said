"""SQLite storage for research runs.

Semantic search over past runs lives separately in
`said.storage.vectorstore` (Chroma); this module just keeps the full
state of every run for exact lookup and display.
"""

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path.cwd() / "data" / "research.db"


def _connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            created_at TEXT NOT NULL,
            state_json TEXT NOT NULL
        )
        """
    )
    return conn


def save_run(query: str, state: dict) -> int:
    conn = _connect()
    with conn:
        cur = conn.execute(
            "INSERT INTO runs (query, created_at, state_json) VALUES (?, ?, ?)",
            (query, datetime.now(timezone.utc).isoformat(), json.dumps(state, default=str)),
        )
        return cur.lastrowid


def list_runs(limit: int = 50) -> list[dict]:
    conn = _connect()
    rows = conn.execute(
        "SELECT id, query, created_at FROM runs ORDER BY id DESC LIMIT ?",
        (limit,),
    ).fetchall()
    return [{"id": r[0], "query": r[1], "created_at": r[2]} for r in rows]


def get_run(run_id: int) -> dict | None:
    conn = _connect()
    row = conn.execute(
        "SELECT query, created_at, state_json FROM runs WHERE id = ?",
        (run_id,),
    ).fetchone()
    if row is None:
        return None
    query, created_at, state_json = row
    return {"query": query, "created_at": created_at, "state": json.loads(state_json)}
