global.imyarek_dest="vGouu4ev3AZzWdXrucbO9yVuGizHIYLb~Tw95j-CaCIBgBgqHCnzrAQm6fXc6mZLUZdwZJBVN6QNEwZttXrGTcE9txUrg~CkCMdZdA1my-2GkO5dboSUSSxWuyVR13j7P1kpg2pQtCsoWlsABT-1EXUzF6mEONX2N07XstlmzOa4tGgsdAfoe96Ipt4-zBJgMpP7j2Lraf8k0-Npe3XtbQa9CcARGiK1zROwsSaGLzR9O2oqMhyr6N2XyqAyxefFL80NNjuPWzVXV7kr1Rn5AnOAf71GEvh8Z9hjAlbxWvgetA7zC-uhipi0IZIRUkLx5IXcg-a0ej3KKGKsS-KDe098jySYOzOzZGwyv2A6xIi8SAQ9fDthr43eduEe8nco~q5SwbCeHRMfi0KsEcBnQWlvzrppWkqR4RTHvMUh3f7sY6dev3fZqEivfAtQh6-znPpfsI6xavhTMg286Db3wbK3RJ2sFZKNZedAq57oylq1RUqinvgbUL98JeIuqLQIAAAA";
//global.known_seeds=["vGouu4ev3AZzWdXrucbO9yVuGizHIYLb~Tw95j-CaCIBgBgqHCnzrAQm6fXc6mZLUZdwZJBVN6QNEwZttXrGTcE9txUrg~CkCMdZdA1my-2GkO5dboSUSSxWuyVR13j7P1kpg2pQtCsoWlsABT-1EXUzF6mEONX2N07XstlmzOa4tGgsdAfoe96Ipt4-zBJgMpP7j2Lraf8k0-Npe3XtbQa9CcARGiK1zROwsSaGLzR9O2oqMhyr6N2XyqAyxefFL80NNjuPWzVXV7kr1Rn5AnOAf71GEvh8Z9hjAlbxWvgetA7zC-uhipi0IZIRUkLx5IXcg-a0ej3KKGKsS-KDe098jySYOzOzZGwyv2A6xIi8SAQ9fDthr43eduEe8nco~q5SwbCeHRMfi0KsEcBnQWlvzrppWkqR4RTHvMUh3f7sY6dev3fZqEivfAtQh6-znPpfsI6xavhTMg286Db3wbK3RJ2sFZKNZedAq57oylq1RUqinvgbUL98JeIuqLQIAAAA"];
global.bootstrap_peers=["2bfee1da2397c09cfb4427dd6bf616819b6974a70c5db90b5da5444c2fdf5c0c","1711fdd4e055dbf72e7286d5ba2b10bc531b47c768049a961ca3beda148b57a4"];
global.reset_known=0;
global.th_reset_known=0;

var UseI2P=true;

//var SIO=11000;
var sSIO=11043;
var dl_port=9990;

var BOBHOST = '127.0.0.1';
var BOBPORT = 2827;
var BOBNAME = "Bob";
var BOBinhost='127.0.0.1';
var BOBinport=37309;
var BOBouthost='127.0.0.1'
var BOBoutport=33304;

var oldpeerto=1000*60*60*96;//96 часов
var path = require("path");
var DBNAME=path.resolve(__dirname, "./PDX_FF/webshadow.db");
var dbwNAME=path.resolve(__dirname, "./PDX_FF/webshadow_w.db");
var th_DBNAME=path.resolve(__dirname, "./PDX_FF/th_webshadow.db");
var th_dbwNAME=path.resolve(__dirname, "./PDX_FF/th_webshadow_w.db");

var GCHANNELNAME="WebShadow1";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var os = require('os'),
	net = require('net'),
	fs = require("fs"),
	zlib = require('zlib'),
	open = require("open"),
	rl = require('readline'),
	randy=require('randy'),
	util = require('util'),
	Datastore = require('nedb'),
	mime = require('mime'),
	stream = require('stream'),
	Duplex = stream.Duplex || require('readable-stream').Duplex;
	Q = require('queuelib'),
	marked = require('marked'),
	ent = require('ent'),
	sanitizer = require('sanitizer'),
	//helmet = require('helmet'),
	//express = require('express'),
    locale = require("locale"),
	supported = new locale.Locales(["en","ru"]),
	//app = express(),
	http = require('http'),
	https = require('https');

///////////////////////////////////////////////////////////////////////////////
/////////////////// СЕРВЕР EXPRESS+SOCKET.IO //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//app.use(locale(supported));
var bestlocale="en";
var dicts=new Array;
for(var i=0; i<supported.length; i++){
	//console.log(supported[i].language);
	dicts[supported[i].language]=require(path.resolve(__dirname, './locales/'+supported[i].language+".json"));
}

var serveroptions = {
  key: fs.readFileSync(path.resolve(__dirname, './public/localhost.key')),
  cert: fs.readFileSync(path.resolve(__dirname, './public/localhost.crt'))
};
//var server = http.createServer(app).listen(SIO);
//var sserver = https.createServer(serveroptions, app).listen(sSIO);console.log("Сервер запущен на порте "+sSIO);
var sserver = https.createServer(serveroptions, function (request, response) {
	//request.url=request.url.toString().replace(/\?.*/,"");
    var filePath = './public' + request.url;
	if (filePath == './public/')
		filePath = './public/index.html';
	var extname = path.extname(filePath);
	console.log(filePath, extname);
	var fname=request.url.toString().substr(request.url.toString().lastIndexOf("/")+1);
	var mimetype = mime.lookup(extname);
	//console.log("fname",fname);
	console.log("mimetype",mimetype);
	var contentType = mimetype;//'text/html';
	/*switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.woff':
			contentType = 'application/font-woff';
			break;
		case '.ttf':
			contentType = 'application/font-ttf';
			break;
		case '.wav':
			contentType = 'audio/wav';//'audio/wav';
			break;
	}*/
	
	fs.exists(filePath, function(exists) {
	
		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
				}
				else {
					var locales =new locale.Locales(request.headers["accept-language"]);
					response.writeHead(200, { 'Content-Type': contentType });
					if(extname==".html" || extname==".js"){
						for(key in dicts[locales.best(supported)]){
							rgxp=new RegExp('__\\("'+key+'"\\)','gmi');
							content=content.toString().replace(rgxp,dicts[locales.best(supported).language][key]);
						}
					};
					bestlocale=locales.best(supported).language;
					response.end(content, 'utf-8');
				}
			});
		}
		else {
			response.writeHead(404);
			response.end();
		}
	});
	
}).listen(sSIO);console.log("Сервер запущен на порте "+sSIO);
//var io = require('socket.io').listen(server);
var sio = require('socket.io').listen(sserver);

//global.th_SIO=SIO+1;
global.th_sSIO=sSIO+1;
//global.th_SIO_w=SIO+2;
global.th_sSIO_w=sSIO+2;
global.th_dl_port=dl_port+1;
global.polling=[];

var gs,th_gs,th_gs_w;
var gth;

var isWin = /^win/.test(process.platform);
var isMac = /^darwin/.test(process.platform);

var queue=[];
var queue_th_db_peers = new Object();
queue_th_db_peers.queue=new Q;
queue_th_db_peers.done=function(){queue_th_db_peers.queue.done();};
var queue_db_peers = new Object();
queue_db_peers.queue=new Q;
queue_db_peers.done=function(){queue_db_peers.queue.done();};

marked.setOptions({
  //renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  //pedantic: true,
  sanitize: true,
  smartLists: true
  //smartypants: false
});

	
global.duplex=["i2p","th"];
duplex["i2p"]=[];
duplex["th"]=[];
global.localFiles=["i2p","th"];
localFiles["i2p"]=[{}];
localFiles["th"]=[{}];
global.Files=["i2p","th"];
Files["i2p"]={};
Files["th"]={};
global.Files1=["i2p","th"];
Files1["i2p"]=[{}];
Files1["th"]=[{}];
global.RFiles=["i2p","th"];
RFiles["i2p"]=[{}];
RFiles["th"]=[{}];
global.TFiles=["i2p","th"];
TFiles["i2p"]=[{}];
TFiles["th"]=[{}];
	
global.packetnum=["i2p","th"];
packetnum["i2p"]=[];
packetnum["i2p"][0]=[];
packetnum["th"]=[];
packetnum["th"][0]=[];

var base64 = exports = {
	encode: function (unencoded) {
	return new Buffer(unencoded).toString('base64');
	},
	decode: function (encoded) {
	//return new Buffer(encoded, 'base64');
	return new Buffer(encoded, 'base64').toString('Binary');
	}
};

//configs["i2p"]=new Object();
global.configs=["i2p","th"];
configs["i2p"]={
			mykeys:-1,
			destination:-1,
			cnctondem:0,
			maxoutcncts:0,
			autofetch:1,
			maxautofetch:50,
			maxlastestposts:10,
			maxincncts:0,
			maxknowns:0
};
configs["th"]={
			thid:-1,
			destination:-1,
			cnctondem:0,
			maxoutcncts:0,
			autofetch:1,
			maxautofetch:50,
			maxlastestposts:10,
			maxincncts:0,
			maxknowns:0
};
//i2pconfig=
//configs["th"]=new Object();
//th_config=

var restricted;

var th_mywebposts=[];
var th_webposts=[];

var tknown=[];
global.my_profile=["i2p","th"];
my_profile["i2p"]=new Object();
my_profile["th"]=new Object();
global.known=["i2p","th"];
known["i2p"]=[];
known["th"]=[];
global.clients=["i2p","th"];
clients["i2p"]=[];
clients["th"]=[];
global.myposts=["i2p","th"];
myposts["i2p"]=[];
myposts["th"]=[];
global.posts=["i2p","th"];
posts["i2p"]=[];
posts["th"]=[];



//io.set('log level', 0);
sio.set('log level', 0);

global.PDX_FF_PUBLIC_FILES=["i2p","th"];
PDX_FF_PUBLIC_FILES["i2p"]="./PDX_FF/public/files/";
PDX_FF_PUBLIC_FILES["th"]="./PDX_FF/public/th_files/";

if(!fs.existsSync(path.resolve(__dirname, "./PDX_FF")))
{
	fs.mkdirSync(path.resolve(__dirname, "./PDX_FF"));
}
else fs.chmodSync(path.resolve(__dirname, "./PDX_FF"), 0777);

if(!fs.existsSync(path.resolve(__dirname, "./PDX_FF/public")))
{
	fs.mkdirSync(path.resolve(__dirname, "./PDX_FF/public"));
}
else fs.chmodSync(path.resolve(__dirname, "./PDX_FF/public"), 0777);

if(!fs.existsSync(path.resolve(__dirname, "./PDX_FF/Temp")))
{
	fs.mkdirSync(path.resolve(__dirname, "./PDX_FF/Temp"));
}
else fs.chmodSync(path.resolve(__dirname, "./PDX_FF/Temp"), 0777);

if(!fs.existsSync(DBNAME))
{
	var fd = fs.openSync(DBNAME, 'w+', function(){;});
	fs.closeSync(fd);
}

if(!fs.existsSync(dbwNAME))
{
	var fd = fs.openSync(dbwNAME, 'w+', function(){;});
	fs.closeSync(fd);
}

if(!fs.existsSync(th_DBNAME))
{
	var fd = fs.openSync(th_DBNAME, 'w+', function(){;});
	fs.closeSync(fd);
}
if(!fs.existsSync(th_dbwNAME))
{
	var fd = fs.openSync(th_dbwNAME, 'w+', function(){;});
	fs.closeSync(fd);
	//fs.writeFileSync(th_dbwNAME, '{"curhost":"https://encrypted.google.com/#q=socketio%20in%20xulrunner%20socket.io","action":1,"anchor":"socgggket","fullanchor":"socket","fulladdr":"https://encrypted.google.com/#q=socketio%20in%20xulrunner%20socket.io","ts":"2014-10-10T22:28:40.989Z","lts":1412980120989,"data":"qweqweqew","hashname":"20fed45a65f336c46c1c3cd5f5900a7bfebc1f7c79c9562c0f406703baf9ed20","nick":"testingNick","cmnts":[],"type":"post","_id":"RRB2JO2Z6wiMyHJ0"}');
}

if(!fs.existsSync(path.resolve(__dirname, PDX_FF_PUBLIC_FILES["i2p"])))
{
	fs.mkdirSync(path.resolve(__dirname, PDX_FF_PUBLIC_FILES["i2p"]));
	fs.chmodSync(path.resolve(__dirname, "./PDX_FF/public/files"), 0777);
	var fd = fs.openSync(path.resolve(__dirname, "./PDX_FF/public/files/empty"), 'w+', function(){;});
	fs.closeSync(fd);
}
if(!fs.existsSync(path.resolve(__dirname, PDX_FF_PUBLIC_FILES["th"])))
{
	fs.mkdirSync(path.resolve(__dirname, PDX_FF_PUBLIC_FILES["th"]));
	fs.chmodSync(path.resolve(__dirname, "./PDX_FF/public/th_files"), 0777);
	var fd = fs.openSync(path.resolve(__dirname, "./PDX_FF/public/th_files/empty"), 'w+', function(){;});
	fs.closeSync(fd);
}

fs.chmodSync(path.resolve(__dirname,"./public"), 0777);
if(!fs.existsSync(path.resolve(__dirname, "./public/extimgs")))
{
	fs.mkdirSync(path.resolve(__dirname, "./public/extimgs"));
}
else fs.chmodSync(path.resolve(__dirname, "./public/extimgs"), 0777);

global.is_running=false;
global.th_is_running=false;
global.need_restart=false;
global.need_reset=false;



/////////////////////////////////////////////////////////////////////////
///////////////////////////////// MARKDOWN RENDERER /////////////////////
/////////////////////////////////////////////////////////////////////////
if(UseI2P){
	global.renderer = new marked.Renderer();
	renderer.link = function (href, title, text) {
		if(text=="dl"){
			var fn=href.split("@")[0];
			var fnwoext=fn.split(".")[0];
			return " <a href='#' style='display:inline-block;margin-top:4px;' onclick='DownloadFromPeer(\"i2p\", \""+href+"\");ShowDownloadProgress(\""+fnwoext+"\");'>"+dicts[bestlocale]["download"]+" "+sanitizer.sanitize(fn)+"</a>";
		}
		else
		{
			if(href.indexOf(".i2p/")<0)	return ' <b>'+dicts[bestlocale]["ClearnetWarn"]+' </b><a href="' + href + '" title="'+title+'" target="_blank">'+text+'</a>';
			else return ' <b>'+dicts[bestlocale]["MayBeClearnetWarn"]+' </b><a href="' + href + '" title="'+title+'" target="_blank">'+text+'</a>';
		};
	};
	renderer.image = function (href, title, text) {
		if(href.indexOf(".i2p")<0)	return ' <b>'+dicts[bestlocale]["ClearnetImgWarn"]+' '+ sanitizer.sanitize(href) + '</b> ' ;
		else	return ' <b>'+dicts[bestlocale]["MayBeClearnetImgWarn"]+' '+ sanitizer.sanitize(href) + '</b> ' ;

	};
};
global.th_renderer = new marked.Renderer();
th_renderer.link = function (href, title, text) {
	if(text=="dl"){
		var fnwoext=href.split("@")[0].split(".")[0];
		return " <a href='#' style='display:inline-block;margin-top:4px;' onclick='DownloadFromPeer(\"th\", \""+href+"\");'>"+dicts[bestlocale]["download"]+"</a><div id='drop"+fnwoext+"' style='display:innline-block;float:right;width:50%;height:20px;'><div id='percent' style='display: inline-block;position:relative;right:0%;bottom:3px;width:50px;'>0%</div><div class='progress small-9 secondary round' style='display: inline-flex;'> <div class='meter' style='width: 0%'></div>    </div></div>";
	}
	else
	{
		return ' <a href="' + href + '" title="'+title+'" target="_blank">'+text+'</a> ';
	};
};
th_renderer.image = function (href, title, text) {
	var peerhn=href.split("@")[1];
	var peerfn=href.split("@")[0];
	var fext=href.split("@")[0].split(".")[1];
	if(peerhn!=configs["th"].destination){
		if(!fs.existsSync(path.resolve(__dirname, "./public/extimgs/"+peerhn+"/"+peerfn)))
		{
			if(!fs.existsSync(path.resolve(__dirname, "./public/extimgs/"+peerhn)))
			{
				fs.mkdirSync(path.resolve(__dirname, "./public/extimgs/"+peerhn));
				fs.chmodSync(path.resolve(__dirname, "./public/extimgs/"+peerhn), 0777);
			};
			var fd = fs.openSync(path.resolve(__dirname, "./public/extimgs/"+peerhn+"/"+peerfn), 'w+', function(){;});
			fs.closeSync(fd);
			var peerreq=peerhn+/img/+peerfn;
			console.log("peerhn="+peerhn);
			console.log(configs["th"].destination);
			console.log("peerfn="+peerfn);
			console.log("fext="+fext);
			console.log("peerreq="+peerreq);
			gth.thtp.request("thtp://"+peerreq,function(err,res){
				if(err){
					console.log("THTP IMG ERROR "+err.toString());
					return err.toString();
				}
				else
				{
					var buf="";
					var tttcnt=0;
					res.on('readable', function() {
						var chunk;
						while (null !== (chunk = res.read())) {	buf+=chunk;	};
						if(buf.toString()=="ok"){
							
							if(!defined(packetnum["th"][peerhn]))packetnum["th"][peerhn]=[];
							packetnum["th"][peerhn][peerfn]=0;
							if(!defined(TFiles["th"][peerhn]))TFiles["th"][peerhn]={};
							if(!defined(TFiles["th"][peerhn][peerfn]))TFiles["th"][peerhn][peerfn]={};
							if(!defined(TFiles["th"][peerhn][peerfn]["extimgs"]))TFiles["th"][peerhn][peerfn]["extimgs"]={};
							TFiles["th"][peerhn][peerfn]["extimgs"]=true;
							SendData2Dest("th",peerhn,{cmd:"dl",data:{fn:peerfn}});
						};
					});
				};
			});
		};
		return "<img src='https://localhost:11043/extimgs/"+peerhn+"/"+peerfn+"'/>";
	}
	else
	{
		try{
			var bitmap = fs.readFileSync(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["th"]+peerfn));
			var buf= new Buffer(bitmap).toString('base64');
			return ' <img src="data:image/'+fext+';base64,'+buf+'" title="'+sanitizer.sanitize(title) +'"/>' ;
		}
		catch(er){return er.toString();};
	};
};
/*function RenderOut(buf,resstream)
{
	try{
		buf=th_SanitizePosts(buf);
		//console.log(buf[0].txt);
		var tts=new Date(parseInt(buf[0].lts));
		var html=header+"<b>"+buf[0].nick+"</b> в p2p соцсети <b>WebShadow</b> "+tts.toLocaleString()+"<hr></div>	";
		html+='<div style="margin:0 20px;">'+buf[0].txt
		html+='<div style="display: inline-block;float: right;">';
		html+='<label>'+buf[0].cmnts.length+' комментариев</label>';
		html+='<div class="small-10 small-offset-2 columns" >';
		for(var i in buf[0].cmnts)
		{
			html+=	'<div><br>'+buf[0].cmnts[i].txt;
			html+=	'<p style="font-size:.8em;">'+buf[0].cmnts[i].nick+' | '+ (new Date(buf[0].cmnts[i].lts).toLocaleString())+'</p>';
			html+=	'</div>';
			html+=	'<hr>';		
		};
		html+="</div></div>"+footer;
		resstream.write(html);
		resstream.end();
	}catch(err)
	{
		//console.log(err);
	};
};*/
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////// КОНЕЦ MARKDOWN RENDERER /////////////////////
///////////////////////////////////////////////////////////////////////////////

//////////////////////////////////дуплекс//////////////////////////////////
function DUPSTREAM(options) {
  // allow use without new operator
  if (!(this instanceof DUPSTREAM)) {
    return new DUPSTREAM(options);
  }
  Duplex.call(this, options); // init
  this.readArr = []; // array to read
}
util.inherits(DUPSTREAM, Duplex);

DUPSTREAM.prototype._read = function readBytes(n) {
  var self = this;
  var chunk;
	while (this.readArr.length) {
		chunk = this.readArr.shift();
		if (!self.push(chunk)) {
		  break; // false from push, stop reading
		}
	}
  if(!chunk)self.push(null);
};
/* for write stream just ouptut to stdout */
DUPSTREAM.prototype._write =
  function (chunk, enc, cb) {
	this.readArr.push(chunk);
    cb();
};
//////////////////////////////////////////////////////////////////
//////////////////////// starting updater ////////////////////////
/*var os = require('os'),
	spawn = require('child_process').spawn,
	nodebin="";
  
if(!isWin && !isMac)
{
	if(os.platform().match(/32/) || os.platform().match(/386/))	nodebin=path.resolve(__dirname, './node_x32');
	else														nodebin=path.resolve(__dirname, './node_x64');
}
else if(!isWin)
{
	nodebin=path.resolve(__dirname, './node_macx32');
}
else
{
	nodebin=path.resolve(__dirname, './node_x32.exe');
	//if(os.platform().match(/32/) || os.platform().match(/386/))	nodebin=path.resolve(__dirname, './node_x32.exe');
	//else											nodebin=path.resolve(__dirname, './node_x64.exe');
};
var child=spawn(nodebin,[path.resolve(__dirname, './updater.js')],{
		detached: true,
		stdio: [ 'ignore', 'ignore','ignore',]
	});
	child.unref();
setInterval(function(){
	var child=spawn(nodebin,[path.resolve(__dirname, './updater.js')],{
		detached: true,
		stdio: [ 'ignore', 'ignore','ignore',]
	});
	child.unref();
},1800000);*/
////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////
///////////////////////////// СЕРВЕР ДЛЯ СКАЧИВАНИЯ В АНОНИМНОЙ ЧАСТИ////////
/////////////////////////////////////////////////////////////////////////////
var tempserver;
if(UseI2P){
	tempserver = http.createServer(function (req, res) {
		var fname=req.url.toString().substr(req.url.toString().indexOf("?")+1);
		var mimetype = mime.lookup(fname);
		res.setHeader('Content-disposition', 'attachment; filename=' + fname);
		res.setHeader('Content-type', mimetype);
		console.log(fname);
		console.log(duplex["i2p"][fname]);
		duplex["i2p"][fname].pipe(res);
	});

	tempserver.on('connection', function (socket) {
		socket.setTimeout(100000);
		socket.on('close', function () {
			console.log('socket closed');
		});
	});
	tempserver.listen(dl_port);/////////сделать динамическим!!!!!!!!!
	
};
/////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// БЛОК ЛОГИКИ ИНИЦИАЛИЗАЦИИ ПРИЛОЖЕНИЯ /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
var DB=["i2p","i2pw","th","thw"];
DB["i2p"]=new Datastore({ filename: DBNAME });
DB["i2pw"]=new Datastore({ filename: dbwNAME });
DB["th"]=new Datastore({ filename: th_DBNAME });
DB["thw"]=new Datastore({ filename: th_dbwNAME });


if(UseI2P){

	DB["i2p"].loadDatabase(function (err) {
		DB["i2p"].findOne({ type: 'my_profile' }, function (err, doc) {
			if(err)
			{
				console.log(err);
				CreateNewProfile("i2p");
				updateMyProfile("i2p");
				start_th_db(my_profile["i2p"]);
			}
			else
			{
				console.log("profile",doc);
				start_th_db(doc);
			};
		});
		fs.readdir(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["i2p"]),function(err, files){
			for(var n in files)
			{
				localFiles["i2p"][n] = {
					fn : "",
					fs : 0
				};
				var Stat = fs.statSync(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["i2p"] +  files[n]));
				if(Stat.isFile())
				{
					localFiles["i2p"][n]['fn']=files[n];
					localFiles["i2p"][n]['fs'] = Stat.size;
				}
			}
		});
		fs.readdir(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["th"]),function(err, files){
			for(var n in files)
			{
				localFiles["th"][n] = {
					fn : "",
					fs : 0
				};
				var Stat = fs.statSync(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["th"]+  files[n]));
				if(Stat.isFile())
				{
					localFiles["th"][n]['fn']=files[n];
					localFiles["th"][n]['fs'] = Stat.size;
				}
			}
		});
	});
}
else
{
	fs.readdir(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["th"]),function(err, files){
			for(var n in files)
			{
				localFiles["th"][n] = {
					fn : "",
					fs : 0
				};
				var Stat = fs.statSync(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["th"] + files[n]));
				if(Stat.isFile())
				{
					localFiles["th"][n]['fn']=files[n];
					localFiles["th"][n]['fs'] = Stat.size;
				}
			}
	});
	start_th_db(null);
};

function start_th_db(i2p_profile){
	DB["th"].loadDatabase(function (err) {
		DB["th"].findOne({ type: 'my_profile' }, function (err, doc) {
			if(err)
			{
				console.log(err);
				CreateNewProfile("th");
				updateMyProfile("th");
			}
			else
			{
				console.log("th_profile",doc);
				start_app0(i2p_profile,doc);
			};
		});

	});
	DB["thw"].loadDatabase(function (err) {
		DB["thw"].find({ type: 'post' }, function (err, docs) {
			if(err)
			{
				console.log(err);
				//CreateNewProfile("th");
				//updateMyProfile("th");
			}
			else
			{
				console.log("WEBPOSTS",docs);
				th_mywebposts=JSON.parse(JSON.stringify(docs));
				//start_app0(i2p_profile,doc);
			};
		});

	});
}
function start_app0(i2pp,thp){
	my_profile["th"]=JSON.parse(JSON.stringify(thp));
	if(UseI2P){my_profile["i2p"]=JSON.parse(JSON.stringify(i2pp));};

	if(typeof(my_profile["th"])=="undefined" || !my_profile["th"])  CreateNewProfile("th");
	if(UseI2P){if(typeof(my_profile["i2p"])=="undefined" || !my_profile["i2p"])	CreateNewProfile("i2p")};

	DB["th"].find({ type: 'known' }, function (err, docs) {
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log("TH_KNOWN\n",docs);
			known["th"]=exportPouches(JSON.parse(JSON.stringify(docs)));
			console.log("TH_KNOWN2\n",known["th"]);
			updateAllPeersLists("th",true);
			console.log("#############THKNOWN LENGTH "+known["th"].length);
			DB["th"].findOne({ type: 'my_config' }, function (err, doc) {
				if(err)	console.log(err);
				else	start_app1(my_profile["i2p"],my_profile["th"],doc);
			});
		};
	});
}
function start_app1(i2pp,thp,thcfgresp)
{
	if(UseI2P){
		DB["i2p"].find({ type: 'known' }, function (err, docs) {
			if(err)
			{
				console.log(err);
			}
			else
			{
				//console.log("KNOWN\n",docs);
				known["i2p"]=exportPouches(JSON.parse(JSON.stringify(docs)));
				updateAllPeersLists("i2p",true);
				console.log("#############KNOWN LENGTH "+known["i2p"].length);
				DB["i2p"].findOne({ type: 'my_config' }, function (err, doc) {
					if(err)	console.log(err);
					else	start_app(i2pp,thp,thcfgresp,doc);
				});
			};
		});
	}
	else
	{
		start_app(i2pp,thp,thcfgresp,null);
	};
};

function start_app(i2pp,thp,thcfgresp,i2pcfgresp)
{
	if(UseI2P){
		DB["i2p"].findOne({ type: 'restricted' }, function (err, doc) {
			if(err)
			{
				console.log(err);
			}
			else
			{
				console.log("restricted",doc);
				if(doc){
					restricted=doc.destination;
					DB["i2p"].remove({type:"restricted"}, function(err, response) {
						if(err) console.log(err);
					});
				};
			};
		});
	};


	console.log("start_app ",((!i2pcfgresp)?"null":""),((!thcfgresp)?"null":""));
	//console.log(i2pp,thp,thcfgresp,i2pcfgresp);
	setTimeout(function(){if (!sio.isConnected) {open("https://localhost:"+sSIO, "firefox");/*open("https://localhost:"+th_sSIO, "firefox");*/};},5000);
	if(UseI2P){
		if(!i2pcfgresp && !thcfgresp)
		{
			//virgin
			console.log("virgin");
			th.init({seeds:[{
								"paths": [
								  {
									"type": "http",
									"http": "http://193.34.144.23:42424"
								  },
								  {
									"type": "ipv4",
									"ip": "193.34.144.23",
									"port": 42424
								  },
								  {
									"type": "ipv6",
									"ip": "2a02:c200:0:10:2:2:9053:1",
									"port": 42424
								  },
								  {
									"type": "ipv6",
									"ip": "fe80::250:56ff:fe3c:47b3",
									"port": 42424
								  }
								],
								"parts": {
								  "3a": "1df78fba497cfaf8eb1c2cf7b005208579193ea16385060329b9d769010e1827",
								  "2a": "2625ebe91ff10ce6c7c3b1bfd9b6a80825669f14d5d90b36608bdcf91bf07b85",
								  "1a": "5b5857763c9a5496fc5b2640d28a09ff5a3eef44de5813d39bfc27f1c4d114a6"
								},
								"keys": {
								  "3a": "3NH1B5EgZoWi0qUqHhdqJgLyHpqEbmGEzddzyrqzQF4=",
								  "2a": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiXMD0A1cEYETDRzIgBe4xwu40qYreFW3EKZEpXfbKZCrbhuolyAgXf9+bWD+Hi7MeNdBGpuu5LBJqAEKRAZTynj7fYO36RDJmRfBIgKvYmabVtIPC6V0/olL+mTCJTlaI0es2xHSZmSUzOjE4na5nrZygpUbTcWv9Y8DtAC5KPOMYbMRL2wthalG/qDu9/MrbaD+/vvxUFvBRm0XjGQNM+fueyJlQ1Qsr0+720x/P9r87Q4vLcaZqRUykjlK0zlTOPazi3N86Jv1WEdUPSV5SY27ZP6lYdM1VnB92NArSyhou8Yi4gbqpEcK5FD5mH5/n71+PSYmgRewrlXLIqrOLwIDAQAB",
								  "1a": "J0ss+FS+nXVrVoLcaj2zPXjqRpUxsKN5lDT0Ps4AeuCxc6cJUCofAA=="
								}
							  }]}, function(err, self){
								  
													if(err) {
														console.log("hashname generation/startup failed",err);
														//fs.unlinkSync(DBNAME);
														fs.unlinkSync(th_DBNAME);
														start_app(i2pp,thp,thcfgresp,i2pcfgresp);
														return;
														//process.exit(0);
													};
													gth=self;
													// self.id contains a the public/private keys and parts
													if(!configs["th"]){
														configs["th"]=new Object();
														configs["th"]={
																	thid:-1,
																	destination:-1,
																	cnctondem:0,
																	maxoutcncts:0,
																	autofetch:1,
																	maxautofetch:50,
																	maxlastestposts:10,
																	maxincncts:0,
																	maxknowns:0,
																	type:"my_config"
														};
													};
													th_is_running=true;
													configs["th"].type="my_config";
													configs["th"].destination=self.hashname;
													configs["th"].cnctondem=0;
													configs["th"].maxoutcncts=0;
													configs["th"].autofetch=1;
													configs["th"].maxautofetch=50;
													configs["th"].maxlastestposts=10;
													configs["th"].maxincncts=0;
													configs["th"].maxknowns=0;
													configs["th"].thid=self.id;
													add2db(configs["th"],"th","my_config");
													
													setTimeout(function(){
														CallBobFor("start_server",
															null,
															function(){
																setTimeout(function(){
																	Send2UI("i2p","keepinmind",{state:is_running,th_state:th_is_running});
																	PollKnown("th");
																},1000);
															}
														);
													},20000)
													/*var tp=thp;
													tp.destination=configs["th"].destination;
													tp=CleanArray([tp]);
													CallBobFor("connect_host_tmp",
																	//{host:'http://4rjzpjkfgr7kez3eqb7435j4ce4xqioroe4cplfziiem4ckd7k4a.b32.i2p'},
																	{host:'http://xpi5tv4h6t4ejetbk2lvbyopx4z3pdm7d7n6gk33rfwidg7x7rvq.b32.i2p/'},
																	null
														);
													*/
													channelName = GCHANNELNAME;
													console.log(self.hashname);
													console.log("WE ARE ONLINE with "+known["th"].length+" known peers");
													self.listen(channelName, packetHandler);
													gth=self;
													

													////////////////////////////THTP////////////////////////
													self.thtp.listen(function(req,cbRes){
														console.log("THTP");console.log("THTP");console.log("THTP");console.log("THTP");console.log("THTP");
														console.log(req.method,req.path,req.headers);
														if(req.path == "/foobar") return cbRes().end("foobar");
														else if(req.path == "/stdin") return process.stdin.pipe(cbRes());
														else if(req.path.indexOf("post/")>0)
														{
															console.log("THTP POST:"+req.path.substr(req.path.indexOf("post/")+5));
															var res="";
															var postid=req.path.substr(req.path.indexOf("/post/")+6);
															DB["th"].findOne({type:"post",_id:postid}, function(err, doc) {
																if(err)
																{
																	console.log(err);
																	cbRes({status:200,body:JSON.stringify(err)});
																}
																else
																{
																	//console.log("cmnts from th_db",docs[0].cmnts);
																	res=JSON.parse(JSON.stringify(doc));
																	//for(var i in tmyposts){
																		for(var j in res.cmnts){
																			if(defined(res.cmnts[j].src)){
																				res.cmnts[j].txt=res.cmnts[j].src.toString().replace(/\\+n/g,"\n");
																				delete(res.cmnts[j].src);
																			}
																		}
																	//};
																	res=JSON.stringify(res);
																	cbRes({status:200,body:res});
																};
															});
															//cbRes({status:200,body:res});//cbRes({status:200,body:req.path});
														}
														else if(req.path.indexOf("img/")>0)
														{
															console.log("THTP IMG: "+req.path.substr(req.path.indexOf("img/")+4));
															//var res="";
															var tfn=req.path.substr(req.path.indexOf("/img/")+5);
															try{
																var bitmap = fs.readFileSync(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["th"]+tfn));
																//var readable = fs.createReadStream(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["th"]+tfn));
																 // convert binary data to base64 encoded string
																// var res= new Buffer(bitmap).toString('base64');
																cbRes({status:200,body:"ok"});//cbRes({status:200,body:req.path});
															}
															catch(er){return er.toString();};
														};
													});
													console.log("listening at thtp://"+self.hashname+"/")
													//if(known_seeds[0]!=configs["i2p"].destination) PollKnown("th");
													
													
			});
			if (!sio.isConnected)setTimeout(function(){Send2UI("i2p","wait_please",{});},10000);
			else Send2UI("i2p","wait_please",{});

		}
		else if(!i2pcfgresp && thcfgresp)
		{
			console.log("only configs[th]");
			/*need_restart=true;
			CallBobFor("connect_dest",
						{'destination':known_seeds[0]},null
						//function(){setTimeout(function(){Restart();},}
					);
			*/
			setTimeout(function(){
				CallBobFor("start_server",
					null,
					function(){
						setTimeout(function(){
								th_ManualStart();
								Send2UI("i2p","keepinmind",{state:is_running,th_state:th_is_running});
								PollKnown("th");
						},1000);
					}
				);
			},20000);
													
			CallBobFor("start_server",
						null,
						function(){
							setTimeout(function(){
							th_ManualStart();
							Send2UI("i2p","keepinmind",{state:is_running,th_state:th_is_running});
						},1000);}
			);
			
			if (!sio.isConnected)setTimeout(function(){Send2UI("i2p","wait_please",{});},10000);
			else Send2UI("i2p","wait_please",{});
		}
		else if(i2pcfgresp && thcfgresp)
		{
			//configs exists
			console.log("configs exists");
			configs["i2p"]=JSON.parse(JSON.stringify(i2pcfgresp));
			configs["th"]=JSON.parse(JSON.stringify(thcfgresp));
			//th_ManualStart();
			if (!sio.isConnected)setTimeout(function(){},10000);
			else Send2UI("i2p","keepinmind",{state:is_running,th_state:th_is_running});
		}
		else
		{
			console.log("configs errors");
		};
	}
	else
	{
	/*	if(!thcfgresp)
		{
			//virgin
			console.log("virgin");
			th.init({seeds:[{
    "paths": [
      {
        "type": "http",
        "http": "http://193.34.144.23:42424"
      },
      {
        "type": "ipv4",
        "ip": "193.34.144.23",
        "port": 42424
      },
      {
        "type": "ipv6",
        "ip": "2a02:c200:0:10:2:2:9053:1",
        "port": 42424
      },
      {
        "type": "ipv6",
        "ip": "fe80::250:56ff:fe3c:47b3",
        "port": 42424
      }
    ],
    "parts": {
      "3a": "1df78fba497cfaf8eb1c2cf7b005208579193ea16385060329b9d769010e1827",
      "2a": "2625ebe91ff10ce6c7c3b1bfd9b6a80825669f14d5d90b36608bdcf91bf07b85",
      "1a": "5b5857763c9a5496fc5b2640d28a09ff5a3eef44de5813d39bfc27f1c4d114a6"
    },
    "keys": {
      "3a": "3NH1B5EgZoWi0qUqHhdqJgLyHpqEbmGEzddzyrqzQF4=",
      "2a": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiXMD0A1cEYETDRzIgBe4xwu40qYreFW3EKZEpXfbKZCrbhuolyAgXf9+bWD+Hi7MeNdBGpuu5LBJqAEKRAZTynj7fYO36RDJmRfBIgKvYmabVtIPC6V0/olL+mTCJTlaI0es2xHSZmSUzOjE4na5nrZygpUbTcWv9Y8DtAC5KPOMYbMRL2wthalG/qDu9/MrbaD+/vvxUFvBRm0XjGQNM+fueyJlQ1Qsr0+720x/P9r87Q4vLcaZqRUykjlK0zlTOPazi3N86Jv1WEdUPSV5SY27ZP6lYdM1VnB92NArSyhou8Yi4gbqpEcK5FD5mH5/n71+PSYmgRewrlXLIqrOLwIDAQAB",
      "1a": "J0ss+FS+nXVrVoLcaj2zPXjqRpUxsKN5lDT0Ps4AeuCxc6cJUCofAA=="
    }
  }]}, function(err, self){
							if(err) {
								console.log("hashname generation/startup failed",err);
								fs.unlinkSync(th_DBNAME);
								process.exit(0);
							};
							gth=self;
							// self.id contains a the public/private keys and parts
							if(!configs["th"]){
								configs["th"]=new Object();
								configs["th"]={
											thid:-1,
											destination:-1,
											cnctondem:0,
											maxoutcncts:0,
											autofetch:1,
											maxautofetch:50,
											maxlastestposts:10,
											maxincncts:0,
											maxknowns:0,
											type:"my_config"
								};
							};
							configs["th"].type="my_config";
							configs["th"].destination=self.hashname;
							configs["th"].cnctondem=0;
							configs["th"].maxoutcncts=0;
							configs["th"].autofetch=1;
							configs["th"].maxautofetch=50;
							configs["th"].maxlastestposts=10;
							configs["th"].maxincncts=0;
							configs["th"].maxknowns=0;
							configs["th"].thid=self.id;
							add2db(configs["th"],"th","my_config");

							var tp=thp;
							tp.destination=configs["th"].destination;
							tp=CleanArray([tp]);
				th_ManualStart();	
			});
			

		}
		else if(thcfgresp)
		{
			//configs exists
			console.log("config exists");
			configs["th"]=JSON.parse(JSON.stringify(thcfgresp));
			th_ManualStart();
		}
		else
		{
			console.log("config errors");
			process.exit(0);
		};*/
	};
}
function th_ManualStart(){
	console.log("starting telehash");
	th_is_running=true;
	InitTH();
};
function ManualStart(){
	console.log("starting i2p");
	if(is_running){
		PollKnownAll();
		return;
	}
	else is_running=true;
	
	if(known["th"].length==0)
	{
		console.log("th_known = 0");
		/*
		var tp=JSON.parse(JSON.stringify(thp));
		tp.hashname=configs["th"].destination;
		tp=CleanArray([tp]);
		*/
		//CallBobFor("connect_dest",	{'destination':known_seeds[0]},null);

	}
	else
	{
		console.log("th_known != 0", known["th"]);
		/*if(known["i2p"].length==0){
			console.log("i2p_known = 0");
			CallBobFor("connect_dest",
						{'destination':known_seeds[0]},
						function(){setTimeout(function(){PollKnown("i2p");},30000);}
					);
		}
		else*/
		{
			console.log("known != 0", known["i2p"]);
			CallBobFor("start_server",
						null,
						function(){/*StartI2pSocket(imyarek_dest,null);setTimeout(function(){*/PollKnownAll();/*},30000);*/}
					);
		};
	};
};


function ResetI2PProfile()
{
			DB["i2p"].remove({type:"my_config"}, {},function(err, response) {
				if(err) {
					console.log(err);
					ResetI2PProfile();
				}
				else
				{
					for(i in I2P_SOCKETS){I2P_SOCKETS[i].destroy();};
					if(appserver)appserver.close();
					if(outclient){outclient.write('stop\n');};
					setTimeout(function(){
						DB["i2p"].remove({type:"my_profile"}, {},function(err, response) {
									if(err) {
										console.log(err);
									}
									else
									{
										configs["i2p"]={};
										my_profile["i2p"]={};
										CreateNewProfile("i2p");
										need_restart=true;
										CallBobFor("connect_host",
											//{host:'http://4rjzpjkfgr7kez3eqb7435j4ce4xqioroe4cplfziiem4ckd7k4a.b32.i2p'},
											{host:'http://xpi5tv4h6t4ejetbk2lvbyopx4z3pdm7d7n6gk33rfwidg7x7rvq.b32.i2p/'},
											function(){setTimeout(function(){Restart();},100);}
										);
									};
								});

					},3000);

				};
			});

};
function Restart(){
	console.log("                                                        RESTARTING");
	need_restart=false;
	setTimeout(function(){
		for(i in I2P_SOCKETS){I2P_SOCKETS[i].destroy();};
		if(appserver)appserver.close();
		if(outclient){outclient.write('stop\n');};
		setTimeout(function(){
			outclient.destroy();
			process.exit(0);
			/*if(th_known.length==0)
			{
				console.log("th_known = 0");
				var tp=my_profile["th"];
				tp.destination=configs["th"].destination;
				tp=CleanArray([tp]);
				CallBobFor("connect_dest",
								{'destination':known_seeds},null
							);
			}
			else
			{
				console.log("th_known != 0");
				if(known.length==0){
					CallBobFor("connect_dest",
								{'destination':known_seeds},
								function(){setTimeout(function(){PollKnown("i2p");},30000);}
							);
				}
				else
				{
					CallBobFor("start_server",
								null,
								function(){setTimeout(function(){PollKnown("i2p");},30000);}
							);
				};
			};*/
		},10000);
	},5000);
}


////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// КОНЕЦ БЛОКА ЛОГИКИ ИНИЦИАЛИЗАЦИИ ПРИЛОЖЕНИЯ /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////   gen
function exportPouches(arr) 
{
	var res=[];
	//if(arr.length>0){
		for(var i in arr)
		{
			//res.push(arr[i]);
			res=ConcatUnique(res,[arr[i]]);
		}
	//}
	//else res.push(arr);
	return res;
}

function CleanArray(arr){ 
	var tarr=JSON.parse(JSON.stringify(arr));
	for(var i in tarr){
		delete(tarr[i]._id);
		delete(tarr[i].banned);
		delete(tarr[i].state);
	};
	return tarr;
}

function ConcatUnique(md1,md2){
	//console.log("md1.length="+md1.length);
	//console.log("md2.length="+md2.length);
	try{
		for(var x in md1){
			for(var y in md2){
				if(defined(md1[x].destination) && defined(md2[y].destination)){
					if(md1[x].destination === md2[y].destination || configs["i2p"].destination === md2[y].destination || md2[y].destination.toString().length==0 || md2[y].nick.toString().length==0){
						md2.splice(y,1);
					}
				};
				if(defined(md1[x].destination) && defined(md2[y].destination)){
					if(md1[x].destination === md2[y].destination || configs["th"].destination === md2[y].destination || md2[y].destination.toString().length==0 || md2[y].nick.toString().length==0){
						md2.splice(y,1);
					}
				};

			}
		}
		return md1.concat(md2);
	}catch(err){
		console.log("CONCAT ERROR",md1,md2);
	}
};

//////////////////////////////////////// Array.forEach
Array.prototype.forEach = function(fn, thisObj) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (i in this) {
            fn.call(thisObj, this[i], i, this);
        }
    }
};
//////////////////////////////////////// Array.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        if (i in list) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return i;
          }
        }
      }
      return -1;
    }
  });
}
////////////////////////////////////////////////////////
function IsInArrayF(element, index, array) {
	if(defined(element._id))
	return (element._id.toString() === this.toString() );
	else return false;
}

function defined(obj){
	return (typeof(obj)!='undefined');
}

function UpdatePostInMemory(cur,upd){
	console.log("UpdatePostInMemory(cur,upd)");
	//console.log(cur);
	//console.log(upd);
	upd.forEach(function(el,ind){
		var index=cur.findIndex(IsInArrayF,el._id);
		console.log(index);
		if(index>=0){
			cur[index]=el;
		}
		else
		{
			cur.push(el);
		};
	});
	console.log(cur);
	return cur;
};




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// WO context
function PollKnownAll(){   //i2p
	console.log("PollKnownAll I2P");
	for(var n in known["i2p"]){
		if(!defined(polling[known["i2p"][n].destination]))
		{
			polling[known["i2p"][n].destination]={};
			polling[known["i2p"][n].destination].cnt=0;
		};
		//if(polling[known["i2p"][n].destination].cnt<100){
			QueuePoll(known["i2p"][n]);
			polling[known["i2p"][n].destination].cnt++;
		//};
	};
	setTimeout(function(){PollKnown("i2p");},30000);
};
function QueuePoll(peer){ //i2p
	if(isConnected(peer.destination))	SendData2Dest("i2p",peer.destination,{cmd:"ping"});
	else
	{
		if(polling[peer.destination].cnt==0)	StartI2pSocket(peer.destination,null);
	}
}

function SendChunk(destination,chunk,t){//i2p
	if(!defined(queue[destination])){
		queue[destination] = {};
		queue[destination].queue=new Q;
		queue[destination].done=function(destination){queue[destination].queue.done();};
	};
	setTimeout(function(){
		//console.log("queing sending");
		queue[destination].queue.pushAsync(
			function(lib) {
				//console.log("sending:"+JSON.stringify(chunk));
				SendData2Dest2(destination,chunk);
			});
	},t);
};

function SendData2Dest2(destination,q){//i2p
	var d=JSON.stringify(q);
	if(isConnected(destination))
	{
		//console.log("connected");
		if(isInClients("i2p",destination))
		{
			//console.log("is In Clients");
			servscts[destination].c.write(d);
		}
		else
		{
			//console.log("is In I2P_SOCKETS");
			I2P_SOCKETS[destination].write(d);
		};
	}
	else
	{
		//console.log("!connected");
		StartI2pSocket(destination,function(){
					Send2UI("i2p","updatePeersState",{msg:{destination:destination,state:2},type:0});
					I2P_SOCKETS[destination].write(d);
		});
	};
};

function th_SanitizeWebPosts(posts,destination){//th
	var tmpstr="";
	console.log("th_SanitizeWebPosts",destination);
	//console.log("before sanitizing",posts[0]);
	for(var i in posts){
		if(destination) posts[i].destination=destination;
		tmpstr=sanitizer.sanitize(posts[i].data);
		posts[i].src=sanitizer.escape(tmpstr.replace(/\n/g,"\\n"));
		posts[i].data=marked(ent.decode(tmpstr),{renderer:th_renderer}).replace(/[\n\r]/g,"<br>").replace(/id\=\".*?\"/g,"");
		if(defined(posts[i].cmnts)){
			for(var j in posts[i].cmnts){
				tmpstr=sanitizer.sanitize(posts[i].cmnts[j].txt);
				posts[i].cmnts[j].src=sanitizer.escape(tmpstr.replace(/\n/g,"\\n"));
				posts[i].cmnts[j].txt=marked(tmpstr,{renderer:th_renderer}).replace(/[\n\r]/g,"<br>").replace(/id\=\".*?\"/g,"");
			}
		}
	};
	//console.log("after sanitizing",posts[0]);
	return posts;
}



/*
function IsBlockedF(element, index, array) {
	return (element.destination.toString() === this.toString() && element.banned === 1);
}

function IsInKnownF(element, index, array) {
	return (element.destination.toString() === this.toString());
}

function IsInIFollowF(element, index, array) {
	console.log("1 IsInIFollowF ",(element.destination==this.toString()),(element.ifollow == 1));
	console.log("2 IsInIFollowF ",index);
	return ((element.destination == this.toString() && element.ifollow == 1) ? (index):(-1));
}

function IsInFollowMeF(element, index, array) {
	return (element.destination.toString() === this.toString() && element.followme === 1);
}

function isInClientsF(element, index, array) {
	//console.log("........................",clients[index].destination.toString().substr(0,10),this.toString().substr(0,10),(clients[index].destination.toString() === this.toString()));
	//return (clients["i2p"][index].destination.toString() === this.toString())?index:-1;
	return (element.destination.toString() === this.toString());
}*/
/*function th_isInClientsF(element, index, array) {
	return (element.destination.toString() === this.toString());
}*/


function isConnected(destination){
	return (isInClients("i2p",destination) || isInSockets(destination));
};
function isInSockets(destination){
	return (defined(I2P_SOCKETS[destination]) && I2P_SOCKETS[destination].connected>0);
}



































//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// With context
function CreateNewProfile(context){
	console.log("CREATING NEW "+context+" PROFILE");
	my_profile[context]={type:"my_profile",nick: context+randy.shuffle(Date.now().toString().substr(6)),	desc: "", mail: ""};
	add2db(my_profile[context], context, "my_profile");
};


function PollKnown(context){
	if(context=="i2p")
	{
		console.log("PollKnown I2P");
		for(var n in known[context]){
			if(!defined(polling[known[context][n].destination]))
			{
				polling[known[context][n].destination]={};
				polling[known[context][n].destination].cnt=0;
			};
			if(/*polling[known[n].destination].cnt<1 ||*/ isConnected(known[context][n].destination) || IsInIFollow(context, known[context][n].destination))
			{
				if(restricted!=known[context][n].destination)
				{
					QueuePoll(known[context][n]);
					polling[known[context][n].destination].cnt++;
				};
			};
		};
		setTimeout(function(){PollKnown(context);},30000);
	}
	else
	{
		console.log("PollKnown TH");
		if(known[context].length==0){
			for(var n in bootstrap_peers){
				if(bootstrap_peers[n]!=configs[context].destination && !isInClients(context, bootstrap_peers[n]))
				{
					//start a channel to another destination, assuming they have the listener above
					targetHashname = bootstrap_peers[n];
					var tdata={nick:my_profile[context].nick, desc:my_profile[context].desc, mail:my_profile[context].mail};
					tdata.ifollow=(IsInIFollow(context, targetHashname))?1:0;
					firstPacket = {
						js: {
								cmd: "update_my_profile",
								profile:tdata
							}
						};
					try{
						console.log("trying to bootstrap with "+targetHashname);
						gth.start(targetHashname, GCHANNELNAME, firstPacket, packetHandler);
					}catch(err){
						console.log("#########",err.toString(),targetHashname);
					};
				};
			};
		}
		else
		{
			for(var n in known[context]){
				if(known[context][n].destination!=configs[context].destination )
				{
					if(!isInClients(context, known[context][n].destination) && IsInIFollow(context, known[context][n].destination))
					{
						//start a channel to another destination, assuming they have the listener above
						targetHashname = known[context][n].destination;
						var tdata={nick:my_profile[context].nick, desc:my_profile[context].desc, mail:my_profile[context].mail};
						tdata.ifollow=(IsInIFollow(context, targetHashname))?1:0;
						firstPacket = {
							js: {
									cmd: "update_my_profile",
									profile:tdata
								}
							};
						try{
							gth.start(targetHashname, GCHANNELNAME, firstPacket, packetHandler);
						}catch(err){
							console.log("#########",err.toString(),targetHashname);
							if(err.toString()=="TypeError: Cannot read property 'destination' of undefined"){
								var peerid = targetHashname;
								/*th_db.query(function(doc, emit) {
									if (doc.destination === peerid  && doc._id !== "my_config"  && doc.type !== "post") {
										emit(doc);
									}
								}, function(err, results) {
									if(err)
									{
										console.log(err);
									}
									else
									{
										console.log("results.rows.length="+results.rows.length);
										if(results.rows.length<=0){
											;
										}
										else
										{
											console.log(results.rows.key);*/
											DB["th"].remove({type:"known",destination:targetHashname}, {},function(err, response) {
												if(err)
												{
													console.log("error in delete wrong peer",err);

												}
												else console.log(response);
											});
										/*};

									};
								});*/
								known[context].splice(findIndexOfKnown(context, targetHashname),1);
							}
						}
					}
					else
					{
						var q={
							cmd:"ping",
							data:""
						};
						SendData2Dest(context, known[context][n].destination,q);
					};
				};
			};
		};
		setTimeout(function(){PollKnown(context);},60000);
	};
};


function poll(context){
	updateMyPosts(context);
	updateAllPeersLists(context,true);
	updateMyConfig(context);
	updateMyProfile(context);
		
	if(context=="i2p")
	{
		console.log("poll known.length="+known[context].length);
	}
	else
	{
		console.log("poll th_known.length="+known[context].length);
		th_updateMyWebPosts();
		Send2UI(context,"addPeersWebPosts",{msg:th_webposts,type:"peerswebposts"});//th_webposts=th_webposts.concat(packet.data);
	};
	Send2UI(context,"addPeersPosts",{msg:posts[context],type:"posts"+[context]});
};
function add2db(data, context, type, id)
{
	console.log("add2db",context,type,id,data);
	if(typeof(type)!="undefined")
	{
		data.type=type;
	};
	if(type=="my_config" || type=="my_profile")
	{
		//console.log("type=",type);
		//console.log(data);
		DB[context].update({type:type}, {$set:data},{upsert:true},function (err, numReplaced) {
			if(err){
				console.log('update error', err);
				console.log(id,data);
				Send2UI( context,"log",{msg:err,type:1});
			}
			else
			{
				console.log('update ok');
				if(type=="my_config")updateMyConfig( context);
				if(type=="my_profile")updateMyProfile( context);
				DB[context].persistence.compactDatafile();
			};
		});
	}
	else if(typeof(id)=="undefined")
	{
		console.log('no id');
		DB[context].insert(data, function(err, response) {
			if(err){Send2UI( context,"log",{msg:err,type:1});}
			else{
				if(type=="known"){
					updateAllPeersLists( context,true);
					if(context=="i2p")	queue_db_peers.done(); 
					else 				th_queue_db_peers.done();
				};
				if(type=="post"){updateMyPosts( context);};
			};
		});
	}
	else
	{
		console.log("th id", id);
		DB[context].update({_id:id}, {$set:data},{upsert:true},function(err, response) {
			if(err){
				console.log('th_put error');
				Send2UI( context,"log",{msg:err,type:1});
			}
			else
			{
				if(type=="known"){
					updateAllPeersLists( context,true);
					if(context=="i2p")	queue_db_peers.done(); 
					else 				th_queue_db_peers.done();
				};
				if(type=="post"){updateMyPosts( context);};
				DB[context].persistence.compactDatafile();
			};
		});
	};
};

function add2wdb(data, context, type, id)
{
	console.log("add2wdb",context,type,id,data);
	if(typeof(type)!="undefined")
	{
		data.type=type;
	};
	if(context=="i2p")
	{
		if(type=="my_config" || type=="my_profile")
		{
			//console.log("type=",type);
			DB[context].update({type:type}, {$set:data},{upsert:true},function (err, numReplaced) {
				if(err){
					console.log('update error', err);
					console.log(id,data);
					Send2UI( context,"log",{msg:err,type:1});
				}
				else
				{
					console.log('update ok');
					if(type=="my_config")updateMyConfig( context);
					if(type=="my_profile")updateMyProfile( context);
					DB[context].persistence.compactDatafile();
				};
			});
		}
		else if(typeof(id)=="undefined" || id.toString().length<4)
		{
			console.log('no id');
			DB["i2pw"].insert(data, function (err, response) {
				if(err){
					Send2UI( context,"log",{msg:err,type:1});
				}
				else
				{
					if(type=="post"){	updateMyPosts( context);};
					if(type=="known"){updateAllPeersLists( context,true);queue_db_peers.done();};
				};
			});
		}
		else
		{
			console.log("id=",id);
			DB["i2pw"].update({_id:id}, {$set:data},{upsert:true},function (err, numReplaced) {
				if(err){
					console.log('update error', err);
					console.log(id,data);
					Send2UI( context,"log",{msg:err,type:1});
				}
				else
				{
					console.log('update ok');
					if(type=="post"){updateMyPosts( context);};
					if(type=="known"){updateAllPeersLists( context,true);queue_db_peers.done();};
					DB["i2pw"].persistence.compactDatafile();
				};
			});

		};
	}
	else
	{
		if(type=="my_config" || type=="my_profile")
		{
			//console.log("type=",type);
			//console.log(data);
			DB[context].update({type:type}, {$set:data},{upsert:true},function (err, numReplaced) {
				if(err){
					console.log('update error', err);
					console.log(id,data);
					Send2UI( context,"log",{msg:err,type:1});
				}
				else
				{
					console.log('update ok');
					if(type=="my_config")updateMyConfig( context);
					if(type=="my_profile")updateMyProfile( context);
					DB[context].persistence.compactDatafile();
				};
			});
		}
		else if(typeof(id)=="undefined")
		{
			console.log('no id');
			DB["thw"].insert(data, function(err, response) {
					if(err){Send2UI_W( context,"log",{msg:err,type:1});}
					else{
						if(type=="known"){updateAllPeersLists( context,true);th_queue_db_peers.done();};
						//if(type=="post"){updateMyPosts( context);};
					};
			});
		}
		else
		{
			console.log("th w id", id);
			DB["thw"].update({_id:id}, {$set:data},{upsert:true},function(err, response) {
				if(err){
					console.log('th_update_w error');
					Send2UI_W( context,"log",{msg:err,type:1});
				}
				else
				{
					if(type=="known"){updateAllPeersLists( context,true);th_queue_db_peers.done();};
					//if(type=="post"){updateMyPosts( context);};
					DB["thw"].persistence.compactDatafile();
				};
			});
		};
	};
};
function updateAllPeersLists(context, i_know_there_is_something)
{
	DB[context].find({type:"known"}, function(err, docs) {
		if(err)
		{
			console.log(err);
		}
		else
		{
			if(docs.length>0){
				var tdocs=JSON.parse(JSON.stringify(docs));
				known[context]=exportPouches(docs);//console.log("TH_KNOWN from db - ",th_known);
				for(var i in known[context]){
					if( context=="th" && isInClients(context, known[context][i].destination)) SetPeerState(context, known[context][i].destination,2);
					else if( context=="i2p" && isConnected(known[context][i].destination)) SetPeerState(context, known[context][i].destination,2);
					else SetPeerState(context, known[context][i].destination,0);
					if(parseInt(Date.now()) - parseInt(known[context][i].lastvis) > oldpeerto)
					{
						DB[context].remove({_id:known[context][i]._id}, {},function(err, response) {
									if(err) console.log(err);
									else console.log(response);
						});
						known[context].splice(i,1);
					}
				};
				Send2UI( context,"updateKnownPeers",{msg:known[context],type:0});
			}
			else if(i_know_there_is_something)
			{
				//console.log("!!!!!!!!!!!!NULL TH_KNOWN from db - ",th_known,docs);
				updateAllPeersLists( context,false);
			};
		};
	});
};

	
		
function updateMyPosts(context)
{
	var docs=[];
	DB[context].find({type:"post"},function(err, docs) {
		if(err)
		{
			console.log(err);
		}
		else
		{
			//console.log("cmnts from db",docs[0].cmnts);
			//var myposts[context]=[];
			myposts[context]=JSON.parse(JSON.stringify(docs));
			if(myposts[context].length>0)myposts[context]=SanitizePosts(context, myposts[context],configs[context].destination);
			Send2UI( context,"updateMyPosts",{msg:myposts[context],type:"myposts"});
		};
	});
	/*			if(configs["th"])
				{
					myposts[context]=SanitizePosts(context, myposts[context],configs["th"].destination);
					Send2UI( context,"updateMyPosts",{msg:myposts[context],type:"myposts_th"});
				}
				else console.log("no th_config yet");*/
	
}
function updateMyProfile(context)
{
	DB[context].findOne({type:"my_profile"},function(err, doc) {
		if(err)
		{
			console.log(err);
		}
		else
		{
			if(configs[context] && configs[context].destination) doc.destination=configs[context].destination;
			my_profile[context]=JSON.parse(JSON.stringify(doc));
			Send2UI( context,"updateProfile",{msg:my_profile[context],type:"myprofile"});
		};
	});
}
function updateMyConfig(context)
{
	DB[context].findOne({type:"my_config"},function(err, doc) {
		if(err)
		{
			console.log(err);
		}
		else
		{
			configs[context]=JSON.parse(JSON.stringify(doc));
			if(doc){
				var tcfg={};
				tcfg.destination=configs[context].destination;
				tcfg.cnctondem=configs[context].cnctondem;
				tcfg.maxoutcncts=configs[context].maxoutcncts;
				tcfg.autofetch=configs[context].autofetch;
				tcfg.maxautofetch=configs[context].maxautofetch;
				tcfg.maxlastestposts=configs[context].maxlastestposts;
				tcfg.maxincncts=configs[context].maxincncts;
				tcfg.maxknowns=configs[context].maxknowns;
				Send2UI( context,"updateSettings",{msg:tcfg,type:"mysettings"});
			};
		};
	});
}

function processAttributes( context,id,attrs)
{
	DB[context].update({_id:id}, {$set:attrs}, {}, function(err, response) {
		if(err){
			console.log('processAttributes update error',context,id,attrs);
			Send2UI(context,"log",{msg:err,type:1});
			updateAllPeersLists(context,true);
		}
		else
		{
			updateAllPeersLists(context,true);
		};
		DB[context].persistence.compactDatafile();
	});
}

function IsBlocked(context, destination) {
	try{
		for(var i=0; i<known[context].length; i++){
			if(known[context][i].destination == destination && known[context][i].banned == 1) return true;
		}
		return false;
	}catch(err){console.log("IsBlocked err",err);return false;};
}

function IsInKnown(context, destination) {
	try{
		for(var i=0; i<known[context].length; i++){
			if(known[context][i].destination == destination) return true;
		}
		return false;
	}catch(err){console.log("IsInKnown err",err);return false;};
}
function IndexOfKnown(context, destination) {
	try{
		for(var i=0; i<known[context].length; i++){
			if(known[context][i].destination == destination) return i;
		}
		return -1;
	}catch(err){console.log("IndexOfKnown err",err);return -1;};
}

function IsInIFollow(context, destination) {
	try{
		for(var i=0; i<known[context].length; i++){
			if(known[context][i].destination == destination && known[context][i].ifollow == 1) return true;
		}
		return false;
	}catch(err){console.log("IsInIFollow err",err);return false;};
}

function IsInFollowMe(context, destination) {
	try{
		for(var i=0; i<known[context].length; i++){
			if(known[context][i].destination == destination && known[context][i].followme == 1) return true;
		}
		return false;
	}catch(err){console.log("IsInFollowMe err",err);return false;};
}

function isInClients(context, destination) {
	if(context=="i2p")
	{
		try{return (defined(servscts[destination]) && defined(servscts[destination].connected) && servscts[destination].connected);}catch(er){return false;};
	}
	else
	{
		try{return (defined(clients[context][destination]) && defined(clients[context][destination].nick));}catch(er){return false;};
	};
}
/*
function findIndexOfClients(context, destination) {
	return clients[context].findIndex(isInClientsF,destination);
}
*/
function sendMyPosts(context, lim,off,destination)
{
	if(lim>0)
	{
		DB[context].find({type:"post"}).sort({ lts: -1 }).skip(off).limit(lim).exec(function (err, docs) {
		//th_db.find({type:"post"}, function(err, docs) {
			if(err)
			{
				console.log(err);
			}
			else
			{
				var tmyposts=JSON.parse(JSON.stringify(docs));
				for(var i in tmyposts){
					for(var j in tmyposts[i].cmnts){
						if(defined(tmyposts[i].cmnts[j].src)){
							tmyposts[i].cmnts[j].txt=tmyposts[i].cmnts[j].src.toString().replace(/\\+n/g,"\n");
							delete(tmyposts[i].cmnts[j].src);
						}
					}
				};
				var q={
						cmd:"my_last_myposts",
						data:tmyposts
				};
				SendData2Dest(context, destination,q);
			};
		});
	}
	else console.log("limit is required!");
}

function sendMyManyPosts(context, lim,off,destination)
{
	if(lim>0)
	{
		DB[context].find({type:"post"}).sort({ lts: -1 }).skip(off).limit(lim).exec(function (err, docs) {
		//th_db.find({type: "post"})/*.sort({ lts: -1 }).skip(off).limit(lim)*/.exec(function (err, docs) {
			if(err)
			{
				console.log(err);
			}
			else
			{
				var tmyposts=JSON.parse(JSON.stringify(docs));
				for(var i in tmyposts){
					for(var j in tmyposts[i].cmnts){
						if(defined(tmyposts[i].cmnts[j].src)){
							tmyposts[i].cmnts[j].txt=tmyposts[i].cmnts[j].src.toString().replace(/\\+n/g,"\n");
							delete(tmyposts[i].cmnts[j].src);
						}
					}
				};
				var q={
						cmd:"my_last_many_myposts",
						data:tmyposts
				};
				SendData2Dest(context, destination,q);
				th_sendMyManyWebPosts(lim,off,destination);
			};
		});
	}
	else console.log("limit is required!");
}

function SetPeerState(context,destination,state)
{
	var index=IndexOfKnown(context, destination);
	if(index>=0 && known[context][index]) known[context][index].state=state;
	Send2UI(context,"updatePeersState",{msg:{destination:destination,state:state},type:0});
}

function SendData2Dest(context, destination,q){
	if(context=="i2p")
	{
		if(destination==configs["i2p"].destination)return;
		var d=JSON.stringify(q);

		//console.log(d.toString('base64'));

		if(d.length > 1500)
		{
			console.log("initial length",d.length);
			zlib.deflate(d, function(err, d) {
				if (!err) {
					d=d.toString('base64');
					console.log("deflated length",d.length);
					var chunked={};
					chunked.id=Date.now();
					chunked.chunks=d.split(/(.{1024})/);
					for(var i in chunked.chunks){
						if(chunked.chunks[i].length==0)chunked.chunks.splice(i,1);
					};
					chunked.len=chunked.chunks.length;
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!chunking long data");
					//console.log(chunked);
					for(var i in chunked.chunks){
						var tchunk={};
						tchunk.chunked=true;
						tchunk.id=chunked.id;
						tchunk.len=chunked.len;
						tchunk.chunk=chunked.chunks[i];

						SendChunk(destination,tchunk,100);
					};
				};
			});
		}
		else
		{
			SendChunk(destination,q,100);
		};
	}
	else
	{
		if(defined(clients[context][destination]) && defined(clients[context][destination].chan))
		{
			clients[context][destination].chan.send({js:q});
		}
		else {
			Send2UI(context,"log",{msg:"no such client"});
			//console.log(destination,defined(th_clients[destination]));
		}
	};
};

function BroadcastData(context, data, spec){
	for(var i in known[context]){
		if(isInClients(context, known[context][i].destination)){
			if(spec=="followme"){
				if(IsInFollowMe(context, known[context][i].destination)) 	SendData2Dest(context, known[context][i].destination,data);
			}
			else if(spec=='my_profile'){
				data.profile.ifollow = (IsInIFollow(context, known[context][i].destination))?1:0;
				SendData2Dest(context, known[context][i].destination,data);
			}
			else SendData2Dest(context, known[context][i].destination,data);
		};
	};
};

////////////////////////////////////// клиентская обработка текстов постов, комментов
function SanitizePosts(context, posts,destination){
	var tmpstr;
	//console.log("before sanitizing",posts[0].cmnts);
	for(var i in posts){
		posts[i].destination=destination;
		tmpstr=sanitizer.sanitize(posts[i].txt);
		posts[i].src=sanitizer.escape(tmpstr.replace(/\n/g,"\\n"));
		posts[i].txt=marked(ent.decode(tmpstr),{renderer:((context=="th")?(th_renderer):(renderer))}).replace(/[\n\r]/g,"<br>").replace(/id\=\".*?\"/g,"");
		if(defined(posts[i].cmnts)){
			for(var j in posts[i].cmnts){
				tmpstr=sanitizer.sanitize(posts[i].cmnts[j].txt);
				posts[i].cmnts[j].src=sanitizer.escape(tmpstr.replace(/\n/g,"\\n"));
				posts[i].cmnts[j].txt=marked(tmpstr,{renderer:((context=="th")?(th_renderer):(renderer))}).replace(/[\n\r]/g,"<br>").replace(/id\=\".*?\"/g,"");
			}
		}
	};
	//console.log("after sanitizing",posts[0].cmnts);
	return posts;
}

//////////////////////////////////////////////////////

function ProcessSharing(context, destination,packet,cb)
{
	console.log("ProcessSharing", context);
	if(defined(packet.data.ack) && packet.data.ack)
	{//sending
		if(defined(packet.data.stop) && packet.data.stop==1)
		{
			console.log("#################################end");
			if(cb)cb();
			SendData2Dest(context,destination,{cmd:"no",data:{sharing:1,file:1,fn:packet.data.fn,end:true}});
			fs.close(Files[context][destination][packet.data.fn]['Handler']);
			Files[context][destination][packet.data.fn]=null;
		}
		else
		{
			var chunk;//= readable.read(1024*15);
			var buffer = new Buffer(1024*1);
			fs.read(Files[context][destination][packet.data.fn]['Handler'], buffer, 0, 1024*1, null, function(error, bytesRead, buffer) {
				if(error){
					console.log("ERROR:"+error);
					//process.exit(0);
					return;
				}
				chunk=buffer;
				var tchunk=base64.encode(chunk);
				//console.log('got %d bytes of data', bytesRead);
				if(cb)cb();
				SendData2Dest(context, destination,{cmd:"no",
										data:{
											sharing:1,
											file:1,
											end:false,
											chunk:tchunk,
											fs:bytesRead,
											fn:packet.data.fn
										}
									});
			});
		}
	}
	else if(defined(packet.data.file) && packet.data.file==1)
	{//receiving
		if(packet.data.end==true)
		{
			log("Ready");
			//fs.close(th_RFiles[destination][packet.data.fn]['Handler'],function(err){console.log(err);});
			packetnum[context][destination][packet.data.fn]=0;
			if(cb)cb();
		}
		else
		{
			if(!defined(packetnum[context][destination]) || !defined(packetnum[context][destination][packet.data.fn]) || packetnum[context][destination][packet.data.fn]==0)
			{
				packetnum[context][destination][packet.data.fn]=0;
				PrepareFileForSavingFromPeer2(context, { 'Name' : packet.data.fn, 'Size' : packet.data.fs }, destination);
			}
			else
			{
				AppendSavingFileFromPeer2(context, { 'Name' : packet.data.fn, 'Data' : packet.data.chunk },packet.data.fs, destination);
				Send2UI(context,"progress",{"fn":packet.data.fn,'Percent':parseInt((RFiles[context][destination][packet.data.fn]['Downloaded']/RFiles[context][destination][packet.data.fn]['FileSize'])*100)})
			}
			log("packetnum[context][destination][fn]="+packetnum[context][destination][packet.data.fn]);
			if(cb)cb();
		}
	};
};

//////////////////////////////////// аплоад новых файлов в библиотеку. И тут же файлообмен через BOB
function OpenFile(context, fname,destination) {
	var Name = fname;
	//filename[destination]=fname;
	console.log("th_OpenFile - "+Name);
	if(!defined( Files[context][destination] )) Files[context][destination]={};
	Files[context][destination][Name] = {
		FileSize : 0,
		Uploaded : 0,
		Handler:0
	}
	var Place = 0;
	try{
		var Stat = fs.statSync(path.resolve(__dirname,PDX_FF_PUBLIC_FILES[context] +  Name));
		if(Stat.isFile())
		{
			Files[context][destination][Name]['FileSize'] = Stat.size;
			//Place = Stat.size / 524288;
		}
	}
	catch(er){} //It's a New File
	fs.open(path.resolve(__dirname,PDX_FF_PUBLIC_FILES[context]+Name ), 'r', function(err, fd){
		if(err){console.log(err);}
		else
			Files[context][destination][Name]['Handler'] = fd; //We store the file handler so we can write to it later
	});
};

//////////////////////////////////////////

function PrepareFileForSavingFromPeer2(context, data,destination) {
	var Name = data['Name'];
	duplex[context][Name] = new DUPSTREAM();
	console.log("StartFile - "+Name);
	if(!defined(RFiles[context][destination]))RFiles[context][destination]={};
	RFiles[context][destination][Name] = {  //Create a new Entry in The th_Files Variable
		FileSize : data['Size'],
		Downloaded : 0
	};
	sendackprivate(context, destination,Name);
};

function AppendSavingFileFromPeer2(context, data,len,destination){
	var Name = data['Name'];
	RFiles[context][destination][Name]['Downloaded'] += len;
	try{
		duplex[context][Name].write(base64.decode(data['Data']),'Binary');
	}catch(er){console.log(Name);console.log(data['Data']);console.log(er);};
	//console.log(data);
	//console.log("th_RFiles["+sid+"][Name]['Downloaded']="+th_RFiles[sid][Name]['Downloaded']+" th_RFiles["+sid+"][Name]['FileSize']="+th_RFiles[sid][Name]['FileSize'])
	if(RFiles[context][destination][Name]['Downloaded'] == RFiles[context][destination][Name]['FileSize']) //If File is Fully Uploaded
	{
		console.log("##############################Completed");
		duplex[context][Name].write('0','Binary');
		sendstopprivate(context, destination,Name);
		if(!defined(TFiles[context][destination]) || !defined(TFiles[context][destination][Name]) || !defined(TFiles[context][destination][Name]["extimgs"]))
		{
			Send2UI(context, "StartDL",{'file':Name,'port':(context=="th")?th_dl_port:dl_port});
		}
		else if(context=="th")
		{
			//console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++SAVING FILE TO EXTIMGS");
			var writable = fs.createWriteStream(path.resolve(__dirname,"./public/extimgs/"+destination+"/"+Name));
			// All the data from readable goes into 'file.txt'
			duplex[context][Name].pipe(writable, { end: false });
			writable.on("end", function() {
				poll(th);
			});
			//fs.writeFileSync(path.resolve(__dirname,"./public/extimgs/"+destination+"/"+Name),);
		};
	}
	else sendackprivate(context, destination,Name);
};

function sendackprivate(context,destination,fn)
{
	var data = {};
	data.sharing=1;
	data.fn=fn;
	data.ack = packetnum[context][destination][fn] ? packetnum[context][destination][fn]:1;
	SendData2Dest(context, destination,{cmd:"no",data:data});
	packetnum[context][destination][fn]++;
}
function sendstopprivate(context,destination,fn)
{
	var data = {};
	data.sharing=1;
	data.fn=fn;
	data.stop=1;
	data.ack = packetnum[context][destination][fn] ? packetnum[context][destination][fn]:1;
	SendData2Dest(context, destination,{cmd:"no",data:data});
	packetnum[context][destination][fn]++;

}


















/*function UpdateImgInPostInMemory(hashname,id,src){
	console.log("UpdateImgInPostInMemory(hashname,id){");
	console.log(hashname);
	console.log(id);
	th_posts.forEach(function(el,ind){
		if(el.txt.indexOf(id)>0){
			el.txt=el.txt.replace(id,hashname+el._id+"' src='"+src+"' title='");
		}
	});
};
*/



///////////////////функции для организации очереди проверки i2p-destination адресов на валидность, думал проверять все, приходящие в cmd:"my_known"
function AddNewPeersForVerifing(peers)
{
	for(var i in peers){
		console.log(peers[i].nick);
		if(!IsInKnown("i2p",peers[i].destination) && configs["i2p"].destination != peers[i].destination){
			tknown=ConcatUnique(tknown,[peers[i]]);
		};
	};
	VerifyDests();
};

function VerifyDests()
{
	console.log("VERIFYING TKNOWNS");
	//console.log(tknown);
	for(var i in tknown){
		var key=tknown[i].destination.toString();
		console.log("VERIFYING:    "+key.substr(0,10)+"...");
		CBs[key]={};
		CBs[key].i=i;
		CBs[key].peer=tknown[i];
		CBs[key].cb_verified_knowed=function(){Verified(key,VerifyDests);};
		CallBobForVerifyingDest(key,1000);
		return;
	};
};

function CallBobForVerifyingDest(key,to)
{
	setTimeout(function(){
		try{
			stepout=11;strout="";waitAnswerOut="OK\n";CBs[key].cur=1;outclient.write('verify '+key+'\n');
		}catch(err){
			console.log(key+" "+to+" "+err.toString());
		};
	},to);
};
function Verified(key,cb)
{
	console.log("Verified_cb();");
	if(configs["i2p"].destination === key){
		console.log("destination === key - skiping...");
		tknown.splice(CBs[key].i,1);
		if(cb)cb();
	}
	else
	{
		if(typeof(CBs[key].peer._id)!="undefined")
		{
			console.log("VERIFIED 1 ->"+CBs[key].peer.nick);
			if(!IsInKnown("i2p",CBs[key].peer.destination)){
				console.log("VERIFIED IS NEW");
				AddNewPeers("i2p",[tknown[CBs[key].i]],false);

			};
			tknown.splice(CBs[key].i,1);
			if(cb)cb();
		}
		else
		{
			console.log("VERIFIED 2 ->"+CBs[key].peer.nick);
			if(!IsInKnown("i2p",CBs[key].peer.destination)){
				console.log("VERIFIED IS NEW");
				AddNewPeers("i2p",[tknown[CBs[key].i]],false);
			};
			tknown.splice(CBs[key].i,1);
			if(cb)cb();
		};
	};
};
//////////////////////////////////////////////////////////////////////








































////////////////////////////////////////обработка приходящих по BOB данных
var PACKETS=[];
function ProcessIncoming(destination,packet,server,socket,cappservices)
{
	if(!defined(PACKETS[destination]))PACKETS[destination]=[];
	if(defined(packet.chunked)){
		if(!defined(PACKETS[destination][packet.id]))
		{
			PACKETS[destination][packet.id]={};
			PACKETS[destination][packet.id].len=packet.len;
			PACKETS[destination][packet.id].chunks=[];
			console.log("READY FOR CHUNKS");

		};
		console.log(PACKETS[destination]);
		if(PACKETS[destination][packet.id].chunks.length < PACKETS[destination][packet.id].len)
		{
			//console.log("received chunk:"+packet.chunk);
			PACKETS[destination][packet.id].chunks.push(packet.chunk);
		};
		if(PACKETS[destination][packet.id].chunks.length == PACKETS[destination][packet.id].len)
		{
			console.log("received all chunks");
			var packetstr=PACKETS[destination][packet.id].chunks.join('');
			PACKETS[destination].slice(packet.id,1);
			var buffer = new Buffer(packetstr, 'base64');
			zlib.inflate(buffer, function(err, packetstr) {
				if (!err) {
					console.log(packetstr.toString());

					var packet=JSON.parse(packetstr);
					if(packet.data && packet.data.destination && IsBlocked("i2p", packet.data.destination)){
						socket.end('You are banned!\n');
						//clients.splice(cappservices,1);
						return;
					};
					if(defined(packet.data) && defined(packet.data.sharing)){
						ProcessSharing("i2p",destination,packet,null);
						return;
					};
					ProcessCmd(destination, packet,server, socket, cappservices,null,"i2p");
				}
				else
				{
					console.log("inflate error", err);
				};
			});
		};

	}
}













////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






















var I2P_SOCKETS=[];
//////////////////////////////////////////I2P_SOCKET - это когда мы инициируем подключение к удаленному destination адресу
function StartI2pSocket(destination,cb){

	var str2="";
	I2P_SOCKETS[destination] = new net.Socket({ 
	  'allowHalfOpen': false,
	  'readable': true,
	  'writable': true
	});
	I2P_SOCKETS[destination].connect(BOBinport, BOBinhost, function(err) {
								if(err)console.log(err,BOBinport,BOBinhost);
								else console.log('I2P_SOCKET CONNECTED TO: ' + BOBinhost + ':' + BOBinport + " for destination="+destination.substr(0,10));
								I2P_SOCKETS[destination].write(destination+"\n");	
								SetPeerState("i2p",destination,1);
							});
	I2P_SOCKETS[destination].on('data', function(data) {
		//console.log(data.toString());
		str2+=data.toString();
		try{
			var packet=JSON.parse(str2);
			str2="";
			//console.log(packet);
				if(defined(packet.chunked)){
					console.log("processing chunked packet");
					ProcessIncoming(destination,packet,false, null, null);
					console.log("sendind ack ");
					SendData2Dest2(destination,{cmd:"ack"});
				}
				else
				{
					if(typeof(packet.data)!="undefined" && typeof(packet.data.sharing)!="undefined"){
							ProcessSharing("i2p",destination,packet);
							console.log("sendind ack ");
							SendData2Dest2(destination,{cmd:"ack"});
							return;
					}
					ProcessCmd(destination,packet,false,null,null,null,"i2p");	
				};
			
		}
		catch(er){
			console.log(er);
			//console.log("RAW DATA2: "+JSON.stringify(str2));
			//if(str2.indexOf("java.net.NoRouteToHostException: Connection timed out")>=0)
			if(str2.indexOf("java.net")>=0)
			{
				str2="";
				I2P_SOCKETS[destination].destroy();
				setTimeout(function(){
					console.log("RESTARTING TO "+destination.substr(0,10));
					StartI2pSocket(destination,cb);
				},10000);
			}
			else if(er.toString().indexOf("Unexpected token {")>0)
			{
					
					var packet=(data.toString());
					var parts=packet.split('}{');
					if(parts.length>1)
					{
						
						for(var i in parts)
						{
							if(i<(parts.length-1))
							{
								parts[i]=parts[i]+"}";
								parts[parseInt(i)+1]="{"+parts[parseInt(i)+1];
							};
							
							jsonstr=parts[i];
							try{
								var pack=JSON.parse(jsonstr);
								//console.log(pack);
								if(defined(pack.chunked)){
									console.log("processing chunked packet");
									ProcessIncoming(destination,pack,false, null, null);
									console.log("sendind ack ");
									SendData2Dest2(destination,{cmd:"ack"});
								}
								else
								{
									if(typeof(pack.data)!="undefined" && typeof(pack.data.sharing)!="undefined"){
													ProcessSharing("i2p",destination,pack);
													console.log("sendind ack ");
													SendData2Dest2(destination,{cmd:"ack"});
													continue;
									}
									else
									{
										ProcessCmd(destination, pack,false, null, null, null,"i2p");
									};
									
								};
								
							}
							catch(err){
								console.log("REALLY BAB DATA RECEIVED BY SOCKET...");
								//console.log(err);
								//console.log(jsonstr);
							};
						};
						str2="";
					}
			}
			if(str2.toString().indexOf("Who are you?")>=0)
			{
				str2="";
				console.log("received Who are you? sending part of my profile");
				var tdata={nick:my_profile["i2p"].nick, desc:my_profile["i2p"].desc, mail:my_profile["i2p"].mail};
				tdata.ifollow=(IsInIFollow(destination))?1:0; 
				if(known["th"].length==0)
				{
					//global.need_reset=true;??????????????????????????????????????????????????????????????????????????????????
				}
				
				I2P_SOCKETS[destination].write(JSON.stringify({
									cmd:"update_my_profile",
									profile:tdata
				}));
				if(!defined(queue[destination])){
					queue[destination] = {};
					queue[destination].queue=new Q;
					queue[destination].done=function(destination){queue[destination].queue.done();};
				};
				if(cb)cb();
			};
			SetPeerState("i2p",destination,2);
		}
		
		
	})

	// Add a 'close' event handler for the I2P_SOCKETS[destination] socket
	I2P_SOCKETS[destination].on('close', function() {
		console.log('Connection with '+destination.substr(0,10)+' is closed');
		I2P_SOCKETS[destination].connected=0;
		I2P_SOCKETS[destination].destroy();
		if(!isInClients("i2p",destination))SetPeerState("i2p",destination,0);
		I2P_SOCKETS.splice(destination,1);
		polling[destination].cnt=999;
	});



}





//////////////////////////////////////этот сервер для входящих BOB подключений других пиров
var appserver;
var appservcs=0;
var servscts=[];
function StartServer()
{
	appserver = net.createServer(function(c) { //'connection' listener
		console.log('appserver connected',appservcs);
		//console.log(c);
		var cappservices=appservcs;
		appservcs++;
		clients["i2p"][cappservices]={};
		c.pcnt=0;
		c.on('data',function(data){
			try{
				if(clients["i2p"][cappservices] && clients["i2p"][cappservices].destination && IsBlocked("i2p",clients["i2p"][cappservices].destination)){
					c.end('You are banned!\n');
					clients["i2p"].splice(cappservices,1);
					console.log("sendind ack to banned");
					SendData2Dest2(clients["i2p"][cappservices].destination,{cmd:"ack"});
					return;
				};
					
				var packet=JSON.parse(data.toString());
				//console.log(packet);
				if(defined(packet.chunked)){
					console.log("processing chunked packet");
					ProcessIncoming(clients["i2p"][cappservices].destination,packet,true, c, cappservices);
					console.log("sendind ack ");
					SendData2Dest2(clients["i2p"][cappservices].destination,{cmd:"ack"});
				}
				else
				{
					if(defined(packet.data) && defined(packet.data.sharing)){
						ProcessSharing("i2p",clients["i2p"][cappservices].destination,packet);
						console.log("sendind ack ");
						SendData2Dest2(clients["i2p"][cappservices].destination,{cmd:"ack"});
						return;
					};
					ProcessCmd(clients["i2p"][cappservices].destination, packet,true, c, cappservices, null,"i2p");
				}
				
				if(c.pcnt==0)c.pcnt++;
			}
			catch(er)
			{
				console.log("HANDLED ERROR1");
				//console.log(er);
				//console.log(data.toString());
				//console.log(JSON.stringify(data));
				if(er.toString().indexOf("Unexpected end of input")>0)
				{
					c.write('Reconnect\n');
				}
				else if(er.toString().indexOf("Unexpected token {")>0)
				{
					var packet=(data.toString());
					var parts=packet.split('}{');
					if(parts.length>1)
					{
						
						for(var i in parts)
						{
							if(i<(parts.length-1))
							{
								parts[i]=parts[i]+"}";
								parts[parseInt(i)+1]="{"+parts[parseInt(i)+1];
							};
							
							jsonstr=parts[i];
							try{
								var pack=JSON.parse(jsonstr);
								//console.log(pack);
								if(defined(pack.chunked)){
									console.log("processing chunked packet");
									ProcessIncoming(clients["i2p"][cappservices].destination,pack,true,c,cappservices);
									console.log("sendind ack ");
									SendData2Dest2(clients["i2p"][cappservices].destination,{cmd:"ack"});
								}
								else
								{
									//console.log(pack);
									if(pack.data && pack.data.destination && IsBlocked("i2p",pack.data.destination)){
										c.end('You are banned!\n');
										clients["i2p"].splice(cappservices,1);
										continue;
									};
									if(typeof(pack.data)!="undefined" && typeof(pack.data.sharing)!="undefined"){
										ProcessSharing("i2p",clients["i2p"][cappservices].destination,pack);
										console.log("sendind ack ");
										SendData2Dest2(clients["i2p"][cappservices].destination,{cmd:"ack"});
										continue;
									}
									else
									{
										ProcessCmd(clients["i2p"][cappservices].destination, pack,true, c, cappservices, null,"i2p");
									};
								};
								
							}
							catch(err){
								console.log("REALLY BAB DATA RECEIVED 2...");
								//console.log(err);
								//console.log(jsonstr);
							};
						};
						
					}
				}
				else
				{
					var packet=(data.toString());
					if(c.pcnt==0){
						//console.log(JSON.stringify(packet));
						if(packet.indexOf("AAAA\n")>0)
						{
							var key=packet.substr(0,packet.length-1);
							clients["i2p"][cappservices].destination=key;
							c.write('Who are you?\n');
							c.pcnt++;
							queue[key] = {};
							queue[key].queue=new Q;
							queue[key].done=function(key){queue[key].queue.done();};
							
						}
						else if(packet.indexOf("AAAA")>0)
						{
							var key=packet.substr(0,packet.length);
							clients["i2p"][cappservices].destination=key;
							c.write('Who are you?\n');
							c.pcnt++;
							queue[key] = {};
							queue[key].queue=new Q;
							queue[key].done=function(key){queue[key].queue.done();};
							
						}
						else
						{
							console.log("##################################################################\r\n##################################################################\r\n##################################################################\r\n##################################################################\r\n##################################################################\r\n##################################################################\r\n"+packet);
						}
					}
					//else					console.log("SERVER RECEIVED:"+packet);
				};	
			
			};
		});
		c.on('end', function() {
			console.log('appserver disconnected ',cappservices,isInSockets(clients["i2p"][cappservices].destination.substr(0,10)));
			if(clients["i2p"][cappservices] && !isInSockets(clients["i2p"][cappservices].destination)){
				SetPeerState("i2p",clients["i2p"][cappservices].destination,0);
				servscts.splice(clients["i2p"][cappservices].destination,1);
				//polling[clients["i2p"][cappservices].destination].cnt=999;
				clients["i2p"].splice(cappservices,1);
				
			}
		});
	  
	});
	appserver.listen(BOBoutport, function() { //'listening' listener
	  console.log('server bound');
	  
	});
};


















///////////////////////////////управление BOB интерфейсом маршрутизатора I2P
function StopBob(){outclient.write('stop\n');appserver.close();outclient.destroy();I2P_SOCKET.destroy();};
var outclient;
var waitAnswerOut="";
var strout="";
var stepout=0;
var CBs=[];
var newline=(isWin)?"\r\n":"\n";
function CallBobFor(action,args,cb){
		is_running=true;
		outclient = new net.Socket({ 
		  'allowHalfOpen': false,
		  'readable': true,
		  'writable': true
		});
		
		outclient.connect(BOBPORT, BOBHOST, function(err) {
				waitAnswerOut="BOB 00.00.10"+newline;stepout=0;
				if(err){console.log(err);setTimeout(CallBobFor(action,args,cb),5000);}
				else console.log('OUTCLIENT CONNECTED TO: ' + BOBHOST + ':' + BOBPORT);
									
		});
		
		function nextTCPstepOut()
		{
			switch(stepout)
			{
				case 0:break;
				case 1:strout="";waitAnswerOut="OK Nickname set to "+BOBNAME+newline;outclient.write('setnick '+BOBNAME+'\r\n');break;
				case 2:strout="";	console.log(configs["i2p"]);if(!configs["i2p"] || !configs["i2p"].mykeys || configs["i2p"].mykeys==-1){
											console.log('need new keys');
											configs["i2p"]={};
											configs["i2p"].cnctondem=0;
											configs["i2p"].maxoutcncts=0;
											configs["i2p"].autofetch=1;
											configs["i2p"].maxautofetch=50;
											configs["i2p"].maxlastestposts=10;
											configs["i2p"].maxincncts=0;
											configs["i2p"].maxknowns=0;
											configs["i2p"].mykeys=-1;
											waitAnswerOut="AAAA"+newline;outclient.write('newkeys\n');
										}
										else {
											console.log('setting keys');
											waitAnswerOut="AAAA"+newline;outclient.write('setkeys '+configs["i2p"].mykeys+'\n');
										};break;
				case 2.5:	setTimeout(function(){
								strout="";
								outclient.connect(BOBPORT, BOBHOST, function(err) {
									waitAnswerOut="OK"+newline;stepout=0;
									if(err)console.log(err);
									else console.log('OUTCLIENT CONNECTED TO: ' + BOBHOST + ':' + BOBPORT);
														
								});
							},5000);break;
				case 3:strout="";waitAnswerOut=newline;outclient.write('getkeys\n');break;
				case 4:strout="";waitAnswerOut=newline;outclient.write('inhost '+BOBinhost+'\n');break;
				case 5:strout="";waitAnswerOut=newline;outclient.write('inport '+BOBinport+'\n');break;
				case 6:strout="";waitAnswerOut=newline;outclient.write('outhost '+BOBouthost+'\n');break;
				case 7:strout="";waitAnswerOut=newline;outclient.write('outport '+BOBoutport+'\n');break;
				case 8:strout="";waitAnswerOut=newline;outclient.write('start\n');break;
				case 9:strout="";waitAnswerOut=newline;outclient.write('getdest\n');break;
				case 10:
							switch(action){
								case "start_server":
										console.log("starting I2P-socket-server");
										try{StartServer();}catch(err){console.log(err);};
										if(cb)cb();
										break;
								case "connect_dest":
										console.log("starting I2P-socket-server");
										try{StartServer();}catch(err){console.log(err);};
										console.log("connecting to destination "+args.destination.substr(0,10));
										if(args)setTimeout(function(){console.log("CCCCCCCCCBBBBBBBBBB Before StartI2pSocket");StartI2pSocket(args.destination,cb);},1000);
										//if(args)SendData2Dest(args.destination,cb);
										break;
								case "connect_host_tmp":
										console.log("starting I2P-socket-server");
										try{StartServer();}catch(err){console.log(err);};
										console.log("connecting to host http://4rjzpjkfgr7kez3eqb7435j4ce4xqioroe4cplfziiem4ckd7k4a.b32.i2p");
										Connect2Host4Init();
										break;
								case "connect_host":
										console.log("starting I2P-socket-server");
										try{StartServer();}catch(err){console.log(err);};
										console.log("connecting to host ??? http://4rjzpjkfgr7kez3eqb7435j4ce4xqioroe4cplfziiem4ckd7k4a.b32.i2p");
										console.log(configs["th"].destination);
										var post_data="i2parg="+configs["i2p"].destination;
										var options = {
											hostname: '127.0.0.1',
											port: 4444,
											method: 'POST',
											//path: "http://4rjzpjkfgr7kez3eqb7435j4ce4xqioroe4cplfziiem4ckd7k4a.b32.i2p",
											path: "http://xpi5tv4h6t4ejetbk2lvbyopx4z3pdm7d7n6gk33rfwidg7x7rvq.b32.i2p/",
											headers: {
											    'Content-Type': 'application/x-www-form-urlencoded',
												'Content-Length': post_data.length
											}
										};
										var body="";
										var req = http.request(options, function(res){ 
											res.on("data", function(chunk) {
												body+=chunk;
											  });
											res.on("end", function(){
												console.log("received POST response");
												console.log(body);
												var alert=JSON.parse(body).alert;
												alerts=SanitizePosts("i2p",[alert],imyarek_dest);
												Send2UI("i2p","updateAlertsPosts",{msg:alerts,type:0});
												add2db(configs["i2p"],"i2p",'my_config');
												if(cb)cb();
												//for(var i in body){StartI2pSocket(body[i],null);};
											});
										});
										req.write(post_data);
										req.end();
										break;
								default:break;
								
							};
							
						break;
				case 11: //console.log(JSON.stringify(strout));
						break;
			};
		};

		outclient.on('data', function(data) {
			strout+=data.toString();
			if(strout.indexOf("ERROR")>=0)
			{
				console.log("stepout="+stepout+" \r\nNOT WAITED DATA: "+strout+"\r\n");
				if(stepout==1 && strout.indexOf("active")<0)
				{
					strout="";waitAnswerOut=/*newline+*/"OK Nickname set to "+BOBNAME+newline;outclient.write('getnick '+BOBNAME+'\n');
				};
				if(stepout==11)
				{
					strout="";
					console.log("WRONG destination? NEED TO DELETE FROM DB IF SO.");
				};
				if(/*stepout==2 && */strout.indexOf("active"+newline)>=0)
				{
					stepout=100;
					strout="";waitAnswerOut="OK Nickname set to "+BOBNAME+newline;outclient.write('getnick '+BOBNAME+'\n');
					strout="";waitAnswerOut="OK tunnel stopping"+newline;outclient.write('stop\n');if(appserver)appserver.close();
					
				
					setTimeout(function(){
								outclient.connect(BOBPORT, BOBHOST, function(err) {
									
									if(err)console.log(err);
									else 
									{
										console.log('OUTCLIENT CONNECTED TO: ' + BOBHOST + ':' + BOBPORT);
										waitAnswerOut="OK"+newline;stepout=1;
										nextTCPstepOut();
									};					
								});
							},10000);
				};
				if(stepout==8 && strout.indexOf("java.net.BindException:")>=0)
				{
					strout="";waitAnswerOut="OK tunnel stopping"+newline;outclient.write('stop\n');
					stepout=100;
				
					setTimeout(function(){
								outclient.connect(BOBPORT, BOBHOST, function(err) {
									
									if(err)console.log(err);
									else 
									{
										console.log('OUTCLIENT CONNECTED TO: ' + BOBHOST + ':' + BOBPORT);
										waitAnswerOut="OK"+newline;stepout=1;
										nextTCPstepOut();
									};					
								});
							},5000);
				};
				
			}
			else if(strout.indexOf(waitAnswerOut)>=0)
			{
				if(stepout==3){
					var tkeys=strout.substring(3,strout.indexOf(newline));
					configs["i2p"].mykeys=tkeys;
				};
				if(stepout==9){
					var tdest=strout.substring(3,strout.indexOf(newline));
					console.log('destination: ' + tdest);
					if(!defined(configs["i2p"]) || !defined(configs["i2p"].destination)){
						global.configs["i2p"]=new Object();
						configs["i2p"]={
									destination:-1,
									mykeys:-1,
									cnctondem:0,
									maxoutcncts:0,
									autofetch:1,
									maxautofetch:50,
									maxlastestposts:10,
									maxincncts:0,
									maxknowns:0
						};
					}
					configs["i2p"].destination=tdest;
					
					if(!defined(configs["i2p"]._id))
									add2db(configs["i2p"],"i2p",'my_config');

					
					
				};
				if(stepout==11){
					for(var i in CBs)
					{
						if(CBs[i].cur>0)
						{
							strout="";
							CBs[i].cur=0;
							CBs[i].verified=true;
							if(isInClients("i2p",CBs[i].key))clients["i2p"][CBs[i].cappservices].destination=CBs[i].key;
							if(typeof(CBs[i].cb_verified_knowed)!="undefined"){
								CBs[i].cb_verified_knowed();
							};
							
						}
					};
				}
				else
				{
					stepout++;
					nextTCPstepOut();
				};
			}
			else 
			{
				console.log("ppc");
				console.log(JSON.stringify(strout)+"\n");
			};
		
	  //console.log(JSON.stringify(str)+"\r\n");
	  
	})

	// Add a 'close' event handler for the outclient socket
	outclient.on('close', function() {
		console.log('CNTRL Connection closed');
	});
	// Add a 'error' event handler for the outclient socket
	outclient.on('error', function(err) {
		console.log("outclient.on error");
		console.log(err);
	});
};

function Connect2Host4Init()
{
	var post_data="tharg="+configs["th"].destination;
	var options = {
		hostname: '127.0.0.1',
		port: 4444,
		method: 'POST',
		//path: "http://4rjzpjkfgr7kez3eqb7435j4ce4xqioroe4cplfziiem4ckd7k4a.b32.i2p",
		path: "http://xpi5tv4h6t4ejetbk2lvbyopx4z3pdm7d7n6gk33rfwidg7x7rvq.b32.i2p/",
		headers: {
		    'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length
		}
	};
	var body="";
	try{
		var req = http.request(options, function(res){ 
			res.on("data", function(chunk) {
				body+=chunk;
			});
								
			res.on("end", function(){
				console.log("received POST response "+res.statusCode);
				console.log(body);
				if(parseInt(res.statusCode)==200)
				{
					var data=JSON.parse(body);
									
					tmp_i2p_known=JSON.parse(JSON.stringify(data.i2p));
					for(var i in tmp_i2p_known){
						tmp_i2p_known[i].destination=sanitizer.sanitize(tmp_i2p_known[i].destination);
						tmp_i2p_known[i].type="known";
						tmp_i2p_known[i].nick="n/d";
						delete(tmp_i2p_known[i].id);
					}
					AddNewPeers("i2p",tmp_i2p_known,false);
										
					tmp_th_known=JSON.parse(JSON.stringify(data.th));
					for(var i in tmp_th_known){
						delete(tmp_th_known[i].id);
						tmp_th_known[i].nick="n/d";
						
					};
					if(tmp_th_known.length>0)
						AddNewPeers("th",tmp_th_known,false);
					global.need_reset=false;
					console.log("                                                      RESETING I2P PROFILE");
					setTimeout(function(){ResetI2PProfile();},5000);
													
														
					//known=JSON.parse(body);
					//if(cb)cb();
					//for(var i in body){StartI2pSocket(body[i],null);};
				}
				else 
				{
					//console.log(res);
					console.log("retrying to connect to host for initialization");
					setTimeout(function(){Connect2Host4Init();},10000);
				};
			});
			res.on("error", function(er){
				console.log("res.on error");
				console.log(er);
				Connect2Host4Init();
			});
		});
		req.write(post_data);
		req.end();
		req.on("error", function(er){
				console.log("req.on error");
				console.log(er);
				//setTimeout(function(){Connect2Host4Init();},10000);
			});
	}catch(er){
		console.log(er);
	};
};






//////////////////////// консольные штуки
rl = require("readline").createInterface(process.stdin, process.stdout, null);
rl.setPrompt("prompt> ");
rl.prompt();

function log(){
  // hacks!
  rl.output.write("\x1b[2K\r");
  var args = arguments;
  args = Object.keys(arguments).map(function(k){return args[k]});
  console.log(args.join(" "));
  rl._refreshLine()
}
process.stdin.on("keypress", function(s, key){
  if(key && key.ctrl && key.name == "c") {if(outclient){outclient.write('stop\n');outclient.destroy();};appserver.close();for(i in I2P_SOCKETS){I2P_SOCKETS[i].destroy();};process.exit(0);};
  if(key && key.ctrl && key.name == "b") {StartBob();};
  if(key && key.ctrl && key.name == "s") {StopBob();};
  if(key && key.ctrl && key.name == "d") process.exit(0);
})

rl.on('line', function(line) {
  outclient.write(line+"\n");
  rl.prompt();
});
///////////////////////////////////////////////////////////////////////////////








////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// TELEHASH ///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//var th_server = require('http').createServer(app);
var th_sserver = require('https').createServer(serveroptions,function (request, response) {
	var filePath = './public' + request.url;
	if (filePath == './public/')
		filePath = './public/index.html';
	var extname = path.extname(filePath);
	var contentType = 'text/html';
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
	}
	
	fs.exists(filePath, function(exists) {
	
		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
				}
				else {
					var locales =new locale.Locales(request.headers["accept-language"]);
					response.writeHead(200, { 'Content-Type': contentType });
					for(key in dicts[locales.best(supported)]){
						rgxp=new RegExp('__\\("'+key+'"\\)','gmi');
						content=content.toString().replace(rgxp,dicts[locales.best(supported).language][key]);
					}
					response.end(content, 'utf-8');
				}
			});
		}
		else {
			response.writeHead(404);
			response.end();
		}
	});
	
});
//var th_server_w = require('http').createServer(app);
//var th_sserver_w = require('https').createServer(serveroptions,app);

//var th_io = require('socket.io').listen(th_server);
var th_sio = require('socket.io').listen(th_sserver);
//var th_io_w = require('socket.io').listen(th_server_w);
//var th_sio_w = require('socket.io').listen(th_sserver_w);
var th = require("telehash");



var th_queue_db_peers = new Object();
th_queue_db_peers.queue=new Q;
th_queue_db_peers.done=function(){th_queue_db_peers.queue.done();};
//th_io.set('log level', 0);
th_sio.set('log level', 0);


//////////////////////////////////download th_server
var th_tempserver = http.createServer(function (req, res) {
								var fname=req.url.toString().substr(req.url.toString().indexOf("?")+1);
								var mimetype = mime.lookup(fname);
								res.setHeader('Content-disposition', 'attachment; filename=' + fname);
								res.setHeader('Content-type', mimetype);
								console.log(fname);
								console.log(duplex["th"][fname]);
								duplex["th"][fname].pipe(res);

							});

							th_tempserver.on('connection', function (socket) {
								socket.setTimeout(100000);
								socket.on('close', function () {
									console.log('socket closed');
								});
							});
th_tempserver.listen(th_dl_port);

//function th_StartServerL(port){th_server.listen(port);console.log("th_Сервер запущен на порте "+port);};
//th_StartServerL(th_SIO);
//th_server.listen(th_SIO);console.log("th_Сервер запущен на порте "+th_SIO);
th_sserver.listen(th_sSIO);console.log("th_Сервер запущен на порте "+th_sSIO);
//th_server_w.listen(th_SIO_w);console.log("th_Сервер запущен на порте "+th_SIO_w);
//th_sserver_w.listen(th_sSIO_w);console.log("th_Сервер запущен на порте "+th_sSIO_w);

// node node_modules/telehash/seed

function InitTH(){
	th.init({id:configs["th"].thid,seeds:[{
    "paths": [
      {
        "type": "http",
        "http": "http://193.34.144.23:42424"
      },
      {
        "type": "ipv4",
        "ip": "193.34.144.23",
        "port": 42424
      },
      {
        "type": "ipv6",
        "ip": "2a02:c200:0:10:2:2:9053:1",
        "port": 42424
      },
      {
        "type": "ipv6",
        "ip": "fe80::250:56ff:fe3c:47b3",
        "port": 42424
      }
    ],
    "parts": {
      "3a": "1df78fba497cfaf8eb1c2cf7b005208579193ea16385060329b9d769010e1827",
      "2a": "2625ebe91ff10ce6c7c3b1bfd9b6a80825669f14d5d90b36608bdcf91bf07b85",
      "1a": "5b5857763c9a5496fc5b2640d28a09ff5a3eef44de5813d39bfc27f1c4d114a6"
    },
    "keys": {
      "3a": "3NH1B5EgZoWi0qUqHhdqJgLyHpqEbmGEzddzyrqzQF4=",
      "2a": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiXMD0A1cEYETDRzIgBe4xwu40qYreFW3EKZEpXfbKZCrbhuolyAgXf9+bWD+Hi7MeNdBGpuu5LBJqAEKRAZTynj7fYO36RDJmRfBIgKvYmabVtIPC6V0/olL+mTCJTlaI0es2xHSZmSUzOjE4na5nrZygpUbTcWv9Y8DtAC5KPOMYbMRL2wthalG/qDu9/MrbaD+/vvxUFvBRm0XjGQNM+fueyJlQ1Qsr0+720x/P9r87Q4vLcaZqRUykjlK0zlTOPazi3N86Jv1WEdUPSV5SY27ZP6lYdM1VnB92NArSyhou8Yi4gbqpEcK5FD5mH5/n71+PSYmgRewrlXLIqrOLwIDAQAB",
      "1a": "J0ss+FS+nXVrVoLcaj2zPXjqRpUxsKN5lDT0Ps4AeuCxc6cJUCofAA=="
    }
  }]}, function(err, self){
		if(err) {
			console.log("hashname failed to come online");
			if(err.toString()=="offline")setTimeout(function(){InitTH();},10000);
			return console.log("-----------",err);
		};

		// use self.* now
		channelName = GCHANNELNAME;
		console.log(self.hashname);
		console.log("WE ARE ONLINE with "+known["th"].length+" known peers");
		//for(var i; i<self.seeds.length; i++){
		//	console.log(self.seeds[i]);
		//};
		//console.log(self.seeds[0].paths);
		//console.log(self.paths);
		//begin listening for incoming packets on a channel
		self.listen(channelName, packetHandler);
		gth=self;
		PollKnown("th");

		////////////////////////////THTP////////////////////////
		self.thtp.listen(function(req,cbRes){
			console.log("THTP");console.log("THTP");console.log("THTP");console.log("THTP");console.log("THTP");
			console.log(req.method,req.path,req.headers);
			if(req.path == "/foobar") return cbRes().end("foobar");
			else if(req.path == "/stdin") return process.stdin.pipe(cbRes());
			else if(req.path.indexOf("post/")>0)
			{
				console.log("THTP POST:"+req.path.substr(req.path.indexOf("post/")+5));
				var res="";
				var postid=req.path.substr(req.path.indexOf("/post/")+6);
				DB["th"].findOne({type:"post",_id:postid}, function(err, doc) {
					if(err)
					{
						console.log(err);
						cbRes({status:200,body:JSON.stringify(err)});
					}
					else
					{
						//console.log("cmnts from th_db",docs[0].cmnts);
						res=JSON.parse(JSON.stringify(doc));
						//for(var i in tmyposts){
							for(var j in res.cmnts){
								if(defined(res.cmnts[j].src)){
									res.cmnts[j].txt=res.cmnts[j].src.toString().replace(/\\+n/g,"\n");
									delete(res.cmnts[j].src);
								}
							}
						//};
						res=JSON.stringify(res);
						cbRes({status:200,body:res});
					};
				});
				//cbRes({status:200,body:res});//cbRes({status:200,body:req.path});
			}
			else if(req.path.indexOf("img/")>0)
			{
				console.log("THTP IMG: "+req.path.substr(req.path.indexOf("img/")+4));
				//var res="";
				var tfn=req.path.substr(req.path.indexOf("/img/")+5);
				try{
					var bitmap = fs.readFileSync(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["th"]+tfn));
					//var readable = fs.createReadStream(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["th"]+tfn));
					 // convert binary data to base64 encoded string
					// var res= new Buffer(bitmap).toString('base64');
					cbRes({status:200,body:"ok"});//cbRes({status:200,body:req.path});
				}
				catch(er){return er.toString();};
			};
		});
		console.log("listening at thtp://"+self.hashname+"/")
		/////////////////////////////////////////////////////////
	});
}


function packetHandler(err, packet, chan, callback){
	if (err)
	{
		if(known["th"].length>1)console.log(chan.hashname);
		else
		return console.log("oh noes, we got an error! ", err);
	}
	console.log(chan.hashname);
	if(!defined(clients["th"][chan.hashname])){
		console.log("th_clients[chan.hashname] NOT defined");
		clients["th"][chan.hashname]={};
		clients["th"][chan.hashname].nick="";
		clients["th"][chan.hashname].desc="";
		clients["th"][chan.hashname].mail="";
	};
	clients["th"][chan.hashname].chan=chan;
	
	console.log("th_received:", packet.js, packet.body);
	if(!packet.js.cmd){
		SetPeerState("th", chan.hashname,0);
		delete(clients["th"][chan.hashname]);
		return;
	}
	//console.log(defined(clients["th"][chan.hashname].nick));
	if(!defined(clients["th"][chan.hashname].nick) && packet.js.cmd!="update_my_profile" && packet.js.cmd!="whoareyou?")
	{
			chan.send({js:{cmd:"whoareyou?"}});callback(true);
	}
	else
	{
		Incoming(packet,chan,function(){callback(true);});
	};

};





function th_updateMyWebPosts()
{
	var docs=[];
	DB["thw"].find({type:"post"}, function(err, docs) {
		if(err)
		{
			console.log(err);
		}
		else
		{
			//console.log("cmnts from th_db",docs[0].cmnts);
			//console.log(" ");console.log(" ");console.log(" ");console.log(" ");console.log(" ");console.log(" ");console.log(" ");
			//console.log(docs);
			//console.log(" ");console.log(" ");console.log(" ");console.log(" ");console.log(" ");console.log(" ");console.log(" ");
			th_mywebposts=JSON.parse(JSON.stringify(docs));
			console.log(th_mywebposts);
			if(configs["th"])
			{
				th_mywebposts=th_SanitizeWebPosts(th_mywebposts,configs["th"].destination);
				Send2UI("th","updateMyWebPosts",{msg:th_mywebposts,type:"mywebposts_th"});
			}
			else console.log("no th_config yet");
		};
	});
}




function th_sendMyManyWebPosts(lim,off,destination)
{
	if(lim>0)
	{
		DB["thw"].find({type: "post"})/*.sort({ lts: -1 }).skip(off).limit(lim)*/.exec(function (err, docs) {
			if(err)
			{
				console.log(err);
			}
			else
			{
				var tmywebposts=JSON.parse(JSON.stringify(docs));
				//th_mywebposts=th_SanitizeWebPosts(tmywebposts,configs["th"].destination);
				for(var i in tmywebposts){
					for(var j in tmywebposts[i].cmnts){
						if(defined(tmywebposts[i].cmnts[j].src)){
							tmywebposts[i].cmnts[j].txt=tmywebposts[i].cmnts[j].src.toString().replace(/\\+n/g,"\n");
							delete(tmywebposts[i].cmnts[j].src);
						}
					}
				};
				var q={
						cmd:"my_last_many_mywebposts",
						data:tmywebposts
				};
				SendData2Dest("th",destination,q);
			};
		});
	}
	else console.log("limit is required!");

}



/*
function th_OnDBChangesComplete(cb){
	DB["th"].changes().on('complete', function() {
		console.log('Ch-Ch-Changes');
		if(cb)cb();
	});
};*/



var th_PACKETS=[];
function Incoming(packet,chan,cb)
{
var destination=chan.hashname;
	if(defined(packet.chunked))
	{
		if(!defined(th_PACKETS[destination]))th_PACKETS[destination]=[];
		if(defined(packet.chunked)){
			if(!defined(th_PACKETS[destination][packet.id]))
			{
				th_PACKETS[destination][packet.id]={};
				th_PACKETS[destination][packet.id].len=packet.len;
				th_PACKETS[destination][packet.id].chunks=[];
				console.log("READY FOR CHUNKS");

			};
			console.log(th_PACKETS[destination]);
			if(th_PACKETS[destination][packet.id].chunks.length < th_PACKETS[destination][packet.id].len)
			{
				//console.log("received chunk:"+packet.chunk);
				th_PACKETS[destination][packet.id].chunks.push(packet.chunk);
				cb();
			};
			if(th_PACKETS[destination][packet.id].chunks.length == th_PACKETS[destination][packet.id].len)
			{
				console.log("received all chunks");
				var packetstr=th_PACKETS[destination][packet.id].chunks.join('');
				th_PACKETS[destination].slice(packet.id,1);
				var packet=packetstr;
						if(IsBlocked("th", destination)){
							socket.end('You are banned!\n');
							//th_clients["th"].splice(cappservices,1);
							return;
						};
						if(defined(packet.data) && defined(packet.data.sharing)){
							ProcessSharing("th",destination,packet,cb);
							return;
						};
						ProcessCmd(destination, packet,null,null,null,cb,"th");
			};

		}
	}
	else
	{
		if(IsBlocked("th",destination)){
			socket.end('You are banned!\n');
			//th_clients["th"].splice(cappservices,1);
			return;
		};
		if(defined(packet.js.data) && defined(packet.js.data.sharing)){
			ProcessSharing("th",destination,packet.js,cb);
			return;
		};
		ProcessCmd(destination, packet,null,null,null,cb,"th");
	};
}







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// БЛОК ПРОТОКОЛА UI  /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

/*io.sockets.on('connection', function (socket) {
    //if (!io.isConnected)
	{
        io.isConnected = true;
		gs=socket;
		console.log('io connected');
		Send2UI("i2p","keepinmind",{state:is_running,th_state:th_is_running});

		socket.on('cmd', function (data) {
			ProcessUICmd("i2p",data);
		});

		socket.on('disconnect', function (channel) {
			console.log('io disconnected');
			io.isConnected = false;
		});
	};
});*/
sio.sockets.on('connection', function (socket) {
    //if (!sio.isConnected)
	{
        sio.isConnected = true;
		gs=socket;
		console.log('io connected');
		Send2UI("i2p","keepinmind",{state:is_running,th_state:th_is_running});

		socket.on('cmd', function (data) {
			ProcessUICmd("i2p",data);
		});

		socket.on('disconnect', function (channel) {
			console.log('sio disconnected');
			sio.isConnected = false;
		});
	};
});
// ----------------------------------socket.th_io
/*th_io.sockets.on('connection', function (socket) {
    //if (!th_io.isConnected)
	{
        th_io.isConnected = true;
		th_gs=socket;
		console.log('th_io connected');
		poll("th");
		socket.on('cmd', function (data) {
			ProcessUICmd("th",data);
		});

		socket.on('disconnect', function (channel) {
			console.log('th_io disconnected');
			th_io.isConnected = false;
		});
	};
});*/
th_sio.sockets.on('connection', function (socket) {
    //if (!th_sio.isConnected)
	{
        th_sio.isConnected = true;
		th_gs=socket;
		console.log('th_sio connected');
		poll("th");
		socket.on('cmd', function (data) {
			ProcessUICmd("th",data);
		});

		socket.on('disconnect', function (channel) {
			console.log('th_sio disconnected');
			th_sio.isConnected = false;
		});
	};
});
/*
th_io_w.sockets.on('connection', function (socket) {
    //if (!th_io_w.isConnected)
	{
        th_io_w.isConnected = true;
		th_gs_w=socket;
		console.log('th_io_w connected');
		socket.on('cmd', function (data) {
			ProcessUICmd_W("th",data);
		});

		socket.on('disconnect', function (channel) {
			console.log('th_io_w disconnected');
			th_io_w.isConnected = false;
		});
	};
});
th_sio_w.sockets.on('connection', function (socket) {
    //if (!th_sio_w.isConnected)
	{
        th_sio_w.isConnected = true;
		th_gs_w=socket;
		console.log('th_sio_w connected');
		socket.on('cmd', function (data) {
			ProcessUICmd_W("th",data);
		});

		socket.on('disconnect', function (channel) {
			console.log('th_sio_w disconnected');
			th_sio_w.isConnected = false;
		});
	};
});
*/

function ProcessUICmd(src,data)
{

	if(src=="i2p")		console.log("cmd from i2pUI",data.cmd,data.data);
	else 				console.log("cmd from th_UI",data.cmd,data.data);
	switch(data.cmd){
		case 'is_running':
					if(src=="i2p")Send2UI("i2p","keepinmind",{state:is_running,th_state:th_is_running});
					break;
		case 'run':
					if(src=="i2p")ManualStart();
					else th_ManualStart();
					break;
		case 'ban':
					if(src=="i2p"){
						processAttributes(src,data.data.id,{banned:1,ifollow:0});
						if(isInSockets(data.data.destination)){
							I2P_SOCKETS[data.data.destination].end();
						};
						if(isInClients(src, data.data.destination)){
							servscts[data.data.destination].c.end();
						};
						SetPeerState(src, data.data.destination,0);
					}
					else
					{
						processAttributes(src,data.data.id,{banned:1,ifollow:0});
						if(isInClients(src, data.data.destination)){
							chan[data.data.destination].close();
						};
						SetPeerState(src, data.data.destination,0);
					};
					break;
		case 'unban':
					processAttributes(src, data.data.id,{banned:0});
					break;
		case 'follow':
					processAttributes( src,data.data.id,{ifollow:1});
					SendData2Dest(src, data.data.destination,{	cmd:"ifollow" });
					if(configs[src].autofetch)setTimeout(function(){var q={cmd:"read_",data:{length:configs[src].maxautofetch,offset:0}};SendData2Dest(src, data.data.destination,q);},5000);
					break;
		case 'unfollow':
					processAttributes( src,data.data.id,{ifollow:0});
					if((src=="i2p" && isConnected(data.data.destination)) || src=="th")
						SendData2Dest(src, data.data.destination,{cmd:"unfollow"});
					break;
		case 'readlast':
					SendData2Dest(src, data.data.destination,{cmd:"read_last",data:{length:configs[src].maxlastestposts,offset:0}});
					break;
		case 'startchat':
					if(
						(src=="i2p" && isConnected(data.data.destination)) ||
						(src=="th" && isInClients(src, data.data.destination))
					)
					SendData2Dest(src, data.data.destination,{cmd:"startchat"});
					break;
		case 'sendchatmsg':
					if(
						(src=="i2p" && isConnected(data.data.destination)) ||
						(src=="th" && isInClients(src, data.data.destination))
					)
					SendData2Dest(src, data.data.destination,{	cmd:"newchatmsg",data: data.data.txt});
					break;
		case 'addpost':
					data=data.data;
					var post={};
					post.txt=data.data;
					post.ts=data.ts;
					post.lts=data.lts;
					post.nick=data.nick;
					post.destination=configs[src].destination;
					post.cmnts=[];
					add2db(post,src,"post"); 
					//broadcasting to followers
					var q={cmd:"my_last_many_myposts",	data:[post]	};
					BroadcastData(src, q,"followme");
					break;
		case 'updatepost':
					data=data.data;
					var post={};
					post.txt=data.data;
					post.ts=data.ts;
					post.lts=data.lts;
					post.nick=data.nick;
					add2db(post,src,"post",data.id);
					//broadcasting to followers
					var q={	cmd:"my_last_many_myposts",	data:[post]};
					BroadcastData(src, q,"followme");
					updateMyPosts(src);
					break;
		case 'addcomment2mypost':
					data=data.data;
					var cmnt={};
					cmnt.txt=data.data;
					cmnt.ts=data.ts;
					cmnt.lts=data.lts;
					cmnt.nick=data.nick;
					cmnt.type="cmnt";
					cmnt.pid=data.pid;
					console.log(data)

					if(src=="i2p")
						DB[src].findOne({_id:data.pid}, function(err, doc) {
							if(err){
								console.log(err);
							}
							else
							{
								console.log("founded post");
								console.log(doc);
								console.log("updating post");
								if(!defined(doc.cmnts))doc.cmnts=[];
								for(var i in doc.cmnts){
									if(defined(doc.cmnts[i].src)){
										doc.cmnts[i].txt=doc.cmnts[i].src.toString().replace(/\\+n/g,"\n");
										delete(doc.cmnts[i].src);
									}
								}
								doc.cmnts.push(cmnt);
								console.log(doc);
								DB[src].update({_id:doc._id},doc, {}, function(err, response) {
									if(err){
										console.log('put error');
										console.log(doc._id,doc);
										Send2UI(src,"log",{msg:err,type:1});
									}
									else
									{
										DB[src].persistence.compactDatafile();setTimeout(function(){
										console.log(response);
										updateMyPosts(src);},150);
									};
								});
								//broadcasting to followers
								BroadcastData(src, {	cmd:"my_last_many_myposts",	data:[doc]},"followme");
							};
						});
					else
						DB[src].findOne({_id:data.pid}, function(err, doc) {
						if(err){
							console.log(err);
						}
						else
						{
							console.log("founded post");
							console.log(doc);
							console.log("updating post");
							if(!defined(doc.cmnts))doc.cmnts=[];
							for(var i in doc.cmnts){
								if(defined(doc.cmnts[i].src)){
									doc.cmnts[i].txt=doc.cmnts[i].src.toString().replace(/\\+n/g,"\n");
									delete(doc.cmnts[i].src);
								}
							}
							doc.cmnts.push(cmnt);
							console.log(doc);
							DB[src].update({_id:doc._id},doc, {}, function(err, response) {
									if(err){
										console.log('put error');
										console.log(doc._id,doc);
										Send2UI(src,"log",{msg:err,type:1});
									}
									else
									{
										DB[src].persistence.compactDatafile();setTimeout(function(){
										console.log(response);
										updateMyPosts(src);},150);
									};
								});
								//broadcasting to followers
								BroadcastData(src, {	cmd:"my_last_many_myposts",	data:[doc]},"followme");
							};
						});
					break;
		case 'sendcomment':
					data=data.data;
					var cmnt={};
					cmnt.txt=data.data;
					cmnt.ts=data.ts;
					cmnt.lts=data.lts;
					cmnt.nick=data.nick;
					cmnt.adestination=configs[src].destination;
					cmnt.type="cmnt";
					cmnt.pid=data.pid;
					SendData2Dest(src, data.destination,{cmd:"addcomment",data:cmnt});
					break;
		case 'delcomment2mypost':
					data=data.data;
					if(src=="i2p")
						DB[src].findOne({_id:data.pid}, function(err, doc) {
							if(err){
								Send2UI(src,"log",{msg:err,type:1});
							}
							else
							{
								console.log(doc)
								for(var i in doc.cmnts){
									if(defined(doc.cmnts[i].src)){
										doc.cmnts[i].txt=doc.cmnts[i].src.toString().replace(/\\+n/g,"\n");
										delete(doc.cmnts[i].src);
									}
								}
								for(var i in doc.cmnts){
									console.log(doc.cmnts[i].lts,data.lts,(doc.cmnts[i].lts === data.lts));
									if(doc.cmnts[i].lts.toString() === data.lts)
									{
										doc.cmnts.splice(i,1);
									}
								}
								var post=doc;
								console.log(post);
								DB[src].update({_id:post._id}, post,{}, function(err, response) {
									if(err){
										console.log('put error');
										console.log(doc._id,doc);
										if(gs)
											Send2UI(src,"log",{msg:err,type:1});
										else console.log(err);
									}
									else
									{
										DB[src].persistence.compactDatafile();setTimeout(function(){
										console.log(response);
										updateMyPosts(src);},150);
									};
								});
								//broadcasting to followers
								var q={
											cmd:"my_last_many_myposts",
											data:[post]
									};
								BroadcastData(src, q,"followme");
							};
						});
					else
						DB[src].findOne({_id:data.pid}, function(err, doc) {
							if(err){
								Send2UI(src,"log",{msg:err,type:1});
							}
							else
							{
								for(var i in doc.cmnts){
									if(defined(doc.cmnts[i].src)){
										doc.cmnts[i].txt=doc.cmnts[i].src.toString().replace(/\\+n/g,"\n");
										delete(doc.cmnts[i].src);
									}
								}
								for(var i in doc.cmnts){
									console.log(doc.cmnts[i].lts,data.lts,(doc.cmnts[i].lts === data.lts));
									if(doc.cmnts[i].lts.toString() === data.lts)
									{
										doc.cmnts.splice(i,1);
									}
								}
								var post=doc;
								console.log(post);
								DB[src].update({_id: post._id,type:"post"},post, {}, function(err, response) {
									if(err){
										console.log('put error');
										console.log(doc._id,doc);
										if(th_gs)
											Send2UI(src,"log",{msg:err,type:1});
										else console.log(err);
									}
									else
									{
										DB[src].persistence.compactDatafile();setTimeout(function(){
										console.log(response);
										updateMyPosts(src);
										BroadcastData(src, {	cmd:"my_last_many_myposts",	data:[doc]},"followme");
										},150);
									};
								});

							};
						});
					break;
		case 'del':
					DB[src].findOne({_id:data.data.id}, function(err, doc) {
						if(err){
							Send2UI(src, "log",{msg:err,type:1});
						}
						else
						{
							DB[src].remove({_id:doc._id}, {},function(err, response) {
								if(err) Send2UI(src,"log",{msg:err,type:2});
								else
								{
									DB[src].persistence.compactDatafile();
									Send2UI(src, "log",{msg:response,type:0});
									updateMyPosts(src);
									BroadcastData(src, {	cmd:"del_mypost",	data:doc._id},"followme");
								};
							});
						};
					});
		/*//////////////webposts
		case 'addcomment2mywebpost':
					data=data.data;
					var cmnt={};
					cmnt.txt=data.data;
					cmnt.ts=data.ts;
					cmnt.lts=data.lts;
					cmnt.nick=data.nick;
					cmnt.type="cmnt";
					cmnt.pid=data.pid;
					console.log(data)

					if(src=="i2p")
						DB["i2pw"].findOne({_id:data.pid}, function(err, doc) {
							if(err){
								console.log(err);
							}
							else
							{
								console.log("founded post");
								console.log(doc);
								console.log("updating post");
								if(!defined(doc.cmnts))doc.cmnts=[];
								for(var i in doc.cmnts){
									if(defined(doc.cmnts[i].src)){
										doc.cmnts[i].txt=doc.cmnts[i].src.toString().replace(/\\+n/g,"\n");
										delete(doc.cmnts[i].src);
									}
								}
								doc.cmnts.push(cmnt);
								console.log(doc);
								DB["i2pw"].update({_id:doc._id},doc, {}, function(err, response) {
									if(err){
										console.log('put error');
										console.log(doc._id,doc);
										Send2UI(src,"log",{msg:err,type:1});
									}
									else
									{
										DB["i2pww"].persistence.compactDatafile();setTimeout(function(){
										console.log(response);
										updateMyPosts(src);},150);
									};
								});
								//broadcasting to followers
								BroadcastData(src, {	cmd:"my_last_many_myposts",	data:[doc]},"followme");
							};
						});
					else
						DB["thw"].findOne({_id:data.pid}, function(err, doc) {
							if(err){
								console.log(err);
							}
							else
							{
								console.log("founded wpost");
								console.log(doc);
								console.log("updating wpost");
								if(!defined(doc.cmnts))doc.cmnts=[];
								for(var i in doc.cmnts){
									if(defined(doc.cmnts[i].src)){
										doc.cmnts[i].txt=doc.cmnts[i].src.toString().replace(/\\+n/g,"\n");
										delete(doc.cmnts[i].src);
									}
								}
								doc.cmnts.push(cmnt);
								console.log(doc);
							DB["thw"].update({_id:doc._id},doc, {}, function(err, response) {
									if(err){
										console.log('put error');
										console.log(doc._id,doc);
										Send2UI(src,"log",{msg:err,type:1});
									}
									else
									{
										DB["thw"].persistence.compactDatafile();setTimeout(function(){
										console.log(response);
										th_updateMyWebPosts();},150);
									};
								});
								//broadcasting to followers
								BroadcastData(src, {	cmd:"my_last_many_mywebposts",	data:[doc]},"followme");
							};
						});
					break;
		case 'sendcommentweb':
					data=data.data;
					var cmnt={};
					cmnt.txt=data.data;
					cmnt.ts=data.ts;
					cmnt.lts=data.lts;
					cmnt.nick=data.nick;
					cmnt.adestination=configs[src].destination;
					cmnt.type="cmnt";
					cmnt.pid=data.pid;
					//if(src=="i2p")	SendData2Dest(src, data.destination,{cmd:"addcommentweb",data:cmnt});
					//else 			SendData2Dest(src, data.destination,{cmd:"addcommentweb",data:cmnt});///////////??????????????????????????
					break;
		case 'delcomment2mywebpost':
					data=data.data;
					DB["thw"].findOne({_id:data.pid}, function(err, doc) {
						if(err){
							Send2UI("th","log",{msg:err,type:1});
						}
						else
						{
							for(var i in doc.cmnts){
								if(defined(doc.cmnts[i].src)){
									doc.cmnts[i].txt=doc.cmnts[i].src.toString().replace(/\\+n/g,"\n");
									delete(doc.cmnts[i].src);
								}
							}
							for(var i in doc.cmnts){
								console.log(doc.cmnts[i].lts,data.lts,(doc.cmnts[i].lts === data.lts));
								if(doc.cmnts[i].lts.toString() === data.lts)
								{
									doc.cmnts.splice(i,1);
								}
							}
							var post=doc;
							console.log(post);
							DB["thw"].update({_id: post._id,type:"post"},post, {}, function(err, response) {
								if(err){
									console.log('put error');
									console.log(doc._id,doc);
									if(th_gs)
										Send2UI("th","log",{msg:err,type:1});
									else console.log(err);
								}
								else
								{
									DB["thw"].persistence.compactDatafile();setTimeout(function(){
									console.log(response);
									th_updateMyWebPosts();},150);
								};
							});
							//broadcasting to followers
							BroadcastData(src, {	cmd:"my_last_many_mywebposts",	data:[doc]},"followme");
						};
					});
					break;
		case 'delmywebpost':
					if(src=="i2p")
						DB["i2pw"].findOne({_id:data.data.id}, function(err, doc) {
							if(err){
								Send2UI(src,"log",{msg:err,type:1});
							}
							else
							{
								DB["i2pw"].remove({_id:doc._id},{},function(err, response) {
									if(err) Send2UI(src,"log",{msg:err,type:1});
									else
									{
										Send2UI(src,"log",{msg:response,type:0});
										updateMyPosts(src);
									};
								});
							};
						});
					else
						DB["thw"].findOne({_id:data.data.id}, function(err, doc) {
							if(err){
								Send2UI(src,"log",{msg:err,type:1});
							}
							else
							{
								DB["thw"].remove({_id:doc._id}, {},function(err, response) {
									if(err) Send2UI(src,"log",{msg:err,type:2});
									else
									{
										DB["thw"].persistence.compactDatafile();
										Send2UI(src,"log",{msg:response,type:0});
										th_updateMyWebPosts();
										BroadcastData(src, {	cmd:"del_mywebpost",	data:doc._id},"followme");
									};
								});
							};
						});
					break;
		//////////////////////webposts\\\\\\\\\\\\\\\\*/
		
		case 'poll':
					poll(src);
					break;
		case 'connect':
					if(src=="i2p"){
						if(defined(polling[data.data.destination]))polling[data.data.destination].cnt=0;
						StartI2pSocket(data.data.destination,function(){;});
					}
					else
					{
						var tdata={nick:my_profile[src].nick, desc:my_profile[src].desc, mail:my_profile[src].mail};
									tdata.ifollow=(IsInIFollow(src, data.data.destination))?1:0;
									firstPacket = {
										js: {
											cmd: "update_my_profile",
											profile:tdata
										}
									};
						gth.start(data.data.destination, GCHANNELNAME, firstPacket, packetHandler);
					}
					break;
		case 'disconnect':
					if(src=="i2p")
					{
						if(isInSockets(data.data.destination))
							I2P_SOCKETS[data.data.destination].end();
						if(isInClients(src, data.data.destination))
							servscts[data.data.destination].c.end();
					}
					else
					{
						if(isInClients(src, data.data.destination))
							clients[src][data.data.destination].chan.end();
					};
					SetPeerState(src, data.data.destination,0);
					break;
		case "dl":
					if(data.data.fn){
						//SendData2Dest2(data.data.destination,{cmd:"dl",data:{fn:data.data.fn}});
						SendData2Dest(src,data.data.destination,{cmd:"dl",data:{fn:data.data.fn}});
						if(!defined(packetnum[src][data.data.destination])) packetnum[src][data.data.destination]=[];
						packetnum[src][data.data.destination][data.data.fn]=0;
					};
					break;
		case "UpdateProfile":
					data=data.data;
					add2db(data,src,'my_profile');
					my_profile[src]=data;
					//broadcasting to all connected known
					var tpeer=my_profile[src];
					tpeer.destination=configs[src].destination;
					delete tpeer._id;
					delete tpeer._rev;
					var tdata=tpeer;
					var q={ cmd:"update_my_profile",profile:tdata };
					BroadcastData(src, q,'my_profile');
					updateMyProfile(src);
					break;
		case "UpdateConfig":
					data=data.data;
					console.log(data);
					configs[src].cnctondem=parseInt(data.cnctondem);
					configs[src].maxoutcncts=parseInt(data.maxoutcncts);
					configs[src].autofetch=parseInt(data.autofetch);
					configs[src].maxautofetch=parseInt(data.maxautofetch);
					configs[src].maxlastestposts=parseInt(data.maxlastestposts);
					configs[src].maxincncts=parseInt(data.maxincncts);
					configs[src].maxknowns=parseInt(data.maxknowns);
					//console.log(configs[src]);
					add2db(configs[src],src,'my_config');
					break;
		case "GetLink":
					GetLink(src,"Link",data.data);
					break;
		case "GetLinkW":
					GetLink(src,"LinkW",data.data);
					break;
		case "GetLink2Tab":
					GetLink(src,"Link2Tab",data.data);
		case "GetLinkNewPost":
					GetLink(src,"LinkNewPost",data.data);
					break;
		case "Dir":
					Dir(src,"Dir");
					break;
		case "DirW":
					Dir(src,"DirW");
					break;
		case "Dir2Tab":
					Dir(src,"Dir2Tab");
					break;
		case "DirNewPost":
					Dir(src,"DirNewPost");
					break;
		case "Start":
					data=data.data;
					if(src=="i2p")
					{
						var Name = data['Name'];
						Files1[src]={};
						Files1[src][Name] = {
							FileSize : data['Size'],
							Data	 : "",
							Downloaded : 0
						}
						var Place = 0;
						try{
							var Stat = fs.statSync(path.resolve(__dirname, "./PDX_FF/Temp/" +  Name));
							if(Stat.isFile())
							{
								Files1[src][Name]['Downloaded'] = Stat.size;
								Place = Stat.size / 524288;
							}
						}
						catch(er){} //It's a New File
						fs.open(path.resolve(__dirname, "./PDX_FF/Temp/" + Name), 'a', 0755, function(err, fd){
							if(err)
							{
								console.log(err);
							}
							else
							{
								Files1[src][Name]['Handler'] = fd; //We store the file handler so we can write to it later
								Send2UI(src,"MoreData", { 'Place' : Place, Percent : 0 });
							}
						});
					}
					else
					{
						var Name = data['Name'];
						Files1[src]={};
						Files1[src][Name] = {
							FileSize : data['Size'],
							Data	 : "",
							Downloaded : 0
						}
						var Place = 0;
						try{
							var Stat = fs.statSync(path.resolve(__dirname,"./PDX_FF/Temp/" +  Name));
							if(Stat.isFile())
							{
								Files1[src][Name]['Downloaded'] = Stat.size;
								Place = Stat.size / 524288;
							}
						}
						catch(er){} //It's a New File
						fs.open(path.resolve(__dirname,"./PDX_FF/Temp/" + Name), 'a', 0755, function(err, fd){
							if(err)
							{
								console.log(err);
							}
							else
							{
								Files1[src][Name]['Handler'] = fd; //We store the file handler so we can write to it later
								Send2UI(src,"MoreData", { 'Place' : Place, Percent : 0 });
							}
						});
					};
					break;
		case "Upload":
					data=data.data;
					var Name = data['Name'];
					Files1[src][Name]['Downloaded'] += data['Data'].length;
					Files1[src][Name]['Data'] += data['Data'];
					if(Files1[src][Name]['Downloaded'] == Files1[src][Name]['FileSize']) //If File is Fully Uploaded
					{
						fs.write(Files1[src][Name]['Handler'], Files1[src][Name]['Data'], null, 'Binary', function(err, Writen){
							var inp = fs.createReadStream(path.resolve(__dirname,"./PDX_FF/Temp/" + Name));
							var out = fs.createWriteStream(path.resolve(__dirname,PDX_FF_PUBLIC_FILES[src] + Name));
							inp.pipe(out, { end: false });
							inp.on('end', function() {
								out.end();
								fs.unlink(path.resolve(__dirname,"./PDX_FF/Temp/" + Name), function () { //This Deletes The Temporary File
									Send2UI(src,"Done", {'Image' : 'Video/' + Name + '.jpg'});
								});
							});
						});
					}
					else if(Files1[src][Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
						fs.write(Files1[src][Name]['Handler'], Files1[src][Name]['Data'], null, 'Binary', function(err, Writen){
							Files1[src][Name]['Data'] = ""; //Reset The Buffer
							var Place = Files1[src][Name]['Downloaded'] / 524288;
							var Percent = (Files1[src][Name]['Downloaded'] / Files1[src][Name]['FileSize']) * 100;
							Send2UI(src,"MoreData", { 'Place' : Place, 'Percent' :  Percent});
						});
					}
					else
					{
						var Place = Files1[src][Name]['Downloaded'] / 524288;
						var Percent = (Files1[src][Name]['Downloaded'] / Files1[src][Name]['FileSize']) * 100;
						Send2UI(src,"MoreData", { 'Place' : Place, 'Percent' :  Percent});
					};
					break;
		case "DelFile":
					fs.unlink(path.resolve(__dirname, PDX_FF_PUBLIC_FILES[src] +  localFiles[src][data.data]['fn']), function(err){delete(localFiles[src][data.data]);Dir(src,"Dir");Dir(src,"DirW");Dir(src,"Dir2Tab");Dir(src,"DirNewPost");});
					break;
		case "me":
					if(configs[src] && configs[src].destination) Send2UI(src,"me", {destination:configs[src].destination});
					break;
		case "calling":
					SendData2Dest(src, data.data.destination,{cmd:"calling",data:data.data.msg});
					break;
		case "closecall":
					SendData2Dest(src, data.data.destination,{cmd:"closecall"});
					break;
		default: console.log("Unknown cmd",src,data.cmd);break;
	};
};

function ProcessUICmd_W(src,data)
{

	if(src=="i2p")		console.log("cmd from i2pUI_W",data.cmd);
	else 				console.log("cmd from th_UI_W",data.cmd);
	switch(data.cmd){
		case 'addwebpost':
					data=data.data;
					var post=data;
					post.data=post.data.replace('\'','`');
					//post.ts=data.ts;
					//post.lts=data.lts;

					post.destination=configs[src].destination;post.nick=my_profile[src].nick;
					post.cmnts=[];
					add2wdb(post,src,"post");
					//broadcasting to followers
					var q={cmd:"my_last_many_mywebposts",	data:[post]	};
					BroadcastData(src, q,"followme");
					Send2UI_W(src,"log",post);
					break;

		case 'getposts':
					var tempwebposts={};
					console.log(data.data);
					DB["thw"].find({ type: 'post', curhost: data.data.curhost, action: 1 }, function (err, docs) {
						if(err)
						{
							console.log(err);
							Send2UI_W("th","log",err);
						}
						else
						{
							console.log("WEBPOSTS",docs);
							tempwebposts={};
							tempwebposts.txts=JSON.parse(JSON.stringify(docs));
							var isForCurHostTxts =function(element){
								return (element.curhost == data.data.curhost && element.action == 1);
							}
							var filtered = th_webposts.filter(isForCurHostTxts);
							tempwebposts.txts=tempwebposts.txts.concat(JSON.parse(JSON.stringify(filtered)));
							tempwebposts.txts=th_SanitizeWebPosts(tempwebposts.txts,null);
							//console.log(0);console.log(0);console.log(0);
							//console.log(th_webposts);
							//console.log(1);console.log(1);console.log(1);
							//console.log(tempwebposts.txts);
							//console.log(2);console.log(2);console.log(2);
							DB["thw"].find({ type: 'post', curhost: data.data.curhost, action: 2 }, function (err, docs) {
								if(err)
								{
									console.log(err);
									Send2UI_W("th","log",err);
								}
								else
								{
									tempwebposts.imgs=JSON.parse(JSON.stringify(docs));
									
									var isForCurHostImgs =function(element){
									  return (element.curhost == data.data.curhost && element.action == 2);
									}
									var filtered = th_webposts.filter(isForCurHostImgs);
									tempwebposts.imgs=tempwebposts.imgs.concat(filtered);
									tempwebposts.imgs=th_SanitizeWebPosts(tempwebposts.imgs,null);
							
									Send2UI_W("th","webposts",JSON.stringify(tempwebposts));
								}
							});
						};
					});

					break;

		default: console.log("Unknown cmd",src,data.cmd);break;
	};
};




function Dir(src,cmd){
	localFiles[src]=[];
	try{
		fs.readdir(path.resolve(__dirname, PDX_FF_PUBLIC_FILES[src]),function(err, files){
			if(err)Send2UI(src,cmd, err);
			for(var n in files)
			{
				localFiles[src][n] = { fn : "",fs : 0};
				var Stat = fs.statSync(path.resolve(__dirname, PDX_FF_PUBLIC_FILES[src] +  files[n]));
				if(Stat.isFile())
				{
					localFiles[src][n]['fn']=files[n];
					localFiles[src][n]['fs'] = Stat.size;
				}
			};
			Send2UI(src,cmd, JSON.stringify(localFiles[src]));
		});
	}
	catch(er)
	{
		Send2UI(src,cmd, er);
	};
};
function GetLink(src,cmd,n){
	console.log(localFiles[src]);
	var Stat = fs.statSync(path.resolve(__dirname,PDX_FF_PUBLIC_FILES[src] +   localFiles[src][n]['fn']));
	if(src=="th")
	{
		///////////////// img
		/*try{
			var bitmap = fs.readFileSync(path.resolve(__dirname,PDX_FF_PUBLIC_FILES["th"] +  localFiles[src][n]['fn']));
			var buf= new Buffer(bitmap).toString('base64');
			var fext=localFiles[src][n]['fn'].split(".")[1];
			var imglink= ' <img src="data:image/'+fext+';base64,'+buf+'" title="'+sanitizer.sanitize(localFiles[src][n]['fn']) +'"/>' ;
			var imglink= ' data:image/'+fext+';base64,'+buf+'" ' ;
			console.log(imglink);
			Send2UI("th",cmd+"Img", imglink);
		}
		catch(er){console.log( er.toString());};*/
	};
	if(Stat.isFile())
	{
		var link=localFiles[src][n]['fn']+"@"+configs[src].destination;
		Send2UI(src, cmd, link);
	};
		
};
function Send2UI(context,cmd, data){
	if(context=="i2p"){if(gs)gs.emit("cmd",{cmd:cmd,data:data});}
	else {if(th_gs)th_gs.emit("cmd",{cmd:cmd,data:data});};
};
function Send2UI_W(context,cmd, data){
	if(context=="i2p"){if(gs)gs.emit("cmd",{cmd:cmd,data:data});}
	else {if(th_gs_w)th_gs_w.emit("cmd",{cmd:cmd,data:data});};
};

////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// КОНЕЦ БЛОКА ПРОТОКОЛА UI /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////добавление новых пиров в известные
function AddNewPeers(context,peers,update)
{
	var tpeers=JSON.parse(JSON.stringify(peers));
	for(var i in tpeers){
		if(tpeers[i] && tpeers[i].destination){
			if(tpeers[i].destination!=configs[context].destination)
			{
				console.log("adding to "+context+"_queue",tpeers[i]);
				if(context=="i2p") AddPeerQueued(tpeers[i],update);
				else th_AddPeerQueued(tpeers[i],update);
			}
		};
	};
};

function AddPeerQueued(peer,update){
	setTimeout(
			function(){
				queue_db_peers.queue.pushAsync(
					function(lib) {
						console.log("                              I2P QUEUED PEER ADDING",peer.destination.substr(0,10)/*,configs["i2p"].destination.substr(0,10)*/);
						var peerid = peer.destination;
						DB["i2p"].findOne({type:"known",destination:peer.destination},function(err, doc) {
							if(err)
							{
								console.log(err);
								updateAllPeersLists("i2p",true);queue_db_peers.done();
							}
							else
							{
								//console.log("result=",doc);
								if(peer.followme==null)peer.followme=0;//заплатка((
								if(!doc){
									add2db(peer,"i2p","known");
								}
								else
								{
									if(update && (
										(defined(doc.lastvis) && doc.lastvis<peer.lastvis) ||
										doc.nick!=peer.nick ||
										doc.desc!=peer.desc ||
										doc.followme!=peer.followme ||
										doc.ifollow!=peer.ifollow ||
										doc.mail!=peer.mail
									))
									{
										console.log("update",update)
										add2db(peer,"i2p",'known',doc._id);
									}
									else if(!update)
									{
										queue_db_peers.done();
									}
									else queue_db_peers.done();
								};

							};
						});
				});
			}
		,10);
}
function th_AddPeerQueued(peer,update){
			setTimeout(
				function(){
					th_queue_db_peers.queue.pushAsync(
						function(lib) {
							console.log("                            th_QUEUED PEER ADDING "+peer.destination.toString().substr(0,10));
							var peerid = peer.destination;
							DB["th"].findOne({type:"known",destination:peer.destination}, function(err, doc) {
								if(err)
								{
									console.log(err);
									updateAllPeersLists("th",true);th_queue_db_peers.done();
								}
								else
								{
									if(peer.followme==null)peer.followme=0;//заплатка((
									//console.log("doc=",doc);
									if(!doc){
										add2db(peer,"th","known");
									}
									else
									{
										if(update==true && (
											doc.lastvis!=peer.lastvis ||
											doc.nick!=peer.nick ||
											doc.desc!=peer.desc ||
											doc.followme!=peer.followme ||
											doc.ifollow!=peer.ifollow ||
											doc.mail!=peer.mail
										))
										{
											add2db(peer,"th","known",doc._id);
										}
										else if(!update)
										{
											updateAllPeersLists("th",true);th_queue_db_peers.done();
										}
									};

								};
							});
					});
				}
			,10);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// БЛОК ОБРАБОТКИ ВХОДЯЩИХ КОММАНД ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ProcessCmd(destination,packet,server,socket,cappservices,cb,context)
{
	try{
		if(context=="i2p")
		{
			console.log("cmd from i2p ",packet.cmd/*,packet.data*/);
		}
		else
		{
			packet=packet.js;
			//console.log(packet);
			SetPeerState(context, destination,2);
			console.log("cmd from telehash-net ",packet.cmd);
		}
		switch(packet.cmd)
		{
							case 'ack':
												if(context=="i2p")
												{
													//console.log("received.ack #"+((defined(packet.ackid))?packet.ackid:""));
													queue[destination].done(destination);
												};
												break;
							case 'whoareyou?':
												if(context=="i2p")
												{;}
												else
												{
													console.log("received Who are you? sending part of my profile");
													var tdata={nick:my_profile[context].nick, desc:my_profile[context].desc, mail:my_profile[context].mail};
													tdata.ifollow=(IsInIFollow(context, destination))?1:0;
													SendData2Dest(context, destination,{cmd:"update_my_profile", profile:tdata});
												};
												break;
							case 'ping':
												if(IsInKnown(context, destination)){
													var index=IndexOfKnown(context, destination);
													if(index>=0)
													{
														var attrs={lastvis:Date.now()};
														processAttributes( context, known[context][index]._id, attrs);
													}
												};
												break;
							case 'ifollow':
												if(IsInKnown(context, destination)){
													var index=IndexOfKnown(context, destination);
													if(index>=0)
													{
														var attrs={followme:1};
														processAttributes( context, known[context][index]._id, attrs);
													};
												};
												break;
							case 'unfollow':
												if(IsInKnown(context, destination)){
													var index=IndexOfKnown(context, destination);
													if(index>=0)
													{
														var attrs={followme:0};
														processAttributes( context,known[context][index]._id, attrs);
													};
												};
												break;
							case 'disconnect':
												socket.end();
												break;
							case 'get_known_i2p':
												var t_known=CleanArray(known["i2p"]);
												SendData2Dest(context, destination, {cmd:"my_known_i2p", data:randy.shuffle(t_known)});
												break;
							case 'my_known_i2p':
												//if(context=="i2p")
												//{
													for(var i in packet.data){
														packet.data[i].nick=sanitizer.sanitize(packet.data[i].nick);
														packet.data[i].desc=sanitizer.sanitize(packet.data[i].desc);
														packet.data[i].destination=sanitizer.sanitize(packet.data[i].destination);
														//packet.data[i].followme=parseInt(packet.data[i].ifollow);
														packet.data[i].mail=sanitizer.sanitize(packet.data[i].mail);
														packet.data[i].lastvis=parseInt(packet.data[i].lastvis);
														packet.data[i].type="known";
													}
													AddNewPeers("i2p",packet.data,false);
													if(packet.data.length==0){
														var tp=JSON.parse(JSON.stringify(my_profile["i2p"]));
														tp.destination=configs["i2p"].destination;
														known["i2p"].push(tp);
														var tth_known=CleanArray(known["i2p"]);
														SendData2Dest(context, destination,{cmd:"my_known_i2p",data:randy.sample(randy.shuffle(tth_known),(tth_known.length/randy.randInt(1, 3)))});
													};
													
												//};
												break;
							case 'get_known':
												if(context=="i2p")
												{
													if(!need_restart)	{
														var t_known=CleanArray(known[context]);
														SendData2Dest(context, destination,{cmd:"my_known",data:randy.sample(randy.shuffle(t_known),(t_known.length/randy.randInt(1, 3)))});
														SetPeerState(context, destination,2);
													};
												}
												else
												{
													var tth_known=CleanArray(known[context]);
													SendData2Dest(context, destination,{cmd:"my_known",data:randy.sample(randy.shuffle(tth_known),(tth_known.length/randy.randInt(1, 3)))});
												};
												break;
							case 'my_known':
												if(context=="i2p")
												{
													for(var i in packet.data){
														packet.data[i].nick=sanitizer.sanitize(packet.data[i].nick);
														packet.data[i].desc=sanitizer.sanitize(packet.data[i].desc);
														packet.data[i].destination=sanitizer.sanitize(packet.data[i].destination);
														packet.data[i].followme=parseInt(packet.data[i].ifollow);
														packet.data[i].mail=sanitizer.sanitize(packet.data[i].mail);
														packet.data[i].lastvis=parseInt(packet.data[i].lastvis);
														packet.data[i].type="known";
													}
													AddNewPeers("i2p",CleanArray(packet.data),false);
													if(global.need_reset){
														var tp=JSON.parse(JSON.stringify(my_profile["th"]));
														tp.destination=configs["th"].destination;
														tp=CleanArray([tp]);
														/*I2P_SOCKETS[destination].write(JSON.stringify({
																		cmd:"get_some_th_peers",
																		data:tp
														}));*/
														SendData2Dest(context, destination,{
																		cmd:"get_some_th_peers",
																		data:tp
														});
														add2db({type:"restricted",destination:destination},"i2p","restricted");
													};
												}
												else
												{
													for(var i in packet.data){
														packet.data[i].nick=sanitizer.sanitize(packet.data[i].nick);
														packet.data[i].desc=sanitizer.sanitize(packet.data[i].desc);
														packet.data[i].destination=sanitizer.sanitize(packet.data[i].destination);
														packet.data[i].followme=parseInt(packet.data[i].ifollow);
														packet.data[i].mail=sanitizer.sanitize(packet.data[i].mail);
														packet.data[i].lastvis=parseInt(packet.data[i].lastvis);
														packet.data[i].type="known";
													}

													AddNewPeers("th",packet.data,false);
													
													if(packet.data.length==0){
														var tp=JSON.parse(JSON.stringify(my_profile[context]));
														tp.destination=configs[context].destination;
														known[context].push(tp);
														var tth_known=CleanArray(known[context]);
														SendData2Dest(context, destination,{cmd:"my_known",data: tth_known});
													};
													if(UseI2P){ SendData2Dest(context, destination,{cmd:"get_known_i2p"}); };
												};
												break;
							case 'update_my_profile':
												if(context=="i2p")
												{
													packet.profile.nick=sanitizer.sanitize(packet.profile.nick);
													packet.profile.desc=sanitizer.sanitize(packet.profile.desc);
													packet.profile.ifollow=parseInt(packet.profile.ifollow);
													//packet.profile.ifollow=(IsInIFollow(context, destination))?1:0;
													packet.profile.followme=parseInt(packet.profile.ifollow);
													packet.profile.mail=sanitizer.sanitize(packet.profile.mail);
													packet.profile.type="known";
													if(server==true)
													{
														var tpeer=my_profile[context];
														tpeer.destination=configs[context].destination;
														delete tpeer._id;
														delete tpeer._rev;
														var tdata=tpeer;
														tdata.ifollow=(IsInIFollow(context, destination))?1:0;
														socket.write(JSON.stringify({cmd:"update_my_profile",profile:tdata}));

														servscts[destination]={};
														servscts[destination].c=socket;
														servscts[destination].connected=true;

														clients[context][cappservices].nick=packet.profile.nick;
														clients[context][cappservices].desc=packet.profile.desc;
														clients[context][cappservices].mail=packet.profile.mail;
														clients[context][cappservices].followme=packet.profile.followme;
														clients[context][cappservices].ifollow=(IsInIFollow(context, destination))?1:0;
														//known=ConcatUnique(known,[clients[context][cappservices]]);
													}
													else
													{
														//packet.profile.followme=packet.profile.ifollow;
														//packet.profile.ifollow=(IsInIFollow(context, destination))?1:0;
														//known=ConcatUnique(known,[packet.profile]);
														I2P_SOCKETS[destination].connected=1;
													};

													var index=IndexOfKnown(context, destination);
													if(index>=0)
													{
														console.log("index determined = "+index,known["i2p"][index].nick);
														
														//console.log("index determined = "+index,known["th"][index]);/////////?????????
														known["i2p"][index].nick=packet.profile.nick;
														known["i2p"][index].desc=packet.profile.desc;
														known["i2p"][index].followme=packet.profile.ifollow;
														known["i2p"][index].mail=packet.profile.mail;
														known["i2p"][index].lastvis=Date.now();
														AddNewPeers("i2p",[known["i2p"][index]],true);
													}
													else
													{
														packet.profile.followme=packet.profile.ifollow;
														packet.profile.ifollow=0;
														packet.profile.destination=destination;
														packet.profile.lastvis=Date.now();
														AddNewPeers("i2p",[packet.profile],false);
													}

													console.log("IsInIFollow("+context+", destination)",IsInIFollow(context, destination));
													if(IsInIFollow(context, destination)){
														var q=	{
																	cmd:"read_",
																	data:{length:configs["i2p"].maxautofetch,offset:0}
																};
														if(configs["i2p"].autofetch)SendData2Dest(context, destination,q);
													};
													if(need_restart)
													{
														Restart();
														return;
													}
													else
													{
														SendData2Dest(context, destination,{cmd:"get_known"});
														SetPeerState(context, destination,2);
													}
												}
												else
												{
													packet.profile.nick=sanitizer.sanitize(packet.profile.nick);
													packet.profile.desc=sanitizer.sanitize(packet.profile.desc);
													packet.profile.ifollow=parseInt(packet.profile.ifollow);
													packet.profile.mail=sanitizer.sanitize(packet.profile.mail);
													packet.profile.type="known";
													//console.log(th_known);
													clients[context][destination].nick=packet.profile.nick;
													clients[context][destination].desc=packet.profile.desc;
													clients[context][destination].followme=packet.profile.ifollow;
													clients[context][destination].mail=packet.profile.mail;
													if(!IsInKnown(context, destination)){
														console.log(destination+" is not in th_known");
														packet.profile.followme=packet.profile.ifollow;
														packet.profile.ifollow=0;
														packet.profile.destination=destination;
														packet.profile.lastvis=Date.now();
														AddNewPeers([context],[packet.profile],false);
													}
													else
													{
														console.log("UPDATING AN EXISTING KNOWED PEER "+destination.substr(0,10));
														var index=IndexOfKnown(context, destination);
														if(index>=0)
														{
															console.log("index determined = "+index,known[context][index]);
															known[context][index].nick=packet.profile.nick;
															known[context][index].desc=packet.profile.desc;
															known[context][index].followme=packet.profile.ifollow;
															known[context][index].mail=packet.profile.mail;
															known[context][index].lastvis=Date.now();
															AddNewPeers([context], [known[context][index]], true);
														};
														if(IsInIFollow(context, destination)){
															var q=	{
																		cmd:"read_",
																		data:{length:configs[context].maxautofetch,offset:0}
																	};
															if(configs[context].autofetch) SendData2Dest(context, destination,q);
														};
													}
													SendData2Dest(context, destination,{cmd:"get_known"});
												};
												break;
							case 'read_last':
												console.log("#################### WE ARE SENDING SOME LAST POSTS "+context+" #####################");
												sendMyPosts(context, packet.data.length,packet.data.offset,destination);
												break;
							case 'read_':
												console.log("#################### WE ARE SENDING MANY LAST POSTS "+context+" #####################");
												sendMyManyPosts(context, packet.data.length,packet.data.offset,destination);
												break;
							case "my_post":
												console.log("#################### WE RECEIVED PEER'S POST "+context+" #####################");
												packet.data=SanitizePosts(context, packet.data,destination);
												Send2UI(context, "updatePeersPost",{msg:packet.data,type:0});///////////////////////////////////////////////////////////////////////////////////
												//if(context=="i2p")posts[context]=posts[context].concat(packet.data);
												//else posts[context]=UpdatePostInMemory(posts[context],packet.data);
												posts[context]=posts[context].concat(packet.data);
												posts[context]=UpdatePostInMemory(posts[context],packet.data);
												break;
							case "my_webpost":
												console.log("#################### WE RECEIVED PEER'S WEBPOST "+context+" #####################");
												packet.data=th_SanitizeWebPosts(packet.data,destination);
												Send2UI(context,"updatePeersWebPost",{msg:packet.data,type:0});///////////////////////////////////////////////////////////////////////////////////
												//th_webposts=th_webposts.concat(packet.data);
												th_webposts=UpdatePostInMemory(th_webposts,packet.data);
												break;
							case "my_last_myposts":
												if(context=="i2p")
												{
													console.log("#################### WE RECEIVED SOME PEER'S LAST POSTS I2P #####################");
													packet.data=SanitizePosts(context, packet.data,destination);
													if(destination==imyarek_dest)
														Send2UI(context, "updateAlertsPosts",{msg:packet.data,type:0});
													else
														Send2UI(context, "updatePeersPosts",{msg:packet.data,type:0});
													///////////////////////////////RESET!///////////////////////////////////////
													if(global.need_reset){
														var tp=JSON.parse(JSON.stringify(my_profile["th"]));
														tp.destination=configs["th"].destination;
														tp=CleanArray([tp]);
														SendData2Dest(context, destination,{
																		cmd:"get_some_th_peers",
																		data:tp
														});
														add2db({type:"restricted",destination:destination},context,"restricted");
													};
												}
												else
												{
													console.log("#################### WE RECEIVED SOME PEER'S LAST POSTS TH #####################");
													packet.data=SanitizePosts(context, packet.data,destination);
													Send2UI(context, "updatePeersPosts",{msg:packet.data,type:0});
												};
												break;
							case "my_last_many_myposts":
												console.log("#################### WE RECEIVED MANY PEER'S LAST POSTS "+context+" #####################");
												packet.data=SanitizePosts(context, packet.data,destination);
												if(destination==imyarek_dest)
													Send2UI(context, "updateAlertsPosts",{msg:packet.data,type:0});
												else
													Send2UI(context, "addPeersPosts",{msg:packet.data,type:0});
												//Send2UI(context, "addPeersPosts",{msg:packet.data,type:0});
												posts[context]=posts[context].concat(packet.data);
												posts[context]=UpdatePostInMemory(posts[context],packet.data);
												break;
							case "my_last_many_mywebposts":
												if(context=="th")
												{
													console.log("#################### WE RECEIVED MANY PEER'S LAST WEBPOSTS TH #####################");
													try{
														console.log(packet.data.length);
														if(packet.data.length>0)
														{
															packet.data=th_SanitizeWebPosts(packet.data,destination);
														
															Send2UI("th","addPeersWebPosts",{msg:packet.data,type:0});
															//th_webposts=ConcatUnique(th_webposts,packet.data);
															th_webposts=UpdatePostInMemory(th_webposts,packet.data);
														}
														else break;
													}catch(er){
														console.log(er);
													};
												};
												break;
							case "del_mypost":
												console.log("#################### WE RECEIVED ID OF POST FOR DELETING FROM MEMORY "+context+" #####################");
												var index=posts[context].findIndex(IsInArrayF,packet.data);
												if (index > -1)  posts[context].splice(index, 1);
												Send2UI(context,"delPeersPost",{msg:{destination:destination,id:packet.data},type:0});
												break;
							case "del_mywebpost":
												if(context=="th")
												{
													console.log("#################### WE RECEIVED ID OF WEBPOST FOR DELETING FROM MEMORY TH #####################");
													var index=th_webposts.findIndex(IsInArrayF,packet.data);
													if (index > -1)  th_webposts.splice(index, 1);
													Send2UI("th","delPeersWebPost",{msg:{destination:destination,id:packet.data},type:0});
												};
												break;
							case 'startchat':
												if(IsInIFollow(context, destination))	Send2UI(context,"openchat",{msg:destination,type:0});
												break;
							case 'newchatmsg':
												if(IsInIFollow(context, destination) || IsInFollowMe(context, destination)){
													Send2UI(context,"newchatmsg",{msg:{destination:destination, txt:sanitizer.sanitize(packet.data)}, type:0});
												};
												break;
							case "addcomment":
												packet.data.txt=sanitizer.sanitize(packet.data.txt);
												packet.data.ts=sanitizer.sanitize(packet.data.ts);
												packet.data.nick=sanitizer.sanitize(packet.data.nick);
												packet.data.adestination=sanitizer.sanitize(packet.data.adestination);
												packet.data.type="cmnt";
												packet.data.pid=sanitizer.sanitize(packet.data.pid);

												DB[context].findOne({_id:packet.data.pid}, function(err, doc) {
													if(err){
														console.log(err);
													}
													else
													{
														console.log("updating post");
														if(!defined(doc.cmnts))doc.cmnts=[];
														for(var i in doc.cmnts){
															if(defined(doc.cmnts[i].src)){
																doc.cmnts[i].txt=doc.cmnts[i].src.toString().replace(/\\+n/g,"\n");
																delete(doc.cmnts[i].src);
															}
														}
														doc.cmnts.push(packet.data);
															DB[context].update({_id: doc._id,type:"post"},doc, {}, function(err, response) {
															if(err){
																console.log('th_put error');
																console.log(doc._id,doc);
																Send2UI(context,"log",{msg:err,type:1});
																}
															else
															{
																DB[context].persistence.compactDatafile();setTimeout(function(){
																SendData2Dest(context, destination,{cmd:"my_post",data:[doc]});
																updateMyPosts(context);},150);
																//////  BROADCAST TO FOLLOWERS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
																BroadcastData(context, {	cmd:"my_last_many_myposts",	data:[doc]},"followme");
															};
														});
													};
												});
												break;
							case "addcommentweb":
											packet.data.txt=sanitizer.sanitize(packet.data.txt);
											packet.data.ts=sanitizer.sanitize(packet.data.ts);
											packet.data.nick=sanitizer.sanitize(packet.data.nick);
											packet.data.adestination=sanitizer.sanitize(packet.data.adestination);
											packet.data.type="cmnt";
											packet.data.pid=sanitizer.sanitize(packet.data.pid);
											DB["thw"].findOne({_id:packet.data.pid}, function(err, doc) {
												if(err){
													console.log(err);
												}
												else
												{
													console.log("updating post");
													if(!defined(doc.cmnts))doc.cmnts=[];
													for(var i in doc.cmnts){
														if(defined(doc.cmnts[i].src)){
															doc.cmnts[i].txt=doc.cmnts[i].src.toString().replace(/\\+n/g,"\n");
															delete(doc.cmnts[i].src);
														}
													}
													doc.cmnts.push(packet.data);
													DB["thw"].update({_id: doc._id,type:"post"},doc, {}, function(err, response) {
														if(err){
															console.log('th_put error');
															console.log(doc._id,doc);
															Send2UI("th","log",{msg:err,type:1});
														}
														else
														{
															DB["thw"].persistence.compactDatafile();setTimeout(function(){
															console.log(response);
															SendData2Dest(context, destination,{cmd:"my_webpost",data:[doc]});
															th_updateMyWebPosts();},150);
															////// BROADCAST TO FOLLOWERS
															BroadcastData(context, {	cmd:"my_last_many_mywebposts",	data:[doc]},"followme");
														};
													});
												};
											});
											break;
							case "dl":
											if(packet.data.fn){
												OpenFile(context, packet.data.fn,destination);
												console.log('#################'+destination.substr(0,10));
												var data = {};
												data.sharing=1;
												data.file=1;
												data.fn=packet.data.fn;
												data.fs=Files[context][destination][packet.data.fn]['FileSize'];
												data.end=false;
												SendData2Dest(context, destination,{cmd:"no",data:data});
											}
											else
											{
												console.log("No filename");
											};
											break;
							case "some_th_peers":
											if(known["th"].length==0 && global.need_reset){
												console.log(packet.data);
												if(packet.data.length>0)
													AddNewPeers("th",packet.data,false);

												global.need_reset=false;
												console.log("                                                      RESETING I2P PROFILE");
												//SendData2Dest(context, destination,{cmd:"del_me"});
												//setTimeout(function(){ResetI2PProfile();},5000);
												return;
											};
											break;
							case "get_some_th_peers":
											if(context=="i2p"){
												console.log(packet.data);
												servscts[destination]={};
												servscts[destination].c=socket;
												servscts[destination].connected=true;
												console.log("th_known from db",known["th"]);
												if(!defined(known["th"])){
													var tdata={nick:" ",desc:" ",mail:" ",destination:"temp"};
													tdata.ifollow=0;
													var ttth_known=CleanArray([tdata]);
													delete(packet.data.my_profile);
													AddNewPeers("th",packet.data,false);
													SendData2Dest(context, destination,{cmd:"some_th_peers",data:randy.shuffle(ttth_known)});
													console.log({cmd:"some_th_peers",data:randy.shuffle(ttth_known)});
													var t_known=CleanArray(known[context]);
													SendData2Dest(context, destination,{cmd:"my_known",data:randy.shuffle(t_known)});
												}
												else
												{
													if(known[context].length==0){
														var tdata={nick:" ",desc:" ",mail:" ",destination:"temp"};
														tdata.ifollow=0;
														var ttth_known=CleanArray([tdata]);
													}
													else
													{
														var ttth_known=CleanArray(known[context]);
														var tdata={nick:" ",desc:" ",mail:" ",destination:"temp"};
														tdata.ifollow=0;
														ttth_known.push(tdata);
													};
													delete(packet.data.my_profile);
													AddNewPeers("th",packet.data,false);
													SendData2Dest(context, destination, {cmd:"some_th_peers", data:randy.shuffle(ttth_known)});
													console.log({cmd:"some_th_peers", data:randy.shuffle(ttth_known)});
													var t_known=CleanArray(known["i2p"]);
													SendData2Dest(context, destination, {cmd:"my_known", data:randy.shuffle(t_known)});
												};
											};
											break;

							case "del_me":
											if(context=="i2p"){
												var i=IsInKnown(context, destination);
												if(i>=0)
												{
													DB[context].remove({_id:known[context][i]._id}, function(err, response) {
																if(err) console.log(err);
																else console.log(response);
																poll();
													});
													known[context].splice(known[context][i],1);
												};
											};
											break;



							case "calling":		
											if(context=="th")
											{
												Send2UI("th","calling",{msg:packet.data,destination:destination});
											}
											break;
							case "closecall":		
											if(context=="th")
											{
												Send2UI("th","closecall",{destination:destination});
											}
											break;
							default:
											if(destination.indexOf('b32.i2p')>0)
											{
												console.log("default: if(destination.indexOf('b32.i2p')>0)" );
												console.log(packet);
											}
											break;
						};
		if(context=="i2p")
		{
			if(packet.cmd!="ack" && destination.indexOf('b32.i2p')<0){
				console.log("sendind ack ");
				SendData2Dest2(destination,{cmd:"ack"});
			};
		}
		else cb();
	}
	catch(error){
		console.log("cathed error in ProcessCmd", error);
	};
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// КОНЕЦ БЛОКА ОБРАБОТКИ ВХОДЯЩИХ КОММАНД ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
