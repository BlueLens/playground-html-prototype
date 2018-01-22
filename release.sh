#!/usr/bin/env bash

browserify main.js > bundle.js

TOP="/Users/daesubkim/Desktop/STYL/web/playground-html-prototype"
s3cmd sync --exclude-from .s3ignore $TOP/ --default-mime-type="text/html" --guess-mime-type $TOP/* s3://playground.stylelens.io -c ~/.s3cfg