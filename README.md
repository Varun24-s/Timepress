# TimePress: Historical UI Generation Engine

TimePress is a Next.js-based web application that transforms chronological metadata into high-density, stylized interface layouts. The system uses Large Language Models (LLMs) to synthesize historical data points into structured prose, which is then rendered through a custom-built CSS Grid layout engine.

---

## Technical Overview

The core of the application is a data pipeline that maps unstructured historical facts to a rigid, multi-column "Folio" architecture. It is designed to demonstrate how generative AI can be used to drive complex, theme-specific UI components dynamically.

---

### System Architecture & Logic
1. **Temporal Normalization**: The application processes a user-selected Date and Region. It applies a T-1 calculation to simulate a morning-of-record cycle, ensuring the fetched data represents events occurring in the 24 hours prior to the target timestamp.

2. **Archival Data Retrieval (Wikipedia Logic)**: The system utilizes the Wikipedia Events API (or scoped web-scraping logic) to pull verified historical metadata for the specific T-1 date. By targeting the "Events" and "Births/Deaths" registries of a particular day, the application ensures that the generated content is grounded in factual chronological records rather than purely synthetic hallucinations.

3. **Contextual Synthesis (API Layer)**: A POST request is issued to a server-side route (/api/generate). This route acts as a transformer, sending the raw Wikipedia metadata to an LLM. The model performs a "style-transfer," converting bulleted factual data into high-register, period-accurate string fragments suitable for a broadsheet layout.

4. **Grid-Based Rendering**: The frontend consumes the synthesized JSON and maps it to a 12-column CSS Grid system. This allows for high-density information display and complex "newspaper-style" column spanning while maintaining responsiveness across varying viewport sizes.

5. **State Management**: React useState and useSearchParams are utilized to manage the "Folio" navigation (Front Page, Foreign, Sports, Classifieds). Once the initial payload is retrieved, all tab-switching is handled client-side to eliminate additional network latency.

---

## Tech Stack

| Component | Technology | Implementation |
| :--- | :--- | :--- |
| **Framework** | Next.js 15+ | App Router architecture for optimized routing and SSR. |
| **Styling** | Tailwind CSS | Custom configurations for "Ink-on-Paper" aesthetics. |
| **Logic** | React / Hooks | Functional components using `useEffect` for lifecycle data fetching. |
| **Animation** | Framer Motion | Layout transitions and hardware-accelerated transforms. |
| **Processing** | OpenAI / OpenRouter | LLM-based content generation and text styling. |

---

## Directory Structure


├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.js        # POST Endpoint: Orchestrates LLM synthesis & data fetching
│   ├── edition/
│   │   └── [id]/
│   │       └── page.js         # Dynamic Route: Handles folio state & NewspaperPreview mounting
│   ├── global.css              # Typography system & CSS Grid utility definitions
│   ├── layout.js               # Root Provider: Manages font injection & metadata
│   └── page.js                 # Entry Portal: Search parameter capture & navigation logic
├── components/
│   ├── NewspaperPreview.jsx    # Core UI Engine: Maps JSON fragments to 12-column grid layouts
│   └── Controls.jsx            # Atomic UI: Standardized inputs, date-pickers, and buttons
├── public/
│   └── assets/                 # Optimized static assets (PNG/SVG logos and textures)
├── .env.local                  # Environment variables (API keys for generation engine)
└── package.json                # Dependency manifest (Next.js, Tailwind, Framer Motion)