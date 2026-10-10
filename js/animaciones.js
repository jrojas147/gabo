(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var progreso = document.getElementById("progreso");
  var volver = document.querySelector(".volver");
  var enlaces = Array.prototype.slice.call(document.querySelectorAll(".barra nav a"));
  var porId = new Map(enlaces.map(function (a) {
    return [a.getAttribute("href").slice(1), a];
  }));
  var vigiladas = Array.prototype.slice.call(
    document.querySelectorAll("#autor, #obra, #macondo, #realismo, #grupo, #cierre")
  );
  var marco = 0;

  function marcar(id) {
    enlaces.forEach(function (a) {
      var activo = a === porId.get(id);
      a.classList.toggle("activo", activo);
      if (activo) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function alDesplazar() {
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    var avance = alto > 0 ? window.scrollY / alto : 0;
    if (progreso) progreso.style.transform = "scaleX(" + avance + ")";
    if (volver) volver.classList.toggle("mostrar", window.scrollY > 520);

    var linea = window.scrollY + Math.min(window.innerHeight * 0.35, 320);
    var actual = "";
    vigiladas.forEach(function (sec) {
      if (sec.offsetTop <= linea) actual = sec.id;
    });
    if (porId.has(actual)) marcar(actual);
    else marcar("");
  }

  window.addEventListener("scroll", function () {
    if (marco) return;
    marco = window.requestAnimationFrame(function () {
      alDesplazar();
      marco = 0;
    });
  }, { passive: true });
  alDesplazar();

  if (reduce || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("js");

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("visible");
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

  Array.prototype.forEach.call(document.querySelectorAll(".revelar"), function (el) {
    observador.observe(el);
  });

  var plantilla = document.getElementById("plantilla-mariposa");
  if (plantilla) {
    var estrecha = window.matchMedia("(max-width: 700px)").matches;
    var colores = ["#ffe082", "#f0c14a", "#fff3c4", "#e8a317", "#ffd166", "#f6e7a2"];
    var coloresTenues = ["#e2b33a", "#c9842a", "#f0d48a"];

    Array.prototype.forEach.call(document.querySelectorAll(".lluvia"), function (capa) {
      var pedida = Number(capa.dataset.cantidad || 8);
      var cantidad = estrecha ? Math.max(4, Math.ceil(pedida * 0.6)) : pedida;
      var tenue = capa.dataset.tenue === "si";
      var paleta = tenue ? coloresTenues : colores;

      for (var i = 0; i < cantidad; i++) {
        var mariposa = plantilla.content.firstElementChild.cloneNode(true);
        var duracion = 15 + Math.random() * 16;
        var tamano = tenue ? 16 + Math.random() * 14 : 22 + Math.random() * 28;
        var izquierda = Math.random() < 0.5;
        var x = capa.dataset.zonas === "bordes"
          ? (izquierda ? Math.random() * 18 : 82 + Math.random() * 18)
          : Math.random() * 100;
        mariposa.style.setProperty("--x", x + "%");
        mariposa.style.setProperty("--deriva", (Math.random() * 80 - 40) + "px");
        mariposa.style.setProperty("--tam", tamano + "px");
        mariposa.style.setProperty("--tono", paleta[i % paleta.length]);
        mariposa.style.setProperty("--caer", duracion + "s");
        mariposa.style.setProperty("--espera", (-Math.random() * duracion) + "s");
        mariposa.style.setProperty("--op", String(tenue ? 0.25 + Math.random() * 0.22 : 0.55 + Math.random() * 0.35));
        mariposa.style.setProperty("--flap", (0.45 + Math.random() * 0.45) + "s");
        capa.appendChild(mariposa);
      }
    });
  }

  var caja = document.querySelector(".sentidos");
  if (!caja) return;

  var pasos = Array.prototype.slice.call(caja.querySelectorAll(".eje"));
  var indice = 0;
  var reloj = 0;

  function activar(n) {
    indice = n;
    pasos.forEach(function (paso, i) {
      paso.classList.toggle("activo", i === n);
    });
  }

  function arrancar() {
    window.clearInterval(reloj);
    reloj = window.setInterval(function () {
      activar((indice + 1) % pasos.length);
    }, 3200);
  }

  activar(0);
  arrancar();
  caja.addEventListener("mouseenter", function () { window.clearInterval(reloj); });
  caja.addEventListener("mouseleave", arrancar);
  caja.addEventListener("focusin", function () { window.clearInterval(reloj); });
  caja.addEventListener("focusout", arrancar);
  pasos.forEach(function (paso, i) {
    paso.addEventListener("mouseenter", function () { activar(i); });
    paso.addEventListener("focus", function () { activar(i); });
    paso.addEventListener("click", function () { activar(i); });
  });
})();
