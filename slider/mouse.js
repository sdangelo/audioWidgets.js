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

(function () {
	var f = audioWidgets.widget.addMouseIn;

	audioWidgets.slider.addMouseIn = function () {
		var handle = f.call(this);

		var initialX;
		var initialY;

		function move(x, y) {
			if (handle.map) {
				var thumbPosition =
					handle.map.call(this, x, y,
							initialX, initialY);
				if (thumbPosition != this.thumbPosition
				    && this.thumbPositionIsValid(thumbPosition))
				{
					var t = this.thumbPosition;
					this.setThumbPosition(thumbPosition);
					if (t != this.thumbPosition) {
						this.clear();
						this.draw();
						var e = new CustomEvent("input",
							{ bubbles: true } );
						this.dispatchEvent(e);
					}
				}
			}
		}

		handle.mousedownHook = function (x, y) {
			initialX = x;
			initialY = y;
			move.call(this, x, y);
		};

		handle.mousemoveHook = function (x, y, active, hover) {
			if (active)
				move.call(this, x, y);
		};

		return handle;
	};
})();

audioWidgets.slider.mapParallel = function (x, y, initialX, initialY) {
	var p = this.vertical ? slider.height - y : x;
	if (p < this.minThumbPosition)
		p = this.minThumbPosition;
	else if (p > this.maxThumbPosition)
		p = this.maxThumbPosition;
	return p;
};
