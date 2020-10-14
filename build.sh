#!/bin/bash

#stop / remove all of Docker containers
docker stop $(docker ps -a -q) && docker rm -f $(docker ps -a -q)

# Remove all Docker images
docker rmi $(docker images -q)

docker build -t books:1.0.0 ./books-service

docker run --name=books -d -p 8081:8080 books:1.0.0

# Docker CLI
PORT="$(docker ps|grep books|sed 's/.*0.0.0.0://g'|sed 's/->.*//g')"

# 1st API's
echo 'Check Ping API';
curl -X GET http://localhost:$PORT/ping

# 2nd API's
# curl -X GET http://localhost:$PORT/books?isbn=0198526636

# 3rd API's
# curl -X POST \
#  http://localhost:8081/books \
#  -H 'Content-Type: application/json' \
#  -d '{
#	"author": "Jawaharlal Nehru",
#	"title": "The Discovery of India",
#	"isbn": "0191118866",
#	"releaseDate": "1946-11-14"
# }'

# 4th API's
# curl -X PUT \
#  http://localhost:$PORT/books \
#  -H 'Content-Type: application/json' \
#  -d '{
#	"author": "Pandit Javal Lal Nehru",
#	"title": "The Discovery of India",
#	"isbn": "0191118866",
#	"releaseDate": "1946-11-14"
#}'
