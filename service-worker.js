const version = "1.01";
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
				"images/education/background.jpg",
				"images/education/hull-media.jpg",
				"images/education/hull-thumbnail.jpg",
				"images/education/nottingham-media.jpg",
				"images/education/nottingham-thumbnail.jpg",
				"images/experience/background.jpg",
				"images/hobbies/background.jpg",
				"images/hobbies/language-media.jpg",
				"images/hobbies/language-thumbnail.jpg",
				"images/hobbies/music-media.jpg",
				"images/hobbies/music-thumbnail.jpg",
				"images/hobbies/sport-media.jpg",
				"images/hobbies/sport-thumbnail.jpg",
				"images/home/background.jpg",
				"images/home/media.jpg",
				"images/home/thumbnail.jpg",
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



/*self.addEventListener("install", function(e) {
	e.waitUntil(
		caches.open("cacheName").then(function(cache) {
			return cache.addAll([
				"offline.html",
				"manifest.json",
				"css/font.css",
				"https://fonts.googleapis.com/css?family=Roboto",
				"https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2",
				"images/logo/logo-192.png"
			]);
		})
	);
});

self.addEventListener("fetch", function(event) {
	console.log(event.request.url);
	
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});

this.addEventListener("fetch", event => {
  // request.mode = navigate isn"t supported in all browsers
  // so include a check for Accept: text/html header.
  if (event.request.mode === "navigate" || (event.request.method === "GET" && event.request.headers.get("accept").includes("text/html"))) {
        event.respondWith(
          fetch(event.request.url).catch(error => {
              // Return the offline page
              return caches.match("offline.html");
          })
    );
  }
  else{
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
                        .then(function (response) {
                        return response || fetch(event.request);
                    })
            );
      }
});*/