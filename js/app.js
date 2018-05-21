// Model Parks array of 5 parks with name and address.
var Parks = [
	{name: 'Simpson Park Hammock', address: '5 SW 17th Rd, Miami, FL 33129'},
	{name: 'Gumbo Limbo Environmental Complex', address: '1801 N Ocean Blvd, Boca Raton, FL 33432'},
	{name: 'Everglades National Park', address: '815 Oyster Bar Lane, Everglades City, FL 34139'},
	{name: 'Morikami Museum and Japanese Gardens', address: '4000 Morikami Park Rd, Delray Beach, FL 33446'},
	{name: 'Quiet Waters Park', address: '401 S Powerline Rd, Deerfield Beach, FL 33442'}
];

// Global variables. Empty array for markers and infoWindow variable.
var markers = [];
var infoWindow;

// This function allows for the Google Map to be rendered as well as all markers to be created.
function initMap() {

  // Styles array for Google Maps.
  var styles = [
      {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#FFA800"
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#679714"
              },
              {
                  "saturation": 33.4
              },
              {
                  "lightness": -25.4
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#53FF00"
              },
              {
                  "saturation": -73
              },
              {
                  "lightness": 40
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#FBFF00"
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#00FFFD"
              },
              {
                  "lightness": 30
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#00BFFF"
              },
              {
                  "saturation": 6
              },
              {
                  "lightness": 8
              },
              {
                  "gamma": 1
              }
          ]
      }
  ]

  // Constructor creates a new map.
  map = new google.maps.Map(document.getElementById('map'), {

    zoom: 9,
    styles: styles,
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.BOTTOM_CENTER
		}
  });

  // Declare a new geocoder object.
  var geocoder = new google.maps.Geocoder();

  // For each park in Parks, call the geocodePark function which geocodes the addresses.
  Parks.forEach(function(park) {
    geocodePark(geocoder, park, map);
  });

  // Declare a new infoWindow object.
	infoWindow = new google.maps.InfoWindow();

  // Apply all KnockOut Bindings.
  ko.applyBindings(new ViewModel());

}

// This function allows each marker to be clicked triggering a google maps marker event.
function clickMarker(name) {
	markers.forEach(function(markerItem) {
		if (markerItem.name == name) {
			google.maps.event.trigger(markerItem.marker, 'click');
		}
	});
}

// This function allows a marker to have a bounce animation.
function markerBounce(marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			marker.setAnimation(null);
		}, 1200);
	}
}

// geocodes the address passed from the forEach function, for each park in Parks.
function geocodePark(geocoder, park, parksMap) {

	// Store the current park address in a var address.
	var address = park.address;

	// Uses Google's geocode method to parse the latlng of the park.address then set it on map.
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === 'OK') {
			parksMap.setCenter(results[0].geometry.location);

			// Create a new park marker object based on geocode latlng results.
      // Animate the marker.
			park.marker = new google.maps.Marker({
				map: parksMap,
        position: results[0].geometry.location,
  			animation: google.maps.Animation.DROP,
				icon: {
					url: "img/marker/tree.png",
					scaledSize: new google.maps.Size(45, 45)
				}
			});

			// Add name and marker to marker object.
			markers.push({
				name: park.name,
				marker: park.marker
			});

			// Event listener for when user clicks on marker.
      // Clicking marker will show the Wikipedia info and bounce the marker.
      google.maps.event.addListener(park.marker, 'click', function() {
  			wikiInfo(park);
  			markerBounce(park.marker);
  		});

    } else {
			alert('This location has an invalid address.');
		}
  });
}

// This function allows the wiki API to provide marker infoWindow content.
function wikiInfo (park) {

	// Set the wikiURL with the park.name and json and callback.
	var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + park.name + '&format=json&callback=wikiCallback';

	// Declare a timeout function in case there is an issue with the wikipedia API.
	var wikiTimeout = setTimeout(function () { alert("There was an error loading the Wikipedia page for this park."); }, 4000);

	wikiText = '';

	// AJAX call to retrieve wikipedia article blurb.
	$.ajax ({
		url: wikiURL,
		dataType: "jsonp",

		//  Upon AJAX callback success, if there is an entry, set wikiText to the blurb; else to no articles found message.
		success: function (response) {
			if (response[2][0] !== undefined) {
				wikiText = response[2][0];
			} else {
				wikiText = "No wikipedia articles were found for this park.";
			}

			// If marker clicked, open; if open, and x closed, close.
			if (infoWindow.marker != park.marker) {
				infoWindow.marker = park.marker;
				infoWindow.open(map, park.marker);
				infoWindow.addListener('closeclick', function() {
					infoWindow.setMarker = null;
				});

				// Error handling function.
				clearTimeout(wikiTimeout);

				// Set the content of the ajax query to the infoWindow.
				infoWindow.setContent('<div><h1>' + park.name + '</h1>' + '<br>' + '<h3>' + wikiText + '</h3>' + '</div>');
			};
		}
	});

}

// This is the ViewModel function connecting all views, model and user input functionalities.
var ViewModel = function() {

	var self = this;
	this.search = ko.observable("");

	// Filter Parks based on user input.
	this.searchParks = ko.computed(function() {
		var search = self.search().toLowerCase();
		if (!search) {
			Parks.forEach(function(park) {
				if (park.marker) {
					park.marker.setVisible(true);
				}
			});
			return Parks;
		} else {
			return ko.utils.arrayFilter(Parks, function(park) {
		 		var match = park.name.toLowerCase().indexOf(search) !== -1;
		 		if (match) {
		 			park.marker.setVisible(true);
		 		} else {
		 			park.marker.setVisible(false);
		 		}
		 		return match;
		 	});
		}
	});
};

// Google Maps API error handling.
function apiError() {
	alert("There was an issue loading the Google Maps API.");
}
