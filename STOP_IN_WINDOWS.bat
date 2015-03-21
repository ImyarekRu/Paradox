@echo off
Taskkill /IM node_x32.exe /F
cd PI2P 
Taskkill /IM I2Psvc.exe /F
cd ..
