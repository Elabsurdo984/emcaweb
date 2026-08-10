/* =============================================================================
   EMCA System - Editor visual de componentes
   Carga PC_DB (pc-components-db.js) y permite editar cada categoría con
   formularios. Al terminar, descargar el archivo generado y reemplazar
   public/js/pc-components-db.js
   ========================================================================== */

(() => {
  const CAT_ID_PREFIX = {
    cpu: 'cpu-',
    motherboard: 'mb-',
    ram: 'ram-',
    gpu: 'gpu-',
    storage: 'st-',
    psu: 'psu-',
    pccase: 'case-',
    cooler: 'cooler-',
    fans: 'fan-',
    wifi: 'wifi-',
    os: 'os-',
  };

  const SCHEMAS = {
    cpu: [
      { key: 'socket', label: 'Socket', type: 'text', placeholder: 'AM4' },
      { key: 'tdp', label: 'TDP (W)', type: 'number' },
      { key: 'hasIgpu', label: 'Tiene gráficos integrados', type: 'checkbox' },
      { key: 'hasCooler', label: 'Incluye cooler', type: 'checkbox' },
      { key: 'ramType', label: 'Tipo de RAM', type: 'select', options: ['DDR4', 'DDR5', 'DDR4/DDR5'] },
    ],
    motherboard: [
      { key: 'socket', label: 'Socket', type: 'text', placeholder: 'AM4' },
      { key: 'chipset', label: 'Chipset', type: 'text', placeholder: 'B550' },
      { key: 'ramType', label: 'Tipo de RAM', type: 'select', options: ['DDR4', 'DDR5', 'DDR4/DDR5'] },
      { key: 'formFactor', label: 'Form factor', type: 'select', options: ['ATX', 'Micro-ATX', 'Mini-ITX'] },
      { key: 'm2Slots', label: 'Slots M.2', type: 'number' },
      { key: 'hasWifi', label: 'Tiene WiFi', type: 'checkbox' },
    ],
    ram: [
      { key: 'type', label: 'Tipo', type: 'select', options: ['DDR4', 'DDR5'] },
      { key: 'speed', label: 'Velocidad (MHz)', type: 'number' },
      { key: 'capacity', label: 'Capacidad', type: 'text', placeholder: '16 GB (2x8)' },
      { key: 'modules', label: 'Módulos', type: 'number' },
    ],
    gpu: [
      { key: 'tdp', label: 'TDP (W)', type: 'number' },
      { key: 'length', label: 'Largo (mm)', type: 'number' },
      { key: 'powerConnectors', label: 'Conectores de poder', type: 'text', placeholder: '1x8-pin' },
    ],
    storage: [
      { key: 'storageType', label: 'Tipo', type: 'select', options: ['SSD SATA', 'SSD NVMe', 'HDD'] },
      { key: 'capacity', label: 'Capacidad', type: 'text', placeholder: '1 TB' },
      { key: 'interface', label: 'Interfaz', type: 'select', options: ['SATA', 'NVMe M.2'] },
    ],
    psu: [
      { key: 'wattage', label: 'Potencia (W)', type: 'number' },
      { key: 'certification', label: 'Certificación', type: 'text', placeholder: '80+ Bronze' },
      { key: 'modular', label: 'Modular', type: 'select', options: ['No', 'Full modular', 'Semi modular'] },
    ],
    pccase: [
      { key: 'formFactors', label: 'Form factors soportados', type: 'multiselect', options: ['ATX', 'Micro-ATX', 'Mini-ITX'] },
      { key: 'maxGpuLength', label: 'Largo máx. GPU (mm)', type: 'number' },
      { key: 'includedFans', label: 'Fans incluidos', type: 'number' },
    ],
    cooler: [
      { key: 'sockets', label: 'Sockets', type: 'multiselect', options: ['AM4', 'AM5', 'LGA1700'] },
      { key: 'maxTdp', label: 'TDP máx. (W)', type: 'number' },
      { key: 'type', label: 'Tipo', type: 'text', placeholder: 'Aire' },
    ],
    fans: [
      { key: 'size', label: 'Tamaño (mm)', type: 'number' },
      { key: 'quantity', label: 'Cantidad', type: 'number' },
    ],
    wifi: [
      { key: 'interface', label: 'Interfaz', type: 'select', options: ['USB', 'PCIe'] },
      { key: 'features', label: 'Características', type: 'text', placeholder: 'WiFi 6, BT 5.2' },
    ],
    os: [
      { key: 'type', label: 'Tipo', type: 'text', placeholder: 'Gratis' },
    ],
  };

  const state = {};
  CATEGORY_ORDER.forEach((cat) => {
    state[cat] = (PC_DB[cat] || []).map((o) => ({ ...o }));
  });

  let currentCat = CATEGORY_ORDER[0];
  let editingId = null;
  let idTouched = false;

  /* Utilidades ----------------------------------------------------------- */
  const $ = (id) => document.getElementById(id);

  const slugify = (str) =>
    String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const autoId = (cat, name) => `${CAT_ID_PREFIX[cat] || `${cat}-`}${slugify(name)}`;

  const jsValue = (v) => {
    if (Array.isArray(v)) return `['${v.join("', '")}']`;
    if (typeof v === 'number') return String(v);
    if (typeof v === 'boolean') return String(v);
    return `'${String(v).replace(/'/g, "\\'")}'`;
  };

  const jsLiteral = (v) => {
    if (typeof v === 'string') return `'${v.replace(/'/g, "\\'")}'`;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (Array.isArray(v)) return `[${v.map(jsLiteral).join(', ')}]`;
    if (v && typeof v === 'object') {
      return `{${Object.entries(v).map(([k, x]) => ` ${k}: ${jsLiteral(x)}`).join(',')} }`;
    }
    return String(v);
  };

  const objectKeys = (cat) => ['id', 'img', 'name', 'price', ...SCHEMAS[cat].map((s) => s.key)];

  const formatObject = (cat, obj) => {
    const parts = [];
    objectKeys(cat).forEach((k) => {
      const v = obj[k];
      if (v === undefined || v === null || v === '') return;
      if (Array.isArray(v) && v.length === 0) return;
      parts.push(`${k}: ${jsValue(v)}`);
    });
    return `{ ${parts.join(', ')} }`;
  };

  const formatCategory = (cat) =>
    `  ${cat}: [\n` + state[cat].map((o) => `    ${formatObject(cat, o)},`).join('\n') + `\n  ],`;

  const buildFullFile = () =>
    `const CATEGORY_ORDER = [${CATEGORY_ORDER.map(jsLiteral).join(', ')}];\n\n` +
    `const CATEGORY_INFO = ${jsLiteral(CATEGORY_INFO)};\n\n` +
    `const PC_DB = {\n${CATEGORY_ORDER.map(formatCategory).join('\n\n')}\n};\n`;

  /* Formulario ----------------------------------------------------------- */
  const fieldHtml = (def) => {
    if (def.type === 'checkbox') {
      return `
        <div class="field field--inline">
          <label>
            <input type="checkbox" name="${def.key}" />
            <span>${def.label}</span>
          </label>
        </div>`;
    }
    if (def.type === 'select') {
      return `
        <div class="field">
          <label for="f-${def.key}">${def.label}</label>
          <select id="f-${def.key}" name="${def.key}">${def.options.map((o) => `<option>${o}</option>`).join('')}</select>
        </div>`;
    }
    if (def.type === 'multiselect') {
      return `
        <div class="field">
          <span class="field__label">${def.label}</span>
          <div class="check-pills">${def.options
            .map(
              (o) =>
                `<label class="check-pill"><input type="checkbox" name="${def.key}" value="${o}" /><span>${o}</span></label>`,
            )
            .join('')}</div>
        </div>`;
    }
    return `
      <div class="field">
        <label for="f-${def.key}">${def.label}</label>
        <input id="f-${def.key}" name="${def.key}" type="${def.type === 'number' ? 'number' : 'text'}" placeholder="${def.placeholder || ''}" />
      </div>`;
  };

  const renderFields = () => {
    $('fields').innerHTML = `
      <div class="field">
        <label for="f-id">ID único</label>
        <input id="f-id" name="id" type="text" placeholder="se genera solo" />
        <p class="field__hint">Se autogenera desde el nombre. Podés cambiarlo.</p>
      </div>
      <div class="field">
        <label for="f-name">Nombre</label>
        <input id="f-name" name="name" type="text" required />
      </div>
      <div class="field">
        <label for="f-price">Precio (ARS)</label>
        <input id="f-price" name="price" type="number" min="0" step="1000" required />
      </div>
      <div class="field">
        <label for="f-img">Imagen (opcional)</label>
        <input id="f-img" name="img" type="text" placeholder="public/img/placeholder.jpg" />
      </div>
      ${SCHEMAS[currentCat].map(fieldHtml).join('')}
    `;

    const nameInput = $('f-name');
    const idInput = $('f-id');

    idInput.addEventListener('input', () => {
      idTouched = true;
      updatePreview();
    });
    nameInput.addEventListener('input', () => {
      if (!editingId && !idTouched) idInput.value = autoId(currentCat, nameInput.value);
      updatePreview();
    });

    const form = $('editor-form');
    form.querySelectorAll('input, select').forEach((el) => {
      el.addEventListener('input', updatePreview);
      el.addEventListener('change', updatePreview);
    });

    const stType = form.elements.namedItem('storageType');
    const stIface = form.elements.namedItem('interface');
    if (stType && stIface) {
      stType.addEventListener('change', () => {
        stIface.value = stType.value === 'SSD NVMe' ? 'NVMe M.2' : 'SATA';
        updatePreview();
      });
    }
  };

  const collectFormData = () => {
    const form = $('editor-form');
    const get = (key) => form.elements.namedItem(key);
    const data = { img: 'public/img/placeholder.jpg' };

    data.id = get('id').value.trim();
    data.name = get('name').value.trim();
    const priceRaw = get('price').value.trim();
    data.price = priceRaw === '' ? '' : Number(priceRaw);
    const imgVal = get('img').value.trim();
    if (imgVal) data.img = imgVal;

    SCHEMAS[currentCat].forEach((def) => {
      const el = get(def.key);
      if (def.type === 'checkbox') {
        data[def.key] = Boolean(el && el.checked);
      } else if (def.type === 'multiselect') {
        data[def.key] = Array.from(form.querySelectorAll(`input[name="${def.key}"]:checked`)).map((c) => c.value);
      } else if (el) {
        const v = el.value.trim();
        if (v === '') return;
        data[def.key] = def.type === 'number' ? Number(v) : v;
      }
    });
    return data;
  };

  const populateForm = (data) => {
    renderFields();
    const form = $('editor-form');
    const set = (key, val) => {
      const el = form.elements.namedItem(key);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = Boolean(val);
      else el.value = val === undefined || val === null ? '' : val;
    };
    set('id', data.id || autoId(currentCat, data.name || ''));
    set('name', data.name || '');
    set('price', data.price === undefined || data.price === null ? '' : data.price);
    set('img', data.img && data.img !== 'public/img/placeholder.jpg' ? data.img : '');
    SCHEMAS[currentCat].forEach((def) => {
      if (def.type === 'multiselect') {
        const vals = data[def.key] || [];
        form.querySelectorAll(`input[name="${def.key}"]`).forEach((c) => {
          c.checked = vals.includes(c.value);
        });
      } else {
        set(def.key, data[def.key]);
      }
    });
  };

  const renderExistingSelect = () => {
    const sel = $('existing-select');
    const prev = editingId;
    sel.innerHTML =
      '<option value="">— Nuevo componente —</option>' +
      state[currentCat].map((o) => `<option value="${o.id}">${o.name}</option>`).join('');
    if (prev && state[currentCat].some((o) => o.id === prev)) sel.value = prev;
    else sel.value = '';
  };

  const setFormTitle = (text) => {
    $('editor-form-title').textContent = text;
  };

  const updatePreview = () => {
    const data = collectFormData();
    $('preview-item').value = data.name ? formatObject(currentCat, data) : '';
    $('preview-cat').value = formatCategory(currentCat);
  };

  /* Mensajes, copiado y descarga ---------------------------------------- */
  const msg = $('editor-msg');
  const showMsg = (text, ok = true) => {
    msg.textContent = text;
    msg.classList.toggle('is-error', !ok);
    msg.classList.add('is-visible');
    clearTimeout(showMsg._t);
    showMsg._t = setTimeout(() => msg.classList.remove('is-visible'), 2600);
  };

  const copyText = (text, label) => {
    if (!text) {
      showMsg('No hay nada para copiar todavía.', false);
      return;
    }
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (e) {
        ok = false;
      }
      document.body.removeChild(ta);
      showMsg(ok ? `${label} copiado.` : 'No se pudo copiar automáticamente. Seleccioná el código manualmente.', ok);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showMsg(`${label} copiado al portapapeles.`)).catch(fallback);
    } else {
      fallback();
    }
  };

  const download = () => {
    const blob = new Blob([buildFullFile()], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pc-components-db.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showMsg('Archivo descargado. Reemplazá public/js/pc-components-db.js con este.');
  };

  /* Eventos -------------------------------------------------------------- */
  $('cat-select').addEventListener('change', (e) => {
    currentCat = e.target.value;
    editingId = null;
    idTouched = false;
    renderFields();
    renderExistingSelect();
    updatePreview();
    setFormTitle('Nuevo componente');
  });

  $('existing-select').addEventListener('change', (e) => {
    const id = e.target.value;
    editingId = id || null;
    idTouched = Boolean(id);
    if (id) {
      const comp = state[currentCat].find((o) => o.id === id);
      if (comp) {
        populateForm(comp);
        setFormTitle(`Editando: ${comp.name}`);
        return;
      }
    }
    renderFields();
    setFormTitle('Nuevo componente');
    updatePreview();
  });

  $('editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = collectFormData();
    if (!data.id) {
      showMsg('Completá el ID o el nombre.', false);
      return;
    }
    if (!data.name) {
      showMsg('Completá el nombre.', false);
      return;
    }
    if (data.price === '' || data.price < 0) {
      showMsg('Completá un precio válido.', false);
      return;
    }

    if (editingId) {
      const i = state[currentCat].findIndex((o) => o.id === editingId);
      if (i !== -1) state[currentCat][i] = data;
      else state[currentCat].push(data);
    } else {
      if (state[currentCat].some((o) => o.id === data.id)) {
        showMsg('Ya existe un componente con ese ID. Elegí otro ID o editá el existente.', false);
        return;
      }
      state[currentCat].push(data);
    }

    editingId = data.id;
    idTouched = true;
    renderExistingSelect();
    updatePreview();
    setFormTitle(`Editando: ${data.name}`);
    showMsg('Componente guardado en esta sesión.');
  });

  $('btn-delete').addEventListener('click', () => {
    if (!editingId) {
      showMsg('Elegí un componente existente para eliminar.', false);
      return;
    }
    state[currentCat] = state[currentCat].filter((o) => o.id !== editingId);
    editingId = null;
    idTouched = false;
    renderFields();
    renderExistingSelect();
    updatePreview();
    setFormTitle('Nuevo componente');
    showMsg('Componente eliminado de esta sesión.');
  });

  $('btn-reset').addEventListener('click', () => {
    CATEGORY_ORDER.forEach((cat) => {
      state[cat] = (PC_DB[cat] || []).map((o) => ({ ...o }));
    });
    editingId = null;
    idTouched = false;
    renderFields();
    renderExistingSelect();
    updatePreview();
    setFormTitle('Nuevo componente');
    showMsg('Catálogo restablecido al original.');
  });

  $('btn-copy-item').addEventListener('click', () => copyText($('preview-item').value, 'Componente'));
  $('btn-copy-cat').addEventListener('click', () => copyText($('preview-cat').value, 'Categoría'));
  $('btn-copy-file').addEventListener('click', () => copyText(buildFullFile(), 'Archivo'));
  $('btn-download').addEventListener('click', download);

  /* Init ----------------------------------------------------------------- */
  $('cat-select').innerHTML = CATEGORY_ORDER.map(
    (cat) => `<option value="${cat}">${CATEGORY_INFO[cat].label}</option>`,
  ).join('');
  renderFields();
  renderExistingSelect();
  updatePreview();
})();
