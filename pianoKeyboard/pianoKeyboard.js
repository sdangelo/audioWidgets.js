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

audioWidgets.pianoKeyboard = Object.create(audioWidgets.widget);

audioWidgets.pianoKeyboard.key = Object.create(audioWidgets.widget);

// Read/write
audioWidgets.pianoKeyboard.key.note = NaN;	// MIDI note number

(function () {
	function setStyle() {
		if (this.disabled) {
			this.ctx.strokeStyle = "#9f9f9f";
			this.ctx.fillStyle = "#cfcfcf";
		} else if (this.activeCount != 0) {
			this.ctx.strokeStyle = "#3f3f3f";
			this.ctx.fillStyle = this.hoverCount != 0
					     ? "#ef7e00" : "#df6e00";
		} else if (this.hoverCount != 0) {
			this.ctx.strokeStyle = "#6f6f6f";
			this.ctx.fillStyle = "#fff";
		} else {
			this.ctx.strokeStyle = "#9f9f9f";
			this.ctx.fillStyle = "#efefef";
		}

		this.ctx.lineWidth = 1;
	}

	audioWidgets.pianoKeyboard.keyWhiteLeft =
		Object.create(audioWidgets.pianoKeyboard.key);

	// Read/write
	audioWidgets.pianoKeyboard.keyWhiteLeft.xE = NaN; // Where upper part of key ends (relative)
	audioWidgets.pianoKeyboard.keyWhiteLeft.yC = NaN; // Where black key cut ends (relative)

	audioWidgets.pianoKeyboard.keyWhiteLeft.draw = function () {
		var x1 = this.x + 0.5;
		var x2 = this.x + this.xE * this.width - 0.5;
		var x3 = this.x + this.width - 0.5;
		var y1 = this.y + 0.5;
		var y2 = this.y + this.yC * this.height + 0.5;
		var y3 = this.y + this.height - 0.5;

		this.ctx.save();

		setStyle.call(this);

		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.lineTo(x3, y2);
		this.ctx.lineTo(x3, y3);
		this.ctx.lineTo(x1, y3);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.restore();
	};

	audioWidgets.pianoKeyboard.keyWhiteRight =
		Object.create(audioWidgets.pianoKeyboard.key);

	// Read/write
	audioWidgets.pianoKeyboard.keyWhiteRight.xB = NaN; // Where upper part of key begins (relative)
	audioWidgets.pianoKeyboard.keyWhiteRight.yC = NaN; // Where black key cut ends (relative)

	audioWidgets.pianoKeyboard.keyWhiteRight.draw = function () {
		var x1 = this.x + 0.5;
		var x2 = this.x + this.xB * this.width + 0.5;
		var x3 = this.x + this.width - 0.5;
		var y1 = this.y + 0.5;
		var y2 = this.y + this.yC * this.height + 0.5;
		var y3 = this.y + this.height - 0.5;

		this.ctx.save();

		setStyle.call(this);

		this.ctx.beginPath();
		this.ctx.moveTo(x2, y1);
		this.ctx.lineTo(x3, y1);
		this.ctx.lineTo(x3, y3);
		this.ctx.lineTo(x1, y3);
		this.ctx.lineTo(x1, y2);
		this.ctx.lineTo(x2, y2);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.restore();
	};

	audioWidgets.pianoKeyboard.keyWhiteMiddle =
		Object.create(audioWidgets.pianoKeyboard.key);

	// Read/write
	audioWidgets.pianoKeyboard.keyWhiteMiddle.xB = NaN; // Where upper part of key begins (relative)
	audioWidgets.pianoKeyboard.keyWhiteMiddle.xE = NaN; // Where upper part of key ends (relative)
	audioWidgets.pianoKeyboard.keyWhiteMiddle.yC = NaN; // Where black key cut ends (relative)

	audioWidgets.pianoKeyboard.keyWhiteMiddle.draw = function () {
		var x1 = this.x + 0.5;
		var x2 = this.x + this.xB * this.width + 0.5;
		var x3 = this.x + this.xE * this.width - 0.5;
		var x4 = this.x + this.width - 0.5;
		var y1 = this.y + 0.5;
		var y2 = this.y + this.yC * this.height + 0.5;
		var y3 = this.y + this.height - 0.5;

		this.ctx.save();

		setStyle.call(this);

		this.ctx.beginPath();
		this.ctx.moveTo(x2, y1);
		this.ctx.lineTo(x3, y1);
		this.ctx.lineTo(x3, y2);
		this.ctx.lineTo(x4, y2);
		this.ctx.lineTo(x4, y3);
		this.ctx.lineTo(x1, y3);
		this.ctx.lineTo(x1, y2);
		this.ctx.lineTo(x2, y2);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.restore();
	};

	audioWidgets.pianoKeyboard.keyWhiteFull =
		Object.create(audioWidgets.pianoKeyboard.key);

	audioWidgets.pianoKeyboard.keyWhiteFull.draw = function () {
		this.ctx.save();

		setStyle.call(this);

		this.ctx.beginPath();
		this.ctx.rect(this.x + 0.5, this.y + 0.5,
			      this.width - 1, this.height - 1);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.restore();
	};
})();

audioWidgets.pianoKeyboard.keyBlack =
	Object.create(audioWidgets.pianoKeyboard.key);

audioWidgets.pianoKeyboard.keyBlack.draw = function () {
	this.ctx.save();

	if (this.disabled)
		this.ctx.fillStyle = "#444";
	else if (this.activeCount != 0)
		this.ctx.fillStyle = this.hoverCount != 0 ? "#111" : "#000";
	else if (this.hoverCount != 0)
		this.ctx.fillStyle = "#333";
	else
		this.ctx.fillStyle = "#222";

	this.ctx.lineWidth = 1;

	this.ctx.beginPath();
	this.ctx.rect(this.x, this.y, this.width, this.height);
	this.ctx.closePath();
	this.ctx.fill();

	this.ctx.restore();
};

audioWidgets.pianoKeyboard.keyC =
	Object.create(audioWidgets.pianoKeyboard.keyWhiteLeft);
audioWidgets.pianoKeyboard.keyC.xE = 14 / 23;

audioWidgets.pianoKeyboard.keyCsDb =
	Object.create(audioWidgets.pianoKeyboard.keyBlack);

audioWidgets.pianoKeyboard.keyD =
	Object.create(audioWidgets.pianoKeyboard.keyWhiteMiddle);
audioWidgets.pianoKeyboard.keyD.xB = 5 / 24;
audioWidgets.pianoKeyboard.keyD.xE = 19 / 24;

audioWidgets.pianoKeyboard.keyDsEb =
	Object.create(audioWidgets.pianoKeyboard.keyBlack);

audioWidgets.pianoKeyboard.keyE =
	Object.create(audioWidgets.pianoKeyboard.keyWhiteRight);
audioWidgets.pianoKeyboard.keyE.xB = 9 / 23;

audioWidgets.pianoKeyboard.keyF =
	Object.create(audioWidgets.pianoKeyboard.keyWhiteLeft);
audioWidgets.pianoKeyboard.keyF.xE = 13 / 24;

audioWidgets.pianoKeyboard.keyFsGb =
	Object.create(audioWidgets.pianoKeyboard.keyBlack);

audioWidgets.pianoKeyboard.keyG =
	Object.create(audioWidgets.pianoKeyboard.keyWhiteMiddle);
audioWidgets.pianoKeyboard.keyG.xB = 3 / 23;
audioWidgets.pianoKeyboard.keyG.xE = 16 / 23;

audioWidgets.pianoKeyboard.keyGsAb =
	Object.create(audioWidgets.pianoKeyboard.keyBlack);

audioWidgets.pianoKeyboard.keyA =
	Object.create(audioWidgets.pianoKeyboard.keyWhiteMiddle);
audioWidgets.pianoKeyboard.keyA.xB = 7 / 23;
audioWidgets.pianoKeyboard.keyA.xE = 20 / 23;

audioWidgets.pianoKeyboard.keyAsBb =
	Object.create(audioWidgets.pianoKeyboard.keyBlack);

audioWidgets.pianoKeyboard.keyB =
	Object.create(audioWidgets.pianoKeyboard.keyWhiteRight);
audioWidgets.pianoKeyboard.keyB.xB = 11 / 24;

audioWidgets.pianoKeyboard.keyHighC =
	Object.create(audioWidgets.pianoKeyboard.keyWhiteFull);

// Read/write
audioWidgets.pianoKeyboard.blackLength = 3 / 5;	// Length of black keys over length of white keys

// Read-only
audioWidgets.pianoKeyboard.keys = null;

// Private
audioWidgets.pianoKeyboard.w = NaN;

(function () {
	var f = audioWidgets.widget.init;

	audioWidgets.pianoKeyboard.init = function (keys) {
		f.call(this);

		var k = this;
		this.keys = keys;
		var up = 0;
		var down = 0;
		for (var i = 0; i < this.keys.length; i++) {
			var key = this.keys[i];

			// FIXME: this is a stupid hack
			key.clear = function () {};

			key.addEventListener("active",
				function (event) {
					var e = new CustomEvent("noteOn");
					e.note = this.note;
					k.dispatchEvent(e);
				});

			key.addEventListener("inactive",
				function (event) {
					var e = new CustomEvent("noteOff");
					e.note = this.note;
					k.dispatchEvent(e);
				});

			if (this.keyWhiteFull.isPrototypeOf(key)) {
				key.relX = up > down ? up : down;
				up = down = key.relX + key.relWidth;
			} else if (this.keyBlack.isPrototypeOf(key)) {
				key.relX = up;
				up += key.relWidth;
			} else if (this.keyWhiteLeft.isPrototypeOf(key)) {
				key.relX = up > down ? up : down;
				up = key.relX + key.xE * key.relWidth;
				down = key.relX + key.relWidth;
			} else if (this.keyWhiteMiddle.isPrototypeOf(key)) {
				var v = up - key.xB * key.relWidth;
				key.relX = v > down ? v : down;
				up = key.relX + key.xE * key.relWidth;
				down = key.relX + key.relWidth;
			} else if (this.keyWhiteRight.isPrototypeOf(key)) {
				var v = up - key.xB * key.relWidth;
				key.relX = v > down ? v : down;
				up = key.relX + key.relWidth;
				down = key.relX + key.relWidth;
			}
		}
		this.w = up > down ? up : down;
	};
})();

audioWidgets.pianoKeyboard.update = function () {
	var w = this.width / this.w;
	var yC = this.height * this.blackLength;

	for (var i = 0; i < this.keys.length; i++) {
		var key = this.keys[i];

		key.ctx = this.ctx;

		key.x = this.x + w * key.relX;
		key.width = w * key.relWidth;
		key.y = this.y;

		if (this.keyBlack.isPrototypeOf(key))
			key.height = yC;
		else {
			key.height = this.height;
			if ("yC" in key)
				key.yC = this.blackLength;
		}
	}
};

(function () {
	var f = audioWidgets.widget.setDisabled;

	audioWidgets.pianoKeyboard.setDisabled = function (disabled) {
		for (var i = 0; i < this.keys.length; i++)
			this.keys[i].setDisabled(disabled);

		f.call(this, disabled);
	};
})();

audioWidgets.pianoKeyboard.draw = function () {
	for (var i = 0; i < this.keys.length; i++)
		this.keys[i].draw();
};

audioWidgets.pianoKeyboard.createOctave = function () {
	var k = new Array(12);

	k[0] = Object.create(this.keyC);
	k[1] = Object.create(this.keyCsDb);
	k[2] = Object.create(this.keyD);
	k[3] = Object.create(this.keyDsEb);
	k[4] = Object.create(this.keyE);
	k[5] = Object.create(this.keyF);
	k[6] = Object.create(this.keyFsGb);
	k[7] = Object.create(this.keyG);
	k[8] = Object.create(this.keyGsAb);
	k[9] = Object.create(this.keyA);
	k[10] = Object.create(this.keyAsBb);
	k[11] = Object.create(this.keyB);

	k[0].init();
	k[1].init();
	k[2].init();
	k[3].init();
	k[4].init();
	k[5].init();
	k[6].init();
	k[7].init();
	k[8].init();
	k[9].init();
	k[10].init();
	k[11].init();

	k[0].relWidth = 23 / 164;
	k[1].relWidth = 14 / 164;
	k[2].relWidth = 24 / 164;
	k[3].relWidth = 14 / 164;
	k[4].relWidth = 23 / 164;
	k[5].relWidth = 24 / 164;
	k[6].relWidth = 14 / 164;
	k[7].relWidth = 23 / 164;
	k[8].relWidth = 14 / 164;
	k[9].relWidth = 23 / 164;
	k[10].relWidth = 14 / 164;
	k[11].relWidth = 24 / 164;

	return k;
};

audioWidgets.pianoKeyboard.createKeyboard25 = function () {
	var keys = this.createOctave().concat(this.createOctave(),
					      Object.create(this.keyHighC));
	keys[24].init();
	keys[24].relWidth = 23 / 164;

	var k = Object.create(this);
	k.init(keys);

	var n = 48;
	for (var i = 0; i < k.keys.length; i++, n++)
		k.keys[i].note = n;

	return k;
};
