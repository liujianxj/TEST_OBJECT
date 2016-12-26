'use strict';


function WaveObj(divId, src) {
	var wave = Object.create(WaveSurfer);
	var options = {
		container:document.querySelector(divId),
		waveColor:'violet',
		progressColor:'purple',
		cursorColor:'navy'
	};

	wave.init(options);
	wave.load(src);

	this.wave = wave;
	this.onReady = function() {
	}
	this.onError = function(err) {
		console.error(err);
	}
	this.onFinish = function(err) {
		console.log('Finished');
	}

	wave.on('ready', this.onReady);
	wave.on('error', this.onError);
	wave.on('finish', this.onFinish);
}

var waveObj;

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
	waveObj = new WaveObj('#waveform', 'example/media/demo.wav'); 
});

function DumpObject(obj) {
	for (var p in obj) {
		if (p.type != 'function') {
			var v = obj[p];
			console.log(p + '=' + v);
		}
	}
}

function onFileSelect(evt) {
	console.log('inside onFileSelect');
	var files = evt.target.files;
	var output = [];
	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		console.log('name:' + f.name);
		console.log('size:' + f.size);
		DumpObject(f);
		waveObj.wave.loadBlob(f);
		
	}
}
function errorHandler(e) {
	var getMsg = function(code) {
		switch(code) {
			case FileError.QUOTA_EXCEEDED_ERR:
				return 'quota_exceeded';
			case FileError.NOT_FOUND_ERR:
				return 'not found';
			case FileError.SECURITY_ERR:
				return 'security';
			case FileError.INVALID_MODIFICATION_ERR:
				return 'invalid modification';
			default:
				return 'unknown';
		}
	}
	console.log('Error:' + getMsg(e.code));
}

function downloadFile(url, success) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'blob';
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (success) success(xhr.response);
		}
	};
	xhr.send(null);
}


window.requestFileSystem = window.requestFileSystem ||
			   window.webkitRequestFileSystem ||
			   window.mozRequestFileSystem;
window.storageInfo = window.storageInfo||
			window.webkitStorageInfo||
			window.mozStorageInfo;


var fileSystem = null,
	fsType = PERSISTENT,
	fsSize = 10*1024*1024;

window.storageInfo.requestQuota(fsType,
		fsSize, 
		function(gb) 
		{
			console.log('inside requestQuota callback');

			window.requestFileSystem(fsType, gb, 
				function(fs) {
					console.log('requestFileSystem ' + fs);
					fileSystem = fs;
				}, 
			errorHandler);
		}, 
		errorHandler);


function saveFile(data, path) {
	if (!fileSystem)  {
		console.log('fileSystem is null');
		return;
	}

	fileSystem.root.getFile(path,
		{create:true},
		function(fileEntry) {
			fileEntry.createWriter(
				function(writer) {
					writer.write(data);
					showImage();
				},
				errorHandler);
		},errorHandler);
	console.log('save file to ' + path + ' OK');
}

function readFile(path, success) {
	if (!fileSystem) {
		console.error('fileSystem is null');
		return;
	}
	console.log('inside readFile ' + path);

	fileSystem.root.getFile(path, {}, function(fileEntry) {
		fileEntry.file(function(file){
			var reader  = new FileReader();
			reader.onloadend = function(e) {
					if(success) success(this.result);
				};
			reader.readAsDataURL(file);
				
			},
			
		errorHandler);
	},errorHandler);
}

document.getElementById('wavefile').addEventListener('change', onFileSelect,false);

downloadFile('1.jpg', 
	function(blob) {
		saveFile(blob, '1.jpg');
	}
);

var showImage = function() {
	readFile('1.jpg', 
		function(result) {
			console.log('inside readFile callback');
			var img = new Image();
			img.src = result;
			var holder = document.getElementById('holder');
			holder.innerHTML = '';
			holder.appendChild(img);
		}
	);
}
	
