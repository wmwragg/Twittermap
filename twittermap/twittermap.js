// twittermap.js (c) 2012 William Wragg
// @version 1.0.0 / Sun Feb 19 12:04:00 2012 +0000
// MIT license: http://rem.mit-license.org

// Depends on twitterlib.js (https://github.com/remy/twitterlib) and leaflet (http://leaflet.cloudmade.com/)

(function(global) {
  var twittermap = {};

  twittermap = {
    createmap: function (mapDiv, twitterUser, tweetLimit, tweetsConfig, pathConfig) {
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
          smallestLng = null,
          pathLatLngs = [],
          sinceTweetsDate = null,
          sincePathDate = null,
          twitterlibOptions = {};
  
      // Process the args
      twitterlibOptions.limit = tweetLimit;
      if (tweetsConfig !== undefined && (typeof tweetsConfig === 'string')) {
        sinceTweetsDate = new Date(tweetsConfig);
      } else if (tweetsConfig !== undefined && tweetsConfig.length === 2) {
        twitterlibOptions.since = tweetsConfig[0];
        twitterlibOptions.max = tweetsConfig[1];
      }
      if (pathConfig !== undefined && (typeof pathConfig === 'string')) {
        sincePathDate = new Date(pathConfig);
      }
  
      var getTwitterDate = function (time_value) {
        var values = time_value.split(" ");
        return new Date(Date.parse(values[1] + " " + values[2] + ", " + values[5] + " " + values[3]));
      }

      var showTweet = function(tweet, sinceTweetsDate) {
        if (tweet.geo !== null) {
          // The tweet has geo data
          if (sinceTweetsDate !== null) {
            // There is a start date so check if tweet date is greater than it
            if (getTwitterDate(tweet.created_at) > sinceTweetsDate ) {
              return true;
            }
          } else {
            return true;
          }
        }

        return false;
      }

      var showPath = function(tweet, sincePathDate, pathConfig) {
        if (sincePathDate !== null) {
          // There is just path start date so check if tweet date is greater than it
          if (getTwitterDate(tweet.created_at) > sincePathDate ) {
            return true;
          }
        } else if (pathConfig !== undefined && pathConfig.length === 2) {
          // There is a start and end id, so check if tweet is between them
          if (tweet.id >= pathConfig[0] && tweet.id <= pathConfig[1]) { 
            return true;
          }
        } else {
          return false;
        }

        return false;
      }

      var redoCount = 0, redoLimit = 2;

      var tweetsCallback = function (tweets) {
        // Only process the tweets if ther were some
        if (tweets !== null && tweets.length > 0) { 
          for (var i = tweets.length - 1; i >= 0; i--) {
            // Add a marker and popup for the tweet if it has a location
            if (showTweet(tweets[i], sinceTweetsDate)) {
              var markerLocation = new L.LatLng(tweets[i].geo.coordinates[0], tweets[i].geo.coordinates[1]);
   
              // Check if marker location is also part of a path
              if (showPath(tweets[i], sincePathDate, pathConfig)) {
                pathLatLngs.push(markerLocation);
              }
 
              var marker = new L.Marker(markerLocation);
              map.addLayer(marker);
    
              marker.bindPopup(this.ify.clean(tweets[i].text) + "<br/><i><b>" + this.time.relative(tweets[i].created_at) + "</b>&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:#CCC;'>#" + tweets[i].id + "</span></i>");
    
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
            // Add path if there is one
            if (pathLatLngs.length > 1) {
              var polyline = new L.Polyline(pathLatLngs, {color: 'red'});
              map.addLayer(polyline);
            }

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
        } else {
          // There were no tweets, so lets give it another go and see if we can get some.
          redoCount++;
          if (redoCount < redoLimit) {
            this.next();
          } else {
            popup.setContent("Sorry, but unable to retrieve any tweets.");
            map.openPopup(popup);
          }
        }
      }

      twitterlib.timeline(twitterUser, twitterlibOptions, tweetsCallback);
    } 
  };

  global.twittermap = twittermap;
})(this);
