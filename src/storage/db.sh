#!/bin/bash
# COLORS
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
PLAIN='\033[0m'

function create {
  createdb football -O "$USER"
  if [[ $? -ne 0 ]]; then
    echo -e "${RED}An error occurred while creating the database${PLAIN}"
    exit 1
  fi
  echo -e "${GREEN}Successfully created the football database${PLAIN}"
}

function setup {
  psql football -a -f src/storage/setup_tables.sql
  echo -e "${GREEN}Successfully created the football database tables${PLAIN}"
}

function drop {
  dropdb football
  if [[ $? -ne 0 ]]; then
    echo -e "${RED}An error occurred while dropping the database${PLAIN}"
    exit 1
  fi
  echo -e "${GREEN}Successfully dropped the football database${PLAIN}"
}

function help {
  echo "db.sh create          Create the football database and its tables"
  echo "db.sh drop            Drop the football database"
  echo "db.sh help            Display information about all commands"
}

case ${1} in
  create) create ;;
  setup) setup ;;
  drop) drop ;;
  help) help ;;
esac
