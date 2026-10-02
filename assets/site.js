// Lotsman Analytics: меню, анимации при прокрутке, счётчики, калькулятор потерь,
// нижняя кнопка на телефоне. Подключается в <head>: сразу помечает страницу классом
// .js (чтобы скрытые до появления блоки не мигали), остальное — после загрузки DOM.
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  var PHONE = "77064501518";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function fmt(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function waLink(text) {
    return "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text);
  }

  // Плавно меняет число в элементе от текущего значения к новому.
  function tween(el, to, ms) {
    var from = Number(el.getAttribute("data-value") || 0);
    el.setAttribute("data-value", String(to));
    if (reduce || from === to) {
      el.textContent = fmt(to);
      return;
    }
    var start = null;
    function step(t) {
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / ms);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function menu() {
    var btn = document.querySelector(".menu-btn");
    var nav = document.getElementById("mobile-nav");
    if (!btn || !nav) return;
    function set(open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    }
    btn.addEventListener("click", function () {
      set(!nav.classList.contains("open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) set(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") set(false);
    });
  }

  function header() {
    var h = document.querySelector(".header");
    if (!h) return;
    function update() {
      h.classList.toggle("scrolled", window.scrollY > 8);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  // Блоки с data-reveal появляются, когда доходят до экрана. Дети data-stagger — по очереди.
  function reveal() {
    var groups = document.querySelectorAll("[data-stagger]");
    for (var g = 0; g < groups.length; g++) {
      var kids = groups[g].querySelectorAll(":scope > [data-reveal]");
      for (var k = 0; k < kids.length; k++) kids[k].style.setProperty("--i", String(k % 4));
    }
    var els = document.querySelectorAll("[data-reveal]");
    if (reduce || !hasIO) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("in");
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
    // Страховка для встроенных браузеров (Instagram, WhatsApp): всё, что уже на экране,
    // показываем, даже если наблюдатель не сработал.
    function sweep() {
      var h = window.innerHeight;
      for (var n = 0; n < els.length; n++) {
        if (els[n].classList.contains("in")) continue;
        var r = els[n].getBoundingClientRect();
        if (r.top < h && r.bottom > 0) els[n].classList.add("in");
      }
    }
    setTimeout(sweep, 1500);
    var t = null;
    window.addEventListener(
      "scroll",
      function () {
        clearTimeout(t);
        t = setTimeout(sweep, 400);
      },
      { passive: true }
    );
  }

  // Числа на первом экране считаются от нуля, когда видны.
  function counters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length || reduce || !hasIO) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target;
        el.setAttribute("data-value", "0");
        el.textContent = "0";
        setTimeout(function () {
          tween(el, Number(el.getAttribute("data-count")), 1200);
        }, 700);
      });
    });
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
  }

  function calc() {
    var leads = document.getElementById("c-leads");
    if (!leads) return;
    var loss = document.getElementById("c-loss");
    var conv = document.getElementById("c-conv");
    var check = document.getElementById("c-check");
    var CHECKS = [10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000, 500000, 750000,
      1000000, 1500000, 2000000, 3000000, 5000000];
    var month = document.getElementById("c-month");
    var year = document.getElementById("c-year");
    var lost = document.getElementById("c-lost");
    var cta = document.getElementById("c-cta");
    month.setAttribute("data-value", "400000");
    year.setAttribute("data-value", "4800000");

    function fill(input) {
      var p = ((input.value - input.min) / (input.max - input.min)) * 100;
      input.style.setProperty("--p", p + "%");
    }

    function update() {
      var l = Number(leads.value);
      var lp = Number(loss.value);
      var cp = Number(conv.value);
      var ch = CHECKS[Number(check.value)];
      var lostLeads = (l * lp) / 100;
      var sum = (lostLeads * cp * ch) / 100;
      document.getElementById("o-leads").textContent = fmt(l);
      document.getElementById("o-loss").textContent = lp + "%";
      document.getElementById("o-conv").textContent = cp + "%";
      document.getElementById("o-check").textContent = fmt(ch) + " ₸";
      lost.textContent = fmt(lostLeads);
      tween(month, Math.round(sum / 1000) * 1000, 450);
      tween(year, Math.round((sum * 12) / 1000) * 1000, 450);
      cta.href = waLink(
        "Здравствуйте! Хочу бесплатную проверку отдела продаж. У нас примерно " + fmt(l) +
          " заявок в месяц, средний чек около " + fmt(ch) + " ₸."
      );
      [leads, loss, conv, check].forEach(fill);
    }

    [leads, loss, conv, check].forEach(function (el) {
      el.addEventListener("input", update);
    });
    update();
  }

  // Нижняя кнопка на телефоне: появляется после первого экрана, прячется у контактов и подвала,
  // чтобы не закрывать реквизиты.
  function mobileCta() {
    var bar = document.getElementById("mcta");
    var hero = document.querySelector(".hero");
    if (!bar || !hero || !hasIO) return;
    var heroVisible = true;
    var endVisible = false;
    function update() {
      bar.classList.toggle("show", !heroVisible && !endVisible);
    }
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      update();
    }).observe(hero);
    var ends = [document.getElementById("contacts"), document.querySelector(".footer")].filter(Boolean);
    var seen = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        seen.set(en.target, en.isIntersecting);
      });
      endVisible = false;
      seen.forEach(function (v) {
        if (v) endVisible = true;
      });
      update();
    });
    ends.forEach(function (el) {
      io.observe(el);
    });
  }

  onReady(function () {
    menu();
    header();
    reveal();
    counters();
    calc();
    mobileCta();
  });
})();
