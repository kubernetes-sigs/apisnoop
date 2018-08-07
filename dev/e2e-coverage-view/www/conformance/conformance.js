google.charts.load('current', {'packages': ['table']});
google.charts.setOnLoadCallback(drawTable);

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

async function drawTable() {
  let result = await fetchData();
  let categories = {};
  for (let entry of result) {
    let {category, hits} = entry;
    if (!categories[category]) {
      categories[category] = {name: category, total: 0, tested: 0, hits: 0}
    }
    categories[category].total++;
    if (hits.length > 0) {
      categories[category].tested++;
      categories[category].hits += hits.reduce((total, hit) => total + hit.count, 0);
    }
  }

  let rows = [];
  for (let category of Object.values(categories)) {
    let coverage = (category.tested / category.total);
    rows.push({c: [
        {v: category.name},
        {v: coverage * 1000, f: `${category.tested} / ${category.total} <strong>(${Math.round(coverage * 100)}%)</strong>`},
        {v: Math.round(category.hits / category.tested), f: Math.round(category.hits / category.tested) || ''}
    ]})
  }


  let data = new google.visualization.DataTable({
    cols: [{id: 'name', label: 'Category', type: 'string'},
      {id: 'coverage', label: 'API Coverage', type: 'number'},
      {id: 'tests', label: 'Hits per covered API', type: 'number'}],
    rows: rows
  });

  let colourFormatter = new google.visualization.ColorFormat();
  colourFormatter.addGradientRange(0, 1001, '#FFFFFF', '#DD0000', '#00DD00');
  colourFormatter.format(data, 1);

  let barFormatter = new google.visualization.BarFormat({width: 75});
  barFormatter.format(data, 2);

  let table = new google.visualization.Table(document.getElementById('table'));
  table.draw(data, {allowHtml: true});
  google.visualization.events.addListener(table, 'select', () => rowSelected(result, rows[table.getSelection()[0].row].c[0].v));
}

function rowSelected(result, category) {
  let information = result.filter(({category: c}) => c === category);
  let rows = [];
  for (let {method, url, hits} of information) {
    rows.push({c: [
        {v: url},
        {v: method},
        {v: hits.reduce((total, hit) => total + hit.count, 0)}
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

  let table = new google.visualization.Table(document.getElementById('category-table'));
  table.draw(data, {allowHtml: true});

  console.log(category, information);
}