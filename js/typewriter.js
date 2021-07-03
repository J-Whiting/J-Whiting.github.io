class Typewriter {
	speed = 10; // Character per second
	$element;
	timeout;
	delay = 2000;
	text;

	cursorPosition = 0;
	tag = '';
	emoji = '';
	writingTag = false;
	writingEmoji = false;
	tagOpen = false;
	emojiOpen = false;
	typeSpeed = 100;
    tempTypeSpeed = 0;

	constructor(element) {
		this.$element = element;
		//this.text = element.dataset.typewriterText;

		element.innerHTML = '';

		this.write = this.write.bind(this);
		this.writeCharacter = this.writeCharacter.bind(this);
		this.preWrite = this.preWrite.bind(this);
		this.postWrite = this.postWrite.bind(this);

		this.$element.addEventListener('click', () => {
			clearTimeout(this.timeout);
			this.$element.innerHTML = this.text;
			this.postWrite();
		});
	}

	write(text) {
		this.text = text;
		//this.writeCharacter();
		this.timeout = setTimeout(this.writeCharacter, this.delay);
	}

	writeCharacter() {
		if (this.writingTag) {
			this.tag += this.text[this.cursorPosition];
		}

		if (this.writingEmoji) {
			this.emoji += this.text[this.cursorPosition];
		}

		if (this.text[this.cursorPosition] === '<') {
			this.tempTypeSpeed = 0;

			if (this.tagOpen) {
				this.tagOpen = false;
				this.writingTag = true;
			}
			else {
				this.tag = '';
				this.tagOpen = true;
				this.writingTag = true;
				this.tag += this.text[this.cursorPosition];
			}
		}

		if (this.text.substring(this.cursorPosition, this.cursorPosition + 3) === '&#x') {
			var emoji = this.text.substring(this.cursorPosition, this.cursorPosition + 9);
			this.cursorPosition += 9;
			var test = this.text[this.cursorPosition];
			if (this.tagOpen) {
				this.tag.innerHTML += emoji;
			}
			else {
				this.$element.innerHTML += emoji;
			}
			this.timeout = setTimeout(this.writeCharacter, this.tempTypeSpeed);
			return;
		}

		if (!this.writingTag && this.tagOpen) {
			this.tag.innerHTML += this.text[this.cursorPosition];
		}

		if (!this.writingTag && !this.tagOpen) {
			if (this.text[this.cursorPosition] === ' ') {
				this.tempTypeSpeed = 0;
			}
			else {
				this.tempTypeSpeed = (Math.random() * this.typeSpeed) + 50;
			}
			this.$element.innerHTML += this.text[this.cursorPosition];
		}

		if (this.writingTag && this.text.substring(this.cursorPosition - 1, this.cursorPosition + 1) === '/>') {
			this.writingTag = false;

			if (this.tagOpen) {
				this.tagOpen = false;
				this.$element.insertAdjacentHTML('beforeEnd', this.tag);
				//this.tag = this.$element.lastChild;
			}
		}

		if (this.writingTag && this.text[this.cursorPosition] === '>') {
			this.tempTypeSpeed = (Math.random() * this.typeSpeed) + 50;
			this.writingTag = false;

			if (this.tagOpen) {
				this.$element.insertAdjacentHTML('beforeEnd', this.tag);
				this.tag = this.$element.lastChild;
			}
		}

		this.cursorPosition += 1;
		if (this.cursorPosition < this.text.length) {
			this.timeout = setTimeout(this.writeCharacter, this.tempTypeSpeed);
		}
		else {
			setTimeout(this.postWrite, 500);
		}
	}

	preWrite() {
		this.$element.dataset.typewriterCursorBlink = false;
	}

	postWrite() {
		this.$element.dataset.typewriterCursorBlink = true;
	}
}