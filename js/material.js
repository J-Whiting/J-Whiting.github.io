/** Initialize MDC Web components. */
const buttons = document.querySelectorAll('.mdc-button');
for (const button of buttons) {
	mdc.ripple.MDCRipple.attachTo(button);
}