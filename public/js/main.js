/* =============================================================================
   EMCA System - JS global
   Menú mobile, año dinámico y formulario de contacto (Formspree).
   ========================================================================== */

/* -----------------------------------------------------------------------
   CONFIGURACIÓN: reemplazar TU_ID_DE_FORMSPREE por el ID real del formulario
   creado en https://formspree.io (dashboard > New Form).
   El mail de destino (contacto@emcasystem.com.ar) se configura en el dashboard
   de Formspree, NO acá en el código.
   ----------------------------------------------------------------------- */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrpzpkqe";

/* Año dinámico del footer -------------------------------------------------- */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

/* Menú mobile -------------------------------------------------------------- */
(function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.getElementById("nav-principal");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
  });

  nav.addEventListener("click", (e) => {
    if (e.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* Formulario de contacto --------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!(form instanceof HTMLFormElement)) return;

  const submitBtn = document.getElementById("form-submit");
  const status = document.getElementById("form-status");

  const validators = {
    nombre: (v) => (v.trim().length < 2 ? "Ingresá tu nombre (mínimo 2 caracteres)." : ""),
    email: (v) =>
      v.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? "Revisá el email o dejalo vacío si preferís que te contactemos por teléfono."
        : "",
    telefono: (v) => {
      const phone = v.trim();
      const digits = phone.replace(/\D/g, "");
      return !/^\+?[\d\s().-]+$/.test(phone) || digits.length < 10 || digits.length > 15
        ? "Ingresá un teléfono con código de área, por ejemplo: 11 5555-1234."
        : "";
    },
    mensaje: (v) =>
      !v.trim()
        ? "Contanos qué le pasa a tu equipo o qué necesitás."
        : v.trim().length > 1000
          ? "El mensaje no puede superar los 1000 caracteres."
          : "",
  };

  function validateField(name) {
    const input = form.elements.namedItem(name);
    const errorEl = document.getElementById(`error-${name}`);
    if (!input || !errorEl) return true;
    const msg = validators[name](input.value);
    errorEl.textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  Object.keys(validators).forEach((name) => {
    const input = form.elements.namedItem(name);
    if (input) input.addEventListener("blur", () => validateField(name));
  });

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = `form__status is-visible ${type === "success" ? "is-success" : "is-error"}`;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (status) status.className = "form__status";

    const isValid = Object.keys(validators).map(validateField).every(Boolean);
    if (!isValid) {
      setStatus("Revisá los campos marcados antes de enviar.", "error");
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";

    try {
      const data = new FormData(form);
      ["nombre", "telefono", "email", "mensaje"].forEach((name) => {
        data.set(name, data.get(name).trim());
      });
      // El email es opcional; si está vacío, no se envía como dirección de respuesta.
      if (!data.get("email")) data.delete("email");

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (!response.ok) throw new Error("Respuesta no exitosa del servidor");

      form.reset();
      setStatus("¡Listo! Recibimos tu consulta y te respondemos a la brevedad.", "success");
    } catch (error) {
      setStatus(
        "No pudimos enviar el formulario. Probá de nuevo o escribinos a contacto@emcasystem.com.ar.",
        "error",
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });

  /* Prellenado desde el configurador "Armá tu PC" -------------------------- */
  const pending = sessionStorage.getItem("emca-armado");
  if (pending) {
    sessionStorage.removeItem("emca-armado");
    const servicio = form.elements.namedItem("servicio");
    const mensaje = form.elements.namedItem("mensaje");
    if (servicio) servicio.value = "Armado de PC";
    if (mensaje) mensaje.value = pending;
    setTimeout(() => {
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
})();
