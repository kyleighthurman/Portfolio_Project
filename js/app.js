/* Initialize Firebase */
var config = {
    apiKey: "AIzaSyCCDXBaF8YM4RaMhR7wlm4mGiQqOgBuCj4",
    authDomain: "new-project-c88af.firebaseapp.com",
    databaseURL: "https://new-project-c88af.firebaseio.com",
    storageBucket: ""
};
/* declaring all my variables for global scope */
var map;
var detailsService;
var activePlace;
var detailsTemplateHtml;
var detailsTemplate;
var places;

/* more neccessary things from firebase documentation */
firebase.initializeApp(config);
var database = firebase.database();

/* initialize my map from google and this function is from google */
function initMap() {
    map = document.getElementById("map");
    detailsService = new google.maps.places.PlacesService(map);
    /* here i am now setting default values for my map when it initially loads */
    map = new google.maps.Map(map, {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });
    loadApp();
}

/* now run load app function because i just called it above at end of init map
 firebase necessesities below */
function loadApp() {
    firebase.database().ref('locations/').once('value').then(createButtons);
    /* this is for handlebars to compile */
    detailsTemplateHtml = $("#location-details").html();
    detailsTemplate = Handlebars.compile(detailsTemplateHtml);
}


function createButtons(data) {
    var locations = data.val();
    locations.forEach(function(location) {
        /* this is the buttons that are generated from my firebase api entry/call*/
        var locationButton = $('<button class="waves-effect waves-light btn-large location-button"><i class="material-icons left">cloud</i>' + location.name + '</button>');
        /* here i am binding the click function on the buttons that i just made above */
        locationButton.bind('click', {
            id: location.id
        }, function(event) {
            getPlace(event.data.id);
        });
        /* this will add the button to the UI in the location that i just made */
        $('#locationButtons').append(locationButton);
    });
}
/* this is where google is expected placeId and i have called it ID. i am calling getDetails method way up high,
this is googles places api */
function getPlace(id) {
    detailsService.getDetails({
        placeId: id
    }, callback)

    // callback is the object returned from google containing the place information
    function callback(place) {
        loadDetails(place);
        moveMap(place.geometry.location)
    }
};

/* this section is for the details of the object it will contain photos,
that i want */
function loadDetails(place) {
    var photos = [];
    place.photos.forEach(function(photo) {
        photo.url = photo.getUrl({
            maxWidth: 300
        });
        photos.push(photo);
    });

    /*  this is for handlebars to know where to place it in the html file */
    var html = detailsTemplate(place);
    $('#location-details-pane').html(html);
}

/* this makes the map move to the lat and lng that i have passed in above in the firebase entry*/
function moveMap(coords) {
    map.panTo(coords);
};
