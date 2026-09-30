// Мобильное меню: открыть/закрыть, закрыть после перехода по ссылке.
(function () {
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
})();
