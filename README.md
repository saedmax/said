# SAID — مساعد بحث علمي متعدد الوكلاء (V1)

V1 عملية تركّز على دورة البحث الكاملة: **بحث → قراءة → استخراج → مقارنة → تحقق → تحليل →
تقرير**، بدون أي أتمتة كيميائية أو تنفيذ تجارب حقيقية (تُضاف لاحقًا في V2).

## المعمارية

```
Recall Agent            (بحث دلالي عن أبحاث سابقة ذات صلة — Chroma)
       │
       ▼
Research Manager
       │
       ├── Web Research Agent        (DuckDuckGo)
       ├── Scientific Papers Agent   (arXiv + Semantic Scholar + Crossref)
       └── Patent Agent              (Google Patents عبر SerpApi — اختياري)
                    │
                    ▼
             Evidence Agent          (تنظيف وتحقق وإزالة التكرار، بالإضافة لسياق الأبحاث السابقة)
                    │
                    ▼
             Memory Agent            (تخزين نتائج هذي التشغيلة بالـ vector store لتشغيلات لاحقة)
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

**الذاكرة الدلالية (Chroma):** كل تشغيلة تخزّن نتائجها الخام (عناوين + ملخصات) بـ
vector store محلي (`data/chroma`، عبر [Chroma](https://www.trychroma.com/)). التشغيلات
الجاية تسحب أوتوماتيكيًا أي نتائج سابقة ذات صلة دلاليًا وتمررها لـ Evidence Agent كسياق —
يعني الأبحاث تتراكم بدل ما تبدأ من الصفر كل مرة. أول تشغيلة فيها تحميل لموديل embedding
صغير (~80MB، مرة وحدة، يتكاش محليًا).

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

كل تشغيلة تُحفظ أيضًا في `data/research.db` (SQLite) لسهولة الرجوع إليها لاحقًا، وتُضاف
نتائجها الخام لـ `data/chroma` (vector store) للبحث الدلالي في التشغيلات القادمة.

## التشغيل بدون uv

```bash
python -m said.cli "your query"
```

## واجهة الويب

```bash
uv run streamlit run src/said/webapp.py
```

يفتح على `http://localhost:8501`: مربع نص للسؤال، زر "ابدأ البحث"، وقائمة جانبية بكل
التشغيلات السابقة (من SQLite) تقدر تفتحها وتشوف تقريرها بدون ما تعيد البحث.

## الاختبارات

```bash
uv run pytest
```

الاختبارات الحالية لا تحتاج مفتاح API لأنها تتحقق فقط من بناء الـ graph ومنطق التنسيق
الداخلي.

## حدود V1 والخطوات القادمة (V2)

- Patent Agent يحتاج `SERPAPI_API_KEY` ليعمل فعليًا؛ بدونه هو stub.
- لا Chemistry automation أو تنفيذ تجارب حقيقية — يُضاف تدريجيًا بعد أن يصبح خط
  البحث/التحليل/التقرير قويًا.
