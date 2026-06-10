# Gemswell Web V2

Parallel investor scrollytelling web experience for `Gemswell_Investment_02.pdf`.

This project is intentionally isolated from the existing root web app.

## Commands

```bash
npm install
npm run dev
npm run build
```

## Structure

- `src/main.jsx`: app composition and section components.
- `src/data/content.js`: investor copy, KPIs, revenue mix, benchmark data and terms.
- `src/styles.css`: design system, layout, motion and responsive behavior.
- `public/assets/`: production visual assets copied or extracted from the PDF.
- `public/source/`: source PDF, rendered PDF pages and extracted raw images.
- `docs/source-inventory.md`: mapping from PDF slides to web chapters.
