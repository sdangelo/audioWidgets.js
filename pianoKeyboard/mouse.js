/*
 * Copyright (C) 2015, 2023 Stefano D'Angelo <zanga.mail@gmail.com>
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

audioWidgets.pianoKeyboard.keyWhiteLeft.mouseIsOver = function (x, y) {
	return x > 0 && y > 0 && x < this.width && y < this.height
	       && (y >= this.yC * this.height || x < this.xE * this.width);
};

audioWidgets.pianoKeyboard.keyWhiteRight.mouseIsOver = function (x, y) {
	return x > 0 && y > 0 && x < this.width && y < this.height
	       && (y >= this.yC * this.height || x > this.xB * this.width);
};

audioWidgets.pianoKeyboard.keyWhiteMiddle.mouseIsOver = function (x, y) {
	return x > 0 && y > 0 && x < this.width && y < this.height
	       && (y >= this.yC * this.height
		   || (x > this.xB * this.width && x < this.xE * this.width));
};

(function () {
	var add = audioWidgets.widget.addMouseIn;
	var remove = audioWidgets.widget.removeMouseIn;

	audioWidgets.pianoKeyboard.addMouseIn = function () {
		var handle = add.call(this);

		// Private
		handle.keyHandles = new Array(this.keys.length);

		var k = this;
		var curActive = null;

		for (var i = 0; i < handle.keyHandles.length; i++) {
			handle.keyHandles[i] = this.keys[i].addMouseIn();

			handle.keyHandles[i].mousedownHook = function (x, y) {
				if (handle.active)
					curActive = this;
			};

			handle.keyHandles[i].mousemoveHook =
			function (x, y, active, hover) {
				if (handle.active && hover
				    && curActive != this) {
					var j = k.keys.indexOf(curActive);
					handle.keyHandles[j].setActive(false);
					j = k.keys.indexOf(this);
					handle.keyHandles[j].setActive(true);
					curActive = this;
				}
			};
		}

		return handle;
	};

	audioWidgets.pianoKeyboard.removeMouseIn = function (handle) {
		for (var i = 0; i < handle.keyHandles.length; i++)
			this.keys[i].removeMouseIn(handle.keyHandles[i]);

		delete handle.keyHandles;

		remove.call(this, handle);
	};
})();
