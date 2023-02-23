/*
 * Copyright (C) 2023 Stefano D'Angelo <zanga.mail@gmail.com>
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

audioWidgets.meter = Object.create(audioWidgets.widget);

// Read/write
audioWidgets.meter.vertical = false;

// Read-only
audioWidgets.meter.value = NaN;

// Public

audioWidgets.meter.setValue = function (value) {
	this.value = value;
};

audioWidgets.meter.draw = function () {
	this.ctx.save();

	this.ctx.beginPath();
	this.ctx.rect(this.x, this.y, this.width, this.height);
	this.ctx.clip();

	this.ctx.lineCap = "butt";
	this.ctx.lineWidth = 1;

	this.ctx.fillStyle = "#ffffff";
	this.ctx.beginPath();
	this.ctx.rect(this.x, this.y, this.width, this.height);
	this.ctx.fill();

	this.ctx.fillStyle = this.disabled ? "#dfa667" : "#ef7e00";
	this.ctx.beginPath();
	if (this.vertical)
		this.ctx.rect(this.x + 0.5, this.y + 0.5 + (this.height - 1) * (1 - this.value), this.width - 1, this.height - 1);
	else
		this.ctx.rect(this.x + 0.5, this.y + 0.5, (this.width - 1) * this.value, this.height - 1);
	this.ctx.fill();
	
	this.ctx.strokeStyle = "#9f9f9f";
	this.ctx.beginPath();
	this.ctx.rect(this.x + 0.5, this.y + 0.5, this.width - 1, this.height - 1);
	this.ctx.stroke();

	this.ctx.restore();
};
