function initMap() {
  const defaultPosition = {
    lat: 40.41465,
    lng: -3.7004,
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: marker || defaultPosition,
  });

  const locationInput = document.getElementById("location-input");

  if (locationInput) {
    if (locationInput.value) {
      console.log("locationInput.value", locationInput.value);
      let lat = Number(document.getElementById("lat").value);
      let lng = Number(document.getElementById("lng").value);
      drawMarker(lat, lng);
    }
    locationInput.addEventListener("input", geocode);
  } else {
    let lat = marker.lat;
    let lng = marker.lng;
    drawMarker(lat, lng);
  }

  function geocode(e) {
    e.preventDefault();
    let location = e.target.value;

    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: location,
          key: "AIzaSyDLTF0f1zy4NVwzNDpDgqObyDwSJAQIeoY",
        },
      })
      .then((response) => {
        let lat = response.data.results[0].geometry.location.lat;
        let lng = response.data.results[0].geometry.location.lng;
        document.getElementById("lat").value = lat;
        document.getElementById("lng").value = lng;

        drawMarker(lat, lng);
      })
      .catch((err) => console.log(err));
  }

  function drawMarker(lat, lng) {
    let latLng = new google.maps.LatLng(lat, lng);
    mapMarker = new google.maps.Marker({
      position: {
        lat,
        lng,
      },
      map: map,
    });
    map.panTo(latLng);
  }
}
