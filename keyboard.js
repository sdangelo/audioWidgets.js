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

virtualPianoKeyboard.keyCodeMap25 = {
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

virtualPianoKeyboard.keyboard.addKeyboardIn = function (element, keyCodeMap) {
	var k = this;
	var keysDown = [];

	element.addEventListener("keydown",
		function (event) {
			if (!event.repeat && event.code in keyCodeMap) {
				var note = keyCodeMap[event.code];
				var key = k.getKeyByNote(note);
				if (key) {
					k.keyPressIn(key, true);
					keysDown.push(key);
				}
			}
		});

	element.addEventListener("keyup",
		function (event) {
			if (event.code in keyCodeMap) {
				var note = keyCodeMap[event.code];
				var key = k.getKeyByNote(note);
				var i = keysDown.indexOf(key);
				if (i != -1) {
					k.keyPressIn(key, false);
					keysDown.splice(i, 1);
				}
			}
		});

	element.addEventListener("blur",
		function (event) {
			for (var i = 0; i < keysDown.length; i++)
				k.keyPressIn(keysDown[i], false);
			keysDown = [];
		});
};
