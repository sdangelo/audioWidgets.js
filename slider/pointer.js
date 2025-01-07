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

audioWidgets.slider.sensitivity = 1.0;
audioWidgets.slider.middleSensitivity = 0.5;
audioWidgets.slider.rightSensitivity = 0.1;

(function () {
	var f = audioWidgets.widget.addPointerIn;

	audioWidgets.slider.addPointerIn = function () {
		var handle = f.call(this);

		var pointers = {};
		var vPosition;

		function move(event, x, y) {
			var id = event.pointerId;
			if (handle.map) {
				var s = event.buttons & 1
					? this.sensitivity : Infinity;
				if (event.buttons & 2)
					s = Math.min(s, this.rightSensitivity);
				if (event.buttons & 4)
					s = Math.min(s, this.middleSensitivity);
				vPosition =
					handle.map.call(this, x, y,
						pointers[id].prevX,
						pointers[id].prevY,
						vPosition, s);
				if (vPosition != this.thumbPosition
				    && this.thumbPositionIsValid(vPosition))
				{
					var t = this.thumbPosition;
					this.setThumbPosition(vPosition);
					if (t != this.thumbPosition) {
						this.clear();
						this.draw();
						var e = new CustomEvent("input",
							{ bubbles: true } );
						this.dispatchEvent(e);
					}
				}
			}
			pointers[id].prevX = x;
			pointers[id].prevY = y;
		}

		handle.pointerdownHook = function (event, x, y) {
			pointers[event.pointerId] = { prevX: x, prevY: y };
			vPosition = this.thumbPosition;
			move.call(this, event, x, y);
		};

		handle.pointermoveHook = function (event, x, y, active, hover) {
			if (active)
				move.call(this, event, x, y);
		};

		handle.pointerupHook = function (event, x, y, active, hover) {
			delete pointers[event.pointerId];
		};

		handle.pointercancelHook = function (event) {
			delete pointers[event.pointerId];
		};

		return handle;
	};
})();

audioWidgets.slider.mapParallel =
function (x, y, prevX, prevY, vPosition, sensitivity) {
	var p = this.vertical ? this.height - y : x;
	if (p < this.minThumbPosition)
		p = this.minThumbPosition;
	else if (p > this.maxThumbPosition)
		p = this.maxThumbPosition;
	return p;
};

audioWidgets.slider.mapParallelDifferential =
function (x, y, prevX, prevY, vPosition, sensitivity) {
	//var p = this.vertical ? vPosition - y + prevY: vPosition + x - prevX;
	var p = vPosition
		+ sensitivity * (this.vertical ? prevY - y: x - prevX);
	if (p < this.minThumbPosition)
		p = this.minThumbPosition;
	else if (p > this.maxThumbPosition)
		p = this.maxThumbPosition;
	return p;
};
