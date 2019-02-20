const version = "1.02";
const cacheName = "jw-${version}";

self.addEventListener("install", e => {
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll([
				"/",
				"/index.html",
				"/Joshua-Whiting-CV.pdf",
				"/manifest.json",
				"/css/button.css",
				"/css/card.css",
				"/css/color.css",
				"/css/elevation.css",
				"/css/font.css",
				"/css/header.css",
				"/css/main.css",
				"/css/reset.css",
				"https://fonts.googleapis.com/css?family=Roboto",
				"https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu72xKOzY.woff2",
				"https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2",
				"https://fonts.googleapis.com/icon?family=Material+Icons",
				"https://fonts.gstatic.com/s/materialicons/v43/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
				"images/education/background-2000.jpg",
				"images/education/background-2000.webp",
				"images/education/hull-media-1500.jpg",
				"images/education/hull-media-1500.webp",
				"images/education/hull-thumbnail-250.jpg",
				"images/education/hull-thumbnail-250.webp",
				"images/education/nottingham-media-1500.jpg",
				"images/education/nottingham-media-1500.webp",
				"images/education/nottingham-thumbnail-250.jpg",
				"images/education/nottingham-thumbnail-250.webp",
				"images/experience/background-2000.jpg",
				"images/experience/background-2000.webp",
				"images/hobbies/background-2000.jpg",
				"images/hobbies/background-2000.webp",
				"images/hobbies/language-media-1500.jpg",
				"images/hobbies/language-media-1500.webp",
				"images/hobbies/language-thumbnail-250.jpg",
				"images/hobbies/language-thumbnail-250.webp",
				"images/hobbies/music-media-1500.jpg",
				"images/hobbies/music-media-1500.webp",
				"images/hobbies/music-thumbnail-250.jpg",
				"images/hobbies/music-thumbnail-250.webp",
				"images/hobbies/sport-media-1500.jpg",
				"images/hobbies/sport-media-1500.webp",
				"images/hobbies/sport-thumbnail-250.jpg",
				"images/hobbies/sport-thumbnail-250.webp",
				"images/home/background-2000.jpg",
				"images/home/background-2000.webp",
				"images/home/media-1500.jpg",
				"images/home/media-1500.webp",
				"images/home/thumbnail-250.jpg",
				"images/home/thumbnail-250.webp",
				"images/logo/logo-192.png",
				"images/logo/logo-192.svg",
				"images/logo/logo-512.png",
				"images/logo/logo-512.svg",
				"js/main.js"
			])
			.then(() => self.skipWaiting());
		})
	);
});

self.addEventListener("activate", event => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
	event.respondWith(
		caches.open(cacheName)
		.then(cache => cache.match(event.request, {ignoreSearch: true}))
		.then(response => {
			return response || fetch(event.request);
		})
	);
});