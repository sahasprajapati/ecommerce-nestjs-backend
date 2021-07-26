#!/bin/bash
# set -e

if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi


SERVER="my_database_server";
# POSTGRESS_PASSWORD="mysecretpassword";
# POSTGRESS_DATABASE="my_database";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -e POSTGRES_PASSWORD=$POSTGRESS_PASSWORD \
  -e PGPASSWORD=$POSTGRESS_PASSWORD \
  -p 5432:5432 \
  -d postgres

# wait for pg to start
echo "sleep wait for pg-server [$SERVER] to start";
SLEEP 3;

# create the POSTGRESS_DATABASE 
echo "CREATE DATABASE $POSTGRESS_DATABASE ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "\l" | docker exec -i $SERVER psql -U postgres