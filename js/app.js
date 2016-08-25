// Initialize Firebase
var config = {
    apiKey: "AIzaSyCCDXBaF8YM4RaMhR7wlm4mGiQqOgBuCj4",
    authDomain: "new-project-c88af.firebaseapp.com",
    databaseURL: "https://new-project-c88af.firebaseio.com",
    storageBucket: ""
};

var map;
var detailsService;
var activePlace;
var detailsTemplateHtml;
var detailsTemplate;

var places;

firebase.initializeApp(config);
var database = firebase.database();

function initMap() {
    map = document.getElementById("map");
    detailsService = new google.maps.places.PlacesService(map);
    map = new google.maps.Map(map, {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });
    loadApp();
}

function loadApp() {
    firebase.database().ref('locations/').once('value').then(createButtons);

    detailsTemplateHtml = $("#location-details").html();
    detailsTemplate = Handlebars.compile(detailsTemplateHtml);
}

function createButtons(data) {
  var locations = data.val();
    locations.forEach(function(location){
      var locationButton = $('<button class="waves-effect waves-light btn-large location-button"><i class="material-icons left">cloud</i>' + location.name + '</button>');
      locationButton.bind('click', { id: location.id }, function(event){
        getPlace(event.data.id);
      });
      $('#locationButtons').append(locationButton);
    });
}

function moveMap(coords) {
    map.panTo(coords);
};

function getPlace(id) {
    detailsService.getDetails({
        placeId: id
    }, callback)

    function callback(place) {
        loadDetails(place);
        moveMap(place.geometry.location)
    }
};

function loadDetails(place) {
  var photos = [];
  place.photos.forEach(function(photo){
    photo.url = photo.getUrl({
      maxWidth: 300
    });
    photos.push(photo);
  });

  var context = {
    name: place.name,
    website: place.website,
    phoneNumber: place.formatted_phone_number,
    reviews: place.reviews,
    photos: photos
  }
  var html = detailsTemplate(place);
  $('#location-details-pane').html(html);
}
