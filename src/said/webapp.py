"""Streamlit web UI for SAID.

Run with: `uv run streamlit run src/said/webapp.py`
"""

from dotenv import load_dotenv

load_dotenv(override=True)

import streamlit as st  # noqa: E402

from said.graph import build_graph  # noqa: E402
from said.storage.db import get_run, list_runs, save_run  # noqa: E402

st.set_page_config(page_title="SAID — مساعد بحث علمي", page_icon="🔬", layout="wide")

if "selected_run_id" not in st.session_state:
    st.session_state.selected_run_id = None

with st.sidebar:
    st.header("تشغيلات سابقة")
    runs = list_runs()
    if not runs:
        st.caption("لا توجد تشغيلات بعد.")
    for run in runs:
        label = f"#{run['id']} — {run['query'][:40]}"
        if st.button(label, key=f"run-{run['id']}", use_container_width=True):
            st.session_state.selected_run_id = run["id"]

st.title("🔬 SAID — مساعد بحث علمي متعدد الوكلاء")

query = st.text_input("سؤال البحث", placeholder="مثال: nanofertilizers for nitrogen uptake")
run_clicked = st.button("ابدأ البحث", type="primary")

if run_clicked and query.strip():
    st.session_state.selected_run_id = None
    with st.spinner("جاري البحث والتحليل... قد يأخذ دقيقة أو أكثر"):
        app = build_graph()
        result = app.invoke({"query": query})
        run_id = save_run(query, result)

    st.success(f"انتهى البحث (تشغيلة #{run_id})")

    with st.expander("سياق من أبحاث سابقة (Recall)"):
        st.markdown(result.get("prior_context", "(لا يوجد)"))

    st.markdown(result.get("report", "(لم يُنتج تقرير)"))

elif st.session_state.selected_run_id is not None:
    run = get_run(st.session_state.selected_run_id)
    if run is None:
        st.warning("التشغيلة غير موجودة.")
    else:
        st.caption(f"تشغيلة #{st.session_state.selected_run_id} — {run['created_at']}")
        st.markdown(run["state"].get("report", "(لم يُنتج تقرير)"))
else:
    st.caption("اكتب سؤال بحث واضغط \"ابدأ البحث\"، أو اختر تشغيلة سابقة من القائمة الجانبية.")
