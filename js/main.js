// Elements
let $cards;
let $header;
let $drawerToggle;
let $updateSnackbar;
let $updateSnackbarAction;
let $updateSnackbarClose;
let $installSnackbar;
let $installSnackbarAction;
let $installSnackbarClose;
let $navigation;
let $navItems;
let $scrollElements;

// Variables
let vActiveID = -1;
let vDeferredPrompt;
let appInstalled = true;
let appStandalone = false;
let userScrolled = false;

document.addEventListener('DOMContentLoaded', (event) => {

	// Elements
	$cards = document.querySelectorAll('[data-cards]');
	$drawerToggle = document.querySelector('[data-drawer-toggle]');
	$header = document.querySelector('header.header');
	$updateSnackbar = document.querySelector('#update-snackbar');
	$updateSnackbarAction = $updateSnackbar.querySelector('.snackbar__action');
	$updateSnackbarClose = $updateSnackbar.querySelector('.snackbar__close');
	$installSnackbar = document.querySelector('#install-snackbar');
	$installSnackbarAction = $installSnackbar.querySelector('.snackbar__action');
	$installSnackbarClose = $installSnackbar.querySelector('.snackbar__close');
	$navigation = document.querySelector('#navigation');
	$navItems = document.querySelectorAll('.navigation__item');
	$scrollElements = document.querySelectorAll('[data-scroll-to]');

	if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
		console.log('display-mode is standalone');
		appStandalone = true;
	}

	// Add event listeners
	$updateSnackbarAction.addEventListener('click', (event) => {
		window.location.reload();
	});

	$updateSnackbarClose.addEventListener('click', (event) => {
		$updateSnackbar.ariaHidden = true;
	});

	$installSnackbarClose.addEventListener('click', (event) => {
		$installSnackbar.ariaHidden = true;
	});

	// Add scroll link events
	$scrollElements.forEach(($element) => {
		$element.addEventListener('click', (event) => {
			event.preventDefault();

			$navigation.dataset.visible = false;

			const $scrollElement = document.getElementById(event.currentTarget.dataset.scrollTo);

			window.scrollTo({
				top: $scrollElement.offsetTop - $header.offsetHeight,
				behavior: 'smooth'
			});
		});
	});

	// Add Card events
	$cards.forEach(($card) => {
		$card.addEventListener('click', (event) => {
			let $cards = document.querySelectorAll(`[data-cards="${ $card.dataset.cards }"`);

			$cards.forEach(($card) => {
				$card.ariaExpanded = false;
			});
			$card.ariaExpanded = true;
		});
	});

	$drawerToggle.addEventListener('click', (event) => {
		let key = $drawerToggle.dataset.drawerToggle;
		let $element = document.querySelector(`[data-drawer="${ key }"]`);
		$element.dataset.visible = $element.dataset.visible !== 'true';
	});

	//
	// Updating selected nav tab based on scroll position.
	//
	window.addEventListener('scroll', (event) => {
		// Open snackbar upon scroll
		if (!appInstalled && !appStandalone && !userScrolled) {
			userScrolled = true;
			$installSnackbar.ariaHidden = false;
		}
		
		let doc = document.documentElement;
		let vScroll = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

		// Get the height of the browser.
		let g = document.getElementsByTagName('body')[0];
		let vBrowserHeight = window.innerHeight || doc.clientHeight || g.clientHeight;

		// Get the sheet height.
		let vSheetHeight = vBrowserHeight - $header.clientHeight;
		let vNavID = Math.floor(vScroll / vSheetHeight);
		vNavID--;
	
		// Only update the classes if they change.
		if (vNavID != vActiveID) {
			let $navItem;
			for (let i = 0; i < $navItems.length; i++) {

				$navItem = $navItems[i];
				if (i == vNavID) {
					$navItem.classList.add('navigation__item--selected');
				}
				else {
					$navItem.classList.remove('navigation__item--selected');
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
	appInstalled = false;

	// Prevent Chrome 67 and earlier from automatically showing the prompt
	event.preventDefault();

	// Stash the event so it can be triggered later.
	vDeferredPrompt = event;

	// Attach the install prompt to a user gesture
	$installSnackbarAction.addEventListener('click', (event) => {

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
	appInstalled = true;
	appStandalone = true;
	$installSnackbar.ariaHidden = true;
});