
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

// function getLOP(){
//   $.ajax({
//     url: "/api/pois",
//     method: "GET",
//     success: function(obj){
//       for (var i = 0; i < obj.length; i++){
//         listOfPoints.push(obj[i]);
//       }
//     }
//   })
// }


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
            // infowindow.setContent(
            //   ` <ul class="px-3 py-2">
            //  <form class="form-container">
            //  <div class="form-group">
            //       <input name="title"  placeholder="Name your hotspot" class="form-control form-control-sm"
            //                                          type="text" required="">
            //  </div>
            //  <div class="form-group">
            //           <input name="desc" placeholder="Enter a Description" class="form-control form-control-sm" type="text" required="">
            //  </div>
            //  <div class="form-group">
            //  <input name="imgurl" placeholder="Enter a image link" class="form-control form-control-sm" type="text" required="">



            //  </div>
            //          <input name="lat" type="hidden" value="${mapRes.arrPois[i].lat}"/>
            //           <input name="lng" type="hidden" value="${mapRes.arrPois[i].lng}"/>
            //  <div class="form-group">
            //      <button type="submit" class="update">Update</button>
            //  </div>
            //  </form>
            //  </ul>`
            //   );
          });
        })
      }
    })(marker, i));
  }




}


  // $(".edit").on("click", function(ev){
  //   ev.preventDefault();
  //   debugger;
  //   // var curIW = infoWindow[$(this).closest("")]
  //   var id = $(this).attr("id");
  //   var newIW = document.getElementById(id);
  //   newIW.setContent(
  //     '<form class="form-container">' +
  //     '<p>Title</p>' +
  //     '<input type="text" name="title" placeholder="Name your hotspot">' +
  //     '<p>Description</p>' +
  //     '<input type="text" name="desc" placeholder="Enter a Description">' +
  //     '<input name="lat" type="hidden" value="'+ location.lat() + '"/>' +
  //     '<input name="lng" type="hidden" value="'+ location.lng() + '"/>' +
  //     '<button type="submit">Create</button>' +
  //     '</form>'
  //     )
  // })


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


  // $.ajax({
  //   method: "POST",
  //   url: "/api/pois"
  // }).done(()=>{
  //   console.log("successfully posted");
  // });


})

