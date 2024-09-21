// Get DOM elements
var modal = document.getElementById("myModal");
var link = document.getElementById("openModalLink");
var span = document.getElementsByClassName("close")[0];

// Open the modal when the link is clicked
link.onclick = function(event) {
    event.preventDefault(); // Prevent the default behavior of the link
    modal.style.display = "block";
}

// Close the modal when the X is clicked
span.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
