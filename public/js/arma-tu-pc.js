/* Configurador manual y navegación entre modos. */
const money = (n) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

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
    if (typeof window.updateMobileBarVisibility === 'function') {
      window.updateMobileBarVisibility();
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activar(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") activar(tabs[(i + 1) % tabs.length]);
      if (e.key === "ArrowLeft") activar(tabs[(i - 1 + tabs.length) % tabs.length]);
    });
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

  // Elementos de la barra flotante y drawer móvil
  const mobileBar = document.getElementById("cfg-mobile-bar");
  const mobileTotal = document.getElementById("cfg-mobile-total");
  const mobileCount = document.getElementById("cfg-mobile-count");
  const btnOpenSummary = document.getElementById("cfg-mobile-open-summary");
  const drawerBackdrop = document.getElementById("cfg-drawer-backdrop");
  const drawer = document.getElementById("cfg-drawer");
  const drawerCloseBtn = document.getElementById("cfg-drawer-close");
  const drawerHandle = document.getElementById("cfg-drawer-handle");
  const drawerBody = document.getElementById("cfg-drawer-body");
  const drawerTotal = document.getElementById("cfg-drawer-total");
  const drawerCount = document.getElementById("cfg-drawer-count");
  const drawerConsultar = document.getElementById("cfg-drawer-consultar");
  const drawerReset = document.getElementById("cfg-drawer-reset");

  if (!selectorsWrap) return;

  function updateRateBadgeUI() {
    if (typeof emcaUpdateBadgeUI === 'function') {
      emcaUpdateBadgeUI();
      return;
    }
    if (!rateBadge) return;
    const curr = (typeof EMCA_CURRENCY !== 'undefined') ? EMCA_CURRENCY : { rate: 1555, source: 'fallback' };
    const rate = curr.rate || 1555;
    const isLive = curr.source === 'dolarapi' || curr.source === 'criptoya';
    const isCache = curr.source === 'cache';
    const sourceLabel = isLive ? 'Actualizado en vivo' : (isCache ? 'En vivo (en caché)' : 'Referencia');
    const formattedRate = Number(rate).toLocaleString('es-AR');
    rateBadge.innerHTML = `
      <span class="rate-dot ${isLive || isCache ? 'rate-dot--live' : ''}"></span>
      <span class="rate-text">Cotización Dólar: <strong>$${formattedRate}</strong> <small>(${sourceLabel})</small></span>
    `;
    rateBadge.title = `Precios en base a la cotización del dólar ($${formattedRate} ARS).`;
  }

  // Si la cotización ya se cargó antes de inicializar este script, sincronizar inmediatamente
  if (typeof EMCA_CURRENCY !== 'undefined' && EMCA_CURRENCY.rate) {
    updateRateBadgeUI();
  }

  window.addEventListener('emca:currency-updated', (e) => {
    const rate = e.detail?.rate;
    if (rate) {
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
  let recommendation = null;
  const recommendationNote = document.getElementById('cfg-recommendation-note');

  function buildTotal() {
    return Object.values(build).reduce((sum, piece) => sum + (piece?.price || 0), 0) + (recommendation?.assembly || 0);
  }

  function isBuildComplete() {
    const required = CATEGORY_ORDER.filter(cat => CATEGORY_INFO[cat].required);
    return required.every(cat => build[cat]) && checkCompatibility(build).isValid;
  }
  
  const steps = [...CATEGORY_ORDER];
  const storageIdx = steps.indexOf('storage');
  if (storageIdx !== -1) {
    steps.splice(storageIdx + 1, 0, 'storage2');
  }
  let currentStepIndex = 0;
  let searchQuery = "";
  let selectedFilterCat = "all";
  let stepNotice = null;
  let stepNoticeTimeout = null;

  window.addEventListener('emca:edit-recommendation', event => {
    const incoming = event.detail;
    if (!incoming?.components) return;
    // Reemplazar todas las categorías juntas evita los borrados en cascada de
    // updateBuild y que queden extras de una configuración manual anterior.
    Object.keys(build).forEach(cat => {
      const dbCat = cat === 'storage2' ? 'storage' : cat;
      const piece = PC_DB[dbCat]?.find(p => p.id === incoming.components[cat]);
      build[cat] = piece ? { ...piece } : null;
    });
    recommendation = { budget: incoming.budget, reserve: incoming.reserve, assembly: incoming.assembly, goal: incoming.goal };
    currentStepIndex = Math.max(0, steps.indexOf(incoming.category));
    closeDrawer();
    document.getElementById('tab-manual').click();
    setStepNotice('Cargamos la PC recomendada. Podés cambiar cualquier pieza desde el resumen o las categorías.');
    exitSearch();
    selectorsWrap.querySelector('.wizard-step--active')?.focus({ preventScroll: true });
    scrollToConfiguratorTop();
  });

  function setStepNotice(htmlMsg) {
    stepNotice = htmlMsg;
    if (stepNoticeTimeout) {
      clearTimeout(stepNoticeTimeout);
    }
    stepNoticeTimeout = setTimeout(() => {
      stepNotice = null;
      const el = document.getElementById("wizard-step-notice");
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-6px)';
        setTimeout(() => el.remove(), 300);
      }
    }, 4500);
  }

  function scrollToConfiguratorTop() {
    const target = document.getElementById("cfg-search-container") || selectorsWrap;
    if (!target) return;
    const headerOffset = 85;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: "smooth"
    });
  }

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

  const hardwarePlaceholderSvg = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="product-card__placeholder-svg"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>';

  function renderComponentImage(opt) {
    const hasImage = Boolean(opt.img && opt.img !== 'public/img/placeholder.jpg');
    if (hasImage) {
      return `<img src="${opt.img}" alt="${escapeHtml(opt.name)}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<span class=\\'product-card__placeholder\\'>${hardwarePlaceholderSvg}</span>';" />`;
    }
    return `<span class="product-card__placeholder">${hardwarePlaceholderSvg}</span>`;
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
      const waText = searchQuery.trim()
        ? `Hola EMCA, estoy armando mi PC y busco este componente que no encontré en la lista: ${encodeURIComponent(searchQuery.trim())}`
        : 'Hola EMCA, estoy armando mi PC y quería consultar por un componente especial:';
      html += `
        <div class="search-empty">
          <div class="search-empty__icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h4>No se encontraron componentes</h4>
          <p>No encontramos resultados con los criterios ingresados.</p>
          <div class="search-empty__custom-box">
            <p><strong>¿Buscás una marca o modelo especial?</strong></p>
            <p>Si querés un componente específico que no figura en la lista, podés consultárnoslo por mensaje y te lo cotizamos a medida.</p>
            <a href="https://wa.me/5491124692474?text=${waText}" target="_blank" rel="noopener" class="btn btn--primary btn--sm search-empty__wa-btn">
              Consultar componente por mensaje
            </a>
          </div>
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
      const catInfo = CATEGORY_INFO[cat] || { label: cat };

      const compatBadge = compatible
        ? '<span class="product-card__badge product-card__badge--ok">Compatible</span>'
        : '<span class="product-card__badge product-card__badge--error">No compatible</span>';

      const btnHtml = isSelected
        ? `<button type="button" class="btn btn--primary btn--selected" data-action="toggle" data-cat="${cat}" data-id="${comp.id}">Seleccionado</button>`
        : `<button type="button" class="btn btn--primary btn--select-search" data-action="select" data-cat="${cat}" data-id="${comp.id}">Seleccionar</button>`;

      html += `
        <div class="product-card product-card--${compatible ? 'ok' : 'error'} ${isSelected ? 'product-card--selected' : ''}">
          <div class="product-card__img">
            ${renderComponentImage(comp)}
          </div>
          <div class="product-card__info">
            <span class="product-card__cat-tag">${catInfo.label}</span>
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

    html += `
      <div class="cfg-search-footer-prompt">
        <span>¿Buscás otro componente o marca que no figura acá? Podés <a href="https://wa.me/5491124692474?text=Hola%20EMCA%2C%20quer%C3%ADa%20consultar%20por%20un%20componente%20especial%20para%20mi%20PC%3A" target="_blank" rel="noopener">consultarnos por mensaje</a> y te lo cotizamos personalizado.</span>
      </div>
    `;

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
          const catLabel = cat === 'storage2' ? 'Almacenamiento secundario' : (CATEGORY_INFO[cat]?.label || cat);
          setStepNotice(`Elegiste <strong>${escapeHtml(comp.name)}</strong> (${catLabel})`);
        } else if (action === 'toggle' && comp) {
          updateBuild(cat, null);
          setStepNotice(`Quitaste <strong>${escapeHtml(comp.name)}</strong>.`);
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
        <div class="wizard-header__title-group">
          <span class="wizard-header__step-badge">Paso ${currentStepIndex + 1} de ${steps.length}</span>
          <h3>${info.label}</h3>
        </div>
        ${info.note ? `<span class="wizard-header__note">${info.note}</span>` : ''}
      </div>
    `;

    if (stepNotice) {
      html += `
        <div class="wizard-step-notice" id="wizard-step-notice">
          <span class="step-notice-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
          <div class="step-notice-content">${stepNotice}</div>
        </div>
      `;
    }

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
        ? '<span class="product-card__badge product-card__badge--ok">Compatible</span>'
        : '<span class="product-card__badge product-card__badge--error">No compatible</span>';

      const btnHtml = isSelected
        ? `<button type="button" class="btn btn--primary btn--selected" data-cat="${currentCategory}" data-idx="${idx}">Seleccionado</button>`
        : `<button type="button" class="btn btn--primary btn--select" data-cat="${currentCategory}" data-idx="${idx}">Seleccionar</button>`;

      html += `
        <div class="product-card product-card--${compatible ? 'ok' : 'error'} ${isSelected ? 'product-card--selected' : ''}">
          <div class="product-card__img">
            ${renderComponentImage(opt)}
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
            <span class="product-card__placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="product-card__placeholder-svg"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
            </span>
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

    html += `
      <div class="cfg-step-custom-prompt">
        <div class="cfg-step-custom-prompt__content">
          <span class="cfg-step-custom-prompt__icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/></svg>
          </span>
          <span>¿Querés otra marca o modelo especial de <strong>${escapeHtml(info.label.toLowerCase())}</strong>?</span>
        </div>
        <a href="https://wa.me/5491124692474?text=Hola%20EMCA%2C%20estoy%20armando%20una%20PC%20y%20quer%C3%ADa%20consultar%20por%20un%20componente%20especial%20de%20${encodeURIComponent(info.label)}%3A" target="_blank" rel="noopener" class="cfg-step-custom-prompt__link">
          Consultar por mensaje
        </a>
      </div>
    `;

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
          const targetStep = steps[currentStepIndex];
          const targetLabel = targetStep === 'storage2' ? 'Almacenamiento secundario' : (CATEGORY_INFO[targetStep]?.label || targetStep);
          setStepNotice(`Pasaste a: <strong>${targetLabel}</strong>`);
          renderAll();
          scrollToConfiguratorTop();
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
          const nextCat = steps[currentStepIndex];
          const nextLabel = nextCat === 'storage2' ? 'Almacenamiento secundario' : (CATEGORY_INFO[nextCat]?.label || nextCat);
          if (selectedComponent) {
            setStepNotice(`Elegiste <strong>${escapeHtml(selectedComponent.name)}</strong>. Siguiente paso: <strong>${nextLabel}</strong>`);
          } else {
            setStepNotice(`Avanzaste a: <strong>${nextLabel}</strong>`);
          }
        } else {
          setStepNotice(`¡Excelente! Completaste todos los pasos. Podés revisar tu armado en el resumen.`);
        }
        renderAll();
        scrollToConfiguratorTop();
      });
    });

    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentStepIndex > 0) {
          currentStepIndex--;
          const prevCat = steps[currentStepIndex];
          const prevLabel = prevCat === 'storage2' ? 'Almacenamiento secundario' : (CATEGORY_INFO[prevCat]?.label || prevCat);
          setStepNotice(`Volviste a: <strong>${prevLabel}</strong>`);
          renderAll();
          scrollToConfiguratorTop();
        }
      });
    }

    const btnSkip = document.getElementById('btn-skip');
    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        updateBuild(currentCategory, null);
        if (currentStepIndex < steps.length - 1) {
          currentStepIndex++;
          const nextCat = steps[currentStepIndex];
          const nextLabel = nextCat === 'storage2' ? 'Almacenamiento secundario' : (CATEGORY_INFO[nextCat]?.label || nextCat);
          setStepNotice(`Paso omitido. Pasaste a: <strong>${nextLabel}</strong>`);
          renderAll();
          scrollToConfiguratorTop();
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
      if (build.ram && ((build.motherboard && build.motherboard.ramType !== build.ram.type) ||
          (component.ramType !== 'DDR4/DDR5' && component.ramType !== build.ram.type))) {
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
          ? '<span class="sidebar__badge sidebar__badge--error" aria-label="No compatible">No compatible</span>'
          : '<span class="sidebar__badge sidebar__badge--ok" aria-label="Compatible">Compatible</span>';
        html += `
          <div class="sidebar__item" style="cursor: pointer;" data-jump-step="${idx}" title="Hacer clic para editar ${info.label}">
            <div class="sidebar__item-info">
              <span class="sidebar__item-cat">${info.label}</span>
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
      html += `<div class="compat-status compat-status--error">Incompatible</div>`;
      errors.forEach(err => {
        html += `<div class="compat-item compat-item--error">${escapeHtml(err.msg)}</div>`;
      });
    }

    if (warnings.length > 0) {
      if (errors.length === 0) {
        html += `<div class="compat-status compat-status--warning">Atención</div>`;
      }
      warnings.forEach(warn => {
        html += `<div class="compat-item compat-item--warning">${escapeHtml(warn.msg)}</div>`;
      });
    }

    if (isValid && errors.length === 0 && warnings.length === 0 && build.cpu) {
      html += `<div class="compat-status compat-status--ok">Todo compatible</div>`;
    }

    // Wattage
    if (build.cpu || build.gpu) {
      const watts = estimatePowerConsumption(build);
      html += `<div class="sidebar__wattage">Consumo estimado: <strong>${watts}W</strong></div>`;
    }

    compatWrap.innerHTML = html;
  }

  function renderTotal() {
    const total = buildTotal();
    totalWrap.textContent = money(total);
    if (recommendationNote) {
      recommendationNote.hidden = !recommendation;
      if (recommendation) {
        const left = recommendation.budget - recommendation.reserve - total;
        recommendationNote.textContent = `Estás editando la PC recomendada. El total incluye armado desde ${money(recommendation.assembly)}. Tu máximo: ${money(recommendation.budget)}; reservado para extras: ${money(recommendation.reserve)}. ${left >= 0 ? `Quedan ${money(left)} disponibles.` : `Te pasás ${money(-left)} del monto disponible para la PC.`}${isBuildComplete() ? '' : ' Faltan piezas obligatorias o hay incompatibilidades: completá la selección antes de consultar.'}`;
      }
    }
    btnConsultar.disabled = !isBuildComplete();
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

  function updateMobileBarVisibility() {
    const manualPanel = document.getElementById("panel-manual");
    if (!mobileBar) return;
    if (manualPanel && !manualPanel.hidden) {
      mobileBar.classList.add("is-visible");
    } else {
      mobileBar.classList.remove("is-visible");
      closeDrawer();
    }
  }
  window.updateMobileBarVisibility = updateMobileBarVisibility;

  function openDrawer() {
    if (!drawer || !drawerBackdrop) return;
    drawerBackdrop.hidden = false;
    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    void drawer.offsetWidth;
    drawerBackdrop.classList.add("is-open");
    drawer.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawer || !drawerBackdrop) return;
    drawerBackdrop.classList.remove("is-open");
    drawer.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => {
      drawerBackdrop.hidden = true;
      drawer.hidden = true;
      drawer.setAttribute("aria-hidden", "true");
    }, 320);
  }

  function renderDrawer() {
    const selectedKeys = Object.keys(build).filter(k => build[k] !== null);
    const count = selectedKeys.length;

    const total = buildTotal();

    const formattedTotal = money(total);

    // Actualizar barra inferior flotante
    if (mobileTotal) mobileTotal.textContent = formattedTotal;
    if (mobileCount) {
      mobileCount.textContent = count === 0 ? "0 componentes" : `${count} componente${count === 1 ? "" : "s"}`;
    }

    // Actualizar cabecera y total del drawer
    if (drawerCount) drawerCount.textContent = `${count} componente${count === 1 ? "" : "s"}`;
    if (drawerTotal) drawerTotal.textContent = formattedTotal;

    const isComplete = isBuildComplete();
    if (drawerConsultar) drawerConsultar.disabled = !isComplete;

    if (drawerBody) {
      if (count === 0) {
        drawerBody.innerHTML = `
          <div class="cfg-drawer__empty">
            <p>Todavía no elegiste ningún componente.</p>
            <small>Empezá seleccionando un procesador en la lista.</small>
          </div>
        `;
        return;
      }

      const { errors, warnings } = checkCompatibility(build);
      const badCats = new Set();
      errors.forEach(e => (e.cats || []).forEach(c => badCats.add(c)));

      let itemsHtml = '<div class="cfg-drawer__items">';
      steps.forEach((cat, idx) => {
        const comp = build[cat];
        if (!comp) return;

        let info = CATEGORY_INFO[cat];
        if (cat === "storage2") info = { label: "Almacenamiento secundario" };
        const label = info?.label || cat;
        const incompatible = badCats.has(cat);

        itemsHtml += `
          <div class="cfg-drawer__item ${incompatible ? "cfg-drawer__item--error" : ""}">
            <div class="cfg-drawer__item-main">
              <div class="cfg-drawer__item-info">
                <span class="cfg-drawer__item-cat">${label}</span>
                <span class="cfg-drawer__item-name">${escapeHtml(comp.name)}</span>
                <span class="cfg-drawer__item-price">${money(comp.price)}</span>
              </div>
            </div>
            <div class="cfg-drawer__item-actions">
              <button type="button" class="cfg-drawer__btn-edit" data-drawer-jump="${idx}" title="Editar ${label}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button type="button" class="cfg-drawer__btn-remove" data-drawer-remove="${cat}" title="Quitar ${label}">
                ✕
              </button>
            </div>
          </div>
        `;
      });
      itemsHtml += "</div>";

      // Estado de compatibilidad dentro del drawer
      if (errors.length > 0) {
        itemsHtml += `<div class="compat-status compat-status--error" style="margin-top: 1rem;">Incompatibilidad detectada</div>`;
        errors.forEach(err => {
          itemsHtml += `<div class="compat-item compat-item--error">${escapeHtml(err.msg)}</div>`;
        });
      } else if (warnings.length > 0) {
        itemsHtml += `<div class="compat-status compat-status--warning" style="margin-top: 1rem;">Atención</div>`;
        warnings.forEach(warn => {
          itemsHtml += `<div class="compat-item compat-item--warning">${escapeHtml(warn.msg)}</div>`;
        });
      } else if (build.cpu) {
        itemsHtml += `<div class="compat-status compat-status--ok" style="margin-top: 1rem;">Todo compatible</div>`;
      }

      // Consumo estimado en drawer
      if (build.cpu || build.gpu) {
        const watts = estimatePowerConsumption(build);
        itemsHtml += `<div class="sidebar__wattage" style="margin-top: 0.75rem;">Consumo estimado: <strong>${watts}W</strong></div>`;
      }

      drawerBody.innerHTML = itemsHtml;

      // Eventos dentro del drawer (saltar a editar o quitar)
      drawerBody.querySelectorAll("[data-drawer-jump]").forEach(btn => {
        btn.addEventListener("click", () => {
          const stepIdx = parseInt(btn.dataset.drawerJump, 10);
          if (!isNaN(stepIdx)) {
            closeDrawer();
            exitSearch();
            currentStepIndex = stepIdx;
            renderAll();
            scrollToConfiguratorTop();
          }
        });
      });

      drawerBody.querySelectorAll("[data-drawer-remove]").forEach(btn => {
        btn.addEventListener("click", () => {
          const cat = btn.dataset.drawerRemove;
          updateBuild(cat, null);
          const catLabel = cat === "storage2" ? "Almacenamiento secundario" : (CATEGORY_INFO[cat]?.label || cat);
          setStepNotice(`Quitaste el componente de: <strong>${catLabel}</strong>`);
          renderAll();
        });
      });
    }
  }

  function renderAll() {
    updateRateBadgeUI();
    renderSelectors();
    renderSummary();
    renderCompat();
    renderTotal();
    renderDrawer();
    updateMobileBarVisibility();
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
    if (!isBuildComplete()) return;
    let text = 'Hola, quiero consultar este armado que configuré:\n\n';
    if (recommendation) {
      text = `Hola, edité la PC recomendada para: ${recommendation.goal}.\nMáximo: ${money(recommendation.budget)}. Reserva extras: ${money(recommendation.reserve)}.\n`;
    }
    steps.forEach(cat => {
      if (build[cat]) {
        let label = cat === 'storage2' ? 'Almacenamiento secundario' : CATEGORY_INFO[cat].label;
        text += recommendation ? `- ${build[cat].name}\n` : `- ${label}: ${build[cat].name}\n`;
      }
    });
    
    const total = buildTotal();
    text += recommendation
      ? `\nTotal orientativo: ${money(total)} (incluye armado desde ${money(recommendation.assembly)}).`
      : `\nTotal estimado: ${money(total)}`;

    text += '\n\n(Aclaración: Si querés sumar o cambiar algún componente especial que no figuraba en la lista, podés escribirlo acá abajo).';

    sessionStorage.setItem('emca-armado', text);
    window.location.href = 'index.html#contacto';
  });

  btnReset.addEventListener('click', () => {
    Object.keys(build).forEach(k => build[k] = null);
    recommendation = null;
    currentStepIndex = 0;
    exitSearch();
  });

  // Eventos de la barra y drawer móvil
  if (btnOpenSummary) btnOpenSummary.addEventListener("click", openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);
  if (drawerHandle) drawerHandle.addEventListener("click", closeDrawer);

  if (drawerConsultar) {
    drawerConsultar.addEventListener("click", () => {
      closeDrawer();
      btnConsultar.click();
    });
  }

  if (drawerReset) {
    drawerReset.addEventListener("click", () => {
      btnReset.click();
      closeDrawer();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  renderAll();
})();
