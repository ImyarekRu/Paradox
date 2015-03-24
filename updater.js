var 	rawgithub = require('rawgithub'),
	fs = require('fs-extra'),
	path = require("path"),
	rimraf = require("rimraf"),
	httpreq = require('httpreq'),
	unzip = require("unzip");


var user="ImyarekRu";
var name="Paradox";
var reponame=name+"-master";
var urlzip="https://github.com/"+user+"/"+name+"/archive/master.zip";
var url = 'https://github.com/'+user+'/'+name+'/blob/master/tmp/version/ver.json';

var output_path= path.resolve(__dirname,'./');
var tmp_path=path.resolve(__dirname,'./tmp');
var currentver;
try{
	currentver = require(path.resolve(__dirname,'./tmp/version/ver.json'));
}catch(ex){
	currentver = {app:"0.000"};
};
rawgithub(url, function(err, data){
    // => returns the file contents as a string
    if(err){console.log(err);console.log(url);process.exit(0);}
    console.log("Github ver:"+JSON.parse(data).app);
    console.log("Local ver:"+currentver.app);
    rimraf.sync(path.resolve(tmp_path,"./"+reponame));
    if(fs.existsSync(path.resolve(__dirname,"./update.zip")))    fs.unlinkSync(path.resolve(__dirname,  "./update.zip"));
    if(parseFloat(JSON.parse(data).app)==parseFloat(currentver.app))  process.exit(0);
    else
    {
        httpreq.download(
            urlzip,
            path.resolve(__dirname,"./update.zip")
        , function (err, progress){
            if (err) return console.log(err);
            console.log(progress);
        }, function (err, res){
            if (err) return console.log(err);
            console.log(res);

            fs.createReadStream(path.resolve(__dirname + "/update.zip")).pipe(unzip.Extract({ path:tmp_path }))
            .on('finish', function () {
				console.log('chmoding...');
				try{ fs.unlinkSync(path.resolve(tmp_path,"./"+reponame+"/components"+'/node_macx32'));}catch(err){;};
				try{ fs.unlinkSync(path.resolve(tmp_path,"./"+reponame+"/components"+'/node_x32'));}catch(err){;};
				try{ fs.unlinkSync(path.resolve(tmp_path,"./"+reponame+"/components"+'/node_x32.exe'));}catch(err){;};
				try{ fs.unlinkSync(path.resolve(tmp_path,"./"+reponame+"/components"+'/node_x64'));}catch(err){;};
				//try{ fs.unlinkSync(path.resolve(tmp_path,"./"+reponame+"/components"+'/node_x64.exe'));}catch(err){;};
				//fs.chmodSync(path.resolve(tmp_path,"./"+reponame+"/components"+'/node_x32'), 0777);
				//fs.chmodSync(path.resolve(tmp_path,"./"+reponame+"/components"+'/node_x64'), 0777);
				fs.chmodSync(path.resolve(tmp_path,"./"+reponame+'/START_IN_LINUX.sh'), 0777);
				fs.chmodSync(path.resolve(tmp_path,"./"+reponame+'/STOP_IN_LINUX.sh'), 0777);
				fs.chmodSync(path.resolve(tmp_path,"./"+reponame+'/START_IN_OSX.sh'), 0777);
				fs.chmodSync(path.resolve(tmp_path,"./"+reponame+'/STOP_IN_OSX.sh'), 0777);
				console.log('copying...');
				var files=fs.readdirSync(path.resolve(tmp_path,"./"+reponame));
				files.forEach( function (file) {
					console.log(file);
					var stats=fs.lstatSync(path.resolve(tmp_path,"./"+reponame+"/"+file));
					if (stats.isDirectory()) {
						if(file!="tmp")
						{
							fs.copySync(path.resolve(tmp_path,"./"+reponame+"/"+file), path.resolve(output_path,"./"+file));
						}
					}
					else fs.copySync(path.resolve(tmp_path,"./"+reponame+"/"+file), path.resolve(output_path,"./"+file));
				});
				console.log("removing node_modules - too long paths");
				rimraf.sync(path.resolve(tmp_path,"./"+reponame+"/node_modules"));
				 
				console.log("now copying ver");
				var res=fs.copySync(path.resolve(tmp_path,"./"+reponame+"/tmp/version/ver.json"), path.resolve(output_path,"./components/tmp/version/ver.json"));
				setTimeout(function(){console.log("Done! "+res);},5000);
			});
		});
	}
});
