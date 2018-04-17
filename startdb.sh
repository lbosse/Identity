#!/bin/bash
if [ $1 -gt 6 ] 
then
  echo 'Please choose a replica set count of 6 or less';
  exit;
fi

cd mongo/primary/
./run.sh
./init.sh

cd ../secondary/
./run.sh $1

cd ../primary/
./init.sh

exit;
