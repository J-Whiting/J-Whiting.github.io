self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open('airhorner').then(function(cache) {
			return cache.addAll([
			'/',
			'/index.html',
			'/css/main.css',
			]);
		})
	);
});

self.addEventListener('fetch', function(event) {
	console.log(event.request.url);
});