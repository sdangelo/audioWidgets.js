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
	var keyOver = null;
	var keyPressed = null;

	canvas.addEventListener("mousemove",
		function (event) {
			var rect = canvas.getBoundingClientRect();
			var x = event.clientX - rect.left; 
			var y = event.clientY - rect.top;
			var key = k.getKeyByCoordinates(x, y);

			if (key != keyOver) {
				if (key)
					k.keyHoverIn(key, true);
				if (keyOver)
					k.keyHoverIn(keyOver, false);
				keyOver = key;
			}

			if (keyPressed && key != keyPressed) {
				if (key)
					k.keyPressIn(key, true);
				k.keyPressIn(keyPressed, false);
				keyPressed = key;
			}
		});

	canvas.addEventListener("mouseout",
		function (event) {
			if (keyOver) {
				k.keyHoverIn(keyOver, false);
				keyOver = false;
			}
		});

	canvas.addEventListener("mousedown",
		function (event) {
			if (event.button == 0) {
				if (keyOver) {
					k.keyPressIn(keyOver, true);
					keyPressed = keyOver;
				}
			}
		});

	element.addEventListener("mouseup",
		function (event) {
			if (event.button == 0) {
				if (keyPressed) {
					k.keyPressIn(keyPressed, false);
					keyPressed = null;
				}
			}
		});

	element.addEventListener("blur",
		function (event) {
			if (keyOver) {
				k.keyHoverIn(keyOver, false);
				keyOver = false;
			}

			if (keyPressed) {
				k.keyPressIn(keyPressed, false);
				keyPressed = null;
			}
		});
};
