#!/bin/bash
cd ./PI2P 
./i2prouter_osx start
cd .. 
sleep 20s && ./node_macx32 ./forever_peer.js ./peer.js