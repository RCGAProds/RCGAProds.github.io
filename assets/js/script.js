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
//Functions in the Portfolio JS

// Function to close the modal
function closeModal() {
  var content = modal.querySelector('.modal-content');
  content.classList.remove('show');

  setTimeout(() => {
    modal.style.display = 'none';
  }, 300); // The time must match the duration of the animation.
}

//<!-- ===================== CopyText ===================== -->
// Get the paragraph element
const textElements = document.querySelectorAll('.textToCopy');

textElements.forEach((textElement) => {
  const messageElement = document.getElementById(
    'copyText' + textElement.id.replace('copy', '')
  );

  let hideTimeout;

  // Add event listener for clicks
  textElement.addEventListener('click', function () {
    // Get the text content of the <p> element
    const textToCopy = textElement.textContent;

    // Copy the text to the clipboard using the Clipboard API
    navigator.clipboard
      .writeText(textToCopy)
      .then(function () {
        // Show confirmation message
        messageElement.style.display = 'inline-block';

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
});

//<!-- ===================== Sweet Animations ===================== -->
document.querySelectorAll('.sweet_anim').forEach((item) => {
  item.addEventListener('mouseenter', () => {
    if (item.classList.contains('certificates__item')) {
      item.style.animation = 'moveUpDown 1s ease-in-out infinite';
    }
  });

  item.addEventListener('mouseleave', () => {
    const computedStyle = getComputedStyle(item);
    const transformValue = computedStyle.transform;

    item.style.animation = 'none';
    item.style.transform = transformValue;

    setTimeout(() => {
      if (item.classList.contains('certificates__item')) {
        item.style.transition = 'transform 0.3s ease-in-out';
        item.style.transform = 'translateY(0)';
      }
    }, 10);
  });
});

//<!-- ===================== Modal Portfolio ===================== -->

const portfolioModals = document.querySelectorAll('.portfolio__model');
const imgCards = document.querySelectorAll('.img__card');
const portfolioCloseBtns = document.querySelectorAll('.portfolio__close_btn');

var portfolioModal = function (modalClick) {
  portfolioModals[modalClick].classList.add('active');
};

imgCards.forEach((imgCard, i) => {
  imgCard.addEventListener('click', () => {
    portfolioModal(i);
  });
});

portfolioCloseBtns.forEach((portfolioCloseBtn) => {
  portfolioCloseBtn.onclick = function () {
    closePortModal();
  };
});

window.onclick = function (event) {
  // Close the modal when clicking outside the modal content
  if (event.target == modal) {
    closeModal();
  }
  // Close the portfolioModals when clicking outside the modal content
  portfolioModals.forEach((portfolioModalView) => {
    if (
      event.target === portfolioModalView &&
      portfolioModalView.classList.contains('active')
    ) {
      closePortModal();
    }
  });
};

window.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closePortModal();
  }
});

function closePortModal() {
  portfolioModals.forEach((portfolioModalView) => {
    portfolioModalView.classList.remove('active');
  });
}
