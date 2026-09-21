(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- scroll progress ---- */
  var progress = document.querySelector(".progress");
  function up() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (h.scrollTop / max) * 100 + "%";
  }
  window.addEventListener("scroll", up, { passive: true });
  up();

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- smooth anchor scroll ---- */
  document.querySelectorAll("[data-scroll]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.querySelector(btn.getAttribute("data-scroll"));
      if (!target) return;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---- custom cursor ---- */
  var finePointer =
    window.matchMedia("(pointer: fine)").matches && !reduceMotion;
  if (finePointer) {
    var cursor = document.querySelector(".cursor");
    var dot = cursor.children[0];
    var ring = cursor.children[1];
    var mx = -100, my = -100, rx = -100, ry = -100;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });

    function anim() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(anim);
    }
    anim();

    var hoverables = 'a, button, [data-hover], .service, .case, .tile';
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hoverables)) cursor.classList.add("is-hover");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverables)) cursor.classList.remove("is-hover");
    });
  }

  /* ---- hero marquee drift: shift halved for seamless loop ---- */
  var rows = document.querySelectorAll(".marquee__row");
  if (rows.length && !reduceMotion) {
    rows.forEach(function (row) {
      row.style.animation = "marquee 28s linear infinite";
    });
  }

  /* ---- gentle parallax on hero orb ---- */
  if (!reduceMotion && window.innerWidth > 940) {
    var orb = document.querySelector(".hero__orb");
    if (orb) {
      window.addEventListener("mousemove", function (e) {
        var x = e.clientX / window.innerWidth - 0.5;
        var y = e.clientY / window.innerHeight - 0.5;
        orb.style.setProperty("--dx", x);
        orb.style.setProperty("--dy", y);
        orb.style.transform =
          "translate(" + x * 16 + "px," + y * 16 + "px)";
      }, { passive: true });
    }
  }

  /* ---- nav hide on scroll down ---- */
  var nav = document.querySelector(".nav");
  var lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY;
      if (y > lastY && y > 120) nav.style.transform = "translateY(-100%)";
      else nav.style.transform = "translateY(0)";
      lastY = y;
    },
    { passive: true }
  );
})();