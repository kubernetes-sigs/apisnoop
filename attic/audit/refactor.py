import json
import sys

infile=sys.argv[1]
outfile=sys.argv[2]
raw=json.loads(open(infile).read())
root = {
    "name": "root",
    "children": []
}
level_children = []
for level, categories in raw['sunburst'].items():
    category_children = []
    for category, paths in categories.items():
        path_children = []
        for path, methods in paths.items():
            method_children = []
            for method, method_info in methods.items():
                method_info["name"] = method
                method_info["color"] = "green"
                method_info["size"] = "1"
                method_children.append(method_info)
            path_children.append(
                {"name": path,
                 "children": method_children})
            path_children.append(
                {"name": path,
                 "children": method_children})
        category_children.append(
            {"name": category,
             "children": path_children})
    root['children'].append(
        {"name": level,
         "children": category_children})
open(outfile,'w').write(json.dumps({"tree": root}))
# import ipdb; ipdb.set_trace(context=60)
