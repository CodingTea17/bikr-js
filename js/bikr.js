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

  generateChart() {
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
      data["bikes"].forEach((object) => {
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
    }, (error) => {
      $('.showErrors').html(`There was an error processing your request: ${error.message}`);
    });
  }
}
