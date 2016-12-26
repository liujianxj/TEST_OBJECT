'use strict';

function cutBuffer(data,start,end) {
	var len1 = start;
	var len2 = data.length - end;
	var newData = new Float32Array(len1  + len2);
	var j = 0;

	for (var i = 0; i < start; i++) {
		newData[j++] = data[i];
	}
	for (var i = end; i < data.length; i++) {
		newData[j++] = data[i]
	}
	var cutData = data.subarray(start, end);
	return [newData,cutData];
}

function insertBuffer(data,start,slice) {
	var newData = new Float32Array(data.length +  slice.length);
	var j = 0;
	for (var i = 0; i < start; i++) {
		newData[j++] = data[i];
	}
	for (var i = 0; i < slice.length; i++) {
		newData[j++] = slice[i];
	}
	for (var i = start; i < data.length; i++) {
		newData[j++] = data[i];
	}
	return newData;
}


WaveSurfer.EditOperation = {
	init:function(type,start,end,slice) {
		this.type = type;
		this.start = start;
		this.end = end;
		this.slice = slice;
	},
};

WaveSurfer.CutOperation  = {
	doIt:function(data) {
		var result = cutBuffer(data,this.start,this.end);
		this.slice = result[1];
		return result;

	},
	unDo:function(data) {
		var result = insertBuffer(data, this.start, this.slice);
		return result;
	}
};

WaveSurfer.CopyOperation = {
	doIt:function(data) {
		var slice = data.slice(this.start, this.end);
		this.slice = slice;
		return [data, slice];
	},
	unDo:function(data) {
		return data;
	}
};

WaveSurfer.PasteOperation = {
	doIt:function(data) {
		var result = insertBuffer(data, this.start, this.slice);
		return [result,this.slice];
	},

	unDo:function(data) {
		var result = cutBuffer(data, this.start, this.start + this.slice.length);
		return result[0];
	}
};

WaveSurfer.Editor = {
	init:function(wavesurfer) {
		this.wavesurfer = wavesurfer;
		this.clipboard = {empty:true,data:null};
		this.log = [];
	},
	getData:function() {
		return this.wavesurfer.backend.buffer.getChannelData(0);
	},
	getFirstRegion:function(){ 
		var start,end;
		var list = this.wavesurfer.regions.list;
		var flag = false;
		Object.keys(list).forEach(function(key) {
			if (!flag && list[key].drag != false) {
				var region = list[key];
				start = region.start;
				end = region.end;
				flag = true;
			}
		});
		
		var buf = this.wavesurfer.backend.buffer;
		start = ~~(start * buf.sampleRate);
		end = ~~(end * buf.sampleRate);
		return [start,end];
	},
	paste:function() {
		if (!this.clipboard.empty && this.clipboard.data) {
			var data = this.getData();
			var sampleRate = this.wavesurfer.backend.buffer.sampleRate;
			var start = ~~(this.wavesurfer.backend.startPosition * sampleRate);

			var action = Object.create(WaveSurfer.PasteOperation);
			action.init('paste',start, 0,this.clipboard.data);
			var result = action.doIt(data);
			this.log.push(action);
			this.updateView(result[0]);
			var progress = this.calcProgress(start);
			this.wavesurfer.seekAndCenter(progress);
		}
	},
	copy:function() {
		var region = this.getFirstRegion();
		var data = this.getData();
		var action = Object.create(WaveSurfer.CopyOperation);
		action.init('copy', region[0],region[1]);
		var result = action.doIt(data);
		this.clipboard.empty = false;
		this.clipboard.data = result[1];
	},
	calcProgress:function(start) {
		var progress = (1.0*start) /( 1.0*this.wavesurfer.backend.buffer.length );
		return progress;
	},
	cut:function() {
		var region = this.getFirstRegion();
		var data = this.getData();
		var action = Object.create(WaveSurfer.CutOperation);
		console.log("裁剪="+region[0]+"--"+region[1])
		action.init('cut',region[0],region[1]);
		
		var result = action.doIt(data);
		this.clipboard.empty = false;
		this.clipboard.data = result[1];
		this.log.push(action);
		this.updateView(result[0]);
		var progress = this.calcProgress(region[0]);
		this.wavesurfer.seekAndCenter(progress);
		
	},
	updateView:function(newData) {
		var buf = this.wavesurfer.backend.buffer;
		var ctx = this.wavesurfer.backend.ac;
		var newBuf = ctx.createBuffer(1, newData.length,buf.sampleRate);
		newBuf.copyToChannel(newData, 0, 0);
		this.wavesurfer.loadDecodedBuffer(newBuf);
		this.wavesurfer.clearRegions();
	},
	undo:function() {
		var action = this.log.pop();
		if (action) {
			var data = this.getData();
			var newData = action.unDo(data);
			if (newData != this.data) {
				this.updateView(newData);
			}
		}
	}
};

WaveSurfer.util.extend(WaveSurfer.CutOperation,WaveSurfer.EditOperation);
WaveSurfer.util.extend(WaveSurfer.CopyOperation,WaveSurfer.EditOperation);
WaveSurfer.util.extend(WaveSurfer.PasteOperation,WaveSurfer.EditOperation);

WaveSurfer.initEditor = function() {
	if (!this.editor) {
		this.editor = Object.create(WaveSurfer.Editor);
		this.editor.init(this);
		console.log('init editor OK');
	}
}
