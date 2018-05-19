// Model Parks array of 5 parks with name and address.
var Parks = [
	{name: 'Simpson Park', address: '5 SW 17th Rd, Miami, FL 33129'},
	{name: 'Secret Woods', address: '2701 W State Rd 84, Fort Lauderdale, FL 33312'},
	{name: 'Fern Forest', address: '201 S Lyons Rd, Coconut Creek, FL 33063'},
	{name: 'Morikami Gardens', address: '4000 Morikami Park Rd, Delray Beach, FL 33446'},
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
    center: {lat: 26.329422, lng: -80.088615},
    zoom: 9,
    styles: styles,
    mapTypeControl: false
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
  			animation: google.maps.Animation.DROP
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
function wikiInfo(park) {

	contentString = "<span>Test</span>"
	infoWindow.setContent(contentString);
	infoWindow.open(map, place.marker);
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
		 		var result = place.name.toLowerCase().indexOf(search) !== -1;
		 		if (result) {
		 			park.marker.setVisible(true);
		 		} else {
		 			park.marker.setVisible(false);
		 		}
		 		return result;
		 	});
		}
	});
};



// Google Maps API error handling.
function apiError() {
	alert("There was an issue loading the Google Maps API.");
}
