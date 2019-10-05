#!/bin/bash
# COLORS
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
PLAIN='\033[0m'
SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
SETUP_TABLES_SCRIPT_PATH="$(dirname "$SCRIPT_PATH")"
PGUSER=francois

function create {
  createdb football -O ${PGUSER} -U ${PGUSER}
  if [[ $? -ne 0 ]]; then
    echo -e "${RED}An error occurred while creating the database${PLAIN}"
    exit 1
  fi
  echo -e "${GREEN}Successfully created the football database${PLAIN}"
}

function setup {
  psql -v ON_ERROR_STOP=1 -U ${PGUSER} -d football -a -f $SETUP_TABLES_SCRIPT_PATH/setup_tables.sql
  if [[ $? -ne 0 ]]; then
    echo -e "${RED}An error occurred while setting up the database${PLAIN}"
    exit 1
  fi
  echo -e "${GREEN}Successfully created the football database tables${PLAIN}"
}

function drop {
  dropdb football -U ${PGUSER}
  if [[ $? -ne 0 ]]; then
    echo -e "${RED}An error occurred while dropping the database${PLAIN}"
    exit 1
  fi
  echo -e "${GREEN}Successfully dropped the football database${PLAIN}"
}

function init {
  if psql -U ${PGUSER} -lqt | cut -d \| -f 1 | grep -qw football; then
    echo -e "${YELLOW}database 'football' already exists${PLAIN}"
  else
    echo -e "${YELLOW}Creating 'football' database${PLAIN}"
    create
    wait $!
    echo -e "${YELLOW}Setting up 'football' database tables${PLAIN}"
    setup
  fi
}
