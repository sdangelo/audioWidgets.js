/*
 * Copyright (C) 2015 Stefano D'Angelo <zanga.mail@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

var virtualPianoKeyboard = {};

virtualPianoKeyboard.key = {
	note:		NaN,	// MIDI note number
	width:		NaN,	// Key width over octave width

	x:		NaN,
	mX:		NaN,
	mX2:		NaN,
	mY:		NaN,
	mY1:		NaN,
	mY2:		NaN,
	hoverCount:	0,
	pressCount:	0,

	compareCoordinates(mX, mY) {
	},

	draw: function (ctx) {
	}
};

// e.g., C, F
virtualPianoKeyboard.keyWhiteLeft = Object.create(virtualPianoKeyboard.key);
virtualPianoKeyboard.keyWhiteLeft.xE = NaN;	// Where upper part of key ends
						// (over octave width)

virtualPianoKeyboard.keyWhiteLeft.mXE = NaN;

virtualPianoKeyboard.keyWhiteLeft.compareCoordinates = function (mX, mY) {
	if (mX < this.mX)
		return -1;
	else if (mX > this.mX2 || (mX > this.mXE && mY < this.mY1))
		return 1;
	else
		return 0;
};

virtualPianoKeyboard.keyWhiteLeft.draw = function (ctx) {
	var x = this.mX + 0.5;
	var xE = this.mXE - 0.5;
	var x2 = this.mX2 - 0.5;
	var y = this.mY + 0.5;
	var y1 = this.mY1 + 0.5;
	var y2 = this.mY2 - 0.5;

	ctx.save();

	if (this.pressCount) {
		if (this.hoverCount) {
			ctx.fillStyle = "#eee";
			ctx.strokeStyle = "#999";
		} else {
			ctx.fillStyle = "#ccc";
			ctx.strokeStyle = "#777";
		}
	} else {
		if (this.hoverCount) {
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#ddd";
		} else {
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#aaa";
		}
	}
	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(xE, y);
	ctx.lineTo(xE, y1);
	ctx.lineTo(x2, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x, y2);
	ctx.closePath();

	ctx.fill();
	ctx.stroke();

	ctx.restore();
};

// e.g., E, B
virtualPianoKeyboard.keyWhiteRight = Object.create(virtualPianoKeyboard.key);
virtualPianoKeyboard.keyWhiteRight.xB = NaN;	// Where upper part of key
						// begins (over octave width)

virtualPianoKeyboard.keyWhiteRight.mXB = NaN;

virtualPianoKeyboard.keyWhiteRight.compareCoordinates = function (mX, mY) {
	if (mX < this.mX || (mX < this.mXB && mY < this.mY1))
		return -1;
	else if (mX > this.mX2)
		return 1;
	else
		return 0;
};

virtualPianoKeyboard.keyWhiteRight.draw = function (ctx) {
	var x = this.mX + 0.5;
	var xB = this.mXB + 0.5;
	var x2 = this.mX2 - 0.5;
	var y = this.mY + 0.5;
	var y1 = this.mY1 + 0.5;
	var y2 = this.mY2 - 0.5;

	ctx.save();

	if (this.pressCount) {
		if (this.hoverCount) {
			ctx.fillStyle = "#eee";
			ctx.strokeStyle = "#999";
		} else {
			ctx.fillStyle = "#ccc";
			ctx.strokeStyle = "#777";
		}
	} else {
		if (this.hoverCount) {
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#ddd";
		} else {
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#aaa";
		}
	}
	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(xB, y);
	ctx.lineTo(x2, y);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x, y2);
	ctx.lineTo(x, y1);
	ctx.lineTo(xB, y1);
	ctx.closePath();

	ctx.fill();
	ctx.stroke();

	ctx.restore();
};

// e.g., D, G, A
virtualPianoKeyboard.keyWhiteMiddle = Object.create(virtualPianoKeyboard.key);
virtualPianoKeyboard.keyWhiteMiddle.xB = NaN;	// Where upper part of key
						// begins (over octave width)
virtualPianoKeyboard.keyWhiteMiddle.xE = NaN;	// Where upper part of key ends
						// (over octave width)

virtualPianoKeyboard.keyWhiteMiddle.mXB = NaN;
virtualPianoKeyboard.keyWhiteMiddle.mXE = NaN;

virtualPianoKeyboard.keyWhiteMiddle.compareCoordinates = function (mX, mY) {
	if (mX < this.mX || (mX < this.mXB && mY < this.mY1))
		return -1;
	else if (mX > this.mX2 || (mX > this.mXE && mY < this.mY1))
		return 1;
	else
		return 0;
};

virtualPianoKeyboard.keyWhiteMiddle.draw = function (ctx) {
	var x = this.mX + 0.5;
	var xB = this.mXB + 0.5;
	var xE = this.mXE - 0.5;
	var x2 = this.mX2 - 0.5;
	var y = this.mY + 0.5;
	var y1 = this.mY1 + 0.5;
	var y2 = this.mY2 - 0.5;

	ctx.save();

	if (this.pressCount) {
		if (this.hoverCount) {
			ctx.fillStyle = "#eee";
			ctx.strokeStyle = "#999";
		} else {
			ctx.fillStyle = "#ccc";
			ctx.strokeStyle = "#777";
		}
	} else {
		if (this.hoverCount) {
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#ddd";
		} else {
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#aaa";
		}
	}
	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(xB, y);
	ctx.lineTo(xE, y);
	ctx.lineTo(xE, y1);
	ctx.lineTo(x2, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x, y2);
	ctx.lineTo(x, y1);
	ctx.lineTo(xB, y1);
	ctx.closePath();

	ctx.fill();
	ctx.stroke();

	ctx.restore();
};

// e.g., highest C
virtualPianoKeyboard.keyWhiteFull = Object.create(virtualPianoKeyboard.key);

virtualPianoKeyboard.keyWhiteFull.compareCoordinates = function (mX, mY) {
	if (mX < this.mX)
		return -1;
	else if (mX > this.mX2)
		return 1;
	else
		return 0;
};

virtualPianoKeyboard.keyWhiteFull.draw = function (ctx) {
	ctx.save();

	if (this.pressCount) {
		if (this.hoverCount) {
			ctx.fillStyle = "#eee";
			ctx.strokeStyle = "#999";
		} else {
			ctx.fillStyle = "#ccc";
			ctx.strokeStyle = "#777";
		}
	} else {
		if (this.hoverCount) {
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#ddd";
		} else {
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#aaa";
		}
	}
	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.rect(this.mX + 0.5, this.mY + 0.5, this.mX2 - this.mX - 1.0,
		 this.mY2 - this.mY - 1.0);

	ctx.fill();
	ctx.stroke();

	ctx.restore();
};

virtualPianoKeyboard.keyBlack = Object.create(virtualPianoKeyboard.key);

virtualPianoKeyboard.keyBlack.compareCoordinates = function (mX, mY) {
	if (mX < this.mX)
		return -1;
	else if (mX > this.mX2)
		return 1;
	else if (mY > this.mY1)
		return NaN;
	else
		return 0;
};

virtualPianoKeyboard.keyBlack.draw = function (ctx) {
	ctx.save();

	if (this.pressCount)
		ctx.fillStyle = this.hoverCount ? "#111" : "#000";
	else
		ctx.fillStyle = this.hoverCount ? "#333" : "#222";

	ctx.beginPath();
	ctx.rect(this.mX, this.mY, this.mX2 - this.mX, this.mY1 - this.mY);

	ctx.fill();

	ctx.restore();
};

virtualPianoKeyboard.keyC = Object.create(virtualPianoKeyboard.keyWhiteLeft);
virtualPianoKeyboard.keyC.width = 23 / 164;
virtualPianoKeyboard.keyC.xE = 14 / 164;

virtualPianoKeyboard.keyCsDb = Object.create(virtualPianoKeyboard.keyBlack);
virtualPianoKeyboard.keyCsDb.width = 14 / 164;

virtualPianoKeyboard.keyD = Object.create(virtualPianoKeyboard.keyWhiteMiddle);
virtualPianoKeyboard.keyD.width = 24 / 164;
virtualPianoKeyboard.keyD.xB = 5 / 164;
virtualPianoKeyboard.keyD.xE = 19 / 164;

virtualPianoKeyboard.keyDsEb = Object.create(virtualPianoKeyboard.keyBlack);
virtualPianoKeyboard.keyDsEb.width = 14 / 164;

virtualPianoKeyboard.keyE = Object.create(virtualPianoKeyboard.keyWhiteRight);
virtualPianoKeyboard.keyE.width = 23 / 164;
virtualPianoKeyboard.keyE.xB = 9 / 164;

virtualPianoKeyboard.keyF = Object.create(virtualPianoKeyboard.keyWhiteLeft);
virtualPianoKeyboard.keyF.width = 24 / 164;
virtualPianoKeyboard.keyF.xE = 13 / 164;

virtualPianoKeyboard.keyFsGb = Object.create(virtualPianoKeyboard.keyBlack);
virtualPianoKeyboard.keyFsGb.width = 14 / 164;

virtualPianoKeyboard.keyG = Object.create(virtualPianoKeyboard.keyWhiteMiddle);
virtualPianoKeyboard.keyG.width = 23 / 164;
virtualPianoKeyboard.keyG.xB = 3 / 164;
virtualPianoKeyboard.keyG.xE = 16 / 164;

virtualPianoKeyboard.keyGsAb = Object.create(virtualPianoKeyboard.keyBlack);
virtualPianoKeyboard.keyGsAb.width = 14 / 164;

virtualPianoKeyboard.keyA = Object.create(virtualPianoKeyboard.keyWhiteMiddle);
virtualPianoKeyboard.keyA.width = 23 / 164;
virtualPianoKeyboard.keyA.xB = 7 / 164;
virtualPianoKeyboard.keyA.xE = 20 / 164;

virtualPianoKeyboard.keyAsBb = Object.create(virtualPianoKeyboard.keyBlack);
virtualPianoKeyboard.keyAsBb.width = 14 / 164;

virtualPianoKeyboard.keyB = Object.create(virtualPianoKeyboard.keyWhiteRight);
virtualPianoKeyboard.keyB.width = 24 / 164;
virtualPianoKeyboard.keyB.xB = 11 / 164;

virtualPianoKeyboard.keyHighC =
	Object.create(virtualPianoKeyboard.keyWhiteFull);
virtualPianoKeyboard.keyHighC.width = 23 / 164;

virtualPianoKeyboard.keyboard = {
	blackLength:	3 / 5,	// Length of black keys over length of white
				// keys
	ctx:		null,
	x:		NaN,
	y:		NaN,
	width:		NaN,
	height:		NaN,
	onNoteDown:	null,
	onNoteUp:	null,

	keys:		null,	// Array of keys, from leftmost to rightmost
	w:		NaN,
	x2:		NaN,
	y2:		NaN,

	keyWhiteLeft:	virtualPianoKeyboard.keyWhiteLeft,
	keyWhiteRight:	virtualPianoKeyboard.keyWhiteRight,
	keyWhiteMiddle:	virtualPianoKeyboard.keyWhiteMiddle,
	keyWhiteFull:	virtualPianoKeyboard.keyWhiteFull,
	keyBlack:	virtualPianoKeyboard.keyBlack,

	init: function (keys) {
		this.keys = keys;

		var up = 0;
		var down = 0;
		for (var i = 0; i < this.keys.length; i++) {
			var key = this.keys[i];

			if (this.keyWhiteFull.isPrototypeOf(key)) {
				key.x = up > down ? up : down;
				up = down = key.x + key.width;
			} else if (this.keyBlack.isPrototypeOf(key)) {
				key.x = up;
				up += key.width;
			} else if (this.keyWhiteLeft.isPrototypeOf(key)) {
				key.x = up > down ? up : down;
				up = key.x + key.xE;
				down = key.x + key.width;
			} else if (this.keyWhiteMiddle.isPrototypeOf(key)) {
				var v = up - key.xB;
				key.x = v > down ? v : down;
				up = key.x + key.xE;
				down = key.x + key.width;
			} else if (this.keyWhiteRight.isPrototypeOf(key)) {
				var v = up - key.xB;
				key.x = v > down ? v : down;
				up = key.x + key.width;
				down = key.x + key.width;
			}
		}
		this.w = up > down ? up : down;
	},

	update: function () {
		this.x2 = this.x + this.width;
		this.y2 = this.y + this.height;
		var y1 = this.y + this.blackLength * this.height;

		var w = this.width / this.w;
		for (var i = 0; i < this.keys.length; i++) {
			var key = this.keys[i];

			key.mX = this.x + w * key.x;
			key.mX2 = key.mX + w * key.width;
			key.mY = this.y;
			key.mY1 = y1;
			key.mY2 = this.y2;
			if ("xB" in key)
				key.mXB = key.mX + w * key.xB;
			if ("xE" in key)
				key.mXE = key.mX + w * key.xE;
		}
	},

	keyHoverIn: function (key, hover) {
		if (hover) {
			key.hoverCount++;
			if (key.hoverCount == 1)
				key.draw(this.ctx);
		} else {
			key.hoverCount--;
			if (key.hoverCount == 0)
				key.draw(this.ctx);
		}
	},

	keyPressIn: function (key, pressed) {
		if (pressed) {
			key.pressCount++;
			if (key.pressCount == 1) {
				if (this.onNoteDown)
					this.onNoteDown(key.note);
				key.draw(this.ctx);
			}
		} else {
			key.pressCount--;
			if (key.pressCount == 0) {
				if (this.onNoteUp)
					this.onNoteUp(key.note);
				key.draw(this.ctx);
			}
		}
	},

	getKeyByCoordinates: function (x, y) {
		if (x < this.x || x > this.x2 || y < this.y || y > this.y2)
			return null;

		var iDown = 0;
		var iUp = this.keys.length - 1;
		while (iDown <= iUp) {
			var i = (iDown + iUp) >> 1;
			var key = this.keys[i];
			var cmp = key.compareCoordinates(x, y);

			if (cmp < 0) {
				iUp = i - 1;
				continue;
			} else if (cmp > 0) {
				iDown = i + 1;
				continue;
			} else if (!isFinite(cmp)) {
				cmp = 1;
				if (i > iDown) {
					key = this.keys[i - 1];
					cmp = key.compareCoordinates(x, y);
				}
				if (!(cmp == 0) && i < iUp) {
					key = this.keys[i + 1];
					cmp = key.compareCoordinates(x, y);
				}
				if (!(cmp == 0))
					return null;
			}

			return key;
		}

		return null;
	},

	getKeyByNote: function (note) {
		var i = note - this.keys[0].note;
		return (i >= 0 && i < this.keys.length) ? this.keys[i] : null;
	},

	draw: function () {
		for (var i = 0; i < this.keys.length; i++)
			this.keys[i].draw(this.ctx);
	}
};

virtualPianoKeyboard.createOctave = function (keyCollection) {
	if (!keyCollection)
		keyCollection = this;

	var k = new Array(12);

	k[0] = Object.create(keyCollection.keyC);
	k[1] = Object.create(keyCollection.keyCsDb);
	k[2] = Object.create(keyCollection.keyD);
	k[3] = Object.create(keyCollection.keyDsEb);
	k[4] = Object.create(keyCollection.keyE);
	k[5] = Object.create(keyCollection.keyF);
	k[6] = Object.create(keyCollection.keyFsGb);
	k[7] = Object.create(keyCollection.keyG);
	k[8] = Object.create(keyCollection.keyGsAb);
	k[9] = Object.create(keyCollection.keyA);
	k[10] = Object.create(keyCollection.keyAsBb);
	k[11] = Object.create(keyCollection.keyB);

	return k;
};

virtualPianoKeyboard.createKeyboard25 = function (keyboardProto,
						  keyCollection) {
	if (!keyboardProto)
		keyboardProto = this.keyboard
	if (!keyCollection)
		keyCollection = this;

	var k = Object.create(keyboardProto);
	k.init(this.createOctave(keyCollection).concat(
		this.createOctave(keyCollection),
		Object.create(keyCollection.keyHighC)));

	var n = 48;
	for (var i = 0; i < k.keys.length; i++, n++)
		k.keys[i].note = n;

	return k;
};

virtualPianoKeyboard.createKeyboard49 = function (keyboardProto,
						  keyCollection) {
	if (!keyboardProto)
		keyboardProto = this.keyboard
	if (!keyCollection)
		keyCollection = this;

	var k = Object.create(keyboardProto);
	k.init(this.createOctave(keyCollection).concat(
		this.createOctave(keyCollection),
		this.createOctave(keyCollection),
		this.createOctave(keyCollection),
		Object.create(keyCollection.keyHighC)));

	var n = 36;
	for (var i = 0; i < k.keys.length; i++, n++)
		k.keys[i].note = n;

	return k;
};

virtualPianoKeyboard.createKeyboard61 = function (keyboardProto,
						  keyCollection) {
	if (!keyboardProto)
		keyboardProto = this.keyboard
	if (!keyCollection)
		keyCollection = this;

	var k = Object.create(keyboardProto);
	k.init(this.createOctave(keyCollection).concat(
		this.createOctave(keyCollection),
		this.createOctave(keyCollection),
		this.createOctave(keyCollection),
		this.createOctave(keyCollection),
		Object.create(keyCollection.keyHighC)));

	var n = 36;
	for (var i = 0; i < k.keys.length; i++, n++)
		k.keys[i].note = n;

	return k;
};

virtualPianoKeyboard.createKeyboard88 = function (keyboardProto,
						  keyCollection) {
	if (!keyboardProto)
		keyboardProto = this.keyboard
	if (!keyCollection)
		keyCollection = this;

	var k = Object.create(keyboardProto);
	k.init([Object.create(keyCollection.keyA),
		Object.create(keyCollection.keyAsBb),
		Object.create(keyCollection.keyB)].concat(
			this.createOctave(keyCollection),
			this.createOctave(keyCollection),
			this.createOctave(keyCollection),
			this.createOctave(keyCollection),
			this.createOctave(keyCollection),
			this.createOctave(keyCollection),
			this.createOctave(keyCollection),
			Object.create(keyCollection.keyHighC)));

	var n = 21;
	for (var i = 0; i < k.keys.length; i++, n++)
		k.keys[i].note = n;

	return k;
};
