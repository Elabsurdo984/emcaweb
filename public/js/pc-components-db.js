const CATEGORY_ORDER = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'pccase', 'cooler', 'fans', 'wifi', 'os'];

const CATEGORY_INFO = {
  cpu: { label: 'Procesador (CPU)', required: true },
  motherboard: { label: 'Motherboard', required: true },
  ram: { label: 'Memoria RAM', required: true },
  gpu: { label: 'Placa de video (GPU)', required: false, note: 'No requerido si el CPU tiene gráficos integrados' },
  storage: { label: 'Almacenamiento', required: true },
  psu: { label: 'Fuente de alimentación', required: true },
  pccase: { label: 'Gabinete', required: true },
  cooler: { label: 'Cooler CPU', required: false, note: 'No requerido si el CPU incluye cooler' },
  fans: { label: 'Ventiladores extra', optional: true },
  wifi: { label: 'Adaptador WiFi / Bluetooth', optional: true },
  os: { label: 'Sistema operativo', optional: true }
};

const PC_DB = {
  cpu: [
    { id: 'cpu-4500', img: 'public/img/cpu/ryzen54500.png', name: 'AMD Ryzen 5 4500', priceUsd: 78, price: 122000, socket: 'AM4', tdp: 65, hasIgpu: false, hasCooler: true, ramType: 'DDR4' },
    { id: 'cpu-3600', img: 'public/img/cpu/ryzen53600.png', name: 'AMD Ryzen 5 3600', priceUsd: 88, price: 137000, socket: 'AM4', tdp: 65, hasIgpu: false, hasCooler: true, ramType: 'DDR4' },
    { id: 'cpu-5500', img: 'public/img/cpu/ryzen55500.png', name: 'AMD Ryzen 5 5500', priceUsd: 99, price: 155000, socket: 'AM4', tdp: 65, hasIgpu: false, hasCooler: true, ramType: 'DDR4' },
    { id: 'cpu-12100f', img: 'public/img/cpu/corei312100f.png', name: 'Intel Core i3-12100F', priceUsd: 112, price: 175000, socket: 'LGA1700', tdp: 58, hasIgpu: false, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-14100f', img: 'public/img/cpu/corei314100f.png', name: 'Intel Core i3-14100F', priceUsd: 118, price: 184000, socket: 'LGA1700', tdp: 58, hasIgpu: false, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-12100', img: 'public/img/cpu/corei312100.png', name: 'Intel Core i3-12100', priceUsd: 125, price: 195000, socket: 'LGA1700', tdp: 60, hasIgpu: true, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-5600', img: 'public/img/cpu/ryzen55600.png', name: 'AMD Ryzen 5 5600', priceUsd: 135, price: 210000, socket: 'AM4', tdp: 65, hasIgpu: false, hasCooler: true, ramType: 'DDR4' },
    { id: 'cpu-14100', img: 'public/img/cpu/corei314100.png', name: 'Intel Core i3-14100', priceUsd: 138, price: 215000, socket: 'LGA1700', tdp: 60, hasIgpu: true, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-5600g', img: 'public/img/cpu/ryzen55600G.png', name: 'AMD Ryzen 5 5600G', priceUsd: 144, price: 225000, socket: 'AM4', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR4' },
    { id: 'cpu-12400f', img: 'public/img/cpu/corei512400f.png', name: 'Intel Core i5-12400F', priceUsd: 151, price: 235000, socket: 'LGA1700', tdp: 65, hasIgpu: false, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-5600gt', img: 'public/img/cpu/ryzen55600gt.png', name: 'AMD Ryzen 5 5600GT', priceUsd: 154, price: 240000, socket: 'AM4', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR4' },
    { id: 'cpu-12400', img: 'public/img/cpu/corei512400.png', name: 'Intel Core i5-12400', priceUsd: 176, price: 275000, socket: 'LGA1700', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-13400f', img: 'public/img/cpu/corei513400F.png', name: 'Intel Core i5-13400F', priceUsd: 189, price: 295000, socket: 'LGA1700', tdp: 65, hasIgpu: false, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-5700x', img: 'public/img/cpu/ryzen75700x.png', name: 'AMD Ryzen 7 5700X', priceUsd: 199, price: 310000, socket: 'AM4', tdp: 65, hasIgpu: false, hasCooler: false, ramType: 'DDR4' },
    { id: 'cpu-7500f', img: 'public/img/cpu/ryzen57500f.png', name: 'AMD Ryzen 5 7500F', priceUsd: 199, price: 310000, socket: 'AM5', tdp: 65, hasIgpu: false, hasCooler: false, ramType: 'DDR5' },
    { id: 'cpu-8600g', img: 'public/img/cpu/ryzen58600g.png', name: 'AMD Ryzen 5 8600G', priceUsd: 208, price: 325000, socket: 'AM5', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR5' },
    { id: 'cpu-5700g', img: 'public/img/cpu/ryzen75700G.png', name: 'AMD Ryzen 7 5700G', priceUsd: 212, price: 330000, socket: 'AM4', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR4' },
    { id: 'cpu-14400f', img: 'public/img/cpu/corei514400F.png', name: 'Intel Core i5-14400F', priceUsd: 215, price: 335000, socket: 'LGA1700', tdp: 65, hasIgpu: false, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-5800x', img: 'public/img/cpu/ryzen75800x.png', name: 'AMD Ryzen 7 5800X', priceUsd: 215, price: 335000, socket: 'AM4', tdp: 105, hasIgpu: false, hasCooler: false, ramType: 'DDR4' },
    { id: 'cpu-7600', img: 'public/img/cpu/ryzen57600.png', name: 'AMD Ryzen 5 7600', priceUsd: 221, price: 345000, socket: 'AM5', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR5' },
    { id: 'cpu-9600', img: 'public/img/cpu/ryzen59600.png', name: 'AMD Ryzen 5 9600', priceUsd: 263, price: 410000, socket: 'AM5', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR5' },
    { id: 'cpu-5700x3d', img: 'public/img/cpu/ryzen75700x3d.png', name: 'AMD Ryzen 7 5700X3D', priceUsd: 295, price: 460000, socket: 'AM4', tdp: 105, hasIgpu: false, hasCooler: false, ramType: 'DDR4' },
    { id: 'cpu-5900x', img: 'public/img/cpu/ryzen95900x.png', name: 'AMD Ryzen 9 5900X', priceUsd: 295, price: 460000, socket: 'AM4', tdp: 105, hasIgpu: false, hasCooler: false, ramType: 'DDR4' },
    { id: 'cpu-14600k', img: 'public/img/cpu/corei514600k.png', name: 'Intel Core i5-14600K', priceUsd: 304, price: 475000, socket: 'LGA1700', tdp: 125, hasIgpu: true, hasCooler: false, ramType: 'DDR4/DDR5' },
    { id: 'cpu-12700', img: 'public/img/cpu/corei712700.png', name: 'Intel Core i7-12700', priceUsd: 314, price: 490000, socket: 'LGA1700', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR4/DDR5' },
    { id: 'cpu-7700', img: 'public/img/cpu/ryzen77700.png', name: 'AMD Ryzen 7 7700', priceUsd: 327, price: 510000, socket: 'AM5', tdp: 65, hasIgpu: true, hasCooler: true, ramType: 'DDR5' },
    { id: 'cpu-12900k', img: 'public/img/cpu/corei912900k.png', name: 'Intel Core i9-12900K', priceUsd: 380, price: 593000, socket: 'LGA1700', tdp: 125, hasIgpu: true, hasCooler: false, ramType: 'DDR4/DDR5' },
    { id: 'cpu-14700k', img: 'public/img/cpu/corei714700k.png', name: 'Intel Core i7-14700K', priceUsd: 397, price: 620000, socket: 'LGA1700', tdp: 125, hasIgpu: true, hasCooler: false, ramType: 'DDR4/DDR5' },
    { id: 'cpu-7900x', img: 'public/img/cpu/ryzen97900x.png', name: 'AMD Ryzen 9 7900X', priceUsd: 410, price: 640000, socket: 'AM5', tdp: 170, hasIgpu: true, hasCooler: false, ramType: 'DDR5' },
    { id: 'cpu-7800x3d', img: 'public/img/cpu/ryzen77800x3d.png', name: 'AMD Ryzen 7 7800X3D', priceUsd: 468, price: 730000, socket: 'AM5', tdp: 120, hasIgpu: true, hasCooler: false, ramType: 'DDR5' },
    { id: 'cpu-13900k', img: 'public/img/cpu/corei913900k.png', name: 'Intel Core i9-13900K', priceUsd: 510, price: 795000, socket: 'LGA1700', tdp: 125, hasIgpu: true, hasCooler: false, ramType: 'DDR4/DDR5' },
    { id: 'cpu-9800x3d', img: 'public/img/cpu/ryzen79800x3d.png', name: 'AMD Ryzen 7 9800X3D', priceUsd: 526, price: 820000, socket: 'AM5', tdp: 120, hasIgpu: true, hasCooler: false, ramType: 'DDR5' },
    { id: 'cpu-7950x', img: 'public/img/cpu/ryzen97950x.png', name: 'AMD Ryzen 9 7950X', priceUsd: 550, price: 858000, socket: 'AM5', tdp: 170, hasIgpu: true, hasCooler: false, ramType: 'DDR5' },
    { id: 'cpu-14900k', img: 'public/img/cpu/corei914900k.png', name: 'Intel Core i9-14900K', priceUsd: 575, price: 897000, socket: 'LGA1700', tdp: 125, hasIgpu: true, hasCooler: false, ramType: 'DDR4/DDR5' },
    { id: 'cpu-7950x3d', img: 'public/img/cpu/ryzen87950x3d.png', name: 'AMD Ryzen 9 7950X3D', priceUsd: 620, price: 967000, socket: 'AM5', tdp: 120, hasIgpu: true, hasCooler: false, ramType: 'DDR5' },
  ],

  motherboard: [
    { id: 'mb-a520m-k', img: 'public/img/motherboard/gigabytea520m.png', name: 'Gigabyte A520M K V2', priceUsd: 67, price: 105000, socket: 'AM4', chipset: 'A520', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 1, hasWifi: false },
    { id: 'mb-a520m-asus', img: 'public/img/motherboard/asusprimea520mk.png', name: 'ASUS Prime A520M-K', priceUsd: 71, price: 110000, socket: 'AM4', chipset: 'A520', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 1, hasWifi: false },
    { id: 'mb-a520m-msi', img: 'public/img/motherboard/msia520apro.png', name: 'MSI A520M-A PRO', priceUsd: 71, price: 110000, socket: 'AM4', chipset: 'A520', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 1, hasWifi: false },
    { id: 'mb-h610m-msi', img: 'public/img/motherboard/msiproh610ms.png', name: 'MSI PRO H610M-S DDR4', priceUsd: 80, price: 125000, socket: 'LGA1700', chipset: 'H610', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 1, hasWifi: false },
    { id: 'mb-h610m-gigabyte', img: 'public/img/motherboard/gigabyteh610mh.png', name: 'Gigabyte H610M H DDR4', priceUsd: 83, price: 130000, socket: 'LGA1700', chipset: 'H610', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 1, hasWifi: false },
    { id: 'mb-b550m-k', img: 'public/img/motherboard/gigabyteb550mk.png', name: 'Gigabyte B550M K', priceUsd: 93, price: 145000, socket: 'AM4', chipset: 'B550', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 1, hasWifi: false },
    { id: 'mb-b550m-ds3h', img: 'public/img/motherboard/gigabyteb550mds3h.png', name: 'Gigabyte B550M DS3H', priceUsd: 106, price: 165000, socket: 'AM4', chipset: 'B550', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: false },
    { id: 'mb-a620m-asus', img: 'public/img/motherboard/asusprimea620mk.png', name: 'ASUS Prime A620M-K', priceUsd: 106, price: 165000, socket: 'AM5', chipset: 'A620', ramType: 'DDR5', formFactor: 'Micro-ATX', m2Slots: 1, hasWifi: false },
    { id: 'mb-b660m-asus', img: 'public/img/motherboard/asusprimeb660ma.png', name: 'ASUS PRIME B660M-A D4', priceUsd: 112, price: 175000, socket: 'LGA1700', chipset: 'B660', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: false },
    { id: 'mb-b550m-pro-vdh', img: 'public/img/motherboard/msib550mprovdh.png', name: 'MSI B550M PRO-VDH', priceUsd: 115, price: 180000, socket: 'AM4', chipset: 'B550', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: false },
    { id: 'mb-b760m-gigabyte', img: 'public/img/motherboard/gigabyteb760mds3h.png', name: 'Gigabyte B760M DS3H DDR4', priceUsd: 122, price: 190000, socket: 'LGA1700', chipset: 'B760', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: false },
    { id: 'mb-b650m-msi', img: 'public/img/motherboard/msiprob650mb.png', name: 'MSI PRO B650M-B', priceUsd: 125, price: 195000, socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: false },
    { id: 'mb-b760m-d5-msi', img: 'public/img/motherboard/msiprob760mp.png', name: 'MSI PRO B760M-P DDR5', priceUsd: 135, price: 210000, socket: 'LGA1700', chipset: 'B760', ramType: 'DDR5', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: false },
    { id: 'mb-b650m-ds3h', img: 'public/img/motherboard/gigabyteb650mds3h.png', name: 'Gigabyte B650M DS3H', priceUsd: 138, price: 215000, socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: false },
    { id: 'mb-b550-gaming-plus', img: 'public/img/motherboard/msib550gamingplus.png', name: 'MSI B550 GAMING PLUS', priceUsd: 145, price: 226000, socket: 'AM4', chipset: 'B550', ramType: 'DDR4', formFactor: 'ATX', m2Slots: 2, hasWifi: false },
    { id: 'mb-b550m-pro-vdh-wifi', img: 'public/img/motherboard/msib550mprovdhwifi.png', name: 'MSI B550M PRO-VDH WiFi', priceUsd: 147, price: 230000, socket: 'AM4', chipset: 'B550', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: true },
    { id: 'mb-b760m-wifi', img: 'public/img/motherboard/msiprob760mawifi.png', name: 'MSI PRO B760M-A WiFi DDR4', priceUsd: 151, price: 235000, socket: 'LGA1700', chipset: 'B760', ramType: 'DDR4', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: true },
    { id: 'mb-b650m-wifi', img: 'public/img/motherboard/msiprob650mawifi.png', name: 'MSI PRO B650M-A WiFi', priceUsd: 163, price: 255000, socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: true },
    { id: 'mb-b760m-d5-gamingx', img: 'public/img/motherboard/b760mgamingxax.png', name: 'Gigabyte B760M GAMING X AX DDR5', priceUsd: 175, price: 273000, socket: 'LGA1700', chipset: 'B760', ramType: 'DDR5', formFactor: 'Micro-ATX', m2Slots: 2, hasWifi: true },
    { id: 'mb-b650-gaming-plus', img: 'public/img/motherboard/msib650gamingpluswifi.png', name: 'MSI B650 GAMING PLUS WIFI', priceUsd: 195, price: 304000, socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'ATX', m2Slots: 2, hasWifi: true },
    { id: 'mb-b550-strix', img: 'public/img/motherboard/rogstrixb550fgamingwifiii.png', name: 'ASUS ROG STRIX B550-F GAMING WIFI II', priceUsd: 210, price: 328000, socket: 'AM4', chipset: 'B550', ramType: 'DDR4', formFactor: 'ATX', m2Slots: 2, hasWifi: true },
    { id: 'mb-b650-aorus-elite', img: 'public/img/motherboard/b650aoruseliteax.png', name: 'Gigabyte B650 AORUS ELITE AX', priceUsd: 230, price: 359000, socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'ATX', m2Slots: 3, hasWifi: true },
    { id: 'mb-z790-msi', img: 'public/img/motherboard/msiproz790pwifi.png', name: 'MSI PRO Z790-P WIFI DDR5', priceUsd: 235, price: 367000, socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', formFactor: 'ATX', m2Slots: 4, hasWifi: true },
    { id: 'mb-z790-tuf', img: 'public/img/motherboard/tufgamingz790pluswifi.png', name: 'ASUS TUF Gaming Z790-PLUS WIFI DDR5', priceUsd: 285, price: 445000, socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', formFactor: 'ATX', m2Slots: 4, hasWifi: true },
    { id: 'mb-x670e-tuf', img: 'public/img/motherboard/tufgamingx670epluswifi.png', name: 'ASUS TUF Gaming X670E-PLUS WIFI', priceUsd: 320, price: 499000, socket: 'AM5', chipset: 'X670E', ramType: 'DDR5', formFactor: 'ATX', m2Slots: 4, hasWifi: true },
  ],

  ram: [
    { id: 'ram-8gb-ddr4', img: 'public/img/ram/kingstonfurybeast8gb.png', name: 'Kingston Fury Beast 8GB DDR4 3200', priceUsd: 31, price: 48000, type: 'DDR4', speed: 3200, capacity: '8 GB (1x8)', modules: 1 },
    { id: 'ram-16gb-ddr4', img: 'public/img/ram/kingston16gb2x8.png', name: 'Kingston Fury Beast 16GB (2x8) DDR4 3200', priceUsd: 56, price: 88000, type: 'DDR4', speed: 3200, capacity: '16 GB (2x8)', modules: 2 },
    { id: 'ram-16gb-corsair-ddr4', img: 'public/img/ram/vengeancelpx16gb2x8ddr4.png', name: 'Corsair Vengeance LPX 16GB (2x8) DDR4 3200', priceUsd: 58, price: 90000, type: 'DDR4', speed: 3200, capacity: '16 GB (2x8)', modules: 2 },
    { id: 'ram-16gb-xpg-d50', img: 'public/img/ram/spectrixd502x8gbddr4.png', name: 'XPG Spectrix D50 RGB 16GB (2x8) DDR4 3200', priceUsd: 65, price: 101000, type: 'DDR4', speed: 3200, capacity: '16 GB (2x8)', modules: 2 },
    { id: 'ram-16gb-ddr5', img: 'public/img/ram/kingstonfurybeast16gbddr5.png', name: 'Kingston Fury Beast 16GB (2x8) DDR5 6000', priceUsd: 87, price: 135000, type: 'DDR5', speed: 6000, capacity: '16 GB (2x8)', modules: 2 },
    { id: 'ram-32gb-ddr4', img: 'public/img/ram/kingstonfurybeast32gb2x16.png', name: 'Kingston Fury Beast 32GB (2x16) DDR4 3200', priceUsd: 103, price: 160000, type: 'DDR4', speed: 3200, capacity: '32 GB (2x16)', modules: 2 },
    { id: 'ram-32gb-corsair-ddr4', img: 'public/img/ram/vengeancelpx2x16gbddr4.png', name: 'Corsair Vengeance LPX 32GB (2x16) DDR4 3200', priceUsd: 105, price: 164000, type: 'DDR4', speed: 3200, capacity: '32 GB (2x16)', modules: 2 },
    { id: 'ram-32gb-xpg-d50', img: 'public/img/ram/spectrixd502x16gbddr4.png', name: 'XPG Spectrix D50 RGB 32GB (2x16) DDR4 3600', priceUsd: 118, price: 184000, type: 'DDR4', speed: 3600, capacity: '32 GB (2x16)', modules: 2 },
    { id: 'ram-32gb-ddr5', img: 'public/img/ram/kingstonfurybeast32gb2x16ddr5.png', name: 'Kingston Fury Beast 32GB (2x16) DDR5 6000', priceUsd: 144, price: 225000, type: 'DDR5', speed: 6000, capacity: '32 GB (2x16)', modules: 2 },
    { id: 'ram-32gb-corsair-ddr5', img: 'public/img/ram/vengeancelpx2x16gbddr5.png', name: 'Corsair Vengeance 32GB (2x16) DDR5 6000', priceUsd: 148, price: 231000, type: 'DDR5', speed: 6000, capacity: '32 GB (2x16)', modules: 2 },
    { id: 'ram-32gb-trident-ddr5', img: 'public/img/ram/tridentz52x16gbddr5.png', name: 'G.Skill Trident Z5 RGB 32GB (2x16) DDR5 6000', priceUsd: 175, price: 273000, type: 'DDR5', speed: 6000, capacity: '32 GB (2x16)', modules: 2 },
    { id: 'ram-64gb-ddr4', img: 'public/img/ram/kingstonfurybeast64gb2x32.png', name: 'Kingston Fury Beast 64GB (2x32) DDR4 3200', priceUsd: 199, price: 310000, type: 'DDR4', speed: 3200, capacity: '64 GB (2x32)', modules: 2 },
    { id: 'ram-64gb-ddr5', img: 'public/img/ram/kingstonfurybeast64gb2x32ddr5.png', name: 'Kingston Fury Beast 64GB (2x32) DDR5 6000', priceUsd: 269, price: 420000, type: 'DDR5', speed: 6000, capacity: '64 GB (2x32)', modules: 2 },
  ],

  gpu: [
    { id: 'gpu-none', img: 'public/img/placeholder.jpg', name: 'Sin GPU dedicada (usar gráficos integrados)', priceUsd: 0, price: 0, tdp: 0, length: 0, powerConnectors: 'Ninguno' },
    { id: 'gpu-1650', img: 'public/img/gpu/gtx16504gb.png', name: 'GeForce GTX 1650 4GB', priceUsd: 160, price: 250000, tdp: 75, length: 190, powerConnectors: '1x6-pin' },
    { id: 'gpu-6500xt', img: 'public/img/gpu/radeonrx6500xt4gb.png', name: 'Radeon RX 6500 XT 4GB', priceUsd: 175, price: 273000, tdp: 107, length: 200, powerConnectors: '1x6-pin' },
    { id: 'gpu-3050-6gb', img: 'public/img/gpu/rtx30506gb.png', name: 'GeForce RTX 3050 6GB', priceUsd: 195, price: 304000, tdp: 70, length: 190, powerConnectors: 'Ninguno' },
    { id: 'gpu-3050-8gb', img: 'public/img/gpu/rtx30508gb.png', name: 'GeForce RTX 3050 8GB', priceUsd: 215, price: 335000, tdp: 130, length: 240, powerConnectors: '1x8-pin' },
    { id: 'gpu-6600', img: 'public/img/gpu/radeonrx66008gb.png', name: 'Radeon RX 6600 8GB', priceUsd: 224, price: 350000, tdp: 132, length: 240, powerConnectors: '1x8-pin' },
    { id: 'gpu-b570', img: 'public/img/gpu/arcb57010gb.png', name: 'Intel Arc B570 10GB', priceUsd: 244, price: 380000, tdp: 150, length: 272, powerConnectors: '1x8-pin' },
    { id: 'gpu-5050', img: 'public/img/gpu/geforcertx50508gb.png', name: 'GeForce RTX 5050 8GB', priceUsd: 269, price: 420000, tdp: 130, length: 250, powerConnectors: '1x8-pin' },
    { id: 'gpu-7600', img: 'public/img/gpu/radeonrx76008gb.png', name: 'Radeon RX 7600 8GB', priceUsd: 288, price: 450000, tdp: 165, length: 240, powerConnectors: '1x8-pin' },
    { id: 'gpu-4060', img: 'public/img/gpu/geforcertx40608gb.png', name: 'GeForce RTX 4060 8GB', priceUsd: 333, price: 520000, tdp: 115, length: 250, powerConnectors: '1x8-pin' },
    { id: 'gpu-6700xt', img: 'public/img/gpu/radeonrx6700xt12gb.png', name: 'Radeon RX 6700 XT 12GB', priceUsd: 360, price: 562000, tdp: 230, length: 267, powerConnectors: '1x8-pin + 1x6-pin' },
    { id: 'gpu-5060', img: 'public/img/gpu/geforcertx50608gb.png', name: 'GeForce RTX 5060 8GB', priceUsd: 372, price: 580000, tdp: 145, length: 250, powerConnectors: '1x8-pin' },
    { id: 'gpu-7600xt', img: 'public/img/gpu/radeonrx7600xt16gb.png', name: 'Radeon RX 7600 XT 16GB', priceUsd: 375, price: 585000, tdp: 190, length: 250, powerConnectors: '2x8-pin' },
    { id: 'gpu-4060ti-8gb', img: 'public/img/gpu/rtx4060ti8gb.png', name: 'GeForce RTX 4060 Ti 8GB', priceUsd: 435, price: 679000, tdp: 160, length: 250, powerConnectors: '1x8-pin' },
    { id: 'gpu-9060xt', img: 'public/img/gpu/radeonrx9060xt16gb.png', name: 'Radeon RX 9060 XT 16GB', priceUsd: 436, price: 680000, tdp: 220, length: 280, powerConnectors: '1x16-pin' },
    { id: 'gpu-5060ti', img: 'public/img/gpu/geforcertx5060ti16gb.png', name: 'GeForce RTX 5060 Ti 16GB', priceUsd: 481, price: 750000, tdp: 180, length: 260, powerConnectors: '1x16-pin' },
    { id: 'gpu-4060ti-16gb', img: 'public/img/gpu/rtx4060ti16gb.png', name: 'GeForce RTX 4060 Ti 16GB', priceUsd: 495, price: 772000, tdp: 165, length: 250, powerConnectors: '1x8-pin' },
    { id: 'gpu-7700xt', img: 'public/img/gpu/radeonrx7700xt12gb.png', name: 'Radeon RX 7700 XT 12GB', priceUsd: 495, price: 772000, tdp: 245, length: 270, powerConnectors: '2x8-pin' },
    { id: 'gpu-7800xt', img: 'public/img/gpu/radeonrx7800xt16gb.png', name: 'Radeon RX 7800 XT 16GB', priceUsd: 595, price: 928000, tdp: 263, length: 280, powerConnectors: '2x8-pin' },
    { id: 'gpu-4070', img: 'public/img/gpu/rtx407012gb.png', name: 'GeForce RTX 4070 12GB', priceUsd: 610, price: 952000, tdp: 200, length: 260, powerConnectors: '1x8-pin' },
    { id: 'gpu-4070-super', img: 'public/img/gpu/rtx4070super12gb.png', name: 'GeForce RTX 4070 SUPER 12GB', priceUsd: 675, price: 1053000, tdp: 220, length: 260, powerConnectors: '1x16-pin' },
    { id: 'gpu-7900xt', img: 'public/img/gpu/radeonrx7900xt20gb.png', name: 'Radeon RX 7900 XT 20GB', priceUsd: 840, price: 1310000, tdp: 315, length: 310, powerConnectors: '2x8-pin' },
    { id: 'gpu-4070ti-super', img: 'public/img/gpu/rtx4070tisuper16gb.png', name: 'GeForce RTX 4070 Ti SUPER 16GB', priceUsd: 880, price: 1373000, tdp: 285, length: 300, powerConnectors: '1x16-pin' },
    { id: 'gpu-7900xtx', img: 'public/img/gpu/radeonrx7900xtx24gb.png', name: 'Radeon RX 7900 XTX 24GB', priceUsd: 1100, price: 1716000, tdp: 355, length: 320, powerConnectors: '2x8-pin' },
    { id: 'gpu-4080-super', img: 'public/img/gpu/rtx4080super16gb.png', name: 'GeForce RTX 4080 SUPER 16GB', priceUsd: 1150, price: 1794000, tdp: 320, length: 310, powerConnectors: '1x16-pin' },
    { id: 'gpu-4090', img: 'public/img/gpu/rtx4090242gb.png', name: 'GeForce RTX 4090 24GB', priceUsd: 2250, price: 3510000, tdp: 450, length: 340, powerConnectors: '1x16-pin' },
  ],

  storage: [
    { id: 'st-a400-240', img: 'public/img/disco/kingstona400240gb.png', name: 'Kingston A400 240GB', priceUsd: 28, price: 44000, storageType: 'SSD SATA', capacity: '240 GB', interface: 'SATA' },
    { id: 'st-a400-480', img: 'public/img/disco/kingstona400480gb.png', name: 'Kingston A400 480GB', priceUsd: 42, price: 65000, storageType: 'SSD SATA', capacity: '480 GB', interface: 'SATA' },
    { id: 'st-bx500-480', img: 'public/img/disco/crucialbx500480gb.png', name: 'Crucial BX500 480GB', priceUsd: 45, price: 70000, storageType: 'SSD SATA', capacity: '480 GB', interface: 'SATA' },
    { id: 'st-barracuda-1tb', img: 'public/img/disco/seagatebarracuda1tb.png', name: 'Seagate Barracuda 1TB', priceUsd: 48, price: 75000, storageType: 'HDD', capacity: '1 TB', interface: 'SATA' },
    { id: 'st-wdblue-1tb', img: 'public/img/disco/wdblue1tb.png', name: 'WD Blue 1TB', priceUsd: 50, price: 78000, storageType: 'HDD', capacity: '1 TB', interface: 'SATA' },
    { id: 'st-nv2-500', img: 'public/img/disco/kingstonnv2500gb.png', name: 'Kingston NV2 500GB', priceUsd: 53, price: 82000, storageType: 'SSD NVMe', capacity: '500 GB', interface: 'NVMe M.2' },
    { id: 'st-sn580-500', img: 'public/img/disco/wdbluesn580500gb.png', name: 'WD Blue SN580 500GB', priceUsd: 59, price: 92000, storageType: 'SSD NVMe', capacity: '500 GB', interface: 'NVMe M.2' },
    { id: 'st-barracuda-2tb', img: 'public/img/disco/seagatebarracuda2tb.png', name: 'Seagate Barracuda 2TB', priceUsd: 67, price: 105000, storageType: 'HDD', capacity: '2 TB', interface: 'SATA' },
    { id: 'st-a400-960', img: 'public/img/disco/kingstona400960gb.png', name: 'Kingston A400 960GB', priceUsd: 74, price: 115000, storageType: 'SSD SATA', capacity: '960 GB', interface: 'SATA' },
    { id: 'st-wdblue-2tb', img: 'public/img/disco/wdblue2tb.png', name: 'WD Blue 2TB', priceUsd: 74, price: 115000, storageType: 'HDD', capacity: '2 TB', interface: 'SATA' },
    { id: 'st-nv2-1tb', img: 'public/img/disco/kingstonnv21tb.png', name: 'Kingston NV2 1TB', priceUsd: 80, price: 125000, storageType: 'SSD NVMe', capacity: '1 TB', interface: 'NVMe M.2' },
    { id: 'st-p3plus-1tb', img: 'public/img/disco/crucialp3plus1tb.png', name: 'Crucial P3 Plus 1TB', priceUsd: 87, price: 135000, storageType: 'SSD NVMe', capacity: '1 TB', interface: 'NVMe M.2' },
    { id: 'st-mx500-1tb', img: 'public/img/disco/crucialmx5001tb.png', name: 'Crucial MX500 1TB', priceUsd: 90, price: 140000, storageType: 'SSD SATA', capacity: '1 TB', interface: 'SATA' },
    { id: 'st-sn580-1tb', img: 'public/img/disco/wdbluesn5801tb.png', name: 'WD Blue SN580 1TB', priceUsd: 93, price: 145000, storageType: 'SSD NVMe', capacity: '1 TB', interface: 'NVMe M.2' },
    { id: 'st-nm790-1tb', img: 'public/img/disco/lexarnm7901tb.png', name: 'Lexar NM790 1TB', priceUsd: 103, price: 160000, storageType: 'SSD NVMe', capacity: '1 TB', interface: 'NVMe M.2' },
    { id: 'st-sn770-1tb', img: 'public/img/disco/wdblacksn7701tb.png', name: 'WD Black SN770 1TB', priceUsd: 105, price: 164000, storageType: 'SSD NVMe', capacity: '1 TB', interface: 'NVMe M.2' },
    { id: 'st-barracuda-4tb', img: 'public/img/disco/seagatebarracuda4tb.png', name: 'Seagate Barracuda 4TB', priceUsd: 110, price: 172000, storageType: 'HDD', capacity: '4 TB', interface: 'SATA' },
    { id: 'st-kc3000-1tb', img: 'public/img/disco/kingstonkc30001tbgen4.png', name: 'Kingston KC3000 1TB Gen4', priceUsd: 115, price: 179000, storageType: 'SSD NVMe', capacity: '1 TB', interface: 'NVMe M.2' },
    { id: 'st-980pro-1tb', img: 'public/img/disco/samsung980pro1tb.png', name: 'Samsung 980 PRO 1TB', priceUsd: 120, price: 187000, storageType: 'SSD NVMe', capacity: '1 TB', interface: 'NVMe M.2' },
    { id: 'st-sn850x-1tb', img: 'public/img/disco/wdblacksn850x1tb.png', name: 'WD Black SN850X 1TB', priceUsd: 125, price: 195000, storageType: 'SSD NVMe', capacity: '1 TB', interface: 'NVMe M.2' },
    { id: 'st-990pro-1tb', img: 'public/img/disco/samsung990pro1tb.png', name: 'Samsung 990 PRO 1TB', priceUsd: 140, price: 218000, storageType: 'SSD NVMe', capacity: '1 TB', interface: 'NVMe M.2' },
    { id: 'st-sn580-2tb', img: 'public/img/disco/wdbluesn5802tb.png', name: 'WD Blue SN580 2TB', priceUsd: 163, price: 255000, storageType: 'SSD NVMe', capacity: '2 TB', interface: 'NVMe M.2' },
    { id: 'st-nm790-2tb', img: 'public/img/disco/lexarnm7902tb.png', name: 'Lexar NM790 2TB', priceUsd: 176, price: 275000, storageType: 'SSD NVMe', capacity: '2 TB', interface: 'NVMe M.2' },
    { id: 'st-kc3000-2tb', img: 'public/img/disco/kingstonkc30002tbgen4.png', name: 'Kingston KC3000 2TB Gen4', priceUsd: 195, price: 304000, storageType: 'SSD NVMe', capacity: '2 TB', interface: 'NVMe M.2' },
    { id: 'st-sn850x-2tb', img: 'public/img/disco/wdblacksn850x2tb.png', name: 'WD Black SN850X 2TB', priceUsd: 215, price: 335000, storageType: 'SSD NVMe', capacity: '2 TB', interface: 'NVMe M.2' },
    { id: 'st-990pro-2tb', img: 'public/img/disco/samsung990pro2tb.png', name: 'Samsung 990 PRO 2TB', priceUsd: 230, price: 359000, storageType: 'SSD NVMe', capacity: '2 TB', interface: 'NVMe M.2' },
  ],

  psu: [
    { id: 'psu-smart-500', img: 'public/img/fuente/thermaltakesmart500w.png', name: 'Thermaltake Smart 500W', priceUsd: 44, price: 69000, wattage: 500, certification: '80+ White', modular: 'No' },
    { id: 'psu-rgps-500', img: 'public/img/fuente/redragonrgps500w.png', name: 'Redragon RGPS 500W', priceUsd: 46, price: 72000, wattage: 500, certification: '80+ Bronze', modular: 'No' },
    { id: 'psu-a550bn', img: 'public/img/fuente/msimaga550bn.png', name: 'MSI MAG A550BN 550W', priceUsd: 50, price: 78000, wattage: 550, certification: '80+ Bronze', modular: 'No' },
    { id: 'psu-pk550d', img: 'public/img/fuente/deepcoolpk550d.png', name: 'DeepCool PK550D 550W', priceUsd: 52, price: 81000, wattage: 550, certification: '80+ Bronze', modular: 'No' },
    { id: 'psu-cx550', img: 'public/img/fuente/corsaircx550.png', name: 'Corsair CX550 550W', priceUsd: 56, price: 88000, wattage: 550, certification: '80+ Bronze', modular: 'No' },
    { id: 'psu-a650bn', img: 'public/img/fuente/maga650bn.png', name: 'MSI MAG A650BN 650W', priceUsd: 61, price: 95000, wattage: 650, certification: '80+ Bronze', modular: 'No' },
    { id: 'psu-pylon-650', img: 'public/img/fuente/xpgpylon650w.png', name: 'XPG Pylon 650W', priceUsd: 67, price: 105000, wattage: 650, certification: '80+ Bronze', modular: 'No' },
    { id: 'psu-cx650', img: 'public/img/fuente/corsaircx650.png', name: 'Corsair CX650 650W', priceUsd: 72, price: 112000, wattage: 650, certification: '80+ Bronze', modular: 'No' },
    { id: 'psu-a750gl', img: 'public/img/fuente/maga750gl.png', name: 'MSI MAG A750GL 750W', priceUsd: 99, price: 155000, wattage: 750, certification: '80+ Gold', modular: 'Full modular' },
    { id: 'psu-core-reactor-750', img: 'public/img/fuente/xpgcorereactor750w.png', name: 'XPG Core Reactor 750W', priceUsd: 109, price: 170000, wattage: 750, certification: '80+ Gold', modular: 'Full modular' },
    { id: 'psu-rm750e', img: 'public/img/fuente/corsairrm750e.png', name: 'Corsair RM750e 750W', priceUsd: 119, price: 185000, wattage: 750, certification: '80+ Gold', modular: 'Full modular' },
    { id: 'psu-a850gl', img: 'public/img/fuente/maga850gl.png', name: 'MSI MAG A850GL 850W', priceUsd: 125, price: 195000, wattage: 850, certification: '80+ Gold', modular: 'Full modular' },
    { id: 'psu-rm850e', img: 'public/img/fuente/corsairrm850e.png', name: 'Corsair RM850e 850W', priceUsd: 144, price: 225000, wattage: 850, certification: '80+ Gold', modular: 'Full modular' },
    { id: 'psu-a1000gl', img: 'public/img/fuente/msimaga1000glpcie5.png', name: 'MSI MAG A1000GL PCIE5 1000W', priceUsd: 180, price: 281000, wattage: 1000, certification: '80+ Gold', modular: 'Full modular' },
    { id: 'psu-rm1000e', img: 'public/img/fuente/corsairrm1000eatx3.0.png', name: 'Corsair RM1000e 1000W ATX 3.0', priceUsd: 185, price: 289000, wattage: 1000, certification: '80+ Gold', modular: 'Full modular' },
    { id: 'psu-rm1200x', img: 'public/img/fuente/corsairrm1200xshift.png', name: 'Corsair RM1200x Shift 1200W', priceUsd: 245, price: 382000, wattage: 1200, certification: '80+ Gold', modular: 'Full modular' },
  ],

  pccase: [
    { id: 'case-q300l', img: 'public/img/gabinete/coolermasterboxq300l.png', name: 'Cooler Master MasterBox Q300L', priceUsd: 74, price: 115000, formFactors: ['Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, includedFans: 1 },
    { id: 'case-versa-h18', img: 'public/img/gabinete/versah18.png', name: 'Thermaltake Versa H18', priceUsd: 76, price: 118000, formFactors: ['Micro-ATX', 'Mini-ITX'], maxGpuLength: 330, includedFans: 1 },
    { id: 'case-matrexx-40', img: 'public/img/gabinete/matrexx40.png', name: 'DeepCool Matrexx 40', priceUsd: 77, price: 120000, formFactors: ['Micro-ATX', 'Mini-ITX'], maxGpuLength: 330, includedFans: 0 },
    { id: 'case-cc560', img: 'public/img/gabinete/deepcoolcc560.png', name: 'DeepCool CC560', priceUsd: 91, price: 142000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 330, includedFans: 4 },
    { id: 'case-air-100', img: 'public/img/gabinete/montechair100.png', name: 'Montech Air 100', priceUsd: 95, price: 148000, formFactors: ['Micro-ATX', 'Mini-ITX'], maxGpuLength: 330, includedFans: 2 },
    { id: 'case-titan', img: 'public/img/gabinete/redragontitandualglass.png', name: 'Redragon Titan Dual Glass', priceUsd: 95, price: 148000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 410, includedFans: 3 },
    { id: 'case-air-903', img: 'public/img/gabinete/montechair903.png', name: 'Montech Air 903', priceUsd: 115, price: 180000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, includedFans: 3 },
    { id: 'case-defender', img: 'public/img/gabinete/xpgdefenderpro.png', name: 'XPG Defender Pro', priceUsd: 120, price: 187000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 380, includedFans: 3 },
    { id: 'case-3000d', img: 'public/img/gabinete/3000dairflow.png', name: 'Corsair 3000D Airflow', priceUsd: 125, price: 195000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, includedFans: 2 },
    { id: 'case-ch560', img: 'public/img/gabinete/deepcoolch560digital.png', name: 'DeepCool CH560 Digital', priceUsd: 130, price: 203000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 380, includedFans: 4 },
    { id: 'case-4000d', img: 'public/img/gabinete/corsair4000dairflow.png', name: 'Corsair 4000D Airflow', priceUsd: 144, price: 225000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, includedFans: 2 },
    { id: 'case-h6flow', img: 'public/img/gabinete/nzxth6flow.png', name: 'NZXT H6 Flow', priceUsd: 155, price: 242000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 365, includedFans: 3 },
    { id: 'case-king95', img: 'public/img/gabinete/montechking95pro.png', name: 'Montech King 95 Pro', priceUsd: 165, price: 257000, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 420, includedFans: 6 },
  ],

  cooler: [
    { id: 'cooler-stock', img: 'public/img/cooler/coolerstockamd.png', name: 'Cooler de stock (incluido con el CPU)', priceUsd: 0, price: 0, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 65, type: 'Aire' },
    { id: 'cooler-stock-amd', img: 'public/img/cooler/coolerstockamd.png', name: 'Cooler stock AMD', priceUsd: 16, price: 25000, sockets: ['AM4', 'AM5'], maxTdp: 65, type: 'Aire' },
    { id: 'cooler-ag300', img: 'public/img/cooler/deepcoolag300.png', name: 'DeepCool AG300', priceUsd: 24, price: 38000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 150, type: 'Aire' },
    { id: 'cooler-se214', img: 'public/img/cooler/idcoolingse214xt.png', name: 'ID-Cooling SE-214-XT', priceUsd: 28, price: 44000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 150, type: 'Aire' },
    { id: 'cooler-ag400', img: 'public/img/cooler/deepcoolag400.png', name: 'DeepCool AG400', priceUsd: 35, price: 54000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 220, type: 'Aire' },
    { id: 'cooler-aio-frostflow240', img: 'public/img/cooler/idcoolingfrostflowx240.png', name: 'ID-Cooling FrostFlow X 240', priceUsd: 58, price: 90000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 250, type: 'Líquida AIO 240mm' },
    { id: 'cooler-pa120', img: 'public/img/cooler/peerlessassassin120.png', name: 'Thermalright Peerless Assassin 120', priceUsd: 74, price: 115000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 245, type: 'Aire Doble Torre' },
    { id: 'cooler-aio-le520', img: 'public/img/cooler/deepcoolle520argb.png', name: 'DeepCool LE520 240mm ARGB', priceUsd: 78, price: 122000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 250, type: 'Líquida AIO 240mm' },
    { id: 'cooler-ak620', img: 'public/img/cooler/deepcoolak620digital.png', name: 'DeepCool AK620 Digital', priceUsd: 85, price: 133000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 260, type: 'Aire Doble Torre' },
    { id: 'cooler-aio-dashflow360', img: 'public/img/cooler/idcoolingdashflow360xt.png', name: 'ID-Cooling Dashflow 360 XT', priceUsd: 88, price: 137000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 300, type: 'Líquida AIO 360mm' },
    { id: 'cooler-aio-lt520', img: 'public/img/cooler/deepcoollt520argb.png', name: 'DeepCool LT520 240mm ARGB', priceUsd: 110, price: 172000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 280, type: 'Líquida AIO 240mm' },
    { id: 'cooler-nhd15', img: 'public/img/cooler/noctuanhd15chromax.black.png', name: 'Noctua NH-D15 chromax.black', priceUsd: 145, price: 226000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 260, type: 'Aire Doble Torre' },
    { id: 'cooler-aio-lt720', img: 'public/img/cooler/deepcoollt720argb.png', name: 'DeepCool LT720 360mm ARGB', priceUsd: 145, price: 226000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 320, type: 'Líquida AIO 360mm' },
    { id: 'cooler-aio-arctic360', img: 'public/img/cooler/arcticliquidfreezeriii360.png', name: 'Arctic Liquid Freezer III 360', priceUsd: 165, price: 257000, sockets: ['AM4', 'AM5', 'LGA1700'], maxTdp: 350, type: 'Líquida AIO 360mm' },
  ],

  fans: [
    { id: 'fan-fk120-x1', img: 'public/img/placeholder.jpg', name: 'DeepCool FK120 120mm x1', priceUsd: 14, price: 22000, size: 120, quantity: 1 },
    { id: 'fan-p12-x1', img: 'public/img/placeholder.jpg', name: 'Arctic P12 120mm x1', priceUsd: 18, price: 28000, size: 120, quantity: 1 },
    { id: 'fan-fk120-x3', img: 'public/img/placeholder.jpg', name: 'DeepCool FK120 120mm x3', priceUsd: 38, price: 60000, size: 120, quantity: 3 },
    { id: 'fan-argb-kit', img: 'public/img/placeholder.jpg', name: 'Kit 3x Fan 120mm ARGB + Controladora', priceUsd: 42, price: 65000, size: 120, quantity: 3 },
    { id: 'fan-p12-x3', img: 'public/img/placeholder.jpg', name: 'Arctic P12 120mm x3', priceUsd: 48, price: 75000, size: 120, quantity: 3 },
    { id: 'fan-corsair-icue', img: 'public/img/placeholder.jpg', name: 'Corsair iCUE SP120 RGB Elite x3', priceUsd: 78, price: 122000, size: 120, quantity: 3 },
  ],

  wifi: [
    { id: 'wifi-bt53', img: 'public/img/adapt/usbbluetooth5.3cudy.png', name: 'Adaptador USB Bluetooth 5.3', priceUsd: 12, price: 18000, interface: 'USB 2.0/3.0', features: 'Bluetooth 5.3' },
    { id: 'wifi-t2u', img: 'public/img/adapt/tplinkarchert2u.png', name: 'TP-Link Archer T2U', priceUsd: 22, price: 34000, interface: 'USB 2.0/3.0', features: 'Wi-Fi 5' },
    { id: 'wifi-t3u', img: 'public/img/adapt/tplinkarchert3u.png', name: 'TP-Link Archer T3U', priceUsd: 29, price: 46000, interface: 'USB 3.0', features: 'Wi-Fi 5' },
    { id: 'wifi-tx20', img: 'public/img/adapt/tplinkarchertx20uplus.png', name: 'TP-Link Archer TX20U Plus', priceUsd: 46, price: 72000, interface: 'USB 3.0', features: 'Wi-Fi 6' },
  ],

  os: [
    { id: 'os-linux', img: 'public/img/os/ubuntu.png', name: 'Ubuntu', priceUsd: 0, price: 0, type: 'Gratis' },
    { id: 'os-win10h', img: 'public/img/os/win10home.png', name: 'Windows 10 Home', priceUsd: 96, price: 150000, type: 'Licencia' },
    { id: 'os-win10p', img: 'public/img/os/win10pro.png', name: 'Windows 10 Pro', priceUsd: 135, price: 210000, type: 'Licencia' },
    { id: 'os-win11h', img: 'public/img/os/win11home.png', name: 'Windows 11 Home', priceUsd: 115, price: 180000, type: 'Licencia' },
    { id: 'os-win11p', img: 'public/img/os/win11pro.png', name: 'Windows 11 Pro', priceUsd: 167, price: 260000, type: 'Licencia' },
  ]
};

/* =============================================================================
   SISTEMA DE COTIZACIÓN EN VIVO (Dólar a Pesos ARS)
   ========================================================================== */
const EMCA_CURRENCY = {
  defaultRate: 1560,
  rate: 1560,
  source: 'fallback',
  lastUpdated: null,
  cacheKey: 'emca_cotizacion_dolar_cache',
  cacheDurationMs: 2 * 60 * 60 * 1000, // 2 horas
};

function emcaCalcArs(priceUsd, rate) {
  if (!priceUsd || priceUsd <= 0) return 0;
  const currentRate = rate || EMCA_CURRENCY.rate || EMCA_CURRENCY.defaultRate;
  const raw = priceUsd * currentRate;
  if (raw < 100000) {
    return Math.round(raw / 500) * 500;
  }
  return Math.round(raw / 1000) * 1000;
}

function emcaUpdateBadgeUI() {
  if (typeof document === 'undefined') return;
  const badge = document.getElementById("cfg-rate-badge");
  if (!badge) return;
  const rate = EMCA_CURRENCY.rate || EMCA_CURRENCY.defaultRate;
  const isLive = EMCA_CURRENCY.source === 'dolarapi' || EMCA_CURRENCY.source === 'criptoya';
  const isCache = EMCA_CURRENCY.source === 'cache';
  const sourceLabel = isLive ? 'Actualizado en vivo' : (isCache ? 'En vivo (en caché)' : 'Referencia');
  const formattedRate = Number(rate).toLocaleString('es-AR');

  badge.innerHTML = `
    <span class="rate-dot ${isLive || isCache ? 'rate-dot--live' : ''}"></span>
    <span class="rate-text">Cotización Dólar: <strong>$${formattedRate}</strong> <small>(${sourceLabel})</small></span>
  `;
  badge.title = `Precios en base a la cotización del dólar ($${formattedRate} ARS).`;
}

function emcaApplyCurrencyRate(rate) {
  if (!rate || isNaN(rate) || rate <= 0) return;
  EMCA_CURRENCY.rate = Math.round(rate);
  
  if (typeof PC_DB !== 'undefined') {
    Object.keys(PC_DB).forEach(cat => {
      (PC_DB[cat] || []).forEach(item => {
        if (typeof item.priceUsd === 'number') {
          item.price = emcaCalcArs(item.priceUsd, EMCA_CURRENCY.rate);
        }
      });
    });
  }

  emcaUpdateBadgeUI();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('emca:currency-updated', {
      detail: {
        rate: EMCA_CURRENCY.rate,
        source: EMCA_CURRENCY.source,
        lastUpdated: EMCA_CURRENCY.lastUpdated
      }
    }));
  }
}

async function emcaInitCurrency() {
  try {
    const cached = typeof localStorage !== 'undefined' ? localStorage.getItem(EMCA_CURRENCY.cacheKey) : null;
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      if (data && data.rate && (now - data.timestamp < EMCA_CURRENCY.cacheDurationMs)) {
        EMCA_CURRENCY.rate = data.rate;
        EMCA_CURRENCY.source = 'cache';
        EMCA_CURRENCY.lastUpdated = new Date(data.timestamp);
        emcaApplyCurrencyRate(EMCA_CURRENCY.rate);
        if (now - data.timestamp < 60 * 60 * 1000) {
          return EMCA_CURRENCY.rate;
        }
      }
    }
  } catch (_) {}

  try {
    if (typeof fetch === 'function') {
      const res = await fetch('https://dolarapi.com/v1/dolares/blue', { cache: 'no-cache' });
      if (res.ok) {
        const json = await res.json();
        const rate = Number(json.venta || json.compra);
        if (rate && !isNaN(rate) && rate > 500) {
          EMCA_CURRENCY.rate = rate;
          EMCA_CURRENCY.source = 'dolarapi';
          EMCA_CURRENCY.lastUpdated = new Date();
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(EMCA_CURRENCY.cacheKey, JSON.stringify({
                rate: rate,
                timestamp: Date.now()
              }));
            }
          } catch (_) {}
          emcaApplyCurrencyRate(rate);
          return rate;
        }
      }
    }
  } catch (err) {
    console.warn('EMCA: No se pudo obtener cotización de DolarApi, intentando fallback...', err.message);
  }

  try {
    if (typeof fetch === 'function') {
      const res2 = await fetch('https://criptoya.com/api/dolar', { cache: 'no-cache' });
      if (res2.ok) {
        const json2 = await res2.json();
        const blueAsk = json2 && json2.blue && json2.blue.ask;
        if (blueAsk && !isNaN(blueAsk) && blueAsk > 500) {
          EMCA_CURRENCY.rate = blueAsk;
          EMCA_CURRENCY.source = 'criptoya';
          EMCA_CURRENCY.lastUpdated = new Date();
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(EMCA_CURRENCY.cacheKey, JSON.stringify({
                rate: blueAsk,
                timestamp: Date.now()
              }));
            }
          } catch (_) {}
          emcaApplyCurrencyRate(blueAsk);
          return blueAsk;
        }
      }
    }
  } catch (err2) {
    console.warn('EMCA: Fallback CriptoYa falló, usando valor de respaldo...', err2.message);
  }

  emcaApplyCurrencyRate(EMCA_CURRENCY.defaultRate);
  return EMCA_CURRENCY.defaultRate;
}

if (typeof window !== 'undefined') {
  window.PC_DB = PC_DB;
  window.CATEGORY_ORDER = CATEGORY_ORDER;
  window.CATEGORY_INFO = CATEGORY_INFO;
  window.EMCA_CURRENCY = EMCA_CURRENCY;
  window.emcaCalcArs = emcaCalcArs;
  window.emcaApplyCurrencyRate = emcaApplyCurrencyRate;
  window.emcaUpdateBadgeUI = emcaUpdateBadgeUI;
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', emcaUpdateBadgeUI);
    } else {
      emcaUpdateBadgeUI();
    }
  }
  emcaInitCurrency();
}

