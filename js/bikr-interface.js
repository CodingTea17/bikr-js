import { Bikr } from './../js/bikr.js'

google.charts.load("current", {packages:["corechart"]});

$(document).ready(() => {

  let bike = new Bikr;

  $('#searchClick').click(() => {
    $("#results").show();
    $('#returnBike').html("");
    $("#bikeSearch").hide();

    let make = $('#make').val();
    let model = $('#model').val();
    let year = $('#year').val();

    bike.generateList(make, model, year);
  });

  $("#clickGraph").click(() => {
    bike.generateData();

    let data = google.visualization.arrayToDataTable([
      ['Bike Color', '# of Bikes'],
      ['Black', bike.black_bikes],
      ['Red', bike.red_bikes],
      ['Yellow or Gold', bike.yellow_bikes],
      ['Blue', bike.blue_bikes],
      ['Green', bike.green_bikes],
      ['Silver or Gray', bike.silver_bikes],
      ['Orange', bike.orange_bikes],
      ['White', bike.white_bikes],
      ['Other', bike.other_bikes]
    ]);

    let options = {
      title: 'Stolen Bike Colors',
      // is3D: true,
      colors:['#010102', '#E50000', '#FFFF32', '#3838CC', '#328432', '#666666', '#FFAE19', '#E5E5E5', '#4C004C']

      let chart = new google.visualization.PieChart($('#stolen_bike_colors'));

      chart.draw(data, options);
    };
  });
});
