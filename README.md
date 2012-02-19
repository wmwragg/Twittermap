This is a small javascript library to add a map of geo tagged tweets to a webpage. It has two dependencies twitterlib.js (https://github.com/remy/twitterlib) and leaflet (http://leaflet.cloudmade.com/). Both the dependencies are included in Twittermap download, and I'll try to keep them up to date.

To use twittermap.js just include the following in the head section of your page:

	<!-- Leaflet CSS -->
	<link rel="stylesheet" href="twittermap/dependencies/leaflet/leaflet.css" />
	<!--[if lte IE 8]><link rel="stylesheet" href="twittermap/dependencies/leaflet/leaflet.ie.css" /><![endif]-->

	<!-- Twittermap requited JavaScript -->
	<script src="twittermap/dependencies/leaflet/leaflet.js"></script>
	<script src="twittermap/dependencies/twitterlib/twitterlib.min.js"></script>
	<script src="twittermap/twittermap.js"></script>

Obviously include the full URL to where the twittermap directory is stored.

Then in the body of the page include the following:

	<div id="map" style="height: 200px"></div> <!-- width equals available horizontal space by default -->
	<script>twittermap.createmap('map', 'wmwragg', 10, "Feb 21, 2012");</script>

The id of the **div** should be the what you use as the first argument to the twittermap.createmap function. The second argument is the twitter users name that you want the map for. The third and forth arguments are limits on the twitter query, the first limits the number of tweets return from twitter, keep this as small as possible to speed up the query, and the second filters the returned tweets to only allow tweets since the date supplied to be shown. The date is in the format of "MMM dd, YYYY".
