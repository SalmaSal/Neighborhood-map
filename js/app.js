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
        marker.addListener('click', markerClickHandler);    
        // Adjusts the map's bounds
        bounds.extend(markers[i].position);
    }
            // Opens up an infowindow when a marker is clicked 

    function markerClickHandler() {
        // Set the selected for this as true
        populateInfoWindow(this, infoWindow);
        toggleBounce(marker);
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
    self.testLocations = ko.observableArray(locations); //for serch box filter the list of locations
    // Collection of testLocation after going through search filter
    self.filteredTestsuites = ko.computed(function() {
        
        // If many white spaces in list, replace with only one white space
        fText = self.filterText().replace(/\s+/g, ' ');
       // var array = self.testLocations();
        // If there is anything in the search box, filter for this
        
        // As of now this does not divide the filterText and only searches the title
        var filteredCollection = ko.utils.arrayFilter(self.testLocations(), function(test) {
            if (fText.length) return test.title.toUpperCase().indexOf(fText.toUpperCase()) >= 0;
            else return 1;
        });
        return filteredCollection;
    }, self);
    self.openInfoWindow = function(location) {
        openInfoWindow(location);
    };
    self.resetMarkers=function(markers){
        resetMarkers(markers);
    };
}
//function to redeclare the markers
function resetMarkers(markers){
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
        // Opens up an infowindow when a marker is clicked 
        marker.addListener('click', markerClickHandler);    
        // Adjusts the map's bounds
        bounds.extend(markers[i].position);
    }
            // Opens up an infowindow when a marker is clicked
    function markerClickHandler() {
        // Set the selected for this as true
        populateInfoWindow(this, infoWindow);
        toggleBounce(marker);
      }
}
//open when marker filtered 
function openInfoWindow(filteredCollection) {
    // loop through the markers to find the matching title
    for (var i in markers) {
        if (markers[i].title === filteredCollection.title) {
            populateInfoWindow(markers[i], infoWindow);
            toggleBounce(markers[i]);
            markers[i].setMap(map);
        } else {
            //clear all marker not match filteredCollection.title  
            markers[i].setMap(null);}
    }  return setTimeout(resetMarkers(markers), 10000);
} 
    


//function to handel MapError
function mapError() {
    alert("Map could not be loaded . Please try again");
}
$(document).ready(function() {
    var vm = new ViewModel();
    ko.applyBindings(vm);
});
