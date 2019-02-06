//--------------------------------//
//                                //
//            Carousel            //
//                                //
//--------------------------------//
var slideIndex = 0;
var slideTimer;
updateSlide();

function increaseSlide() {
	slideIndex++;
	updateSlide();
}

function decreaseSlide() {
	slideIndex--;
	updateSlide();
}

function updateSlide() {
	var i;
	
	var x = document.getElementsByClassName("carousel-slide");
	if (slideIndex > x.length - 1) {
		slideIndex = 0;
	}
	if (slideIndex < 0) {
		slideIndex = x.length - 1
	}
	
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	
	x[slideIndex].style.display = "block";
	
	// Reset the timer every time it is ran, to stop the slideshow getting out of phase.
	if (slideTimer != null) {
		clearTimeout(slideTimer);
	}
	slideTimer = setTimeout(increaseSlide, 5000); // Change image every 5 seconds
}