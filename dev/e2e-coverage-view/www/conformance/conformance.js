google.charts.load('current', {'packages': ['table']});
google.charts.setOnLoadCallback(doSetup);

let _cache = null;
async function fetchData() {
  if (_cache) {
    return _cache;
  }
  let req = await fetch('/api/v1/stats/endpoint_hits', {credentials: 'include'});
  let result = await req.json();
  _cache = result;
  return result;
}

function updateUAList(data) {
  let uas = new Set();
  for (let entry of data) {
    for (let hit of entry.hits) {
      uas.add(hit.ua);
    }
  }
  let sorted = Array.from(uas).sort();
  for (let ua of sorted) {
    let option = document.createElement('option');
    option.setAttribute('value', ua);
    option.innerText = ua;
    state.filterElement.appendChild(option);
  }
}

const state = {
  table: null, // implicitly contains current selection/sorting
  filterElement: null, // implicitly contains selected UA filter
  category: null,
  breadcrumbs: []
};

// Returns the Google Charts Table we're using. We only need to keep this around
// instead of recreating it on the fly because it knows what our current sort
// and selection settings are.
function getTable() {
  if (!state.table) {
    state.table = new google.visualization.Table(document.getElementById('table'));
  }
  return state.table;
}

// Generates a Google Charts DataTable with suitable headings.
function makeDataTable() {
  return new google.visualization.DataTable({
    cols: [{id: 'name', label: 'Category', type: 'string'},
      {id: 'coverage', label: 'API Coverage', type: 'number'},
      {id: 'tests', label: 'Hits per covered API', type: 'number'}],
    rows: []
  });
}

// Returns the data including only hits from the given UA.
function filterByUA(data, ua) {
  let filtered = [];
  for (let entry of data) {
    filtered.push({...entry, hits: entry.hits.filter(x => !ua || x.ua === ua)});
  }
  return filtered;
}

// Returns the data including only endpoints that are part of the given category.
function filterByCategory(data, category) {
  return data.filter((x) => x.category === category);
}

// The API spec isn't consistent on what the placeholders should be called,
// (e.g. /namespaces/{namespace} versus /namespaces/{name})
// so we just blow them away here to make sure we don't generate spurious
// categories.
function fuzzPrefix(prefix) {
  return prefix.replace(/{.*?}/g, '{}')
}

// Given a list of results, groups them by the first component of their URL
// after 'prefix' and returns a prefix -> results dict.
// Results without the given prefix are omitted.
function groupByPrefix(results, prefix) {
  const fuzzedPrefix = fuzzPrefix(prefix);
  const prefixSplit = fuzzedPrefix.split('/');
  const prefixes = {};
  for (let entry of results) {
    const fuzzedURL = fuzzPrefix(entry.url);
    if (fuzzedURL.startsWith(fuzzedPrefix)) {
      const entrySplit = fuzzPrefix(fuzzedURL).split('/');
      // The string test done earlier is insufficient because otherwise
      // substring  matches on the last component (e.g. /log vs /logs) would
      // still make it through.
      if (!entrySplit.slice(0, prefixSplit.length).every((value, index) => value === prefixSplit[index])) {
        continue;
      }

      let entryPrefix = entrySplit.slice(0, prefixSplit.length + 1).join('/');
      if (!prefixes[entryPrefix]) {
        prefixes[entryPrefix] = [];
      }
      prefixes[entryPrefix].push(entry);
    }
  }
  return prefixes;
}

// Returns the next prefix such that the returned prefix has at least
// two entries (to save on pointless drilling through the UI).
function getNextPrefix(results, prefix) {
  while (true) {
    let grouped = groupByPrefix(results, prefix);
    if (Object.keys(grouped).length !== 1) {
      break;
    }
    let nextPrefix = Object.keys(grouped)[0];
    if (prefix === nextPrefix) {
      break;
    }
    let nextResults = groupByPrefix(results, nextPrefix);
    if (Object.keys(nextResults).length > 0) {
      prefix = nextPrefix;
    } else {
      break;
    }
  }
  return prefix;
}

// Like drawCategoryTable, for when you don't know anything
async function drawFilteredCategoryTable() {
  let e = state.filterElement;
  await drawCategoryTable(await fetchData(), e.options[e.selectedIndex].value);
}

// Generates a row of the table.
function generateRow(name, totalEndpoints, testedEndpoints, totalHits) {
  const coverage = testedEndpoints / totalEndpoints;
  const testHits = totalHits / testedEndpoints;
  return [
    {v: name},
    {v: coverage * 1000, f: `${testedEndpoints} / ${totalEndpoints} <strong>(${Math.round(coverage * 100)}%)</strong>`},
    {v: testHits, f: (Math.round(testHits) || '').toString()} // || '' prevents displaying NaN when there is no coverage.
  ]
}

function formatDataTable(dataTable) {
  // For some reason, what the table looks like is a function of the actual data
  // instead of the presentation thereof (???), so we can't just do this at
  // table setup and instead must do it whenever we update the data
  // (even if we had reused a DataTable)
  let colourFormatter = new google.visualization.ColorFormat();
  colourFormatter.addGradientRange(0, 1001, '#FFFFFF', '#DD0000', '#00DD00');
  colourFormatter.format(dataTable, 1);

  let barFormatter = new google.visualization.BarFormat({width: 75});
  barFormatter.format(dataTable, 2);
}


// Redraws the table, but keeps the current sorting and selected index.
// Handy if it's really the same data being shown, but with different filtering
// being applied.
function drawWithCurrentState(table, dataTable, drawOpts) {
  const sort = table.getSortInfo();
  const selection = table.getSelection();
  const sortDict = sort ? {sortAscending: sort.ascending, sortColumn: sort.column} : {};
  table.draw(dataTable, {...drawOpts, ...sortDict});
  table.setSelection(selection);
}


// Draws a table by category, filtering the data for the given user-agent
async function drawCategoryTable(data, filter) {
  const filteredData = filterByUA(data, filter);
  updateBreadcrumbs(filteredData);

  const categories = {};
  for (let entry of filteredData) {
    const {category, hits} = entry;
    if (!categories[category]) {
      categories[category] = {name: category, total: 0, tested: 0, hits: 0}
    }
    categories[category].total++;
    if (hits.length > 0) {
      const count = hits.reduce((total, hit) => total + hit.count, 0);
      if (count > 0) {
        categories[category].tested++;
        categories[category].hits += count;
      }
    }
  }

  const rows = Object.values(categories).map(x => generateRow(x.name, x.total, x.tested, x.hits));

  const dataTable = makeDataTable();
  dataTable.addRows(rows);

  formatDataTable(dataTable);

  const table = getTable();
  drawWithCurrentState(table, dataTable, {allowHtml: true});

  google.visualization.events.removeAllListeners(table);
  google.visualization.events.addListener(table, 'select', () => {
    const category = rows[table.getSelection()[0].row][0].v;
    const categoryData = filterByCategory(filteredData, category);
    drawDetailTable(categoryData, category, [getNextPrefix(categoryData, '')]);
  });
}

function updateBreadcrumbs(data, category, breadcrumbs) {
  breadcrumbs = breadcrumbs || [];
  state.breadcrumbs = breadcrumbs;
  state.category = category;
  const trail = [];
  const element = document.getElementById('breadcrumbs');
  element.innerHTML = '<a onclick="drawFilteredCategoryTable(); return false" href="">[categories]</a> / ';
  if (category) {
    const categoryLink = document.createElement('a');
    categoryLink.innerText = `[${category}]`;
    element.append(categoryLink);
    if (breadcrumbs.length) {
      element.append(document.createTextNode(' / '));
    }
  }
  for (let crumb of breadcrumbs || []) {
    trail.push(crumb);
    const ourTrail = trail.concat(); // copy it for the benefit of our lambda
    const a = document.createElement('a');
    a.setAttribute('href', '');
    a.onclick = (e) => {
      e.preventDefault();
      drawDetailTable(data, category, ourTrail);
    };
    if (crumb.startsWith('/')) {
      crumb = crumb.substr(1);
    }
    a.innerText = crumb;
    element.appendChild(a);
    element.appendChild(document.createTextNode(' / '))
  }
  element.removeChild(element.lastChild);
}

function drawDetailTable(data, category, breadcrumbs) {
  const filtered = filterByCategory(data, category);
  const basePrefix = (breadcrumbs || []).join('/');
  const prefixes = groupByPrefix(filtered, basePrefix);
  updateBreadcrumbs(filtered, category, breadcrumbs);

  const rows = Object.entries(prefixes).map(([prefix, endpoints]) => {
    const tested = endpoints.reduce((total, endpoint) => total + (endpoint.hits.length > 0 ? 1 : 0), 0);
    const totalHits = endpoints.reduce((total, endpoint) => total + endpoint.hits.reduce((t, hit) => t + hit.count, 0), 0);
    const nextPrefix = getNextPrefix(filtered, prefix).substring(basePrefix.length + 1);
    return generateRow(nextPrefix, endpoints.length, tested, totalHits);
  });

  const dataTable = makeDataTable();
  dataTable.addRows(rows);

  formatDataTable(dataTable);

  const table = getTable();
  const sort = table.getSortInfo();
  const sortDict = sort ? {sortAscending: sort.ascending, sortColumn: sort.column} : {};
  table.draw(dataTable, {allowHtml: true, ...sortDict});

  google.visualization.events.removeAllListeners(table);
  google.visualization.events.addListener(table, 'select', () => {
    const selectedGroup = rows[table.getSelection()[0].row][0].v;
    drawDetailTable(filtered, category, breadcrumbs.concat(selectedGroup));
  });
}

async function updateFilter(filter) {
  if (state.category) {
    drawDetailTable(filterByUA(await fetchData(), filter), state.category, state.breadcrumbs);
  } else {
    await drawCategoryTable(await fetchData(), filter);
  }
}

async function doSetup() {
  state.filterElement = document.getElementById('ua-filter');
  state.filterElement.addEventListener('change', (e) => updateFilter(e.target.value));
  const data = await fetchData();
  updateUAList(data);
  await drawCategoryTable(data);
}
