
var listOfPoints = [];
var gMarkers = [];
var map;
function mapInit() {
  var mapSettings = {
    center: new google.maps.LatLng(43.65432, -79.38347),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
 map = new google.maps.Map(document.getElementById("map"), mapSettings);
}

$(() => {
function makeMap(mapRes){
  var marker;
  for (var i = 0; i < mapRes.arrPois.length; i++){
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(mapRes.arrPois[i].lat, mapRes.arrPois[i].lng),
      map: map
    });
    gMarkers.push(marker);
    google.maps.event.addListener(marker, 'click', (function(marker, i) {

      return function() {
        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent(
          '<div id="'+ i + '"/>'
          + '<p>Title: ' + mapRes.arrPois[i].title + '</p>'
          + '<p>Description: ' + mapRes.arrPois[i].desc + '</p>'
          + '<img class=imgurl src="' + mapRes.arrPois[i].imgurl + '">'
          + '<button class="delete" >Delete</button>')
        infowindow.open(map, marker);
        google.maps.event.addListener(infowindow, 'domready', function(){
          $(".delete").on("click", function(ev){
            ev.preventDefault();
            var poiID = mapRes.arrPois[i].id;
            $.ajax({
              url: '/pois/' + poiID,
              method: "DELETE",
              success: function(){
                location.href

              }
            })
          });
        })
      }
    })(marker, i));
  }




}

   var url = window.location.pathname;
   var id = url.substring(url.lastIndexOf('/') + 1);

  $.ajax({
    method: "GET",
    url: "/data/" + id
  }).done((map) => {
    makeMap(map);
    map.arrPois.forEach((p) => {
      listOfPoints.push(p);
    })
  });;

  $(window).click((e) =>{
    $("#poiPopup").css({left: e.pageX});
    $("#poiPopup").css({top: e.pageY});
    $("#poiPopup").show();
  });

})

