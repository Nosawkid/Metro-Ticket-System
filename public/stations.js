function loadDoc(id) {
    const inputField = document.getElementById("stationName_" + id);
    inputField.value = ""; // Clear the input field while data is being loaded

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const modalData = JSON.parse(this.responseText);
            inputField.value = modalData.stationName; // Set the value to the correct input field
        }
    };
    xhttp.open("GET", `http://localhost:4000/admin/getFormData/${id}`, true);
    xhttp.send();
}










