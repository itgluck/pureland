
L.LocShare = {}
var LS = L.LocShare
LS.Send = {}
LS.Send.Marker = {}
LS.Send.Popup = L.popup().setContent('<div><h4>Перемещайте маркер</h4><input id="sendText" type="text" style="max-width:95%;border-radius:5px;border: #ccc solid 1px;height:30px;" size="30" onkeyup="L.LocShare.Send.UpdateMessage( this )" placeholder="Ваше сообщение..."/></div><div style="height:35px;"><button style="border-radius:5px;border:#2BB94D solid 2px;float:right;color:white;background-color:#31D758;height:32px;font-size:16px;line-height:2px;margin:5px;" onclick="copyPrompt()">Ок</button><button style="border-radius:5px;border:#C92323 solid 2px;float:left;color:white;background-color:#EA4E4E;height:32px;font-size:16px;line-height:2px;margin:5px;" onclick="reset()">Отмена</button></div></div>')
// LS.Send.Popup = L.popup().setContent('<form action="mailto:it.gluck@ya.ru" method="post">Name:<br><input type="text" name="name"><br>E-mail:<br><input type="text" name="mail"><br>Comment:<br><input type="text" name="comment" size="50"><br><br><input type="submit" value="Send"><input type="reset" value="Reset"></form>')
LS.Receive = {}
LS.Receive.Marker = {}
LS.Receive.Popup = L.popup()
var sendIcon = L.icon({
  // iconUrl: "https://raw.githubusercontent.com/CliffCloud/Leaflet.LocationShare/master/dist/images/IconMapSend.png",
  iconUrl: "images/locations.png",
  iconSize:     [54, 70], // size of the icon
  iconAnchor:   [27, 70], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
})

receiveIcon = L.icon({
  iconUrl: "images/location.png",
  iconSize:     [54, 70], // size of the icon
  iconAnchor:   [27, 70], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
})

L.Map.addInitHook(function () {
  this.sharelocationControl = new L.Control.ShareLocation();
  this.addControl(this.sharelocationControl);
  this.whenReady( function(){
    populateMarker(this);
  })
});

L.Control.ShareLocation = L.Control.extend({
    options: {
        position: 'topleft',
        title: 'Сообщить о загрязнении'
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-bar-part', container);
        this.link.title = this.options.title;
        var userIcon = L.DomUtil.create('img' , 'img-responsive' , this.link);
        userIcon.src = 'images/IconLocShare.png'
        this.link.href = '#';

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

    _click: function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      placeMarker( this._map )
    },
});

populateMarker = function (selectedMap) {
  // replace the line below with the results of any Url parser
  var intermediate = getJsonFromUrl()
  if ( isFinite(intermediate.lat) && isFinite(intermediate.lng) ){
    LS.Receive.message = intermediate.M
    LS.Receive.lat = + intermediate.lat 
    console.log( intermediate.lat )
    LS.Receive.lng = + intermediate.lng 
    console.log( intermediate.lng )
    var text = '<table><tr><td><p>' + LS.Receive.message + '</p></td><td><p>Lat: ' + LS.Receive.lat + '</p><p>Lng: ' + LS.Receive.lng + '</p></td></tr></table>'
//    LS.Receive.Popup.setContent(LS.Receive.message)
    LS.Receive.Marker = L.marker( [ LS.Receive.lat , LS.Receive.lng] , {icon:receiveIcon})
    console.log( LS.Receive.Marker._latlng )
    LS.Receive.Marker.bindPopup(LS.Receive.message) 
    LS.Receive.Marker.addTo(selectedMap)
    LS.Receive.Marker.openPopup()  
  } 
}

function getJsonFromUrl () {
  var params = {}
  params.query = location.search.substr(1);
  params.parsed = decodeURIComponent( params.query )
  params.data = params.parsed.split("&");
  params.result = {};
  for(var i=0; i<params.data.length; i++) {
    var item = params.data[i].split("=");
    params.result[item[0]] = item[1];
  }
  // This will return all of the data in the query parameters in object form
  // getJsonFromUrl() only splits on ampersand and equals -- jquery can do better
  // But so could you!! submit a pull request if you've got one!
  return params.result;
}


// function copyPrompt() {
//   window.prompt("Скопируйте строку: Ctrl+C, Enter", '' + 
//                 location.origin + location.pathname + '?' + 
//                 'lat' + '=' + LS.Send.lat + '&' +
//                 'lng' + '=' + LS.Send.lng + '&' +
//                  'M' + '=' +  LS.Send.Message);
// }

function copyPrompt() {
  
  // let res = 'https://itgluck.github.io/pureland/point_add' + '?' + 
  var res = location.origin + location.pathname  + '?' + 
  'lat' + '=' + LS.Send.lat + '&' +
  'lng' + '=' + LS.Send.lng + '&' +
   'M' + '=' +  LS.Send.Message;
  window.prompt("Скопируйте строку ниже и отправьте её в чат или на email", '' + res);
  // window.location( res);
  var r = confirm("Отправьте данные координатору проекта\nДля просмотра результата? в новом окне нажмите [Ок].\nДля возврата к кате нажмите [Отмена]");

  if (r == true) {

    window.open( res);


  } else {
   return
  }
}

function reset() {
  // window.location.href='https://goo.gl/xzob6y'
// this.res = location.origin + location.pathname;
window.open(location.origin + location.pathname,'_self');
}
function placeMarker( selectedMap ){
//  var test = LS.Send.Marker._latlng
//  if ( isFinite(test.lat) && isFinite(test.lng) ){
    if (!LS.Send.Marker._latlng ) {
      console.log('if (!LS.Send.Marker._latlng ) { passed!  line 95')
      LS.Send.Marker = L.marker( selectedMap.getCenter() , {draggable: true,icon: sendIcon} );
      setSendValues( selectedMap.getCenter() )
      LS.Send.Marker.on('dragend', function(event) {
        setSendValues( event.target.getLatLng());
        LS.Send.Marker.openPopup();
      });
      LS.Send.Marker.bindPopup(LS.Send.Popup);
      LS.Send.Marker.addTo(selectedMap);
    } else {
      LS.Send.Marker.setLatLng( selectedMap.getCenter() )
    }
    //selectedMap.setView( location , 16 )
    LS.Send.Marker.openPopup();
//  }
};

LS.Send.UpdateMessage = function( text ){
  var encodedForUrl = encodeURIComponent( text.value );
  LS.Send.Message = encodedForUrl
}

function setSendValues( result ){
  LS.Send.lat = result.lat;
  LS.Send.lng = result.lng; 
}
  
