const CATEGORY_ORDER = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'pccase', 'cooler', 'fans', 'wifi', 'os'];

const CATEGORY_INFO = {
  cpu: { label: 'Procesador (CPU)', icon: '🔲', required: true },
  motherboard: { label: 'Motherboard', icon: '📋', required: true },
  ram: { label: 'Memoria RAM', icon: '🧩', required: true },
  gpu: { label: 'Placa de video (GPU)', icon: '🎮', required: false, note: 'No requerido si el CPU tiene gráficos integrados' },
  storage: { label: 'Almacenamiento', icon: '💾', required: true },
  psu: { label: 'Fuente de alimentación', icon: '⚡', required: true },
  pccase: { label: 'Gabinete', icon: '🖥️', required: true },
  cooler: { label: 'Cooler CPU', icon: '❄️', required: false, note: 'No requerido si el CPU incluye cooler' },
  fans: { label: 'Ventiladores extra', icon: '🌀', optional: true },
  wifi: { label: 'Adaptador WiFi / Bluetooth', icon: '📶', optional: true },
  os: { label: 'Sistema operativo', icon: '💿', optional: true }
};

const PC_DB = {
  cpu: [
    { id: 'cpu-4600g', img: 'public/img/placeholder.jpg', name: 'AMD Ryzen 5 4600G (ejemplo)', price: 110000, socket: 'AM4', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR4' },
    { id: 'cpu-12100f', img: 'public/img/placeholder.jpg', name: 'Intel Core i3-12100F (ejemplo)', price: 115000, socket: 'LGA1700', tdp: 58, hasIgpu: false, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-5600', img: 'public/img/placeholder.jpg', name: 'AMD Ryzen 5 5600 (ejemplo)', price: 160000, socket: 'AM4', tdp: 65, hasIgpu: false, hasCooler: true, ramType: 'DDR4' },
    { id: 'cpu-12400f', img: 'public/img/placeholder.jpg', name: 'Intel Core i5-12400F (ejemplo)', price: 165000, socket: 'LGA1700', tdp: 65, hasIgpu: false, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-5600g', img: 'public/img/placeholder.jpg', name: 'AMD Ryzen 5 5600G (ejemplo)', price: 170000, socket: 'AM4', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR4' },
    { id: 'cpu-5700x', img: 'public/img/placeholder.jpg', name: 'AMD Ryzen 7 5700X (ejemplo)', price: 230000, socket: 'AM4', tdp: 65, hasIgpu: false, hasCooler: false, ramType: 'DDR4' },
    { id: 'cpu-7600', img: 'public/img/placeholder.jpg', name: 'AMD Ryzen 5 7600 (ejemplo)', price: 250000, socket: 'AM5', tdp: 65, hasIgpu: false, hasCooler: true, ramType: 'DDR5' },
    { id: 'cpu-5800x', img: 'public/img/placeholder.jpg', name: 'AMD Ryzen 7 5800X (ejemplo)', price: 270000, socket: 'AM4', tdp: 105, hasIgpu: false, hasCooler: false, ramType: 'DDR4' },
    { id: 'cpu-14600kf', img: 'public/img/placeholder.jpg', name: 'Intel Core i5-14600KF (ejemplo)', price: 340000, socket: 'LGA1700', tdp: 125, hasIgpu: false, hasCooler: false, ramType: 'DDR4/DDR5' },
    { id: 'cpu-7700x', img: 'public/img/placeholder.jpg', name: 'AMD Ryzen 7 7700X (ejemplo)', price: 370000, socket: 'AM5', tdp: 105, hasIgpu: false, hasCooler: false, ramType: 'DDR5' },
    { id: 'cpu-14700kf', img: 'public/img/placeholder.jpg', name: 'Intel Core i7-14700KF (ejemplo)', price: 460000, socket: 'LGA1700', tdp: 125, hasIgpu: false, hasCooler: false, ramType: 'DDR4/DDR5' },
    { id: 'cpu-7800x3d', img: 'public/img/placeholder.jpg', name: 'AMD Ryzen 7 7800X3D (ejemplo)', price: 550000, socket: 'AM5', tdp: 120, hasIgpu: false, hasCooler: false, ramType: 'DDR5' }
  ],
  
  motherboard: [
    { id: 'mb-a520m', img: 'public/img/placeholder.jpg', name: 'A520M (ejemplo)', price: 75000, socket: 'AM4', chipset: 'A520', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 1, hasWifi: false },
    { id: 'mb-b550m', img: 'public/img/placeholder.jpg', name: 'B550M (ejemplo)', price: 95000, socket: 'AM4', chipset: 'B550', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: false },
    { id: 'mb-b660m', img: 'public/img/placeholder.jpg', name: 'B660M (ejemplo)', price: 110000, socket: 'LGA1700', chipset: 'B660', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: false },
    { id: 'mb-b550', img: 'public/img/placeholder.jpg', name: 'B550 (ejemplo)', price: 130000, socket: 'AM4', chipset: 'B550', ramType: 'DDR4', formFactor: 'ATX', m2Slots: 2, hasWifi: true },
    { id: 'mb-b760m', img: 'public/img/placeholder.jpg', name: 'B760M (ejemplo)', price: 145000, socket: 'LGA1700', chipset: 'B760', ramType: 'DDR5', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: true },
    { id: 'mb-b650m', img: 'public/img/placeholder.jpg', name: 'B650M (ejemplo)', price: 180000, socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: true },
    { id: 'mb-z790', img: 'public/img/placeholder.jpg', name: 'Z790 (ejemplo)', price: 320000, socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', formFactor: 'ATX', m2Slots: 4, hasWifi: true },
    { id: 'mb-x670', img: 'public/img/placeholder.jpg', name: 'X670 (ejemplo)', price: 380000, socket: 'AM5', chipset: 'X670', ramType: 'DDR5', formFactor: 'ATX', m2Slots: 4, hasWifi: true }
  ],

  ram: [
    { id: 'ram-8gb-ddr4', img: 'public/img/placeholder.jpg', name: '8GB DDR4 3200MHz (ejemplo)', price: 35000, type: 'DDR4', speed: 3200, capacity: '8 GB (1x8)', modules: 1 },
    { id: 'ram-16gb-ddr4', img: 'public/img/placeholder.jpg', name: '16GB DDR4 3200MHz (ejemplo)', price: 65000, type: 'DDR4', speed: 3200, capacity: '16 GB (2x8)', modules: 2 },
    { id: 'ram-16gb-ddr5', img: 'public/img/placeholder.jpg', name: '16GB DDR5 5600MHz (ejemplo)', price: 90000, type: 'DDR5', speed: 5600, capacity: '16 GB (2x8)', modules: 2 },
    { id: 'ram-32gb-ddr4', img: 'public/img/placeholder.jpg', name: '32GB DDR4 3200MHz (ejemplo)', price: 125000, type: 'DDR4', speed: 3200, capacity: '32 GB (2x16)', modules: 2 },
    { id: 'ram-32gb-ddr5-5600', img: 'public/img/placeholder.jpg', name: '32GB DDR5 5600MHz (ejemplo)', price: 170000, type: 'DDR5', speed: 5600, capacity: '32 GB (2x16)', modules: 2 },
    { id: 'ram-32gb-ddr5-6000', img: 'public/img/placeholder.jpg', name: '32GB DDR5 6000MHz (ejemplo)', price: 190000, type: 'DDR5', speed: 6000, capacity: '32 GB (2x16)', modules: 2 }
  ],

  gpu: [
    { id: 'gpu-none', img: 'public/img/placeholder.jpg', name: 'Sin GPU dedicada (usar gráficos integrados) (ejemplo)', price: 0, tdp: 0, length: 0, powerConnectors: 'Ninguno' },
    { id: 'gpu-1030', img: 'public/img/placeholder.jpg', name: 'GT 1030 (ejemplo)', price: 120000, tdp: 30, length: 150, powerConnectors: 'Ninguno' },
    { id: 'gpu-6600', img: 'public/img/placeholder.jpg', name: 'RX 6600 (ejemplo)', price: 290000, tdp: 132, length: 240, powerConnectors: '1x8-pin' },
    { id: 'gpu-3060', img: 'public/img/placeholder.jpg', name: 'RTX 3060 (ejemplo)', price: 340000, tdp: 170, length: 242, powerConnectors: '1x8-pin' },
    { id: 'gpu-4060', img: 'public/img/placeholder.jpg', name: 'RTX 4060 (ejemplo)', price: 390000, tdp: 115, length: 250, powerConnectors: '1x8-pin' },
    { id: 'gpu-4060ti', img: 'public/img/placeholder.jpg', name: 'RTX 4060 Ti (ejemplo)', price: 520000, tdp: 160, length: 260, powerConnectors: '1x8-pin' },
    { id: 'gpu-4070', img: 'public/img/placeholder.jpg', name: 'RTX 4070 (ejemplo)', price: 780000, tdp: 200, length: 290, powerConnectors: '1x16-pin' },
    { id: 'gpu-4070s', img: 'public/img/placeholder.jpg', name: 'RTX 4070 Super (ejemplo)', price: 890000, tdp: 220, length: 305, powerConnectors: '1x16-pin' }
  ],

  storage: [
    { id: 'st-sata-240', img: 'public/img/placeholder.jpg', name: 'SSD SATA 240GB (ejemplo)', price: 28000, storageType: 'SSD SATA', capacity: '240 GB', interface: 'SATA' },
    { id: 'st-sata-480', img: 'public/img/placeholder.jpg', name: 'SSD SATA 480GB (ejemplo)', price: 42000, storageType: 'SSD SATA', capacity: '480 GB', interface: 'SATA' },
    { id: 'st-hdd-1tb', img: 'public/img/placeholder.jpg', name: 'HDD 1TB (ejemplo)', price: 60000, storageType: 'HDD', capacity: '1 TB', interface: 'SATA' },
    { id: 'st-nvme-500', img: 'public/img/placeholder.jpg', name: 'SSD NVMe 500GB (ejemplo)', price: 65000, storageType: 'SSD NVMe', capacity: '500 GB', interface: 'NVMe M.2' },
    { id: 'st-sata-1tb', img: 'public/img/placeholder.jpg', name: 'SSD SATA 1TB (ejemplo)', price: 80000, storageType: 'SSD SATA', capacity: '1 TB', interface: 'SATA' },
    { id: 'st-hdd-2tb', img: 'public/img/placeholder.jpg', name: 'HDD 2TB (ejemplo)', price: 85000, storageType: 'HDD', capacity: '2 TB', interface: 'SATA' },
    { id: 'st-nvme-1tb', img: 'public/img/placeholder.jpg', name: 'SSD NVMe 1TB (ejemplo)', price: 110000, storageType: 'SSD NVMe', capacity: '1 TB', interface: 'NVMe M.2' },
    { id: 'st-nvme-2tb', img: 'public/img/placeholder.jpg', name: 'SSD NVMe 2TB (ejemplo)', price: 195000, storageType: 'SSD NVMe', capacity: '2 TB', interface: 'NVMe M.2' }
  ],

  psu: [
    { id: 'psu-500w', img: 'public/img/placeholder.jpg', name: 'Fuente 500W Generica (ejemplo)', price: 48000, wattage: 500, certification: 'Sin certificar', modular: 'No' },
    { id: 'psu-550w', img: 'public/img/placeholder.jpg', name: 'Fuente 550W 80+ Bronze (ejemplo)', price: 75000, wattage: 550, certification: '80+ Bronze', modular: 'No' },
    { id: 'psu-650w', img: 'public/img/placeholder.jpg', name: 'Fuente 650W 80+ Bronze (ejemplo)', price: 95000, wattage: 650, certification: '80+ Bronze', modular: 'No' },
    { id: 'psu-750w', img: 'public/img/placeholder.jpg', name: 'Fuente 750W 80+ Gold (ejemplo)', price: 145000, wattage: 750, certification: '80+ Gold', modular: 'Full modular' },
    { id: 'psu-850w', img: 'public/img/placeholder.jpg', name: 'Fuente 850W 80+ Gold (ejemplo)', price: 180000, wattage: 850, certification: '80+ Gold', modular: 'Full modular' },
    { id: 'psu-1000w', img: 'public/img/placeholder.jpg', name: 'Fuente 1000W 80+ Platinum (ejemplo)', price: 260000, wattage: 1000, certification: '80+ Platinum', modular: 'Full modular' }
  ],

  pccase: [
    { id: 'case-matx', img: 'public/img/placeholder.jpg', name: 'Gabinete M-ATX Basico (ejemplo)', price: 40000, formFactors: ['Micro-ATX', 'Mini-ITX'], maxGpuLength: 300, includedFans: 0 },
    { id: 'case-atx-1fan', img: 'public/img/placeholder.jpg', name: 'Gabinete ATX 1 Fan (ejemplo)', price: 65000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 330, includedFans: 1 },
    { id: 'case-atx-3fan', img: 'public/img/placeholder.jpg', name: 'Gabinete ATX 3 Fans (ejemplo)', price: 85000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 350, includedFans: 3 },
    { id: 'case-atx-4fan', img: 'public/img/placeholder.jpg', name: 'Gabinete ATX 4 Fans Mesh (ejemplo)', price: 110000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 380, includedFans: 4 },
    { id: 'case-premium', img: 'public/img/placeholder.jpg', name: 'Gabinete ATX Full Premium (ejemplo)', price: 190000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 400, includedFans: 4 }
  ],

  cooler: [
    { id: 'cooler-stock', img: 'public/img/placeholder.jpg', name: 'Cooler de stock (incluido con el CPU) (ejemplo)', price: 0, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 65, type: 'Aire' },
    { id: 'cooler-se214', img: 'public/img/placeholder.jpg', name: 'ID Cooling SE-214 (ejemplo)', price: 38000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 150, type: 'Aire' },
    { id: 'cooler-ak400', img: 'public/img/placeholder.jpg', name: 'DeepCool AK400 (ejemplo)', price: 55000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 220, type: 'Aire' },
    { id: 'cooler-aio240', img: 'public/img/placeholder.jpg', name: 'NZXT Kraken 240 (ejemplo)', price: 145000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 250, type: 'AIO 240mm' },
    { id: 'cooler-d15', img: 'public/img/placeholder.jpg', name: 'Noctua NH-D15 (ejemplo)', price: 160000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 250, type: 'Aire' },
    { id: 'cooler-aio360', img: 'public/img/placeholder.jpg', name: 'Arctic Freezer II 360 (ejemplo)', price: 175000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 300, type: 'AIO 360mm' }
  ],

  fans: [
    { id: 'fan-140', img: 'public/img/placeholder.jpg', name: 'Ventilador 140mm (ejemplo)', price: 16000, size: 140, quantity: 1 },
    { id: 'fan-120-x3', img: 'public/img/placeholder.jpg', name: 'Pack 3x 120mm (ejemplo)', price: 35000, size: 120, quantity: 3 },
    { id: 'fan-120-x5', img: 'public/img/placeholder.jpg', name: 'Pack 5x 120mm ARGB (ejemplo)', price: 58000, size: 120, quantity: 5 }
  ],

  wifi: [
    { id: 'wifi-usb', img: 'public/img/placeholder.jpg', name: 'Adaptador USB WiFi (ejemplo)', price: 15000, interface: 'USB', features: 'WiFi 5' },
    { id: 'wifi-pcie', img: 'public/img/placeholder.jpg', name: 'Placa PCIe WiFi 6 + Bluetooth (ejemplo)', price: 42000, interface: 'PCIe', features: 'WiFi 6, BT 5.2' }
  ],

  os: [
    { id: 'os-linux', img: 'public/img/placeholder.jpg', name: 'Linux (ejemplo)', price: 0, type: 'Gratis' },
    { id: 'os-win11h', img: 'public/img/placeholder.jpg', name: 'Windows 11 Home (ejemplo)', price: 35000, type: 'Licencia OEM' },
    { id: 'os-win11p', img: 'public/img/placeholder.jpg', name: 'Windows 11 Pro (ejemplo)', price: 110000, type: 'Licencia Retail' }
  ]
};
