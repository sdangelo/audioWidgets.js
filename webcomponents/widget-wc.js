class AWWidget extends HTMLElement {
	static get observedAttributes() {
		return ["width", "height", "disabled"];
	}

	constructor() {
		super();
		this.width = 300;
		this.height = 150;
		this._disabled = false;
		this.widget = Object.create(audioWidgets.widget);
		this.widget.init();
		this.widget.x = 0;
		this.widget.y = 0;
		this.widget.setDisabled(this._disabled);
	}

	resize() {
		if (!this.shadow)
			return;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.widget.width = this.width;
		this.widget.height = this.height;
		this.update();
	}

	update() {
		if (!this.shadow)
			return;
		this.widget.clear();
		this.widget.draw();
	}

	connectedCallback() {
		this.shadow = this.attachShadow({ mode: "closed" });
		this.canvas = document.createElement("canvas");
		this.shadow.appendChild(this.canvas);
		this.widget.ctx = this.canvas.getContext("2d");
		this.widget.addPointerIn();
		this.resize();
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

	get disabled() {
		return this._disabled;
	}

	set disabled(value) {
		this.setAttribute("disabled", "" + value);
	}
}

customElements.define("aw-widget", AWWidget);
