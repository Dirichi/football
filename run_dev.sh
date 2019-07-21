#!/bin/bash
# Small script to setup the football application.
echo "STARTING REDIS SERVER AND NODE APP"
redis-server & npm run dev && fg
