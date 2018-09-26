const cacheName = "converter-v1";
const dependencies = [
  "/currency_converter/",
  "/currency_converter/index.html",
  "/currency_converter/index.js",
  "/currency_converter/styles/style.css",
  "https://free.currencyconverterapi.com/api/v6/currencies"
];
const convertUrl = "https://free.currencyconverterapi.com/api/v5/convert?q=";

self.addEventListener('install', event => {
  console.log("installing...");
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(dependencies); 
    })
  );
})

self.addEventListener('activate', event => {
  console.log("activated");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(function(cacheNm) {
          return (cacheNm.startsWith("converter-") && cacheNm != cacheName)
        }).map(function(cacheNm) {
          console.log("about to delete cache")
                  return caches.delete(cacheNm);
          })
      )
    })
  );
})

self.addEventListener('fetch', event => {
  console.log('fetching...')
  const requestUrl = new URL(event.request.url);

  // If the url is triggered by the convert button
  if (requestUrl.href.startsWith(convertUrl)) {
    console.log('in convert...')
    event.respondWith(
      caches.open(cacheName).then(cache => {
        // first check for the value in the cache
        return cache.match(requestUrl).then(response => {
          const fetchPromise = fetch(requestUrl).then(networkResponse => {
            // if a response is recieved from the network
            console.log('in network...')

            if(networkResponse){
              cache.put(requestUrl, networkResponse.clone());
              return networkResponse;
            }
            else console.log("Network error");
          });
            // if there is a match in the cache,  return the response
            // otherwise, return the fetched promise
          return response || fetchPromise;
        });
      })
    );
    return;
  }
  // if the request is not a convert request
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
})
