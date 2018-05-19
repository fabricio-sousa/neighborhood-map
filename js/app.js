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

}
