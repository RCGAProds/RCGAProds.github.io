//<!-- ===================== Modal System ===================== -->
// Get DOM elements
var modal = document.getElementById('myModal');
var links = document.querySelectorAll('.openModalLink');
var span = document.getElementsByClassName('close')[0];

// Open the modal when any link is clicked
links.forEach(function (link) {
  link.onclick = function (event) {
    event.preventDefault(); // Prevent the default behavior of the link
    modal.style.display = 'flex';

    // Forzar el reflow para reiniciar la animación
    void modal.querySelector('.modal-content').offsetWidth;

    modal.querySelector('.modal-content').classList.add('show');
  };
});

// Close the modal when the X is clicked
span.onclick = function () {
  closeModal();
};

// Close the modal when clicking outside the modal content
window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};

// Function to close the modal
function closeModal() {
  var content = modal.querySelector('.modal-content');
  content.classList.remove('show');

  setTimeout(() => {
    modal.style.display = 'none';
  }, 300); // The time must match the duration of the animation.
}

//<!-- ===================== CopyCode ===================== -->
// Get the paragraph element
const textElement = document.getElementById('codeToCopy');
const messageElement = document.getElementById('copyCode');

let hideTimeout;

// Add event listener for clicks
textElement.addEventListener('click', function () {
  // Get the text content of the <p> element
  const codeToCopy = textElement.textContent;

  // Copy the text to the clipboard using the Clipboard API
  navigator.clipboard
    .writeText(codeToCopy)
    .then(function () {
      // Show confirmation message
      messageElement.style.display = 'block';

      messageElement.classList.remove('scale-up');

      void messageElement.offsetWidth;

      messageElement.classList.add('scale-up');

      clearTimeout(hideTimeout);

      hideTimeout = setTimeout(() => {
        messageElement.style.display = 'none';
      }, 2500);
    })
    .catch(function (err) {
      console.error('Error copying text: ', err);
    });
});

//<!-- ===================== Certificates Animation ===================== -->
document
  .querySelectorAll('.certificates__item:not(.work-in-progress)')
  .forEach((item) => {
    item.addEventListener('mouseenter', () => {
      item.style.animation = 'moveUpDown 1s ease-in-out infinite';
    });

    item.addEventListener('mouseleave', () => {
      const computedStyle = getComputedStyle(item);
      const transformValue = computedStyle.transform;

      item.style.animation = 'none';
      item.style.transform = transformValue;

      setTimeout(() => {
        item.style.transition = 'transform 0.3s ease-in-out';
        item.style.transform = 'translateY(0)';
      }, 10);
    });
  });
