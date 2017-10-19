import { Bikr } from './../js/bikr.js';

google.charts.load("current", {packages:["corechart"]});

$(document).ready(() => {

  let bike = new Bikr();

  $('#searchClick').click(() => {
    let make = $('#make').val();
    let model = $('#model').val();
    let year = $('#year').val();
    let city = $('#city').val();

    $("#results").show();
    $('#returnBike').html("");
    $("#bikeSearch").hide();

    // bike.craigslistBikes(make, model, year, city);
    bike.generateList(make, model, year, city);
  });

  $('#craigslistClick').click(() => {
    let make = $('#make').val();
    let model = $('#model').val();
    let year = $('#year').val();
    let city = $('#city').val();

    // $("#results").show();
    // $('#returnBike').html("");
    $("#bikeSearch").hide();

    bike.craigslistBikes(make, model, year, city);
    // bike.generateList(make, model, year, city);
  });

  $("#clickGraph").click(() => {
    bike.generateData();

  });
});
