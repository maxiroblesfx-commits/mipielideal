/* =================================================================
   Estética Tu Look — interacciones
   Vanilla JS, sin dependencias.
   ================================================================= */
(function () {
  "use strict";

  /* ---- CONFIG: reemplazar por datos reales antes de publicar ---- */
  var CONFIG = {
    whatsapp: "5490000000000",           // <-- número real (formato internacional, sin + ni espacios)
    businessName: "Estética Tu Look"
  };

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var waLink = function (text) {
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
  };

  /* ===================== NAV ===================== */
  var nav = $("#nav");
  var hero = $("#inicio");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
    // ¿seguimos sobre el hero?
    var h = hero ? hero.offsetHeight - 90 : 600;
    if (window.scrollY < h) nav.classList.add("on-hero");
    else nav.classList.remove("on-hero");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menú mobile
  var toggle = $("#navToggle");
  toggle.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("#navLinks a").forEach(function (a) {
    a.addEventListener("click", function () {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ===================== REVEAL ON SCROLL ===================== */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    $$("[data-reveal]").forEach(function (el) { io.observe(el); });
  } else {
    $$("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
  }

  /* ===================== TABS TRATAMIENTOS ===================== */
  $$(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var id = tab.getAttribute("data-tab");
      $$(".tab").forEach(function (t) { t.classList.toggle("active", t === tab); });
      $$(".tab-panel").forEach(function (p) { p.classList.toggle("active", p.id === id); });
    });
  });

  /* ===================== SLIDER ANTES/DESPUÉS ===================== */
  $$("[data-ba]").forEach(function (ba) {
    var before = $(".ba-before", ba);
    var handle = $(".ba-handle", ba);
    var dragging = false;

    function setPos(clientX) {
      var rect = ba.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      before.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      handle.style.left = pct + "%";
    }
    function start(e) { dragging = true; move(e); }
    function move(e) {
      if (!dragging) return;
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
      if (e.cancelable) e.preventDefault();
    }
    function end() { dragging = false; }

    ba.addEventListener("mousedown", start);
    ba.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);
    // hover en desktop: seguir el cursor
    ba.addEventListener("mousemove", function (e) { if (!dragging) setPos(e.clientX); });
  });

  /* ===================== FAQ ACORDEÓN ===================== */
  $$(".acc-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var acc = q.parentElement;
      var open = acc.classList.contains("open");
      $$(".acc").forEach(function (a) {
        a.classList.remove("open");
        $(".acc-a", a).style.maxHeight = null;
      });
      if (!open) {
        acc.classList.add("open");
        var a = $(".acc-a", acc);
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ===================== TOAST ===================== */
  var toastEl = $("#toast"), toastMsg = $("#toastMsg"), toastT;
  function toast(msg) {
    toastMsg.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3800);
  }

  /* ===================== WHATSAPP LINKS ===================== */
  var waBase = "Hola " + CONFIG.businessName + " 👋, quiero hacer una consulta.";
  var fabWa = $("#fabWa"); if (fabWa) fabWa.href = waLink(waBase);
  var footWa = $("#footWa");
  if (footWa) {
    footWa.href = waLink(waBase);
    footWa.target = "_blank"; footWa.rel = "noopener";
  }

  // Botones de membresía
  $$("[data-plan]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      // sigue navegando al form, pero precarga el servicio
      var plan = b.getAttribute("data-plan");
      var sel = $("#bf-service");
      if (sel) sel.value = "Membresía";
      var msg = $("#bf-msg");
      if (msg && !msg.value) msg.value = "Me interesa la membresía " + plan + ".";
    });
  });

  /* ===================== FORM RESERVA -> WHATSAPP ===================== */
  var form = $("#bookingForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#bf-name").value.trim();
      var phone = $("#bf-phone").value.trim();
      var service = $("#bf-service").value;
      var date = $("#bf-date").value;
      var time = $("#bf-time").value;
      var message = $("#bf-msg").value.trim();

      if (!name || !phone || !service) {
        toast("Completá nombre, WhatsApp y tratamiento.");
        return;
      }
      var txt =
        "*Nueva solicitud de reserva* ✨\n\n" +
        "👤 Nombre: " + name + "\n" +
        "📱 WhatsApp: " + phone + "\n" +
        "💆 Tratamiento: " + service + "\n" +
        (date ? "📅 Día: " + date + "\n" : "") +
        (time ? "🕒 Franja: " + time + "\n" : "") +
        (message ? "📝 Mensaje: " + message + "\n" : "") +
        "\nEnviado desde la web de " + CONFIG.businessName + ".";

      window.open(waLink(txt), "_blank", "noopener");
      toast("Te redirigimos a WhatsApp para confirmar 💬");
      form.reset();
    });
  }

  /* ===================== AÑO FOOTER ===================== */
  var y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  /* ===================== CHAT IA (asesora virtual) ===================== */
  var chat = $("#chat"), chatBody = $("#chatBody"), chatForm = $("#chatForm"),
      chatInput = $("#chatInput"), chatQuick = $("#chatQuick"),
      chatToggle = $("#chatToggle"), chatClose = $("#chatClose");
  var greeted = false;

  // Base de conocimiento simple: cada entrada tiene palabras clave + respuesta.
  var KB = [
    { k: ["hola","buenas","buenos dias","buenas tardes","hey"], a: "¡Hola! Soy Lía, tu asesora virtual de Estética Tu Look ✨ ¿En qué puedo ayudarte? Puedo contarte sobre tratamientos, precios, depilación láser, membresías o turnos." },
    { k: ["facial","cara","rostro","piel","limpieza","peeling","arruga","mancha"], a: "En faciales tenemos limpieza profunda, Hydrafacial, radiofrecuencia, peeling y microneedling. Trabajan luminosidad, firmeza, manchas y textura. La <a href='#tratamientos'>carta de faciales</a> tiene el detalle. ¿Querés que te agende una valoración gratuita?" },
    { k: ["corporal","cuerpo","celulitis","grasa","reducir","modelar","drenaje","flacidez"], a: "En corporales hacemos drenaje linfático, criolipólisis, radiofrecuencia, maderoterapia y mesoterapia reductora. Ideales para modelar, reducir y reafirmar. ¿Sobre qué zona querés trabajar?" },
    { k: ["laser","láser","rejuvenecimiento","rosacea","carbon"], a: "Nuestro láser médico trata rejuvenecimiento, manchas/melasma, rosácea y el famoso Carbon Peel Hollywood. Seguro y con resultados desde las primeras sesiones. ¿Te gustaría reservar?" },
    { k: ["depila","depilación","vello","axila","piernas","cavas","full body"], a: "La depilación láser es con diodo de última generación: prácticamente indolora y apta para todo tipo de piel. Tenemos zonas sueltas y Full Body con precio promocional. ¿Qué zona te interesa?" },
    { k: ["precio","cuesta","valor","cuanto","tarifa","sale"], a: "Los precios arrancan desde $16.000 (zonas chicas de depilación) y los faciales desde $28.000. Cada plan se ajusta en la valoración <b>gratuita</b>. ¿Te paso a coordinarla por WhatsApp?" },
    { k: ["membresia","membresía","plan","abono","mensual","socia"], a: "Tenemos 3 membresías: <b>Glow</b> ($45k), <b>Radiance</b> ($78k, la más elegida) y <b>Couture</b> ($135k). Incluyen tratamientos mensuales y descuentos. Mirá <a href='#membresias'>las membresías</a>. ¿Cuál te interesa?" },
    { k: ["turno","reserva","reservar","agenda","cita","valoracion","valoración","cuando"], a: "¡Genial! Reservás en 1 minuto desde el <a href='#reserva'>formulario de reserva</a> y te contactamos por WhatsApp. La primera valoración es sin cargo. ¿Querés que abra WhatsApp directamente?" },
    { k: ["dolor","duele","molesta"], a: "Los tratamientos son confortables. La depilación láser usa enfriamiento, así que es casi indolora, incluso en piel sensible. 🙂" },
    { k: ["horario","abren","atienden","hora"], a: "Atendemos de Lunes a Viernes de 9 a 20 h y Sábados de 9 a 14 h. ¿Querés coordinar un horario?" },
    { k: ["donde","ubica","direccion","dirección","lugar"], a: "Estamos en Av. Ejemplo 1234 (dirección a confirmar). Te paso la ubicación exacta por WhatsApp cuando coordinemos tu visita." },
    { k: ["pago","tarjeta","cuotas","efectivo","transferencia"], a: "Aceptamos efectivo, transferencia y tarjetas de débito/crédito en cuotas. Las membresías van con débito mensual. 💳" },
    { k: ["gracias","genial","perfecto","ok","dale"], a: "¡Con gusto! 💛 Si querés, te dejo el link directo de WhatsApp para reservar tu valoración gratuita." }
  ];

  var QUICK = ["Tratamientos faciales", "Depilación láser", "Precios", "Reservar turno"];

  function addMsg(text, who) {
    var d = document.createElement("div");
    d.className = "msg " + who;
    d.innerHTML = text;
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
    return d;
  }
  function typing() {
    var t = document.createElement("div");
    t.className = "chat-typing";
    t.innerHTML = "<span></span><span></span><span></span>";
    chatBody.appendChild(t);
    chatBody.scrollTop = chatBody.scrollHeight;
    return t;
  }
  function norm(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function answer(input) {
    var q = norm(input);
    var best = null, bestScore = 0;
    KB.forEach(function (item) {
      var score = 0;
      item.k.forEach(function (kw) { if (q.indexOf(norm(kw)) !== -1) score++; });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    if (best) return best.a;
    return "Buena pregunta 🙌 Para darte la mejor respuesta, te paso con el equipo por WhatsApp así te asesoran en detalle. Mientras tanto, podés ver la <a href='#tratamientos'>carta de tratamientos</a> o <a href='#reserva'>reservar tu valoración gratuita</a>.";
  }
  function botReply(input) {
    var t = typing();
    var delay = 650 + Math.min(1400, input.length * 25);
    setTimeout(function () {
      t.remove();
      var reply = answer(input);
      addMsg(reply, "bot");
      // Si menciona reservar, agregar CTA de WhatsApp
      if (/reserv|turno|whatsapp|coordinar|agenda|valoraci/i.test(input + reply)) {
        var cta = addMsg("👉 <a href='" + waLink("Hola, quiero reservar una valoración gratuita 💆") + "' target='_blank' rel='noopener'>Abrir WhatsApp para reservar</a>", "bot");
        cta.style.background = "#fff";
      }
    }, delay);
  }

  function buildQuick() {
    chatQuick.innerHTML = "";
    QUICK.forEach(function (q) {
      var b = document.createElement("button");
      b.textContent = q;
      b.addEventListener("click", function () { send(q); });
      chatQuick.appendChild(b);
    });
  }
  function send(text) {
    if (!text.trim()) return;
    addMsg(text, "user");
    botReply(text);
    chatInput.value = "";
  }

  function openChat() {
    chat.classList.add("open");
    chatInput.focus();
    if (!greeted) {
      greeted = true;
      typing();
      setTimeout(function () {
        var t = $(".chat-typing", chatBody); if (t) t.remove();
        addMsg("¡Hola! Soy <b>Lía</b>, tu asesora de Estética Tu Look ✨<br>¿En qué puedo ayudarte hoy?", "bot");
        buildQuick();
      }, 700);
    }
  }
  function closeChat() { chat.classList.remove("open"); }

  if (chatToggle) chatToggle.addEventListener("click", function () {
    chat.classList.contains("open") ? closeChat() : openChat();
  });
  if (chatClose) chatClose.addEventListener("click", closeChat);
  if (chatForm) chatForm.addEventListener("submit", function (e) {
    e.preventDefault(); send(chatInput.value);
  });

})();
