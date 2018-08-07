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

async function drawTable(filter) {
  filter = filter || '';
  console.log(`filter: ${filter}`);
  let result = await fetchData();
  let categories = {};
  for (let entry of result) {
    let {category, hits} = entry;
    if (!categories[category]) {
      categories[category] = {name: category, total: 0, tested: 0, hits: 0}
    }
    categories[category].total++;
    if (hits.length > 0) {
      let count = hits.reduce((total, hit) => total + ((filter === '' || hit.ua.indexOf(filter) === 0) ? hit.count : 0), 0);
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
  google.visualization.events.addListener(getTable(), 'select', () => rowSelected(filter, result, rows[getTable().getSelection()[0].row][0].v));
  if (selection.length) {
    rowSelected(filter, result, rows[selection[0].row][0].v);
  }
}

let _detailTable = null;
function rowSelected(filter, result, category) {
  let information = result.filter(({category: c}) => c === category);
  let rows = [];
  for (let {method, url, hits} of information) {
    rows.push({c: [
        {v: url},
        {v: method},
        {v: hits.reduce((total, hit) => total + ((filter === '' || hit.ua.indexOf(filter) === 0) ? hit.count : 0), 0)}
      ]});
  }

  let data = new google.visualization.DataTable({
    cols: [
      {id: 'endpoint', label: 'Endpoint', type: 'string'},
      {id: 'method', label: 'Method', type: 'string'},
      {id: 'hits', label: 'Hits', type: 'number'},
    ],
    rows
  });

  document.getElementById('category-name').innerText = category;

  let barFormatter = new google.visualization.BarFormat({width: 75});
  barFormatter.format(data, 2);

  let sorting = {};
  if (_detailTable) {
    let oldSort = _detailTable.getSortInfo();
    if (oldSort) {
      sorting = {sortAscending: oldSort.ascending, sortColumn: oldSort.column};
    }
  }

  _detailTable = new google.visualization.Table(document.getElementById('category-table'));
  _detailTable.draw(data, {allowHtml: true, ...sorting});

  console.log(category, information);
}

function doSetup() {
  drawTable();
  document.getElementById('ua-filter').addEventListener('change', (e) => drawTable(e.target.value));
}