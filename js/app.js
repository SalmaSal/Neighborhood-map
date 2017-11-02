//===============Model=============//
var locations = [{
    title: 'King Abdullah Petroleum Studies and Research Center',
    address: {
        lat: 24.879240,
        lng: 46.722068
    },
    description: 'international research center in Riyadh'
}, {
    title: 'Princess Nora bint Abdul Rahman University',
    address: {
        lat: 24.846461,
        lng: 46.724731
    },
    description: 'first university for femel only'
}, {
    title: 'Diriyah',
    address: {
        lat: 24.749729,
        lng: 46.535307
    },
    description: 'Resturent'
}, {
    title: 'The Ritz-Carlton Hotel Company',
    address: {
        lat: 24.666362,
        lng: 46.630396
    },
    description: "Hotel"
}, {
    title: 'Lusin restaurant',
    address: {
        lat: 24.697987,
        lng: 46.683494
    },
    description: 'Armanian resturent'
}];
//=======declare global var==========//
var map;
var infoWindows;
var bounds;
var markers = [];
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
        var marker = new google.maps.Marker({
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
          marker.addListener('click', function() {
              populateInfoWindow(this, infoWindow);
              toggleBounce(marker);
          });
          // Adjusts the map's bounds
          bounds.extend(markers[i].position);
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
                infowindow.setContent('<div>' + '<a href ="' + articleList.web_url + '">' + articleName + '</a>' + '</div>');
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
    self.testLocations = ko.observableArray(locations);//for serch box filter the list of locations
    
    // Collection of testLocation after going through search filter
    self.filteredTestsuites = ko.computed(function() {
        // If many white spaces in list, replace with only one white space
        fText = self.filterText().replace(/\s+/g, ' ');
        // If there is anything in the search box, filter for this
        // As of now this does not divide the filterText and only searches the title 
        var filteredCollection = ko.utils.arrayFilter(self.testLocations(), function(test) {
            if (fText.length) return (test.title.toUpperCase().indexOf(fText.toUpperCase()) >= 0);
            else return 1;
        }); 
        return filteredCollection;
    }, self);
   
    self.openInfoWindow = function(location){
        openInfoWindow(location);
    };
}

//open when marker filtered 
function openInfoWindow(filteredCollection) {
  
    // loop through the markers to find the matching title
    for (var i in markers) {
        if (markers[i].title === filteredCollection.title) {
            populateInfoWindow(markers[i], infoWindow);
            toggleBounce(markers[i]);
           
        }
    }
}

//function to handel MapError
function mapError() {
    alert("Map could not be loaded . Please try again");
}

$(document).ready(function() {
    var vm = new ViewModel();
    ko.applyBindings(vm);
});