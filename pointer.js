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

audioWidgets.widget.addPointerIn = function () {
	var handle = {
		// Read-only
		pointers: {
			/* id: {
				active:   false,
				hover:    false,
				clicking: false
			} */
		}
	};

	var w = this;

	// Public

	handle.addPointer = function (id, pointer) {
		handle.pointers[id] = pointer;
		if (pointer.active)
			w.activeIn(true);
		if (pointer.hover)
			w.hoverIn(true);
	};

	handle.removePointer = function (id) {
		var p = handle.pointers[id];
		delete handle.pointers[id];
		if (p.active)
			w.activeIn(false);
		if (p.hover)
			w.hoverIn(false);
		return p;
	};

	handle.setActive = function (id, active) {
		if (active != handle.pointers[id].active) {
			handle.pointers[id].active = active;
			w.activeIn(active);
		}
	};

	handle.setHover = function (id, hover) {
		if (hover != handle.pointers[id].hover) {
			handle.pointers[id].hover = hover;
			w.hoverIn(hover);
		}
	};

	// Private

	handle.multiClickReset = function () {
		handle.multiClickX = undefined;
		handle.multiClickY = undefined;
		handle.multiClickDownTime = 0;
		handle.multiClickUpTime = 0;
		handle.multiClickCount = 0;
	};
	handle.multiClickReset();

	handle.countActivePointers = function () {
		var i = 0;
		for (var p in handle.pointers)
			if (handle.pointers[p].active)
				i++;
		return i;
	}

	handle.pointerdown = function (event) {
		var offset = w.getOffset(event.clientX, event.clientY);
		if (!w.isOver(offset.x, offset.y))
			return;

		if (!(event.pointerId in handle.pointers))
			handle.addPointer(event.pointerId,
				{ active: false, hover: true,
				  clicking: false });

		event.preventDefault();

		if (w.disabled) {
			handle.multiClickReset();
			return;
		}

		w.ctx.canvas.setPointerCapture(event.pointerId);

		handle.setActive(event.pointerId, true);
		handle.pointers[event.pointerId].clicking = event.buttons == 1;

		if (handle.pointers[event.pointerId].clicking && handle.countActivePointers() == 1) {
			handle.multiClickDownTime = Date.now();
			if (handle.multiClickX !== offset.x || handle.multiClickY !== offset.y || handle.multiClickDownTime - handle.multiClickUpTime > 250) {
				handle.multiClickX = offset.x;
				handle.multiClickY = offset.y;
				handle.multiClickCount = 1;
			} else
				handle.multiClickCount++;
		} else
			handle.multiClickReset();

		if (handle.pointerdownHook)
			handle.pointerdownHook.call(w, event,
				offset.x, offset.y);
	};

	handle.pointermove = function (event) {
		var offset = w.getOffset(event.clientX, event.clientY);
		var over = w.isOver(offset.x, offset.y);

		if (!(event.pointerId in handle.pointers))
			handle.addPointer(event.pointerId,
				{ active: false, hover: over,
				  clicking: false });
		else
			handle.setHover(event.pointerId, over);

		if (event.buttons != 1)
			handle.pointers[event.pointerId].clicking = false;

		if (handle.multiClickX !== offset.x || handle.multiClickY !== offset.y || event.buttons != 0)
			handle.multiClickReset();

		if (handle.pointermoveHook)
			handle.pointermoveHook.call(w, event,
				offset.x, offset.y,
				handle.pointers[event.pointerId].active, over);
	};

	handle.pointerleave = function (event) {
		if (event.pointerId in handle.pointers) {
			handle.removePointer(event.pointerId);

			handle.multiClickReset();
		}
	};

	handle.pointerup = function (event) {
		var active = false;
		var clicking = event.button == 0;
		if (event.pointerId in handle.pointers) {
			clicking &&= handle.pointers[event.pointerId].clicking;
			active = handle.removePointer(event.pointerId).active;
		}

		var offset = w.getOffset(event.clientX, event.clientY);
		var over = w.isOver(offset.x, offset.y);

		if (active && over && handle.countActivePointers() == 0 && clicking) {
			var clickCount;
			handle.multiClickUpTime = Date.now();
			if (handle.multiClickX !== offset.x || handle.multiClickY !== offset.y || handle.multiClickUpTime - handle.multiClickDownTime > 250) {
				handle.multiClickReset();
				clickCount = 1;
			} else
				clickCount = handle.multiClickCount;
			var e = new CustomEvent("click",
					{ bubbles: true,
					  cancelable: true,
					  detail: clickCount });
			w.dispatchEvent(e);
		} else
			handle.multiClickReset();

		if (handle.pointerupHook)
			handle.pointerupHook.call(w, event,
				offset.x, offset.y, active, over);

		if (event.pointerType == "mouse")
			handle.pointermove(event);
	};

	handle.pointercancel = function (event) {
		if (event.pointerId in handle.pointers) {
			handle.removePointer(event.pointerId);

			handle.multiClickReset();

			if (handle.pointercancelHook)
				handle.pointercancelHook(w, event);
		}
	};

	handle.blur = function (event) {
		for (var p in handle.pointers) {
			handle.setActive(p, false);
			handle.setHover(p, false);
		}

		handle.multiClickReset();
	};

	handle.disable = function (event) {
		for (var p in handle.pointers)
			handle.setActive(p, false);

		handle.multiClickReset();
	};

	handle.contextmenu = function (event) {
		var offset = w.getOffset(event.clientX, event.clientY);
		var over = w.isOver(offset.x, offset.y);
		if (over)
			event.preventDefault();

		handle.multiClickReset();
	};

	w.ctx.canvas.addEventListener("pointerdown", handle.pointerdown);
	w.ctx.canvas.addEventListener("pointermove", handle.pointermove);
	w.ctx.canvas.addEventListener("pointerleave", handle.pointerleave);
	w.ctx.canvas.addEventListener("pointerup", handle.pointerup);
	w.ctx.canvas.addEventListener("pointercancel", handle.pointercancel);
	window.addEventListener("blur", handle.blur);
	w.addEventListener("disable", handle.disable);
	w.ctx.canvas.addEventListener("contextmenu", handle.contextmenu);

	return handle;
};

audioWidgets.widget.removeMouseIn = function (handle) {
	for (p in handle.pointers)
		handle.removePointer(p);

	this.ctx.canvas.removeEventListener("pointerdown", handle.pointerdown);
	document.removeEventListener("pointermove", handle.pointermove);
	document.removeEventListener("pointerup", handle.pointerup);
	document.removeEventListener("pointercancel", handle.pointercancel);
	window.removeEventListener("blur", handle.blur);
	this.removeEventListener("disable", handle.disable);

	delete handle.pointers;
	delete handle.pointerdown;
	delete handle.pointerdownHook;
	delete handle.pointermove;
	delete handle.pointermoveHook;
	delete handle.pointerup;
	delete handle.pointerupHook;
	delete handle.pointercancel;
	delete handle.pointercancelHook;
	delete handle.blur;
	delete handle.disable;
};
