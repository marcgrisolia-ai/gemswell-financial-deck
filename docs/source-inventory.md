# Gemswell Web V2 Source Inventory

## Direction

Selected working direction: `Cinematic Investor Scroll`.

This project is separate from the existing root app. The root app is treated only
as contextual research. The new app reorganizes the PDF into narrative chapters
instead of recreating an 18-slide carousel.

## Source Materials

- Primary PDF: `public/source/Gemswell_Investment_02.pdf`
- PDF renders: `public/source/pdf-pages/slide-01.png` through `slide-18.png`
- Brand DNA: `src/data/GEMSWELL_DNA.json`
- Fonts: `src/assets/fonts/ciutadella-*.ttf`
- Existing extracted deck assets: `public/assets/slide-01` through `slide-11`
- New extraction for slide 13: `public/assets/slide-13/birmingham-hero.jpg`
- New extraction for slide 16: `public/assets/slide-16/surf-investment.jpg`

## Chapter Mapping

- Opening cinematic: source slides 1-2, implemented as hero plus thesis.
- Platform rationale: source slides 3-8, implemented as four proof pillars,
  sponsor/technology proof and portfolio market strip.
- Madrid chapter: source slides 9-12, implemented as market hero, services,
  layout plan, KPI table and revenue mix.
- Birmingham chapter: source slides 13-14, implemented as image-led chapter plus
  KPI table and revenue mix.
- Proof and benchmark: source slide 15, implemented as readable narrative bullets
  plus native CSS bar chart.
- Investment terms: source slide 16, implemented as full-height image/text split,
  terms table and structure diagram.
- Highlights and close: source slides 17-18, implemented as spacious highlight
  list, contact panel and collapsible disclaimer.

## Dense Slide Treatment

Slides 2-8, 10-12 and 14-17 are not compressed into one viewport each. They are
split into readable modules and staged with guided motion. Data-heavy content is
implemented as native text and charts instead of raster screenshots, while
critical photography and brand lockups are kept as source assets.

## Coverage Update

The web build now includes native coverage for the previously missing PDF
content: Mission/Vision, surf park market rationale, Wavegarden specifications,
Stoneweg InfraSports / TERAS / Stoneweg sponsor detail, Gemswell Ventures OpCo
services and value drivers, the leadership team bios, Madrid/Birmingham
location details, UEFA 2027 timing, restaurant labels, benchmark metadata,
full investment ownership percentages and the complete legal disclaimer.
