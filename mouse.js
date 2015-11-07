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

audioWidgets.widget.mouseIsOver = function (x, y) {
	return x > 0 && y > 0 && x < this.width && y < this.height;
};

audioWidgets.widget.getMouseEventOffset = function (event) {
	var rect = this.ctx.canvas.getBoundingClientRect();
	var x = event.clientX - rect.left - this.x;
	var y = event.clientY - rect.top - this.y;
	return { x: x, y: y };
};

audioWidgets.widget.addMouseIn = function () {
	var handle = {
		// Read-only
		active:	false,
		hover:	false
	};

	var w = this;
	var mouseDown = false;

	// Public

	handle.setActive = function (active) {
		if (active != handle.active) {
			handle.active = active;
			w.activeIn(active);
		}
	};

	handle.setHover = function (hover) {
		if (hover != handle.hover) {
			handle.hover = hover;
			w.hoverIn(hover);
		}
	};

	// Private

	handle.mousedown = w.ctx.canvas.addEventListener("mousedown",
		function (event) {
			var offset = w.getMouseEventOffset(event);
			mouseDown = w.mouseIsOver(offset.x, offset.y);
			if (!mouseDown)
				return;

			event.preventDefault();

			if (w.disabled)
				return;

			w.activeIn(true);
			handle.active = true;

			if (handle.mousedownHook)
				handle.mousedownHook.call(w,
					offset.x, offset.y);
		});

	handle.mousemove = document.addEventListener("mousemove",
		function (event) {
			var offset = w.getMouseEventOffset(event);
			var over = w.mouseIsOver(offset.x, offset.y);

			if (handle.hover && !over) {
				w.hoverIn(false);
				handle.hover = false;
			} else if (!handle.hover && over) {
				w.hoverIn(true);
				handle.hover = true;
			}

			if (handle.mousemoveHook)
				handle.mousemoveHook.call(w,
					offset.x, offset.y, handle.active,
					handle.hover);
		});

	handle.mouseup = document.addEventListener("mouseup",
		function (event) {
			if (handle.active)
				w.activeIn(false);

			if (handle.mouseupHook) {
				var offset = w.getMouseEventOffset(event);
				if (w.mouseIsOver(offset.x, offset.y))
					handle.mouseupHook.call(w,
						offset.x, offset.y,
						handle.active);
			}

			handle.active = false;
			mouseDown = false;
		});

	handle.blur = document.addEventListener("blur",
		function (event) {
			if (handle.hover) {
				handle.hover = false;
				w.hoverIn(false);
			}
			if (handle.active) {
				handle.active = false;
				w.activeIn(false);
			}
			mouseDown = false;
		});

	handle.disable = w.addEventListener("disable",
		function (event) {
			if (handle.active) {
				handle.active = false;
				w.activeIn(false);
			}
		});

	return handle;
};

audioWidgets.widget.removeMouseIn = function (handle) {
	handle.setActive(false);
	handle.setHover(false);

	this.ctx.canvas.removeEventListener(handle.mousedown);
	document.removeEventListener(handle.mousemove);
	document.removeEventListener(handle.mouseup);
	document.removeEventListener(handle.blur);
	this.removeEventListener(handle.disable);

	delete handle.active;
	delete handle.hover;
	delete handle.mousedown;
	delete handle.mousedownHook;
	delete handle.mousemove;
	delete handle.mousemoveHook;
	delete handle.mouseup;
	delete handle.mouseupHook;
	delete handle.blur;
	delete handle.disable;
};
