var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent( e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);