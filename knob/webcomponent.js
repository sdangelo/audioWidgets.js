/*
 * Copyright (C) 2024, 2025 Stefano D'Angelo <zanga.mail@gmail.com>
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

class AWKnob extends HTMLElement {
	static get observedAttributes() {
		return ["width", "height", "disabled", "value", "step", "min-angle", "max-angle", "pointer-map", "sensitivity", "middle-sensitivity", "right-sensitivity"];
	}

	constructor() {
		super();
		this.width = 300;
		this.height = 150;
		this._disabled = false;
		this.widget = Object.create(audioWidgets.knob);
		this.widget.init();
		this.widget.x = 0;
		this.widget.y = 0;
		this.widget.setDisabled(this._disabled);
		this.widget.setValue(0.5);
		this.widget.setStep(0);
		this.widget.minAngle = 1.25 * Math.PI;
		this.widget.maxAngle = 1.75 * Math.PI;
		this.pointerMap = "radial";
		this.widget.sensitivity = 1.0;
		this.widget.middleSensitivity = 0.5;
		this.widget.rightSensitivity = 0.1;
		let _self = this;
		this.widget.addEventListener("input", function (e) {
			e.stopPropagation();
			e = new CustomEvent("input", { bubbles: true });
			_self.dispatchEvent(e);
		});
		this.widget.addEventListener("click", function (e) {
			e.stopPropagation();
			e = new CustomEvent("click", { bubbles: true, cancelable: true, detail: e.detail });
			_self.dispatchEvent(e);
		});
	}

	resize() {
		if (!this.shadow)
			return;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.widget.width = this.width;
		this.widget.height = this.height;
		this.updateStyle();
		this.update();
	}

	update() {
		if (!this.shadow)
			return;
		this.widget.update();
		this.widget.clear();
		this.widget.draw();
	}

	updateStyle() {
		this.sheet.replaceSync(":host { " + (this._disabled ? "pointer-events: none; ": "") + "width: " + this.canvas.width + "px; height: " + this.canvas.height + "px }");
	}

	_pointerMapCustom(x, y, prevX, prevY, vValue) {
		return this.pointerMapCustom(x, y, prevX, prevY, vValue);
	}

	updatePointerMap() {
		if (!this.pointerHandle)
			return;
		switch (this.pointerMap) {
		case "radial":
			this.pointerHandle.map = audioWidgets.knob.mapRadial;
			break;
		case "vertical-differential":
			this.pointerHandle.map = audioWidgets.knob.mapVerticalDifferential;
			break;
		case "custom":
			this.pointerHandle.map = this._pointerMapCustom;
			break;
		default:
			this.pointerHandle.map = null;
			break;
		}
	}

	connectedCallback() {
		if (!this.shadow) {
			this.shadow = this.attachShadow({ mode: "closed" });
			this.sheet = new CSSStyleSheet();
			this.shadow.adoptedStyleSheets = [this.sheet];
			this.canvas = document.createElement("canvas");
			this.shadow.appendChild(this.canvas);
			this.widget.ctx = this.canvas.getContext("2d");
			this.pointerHandle = this.widget.addPointerIn();
			this.updatePointerMap();
			this.shadow.addEventListener("click", function (e) {
				e.stopPropagation();
			});
		}
		this.resize();
	}

	attributeChangedCallback(property, oldValue, newValue) {
		if (property == "value") {
			this.value = newValue;
			return;
		}
		if (oldValue == newValue)
			return;
		switch (property) {
		case "width":
			var v = parseInt(newValue);
			if (!isNaN(v)) {
				this.width = Math.max(v, 1);
				this.resize();
			}
			break;
		case "height":
			var v = parseInt(newValue);
			if (!isNaN(v)) {
				this.height = Math.max(v, 1);
				this.resize();
			}
			break;
		case "disabled":
			this._disabled = newValue == "" || newValue == "true";
			this.widget.setDisabled(this._disabled);
			this.updateStyle();
			this.update();
			break;
		case "step":
			var v = parseFloat(newValue);
			if (!isNaN(v)) {
				this.widget.setStep(Math.max(v, 0));
				this.update();
			}
			break;
		case "min-angle":
			var v = parseFloat(newValue);
			if (!isNaN(v)) {
				this.widget.minAngle = v;
				this.update();
			}
			break;
		case "max-angle":
			var v = parseFloat(newValue);
			if (!isNaN(v)) {
				this.widget.maxAngle = v;
				this.update();
			}
			break;
		case "pointer-map":
			this.pointerMap = newValue;
			this.updatePointerMap();
			break;
		case "sensitivity":
			var v = parseFloat(newValue);
			if (!isNaN(v))
				this.widget.sensitivity = v;
			break;
		case "middle-sensitivity":
			var v = parseFloat(newValue);
			if (!isNaN(v))
				this.widget.middleSensitivity = v;
			break;
		case "right-sensitivity":
			var v = parseFloat(newValue);
			if (!isNaN(v))
				this.widget.rightSensitivity = v;
			break;
		}
	}

	get draw() {
		return this.widget.draw;
	}

	set draw(value) {
		this.widget.draw = value;
	}

	get isOver() {
		return this.widget.isOver;
	}

	set isOver(value) {
		this.widget.isOver = value;
	}

	get disabled() {
		return this._disabled;
	}

	set disabled(value) {
		this.setAttribute("disabled", "" + value);
	}

	get hoverCount() {
		return this.widget.hoverCount;
	}

	get activeCount() {
		return this.widget.activeCount;
	}

	get value() {
		return this.widget.value;
	}

	set value(value) {
		value = parseFloat(value);
		if (isNaN(value))
			return;
		this.widget.setValue(Math.min(Math.max(value, 0), 1));
		this.update();
	}

	get step() {
		return this.widget.step;
	}

	set step(value) {
		this.setAttribute("step", "" + value);
	}
}
