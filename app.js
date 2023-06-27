var player = videojs('content_video');

var locSearch = window.location.search
var queryParamString = ''
var queryParams = {}
var vastURL = 'https://mwcdn.co/vast-demos/creative-1of3.xml'

if (locSearch.length > 0) {
  queryParamString = locSearch.substring(1)
}

queryParamString.split("&").forEach(function (keyvalPairString) {
  var keyvalPair = keyvalPairString.split('=')
  if (keyvalPair[0].length) {
    queryParams[keyvalPair[0]] = decodeURIComponent(keyvalPair[1])
  }
})

if (queryParams.vasturl) {
  document.getElementById('input_vasturl').value = queryParams.vasturl
  document.querySelector('h1 a').href = '/?vasturl=' + encodeURIComponent(queryParams.vasturl)
  vastURL = queryParams.vasturl
}

var adsManagerLoadedCallback = function () {
  var keys = Object.keys(google.ima.AdEvent.Type)
  var eventNames = []
  keys.forEach(function(k) {
    var eventName = google.ima.AdEvent.Type[k]
    eventNames.push(eventName)
    player.ima.addEventListener(eventName, function(evt) {
      console.log(eventName, evt)
    })
  })
  keys = Object.keys(google.ima.AdError.Type)
  keys.forEach(function(k) {
    var eventName = google.ima.AdError.Type[k]
    eventNames.push(eventName)
    player.ima.addEventListener(eventName, function(evt) {
      console.log(eventName, evt)
    })
  })
  console.log('Registered IMA Events', eventNames)
}

var options = {
  id: 'content_video',
  adsManagerLoadedCallback: adsManagerLoadedCallback,
  adTagUrl: vastURL,
  debug: true,
  omidVendorAccess: {
    9: 'full',
    1: 'full',
  },
};

player.ima(options)

// Remove controls from the player on iPad to stop native controls from stealing
// our click
var contentPlayer =  document.getElementById('content_video_html5_api');
if ((navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i)) && contentPlayer.hasAttribute('controls')) {
  contentPlayer.removeAttribute('controls')
}

// Initialize the ad container when the video player is clicked, but only the
// first time it's clicked.
var startEvent = 'click';
if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i)) {
  startEvent = 'touchend'
}

player.one(startEvent, function() {
  player.ima.initializeAdDisplayContainer()
  player.play()
});

document.getElementById('reload_btn').addEventListener('click', function (evt) {
  evt.preventDefault()
  window.location.reload()
})
