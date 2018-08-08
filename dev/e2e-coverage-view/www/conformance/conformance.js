google.charts.load('current', {'packages': ['table']});
google.charts.setOnLoadCallback(doSetup);

let _cache = null;
async function fetchData() {
  if (_cache) {
    return _cache;
  }
  let req = await fetch('/api/v1/stats/endpoint_hits', {credentials: 'include'});
  let result = await req.json();
  updateUAList(result);
  _cache = result;
  return result;
}

function updateUAList(results) {
  let uas = new Set();
  for (let entry of results) {
    for (let hit of entry.hits) {
      uas.add(hit.ua);
    }
  }
  let sorted = Array.from(uas).sort();
  for (let ua of sorted) {
    let option = document.createElement('option');
    option.setAttribute('value', ua);
    option.innerText = ua;
    document.getElementById('ua-filter').appendChild(option);
  }
}

let _table = null;
function getTable() {
  if (!_table) {
    _table = new google.visualization.Table(document.getElementById('table'));
  }
  return _table;
}

let _data = null;
function getData() {
  if (!_data) {
    _data = new google.visualization.DataTable({
      cols: [{id: 'name', label: 'Category', type: 'string'},
        {id: 'coverage', label: 'API Coverage', type: 'number'},
        {id: 'tests', label: 'Hits per covered API', type: 'number'}],
      rows: []
    });
  }
  _data.removeRows(0, _data.getNumberOfRows());
  return _data;
}

function filterByUA(data, ua) {
  let filtered = [];
  for (let entry of data) {
    filtered.push({...entry, hits: entry.hits.filter(x => !ua || x.ua === ua)});
  }
  return filtered;
}

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

function groupByPrefix(results, prefix) {
  const prefixSplit = fuzzPrefix(prefix).split('/');
  const prefixes = {};
  for (let entry of results) {
    if (fuzzPrefix(entry.url).startsWith(fuzzPrefix(prefix))) {
      const entrySplit = fuzzPrefix(entry.url).split('/');
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

function drawFilteredTable() {
  let e = document.getElementById('ua-filter');
  drawTable(e.options[e.selectedIndex].value);
}

async function drawTable(filter) {
  console.log(`filter: ${filter}`);
  let result = filterByUA(await fetchData(), filter);
  updateBreadcrumbs(result);
  let categories = {};
  for (let entry of result) {
    let {category, hits} = entry;
    if (!categories[category]) {
      categories[category] = {name: category, total: 0, tested: 0, hits: 0}
    }
    categories[category].total++;
    if (hits.length > 0) {
      let count = hits.reduce((total, hit) => total + hit.count, 0);
      if (count > 0) {
        categories[category].tested++;
        categories[category].hits += count;
      }
    }
  }

  let rows = [];
  for (let category of Object.values(categories)) {
    let coverage = (category.tested / category.total);
    rows.push([
        {v: category.name},
        {v: coverage * 1000, f: `${category.tested} / ${category.total} <strong>(${Math.round(coverage * 100)}%)</strong>`},
        {v: Math.round(category.hits / category.tested), f: (Math.round(category.hits / category.tested) || '').toString()}
    ])
  }

  let data = getData();
  data.addRows(rows);

  let colourFormatter = new google.visualization.ColorFormat();
  colourFormatter.addGradientRange(0, 1001, '#FFFFFF', '#DD0000', '#00DD00');
  colourFormatter.format(data, 1);

  let barFormatter = new google.visualization.BarFormat({width: 75});
  barFormatter.format(data, 2);

  let sort = getTable().getSortInfo();
  let selection = getTable().getSelection();

  let sortDict = sort ? {sortAscending: sort.ascending, sortColumn: sort.column} : {};

  getTable().draw(data, {allowHtml: true, ...sortDict});
  getTable().setSelection(selection);
  google.visualization.events.removeAllListeners(getTable());
  google.visualization.events.addListener(getTable(), 'select', () => {
    let category = rows[getTable().getSelection()[0].row][0].v;
    let filtered = filterByCategory(result, category)
    detailTable(filtered, category, [getNextPrefix(filtered, '')]);
  });
  if (selection.length) {
    rowSelected(filter, result, rows[selection[0].row][0].v);
  }
}

let _breadcrumbs = [];
let _category = null;
function updateBreadcrumbs(data, category, breadcrumbs) {
  breadcrumbs = breadcrumbs || [];
  _breadcrumbs = breadcrumbs;
  _category = category;
  const trail = [];
  const element = document.getElementById('breadcrumbs');
  element.innerHTML = '<a onclick="drawFilteredTable(); return false" href="">[categories]</a> / ';
  if (category) {
    let categoryLink = document.createElement('a');
    categoryLink.innerText = `[${category}]`;
    element.append(categoryLink);
    if (breadcrumbs.length) {
      element.append(document.createTextNode(' / '));
    }
  }
  for (let crumb of breadcrumbs || []) {
    trail.push(crumb);
    let ourTrail = trail.concat()
    let a = document.createElement('a');
    a.setAttribute('href', '');
    a.onclick = (e) => {
      e.preventDefault();
      detailTable(data, category, ourTrail);
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

function detailTable(data, category, breadcrumbs) {
  const filtered = filterByCategory(data, category);
  const basePrefix = (breadcrumbs || []).join('/');
  const prefixes = groupByPrefix(filtered, basePrefix);
  updateBreadcrumbs(filtered, category, breadcrumbs);
  let rows = [];
  for (let [prefix, endpoints] of Object.entries(prefixes)) {
    let tested = endpoints.reduce((total, endpoint) => total + (endpoint.hits.length > 0 ? 1 : 0), 0);
    let totalHits = endpoints.reduce((total, endpoint) => total + endpoint.hits.reduce((t, hit) => t + hit.count, 0), 0);
    let coverage = tested / endpoints.length;
    let nextPrefix = getNextPrefix(filtered, prefix).substring(basePrefix.length + 1);
    rows.push([
      {v: nextPrefix},
      {v: coverage * 1000, f: `${tested} / ${endpoints.length} <strong>(${Math.round(coverage * 100)}%)</strong>`},
      {v: Math.round(totalHits / tested), f: (Math.round(totalHits / tested) || '').toString()}
    ])
  }


  let dataTable = getData();
  dataTable.addRows(rows);

  let colourFormatter = new google.visualization.ColorFormat();
  colourFormatter.addGradientRange(0, 1001, '#FFFFFF', '#DD0000', '#00DD00');
  colourFormatter.format(dataTable, 1);

  let barFormatter = new google.visualization.BarFormat({width: 75});
  barFormatter.format(dataTable, 2);

  let sort = getTable().getSortInfo();

  let sortDict = sort ? {sortAscending: sort.ascending, sortColumn: sort.column} : {};

  getTable().draw(dataTable, {allowHtml: true, ...sortDict});

  google.visualization.events.removeAllListeners(getTable());
  google.visualization.events.addListener(getTable(), 'select', () => detailTable(filtered, category, breadcrumbs.concat(rows[getTable().getSelection()[0].row][0].v)));
}

async function updateFilter(filter) {
  if (_category) {
    detailTable(filterByUA(await fetchData(), filter), _category, _breadcrumbs);
  } else {
    drawTable(filter);
  }
}

function doSetup() {
  drawTable();
  document.getElementById('ua-filter').addEventListener('change', (e) => updateFilter(e.target.value));
}