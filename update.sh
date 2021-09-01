#!/usr/bin/sh

psql -U apisnoop -d apisnoop -h snoopdb.apisnoop -f 505_output_coverage_jsons.sql
echo "coverage jsons updated!"
echo "commit your changes and push!"
