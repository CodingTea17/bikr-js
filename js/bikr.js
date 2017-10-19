const craigslist = require('node-craigslist');

export class Bikr {
  constructor() {
    this.black_bikes = 0;
    this.red_bikes = 0;
    this.yellow_bikes = 0;
    this.blue_bikes = 0;
    this.green_bikes = 0;
    this.silver_bikes = 0;
    this.orange_bikes = 0;
    this.white_bikes = 0;
    this.other_bikes = 0;
  }

  generateData() {
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
      let parsed_res = JSON.parse(response);
      parsed_res.bikes.forEach((object) => {
        let bike_color = object.frame_colors[0];
        switch(bike_color) {
          case "Black":
            this.black_bikes += 1;
            break;
          case "Red":
            this.red_bikes += 1;
            break;
          case "Yellow or Gold":
            this.yellow_bikes += 1;
            break;
          case "Blue":
            this.blue_bikes += 1;
            break;
          case "Green":
            this.green_bikes += 1;
            break;
          case "Silver or Gray":
            this.silver_bikes += 1;
            break;
          case "Orange":
            this.orange_bikes += 1;
            break;
          case "White":
            this.white_bikes += 1;
            break;
          default:
            this.other_bikes += 1;
        }
      });
      let data = google.visualization.arrayToDataTable([
        ['Bike Color', '# of Bikes'],
        ['Black', this.black_bikes],
        ['Red', this.red_bikes],
        ['Yellow or Gold', this.yellow_bikes],
        ['Blue', this.blue_bikes],
        ['Green', this.green_bikes],
        ['Silver or Gray', this.silver_bikes],
        ['Orange', this.orange_bikes],
        ['White', this.white_bikes],
        ['Other', this.other_bikes]
      ]);
      let options = {
        title: 'Stolen Bike Colors',
        // is3D: true,
        colors:['#010102', '#E50000', '#FFFF32', '#3838CC', '#328432', '#666666', '#FFAE19', '#E5E5E5', '#4C004C']
      };
      let chart = new google.visualization.PieChart(document.getElementById('stolen_bike_colors'));

      chart.draw(data, options);
    }, (error) => {
      $('.showErrors').html(`There was an error processing your request: ${error.message}`);
    });
  }

  generateList(make, model, year, city) {
    let promise = new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      let url = `https://bikeindex.org:443/api/v3/search?page=1&per_page=25&query=${make}%20${model}%20${year}&location=${city}&distance=25&stolenness=proximity`;
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


      data.bikes.forEach((bike) => {
        let stolenDate = new Date(bike.date_stolen*1000);
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
  }

  craigslistBikes(make, model, year, city) {
    const craigslist = require('node-craigslist');
    const client = new craigslist.Client({
      city : `${city}`,
    });
    const options = {
      baseHost : '',
      category : 'bia',
    };
    client.search(options, `${make} ${model} ${year}`)
    // .then((listings) => client.details(listings[0]))
    // .then((details) => {
    //   console.log(details);
    // })
    .then((listings) => {
      listings.forEach((listing) => {
        $("#craigslist-results").append(`<li><a href='${listing.url.slice(23+(city.length))}'>${listing.title}</a></li>`);
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

}
