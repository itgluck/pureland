// // Layers
// var points = L.layerGroup();
// var districts = L.layerGroup();
// L.marker([54.90942,20.51657]).bindPopup('This is Littleton, CO.').addTo(points),
// L.marker([54.20942,20.60657]).bindPopup('This is Denver, CO.').addTo(points);

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



var logo = L.control({ position: "topleft" });

logo.onAdd = function(map) {
    this.logodiv = L.DomUtil.create('div','logo');
    this.logodiv.innerHTML = '<a href="mailto:pronin.s@i-labs.ru?subject=Чистая Страна - Калининград&body=Вы можете внести свой вклад в чистоту города, отправляйте фотографии мусорных контейнеров и свалок (укажите адрес и дату). Вместе мы сделаем город чище!По вопросам тел. 89673549307 Сергей Николаевич"><img src="images/logo_m.png" title="Сообщить о проблемной зоне"> </a>'

    return this.logodiv;
}
logo.addTo(map);





map.attributionControl.addAttribution('&copy; <a href="mailto:it.gluck@ya.ru?subject=Чистая Страна - Калининград&body=Задайте вопрос, о данных на карте.">IT_GLu(:k</a>');

