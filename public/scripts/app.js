$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
  });;
});

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/maps"
  }).done((maps) => {
  });;
});

$(()=> {
  $('.create-map').on("submit", event =>{
    $.ajax({
      method: "GET",
      url: "/maps/new"
    }).done((res)=> {});
  })
})

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/maps",
  }).done((returnData) => {
    for(let map of returnData.results) {
      let newMap = $("#mapslist").dropdown().append(`
        <li><a href="/maps/${map.id}" class='showmap'>${map.title}</a>
        <img class="fav-icon" src="/images/map.png"> </li>
        `);
      if (map.fav_array) {
        map.fav_array.forEach(function(fav_id) {
          if (fav_id === returnData.id) {
              let favMap = $("#favMaps").dropdown().append(`<li><a href="/maps/${map.id}" class='my-map'>${map.title}</a>
                <img class="fav-icon" src="/images/map.png"></li>`);
          }
        })
      } else if (map.user_id === returnData.id) {
        let myMap = $("#myMaps").dropdown().append(`<li><a href="/maps/${map.id}" class='my-map'>${map.title}</a>
          <img class="fav-icon" src="/images/map.png"></li>`);
      }
    }
  }).done((returnData) => {
    console.log("hi")
    })
  }
);
