from bottle import route, run


def start_webserver(host='0.0.0.0', port=9090):
    run(host=host, port=port, debug=True)
