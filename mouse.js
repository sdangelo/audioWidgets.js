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

virtualPianoKeyboard.keyboard.addMouseIn = function (element, canvas) {
	var k = this;
	var keyCur = null;
	var keyCurHover = false;
	var mouseDown = false;

	canvas.addEventListener("mousemove",
		function (event) {
			var rect = canvas.getBoundingClientRect();
			var x = event.clientX - rect.left; 
			var y = event.clientY - rect.top;
			var key = k.getKeyByCoordinates(x, y);

			if (key != keyCur) {
				// this first for legato
				if (key) {
					k.keyHoverIn(key, true);
					if (mouseDown)
						k.keyPressIn(key, true);
				}

				if (keyCur) {
					if (keyCurHover)
						k.keyHoverIn(keyCur, false);
					if (mouseDown)
						k.keyPressIn(keyCur, false);
				}

				keyCur = key;
			} else if (!keyCurHover)
				k.keyHoverIn(keyCur, true);

			keyCurHover = true;
		});

	canvas.addEventListener("mouseout",
		function (event) {
			if (keyCur)
				k.keyHoverIn(keyCur, false);
			keyCurHover = false;
		});

	canvas.addEventListener("mousedown",
		function (event) {
			if (event.button == 0) {
				if (keyCur)
					k.keyPressIn(keyCur, true);
				mouseDown = true;
			}
		});

	element.addEventListener("mouseup",
		function (event) {
			if (event.button == 0) {
				if (keyCur && mouseDown)
					k.keyPressIn(keyCur, false);
				mouseDown = false;
			}
		});

	element.addEventListener("blur",
		function (event) {
			if (keyCur) {
				if (mouseDown)
					k.keyPressIn(keyCur, false);
				if (keyCurHover)
					k.keyHoverIn(keyCur, false);
				mouseDown = false;
				keyCurHover = false;
				keyCur = null;
			}
		});
};
