from collections import defaultdict

def defaultdicttree():
    return defaultdict(defaultdicttree)

def defaultdict_to_dict(d):
    if isinstance(d, defaultdict):
        new_d = {}
        for k, v in d.items():
            new_d[k] = defaultdict_to_dict(v)
        d = new_d
    return d
