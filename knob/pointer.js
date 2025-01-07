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
	var f = audioWidgets.widget.addPointerIn;

	audioWidgets.knob.addPointerIn = function () {
		var handle = f.call(this);

		var pointers = {};
		var vValue;

		function move(id, x, y) {
			if (handle.map) {
				var r = handle.map.call(this, x, y,
						pointers[id].prevX,
						pointers[id].prevY,
						vValue);
				if ("angle" in r) {
					if (r.angle != this.angle
					    && this.angleIsValid(r.angle)) {
						var a = this.angle;
						vValue = this.setAngle(r.angle);
						if (a != this.angle) {
							this.clear();
							this.draw();
							var e = new CustomEvent("input",
								{ bubbles: true } );
							this.dispatchEvent(e);
						}
					}
				} else {
					vValue = r.value;
					if (r.value != this.value) {
						var v = this.value;
						this.setValue(r.value);
						if (v != this.value) {
							this.clear();
							this.draw();
							var e = new CustomEvent("input",
								{ bubbles: true } );
							this.dispatchEvent(e);
						}
					}
				}
			}
			pointers[id].prevX = x;
			pointers[id].prevY = y;
		}

		handle.pointerdownHook = function (event, x, y) {
			x -= this.radius;
			y -= this.radius;
			pointers[event.pointerId] = { prevX: x, prevY: y };
			vValue = this.value;
			move.call(this, event.pointerId, x, y);
		};

		handle.pointermoveHook = function (event, x, y, active, hover) {
			if (active)
				move.call(this, event.pointerId,
					  x - this.radius, y - this.radius);
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

audioWidgets.knob.mapRadial = function (x, y, prevX, prevY, vValue) {
	var angle = Math.atan2(-y, x);
	if (angle < 0)
		angle += Math.PI + Math.PI;

	if (this.maxAngle > this.minAngle) {
		if (angle > this.minAngle && angle < this.maxAngle) {
			var dmin = this.minAngle - this.angle;
			var dmax = this.angle - this.maxAngle;
			if (this.angle >= this.maxAngle)
				dmin += Math. PI + Math.PI;
			else
				dmax += Math.PI + Math.PI;
			angle = dmin > dmax ? this.maxAngle : this.minAngle;
		}
	} else {
		if (angle > this.minAngle || angle < this.maxAngle) {
			var dmin = this.minAngle - this.angle;
			var dmax = this.angle - this.maxAngle;
			angle = dmin > dmax ? this.maxAngle : this.minAngle;
		}
	}

	return { angle: angle };
};

audioWidgets.knob.mapVerticalDifferential = function (x, y, prevX, prevY, vValue) {
	var k = 0.5 * this.height;
	if (this.maxAngle > this.minAngle)
		k *= this.minAngle - this.maxAngle + Math.PI + Math.PI;
	else
		k *= this.minAngle - this.maxAngle;
	var value = vValue + (prevY - y) / k;
	if (value < 0)
		value = 0;
	if (value > 1)
		value = 1;
	return { value: value };
}
