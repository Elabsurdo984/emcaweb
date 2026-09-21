/* Recomendaciones por necesidad, sin completar el presupuesto con extras.
 * Usa el catálogo compartido. Los perfiles son criterios orientativos revisables,
 * no benchmarks ni una garantía de rendimiento para todos los programas/juegos.
 */
const EMCA_RECOMMENDER = (() => {
  const assembly = 15000; // Referencia de mano de obra publicada en index.html.
  const basic = ['cpu-12100', 'cpu-5600g', 'cpu-5600gt', 'cpu-12400', 'cpu-7600'];
  const sixCore = ['cpu-5600', 'cpu-5600g', 'cpu-5600gt', 'cpu-12400f', 'cpu-12400', 'cpu-7600', 'cpu-7700'];
  const gamingCpu = ['cpu-5600', 'cpu-12400f', 'cpu-12400', 'cpu-7600', 'cpu-7700'];
  const dedicated = ['gpu-6600', 'gpu-7600', 'gpu-4060', 'gpu-5060', 'gpu-9060xt', 'gpu-5060ti'];
  const creatorGpu = ['gpu-4060', 'gpu-5060', 'gpu-5060ti'];
  const profile = (id, label, cpu, gpu, ram, storage, note) => ({ id, label, cpu, gpu, ram, storage, note });
  const uses = {
    oficina: { label: 'Oficina / estudio', profiles: [
      profile('diario', 'Documentos, clases y videollamadas', basic, ['gpu-none'], 16, 480, 'Priorizamos una PC ágil para las tareas de todos los días, sin placa de video dedicada.'),
      profile('multitarea', 'Muchas aplicaciones y planillas a la vez', sixCore, ['gpu-none'], 32, 1000, 'Más memoria y espacio para trabajar con varias aplicaciones. No sumamos una placa de video para tareas de oficina.'),
    ] },
    general: { label: 'Uso general', profiles: [
      profile('diario', 'Internet, películas y trámites', basic, ['gpu-none'], 16, 480, 'Un SSD y 16 GB de memoria son la base elegida; no hace falta gastar en una placa de video dedicada para este uso.'),
      profile('multitarea', 'Varias aplicaciones y muchos archivos', sixCore, ['gpu-none'], 32, 1000, 'Reservamos más memoria y almacenamiento para varias aplicaciones y archivos.'),
    ] },
    gaming: { label: 'Juegos', profiles: [
      profile('livianos', 'Juegos livianos, acepto bajar la calidad', ['cpu-5600g', 'cpu-5600gt', 'cpu-8600g'], ['gpu-none'], 16, 480, 'Usamos los gráficos integrados de un Ryzen G. Es una base para juegos livianos con ajustes bajos; no equivale a una PC para juegos exigentes.'),
      profile('1080', 'Juegos en Full HD (1080p)', gamingCpu, dedicated, 16, 1000, 'Priorizamos una placa de video dedicada y un procesador equilibrado. La calidad y fluidez dependen de cada juego; no prometemos una cantidad de FPS.'),
      profile('1440', 'Juegos en 1440p, más detalle', gamingCpu, ['gpu-9060xt', 'gpu-5060ti'], 32, 1000, 'Destinamos más a una placa de video de 16 GB. Revisamos tus juegos y monitor antes de confirmar; no presupone 4K, ray tracing ni una tasa de FPS fija.'),
    ] },
    diseno: { label: 'Diseño gráfico', profiles: [
      profile('2d', 'Canva, ilustraciones y fotos sencillas', sixCore, ['gpu-none'], 16, 1000, 'Para diseño 2D sencillo evitamos agregar una placa dedicada de entrada. Confirmamos los requisitos del programa que usás.'),
      profile('capas', 'Diseño 2D con muchas capas y archivos grandes', ['cpu-12400', 'cpu-7600', 'cpu-7700'], ['gpu-none'], 32, 1000, 'Priorizamos 32 GB de memoria para los archivos grandes. Revisamos si tu programa necesita una placa dedicada antes de sumarla.'),
      profile('3d', 'Modelado 3D y aplicaciones con aceleración gráfica', ['cpu-12400', 'cpu-7600', 'cpu-7700'], creatorGpu, 32, 1000, 'Sumamos una placa dedicada para aplicaciones que aprovechan aceleración gráfica. Los proyectos 3D grandes requieren una evaluación particular.'),
    ] },
    edicion: { label: 'Edición de video', profiles: [
      profile('1080', 'Videos en Full HD (1080p)', ['cpu-12400', 'cpu-7600', 'cpu-7700'], creatorGpu, 32, 1000, 'Priorizamos memoria, SSD y aceleración gráfica. El programa, los efectos y el formato del video pueden cambiar los requisitos.'),
      profile('4k', 'Videos en 4K y proyectos más pesados', ['cpu-12400', 'cpu-7600', 'cpu-7700'], ['gpu-5060ti'], 32, 1000, 'Base con 32 GB de RAM y una placa de 16 GB. Antes de sumar más memoria o discos revisamos el editor, los formatos y si conviene trabajar con copias de menor resolución.'),
    ] },
    streaming: { label: 'Transmisiones en vivo', profiles: [
      profile('camara', 'Cámara, clases y presentaciones', sixCore, ['gpu-none'], 16, 1000, 'Para transmitir una cámara o una presentación empezamos con gráficos integrados. Cámara, capturadora y conexión a Internet se revisan aparte.'),
      profile('juegos', 'Jugar y transmitir desde la misma PC', gamingCpu, creatorGpu, 32, 1000, 'Sumamos una placa con codificación de video para transmitir mientras jugás. La conexión a Internet y la configuración también influyen.'),
    ] },
  };

  const validPrice = p => p && Number.isFinite(p.price) && p.price >= 0;
  const cheapest = items => items.filter(validPrice).sort((a, b) => a.price - b.price || a.id.localeCompare(b.id))[0];
  const capacity = p => {
    const value = parseFloat(p.capacity);
    return /TB/i.test(p.capacity) ? value * 1000 : value;
  };
  const total = build => Object.values(build).reduce((sum, item) => sum + (item?.price || 0), 0);

  function findBuild(db, target, { storage = 0, wifi = false } = {}) {
    let best = null;
    const items = cat => (db[cat] || []).filter(validPrice);
    const cpus = items('cpu').filter(p => target.cpu.includes(p.id));
    const gpus = items('gpu').filter(p => target.gpu.includes(p.id));
    const disk = cheapest(items('storage').filter(p => p.storageType === 'SSD NVMe' && capacity(p) >= Math.max(target.storage, storage)));
    // SATA también sirve en el perfil básico; no usamos HDD como disco del sistema.
    const basicDisk = Math.max(target.storage, storage) <= 480
      ? cheapest(items('storage').filter(p => p.storageType.startsWith('SSD') && capacity(p) >= 480)) : disk;
    if (!basicDisk) return null;

    for (const cpu of cpus) for (const gpu of gpus) {
      const hasGpu = gpu.id !== 'gpu-none';
      if (!hasGpu && !cpu.hasIgpu) continue;
      const cooler = cheapest(items('cooler').filter(p => p.sockets?.includes(cpu.socket) &&
        (p.id === 'cooler-stock' ? cpu.hasCooler && cpu.tdp <= p.maxTdp : p.maxTdp >= cpu.tdp)));
      if (!cooler) continue;
      // Conservador ante modelos de GPU genéricos: alimentación y conectores se
      // confirman con el modelo exacto. Para 16 pines elegimos fuentes ATX 3 de esta lista.
      const minPsu = { 'gpu-6600': 450, 'gpu-7600': 550, 'gpu-4060': 550, 'gpu-5060': 550, 'gpu-9060xt': 550, 'gpu-5060ti': 600 };
      const watts = Math.max(minPsu[gpu.id] || 450, cpu.tdp + gpu.tdp + 200);
      const psu = cheapest(items('psu').filter(p => p.wattage >= watts &&
        (!gpu.powerConnectors?.includes('16-pin') || ['psu-a750gl', 'psu-rm750e', 'psu-a850gl', 'psu-rm850e'].includes(p.id))));
      if (!psu) continue;
      for (const motherboard of items('motherboard')) {
        if (motherboard.socket !== cpu.socket || (cpu.ramType !== 'DDR4/DDR5' && motherboard.ramType !== cpu.ramType)) continue;
        if (basicDisk.interface === 'NVMe M.2' && !motherboard.m2Slots) continue;
        const ram = cheapest(items('ram').filter(p => p.type === motherboard.ramType && p.modules === 2 && capacity(p) >= target.ram));
        const adapter = wifi && !motherboard.hasWifi
          ? cheapest(items('wifi').filter(p => /Wi-Fi/.test(p.features) && p.interface.startsWith('USB'))) : null;
        if (!ram || (wifi && !motherboard.hasWifi && !adapter)) continue;
        for (const pccase of items('pccase')) {
          if (!pccase.formFactors?.includes(motherboard.formFactor) || (hasGpu && gpu.length > pccase.maxGpuLength)) continue;
          const missingFans = Math.max(0, (hasGpu ? 2 : 1) - pccase.includedFans);
          const fans = missingFans ? cheapest(items('fans').filter(p => p.size === 120 && p.quantity >= missingFans)) : null;
          if (missingFans && !fans) continue;
          const build = { cpu, motherboard, ram, gpu, storage: basicDisk, psu, pccase, cooler, fans, wifi: adapter };
          const compatibility = checkCompatibility(build);
          if (compatibility.errors.length || compatibility.warnings.some(w => !w.cats.includes('os'))) continue;
          const cost = total(build) + assembly;
          if (!best || cost < best.total) best = { build, parts: total(build), assembly, total: cost };
        }
      }
    }
    return best;
  }

  function recommend({ use, goal, budget, reserve = 0, storage = 0, wifi = false }, db = PC_DB) {
    const profiles = uses[use]?.profiles;
    const index = profiles?.findIndex(p => p.id === goal) ?? -1;
    if (index < 0 || !Number.isFinite(budget) || budget <= 0 || !Number.isFinite(reserve) || reserve < 0 || reserve >= budget || ![0, 1000, 2000].includes(storage)) {
      return { status: 'invalid' };
    }
    const available = budget - reserve;
    const requested = profiles[index];
    const options = profiles.slice(0, index + 1).map(target => ({ target, proposal: findBuild(db, target, { storage, wifi }) }));
    const desired = options[index].proposal;
    // Primero cumplir el objetivo al menor costo. Solo ofrecer un objetivo menor
    // cuando el solicitado no entra; nunca aumentar el objetivo por tener más dinero.
    const chosen = [...options].reverse().find(o => o.proposal && o.proposal.total <= available);
    const minimum = options.filter(o => o.proposal).sort((a, b) => a.proposal.total - b.proposal.total)[0];
    return {
      status: chosen ? (chosen.target.id === goal ? 'recommended' : 'alternative') : (minimum ? 'insufficient' : 'unavailable'),
      requested, target: chosen?.target, proposal: chosen?.proposal,
      desiredTotal: desired?.total, minimumTotal: minimum?.proposal.total,
      budget, reserve, available, wifi, storage,
      savings: chosen ? available - chosen.proposal.total : 0,
    };
  }
  return { uses, recommend, assembly };
})();
