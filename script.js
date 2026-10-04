/* ============================================================
   MCSTONE.LT
   SCRIPT.JS
============================================================ */


/* ============================================================
   SERVERIO NUSTATYMAI
============================================================ */

const SERVER_HOST = "mcstone.srw.lt";
const SERVER_PORT = "25565";

const DISPLAY_IP = "mcstone.srw.lt";

const SERVER_VERSION = "1.21.11";


/*
   Statusas atnaujinamas kas 20 sekundžių
*/

const STATUS_REFRESH_TIME = 20000;


/* ============================================================
   API
============================================================ */

const MCSTATUS_API =
  `https://api.mcstatus.io/v2/status/java/${SERVER_HOST}:${SERVER_PORT}`;

const MCSRVSTAT_API =
  `https://api.mcsrvstat.us/3/${SERVER_HOST}:${SERVER_PORT}`;


/* ============================================================
   GLOBAL
============================================================ */

let toastTimer = null;

let statusRequestRunning = false;


/* ============================================================
   SERVERIO ELEMENTAI
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
        DISPLAY_IP
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
   FALLBACK COPY
============================================================ */

function fallbackCopy() {

  const textarea =
    document.createElement("textarea");


  textarea.value =
    DISPLAY_IP;


  textarea.setAttribute(
    "readonly",
    ""
  );


  textarea.style.position =
    "fixed";

  textarea.style.left =
    "-9999px";

  textarea.style.top =
    "-9999px";

  textarea.style.opacity =
    "0";


  document.body.appendChild(
    textarea
  );


  textarea.focus();

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


  textarea.remove();

}


/* ============================================================
   COPY TOAST
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
   NAVBAR COPY EFEKTAS
============================================================ */

function showCopiedButton(button) {

  if (!button) {
    return;
  }


  if (
    !button.classList.contains("nav-ip")
  ) {
    return;
  }


  const oldText =
    button.textContent;


  button.textContent =
    "NUKOPIJUOTA ✓";


  button.disabled =
    true;


  setTimeout(() => {

    button.textContent =
      oldText;

    button.disabled =
      false;

  }, 1500);

}


/* ============================================================
   FETCH SU TIMEOUT
============================================================ */

async function fetchWithTimeout(
  url,
  timeout = 8000
) {

  const controller =
    new AbortController();


  const timeoutId =
    setTimeout(() => {

      controller.abort();

    }, timeout);


  try {

    const separator =
      url.includes("?")
        ? "&"
        : "?";


    const response =
      await fetch(
        `${url}${separator}_=${Date.now()}`,
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


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    return await response.json();

  }

  finally {

    clearTimeout(
      timeoutId
    );

  }

}


/* ============================================================
   MCSTATUS.IO
============================================================ */

async function checkMcStatus() {

  const data =
    await fetchWithTimeout(
      MCSTATUS_API
    );


  if (!data) {

    throw new Error(
      "mcstatus.io negrąžino duomenų"
    );

  }


  return {

    online:
      data.online === true,

    playersOnline:
      Number(
        data.players?.online ?? 0
      ),

    playersMax:
      Number(
        data.players?.max ?? 0
      )

  };

}


/* ============================================================
   MCSRVSTAT.US
============================================================ */

async function checkMcsrvstat() {

  const data =
    await fetchWithTimeout(
      MCSRVSTAT_API
    );


  if (!data) {

    throw new Error(
      "mcsrvstat.us negrąžino duomenų"
    );

  }


  return {

    online:
      data.online === true,

    playersOnline:
      Number(
        data.players?.online ?? 0
      ),

    playersMax:
      Number(
        data.players?.max ?? 0
      )

  };

}


/* ============================================================
   ONLINE STATUSAS
============================================================ */

function setOnlineStatus(data) {

  const elements =
    getServerElements();


  let online =
    Number(
      data.playersOnline
    );


  let max =
    Number(
      data.playersMax
    );


  if (
    !Number.isFinite(online) ||
    online < 0
  ) {

    online = 0;

  }


  if (
    !Number.isFinite(max) ||
    max < 0
  ) {

    max = 0;

  }


  const playerText =
    `${online} / ${max}`;


  /* VERSIJA */

  if (
    elements.serverVersion
  ) {

    elements.serverVersion.textContent =
      SERVER_VERSION;

  }


  /* STATUSAS */

  if (
    elements.statusText
  ) {

    elements.statusText.textContent =
      "ONLINE";

  }


  /* ŽALIAS TAŠKAS */

  if (
    elements.statusDot
  ) {

    elements.statusDot.classList.remove(
      "offline-dot"
    );


    elements.statusDot.classList.add(
      "online-dot"
    );

  }


  /* ŽAIDĖJAI */

  if (
    elements.playerCount
  ) {

    elements.playerCount.textContent =
      playerText;

  }


  /* FOOTER */

  if (
    elements.footerStatus
  ) {

    elements.footerStatus.textContent =
      `Online • ${playerText}`;

  }

}


/* ============================================================
   OFFLINE STATUSAS
============================================================ */

function setOfflineStatus() {

  const elements =
    getServerElements();


  if (
    elements.serverVersion
  ) {

    elements.serverVersion.textContent =
      SERVER_VERSION;

  }


  if (
    elements.statusText
  ) {

    elements.statusText.textContent =
      "OFFLINE";

  }


  if (
    elements.statusDot
  ) {

    elements.statusDot.classList.remove(
      "online-dot"
    );


    elements.statusDot.classList.add(
      "offline-dot"
    );

  }


  if (
    elements.playerCount
  ) {

    elements.playerCount.textContent =
      "0 / 0";

  }


  if (
    elements.footerStatus
  ) {

    elements.footerStatus.textContent =
      "Serveris offline";

  }

}


/* ============================================================
   API NEPASIEKIAMAS
============================================================ */

function setUnknownStatus() {

  const elements =
    getServerElements();


  /*
     SVARBU:
     jeigu API trumpam nulūžta,
     nerašome OFFLINE.

     Taip serveris nebus klaidingai
     rodomas kaip išjungtas.
  */


  if (
    elements.serverVersion
  ) {

    elements.serverVersion.textContent =
      SERVER_VERSION;

  }


  if (
    elements.statusText &&
    (
      elements.statusText.textContent === "TIKRINAMA..." ||
      elements.statusText.textContent.trim() === ""
    )
  ) {

    elements.statusText.textContent =
      "TIKRINAMA...";

  }


  if (
    elements.playerCount &&
    (
      elements.playerCount.textContent === "-- / --" ||
      elements.playerCount.textContent.trim() === ""
    )
  ) {

    elements.playerCount.textContent =
      "-- / --";

  }


  if (
    elements.footerStatus &&
    (
      elements.footerStatus.textContent === "Tikrinama..." ||
      elements.footerStatus.textContent.trim() === ""
    )
  ) {

    elements.footerStatus.textContent =
      "Tikrinama...";

  }

}


/* ============================================================
   LIVE SERVERIO STATUSAS
============================================================ */

async function loadServerStatus() {

  /*
     Jeigu ankstesnė užklausa dar nebaigta,
     naujos nepaleidžiam.
  */

  if (statusRequestRunning) {
    return;
  }


  statusRequestRunning =
    true;


  try {

    let firstResult = null;

    let secondResult = null;

    let firstWorked = false;

    let secondWorked = false;


    /* ========================================================
       1. MCSTATUS.IO
    ======================================================== */

    try {

      firstResult =
        await checkMcStatus();


      firstWorked =
        true;


      /*
         Jeigu pirmas API mato ONLINE,
         naudojam jo duomenis iš karto.
      */

      if (
        firstResult.online === true
      ) {

        setOnlineStatus(
          firstResult
        );


        return;

      }

    }

    catch (error) {

      console.warn(
        "mcstatus.io klaida:",
        error
      );

    }


    /* ========================================================
       2. MCSRVSTAT.US
    ======================================================== */

    try {

      secondResult =
        await checkMcsrvstat();


      secondWorked =
        true;


      /*
         Jeigu antras API mato ONLINE,
         serveris ONLINE.
      */

      if (
        secondResult.online === true
      ) {

        setOnlineStatus(
          secondResult
        );


        return;

      }

    }

    catch (error) {

      console.warn(
        "mcsrvstat.us klaida:",
        error
      );

    }


    /* ========================================================
       ABU API ATSAKĖ OFFLINE
    ======================================================== */

    if (
      firstWorked &&
      secondWorked &&
      firstResult &&
      secondResult &&
      firstResult.online === false &&
      secondResult.online === false
    ) {

      setOfflineStatus();

      return;

    }


    /* ========================================================
       VIENAS API ATSAKĖ OFFLINE,
       KITAS NEPASIEKIAMAS
    ========================================================

       Tokiu atveju NERODOM klaidingo OFFLINE.
    ======================================================== */

    setUnknownStatus();

  }

  catch (error) {

    console.error(
      "Serverio statuso klaida:",
      error
    );


    setUnknownStatus();

  }

  finally {

    statusRequestRunning =
      false;

  }

}


/* ============================================================
   NAVBAR
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

    items.forEach(
      item => {

        item.classList.add(
          "revealed"
        );

      }
    );


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

      transform:
        translateY(22px);

      transition:
        opacity .6s ease,
        transform .6s ease;

    }


    .reveal-item.revealed {

      opacity: 1;

      transform:
        translateY(0);

    }


    .online-dot {

      background:
        #52f38b !important;

      box-shadow:
        0 0 8px #52f38b,
        0 0 20px rgba(82, 243, 139, .75)
        !important;

    }


    .offline-dot {

      background:
        #ff4d68 !important;

      box-shadow:
        0 0 8px #ff4d68,
        0 0 20px rgba(255, 77, 104, .70)
        !important;

    }


    @media (prefers-reduced-motion: reduce) {

      .reveal-item {

        opacity:
          1 !important;

        transform:
          none !important;

        transition:
          none !important;

      }

    }

  `;


  document.head.appendChild(
    style
  );

}


/* ============================================================
   PUSLAPIO STARTAS
============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    addAnimationStyles();


    setupNavbar();


    setupRevealAnimations();


    /* ========================================================
       VERSIJA
    ======================================================== */

    const serverVersion =
      document.getElementById(
        "serverVersion"
      );


    if (
      serverVersion
    ) {

      serverVersion.textContent =
        SERVER_VERSION;

    }


    /* ========================================================
       PIRMAS STATUSO TIKRINIMAS
    ======================================================== */

    loadServerStatus();


    /* ========================================================
       STATUSAS KAS 20 SEKUNDŽIŲ
    ======================================================== */

    setInterval(
      loadServerStatus,
      STATUS_REFRESH_TIME
    );

  }
);
