

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
      $('#returnBike').html("");
      data["bikes"].forEach((bike) => {
        $('#returnBike').append(`<li> Make: ${bike.manufacturer_name}, Model: ${bike.frame_model}, Year: ${bike.year}</li>`);
      });
    }, (error) => {
      $('.showErrors').html(`There was an error processing your request: ${error.message}`);
    });
  });
});
