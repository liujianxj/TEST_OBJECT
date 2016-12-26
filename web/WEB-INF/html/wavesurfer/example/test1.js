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

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
	var obj = new WaveObj('#waveform', 'example/media/demo.wav'); 
});
