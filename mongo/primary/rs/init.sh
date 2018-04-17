#!/bin/bash
node /rs/init.js
mongo --eval "load('/rs/rsInit.js')"

DIRECTORY=/rs
for i in $DIRECTORY/rsAdd*.js; do
    # Process $i
    mongo --eval "load('$i')"
done

mongo --eval "load('/rs/cfg.js')"
