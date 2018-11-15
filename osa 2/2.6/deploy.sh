#!/bin/sh
npm run build;

rm -rf ../../osa\ 3/3.1/build;

cp -r build ../../osa\ 3/3.1/;