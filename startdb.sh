#!/bin/bash
if [ -z $1 ]
then
  echo 'Usage: ./startdb.sh <1...6 number of secondaries>';
  exit;
fi

if [ $1 -gt 6 ] 
then
  echo 'Please choose a replica set count of 6 or less';
  exit;
fi

cd mongo/primary/
./run.sh
./init.sh
cd ../../
node createURI.js

cd mongo/secondary/
./run.sh $1

cd ../primary/
./init.sh

exit;
