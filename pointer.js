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

audioWidgets.widget.addPointerIn = function () {
	var handle = {
		// Read-only
		pointers: {
			/* id: {
				active: false,
				hover:  false
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

	handle.pointerdown = function (event) {
		var offset = w.getOffset(event.clientX, event.clientY);
		if (!w.isOver(offset.x, offset.y))
			return;

		if (!(event.pointerId in handle.pointers))
			handle.addPointer(event.pointerId,
				{ active: false, hover: true });

		event.preventDefault();

		if (w.disabled)
			return;

		handle.setActive(event.pointerId, true);

		if (handle.pointerdownHook)
			handle.pointerdownHook.call(w, event.pointerId,
				offset.x, offset.y);
	};

	handle.pointermove = function (event) {
		var offset = w.getOffset(event.clientX, event.clientY);
		var over = w.isOver(offset.x, offset.y);

		if (!(event.pointerId in handle.pointers))
			handle.addPointer(event.pointerId,
				{ active: false, hover: over });
		else
			handle.setHover(event.pointerId, over);

		if (handle.pointermoveHook)
			handle.pointermoveHook.call(w, event.pointerId,
				offset.x, offset.y,
				handle.pointers[event.pointerId].active, over);
	};

	handle.pointerup = function (event) {
		var active = false;
		if (event.pointerId in handle.pointers)
			active = handle.removePointer(event.pointerId).active;

		if (handle.pointerupHook) {
			var offset = w.getOffset(event.clientX, event.clientY);
			var over = w.isOver(offset.x, offset.y);
			handle.pointerupHook.call(w, event.pointerId,
				offset.x, offset.y, active, over);
		}

		if (event.pointerType == "mouse")
			handle.pointermove(event);
	};

	handle.pointercancel = function (event) {
		if (event.pointerId in handle.pointers) {
			handle.removePointer(event.pointerId);

			if (handle.pointercancelHook)
				handle.pointercancelHook(w, event.pointerId);
		}
	};

	handle.blur = function (event) {
		for (var p in handle.pointers) {
			handle.setActive(p, false);
			handle.setHover(p, false);
		}
	};

	handle.disable = function (event) {
		for (var p in handle.pointers)
			handle.setActive(p, false);
	};

	w.ctx.canvas.addEventListener("pointerdown", handle.pointerdown);
	document.addEventListener("pointermove", handle.pointermove);
	document.addEventListener("pointerup", handle.pointerup);
	document.addEventListener("pointercancel", handle.pointercancel);
	window.addEventListener("blur", handle.blur);
	w.addEventListener("disable", handle.disable);

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
