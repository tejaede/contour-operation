#!/bin/bash

npm run start
echo "Wait for services to start (30sec)"
sleep 10
echo "20..."
sleep 10
echo "10..."
sleep 5
echo "5..."
sleep 1
echo "4..."
sleep 1
echo "3..."
sleep 1
echo "2..."
sleep 1
echo "1..."
sleep 1
npm run test:istanbul
docker-compose down
npm run stop