/* ============================================================
   MCSTONE.LT
   LIVE SERVER STATUS
============================================================ */


/* ============================================================
   SERVERIO NUSTATYMAI
============================================================ */

const SERVER_HOST = "mcstone.srw.lt";
const SERVER_PORT = "25565";

const DISPLAY_IP = "mcstone.srw.lt";

const SERVER_VERSION = "1.21.11";


/*
  Serverio statistika atnaujinama
  kas 20 sekundžių.
*/

const STATUS_REFRESH_TIME = 20000;


/*
  Pagrindinis statuso API.
*/

const MCSTATUS_API =
  `https://api.mcstatus.io/v2/status/java/${SERVER_HOST}:${SERVER_PORT}`;


/*
  Atsarginis statuso API.
*/

const MCSRVSTAT_API =
  `https://api.mcsrvstat.us/3/${SERVER_HOST}:${SERVER_PORT}`;


let toastTimer = null;

let statusRequestRunning = false;


/* ============================================================
   ELEMENTAI
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

    }

    else {

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
   ATSARGINIS COPY
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
   COPY MYGTUKAS
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
   FETCH SU TIMEOUT
============================================================ */

async function fetchWithTimeout(
  url,
  timeout = 8000
) {

  const controller =
    new AbortController();


  const timer =
    setTimeout(
      () => controller.abort(),
      timeout
    );


  try {

    const separator =
      url.includes("?")
        ? "&"
        : "?";


    const response =
      await fetch(
        `${url}${separator}t=${Date.now()}`,
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
      timer
    );

  }

}


/* ============================================================
   MCSTATUS.IO
============================================================ */

async function getMcStatusData() {

  const data =
    await fetchWithTimeout(
      MCSTATUS_API
    );


  if (
    !data ||
    data.online !== true
  ) {

    return {
      online: false,
      playersOnline: 0,
      playersMax: 0
    };

  }


  return {

    online: true,

    playersOnline:
      Number(
        data?.players?.online ?? 0
      ),

    playersMax:
      Number(
        data?.players?.max ?? 0
      )

  };

}


/* ============================================================
   MCSRVSTAT.US
============================================================ */

async function getMcsrvstatData() {

  const data =
    await fetchWithTimeout(
      MCSRVSTAT_API
    );


  if (
    !data ||
    data.online !== true
  ) {

    return {
      online: false,
      playersOnline: 0,
      playersMax: 0
    };

  }


  return {

    online: true,

    playersOnline:
      Number(
        data?.players?.online ?? 0
      ),

    playersMax:
      Number(
        data?.players?.max ?? 0
      )

  };

}


/* ============================================================
   ONLINE
============================================================ */

function setOnlineStatus(serverData) {

  const el =
    getServerElements();


  const onlinePlayers =
    Number.isFinite(
      serverData.playersOnline
    )
      ? serverData.playersOnline
      : 0;


  const maxPlayers =
    Number.isFinite(
      serverData.playersMax
    )
      ? serverData.playersMax
      : 0;


  const playersText =
    `${onlinePlayers} / ${maxPlayers}`;


  /*
    Versija visada rodoma 1.21.11.
  */

  if (el.serverVersion) {

    el.serverVersion.textContent =
      SERVER_VERSION;

  }


  /*
    Statusas.
  */

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


  /*
    Žaidėjai.
  */

  if (el.playerCount) {

    el.playerCount.textContent =
      playersText;

  }


  /*
    Footer.
  */

  if (el.footerStatus) {

    el.footerStatus.textContent =
      `Online • ${playersText}`;

  }

}


/* ============================================================
   OFFLINE
============================================================ */

function setOfflineStatus() {

  const el =
    getServerElements();


  if (el.serverVersion) {

    el.serverVersion.textContent =
      SERVER_VERSION;

  }


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


  if (el.footerStatus) {

    el.footerStatus.textContent =
      "Serveris offline";

  }

}


/* ============================================================
   API KLAIDA
============================================================ */

function setStatusError() {

  const el =
    getServerElements();


  if (el.serverVersion) {

    el.serverVersion.textContent =
      SERVER_VERSION;

  }


  if (el.statusText) {

    el.statusText.textContent =
      "NEPASIEKIAMAS";

  }


  if (el.playerCount) {

    el.playerCount.textContent =
      "-- / --";

  }


  if (el.statusDot) {

    el.statusDot.classList.remove(
      "online-dot"
    );

    el.statusDot.classList.add(
      "offline-dot"
    );

  }


  if (el.footerStatus) {

    el.footerStatus.textContent =
      "Statusas nepasiekiamas";

  }

}


/* ============================================================
   SERVERIO TIKRINIMAS
============================================================ */

async function loadServerStatus() {

  if (statusRequestRunning) {
    return;
  }


  statusRequestRunning =
    true;


  let firstApiResponded = false;

  let firstApiOffline = false;


  try {

    /*
      1. MCSTATUS.IO
    */

    try {

      const firstData =
        await getMcStatusData();


      firstApiResponded =
        true;


      if (
        firstData.online === true
      ) {

        setOnlineStatus(
          firstData
        );

        return;

      }


      firstApiOffline =
        true;

    }

    catch (error) {

      console.warn(
        "mcstatus.io klaida:",
        error
      );

    }


    /*
      2. MCSRVSTAT.US
    */

    try {

      const secondData =
        await getMcsrvstatData();


      if (
        secondData.online === true
      ) {

        setOnlineStatus(
          secondData
        );

        return;

      }


      /*
        Abu API serverį mato kaip offline.
      */

      setOfflineStatus();

    }

    catch (error) {

      console.warn(
        "mcsrvstat.us klaida:",
        error
      );


      /*
        Jeigu pirmas API normaliai atsakė,
        kad serveris offline.
      */

      if (
        firstApiResponded &&
        firstApiOffline
      ) {

        setOfflineStatus();

      }

      else {

        setStatusError();

      }

    }

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
   REVEAL ANIMACIJOS
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

    @media (prefers-reduced-motion: reduce) {

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
   START
============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    addAnimationStyles();

    setupNavbar();

    setupRevealAnimations();


    /*
      Versija iškart 1.21.11.
    */

    const serverVersion =
      document.getElementById(
        "serverVersion"
      );


    if (serverVersion) {

      serverVersion.textContent =
        SERVER_VERSION;

    }


    /*
      Statusas tikrinamas iškart.
    */

    loadServerStatus();


    /*
      Po to kas 20 sekundžių.
    */

    setInterval(
      loadServerStatus,
      STATUS_REFRESH_TIME
    );

  }
);
