document.addEventListener('DOMContentLoaded', function(event){
	//
	// Updating selected nav tab based on scroll position.
	//
	vNavItems = document.getElementById("headerNavigation").children[0].children;
	vActiveID = -1;

	window.onscroll = function() {
		var doc = document.documentElement;
		var vScroll = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

		// Get the height of the browser.
		var g = document.getElementsByTagName('body')[0];
		var vBrowserHeight = window.innerHeight || doc.clientHeight || g.clientHeight;

		// Get the height of the header.
		var vHeader = document.getElementsByTagName('header')[0];
		var vHeaderHeight = vHeader.clientHeight;

		// Get the sheet height.
		var vSheetHeight = vBrowserHeight - vHeaderHeight;
		var vNavID = Math.floor(vScroll / vSheetHeight);
		vNavID--;

		// Only update the classes if they change.
		if (vNavID != vActiveID) {
			var vNavItem;
			for (var i = 0; i < vNavItems.length; i++) {

				vNavItem = vNavItems[i];
				if (i == vNavID) {
					vNavItem.classList.add("selected");
				}
				else {
					vNavItem.classList.remove("selected");
				}
			}

			// Update the active tab id.
			vActiveID = vNavID;
		}
	};
});

// https://developers.google.com/web/ilt/pwa/lab-offline-quickstart#52_activating_the_install_prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', event => {

	// Prevent Chrome 67 and earlier from automatically showing the prompt
	event.preventDefault();

	// Stash the event so it can be triggered later.
	deferredPrompt = event;

	// Attach the install prompt to a user gesture
	document.getElementById("install-button").addEventListener('click', event => {

		// Show the prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			}
			else {
				console.log('User dismissed the A2HS prompt');
			}
			deferredPrompt = null;
		});
	});

	// Update UI notify the user they can add to home screen
	document.getElementById("install-banner").style.display = 'flex';
});

function pageScroll(id) {
	var vEl = document.getElementById(id);
	var vHeader = document.getElementById("header");

	// Get the desired scroll position
	var desiredScrollPosition = vEl.offsetTop - vHeader.offsetHeight;

	var isIE = !!document.documentMode;
	console.log("IE: " + isIE);
	var isEdge = !!/Edge\//.test(navigator.userAgent);
	console.log("Edge: " + isEdge);

	// Scroll.
	if (isIE || isEdge) {
		window.scroll(0, desiredScrollPosition);
	}
	else {
		window.scrollTo({
			top: desiredScrollPosition,
			behavior: "smooth"
		});
	}
}

//
// Functions to apply hover to cards.
//
function cardMouseOver(el) {
	if (!el.classList.contains("selected")) {
		el.classList.remove("elevation-1dp");
		el.classList.add("elevation-8dp");
	}
}

function cardMouseOut(el) {
	if (!el.classList.contains("selected")) {
		el.classList.remove("elevation-8dp");
		el.classList.add("elevation-1dp");
	}
}

function selectCard(el) {
	// Remove selected class from the card-list.
	var vEls = el.parentNode.childNodes;
	for (var i = 0; i < vEls.length; i++) {
		if (vEls[i].nodeType == 1) {
			vEls[i].classList.remove("selected");
			vEls[i].classList.remove("elevation-8dp");
			vEls[i].classList.add("elevation-1dp");
		}
	}

	// Add selected class.
	el.classList.remove("elevation-1dp");
	el.classList.add("selected");
	el.classList.add("elevation-8dp");
}
