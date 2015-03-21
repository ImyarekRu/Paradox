#!/bin/bash
cd ./PI2P
./i2prouter_osx stop
kill $(ps aux | grep 'START_IN_OSX.sh' | awk '{print $2}')
kill $(ps aux | grep 'node_macx32' | awk '{print $2}')
cd ..