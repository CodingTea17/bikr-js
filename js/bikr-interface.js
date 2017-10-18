var black_bikes = 0;
var red_bikes = 0;
var yellow_bikes = 0;
var blue_bikes = 0;
var green_bikes = 0;
var silver_bikes = 0;
var orange_bikes = 0;
var white_bikes = 0;
var other_bikes = 0;

google.charts.load("current", {packages:["corechart"]});

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Bike Color', '# of Bikes'],
    ['Black', black_bikes],
    ['Red', red_bikes],
    ['Yellow or Gold', yellow_bikes],
    ['Blue', blue_bikes],
    ['Green', green_bikes],
    ['Silver or Gray', silver_bikes],
    ['Orange', orange_bikes],
    ['White', white_bikes],
    ['Other', other_bikes]
  ]);

  var options = {
    title: 'Stolen Bike Colors',
    is3D: true,
    colors:['#010102', '#E50000', '#FFFF32', '#3838CC', '#328432', '#666666', '#FFAE19', '#E5E5E5', '#4C004C']
  };

  var chart = new google.visualization.PieChart(document.getElementById('stolen_bike_colors'));
  chart.draw(data, options);
}



$(document).ready(() => {
  $('#searchClick').click(() => {
    let make = $('#make').val();
    let model = $('#model').val();
    let year = $('#year').val();

    let promise = new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      let url = `https://bikeindex.org:443/api/v3/search?page=1&per_page=25&query=${make}%20${model}%20${year}&location=97205&distance=25&stolenness=proximity`;
      request.onload = () => {
        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      };
      request.open("GET", url, true);
      request.send();
    });

    promise.then((response) => {
      let data = JSON.parse(response);
      $("#results").show();
      $('#returnBike').html("");
      $("#bikeSearch").hide();
      data["bikes"].forEach((bike) => {
        let stolenDate = new Date(bike.date_stolen*1000)
        let bike_color = bike.frame_colors[0];
        switch(bike_color) {
          case "Black":
            bike_color = "bg-dark";
            break;
          case "Red":
            bike_color = "bg-danger";
            break;
          case "Yellow or Gold":
            bike_color = "bg-warning";
            break;
          case "Blue":
            bike_color = "bg-primary";
            break;
          case "Green":
            bike_color = "bg-success";
            break;
          case "Silver or Gray":
            bike_color = "table-active text-dark";
            break;
          case "Orange":
            bike_color = "bg-secondary";
            break;
          default:
            bike_color = "bg-light text-dark";
        }
        $('#returnBike').append(`<tr class="text-white ${bike_color} "><td>${bike.manufacturer_name}</td><td>${bike.frame_model}</td><td>${bike.year}</td><td>${bike.frame_colors}</td><td><a class="bike-link" href="https://bikeindex.org/bikes/${bike.id}">${bike.serial}</a></td><td>${stolenDate.getMonth() + 1}/${stolenDate.getDate()}/${stolenDate.getFullYear()}</td></tr>`);
      });
    }, (error) => {
      $('.showErrors').html(`There was an error processing your request: ${error.message}`);
    });
  });

  $("#clickGraph").click(() => {
    let promise = new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      let url = "https://bikeindex.org:443/api/v3/search?page=1&per_page=100&location=97205&distance=10&stolenness=proximity";
      request.onload = () => {
        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      };
      request.open("GET", url, true);
      request.send();
    });

    promise.then((response) => {
      let data = JSON.parse(response);
      data["bikes"].forEach((bike) => {
        let bike_color = bike.frame_colors[0];
        switch(bike_color) {
          case "Black":
            black_bikes += 1;
            break;
          case "Red":
            red_bikes += 1;
            break;
          case "Yellow or Gold":
            yellow_bikes += 1;
            break;
          case "Blue":
            blue_bikes += 1;
            break;
          case "Green":
            green_bikes += 1;
            break;
          case "Silver or Gray":
            silver_bikes += 1;
            break;
          case "Orange":
            orange_bikes += 1;
            break;
          case "White":
            white_bikes += 1;
            break;
          default:
            other_bikes += 1;        }
      });
      drawChart()
    }, (error) => {
      $('.showErrors').html(`There was an error processing your request: ${error.message}`);
    });
  });
});
