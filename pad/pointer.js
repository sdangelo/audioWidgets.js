/*
 * Copyright (C) 2026 Stefano D'Angelo <zanga.mail@gmail.com>
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

audioWidgets.pad.sensitivity = 1.0;
audioWidgets.pad.middleSensitivity = 0.5;
audioWidgets.pad.rightSensitivity = 0.1;

(function () {
	var f = audioWidgets.widget.addPointerIn;

	audioWidgets.pad.addPointerIn = function () {
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
				if ((vPosition.x != this.thumbPositionX
				    || vPosition.y != this.thumbPositionY)
				    && this.thumbPositionIsValid(vPosition.x,
								 vPosition.y))
				{
					var tx = this.thumbPositionX;
					var ty = this.thumbPositionY;
					this.setThumbPosition(vPosition.x,
							      vPosition.y);
					if (tx != this.thumbPositionX
					    || ty != this.thumbPositionY) {
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
			vPosition = { x: this.thumbPositionX,
				      y: this.thumbPositionY };
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

audioWidgets.pad.mapParallel =
function (x, y, prevX, prevY, vPosition, sensitivity) {
	var p = { x: x, y: this.height - y };
	if (p.x < this.minThumbPositionX)
		p.x = this.minThumbPositionX;
	else if (p.x > this.maxThumbPositionX)
		p.x = this.maxThumbPositionX;
	if (p.y < this.minThumbPositionY)
		p.y = this.minThumbPositionY;
	else if (p.y > this.maxThumbPositionY)
		p.y = this.maxThumbPositionY;
	return p;
};
