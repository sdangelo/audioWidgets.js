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

audioWidgets.pianoKeyboard.keyCodeMap25 = {
	KeyZ:	48,
	KeyS:	49,
	KeyX:	50,
	KeyD:	51,
	KeyC:	52,
	KeyV:	53,
	KeyG:	54,
	KeyB:	55,
	KeyH:	56,
	KeyN:	57,
	KeyJ:	58,
	KeyM:	59,
	KeyW:	60,
	Digit3:	61,
	KeyE:	62,
	Digit4:	63,
	KeyR:	64,
	KeyT:	65,
	Digit6:	66,
	KeyY:	67,
	Digit7:	68,
	KeyU:	69,
	Digit8:	70,
	KeyI:	71,
	KeyO:	72
};

audioWidgets.pianoKeyboard.addKeyboardIn = function (keyCodeMap) {
	var handle = {
		// Private
		keysActive: []
	};

	var k = this;

	handle.keydown = document.addEventListener("keydown",
		function (event) {
			if (!k.disabled && !event.repeat
			    && event.code in keyCodeMap) {
				var note = keyCodeMap[event.code];
				var keys = k.keys.filter(function (key) {
					return key.note == note });
				for (var i = 0; i < keys.length; i++) {
					keys[i].activeIn(true);
					handle.keysActive.push(keys[i]);
				}
			}
		});

	handle.keyup = document.addEventListener("keyup",
		function (event) {
			if (!k.disabled && event.code in keyCodeMap) {
				var note = keyCodeMap[event.code];
				for (var i = 0; i < handle.keysActive.length;
				     i++)
					if (handle.keysActive[i].note == note) {
						handle.keysActive[i]
							.activeIn(false);
						handle.keysActive.splice(i, 1);
					}
			}
		});

	handle.blur = document.addEventListener("blur",
		function (event) {
			for (var i = 0; i < handle.keysActive.length; i++)
				handle.keysActive[i].activeIn(false);
			handle.keysActive = [];
		});

	handle.disable = k.addEventListener("disable",
		function (event) {
			for (var i = 0; i < handle.keysActive.length; i++)
				handle.keysActive[i].activeIn(false);
			handle.keysActive = [];
		});

	return handle;
};

audioWidgets.pianoKeyboard.removeKeyboardIn = function (handle) {
	for (var i = 0; i < handle.keysActive.length; i++)
		handle.keysActive[i].activeIn(false);

	document.removeEventListener("keydown", handle.keydown);
	document.removeEventListener("keyup", handle.keyup);
	document.removeEventListener("blur", handle.blur);
	this.removeEventListener("disable", handle.disable);

	delete handle.keysActive;
	delete handle.keydown;
	delete handle.keyup;
	delete handle.blur;
	delete handle.disable;
};
