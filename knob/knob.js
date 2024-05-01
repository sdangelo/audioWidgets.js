/*
 * Copyright (C) 2015, 2024 Stefano D'Angelo <zanga.mail@gmail.com>
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

audioWidgets.knob = Object.create(audioWidgets.widget);

// Read/write
audioWidgets.knob.minAngle = NaN;
audioWidgets.knob.maxAngle = NaN;

// Read-only
audioWidgets.knob.value = NaN;
audioWidgets.knob.step = NaN;
audioWidgets.knob.angle = NaN;
audioWidgets.knob.centerX = NaN;
audioWidgets.knob.centerY = NaN;
audioWidgets.knob.radius = NaN;

// Private
audioWidgets.knob.k0 = NaN;
audioWidgets.knob.k0wrap = NaN;
audioWidgets.knob.k1 = NaN;
audioWidgets.knob.k0inv = NaN;
audioWidgets.knob.k0wrapinv = NaN;
audioWidgets.knob.k1inv = NaN;

// Public

// to be called when changing width, height, minAngle, maxAngle.
audioWidgets.knob.update = function () {
	this.centerX = this.x + 0.5 * this.width;
	this.centerY = this.y + 0.5 * this.height;
	this.radius = 0.5 * (this.width > this.height ? this.width
						      : this.height);
	if (this.maxAngle > this.minAngle) {
		this.k1inv = this.maxAngle - this.minAngle - Math.PI - Math.PI;
		this.k1 = 1 / this.k1inv;
		this.k0wrap = 1 - this.k1 * this.maxAngle;
		this.k0wrapinv = -this.k1inv * this.k0wrap;
	} else {
		this.k1inv = this.maxAngle - this.minAngle;
		this.k1 = 1 / this.k1inv;
		this.k0wrap = NaN;
		this.k0wrapinv = NaN;
	}
	this.k0 = -this.k1 * this.minAngle;
	this.k0inv = -this.k1inv * this.k0;
	this.setValue(this.value);
};

audioWidgets.knob.angleIsValid = function (angle) {
	return this.maxAngle > this.minAngle
	       ? angle <= this.minAngle || angle >= this.maxAngle
	       : angle <= this.minAngle && angle >= this.maxAngle;
};

audioWidgets.knob.setValue = function (value) {
	this.value = this.step > 0 ? Math.round(value / this.step) * this.step
				   : value;
	if (this.maxAngle > this.minAngle)
		this.angle = this.k1inv * this.value
			     + (this.value <= this.k0inv
				? this.k0inv : this.k0wrapinv);
	else
		this.angle = this.k1inv * this.value + this.k0inv;
};

audioWidgets.knob.setAngle = function (angle) {
	var value;
	if (this.maxAngle > this.minAngle)
		value = this.k1 * angle
			+ (angle >= this.maxAngle
			   ? this.k0wrap : this.k0);
	else
		value = this.k1 * angle + this.k0;
	this.setValue(value);
	return value;
};

audioWidgets.knob.setStep = function (step) {
	this.step = step;
	this.setValue(this.value);
};

audioWidgets.knob.draw = function () {
	this.ctx.save();

	this.ctx.beginPath();
	this.ctx.rect(this.x, this.y, this.width, this.height);
	this.ctx.clip();

	var fsOn;
	var fsOff;
	var ssOut;
	if (this.disabled) {
		fsOn = "#dfa667";
		ssOut = "#9f9f9f";
	} else if (this.activeCount != 0) {
		fsOn = "#df6e00";
		ssOut = "#3f3f3f";
	} else if (this.hoverCount != 0) {
		fsOn = "#ff8e00";
		ssOut = "#6f6f6f";
	} else {
		fsOn = "#ef7e00";
		ssOut = "#9f9f9f";
	}

	this.ctx.lineCap = "butt";

	var r1 = 2 / 3 * this.radius;
	var r2 = (this.radius + r1 + r1) / 3;

	var c = Math.cos(this.angle);
	var s = Math.sin(this.angle);

	this.ctx.fillStyle = "#cfcfcf";
	this.ctx.beginPath();
	this.ctx.moveTo(this.centerX + r2 * c, this.centerY - r2 * s);
	this.ctx.arc(this.centerX, this.centerY, this.radius,
		     -this.angle, -this.maxAngle, false);
	this.ctx.lineTo(this.centerX + r2 * Math.cos(this.maxAngle),
			this.centerY - r2 * Math.sin(this.maxAngle));
	this.ctx.arc(this.centerX, this.centerY, r2,
		     -this.maxAngle, -this.angle, true);
	this.ctx.closePath();
	this.ctx.fill();

	this.ctx.fillStyle = fsOn;
	this.ctx.beginPath();
	this.ctx.moveTo(this.centerX + r1 * Math.cos(this.minAngle),
			this.centerY - r1 * Math.sin(this.minAngle));
	this.ctx.arc(this.centerX, this.centerY, this.radius,
		     -this.minAngle, -this.angle, false);
	this.ctx.lineTo(this.centerX + r1 * c,
			this.centerY - r1 * s);
	this.ctx.arc(this.centerX, this.centerY, r1,
		     -this.angle, -this.minAngle, true);
	this.ctx.closePath();
	this.ctx.fill();

	this.ctx.lineWidth = 1;
		
	this.ctx.strokeStyle = ssOut;
	this.ctx.beginPath();
	this.ctx.arc(this.centerX, this.centerY, this.radius - 0.5,
		     -this.minAngle, -this.maxAngle, false);
	this.ctx.stroke();

	this.ctx.strokeStyle = "#000";
	this.ctx.beginPath();
	this.ctx.moveTo(this.centerX, this.centerY);
	this.ctx.lineTo(this.centerX + this.radius * c,
			this.centerY - this.radius * s);
	this.ctx.stroke();

	this.ctx.restore();
};

audioWidgets.knob.isOver = function (x, y) {
	x -= this.radius;
	y -= this.radius;
	return x * x + y * y < this.radius * this.radius;
};
