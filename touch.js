/*
 * Copyright (C) 2023, 2024 Stefano D'Angelo <zanga.mail@gmail.com>
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

// TODO: this just redirects to mouse events, it should be properly done...

// Workaround: WKWebView dispatches touchstart instead of touchend with 4 finger touch gestures
(function () {
	audioWidgets.iOSTouchEndBugWorkaroundLast = 0;
	addEventListener("gestureend", function () {
		audioWidgets.iOSTouchEndBugWorkaroundLast = Date.now();
	});
})();

audioWidgets.widget.addTouchIn = function (mouseHandle) {
	var handle = { mouseHandle: mouseHandle };

	var w = this;

	handle.touchstart = function (event) {
		if (Date.now() - audioWidgets.iOSTouchEndBugWorkaroundLast < 10) {
			handle.touchend(event);
			return;
		}
		event.preventDefault();
		for (var i = 0; i < event.changedTouches.length; i++) {
			var e = {
				clientX:	event.changedTouches[i].clientX,
				clientY:	event.changedTouches[i].clientY,
				preventDefault:	function () {}
			};
			handle.mouseHandle.mousedown(e);
		}
	};

	handle.touchend = function (event) {
		event.preventDefault();
		for (var i = 0; i < event.changedTouches.length; i++) {
			var e = {
				clientX:	event.changedTouches[i].clientX,
				clientY:	event.changedTouches[i].clientY,
				preventDefault:	function () {}
			};
			handle.mouseHandle.mouseup(e);
		}
	};

	handle.touchmove = function (event) {
		event.preventDefault();
		for (var i = 0; i < event.changedTouches.length; i++) {
			var e = {
				clientX:	event.changedTouches[i].clientX,
				clientY:	event.changedTouches[i].clientY,
				preventDefault:	function () {}
			};
			handle.mouseHandle.mousemove(e);
		}
	};

	handle.touchcancel = function (event) {
	};

	w.ctx.canvas.addEventListener("touchstart", handle.touchstart);
	w.ctx.canvas.addEventListener("touchend", handle.touchend);
	w.ctx.canvas.addEventListener("touchmove", handle.touchmove);
	w.ctx.canvas.addEventListener("touchcancel", handle.touchstart);

	return handle;
};

audioWidgets.widget.removeTouchIn = function (handle) {
	this.ctx.canvas.removeEventListener("touchstart", handle.touchstart);
	this.ctx.canvas.removeEventListener("touchend", handle.touchend);
	this.ctx.canvas.removeEventListener("touchmove", handle.touchmove);
	this.ctx.canvas.removeEventListener("touchcancel", handle.touchstart);

	delete handle.touchstart;
	delete handle.touchend;
	delete handle.touchmove;
	delete handle.touchcancel;
};
