self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open('image-tester-cache').then(function (cache) {
			return cache.addAll([
				'index.html',
				'styles.css',
				'manifest.webmanifest'
			]);
		}),
	);
});

// Clean up caches if needed
self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames
					.filter(function (cacheName) {
						// Return true if you want to remove this cache,
						// but remember that caches are shared across
						// the whole origin
					})
					.map(function (cacheName) {
						return caches.delete(cacheName);
					}),
			);
		}),
	);
});

// Cache first, then network
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('image-tester-cache').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    }),
  );
});