<html lang='en-gb'>
<head>
    <meta charset="UTF-8" />
    <title>Snoop Progress Report</title>
    <meta content="Oz document" name="description" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <link href="http://ozviz.io/oz.svg" rel="shortcut icon" type="image/x-icon" />
    <link href="main.css" rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/vega@5.9.0" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-lite@4.0.2" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-embed@6.0.0" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML" type="text/javascript"></script>
</head>
<body>
    <main>
        <h1>APISnoop Progress reports</h1>
        <div id="prologue">
            <p>These charts track the progress on conformance coverage for kubernetes stable endpoints.</p>
            <p>In these, we only look at endpoints that are in GA, and qualify for conformance tests (do not use vendor specific features like volumes and other non-conformant behaviour).</p>
            <p>We also limited the set to only endpoints still around today. Historically stable endpoints that have been deprecated were excluded from our dataset.</p>
        </div>
        <h2>Stable Endpoint Coverage Over Time</h2><em>In this, we look at the total endpoints per release and how many came in with tests. We also track the overall testing coverage per release.</em>
        <div>
            <div id="viz-17dd01b5-3a89-4a8a-9163-a49a83341d84"></div>
            <script type="text/javascript">
                vegaEmbed('#viz-17dd01b5-3a89-4a8a-9163-a49a83341d84', {
                    "data": {
                        "values": [{
                            "release": "1.9.0",
                            "type": "tested",
                            "total": 53,
                            "order": "a"
                        }, {
                            "release": "1.9.0",
                            "type": "untested",
                            "total": 211,
                            "order": "c"
                        }, {
                            "release": "1.9.0",
                            "type": "new_untested",
                            "total": 49,
                            "order": "d"
                        }, {
                            "release": "1.9.0",
                            "type": "new_tested",
                            "total": 14,
                            "order": "b"
                        }, {
                            "release": "1.10.0",
                            "type": "tested",
                            "total": 67,
                            "order": "a"
                        }, {
                            "release": "1.10.0",
                            "type": "untested",
                            "total": 260,
                            "order": "c"
                        }, {
                            "release": "1.10.0",
                            "type": "new_untested",
                            "total": 5,
                            "order": "d"
                        }, {
                            "release": "1.10.0",
                            "type": "new_tested",
                            "total": 4,
                            "order": "b"
                        }, {
                            "release": "1.11.0",
                            "type": "tested",
                            "total": 71,
                            "order": "a"
                        }, {
                            "release": "1.11.0",
                            "type": "untested",
                            "total": 265,
                            "order": "c"
                        }, {
                            "release": "1.11.0",
                            "type": "new_untested",
                            "total": 2,
                            "order": "d"
                        }, {
                            "release": "1.11.0",
                            "type": "new_tested",
                            "total": 0,
                            "order": "b"
                        }, {
                            "release": "1.12.0",
                            "type": "tested",
                            "total": 71,
                            "order": "a"
                        }, {
                            "release": "1.12.0",
                            "type": "untested",
                            "total": 267,
                            "order": "c"
                        }, {
                            "release": "1.12.0",
                            "type": "new_untested",
                            "total": 1,
                            "order": "d"
                        }, {
                            "release": "1.12.0",
                            "type": "new_tested",
                            "total": 0,
                            "order": "b"
                        }, {
                            "release": "1.13.0",
                            "type": "tested",
                            "total": 72,
                            "order": "a"
                        }, {
                            "release": "1.13.0",
                            "type": "untested",
                            "total": 267,
                            "order": "c"
                        }, {
                            "release": "1.13.0",
                            "type": "new_untested",
                            "total": 0,
                            "order": "d"
                        }, {
                            "release": "1.13.0",
                            "type": "new_tested",
                            "total": 0,
                            "order": "b"
                        }, {
                            "release": "1.14.0",
                            "type": "tested",
                            "total": 72,
                            "order": "a"
                        }, {
                            "release": "1.14.0",
                            "type": "untested",
                            "total": 267,
                            "order": "c"
                        }, {
                            "release": "1.14.0",
                            "type": "new_untested",
                            "total": 16,
                            "order": "d"
                        }, {
                            "release": "1.14.0",
                            "type": "new_tested",
                            "total": 2,
                            "order": "b"
                        }, {
                            "release": "1.15.0",
                            "type": "tested",
                            "total": 81,
                            "order": "a"
                        }, {
                            "release": "1.15.0",
                            "type": "untested",
                            "total": 276,
                            "order": "c"
                        }, {
                            "release": "1.15.0",
                            "type": "new_untested",
                            "total": 0,
                            "order": "d"
                        }, {
                            "release": "1.15.0",
                            "type": "new_tested",
                            "total": 0,
                            "order": "b"
                        }, {
                            "release": "1.16.0",
                            "type": "tested",
                            "total": 94,
                            "order": "a"
                        }, {
                            "release": "1.16.0",
                            "type": "untested",
                            "total": 263,
                            "order": "c"
                        }, {
                            "release": "1.16.0",
                            "type": "new_untested",
                            "total": 2,
                            "order": "d"
                        }, {
                            "release": "1.16.0",
                            "type": "new_tested",
                            "total": 26,
                            "order": "b"
                        }, {
                            "release": "1.17.0",
                            "type": "tested",
                            "total": 127,
                            "order": "a"
                        }, {
                            "release": "1.17.0",
                            "type": "untested",
                            "total": 258,
                            "order": "c"
                        }, {
                            "release": "1.17.0",
                            "type": "new_untested",
                            "total": 1,
                            "order": "d"
                        }, {
                            "release": "1.17.0",
                            "type": "new_tested",
                            "total": 0,
                            "order": "b"
                        }, {
                            "release": "1.18.0",
                            "type": "tested",
                            "total": 136,
                            "order": "a"
                        }, {
                            "release": "1.18.0",
                            "type": "untested",
                            "total": 250,
                            "order": "c"
                        }, {
                            "release": "1.18.0",
                            "type": "new_untested",
                            "total": 0,
                            "order": "d"
                        }, {
                            "release": "1.18.0",
                            "type": "new_tested",
                            "total": 0,
                            "order": "b"
                        }, {
                            "release": "1.19.0",
                            "type": "tested",
                            "total": 145,
                            "order": "a"
                        }, {
                            "release": "1.19.0",
                            "type": "untested",
                            "total": 241,
                            "order": "c"
                        }, {
                            "release": "1.19.0",
                            "type": "new_untested",
                            "total": 0,
                            "order": "d"
                        }, {
                            "release": "1.19.0",
                            "type": "new_tested",
                            "total": 14,
                            "order": "b"
                        }]
                    },
                    "width": "900",
                    "height": "600",
                    "encoding": {
                        "x": {
                            "field": "release",
                            "type": "nominal",
                            "sort": null
                        },
                        "y": {
                            "field": "total",
                            "type": "quantitative",
                            "title": "Total Stable! Endpoints"
                        },
                        "color": {
                            "field": "type",
                            "type": "nominal",
                            "scale": {
                                "range": ["#9EEBCF", "#FBF1A9", "#19A974", "#FF4136"]
                            }
                        },
                        "tooltip": [{
                            "field": "type",
                            "type": "ordinal"
                        }, {
                            "field": "total",
                            "type": "quantitative"
                        }],
                        "order": {
                            "field": "order"
                        }
                    },
                    "mark": {
                        "type": "bar"
                    }
                }, {
                    "mode": "vega-lite"
                });
            </script>
        </div>
        <p>There's some interesting takeaways in this chart. For one, it wasn't possible to see which tests where hitting which endpoints until 1.12, and the tooling to better track this until a few releases later. Because of this, there's little coverage increase for releases 1.11 through 1.14; new tests were being added, but they weren't hitting new endpoints.</p>
        <p>In 1.16, the community set a requirement for any endpoint promoted to come with a conformance test. That release was a standout in terms of coverage: a significant number of new endpoints were added, with the majority promoted with tests</p>
        <p>Our latest release is also looking extremely positive, with every new endpoint promoted comiong in with a test, along with the general testing coverage going up.</p>
        <h2>New endpoints per release and their current coverage</h2><em>In this chart we look at how many endpoints were promoted per release, and of that group, how many are untested today.</em>
        <p>We start the report at 1.8, so this will have the most new endpoints (since it really starts with all the existing endpoints at that time). This report highlights the importance of having a gate that ensures any promoted endpoint comes with a test. This became an initiative in 1.16 and that release has one of the best ratios of introduced to tested. 1.19 is also looking impressive, with currently 100% coverage on all its endpoints.</p>
        <div>
            <div id="viz-372f7248-c723-44a9-b591-a8a8080e88fb"></div>
            <script type="text/javascript">
                vegaEmbed('#viz-372f7248-c723-44a9-b591-a8a8080e88fb', {
                    "data": {
                        "values": [{
                            "release": "1.9.0",
                            "type": "tested",
                            "total": 63
                        }, {
                            "release": "1.9.0",
                            "type": "still_untested",
                            "total": 46
                        }, {
                            "release": "1.10.0",
                            "type": "tested",
                            "total": 9
                        }, {
                            "release": "1.10.0",
                            "type": "still_untested",
                            "total": 5
                        }, {
                            "release": "1.11.0",
                            "type": "tested",
                            "total": 2
                        }, {
                            "release": "1.11.0",
                            "type": "still_untested",
                            "total": 2
                        }, {
                            "release": "1.12.0",
                            "type": "tested",
                            "total": 1
                        }, {
                            "release": "1.12.0",
                            "type": "still_untested",
                            "total": 1
                        }, {
                            "release": "1.13.0",
                            "type": "tested",
                            "total": 0
                        }, {
                            "release": "1.13.0",
                            "type": "still_untested",
                            "total": 0
                        }, {
                            "release": "1.14.0",
                            "type": "tested",
                            "total": 18
                        }, {
                            "release": "1.14.0",
                            "type": "still_untested",
                            "total": 9
                        }, {
                            "release": "1.15.0",
                            "type": "tested",
                            "total": 0
                        }, {
                            "release": "1.15.0",
                            "type": "still_untested",
                            "total": 0
                        }, {
                            "release": "1.16.0",
                            "type": "tested",
                            "total": 28
                        }, {
                            "release": "1.16.0",
                            "type": "still_untested",
                            "total": 2
                        }, {
                            "release": "1.17.0",
                            "type": "tested",
                            "total": 1
                        }, {
                            "release": "1.17.0",
                            "type": "still_untested",
                            "total": 1
                        }, {
                            "release": "1.18.0",
                            "type": "tested",
                            "total": 0
                        }, {
                            "release": "1.18.0",
                            "type": "still_untested",
                            "total": 0
                        }, {
                            "release": "1.19.0",
                            "type": "tested",
                            "total": 14
                        }, {
                            "release": "1.19.0",
                            "type": "still_untested",
                            "total": 0
                        }]
                    },
                    "width": "900",
                    "height": "600",
                    "encoding": {
                        "x": {
                            "field": "release",
                            "type": "nominal",
                            "sort": null
                        },
                        "y": {
                            "field": "total",
                            "type": "quantitative",
                            "title": "Total Stable! Endpoints"
                        },
                        "tooltip": [{
                            "field": "type",
                            "type": "ordinal"
                        }, {
                            "field": "total",
                            "type": "quantitative"
                        }],
                        "color": {
                            "field": "type",
                            "type": "nominal",
                            "scale": {
                                "range": ["#FF4136", "#19A974"]
                            }
                        }
                    },
                    "mark": {
                        "type": "bar",
                        "tooltip": true
                    }
                }, {
                    "mode": "vega-lite"
                });
            </script>
        </div>
    </main>
    <div class="vg-tooltip" id="vis-tooltip"></div>
    <script src="js/compiled/oz.js" type="text/javascript"></script>
    </body>
</html>
