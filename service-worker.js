const version = "1.40";
const cacheName = "jb-${version}";

self.addEventListener("install", e => {
	console.log('Service worker installing...');
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll([
				"/",
				"/404.html",
				"/android-icon-36.png",
				"/android-icon-48.png",
				"/android-icon-72.png",
				"/android-icon-96.png",
				"/android-icon-144.png",
				"/android-icon-192.png",
				"/apple-icon.png",
				"/apple-icon-57.png",
				"/apple-icon-60.png",
				"/apple-icon-72.png",
				"/apple-icon-76.png",
				"/apple-icon-114.png",
				"/apple-icon-120.png",
				"/apple-icon-144.png",
				"/apple-icon-152.png",
				"/apple-icon-180.png",
				"/apple-icon-192.png",
				"/apple-icon-192.svg",
				"/apple-icon-precomposed.png",
				"/apple-touch-icon.png",
				"/browserconfig.xml",
				"/favicon.ico",
				"/favicon-16.png",
				"/favicon-32.png",
				"/favicon-96.png",
				"/index.html",
				"/manifest.json",
				"/ms-icon-70.png",
				"/ms-icon-144.png",
				"/ms-icon-150.png",
				"/ms-icon-310.png",
				"/safari-pinned-tab.svg",
				"/sitemap.xml",
				"/styles/1-settings/color.css",
				"/styles/1-settings/font.css",
				"/styles/3-generic/reset.css",
				"/styles/4-elements/body.css",
				"/styles/4-elements/html.css",
				"/styles/4-elements/main.css",
				"/styles/6-components/button.css",
				"/styles/6-components/card.css",
				"/styles/6-components/header.css",
				"/styles/6-components/navigation.css",
				"/styles/6-components/sheet.css",
				"/styles/6-components/snackbar.css",
				"/images/education/hull-media-1000.webp",
				"/images/education/hull-media-1500.webp",
				"/images/education/hull-thumbnail-80.webp",
				"/images/education/nottingham-media-1000.webp",
				"/images/education/nottingham-media-1500.webp",
				"/images/education/nottingham-thumbnail-80.webp",
				"/images/experience/herd-media-1000.webp",
				"/images/experience/herd-media-1500.webp",
				"/images/experience/herd-thumbnail-80.webp",
				"/images/experience/strawberry-media-1000.webp",
				"/images/experience/strawberry-media-1500.webp",
				"/images/experience/strawberry-thumbnail-80.webp",
				"/images/experience/symphony-media-1000.webp",
				"/images/experience/symphony-media-1500.webp",
				"/images/experience/symphony-thumbnail-80.webp",
				"/images/hobbies/language-media-1000.webp",
				"/images/hobbies/language-media-1500.webp",
				"/images/hobbies/language-thumbnail-80.webp",
				"/images/hobbies/music-media-1000.webp",
				"/images/hobbies/music-media-1500.webp",
				"/images/hobbies/music-thumbnail-80.webp",
				"/images/hobbies/sport-media-1000.webp",
				"/images/hobbies/sport-media-1500.webp",
				"/images/hobbies/sport-thumbnail-80.webp",
				"/images/home/media-1000.webp",
				"/images/home/media-1500.jpg",
				"/images/home/media-1500.webp",
				"/images/home/thumbnail-80.webp",
				"/images/logos/logo-192.png",
				"/images/logos/logo-192.svg",
				"/images/logos/logo-512.png",
				"/images/logos/logo-512.svg",
				"/images/projects/fake-name-generator-media-1000.webp",
				"/images/projects/fake-name-generator-media-1500.webp",
				"/images/projects/fake-name-generator-thumbnail-80.webp",
				"/images/projects/photos-media-1000.webp",
				"/images/projects/photos-media-1500.webp",
				"/images/projects/photos-thumbnail-80.webp",
				"/images/projects/pong-media-1000.webp",
				"/images/projects/pong-media-1500.webp",
				"/images/projects/pong-thumbnail-80.webp",
				"/images/screenshots/screenshot1.webp",
				"/scripts/main.js"
			])
			.then(() => self.skipWaiting());
		})
	);
});

self.addEventListener("activate", event => {
	console.log('Service worker activating...');
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
	console.log('Service worker fetching:', event.request.url);
	event.respondWith(
		caches.open(cacheName)
		.then(cache => cache.match(event.request, {ignoreSearch: true}))
		.then(response => {
			return response || fetch(event.request);
		})
	);
});
