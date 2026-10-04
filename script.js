/* ============================================================
   MCSTONE.LT - MAIN JAVASCRIPT
   Server IP: mcstone.srw.lt
============================================================ */


/* ============================================================
   NUSTATYMAI
============================================================ */

const SERVER_IP = "mcstone.srw.lt";

const STATUS_API =
  `https://api.mcstatus.io/v2/status/java/${SERVER_IP}`;

const STATUS_REFRESH_TIME = 60000;

let toastTimer = null;


/* ============================================================
   ELEMENTŲ PAĖMIMAS
============================================================ */

function getServerElements() {

  return {

    statusText:
      document.getElementById("serverStatusText"),

    statusDot:
      document.getElementById("serverDot"),

    playerCount:
      document.getElementById("playerCount"),

    serverVersion:
      document.getElementById("serverVersion"),

    cardStatusText:
      document.getElementById("cardStatusText"),

    cardStatusDot:
      document.getElementById("cardStatusDot"),

    cardPlayers:
      document.getElementById("cardPlayers"),

    cardVersion:
      document.getElementById("cardVersion"),

    footerStatus:
      document.getElementById("footerStatus")

  };

}


/* ============================================================
   IP KOPIJAVIMAS
============================================================ */

async function copyIP(button) {

  try {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      await navigator.clipboard.writeText(
        SERVER_IP
      );

    } else {

      fallbackCopy();

    }

    showCopyToast();

    showCopiedButton(button);

  }

  catch (error) {

    console.error(
      "Nepavyko nukopijuoti IP:",
      error
    );

    fallbackCopy();

    showCopyToast();

    showCopiedButton(button);

  }

}


/* ============================================================
   ATSARGINIS IP KOPIJAVIMAS
============================================================ */

function fallbackCopy() {

  const textarea =
    document.createElement("textarea");

  textarea.value =
    SERVER_IP;

  textarea.setAttribute(
    "readonly",
    ""
  );

  textarea.style.position =
    "fixed";

  textarea.style.left =
    "-9999px";

  textarea.style.opacity =
    "0";

  document.body.appendChild(
    textarea
  );

  textarea.select();

  textarea.setSelectionRange(
    0,
    textarea.value.length
  );

  try {

    document.execCommand(
      "copy"
    );

  }

  catch (error) {

    console.error(
      "Fallback copy klaida:",
      error
    );

  }

  document.body.removeChild(
    textarea
  );

}


/* ============================================================
   COPY PRANEŠIMAS
============================================================ */

function showCopyToast() {

  const toast =
    document.getElementById(
      "copyToast"
    );

  if (!toast) {
    return;
  }

  toast.textContent =
    "✓ MCSTONE.SRW.LT NUKOPIJUOTAS";

  toast.classList.add(
    "show"
  );

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2200);

}


/* ============================================================
   MYGTUKO ANIMACIJA
============================================================ */

function showCopiedButton(button) {

  if (!button) {
    return;
  }

  /*
    Kortelės ir didelis IP mygtukas turi
    daugiau HTML viduje, todėl jų teksto
    nekeičiame.
  */

  const canChangeText =
    button.classList.contains("nav-ip") ||
    button.classList.contains("button-purple");

  if (!canChangeText) {
    return;
  }

  const oldHTML =
    button.innerHTML;

  button.innerHTML =
    "NUKOPIJUOTA ✓";

  button.disabled =
    true;

  setTimeout(() => {

    button.innerHTML =
      oldHTML;

    button.disabled =
      false;

  }, 1500);

}


/* ============================================================
   LOADING STATUSAS
============================================================ */

function setLoadingStatus() {

  const el =
    getServerElements();

  if (el.statusText) {

    el.statusText.textContent =
      "TIKRINAMA...";

  }

  if (el.serverVersion) {

    el.serverVersion.textContent =
      "TIKRINAMA...";

  }

  if (el.playerCount) {

    el.playerCount.textContent =
      "-- / --";

  }

  if (el.cardStatusText) {

    el.cardStatusText.textContent =
      "TIKRINAMA...";

  }

  if (el.cardPlayers) {

    el.cardPlayers.textContent =
      "-- / --";

  }

  if (el.cardVersion) {

    el.cardVersion.textContent =
      "--";

  }

  if (el.footerStatus) {

    el.footerStatus.textContent =
      "Tikrinama...";

  }

}


/* ============================================================
   ONLINE STATUSAS
============================================================ */

function setOnlineStatus(data) {

  const el =
    getServerElements();


  /* ----------------------------
     ŽAIDĖJAI
  ---------------------------- */

  const onlinePlayers =
    data?.players?.online ?? 0;

  const maxPlayers =
    data?.players?.max ?? "?";

  const playersText =
    `${onlinePlayers} / ${maxPlayers}`;


  /* ----------------------------
     VERSIJA
  ---------------------------- */

  let version =
    "ONLINE";


  if (
    data?.version?.name_clean
  ) {

    version =
      data.version.name_clean;

  }

  else if (
    data?.version?.name_raw
  ) {

    version =
      data.version.name_raw;

  }

  else if (
    typeof data?.version === "string"
  ) {

    version =
      data.version;

  }


  /*
    Kartais API grąžina ilgą serverio
    programinės įrangos tekstą.
    Svetainėje paliekame trumpesnį.
  */

  if (
    typeof version === "string" &&
    version.length > 22
  ) {

    version =
      version.substring(0, 22);

  }


  /* ----------------------------
     PAGRINDINIS STATUSAS
  ---------------------------- */

  if (el.statusText) {

    el.statusText.textContent =
      "ONLINE";

  }

  if (el.statusDot) {

    el.statusDot.classList.remove(
      "offline-dot"
    );

    el.statusDot.classList.add(
      "online-dot"
    );

  }


  /* ----------------------------
     PAGRINDINIAI DUOMENYS
  ---------------------------- */

  if (el.playerCount) {

    el.playerCount.textContent =
      playersText;

  }

  if (el.serverVersion) {

    el.serverVersion.textContent =
      version;

  }


  /* ----------------------------
     DEŠINĖ KORTELĖ
  ---------------------------- */

  if (el.cardStatusText) {

    el.cardStatusText.textContent =
      "SERVERIS ONLINE";

  }

  if (el.cardStatusDot) {

    el.cardStatusDot.classList.remove(
      "offline-dot"
    );

    el.cardStatusDot.classList.add(
      "online-dot"
    );

  }

  if (el.cardPlayers) {

    el.cardPlayers.textContent =
      playersText;

  }

  if (el.cardVersion) {

    el.cardVersion.textContent =
      version;

  }


  /* ----------------------------
     FOOTER
  ---------------------------- */

  if (el.footerStatus) {

    el.footerStatus.textContent =
      `Online • ${playersText}`;

  }

}


/* ============================================================
   OFFLINE STATUSAS
============================================================ */

function setOfflineStatus() {

  const el =
    getServerElements();


  if (el.statusText) {

    el.statusText.textContent =
      "OFFLINE";

  }


  if (el.statusDot) {

    el.statusDot.classList.remove(
      "online-dot"
    );

    el.statusDot.classList.add(
      "offline-dot"
    );

  }


  if (el.playerCount) {

    el.playerCount.textContent =
      "0 / 0";

  }


  if (el.serverVersion) {

    el.serverVersion.textContent =
      "--";

  }


  if (el.cardStatusText) {

    el.cardStatusText.textContent =
      "SERVERIS OFFLINE";

  }


  if (el.cardStatusDot) {

    el.cardStatusDot.classList.remove(
      "online-dot"
    );

    el.cardStatusDot.classList.add(
      "offline-dot"
    );

  }


  if (el.cardPlayers) {

    el.cardPlayers.textContent =
      "0 / 0";

  }


  if (el.cardVersion) {

    el.cardVersion.textContent =
      "--";

  }


  if (el.footerStatus) {

    el.footerStatus.textContent =
      "Serveris offline";

  }

}


/* ============================================================
   API KLAIDOS STATUSAS
============================================================ */

function setErrorStatus() {

  const el =
    getServerElements();


  if (el.statusText) {

    el.statusText.textContent =
      "NEPASIEKIAMAS";

  }


  if (el.statusDot) {

    el.statusDot.classList.remove(
      "online-dot"
    );

    el.statusDot.classList.add(
      "offline-dot"
    );

  }


  if (el.playerCount) {

    el.playerCount.textContent =
      "-- / --";

  }


  if (el.serverVersion) {

    el.serverVersion.textContent =
      "--";

  }


  if (el.cardStatusText) {

    el.cardStatusText.textContent =
      "STATUSAS NEPASIEKIAMAS";

  }


  if (el.cardStatusDot) {

    el.cardStatusDot.classList.remove(
      "online-dot"
    );

    el.cardStatusDot.classList.add(
      "offline-dot"
    );

  }


  if (el.cardPlayers) {

    el.cardPlayers.textContent =
      "-- / --";

  }


  if (el.cardVersion) {

    el.cardVersion.textContent =
      "--";

  }


  if (el.footerStatus) {

    el.footerStatus.textContent =
      "Statusas nepasiekiamas";

  }

}


/* ============================================================
   SERVERIO STATUSO UŽKLAUSA
============================================================ */

async function loadServerStatus() {

  console.log(
    "Tikrinamas McStone serveris:",
    SERVER_IP
  );


  /*
    AbortController neleis užklausai
    amžinai likti ant "Tikrinama..."
  */

  const controller =
    new AbortController();


  const timeout =
    setTimeout(() => {

      controller.abort();

    }, 10000);


  try {

    const response =
      await fetch(
        STATUS_API,
        {
          method: "GET",

          cache: "no-store",

          signal:
            controller.signal,

          headers: {
            "Accept":
              "application/json"
          }
        }
      );


    clearTimeout(
      timeout
    );


    if (!response.ok) {

      throw new Error(
        `API HTTP klaida: ${response.status}`
      );

    }


    const data =
      await response.json();


    console.log(
      "McStone API atsakymas:",
      data
    );


    /*
      mcstatus.io grąžina
      online: true / false
    */

    if (
      data &&
      data.online === true
    ) {

      setOnlineStatus(
        data
      );

    }

    else {

      setOfflineStatus();

    }

  }

  catch (error) {

    clearTimeout(
      timeout
    );


    console.error(
      "Serverio statuso klaida:",
      error
    );


    setErrorStatus();

  }

}


/* ============================================================
   NAVBAR EFEKTAS
============================================================ */

function setupNavbar() {

  const navbar =
    document.querySelector(
      ".navbar"
    );


  if (!navbar) {
    return;
  }


  function updateNavbar() {

    if (
      window.scrollY > 25
    ) {

      navbar.style.background =
        "rgba(5, 4, 8, .98)";

      navbar.style.boxShadow =
        "0 8px 30px rgba(0, 0, 0, .25)";

    }

    else {

      navbar.style.background =
        "rgba(5, 4, 8, .90)";

      navbar.style.boxShadow =
        "none";

    }

  }


  window.addEventListener(
    "scroll",
    updateNavbar,
    {
      passive: true
    }
  );


  updateNavbar();

}


/* ============================================================
   SCROLL ANIMACIJOS
============================================================ */

function setupRevealAnimations() {

  const items =
    document.querySelectorAll(
      ".feature, .mode-card, .cta"
    );


  if (
    !("IntersectionObserver" in window)
  ) {

    items.forEach(item => {

      item.classList.add(
        "revealed"
      );

    });

    return;

  }


  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(
          entry => {

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

          }
        );

      },

      {
        threshold: 0.12
      }

    );


  items.forEach(
    (item, index) => {

      item.classList.add(
        "reveal-item"
      );


      item.style.transitionDelay =
        `${Math.min(index * 40, 200)}ms`;


      observer.observe(
        item
      );

    }
  );

}


/* ============================================================
   ANIMACIJŲ CSS
============================================================ */

function addAnimationStyles() {

  const style =
    document.createElement(
      "style"
    );


  style.textContent = `

    .reveal-item {
      opacity: 0;
      transform: translateY(22px);

      transition:
        opacity .6s ease,
        transform .6s ease;
    }


    .reveal-item.revealed {
      opacity: 1;
      transform: translateY(0);
    }


    .online-dot {
      background: #52f38b !important;

      box-shadow:
        0 0 10px #52f38b !important;
    }


    .offline-dot {
      background: #ff4d68 !important;

      box-shadow:
        0 0 10px #ff4d68 !important;
    }


    @media (
      prefers-reduced-motion: reduce
    ) {

      .reveal-item {
        opacity: 1 !important;

        transform: none !important;

        transition: none !important;
      }

    }

  `;


  document.head.appendChild(
    style
  );

}


/* ============================================================
   PUSLAPIO PALEIDIMAS
============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "MCSTONE.LT script.js paleistas."
    );


    addAnimationStyles();


    setupNavbar();


    setupRevealAnimations();


    setLoadingStatus();


    /*
      Serverio statusas
      patikrinamas iš karto.
    */

    loadServerStatus();


    /*
      Statusas automatiškai
      atnaujinamas kas 60 sekundžių.
    */

    setInterval(
      loadServerStatus,
      STATUS_REFRESH_TIME
    );

  }
);
