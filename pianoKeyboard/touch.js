/*
 * Copyright (C) 2023 Stefano D'Angelo <zanga.mail@gmail.com>
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

(function () {
	var add = audioWidgets.widget.addTouchIn;
	var remove = audioWidgets.widget.removeTouchIn;

	audioWidgets.pianoKeyboard.addTouchIn = function (mouseHandle) {
		var handle = add.call(this, mouseHandle);

		// Private
		handle.keyHandles = new Array(this.keys.length);

		for (var i = 0; i < handle.keyHandles.length; i++)
			handle.keyHandles[i] = this.keys[i].addTouchIn(mouseHandle.keyHandles[i]);
	};

	audioWidgets.pianoKeyboard.removeMouseIn = function (handle) {
		for (var i = 0; i < handle.keyHandles.length; i++)
			this.keys[i].removeTouchIn(handle.keyHandles[i]);

		delete handle.keyHandles;

		remove.call(this, handle);
	};
})();
