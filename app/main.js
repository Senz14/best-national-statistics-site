// NusaStat router: hash routes for every page, so each section is reached by a link.
//   #/                  dashboard
//   #/chart/<series>    one indicator, 2015–2024, chart + table
//   #/population         population
//   #/economy            economy
//   #/prices             prices & inflation
//   #/labour             work & living standards
//   #/provinces[/<sort>] provinces table (sort by pop, name, area, density)
//   #/about              about & sources
//
// window.__shotReady is false while a page renders and true once it is on screen,
// so a screenshot script knows when to capture.

import { about, chartPage, economy, home, labour, missing, population, prices, provinces } from './views.js';

const app = document.getElementById('app');
const nav = document.querySelectorAll('header nav a');

function route() {
  return location.hash.replace(/^#/, '') || '/';
}

function render() {
  window.__shotReady = false;
  const r = route();
  const query = (document.getElementById('q')?.value ?? '').trim();
  let html;
  let title;
  const chart = r.match(/^\/chart\/([a-zA-Z]+)$/);
  const prov = r.match(/^\/provinces(?:\/([a-z]+))?$/);
  if (r === '/') {
    html = home(query);
    title = 'NusaStat — Indonesia in numbers';
  } else if (chart) {
    html = chartPage(chart[1]);
    title = `${chart[1]} | NusaStat`;
  } else if (r === '/population') {
    html = population();
    title = 'Population | NusaStat';
  } else if (r === '/economy') {
    html = economy();
    title = 'Economy | NusaStat';
  } else if (r === '/prices') {
    html = prices();
    title = 'Prices & inflation | NusaStat';
  } else if (r === '/labour') {
    html = labour();
    title = 'Work & living standards | NusaStat';
  } else if (prov) {
    html = provinces(prov[1]);
    title = 'Provinces | NusaStat';
  } else if (r === '/about') {
    html = about();
    title = 'About & sources | NusaStat';
  } else {
    html = missing();
    title = 'Not found | NusaStat';
  }
  document.title = title;
  app.innerHTML = html;
  nav.forEach((a) => {
    const href = a.getAttribute('href');
    a.classList.toggle('current', href === `#${r.split('/').slice(0, 2).join('/')}` || (r === '/' && href === '#/'));
  });
  const q = document.getElementById('q');
  if (q) {
    q.addEventListener('input', () => {
      app.innerHTML = home(q.value);
      document.getElementById('q').focus();
      const v = q.value;
      document.getElementById('q').setSelectionRange(v.length, v.length);
    });
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
