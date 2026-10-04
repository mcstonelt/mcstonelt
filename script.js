/* =========================================
   MCSTONE.LT
========================================= */

const SERVER_IP = "mcstone.srw.lt";

const STATUS_API =
  "https://api.mcsrvstat.us/3/" + SERVER_IP;

let toastTimer;


/* =========================================
   COPY SERVER IP
========================================= */

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


/* =========================================
   FALLBACK COPY
========================================= */

function fallbackCopy() {

  const input =
    document.createElement("textarea");


  input.value =
    SERVER_IP;


  input.style.position =
    "fixed";


  input.style.opacity =
    "0";


  document.body.appendChild(
    input
  );


  input.select();


  document.execCommand(
    "copy"
  );


  document.body.removeChild(
    input
  );

}


/* =========================================
   COPY TOAST
========================================= */

function showCopyToast() {

  const toast =
    document.getElementById(
      "copyToast"
    );


  if (!toast) return;


  toast.textContent =
    "✓ MCSTONE.SRW.LT NUKOPIJUOTAS";


  clearTimeout(
    toastTimer
  );


  toast.classList.add(
    "show"
  );


  toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2200);

}


/* =========================================
   BUTTON FEEDBACK
========================================= */

function temporaryButtonText(button) {

  if (!button) return;


  if (
    !button.classList.contains("nav-ip") &&
    !button.classList.contains("button-purple")
  ) {

    return;

  }


  const originalText =
    button.textContent;


  button.textContent =
    "NUKOPIJUOTA ✓";


  setTimeout(() => {

    button.textContent =
      originalText;

  }, 1600);

}


/* =========================================
   LOAD SERVER STATUS
========================================= */

async function loadServerStatus() {

  const statusText =
    document.getElementById(
      "serverStatusText"
    );


  const statusDot =
    document.getElementById(
      "serverDot"
    );


  const playerCount =
    document.getElementById(
      "playerCount"
    );


  const serverVersion =
    document.getElementById(
      "serverVersion"
    );


  const cardStatusText =
    document.getElementById(
      "cardStatusText"
    );


  const cardStatusDot =
    document.getElementById(
      "cardStatusDot"
    );


  const cardPlayers =
    document.getElementById(
      "cardPlayers"
    );


  const cardVersion =
    document.getElementById(
      "cardVersion"
    );


  const footerStatus =
    document.getElementById(
      "footerStatus"
    );


  try {

    const response =
      await fetch(
        STATUS_API,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        "Server status API error"
      );

    }


    const data =
      await response.json();


    /* =========================
       SERVER ONLINE
    ========================= */

    if (data.online === true) {

      const playersOnline =
        data.players?.online ?? 0;


      const playersMax =
        data.players?.max ?? "?";


      const version =
        data.version ?? "ONLINE";


      /* MAIN STATUS */

      if (statusText) {

        statusText.textContent =
          "ONLINE";

      }


      if (statusDot) {

        statusDot.classList.remove(
          "offline-dot"
        );

      }


      /* PLAYERS */

      if (playerCount) {

        playerCount.textContent =
          playersOnline +
          " / " +
          playersMax;

      }


      /* VERSION */

      if (serverVersion) {

        serverVersion.textContent =
          version;

      }


      /* CARD STATUS */

      if (cardStatusText) {

        cardStatusText.textContent =
          "SERVERIS ONLINE";

      }


      if (cardStatusDot) {

        cardStatusDot.classList.remove(
          "offline-dot"
        );

      }


      /* CARD PLAYERS */

      if (cardPlayers) {

        cardPlayers.textContent =
          playersOnline +
          " / " +
          playersMax;

      }


      /* CARD VERSION */

      if (cardVersion) {

        cardVersion.textContent =
          version;

      }


      /* FOOTER */

      if (footerStatus) {

        footerStatus.textContent =
          "Serveris online";

      }

    }


    /* =========================
       SERVER OFFLINE
    ========================= */

    else {

      setServerOffline();

    }

  }


  /* =========================
     API ERROR
  ========================= */

  catch (error) {

    console.error(
      "Nepavyko gauti serverio statuso:",
      error
    );


    if (statusText) {

      statusText.textContent =
        "NEŽINOMA";

    }


    if (playerCount) {

      playerCount.textContent =
        "-- / --";

    }


    if (serverVersion) {

      serverVersion.textContent =
        "--";

    }


    if (cardStatusText) {

      cardStatusText.textContent =
        "STATUSAS NEPASIEKIAMAS";

    }


    if (cardPlayers) {

      cardPlayers.textContent =
        "-- / --";

    }


    if (cardVersion) {

      cardVersion.textContent =
        "--";

    }


    if (footerStatus) {

      footerStatus.textContent =
        "Statusas nepasiekiamas";

    }

  }

}


/* =========================================
   SET SERVER OFFLINE
========================================= */

function setServerOffline() {

  const statusText =
    document.getElementById(
      "serverStatusText"
    );


  const statusDot =
    document.getElementById(
      "serverDot"
    );


  const playerCount =
    document.getElementById(
      "playerCount"
    );


  const serverVersion =
    document.getElementById(
      "serverVersion"
    );


  const cardStatusText =
    document.getElementById(
      "cardStatusText"
    );


  const cardStatusDot =
    document.getElementById(
      "cardStatusDot"
    );


  const cardPlayers =
    document.getElementById(
      "cardPlayers"
    );


  const cardVersion =
    document.getElementById(
      "cardVersion"
    );


  const footerStatus =
    document.getElementById(
      "footerStatus"
    );


  if (statusText) {

    statusText.textContent =
      "OFFLINE";

  }


  if (statusDot) {

    statusDot.classList.add(
      "offline-dot"
    );

  }


  if (playerCount) {

    playerCount.textContent =
      "0 / 0";

  }


  if (serverVersion) {

    serverVersion.textContent =
      "--";

  }


  if (cardStatusText) {

    cardStatusText.textContent =
      "SERVERIS OFFLINE";

  }


  if (cardStatusDot) {

    cardStatusDot.classList.add(
      "offline-dot"
    );

  }


  if (cardPlayers) {

    cardPlayers.textContent =
      "0 / 0";

  }


  if (cardVersion) {

    cardVersion.textContent =
      "--";

  }


  if (footerStatus) {

    footerStatus.textContent =
      "Serveris offline";

  }

}


/* =========================================
   NAVBAR SCROLL
========================================= */

const navbar =
  document.querySelector(
    ".navbar"
  );


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


/* =========================================
   REVEAL ANIMATIONS
========================================= */

const revealItems =
  document.querySelectorAll(
    ".feature, .mode-card, .cta"
  );


const observer =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

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

  item.classList.add(
    "reveal"
  );


  observer.observe(
    item
  );

});


/* =========================================
   REVEAL CSS
========================================= */

const animationCSS =
  document.createElement(
    "style"
  );


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


/* =========================================
   START
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
      Patikrinam iš karto.
    */

    loadServerStatus();


    /*
      Po to atnaujinam statusą
      kas 60 sekundžių.
    */

    setInterval(
      loadServerStatus,
      60000
    );

  }
);
