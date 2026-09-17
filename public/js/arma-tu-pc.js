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
      { name: "AMD Ryzen 5 5500", priceUsd: 99, price: 155000 },
      { name: "AMD Ryzen 5 7600", priceUsd: 221, price: 345000 },
      { name: "AMD Ryzen 7 7800X3D", priceUsd: 468, price: 730000 },
    ],
  },
  gpu: {
    label: "Placa de video (GPU)",
    niveles: [
      { name: "Gráficos integrados / Entrada básica", priceUsd: 58, price: 90000 },
      { name: "NVIDIA RTX 4060 8GB", priceUsd: 333, price: 520000 },
      { name: "NVIDIA RTX 5060 Ti 16GB", priceUsd: 481, price: 750000 },
    ],
  },
  ram: {
    label: "Memoria RAM",
    niveles: [
      { name: "8 GB DDR4 3200 MHz", priceUsd: 31, price: 48000 },
      { name: "16 GB DDR5 6000 MHz", priceUsd: 87, price: 135000 },
      { name: "32 GB DDR5 6000 MHz", priceUsd: 144, price: 225000 },
    ],
  },
  almacenamiento: {
    label: "Almacenamiento",
    niveles: [
      { name: "SSD 480 GB SATA", priceUsd: 42, price: 65000 },
      { name: "SSD NVMe 1 TB", priceUsd: 80, price: 125000 },
      { name: "SSD NVMe 2 TB", priceUsd: 163, price: 255000 },
    ],
  },
  motherboard: {
    label: "Motherboard",
    niveles: [
      { name: "A520M / H610M básica", priceUsd: 67, price: 105000 },
      { name: "B650M / B760M", priceUsd: 125, price: 195000 },
      { name: "B650M WiFi gama media-alta", priceUsd: 163, price: 255000 },
    ],
  },
  fuente: {
    label: "Fuente de alimentación",
    niveles: [
      { name: "550W 80 Plus Bronze", priceUsd: 50, price: 78000 },
      { name: "650W 80 Plus Bronze", priceUsd: 61, price: 95000 },
      { name: "850W 80 Plus Gold", priceUsd: 125, price: 195000 },
    ],
  },
  gabinete: {
    label: "Gabinete",
    niveles: [
      { name: "Gabinete Micro-ATX básico", priceUsd: 74, price: 115000 },
      { name: "Gabinete con mesh y coolers", priceUsd: 95, price: 148000 },
      { name: "Gabinete premium airflow", priceUsd: 144, price: 225000 },
    ],
  },
};

function updateComponentesPrices(rate) {
  if (typeof emcaCalcArs !== 'function') return;
  Object.keys(COMPONENTES).forEach(cat => {
    COMPONENTES[cat].niveles.forEach(niv => {
      if (typeof niv.priceUsd === 'number') {
        niv.price = emcaCalcArs(niv.priceUsd, rate);
      }
    });
  });
}

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

  window.addEventListener("emca:currency-updated", () => {
    if (result.querySelector(".panel__actions")) {
      form.dispatchEvent(new Event("submit"));
    }
  });
})();

/* MODO 2: selección manual (Wizard + Buscador) ---------------------------- */
(function initManual() {
  const selectorsWrap = document.getElementById("cfg-selectors");
  const summaryWrap = document.getElementById("cfg-summary");
  const compatWrap = document.getElementById("cfg-compat");
  const totalWrap = document.querySelector("#cfg-total .sidebar__price");
  const btnConsultar = document.getElementById("cfg-consultar");
  const btnReset = document.getElementById("cfg-reset");
  const rateBadge = document.getElementById("cfg-rate-badge");

  const searchInput = document.getElementById("cfg-search-input");
  const searchClearBtn = document.getElementById("cfg-search-clear");
  const filterBtns = document.querySelectorAll(".cfg-filter-btn");

  if (!selectorsWrap) return;

  function updateRateBadgeUI() {
    if (!rateBadge) return;
    const curr = (typeof EMCA_CURRENCY !== 'undefined') ? EMCA_CURRENCY : { rate: 1560, source: 'fallback' };
    const rate = curr.rate || 1560;
    const isLive = curr.source === 'dolarapi' || curr.source === 'criptoya';
    const sourceLabel = isLive ? 'Actualizado en vivo' : (curr.source === 'cache' ? 'En vivo (en caché)' : 'Referencia');
    rateBadge.innerHTML = `
      <span class="rate-dot ${isLive || curr.source === 'cache' ? 'rate-dot--live' : ''}"></span>
      <span class="rate-text">Dólar ref: <strong>$${money(rate).replace('$', '')}</strong> <small>(${sourceLabel})</small></span>
    `;
    rateBadge.title = `Precios en base a la cotización del dólar ($${money(rate).replace('$', '')} ARS).`;
  }

  window.addEventListener('emca:currency-updated', (e) => {
    const rate = e.detail?.rate;
    if (rate) {
      if (typeof updateComponentesPrices === 'function') {
        updateComponentesPrices(rate);
      }
      Object.keys(build).forEach(k => {
        if (build[k] && typeof build[k].priceUsd === 'number' && typeof emcaCalcArs === 'function') {
          build[k].price = emcaCalcArs(build[k].priceUsd, rate);
        }
      });
      updateRateBadgeUI();
      renderAll();
    }
  });

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
  let searchQuery = "";
  let selectedFilterCat = "all";

  function isSearchActive() {
    return searchQuery.trim().length > 0 || (selectedFilterCat !== "all" && searchQuery.trim().length > 0);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isComponentCompatible(cat, comp) {
    if (!comp) return true;
    const testBuild = { ...build };
    testBuild[cat] = comp;
    const { errors } = checkCompatibility(testBuild);
    return !errors.some(err => (err.cats || []).includes(cat));
  }

  function getComponentSpecs(cat, opt) {
    const dbCat = cat === 'storage2' ? 'storage' : cat;
    if (dbCat === 'cpu') return `${opt.socket} | ${opt.tdp}W | ${opt.hasIgpu ? 'Gráficos iGPU' : 'Sin iGPU'}`;
    if (dbCat === 'motherboard') return `${opt.socket} | ${opt.chipset} | ${opt.ramType} | ${opt.formFactor}`;
    if (dbCat === 'ram') return `${opt.type} ${opt.speed}MHz | ${opt.capacity}`;
    if (dbCat === 'gpu') return opt.id === 'gpu-none' ? 'Sin gráfica dedicada' : `${opt.tdp}W | ${opt.length}mm`;
    if (dbCat === 'storage') return `${opt.storageType} | ${opt.capacity} | ${opt.interface}`;
    if (dbCat === 'psu') return `${opt.wattage}W | ${opt.certification} | ${opt.modular}`;
    if (dbCat === 'pccase') return `${opt.formFactors ? opt.formFactors.join(', ') : ''} | Max GPU: ${opt.maxGpuLength}mm`;
    if (dbCat === 'cooler') return opt.id === 'cooler-stock' ? 'Cooler de fábrica' : `${opt.type} | TDP máx: ${opt.maxTdp}W`;
    if (dbCat === 'fans') return `${opt.size}mm | x${opt.quantity}`;
    if (dbCat === 'wifi') return `${opt.interface} | ${opt.features}`;
    if (dbCat === 'os') return `${opt.type}`;
    return '';
  }

  function renderComponentImage(opt, cat) {
    const dbCat = cat === 'storage2' ? 'storage' : cat;
    const catIcon = (typeof CATEGORY_INFO !== 'undefined' && CATEGORY_INFO[dbCat] && CATEGORY_INFO[dbCat].icon) || '📦';
    const hasImage = Boolean(opt.img && opt.img !== 'public/img/placeholder.jpg');
    if (hasImage) {
      return `<img src="${opt.img}" alt="${escapeHtml(opt.name)}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<span class=\\'product-card__placeholder\\'>${catIcon}</span>';" />`;
    }
    return `<span class="product-card__placeholder">${catIcon}</span>`;
  }

  function getTargetCategories(filter) {
    if (filter === "all") return CATEGORY_ORDER;
    if (filter === "extras") return ["fans", "wifi", "os"];
    return [filter];
  }

  function searchComponents() {
    const q = searchQuery.trim().toLowerCase();
    const normalizedQuery = q.replace(/(\d+)\s+(tb|gb|mhz|w)\b/gi, '$1$2');
    const tokens = normalizedQuery.length > 0 ? normalizedQuery.split(/\s+/).filter(Boolean) : [];
    const targetCats = getTargetCategories(selectedFilterCat);
    const results = [];

    targetCats.forEach(cat => {
      const list = PC_DB[cat] || [];
      list.forEach(item => {
        const info = CATEGORY_INFO[cat] || {};
        const name = item.name.toLowerCase();
        const searchableText = [
          item.name,
          item.id,
          info.label || '',
          item.socket || '',
          item.chipset || '',
          item.ramType || '',
          item.storageType || '',
          item.capacity || '',
          item.certification || '',
          item.type || '',
          item.interface || '',
          item.features || ''
        ].join(' ').toLowerCase();

        const matchesAll = tokens.length > 0 && tokens.every(tok => {
          if (/^\d$/.test(tok)) {
            return new RegExp('\\b' + tok + '\\b', 'i').test(name);
          }
          return searchableText.includes(tok);
        });

        if (matchesAll) {
          results.push({ cat, comp: item });
        }
      });
    });

    return results;
  }

  function renderSearchResults() {
    const results = searchComponents();
    let html = '';

    html += `
      <div class="search-results-header">
        <div>
          <span class="search-results-title">Resultados de búsqueda</span>
          <span class="search-results-count">${results.length} componente${results.length === 1 ? '' : 's'} encontrado${results.length === 1 ? '' : 's'} ${searchQuery.trim() ? `para "<strong>${escapeHtml(searchQuery.trim())}</strong>"` : ''}</span>
        </div>
        <button type="button" class="btn btn--outline" id="btn-exit-search">Volver al paso a paso</button>
      </div>
    `;

    if (results.length === 0) {
      html += `
        <div class="search-empty">
          <h4>No se encontraron componentes</h4>
          <p>No encontramos resultados con los criterios ingresados.</p>
          <p style="margin-top: 0.5rem; font-size: 0.85rem;">Probá buscando por marca (AMD, Intel, Kingston, Corsair), modelo (RTX, Ryzen, B550) o capacidad (1TB, 16GB).</p>
          <button type="button" class="btn btn--outline" id="btn-clear-search-empty" style="margin-top: 1rem;">Limpiar búsqueda</button>
        </div>
      `;
      selectorsWrap.innerHTML = html;

      document.getElementById("btn-exit-search")?.addEventListener("click", exitSearch);
      document.getElementById("btn-clear-search-empty")?.addEventListener("click", exitSearch);
      return;
    }

    html += '<div class="product-grid">';
    results.forEach(({ cat, comp }) => {
      const isSelected = (build[cat] && build[cat].id === comp.id) ||
                         (cat === 'storage' && build.storage2 && build.storage2.id === comp.id);
      const compatible = isComponentCompatible(cat, comp);
      const specsHtml = getComponentSpecs(cat, comp);
      const catInfo = CATEGORY_INFO[cat] || { label: cat, icon: '📦' };

      const compatBadge = compatible
        ? '<span class="product-card__badge product-card__badge--ok">✔ Compatible</span>'
        : '<span class="product-card__badge product-card__badge--error">✖ No compatible</span>';

      const btnHtml = isSelected
        ? `<button type="button" class="btn btn--primary btn--selected" data-action="toggle" data-cat="${cat}" data-id="${comp.id}">Seleccionado ✓</button>`
        : `<button type="button" class="btn btn--primary btn--select-search" data-action="select" data-cat="${cat}" data-id="${comp.id}">Seleccionar</button>`;

      html += `
        <div class="product-card product-card--${compatible ? 'ok' : 'error'} ${isSelected ? 'product-card--selected' : ''}">
          <div class="product-card__img">
            ${renderComponentImage(comp, cat)}
          </div>
          <div class="product-card__info">
            <span class="product-card__cat-tag">${catInfo.icon} ${catInfo.label}</span>
            <div class="product-card__name">${escapeHtml(comp.name)}</div>
            <div class="product-card__specs">${specsHtml}</div>
            ${compatBadge}
            <div class="product-card__price">${money(comp.price)}</div>
          </div>
          ${btnHtml}
        </div>
      `;
    });
    html += '</div>';

    selectorsWrap.innerHTML = html;

    document.getElementById("btn-exit-search")?.addEventListener("click", exitSearch);

    const actionBtns = selectorsWrap.querySelectorAll('[data-action]');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const cat = btn.dataset.cat;
        const id = btn.dataset.id;
        const comp = (PC_DB[cat] || []).find(c => c.id === id);

        if (action === 'select' && comp) {
          updateBuild(cat, comp);
        } else if (action === 'toggle' && comp) {
          updateBuild(cat, null);
        }
        renderAll();
      });
    });
  }

  function renderWizard() {
    let html = '';
    
    // Steps indicator (ahora clickeables para saltar directo a cualquier categoría)
    html += '<div class="wizard-steps">';
    steps.forEach((step, idx) => {
      let info = CATEGORY_INFO[step];
      if (step === 'storage2') info = { label: 'Almacenamiento 2' };
      if (!info) return;
      
      let className = 'wizard-step';
      if (idx === currentStepIndex) className += ' wizard-step--active';
      else if (build[step]) className += ' wizard-step--completed';
      
      html += `<button type="button" class="${className}" data-step-idx="${idx}" title="Ir a ${info.label}">${info.label}</button>`;
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
        ${info.note ? `<span style="font-size: 0.85rem; color: var(--text-muted);">${info.note}</span>` : ''}
      </div>
    `;

    // Product Grid
    html += '<div class="product-grid">';
    
    const dbCat = isStorage2 ? 'storage' : currentCategory;
    const options = PC_DB[dbCat] || [];
    
    options.forEach(opt => {
      const idx = PC_DB[dbCat].indexOf(opt);
      const isSelected = build[currentCategory] && build[currentCategory].id === opt.id;
      const compatible = isComponentCompatible(currentCategory, opt);
      const specsHtml = getComponentSpecs(currentCategory, opt);

      const compatBadge = compatible
        ? '<span class="product-card__badge product-card__badge--ok">✔ Compatible</span>'
        : '<span class="product-card__badge product-card__badge--error">✖ No compatible</span>';

      const btnHtml = isSelected
        ? `<button type="button" class="btn btn--primary btn--selected" data-cat="${currentCategory}" data-idx="${idx}">Seleccionado ✓</button>`
        : `<button type="button" class="btn btn--primary btn--select" data-cat="${currentCategory}" data-idx="${idx}">Seleccionar</button>`;

      html += `
        <div class="product-card product-card--${compatible ? 'ok' : 'error'} ${isSelected ? 'product-card--selected' : ''}">
          <div class="product-card__img">
            ${renderComponentImage(opt, currentCategory)}
          </div>
          <div class="product-card__info">
            <div class="product-card__name">${escapeHtml(opt.name)}</div>
            <div class="product-card__specs">${specsHtml}</div>
            ${compatBadge}
            <div class="product-card__price">${money(opt.price)}</div>
          </div>
          ${btnHtml}
        </div>
      `;
    });
    
    // Add "Ninguno" option if optional
    if (!info.required) {
      const isNone = build[currentCategory] === null;
      html += `
        <div class="product-card">
          <div class="product-card__img">
            <span class="product-card__placeholder">🚫</span>
          </div>
          <div class="product-card__info">
            <div class="product-card__name">Ninguno / Saltar</div>
            <div class="product-card__specs">No agregar este componente</div>
            <div class="product-card__price">$0</div>
          </div>
          <button type="button" class="btn btn--outline btn--select" data-cat="${currentCategory}" data-idx="-1">${isNone ? 'Sin componente' : 'Quitar / Saltar'}</button>
        </div>
      `;
    }

    html += '</div>'; // close product-grid

    // Nav
    html += '<div class="wizard-nav">';
    if (currentStepIndex > 0) {
      html += `<button type="button" class="btn btn--outline" id="btn-prev">Volver atrás</button>`;
    } else {
      html += `<div></div>`;
    }
    
    if (!info.required) {
      html += `<button type="button" class="btn btn--outline" id="btn-skip">Saltar paso</button>`;
    } else {
      html += `<div></div>`;
    }
    html += '</div>';

    selectorsWrap.innerHTML = html;

    // Events
    selectorsWrap.querySelectorAll('.wizard-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.dataset.stepIdx, 10);
        if (!isNaN(targetIdx) && targetIdx !== currentStepIndex) {
          currentStepIndex = targetIdx;
          renderAll();
        }
      });
    });

    const selectBtns = selectorsWrap.querySelectorAll('.btn--select');
    selectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.target.dataset.cat;
        const val = parseInt(e.target.dataset.idx, 10);
        
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
    if (component && typeof component.priceUsd === 'number' && typeof emcaCalcArs === 'function') {
      const currentRate = (typeof EMCA_CURRENCY !== 'undefined' && EMCA_CURRENCY.rate) ? EMCA_CURRENCY.rate : 1560;
      component.price = emcaCalcArs(component.priceUsd, currentRate);
    }
    build[cat] = component;

    if (cat === 'cpu' && component) {
      if (build.motherboard && build.motherboard.socket !== component.socket) {
        build.motherboard = null;
      }
      if (build.ram && build.motherboard && build.motherboard.ramType !== build.ram.type) {
        build.ram = null;
      }
    } else if (cat === 'motherboard' && component) {
      if (build.cpu && build.cpu.socket !== component.socket) {
        build.cpu = null;
      }
      if (build.ram && build.ram.type !== component.ramType) {
        build.ram = null;
      }
    }
  }

  function renderSummary() {
    let html = '<h2>Tu configuración</h2>';

    const { errors } = checkCompatibility(build);
    const badCats = new Set();
    errors.forEach(err => (err.cats || []).forEach(c => badCats.add(c)));

    let hasAny = false;
    steps.forEach((cat, idx) => {
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
          <div class="sidebar__item" style="cursor: pointer;" data-jump-step="${idx}" title="Hacer clic para editar ${info.label}">
            <div class="sidebar__item-info">
              <span class="sidebar__item-cat">${info.label} ✎</span>
              <span class="sidebar__item-name">${escapeHtml(comp.name)}</span>
              ${badge}
            </div>
            <span class="sidebar__item-price">${money(comp.price)}</span>
          </div>
        `;
      } else if (info && info.required) {
        html += `
          <div class="sidebar__item" style="cursor: pointer;" data-jump-step="${idx}" title="Hacer clic para elegir ${info.label}">
            <div class="sidebar__item-info">
              <span class="sidebar__item-cat">${info.label}</span>
              <span class="sidebar__item-name" style="color: var(--text-muted)">— Elegir —</span>
            </div>
            <span class="sidebar__item-price"></span>
          </div>
        `;
      }
    });

    if (!hasAny) {
      html += '<p class="sidebar__empty">Empezá eligiendo un procesador o buscando componentes.</p>';
    }

    summaryWrap.innerHTML = html;

    summaryWrap.querySelectorAll('[data-jump-step]').forEach(item => {
      item.addEventListener('click', () => {
        const stepIdx = parseInt(item.dataset.jumpStep, 10);
        if (!isNaN(stepIdx)) {
          exitSearch();
          currentStepIndex = stepIdx;
          renderAll();
        }
      });
    });
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
        html += `<div class="compat-item compat-item--error">✖ ${escapeHtml(err.msg)}</div>`;
      });
    }

    if (warnings.length > 0) {
      if (errors.length === 0) {
        html += `<div class="compat-status compat-status--warning">⚠️ Atención</div>`;
      }
      warnings.forEach(warn => {
        html += `<div class="compat-item compat-item--warning">⚠ ${escapeHtml(warn.msg)}</div>`;
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

    const isComplete = checkCompatibility(build).isValid && build.cpu;
    btnConsultar.disabled = !isComplete;
  }

  function updateFilterButtonsUI() {
    filterBtns.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.cat === selectedFilterCat);
    });
  }

  function exitSearch() {
    searchQuery = "";
    if (searchInput) searchInput.value = "";
    if (searchClearBtn) searchClearBtn.hidden = true;
    selectedFilterCat = "all";
    updateFilterButtonsUI();
    renderAll();
  }

  function renderSelectors() {
    if (isSearchActive()) {
      renderSearchResults();
    } else {
      renderWizard();
    }
  }

  function renderAll() {
    updateRateBadgeUI();
    renderSelectors();
    renderSummary();
    renderCompat();
    renderTotal();
  }

  // Eventos del buscador y filtros
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value;
      if (searchClearBtn) {
        searchClearBtn.hidden = searchQuery.trim().length === 0;
      }
      renderSelectors();
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        exitSearch();
      }
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      exitSearch();
      searchInput?.focus();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      selectedFilterCat = cat;
      updateFilterButtonsUI();

      if (searchQuery.trim().length === 0) {
        if (cat === "all") {
          renderAll();
        } else if (cat === "extras") {
          currentStepIndex = steps.indexOf("fans");
          renderAll();
        } else {
          const stepIdx = steps.indexOf(cat);
          if (stepIdx !== -1) {
            currentStepIndex = stepIdx;
          }
          renderAll();
        }
      } else {
        renderSelectors();
      }
    });
  });

  btnConsultar.addEventListener('click', () => {
    let text = 'Hola, quiero consultar este armado que configuré:\n\n';
    steps.forEach(cat => {
      if (build[cat]) {
        let label = cat === 'storage2' ? 'Almacenamiento secundario' : CATEGORY_INFO[cat].label;
        text += `- ${label}: ${build[cat].name}\n`;
      }
    });
    
    let total = 0;
    Object.values(build).forEach(comp => {
      if (comp) total += comp.price;
    });
    text += `\nTotal estimado: ${money(total)}`;

    sessionStorage.setItem('emca-armado', text);
    window.location.href = 'index.html#contacto';
  });

  btnReset.addEventListener('click', () => {
    Object.keys(build).forEach(k => build[k] = null);
    currentStepIndex = 0;
    exitSearch();
  });

  renderAll();
})();

