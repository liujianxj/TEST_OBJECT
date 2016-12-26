'use strict';

function floatTo16BitPCM(output, offset, input){
  for (var i = 0; i < input.length; i++, offset+=2){
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function writeString(view, offset, string){
  for (var i = 0; i < string.length; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(samples, sampleRate){
  var buffer = new ArrayBuffer(44 + samples.length * 2);
  var view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 32 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, 1, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 2, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return view;
}

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

function onUpload() {
	console.log('inside upload');

	var buf = waveObj.wave.backend.buffer;
	var data = buf.getChannelData(0);

	var wav = encodeWAV(data,buf.sampleRate); 

	var xhr = new XMLHttpRequest();
	xhr.open('post', '/upload_audio.php', true);
	var bar = document.querySelector('progress');
	xhr.upload.onprogress = function(e) {
		bar.value = (e.loaded/e.total) * 100;
		bar.textContent = bar.value;	
	};
	console.log('begin send');
	var blob = new Blob([wav], {type:'audio/wav'});
	xhr.send(blob);
}

function onDownload() {
	console.log('inside download');

	var bar = document.querySelector('progress');
	var xhr = new XMLHttpRequest();
	xhr.open('get', '/upload.wav', true);
	xhr.responseType = 'blob';
	xhr.onprogress = function(e) {
		bar.value = (e.loaded/e.total) * 100;
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			console.log('AJAX OK');
			waveObj.wave.loadBlob(xhr.response);
			//var buf = waveObj.wave.backend.buffer;
			//buf.getChannelData(0).set(xhr.response);
		}
	}
	xhr.send(null);
}

document.getElementById('wavefile').addEventListener('change', onFileSelect,false);
document.getElementById('uploadbutton').addEventListener('click', onUpload,false);
document.getElementById('downloadbutton').addEventListener('click', onDownload,false);


