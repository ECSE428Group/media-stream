//THIS IS AN INTIAL COMMIT AND INTEGRATION OF LIVE TRANSCODING/COMMENTED OUT CODE, ETC, WILL BE REMOVED

var fibers = __meteor_bootstrap__.require("fibers");
var connect = __meteor_bootstrap__.require('connect');
var app = __meteor_bootstrap__.app;
var childProcess = __meteor_bootstrap__.require('child_process');
var http = __meteor_bootstrap__.require('http');
var url = __meteor_bootstrap__.require('url');
var fs = __meteor_bootstrap__.require('fs');
var path = __meteor_bootstrap__.require('path');

var router = connect.middleware.router(function(route) {
route.get(/^\/hls\/$/, function(request, response) {
	var urlParsed = url.parse(request.url, true);
	var file = urlParsed.query['file'];
	handlePlaylistRequest(file, response);
});
});
app.use(router);



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
var outputPath = './cache';
var transcoderPath = '/usr/local/bin/ffmpeg'; //default install location of ffmpeg through homebrew, need to change to support windows
var transcoderType = 'ffmpeg'; //only supporting ffmpeg
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

// Program state
var encoderProcesses = {};
var currentFile = null;
var lock = false;


var getMimeType = function(file) {
	var extname = path.extname(file);

	if (mimeTypes[extname]) return mimeTypes[extname];
	else return 'application/octet-stream';
}

var spawnNewProcess = function(file, playlistPath) {
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

	var tryOpenFile = function() {
		if (numTries > 20) {
			console.log('Gave up trying to open m3u8 file');
			response.writeHead(500);
			response.end();
		}
		else {
			fs.readFile(playlistPath, function (err, data) {
				if (err || data.length === 0) {
					numTries++;
					setTimeout(tryOpenFile, 500);
				}
				else {
					if (!debug) {
						response.setHeader('Content-Type', 'application/x-mpegURL');
					}
					//console.log('response: ' + data);
					response.write(data);
					response.end();
				}
			});
		}
	};

	tryOpenFile();
}

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


var handleThumbnailRequest = function(file, response) {
	if (!enableThumbnails) {
		response.setHeader('Content-Type', 'image/jpeg');
		response.end();
		return;
	}

	file = path.join('/', file);
	var fsPath = path.join(rootPath, file);

	var args = ['-ss', '00:00:10', '-i', fsPath, '-vf', 'scale=iw/2:-1,crop=iw:iw/2', '-f', 'image2pipe', '-vframes', '1', '-'];

	var child = childProcess.spawn(transcoderPath, args, {cwd: outputPath});

	if (debug) {
		child.stderr.on('data', function(data) {
			console.log(data.toString());
		});
	}
	response.setHeader('Content-Type', 'image/jpeg');
	child.stdout.pipe(response);

	child.on('exit', function(code) {
		response.end();
	});

	setTimeout(function() {
		child.kill('SIGKILL');
	}, 4000);
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

//NOT USING EXPRESS
// var app = express();
// app.use(express.bodyParser());


// app.get(/^\/hls\/$/, function(request, response) {
// 	var urlParsed = url.parse(request.url, true);
// 	var file = urlParsed.query['file'];
// 	handlePlaylistRequest(file, response);
// });

// app.get(/^\/hls\//, function(request, response) {
// 	var urlParsed = url.parse(request.url, true);
// 	var file = path.relative('/hls/', decodeURIComponent(urlParsed.pathname));
// 	handleStaticFileRequest(outputPath, file, response);
// });

// app.get(/^\/thumbnail\//, function(request, response) {
// 	var urlParsed = url.parse(request.url, true);
// 	var file = path.relative('/thumbnail/', decodeURIComponent(urlParsed.pathname));
// 	handleThumbnailRequest(file, response);
// });


// app.post(/^\/settings/, function(request, response) {
// 	console.log(request.body);

// 	var newBitrate = request.body.videoBitrate;
// 	if (newBitrate) {
// 		videoBitrate = parseInt(newBitrate);
// 	}
// 	if (request.body.enableThumbnails != null) {
// 		enableThumbnails = request.body.enableThumbnails === 'true' ? true : false;
// 		console.log('enableThumbnails ' + enableThumbnails);
// 	}

// 	response.end();
// });

// app.get(/^\/settings/, function(request, response) {
// 	response.setHeader('Content-Type', 'application/json');
// 	response.write(JSON.stringify({
// 		'videoBitrate': videoBitrate,
// 		'thumbnails': enableThumbnails,
// 	}));
// 	response.end();
// });

// app.listen(listenPort);

