./build.sh
for ((number=0;number<$1;number++))
  {
    docker volume create ondisk$number
    docker run -d -v ondisk$number:/data/db -l p3 -t p3/ondisk
  }
exit 0
