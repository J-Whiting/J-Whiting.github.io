class Parallax {

	constructor(elements) {
		this.$elements = elements;

		this.bindEvents = this.bindEvents.bind(this);

		this.bindEvents();
	}

	bindEvents() {
		window.addEventListener('scroll', (event) => {
			const doc = document.documentElement;
			const scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

			this.$elements.forEach($element => {
				let level = $element.dataset.parallaxLevel;

				$element.style.transform = `translateY(-${ level * scrollTop / 2 }px)`;
			});

		});
	}
}