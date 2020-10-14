#!/bin/bash

minikube stop
minikube delete
minikube start
# minikube --memory 4096 start --mount-string /var/www/html/books:/mnt/data --mount
# minikube start --mount-string /var/www/html/books:/mnt/data --mount

echo "Switch to Docker daemon inside Minikube VM"
eval $(minikube -p minikube docker-env)

echo "Creating the book deployment and service..."
#docker build -f ./books-service/Dockerfile -t books:1.0.0 ./books-service
docker build -t books:1.0.0 ./books-service

sleep 10
kubectl create -f ./kubernetes/kbook.yaml

# URL
# minikube service kbook --url

# 1st API's
echo 'Check Ping API';
curl -X GET $(minikube service kbook --url)/ping