"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/verbal-spelling-check/expo-service-worker.js",{scope:"/verbal-spelling-check/"}).then((function(e){})).catch((function(e){console.info("Failed to register service-worker",e)}))}));