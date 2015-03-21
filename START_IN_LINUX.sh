#!/bin/bash
ARCH=$(getconf LONG_BIT)
cd ./PI2P 
./i2prouter start
cd .. 
sleep 20s && ./node_x$ARCH ./forever_peer.js ./peer.js