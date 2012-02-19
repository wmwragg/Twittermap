// twittermap.js (c) 2012 William Wragg
// @version 1.0.0 / Sun Feb 19 12:04:00 2012 +0000
// MIT license: http://rem.mit-license.org

// Depends on twitterlib.js (https://github.com/remy/twitterlib) and leaflet (http://leaflet.cloudmade.com/)

(function(global) {
  var twittermap = {};

  twittermap = {
    createmap: function (mapDiv, twitterUser, tweetLimit, tweetsSince) {
      var map = new L.Map(mapDiv);
  
      var openstreetmapsUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          cloudmadeAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
          cloudmade = new L.TileLayer(openstreetmapsUrl, {maxZoom: 18, attribution: cloudmadeAttrib});
  
      // Set view to that last tweet or london if none available
      var london = new L.LatLng(51.505, -0.09);
      map.setView(london, 13).addLayer(cloudmade);

      // It can take a while sometimes to get the tweets, so show user what is happening.
      var popup = new L.Popup();
      popup.setLatLng(london);
      popup.setContent("Getting GPS tagged tweets...");
      map.openPopup(popup);
  
      var lastMarker = null,
          lastPoint = null,
          largestLat = null,
          largestLng = null,
          smallestLat = null,
          smallestLng = null;
  
      var sinceDate = new Date(tweetsSince);
  
      var getTwitterDate = function (time_value) {
        var values = time_value.split(" ");
        return new Date(Date.parse(values[1] + " " + values[2] + ", " + values[5] + " " + values[3]));
      }

      var tweetsCallback = function (tweets) {
        for (var i = tweets.length - 1; i >= 0; i--) {
          // Add a marker and popup for the tweet if it has a location
          if (tweets[i].geo !== null && getTwitterDate(tweets[i].created_at) > sinceDate ) {
            var markerLocation = new L.LatLng(tweets[i].geo.coordinates[0], tweets[i].geo.coordinates[1]);
  
            var marker = new L.Marker(markerLocation);
            map.addLayer(marker);
  
            marker.bindPopup(this.ify.clean(tweets[i].text) + "<br/><b><i>" + this.time.relative(tweets[i].created_at) + "</i></b>");
  
            lastPoint = markerLocation;
            lastMarker = marker;
            if (largestLat === null || largestLat < lastPoint.lat) { 
              largestLat = lastPoint.lat;
            }
            if (largestLng === null || largestLng < lastPoint.lng) { 
              largestLng = lastPoint.lng;
            }
            if (smallestLat === null || smallestLat > lastPoint.lat) { 
              smallestLat = lastPoint.lat;
            }
            if (smallestLng === null || smallestLng > lastPoint.lng) { 
              smallestLng = lastPoint.lng;
            }
          }
        }
      
        if (lastPoint !== null) {
          var southWest = new L.LatLng(smallestLat, largestLng),
              northEast = new L.LatLng(largestLat, smallestLng),
              tweetBounds = new L.LatLngBounds(southWest, northEast);
          // If only one tweet has a geo location treat as a point otherwise as a group of points
          if (smallestLat === largestLat && smallestLng === largestLng) {
            map.setView(lastPoint, 13).addLayer(cloudmade);
          } else {
            map.fitBounds(tweetBounds).addLayer(cloudmade);
          }
          lastMarker.openPopup();
        } else {
          popup.setContent("Sorry, but within the last " + tweetLimit + " tweets sent since " + tweetsSince + " there are none that have been GPS tagged.");
          map.openPopup(popup);
        }
      }

      twitterlib.timeline(twitterUser, { limit: tweetLimit }, tweetsCallback);
    } 
  };

  global.twittermap = twittermap;
})(this);
