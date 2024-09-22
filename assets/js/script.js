// Get DOM elements
var modal = document.getElementById("myModal");
var links = document.querySelectorAll(".openModalLink");
var span = document.getElementsByClassName("close")[0];

// Open the modal when any link is clicked
links.forEach(function(link) {
    link.onclick = function(event) {
        event.preventDefault(); // Prevent the default behavior of the link
        modal.style.display = "flex";

        // Forzar el reflow para reiniciar la animación
        void modal.querySelector('.modal-content').offsetWidth;

        modal.querySelector('.modal-content').classList.add('show'); // Añadir clase para animación de apertura
    }
});

// Close the modal when the X is clicked
span.onclick = function() {
    closeModal();
}

// Close the modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Function to close the modal
function closeModal() {
    var content = modal.querySelector('.modal-content');
    content.classList.remove('show'); // Quitar clase para animación de cierre

    // Esperar a que termine la animación antes de ocultar el modal
    setTimeout(() => {
        modal.style.display = "none";
    }, 300); // El tiempo debe coincidir con la duración de la animación
}




//<!-- ===================== CopyCode ===================== -->
// Get the paragraph element
const textElement = document.getElementById('codeToCopy');
const messageElement = document.getElementById('copyCode');

let hideTimeout;

// Add event listener for clicks
textElement.addEventListener('click', function() {
    // Get the text content of the <p> element
    const codeToCopy = textElement.textContent;

    // Copy the text to the clipboard using the Clipboard API
    navigator.clipboard.writeText(codeToCopy).then(function() {
    
        // Show confirmation message
        messageElement.style.display = 'block';

        messageElement.classList.remove('scale-up');

        void messageElement.offsetWidth;

        messageElement.classList.add('scale-up'); // Añadir clase de escalado
        
        clearTimeout(hideTimeout)

        hideTimeout = setTimeout(() => {
            messageElement.style.display = 'none'
        }, 2500);
    }).catch(function(err) {
        console.error('Error copying text: ', err);
    });
});



