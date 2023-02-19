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

audioWidgets.button = Object.create(audioWidgets.widget);

// Read/write
audioWidgets.button.toggled = false;

// Public

audioWidgets.button.draw = function () {
	this.ctx.save();

	this.ctx.beginPath();
	this.ctx.rect(this.x, this.y, this.width, this.height);
	this.ctx.clip();

	if (this.toggled) {
		if (this.disabled) {
			this.ctx.strokeStyle = "#9f9f9f";
			this.ctx.fillStyle = "#dfa667";
		} else if (this.hoverCount != 0) {
			if (this.activeCount != 0) {
				this.ctx.strokeStyle = "#3f3f3f";
				this.ctx.fillStyle = "#df6e00";
			} else {
				this.ctx.strokeStyle = "#6f6f6f";
				this.ctx.fillStyle = "#ff8e00";
			}
		} else if (this.activeCount != 0) {
			this.ctx.strokeStyle = "#3f3f3f";
			this.ctx.fillStyle = "#ef7e00";
		} else {
			this.ctx.strokeStyle = "#9f9f9f";
			this.ctx.fillStyle = "#ef7e00";
		}
	} else {
		if (this.disabled) {
			this.ctx.strokeStyle = "#9f9f9f";
			this.ctx.fillStyle = "#afafaf";
		} else if (this.hoverCount != 0) {
			if (this.activeCount != 0) {
				this.ctx.strokeStyle = "#3f3f3f";
				this.ctx.fillStyle = "#afafaf";
			} else {
				this.ctx.strokeStyle = "#6f6f6f";
				this.ctx.fillStyle = "#efefef";
			}
		} else if (this.activeCount != 0) {
			this.ctx.strokeStyle = "#3f3f3f";
			this.ctx.fillStyle = "#cfcfcf";
		} else {
			this.ctx.strokeStyle = "#9f9f9f";
			this.ctx.fillStyle = "#cfcfcf";
		}
	}

	this.ctx.lineWidth = 1;

	this.ctx.beginPath();
	this.ctx.rect(this.x + 0.5, this.y + 0.5,
		      this.width - 1, this.height - 1);
	this.ctx.fill();
	this.ctx.stroke();

	this.drawContent();

	this.ctx.restore();
};

audioWidgets.button.drawContent = function () {};
