/* Interfaz del recomendador. No requiere un servicio de IA ni envía datos al calcular. */
(() => {
  const form = document.getElementById('auto-form');
  if (!form) return;
  const result = document.getElementById('auto-result');
  const usesList = document.getElementById('uses-list');
  const goal = document.getElementById('auto-goal');
  const help = document.getElementById('auto-goal-help');
  const error = document.getElementById('error-presupuesto');
  const uses = EMCA_RECOMMENDER.uses;
  const money = n => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
  const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  let lastInput = null;
  const field = name => form.elements.namedItem(name);

  usesList.innerHTML = Object.entries(uses).map(([key, use], i) => `
    <label class="use-option"><input type="radio" name="uso" value="${key}" ${i === 0 ? 'checked' : ''} /><span>${use.label}</span></label>`).join('');

  function updateGoal() {
    goal.innerHTML = uses[field('uso').value].profiles.map(p => `<option value="${p.id}">${p.label}</option>`).join('');
    updateHelp();
  }
  function updateHelp() {
    help.textContent = uses[field('uso').value].profiles.find(p => p.id === goal.value).note;
  }
  updateGoal();
  usesList.addEventListener('change', updateGoal);
  goal.addEventListener('change', updateHelp);

  // Una edición invalida el resultado anterior: no consultar una propuesta vieja
  // con un presupuesto o un objetivo que el visitante acaba de cambiar.
  form.addEventListener('input', () => {
    error.textContent = '';
    if (!lastInput) return;
    lastInput = null;
    result.innerHTML = '<h2>Actualizá tu recomendación</h2><p class="result-empty">Cambiaste tus preferencias. Tocá “Buscar una opción conveniente” para recalcular.</p>';
  });

  function reasons(r) {
    const b = r.proposal.build;
    return {
      cpu: 'La opción de menor costo dentro de las combinaciones evaluadas para este objetivo.',
      motherboard: `Plataforma ${b.cpu.socket} y memoria ${b.ram.type}, sin pagar por una gama más alta solo porque queda presupuesto.`,
      ram: `${b.ram.capacity}. Dos módulos; la capacidad se elige según tu trabajo.`,
      gpu: b.gpu.id === 'gpu-none' ? 'Usamos los gráficos del procesador: no pagás otra placa.' : 'Incluida por el uso que elegiste; el juego o programa concreto se confirma antes de comprar.',
      storage: `${b.storage.capacity} en SSD para el sistema y tus archivos. No agregamos discos extra sin necesidad.`,
      psu: 'Potencia con margen para esta combinación; verificamos los conectores del modelo final al cotizar.',
      pccase: 'Elegido por tamaño y ventilación. No sumamos un gabinete premium por estética.',
      cooler: b.cooler.id === 'cooler-stock' ? 'Aprovechamos el que incluye el procesador, sin costo adicional.' : 'Necesario para refrigerar el procesador elegido.',
      fans: 'Completa la ventilación prevista para el gabinete elegido.',
      wifi: 'Incluido porque pediste conexión inalámbrica; no agregamos un segundo adaptador si la placa ya tiene Wi-Fi.',
    };
  }

  function consultation(r) {
    const lines = [
      `Hola, busco una PC para ${uses[lastInput.use].label}: ${r.requested.label}.`,
      `Máximo: ${money(r.budget)}. Reserva extras: ${money(r.reserve)}.`,
    ];
    if (r.proposal) {
      if (r.status === 'alternative') lines.push(`Alternativa de menor exigencia: ${r.target.label}.`);
      Object.values(r.proposal.build).filter(Boolean).forEach(p => lines.push(`- ${p.name}`));
      lines.push(`Total orientativo con armado: ${money(r.proposal.total)}.`);
    } else {
      lines.push('No encontré una PC completa dentro de mi presupuesto. Quisiera evaluar opciones.');
    }
    if (lastInput.wifi) lines.push('Necesito Wi-Fi.');
    if (lastInput.storage) lines.push(`Espacio mínimo: ${lastInput.storage / 1000} TB.`);
    // El contacto admite 1000 caracteres; el resumen mantiene el pedido y el total.
    return lines.join('\n');
  }

  function render(input) {
    const r = EMCA_RECOMMENDER.recommend(input);
    if (r.status === 'invalid') {
      error.textContent = 'Ingresá un máximo válido y una reserva menor que ese importe.';
      return;
    }
    lastInput = { ...input };
    let html = '';
    if (!r.proposal) {
      html = `<h2>${r.status === 'insufficient' ? 'Con este monto no conviene forzar un armado' : 'Necesitamos revisar tu pedido'}</h2>
        <p>No encontramos una PC completa para este uso dentro de ${money(r.available)} disponibles para torre y armado.</p>
        ${r.minimumTotal ? `<p class="auto-note">La opción más económica evaluada parte de ${money(r.minimumTotal)}: faltan ${money(r.minimumTotal - r.available)}. Es una referencia del catálogo, no un mínimo de todo el mercado.</p>` : ''}
        <p class="auto-note">Podemos evaluar mejorar tu equipo actual, opciones usadas o ajustar el objetivo. No te proponemos comprar piezas sueltas que no completen una PC funcional.</p>`;
    } else {
      const b = r.proposal.build;
      const why = reasons(r);
      const alternative = r.status === 'alternative';
      html = `<p class="auto-kicker">${alternative ? 'ALTERNATIVA CON MENOR EXIGENCIA' : 'UNA PC PARA TU USO'}</p>
        <h2>${escape(r.target.label)}</h2>
        ${alternative ? `<div class="auto-notice"><strong>Tu objetivo era: ${escape(r.requested.label)}.</strong> ${r.desiredTotal ? `La propuesta para ese objetivo cuesta ${money(r.desiredTotal)}; faltan ${money(r.desiredTotal - r.available)}.` : 'No encontramos una combinación evaluada para ese objetivo.'} La alternativa de abajo no cubre el mismo nivel de exigencia.</div>` : ''}
        <p>${escape(r.target.note)}</p>
        <div class="auto-saving"><strong>${r.savings > 0 ? `Podés guardar ${money(r.savings)}` : 'Entra justo en tu presupuesto'}</strong><p>Elegimos la combinación de menor costo que cumple este perfil entre las opciones evaluadas del catálogo. No agregamos mejoras solo para gastar el resto.</p></div>
        <ul class="build-list">${Object.entries(b).filter(([, p]) => p).map(([cat, p]) => `
          <li class="build-item"><div><p class="build-item__cat">${escape(CATEGORY_INFO[cat].label)}</p>
          <p class="build-item__name">${escape(p.name)}</p><p class="build-item__tier">${escape(why[cat])}</p></div>
          <p class="build-item__price">${p.price ? money(p.price) : 'Incluido'}</p></li>`).join('')}</ul>
        <div class="totals">
          <div class="totals__row"><span>Componentes</span><span>${money(r.proposal.parts)}</span></div>
          <div class="totals__row"><span>Armado (desde)</span><span>${money(r.proposal.assembly)}</span></div>
          <div class="totals__row totals__row--main"><span>Total orientativo</span><span>${money(r.proposal.total)}</span></div>
          <div class="totals__row"><span>Tu máximo</span><span>${money(r.budget)}</span></div>
          ${r.reserve ? `<div class="totals__row"><span>Separado para extras</span><span>${money(r.reserve)}</span></div>` : ''}
          <div class="totals__row"><span>Queda sin gastar${r.reserve ? ' además de la reserva' : ''}</span><span class="diff--under">${money(r.savings)}</span></div>
        </div>
        ${input.wifi && b.motherboard.hasWifi ? '<p class="auto-note">La motherboard elegida ya incluye Wi-Fi; no sumamos un adaptador.</p>' : ''}
        <p class="auto-note">Comprobamos plataforma, memoria, espacio para la placa de video y potencia según el catálogo. Al cotizar revisamos BIOS, conexiones, medidas y modelos exactos.</p>`;
    }
    html += `<p class="auto-note">Precios orientativos de ejemplo, convertidos a pesos con la cotización disponible; no son ofertas ni precios de tiendas en tiempo real. Confirmamos stock, precios y mano de obra antes de comprar. No incluye monitor, periféricos, licencias ni envío.</p>
      <div class="panel__actions"><button class="btn btn--primary" type="button" id="auto-consultar">${r.proposal ? 'Consultar esta propuesta' : 'Pedir asesoramiento'}</button></div>`;
    result.innerHTML = html;
    document.getElementById('auto-consultar').addEventListener('click', () => {
      sessionStorage.setItem('emca-armado', consultation(r));
      window.location.href = 'index.html#contacto';
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    error.textContent = '';
    const budget = Number(field('presupuesto').value);
    const reserve = Number(field('reserve').value);
    if (!Number.isFinite(budget) || budget <= 0 || budget > 1000000000 || !Number.isFinite(reserve) || reserve < 0 || reserve >= budget) {
      error.textContent = 'Ingresá un máximo mayor que cero y una reserva menor que ese importe.';
      return;
    }
    render({ use: field('uso').value, goal: goal.value, budget, reserve, storage: Number(field('storage').value), wifi: field('wifi').checked });
  });
  window.addEventListener('emca:currency-updated', () => {
    if (lastInput) render(lastInput);
  });
})();
