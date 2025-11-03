#!/usr/bin/env bash

docker compose up --build
echo "Creating mongo users..."
mongosh --authenticationDatabase admin --host mongo --eval "db.createUser({user: 'application', pwd: '123cambiar', roles: [{role: 'readWrite', db: 'test1'}]});"
echo "Mongo users created."