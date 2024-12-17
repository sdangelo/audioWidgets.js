class AWMeter extends HTMLElement {
	static get observedAttributes() {
		return ["width", "height", "disabled", "value", "vertical"];
	}

	constructor() {
		super();
		this.width = 300;
		this.height = 150;
		this._disabled = false;
		this.widget = Object.create(audioWidgets.meter);
		this.widget.init();
		this.widget.x = 0;
		this.widget.y = 0;
		this.widget.setDisabled(this._disabled);
		this.widget.setValue(0.5);
		this.widget.vertical = false;
		let _self = this;
		this.widget.addEventListener("click", function (e) {
			e.stopPropagation();
			e = new CustomEvent("click", { bubbles: true, cancelable: true });
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
		this.widget.clear();
		this.widget.draw();
	}

	updateStyle() {
		this.sheet.replaceSync(":host { " + (this._disabled ? "pointer-events: none; ": "") + "width: " + this.canvas.width + "px; height: " + this.canvas.height + "px }");
	}

	connectedCallback() {
		this.shadow = this.attachShadow({ mode: "closed" });
		this.sheet = new CSSStyleSheet();
		this.shadow.adoptedStyleSheets = [this.sheet];
		this.canvas = document.createElement("canvas");
		this.shadow.appendChild(this.canvas);
		this.widget.ctx = this.canvas.getContext("2d");
		this.widget.addPointerIn();
		this.resize();
		this.shadow.addEventListener("click", function (e) {
			e.stopPropagation();
		});
	}

	attributeChangedCallback(property, oldValue, newValue) {
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
		case "value":
			var v = parseFloat(newValue);
			if (!isNaN(v)) {
				this.widget.setValue(Math.min(Math.max(v, 0), 1));
				this.update();
			}
			break;
		case "vertical":
			this.widget.vertical = newValue == "" || newValue == "true";
			this.update();
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

	get value() {
		return this.widget.value;
	}

	set value(value) {
		this.setAttribute("value", "" + value);
	}
}
