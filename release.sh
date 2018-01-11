#!/usr/bin/env bash

TOP="/Users/daesubkim/Desktop/STYL/web/playground-html-prototype"
s3cmd sync --exclude=".git/*" --exclude=".idea/*" --exclude="README.md" --exclude="release.sh" --exclude="LICENSE" --recursive --default-mime-type="text/html" --guess-mime-type $TOP/* s3://playground.stylelens.io -c ~/.s3cfg