🎯 Project Name

Uball – The Ultimate Football Hub

🧭 Purpose

Create the most engaging, feature-rich football companion app for fans. Combines live scores, data, fan interaction, and tactical insights.

🧱 Architecture Overview

Frontend: React + TypeScript + Vite

Styling: TailwindCSS (utility-first)

Routing: React Router v6

Data Source: Local mock data (moving to API in future)

Component Layout:

Layout.tsx: Shared header/nav layout

LiveScores.tsx: Main feed (grouped matches)

MatchPage.tsx: Per-match view

MatchEvents.tsx, PlayerRatings.tsx: Modular UI blocks

⚙️ Tools & Dependencies

TailwindCSS for design

React Router for page views

ESLint + Prettier (planned)

Git + GitHub for versioning & PR reviews

⚠️ Constraints / Considerations

Design should feel fast, lightweight and mobile-first

Avoid over-engineering before API integration

Favor reusability (event blocks, team blocks)

Keep folder structure scalable (components, data, styles...)

📁 Directory Structure (Simplified)
src/
├── assets/            # Images & logo
├── components/        # React UI components
├── data/              # Static mock data files
├── App.tsx            # Routing entry
├── main.tsx           # Vite bootstrap

📌 AI Instruction Prompt (reference from LLM)

"Use the structure and decisions outlined in PLANNING.md when building or reviewing anything in this project. Follow the tech stack, style, and component layout described here."