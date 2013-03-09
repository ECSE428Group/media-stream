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
//var ffmpeg = require('fluent-ffmpeg');


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


var getMimeType = function(file) {
	var extname = path.extname(file);

	if (mimeTypes[extname]) return mimeTypes[extname];
	else return 'application/octet-stream';
}

var spawnNewProcess = function(file, playlistPath, outputPath, callback) {
	var outputUrlPrefix = '/segment/';
	var args = ['-i', file, '-async', '1', '-acodec', 'libmp3lame', '-b:a', 128 + 'k', '-vf', 'scale=min(' + targetWidth + '\\, iw):-1', '-b:v', videoBitrate + 'k', '-ar', '44100', '-ac', '2', '-vcodec', 'libx264', '-x264opts', 'level=3.0', '-profile:v', 'baseline', '-preset:v' ,'superfast', '-threads', '0', '-flags', '-global_header', '-map', '0', '-f', 'segment', '-segment_time', '10', '-segment_list', 'stream.m3u8', '-segment_format', 'mpegts', '-segment_list_flags', 'live', 'stream%05d.ts'];

	var encoderChild = childProcess.spawn(transcoderPath, args, {cwd: outputPath});

	console.log(transcoderPath + args);

	encoderProcesses[file] = encoderChild;
	currentFile = file;

	console.log('Spawned transcoder instance');

	if (debug) {
		encoderChild.stderr.on('data', function(data) {
			console.log(data.toString());
			callback();
		});
	}

	encoderChild.on('exit', function(code) {
		console.log('Transcoder exited with code ' + code);

		delete encoderProcesses[file];
		callback();
	});

	// Kill any "zombie" processes
	setTimeout(function() {
		if (encoderProcesses[file]) {
			console.log('Killing long running process');

			killProcess(encoderProcesses[file]);
		}
	}, processCleanupTimeout);

	callback();
};
var pollForPlaylist = function(file, callback) {
	var numTries = 0;
	console.log("IN POLL FOR PLAYLIST");

	var tryOpenFile = function() {
		if (numTries > 500) {
			// console.log('Gave up trying to open m3u8 file');
			// response.writeHead(500);
			// response.end();
		}
		else {
			console.log("IN ELSE");
			console.log("PlaylistPath", playlistPath);
			fs.readFile(playlistPath, function (err, data) {
				console.log("Trying to read file");
				if (err || data.length === 0 ){
					numTries++;
					// setTimeout(tryOpenFile, 500);
					console.log("ERROR, number of tries", numTries);
					console.log(err);
					console.log(data);
					tryOpenFile();
				}
				else {
					if (!debug) {
						response.setHeader('Content-Type', 'application/x-mpegURL');
					}
					console.log('response: ' + data);
					callback(data);
				}
			});
		}
	};
	console.log("Try open");
	tryOpenFile();
};

var killProcess = function(processToKill, callback) {
	processToKill.kill();

	setTimeout(function() {
		processToKill.kill('SIGKILL');
	}, 5000);

	processToKill.on('exit', function(code) {
		if (callback) callback();
	});
}

var handlePlaylistRequest = function(file, callback) {
	// console.log("in handle request");
	// if (!file) {
	// 	response.writeHead(400);
	// 	response.end();
	// }

	if (lock) {
		console.log('Ongoing spawn process not finished, denying request');
		return;
	}

	file = path.join('/', file); // Remove ".." etc
	file = path.join(rootPath, file);

	if (currentFile != file) {
		lock = true;

		console.log('New file to encode chosen');

		// Make sure old one gets killed
		if (encoderProcesses[currentFile]) {
			killProcess(encoderProcesses[currentFile], function() {
				fs.unlink(playlistPath, function (err) {
					spawnNewProcess(file, playlistPath, outputPath, function(){
						console.log("callback fin");
				//			request.resume();
								});
						// pollForPlaylist(file, response, function(data){
						// 	callback(data);
						// });
					lock = false;
				});
			});
		}
		else {
			fs.unlink(playlistPath, function (err) {
				spawnNewProcess(file, playlistPath, outputPath, function(){
					console.log("callback fin");
					// request.resume();
				});
					// pollForPlaylist(file, response, function(data){
					// 	callback(data);
					// });
				lock = false;
			});
		}
	}
	else {
		console.log('We are already encoding this file');
		// pollForPlaylist(file, response, function(data){
		// 	callback(data);
		// });
	}
};

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
	var proc = new ffmpeg({ source: rootfile_old, priority: 10 })
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
	var proc = new ffmpeg({ source: rootfile_old, priority: 10 })
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
