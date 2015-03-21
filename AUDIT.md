Откуда бинарник?
Из Нета. вестимо..

###Список сторонних компонентов и информация для самостоятельной сборки.

###NodeJS

Официальный сайт - https://nodejs.org , т.к. впоследствии понадобится установленный в системе NodeJS (с npm для получения и установки необходимых модулей) скачайте и установите.
В папке проекта создайте папку "node_modules", иначе NodeJS может неожиданно установить модули глобально, а не portable.
С помощью консоли в корневой папке проекта установите все необходимые модули:

npm install express

npm install forever-monitor

npm install helmet

npm install locale

npm install marked

npm install mime

npm install nedb

npm install open

npm install queuelib

npm install randy

npm install sanitizer

npm install socket.io

npm install telehash

Для корректной работы Telehash в Windows необходимо изменить ./node_modules/telehash/index.js (стр. 11-12) заменить на:

if(!isWin){

	require("telehash-cs2a").install(self, args);
	
	require("telehash-cs3a").install(self, args);
	
};



  
###Бинарник NodeJS
  
Скачайте с официального сайта бинарник NodeJS, соответствующий Вашей системе http://nodejs.org/download/

Переименуйте (в Linux надо его предварительно извлечь) файл node или node.exe из ./bin добавив к названию "_x32" или "_x64" в соответствии с Вашей системой. Скопируйте переименованный файл в корневую папку проекта.

Сейчас в проекте бинарники NodeJS версии 0.10.29 http://nodejs.org/dist/v0.10.29/SHASUMS.txt

В Linux надо извлечь и сравнить Ваш файл и ./bin/node  :

570c45653fec04d29d2208bb2967bc88b2821537  node-v0.10.29-linux-x64.tar.gz

81a0f08f9b4485d0a7ed0c049c79110b93ae03bc  node-v0.10.29-linux-x86.tar.gz

В Windows :

7e1fc5162e177aa32d626635e941aa2791092035  node.exe

1bf313dfb5259e8712ed1f0783739070f5c1453d  x64/node.exe




###Portable I2P

Создайте в корне проекта папку PI2P.

Скачайте I2P маршрутизатор с официального сайта https://geti2p.net

В коммандной строке 

java -tar название_скачанного_файла_с_расширением

В качестве пути для установки укажите созданную Вами папку PI2P.

В файле wrapper.config установите true для автоматического запуска интерфейса BOB. Измените все блоки конфигурации в этом файле, помеченные PORTABLE, кроме тех в самом начале, в которых говорится о Java, так, чтобы I2P стал портативным. И дайте I2P побольше памяти в строке 

wrapper.java.maxmemory=128

замените на

wrapper.java.maxmemory=512

иначе I2P может начать перезапускаться от большой нагрузки.

Переименуйте wrapper.config во wrapper_linux.config или wrapper_win.config , в соответствии с Вашей системой. В Linux необходимо также соответственно изменить стр.73 файле i2prouter

WRAPPER_CONF="$I2P/wrapper_linux.config"




Это пока все, что вспомнил. 





