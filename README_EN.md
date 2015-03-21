Paradox
=======
###dual profiled anonymous/public p2p social network

###__Concept__
There are 2 Profiles in Paradox - anonymous and the public. Data transmission for both profiles securely encrypted. All user data (except for information about nicknames, self-describing, almost, if specified) is stored only in the local databases of the users. Anyone is free to block access for any user to content. Already implemented sketches blog, personal Instant Messaging (history is not stored), file sharing. All security is implemented on the client's side. The user may at any time remove any of his profiles with the loss of all related information and create new one, start "from scratch" (all encryption keys and ID of profiles are generated on the client side).

Anonymous profile works with a network through the I2P's BOB interface.

Public profile works with a network through the Jeremie Miller's P2P Telehash protocol. Telehash v3 is in development now, so, here is used v2 of Telehash for now.

I publish all that in hope that there will be founded people knowledgeable in the related areas of programming, and together we can create something open, safe, comfortable. Any centralized solutions sucks.


###___Testing___
Currently Linux(tested on Debian), Windows and OSX.

Please, read to end.

1. Download - button "Download ZIP" at the right column of this page. Unzip in any place.
2. CHMOD +x for node_x32 или node_x64 (or other node's bin for your OS), and also for START_IN_<your_os>.sh and STOP_IN_<your_os>.sh  
3. Then start START_IN_<your_os>.sh или START_IN_WINDOWS.bat


__What will be:__

BE PATIENT, PLEASE

Within a few seconds due to open Firefox (yes, I advise you to install it) at https://localhost:11043 As the project is still far from release in the first UI window will appear with two buttons, do nothing and it should change to a smaller window about initialization soon. Please, confirm permanent https-selfsigned-certificat exception for localhost. On Windows you have to allow all when WindowsFirewall ask. 

You have 2 profiles. At first start there will be generated all keys for each. It could take some time.
Then your public profile will try to bootstrap into the Telehash net, and if success you will get some list of known peers for each of profiles.
Note, that your anon profile will not be "flashed" for others until you start it manually. And, ofcourse, there no any relationship between your anon and your public profile. They are isolated each other. Only you can deanonimize yourself.

Warning! Do not try to send any commands to peers before connetc to them - the app could crash(( You can init the connection to peer by clicking on the its grey circle. When it becomes green - peer connected. 

You can find that app is using one Telehash seed for now. It is issue, I know. But I am awaiting for Telehash v3 will realized - it will not need any static public seeds.

For any questions email me - imyarek@i2pmail.org or find me on Twitter (@ImyarekRu) or Diaspora* (imyarek)


###__Лицензия__
MIT for my code. Licenses of embedded components their own.

