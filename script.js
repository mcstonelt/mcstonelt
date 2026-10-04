const serverIP = "mc.mcstone.lt";


function copyIP() {

  navigator.clipboard
    .writeText(serverIP)
    .then(() => {

      const copyText =
        document.getElementById("copyText");


      if (copyText) {

        copyText.textContent =
          "✓ IP nukopijuotas!";


        setTimeout(() => {

          copyText.textContent =
            "Spausk, kad nukopijuotum";

        }, 2000);

      }

    })
    .catch(() => {

      alert(
        "Serverio IP: " + serverIP
      );

    });

}


/* NAVBAR SHADOW */

window.addEventListener(
  "scroll",
  () => {

    const navbar =
      document.querySelector(".topbar");


    if (!navbar) return;


    if (window.scrollY > 20) {

      navbar.style.boxShadow =
        "0 12px 45px rgba(0,0,0,.45)";

    } else {

      navbar.style.boxShadow =
        "0 10px 40px rgba(0,0,0,.22)";

    }

  }
);


/* SMOOTH APPEAR ANIMATION */

const animatedElements =
  document.querySelectorAll(
    ".mode-grid article, .join-box, .quote-section"
  );


const observer =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "visible"
          );

          observer.unobserve(
            entry.target
          );

        }

      });

    },

    {
      threshold: 0.12
    }

  );


animatedElements.forEach(element => {

  element.classList.add(
    "reveal"
  );

  observer.observe(
    element
  );

});


/* CSS FOR REVEAL ANIMATION */

const animationStyle =
  document.createElement("style");


animationStyle.textContent = `

.reveal {
  opacity: 0;
  transform: translateY(25px);
  transition:
    opacity .65s ease,
    transform .65s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

`;


document.head.appendChild(
  animationStyle
);
