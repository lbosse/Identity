docker build -t "p3/secondary" .
for((number=1;number<=$1;number++))
  {
    docker volume create node$number
    docker run -d -v node$number:/data/db -v rs:/rs -l p3 -t p3/secondary
    docker exec -it $(docker ps -l --format "{{.ID}}" --filter label=p3) ./rs/init.secondary.sh $number 
  }

exit 0
