/**
 * @typedef {Object} Build
 * @property {Object|null} cpu
 * @property {Object|null} motherboard
 * @property {Object|null} ram
 * @property {Object|null} gpu
 * @property {Object|null} storage
 * @property {Object|null} storage2
 * @property {Object|null} psu
 * @property {Object|null} pccase
 * @property {Object|null} cooler
 * @property {Object|null} fans
 * @property {Object|null} wifi
 * @property {Object|null} os
 */

/**
 * Verifica la compatibilidad de los componentes seleccionados.
 * @param {Build} build - La configuración actual.
 * @returns {{ errors: Array<{msg: string, cats: string[]}>, warnings: Array<{msg: string, cats: string[]}>, isValid: boolean }}
 */
const checkCompatibility = (build) => {
  const errors = [];
  const warnings = [];

  // Errors
  if (build.cpu && build.motherboard && build.cpu.socket !== build.motherboard.socket) {
    errors.push({ msg: 'El socket del CPU no coincide con el de la motherboard', cats: ['cpu', 'motherboard'] });
  }

  if (build.ram && build.motherboard && build.ram.type !== build.motherboard.ramType) {
    errors.push({ msg: 'El tipo de memoria RAM no es compatible con la motherboard', cats: ['ram', 'motherboard'] });
  }

  if (build.gpu && build.gpu.id !== 'gpu-none' && build.pccase && build.gpu.length > build.pccase.maxGpuLength) {
    errors.push({ msg: 'La placa de video es demasiado larga para el gabinete', cats: ['gpu', 'pccase'] });
  }

  if (build.motherboard && build.pccase && !build.pccase.formFactors.includes(build.motherboard.formFactor)) {
    errors.push({ msg: 'El tamaño de la motherboard (form factor) no es soportado por el gabinete', cats: ['motherboard', 'pccase'] });
  }

  if (build.motherboard && build.storage && build.storage.interface === 'NVMe M.2' && build.motherboard.m2Slots === 0) {
    errors.push({ msg: 'La unidad de almacenamiento NVMe M.2 requiere un slot M.2 en la motherboard', cats: ['storage', 'motherboard'] });
  }

  if (build.motherboard && build.storage && build.storage.interface === 'NVMe M.2' && build.storage2 && build.storage2.interface === 'NVMe M.2' && build.motherboard.m2Slots < 2) {
    errors.push({ msg: 'Seleccionaste dos unidades NVMe M.2 pero la motherboard no tiene suficientes slots', cats: ['storage', 'storage2', 'motherboard'] });
  }

  // Warnings
  if (build.psu) {
    const estWatts = estimatePowerConsumption(build);
    if (build.psu.wattage < estWatts + 100) {
      warnings.push({ msg: 'La fuente podría ser insuficiente', cats: ['psu'] });
    }
  }

  if (build.cpu && !build.cpu.hasIgpu && (!build.gpu || build.gpu.id === 'gpu-none')) {
    warnings.push({ msg: 'El CPU no tiene gráficos integrados y no hay GPU dedicada', cats: ['cpu', 'gpu'] });
  }

  if (build.cpu && build.cooler && build.cooler.id !== 'cooler-stock' && build.cpu.tdp > build.cooler.maxTdp) {
    warnings.push({ msg: 'El cooler podría no ser suficiente para el TDP del CPU', cats: ['cpu', 'cooler'] });
  }

  if (build.cpu && !build.cpu.hasCooler && (!build.cooler || build.cooler.id === 'cooler-stock')) {
    warnings.push({ msg: 'Este CPU no incluye cooler, necesitás uno aparte', cats: ['cpu', 'cooler'] });
  }

  if (build.wifi && build.motherboard && build.motherboard.hasWifi) {
    warnings.push({ msg: 'La motherboard ya incluye WiFi', cats: ['wifi', 'motherboard'] });
  }

  if (!build.os) {
    warnings.push({ msg: 'No seleccionaste sistema operativo', cats: ['os'] });
  }

  return { errors, warnings, isValid: errors.length === 0 };
};

/**
 * Filtra las opciones de componentes según la configuración actual.
 * @param {string} category - La categoría a filtrar.
 * @param {Build} build - La configuración actual.
 * @returns {Array<Object>} Opciones filtradas.
 */
const getFilteredOptions = (category, build) => {
  const options = PC_DB[category];
  if (!options) return [];

  if (category === 'motherboard') {
    return options.filter(mobo => {
      if (build.cpu) {
        if (mobo.socket !== build.cpu.socket) return false;
        if (build.cpu.ramType !== 'DDR4/DDR5' && mobo.ramType !== build.cpu.ramType) return false;
      }
      return true;
    });
  }

  if (category === 'ram') {
    return options.filter(r => {
      if (build.motherboard && r.type !== build.motherboard.ramType) return false;
      return true;
    });
  }

  if (category === 'cooler') {
    return options.filter(c => {
      if (c.id === 'cooler-stock') return true; 
      if (build.cpu && !c.sockets.includes(build.cpu.socket)) return false;
      return true;
    });
  }

  return options;
};

/**
 * Estima el consumo de energía (en Watts) de la configuración.
 * @param {Build} build - La configuración actual.
 * @returns {number} Consumo estimado.
 */
const estimatePowerConsumption = (build) => {
  let total = 100;
  if (build.cpu) total += build.cpu.tdp;
  if (build.gpu) total += build.gpu.tdp;
  return total;
};
