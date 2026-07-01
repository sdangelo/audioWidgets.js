/*
 * Copyright (C) 2026 Stefano D'Angelo <zanga.mail@gmail.com>
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

audioWidgets.pad = Object.create(audioWidgets.widget);

// Read/write
audioWidgets.pad.thumbWidth = NaN;
audioWidgets.pad.thumbHeight = NaN;

// Read-only
audioWidgets.pad.valueX = NaN;
audioWidgets.pad.valueY = NaN;
audioWidgets.pad.thumbPositionX = NaN;
audioWidgets.pad.thumbPositionY = NaN;
audioWidgets.pad.minThumbPositionX = NaN;
audioWidgets.pad.maxThumbPositionX = NaN;
audioWidgets.pad.minThumbPositionY = NaN;
audioWidgets.pad.maxThumbPositionY = NaN;

// Private
audioWidgets.pad.k0X = NaN;
audioWidgets.pad.k1X = NaN;
audioWidgets.pad.k0invX = NaN;
audioWidgets.pad.k1invX = NaN;
audioWidgets.pad.k0Y = NaN;
audioWidgets.pad.k1Y = NaN;
audioWidgets.pad.k0invY = NaN;
audioWidgets.pad.k1invY = NaN;

// Public

// to be called when changing width, height, thumbWidth, thumbHeight.
audioWidgets.pad.update = function () {
	this.minThumbPositionX = 0.5 * this.thumbWidth;
	this.minThumbPositionY = 0.5 * this.thumbHeight;
	this.maxThumbPositionX = this.width - this.minThumbPositionX;
	this.maxThumbPositionY = this.height - this.minThumbPositionY;
	this.k1invX = this.width - this.thumbWidth;
	this.k1X = 1 / this.k1invX;
	this.k0X = -0.5 * this.thumbWidth * this.k1X;
	this.k0invX = -this.k1invX * this.k0X;
	this.k1invY = this.height - this.thumbHeight;
	this.k1Y = 1 / this.k1invY;
	this.k0Y = -0.5 * this.thumbHeight * this.k1Y;
	this.k0invY = -this.k1invY * this.k0Y;
	this.setValue(this.valueX, this.valueY);
};

audioWidgets.pad.thumbPositionIsValid = function (thumbPositionX,
						  thumbPositionY) {
	return thumbPositionX >= this.minThumbPositionX
	       && thumbPositionX <= this.maxThumbPositionX
	       && thumbPositionY >= this.minThumbPositionY
	       && thumbPositionY <= this.maxThumbPositionY;
};

audioWidgets.pad.setValue = function (valueX, valueY) {
	this.valueX = valueX;
	this.valueY = valueY;
	this.thumbPositionX = this.k1invX * this.valueX + this.k0invX;
	this.thumbPositionY = this.k1invY * this.valueY + this.k0invY;
};

audioWidgets.pad.setThumbPosition = function (thumbPositionX, thumbPositionY) {
	this.setValue(this.k1X * thumbPositionX + this.k0X,
		      this.k1Y * thumbPositionY + this.k0Y);
};

audioWidgets.pad.draw = function () {
	this.ctx.save();

	this.ctx.beginPath();
	this.ctx.rect(this.x, this.y, this.width, this.height);
	this.ctx.clip();

	if (this.disabled)
		this.ctx.fillStyle = "#ccc";
	else if (this.activeCount != 0)
		this.ctx.fillStyle = "#700";
	else if (this.hoverCount != 0)
		this.ctx.fillStyle = "#f77";
	else
		this.ctx.fillStyle = "#f00";

	this.ctx.beginPath();
	this.ctx.ellipse(
		this.x + this.thumbPositionX, this.y + this.height - this.thumbPositionY,
		0.5 * this.thumbWidth, 0.5 * this.thumbHeight,
		0, 0, 2 * Math.PI);
	this.ctx.fill();

	this.ctx.restore();
};
