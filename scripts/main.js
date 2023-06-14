const prefersColorSchemeDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const prefersReducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

// Options
let prefersReducedMotion;

// Local Storage Settings
let settings = getSettingsFromLocalStorage();
applySettingsToPage();
applySettingsToModal();

// Constants
const SELECTORS = {
	FOCUSABLE: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, [tabindex="0"], [contenteditable]'
};

const STATE = {
	OPEN: 'open',
	CLOSED: 'closed',
};

// Elements
let $header;
let $drawerToggle;
let $updateSnackbar;
let $updateSnackbarAction;
let $updateSnackbarClose;
let $installSnackbar;
let $installSnackbarAction;
let $installSnackbarClose;
let $navigation;
let $navLinks;
let $overlay;
let $scrollElements;
let $modalElements;

// Variables
let vActiveID = -1;
let vDeferredPrompt;
let appInstalled = true;
let appStandalone = false;
let userScrolled = false;
let drawerKeyHandler;
let modalKeyHandler;

document.addEventListener('DOMContentLoaded', (event) => {

	// Elements
	$drawerToggle = document.querySelector('[data-drawer-toggle]');
	$header = document.querySelector('header.header');
	$updateSnackbar = document.querySelector('#update-snackbar');
	$updateSnackbarAction = $updateSnackbar.querySelector('.snackbar__action');
	$updateSnackbarClose = $updateSnackbar.querySelector('.snackbar__close');
	$installSnackbar = document.querySelector('#install-snackbar');
	$installSnackbarAction = $installSnackbar.querySelector('.snackbar__action');
	$installSnackbarClose = $installSnackbar.querySelector('.snackbar__close');
	$navigation = document.querySelector('#navigation');
	$navLinks = document.querySelectorAll('.navigation__link');
	$overlay = document.querySelector('#overlay');
	$scrollElements = document.querySelectorAll('[data-scroll-to]');
	$modalElements = document.querySelectorAll('[data-modal-open]');

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

	prefersColorSchemeDarkMediaQuery.addEventListener('change', () => {
		if (settings.theme === 'system') {
			const $body = document.querySelector('body');
			const theme = prefersColorSchemeDarkMediaQuery.matches ? 'dark': 'light';
			$body.dataset.theme = theme;
		}
	});

	prefersReducedMotionMediaQuery.addEventListener('change', () => {
		if (settings.reduceMotion === 'system') {
			const $body = document.querySelector('body');
			const prefersReducedMotion = prefersReducedMotionMediaQuery.matches;
			$body.dataset.prefersReducedMotion = prefersReducedMotion;
		}
	});

	// Add scroll link events
	$scrollElements.forEach(($element) => {
		$element.addEventListener('click', (event) => {
			event.preventDefault();

			$navigation.dataset.visible = false;

			const $scrollElement = document.getElementById(event.currentTarget.dataset.scrollTo);
			const options = {
				top: $scrollElement.offsetTop - $header.offsetHeight,
				behavior: 'smooth'
			}

			if (prefersReducedMotion) {
				options.behavior = 'auto';
			}

			window.scrollTo(options);

			if (prefersReducedMotion) {
				$scrollElement.focus();
			}
			else {
				setTimeout(() => {
					$scrollElement.focus();
				}, 1000);
			}
		});
	});

	// Add modal events
	$modalElements.forEach(($element) => {
		$element.addEventListener('click', (event) => {
			event.preventDefault();

			$navigation.dataset.visible = false;

			const $modal = document.getElementById(event.currentTarget.dataset.modalOpen);
			openModal($modal);
		});
	});

	$drawerToggle.addEventListener('click', (event) => {
		const key = $drawerToggle.dataset.drawerToggle;
		const $drawer = document.querySelector(`[data-drawer="${ key }"]`);

		if ($drawer.dataset.visible === 'true') {
			closeDrawer($drawer);
		}
		else {
			openDrawer($drawer);
		}
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
	});

	const callback = (entries, observer) => {
		entries.forEach((entry) => {
			// Check if it is intersecting...
			if (entry.isIntersecting) {
				// If so, set this as the selected nav item.
				const $navLink = document.querySelector(`.navigation__link[data-scroll-to="${entry.target.id}"]`);
				$navLink.dataset.selected = 'true';
			} else {
				// If not, set the previous nav item as the selected one.
				const $navLink = document.querySelector(`.navigation__link[data-scroll-to="${entry.target.id}"]`);
				$navLink.dataset.selected = 'false';
			}
		});
	};

	const options = {
		rootMargin: '-72px 0px 0px 0px',
		threshold: 0.01,
	};
	
	const observer = new IntersectionObserver(callback, options);

	observer.observe(document.querySelector('#projects'));
	observer.observe(document.querySelector('#education'));
	observer.observe(document.querySelector('#experience'));
	observer.observe(document.querySelector('#hobbies'));
});

function clearNavItems() {
	$navLinks.forEach($navLink => {
		$navLink.dataset.selected = 'false';
	});
}

function openDrawer($drawer) {
	const $focusableElements = $drawer.querySelectorAll(SELECTORS.FOCUSABLE);
	const $firstFocusableElement = document.querySelector('.header__branding');
	const $lastFocusableElement = $focusableElements[$focusableElements.length - 1];

	$drawer.dataset.visible = 'true';

	// Events
	drawerKeyHandler = (event) => {
		if (event.key === 'Escape' || event.keyCode === 27) {
			closeDrawer($drawer);
		}
	
		// Add tab trapping
		if (event.key === 'Tab' || event.keyCode === 9) {
			if (event.shiftKey && document.activeElement === $firstFocusableElement) {
				$lastFocusableElement.focus();

				setTimeout(() => {
					$lastFocusableElement.focus();
				}, 50);
			}
			else if (!event.shiftKey && document.activeElement === $lastFocusableElement) {
				$firstFocusableElement.focus();

				setTimeout(() => {
					$firstFocusableElement.focus();
				}, 50);
			}
		}
	}
	document.addEventListener('keydown', drawerKeyHandler);
}

function closeDrawer($drawer) {
	$drawer.dataset.visible = 'false';

	// Remove tab trapping
	if (drawerKeyHandler) {
		document.removeEventListener('keydown', drawerKeyHandler);
	}
}

function openModal($modal) {
	const $focusableElements = $modal.querySelectorAll(SELECTORS.FOCUSABLE);
	const $firstFocusableElement = $focusableElements[0];
	const $lastFocusableElement = $focusableElements[$focusableElements.length - 1];

	$overlay.dataset.state = 'active';
	$overlay.addEventListener('click', () => {
		closeModal($modal);
		revertSettings();
	});

	$modal.dataset.state = 'open';
	$firstFocusableElement.focus();

	modalKeyHandler = (event) => {
		if (event.key === 'Escape' || event.keyCode === 27) {
			closeModal($modal);
			revertSettings();
		}
	
		// Add tab trapping
		if (event.key === 'Tab' || event.keyCode === 9) {
			if (event.shiftKey && document.activeElement === $firstFocusableElement) {
				$lastFocusableElement.focus();

				setTimeout(() => {
					$lastFocusableElement.focus();
				}, 50);
			}
			else if (!event.shiftKey && document.activeElement === $lastFocusableElement) {
				$firstFocusableElement.focus();

				setTimeout(() => {
					$firstFocusableElement.focus();
				}, 50);
			}
		}
	}
	document.addEventListener('keydown', modalKeyHandler);

	$modalCloseButton = $modal.querySelector('.modal__close');
	$modalCloseButton.addEventListener('click', () => {
		closeModal($modal);
		revertSettings();
	});

	$modalAcceptButton = $modal.querySelector('.modal__accept');
	$modalAcceptButton.addEventListener('click', () => {
		saveSettings($modal);
		closeModal($modal);
	});

	$focusableElements.forEach($focusableElement => {
		$focusableElement.tabIndex = "0";
	});
}

function closeModal($modal) {
	const $focusableElements = $modal.querySelectorAll(SELECTORS.FOCUSABLE);

	$overlay.dataset.state = 'inactive';
	$modal.dataset.state = 'closed';

	// Remove tab trapping
	if (modalKeyHandler) {
		document.removeEventListener('keydown', modalKeyHandler);
	}

	$focusableElements.forEach($focusableElement => {
		$focusableElement.tabIndex = "-1";
	});
}

function getSettingsFromLocalStorage() {
	// Set default settings
	if (!window.localStorage.getItem('theme')) {
		window.localStorage.setItem('theme', 'system');
	}

	if (!window.localStorage.getItem('reduceMotion')) {
		window.localStorage.setItem('reduceMotion', 'system');
	}

	return {
		theme: window.localStorage.getItem('theme'),
		reduceMotion: window.localStorage.getItem('reduceMotion'),
	};
}

function saveSettingsToLocalStorage() {
	window.localStorage.setItem('theme', settings.theme);
	window.localStorage.setItem('reduceMotion', settings.reduceMotion);
}

function applySettingsToModal() {
	const $settings = document.querySelectorAll('[data-setting]');
	$settings.forEach($setting => {
		const key = $setting.dataset.setting;

		if (settings[key]) {
			$setting.value = settings[key];
		}
	});
}

function applySettingsToPage() {
	const $body = document.querySelector('body');

	// Theme
	if (settings.theme === 'system') {
		theme = prefersColorSchemeDarkMediaQuery.matches ? 'dark': 'light';
	}
	else {
		theme = settings.theme;
	}
	$body.dataset.theme = theme;

	// Prefers Reduced Motion
	if (settings.reduceMotion === 'system') {
		prefersReducedMotion = prefersReducedMotionMediaQuery.matches;
	}
	else {
		prefersReducedMotion = settings.reduceMotion === 'yes';
	}
	$body.dataset.prefersReducedMotion = prefersReducedMotion;
}

function getSettingsFromModal() {
	const $settings = document.querySelectorAll('[data-setting]');
	$settings.forEach($setting => {
		const key = $setting.dataset.setting;

		if (settings[key]) {
			settings[key] = $setting.value;
		}
	});
}

function revertSettings() {
	applySettingsToModal();
}

function saveSettings($modal) {
	const localSettings = getSettingsFromModal();
	saveSettingsToLocalStorage();

	applySettingsToPage();
}

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