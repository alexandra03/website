(function () {
  const opsConsole = document.getElementById("opsConsole");
  const opsOutput = document.getElementById("opsOutput");
  const opsForm = document.getElementById("opsForm");
  const opsInput = document.getElementById("opsInput");
  const opsClose = document.getElementById("opsClose");
  const matrixCanvas = document.getElementById("matrixRain");
  const panel = document.querySelector(".ops-console__panel");
  const logo = document.querySelector(".logo");

  if (!opsConsole || !opsOutput || !opsForm || !opsInput || !opsClose || !matrixCanvas || !panel || !logo) {
    return;
  }

  let openedOnce = false;
  let clickTimes = [];
  let matrixTimer = null;
  let drops = [];
  let fontSize = 14;
  let lockedScrollY = 0;

  const konami = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiIndex = 0;

  function line(text, kind) {
    const row = document.createElement("div");
    row.className = "ops-console__line" + (kind ? " ops-console__line--" + kind : "");
    row.textContent = text;
    opsOutput.appendChild(row);
    opsOutput.scrollTop = opsOutput.scrollHeight;
  }

  function clearOutput() {
    opsOutput.innerHTML = "";
  }

  function lockPageScroll() {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = "fixed";
    document.body.style.top = "-" + lockedScrollY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  }

  function unlockPageScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    window.scrollTo(0, lockedScrollY);
  }

  function updateConsoleViewport() {
    const viewport = window.visualViewport;

    if (viewport) {
      opsConsole.style.setProperty("--ops-vh", Math.max(240, Math.floor(viewport.height)) + "px");
      opsConsole.style.top = Math.floor(viewport.offsetTop) + "px";
    } else {
      opsConsole.style.setProperty("--ops-vh", Math.max(240, window.innerHeight) + "px");
      opsConsole.style.top = "0px";
    }

    if (opsConsole.classList.contains("open")) {
      resizeMatrix();
    }
  }

  function openConsole() {
    opsConsole.classList.add("open");
    opsConsole.setAttribute("aria-hidden", "false");
    lockPageScroll();
    updateConsoleViewport();
    if (!openedOnce) {
      line("Booting Alexandra Ops Console...", "system");
      line("Access granted. Type 'help' for commands.", "success");
      openedOnce = true;
    }
    startMatrix();
    window.setTimeout(function () {
      opsInput.focus();
    }, 10);
  }

  function closeConsole() {
    opsConsole.classList.remove("open");
    opsConsole.setAttribute("aria-hidden", "true");
    unlockPageScroll();
    stopMatrix();
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  async function runDeploy() {
    const steps = [
      "Checking build health... OK",
      "Running distributed sanity tests... OK",
      "Rolling out to remote clusters... OK",
      "Syncing docs and release notes... OK",
      "Deployment complete. Team calm. Customers happy.",
    ];
    for (const step of steps) {
      line(step, "system");
      await sleep(380);
    }
    panel.classList.add("deploy-flash");
    line("SHIP IT.", "success");
    window.setTimeout(function () {
      panel.classList.remove("deploy-flash");
    }, 980);
  }

  async function runRetro() {
    const steps = [
      "Initializing 56k modem bridge...",
      "Dial tone detected...",
      "ATDT +1-REMOTE-OPS",
      "Handshake in progress...",
      "Negotiating protocol: async-first/v2",
      "Link quality: stable",
      "Connection established to: calm-team-ops",
    ];

    for (const step of steps) {
      line(step, "system");
      await sleep(260);
    }
    line("Welcome back to the old internet.", "success");
  }

  async function runStitch() {
    const frames = [
      "[ ]-[ ]-[ ]-[ ]-[ ]",
      " |   |   |   |   |",
      "[ ]-[ ]-[AS]-[ ]-[ ]",
      " |   |   |   |   |",
      "[ ]-[ ]-[ ]-[ ]-[ ]",
    ];

    line("Preparing pattern grid...", "system");
    await sleep(220);
    line("Thread loaded: green_terminal_v1", "system");
    await sleep(260);

    for (let i = 0; i < frames.length; i += 1) {
      line(frames[i], i === 2 ? "success" : "");
      await sleep(180);
    }

    line("Signature patch complete.", "success");
  }

  function handleCommand(raw) {
    const command = raw.trim().toLowerCase();
    if (!command) {
      return;
    }

    line("ops@alexandra:~$ " + raw, "system");

    if (command === "help") {
      line("Commands: help, about, talks, links, book, stitch, retro, deploy, clear, exit", "system");
      return;
    }

    if (command === "about") {
      line("VP of Engineering, author, speaker, and builder of healthy teams.");
      return;
    }

    if (command === "talks") {
      window.location.hash = "speaking";
      line("Jumped to Talks & Podcasts section.", "success");
      return;
    }

    if (command === "links") {
      line("linkedin.com/in/alexandrasunderland");
      line("x.com/alexandras_dev");
      line("github.com/alexandrasunderland");
      return;
    }

    if (command === "book") {
      window.open("https://link.springer.com/book/10.1007/978-1-4842-8584-8", "_blank", "noopener,noreferrer");
      line("Opened Remote Engineering Management.", "success");
      return;
    }

    if (command === "stitch") {
      runStitch();
      return;
    }

    if (command === "retro") {
      runRetro();
      return;
    }

    if (command === "deploy") {
      runDeploy();
      return;
    }

    if (command === "clear") {
      clearOutput();
      return;
    }

    if (command === "exit") {
      closeConsole();
      return;
    }

    line("Unknown command: " + raw, "error");
  }

  function resizeMatrix() {
    const rect = matrixCanvas.getBoundingClientRect();
    matrixCanvas.width = Math.max(200, Math.floor(rect.width));
    matrixCanvas.height = Math.max(200, Math.floor(rect.height));

    const columns = Math.floor(matrixCanvas.width / fontSize);
    drops = new Array(columns).fill(1);
  }

  function drawMatrix() {
    const ctx = matrixCanvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.fillStyle = "rgba(5, 8, 6, 0.16)";
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    ctx.fillStyle = "#55f07c";
    ctx.font = fontSize + "px IBM Plex Mono";

    const chars = "01{}[]<>/=+-*.:";
    for (let i = 0; i < drops.length; i += 1) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 1;
    }
  }

  function startMatrix() {
    resizeMatrix();
    if (matrixTimer) {
      return;
    }
    matrixTimer = window.setInterval(drawMatrix, 60);
  }

  function stopMatrix() {
    if (!matrixTimer) {
      return;
    }
    window.clearInterval(matrixTimer);
    matrixTimer = null;
  }

  logo.addEventListener("click", function (event) {
    event.preventDefault();

    const now = Date.now();
    clickTimes.push(now);
    clickTimes = clickTimes.filter(function (t) {
      return now - t < 1800;
    });

    if (clickTimes.length >= 5) {
      clickTimes = [];
      openConsole();
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && opsConsole.classList.contains("open")) {
      closeConsole();
      return;
    }

    if (opsConsole.classList.contains("open")) {
      return;
    }

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === konami[konamiIndex]) {
      konamiIndex += 1;
      if (konamiIndex === konami.length) {
        konamiIndex = 0;
        openConsole();
      }
    } else {
      konamiIndex = 0;
    }
  });

  opsClose.addEventListener("click", closeConsole);

  opsConsole.addEventListener("click", function (event) {
    if (event.target === opsConsole) {
      closeConsole();
    }
  });

  opsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const raw = opsInput.value;
    opsInput.value = "";
    handleCommand(raw);
  });

  opsInput.addEventListener("focus", function () {
    window.setTimeout(updateConsoleViewport, 60);
  });

  window.addEventListener("resize", function () {
    if (opsConsole.classList.contains("open")) {
      updateConsoleViewport();
    }
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateConsoleViewport);
    window.visualViewport.addEventListener("scroll", updateConsoleViewport);
  }
})();
