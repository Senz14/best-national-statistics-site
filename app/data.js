// NusaStat data: Indonesia's headline statistics, 2015–2024.
//
// Every figure below is a published figure, rounded for display. Sources:
//   BPS — Statistics Indonesia (bps.go.id): GDP growth, inflation, unemployment,
//     poverty, HDI, Gini, provincial populations, trade, sector shares.
//   World Bank (data.worldbank.org): population, GDP in US$, GDP per capita,
//     life expectancy.
// The site shows the source under each figure, so a visitor can check it.

export const META = {
  country: 'Indonesia',
  updated: 'Figures as published for 2024 (latest full year)',
  areaKm2: 1904569,
  islands: 17508,
  provinces: 38,
  regenciesCities: 514,
};

export const KPIS = [
  { id: 'population', label: 'Population', value: '283.5m', note: '2024', source: 'World Bank', page: '#/population' },
  { id: 'gdp', label: 'GDP', value: '$1.40tn', note: '2024 · Rp 22,139tn', source: 'World Bank / BPS', page: '#/economy' },
  { id: 'growth', label: 'GDP growth', value: '5.03%', note: '2024, year on year', source: 'BPS', page: '#/economy' },
  { id: 'gdp-pc', label: 'GDP per capita', value: '$4,925', note: '2024, current US$', source: 'World Bank', page: '#/economy' },
  { id: 'inflation', label: 'Inflation', value: '1.57%', note: 'Dec 2024, year on year', source: 'BPS', page: '#/prices' },
  { id: 'unemployment', label: 'Unemployment', value: '4.91%', note: 'Aug 2024', source: 'BPS', page: '#/labour' },
  { id: 'poverty', label: 'Poverty rate', value: '9.03%', note: 'Mar 2024', source: 'BPS', page: '#/labour' },
  { id: 'hdi', label: 'Human Development Index', value: '75.02', note: '2024', source: 'BPS', page: '#/labour' },
];

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SERIES = {
  gdpGrowth: {
    label: 'GDP growth',
    unit: '% per year',
    source: 'BPS',
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.7, 5.31, 5.05, 5.03],
    note: 'Annual real GDP growth. The 2020 dip is the COVID-19 contraction; growth has been at or above 5% every year since 2022.',
  },
  gdpPerCapita: {
    label: 'GDP per capita',
    unit: 'current US$',
    source: 'World Bank',
    values: [3332, 3604, 3840, 3890, 4176, 3857, 4290, 4784, 4920, 4925],
    note: 'GDP per person in current US dollars. It passed $4,000 in 2019 and has stayed above it since 2021.',
  },
  inflation: {
    label: 'Inflation',
    unit: '% per year',
    source: 'BPS',
    values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    note: 'Calendar-year consumer price inflation. The 2022 spike followed the subsidised-fuel price rise; by 2024 inflation was back to 1.57%.',
  },
  unemployment: {
    label: 'Unemployment rate',
    unit: '% of labour force',
    source: 'BPS',
    values: [6.18, 5.61, 5.5, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
    note: 'Open unemployment, August each year. It peaked at 7.07% in August 2020 and fell to 4.91% by August 2024, the lowest in the series.',
  },
  poverty: {
    label: 'Poverty rate',
    unit: '% of population',
    source: 'BPS',
    values: [11.22, 10.86, 10.64, 9.82, 9.41, 9.78, 10.14, 9.54, 9.36, 9.03],
    note: 'Share of the population below the national poverty line, March each year. It fell below 10% in 2018, rose during the pandemic, and reached 9.03% in March 2024.',
  },
  gini: {
    label: 'Gini ratio',
    unit: '0–1',
    source: 'BPS',
    values: [0.408, 0.397, 0.391, 0.384, 0.38, 0.381, 0.379, 0.381, 0.379, 0.379],
    note: 'Gini ratio, March each year (0 = perfect equality). It has hovered just under 0.38 since 2019.',
  },
};

// The 15 most populous provinces, 2024 (BPS mid-year projection, millions).
// Area in km² (BPS); density is computed from the two.
export const PROVINCES = [
  { name: 'West Java', pop: 49.94, area: 37187 },
  { name: 'East Java', pop: 41.81, area: 47800 },
  { name: 'Central Java', pop: 37.89, area: 34337 },
  { name: 'North Sumatra', pop: 15.59, area: 72981 },
  { name: 'Banten', pop: 12.43, area: 9663 },
  { name: 'DKI Jakarta', pop: 10.68, area: 664 },
  { name: 'South Sulawesi', pop: 9.46, area: 46717 },
  { name: 'Lampung', pop: 9.32, area: 34624 },
  { name: 'South Sumatra', pop: 8.84, area: 91592 },
  { name: 'Riau', pop: 6.99, area: 87024 },
  { name: 'West Kalimantan', pop: 5.8, area: 147307 },
  { name: 'West Sumatra', pop: 5.73, area: 42013 },
  { name: 'Bali', pop: 4.44, area: 5780 },
  { name: 'South Kalimantan', pop: 4.32, area: 38744 },
  { name: 'East Kalimantan', pop: 4.01, area: 127347 },
];

// Age structure, 2024 (BPS projection).
export const AGE_GROUPS = [
  { group: '0–14 years', share: 24.4 },
  { group: '15–64 years', share: 68.9 },
  { group: '65+ years', share: 6.7 },
];

// Sector shares of GDP, 2024 (BPS, % of GDP at current prices).
export const SECTORS = [
  { name: 'Manufacturing', share: 18.8 },
  { name: 'Wholesale & retail trade', share: 13.0 },
  { name: 'Agriculture & fishery', share: 12.7 },
  { name: 'Construction', share: 9.8 },
  { name: 'Mining & quarrying', share: 8.1 },
  { name: 'Transportation & storage', share: 5.9 },
  { name: 'Information & comms', share: 4.4 },
  { name: 'Financial & insurance', share: 4.1 },
  { name: 'Other sectors', share: 23.2 },
];

// Trade, 2024 (BPS, US$ billion).
export const TRADE = [
  { label: 'Exports', value: 264.7 },
  { label: 'Imports', value: 233.7 },
  { label: 'Trade balance', value: 31.0 },
];

// Recent BPS releases (2025), so visitors know when each figure was published.
export const RELEASES = [
  { date: '5 Nov 2025', release: 'GDP, Q3 2025 — grew 5.04% year on year', source: 'BPS' },
  { date: '5 Nov 2025', release: 'Unemployment, Aug 2025 — 4.85%', source: 'BPS' },
  { date: '1 Dec 2025', release: 'Inflation, Nov 2025 — 2.72% year on year', source: 'BPS' },
  { date: 'Jul 2025', release: 'Poverty, Mar 2025 — 8.47%', source: 'BPS' },
  { date: '15 May 2025', release: 'Human Development Index, 2024 — 75.02', source: 'BPS' },
];
