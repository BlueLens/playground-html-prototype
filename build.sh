#!/usr/bin/env bash

browserify main.js > bundle.js
browserify main-search.js > dist/bundle-search.js
browserify main-image-box.js > dist/bundle-image-box.js
browserify main-image-box-ranking.js > dist/bundle-image-box-ranking.js