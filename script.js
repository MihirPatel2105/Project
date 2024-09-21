var locations = {
    "Home": [userLocation],
    "Xerox": [22.601573181938143, 72.82045628855217],
    "Bank": [22.60117618960099, 72.82051541076538],
    "Canteen": [22.601510479109173, 72.82052613960055],
    "Admin Office": [22.59939, 72.82045],
    "Hospital": [22.602696581265278, 72.82126642928722],
};

// Define buildings with their coordinates
var buildings = {
    'A2 Building RPCP':[22.599368402415315, 72.81978535046156],
    'A3 Building IIIM':[22.600035369257835, 72.82076191232372],
    'A5 DEPSTAR BUILDING': [22.600820337176675, 72.82026689653912],
    'A6 CSPIT EC Building': [22.60029, 72.81946],
    'A7 CSPIT CE Building': [22.59951, 72.81817],
    'A8 PDPIAS BUILDING': [22.601687189963116, 72.819595859821],
    'A9 CMPICA BUILDING': [22.603348466570708, 72.8184282975782],

    // Add more buildings here
};

// Combine all locations and buildings for autocomplete suggestions
var allPlaces = [
    ...Object.keys(locations),
    ...Object.keys(buildings)
];

// Initialize the map and set an initial view
var map = L.map('map').setView([22.589220, 72.795967], 15);

// Tile layer for normal view (Streets)
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map); // Add streets view by default

// Tile layer for satellite view
var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Layer control to switch between normal view and satellite view
var baseMaps = {
    "Streets": streets,
    "Satellite": satellite
};

// Add the control to the map
L.control.layers(baseMaps).addTo(map);

// Geocoder Search functionality
var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
}).addTo(map);

// Variable to store the user's current location
var userLocation;
var routeControl; // Variable to store the route control
var lastMarker; // Variable to store the last marker added

// Event listener for location found
map.on('locationfound', function (e) {
    userLocation = e.latlng; // Store user's current location

    // Add a marker for user's current location
    var userMarker = L.marker(userLocation).addTo(map).bindPopup('You are here').openPopup();
});

// Event listener for location not found or error
map.on('locationerror', function (e) {
    alert("Location access denied or not available.");
});

// Locate user's current location
map.locate({ setView: true, maxZoom: 16 });

// Function to draw routes from user's location to a destination
function drawRoute(destinationCoords) {
    if (userLocation) {
        // Remove previous route control if it exists
        if (routeControl) {
            map.removeControl(routeControl);
        }

        routeControl = L.Routing.control({
            waypoints: [
                L.latLng(userLocation), // Start from the user's current location
                L.latLng(destinationCoords) // End at the building
            ],
            routeWhileDragging: true, // Allow dragging the route on the map
            lineOptions: {
                styles: [{ color: 'blue', opacity: 0.7, weight: 5 }] // Route style
            },
            createMarker: function() { return null; } // Disable default markers
        }).addTo(map);
    } else {
        alert("Current location not found. Please allow location access.");
    }
}

// Function to move the map to a specified location (building)
function goToLocation(locationName) {
    // Cancel the previous search before starting a new one
    cancelSearch();

    // Check if the location is a predefined location (e.g., Home, Canteen)
    if (locations[locationName]) {
        map.setView(locations[locationName], 18);
        lastMarker = L.marker(locations[locationName]).addTo(map)
            .bindPopup(locationName)
            .openPopup();
        drawRoute(locations[locationName]);
    } else if (buildings[locationName]) {
        // If the location is a building name, show only the building
        map.setView(buildings[locationName], 18);
        lastMarker = L.marker(buildings[locationName]).addTo(map)
            .bindPopup(locationName)
            .openPopup();
        drawRoute(buildings[locationName]);
    } else {
        // Perform geocoding search using the input text if not a building or predefined location
        geocoder.options.geocoder.geocode(locationName, function(results) {
            if (results.length > 0) {
                var result = results[0];
                map.setView(result.center, 15);
                lastMarker = L.marker(result.center).addTo(map)
                    .bindPopup(result.name)
                    .openPopup();

                // Draw a route from the user's current location to the geocoded location
                drawRoute(result.center);
            } else {
                alert('Location not found');
            }
        });
    }
}

// Function to cancel the previous search
function cancelSearch() {
    // Remove the last route control if it exists
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }

    // Remove the last marker if it exists
    if (lastMarker) {
        map.removeLayer(lastMarker);
        lastMarker = null;
    }
}

// Function to update the suggestions based on user input
function updateSuggestions(input) {
    var suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = ''; // Clear previous suggestions

    // Convert input to lowercase for case-insensitive comparison
    var inputLower = input.toLowerCase();

    // Filter all places based on whether they include the input term
    var matches = allPlaces.filter(function(place) {
        return place.toLowerCase().includes(inputLower);
    });

    // Add matched locations as options in the suggestion box
    matches.forEach(function(match) {
        var option = document.createElement('option');
        option.value = match;
        suggestions.appendChild(option);
    });
}

// Add a search functionality using the search box
document.getElementById('searchBox').addEventListener('input', function (e) {
    updateSuggestions(e.target.value);
});

// Add a search functionality using the search box
document.getElementById('searchBox').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') { // Check if 'Enter' key is pressed
        var searchText = e.target.value;

        // Cancel the previous search
        cancelSearch();

        // Check if the search text matches a building name or predefined location
        if (locations[searchText] || buildings[searchText]) {
            goToLocation(searchText);
        } else {
            // Perform geocoding search using the input text if not a building or predefined location
            geocoder.options.geocoder.geocode(searchText, function(results) {
                if (results.length > 0) {
                    var result = results[0];
                    map.setView(result.center, 15);
                    lastMarker = L.marker(result.center).addTo(map)
                        .bindPopup(result.name)
                        .openPopup();

                    // Draw a route from the user's current location to the geocoded location
                    drawRoute(result.center);
                } else {
                    alert('Location not found');
                }
            });
        }
    }
});
