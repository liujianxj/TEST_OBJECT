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
function convertArray(floatArr, int16Arr) {
	for (var i = 0; i < floatArr.length; i++) {
		int16Arr[i] = 65535*floatArr[i];
	}
}

function onUpload() {
	console.log('inside upload');

	var buf = waveObj.wave.backend.buffer;
	var data = buf.getChannelData(0);

	var data2 = new Int16Array(data.length);
	console.log('begin convert');
	convertArray(data, data2);

	var xhr = new XMLHttpRequest();
	var form = new FormData();
	form.append('head','hello' );
	var blob = new Blob(data2);
	form.append('data', blob);

	xhr.open('post', '/deal_upload.php', true);
	var bar = document.querySelector('progress');
	xhr.upload.onprogress = function(e) {
		//console.log(e.loaded/e.total + ' is complete');
		bar.value = (e.loaded/e.total) * 100;
		bar.textContent = bar.value;	
	};
	console.log('begin send');
	xhr.send(form);
}

document.getElementById('wavefile').addEventListener('change', onFileSelect,false);
document.getElementById('uploadbutton').addEventListener('click', onUpload,false);

