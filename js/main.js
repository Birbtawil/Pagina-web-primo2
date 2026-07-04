/**
 * CG Premier Builders — interacciones ligeras (sin frameworks).
 * Cubre: header con estado de scroll, menú móvil, scroll-reveal en cascada,
 * parallax del hero, botón "volver arriba", prefill del formulario desde las
 * tarjetas de servicios, generación de los selectores de fecha/hora, y
 * validación + envío del formulario de cotización.
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
   * Header: cambia de transparente a "sólido" con blur al hacer scroll,
   * reforzando la jerarquía de capas del glassmorphism.
   * --------------------------------------------------------------------- */
  var header = document.getElementById("header-panel");
  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add("bg-charcoal-950/80", "shadow-deep");
      header.classList.remove("bg-transparent");
    } else {
      header.classList.remove("bg-charcoal-950/80", "shadow-deep");
      header.classList.add("bg-transparent");
    }
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* Menú móvil */
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var iconMenu = document.getElementById("icon-menu");
  var iconClose = document.getElementById("icon-close");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      var isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      iconMenu.classList.toggle("hidden");
      iconClose.classList.toggle("hidden");
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
        iconMenu.classList.remove("hidden");
        iconClose.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -----------------------------------------------------------------------
   * Scroll reveal (fade-in-up) con cascada: IntersectionObserver añade
   * ".is-visible" y un pequeño retraso creciente según el orden dentro de
   * cada contenedor de grid/lista, produciendo el efecto "staggered" pedido
   * para las tarjetas de servicios/testimonios.
   * --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var groups = new Map();
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });
    groups.forEach(function (siblings) {
      siblings.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i * 90, 450) + "ms";
      });
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Sin soporte de IntersectionObserver, o el usuario prefiere menos
    // animación: mostrar el contenido directamente sin esperar al scroll.
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* -----------------------------------------------------------------------
   * Parallax sutil del fondo del Hero (image_573feb.png). Se traslada a una
   * fracción de la velocidad del scroll para dar sensación de profundidad
   * sin desprender la imagen del contenedor (por eso el "scale-110" en el
   * markup deja margen de sobra).
   * --------------------------------------------------------------------- */
  var heroBg = document.getElementById("hero-bg");
  var heroSection = document.getElementById("home");
  if (heroBg && heroSection && !prefersReducedMotion) {
    var ticking = false;
    function applyParallax() {
      var rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        var offset = window.scrollY * 0.18;
        heroBg.style.transform = "translate3d(0, " + offset + "px, 0)";
      }
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    applyParallax();
  }

  /* Botón "volver arriba" */
  var backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 900) {
          backToTop.classList.remove("opacity-0", "translate-y-20");
        } else {
          backToTop.classList.add("opacity-0", "translate-y-20");
        }
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* -----------------------------------------------------------------------
   * Tarjetas de servicios -> preseleccionan el tipo de servicio en el
   * formulario y desplazan la vista hasta él, para acortar el camino entre
   * "me interesa este servicio" y "pido presupuesto" (foco en conversión).
   * --------------------------------------------------------------------- */
  var serviceSelect = document.getElementById("serviceType");
  document.querySelectorAll(".quote-trigger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-service");
      if (serviceSelect && value) {
        serviceSelect.value = value;
      }
      var quoteSection = document.getElementById("quote");
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }
      var firstName = document.getElementById("firstName");
      if (firstName) {
        window.setTimeout(function () {
          firstName.focus({ preventScroll: true });
        }, 500);
      }
    });
  });

  /* -----------------------------------------------------------------------
   * Selectores de fecha/hora preferida (Month / Day / Year / Time).
   * Se generan por JS para no repetir manualmente 31 <option> de días o los
   * intervalos de hora en el HTML.
   * --------------------------------------------------------------------- */
  function fillSelect(select, options, placeholder) {
    if (!select) return;
    var frag = document.createDocumentFragment();
    var placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.textContent = placeholder;
    frag.appendChild(placeholderOpt);
    options.forEach(function (opt) {
      var el = document.createElement("option");
      el.value = opt.value;
      el.textContent = opt.label;
      frag.appendChild(el);
    });
    select.appendChild(frag);
  }

  var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  fillSelect(
    document.getElementById("pref-month"),
    monthNames.map(function (name, i) {
      return { value: String(i + 1), label: name };
    }),
    "Month"
  );

  var dayOptions = [];
  for (var d = 1; d <= 31; d++) dayOptions.push({ value: String(d), label: String(d) });
  fillSelect(document.getElementById("pref-day"), dayOptions, "Day");

  var currentYear = new Date().getFullYear();
  fillSelect(
    document.getElementById("pref-year"),
    [currentYear, currentYear + 1].map(function (y) {
      return { value: String(y), label: String(y) };
    }),
    "Year"
  );

  var timeOptions = [];
  for (var h = 7; h <= 19; h++) {
    [0, 30].forEach(function (m) {
      if (h === 19 && m === 30) return; // parar a las 7:00 PM
      var hour12 = h % 12 === 0 ? 12 : h % 12;
      var period = h < 12 ? "AM" : "PM";
      var label = hour12 + ":" + (m === 0 ? "00" : "30") + " " + period;
      timeOptions.push({ value: label, label: label });
    });
  }
  fillSelect(document.getElementById("pref-time"), timeOptions, "Time (HH:MM AM/PM)");

  /* -----------------------------------------------------------------------
   * Validación y envío del formulario de cotización.
   * No hay backend configurado en este entorno: `data-endpoint` queda vacío
   * a propósito. Cuando exista un endpoint real (API propia, Formspree,
   * Zapier, etc.), basta con rellenarlo aquí y en el atributo del HTML —
   * el fetch() de abajo ya está listo para usarlo.
   * --------------------------------------------------------------------- */
  var form = document.getElementById("quote-form");
  if (form) {
    var endpointHolder = form.querySelector("[data-endpoint]");
    var endpoint = endpointHolder ? endpointHolder.getAttribute("data-endpoint") : "";
    var statusEl = form.querySelector(".form-status");
    var phonePattern = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    function setFieldError(field, hasError) {
      var errorEl = field.parentElement.querySelector(".field-error");
      field.classList.toggle("border-red-500/70", hasError);
      field.classList.toggle("border-white/10", !hasError);
      if (errorEl) errorEl.classList.toggle("hidden", !hasError);
    }

    function validateField(field) {
      if (field.hasAttribute("required") && !field.value.trim()) {
        setFieldError(field, true);
        return false;
      }
      if (field.type === "email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        setFieldError(field, true);
        return false;
      }
      if (field.type === "tel" && field.value && !phonePattern.test(field.value.trim())) {
        setFieldError(field, true);
        return false;
      }
      setFieldError(field, false);
      return true;
    }

    ["firstName", "lastName", "email", "phone"].forEach(function (id) {
      var field = document.getElementById(id);
      if (field) {
        field.addEventListener("blur", function () {
          validateField(field);
        });
      }
    });

    function showStatus(message, isError) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.remove("hidden", "bg-red-500/10", "text-red-300", "bg-emerald-500/10", "text-emerald-300");
      statusEl.classList.add(isError ? "bg-red-500/10" : "bg-emerald-500/10", isError ? "text-red-300" : "text-emerald-300");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var requiredFields = ["firstName", "lastName", "email", "phone"]
        .map(function (id) {
          return document.getElementById(id);
        })
        .filter(Boolean);

      var isValid = requiredFields.every(function (field) {
        return validateField(field);
      });

      if (!isValid) {
        showStatus("Please fill in all required fields correctly before submitting.", true);
        requiredFields.find(function (f) {
          return !validateField(f);
        });
        var firstInvalid = requiredFields.find(function (f) {
          return f.classList.contains("border-red-500/70");
        });
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function (value, key) {
        payload[key] = payload[key] ? [].concat(payload[key], value) : value;
      });

      var finish = function (success) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
        if (success) {
          showStatus("Thank you! Your request has been received — we'll be in touch shortly.", false);
          form.reset();
        } else {
          showStatus("Something went wrong sending your request. Please call us at (719) 504-0857.", true);
        }
      };

      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then(function (res) {
            finish(res.ok);
          })
          .catch(function () {
            finish(false);
          });
      } else {
        // Sin endpoint configurado todavía: confirmamos en cliente para no
        // bloquear la demo/preview del diseño.
        window.setTimeout(function () {
          finish(true);
        }, 600);
      }
    });
  }

  /* Año dinámico en el footer */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
