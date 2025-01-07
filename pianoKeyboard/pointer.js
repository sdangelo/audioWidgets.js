/*
 * Copyright (C) 2015, 2023-2025 Stefano D'Angelo <zanga.mail@gmail.com>
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
	var add = audioWidgets.widget.addPointerIn;
	var remove = audioWidgets.widget.removePointerIn;

	audioWidgets.pianoKeyboard.addPointerIn = function () {
		var handle = add.call(this);

		// Private
		handle.keyHandles = new Array(this.keys.length);

		var k = this;
		var curActive = {};

		for (var i = 0; i < handle.keyHandles.length; i++) {
			handle.keyHandles[i] = this.keys[i].addPointerIn();

			// are we sure these are executed after keyboard hooks?

			handle.keyHandles[i].pointerdownHook =
			function (event, x, y) {
				if (handle.pointers[event.pointerId].active)
					curActive[event.pointerId] = this;
			};

			handle.keyHandles[i].pointermoveHook =
			function (event, x, y, active, hover) {
				var id = event.pointerId;
				if (handle.pointers[id].active && hover
				    && curActive[id] != this) {
					var j = k.keys.indexOf(curActive[id]);
					handle.keyHandles[j]
					      .setActive(id, false);
					j = k.keys.indexOf(this);
					handle.keyHandles[j]
					      .setActive(id, true);
					curActive[id] = this;
				}
			};

			handle.keyHandles[i].pointerupHook =
			function (event, x, y, active, hover) {
				delete curActive[event.pointerId];
			};

			handle.keyHandles[i].pointercancelHook =
			function (event) {
				delete curActive[event.pointerId];
			};
		}

		return handle;
	};

	audioWidgets.pianoKeyboard.removePointerIn = function (handle) {
		for (var i = 0; i < handle.keyHandles.length; i++)
			this.keys[i].removePointerIn(handle.keyHandles[i]);

		delete handle.keyHandles;

		remove.call(this, handle);
	};
})();
