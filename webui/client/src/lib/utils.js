// this is a utilties folder

export function formatForSunburst (audit) {
  console.log({audit})
    var json = buildHierarchy(audit.data)
    return json
  }


function buildHierarchy(csv) {
  var root = createNode('root')
  var parentNode;
  var levelNode;
  var categoryNode;
  for (var i = 0; i < csv.length; i++) {
    var level = csv[i]['level']
    var category = csv[i]['category']
    var method_url = csv[i]['method + url']
    var size = +csv[i]['count'];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }

    var node = findChild(root, level)
    if (node == null) {
      node = createNode(level, {
        'color': 'level.' + level
      })
      root['children'].push(node)
    }
    parentNode = levelNode = node

    node = findChild(parentNode, category)
    if (node == null) {
      node = createNode(category,  {
        'color': 'category.' + category
      })
      parentNode['children'].push(node)
    }
    parentNode = categoryNode = node

    node = findChild(parentNode, method_url)
    if (node == null) {
      if (method_url === 'unused') {
        method_url = 'untested'
        var attrs = {'color': 'category.unused'}
        categoryNode.untested += size
        levelNode.untested += size
        root.untested += size
      } else {
        attrs = {'color': 'category.' + category}
        categoryNode.tested += size
        levelNode.tested += size
        root.tested += size
      }
      categoryNode.total += size
      levelNode.total += size
      root.total += size
      attrs.url = method_url
      node = createEndNode(method_url, attrs)
      parentNode['children'].push(node)
    }
    node['size'] = size
  }
  return root;
}

function findChild(parentNode, nodeName) {
  var children = parentNode.children;
  for (var k = 0; k < children.length; k++) {
    if (children[k]["name"] === nodeName) {
      return children[k];
    }
  }
  return null
}

function createNode(name, attrs) {
  var node = {
    "name": name,
    "children": [],
    'tested': 0,
    'untested': 0,
    'total': 0,
  };
  if (attrs) {
    node = Object.assign(node, attrs)
  }
  return node
}

function createEndNode(name, attrs) {
  var node = {
    "name": name,
  };
  if (attrs) {
    node = Object.assign(node, attrs)
  }
  return node
}
