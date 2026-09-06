import said.storage.vectorstore as vs


def test_vectorstore_roundtrip(tmp_path, monkeypatch):
    monkeypatch.setattr(vs, "VECTOR_DB_PATH", tmp_path / "chroma")
    vs.reset()

    vs.add_results(
        "run1",
        "nanofertilizers nitrogen uptake",
        [
            {
                "title": "Nano-urea boosts NUE",
                "summary": "Nanoscale urea carriers improve nitrogen use efficiency in rice",
                "url": "http://example.com/paper1",
                "source": "web",
            }
        ],
    )

    matches = vs.query_similar("urea nanoparticles nitrogen efficiency", n_results=3)
    assert len(matches) == 1
    assert matches[0]["metadata"]["title"] == "Nano-urea boosts NUE"


def test_vectorstore_empty_returns_no_matches(tmp_path, monkeypatch):
    monkeypatch.setattr(vs, "VECTOR_DB_PATH", tmp_path / "chroma-empty")
    vs.reset()

    assert vs.query_similar("anything", n_results=3) == []
