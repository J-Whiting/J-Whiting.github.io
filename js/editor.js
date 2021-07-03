class Editor {

	constructor(element) {
		this.$element = element;
	}

	show() {
		this.$element.setAttribute('aria-hidden', 'false');
	}

	hide() {
		this.$element.setAttribute('aria-hidden', 'true');
	}
}