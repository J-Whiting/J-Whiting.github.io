let vDeferredPrompt;
let vSnackbarOpen = true;
let vInstalled = true;
let vStandalone = false;

document.addEventListener('DOMContentLoaded', (event) => {	
	document.getElementById('snackbar-close').addEventListener('click', (event) => {
		vSnackbarOpen = false;
		document.getElementById('snackbar').classList.remove('snackbar--active');
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

			let scrollElement = document.getElementById(event.currentTarget.dataset.scrollTo);
			let header = document.querySelector('header');

			window.scrollTo({
				top: scrollElement.offsetTop - header.offsetHeight,
				behavior: 'smooth'
			});
		});
	});

	// Add Card events
	let cards = document.querySelectorAll('[data-cards]');
	cards.forEach((card) => {
		card.addEventListener('click', (event) => {
			event.preventDefault();

			let card = event.currentTarget;
			let cards = document.querySelectorAll(`[data-cards="${ card.dataset.cards }"`);

			cards.forEach((card) => {
				card.classList.remove('card--selected');
			});
			card.classList.add('card--selected');
		});
	});

	//
	// Updating selected nav tab based on scroll position.
	//
	vNavItems = document.querySelectorAll('.navigation__item');
	vActiveID = -1;
	window.addEventListener('scroll', (event) => {
		// Open snackbar upon scroll
		if (!vInstalled && !vStandalone && vSnackbarOpen) {
			document.getElementById('snackbar').classList.add('snackbar--active');
		}
		
		let doc = document.documentElement;
		let vScroll = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

		// Get the height of the browser.
		let g = document.getElementsByTagName('body')[0];
		let vBrowserHeight = window.innerHeight || doc.clientHeight || g.clientHeight;

		// Get the height of the header.
		let vHeader = document.getElementsByTagName('header')[0];
		let vHeaderHeight = vHeader.clientHeight;

		// Get the sheet height.
		let vSheetHeight = vBrowserHeight - vHeaderHeight;
		let vNavID = Math.floor(vScroll / vSheetHeight);
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
	document.getElementById('snackbar').classList.remove('snackbar--active');
});