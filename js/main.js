document.addEventListener('DOMContentLoaded', function(event){
	//
	// Updating selected nav tab based on scroll position.
	//
	vNavItems = document.getElementById("headerNavigation").children[0].children;
	vActiveID = 0;
	
	window.onscroll = function() {
		var doc = document.documentElement;
		var vScroll = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		
		// Each section is 942px high, and the header is 48px high.
		//var vNavID = Math.floor((vScroll) / 942);
		
		// Each section is 841px high, and the header is 72px high.
		var vNavID = Math.floor((vScroll) / 841);
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

function pageScroll(id) {
	var vEl = document.getElementById(id);
	var vHeader = document.getElementById("header");
	
	// Get the desired scroll position
	var desiredScrollPosition = vEl.offsetTop - vHeader.offsetHeight;

	// Scroll.
	window.scrollTo({
	    top: desiredScrollPosition,
	    behavior: "smooth"
	});
}

//
// Functions to apply hover to cards.
//
function cardMouseOver(el) {
	el.classList.remove("elevation-2dp");
	el.classList.add("elevation-8dp");
}

function cardMouseOut(el) {
	el.classList.remove("elevation-8dp");
	el.classList.add("elevation-2dp");
}