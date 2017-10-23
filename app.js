//====Model=====//
var model = function () {
	locations = [{
    title: 'Lousen',
    address: {
        lat: 24.697987,
        lng: 46.683494
    },
    description: "Armanian resturent "
}, {
    title: 'PNU',
    address: {
        lat: 24.846461,
        lng: 46.724731
    },
    description: " first university for femel only "
}, {
    title: 'Ruben plaza',
    address: {
        lat: 24.753042,
        lng: 46.625344
    },
    description: " Resturent  "
}, {
    title: 'Ritz-carilton Riyadh',
    address: {
        lat: 24.666362,
        lng: 46.630396
    },
    description: "Hotel"
}, {
    title: 'Panorama Mall',
    address: {
        lat: 24.692840,
        lng: 46.669900
    },
    description: "Big mall in Riyadh"
}];
};

//*=============viewModel===============*
var viewModel = function() {
    ko.applyBindings(model.locations);
    var self = this;
    this.locationsArray=ko.observableArray(model.locations);
    
   // for(i=0; i<model.locations.length;i++){
   // this.locationsArray.push(model.locations);
   // this.SelectedLocations= ko.observableArray();
   // var selectedIcon = '';
    
//function runs when click event listener from list and change marker color 
  /*  var SelectedLocations = new google.maps.LatLng(self.locationsArray()[i].address, self.locationsArray()[i].longitude());
      //Add markers to map
    var marker = new google.maps.Marker({
                   position: currentLatLng,
                   map: map,
                   title: self.locationsArray[i].title,
                   icon: selectedIcon,
               });
               */

    



            };

var map;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 24.774265,
            lng: 46.738586
        },
        zoom: 13
    });
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the locations array to create an array of markers on initialize.
    for (var i = 0; i < 5; i++) {
        // Get the position from the location array.
        var position =this.locationsArray[i].address;
        var title =this.locationsArray[i].title;
        var description = this.locationsArray[i].description
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            description: description,
            animation: google.maps.Animation.DROP,
            id: i
           
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + marker.description + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }
}
/*change marker color 
function highlightMarker(marker, highlight) {
    var color = "#FE7569";
    if (highlight) {
        color = "#0000FF";
    }
    marker.setImage(getIcon(color).image);
}
*/