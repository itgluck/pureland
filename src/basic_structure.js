// Layers
var points = L.layerGroup();
var districts = L.layerGroup();
// L.marker([54.90942,20.51657]).bindPopup('This is Littleton, CO.').addTo(points),
// L.marker([54.20942,20.60657]).bindPopup('This is Denver, CO.').addTo(points);

var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var satellite = L.tileLayer(mbUrl, { id: 'mapbox.satellite'}),
    streets = L.tileLayer(mbUrl, { id: 'mapbox.streets'});

var map = L.map('map', { minZoom: 12, layers: [streets, points, districts] }).setView([54.6982, 20.505], 12);

var baseLayers = {
    "Спутник": satellite,
    "Карта": streets
};

var overlays = {
    "Городсие районы": districts,
    "Проблемные зоны": points
};

L.control.layers(baseLayers, overlays, { position: "bottomright" }).addTo(map);



var tile = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="blank">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions" target="blank">CartoDB</a>' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);

map.addControl(new L.Control.Search({
    url: 'https://nominatim.openstreetmap.org/search?format=json&q={s} городской округ Калининград',
    jsonpParam: 'json_callback',
    propertyName: 'display_name',
    propertyLoc: ['lat', 'lon'],
    marker: L.circleMarker([0, 0], { radius: 12 }),
    autoCollapse: true,
    autoType: false,
    minLength: 2
}));





// %%%%%%%%%%%%%%
var info = L.control();
var logo = L.control({ position: "topleft" });

logo.onAdd = function(map) {
    this.logodiv = L.DomUtil.create('div','logo');
    this.logodiv.innerHTML = '<a href="mailto:pronin.s@i-labs.ru?subject=Чистая Страна - Калининград&body=Вы можете внести свой вклад в чистоту города, отправляйте фотографии мусорных контейнеров и свалок (укажите адрес и дату). Вместе мы сделаем город чище!По вопросам тел. 89673549307 Сергей Николаевич"><img src="images/logo_m.png" title="Сообщить о проблемной зоне"> </a>'
    //  
    
    return this.logodiv;
}
logo.addTo(map);

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info width');
    this.update();
    return this._div;
};

info.update = function (props) {

    this._div.innerHTML = (props ?
        ' <input type="checkbox" id="zoomCheck"><label for="zoomCheck"><img src="' + props.img + '"></label><br>' +
        'Адрес: <b>' + props.street +
        '</b><br>Дата: ' + props.date
        : '<i>Обновлено: 14.04.19|08:30<br>* Точность меток ~ 70м</i>');

}

info.addTo(map);



var legend = L.control({ position: 'topright' });

legend.onAdd = function (map) {

    this.div = L.DomUtil.create('div', 'legend'),
        this.update();
    return this.div;
};

legend.update = function (props) {

    this.div.innerHTML = (props ?
        '<h3>' + props.title + '</h3><img style=" width:80px;"src="' + props.img + '"><br><strong>ООО"' + props.name + '"</strong><br>Адрес: '
        + props.addres + '<br>тел.: ' + props.contact + '<br>Сайт организации: <a href="' + props.site + '">' + props.site + '</a>'
        : '');

};

legend.addTo(map);
function getColor(d) {
    return d > 5 ? '#08AE1E' :
        d > 4 ? '#08AE1E' :
            d > 3 ? '#3CFC14' :
                d > 2 ? '#035CE7' :
                    d > 1 ? '#FD5E4D' :
                        '#DC0000';
}

function style(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: '#333',
        dashArray: '',
        fillOpacity: 1,
        fillColor: getColor(feature.properties.status)
    };
}

function styleDist(feature) {
    return {
        weight: 1,
        opacity: .5,
        color: feature.properties.color,
        dashArray: '',
        fillOpacity: .2,
        fillColor: feature.properties.color
    };

}

function districtInfo(e) {
    var layer = e.target;
    legend.update(layer.feature.properties);
    info.update();
    layer.setStyle(
        {
            weight: 4,
            color: '#FF301F',
            fillColor: '#2CAA30'
        });
    setTimeout(function () { legend.update() }, 8000);
}
function districtSelect() {

    layer.setStyle(
        {
            weight: 4,
            color: '#FF301F',
            fillColor: '#2CAA8E'
        });

}

function highlightFeature(e) {
    var layer = e.target;

    if (!L.Browser.ie) {
        layer.bringToFront();
    }
    legend.update()
    info.update(layer.feature.properties);
    if (layer.feature.properties.status > 4) {

        layer.bindPopup('<h3>Проведена уборка</h3><img src="' + layer.feature.properties.c_img + '"><br>Дата: ' + layer.feature.properties.c_date);
        layer.openPopup();
        layer.setStyle(
            {
                weight: 3,
                color: '#3ECF60',
                fillColor: '#9AEEAE'
            });
    }
    else if (layer.feature.properties.status == 3) {
        layer.bindPopup('<h3>Идут работы по уборке территории</h3>');

        layer.setStyle(
            {
                weight: 3,
                color: '#035CE7',
                fillColor: '#6C95D7',
                dashArray: '',
                fillOpacity: 0.7
            });
    }
    else if (layer.feature.properties.status == 1) {
        layer.bindPopup('<h3>Систематические загрязнения</h3><img src="' + layer.feature.properties.c_img + '"><br>Дата: ' + layer.feature.properties.c_date);
        layer.openPopup();
        layer.setStyle(
            {
                weight: 4,
                color: '#B903E7',
                fillColor: '#D27CE8',
                dashArray: '',
                fillOpacity: 0.9
            });
    }

    else {
        layer.setStyle(
            {
                weight: 3,
                color: '#FE0000',
                fillColor: '#fff',
                dashArray: '',
                fillOpacity: 0.7
            })
    };
}
var geojson;
var geoDistjson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    map.closePopup();
    // if (L.Browser.android) {
    //     map.flyTo(e.latlng, 12);
    // }
}

function zoomToFeature(e) {
    map.panTo(e.latlng);
}
function closeInfo() {
    info.update();

}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
function districtClear(e) {
    var layer = e.target;
    layer.setStyle(
        {
            weight: 3,
            color: layer.feature.properties.color,
            fillColor: layer.feature.properties.color,
            fillOpacity: .2,
        });
    // setTimeout(function () { legend.update() }, 10000);

}
function onEachFeatureDistrict(feature, layer) {
    layer.on({
        // mouseover: closeInfo,
        mouseout: districtClear,
        click: districtInfo
    });
}
geoDistjson = L.geoJson(district, {
    style: styleDist,
    onEachFeature: onEachFeatureDistrict
}).addTo(districts).addTo(map);

geojson = L.geoJson(trashData, {
    style: style,
    onEachFeature: onEachFeature,

    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 11,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    }
}).addTo(points).addTo(map);

map.attributionControl.addAttribution('&copy; <a href="mailto:it.gluck@ya.ru?subject=Чистая Страна - Калининград&body=Задайте вопрос, о данных на карте.">IT_GLu(:k</a>');

