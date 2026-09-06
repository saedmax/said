"""SQLite storage for research runs (V1 research database).

A vector store (Chroma/FAISS) for semantic search over past runs is planned
for V2 and intentionally left out of this V1 storage layer.
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
