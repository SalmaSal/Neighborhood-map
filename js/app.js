//=======declare global var==========//
var map;
var infoWindows;
var bounds;
var markers = [];
var marker;
//google map init
function initMap() {
    var RiyadhCity = {
        lat: 24.774265,
        lng: 46.738586
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: RiyadhCity,
        zoom: 9
    });
    infoWindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    // Initializing markers
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].address;
        var title = locations[i].title;
        var description = locations[i].description;
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            description: description,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Populates markers array
        markers.push(marker);
        marker.setMap(map);
        // Opens up an infowindow when a marker is clicked 
        marker.addListener('click', markerClickHandler);
        // Call marker of locations to the appViewModel
        vm.locations()[i].marker = marker;
        // Adjusts the map's bounds
        bounds.extend(markers[i].position);
    }

    function markerClickHandler() {
        // Set the selected for this as true
        populateInfoWindow(this, infoWindow);
        toggleBounce(this);
    }
    map.fitBounds(bounds);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position the wiki artical besed in title .
function populateInfoWindow(marker, infowindow) {
    var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    var wikiTimeout = setTimeout(function() {
        alert("failed to load wikipedia page");
    }, 4000);
    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function(response) {
            var articleList = response[3];
            var articleName = response[0];
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                infowindow.open(map, marker);
                infowindow.addListener('closeclick', function() {
                    infowindow.setMarker = null;
                });
                infowindow.setContent('<div>' + '<a href ="' + articleList + '">' + articleName + '</a>' + '</div>');
                clearTimeout(wikiTimeout);
            }
        }
    });
}
//Makes the icon bounce only once when clicked
function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 700);
}
//*============ViewModel=============*//
function ViewModel() {
    var self = this;
    self.filterText = ko.observable(""); // Text from search field
    self.locations = ko.observableArray(locations);
    self.testLocations = ko.observableArray([]); //for serch box filter the list of locations
    self.map = map;
    self.testLocations = ko.computed(function() {
        return ko.utils.arrayFilter(self.locations(), function(item) {
            if (item.title.toLowerCase().indexOf(self.filterText().toLowerCase()) !== -1) {
                // if it exists set the map view to the marker if not remove all markers
                if (item.marker) item.marker.setVisible(true);
            } else {
                if (item.marker) item.marker.setVisible(false);
            }
            return item.title.toLowerCase().indexOf(self.filterText().toLowerCase()) !== -1;
        });
    }, self);
    self.openInfoWindow = function(location) {
        openInfoWindow(location);
    };
}
//open when marker filtered 
function openInfoWindow(testLocations) {
    // loop through the markers to find the matching title
    for (var i in markers) {
        if (markers[i].title === testLocations.title) {
            populateInfoWindow(markers[i], infoWindow);
            toggleBounce(markers[i]);
        }
    }
}
//function to handel MapError
function mapError() {
    alert("Map could not be loaded . Please try again");
}
var vm = new ViewModel();
ko.applyBindings(vm);
