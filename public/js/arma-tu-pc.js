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

/* MODO 2: selección manual ------------------------------------------------- */
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
  
  let showStorage2 = false;

  function renderSelectors() {
    let html = '';
    
    html += '<h3 class="cfg-section-title">Componentes principales</h3>';
    
    let addedOptionalsTitle = false;

    CATEGORY_ORDER.forEach(cat => {
      const info = CATEGORY_INFO[cat];
      if (!info) return;

      if (!info.required && info.optional && !addedOptionalsTitle) {
        html += '<h3 class="cfg-section-title">Componentes opcionales</h3>';
        addedOptionalsTitle = true;
      }

      html += renderCategoryCard(cat, build[cat], info);

      if (cat === 'storage') {
        if (showStorage2) {
          const s2Info = { ...info, label: 'Almacenamiento secundario', required: false, optional: true };
          html += renderCategoryCard('storage2', build.storage2, s2Info, true);
        } else {
          html += `<button type="button" class="cfg-storage-add" id="btn-add-storage">+ Agregar almacenamiento secundario</button>`;
        }
      }
    });

    selectorsWrap.innerHTML = html;

    // Attach events
    const selects = selectorsWrap.querySelectorAll('.cfg-category__select');
    selects.forEach(select => {
      select.addEventListener('change', (e) => {
        const cat = e.target.dataset.cat;
        const val = e.target.value;
        const componentList = cat === 'storage2' ? PC_DB.storage : PC_DB[cat];
        
        const selectedComponent = val !== '' ? componentList[parseInt(val)] : null;
        updateBuild(cat, selectedComponent);
      });
    });

    const addStorageBtn = document.getElementById('btn-add-storage');
    if (addStorageBtn) {
      addStorageBtn.addEventListener('click', () => {
        showStorage2 = true;
        renderAll();
      });
    }

    const removeStorageBtn = document.getElementById('btn-remove-storage');
    if (removeStorageBtn) {
      removeStorageBtn.addEventListener('click', () => {
        showStorage2 = false;
        build.storage2 = null;
        renderAll();
      });
    }
  }

  function renderCategoryCard(cat, selectedComponent, info, isStorage2 = false) {
    const isOptional = info.optional || (!info.required && !isStorage2);
    const catClass = isOptional ? 'cfg-category cfg-category--optional' : 'cfg-category';
    
    let badge = '';
    if (selectedComponent) {
      badge = '<span class="cfg-category__badge cfg-category__badge--selected">Seleccionado</span>';
    } else if (info.required) {
      badge = '<span class="cfg-category__badge cfg-category__badge--empty">Requerido</span>';
    } else {
      badge = '<span class="cfg-category__badge cfg-category__badge--optional">Opcional</span>';
    }

    const dbCat = cat === 'storage2' ? 'storage' : cat;
    const options = getFilteredOptions(dbCat, build);
    
    let optionsHtml = '<option value="">— Elegí un componente —</option>';
    options.forEach(opt => {
      const idx = PC_DB[dbCat].indexOf(opt);
      const isSelected = selectedComponent && selectedComponent.id === opt.id;
      optionsHtml += `<option value="${idx}" ${isSelected ? 'selected' : ''}>${opt.name} · ${money(opt.price)}</option>`;
    });

    let detailsHtml = '';
    if (selectedComponent) {
      detailsHtml = `
        <div class="cfg-category__details">
          <div class="cfg-category__specs">
            ${getSpecsHtml(dbCat, selectedComponent)}
          </div>
          <div class="cfg-category__price">${money(selectedComponent.price)}</div>
        </div>
      `;
    }

    const headerExtra = isStorage2 ? `<button type="button" class="cfg-storage-remove" id="btn-remove-storage" aria-label="Quitar">✖</button>` : '';

    return `
      <div class="${catClass}">
        <div class="cfg-category__header">
          <span class="cfg-category__icon">${info.icon}</span>
          <span class="cfg-category__label">${info.label}</span>
          ${headerExtra}
          <div class="cfg-category__spacer"></div>
          ${badge}
        </div>
        <select class="cfg-category__select" data-cat="${cat}">
          ${optionsHtml}
        </select>
        ${detailsHtml}
      </div>
    `;
  }

  function getSpecsHtml(cat, comp) {
    const specs = [];
    if (cat === 'cpu') {
      specs.push(['Socket', comp.socket]);
      specs.push(['TDP', comp.tdp + 'W']);
      specs.push(['Gráficos', comp.hasIgpu ? 'Sí' : 'No']);
      specs.push(['Cooler inc.', comp.hasCooler ? 'Sí' : 'No']);
      specs.push(['RAM', comp.ramType]);
    } else if (cat === 'motherboard') {
      specs.push(['Socket', comp.socket]);
      specs.push(['Chipset', comp.chipset]);
      specs.push(['RAM', comp.ramType]);
      specs.push(['Formato', comp.formFactor]);
      specs.push(['M.2', comp.m2Slots]);
      specs.push(['WiFi', comp.hasWifi ? 'Sí' : 'No']);
    } else if (cat === 'ram') {
      specs.push(['Tipo', comp.type]);
      specs.push(['Velocidad', comp.speed + ' MHz']);
      specs.push(['Capacidad', comp.capacity + ' GB']);
      specs.push(['Módulos', comp.modules]);
    } else if (cat === 'gpu') {
      if (comp.id !== 'gpu-none') {
        specs.push(['TDP', comp.tdp + 'W']);
        specs.push(['Largo', comp.length + ' mm']);
        specs.push(['Conectores', comp.powerConnectors]);
      } else {
        specs.push(['Info', 'Sin placa de video dedicada']);
      }
    } else if (cat === 'storage') {
      specs.push(['Tipo', comp.storageType]);
      specs.push(['Capacidad', comp.capacity]);
      specs.push(['Interfaz', comp.interface]);
    } else if (cat === 'psu') {
      specs.push(['Potencia', comp.wattage + 'W']);
      specs.push(['Cert.', comp.certification]);
      specs.push(['Modular', comp.modular ? 'Sí' : 'No']);
    } else if (cat === 'pccase') {
      specs.push(['Formatos', comp.formFactors.join(', ')]);
      specs.push(['Max GPU', comp.maxGpuLength + ' mm']);
      specs.push(['Fans inc.', comp.includedFans]);
    } else if (cat === 'cooler') {
      if (comp.id !== 'cooler-stock') {
        specs.push(['Sockets', comp.sockets.join(', ')]);
        specs.push(['Max TDP', comp.maxTdp + 'W']);
        specs.push(['Tipo', comp.type]);
      } else {
        specs.push(['Info', 'Cooler de fábrica incluido con el procesador']);
      }
    } else if (cat === 'fans') {
      specs.push(['Tamaño', comp.size + ' mm']);
      specs.push(['Cantidad', comp.quantity]);
    } else if (cat === 'wifi') {
      specs.push(['Interfaz', comp.interface]);
      specs.push(['Info', comp.features]);
    } else if (cat === 'os') {
      specs.push(['Licencia', comp.type]);
    }

    return specs.map(([k, v]) => `
      <div class="cfg-spec">
        <span class="cfg-spec-label">${k}</span>
        <span class="cfg-spec-value">${v}</span>
      </div>
    `).join('');
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

    renderAll();
  }

  function renderSummary() {
    let html = '<h2>Tu configuración</h2>';
    
    let hasAny = false;
    CATEGORY_ORDER.forEach(cat => {
      const info = CATEGORY_INFO[cat];
      const comp = build[cat];
      if (comp) {
        hasAny = true;
        html += `
          <div class="sidebar__item">
            <div class="sidebar__item-info">
              <span class="sidebar__item-cat">${info.label}</span>
              <span class="sidebar__item-name">${comp.name}</span>
            </div>
            <span class="sidebar__item-price">${money(comp.price)}</span>
          </div>
        `;
      } else if (info.required) {
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

    if (build.storage2) {
      html += `
        <div class="sidebar__item">
          <div class="sidebar__item-info">
            <span class="sidebar__item-cat">Almacenamiento secundario</span>
            <span class="sidebar__item-name">${build.storage2.name}</span>
          </div>
          <span class="sidebar__item-price">${money(build.storage2.price)}</span>
        </div>
      `;
    }

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
    renderSelectors();
    renderSummary();
    renderCompat();
    renderTotal();
    
    // Update badge styling in selectors based on compat errors
    const { errors, warnings } = checkCompatibility(build);
    errors.forEach(err => {
      err.cats.forEach(cat => {
        if (cat === 'storage2' && !showStorage2) return;
        const sel = selectorsWrap.querySelector(`[data-cat="${cat}"]`);
        if (sel) {
          const badge = sel.parentElement.querySelector('.cfg-category__badge');
          if (badge) {
            badge.className = 'cfg-category__badge cfg-category__badge--error';
            badge.textContent = 'Error';
          }
        }
      });
    });
    warnings.forEach(warn => {
      warn.cats.forEach(cat => {
        if (cat === 'storage2' && !showStorage2) return;
        const sel = selectorsWrap.querySelector(`[data-cat="${cat}"]`);
        if (sel) {
          const badge = sel.parentElement.querySelector('.cfg-category__badge');
          // Only overwrite if it's not already an error
          if (badge && !badge.classList.contains('cfg-category__badge--error')) {
            badge.className = 'cfg-category__badge cfg-category__badge--warning';
            badge.textContent = 'Aviso';
          }
        }
      });
    });
  }

  btnConsultar.addEventListener('click', () => {
    let text = 'Hola, quiero consultar este armado que configuré:\\n\\n';
    CATEGORY_ORDER.forEach(cat => {
      if (build[cat]) {
        text += `- ${CATEGORY_INFO[cat].label}: ${build[cat].name}\\n`;
      }
    });
    if (build.storage2) {
      text += `- Almacenamiento secundario: ${build.storage2.name}\\n`;
    }
    
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
    showStorage2 = false;
    renderAll();
  });

  renderAll();
})();
