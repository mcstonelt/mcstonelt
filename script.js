const SERVER_IP = "mc.mcstone.lt";

let toastTimer;


/* =========================
   COPY SERVER IP
========================= */

async function copyIP(button) {

  try {

    await navigator.clipboard.writeText(
      SERVER_IP
    );

    showCopyToast();

    temporaryButtonText(button);

  } catch (error) {

    fallbackCopy();

    showCopyToast();

    temporaryButtonText(button);

  }

}


/* =========================
   FALLBACK COPY
========================= */

function fallbackCopy() {

  const input =
    document.createElement("textarea");

  input.value = SERVER_IP;

  input.style.position = "fixed";
  input.style.opacity = "0";

  document.body.appendChild(input);

  input.select();

  document.execCommand("copy");

  document.body.removeChild(input);

}


/* =========================
   TOAST
========================= */

function showCopyToast() {

  const toast =
    document.getElementById("copyToast");

  if (!toast) return;


  clearTimeout(toastTimer);


  toast.classList.add("show");


  toastTimer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2200);

}


/* =========================
   BUTTON FEEDBACK
========================= */

function temporaryButtonText(button) {

  if (!button) return;


  const originalHTML =
    button.innerHTML;


  /*
    Paprastiems IP mygtukams
  */

  if (
    button.classList.contains("nav-ip") ||
    button.classList.contains("button-purple")
  ) {

    button.textContent =
      "NUKOPIJUOTA ✓";


    setTimeout(() => {

      button.innerHTML =
        originalHTML;

    }, 1600);

  }

}


/* =========================
   NAVBAR SCROLL
========================= */

const navbar =
  document.querySelector(".navbar");


window.addEventListener(
  "scroll",
  () => {

    if (!navbar) return;


    if (window.scrollY > 20) {

      navbar.style.background =
        "rgba(5,4,8,.97)";

    } else {

      navbar.style.background =
        "rgba(5,4,8,.90)";

    }

  }
);


/* =========================
   REVEAL ANIMATIONS
========================= */

const revealItems =
  document.querySelectorAll(
    ".feature, .mode-card, .cta"
  );


const observer =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (
          entry.isIntersecting
        ) {

          entry.target.classList.add(
            "revealed"
          );

          observer.unobserve(
            entry.target
          );

        }

      });

    },

    {
      threshold: 0.10
    }

  );


revealItems.forEach(item => {

  item.classList.add("reveal");

  observer.observe(item);

});


/* =========================
   ANIMATION CSS
========================= */

const animationCSS =
  document.createElement("style");


animationCSS.textContent = `

  .reveal {
    opacity: 0;
    transform: translateY(20px);

    transition:
      opacity .6s ease,
      transform .6s ease;
  }


  .reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }


  @media (prefers-reduced-motion: reduce) {

    .reveal {
      opacity: 1;
      transform: none;
      transition: none;
    }

  }

`;


document.head.appendChild(
  animationCSS
);
