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

audioWidgets.knob.mouseIsOver = function (x, y) {
	x -= this.radius;
	y -= this.radius;
	return x * x + y * y < this.radius * this.radius;
};

(function () {
	var f = audioWidgets.widget.addMouseIn;

	audioWidgets.knob.addMouseIn = function () {
		var handle = f.call(this);

		var initialX;
		var initialY;
		var prevX;
		var prevY;

		function move(x, y) {
			if (handle.map) {
				var r = handle.map.call(this, x, y,
							initialX, initialY,
							prevX, prevY);
				if ("angle" in r) {
					if (r.angle != this.angle
					    && this.angleIsValid(r.angle)) {
						var a = this.angle;
						this.setAngle(r.angle);
						if (a != this.angle) {
							this.clear();
							this.draw();
							var e = new CustomEvent("input",
								{ bubbles: true } );
							this.dispatchEvent(e);
						}
					}
				} else {
					if (r.value != this.value) {
						this.setValue(r.value);
						this.clear();
						this.draw();
						var e = new CustomEvent("input",
							{ bubbles: true } );
						this.dispatchEvent(e);
					}
				}
			}
			prevX = x;
			prevY = y;
		}

		handle.mousedownHook = function (x, y) {
			x -= this.radius;
			y -= this.radius;
			initialX = x;
			initialY = y;
			prevX = x;
			prevY = y;
			move.call(this, x, y);
		};

		handle.mousemoveHook = function (x, y, active, hover) {
			if (active)
				move.call(this, x - this.radius,
					  y - this.radius);
		};

		return handle;
	};
})();

audioWidgets.knob.mapRadial = function (x, y, initialX, initialY, prevX, prevY) {
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

audioWidgets.knob.mapVerticalDifferential = function (x, y, initialX, initialY, prevX, prevY) {
	var k = 0.5 * this.height;
	if (this.maxAngle > this.minAngle)
		k *= this.minAngle - this.maxAngle + Math.PI + Math.PI;
	else
		k *= this.minAngle - this.maxAngle;
	var value = this.value + (prevY - y) / k;
	if (value < 0)
		value = 0;
	if (value > 1)
		value = 1;
	return { value: value };
}
