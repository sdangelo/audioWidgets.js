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

audioWidgets.slider = Object.create(audioWidgets.widget);

// Read/write
audioWidgets.slider.vertical = false;
audioWidgets.slider.thumbWidth = NaN;

// Read-only
audioWidgets.slider.value = NaN;
audioWidgets.slider.step = NaN;
audioWidgets.slider.thumbPosition = NaN;
audioWidgets.slider.minTumbPosition = NaN;
audioWidgets.slider.maxThumbPosition = NaN;

// Private
audioWidgets.slider.k0 = NaN;
audioWidgets.slider.k1 = NaN;
audioWidgets.slider.k0inv = NaN;
audioWidgets.slider.k1inv = NaN;

// Public

// to be called when changing width, height, vertical, thumbWidth.
audioWidgets.slider.update = function () {
	this.minThumbPosition = 0.5 * this.thumbWidth;
	if (this.vertical) {
		this.maxThumbPosition = this.height - this.minThumbPosition;
		this.k1inv = this.height - this.thumbWidth;
		this.k1 = 1 / this.k1inv;
	} else {
		this.maxThumbPosition = this.width - this.minThumbPosition;
		this.k1inv = this.width - this.thumbWidth;
		this.k1 = 1 / this.k1inv;
	}
	this.k0 = -0.5 * this.thumbWidth * this.k1;
	this.k0inv = -this.k1inv * this.k0;
	this.setValue(this.value);
};

audioWidgets.slider.thumbPositionIsValid = function (thumbPosition) {
	return thumbPosition >= this.minThumbPosition
	       && thumbPosition <= this.maxThumbPosition;
};

audioWidgets.slider.setValue = function (value) {
	this.value = this.step > 0 ? Math.round(value / this.step) * this.step
				   : value;
	this.thumbPosition = this.k1inv * this.value + this.k0inv;
};

audioWidgets.slider.setThumbPosition = function (thumbPosition) {
	this.setValue(this.k1 * thumbPosition + this.k0);
};

audioWidgets.slider.setStep = function (step) {
	this.step = step;
	this.setValue(this.value);
};

audioWidgets.slider.draw = function () {
	this.ctx.save();

	var ssThumb;
	var ssOn;
	var ssOff;
	if (this.disabled) {
		ssOn = "#dfa667";
		ssThumb = "#9f9f9f";
		this.ctx.fillStyle = "#cfcfcf";
	} else if (this.activeCount != 0) {
		ssOn = "#df6e00";
		ssThumb = "#3f3f3f";
		this.ctx.fillStyle = "#afafaf";
	} else if (this.hoverCount != 0) {
		ssOn = "#ff8e00";
		ssThumb = "#6f6f6f";
		this.ctx.fillStyle = "#efefef";
	} else {
		ssOn = "#ef7e00";
		ssThumb = "#9f9f9f";
		this.ctx.fillStyle = "#cfcfcf";
	}

	this.ctx.lineCap = "butt";

	if (this.vertical) {
		var xMid = this.x + 0.5 * this.width;
		var y2 = this.y + this.height;
		var y3 = y2 - this.thumbPosition;

		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = "#9f9f9f";
		this.ctx.beginPath();
		this.ctx.moveTo(xMid, this.y + 0.5 * this.thumbWidth);
		this.ctx.lineTo(xMid, y3);
		this.ctx.stroke();

		this.ctx.lineWidth = 3;
		this.ctx.strokeStyle = ssOn;
		this.ctx.beginPath();
		this.ctx.moveTo(xMid, y3);
		this.ctx.lineTo(xMid, y2 - 0.5 * this.thumbWidth);
		this.ctx.stroke();

		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = ssThumb;
		this.ctx.beginPath();
		this.ctx.rect(this.x + 0.5,
			      y3 - 0.5 * this.thumbWidth + 0.5,
			      this.width - 1, this.thumbWidth - 1);
		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.strokeStyle = "#000000";
		this.ctx.beginPath();
		this.ctx.moveTo(this.x, y3);
		this.ctx.lineTo(this.x + this.width, y3);
		this.ctx.stroke();
	} else {
		var yMid = this.y + 0.5 * this.height;
		var x2 = this.x + this.width;
		var x3 = this.x + this.thumbPosition;

		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = "#9f9f9f";
		this.ctx.beginPath();
		this.ctx.moveTo(x3, yMid);
		this.ctx.lineTo(x2 - 0.5 * this.thumbWidth, yMid);
		this.ctx.stroke();

		this.ctx.lineWidth = 3;
		this.ctx.strokeStyle = ssOn;
		this.ctx.beginPath();
		this.ctx.moveTo(this.x + 0.5 * this.thumbWidth, yMid);
		this.ctx.lineTo(x3, yMid);
		this.ctx.stroke();

		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = ssThumb;
		this.ctx.beginPath();
		this.ctx.rect(x3 - 0.5 * this.thumbWidth + 0.5, this.y + 0.5,
			      this.thumbWidth - 1, this.height - 1);
		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.strokeStyle = "#000000";
		this.ctx.beginPath();
		this.ctx.moveTo(x3, this.y);
		this.ctx.lineTo(x3, this.y + this.height);
		this.ctx.stroke();
	}

	this.ctx.restore();
};
