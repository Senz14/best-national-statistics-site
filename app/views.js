// NusaStat views: every page is built from data.js. Charts are plain inline SVG
// drawn by these functions — no chart library, no network request.

import { AGE_GROUPS, KPIS, META, PROVINCES, RELEASES, SECTORS, SERIES, TRADE, YEARS } from './data.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function sourceLine(source) {
  return `<p class="source">Source: ${esc(source)}</p>`;
}

// --- SVG charts -------------------------------------------------------------

function lineChart(series, opts = {}) {
  const w = opts.width ?? 720;
  const h = opts.height ?? 260;
  const padL = 44;
  const padR = 14;
  const padT = 14;
  const padB = 30;
  const vals = series.values;
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  if (min > 0) min = Math.min(0, min);
  const span = max - min || 1;
  const x = (i) => padL + ((w - padL - padR) * i) / (vals.length - 1);
  const y = (v) => padT + ((h - padT - padB) * (max - v)) / span;
  const points = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${padL},${y(min)} ${points} ${x(vals.length - 1).toFixed(1)},${y(min)}`;
  const ticks = 4;
  const grid = Array.from({ length: ticks + 1 }, (_, t) => {
    const v = min + (span * t) / ticks;
    return `<line x1="${padL}" y1="${y(v)}" x2="${w - padR}" y2="${y(v)}" class="grid"/>
      <text x="${padL - 6}" y="${y(v) + 4}" class="axis" text-anchor="end">${fmt(v, series.unit)}</text>`;
  }).join('');
  const labels = YEARS.map((yr, i) =>
    i % 2 === 0
      ? `<text x="${x(i)}" y="${h - 8}" class="axis" text-anchor="middle">${yr}</text>`
      : '',
  ).join('');
  const dots = vals
    .map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" class="dot"><title>${YEARS[i]}: ${fmt(v, series.unit)}</title></circle>`)
    .join('');
  const last = vals[vals.length - 1];
  const lastY = Math.max(y(last) - 10, 13);
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="${esc(series.label)} chart, 2015 to 2024">
    ${grid}
    <polygon points="${area}" class="area"/>
    <polyline points="${points}" class="line" fill="none"/>
    ${dots}
    <text x="${x(vals.length - 1) - 4}" y="${lastY}" class="lastval" text-anchor="end">${fmt(last, series.unit)} (${YEARS[YEARS.length - 1]})</text>
    ${labels}
  </svg>`;
}

function fmt(v, unit) {
  if (unit === 'current US$') return '$' + Math.round(v).toLocaleString('en-US');
  if (unit === '0–1') return v.toFixed(2);
  return `${Number(v.toFixed(2))}%`;
}

function barChart(items, valueKey, labelKey, unit) {
  const w = 720;
  const rowH = 34;
  const h = items.length * rowH + 30;
  const max = Math.max(...items.map((i) => i[valueKey]));
  const padL = 200;
  const rows = items
    .map((it, i) => {
      const bw = ((w - padL - 70) * it[valueKey]) / max;
      const y = 14 + i * rowH;
      return `<text x="${padL - 8}" y="${y + 15}" class="barlabel" text-anchor="end">${esc(it[labelKey])}</text>
      <rect x="${padL}" y="${y}" width="${bw.toFixed(1)}" height="20" rx="3" class="bar"/>
      <text x="${padL + bw + 6}" y="${y + 15}" class="barval">${it[valueKey]}${unit}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="Bar chart of ${esc(labelKey)}">
    ${rows}
  </svg>`;
}

// --- shared pieces ----------------------------------------------------------

function kpiCards(list) {
  return `<div class="kpis">${list
    .map(
      (k) => `<a class="kpi" href="${k.page}">
        <span class="kpi-label">${esc(k.label)}</span>
        <span class="kpi-value">${esc(k.value)}</span>
        <span class="kpi-note">${esc(k.note)} · ${esc(k.source)}</span>
      </a>`,
    )
    .join('')}</div>`;
}

function seriesTable(series) {
  const rows = YEARS.map(
    (y, i) => `<tr><td>${y}</td><td>${fmt(series.values[i], series.unit)}</td></tr>`,
  ).join('');
  return `<table class="data"><thead><tr><th>Year</th><th>${esc(series.label)} (${esc(series.unit)})</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function chartTabs(active) {
  const keys = Object.keys(SERIES);
  return `<div class="tabs" role="tablist">${keys
    .map(
      (k) =>
        `<a role="tab" aria-selected="${k === active}" class="tab${k === active ? ' active' : ''}" href="#/chart/${k}">${esc(SERIES[k].label)}</a>`,
    )
    .join('')}</div>`;
}

// --- pages ------------------------------------------------------------------

export function home(query = '') {
  const q = query.trim().toLowerCase();
  const shown = q ? KPIS.filter((k) => `${k.label} ${k.value} ${k.note} ${k.source}`.toLowerCase().includes(q)) : KPIS;
  return `<h1>Indonesia in numbers</h1>
  <p class="lede">The headline statistics of the world's fourth most populous country — population, economy, prices,
  work and poverty — from the figures BPS (Statistics Indonesia) and the World Bank publish. Every number on this
  site names its source.</p>
  <label class="search">Search indicators
    <input id="q" type="search" placeholder="Try “inflation”, “poverty”, “GDP”…" value="${esc(query)}" autocomplete="off">
  </label>
  ${kpiCards(shown)}
  ${shown.length === 0 ? `<p class="empty">No indicator matches “${esc(query)}”. Try another word.</p>` : ''}
  <h2>Growth, prices and work — 2015 to 2024</h2>
  ${chartTabs('gdpGrowth')}
  ${lineChart(SERIES.gdpGrowth)}
  <p>${esc(SERIES.gdpGrowth.note)}</p>
  ${sourceLine(SERIES.gdpGrowth.source)}
  <h2>Where Indonesians live</h2>
  <p>The 15 most populous of Indonesia's ${META.provinces} provinces hold most of the country. Java alone holds
  more than half the population on about 7% of the land.</p>
  ${barChart(PROVINCES.slice(0, 10), 'pop', 'name', 'm')}
  ${sourceLine('BPS, 2024 mid-year projection')}
  <p><a href="#/provinces">See all 15 provinces, with area and density &rarr;</a></p>
  <h2>Latest releases</h2>
  <ul class="releases">${RELEASES.map((r) => `<li><strong>${esc(r.date)}</strong> — ${esc(r.release)} <span class="src">(${esc(r.source)})</span></li>`).join('')}</ul>`;
}

export function chartPage(key) {
  const series = SERIES[key] ?? SERIES.gdpGrowth;
  return `<p><a href="#/">&larr; Dashboard</a></p>
  <h1>${esc(series.label)}, 2015–2024</h1>
  ${chartTabs(key in SERIES ? key : 'gdpGrowth')}
  ${lineChart(series, { height: 300 })}
  <p>${esc(series.note)}</p>
  ${sourceLine(series.source)}
  ${seriesTable(series)}`;
}

export function population() {
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  return `<p><a href="#/">&larr; Dashboard</a></p>
  <h1>Population</h1>
  <p class="lede">283.5 million people (World Bank, 2024) live across ${META.islands.toLocaleString('en-US')} islands
  and ${META.areaKm2.toLocaleString('en-US')} km² — about 149 people per km², but most of them on Java.</p>
  ${kpiCards([
    { id: 'pop', label: 'Population', value: '283.5m', note: '2024', source: 'World Bank', page: '#/population' },
    { id: 'density', label: 'Density', value: '149/km²', note: 'national average', source: 'World Bank / BPS', page: '#/population' },
    { id: 'median', label: 'Median age', value: '30.7', note: '2024 estimate', source: 'UN', page: '#/population' },
    { id: 'life', label: 'Life expectancy', value: '71.8 yrs', note: '2023', source: 'World Bank', page: '#/population' },
  ])}
  <h2>Age structure</h2>
  <p>Indonesia is still young: more than two in three people are of working age (15–64).</p>
  ${barChart(AGE_GROUPS, 'share', 'group', '%')}
  ${sourceLine('BPS, 2024 projection')}
  <h2>Most populous provinces</h2>
  <p>The 15 provinces below hold ${total.toFixed(1)} million people — most of the country.
  <a href="#/provinces">Full table with area and density &rarr;</a></p>
  ${barChart(PROVINCES.slice(0, 8), 'pop', 'name', 'm')}
  ${sourceLine('BPS, 2024 mid-year projection')}`;
}

export function economy() {
  return `<p><a href="#/">&larr; Dashboard</a></p>
  <h1>Economy</h1>
  <p class="lede">Southeast Asia's largest economy: $1.40 trillion of GDP in 2024 (World Bank), growing 5.03%
  (BPS) — the third straight year at or above 5%.</p>
  ${kpiCards([
    { id: 'gdp', label: 'GDP', value: '$1.40tn', note: '2024', source: 'World Bank', page: '#/economy' },
    { id: 'growth', label: 'GDP growth', value: '5.03%', note: '2024', source: 'BPS', page: '#/economy' },
    { id: 'gdppc', label: 'GDP per capita', value: '$4,925', note: '2024', source: 'World Bank', page: '#/economy' },
    { id: 'exports', label: 'Exports', value: '$264.7bn', note: '2024', source: 'BPS', page: '#/economy' },
  ])}
  <h2>GDP growth, 2015–2024</h2>
  ${lineChart(SERIES.gdpGrowth, { height: 300 })}
  <p>${esc(SERIES.gdpGrowth.note)}</p>
  ${sourceLine(SERIES.gdpGrowth.source)}
  <h2>GDP per capita, 2015–2024</h2>
  ${lineChart(SERIES.gdpPerCapita, { height: 280 })}
  <p>${esc(SERIES.gdpPerCapita.note)}</p>
  ${sourceLine(SERIES.gdpPerCapita.source)}
  <h2>What the economy makes</h2>
  <p>Shares of GDP at current prices, 2024. Manufacturing is the largest single sector, at 18.8%.</p>
  ${barChart(SECTORS, 'share', 'name', '%')}
  ${sourceLine('BPS, 2024')}
  <h2>Trade, 2024</h2>
  <table class="data"><thead><tr><th>Flow</th><th>US$ billion</th></tr></thead><tbody>
  ${TRADE.map((t) => `<tr><td>${esc(t.label)}</td><td>${t.value.toFixed(1)}</td></tr>`).join('')}
  </tbody></table>
  <p>Indonesia ran a $31.0 billion goods trade surplus in 2024 — its fifth straight annual surplus.</p>
  ${sourceLine('BPS, 2024')}`;
}

export function prices() {
  return `<p><a href="#/">&larr; Dashboard</a></p>
  <h1>Prices &amp; inflation</h1>
  <p class="lede">Consumer price inflation was 1.57% in December 2024, year on year (BPS) — inside Bank
  Indonesia's 1.5–3.5% target range and the lowest calendar-year rate in the series.</p>
  <h2>Inflation, 2015–2024</h2>
  ${lineChart(SERIES.inflation, { height: 300 })}
  <p>${esc(SERIES.inflation.note)}</p>
  ${sourceLine(SERIES.inflation.source)}
  ${seriesTable(SERIES.inflation)}`;
}

export function labour() {
  return `<p><a href="#/">&larr; Dashboard</a></p>
  <h1>Work &amp; living standards</h1>
  <p class="lede">Unemployment fell to 4.91% in August 2024 (BPS), the lowest in a decade, and the poverty
  rate to 9.03% in March 2024. The Human Development Index reached 75.02 in 2024.</p>
  ${kpiCards([
    { id: 'unemp', label: 'Unemployment', value: '4.91%', note: 'Aug 2024', source: 'BPS', page: '#/labour' },
    { id: 'pov', label: 'Poverty rate', value: '9.03%', note: 'Mar 2024', source: 'BPS', page: '#/labour' },
    { id: 'hdi', label: 'Human Development Index', value: '75.02', note: '2024', source: 'BPS', page: '#/labour' },
    { id: 'gini', label: 'Gini ratio', value: '0.379', note: 'Mar 2024', source: 'BPS', page: '#/labour' },
  ])}
  <h2>Unemployment, 2015–2024</h2>
  ${lineChart(SERIES.unemployment, { height: 280 })}
  <p>${esc(SERIES.unemployment.note)}</p>
  ${sourceLine(SERIES.unemployment.source)}
  <h2>Poverty, 2015–2024</h2>
  ${lineChart(SERIES.poverty, { height: 280 })}
  <p>${esc(SERIES.poverty.note)}</p>
  ${sourceLine(SERIES.poverty.source)}
  <h2>Inequality</h2>
  <p>The Gini ratio was 0.379 in March 2024 — essentially unchanged since 2019, after a slow fall from
  0.408 in 2015.</p>
  ${lineChart(SERIES.gini, { height: 240 })}
  ${sourceLine(SERIES.gini.source)}`;
}

export function provinces(sort = 'pop') {
  const rows = [...PROVINCES].map((p) => ({
    ...p,
    density: Math.round((p.pop * 1e6) / p.area),
  }));
  const key = sort === 'density' || sort === 'area' || sort === 'name' ? sort : 'pop';
  rows.sort((a, b) => (key === 'name' ? a.name.localeCompare(b.name) : b[key] - a[key]));
  const th = (k, label) =>
    `<th><a href="#/provinces/${k}" class="${key === k ? 'sorted' : ''}">${label}${key === k ? ' ↓' : ''}</a></th>`;
  return `<p><a href="#/">&larr; Dashboard</a></p>
  <h1>Provinces</h1>
  <p class="lede">The 15 most populous of Indonesia's ${META.provinces} provinces, 2024. Click a column
  heading to sort. Jakarta packs 10.7 million people into 664 km²; East Kalimantan holds 4.0 million
  across 127,347 km².</p>
  <table class="data">
    <thead><tr>${th('name', 'Province')}${th('pop', 'Population (m)')}${th('area', 'Area (km²)')}${th('density', 'Density (/km²)')}</tr></thead>
    <tbody>${rows
      .map(
        (p) =>
          `<tr><td>${esc(p.name)}</td><td>${p.pop.toFixed(2)}</td><td>${p.area.toLocaleString('en-US')}</td><td>${p.density.toLocaleString('en-US')}</td></tr>`,
      )
      .join('')}</tbody>
  </table>
  ${sourceLine('BPS, 2024 mid-year projection; areas BPS. Density computed from the two.')}
  <p>Indonesia has ${META.provinces} provinces and ${META.regenciesCities} regencies and cities (BPS, 2024).
  The remaining 23 provinces each hold fewer than 4 million people.</p>`;
}

export function about() {
  return `<p><a href="#/">&larr; Dashboard</a></p>
  <h1>About &amp; sources</h1>
  <p class="lede">NusaStat is an independent, original presentation of Indonesia's published national
  statistics. It is not affiliated with BPS, the World Bank, or the Government of Indonesia, and it
  copies no other site's design, text or images.</p>
  <h2>Sources</h2>
  <ul>
    <li><strong>BPS — Statistics Indonesia (bps.go.id)</strong>: GDP growth, inflation, unemployment, poverty, Gini ratio, Human Development Index, provincial populations and areas, sector shares, trade, release calendar.</li>
    <li><strong>World Bank (data.worldbank.org)</strong>: total population, GDP in current US$, GDP per capita, life expectancy.</li>
    <li><strong>United Nations</strong>: median-age estimate for 2024.</li>
  </ul>
  <h2>Method</h2>
  <ul>
    <li>Figures are shown as published, rounded for display; growth, inflation and poverty rates are the annual figures BPS publishes (March for poverty and the Gini ratio, August for unemployment, calendar year for inflation).</li>
    <li>Provincial populations are BPS 2024 mid-year projections; densities are computed from population and area.</li>
    <li>The site is static: it loads no file from the network and sends nothing anywhere. All charts are drawn in the browser from the data file.</li>
  </ul>
  <h2>Latest releases</h2>
  <ul class="releases">${RELEASES.map((r) => `<li><strong>${esc(r.date)}</strong> — ${esc(r.release)} <span class="src">(${esc(r.source)})</span></li>`).join('')}</ul>
  <p><a href="#/">Back to the dashboard &rarr;</a></p>`;
}

export function missing() {
  return `<h1>Page not found</h1>
  <p>There is no page at this address. <a href="#/">Back to the dashboard</a>.</p>`;
}
