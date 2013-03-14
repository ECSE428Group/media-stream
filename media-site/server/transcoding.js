//THIS IS AN INTIAL COMMIT AND INTEGRATION OF LIVE TRANSCODING/COMMENTED OUT CODE, ETC, WILL BE REMOVED

var require = __meteor_bootstrap__.require;
var fibers = __meteor_bootstrap__.require("fibers");
var connect = __meteor_bootstrap__.require('connect');
var app = __meteor_bootstrap__.app;
var childProcess = __meteor_bootstrap__.require('child_process');
var http = __meteor_bootstrap__.require('http');
var url = __meteor_bootstrap__.require('url');
var fs = require('fs');
var path = __meteor_bootstrap__.require('path');
var ffmpeg = require('fluent-ffmpeg');


// 3rd party
// var sanitize = require('validator').sanitize;
// var wrench = require('wrench');
// var express = require('express');

// Parameters
var listenPort = 3000;
var videoBitrate = 1000;
var enableThumbnails = true;
var audioBitrate = 128;
var targetWidth = 1280;
var searchPaths = [];
var basepath = (path.resolve('.'));
var rootPath = path.resolve(basepath + "/public");
var outputPath = path.resolve(basepath + "/public/cache");
var playlistPath = path.join(outputPath, '/stream.m3u8');
var transcoderPath = '/usr/local/bin/ffmpeg'; //default install location of ffmpeg through homebrew, need to change to support windows
var transcoderType = 'ffmpeg'; //only supporting ffmpeg
var processCleanupTimeout = 6 * 60 * 60 * 1000;
var newfile;
var debug = true;
var firefox = true;

var videoExtensions = ['.mp4', '.avi', '.mkv', '.wmv', '.asf', '.m4v', '.flv', '.mpg', '.mpeg', '.mov', '.vob'];
var audioExtensions = ['.mp3', '.aac', '.m4a'];

var mimeTypes = {
	'.mp4': 'video/mp4',
	'.avi': 'video/x-msvideo',
	'.mkv': 'video/x-matroska',
	'.wmv': 'video/x-ms-wmv',
	'.asf': 'video/x-ms-asf',
	'.m4v': 'video/x-m4v',
	'.flv': 'video/x-flv',
	'.mpg': 'video/mpeg',
	'.mov': 'video/quicktime',
	'.ts': 'video/MP2T'
};

// Program state
var encoderProcesses = {};
var currentFile = null;
var lock = false;


function transcodeAllToMp4(files){
	if (files.length === 0){return;}
	console.log("Files", files);
	var file = files.pop();
	console.log(file);
	console.log(files);
	dead_transcode_to_mp4(file,function(){
		console.log("In callback");
		if(files){
			transcodeAllToMp4(files);
		}
	} );
}

function transcodeAllToWebM(files){
	if (files.length === 0){return;}
	var file = files.pop();
	console.log(file);
	console.log(files);
	dead_transcode_to_webm(file,function(){
		console.log("In callback");
		if(files){
			transcodeAllToWebM(files);
		}
	} );
}

function dead_transcode_to_mp4(file, callback){
	file = path.join('/', file); // Remove ".." etc
	var rootfile_old = path.join(rootPath, file);
	var output = file.substr(0, file.lastIndexOf('.')) || file;
	newfile = path.join(rootPath, "/transcoded"+output +".mp4");
	console.log(rootfile_old);
	console.log(newfile);

	lock=true;
	try{
	var proc = new ffmpeg({ source: rootfile_old, priority: 14 })
	.toFormat('mp4')
	//.withVideoBitrate('1500k')
	.withVideoCodec('libx264')
	//.withSize('720x?')
	//.withAudioBitrate('128k')
	.withAudioCodec('libfaac')
	.saveToFile(newfile, function(stdout, stderr) {
		console.log('file has been converted succesfully');
		lock = false;
		console.log(stdout);
		console.log(stderr);
		callback();
	});
}catch(err){
	console.log(err);
}
}

function dead_transcode_to_webm(file, callback){
	file = path.join('/', file); // Remove ".." etc
	var rootfile_old = path.join(rootPath, file);
	var output = file.substr(0, file.lastIndexOf('.')) || file;
	newfile = path.join(rootPath, "/transcoded"+output +".webm");
	console.log(rootfile_old);
	console.log(newfile);

	lock=true;
	try{
	var proc = new ffmpeg({ source: rootfile_old, priority: 14 })
	.toFormat('webm')
	//.withVideoBitrate('1500k')
	//.withVideoCodec('libvpx')
	//.withSize('720x?')
	//.withAudioBitrate('128k')
	//.withAudioCodec('libvorbis')
	.saveToFile(newfile, function(stdout, stderr) {
		console.log('file has been converted succesfully');
		lock = false;
		console.log(stdout);
		console.log(stderr);
		callback();
	});}
	catch(err){
		console.log(err);
	}
}

var handleStaticFileRequest = function(insidePath, file, response) {
	file = path.join('/', file);
	var filePath = path.join(insidePath, file);

	var fileStream = fs.createReadStream(filePath);
	fileStream.on('error', function(err) {
		console.log(err);
		response.writeHead(404);
		response.end();
	});

	fileStream.on('open', function() {
		response.writeHead(200, {'Content-Type': getMimeType(filePath)});
	});

	fileStream.pipe(response);
};

var router = connect.middleware.router(function(route) {
	route.get(/^\/hls\/$/, function(request, response) {
		var urlParsed = url.parse(request.url, true);
		var file = urlParsed.query['file'];
		handlePlaylistRequest(file,request, response, function(data){
			response.setHeader('Content-Type', 'video/mp4');
			response.write(data);
			response.end();
		});
	});

	route.get(/^\/hls\//, function(request, response) {
		var urlParsed = url.parse(request.url, true);
		var file = path.relative('/hls/', decodeURIComponent(urlParsed.pathname));
		pollForPlaylist(file, function(data){
			console.log("preparing to write:",  data);
			response.setHeader('Content-Type', 'video/mp4');
			response.write(data);
			response.end();
		});
	});

});
app.use(router);
