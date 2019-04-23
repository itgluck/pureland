
var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var satellite = L.tileLayer(mbUrl, { id: 'mapbox.satellite'}),
    streets = L.tileLayer(mbUrl, { id: 'mapbox.streets'});

var map = L.map('map', { minZoom: 12,layers: [streets]}).setView([54.6982, 20.505], 12);

var baseLayers = {
    "Карта": streets,
    "Спутник": satellite
};

L.control.layers(baseLayers, { position: "bottomright" }).addTo(map);



var tile = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="blank">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions" target="blank">CartoDB</a>' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);


var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("Координаты " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);



map.attributionControl.addAttribution('&copy; <a href="mailto:it.gluck@ya.ru?subject=Чистая Страна - Калининград&body=Задайте вопрос, о данных на карте.">IT_GLu(:k</a>');

