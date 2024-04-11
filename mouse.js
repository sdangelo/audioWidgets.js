/*
 * Copyright (C) 2015, 2023, 2024 Stefano D'Angelo <zanga.mail@gmail.com>
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
	var x = (event.clientX - rect.left) * this.ctx.canvas.width / rect.width - this.x;
	var y = (event.clientY - rect.top) * this.ctx.canvas.height / rect.height - this.y;
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

	handle.mousedown = function (event) {
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

		function captureClick(e) {
			e.stopPropagation();
			window.removeEventListener("click", captureClick, true);
		}
		window.addEventListener("click", captureClick, true);
	};

	handle.mousemove = function (event) {
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
	};

	handle.mouseup = function (event) {
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
	};

	handle.pointerdown = function (event) {
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	handle.pointerup = function (event) {
		event.currentTarget.releasePointerCapture(event.pointerId);
	};

	handle.blur = function (event) {
		if (handle.hover) {
			handle.hover = false;
			w.hoverIn(false);
		}
		if (handle.active) {
			handle.active = false;
			w.activeIn(false);
		}
		mouseDown = false;
	};

	handle.disable = function (event) {
		if (handle.active) {
			handle.active = false;
			w.activeIn(false);
		}
	};

	w.ctx.canvas.addEventListener("mousedown", handle.mousedown);
	document.addEventListener("mousemove", handle.mousemove);
	w.ctx.canvas.addEventListener("mouseup", handle.mouseup);
	w.ctx.canvas.addEventListener("pointerdown", handle.pointerdown);
	w.ctx.canvas.addEventListener("pointerup", handle.pointerup);
	window.addEventListener("blur", handle.blur);
	w.addEventListener("disable", handle.disable);

	return handle;
};

audioWidgets.widget.removeMouseIn = function (handle) {
	handle.setActive(false);
	handle.setHover(false);

	this.ctx.canvas.removeEventListener("mousedown", handle.mousedown);
	document.canvas.removeEventListener("mousemove", handle.mousemove);
	this.ctx.canvas.removeEventListener("mouseup", handle.mouseup);
	this.ctx.canvas.removeEventListener("pointerdown", handle.pointerdown);
	this.ctx.canvas.removeEventListener("pointerup", handle.pointerup);
	window.removeEventListener("blur", handle.blur);
	this.removeEventListener("disable", handle.disable);

	delete handle.active;
	delete handle.hover;
	delete handle.mousedown;
	delete handle.mousedownHook;
	delete handle.mousemove;
	delete handle.mousemoveHook;
	delete handle.mouseup;
	delete handle.mouseupHook;
	delete handle.pointerdown;
	delete handle.pointerup;
	delete handle.blur;
	delete handle.disable;
};
