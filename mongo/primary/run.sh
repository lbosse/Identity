docker build -t "p3/primary" .
docker volume create node0
docker volume create rs
docker run -d -v node0:/data/db -v rs:/rs -l primary -t p3/primary

exit 0
