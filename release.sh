#!/usr/bin/env bash

./build.sh

TOP="/Users/daesubkim/Desktop/STYL/web/playground-html-prototype"
s3cmd sync --exclude-from .s3ignore $TOP/ --default-mime-type="text/html" --guess-mime-type $TOP/* s3://playground.stylens.io -c ~/.s3cfg