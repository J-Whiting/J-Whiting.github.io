let vDeferredPrompt;
let vSnackbarOpen = true;
let vInstalled = true;
let vStandalone = false;

this.navigation;

document.addEventListener('DOMContentLoaded', (event) => {
	this.navigation = document.querySelector('#navigation');

	/*
	// Hi
	let me = {
		name: 'Joshua Bee',
		role: 'Software Developer',
		skills: [
			'Being Awesome'
		],
		based_in: 'Hull, UK'
	};
	*/
	/*
	let me = new Person();
	me.name = 'Joshua Bee';
	*/

	const editor = new Editor(document.querySelector('[data-editor]'));
	editor.show();

	const typewriter = new Typewriter(document.querySelector('[data-typewriter]'));
	/*typewriter.write(
`<span class="comment-highlight" data-highlight="comment">// Hi &#x1F44B</span>
<span class="comment-highlight">// Let me introduce myself...</span>
<span class="declaration-highlight">let</span> <span class="variable-highlight">me</span> = <span class="brace-highlight">{</span>
    <span class="property-highlight">name</span>: <span class="string-highlight">'Joshua Bee'</span>,
    <span class="property-highlight">role</span>: <span class="string-highlight">'Software Developer'</span>,
    <span class="property-highlight">skills</span>: [
        <span class="string-highlight">'Being Awesome'</span>
    ],
    <span class="property-highlight">based_in</span>: <span class="string-highlight">'Hull, UK'</span>,
};`
	);*/
	typewriter.write(
`<span data-highlight="comment">// Hi &#x1F44B;</span>
<span data-highlight="comment">// Let me introduce myself...</span>
<span data-highlight="declaration">let</span> <span data-highlight="variable">me</span> = <span data-highlight="declaration">new</span> <span data-highlight="type">Person</span>();
<span data-highlight="variable">me</span>.<span data-highlight="variable">name</span> = <span data-highlight="string">'Joshua Bee'</span>;`
	);



	// Make Backgrounds
	const parallaxLevels = document.querySelectorAll('[data-parallax-level]');
	const shapeCount = 10;
	const totalShapeCount = shapeCount * parallaxLevels.length;

	const colorMin = 0;
	const colorMax = 360;
	const colorSegment = (colorMax - colorMin) / totalShapeCount;
	const colorArray = [];

	const radiusMin = 25;
	const radiusMax = 100;
	const radiusSegment = (radiusMax - radiusMin) / totalShapeCount;
	const radiusArray = [];
	for (let i = 0; i < totalShapeCount; i++) {
		colorArray.push(colorMin + (i * colorSegment) + (colorSegment * Math.random()));
		radiusArray.push(radiusMin + (i * radiusSegment) + (radiusSegment * Math.random()));
	}

	parallaxLevels.forEach(parallaxLevel => {
		for (let i = 0; i < shapeCount; i++) {

			// Get the height and width of the browser.
			const g = document.getElementsByTagName('body')[0];
			const browserHeight = 1.3 * (window.innerHeight || doc.clientHeight || g.clientHeight);
			const browserWidth = window.innerWidth || doc.clientWidth || g.clientWidth;

			// Define the parameters of the shapes
			const x = Math.random() * browserWidth;
			const y = Math.random() * browserHeight;
			const r = radiusArray.pop();
			const color = colorArray.splice(Math.floor(Math.random() * colorArray.length), 1);

			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute("width", 2 * r);
			svg.setAttribute("height", 2 * r);
			svg.style.position = 'absolute';
			svg.style.left = `${ x }px`;
			svg.style.top = `${ y }px`;

			const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			//circle.setAttributeNS(null, "id", "mycircle");
			circle.setAttributeNS(null, "cx", r);
			circle.setAttributeNS(null, "cy", r);
			circle.setAttributeNS(null, "r", r);
			//circle.setAttributeNS(null, "fill", rainbow(i, shapeCount));
			circle.setAttributeNS(null, "fill", `hsla(${ Math.random() * 360 }, 100%, 50%, 1)`);
			circle.setAttributeNS(null, "stroke", "none");

			svg.appendChild(circle);
			parallaxLevel.appendChild(svg);		
		}
	});

	const parallax = new Parallax(parallaxLevels);

	document.getElementById('snackbar-close').addEventListener('click', (event) => {
		vSnackbarOpen = false;
		document.getElementById('snackbar').setAttribute('aria-hidden', 'true');
	});
	
	if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
		console.log('display-mode is standalone');
		vStandalone = true;
	}

	// Add scroll link events
	let scrollElements = document.querySelectorAll('[data-scroll-to]');
	scrollElements.forEach((element) => {
		element.addEventListener('click', (event) => {
			event.preventDefault();

			this.navigation.setAttribute('data-visible', false);

			let scrollElement = document.getElementById(event.currentTarget.dataset.scrollTo);

			window.scrollTo({
				top: scrollElement.offsetTop,
				behavior: 'smooth'
			});
		});
	});

	// Add Card events
	let cards = document.querySelectorAll('[data-cards]');
	cards.forEach((card) => {
		card.addEventListener('click', (event) => {
			let card = event.currentTarget;
			let cards = document.querySelectorAll(`[data-cards="${ card.dataset.cards }"`);

			cards.forEach((card) => {
				card.setAttribute('aria-expanded', false);
			});
			card.setAttribute('aria-expanded', true);
		});
	});

	let drawerToggle = document.querySelector('[data-drawer-toggle]');
	drawerToggle.addEventListener('click', (event) => {
		let key = drawerToggle.dataset.drawerToggle;
		let element = document.querySelector(`[data-drawer="${ key }"]`);
		if (element.getAttribute('data-visible') === 'true') {
			element.setAttribute('data-visible', false);
		} else {
			element.setAttribute('data-visible', true);
		}
	});

	//
	// Updating selected nav tab based on scroll position.
	//
	vNavItems = document.querySelectorAll('.navigation__item');
	vActiveID = -1;
	window.addEventListener('scroll', (event) => {
		// Open snackbar upon scroll
		if (!vInstalled && !vStandalone && vSnackbarOpen) {
			document.getElementById('snackbar').setAttribute('aria-hidden', 'false');
		}
		
		let doc = document.documentElement;
		let vScroll = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

		// Get the height of the browser.
		let g = document.getElementsByTagName('body')[0];
		let vBrowserHeight = window.innerHeight || doc.clientHeight || g.clientHeight;

		// Get the sheet height.
		let vNavID = Math.floor(vScroll / vBrowserHeight);
		vNavID--;
	
		// Only update the classes if they change.
		if (vNavID != vActiveID) {
			let vNavItem;
			for (let i = 0; i < vNavItems.length; i++) {

				vNavItem = vNavItems[i];
				if (i == vNavID) {
					vNavItem.classList.add('navigation__item--selected');
				}
				else {
					vNavItem.classList.remove('navigation__item--selected');
				}
			}

			// Update the active tab id.
			vActiveID = vNavID;
		}
	});
});

function rainbow(step, numOfSteps) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}

// https://developers.google.com/web/ilt/pwa/lab-offline-quickstart#52_activating_the_install_prompt
window.addEventListener('beforeinstallprompt', (event) => {
	
	// The application is not installed
	vInstalled = false;

	// Prevent Chrome 67 and earlier from automatically showing the prompt
	event.preventDefault();

	// Stash the event so it can be triggered later.
	vDeferredPrompt = event;

	// Attach the install prompt to a user gesture
	document.getElementById('snackbar-action').addEventListener('click', (event) => {

		// Show the prompt
		vDeferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		vDeferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			}
			else {
				console.log('User dismissed the A2HS prompt');
			}
			vDeferredPrompt = null;
		});
	});
});

// When the app is installed it should remove the install snackbar
window.addEventListener('appinstalled', (event) => {
	console.log('a2hs installed');
	vInstalled = true;
	vStandalone = true;
	document.getElementById('snackbar').setAttribute('aria-hidden', 'true');
});