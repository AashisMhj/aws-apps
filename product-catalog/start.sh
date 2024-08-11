#!/bin/sh

# Start Nginx in the background
# nginx -g "dameon off"
nginx &&

# Start the Fastify server using pnpm
pnpm start

# Keep the script running to ensure container stays alive
# tail -f /dev/null