/* =============================================================================
   EMCA System - Configurador "Armá tu PC"
   ========================================================================== */

/* -----------------------------------------------------------------------
   DATOS DE EJEMPLO — REEMPLAZAR POR PRODUCTOS Y PRECIOS REALES
   Cada categoría tiene 3 niveles: 0 = económico, 1 = medio, 2 = alto.
   Los precios están en pesos argentinos (ARS).
   Para actualizar: cambiar "name" y "price" de cada nivel.
   ----------------------------------------------------------------------- */
const COMPONENTES = {
  cpu: {
    label: "Procesador (CPU)",
    niveles: [
      { name: "AMD Ryzen 5 5500 (ejemplo)", price: 150000 },
      { name: "AMD Ryzen 5 7600 (ejemplo)", price: 300000 },
      { name: "AMD Ryzen 7 7800X3D (ejemplo)", price: 620000 },
    ],
  },
  gpu: {
    label: "Placa de video (GPU)",
    niveles: [
      { name: "Gráficos integrados / GT 1030 (ejemplo)", price: 90000 },
      { name: "NVIDIA RTX 4060 8GB (ejemplo)", price: 480000 },
      { name: "NVIDIA RTX 4070 Super 12GB (ejemplo)", price: 950000 },
    ],
  },
  ram: {
    label: "Memoria RAM",
    niveles: [
      { name: "8 GB DDR4 3200 MHz (ejemplo)", price: 45000 },
      { name: "16 GB DDR5 5600 MHz (ejemplo)", price: 110000 },
      { name: "32 GB DDR5 6000 MHz (ejemplo)", price: 230000 },
    ],
  },
  almacenamiento: {
    label: "Almacenamiento",
    niveles: [
      { name: "SSD 480 GB SATA (ejemplo)", price: 45000 },
      { name: "SSD NVMe 1 TB (ejemplo)", price: 110000 },
      { name: "SSD NVMe 2 TB + HDD 2 TB (ejemplo)", price: 290000 },
    ],
  },
  motherboard: {
    label: "Motherboard",
    niveles: [
      { name: "A520M básica (ejemplo)", price: 90000 },
      { name: "B650M DDR5 (ejemplo)", price: 190000 },
      { name: "X670 gama alta (ejemplo)", price: 400000 },
    ],
  },
  fuente: {
    label: "Fuente de alimentación",
    niveles: [
      { name: "500W genérica certificada (ejemplo)", price: 55000 },
      { name: "650W 80 Plus Bronze (ejemplo)", price: 110000 },
      { name: "850W 80 Plus Gold (ejemplo)", price: 220000 },
    ],
  },
  gabinete: {
    label: "Gabinete",
    niveles: [
      { name: "Gabinete ATX básico (ejemplo)", price: 45000 },
      { name: "Gabinete ATX con 3 fans (ejemplo)", price: 90000 },
      { name: "Gabinete premium con airflow (ejemplo)", price: 180000 },
    ],
  },
};

const CATEGORIAS = Object.keys(COMPONENTES);

/* -----------------------------------------------------------------------
   USOS Y PESOS (1 = poco prioritario, 5 = muy prioritario)
   Se usan para subir o bajar el nivel de cada categoría respecto del nivel
   base que define el presupuesto.
   ----------------------------------------------------------------------- */
const USOS = {
  gaming: {
    label: "Gaming",
    pesos: { cpu: 4, gpu: 5, ram: 3, almacenamiento: 3, motherboard: 3, fuente: 4, gabinete: 3 },
  },
  oficina: {
    label: "Oficina / estudio",
    pesos: { cpu: 3, gpu: 1, ram: 3, almacenamiento: 4, motherboard: 2, fuente: 2, gabinete: 2 },
  },
  diseno: {
    label: "Diseño gráfico",
    pesos: { cpu: 4, gpu: 4, ram: 5, almacenamiento: 4, motherboard: 3, fuente: 3, gabinete: 2 },
  },
  edicion: {
    label: "Edición de video",
    pesos: { cpu: 5, gpu: 4, ram: 5, almacenamiento: 5, motherboard: 3, fuente: 3, gabinete: 2 },
  },
  streaming: {
    label: "Streaming",
    pesos: { cpu: 5, gpu: 4, ram: 4, almacenamiento: 3, motherboard: 3, fuente: 4, gabinete: 3 },
  },
  general: {
    label: "Uso general",
    pesos: { cpu: 3, gpu: 2, ram: 3, almacenamiento: 3, motherboard: 3, fuente: 3, gabinete: 3 },
  },
};

/* Utilidades --------------------------------------------------------------- */
const money = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(n);

function totalDeNivel(nivel) {
  return CATEGORIAS.reduce((sum, cat) => sum + COMPONENTES[cat].niveles[nivel].price, 0);
}

const clamp = (n) => Math.max(0, Math.min(2, n));

/* -----------------------------------------------------------------------
   Lógica de recomendación:
   1. El presupuesto define un nivel base (el nivel más alto que entra).
   2. Las categorías con mayor peso para ese uso suben un nivel; las de menor
      peso bajan un nivel (comparando contra el peso promedio del uso).
   3. Si el total se pasa del presupuesto, se bajan primero las categorías
      menos prioritarias hasta acercarse.
   ----------------------------------------------------------------------- */
function recomendarArmado(usoKey, presupuesto) {
  const pesos = USOS[usoKey].pesos;

  let base = 0;
  if (presupuesto >= totalDeNivel(2)) base = 2;
  else if (presupuesto >= totalDeNivel(1)) base = 1;

  const promedio =
    CATEGORIAS.reduce((s, c) => s + pesos[c], 0) / CATEGORIAS.length;

  const seleccion = {};
  CATEGORIAS.forEach((cat) => {
    let nivel = base;
    if (pesos[cat] >= promedio + 1) nivel = clamp(base + 1);
    else if (pesos[cat] <= promedio - 1) nivel = clamp(base - 1);
    seleccion[cat] = nivel;
  });

  const total = () =>
    CATEGORIAS.reduce((s, c) => s + COMPONENTES[c].niveles[seleccion[c]].price, 0);

  // Ajuste a la baja: se degrada primero lo menos prioritario.
  const ordenBaja = [...CATEGORIAS].sort((a, b) => pesos[a] - pesos[b]);
  let guard = 0;
  while (total() > presupuesto && guard < 30) {
    const candidato = ordenBaja.find((c) => seleccion[c] > 0);
    if (!candidato) break;
    seleccion[candidato] -= 1;
    guard++;
  }

  // Ajuste a la suba: si sobra plata, se mejora lo más prioritario.
  const ordenSuba = [...CATEGORIAS].sort((a, b) => pesos[b] - pesos[a]);
  guard = 0;
  let mejoró = true;
  while (mejoró && guard < 30) {
    mejoró = false;
    for (const cat of ordenSuba) {
      if (seleccion[cat] >= 2) continue;
      const delta =
        COMPONENTES[cat].niveles[seleccion[cat] + 1].price -
        COMPONENTES[cat].niveles[seleccion[cat]].price;
      if (total() + delta <= presupuesto) {
        seleccion[cat] += 1;
        mejoró = true;
        guard++;
        break;
      }
    }
  }

  return seleccion;
}

/* Render compartido -------------------------------------------------------- */
const NOMBRE_NIVEL = ["Económico", "Medio", "Alto"];

function renderArmado(seleccion, { presupuesto } = {}) {
  const items = CATEGORIAS.map((cat) => {
    const nivel = seleccion[cat];
    const pieza = COMPONENTES[cat].niveles[nivel];
    return `
      <li class="build-item">
        <div>
          <p class="build-item__cat">${COMPONENTES[cat].label}</p>
          <p class="build-item__name">${pieza.name}</p>
          <p class="build-item__tier">Nivel ${NOMBRE_NIVEL[nivel].toLowerCase()}</p>
        </div>
        <p class="build-item__price">${money(pieza.price)}</p>
      </li>`;
  }).join("");

  const total = CATEGORIAS.reduce(
    (s, c) => s + COMPONENTES[c].niveles[seleccion[c]].price,
    0,
  );

  let diffHtml = "";
  if (typeof presupuesto === "number" && presupuesto > 0) {
    const diff = presupuesto - total;
    diffHtml = `
      <div class="totals__row">
        <span>Tu presupuesto</span><span>${money(presupuesto)}</span>
      </div>
      <div class="totals__row">
        <span>Diferencia</span>
        <span class="${diff >= 0 ? "diff--under" : "diff--over"}">
          ${diff >= 0 ? `Te sobran ${money(diff)}` : `Te faltan ${money(Math.abs(diff))}`}
        </span>
      </div>`;
  }

  return `
    <ul class="build-list">${items}</ul>
    <div class="totals">
      <div class="totals__row totals__row--main"><span>Total estimado</span><span>${money(total)}</span></div>
      ${diffHtml}
    </div>
    <p class="build-item__tier" style="margin-top:1rem">
      Precios orientativos de ejemplo. Se confirman en el diagnóstico.
    </p>`;
}

function textoConsulta(seleccion, titulo) {
  const lineas = CATEGORIAS.map(
    (cat) => `- ${COMPONENTES[cat].label}: ${COMPONENTES[cat].niveles[seleccion[cat]].name}`,
  );
  const total = CATEGORIAS.reduce(
    (s, c) => s + COMPONENTES[c].niveles[seleccion[c]].price,
    0,
  );
  return `${titulo}\n${lineas.join("\n")}\nTotal estimado: ${money(total)}`;
}

function irAContacto(seleccion, titulo) {
  sessionStorage.setItem("emca-armado", textoConsulta(seleccion, titulo));
  window.location.href = "index.html#contacto";
}

/* Tabs --------------------------------------------------------------------- */
(function initTabs() {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;

  function activar(tab) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
    tab.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activar(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") activar(tabs[(i + 1) % tabs.length]);
      if (e.key === "ArrowLeft") activar(tabs[(i - 1 + tabs.length) % tabs.length]);
    });
  });
})();

/* MODO 1: recomendación ---------------------------------------------------- */
(function initAuto() {
  const usesList = document.getElementById("uses-list");
  const form = document.getElementById("auto-form");
  const result = document.getElementById("auto-result");
  if (!usesList || !form || !result) return;

  usesList.innerHTML = Object.entries(USOS)
    .map(
      ([key, uso], i) => `
      <label class="use-option">
        <input type="radio" name="uso" value="${key}" ${i === 0 ? "checked" : ""} />
        <span>${uso.label}</span>
      </label>`,
    )
    .join("");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const uso = form.elements.namedItem("uso").value;
    const presupuesto = Number(form.elements.namedItem("presupuesto").value);
    const errorEl = document.getElementById("error-presupuesto");

    if (!presupuesto || presupuesto < 150000) {
      errorEl.textContent = "Ingresá un presupuesto de al menos $150.000.";
      return;
    }
    errorEl.textContent = "";

    const seleccion = recomendarArmado(uso, presupuesto);
    result.innerHTML = `
      <h2>Tu armado recomendado — ${USOS[uso].label}</h2>
      ${renderArmado(seleccion, { presupuesto })}
      <div class="panel__actions">
        <button class="btn btn--primary" type="button" id="auto-consultar">
          Consultar este armado
        </button>
      </div>`;

    document.getElementById("auto-consultar").addEventListener("click", () => {
      irAContacto(seleccion, `Hola, quiero consultar este armado (${USOS[uso].label}):`);
    });
  });
})();

/* MODO 2: selección manual (Wizard) ---------------------------------------- */
(function initManual() {
  const selectorsWrap = document.getElementById("cfg-selectors");
  const summaryWrap = document.getElementById("cfg-summary");
  const compatWrap = document.getElementById("cfg-compat");
  const totalWrap = document.querySelector("#cfg-total .sidebar__price");
  const btnConsultar = document.getElementById("cfg-consultar");
  const btnReset = document.getElementById("cfg-reset");

  if (!selectorsWrap) return;

  const build = {
    cpu: null, motherboard: null, ram: null, gpu: null,
    storage: null, storage2: null, psu: null, pccase: null,
    cooler: null, fans: null, wifi: null, os: null
  };
  
  const steps = [...CATEGORY_ORDER];
  const storageIdx = steps.indexOf('storage');
  if (storageIdx !== -1) {
    steps.splice(storageIdx + 1, 0, 'storage2');
  }
  let currentStepIndex = 0;

  function isComponentCompatible(cat, comp) {
    if (!comp) return true;
    const testBuild = { ...build };
    testBuild[cat] = comp;
    const { errors } = checkCompatibility(testBuild);
    return !errors.some(err => (err.cats || []).includes(cat));
  }

  function renderWizard() {
    let html = '';
    
    // Steps indicator
    html += '<div class="wizard-steps">';
    steps.forEach((step, idx) => {
      let info = CATEGORY_INFO[step];
      if (step === 'storage2') info = { label: 'Almacenamiento 2' };
      if (!info) return; // fail-safe
      
      let className = 'wizard-step';
      if (idx === currentStepIndex) className += ' wizard-step--active';
      else if (build[step]) className += ' wizard-step--completed';
      
      html += `<div class="${className}">${info.label}</div>`;
    });
    html += '</div>';

    const currentCategory = steps[currentStepIndex];
    let info = CATEGORY_INFO[currentCategory];
    let isStorage2 = false;
    if (currentCategory === 'storage2') {
      info = { ...CATEGORY_INFO['storage'], label: 'Almacenamiento secundario', required: false, optional: true };
      isStorage2 = true;
    }

    html += `
      <div class="wizard-header">
        <h3>${info.label}</h3>
      </div>
    `;

    // Product Grid
    html += '<div class="product-grid">';
    
    const dbCat = isStorage2 ? 'storage' : currentCategory;
    const options = PC_DB[dbCat] || [];
    
    options.forEach(opt => {
      const idx = PC_DB[dbCat].indexOf(opt);
      const compatible = isComponentCompatible(currentCategory, opt);
      let specsHtml = '';
      if (dbCat === 'cpu') specsHtml = `${opt.socket} | ${opt.tdp}W`;
      else if (dbCat === 'motherboard') specsHtml = `${opt.socket} | ${opt.chipset}`;
      else if (dbCat === 'ram') specsHtml = `${opt.type} ${opt.speed}MHz`;
      else if (dbCat === 'gpu') specsHtml = opt.id === 'gpu-none' ? 'Sin gráfica dedicada' : `${opt.tdp}W`;
      else if (dbCat === 'storage') specsHtml = `${opt.storageType} ${opt.capacity}`;
      else if (dbCat === 'psu') specsHtml = `${opt.wattage}W ${opt.certification}`;
      else if (dbCat === 'pccase') specsHtml = `${opt.formFactors ? opt.formFactors.join(', ') : ''}`;
      else if (dbCat === 'cooler') specsHtml = opt.id === 'cooler-stock' ? 'Cooler de fábrica' : `${opt.type}`;
      else if (dbCat === 'fans') specsHtml = `${opt.size}mm x${opt.quantity}`;
      else if (dbCat === 'wifi') specsHtml = `${opt.interface}`;
      else if (dbCat === 'os') specsHtml = `${opt.type}`;

      const compatBadge = compatible
        ? '<span class="product-card__badge product-card__badge--ok">✔ Compatible</span>'
        : '<span class="product-card__badge product-card__badge--error">✖ No compatible</span>';
      
      html += `
        <div class="product-card product-card--${compatible ? 'ok' : 'error'}">
          <div class="product-card__img">
            <img src="${opt.img || ''}" alt="${opt.name}" onerror="this.style.display='none'" />
          </div>
          <div class="product-card__info">
            <div class="product-card__name">${opt.name}</div>
            <div class="product-card__specs">${specsHtml}</div>
            ${compatBadge}
            <div class="product-card__price">${money(opt.price)}</div>
          </div>
          <button class="btn btn--primary btn--select" data-cat="${currentCategory}" data-idx="${idx}">Seleccionar</button>
        </div>
      `;
    });
    
    // Add "Ninguno" option if optional
    if (!info.required) {
       html += `
        <div class="product-card">
          <div class="product-card__img">
          </div>
          <div class="product-card__info">
            <div class="product-card__name">Ninguno / Saltar</div>
            <div class="product-card__specs">No agregar este componente</div>
            <div class="product-card__price">$0</div>
          </div>
          <button class="btn btn--outline btn--select" data-cat="${currentCategory}" data-idx="-1">Saltar paso</button>
        </div>
      `;
    }

    html += '</div>'; // close product-grid

    // Nav
    html += '<div class="wizard-nav">';
    if (currentStepIndex > 0) {
      html += `<button class="btn btn--outline" id="btn-prev">Volver atrás</button>`;
    } else {
      html += `<div></div>`;
    }
    
    if (!info.required) {
      html += `<button class="btn btn--outline" id="btn-skip">Saltar paso</button>`;
    } else {
      html += `<div></div>`;
    }
    html += '</div>';

    selectorsWrap.innerHTML = html;

    // Events
    const selectBtns = selectorsWrap.querySelectorAll('.btn--select');
    selectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.target.dataset.cat;
        const val = parseInt(e.target.dataset.idx);
        
        const dbC = cat === 'storage2' ? 'storage' : cat;
        const selectedComponent = val >= 0 ? PC_DB[dbC][val] : null;
        
        updateBuild(cat, selectedComponent);
        if (currentStepIndex < steps.length - 1) {
          currentStepIndex++;
        }
        renderAll();
      });
    });

    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentStepIndex > 0) {
          currentStepIndex--;
          renderAll();
        }
      });
    }

    const btnSkip = document.getElementById('btn-skip');
    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        updateBuild(currentCategory, null);
        if (currentStepIndex < steps.length - 1) {
          currentStepIndex++;
          renderAll();
        }
      });
    }
  }

  function updateBuild(cat, component) {
    build[cat] = component;

    if (cat === 'cpu') {
      build.motherboard = null;
      build.ram = null;
      build.cooler = null;
    } else if (cat === 'motherboard') {
      build.ram = null;
    }
  }

  function renderSummary() {
    let html = '<h2>Tu configuración</h2>';

    const { errors } = checkCompatibility(build);
    const badCats = new Set();
    errors.forEach(err => (err.cats || []).forEach(c => badCats.add(c)));

    let hasAny = false;
    steps.forEach(cat => {
      let info = CATEGORY_INFO[cat];
      if (cat === 'storage2') info = { label: 'Almacenamiento sec.' };
      if (!info) return;
      
      const comp = build[cat];
      if (comp) {
        hasAny = true;
        const incompatible = badCats.has(cat);
        const badge = incompatible
          ? '<span class="sidebar__badge sidebar__badge--error" aria-label="No compatible">✖ No compatible</span>'
          : '<span class="sidebar__badge sidebar__badge--ok" aria-label="Compatible">✔ Compatible</span>';
        html += `
          <div class="sidebar__item">
            <div class="sidebar__item-info">
              <span class="sidebar__item-cat">${info.label}</span>
              <span class="sidebar__item-name">${comp.name}</span>
              ${badge}
            </div>
            <span class="sidebar__item-price">${money(comp.price)}</span>
          </div>
        `;
      } else if (info && info.required) {
        html += `
          <div class="sidebar__item">
            <div class="sidebar__item-info">
              <span class="sidebar__item-cat">${info.label}</span>
              <span class="sidebar__item-name" style="color: var(--text-muted)">—</span>
            </div>
            <span class="sidebar__item-price"></span>
          </div>
        `;
      }
    });

    if (!hasAny) {
      html += '<p class="sidebar__empty">Empezá eligiendo un procesador.</p>';
    }

    summaryWrap.innerHTML = html;
  }

  function renderCompat() {
    const hasAnyComp = Object.values(build).some(c => c !== null);
    if (!hasAnyComp) {
      compatWrap.innerHTML = '';
      return;
    }

    const { errors, warnings, isValid } = checkCompatibility(build);
    let html = '';

    if (errors.length > 0) {
      html += `<div class="compat-status compat-status--error">❌ Incompatible</div>`;
      errors.forEach(err => {
        html += `<div class="compat-item compat-item--error">✖ ${err.msg}</div>`;
      });
    }

    if (warnings.length > 0) {
      if (errors.length === 0) {
        html += `<div class="compat-status compat-status--warning">⚠️ Atención</div>`;
      }
      warnings.forEach(warn => {
        html += `<div class="compat-item compat-item--warning">⚠ ${warn.msg}</div>`;
      });
    }

    if (isValid && errors.length === 0 && warnings.length === 0 && build.cpu) {
      html += `<div class="compat-status compat-status--ok">✅ Todo compatible</div>`;
    }

    // Wattage
    if (build.cpu || build.gpu) {
      const watts = estimatePowerConsumption(build);
      html += `<div class="sidebar__wattage">Consumo estimado: <strong>${watts}W</strong></div>`;
    }

    compatWrap.innerHTML = html;
  }

  function renderTotal() {
    let total = 0;
    Object.values(build).forEach(comp => {
      if (comp) total += comp.price;
    });
    totalWrap.textContent = money(total);

    const isComplete = checkCompatibility(build).isValid;
    btnConsultar.disabled = !isComplete;
  }

  function renderAll() {
    renderWizard();
    renderSummary();
    renderCompat();
    renderTotal();
  }

  btnConsultar.addEventListener('click', () => {
    let text = 'Hola, quiero consultar este armado que configuré:\\n\\n';
    steps.forEach(cat => {
      if (build[cat]) {
        let label = cat === 'storage2' ? 'Almacenamiento secundario' : CATEGORY_INFO[cat].label;
        text += `- ${label}: ${build[cat].name}\\n`;
      }
    });
    
    let total = 0;
    Object.values(build).forEach(comp => {
      if (comp) total += comp.price;
    });
    text += `\\nTotal estimado: ${money(total)}`;

    sessionStorage.setItem('emca-armado', text);
    window.location.href = 'index.html#contacto';
  });

  btnReset.addEventListener('click', () => {
    Object.keys(build).forEach(k => build[k] = null);
    currentStepIndex = 0;
    renderAll();
  });

  renderAll();
})();

