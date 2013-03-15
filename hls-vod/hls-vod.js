//This module is borrowed and modified from mifi/hls-vod on github.com

var childProcess = require('child_process');
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');

// 3rd party
var express = require('express');

// Parameters
var listenPort = 3000;
var videoBitrate = 1000;
var enableThumbnails = true;
var audioBitrate = 128;
var targetWidth = 1280;
var searchPaths = [];
var rootPath = null;
var outputPath = './cache';
var transcoderPath = '/usr/local/bin/ffmpeg';
var transcoderType = 'ffmpeg';
var processCleanupTimeout = 6 * 60 * 60 * 1000;

var debug = true;


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

var media_server = { "audio" : [] , "video" : [], "picture" : []};

function getVideoFiles(){
var contents = fs.readdirSync(rootPath);

    for (var i = 0; i < contents.length; i++){
        var file = contents[i];
        if (isVideo(file)){
            media_server.video.push(file);
        }
    }
}

function isVideo(path)
{
	var supportedFiletypes = [ ".mp4", ".avi", ".mov", ".mkv", ".flv" ];
	for (var i = 0; i < supportedFiletypes.length; i++)
	{
		if (path.indexOf(supportedFiletypes[i]) != -1)
		{
			return true;
		}
	}
	return false;
}

// Program state
var encoderProcesses = {};
var currentFile = null;
var lock = false;

function silent_transcode() {

	var needTranscodingToMp4 = [];
	var needTranscodingToWebm = [];

	for(var i = 0; i < media_server.video.length; i++){
		var output = media_server.video[i].substr(0, media_server.video[i].lastIndexOf('.')) || media_server.video[i];
		var mp4file = path.join(rootPath, "/transcoded/"+output +".mp4");
		var webmfile = path.join(rootPath, "/transcoded/"+output +".webm");
		if(fs.existsSync(mp4file)){
			console.log(media_server.video[i] + "has a transcoded version already");
		}
		else if(media_server.video[i].substr(media_server.video[i].lastIndexOf('.')) == ".mp4"){
			console.log(media_server.video[i] + "doesn't need mp4 transcoding");
		}
		else{
			needTranscodingToMp4.push(media_server.video[i]);
		}
		if(fs.existsSync(webmfile)){
			console.log(media_server.video[i] + "has a webm transcoded version already");
		}
		else if(media_server.video[i].substr(media_server.video[i].lastIndexOf('.')) == ".webm"){
			console.log(media_server.video[i] + "doesn't need webm transcoding");
		}
		else{
			needTranscodingToWebm.push(media_server.video[i]);
		}
	}
	console.log("NEEDS MP4 TRANSCODING", needTranscodingToMp4);
	console.log("NEEDS WEBM TRANSCODING", needTranscodingToWebm);
	transcodeAllToMp4(needTranscodingToMp4, function(){
	});
	transcodeAllToWebM(needTranscodingToWebm, function(){
	});

}

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
	var proc = new ffmpeg({ source: rootfile_old, priority: 14, timeout: 300, })
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
	var proc = new ffmpeg({ source: rootfile_old, priority: 14, timeout: 300 })
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


var getMimeType = function(file) {
	var extname = path.extname(file);

	if (mimeTypes[extname]) return mimeTypes[extname];
	else return 'application/octet-stream';
}

var spawnNewProcess = function(file, playlistPath) {
	var outputUrlPrefix = '/segment/';

	
	if (transcoderType === 'ffmpeg') {
		//var args = ['-i', file, '-async', '1', '-b:a', 64 + 'k', '-vf', 'scale=min(' + targetWidth + '\\, iw):-1', '-b:v', videoBitrate + 'k', '-ar', '44100', '-ac', '2', '-vcodec', 'libx264', '-x264opts', 'level=3.0', '-profile:v', 'baseline', '-preset:v' ,'superfast', '-acodec', 'libaacplus', '-threads', '0', '-flags', '-global_header', '-map', '0', '-f', 'segment', '-segment_time', '10', '-segment_list', 'stream.m3u8', '-segment_format', 'mpegts', '-segment_list_flags', 'live', 'stream%05d.ts'];
		var args = ['-i', file, '-async', '1', '-acodec', 'libmp3lame', '-b:a', 128 + 'k', '-vf', 'scale=min(' + targetWidth + '\\, iw):-1', '-b:v', videoBitrate + 'k', '-ar', '44100', '-ac', '2', '-vcodec', 'libx264', '-x264opts', 'level=3.0', '-profile:v', 'baseline', '-preset:v' ,'superfast', '-threads', '0', '-flags', '-global_header', '-map', '0', '-f', 'segment', '-segment_time', '10', '-segment_list', 'stream.m3u8', '-segment_format', 'mpegts', '-segment_list_flags', 'live', 'stream%05d.ts'];
	}
	else {
		var playlistPath = 'stream.m3u8';
		var outputUrl = 'stream-#####.ts';
		var tsOutputPath = 'stream-#####.ts';
		var args = ['-I', 'dummy', file, 'vlc://quit', '--sout=#transcode{width=' + targetWidth + ',vcodec=h264,vb=' + videoBitrate + ',venc=x264{aud,profile=baseline,level=30,preset=superfast},acodec=mp3,ab=128,channels=2,audio-sync}:std{access=livehttp{seglen=10,delsegs=false,numsegs=0,index=' + playlistPath + ',index-url=' + outputUrl + '},mux=ts{use-key-frames},dst=' + tsOutputPath + '}'];
	}
	console.log(transcoderPath);
	console.log(outputPath);
	console.log(file);
	var encoderChild = childProcess.spawn(transcoderPath, args, {cwd: outputPath});

	console.log(transcoderPath +" "+ args);

	encoderProcesses[file] = encoderChild;
	currentFile = file;

	console.log('Spawned transcoder instance');

	if (debug) {
		encoderChild.stderr.on('data', function(data) {
			console.log(data.toString());
		});
	}

	encoderChild.on('exit', function(code) {
		console.log('Transcoder exited with code ' + code);

		delete encoderProcesses[file];
	});

	// Kill any "zombie" processes
	setTimeout(function() {
		if (encoderProcesses[file]) {
			console.log('Killing long running process');

			killProcess(encoderProcesses[file]);
		}
	}, processCleanupTimeout);
};

var pollForPlaylist = function(file, response, playlistPath) {
	var numTries = 0;
	console.log("IN POLL FOR PLAYLIST");

	var tryOpenFile = function() {
		if (numTries > 20) {
			console.log('Gave up trying to open m3u8 file');
			response.writeHead(500);
			response.end();
		}
		else {
			console.log("IN ELSE");
			fs.readFile(playlistPath, function (err, data) {
				console.log("Trying to read file");
				if (err || data.length === 0) {
					numTries++;
					setTimeout(tryOpenFile, 500);
					console.log("ERROR, number of tries", numTries);
				}
				else {
					if (!debug) {
						response.setHeader('Content-Type', 'application/x-mpegURL');
					}
					console.log('response: ' + data);
					response.write(data);
					response.end();
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

var handlePlaylistRequest = function(file, response) {	
	if (!file) {
		request.writeHead(400);
		request.end();
	}

	if (lock) {
		console.log('Ongoing spawn process not finished, denying request');
		response.writeHead(503);
		response.end();
		return;
	}

	file = path.join('/', file); // Remove ".." etc
	file = path.join(rootPath, file);
	var playlistPath = path.join(outputPath, '/stream.m3u8');

	if (currentFile != file) {
		lock = true;

		console.log('New file to encode chosen');

		// Make sure old one gets killed
		if (encoderProcesses[currentFile]) {
			killProcess(encoderProcesses[currentFile], function() {
				fs.unlink(playlistPath, function (err) {
					spawnNewProcess(file, playlistPath, outputPath);
					pollForPlaylist(file, response, playlistPath);
					lock = false;
				});
			});
		}
		else {
			fs.unlink(playlistPath, function (err) {
				spawnNewProcess(file, playlistPath, outputPath);
				pollForPlaylist(file, response, playlistPath);
				lock = false;
			});
		}
	}
	else {
		console.log('We are already encoding this file');
		pollForPlaylist(file, response, playlistPath);
	}
};


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


var exitWithUsage = function(argv) {
	console.log('Usage: ' + argv[0] + ' ' + argv[1]
		+ ' --root-path PATH'
		+ ' [--search-path PATH1 [--search-path PATH2 [...]]]'
		+ ' [--port PORT]'
		+ ' [--cache-dir PATH]'
		+ ' [--transcoder-path PATH]');
	process.exit();
}

for (var i=2; i<process.argv.length; i++) {
	switch (process.argv[i]) {
		case '--transcoder-path':
		if (process.argv.length <= i+1) {
			exitWithUsage(process.argv);
		}
		transcoderPath = process.argv[++i];
		break;

		case '--root-path':
		if (process.argv.length <= i+1) {
			exitWithUsage(process.argv);
		}
		rootPath = process.argv[++i];
		break;

		case '--search-path':
		if (process.argv.length <= i+1) {
			exitWithUsage(process.argv);
		}
		searchPaths.push(process.argv[++i]);
		break;

		case '--cache-dir':
		if (process.argv.length <= i+1) {
			exitWithUsage(process.argv);
		}
		outputPath = process.argv[++i];
		break;

		case '--port':
		if (process.argv.length <= i+1) {
			exitWithUsage(process.argv);
		}
		listenPort = parseInt(process.argv[++i]);
		break;

		case '--transcoder-type':
		if (process.argv.length <= i+1) {
			exitWithUsage(process.argv);
		}
		transcoderType = process.argv[++i];
		if (['vlc', 'ffmpeg'].indexOf(transcoderType) == -1) exitWithUsage(process.argv);
		break;

		default:
		console.log(process.argv[i]);
		exitWithUsage(process.argv);
		break;
	}
}

console.log(rootPath + ' ' + searchPaths);

if (!rootPath) {
	exitWithUsage(process.argv);
}

var app = express();
app.use(express.bodyParser());

app.all('*', function(request, response, next) {
	console.log(request.url);
	next();
});

app.get('^/static$', function(req, res) { res.redirect('/static/'); });
app.use('/static/', express.static(__dirname + '/static'));

app.get(/^\/hls\/$/, function(request, response) {
	var urlParsed = url.parse(request.url, true);
	var file = urlParsed.query['file'];
	handlePlaylistRequest(file, response);
});

app.get(/^\/hls\//, function(request, response) {
	var urlParsed = url.parse(request.url, true);
	var file = path.relative('/hls/', decodeURIComponent(urlParsed.pathname));
	handleStaticFileRequest(outputPath, file, response);
});

app.post(/^\/transcode\//, function(request, response) {
	getVideoFiles();
	silent_transcode();
});

app.listen(listenPort);
