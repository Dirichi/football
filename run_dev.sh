#!/bin/bash
# Small script to setup the football application.

# COLORS
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
PLAIN='\033[0m'

# STARTING REDIS
REDIS_CLI_RESPONSE=$(redis-cli ping)
if [ "$REDIS_CLI_RESPONSE" != "PONG" ]; then
  echo -e "${YELLOW}STARTING REDIS SERVER IN THE BACKGROUND${PLAIN}"
  redis-server &
else
  echo -e "${GREEN}REDIS SERVER ALREADY RUNNING${PLAIN}"
fi

# STARTING NODE
echo -e "${YELLOW}STARTING NODE${PLAIN}"
npm run dev
