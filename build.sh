#!/usr/bin/env bash

browserify main.js > bundle.js
browserify main-search.js > dist/bundle-search.js