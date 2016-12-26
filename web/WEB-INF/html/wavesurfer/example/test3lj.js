'use strict';

function AudioWaveform(divId, src) {
	
    //functions to manipulate wave format
    this.autoPlay = false;
    var me = this;
    var floatTo16BitPCM = function(output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    };
    var writeString = function(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    this.encodeWAV = function(samples, sampleRate) {
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
    };
    this.createWavBlob = function() {
        var buf = this.wavesurfer.backend.buffer;
        var data = buf.getChannelData(0);
        var wav = this.encodeWAV(data, buf.sampleRate);
        var blob = new Blob([wav], {type: 'audio/wav'});
        return blob;
    };
    //create wavesurfer
    this.wavesurfer = Object.create(WaveSurfer);
    var options = {
        container: document.querySelector(divId),
        waveColor: 'violet',
        progressColor: 'purple',
        cursorColor: 'navy'
    };

    this.wavesurfer.init(options);
    this.wavesurfer.load(src);
    this.onReady = function () {
        me.timeline = Object.create(WaveSurfer.Timeline);
        me.timeline.init({
            wavesurfer: me.wavesurfer,
            container: "#wave-timeline"
        });
	console.log('onReady');
	if (me.autoPlay){
		me.wavesurfer.play();
	}
	
	/*
	me.slider.min = 20;
	me.slider.max = ~~(32766/me.wavesurfer.getDuration());
	var win = 32766/256;
	if (me.slider.max < 256) {
		me.wavesurfer.pages = me.wavesurfer.getDuration()/wnd; 
		me.slider.max = 256;
	} else {
		me.wavesurfer.pages = 1;
	}
	console.log('pages ' + me.wavesurfer.pages);
	console.log('max ' + me.slider.max);
	*/
    }
    this.onError = function (err) {
        console.error(err);
    }
    this.onFinish = function (err) {
	me.playBnt.textContent = 'Play';
        console.log('Finished');
    }
    this.wavesurfer.on('ready', this.onReady);
    this.wavesurfer.on('error', this.onError);
    this.wavesurfer.on('finish', this.onFinish);

    if (this.wavesurfer.enableDragSelection) {
        this.wavesurfer.enableDragSelection({
            color: 'rgba(0, 255, 0, 0.1)'
        });
    }
    this.wavesurfer.initEditor();

    ///////////////////////////////////////////////////////////////
    this.onZoom = function () {
        var val = Number(this.value);
        me.wavesurfer.zoom(val);
        wavesurferlj.zoom($("#zoom").val());
	console.log('onZoom val:' + val);
    };
    this.onZoomFit = function() {
	var fit = 256;
        me.wavesurfer.zoom(fit);
        me.slider.value = fit;
	console.log('inside onZoomFit fit is ' + fit);
    };

    this.onFileSelect = function (evt) {
        var files = evt.target.files;
        var output = [];
	me.wavesurfer.backend.buffer = null;
	me.wavesurfer.empty();

        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            me.wavesurfer.loadBlob(f);
        }
	me.autoPlay = false;
    };
    this.onUpload = function() {
        console.log('inside upload');
        var buf = me.wavesurfer.backend.buffer;

        var data = buf.getChannelData(0);
	console.log('sampleRate:' + buf.sampleRate);

	console.log('ac sampleRate:' + me.wavesurfer.backend.ac.sampleRate);
        var wav = me.encodeWAV(data, buf.sampleRate);
        var xhr = new XMLHttpRequest();
        xhr.open('post', '../../FileUploadTemp', true);

        var bar = document.querySelector('progress');
        xhr.upload.onprogress = function (e) {
            bar.value = (e.loaded / e.total) * 100;
            bar.textContent = bar.value;
        };
        console.log('begin send');
        var blob = new Blob([wav], {type: 'audio/wav'});
        var form = new FormData();
        form.append("fd", blob);
        xhr.send(form);
    };
    this.onDownload = function() {
        console.log('inside download');
        var bar = document.querySelector('progress');
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/upload.wav', true);
        xhr.responseType = 'blob';
        xhr.onprogress = function (e) {
            bar.value = (e.loaded / e.total) * 100;
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                me.wavesurfer.loadBlob(xhr.response);
            }
        }
        xhr.send(null);
    };
    this.onCut = function() {
    	//标记处理
    	var mark = [], region;
    	var list = me.wavesurfer.regions.getMarkList()
    	Object.keys(list).forEach(function (id) {
    		if(list[id].drag == false){//获取所有标记的选区
    			mark.push(list[id].start+"-"+list[id].end);
    		}else{//获取非标记选区
    			region = list[id].start+"-"+list[id].end
    			$("#cutlog").append("<br/>"+list[id].start+"到"+list[id].end)
    		}
        });
    	//循环判断是否有覆盖标记的选区
    	for(var i in mark){
    		var m = mark[i].split("-");
    		var r = region.split("-");
    		if(parseFloat(m[0]) < parseFloat(r[0]) && parseFloat(m[1]) > parseFloat(r[0])){
    			alert("起始覆盖"+m[0]+"-"+m[1])
    		}
    		if(parseFloat(m[0]) < parseFloat(r[1]) && parseFloat(m[1]) > parseFloat(r[1])){
    			alert("结束覆盖"+m[0]+"-"+m[1])
    		}
    	}
    	
    	//alert(mark+'========'+region)
    	
        me.wavesurfer.editor.cut();
        if(mark.length > 0){
    		clickradio();
    	}
    };
    this.onCopy = function() {
        me.wavesurfer.editor.copy();
    };
    this.onPaste = function() {
        me.wavesurfer.editor.paste();
    };
    this.onClear = function() {
        me.wavesurfer.clearRegions();
    };
    this.onUndo = function() {
        me.wavesurfer.editor.undo();
    };
    this.onVolume = function(){
    	me.wavesurfer.setVolume(this.value);
    };
    this.onPlay = function(evt) {
	var bnt = evt.target;
	if (bnt.textContent == 'Play') {
		me.wavesurfer.play();
		bnt.textContent = 'Pause';
	} else {
        	me.wavesurfer.pause();
		bnt.textContent = 'Play';
	}
    };
    this.onStop = function() {
	if (me.wavesurfer.isPlaying()) {
        	me.wavesurfer.stop();
		me.wavesurfer.seekAndCenter(0);
		me.playBnt.textContent = 'Play';
	}
    };
	this.onPause = function() {
		me.wavesurfer.pause();
	};

    this.onSave = function (e) {
        var blob = me.createWavBlob();
        var a = document.getElementById('saveanchor');
        a.href = URL.createObjectURL(blob);
        console.log('inside onSave');
    };
	this.onSeek = function() {
		var progress = this.value/100.0;
		
		console.log('seek to ' + progress);
		me.wavesurfer.seekAndCenter(progress);
	};
	this.onMute = function() {
		me.wavesurfer.toggleMute();
	};
    var hookEvent = function (id, evt, callback) {
        if (typeof(id) == 'string')
            document.getElementById(id).addEventListener(evt, callback, false);
        else
            id.addEventListener(evt, callback, false);
    };
    var get = function (id) {
        return document.getElementById(id);
    };
    this.slider = get('zoom');
    this.wavefile = get('wavefile');
    this.uploadBnt = get('uploadbutton');
    this.downloadBnt = get('downloadbutton');
    this.clearBnt = get('clearbutton');
//    this.saveBnt = get('savebutton');
    this.cutBnt = get('cutbutton');
//    this.copyBnt = get('copybutton');
//    this.pasteBnt = get('pastebutton');
    this.undoBnt = get('undobutton');
    this.playBnt = get('playbutton');
    this.stopBnt = get('stopbutton');
    this.zoomFitBnt = get('zoomfitbutton');
    this.volume = get('volume');

    hookEvent(this.slider, 'change', this.onZoom);
    hookEvent(this.wavefile, 'change', this.onFileSelect);
    hookEvent(this.uploadBnt, 'click', this.onUpload);
    hookEvent(this.downloadBnt, 'click', this.onDownload);
    hookEvent(this.clearBnt, 'click', this.onClear);
//    hookEvent(this.saveBnt, 'click', this.onSave);
    hookEvent(this.cutBnt, 'click', this.onCut);
//    hookEvent(this.copyBnt, 'click', this.onCopy);
//    hookEvent(this.pasteBnt, 'click', this.onPaste);
    hookEvent(this.volume, 'click', this.onVolume);
    hookEvent('undobutton', 'click', this.onUndo);
    hookEvent('playbutton', 'click', this.onPlay);
    hookEvent('stopbutton', 'click', this.onStop);
    hookEvent('zoomfitbutton', 'click', this.onZoomFit);
    hookEvent('seek', 'change', this.onSeek);
    hookEvent('mute', 'change', this.onMute);
}
var waveObj;

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
    waveObj = new AudioWaveform('#waveform', 'example/media/demo.wav');
});






