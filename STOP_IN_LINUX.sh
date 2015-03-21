#!/bin/bash
ARCH=$(getconf LONG_BIT)
cd ./PI2P
./i2prouter stop
kill $(ps aux | grep 'START_IN_LINUX.sh' | awk '{print $2}')
kill $(ps aux | grep 'node_x'$ARCH | awk '{print $2}')
cd ..