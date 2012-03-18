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

The id of the **div** should be the what you use as the first argument to the twittermap.createmap function. The second argument is the twitter users name that you want the map for. The third and forth arguments are limits on the twitter query, the first limits the number of tweets returned from twitter, keep this as small as possible to speed up the query, and the second filters the returned tweets to only allow tweets since the date supplied to be shown. The date is in the format of "MMM dd, YYYY".

There is an additional fifth argument that can be used, and it is the date from which a path should start to be plotted along with the tweets. The date format is the same as for the tweet filter date above.

Both the tweets filter date and the path date arguments can be replaced with start and end tweet ids. The ids are the numbers shown after the '#' at the bottom of the tweet popups. If the start and end ids are given instead of a tweet filter date, then twitter will only return tweets between the start and end ids, this is more efficient and should be quicker. Also the start and end ids should be used if you always want a specifc set of tweets to be shown, as the tweets filter date is only used on the most recent 200 tweets from the timeline, so eventually all the 200 tweets will be newer than the filter date and no tweets will be shown. If the start and end ids are given instead of the path start date, then the path will only be shown for the tweets that fall between the ids. The format for the start end ids is "[`<start long number>`, `<end long number>`]" e.g. twittermap.createmap('map', 'wmwragg', 10, [175831717284806660, 179938209122365440]);

Both the tweet filter argument, and the path argument, are optional you could just use twittermap.createmap('map', 'wmwragg', 10);

### Embedding in a tumblr post
First you will need to host the twittermap folder somewhere on the internet that tumblr can see. If you have a Dropbox account just add it to your public folder. Then copy the public link to the twittermap.js file it will look something like this:

	http://dl.dropbox.com/u/<some numbers>/twittermap/twittermap.js

The `<some numbers>` section will be your dropbox public folder id, and won't change. Use this URL up to and including the `<some numbers>` section, to prefix the includes.
You can now embed a twitter map in a tumblr post by editing your tumblr templates html and adding the following twittermap includes:

	<!-- Leaflet CSS -->
	<link rel="stylesheet" href="http://dl.dropbox.com/u/<some numbers>/twittermap/dependencies/leaflet/leaflet.css" />
	<!--[if lte IE 8]><link rel="stylesheet" href="http://dl.dropbox.com/u/<some numbers>/twittermap/dependencies/leaflet/leaflet.ie.css" /><![endif]-->

	<!-- Twittermap requited JavaScript -->
	<script src="http://dl.dropbox.com/u/<some numbers>/twittermap/dependencies/leaflet/leaflet.js"></script>
	<script src="http://dl.dropbox.com/u/<some numbers>/twittermap/dependencies/twitterlib/twitterlib.min.js"></script>
	<script src="http://dl.dropbox.com/u/<some numbers>/twittermap/twittermap.js"></script>

Then after saving the changes, all you need to do is create a text post, make sure that in the tumblr preferences under 'Edit posts using' you have 'Plain text/HTML' selected, and add the following lines to the post:

	<div id="map" style="height: 200px"></div> <!-- width equals available horizontal space by default -->
	<script>twittermap.createmap('map', 'wmwragg', 10, "Feb 21, 2012");</script>

Make the height what you want, and the twittermap parameters what you require. Save the post and that's it.
