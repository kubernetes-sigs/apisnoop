

def print_table(table, headers, title):
    print("===  %s  ===" % title)
    print("")

    field_lengths = [len(h) for h in headers]

    for row in table:
        for idx in range(len(field_lengths)):
            field_lengths[idx] = max(len(str(row[idx])), field_lengths[idx])

    line = []
    for idx, length in enumerate(field_lengths):
        line += [headers[idx].ljust(length)]
    print(" ".join(line))
    for row in table:
        line = []
        for idx, length in enumerate(field_lengths):
            line += [str(row[idx]).ljust(length)]
        print(" ".join(line))
    print("")

def write_to_csv(table, headers, title):
    filename = sys.argv[2] + "_" + "-".join(title.replace("/", "").lower().split()) + ".csv"
    with open("csv/" + filename, "wb") as f:
        f.write("\t".join(headers) + "\n")
        for row in table:
            f.write("\t".join([str(r) for r in row]) + "\n")

def write_to_sqlite(data, app_name):
    app, _ = App.get_or_create(name=app_name)

    for row in data:
        # TODO: change array to object or dict for better readability
        method = row[2].strip()
        url = row[1].strip()
        tags = row[-1].strip()
        count = row[3]

        app.update_from_log(method, url, tags=tags, count=count)
    commit()

def print_report(report):
    print_table(filter(lambda x: x[-1] > 0, report['by_url']), ["LEVEL", "ENDPOINT", "COUNT"], "Hit counts by URL")
    print_table(filter(lambda x: x[-1] > 0, report['by_url_and_method']), ['LEVEL', 'ENDPOINT', 'METHOD', 'COUNT'], "Hit counts by URL and method")
    print_table(report['summary_endpoint_by_level'], ['LEVEL', 'HIT', 'UNHIT', 'TOTAL', '%'], "Endpoint coverage by level (alpha / beta / stable)")
    print_table(report['summary_endpoint_total'], ['HIT', 'UNHIT', 'TOTAL', '%'], "Endpoint coverage overall")
    print_table(report['summary_method_by_level'], ['LEVEL', 'HIT', 'UNHIT', 'TOTAL', '%'], "Endpoint / method coverage by level (alpha / beta / stable)")
    print_table(report['summary_method_total'], ['HIT', 'UNHIT', 'TOTAL', '%'], "Endpoint / method coverage overall")

    write_to_csv(filter(lambda x: x[-1] > 0, report['by_url_and_method']), ['LEVEL', 'ENDPOINT', 'METHOD', 'COUNT'], "Hit counts by URL and method")
    write_to_csv(report['summary_method_by_level'], ['LEVEL', 'HIT', 'UNHIT', 'TOTAL', '%'], "Endpoint / method coverage by level (alpha / beta / stable)")

    write_to_sqlite(report['for_sqlite'], sys.argv[2])

    for item in report['unknown_urls']:
        print item
