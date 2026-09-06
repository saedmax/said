# SAID — مساعد بحث علمي متعدد الوكلاء (V1)

V1 عملية تركّز على دورة البحث الكاملة: **بحث → قراءة → استخراج → مقارنة → تحقق → تحليل →
تقرير**، بدون أي أتمتة كيميائية أو تنفيذ تجارب حقيقية (تُضاف لاحقًا في V2).

## المعمارية

```
Research Manager
       │
       ├── Web Research Agent        (DuckDuckGo)
       ├── Scientific Papers Agent   (arXiv + Semantic Scholar + Crossref)
       └── Patent Agent              (Google Patents عبر SerpApi — اختياري)
                    │
                    ▼
             Evidence Agent          (تنظيف وتحقق وإزالة التكرار)
                    │
                    ▼
             Analysis Agent          (تحليل بنيوي: نتائج، تناقضات، فجوات)
                    │
                    ▼
             Report Generator        (تقرير Markdown نهائي)
```

كل شيء مبني على [LangGraph](https://github.com/langchain-ai/langgraph) ويستخدم
**Gemini API** (عبر `langchain-google-genai`) كمحرك تفكير للوكلاء. لا حاجة لتشغيل أي
نموذج محليًا في V1.

## المتطلبات

- WSL Ubuntu (أو Linux/macOS)
- Python 3.11+
- [uv](https://docs.astral.sh/uv/) لإدارة الحزم (أو `pip` كبديل)
- مفتاح Gemini API مجاني من [Google AI Studio](https://aistudio.google.com/apikey)

## التثبيت

```bash
git clone <repo-url> said
cd said
uv sync
```

بدون `uv`:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

## الإعداد

```bash
cp .env.example .env
```

ثم عدّل `.env` وضع مفتاح Gemini الخاص بك:

```
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.5-flash
```

`SERPAPI_API_KEY` اختياري: بدونه يرجع Patent Agent ملاحظة أن بحث البراءات غير مفعّل
بدل الفشل.

## أول بحث تجريبي

```bash
uv run said "الأسمدة النانوية لتحسين امتصاص النيتروجين في التربة"
```

أو مع حفظ التقرير في ملف:

```bash
uv run said "..." -o report.md
```

كل تشغيلة تُحفظ أيضًا في `data/research.db` (SQLite) لسهولة الرجوع إليها لاحقًا.

## التشغيل بدون uv

```bash
python -m said.cli "your query"
```

## الاختبارات

```bash
uv run pytest
```

الاختبارات الحالية لا تحتاج مفتاح API لأنها تتحقق فقط من بناء الـ graph ومنطق التنسيق
الداخلي.

## حدود V1 والخطوات القادمة (V2)

- لا يوجد Vector DB (Chroma/FAISS) بعد للبحث الدلالي داخل الأبحاث المخزّنة — SQLite فقط
  حاليًا.
- Patent Agent يحتاج `SERPAPI_API_KEY` ليعمل فعليًا؛ بدونه هو stub.
- لا واجهة ويب بعد (CLI فقط).
- لا Chemistry automation أو تنفيذ تجارب حقيقية — يُضاف تدريجيًا بعد أن يصبح خط
  البحث/التحليل/التقرير قويًا.
