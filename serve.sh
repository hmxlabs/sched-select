#!/bin/bash

# Stop and remove any existing container with the same name
docker rm -f sched-select-nginx 2>/dev/null

# Run nginx container serving the build directory
docker run -d \
  --name sched-select-nginx \
  -p 8080:80 \
  -v "$(pwd)/build:/usr/share/nginx/html:ro" \
  nginx:alpine

echo "Server running at http://localhost:8080/"
echo "To stop: docker rm -f sched-select-nginx"

