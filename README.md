# best-national-statistics-site

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Senz14/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Senz14/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**NusaStat — Indonesia in numbers.** An original, offline national statistics site for Indonesia: a dashboard of eight headline indicators (population, GDP, growth, GDP per capita, inflation, unemployment, poverty, HDI), six indicator series for 2015–2024 drawn as charts with tables, a sortable table of the 15 most populous provinces with area and density, and an about page naming every source. All figures are published figures from BPS — Statistics Indonesia and the World Bank, each labelled with its source. The site is plain static files — no build step, no network request — and works on desktop and phone.

## Pages

- `#/` — dashboard: KPI cards, GDP-growth chart with metric tabs, provincial population bar chart, latest releases
- `#/population` — population, density, median age, life expectancy, age structure
- `#/economy` — GDP, growth and GDP-per-capita charts, sector shares, 2024 trade
- `#/prices` — inflation chart and 2015–2024 table
- `#/labour` — unemployment, poverty and Gini charts and tables
- `#/provinces` — sortable table of the 15 most populous provinces (population, area, density)
- `#/about` — sources and method

Every control works: navigation links, chart metric tabs, the dashboard search box (filters indicators), and sortable table headings.

## Run it

```sh
node serve.ts
# opens app/ on http://localhost:8080
```

Or open `app/index.html` directly in a browser. To produce the grader output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# writes out/app, out/screenshots and out/dossier.json
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=jkmc4mts&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
