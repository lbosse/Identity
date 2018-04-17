./build.sh
for ((number=0;number<$1;number++))
  {
    docker volume create memory$number
    docker run -d -v memory$number:/data/db -v $2:/tmp/p3 -l p3 -t p3/memory
  }
exit 0
