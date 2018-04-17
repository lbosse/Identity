#!/bin/bash
docker exec -it $(docker ps -l --format "{{.ID}}" --filter label=primary) ./rs/init.sh
