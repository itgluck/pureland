// Layers
var districts = L.layerGroup(),
    points = L.layerGroup(),    
    erIcon = L.icon({
        iconUrl: "images/er.png",
        iconSize: [40, 38], // size of the icon
        iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
    });

var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    yndx = new L.Yandex(),
    yndxSat = new L.Yandex("satellite"),
    hydda = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
        attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
    streets = L.tileLayer(mbUrl, { id: 'mapbox.streets' });

var map = L.map('map', {minZoom:12,maxZoom:18,zoomAnimation: false, layers: [hydda, points] }).setView([54.6982, 20.505], 12)
// .setMaxBounds([    [54.8, 20.2],    [54.6, 20.97]]);
var baseLayers = {
    "OSMap": hydda,
    "OSM": osm,
    "Карта": streets,
    "Яндекс": yndx,
    "Спутник": yndxSat
};

var overlays = {
    "Проблемные зоны": points,
    "Городсие районы": districts
};

L.control.layers(baseLayers, overlays, { position: "bottomright" }).addTo(map);

var markersLayer = new L.LayerGroup();	//layer contain searched elements
map.addLayer(markersLayer);
markersLayer.on('click', onMapClick);

// var popup = L.popup();
// myShare = function (e){
//     popup
//     .setLatLng(e.latlng)
//     // .setContent( e.latlng.toString())
//     .setContent( "<a href='?lat=54.75237&lng=20.4473' onclick='  window.open('https://www.facebook.com/sharer/sharer.php?s=100&p[title]=titlehere&p[url]=' + encodeURIComponent(location.href) + '&p[summary]=yoursummaryhere&p[images][0]=https%3A%2F%2Fwww.google.com%2Fimages%2Fsrpr%2Flogo3w.png,     'facebook-share-dialog',     'width=626,height=436');   return false;'>  Share on Facebook  </a>")
//         .openOn(map);
// }
////////////populate map with markers from sample data
for (i in erSub) {
    var 
    erPadding= L.point(48, 120),
    title = erSub[i].email,	//value searched
        loc = erSub[i].loc,		//position found
        description = erSub[i].description,
        marker = new L.Marker(new L.latLng(loc), { title: title, icon: erIcon });//se property searched
    marker.bindPopup('Уборка проведена активистами проекта Чистая Страна - Калининград' + description,
    {autoPanPaddingTopLeft: erPadding});
    
    markersLayer.addLayer(marker);
}
var logo = L.control({ position: "topleft" });

logo.onAdd = function (map) {
    this.logodiv = L.DomUtil.create('div', 'logo');
    this.logodiv.innerHTML = '<a href="mailto:pronin.s@i-labs.ru?subject=Чистая Страна - Калининград&body=Вы можете внести свой вклад в чистоту города, отправляйте фотографии мусорных контейнеров и свалок (укажите адрес и дату). Вместе мы сделаем город чище!По вопросам тел. 89673549307 Сергей Николаевич"><img src="images/logo_m.png" title="Сообщить о проблемной зоне"> </a>'
    //  

    return this.logodiv;
}

map.addControl(new L.Control.Search({

    url: 'https://nominatim.openstreetmap.org/search?format=json&q={s} городской округ Калининград',
    jsonpParam: 'json_callback',
    propertyName: 'display_name',
    textPlaceholder: 'Поиск по адресу',
    propertyLoc: ['lat', 'lon'],
    marker: L.circleMarker([0, 0], { radius: 16 }),
    autoCollapse: true,
    // autoType: false,
    // minLength: 3,
}));

var info = L.control({ position: "topright" });


info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info width');
    this.update();
    return this._div;
};

info.update = function (props) {

    this._div.innerHTML = (props ?
        ' <input type="checkbox" id="zoomCheck"><label for="zoomCheck"><img src="' + props.img + '"></label><br>' +
        'Адрес: <b>ул. ' + props.title +
        '</b><br>Дата: ' + props.date
        : '<i>Обновлено: 15.10.19|20:00<br>* Точность меток ~ 70м</i>');

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
        color: feature.properties.color,
        opacity: .5,
        fillColor: feature.properties.color,
        fillOpacity: .1
    };

}

function districtInfo(e) {
    var layer = e.target;
    legend.update(layer.feature.properties);
    info.update();
    layer.setStyle(
        {
            weight: 2,
            color: '#FF301F',
            dashArray: '9',
            fillOpacity: .3,
            fillColor: layer.feature.properties.color
        });
    setTimeout(function () { legend.update() }, 4000);
}
function districtSelect() {
    map.closePopup()
    layer.setStyle(styleDist(feature));
}

function highlightFeature(e) {
    var point = L.point(48,300);
    var layer = e.target;
    if (!L.Browser.ie) {
        layer.bringToFront();
    }
    // legend.update()
    info.update(layer.feature.properties);
    if (layer.feature.properties.status > 4) {
    
        layer.bindPopup('<h3>Проведена уборка</h3><input type="checkbox" id="zoomCheck"><label for="zoomCheck"><img src="' + layer.feature.properties.c_img + '"></label><br>Дата: ' + layer.feature.properties.c_date,
        {autoPanPaddingTopLeft: point});
        layer.setStyle(
            {
                weight: 3,
                color: '#3ECF60',
                fillColor: '#9AEEAE'
            });
            
    }
    else if (layer.feature.properties.status == 3) {

        layer.bindPopup('<h3>Идут работы по уборке территории</h3>',
        {autoPanPaddingTopLeft: point});
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
        layer.bindPopup('<h3>Систематические загрязнения</h3><input type="checkbox" id="zoomCheck"><label for="zoomCheck"><img src="' + layer.feature.properties.c_img + '"></label><br>Дата: ' + layer.feature.properties.c_date,
        {autoPanPaddingTopLeft: point}
        );
        // layer.openPopup();
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
var geojson,
    geoDistjson;
// erMarker = new L.marker( [54.6982, 20.505] , {icon:erIcon}).mapAdd;
function onMapClick() {
    // map.panTo(e.latlng);
    info.update();
    legend.update();
    // geoDistjson.remove();
    }
    map.on(
        {dblclick:onMapClick,
        contextmenu:resetAll
        // contextmenu:myShare
});

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}
function resetAll() {
    info.update();
    legend.update();
    map.closePopup();
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
    // maxZoom: 14, minZoom: 14,
    style: styleDist,
    onEachFeature: onEachFeatureDistrict
}).addTo(districts);

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

map.addControl(new L.Control.Search({
    layer: geojson,
    autoCollapse: true,
    title: "Поиск по меткам",
    textPlaceholder: 'Поиск по меткам на карте'
}));  //inizialize search control
// markersLayer.on('click', onMapClick);
map.attributionControl.addAttribution('&copy; <a href="mailto:it.gluck@ya.ru?subject=Чистая Страна - Калининград&body=Задайте вопрос, о данных на карте.">IT_GLu(:k</a>');
logo.addTo(map);

