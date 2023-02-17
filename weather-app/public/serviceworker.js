const CATCHE_NAME = "version-1";
const urlsToCathe = ['index.html', 'offline.html'];

const self = this
// Install service worker
self.addEventListener('install', (event) => {
    //open the catche and add urlstoCathe to the catche
    event.waitUntil(
        caches.open(CATCHE_NAME).then((catche) => {
            console.log("Opened catche")
            return catche.addAll(urlsToCathe)
        })
    )
})


// Listen for requests
self.addEventListener('fetch', (event) => {
    // fetch requestde pageimizin aldigi butun requestleri match etmeliyik (line:21). Meselen: imagelerin gosterilmesi ucun olan reques,
    // api call ucun request ve,s. 
    event.respondWith(
        caches.match(event.request).then(() => {
            return fetch(event.request) // burda bize lazim olan request yeniden fetch edirik cunki bize hemise en son data lazimdi
                .catch(() => caches.match('offline.html')) // eger fetch ede bilmirikse demeli internet connectionu yoxdu 
        })
    )
})


// Activate the service worker
self.addEventListener('activate', (event) => {
    // bezen ola biler ki projectimizde deyisikler olsun ve evvel catchde saxladigimiz datalar artiq bize lazim olmasin
    // ona gorede en son catche silib ve yeni catche yaradacayiq.
    const cacheWhiteList = [];
    cacheWhiteList.push(CATCHE_NAME);
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhiteList.includes(cacheName)) {
                    return caches.delete(cacheName)
                }
            })
        ))
    )
})



// service workers are extremely powerfull, they keep runing even after we close the application. 
// we don't want them to be harmfull so that's why we need to be secure.
// by default localhost is not secure 
