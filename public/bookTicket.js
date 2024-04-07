function loadDestination(){
    const start = document.getElementById("beginningPointSelect").value
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200)
        {
            const destinationSelect = document.getElementById("destinationSelect")
            destinationSelect.innerHTML = ""
            const stations = JSON.parse(this.responseText)
            stations.forEach((station)=>{
                const option = document.createElement("option")
                option.value = station._id
                option.innerText = station.stationName
                destinationSelect.appendChild(option)
            })
        }
    }
    xhttp.open("GET",`http://localhost:4000/user/get-destination/${start}`,true)
    xhttp.send()
}


function calculateFare(e) {
    e.preventDefault();
    const beginningPoint = document.getElementById("beginningPointSelect").value;
    const destination = document.getElementById("destinationSelect").value;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText)
            const startStation = document.getElementById("startStation")
            startStation.textContent = response.startStation.stationName

            const endStation = document.getElementById("destinationStation")
            endStation.textContent = response.endPoint.stationName

            const fare = document.getElementById("fare")
            fare.textContent ="Rs "+ response.fare
        }
    };

    const params = new URLSearchParams();
    params.append('beginningPoint', beginningPoint);
    params.append('destination', destination);

    xhttp.open("POST", "http://localhost:4000/user/book-ticket", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params.toString());
}
