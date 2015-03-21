cd PI2P 
start .\i2psvc.exe -c .\wrapper_win.config
cd ..
start %~dp0node_x32.exe %~dp0forever_peer.js %~dp0peer.js
