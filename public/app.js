var SelectedFile;
var FReader;
var Name;
var SelectedFile_P;
var FReader_P;
var Name_P;
var onlylatnum=/^[a-zA-Z0-9\.\w\-]+$/i;			

function CreateEpicEdit(container,id,destination,src)
{
	
	$('textarea').markItUpRemove();
	$('#'+container).val(src);
	if(id) {
		switch(container){
			case "edit_post_text":				$('#editPostID').val(id);break;
			case "cmnt2mypost_post_text":		$('#cmnt2mypostPostID').val(id);
			case "cmnt_post_text":				$('#cmntPostID').val(id);$('#cmntPostDest').val(destination);break;
				
			case "edit_post_text_P":			$('#editPostID_P').val(id);break;
			case "cmnt2mypost_post_text_P":		$('#cmnt2mypostPostID_P').val(id);
			case "cmnt2mywebpost_post_text_P":	$('#cmnt2mywebpostPostID_P').val(id);
			case "cmnt_post_text_P":			$('#cmntPostID_P').val(id);$('#cmntPostDest_P').val(destination);break;
			case "cmnt_webpost_text_P":			$('#cmntwebPostID_P').val(id);$('#cmntwebPostDest_P').val(destination);break;
			
		}
	};
	$('#'+container).markItUp(myMarkdownSettings);
	
}

var converter = new Showdown.converter();
var htmlize = function(content) {
	return converter.makeHtml(content);
};	

function AddStartLink(){
	var h="<a href='#' onclick='sendCmd(\"i2p\",\"run\",{});$(\"#start_i2p\").html(\"\");'>__("Start")</a>";
	$('#start_i2p').html(h);
}
function AddStartLink_P(){
	var h="<a href='#' onclick='sendCmd(\"th\", \"run\",{});$(\"#start_th\").html(\"\");'>__("Start")</a>";
	$('#start_th').html(h);
}			
function RemoveStartLink(){
	$('#start_i2p').html('');
}
function RemoveStartLink_P(){
	$('#start_th').html('');
}			
				
function Ready(){ 
	console.log("window.load");
	if(window.File && window.FileReader){ //These are the necessary HTML5 objects the we are going to use 
		$("#UploadButton").click(StartUpload);  
		$("#RefreshDirButton").click(RefreshDirectory);  
		$("#RefreshDirButton2Tab").click(RefreshDirectory2Tab);  
		$("#RefreshDirButtonNewPost").click(RefreshDirectoryNewPost);  
		$("#FileBox").bind("change", FileChosen);
	
		//document.getElementById("UploadButton").addEventListener("click", StartUpload);  
		//document.getElementById("FileBoxNewPost").addEventListener("change", FileChosenNewPost);
	}
	else
	{
		$("#UploadArea").html("__("HTML5Warn")");
	}
	updateLayout();
	$(document).foundation();
	//$('#infoModal .txt').html("__("waitpleaseinit")");
	//$('#infoModal').foundation('reveal', 'open');
}; 

function Ready_P(){ 
	console.log("window_P.load");
	if(window.File && window.FileReader){ 
		$("#UploadButton_P").click(StartUpload_P);  
		//$("#UploadButtonW_P").click(StartUploadW_P);  
		$("#RefreshDirButton_P").click(RefreshDirectory_P);  
		//$("#RefreshDirButtonW_P").click(RefreshDirectoryW_P);  
		$("#RefreshDirButton2Tab_P").click(RefreshDirectory2Tab_P);  
		$("#RefreshDirButtonNewPost_P").click(RefreshDirectoryNewPost_P);  
		$("#FileBox_P").bind("change", FileChosen_P);
		$("#FileBoxW_P").bind("change", FileChosenW_P);
					
	}
	else
	{
		$("#UploadArea_P").html("__("HTML5Warn")");
	}
	updateLayout();
	$(document).foundation();
	if(document.location.port==11044)document.location=document.location.toString().replace("11044","11043");
	if(document.location.port==11045)document.location=document.location.toString().replace("11045","11043");

	//$('#infoModal .txt').html("__("waitpleaseinit"");
	//$('#infoModal').foundation('reveal', 'open');
	
};

			
$('a[href=#top]').click(function() {$("#main-section").animate({scrollTop: 0},600);	return false; });
$('a[href=#top]').click(function() {$("#main-section_P").animate({scrollTop: 0},600);	return false; });

$("#newpost").click(function (e) {	tempfunc1("i2p",e);});
$("#newpost_P").click(function (e) {tempfunc1("th",e);});
function tempfunc1(context,e){
	var P=(context=="th")?"_P":"";
	var theContent = $('#new_post_text'+P).get(0).value;//editor.exportFile();
	PostThis(context, theContent);//editor.importFile('tmp',"");
	$('#close_newPost'+P).click();
};

$("#editpost").click(function (e) {tempfunc2("i2p",e)});
$("#editpost_P").click(function (e) {tempfunc2("th",e)});
function tempfunc2(context,e){
	var P=(context=="th")?"_P":"";
	var theContent = $('#edit_post_text'+P).get(0).value;//editor.exportFile();
	PostUpd(context, $('#editPostID'+P).val(),theContent);//editor.importFile('tmp',"");
	$('#close_editPost'+P).click();
};

$("#cmnt2mypost").click(function (e) {tempfunc3("i2p",e)});
$("#cmnt2mypost_P").click(function (e) {tempfunc3("th",e)});
function tempfunc3(context,e){
	var P=(context=="th")?"_P":"";
	var theContent = $('#cmnt2mypost_text'+P).get(0).value;//editor.exportFile();
	NewComment2mypost(context,$('#cmnt2mypostPostID'+P).val(),theContent);//editor.importFile('tmp',"");
	$('#close_cmnt2mypostPost'+P).click();
};

$("#cmntpost").click(function (e) {tempfunc4("i2p",e)});
$("#cmntpost_P").click(function (e) {tempfunc4("th",e)});
function tempfunc4(context,e){
	var P=(context=="th")?"_P":"";
	var theContent = $('#cmnt_post_text'+P).get(0).value;//editor.exportFile();
	NewComment(context, $('#cmntPostID'+P).val(),$('#cmntPostDest'+P).val(),theContent);//editor.importFile('tmp',"");
	$('#close_cmntPost'+P).click();
};

$("#cmnt2mywebpost_P").click(function (e) {
	var theContent = $('#cmnt2mywebpost_post_text_text'+P).get(0).value;//editor.exportFile();
	NewComment2mywebpost_P($('#cmnt2mywebpostPostID_P').val(),theContent);//editor.importFile('tmp',"");
	$('#close_cmnt2mywebpostPost_P').click();
});
$("#cmntwebpost_P").click(function (e) {
	var theContent = $('#source_cmnt_webpost_text'+P).get(0).value;//editor.exportFile();
	NewCommentweb_P($('#cmntwebPostID_P').val(),$('#cmntwebPostDest_P').val(),theContent);//editor.importFile('tmp',"");
	$('#close_cmntwebPost_P').click();
});

$("#chatmsginput").keypress(function (e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13 && !e.Shift) {
		var curdest=null;
		var curi=-1;
		for(var i in ChatPeers.models){if(ChatPeers.models[i].attributes.active==1){curi=i;curdest=ChatPeers.models[i].attributes.destination;};};
		sendCmd("i2p", "sendchatmsg", {destination:curdest,txt:$("#chatmsginput").val()});
		ChatPeers.models[curi].attributes.msgs.add({nick:"Me",txt:$("#chatmsginput").val()});  
		ChatPeers.models[curi].set({lastts:Date.now()}); 
		setTimeout(function(){$("#chatmsginput").val('');},100);
		ChatPeersList.render();
		$(document).foundation();
		return false;
	}
});
$("#chatmsginput_P").keypress(function (e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13 && !e.Shift) {
		var curdest=null;
		var curi=-1;
		for(var i in ChatPeers_P.models){if(ChatPeers_P.models[i].attributes.active==1){curi=i;curdest=ChatPeers_P.models[i].attributes.destination;};};
		sendCmd("th", "sendchatmsg", {destination:curdest,txt:$("#chatmsginput_P").val()});
		ChatPeers_P.models[curi].attributes.msgs.add({nick:"Me",txt:$("#chatmsginput_P").val()});  
		ChatPeers_P.models[curi].set({lastts:Date.now()}); 
		setTimeout(function(){$("#chatmsginput_P").val('');},100);
		ChatPeersList_P.render();
		$(document).foundation();
		return false;
	}
});
				
$("#SettingsTab select").bind("change",UpdateConfig);
$("#SettingsTab input").bind("click",UpdateConfig);
$("#SettingsTab_P select").bind("change",UpdateConfig_P);
$("#SettingsTab_P input").bind("click",UpdateConfig_P);

			


			
				
			
var Path2IO = "//"+document.location.hostname+":"+(parseInt(document.location.port));
var socket = io.connect(Path2IO);
//sendCmd("i2p", 'is_running', {});
RefreshDirectory();
sendCmd("i2p", 'poll', {});
			
var Path2IO_P = "//"+document.location.hostname+":"+(parseInt(document.location.port)+1);
var socket_P = io.connect(Path2IO_P);
sendCmd("th", 'poll', {});
sendCmd("th", 'me', {});
						
socket.on('cmd', function (data){
	ProcessCommand("i2p",data);
});
socket_P.on('cmd', function (data){
	ProcessCommand("th",data);
});




	
function ProcessCommand(context,data){
	console.log(data);
	var cmd=data.cmd;
	var data=data.data;
	var P="";	if(context=="th")P="_P";
	console.log(cmd+" "+context);
	switch(cmd){
		case 'log':				console.log(data);
								break;
		case 'wait_please':		var h="<div style='width:100%;text-align:center;'>__("waitpleaseinit1")<br></div>";
								$('#infoModal .txt').html(h);
								$('#infoModal').foundation('reveal', 'open');
								break;
		case 'me':				console.log(data.destination);
								myhashname=data.destination;
								break;
		case 'keepinmind':
								if(!data.state && !data.th_state){
									var h="<div style='width:100%;text-align:center;'>__("profilesnotstarted")<br><br><b class='red'>__("profilesstartwarn")<br><br> </div>";
									h+="<button class='small secondary button' style='float:left' onclick='sendCmd(\"i2p\", \"run\",{});$(\"#infoModal\").foundation(\"reveal\", \"close\");RemoveStartLink();'>__("starti2p")</button>&nbsp;";
									h+="<button class='small secondary button' style='float:right' onclick='sendCmd(\"th\", \"run\",{});$(\"#infoModal\").foundation(\"reveal\", \"close\");RemoveStartLink_P();'>__("startth")</button>";
									$('#infoModal .txt').html(h);
									$('#infoModal').foundation('reveal', 'open');
									AddStartLink();AddStartLink_P();
								}
								else if(!data.state && data.th_state)
								{
									var h="<div style='width:100%;text-align:center;'>__("thstarted")<br><br><b class='red'>__("thstartedwarn")<br><br> </div>";
									h+="<button class='small secondary button'  onclick='sendCmd(\"i2p\", \"run\",{});$(\"#infoModal\").foundation(\"reveal\", \"close\");RemoveStartLink();'>__("starti2p")</button>&nbsp;";
									$('#infoModal .txt').html(h);
									$('#infoModal').foundation('reveal', 'open');
									AddStartLink();
								}
								else if(data.state && !data.th_state)
								{
									var h="<div style='width:100%;text-align:center;'>__("i2pstarted")<br><br><b class='red'>__("i2pstartedwarn")<br><br> </div>";
									h+="<button class='small secondary button' style='float:right' onclick='sendCmd(\"th\", \"run\",{});$(\"#infoModal\").foundation(\"reveal\", \"close\");RemoveStartLink_P();'>__("startth")</button>";
									$('#infoModal .txt').html(h);
									$('#infoModal').foundation('reveal', 'open');
									AddStartLink_P();
								};
								break;
					
		case 'bootstraped':
								AddStartLink();AddStartLink_P();//////??? need to fix
								$('#infoModal').foundation('reveal', 'close');
								break;
					
		case 'updateImageInPage':	console.log("updateImageInPage");
								console.log(data.msg.id);
								console.log(data.msg.src);
								$('#'+data.msg.id).attr('src',data.msg.src);
								break;
		case 'updateProfile':	
								if(context=="th")my_profile_P.set(data.msg);
								else my_profile.set(data.msg);
								//$('#infoModal').foundation('reveal', 'close');
								break;
		case 'updateSettings': 	
								$("#SettingsTab"+P+" input:radio[name ='cnctondem"+P+"']").attr('checked', false);
								$("#SettingsTab"+P+" input:radio[name ='cnctondem"+P+"'][value=" + data.msg.cnctondem + "]").prop('checked', 'checked');
								if(data.msg.cnctondem>0)$("#SettingsTab"+P+" #maxoutcnctsdiv"+P+"").hide("slow");
								else $("#SettingsTab"+P+" #maxoutcnctsdiv"+P+"").show("slow");
								$("#SettingsTab"+P+" input:radio[name ='autofetch"+P+"']").attr('checked', false);
								$("#SettingsTab"+P+" input:radio[name ='autofetch"+P+"'][value=" + data.msg.autofetch + "]").prop('checked', 'checked');
								if(data.msg.autofetch>0)$("#SettingsTab"+P+" #maxautofetchdiv"+P+"").show("slow");
								else $("#SettingsTab"+P+" #maxautofetchdiv"+P+"").hide("slow");
								
								$("#SettingsTab"+P+" #maxoutcncts"+P).val(data.msg.maxoutcncts);
								$("#SettingsTab"+P+" #maxautofetch"+P).val(data.msg.maxautofetch);
								$("#SettingsTab"+P+" #maxlastestposts"+P).val(data.msg.maxlastestposts);
								$("#SettingsTab"+P+" #maxincnctsv"+P).val(data.msg.maxincncts);
								$("#SettingsTab"+P+" #maxknowns"+P).val(data.msg.maxknowns);
								break;
		case "updateKnownPeers":
								var tmodel;
								for(var i in data.msg)
								{
									if(context=="th")tmodel=Knowns_P.findWhere({destination:data.msg[i].destination});
									else tmodel=Knowns.findWhere({destination:data.msg[i].destination});
									if(tmodel)
									{
										var changed=false;
										for(var attr in data.msg[i]){
											if(data.msg[i][attr]!=tmodel.attributes[attr])changed=true;
										};
										if(
											/*data.msg[i].nick.toString()!=tmodel.attributes.nick.toString() ||
											data.msg[i].desc.toString()!=tmodel.attributes.desc.toString() ||
											data.msg[i].destination.toString()!=tmodel.attributes.destination.toString() ||
											data.msg[i].mail.toString()!=tmodel.attributes.mail.toString() ||
											//parseInt(data.msg[i].banned.toString())!=parseInt(tmodel.attributes.banned.toString()) ||
											parseInt(data.msg[i].ifollow.toString())!=parseInt(tmodel.attributes.ifollow.toString()) ||
											parseInt(data.msg[i].followme.toString())!=parseInt(tmodel.attributes.followme.toString()) ||
											parseInt(data.msg[i].state.toString())!=parseInt(tmodel.attributes.state.toString())
											*/
											changed
										){
											console.log("RENDERING EXISTING KNOWN_P IN COLLECTION");
											tmodel.set(data.msg[i]);
										};
									}
									else
									{
										console.log("NO SUCH KNOWN_P IN COLLECTION");
										if(context=="th"){
											Knowns_P.add(data.msg[i]);
											//CallsPeers_P.add(data.msg[i]/*this.model.toJSON()*/);
										}
										else Knowns.add(data.msg[i]);
									};
								};
								break;
		case 'updateMyPosts':	
								console.log(data);
								if(context=="th"){
									while(MyPosts_P.models.length>0){MyPosts_P.models[0].destroy()};
									myposts_P=data.msg;
									for(var i in myposts_P){	MyPosts_P.add(myposts_P[i]);};
								}
								else
								{
									while(MyPosts.models.length>0){MyPosts.models[0].destroy()};
									myposts=data.msg;
									for(var i in myposts){	MyPosts.add(myposts[i]);};
								};
								break;
		/*case 'updateMyWebPosts':	
								while(MyWebPosts_P.models.length>0){MyWebPosts_P.models[0].destroy()};
								console.log(" ");console.log(" ");console.log(" ");
								console.log(data);
								console.log(" ");console.log(" ");console.log(" ");
								mywebposts_P=data.msg;
								for(var i in mywebposts_P){	MyWebPosts_P.add(mywebposts_P[i]);};
								break;*/
		case 'updatePeersPosts':
								if(context=="th"){
									while(PeersPosts_P.models.length>0){PeersPosts_P.models[0].destroy()};
									peersPosts_P=data.msg;
									for(i in peersPosts_P){	PeersPosts_P.add(peersPosts_P[i]);	};
								}
								else
								{
									while(PeersPosts.models.length>0){PeersPosts.models[0].destroy()};
									peersPosts=data.msg;
									for(i in peersPosts){	PeersPosts.add(peersPosts[i]);	};		
								};
								$('#peersPosts'+P).foundation('reveal', 'open');
								break;
		case 'updatePeersPost':
								peersPost=data.msg[0];
								var tmodel;
								if(context=="th")tmodel==Posts_P.findWhere({_id:peersPost._id});
								else tmodel==Posts.findWhere({_id:peersPost._id});
								if(tmodel)
								{
									console.log("UPDATING EXISTING POST_P IN COLLECTION");
									tmodel.set(peersPost);
								}
								//else //this is updating, not adding
								break;
		case 'updatePeersWebPost':
								th_peerswebPost=data.msg[0];
								console.log(th_peerswebPost);
								var tmodel=WebPosts_P.findWhere({_id:th_peerswebPost._id});
								console.log(tmodel);
								if(tmodel)
								{
									console.log("UPDATING EXISTING WEBPOST_P IN COLLECTION");
									tmodel.set(th_peerswebPost);
								}
								/*else //this is updating, not adding
								{
									console.log("NO SUCH POST IN COLLECTION");
									Posts.add(peersPost);
								};
								*/
								break;
		case 'addPeersPosts':	
								posts2add=data.msg;
								for(i in posts2add)
								{
									var tmodel;
									if(context=="th")	tmodel=Posts_P.findWhere({_id:posts2add[i]._id});
									else 				tmodel=Posts.findWhere({_id:posts2add[i]._id});
									if(tmodel)
									{
										console.log("RENDERING EXISTING POST_P IN COLLECTION");
										tmodel.set(posts2add[i]);
									}
									else
									{
										console.log("NO SUCH POST_P IN COLLECTION");
										if(context=="th")Posts_P.add(posts2add[i]);
										else Posts.add(posts2add[i]);
									};
								};
								break;
		case 'addPeersWebPosts':	
								th_webposts2add=data.msg;
								for(i in th_webposts2add)
								{
									var tmodel=WebPosts_P.findWhere({_id:th_webposts2add[i]._id});
									if(tmodel)
									{
										console.log("RENDERING EXISTING WEBPOST_P IN COLLECTION");
										tmodel.set(th_webposts2add[i]);
									}
									else
									{
										console.log("NO SUCH WEBPOST_P IN COLLECTION");
										WebPosts_P.add(th_webposts2add[i]);
									};
								};
								break;
		case 'updateAlertsPosts':
								posts2add=data.msg;
								if(context=="th"){
									for(i in posts2add)
									{
										var tmodel=Alerts_P.findWhere({_id:posts2add[i]._id});
										if(tmodel)
										{
											console.log("RENDERING EXISTING ALERT_P IN COLLECTION");
											tmodel.set(posts2add[i]);
										}
										else
										{
											console.log("NO SUCH ALERT_P IN COLLECTION");
											Alerts_P.add(posts2add[i]);
										};
									};
								}
								else
								{
									for(i in posts2add)
									{
										var tmodel=Alerts.findWhere({_id:posts2add[i]._id});
										if(tmodel)
										{
											console.log("RENDERING EXISTING POST IN COLLECTION");
											tmodel.set(posts2add[i]);
										}
										else
										{
											console.log("NO SUCH POST IN COLLECTION");
											Alerts.add(posts2add[i]);
										};
									};
								};
								break;
		case 'delPeersPost':
								var tmodel=Posts_P.findWhere({_id:data.msg.id,destination:data.msg.destination});
								console.log(tmodel);
								if(tmodel)
								{
									console.log("REMOVING EXISTING POST_P IN COLLECTION");
									Posts_P.remove(tmodel);
								}
								break;
		case 'delPeersWebPost':
								var tmodel=WebPosts_P.findWhere({_id:data.msg.id,destination:data.msg.destination});
								console.log(tmodel);
								if(tmodel)
								{
									console.log("REMOVING EXISTING WEBPOST_P IN COLLECTION");
									WebPosts_P.remove(tmodel);
								}
								break;
		case 'updatePeersState':
								if(context=="th"){
									for(var i in Knowns_P.models)
									{
										if(Knowns_P.models[i].attributes.destination==data.msg.destination && Knowns_P.models[i].attributes.state!=data.msg.state)
										{
											Knowns_P.models[i].set("state",parseInt(data.msg.state));
											
										};
									}
									for(var i in ChatPeers_P.models)
									{
										if(ChatPeers_P.models[i].attributes.destination==data.msg.destination && ChatPeers_P.models[i].attributes.state!=data.msg.state)
										{
											ChatPeers_P.models[i].set("state",parseInt(data.msg.state));
										};
									};
									
								}
								else
								{
									for(var i in Knowns.models)
									{
										if(Knowns.models[i].attributes.destination==data.msg.destination && Knowns.models[i].attributes.state!=data.msg.state)
										{
											Knowns.models[i].set("state",parseInt(data.msg.state.toString()));
										};
									}
									for(var i in ChatPeers.models)
									{
										if(ChatPeers.models[i].attributes.destination==data.msg.destination && ChatPeers.models[i].attributes.state!=data.msg.state)
										{
											ChatPeers.models[i].set("state",parseInt(data.msg.state.toString()));
										};
									};
								};
								break;
		case 'newchatmsg':
								var already_in_chats=false;
								var knownind=-1;
								if(context=="th"){
									for(var i in ChatPeers_P.models)
									{
										if(ChatPeers_P.models[i].attributes.destination==data.msg.destination)
										{
											already_in_chats=true;
										};
									};
									for(var i in Knowns_P.models)
									{
										if(Knowns_P.models[i].attributes.destination==data.msg.destination)
										{
											knownind=i;
										};
									};
									
									if(!already_in_chats && knownind>=0){
										ChatPeers_P.add(Knowns_P.models[knownind].toJSON());
										$(".chatscnt_P").html(ChatPeers_P.models.length);
										if($("#ChatsTab_P").css("display")!="block")$(".chatscnt_P").toggleClass("bold");
										chat_notify.play();
									}
									for(var i in ChatPeers_P.models)
									{
										if(ChatPeers_P.models[i].get("destination")==data.msg.destination)
										{
											ChatPeers_P.models[i].attributes.msgs.add(new ChatMsg_P({nick:ChatPeers_P.models[i].attributes.nick,txt:data.msg.txt}));
											var nmc=ChatPeers_P.models[i].get("newmsgcnt")
											ChatPeers_P.models[i].set("newmsgcnt",nmc+1);
											msg_notify.play();
										};
									};
								}
								else
								{
									for(var i in ChatPeers.models)
									{
										if(ChatPeers.models[i].attributes.destination==data.msg.destination)
										{
											already_in_chats=true;
										};
									};
									for(var i in Knowns.models)
									{
										if(Knowns.models[i].attributes.destination==data.msg.destination)
										{
											knownind=i;
										};
									};
									
									if(!already_in_chats && knownind>=0){
										ChatPeers.add(Knowns.models[knownind].toJSON());
										$(".chatscnt").html(ChatPeers.models.length);
										if($("#ChatsTab").css("display")!="block")$(".chatscnt").toggleClass("bold");
										chat_notify.play();
									}
									for(var i in ChatPeers.models)
									{
										if(ChatPeers.models[i].get("destination")==data.msg.destination)
										{
											ChatPeers.models[i].attributes.msgs.add(new ChatMsg({nick:ChatPeers.models[i].attributes.nick,txt:data.msg.txt}));
											var nmc=ChatPeers.models[i].get("newmsgcnt")
											ChatPeers.models[i].set("newmsgcnt",nmc+1);
											msg_notify.play();
										};
									};
								};
								if($("#ChatsTab"+P).css("display")!="block")$(".chatscnt"+P).toggleClass("bold");
								break;
		case 'openchat':
								var already_in_chats=false;
								var knownind=-1;
								if(context=="th"){
									for(var i in ChatPeers_P.models)
									{
										if(ChatPeers_P.models[i].attributes.destination==data.msg)
										{
											already_in_chats=true;
										};
									};
									for(var i in Knowns_P.models)
									{
										if(Knowns_P.models[i].attributes.destination==data.msg)
										{
											knownind=i;
										};
									};
									
									if(!already_in_chats && knownind>=0){
										ChatPeers_P.add(Knowns_P.models[knownind].toJSON());
										$(".chatscnt_P").html(ChatPeers_P.models.length);
										if($("#ChatsTab_P").css("display")!="block")$(".chatscnt_P").toggleClass("bold");
										chat_notify.play();
									}
								}
								else
								{
									for(var i in ChatPeers.models)
									{
										if(ChatPeers.models[i].attributes.destination==data.msg)
										{
											already_in_chats=true;
										};
									};
									for(var i in Knowns.models)
									{
										if(Knowns.models[i].attributes.destination==data.msg)
										{
											knownind=i;
										};
									};
									
									if(!already_in_chats && knownind>=0){
										ChatPeers.add(Knowns.models[knownind].toJSON());
										$(".chatscnt").html(ChatPeers.models.length);
										if($("#ChatsTab").css("display")!="block")$(".chatscnt").toggleClass("bold");
										chat_notify.play();
									}
								};
								break;
		case 'progress':
								$("#drop"+data["fn"].split(".")[0]+" .txt").html("<div id='percent' style='display: inline-block;position:relative;right:0%;bottom:3px;width:50px;'>0%</div><div class='progress small-9 secondary round' style='display: inline-flex;'> <div class='meter' style='width: 0%'></div>    </div>");
								UpdateBar2(data["Percent"],data["fn"].split(".")[0]);
								break;
		case 'StartDL':			
								var tfn=data['file'];
								var tfport=data['port'];
								setTimeout(function(){
									document.location="http://"+document.location.hostname+":"+tfport+"/download?"+tfn;
								},1000);
								break;
		case 'MoreData':
								UpdateBar(context, data['Percent']);
								if(context=="th")
								{
									var Place = data['Place'] * 524288; //The Next Blocks Starting Position
									var NewFile; //The Variable that will hold the new Block of Data
									if(SelectedFile_P.webkitSlice) 
										NewFile = SelectedFile_P.webkitSlice(Place, Place + Math.min(524288, (SelectedFile_P.size-Place)));
									else
										NewFile = SelectedFile_P.slice(Place, Place + Math.min(524288, (SelectedFile_P.size-Place)));
									FReader_P.readAsBinaryString(NewFile);
								}
								else
								{
									var Place = data['Place'] * 524288; //The Next Blocks Starting Position
									var NewFile; //The Variable that will hold the new Block of Data
									if(SelectedFile.webkitSlice) 
										NewFile = SelectedFile.webkitSlice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
									else
										NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
									FReader.readAsBinaryString(NewFile);
								}
								break;
		case 'Done':
								var Content = '<label for="FileBox'+P+'">__("SelectFile"): </label><input type="file" class="success button" id="FileBox'+P+'"><br>';
								Content += '<label for="NameBox'+P+'">__("RenameFile") (<small>__("OnlyLatCharsAndNums")</small>): </label><input type="text" id="NameBox'+P+'" ><br>';
								Content += '<button	type="button" id="UploadButton'+P+'" class="Button">__("Upload")</button>';
								$('#UploadArea'+P).html( Content);
								
								var ContentW = '<label for="FileBoxW_P">__("SelectFile"): </label><input type="file" class="success button" id="FileBoxW'+P+'"><br>';
								ContentW += '<label for="NameBoxW_P">__("RenameFile") (<small>__("OnlyLatCharsAndNums")</small>): </label><input type="text" id="NameBoxW'+P+'" ><br>';
								ContentW += '<button	type="button" id="UploadButtonW'+P+'" class="Button">__("Upload")</button>';
								if(context=="th"){
									$('#UploadAreaW_P').html( ContentW);
									$("#UploadButton_P").click(StartUpload_P);  
									$("#UploadButtonW_P").click(StartUploadW_P);  
									$("#FileBox_P").bind("change", FileChosen_P);
									$("#FileBoxW_P").bind("change", FileChosenW_P);
								}
								else
								{
									$("#UploadButton").click(StartUpload);  
									$("#FileBox").bind("change", FileChosen);
								}
								
								console.log("Uploading Done");
								RefreshDirectory_P();RefreshDirectoryW_P();RefreshDirectory2Tab_P();RefreshDirectoryNewPost_P();
								RefreshDirectory();RefreshDirectory2Tab();RefreshDirectoryNewPost();
								break;
					
		case 'Dir':
								var Content = "<table style='table-layout: fixed; width: 100%;'>";
								var files=JSON.parse(data);
								for(var n in files){
									if(files[n]['fn']!="empty")
										Content += "<tr>";
									else
										Content += "<tr style='display:none;'>";
									Content += "<td style='width:5%;'><a href='#' onclick='ShowLink(\""+context+"\","+n+");' >@</a></td>";
									Content += "<td style='width:65%;word-wrap:break-word;'>"+files[n]['fn']+"</td>";
									Content += "<td  style='width:25%;text-align:right;'>"+(files[n]['fs']/1024).toFixed(2)+" __("KB")</td>";
									Content += "<td style='width:5%;'><a href='#'  onclick='DelFile(\""+context+"\","+n+");'>x</a></td>";
									Content += "</tr>";
									
								};
								Content += "</table>";
								//Content += "<button	type='button' name='Upload' value='' id='Restart' class='Button'>Upload Another</button>";
								$('.DirectoryArea'+P).html(Content);
								break;
		case 'DirW':
								var Content = "<table style='table-layout: fixed; width: 338px;'>";
								var files=JSON.parse(data);
								for(var n in files){
									if(files[n]['fn']!="empty")
										Content += "<tr>";
									else
										Content += "<tr style='display:none;'>";
									Content += "<td style='width:5%;'><a href='#' onclick='ShowLinkW(\"th\", "+n+");' >@</a></td>";
									Content += "<td style='width:65%;word-wrap:break-word;'>"+files[n]['fn']+"</td>";
									Content += "<td  style='width:25%;text-align:right;'>"+(files[n]['fs']/1024).toFixed(2)+" __("KB")</td>";
									Content += "<td style='width:5%;'><a href='#'  onclick='DelFile(\"th\","+n+");'>x</a></td>";
									Content += "</tr>";
									
								};
								Content += "</table>";
								//Content += "<button	type='button' name='Upload' value='' id='Restart' class='Button'>Upload Another</button>";
								$('.DirectoryAreaW_P').html(Content);
								break;
		case 'Dir2Tab':
								var Content = "<table style='table-layout: fixed; width: 100%;'>";
								var files=JSON.parse(data);
								for(var n in files){
									if(files[n]['fn']!="empty")
										Content += "<tr>";
									else
										Content += "<tr style='display:none;'>";
									Content += "<td style='width:5%;'><a href='#' onclick='ShowLink2Tab(\""+context+"\","+n+");' >@</a></td>";
									Content += "<td style='width:65%;word-wrap:break-word;'>"+files[n]['fn']+"</td>";
									Content += "<td  style='width:25%;text-align:right;'>"+(files[n]['fs']/1024).toFixed(2)+" __("KB")</td>";
									Content += "<td style='width:5%;'><a href='#'  onclick='DelFile(\""+context+"\","+n+");'>x</a></td>";
									Content += "</tr>";
									
								};
								Content += "</table>";
								$('.DirectoryArea2Tab'+P).html(Content);
								break;
		case 'DirNewPost':
								var Content = "<table style='table-layout: fixed; width: 100%;'>";
								var files=JSON.parse(data);
								for(var n in files){
									if(files[n]['fn']!="empty")
										Content += "<tr>";
									else
										Content += "<tr style='display:none;'>";
									Content += "<td style='width:5%;'><a href='#' onclick='ShowLinkNewPost(\""+context+"\","+n+");' >@</a></td>";
									Content += "<td style='width:65%;word-wrap:break-word;'>"+files[n]['fn']+"</td>";
									Content += "<td  style='width:25%;text-align:right;'>"+(files[n]['fs']/1024).toFixed(2)+" __("KB")</td>";
									Content += "<td style='width:5%;'><a href='#'  onclick='DelFile(\""+context+"\","+n+");'>x</a></td>";
									Content += "</tr>";
								};
								Content += "</table>";
								$('.DirectoryAreaNewPost').html(Content);
								break;
		case 'Link':
								var curdest=null;
								var curi=-1;
								var link="["+data+"]";
								if(context=="th"){
									for(var i in ChatPeers_P.models){if(ChatPeers_P.models[i].attributes.active==1){curi=i;curdest=ChatPeers_P.models[i].attributes.destination;};};
									ChatPeers_P.models[curi].attributes.msgs.add({nick:"Me",txt:link});  
									ChatPeers_P.models[curi].set({lastts:Date.now()}); 
									ChatPeersList_P.render();
									//$("#close_PickFile_P").click();
								}
								else
								{
									for(var i in ChatPeers.models){if(ChatPeers.models[i].attributes.active==1){curi=i;curdest=ChatPeers.models[i].attributes.destination;};};
									ChatPeers.models[curi].attributes.msgs.add({nick:"Me",txt:link});  
									ChatPeers.models[curi].set({lastts:Date.now()}); 
									ChatPeersList.render();
								}
								sendCmd(context, "sendchatmsg", {destination:curdest,txt:link});
								break;
		case 'LinkW':
								var curdest=null;
								var curi=-1;
								for(var i in ChatPeers_P.models){if(ChatPeers_P.models[i].attributes.active==1){curi=i;curdest=ChatPeers_P.models[i].attributes.destination;};};
								var link="["+data+"]";
								sendCmd("th", "sendchatmsg", {destination:curdest,txt:link});
								ChatPeers_P.models[curi].attributes.msgs.add({nick:"Me",txt:link});  
								ChatPeers_P.models[curi].set({lastts:Date.now()}); 
								ChatPeersList_P.render();
								//$("#close_editPost_P").click();
								$("#close_PickFile_P").click();
								break;
		case 'Link2Tab':
								$(".link2file"+P).html("__("link2download") [dl]("+data+")<br><br>__("insertasimage") ![img]("+data+")");
								break;
		case 'Link2TabImg':
								//$(".link2file_P").html("<a href="+data+">Скопируйте назначение ссылки и вставьте в Пост</a>");
								break;
		case 'LinkNewPost':
								var link="["+data+"]";
								console.log(link);
								$("#new_post_text"+P).val($("#new_post_text"+P).val()+" "+link+" ");
								break;
		case 'need_new_profile':
								$("#MyProfileH").click();
								$('#infoModal .txt').html("Необходимо заполнить Ваш профиль! Без него никак. Сделайте это прямо сейчас!");
								$('#infoModal').foundation('reveal', 'open');
								break;
		case 'is_running':
								if(!data.th && !data.i2p){
									var h="<div style='width:100%;text-align:center;'>__("profilesnotstarted")<br><br><b class='red'>__("profilesstartwarn")<br><br> </div>";
									h+="<button class='small secondary button' style='float:left'>__("starti2p")</button>&nbsp;";
									h+="<button class='small secondary button' style='float:right' >__("startth")</button>";
									$('#infoModal .txt').html(h);
								}
								break;
		/*case 'is_running':
											if(!data.state && !data.th_state){
												var h="<div style='width:100%;text-align:center;'>Ваши анонимный и публичный профили<br>в настоящий момент не запущены.<br><br><b class='red'>НЕ ЗАПУСКАЙТЕ ИХ ОДНОВРЕМЕННО!!!</b> -<br> это очень опасно...<br><br>Идеально - с разницей в несколько часов.<br><br> </div>";
												h+="<button class='small secondary button' style='float:left' onclick='sendCmd(\"run\",{});$(\"#infoModal\").foundation(\"reveal\", \"close\");RemoveStartLink();'>Запустить Анонимный профиль</button>&nbsp;";
												h+="<button class='small secondary button' style='float:right' onclick='sendCmd("th", \"run\",{});$(\"#infoModal\").foundation(\"reveal\", \"close\");RemoveStartLink_P();'>Запустить Публичный профиль</button>";
												$('#infoModal .txt').html(h);
												$('#infoModal').foundation('reveal', 'open');
												AddStartLink();AddStartLink_P();
											}
											else if(!data.state && data.th_state)
											{
												AddStartLink();
											}
											else if(data.state && !data.th_state)
											{
												AddStartLink_P();
											};*/
					
		case 'qweqweqwe':		console.log(data);
								my_profile.set(data.msg);
								//$('#infoModal').foundation('reveal', 'close');
								break;
		default: console.log("unknown cmd");console.log(data);
								break;
		
	};
};
			
			
			
			
			
			
///////////////////////////////////////////////////////////////////
function sendCmd(context,cmd, data)
{
	console.log(cmd);
	console.log(data);
	var req={};
	req.cmd=cmd;
	req.data=data;
	if(context=="i2p")	socket.emit("cmd", req);
	else 				socket_P.emit("cmd", req);
};
function PostThis(context,txt)
{
	var req={};
	req.data=txt;
	req.nick=(context=="th")?(my_profile_P.get('nick')):(my_profile.get('nick'));
	var ts=new Date();
	req.ts=ts;
	req.lts=Date.now();
	sendCmd(context, "addpost",req);
};
function NewComment(context, id,destination,txt)
{
	console.log(id,destination);
	var req={};
	req.data=txt;
	req.nick=(context=="th")?(my_profile_P.get('nick')):(my_profile.get('nick'));
	var ts=new Date();
	req.ts=ts;
	req.lts=Date.now();
	req.pid=id;
	req.destination=destination;
	sendCmd(context, "sendcomment",req);
};
function NewComment2mypost(context,id,txt)
{
	console.log(id);
	var req={};
	req.data=txt;
	req.nick=(context=="th")?(my_profile_P.get('nick')):(my_profile.get('nick'));
	var ts=new Date();
	req.ts=ts;
	req.lts=Date.now();
	req.pid=id;
	sendCmd(context, "addcomment2mypost",req);
};
function DelComment2mypost(context,pid,lts)
{
	console.log(pid,lts);
	var req={};
	req.pid=pid;
	req.lts=lts;
	sendCmd(context, "delcomment2mypost",req);
};


function NewCommentweb_P(id,destination,txt)
{
	console.log(id,destination);
	var req={};
	//req.cmd="sendcommentweb";
	req.data=txt;
	req.nick=my_profile_P.get('nick');
	var ts=new Date();
	req.ts=ts;
	req.lts=Date.now();
	req.pid=id;
	req.destination=destination;
	sendCmd("th", "sendcommentweb",req);
};
function NewComment2mywebpost_P(id,txt)
{
	console.log(id);
	var req={};
	req.cmd="addcomment2mywebpost";
	req.data=txt;
	req.nick=my_profile_P.get('nick');
	var ts=new Date();
	req.ts=ts;
	req.lts=Date.now();
	req.pid=id;
	sendCmd("th", "addcomment2mywebpost",req);
};
function DelComment2mywebpost_P(pid,lts)
{
	console.log(pid,lts);
	var req={};
	//req.cmd="delcomment2mywebpost";
	req.pid=pid;
	req.lts=lts;
	sendCmd("th", "delcomment2mywebpost",req);
};
	
	
	
	
	
	
	
function PostUpd(context,id,txt)
{
	var P=(context=="th")?"_P":"";
	var req={};
	req.id=id;
	req.data=txt;
	req.nick=(context=="th")?(my_profile_P.get('nick')):(my_profile.get('nick'));
	var ts=new Date();
	req.ts=ts;
	req.lts=Date.now();
	sendCmd(context, "updatepost",req);
};
	
function updateProfile(context)
{
	var P=(context=="th")?"_P":"";
	var req={};
	req.nick=$('#nick'+P).val();
	req.desc=$('#desc'+P).val();
	req.mail=$('#mail'+P).val();
	sendCmd(context, "UpdateProfile",req);
};
	
	
function UpdateConfig()
{
	var req={};
	req.cnctondem = $("#SettingsTab input:radio[name ='cnctondem']:checked").val();
	req.maxoutcncts = $("#SettingsTab #maxoutcncts").val();
	req.autofetch = $("#SettingsTab input:radio[name ='autofetch']:checked").val();
	req.maxautofetch = $("#SettingsTab #maxautofetch").val();
	req.maxlastestposts = $("#SettingsTab #maxlastestposts").val();
	req.maxincncts = $("#SettingsTab #maxincncts").val();
	req.maxknowns = $("#SettingsTab #maxknowns").val();
	console.log(req);						
	//socket.emit('UpdateConfig', req);
	sendCmd("i2p", "UpdateConfig",req);
};
function UpdateConfig_P()
{
	var req={};
	req.cnctondem = $("#SettingsTab_P input:radio[name ='cnctondem_P']:checked").val();
	req.maxoutcncts = $("#SettingsTab_P #maxoutcncts_P").val();
	req.autofetch = $("#SettingsTab_P input:radio[name ='autofetch_P']:checked").val();
	req.maxautofetch = $("#SettingsTab_P #maxautofetch_P").val();
	req.maxlastestposts = $("#SettingsTab_P #maxlastestposts_P").val();
	req.maxincncts = $("#SettingsTab_P #maxincncts_P").val();
	req.maxknowns = $("#SettingsTab_P #maxknowns_P").val();
	console.log(req);						
	sendCmd("th", "UpdateConfig",req);
};
	
	
	
	
	
function FileChosen(evnt) {
	SelectedFile = evnt.target.files[0];
	document.getElementById('NameBox').value = SelectedFile.name;
}
function FileChosenNewPost(evnt) {
    SelectedFile = evnt.target.files[0];
	document.getElementById('NameBoxNewPost').value = SelectedFile.name;
}
function FileChosen_P(evnt) {
    SelectedFile_P = evnt.target.files[0];
	document.getElementById('NameBox_P').value = SelectedFile_P.name;
}
function FileChosenW_P(evnt) {
    SelectedFile_P = evnt.target.files[0];
	document.getElementById('NameBoxW_P').value = SelectedFile_P.name;
}

	
function StartUpload(){
	var filename=document.getElementById('NameBox').value;
	if(filename.length >= 3 && filename.length <= 20 && onlylatnum.test(filename))
	{
		FReader = new FileReader();
		Name = document.getElementById('NameBox').value;
		var Content = "<span id='NameArea'>__("uploading") " + SelectedFile.name + " __("as") " + Name + "</span>";
		Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">50%</span>';
		Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "__("MB")</span>";
		document.getElementById('UploadArea').innerHTML = Content;
		FReader.onload = function(evnt){
			sendCmd("i2p", 'Upload', { 'Name' : Name, Data : evnt.target.result });
		}
		sendCmd("i2p", 'Start', { 'Name' : Name, 'Size' : SelectedFile.size });
	}
	else if(filename.length < 3) 
	{
		alert("__("need2selectfile") ");
	}
	else if(filename.length > 20) 
	{
		alert("__("toolongfilename") ");
	}
	else if(!onlylatnum.test(filename)) 
	{
		alert("__("need2checklatnum")");
	}
}
function StartUpload_P(){
	var filename=document.getElementById('NameBox_P').value;
	if(filename.length >= 3 && filename.length <= 20 && onlylatnum.test(filename))
	{
		FReader_P = new FileReader();
		Name_P = document.getElementById('NameBox_P').value;
		var Content = "<span id='NameArea_P'>__("uploading") " + SelectedFile_P.name + " __("as") " + Name_P + "</span>";
		Content += '<div id="ProgressContainer_P"><div id="ProgressBar_P"></div></div><span id="percent_P">50%</span>';
		Content += "<span id='Uploaded_P'> - <span id='MB_P'>0</span>/" + Math.round(SelectedFile_P.size / 1048576) + "__("MB")</span>";
		document.getElementById('UploadArea_P').innerHTML = Content;
		FReader_P.onload = function(evnt){
			sendCmd("th", 'Upload', { 'Name' : Name_P, Data : evnt.target.result });
		}
		sendCmd("th", 'Start', { 'Name' : Name_P, 'Size' : SelectedFile_P.size });
	}
	else if(filename.length < 3) 
	{
		alert("__("need2selectfile") ");
	}
	else if(filename.length > 20) 
	{
		alert("__("toolongfilename") ");
	}
	else if(!onlylatnum.test(filename)) 
	{
		alert("__("need2checklatnum")");
	}
}
/*
function StartUploadW_P(){
	var filename=document.getElementById('NameBoxW_P').value;
	if(filename.length >= 3 && filename.length <= 20 && onlylatnum.test(filename))
	{
		FReader_P = new FileReader();
		Name_P = document.getElementById('NameBoxW_P').value;
		var Content = "<span id='NameAreaW_P'>Загрузка " + SelectedFile_P.name + " как " + Name_P + "</span>";
		Content += '<div id="ProgressContainer_P"><div id="ProgressBar_P"></div></div><span id="percent_P">50%</span>';
		Content += "<span id='Uploaded_P'> - <span id='MB_P'>0</span>/" + Math.round(SelectedFile_P.size / 1048576) + "MB</span>";
		document.getElementById('UploadAreaW_P').innerHTML = Content;
		FReader_P.onload = function(evnt){
			sendCmd("th", 'Upload', { 'Name' : Name_P, Data : evnt.target.result });
		}
		sendCmd("th", 'Start', { 'Name' : Name_P, 'Size' : SelectedFile_P.size });
	}
	else if(filename.length < 3) 
	{
		alert("Необходимо выбрать файл ");
	}
	else if(filename.length > 20) 
	{
		alert("Такое длинное имя файла может вызвать проблемы у пользователей Windows... Можете укоротить? ");
	}
	else if(!onlylatnum.test(filename)) 
	{
		alert("Необходимо проверить, чтобы в имени файла были только цифры и латинские символы.");
	}
}
*/	
function RefreshDirectory(){			sendCmd("i2p", 'Dir', {})	};
function RefreshDirectory2Tab(){		sendCmd("i2p", 'Dir2Tab', {})	};
function RefreshDirectoryNewPost(){		sendCmd("i2p", 'DirNewPost', {})	};
function RefreshDirectory_P(){			sendCmd("th", 'Dir', {})	};
function RefreshDirectoryW_P(){			sendCmd("th", 'DirW', {})	};
function RefreshDirectory2Tab_P(){		sendCmd("th", 'Dir2Tab', {})	};
function RefreshDirectoryNewPost_P(){	sendCmd("th", 'DirNewPost', {})	};
function ShowLink(context, n){			sendCmd(context, 'GetLink', n);	};
function ShowLink2Tab(context, n){		sendCmd(context, 'GetLink2Tab', n);	};
function ShowLinkNewPost(context, n){	sendCmd(context, 'GetLinkNewPost', n);	};
function DelFile(context, n){			sendCmd(context, 'DelFile', n);	};
	
	
	
function UpdateBar(context, percent){
	var P=(context=="th")?"_P":"";
	$('#ProgressBar'+P).css("width", percent + '%');
	$('#percent'+P).html( (Math.round(percent*100)/100) + '%');
	var MBDone = (context=="i2p")? (Math.round(((percent/100.0) * SelectedFile.size) / 1048576)) : (Math.round(((percent/100.0) * SelectedFile_P.size) / 1048576));
	$('#MB'+P).html = MBDone;
}
function UpdateBar2(percent,fn){
	$("#drop"+fn+" .meter").css("width" , percent + "%");
	$("#drop"+fn+" #percent").html((Math.round(percent*100)/100) + "%");
	//var MBDone = Math.round(((percent/100.0) * SelectedFile.size) / 1048576);
	//document.getElementById('MB').innerHTML = MBDone;
}

	
	
/*function Refresh(){
	location.reload(true);
}*/	
	

var stopBind=true;       
function UpdateBackToTop()
{
	if(!stopBind)
	{
		if($("#main-section").scrollTop()>=10/*170*/)
		{
			stopBind=true;
			$('.backtotop').css('display','block');
		};
		
	}
	else
	{
		if($("#main-section").scrollTop()<10/*170*/ && stopBind)
		{
			stopBind=false;
			$('.backtotop').css('display','none');
		};
		
	}
}
var stopBind_P=true;       
function UpdateBackToTop_P()
{
	if(!stopBind_P)
	{
		if($("#main-section_P").scrollTop()>=10/*170*/)
		{
			stopBind_P=true;
			$('.backtotop_P').css('display','block');
		};
		
	}
	else
	{
		if($("#main-section_P").scrollTop()<10/*170*/ && stopBind_P)
		{
			stopBind_P=false;
			$('.backtotop_P').css('display','none');
		};
		
	}
}





function DownloadFromPeer(context, link){
	var parts=link.split('@');
	var destination=parts[1];
	var fn=parts[0];
	sendCmd(context,"dl", {destination:destination,fn:fn});
};
function ShowDownloadProgress(fnwoext){
	$('#infoModal .txt').html("<div id='drop"+fnwoext+"' style='display:innline-block;float:right;width:200px;height:20px;'><div id='percent' style='display: inline-block;position:relative;right:0%;bottom:3px;width:50px;'>0%</div><div class='progress small-9 secondary round' style='display: inline-flex;'> <div class='meter' style='width: 0%'></div>    </div></div>");
	$('#infoModal').foundation('reveal', 'open');
};





function GetCurFilterPeers(context)
{
	var P=(context=="th")?"_P":"";
	return ($("#PeersFilter"+P+" > dd.active").attr("id"));
};
function FilterPeers(context,e,el,arg)
{
	e.preventDefault();
	var P=(context=="th")?"_P":"";
	//e.stopImmediatePropagation();
	$("#PeersFilter"+P+" > dd").removeClass("active");
	$(el).parent().addClass("active");
	console.log(arg+" "+$("#Known"+P+"-list li > span."+arg+"1").length);
	
	if(arg=="all")	$("#Known"+P+"-list li > span").fadeIn('slow');
	else {
		if($("#Known"+P+"-list li > span."+arg+"1").length>0){
			$("#Known"+P+"-list li > span").fadeOut("fast");
			$("#Known"+P+"-list li > span."+GetCurFilterPeers(context)+"1").fadeIn("slow");
		}
		else
		{
			$("#Known"+P+"-list li > span").css("display","none");
		};
	};
};
function ShowFilteredPeers(context,arg){//////////////????????????????????????
	var P=(context=="th")?"_P":"";
	setTimeout(function(){console.log(arg);$("#Known"+P+"-list li > span."+arg).fadeIn("slow");},500);
}





function SearchKnownPeer(arg)
{
	console.log("SearchKnownPeer(arg)");
	$("#Known-list li > span").fadeOut("fast","linear");
	console.log(arg);
	if(arg)
	{
		for(var i in Knowns.models)
		{
			console.log(Knowns.models[i]);
			if(	Knowns.models[i].attributes.nick.indexOf(arg)>=0 ||
				Knowns.models[i].attributes.desc.indexOf(arg)>=0 ||
				Knowns.models[i].attributes.mail.indexOf(arg)>=0 
			)
			{
				console.log(Knowns.models[i].attributes);
				$("#Known-list li > span."+Knowns.models[i].attributes.cid).fadeIn("slow");
			};
		};
	};
};
function SearchKnownPeer_P(arg)
{
	console.log("SearchKnownPeer_P(arg)");
	$("#Known_P-list li > span").fadeOut("fast","linear");
	console.log(arg);
	if(arg)
	{
		for(var i in Knowns_P.models)
		{
			console.log(Knowns_P.models[i]);
			if(	Knowns_P.models[i].attributes.nick.indexOf(arg)>=0 ||
				Knowns_P.models[i].attributes.desc.indexOf(arg)>=0 ||
				Knowns_P.models[i].attributes.mail.indexOf(arg)>=0 
			)
			{
				console.log(Knowns_P.models[i].attributes);
				$("#Known_P-list li > span."+Knowns_P.models[i].attributes.cid).fadeIn("slow");
			};
		};
	};
};
	
