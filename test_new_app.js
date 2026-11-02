// [Хвойный мир] Optimized Production Application Bundle
// Combined Botanical SVG Icon Engine + Plant Catalog + Interactive Store Logic



    // UNIFIED VECTOR SVG ICON SYSTEM (Strictly replacing all emojis with cohesive botanical/UI icons)
    const SVG_ICONS = {
      tree: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2-6 8h3.5L5 16h4.5L7 21h10l-2.5-5H19l-4.5-6H18L12 2z"/><path d="M12 21v2"/></svg>',
      sprout: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12c0-3.5 2.5-6 7-6-1 4-3.5 6-7 6z"/><path d="M12 15c0-2.5-2-4.5-5.5-4.5.5 3 2.5 4.5 5.5 4.5z"/></svg>',
      berry: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="14" r="5"/><circle cx="15.5" cy="13.5" r="4.5"/><path d="M12 9V5"/><path d="M10 5c1 0 2-1 3-3 0 2 1 3 3 3"/><path d="M8 12.5a2 2 0 0 1 2-2"/></svg>',
      leaf: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
      wheat: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/></svg>',
      strawberry: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v2"/><path d="M8.5 5a4.5 4.5 0 0 0 7 0"/><path d="M12 6c4.5 0 7.5 3.5 6 9.5-1.2 4.8-4.5 6.5-6 6.5s-4.8-1.7-6-6.5C4.5 9.5 7.5 6 12 6z"/><circle cx="10" cy="11" r="0.5" fill="currentColor"/><circle cx="14" cy="11" r="0.5" fill="currentColor"/><circle cx="12" cy="15" r="0.5" fill="currentColor"/></svg>',
      flame: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
      snowflake: '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="5" y1="5" x2="19" y2="19"/><line x1="5" y1="19" x2="19" y2="5"/><polyline points="10 4 12 2 14 4"/><polyline points="10 20 12 22 14 20"/><polyline points="4 10 2 12 4 14"/><polyline points="20 10 22 12 20 14"/></svg>',
      ruler: '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.3 8.7-5-5a2.12 2.12 0 0 0-3 0L2.7 14.3a2.12 2.12 0 0 0 0 3l5 5a2.12 2.12 0 0 0 3 0L21.3 11.7a2.12 2.12 0 0 0 0-3Z"/><path d="m14.5 5.5-2 2"/><path d="m11.5 8.5-2 2"/><path d="m8.5 11.5-2 2"/></svg>',
      cart: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
      user: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      truck: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="10" x="1" y="5" rx="2"/><polygon points="15 8 19 8 22 11 22 15 15 15 15 8"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><line x1="8.5" x2="15.5" y1="18" y2="18"/></svg>',
      freight: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="13" height="11" x="2" y="4" rx="1.5"/><path d="M15 8h4.5l2.5 3v4h-7V8z"/><circle cx="6" cy="18" r="2"/><circle cx="10" cy="18" r="2"/><circle cx="19" cy="18" r="2"/></svg>',
      car: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/></svg>',
      home: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      check: '<svg class="w-4 h-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      gift: '<svg class="w-4 h-4 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>',
      phone: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      chat: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
      pin: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
      book: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>',
      tag: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r="1.5"/></svg>',
      box: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
      cookie: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><circle cx="8.5" cy="8.5" r="1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1" fill="currentColor"/><circle cx="9" cy="15" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/></svg>',
      van: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="14" height="10" rx="2"/><path d="M16 8h4l2 3v5h-6V8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
      crane: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16"/><path d="M8 22V6l7-4v2"/><path d="M8 6h11l2 3H8"/><path d="M17 9v6"/><path d="M17 18a1.5 1.5 0 0 1-3 0"/></svg>',
      refresh: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
      star: '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      starFilled: '<svg class="w-3.5 h-3.5 shrink-0 text-amber-500 fill-amber-400" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      pencil: '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
      trash: '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>',
      eye: '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
      chart: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>',
      download: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
      bell: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
      megaphone: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
      smartphone: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>',
      alert: '<svg class="w-4 h-4 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      x: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      crown: '<svg class="w-4 h-4 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>',
      receipt: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><line x1="8" x2="16" y1="8" y2="8"/><line x1="8" x2="16" y1="12" y2="12"/><line x1="8" x2="13" y1="16" y2="16"/></svg>',
      plus: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      calc: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>',
      bag: '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
    };

    if (typeof anime === 'undefined') {
      document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js"><\/script>');
    }
  


        // PLANT CATALOG DATABASE (Synchronized with VK Community vk.ru/xvoinyimir)
    const DEFAULT_PLANTS = [
      {
        id: 1,
        name: "Туя западная «Смарагд»",
        latin: "Thuja occidentalis Smaragd",
        category: "conifer",
        price: 550,
        oldPrice: 650,
        stock: 28,
        height: "40-50 см",
        pot: "C2 (ЗКС)",
        frost: "-40°C",
        image: "assets/plants/plant_smaragd.jpg",
        images: ["assets/plants/plant_smaragd.jpg", "assets/plants/plant_sunny_smaragd.jpg", "assets/plants/vk_plant_1.jpg"],
        badge: "Сезонный хит",
        desc: "Идеальная правильная коническая форма изумрудного цвета. Хвоя не буреет и не выгорает на зимнем солнце, сохраняет сочный цвет круглый год.",
        sizes: [
          {
            name: "Маленький",
            price: 550,
            oldPrice: 650,
            height: "40-50 см",
            pot: "C2 (2 л, ЗКС)",
            stock: 28,
            images: ["assets/plants/plant_smaragd.jpg", "assets/plants/vk_plant_1.jpg"]
          },
          {
            name: "Средний",
            price: 950,
            oldPrice: 1150,
            height: "70-90 см",
            pot: "C5 (5 л, ЗКС)",
            stock: 15,
            images: ["assets/plants/plant_sunny_smaragd.jpg"]
          },
          {
            name: "Большой",
            price: 1750,
            oldPrice: 2100,
            height: "110-130 см",
            pot: "C10 (10 л, ЗКС)",
            stock: 7,
            images: ["assets/plants/plant_smaragd.jpg"]
          }
        ]
      },
      {
        id: 2,
        name: "Туя западная «Брабант»",
        latin: "Thuja occidentalis Brabant",
        category: "conifer",
        price: 490,
        oldPrice: 590,
        stock: 35,
        height: "40-60 см",
        pot: "C2 (ЗКС)",
        frost: "-40°C",
        image: "assets/plants/plant_brabant.jpg",
        images: ["assets/plants/plant_brabant.jpg", "assets/plants/vk_plant_2.jpg", "assets/plants/vk_plant_11.jpg"],
        badge: "Для живой изгороди",
        desc: "Самый быстрорастущий сорт туи (до 40 см в год!). Отлично поддаётся стрижке и формирует сплошную непроницаемую зелёную стену."
      },
      {
        id: 3,
        name: "Туя западная «Рейнгольд»",
        latin: "Thuja occidentalis Rheingold",
        category: "conifer",
        price: 1200,
        stock: 18,
        height: "30-40 см",
        pot: "C2 / C3",
        frost: "-38°C",
        image: "assets/plants/plant_rheingold.jpg",
        images: ["assets/plants/plant_rheingold.jpg", "assets/plants/vk_plant_12.jpg", "assets/plants/vk_plant_13.jpg"],
        badge: "Червонное золото",
        desc: "Пушистая туя шаровидно-конической формы. На ярком солнце покрывается червонным золотом, а в тени переливается лаймовым оттенком."
      },
      {
        id: 4,
        name: "Туя западная «Малониана Ауреа»",
        latin: "Thuja occidentalis Malonyana Aurea",
        category: "conifer",
        price: 1500,
        stock: 14,
        height: "50-70 см",
        pot: "C3 (ЗКС)",
        frost: "-40°C",
        image: "assets/plants/plant_malonyana.jpg",
        images: ["assets/plants/plant_malonyana.jpg", "assets/plants/vk_plant_14.jpg"],
        badge: "Солнечная колонна",
        desc: "Стройная узкая крона с золотисто-жёлтой хвоей, будто хранящей солнечный свет. Зимой приобретает благородный бронзовый отлив."
      },
      {
        id: 5,
        name: "Туя «Санни Смарагд»",
        latin: "Thuja occidentalis Sunny Smaragd",
        category: "conifer",
        price: 1000,
        stock: 12,
        height: "40-50 см",
        pot: "C2 (ЗКС)",
        frost: "-32°C",
        image: "assets/plants/plant_sunny_smaragd.jpg",
        images: ["assets/plants/plant_sunny_smaragd.jpg", "assets/plants/plant_smaragd.jpg", "assets/plants/vk_plant_15.jpg"],
        badge: "Яркий акцент",
        desc: "Элитная мутация классического Смарагда с золотисто-жёлтыми веточками и оранжевыми кончиками на молодых приростах."
      },
      {
        id: 6,
        name: "Туя «Гилдед Дресс» (Позолоченное платье)",
        latin: "Thuja occidentalis Gilded Dress",
        category: "conifer",
        price: 2000,
        stock: 8,
        height: "60-70 см",
        pot: "C5 (5 литров)",
        frost: "-35°C",
        image: "assets/plants/plant_gilded_dress.jpg",
        images: ["assets/plants/plant_gilded_dress.jpg", "assets/plants/vk_plant_16.jpg"],
        badge: "Меняет цвет",
        desc: "Жемчужина для сада: весной лимонно-жёлтая, летом свежая светло-зелёная, осенью вспыхивает ярким золотом. Не перерастает 1.8-2 м."
      },
      {
        id: 7,
        name: "Туя карликовая «Мисс Фрости»",
        latin: "Thuja occidentalis Miss Frosty",
        category: "conifer",
        price: 850,
        stock: 15,
        height: "20-25 см",
        pot: "C2 (ЗКС)",
        frost: "-34°C",
        image: "assets/plants/plant_miss_frosty.jpg",
        images: ["assets/plants/plant_miss_frosty.jpg", "assets/plants/vk_plant_17.jpg"],
        badge: "Эффект инея",
        desc: "Карликовый плотный хвойный шарик до 1 м. Темно-зеленая хвоя с бело-кремовыми кончиками создает потрясающий эффект заснеженных веток."
      },
      {
        id: 8,
        name: "Туя шаровидная «Тини Тим»",
        latin: "Thuja occidentalis Tiny Tim",
        category: "conifer",
        price: 750,
        stock: 20,
        height: "диаметр 25 см",
        pot: "C2 (ЗКС)",
        frost: "-40°C",
        image: "assets/plants/plant_tinytim.jpg",
        images: ["assets/plants/plant_tinytim.jpg", "assets/plants/vk_plant_18.jpg"],
        badge: "Карликовый шар",
        desc: "Плотный компактный шар с изумрудной короткой хвоей. Растет очень медленно и совсем не требует стрижки и формировки."
      },
      {
        id: 9,
        name: "Туя «Мистер Боулинг Болл»",
        latin: "Thuja occidentalis Mr. Bowling Ball",
        category: "conifer",
        price: 800,
        stock: 16,
        height: "диаметр 30 см",
        pot: "C2 (ЗКС)",
        frost: "-38°C",
        image: "assets/plants/plant_bowling_ball.jpg",
        images: ["assets/plants/plant_bowling_ball.jpg", "assets/plants/vk_plant_19.jpg"],
        badge: "Ажурный шар",
        desc: "Уникальный сорт с кружевной, тонкой нитевидной хвоей, образующий идеальную сферу без единого взмаха ножниц."
      },
      {
        id: 10,
        name: "Туя спиральная «Зматлик»",
        latin: "Thuja occidentalis Zmatlik",
        category: "conifer",
        price: 950,
        stock: 10,
        height: "35-45 см",
        pot: "C2 (ЗКС)",
        frost: "-35°C",
        image: "assets/plants/plant_zmatlik.jpg",
        images: ["assets/plants/plant_zmatlik.jpg", "assets/plants/vk_plant_20.jpg"],
        badge: "Кудрявая хвоя",
        desc: "Редкий коллекционный сорт с изящными волнистыми, закрученными в спираль веточками. Узкоконическая плотная форма."
      },
      {
        id: 11,
        name: "Ель голубая «Маджестик Блю»",
        latin: "Picea pungens Majestic Blue",
        category: "conifer",
        price: 1500,
        stock: 14,
        height: "30-40 см",
        pot: "C3 (3 литра)",
        frost: "-40°C",
        image: "assets/plants/plant_majestic_blue.jpg",
        images: ["assets/plants/plant_majestic_blue.jpg", "assets/plants/plant_super_blue.jpg", "assets/plants/vk_plant_21.jpg"],
        badge: "Хвойная классика",
        desc: "Настоящая серебристо-голубая кремлёвская ель с густыми жесткими иголками правильного стального оттенка."
      },
      {
        id: 12,
        name: "Ель колючая «Супер Блю»",
        latin: "Picea pungens Super Blue Seedling",
        category: "conifer",
        price: 1600,
        stock: 12,
        height: "30-45 см",
        pot: "C3 (ЗКС)",
        frost: "-42°C",
        image: "assets/plants/plant_super_blue.jpg",
        images: ["assets/plants/plant_super_blue.jpg", "assets/plants/plant_majestic_blue.jpg", "assets/plants/vk_plant_23.jpg"],
        badge: "Яркая лазурь",
        desc: "Сорт с особенно яркой лазурно-голубой окраской даже в молодом возрасте. Растёт ровной плотной пирамидой."
      },
      {
        id: 13,
        name: "Ель подушковидная «Нидиформис»",
        latin: "Picea abies Nidiformis",
        category: "conifer",
        price: 1100,
        stock: 15,
        height: "диаметр 30 см",
        pot: "C2 (ЗКС)",
        frost: "-40°C",
        image: "assets/plants/plant_nidiformis.jpg",
        images: ["assets/plants/plant_nidiformis.jpg", "assets/plants/vk_plant_24.jpg"],
        badge: "Гнездовая форма",
        desc: "Карликовая подушковидная ель с характерным гнездовидным углублением по центру. Прекрасна на альпийских горках."
      },
      {
        id: 14,
        name: "Ель канадская «Дейзи Уайт»",
        latin: "Picea glauca Daisy's White",
        category: "conifer",
        price: 1250,
        stock: 9,
        height: "25-35 см",
        pot: "C2 (ЗКС)",
        frost: "-35°C",
        image: "assets/plants/plant_daisy_white.jpg",
        images: ["assets/plants/plant_daisy_white.jpg", "assets/plants/vk_plant_25.jpg"],
        badge: "Белоснежный май",
        desc: "Весной молодые приросты распускаются ослепительно кремово-белым цветом, превращая растение в цветущий хвойный конус."
      },
      {
        id: 15,
        name: "Кипарисовик горохоплодный «Блю Ниндзя»",
        latin: "Chamaecyparis pisifera Blue Ninja",
        category: "conifer",
        price: 1400,
        stock: 10,
        height: "30-40 см",
        pot: "C2 / C3",
        frost: "-30°C",
        image: "assets/plants/plant_blue_ninja.jpg",
        images: ["assets/plants/plant_blue_ninja.jpg", "assets/plants/vk_plant_26.jpg"],
        badge: "Экзотический сорт",
        desc: "Очень изящный кипарисовик со свисающими нитевидными голубовато-серебристыми побегами. Японский шарм в саду."
      },
      {
        id: 16,
        name: "Сосна горная «Лилипут»",
        latin: "Pinus mugo Lilliput",
        category: "conifer",
        price: 2400,
        stock: 7,
        height: "15-20 см",
        pot: "C3 (3 литра)",
        frost: "-45°C",
        image: "assets/plants/plant_lilliput.jpg",
        images: ["assets/plants/plant_lilliput.jpg", "assets/plants/plant_pumilio.jpg", "assets/plants/vk_plant_28.jpg"],
        badge: "Миниатюрная сосна",
        desc: "Сверхкарликовая горная сосна с годовым приростом всего 2-3 см. Идеальна для японских садиков, каменистых горок и вазонов."
      },
      {
        id: 17,
        name: "Сосна горная «Пумилио»",
        latin: "Pinus mugo var. pumilio",
        category: "conifer",
        price: 990,
        oldPrice: 1190,
        stock: 22,
        height: "25-35 см",
        pot: "C2 (2 литра)",
        frost: "-45°C",
        image: "assets/plants/plant_pumilio.jpg",
        images: ["assets/plants/plant_pumilio.jpg", "assets/plants/plant_lilliput.jpg", "assets/plants/vk_plant_29.jpg"],
        badge: "Неприхотливая",
        desc: "Неприхотливый стелющийся кустарник с направленными вверх побегами. Переносит песчаные почвы, засуху и ветровые нагрузки."
      },
      {
        id: 18,
        name: "Голубика высокорослая «Дюк» (Duke)",
        latin: "Vaccinium corymbosum Duke",
        category: "blueberry",
        price: 650,
        oldPrice: 750,
        stock: 25,
        height: "40-60 см (ЗКС)",
        pot: "C3 (3-5 летка)",
        frost: "-34°C",
        image: "assets/plants/plant_blueberry_duke.jpg",
        images: ["assets/plants/plant_blueberry_duke.jpg", "assets/plants/plant_blueberry.jpg", "assets/plants/vk_plant_30.jpg"],
        badge: "Ранняя сладость",
        desc: "Самый популярный ранний сорт! Крупные хрустящие ягоды с приятным освежающим сладким вкусом. Высокая стабильная урожайность.",
        sizes: [
          {
            name: "Стандарт (C2)",
            price: 650,
            oldPrice: 750,
            height: "40-60 см",
            pot: "C2 (ЗКС)",
            stock: 25,
            images: ["assets/plants/plant_blueberry_duke.jpg", "assets/plants/plant_blueberry.jpg"]
          },
          {
            name: "Крупномер (C5)",
            price: 1350,
            oldPrice: 1550,
            height: "70-90 см",
            pot: "C5 (ЗКС)",
            stock: 9,
            images: ["assets/plants/vk_plant_30.jpg"]
          }
        ]
      },
      {
        id: 19,
        name: "Голубика высокорослая «Блюкроп»",
        latin: "Vaccinium corymbosum Bluecrop",
        category: "blueberry",
        price: 650,
        stock: 30,
        height: "40-60 см",
        pot: "C3 (C5 пятилетка - 1350 ₽)",
        frost: "-35°C",
        image: "assets/plants/plant_blueberry_bluecrop.jpg",
        images: ["assets/plants/plant_blueberry_bluecrop.jpg", "assets/plants/plant_blueberry.jpg", "assets/plants/vk_plant_31.jpg"],
        badge: "Мировой эталон",
        desc: "Главный мировой стандарт голубики: неприхотливая, урожай до 9 кг с куста, ягоды крупные с плотным восковым налетом."
      },
      {
        id: 20,
        name: "Голубика высокорослая «Патриот»",
        latin: "Vaccinium corymbosum Patriot",
        category: "blueberry",
        price: 650,
        stock: 20,
        height: "40-55 см",
        pot: "C3 (ЗКС)",
        frost: "-38°C",
        image: "assets/plants/plant_blueberry_patriot.jpg",
        images: ["assets/plants/plant_blueberry_patriot.jpg", "assets/plants/plant_blueberry.jpg", "assets/plants/vk_plant_32.jpg"],
        badge: "Для тяжелых почв",
        desc: "Отлично подходит для глинистых и переувлажненных почв Новгородской области. Ягоды крупные (до 20 мм), сочные и сладкие."
      },
      {
        id: 21,
        name: "Голубика высокорослая «Спартан»",
        latin: "Vaccinium corymbosum Spartan",
        category: "blueberry",
        price: 650,
        stock: 18,
        height: "40-55 см",
        pot: "C3 (ЗКС)",
        frost: "-34°C",
        image: "assets/plants/plant_blueberry_spartan.jpg",
        images: ["assets/plants/plant_blueberry_spartan.jpg", "assets/plants/plant_blueberry.jpg", "assets/plants/vk_plant_34.jpg"],
        badge: "Десертный вкус",
        desc: "Раннеспелый сорт с крупными светло-синими ягодами и непревзойденным винно-сладким ароматом. Любимец садоводов."
      },
      {
        id: 22,
        name: "Голубика низкорослая «Норд Блю»",
        latin: "Vaccinium corymbosum Northblue",
        category: "blueberry",
        price: 650,
        stock: 15,
        height: "30-40 см",
        pot: "C2 / C3",
        frost: "-40°C",
        image: "assets/plants/plant_blueberry_northblue.jpg",
        images: ["assets/plants/plant_blueberry_northblue.jpg", "assets/plants/plant_blueberry.jpg", "assets/plants/vk_plant_35.jpg"],
        badge: "Сверхморозостойкая",
        desc: "Компактный куст до 90 см, способный зимовать под снегом даже в самые суровые морозы. Ягода темно-синяя, десертная."
      },
      {
        id: 23,
        name: "Ирга канадская «Принцесса Диана»",
        latin: "Amelanchier grandiflora Princess Diana",
        category: "shrub",
        price: 1540,
        stock: 11,
        height: "50-70 см",
        pot: "C3 (Голландия)",
        frost: "-35°C",
        image: "assets/plants/plant_amelanchier_diana.jpg",
        images: ["assets/plants/plant_amelanchier_diana.jpg", "assets/plants/vk_plant_38.jpg"],
        badge: "Сладкая коринка",
        desc: "Сортовая крупноплодная ирга голландской селекции. Очень сладкие целебные ягоды, обильное весеннее цветение и огненная листва осенью."
      },
      {
        id: 24,
        name: "Сирень сортовая питомниковая",
        latin: "Syringa vulgaris",
        category: "shrub",
        price: 300,
        oldPrice: 350,
        stock: 40,
        height: "40-60 см",
        pot: "C2 (ЗКС)",
        frost: "-40°C",
        image: "assets/plants/plant_syringa.jpg",
        images: ["assets/plants/plant_syringa.jpg", "assets/plants/vk_plant_40.jpg"],
        badge: "От 10 шт по 250 ₽",
        desc: "Крепкие саженцы сортовой сирени из питомника с отличной закрытой корневой системой. Пышные ароматные соцветия."
      },
      {
        id: 25,
        name: "Барбарис Тунберга (красные и оранжевые сорта)",
        latin: "Berberis thunbergii",
        category: "shrub",
        price: 550,
        stock: 24,
        height: "25-40 см",
        pot: "C2 (ЗКС)",
        frost: "-35°C",
        image: "assets/plants/plant_barberry.jpg",
        images: ["assets/plants/plant_barberry.jpg", "assets/plants/vk_plant_41.jpg"],
        badge: "Яркий бордюр",
        desc: "Плотный декоративный кустарник с яркой пурпурно-красной или золотисто-оранжевой листвой. Незаменим для бордюров и рокариев."
      }
    ];

    // STATE
    let PLANTS = [];
    let currentCategory = 'all';
    let cart = [];

    const CATALOG_VERSION = 'v10_multiple_sizes_and_containers';

    function loadPlants() {
      try {
        const saved = localStorage.getItem('xvoinyimir_plants');
        const savedVersion = localStorage.getItem('xvoinyimir_catalog_version');
        if (saved && savedVersion === CATALOG_VERSION) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            PLANTS = parsed;
          } else {
            PLANTS = JSON.parse(JSON.stringify(DEFAULT_PLANTS));
            savePlants();
          }
        } else {
          let oldPlants = [];
          try { oldPlants = JSON.parse(saved || '[]'); } catch(e){}
          PLANTS = DEFAULT_PLANTS.map(def => {
            const old = Array.isArray(oldPlants) ? oldPlants.find(o => o.id === def.id) : null;
            if (old) {
              const oldStock = (old.stock !== undefined && !isNaN(old.stock) && old.stock !== null) ? parseInt(old.stock) : def.stock;
              return {
                ...def,
                ...old,
                sizes: (old.sizes && Array.isArray(old.sizes) && old.sizes.length > 0) ? old.sizes : (def.sizes || undefined),
                image: def.image,
                images: def.images || [def.image],
                stock: oldStock
              };
            }
            return { ...def };
          });
          savePlants();
        }
      } catch (e) {
        PLANTS = JSON.parse(JSON.stringify(DEFAULT_PLANTS));
        savePlants();
      }
      if (!Array.isArray(PLANTS) || PLANTS.length === 0) {
        PLANTS = JSON.parse(JSON.stringify(DEFAULT_PLANTS));
        savePlants();
      }
      PLANTS.forEach(p => {
        if (p.stock === undefined || isNaN(p.stock) || p.stock === null) p.stock = 20;
        else p.stock = parseInt(p.stock);
      });
      const countEl = document.getElementById('count-all');
      if (countEl) countEl.innerText = PLANTS.length;
    }

    function savePlants() {
      try {
        localStorage.setItem('xvoinyimir_plants', JSON.stringify(PLANTS));
        localStorage.setItem('xvoinyimir_catalog_version', CATALOG_VERSION);
      } catch (e) {}
      const countEl = document.getElementById('count-all');
      if (countEl && PLANTS) countEl.innerText = PLANTS.length;
    }

    // INIT
    
    // ==========================================
    // REPORTS & INVENTORY LOGIC (SALES & STOCK)
    // ==========================================
    const DEFAULT_SALES_LOG = [
      {
        id: 'SL-101',
        orderId: 'ORD-1042',
        date: '20.10.2026, 14:30',
        plantId: 1,
        plantName: 'Туя западная «Смарагд»',
        quantity: 6,
        unitPrice: 550,
        totalPrice: 3300,
        customer: 'Алексей (Новгород)',
        phone: '+7 (911) 602-14-55',
        channel: 'Доставка по городу',
        status: 'Выполнен',
        note: 'Оплата картой'
      },
      {
        id: 'SL-102',
        orderId: 'ORD-1038',
        date: '19.10.2026, 17:15',
        plantId: 19,
        plantName: 'Голубика высокорослая «Блюкроп»',
        quantity: 4,
        unitPrice: 650,
        totalPrice: 2600,
        customer: 'Елена М.',
        phone: '+7 (921) 730-88-12',
        channel: 'Самовывоз Лешино',
        status: 'Выполнен',
        note: 'Забрали из питомника'
      },
      {
        id: 'SL-103',
        orderId: 'ORD-1035',
        date: '19.10.2026, 11:20',
        plantId: 2,
        plantName: 'Туя западная «Брабант»',
        quantity: 10,
        unitPrice: 490,
        totalPrice: 4900,
        customer: 'Михаил Дмитриевич',
        phone: '+7 (905) 290-33-40',
        channel: 'Доставка по городу',
        status: 'Выполнен',
        note: 'Для живой изгороди'
      },
      {
        id: 'SL-104',
        orderId: 'ORD-1029',
        date: '18.10.2026, 16:45',
        plantId: 11,
        plantName: 'Ель голубая «Маджестик Блю»',
        quantity: 2,
        unitPrice: 1500,
        totalPrice: 3000,
        customer: 'Сергей К.',
        phone: '+7 (960) 201-99-88',
        channel: 'СДЭК по России',
        status: 'Выполнен',
        note: 'Отправка в коробке ЗКС'
      },
      {
        id: 'SL-105',
        orderId: 'ORD-1022',
        date: '17.10.2026, 12:10',
        plantId: 17,
        plantName: 'Сосна горная «Пумилио»',
        quantity: 3,
        unitPrice: 890,
        totalPrice: 2670,
        customer: 'Анна Николаевна',
        phone: '+7 (951) 723-45-67',
        channel: 'Самовывоз Лешино',
        status: 'Выполнен',
        note: 'На рокарий'
      },
      {
        id: 'SL-106',
        orderId: 'ORD-1017',
        date: '16.10.2026, 15:50',
        plantId: 18,
        plantName: 'Голубика высокорослая «Дюк»',
        quantity: 5,
        unitPrice: 650,
        totalPrice: 3250,
        customer: 'Татьяна В.',
        phone: '+7 (921) 198-77-66',
        channel: 'Доставка по городу',
        status: 'Выполнен',
        note: 'Ранний урожайный сорт'
      },
      {
        id: 'SL-107',
        orderId: 'MAN-101',
        date: '20.10.2026, 16:10',
        plantId: 1,
        plantName: 'Туя западная «Смарагд»',
        quantity: 4,
        unitPrice: 550,
        totalPrice: 2200,
        customer: 'Иван К. (самовывоз)',
        phone: '+7 (911) 600-11-22',
        channel: 'Питомник',
        status: 'Выполнен',
        note: 'Покупка на месте в Лешино'
      },
      {
        id: 'SL-108',
        orderId: 'MAN-102',
        date: '19.10.2026, 13:40',
        plantId: 8,
        plantName: 'Можжевельник скальный «Блю Эрроу»',
        quantity: 2,
        unitPrice: 890,
        totalPrice: 1780,
        customer: 'Виктор (питомник)',
        phone: '+7 (921) 555-43-21',
        channel: 'Питомник',
        status: 'Выполнен',
        note: 'Оплата картой на месте'
      }
    ];

    let SALES_LOG = [];

    // Comprehensive HTML & Attribute Sanitizer (Anti-XSS)
    function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;');
    }

    // Helper: Smart query matcher for sales journal (Russian morphology, synonyms, multi-word)
    function matchesSaleQuery(s, q) {
      if (!q) return true;
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      const textCorpus = [
        s.plantName || '',
        s.customer || '',
        s.orderId || '',
        s.status || '',
        s.channel || '',
        s.phone || '',
        s.note || '',
        s.date || '',
        s.quantity ? `${s.quantity} шт` : '',
        s.totalPrice ? `${s.totalPrice} руб` : '',
        s.status === 'Выполнен' ? 'выполнен выполненные выполнено завершен завершенные' : '',
        s.status === 'Новый' ? 'новый новые новенькие' : '',
        s.status === 'В работе' ? 'в работе работа обрабатывается' : '',
        s.status === 'Отменен' ? 'отменен отмененные отмена' : '',
        (s.channel && (s.channel.includes('Питомник') || s.channel.includes('Самовывоз') || s.channel.includes('Лешино'))) ? 'питомник на месте самовывоз склад лешино' : ''
      ].join(' ').toLowerCase();

      return terms.every(term => textCorpus.includes(term));
    }

    // Universal confirmation modal handler
    let pendingConfirmActionCallback = null;

    function openConfirmActionModal(config) {
      const modal = document.getElementById('confirmActionModal');
      if (!modal) {
        if (confirm(`${config.title || 'Подтвердите действие'}\n\n${config.message || ''}`)) {
          if (typeof config.onConfirm === 'function') config.onConfirm();
        }
        return;
      }
      document.getElementById('confirmActionTitle').innerText = config.title || 'Подтвердите действие';
      document.getElementById('confirmActionMessage').innerText = config.message || 'Вы уверены?';
      const iconEl = document.getElementById('confirmActionIcon');
      if (iconEl) {
        if (config.iconSvg) iconEl.innerHTML = config.iconSvg;
        else if (config.icon === 'trash' || config.icon === '🗑️') iconEl.innerHTML = SVG_ICONS.trash;
        else if (config.icon === 'receipt' || config.icon === '🧾') iconEl.innerHTML = SVG_ICONS.receipt;
        else if (config.icon === 'refresh' || config.icon === '🔄') iconEl.innerHTML = SVG_ICONS.refresh;
        else if (config.icon === 'box' || config.icon === '📦') iconEl.innerHTML = SVG_ICONS.box;
        else iconEl.innerHTML = SVG_ICONS.alert;
      }
      const submitBtn = document.getElementById('confirmActionSubmitBtn');
      if (submitBtn) {
        submitBtn.innerText = config.confirmText || 'Подтвердить';
        submitBtn.className = config.confirmClass || 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-xs';
      }
      pendingConfirmActionCallback = config.onConfirm || null;
      modal.classList.remove('hidden');
    }

    function closeConfirmActionModal() {
      const modal = document.getElementById('confirmActionModal');
      if (modal) modal.classList.add('hidden');
      pendingConfirmActionCallback = null;
    }

    function handleConfirmActionSubmit() {
      const cb = pendingConfirmActionCallback;
      closeConfirmActionModal();
      if (typeof cb === 'function') {
        cb();
      }
    }

    // Search clear toggle helpers
    function toggleReportSearchClear() {
      const val = (document.getElementById('reportSearchInput')?.value || '').trim();
      const btn = document.getElementById('clearReportSearchBtn');
      if (btn) {
        if (val.length > 0) btn.classList.remove('hidden');
        else btn.classList.add('hidden');
      }
    }

    function clearReportSearch() {
      const input = document.getElementById('reportSearchInput');
      if (input) {
        input.value = '';
        input.focus();
      }
      toggleReportSearchClear();
      renderAdminReportsTable();
    }

    function resetSalesSearchAndFilter() {
      const input = document.getElementById('reportSearchInput');
      if (input) input.value = '';
      toggleReportSearchClear();
      setSalesFilter('all');
      showToast("Показаны все записи журнала продаж");
    }

    function loadSalesLog() {
      try {
        const isCleared = localStorage.getItem('xvoinyimir_sales_cleared') === 'true';
        const saved = localStorage.getItem('xvoinyimir_sales_log');
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            if (parsed.length > 0 || isCleared) {
              SALES_LOG = parsed;
            } else {
              SALES_LOG = JSON.parse(JSON.stringify(DEFAULT_SALES_LOG));
              saveSalesLog();
            }
          } else {
            SALES_LOG = JSON.parse(JSON.stringify(DEFAULT_SALES_LOG));
          }
        } else {
          SALES_LOG = JSON.parse(JSON.stringify(DEFAULT_SALES_LOG));
          saveSalesLog();
        }
      } catch (e) {
        SALES_LOG = JSON.parse(JSON.stringify(DEFAULT_SALES_LOG));
      }
      // Sanitize fields
      SALES_LOG.forEach(s => {
        s.quantity = parseInt(s.quantity) || 1;
        s.unitPrice = parseInt(s.unitPrice) || 0;
        s.totalPrice = (typeof s.totalPrice === 'number' && !isNaN(s.totalPrice)) ? s.totalPrice : (s.quantity * s.unitPrice);
      });
      updateSalesBadge();
    }

    function saveSalesLog() {
      try {
        localStorage.setItem('xvoinyimir_sales_log', JSON.stringify(SALES_LOG));
      } catch (e) {}
      updateSalesBadge();
    }

    function updateSalesBadge() {
      const badge = document.getElementById('adminReportsBadge');
      if (badge) {
        const totalSold = SALES_LOG.filter(s => s.status !== 'Отменен').reduce((acc, s) => acc + (parseInt(s.quantity) || 0), 0);
        badge.innerText = totalSold + ' шт.';
      }
    }

    function recordSale(entry) {
      const qty = parseInt(entry.quantity) || 1;
      const unitP = parseInt(entry.unitPrice) || 0;
      const totP = (typeof entry.totalPrice === 'number' && !isNaN(entry.totalPrice)) ? entry.totalPrice : (qty * unitP);
      const newEntry = {
        id: 'SL-' + Date.now() + '-' + Math.floor(Math.random() * 100),
        orderId: entry.orderId || ('MAN-' + Math.floor(1000 + Math.random() * 9000)),
        date: entry.date || new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        plantId: entry.plantId,
        plantName: entry.plantName,
        quantity: qty,
        unitPrice: unitP,
        totalPrice: totP,
        customer: entry.customer || 'Покупатель',
        phone: entry.phone || '',
        channel: entry.channel || 'Питомник',
        status: entry.status || 'Выполнен',
        note: entry.note || ''
      };
      SALES_LOG.unshift(newEntry);
      try {
        localStorage.removeItem('xvoinyimir_sales_cleared');
      } catch(e) {}
      saveSalesLog();
      renderAdminReportsTable();
    }

    function deleteSaleRecord(saleId) {
      const record = SALES_LOG.find(s => s.id === saleId);
      if (!record) return;
      openConfirmActionModal({
        title: 'Удалить запись продажи?',
        message: `Удалить запись о продаже «${record.plantName}» (${record.quantity} шт.) из журнала? Складской остаток сохранится.`,
        confirmText: 'Удалить запись',
        icon: 'trash',
        confirmClass: 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-xs',
        onConfirm: () => {
          SALES_LOG = SALES_LOG.filter(s => s.id !== saleId);
          saveSalesLog();
          renderAdminReportsTable();
          showToast("Запись продажи удалена из журнала");
        }
      });
    }

    function openClearSalesModal() {
      openConfirmActionModal({
        title: 'Очистить журнал продаж?',
        message: 'Вы уверены, что хотите полностью очистить весь журнал продаж? Все текущие записи будут удалены. Вы всегда сможете восстановить демонстрационные данные кнопкой «Сброс / Восстановить демо».',
        confirmText: 'Да, очистить журнал',
        icon: 'receipt',
        confirmClass: 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-xs',
        onConfirm: performClearSalesLog
      });
    }

    function clearSalesLog() {
      openClearSalesModal();
    }

    function performClearSalesLog() {
      SALES_LOG = [];
      try {
        localStorage.setItem('xvoinyimir_sales_log', JSON.stringify([]));
        localStorage.setItem('xvoinyimir_sales_cleared', 'true');
        // Remember IDs of currently existing orders so syncCompletedOrdersToReports doesn't resurrect them
        const orders = typeof getOrders === 'function' ? getOrders() : [];
        const orderIds = orders.map(o => o.id).filter(Boolean);
        localStorage.setItem('xvoinyimir_cleared_order_ids', JSON.stringify(orderIds));
      } catch (e) {}

      // Reset search and filter
      const sInput = document.getElementById('reportSearchInput');
      if (sInput) sInput.value = '';
      toggleReportSearchClear();
      currentSalesFilter = 'all';
      ['all', 'done', 'local'].forEach(f => {
        const btn = document.getElementById('salesFilterBtn_' + f);
        if (!btn) return;
        if (f === 'all') {
          btn.className = "px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-pine-800 bg-pine-800 text-white cursor-pointer transition-all";
        } else {
          btn.className = "px-3 py-1.5 rounded-xl text-xs font-semibold border-2 border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer transition-all flex items-center gap-1.5";
        }
      });

      renderAdminReportsTable();
      showToast("Журнал продаж успешно очищен");
    }

    function restoreDemoReports() {
      openConfirmActionModal({
        title: 'Восстановить демонстрационные данные?',
        message: 'Журнал продаж, журнал заказов и остатки растений на складе будут возвращены к исходным демонстрационным значениям питомника.',
        confirmText: 'Да, восстановить демо',
        icon: 'refresh',
        confirmClass: 'px-4 py-2 rounded-xl bg-pine-800 hover:bg-pine-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-xs',
        onConfirm: () => {
          try {
            localStorage.removeItem('xvoinyimir_sales_cleared');
            localStorage.removeItem('xvoinyimir_cleared_order_ids');
            localStorage.removeItem('xvoinyimir_orders_cleared');
          } catch (e) {}

          SALES_LOG = JSON.parse(JSON.stringify(DEFAULT_SALES_LOG));
          saveSalesLog();

          if (typeof DEFAULT_ORDERS !== 'undefined') {
            localStorage.setItem('xvoinyimir_orders', JSON.stringify(DEFAULT_ORDERS));
          }

          PLANTS = JSON.parse(JSON.stringify(DEFAULT_PLANTS));
          savePlants();

          const rInput = document.getElementById('reportSearchInput');
          if (rInput) rInput.value = '';
          toggleReportSearchClear();
          setSalesFilter('all');

          const oInput = document.getElementById('adminOrderSearch');
          if (oInput) oInput.value = '';
          if (typeof toggleOrderSearchClear === 'function') toggleOrderSearchClear();
          if (typeof filterAdminOrdersByStatus === 'function') filterAdminOrdersByStatus('all');

          renderProducts();
          updateSeasonHitUI();
          renderAdminPlantsTable();
          if (typeof renderAdminOrdersTable === 'function') renderAdminOrdersTable();
          renderAdminReportsTable();
          showToast("Данные склада, заказов и отчетов успешно восстановлены!");
        }
      });
    }

    function changePlantStock(plantId, delta, showToastMsg = true) {
      const plant = PLANTS.find(p => p.id === plantId);
      if (!plant) return;
      const d = parseInt(delta) || 0;
      if (plant.stock === undefined || isNaN(plant.stock) || plant.stock === null) plant.stock = 20;
      plant.stock = Math.max(0, parseInt(plant.stock) + d);
      savePlants();
      renderProducts();
      updateSeasonHitUI();
      renderAdminPlantsTable();
      renderAdminReportsTable();
      if (showToastMsg) {
        showToast(`Остаток «${plant.name}»: ${plant.stock} шт.`);
      }
    }

    function setPlantStock(plantId, val) {
      const plant = PLANTS.find(p => p.id === plantId);
      if (!plant) return;
      const num = parseInt(val);
      plant.stock = isNaN(num) || num < 0 ? 0 : num;
      savePlants();
      renderProducts();
      updateSeasonHitUI();
      renderAdminPlantsTable();
      renderAdminReportsTable();
      showToast(`Остаток «${plant.name}»: ${plant.stock} шт.`);
    }

    let currentSalesFilter = 'all';

    function setSalesFilter(filter) {
      currentSalesFilter = filter;
      ['all', 'done', 'local'].forEach(f => {
        const btn = document.getElementById('salesFilterBtn_' + f);
        if (!btn) return;
        if (f === filter) {
          btn.className = "px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-pine-800 bg-pine-800 text-white cursor-pointer transition-all";
        } else {
          btn.className = "px-3 py-1.5 rounded-xl text-xs font-semibold border-2 border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer transition-all flex items-center gap-1.5";
        }
      });
      renderAdminReportsTable();
    }

    function syncCompletedOrdersToReports() {
      if (typeof getOrders !== 'function') return;
      const orders = getOrders();
      let updated = false;

      let clearedOrderIds = [];
      try {
        const raw = localStorage.getItem('xvoinyimir_cleared_order_ids');
        if (raw) clearedOrderIds = JSON.parse(raw);
      } catch (e) {}

      orders.forEach(order => {
        const orderId = order.id || 'ORD-0000';
        // If this order was previously in the cleared batch, do not resurrect it
        if (clearedOrderIds.includes(orderId)) return;

        const isDone = order.status === 'Выполнен';
        const isCancelled = order.status === 'Отменен';

        // Check for existing entries for this order in SALES_LOG
        const existingEntries = SALES_LOG.filter(s => s.orderId === orderId);

        if (isDone) {
          if (existingEntries.length === 0) {
            // Need to insert records for this completed order
            if (Array.isArray(order.items) && order.items.length > 0) {
              order.items.forEach((item, idx) => {
                const plant = typeof findPlantForItem === 'function' ? findPlantForItem(item) : null;
                const qty = parseInt(item.qty) || 1;
                const price = parseInt(item.price) || (parseInt(order.total) ? Math.round(parseInt(order.total) / (order.items.length || 1)) : 550);
                const tot = price * qty;

                SALES_LOG.unshift({
                  id: 'SL-' + orderId.replace(/\D/g, '') + (order.items.length > 1 ? `-${idx + 1}` : ''),
                  orderId: orderId,
                  date: order.date || new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
                  plantId: plant ? plant.id : (item.id || null),
                  plantName: item.name || (plant ? plant.name : 'Саженец питомника'),
                  quantity: qty,
                  unitPrice: price,
                  totalPrice: tot,
                  customer: order.name ? `${order.name} (${order.phone || ''})` : (order.phone || 'Покупатель'),
                  phone: order.phone || '',
                  channel: order.type || 'Сайт',
                  status: 'Выполнен',
                  note: `Заказ выполнен • ${order.delivery || 'Самовывоз'}`
                });
                updated = true;
              });
            } else {
              // Order without items
              SALES_LOG.unshift({
                id: 'SL-' + orderId.replace(/\D/g, ''),
                orderId: orderId,
                date: order.date || new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
                plantId: null,
                plantName: order.interest || order.type || 'Заказ саженцев',
                quantity: 1,
                unitPrice: parseInt(order.total) || 0,
                totalPrice: parseInt(order.total) || 0,
                customer: order.name ? `${order.name} (${order.phone || ''})` : (order.phone || 'Покупатель'),
                phone: order.phone || '',
                channel: order.type || 'Сайт',
                status: 'Выполнен',
                note: `Заказ выполнен • ${order.delivery || 'Самовывоз'}`
              });
              updated = true;
            }
          } else {
            // Update status on existing entries
            existingEntries.forEach(s => {
              if (s.status !== 'Выполнен') {
                s.status = 'Выполнен';
                updated = true;
              }
            });
          }
        } else if (isCancelled) {
          existingEntries.forEach(s => {
            if (s.status !== 'Отменен') {
              s.status = 'Отменен';
              updated = true;
            }
          });
        } else {
          // 'Новый' or 'В работе'
          existingEntries.forEach(s => {
            if (s.status !== order.status && s.status !== 'Выполнен') {
              s.status = order.status;
              updated = true;
            }
          });
        }
      });

      if (updated) {
        saveSalesLog();
      }
    }

    function renderAdminReportsTable() {
      if (!Array.isArray(PLANTS) || PLANTS.length === 0) {
        loadPlants();
      }

      // 0. Ensure all completed orders from Orders tab are synced into sales journal
      syncCompletedOrdersToReports();

      // 1. KPI Cards
      // Count active non-cancelled sales
      const activeSales = SALES_LOG.filter(s => s.status !== 'Отменен');
      const totalRev = activeSales.reduce((acc, s) => acc + (parseInt(s.totalPrice) || 0), 0);
      const totalSold = activeSales.reduce((acc, s) => acc + (parseInt(s.quantity) || 0), 0);
      const totalStock = PLANTS.reduce((acc, p) => acc + (parseInt(p.stock) || 0), 0);
      const totalStockVal = PLANTS.reduce((acc, p) => acc + ((parseInt(p.price) || 0) * (parseInt(p.stock) || 0)), 0);

      const revEl = document.getElementById('reportTotalRevenue');
      const soldEl = document.getElementById('reportTotalSoldQty');
      const stockEl = document.getElementById('reportTotalStockQty');
      const stockValEl = document.getElementById('reportTotalStockValue');

      if (revEl) revEl.innerText = (isNaN(totalRev) ? 0 : totalRev).toLocaleString('ru-RU') + ' ₽';
      if (soldEl) soldEl.innerText = (isNaN(totalSold) ? 0 : totalSold) + ' шт.';
      if (stockEl) stockEl.innerText = (isNaN(totalStock) ? 0 : totalStock) + ' шт.';
      if (stockValEl) stockValEl.innerText = (isNaN(totalStockVal) ? 0 : totalStockVal).toLocaleString('ru-RU') + ' ₽';
      updateSalesBadge();

      // 2. Filter Tab Badges
      const countAllEl = document.getElementById('salesCountAll');
      const countDoneEl = document.getElementById('salesCountDone');
      const countLocalEl = document.getElementById('salesCountLocal');
      const allCount = activeSales.length;
      const doneCount = SALES_LOG.filter(s => s.status === 'Выполнен' || (s.orderId && !s.status && !s.orderId.startsWith('MAN-'))).length;
      const localCount = SALES_LOG.filter(s => s.channel === 'Питомник' || (s.channel && (s.channel.includes('Питомник') || s.channel.includes('Самовывоз') || s.channel.includes('Лешино'))) || (s.orderId && s.orderId.startsWith('MAN-')) || !s.orderId).length;
      if (countAllEl) countAllEl.innerText = allCount;
      if (countDoneEl) countDoneEl.innerText = doneCount;
      if (countLocalEl) countLocalEl.innerText = localCount;

      // 3. Section 1: Sales Journal Table
      const salesTbody = document.getElementById('adminSalesTableBody');
      if (salesTbody) {
        const query = (document.getElementById('reportSearchInput')?.value || '').toLowerCase().trim();
        salesTbody.innerHTML = '';

        const filteredSales = SALES_LOG.filter(s => {
          // Tab filter
          if (currentSalesFilter === 'done') {
            const isDone = s.status === 'Выполнен' || (s.orderId && !s.status && !s.orderId.startsWith('MAN-'));
            if (!isDone) return false;
          } else if (currentSalesFilter === 'local') {
            const isLocal = s.channel === 'Питомник' || (s.channel && (s.channel.includes('Питомник') || s.channel.includes('Самовывоз') || s.channel.includes('Лешино'))) || (s.orderId && s.orderId.startsWith('MAN-')) || !s.orderId;
            if (!isLocal) return false;
          }

          // Search query with smart Russian morphology & multi-word matching
          return matchesSaleQuery(s, query);
        });

        if (filteredSales.length === 0) {
          if (SALES_LOG.length > 0) {
            salesTbody.innerHTML = `
              <tr>
                <td colspan="9" class="text-center py-10 px-4">
                  <div class="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
                    <div class="w-12 h-12 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>
                    <div class="font-bold text-stone-800 text-sm">По текущему фильтру записей не найдено</div>
                    <div class="text-xs text-stone-500">
                      ${query ? `По запросу «<span class="font-semibold text-pine-900">${escapeHtml(query)}</span>» нет совпадений.` : 'В выбранной вкладке пока нет записей.'}
                      Всего в журнале: <strong class="text-stone-700">${SALES_LOG.length}</strong> записей.
                    </div>
                    <button onclick="resetSalesSearchAndFilter()" class="mt-3 px-4 py-2 rounded-xl bg-pine-800 hover:bg-pine-700 active:scale-95 text-white font-bold text-xs transition-all shadow-xs border-2 border-pine-900 cursor-pointer flex items-center gap-1.5">
                      <span>↺</span> Сбросить фильтр и показать все записи (${SALES_LOG.length})
                    </button>
                  </div>
                </td>
              </tr>
            `;
          } else {
            salesTbody.innerHTML = `
              <tr>
                <td colspan="9" class="text-center py-10 px-4">
                  <div class="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
                    <div class="w-12 h-12 rounded-2xl bg-stone-100 border-2 border-stone-200 flex items-center justify-center text-stone-600 shadow-2xs"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><line x1="8" x2="16" y1="8" y2="8"/><line x1="8" x2="16" y1="12" y2="12"/><line x1="8" x2="13" y1="16" y2="16"/></svg></div>
                    <div class="font-bold text-stone-800 text-sm">Журнал продаж пуст</div>
                    <div class="text-xs text-stone-500 text-center">
                      Записи появляются здесь автоматически при выполнении заказов с сайта, либо при ручном внесении продажи.
                    </div>
                    <div class="flex flex-wrap items-center justify-center gap-2 mt-3">
                      <button onclick="openManualSaleModal()" class="px-4 py-2 rounded-xl bg-pine-800 hover:bg-pine-700 active:scale-95 text-white font-bold text-xs transition-all cursor-pointer shadow-xs">
                        + Внести продажу вручную
                      </button>
                      <button onclick="restoreDemoReports()" class="px-3.5 py-2 rounded-xl border-2 border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-all cursor-pointer">
                        <span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg> <span>Восстановить демо-данные</span></span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            `;
          }
        } else {
          filteredSales.forEach(s => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-stone-50 transition-colors';
            const sTot = (typeof s.totalPrice === 'number' && !isNaN(s.totalPrice)) ? s.totalPrice : ((parseInt(s.quantity)||1) * (parseInt(s.unitPrice)||0));

            // Status badge HTML
            let statusBadge = '';
            if (s.status === 'Выполнен') {
              statusBadge = '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Выполнен</span>';
            } else if (s.status === 'В работе') {
              statusBadge = '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800 border border-sky-300"><span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span> В работе</span>';
            } else if (s.status === 'Новый') {
              statusBadge = '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Новый</span>';
            } else if (s.status === 'Отменен') {
              statusBadge = '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Отменен</span>';
            } else {
              statusBadge = '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-300"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> В питомнике</span>';
            }

            const safeSaleId = escapeHtml(s.id || '');
            tr.innerHTML = `
              <td class="py-2.5 px-4 font-mono text-stone-500 whitespace-nowrap">${escapeHtml(s.date || '')}</td>
              <td class="py-2.5 px-4">
                <span class="font-bold text-pine-900">${escapeHtml(s.orderId || 'Продажа')}</span>
                <span class="block text-[10px] text-stone-400">${escapeHtml(s.channel || 'Питомник')}</span>
              </td>
              <td class="py-2.5 px-4 whitespace-nowrap">
                ${statusBadge}
              </td>
              <td class="py-2.5 px-4 font-bold text-stone-900">${escapeHtml(s.plantName || '')}</td>
              <td class="py-2.5 px-4 text-center font-black text-pine-900 bg-pine-50/50">${Number(s.quantity) || 0} шт.</td>
              <td class="py-2.5 px-4 text-stone-600">${Number(s.unitPrice) || 0} ₽</td>
              <td class="py-2.5 px-4 font-black text-emerald-800">${sTot.toLocaleString('ru-RU')} ₽</td>
              <td class="py-2.5 px-4">
                <div class="text-stone-800 font-medium">${escapeHtml(s.customer || '—')}</div>
                <div class="text-[10px] text-stone-400">${escapeHtml(s.phone || s.note || '')}</div>
              </td>
              <td class="py-2.5 px-4 text-right">
                <button onclick="deleteSaleRecord('${safeSaleId}')" class="p-1.5 text-stone-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer" title="Удалить запись">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </td>
            `;
            salesTbody.appendChild(tr);
          });
        }
      }

      // 4. Section 2: Stock Balances Table
      const stockTbody = document.getElementById('adminStockTableBody');
      if (stockTbody) {
        stockTbody.innerHTML = '';
        PLANTS.forEach(p => {
          const stock = p.stock !== undefined ? parseInt(p.stock) : 20;
          const soldCount = SALES_LOG
            .filter(s => s.status !== 'Отменен' && (s.plantId === p.id || s.plantName === p.name || (s.plantName && p.name && (s.plantName.includes(p.name) || p.name.includes(s.plantName)))))
            .reduce((acc, s) => acc + (parseInt(s.quantity) || 0), 0);
          const stockValue = (parseInt(p.price) || 0) * stock;

          const tr = document.createElement('tr');
          tr.className = 'hover:bg-stone-50 transition-colors';
          tr.innerHTML = `
            <td class="py-2 px-4">
              <img src="${p.image}" class="w-9 h-9 rounded-lg object-cover border border-stone-200" alt="${p.name}">
            </td>
            <td class="py-2 px-4">
              <div class="font-bold text-stone-900 leading-tight">${p.name}</div>
              <div class="text-[10px] text-stone-400 italic">${p.latin || ''}</div>
            </td>
            <td class="py-2 px-4 text-stone-600 font-medium">${getCategoryName(p.category)}</td>
            <td class="py-2 px-4 font-bold text-stone-900">${p.price} ₽</td>
            <td class="py-2 px-4 text-center">
              ${stock > 10 ? `
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">${stock} шт.</span>
              ` : stock > 0 ? `
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">${stock} шт.</span>
              ` : `
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">0 шт.</span>
              `}
            </td>
            <td class="py-2 px-4 text-center font-bold text-pine-800">${soldCount} шт.</td>
            <td class="py-2 px-4 text-right font-black text-stone-800">${stockValue.toLocaleString('ru-RU')} ₽</td>
            <td class="py-2 px-4">
              <div class="flex items-center justify-center gap-1">
                <button onclick="changePlantStock(${p.id}, -1)" class="w-7 h-7 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 active:scale-95 text-stone-700 font-bold flex items-center justify-center cursor-pointer shadow-2xs" title="Списать 1 шт.">-</button>
                <input type="number" min="0" value="${stock}" onchange="setPlantStock(${p.id}, this.value)" class="w-14 text-center py-1 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-pine-600 font-bold">
                <button onclick="changePlantStock(${p.id}, 1)" class="w-7 h-7 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 active:scale-95 text-stone-700 font-bold flex items-center justify-center cursor-pointer shadow-2xs" title="Добавить 1 шт.">+</button>
              </div>
            </td>
          `;
          stockTbody.appendChild(tr);
        });
      }
    }
    // Modal: Manual Sale
    function openManualSaleModal() {
      const select = document.getElementById('manualSalePlantSelect');
      if (select) {
        select.innerHTML = '';
        PLANTS.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.innerText = `${p.name} (${p.price} ₽, в наличии ${p.stock !== undefined ? p.stock : 20} шт.)`;
          select.appendChild(opt);
        });
      }
      onManualSalePlantChange();
      const modal = document.getElementById('manualSaleModal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeManualSaleModal() {
      const modal = document.getElementById('manualSaleModal');
      if (modal) modal.classList.add('hidden');
    }

    function onManualSalePlantChange() {
      const select = document.getElementById('manualSalePlantSelect');
      if (!select) return;
      const plantId = parseInt(select.value);
      const plant = PLANTS.find(p => p.id === plantId);
      if (plant) {
        const priceInput = document.getElementById('manualSalePrice');
        if (priceInput) priceInput.value = plant.price;
      }
      recalcManualSaleTotal();
    }

    function recalcManualSaleTotal() {
      const qty = parseInt(document.getElementById('manualSaleQty')?.value) || 0;
      const price = parseInt(document.getElementById('manualSalePrice')?.value) || 0;
      const totalText = document.getElementById('manualSaleTotalText');
      if (totalText) totalText.innerText = (qty * price).toLocaleString('ru-RU') + ' ₽';
    }

    function handleSaveManualSale(e) {
      e.preventDefault();
      const select = document.getElementById('manualSalePlantSelect');
      const plantId = parseInt(select.value);
      const plant = PLANTS.find(p => p.id === plantId);
      if (!plant) return;

      const qty = parseInt(document.getElementById('manualSaleQty').value) || 1;
      const price = parseInt(document.getElementById('manualSalePrice').value) || plant.price;
      const channel = document.getElementById('manualSaleChannel').value;
      const customer = document.getElementById('manualSaleCustomer').value.trim() || 'Покупатель';
      const deduct = document.getElementById('manualSaleDeductStock').checked;

      if (deduct) {
        changePlantStock(plant.id, -qty, false);
      }

      recordSale({
        orderId: 'MAN-' + Math.floor(1000 + Math.random() * 9000),
        plantId: plant.id,
        plantName: plant.name,
        quantity: qty,
        unitPrice: price,
        totalPrice: qty * price,
        customer,
        channel
      });

      closeManualSaleModal();
      showToast(`Продажа «${plant.name}» (${qty} шт.) успешно внесена!`);
    }

    // Modal: Stock Arrival
    function openStockArrivalModal() {
      const select = document.getElementById('stockArrivalPlantSelect');
      if (select) {
        select.innerHTML = '';
        PLANTS.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.innerText = `${p.name} (текущий остаток: ${p.stock !== undefined ? p.stock : 20} шт.)`;
          select.appendChild(opt);
        });
      }
      const modal = document.getElementById('stockArrivalModal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeStockArrivalModal() {
      const modal = document.getElementById('stockArrivalModal');
      if (modal) modal.classList.add('hidden');
    }

    function handleSaveStockArrival(e) {
      e.preventDefault();
      const select = document.getElementById('stockArrivalPlantSelect');
      const plantId = parseInt(select.value);
      const plant = PLANTS.find(p => p.id === plantId);
      if (!plant) return;

      const qty = parseInt(document.getElementById('stockArrivalQty').value) || 1;
      changePlantStock(plant.id, qty, false);
      closeStockArrivalModal();
      showToast(`Склад пополнен: «${plant.name}» +${qty} шт. (теперь ${plant.stock} шт.)`);
    }

    // Export Reports CSV (Excel compatible with UTF-8 BOM)
    function exportReportsCSV() {
      const rows = [
        ["ID записи", "ID заказа", "Дата и время", "Сорт растения", "Количество (шт)", "Цена за шт (руб)", "Сумма (руб)", "Покупатель", "Канал продаж", "Примечание"]
      ];
      SALES_LOG.forEach(s => {
        rows.push([
          s.id,
          s.orderId || '',
          s.date,
          `"${(s.plantName || '').replace(/"/g, '""')}"`,
          s.quantity,
          s.unitPrice,
          s.totalPrice,
          `"${(s.customer || '').replace(/"/g, '""')}"`,
          `"${(s.channel || '').replace(/"/g, '""')}"`,
          `"${(s.note || '').replace(/"/g, '""')}"`
        ]);
      });
      const csvContent = "\uFEFF" + rows.map(r => r.join(";")).join("\r\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Otchet_prodazh_Hvoinyimir_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // ==========================================
    // FAQ & VIRTUAL AGRONOMIST ASSISTANT ENGINE
    // ==========================================
    
    // FAQ Accordion Toggle
    function toggleFaq(index) {
      const content = document.getElementById(`faqContent${index}`);
      const chevron = document.getElementById(`faqChevron${index}`);
      if (!content) return;
      const isHidden = content.classList.contains('hidden');

      if (isHidden) {
        content.classList.remove('hidden');
        content.style.overflow = 'hidden';
        const naturalHeight = content.scrollHeight;

        if (typeof anime !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          anime.remove(content);
          if (chevron) anime.remove(chevron);
          anime({
            targets: content,
            height: [0, naturalHeight],
            opacity: [0, 1],
            duration: 340,
            easing: 'easeOutCubic',
            complete: function() {
              content.style.height = '';
              content.style.overflow = '';
            }
          });
          if (chevron) {
            anime({
              targets: chevron,
              rotate: [0, 180],
              duration: 260,
              easing: 'easeOutQuad'
            });
          }
        } else {
          if (chevron) chevron.classList.add('rotate-180');
        }
      } else {
        if (typeof anime !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          content.style.overflow = 'hidden';
          anime.remove(content);
          if (chevron) anime.remove(chevron);
          anime({
            targets: content,
            height: [content.scrollHeight, 0],
            opacity: [1, 0],
            duration: 260,
            easing: 'easeInCubic',
            complete: function() {
              content.classList.add('hidden');
              content.style.height = '';
              content.style.overflow = '';
            }
          });
          if (chevron) {
            anime({
              targets: chevron,
              rotate: [180, 0],
              duration: 240,
              easing: 'easeInQuad'
            });
          }
        } else {
          content.classList.add('hidden');
          if (chevron) chevron.classList.remove('rotate-180');
        }
      }
    }

    function askBotFromFaq(questionText) {
      scrollToAssistantChat();
      sendBotQuery(questionText);
    }

    function scrollToAssistantChat() {
      const target = document.getElementById('faq-assistant');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        const card = document.getElementById('botChatContainerCard');
        if (card) {
          card.classList.add('ring-4', 'ring-emerald-400/60');
          setTimeout(() => {
            card.classList.remove('ring-4', 'ring-emerald-400/60');
          }, 1500);
        }
      }
      const input = document.getElementById('botQueryInput');
      if (input) {
        setTimeout(() => {
          input.focus();
        }, 350);
      }
    }

    // Bot Assistant Chat State
    const BOT_DEFAULT_GREETING = {
      sender: 'bot',
      time: '',
      text: "Здравствуйте! Я виртуальный агроном питомника «Хвойный мир» (Великий Новгород).\n\nЯ знаю всё о наших растениях, ценах, правильной посадке, кислотности почвы для голубики и доставке. Спросите меня о чём угодно или выберите быстрый вопрос ниже!"
    };

    let botMessages = [];

    function initBotChat() {
      const saved = localStorage.getItem('xvoinyimir_chat_history');
      if (saved) {
        try {
          botMessages = JSON.parse(saved);
        } catch (e) {
          botMessages = [];
        }
      }
      if (!botMessages || botMessages.length === 0) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        botMessages = [{
          ...BOT_DEFAULT_GREETING,
          time: timeStr
        }];
      }
      renderBotChat();
    }

    function saveBotChat() {
      try {
        localStorage.setItem('xvoinyimir_chat_history', JSON.stringify(botMessages));
      } catch (e) {
        console.warn('Could not save bot chat history:', e);
      }
    }

    function clearBotChat() {
      openConfirmActionModal({
        title: "Очистка переписки",
        message: "Очистить историю сообщений с агрономом и начать диалог заново?",
        icon: 'trash',
        confirmText: "Очистить диалог",
        confirmClass: "px-4 py-2 rounded-xl bg-pine-850 hover:bg-pine-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs",
        onConfirm: () => {
          localStorage.removeItem('xvoinyimir_chat_history');
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          botMessages = [{
            ...BOT_DEFAULT_GREETING,
            time: timeStr
          }];
          renderBotChat();
          showToast("История переписки с агрономом очищена", "info");
        }
      });
    }

    function renderBotChat() {
      const log = document.getElementById('botChatLog');
      if (!log) return;
      log.innerHTML = '';

      botMessages.forEach(msg => {
        const isUser = msg.sender === 'user';
        const wrapper = document.createElement('div');
        wrapper.className = `flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`;

        if (isUser) {
          wrapper.innerHTML = `
            <div class="max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-tr-xs bg-pine-850 text-white p-3 sm:p-3.5 text-xs sm:text-sm shadow-xs border border-pine-700">
              <p class="leading-relaxed whitespace-pre-line">${escapeHtml(msg.text)}</p>
            </div>
            <span class="text-[10px] text-stone-400 font-medium px-1">${msg.time || ''}</span>
          `;
        } else {
          wrapper.innerHTML = `
            <div class="flex items-start gap-2 max-w-[95%] sm:max-w-[90%]">
              <div class="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12c0-3.5 2.5-6 7-6-1 4-3.5 6-7 6z"/><path d="M12 15c0-2.5-2-4.5-5.5-4.5.5 3 2.5 4.5 5.5 4.5z"/></svg>
              </div>
              <div class="space-y-1">
                <div class="rounded-2xl rounded-tl-xs bg-white text-stone-800 p-3.5 sm:p-4 text-xs sm:text-sm shadow-xs border border-pine-200/90 space-y-2">
                  <div class="leading-relaxed whitespace-pre-line">${msg.html || formatBotMarkdown(msg.text)}</div>
                  ${msg.actionsHtml ? `<div class="pt-2 flex flex-wrap items-center gap-1.5 border-t border-stone-100 mt-2">${msg.actionsHtml}</div>` : ''}
                </div>
                <span class="text-[10px] text-stone-400 font-medium px-1 block">${msg.time || ''}</span>
              </div>
            </div>
          `;
        }

        log.appendChild(wrapper);
      });

      log.scrollTop = log.scrollHeight;
    }

    function formatBotMarkdown(str) {
      if (!str) return '';
      let text = escapeHtml(str);
      // Bold text **word**
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return text;
    }

    function askBotSuggested(chipText) {
      sendBotQuery(chipText);
    }

    function sendBotQuery(customText) {
      const input = document.getElementById('botQueryInput');
      const query = (customText !== undefined ? customText : (input ? input.value : '')).trim();
      if (!query) return;

      if (input && customText === undefined) {
        input.value = '';
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append user message
      botMessages.push({
        sender: 'user',
        text: query,
        time: timeStr
      });
      saveBotChat();
      renderBotChat();

      // Show typing indicator
      const indicator = document.getElementById('botTypingIndicator');
      if (indicator) indicator.classList.remove('hidden');

      const log = document.getElementById('botChatLog');
      if (log) log.scrollTop = log.scrollHeight;

      // Simulate natural typing delay (400-650ms)
      const delay = Math.floor(Math.random() * 250) + 400;
      setTimeout(() => {
        if (indicator) indicator.classList.add('hidden');
        const response = generateAgronomistAnswer(query);
        const respTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        botMessages.push({
          sender: 'bot',
          text: response.text || '',
          html: response.html || '',
          actionsHtml: response.actionsHtml || '',
          time: respTime
        });
        saveBotChat();
        renderBotChat();
      }, delay);
    }

    // Dynamic Botanical Knowledge & Intelligence Engine
    function generateAgronomistAnswer(rawQuery) {
      const q = rawQuery.toLowerCase().trim();

      // Helper for plant lookup
      const findPlant = (keyword) => {
        return PLANTS.find(p => p.name.toLowerCase().includes(keyword) || 
                                 (p.latin && p.latin.toLowerCase().includes(keyword)));
      };

      // 1. SPECIFIC PLANT: THUJA SMARAGD
      if (q.includes('смарагд') || q.includes('smaragd')) {
        const p = findPlant('смарагд') || PLANTS[0];
        const stock = p.stock !== undefined ? parseInt(p.stock) : 28;
        return {
          html: `
            <div class="space-y-2">
              <div class="flex items-center gap-3 bg-pine-50/70 p-2.5 rounded-xl border border-pine-200">
                <img src="${p.image}" class="w-12 h-12 rounded-lg object-cover border border-pine-300 shrink-0" alt="${p.name}">
                <div>
                  <h5 class="font-bold text-pine-950">${p.name}</h5>
                  <div class="text-[11px] text-stone-600">Контейнер: <strong>${p.pot}</strong> • Высота: <strong>${p.height}</strong></div>
                  <div class="text-xs font-black text-pine-900">${p.price} ₽ <span class="text-[10px] font-semibold text-stone-500">• В наличии: ${stock} шт.</span></div>
                </div>
              </div>
              <p><strong>Туя западная «Смарагд»</strong> — абсолютный хит нашего питомника!</p>
              <p>• <strong>Форма:</strong> правильная плотная коническая форма без необходимости постоянной стрижки.</p>
              <p>• <strong>Хвоя:</strong> сочная изумрудная, <em>не буреет и не выгорает</em> на зимнем солнце Новгорода.</p>
              <p>• <strong>Шаг в живой изгороди:</strong> 50–60 см для сомкнутой волновой изгороди.</p>
              <p>• <strong>Морозостойкость:</strong> до -40°C, закрытая корневая система (ЗКС).</p>
            </div>
          `,
          actionsHtml: `
            <button onclick="botAddToCart(${p.id}, '${p.name}')" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs">
              В корзину (${p.price} ₽)
            </button>
            <button onclick="botQuickHedge('smaragd')" class="px-3 py-1.5 rounded-lg bg-pine-50 hover:bg-pine-100 text-pine-900 border border-pine-200 font-semibold text-xs cursor-pointer transition-colors">
              Рассчитать для забора
            </button>
          `
        };
      }

      // 2. SPECIFIC PLANT: THUJA BRABANT
      if (q.includes('брабант') || q.includes('brabant')) {
        const p = findPlant('брабант') || PLANTS[1];
        const stock = p.stock !== undefined ? parseInt(p.stock) : 35;
        return {
          html: `
            <div class="space-y-2">
              <div class="flex items-center gap-3 bg-pine-50/70 p-2.5 rounded-xl border border-pine-200">
                <img src="${p.image}" class="w-12 h-12 rounded-lg object-cover border border-pine-300 shrink-0" alt="${p.name}">
                <div>
                  <h5 class="font-bold text-pine-950">${p.name}</h5>
                  <div class="text-[11px] text-stone-600">Контейнер: <strong>${p.pot}</strong> • Высота: <strong>${p.height}</strong></div>
                  <div class="text-xs font-black text-pine-900">${p.price} ₽ <span class="text-[10px] font-semibold text-stone-500">• В наличии: ${stock} шт.</span></div>
                </div>
              </div>
              <p><strong>Туя западная «Брабант»</strong> — чемпион по скорости роста для живых стен!</p>
              <p>• <strong>Прирост:</strong> до 35–40 см в год! Быстрее всего смыкается в сплошной зеленый забор.</p>
              <p>• <strong>Стрижка:</strong> великолепно стрижется, можно придать форму ровного куба, стены или арки.</p>
              <p>• <strong>Шаг посадки:</strong> 70–80 см между растениями в ряду.</p>
            </div>
          `,
          actionsHtml: `
            <button onclick="botAddToCart(${p.id}, '${p.name}')" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs">
              В корзину (${p.price} ₽)
            </button>
            <button onclick="botQuickHedge('brabant')" class="px-3 py-1.5 rounded-lg bg-pine-50 hover:bg-pine-100 text-pine-900 border border-pine-200 font-semibold text-xs cursor-pointer transition-colors">
              Рассчитать изгородь
            </button>
          `
        };
      }

      // 3. BLUEBERRY PLANTING & ACID SOIL (CRITICAL TOPIC)
      if (q.includes('грунт') || q.includes('почв') || q.includes('кисл') || q.includes('торф') || (q.includes('голубик') && (q.includes('посад') || q.includes('как') || q.includes('уход') || q.includes('ph')))) {
        const blueberrySample = PLANTS.find(p => p.category === 'blueberry') || { id: 5, name: 'Голубика «Блюкроп»', price: 650 };
        return {
          html: `
            <div class="space-y-2">
              <h5 class="font-bold text-indigo-950 flex items-center gap-1.5">
                <span>Главное правило для голубики — КИСЛАЯ ПОЧВА!</span>
              </h5>
              <p>Голубика живёт в симбиозе с эндомикоризой и способна усваивать питательные вещества <strong>только при кислотности pH 3.5 – 4.5</strong>. В обычной садовой земле она гарантированно чахнет.</p>
              <div class="bg-indigo-50/60 p-3 rounded-xl border border-indigo-200 space-y-1.5 text-xs text-indigo-950">
                <p><strong>Рецепт посадочной ямы (диаметр 70 см, глубина 40-50 см):</strong></p>
                <p>1. Чистый <strong>рыжий верховой кислый торф</strong> (pH 3.0-4.0) — основа (70%).</p>
                <p>2. Хвойный сосновый опад и сосновая кора мелкой фракции (30%).</p>
                <p>3. 30–40 г молотой коллоидной серы под перемешку.</p>
                <p>4. <strong>Мульча:</strong> сосновая кора слоем 5–7 см вокруг куста обязательно.</p>
              </div>
              <p class="text-rose-700 font-bold text-[11px] inline-flex items-center gap-1"><svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> <span>Категорически запрещено:</span> зола, навоз, куриный помёт, известь и доломитка!</p>
              <p><strong>Полив:</strong> 1 раз в 2–3 недели поливайте водой с лимонной кислотой (1 чайная ложка на 3 литра воды).</p>
            </div>
          `,
          actionsHtml: `
            <button onclick="askBotSuggested('Какие сорта голубики есть в наличии?')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-semibold text-xs cursor-pointer transition-colors">
              Сорта голубики в наличии
            </button>
            <button onclick="botAddToCart(${blueberrySample.id}, '${blueberrySample.name}')" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs cursor-pointer transition-colors">
              Добавить саженец Блюкроп (650 ₽)
            </button>
          `
        };
      }

      // 4. BLUEBERRY VARIETIES & CATALOG
      if (q.includes('голубик') || q.includes('блюкроп') || q.includes('дюк') || q.includes('патриот') || q.includes('торо') || q.includes('нортленд')) {
        const blues = PLANTS.filter(p => p.category === 'blueberry');
        return {
          html: `
            <div class="space-y-2">
              <h5 class="font-bold text-pine-950">Сортовая высокорослая голубика (2–3 года, ЗКС)</h5>
              <p>Все наши саженцы с закрытой корневой системой (в контейнерах), перезимовавшие на открытом грунте Новгородской области, начинают плодоносить уже в год посадки!</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                ${blues.slice(0, 4).map(b => `
                  <div class="p-2.5 rounded-xl bg-white border border-pine-200 flex items-center justify-between gap-2 shadow-2xs">
                    <div>
                      <div class="font-bold text-pine-950 text-xs">${b.name}</div>
                      <div class="text-[10px] text-stone-500">${b.pot} • В наличии: ${b.stock || 20} шт.</div>
                    </div>
                    <button onclick="botAddToCart(${b.id}, '${b.name}')" class="px-2.5 py-1 rounded-lg bg-pine-800 text-white font-bold text-[11px] hover:bg-pine-700 transition-colors shrink-0">
                      + ${b.price} ₽
                    </button>
                  </div>
                `).join('')}
              </div>
              <p class="text-xs text-stone-600 pt-1 inline-flex items-center gap-1"><svg class="w-3.5 h-3.5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> <span><em>Совет агронома:</em></span> для максимального урожая сажайте рядом 2–3 разных сорта для перекрёстного опыления (например, ранний <strong>Дюк</strong> + среднеспелый <strong>Блюкроп</strong>).</p>
            </div>
          `,
          actionsHtml: `
            <button onclick="askBotSuggested('Какой грунт нужен для голубики?')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-semibold text-xs cursor-pointer transition-colors">
              Инструкция по почве
            </button>
            <button onclick="setCategory('blueberry'); document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });" class="px-3 py-1.5 rounded-lg bg-pine-50 hover:bg-pine-100 text-pine-900 border border-pine-200 font-semibold text-xs cursor-pointer transition-colors">
              Перейти в каталог голубики
            </button>
          `
        };
      }

      // 5. HEDGE CALCULATION & SPACING QUERY
      if (q.includes('изгород') || q.includes('забор') || q.includes('шаг') || q.includes('калькулятор') || (q.includes('брабант') && q.includes('смарагд'))) {
        // Check if user specified a distance like "20 м" or "30 метров"
        const matchDist = q.match(/(\d+)\s*(м|метр)/);
        let distCalc = '';
        if (matchDist) {
          const meters = parseInt(matchDist[1]);
          const brabantCount = Math.ceil(meters / 0.75);
          const smaragdCount = Math.ceil(meters / 0.6);
          const brabantSum = brabantCount * 490;
          const smaragdSum = smaragdCount * 550;
          distCalc = `
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
              <div class="font-bold text-emerald-950">Расчет на длину ${meters} метров:</div>
              <div>• <strong>Туя Брабант</strong> (шаг 75 см): <strong>${brabantCount} шт.</strong> × 490 ₽ = <strong>${brabantSum.toLocaleString()} ₽</strong></div>
              <div>• <strong>Туя Смарагд</strong> (шаг 60 см): <strong>${smaragdCount} шт.</strong> × 550 ₽ = <strong>${smaragdSum.toLocaleString()} ₽</strong></div>
            </div>
          `;
        }

        return {
          html: `
            <div class="space-y-2">
              <h5 class="font-bold text-pine-950">Что лучше для живой изгороди: Брабант или Смарагд?</h5>
              <div class="space-y-1.5 text-xs text-stone-700">
                <p>• <strong>Туя Брабант (490 ₽):</strong> самый быстрый прирост (до 40 см в год!). Шаг посадки: <strong>70–80 см</strong>. Отлично стрижется в прямоугольную сплошную зеленую стену.</p>
                <p>• <strong>Туя Смарагд (550 ₽):</strong> идеальный правильный конус изумрудного цвета без обрезки. Хвоя не буреет зимой. Шаг посадки: <strong>50–60 см</strong> для сомкнутой волны.</p>
              </div>
              ${distCalc}
            </div>
          `,
          actionsHtml: `
            <button onclick="botQuickHedge('brabant')" class="px-3 py-1.5 rounded-lg bg-pine-50 hover:bg-pine-100 text-pine-900 border border-pine-200 font-semibold text-xs cursor-pointer transition-colors">
              Открыть калькулятор изгороди
            </button>
            <button onclick="botAddToCart(2, 'Туя Брабант')" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs cursor-pointer transition-colors">
              В корзину Брабант (490 ₽)
            </button>
            <button onclick="botAddToCart(1, 'Туя Смарагд')" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs cursor-pointer transition-colors">
              В корзину Смарагд (550 ₽)
            </button>
          `
        };
      }

      // 6. PLANTING GENERAL (THUJA / CONIFERS)
      if (q.includes('посад') || q.includes('сажать') || q.includes('яма') || q.includes('инструкци')) {
        return {
          html: `
            <div class="space-y-2">
              <h5 class="font-bold text-pine-950">Пошаговая посадка саженцев с ЗКС:</h5>
              <p>1. <strong>Посадочная яма:</strong> выкопайте яму в 1.5–2 раза больше контейнера (примерно 50×50 см).</p>
              <p>2. <strong>Дренаж:</strong> на дно насыпьте 10–15 см щебня, песка или битого кирпича (хвойные не любят застоя воды).</p>
              <p>3. <strong>Почвосмесь:</strong> 2 части садовой земли + 1 часть торфа + 1 часть речного песка + 40 г комплексного удобрения для хвойных.</p>
              <p>4. <strong>Корневая шейка:</strong> должна быть строго вровень с уровнем почвы (не заглублять!).</p>
              <p>5. <strong>Полив и мульча:</strong> обильно пролейте 15–20 л воды и замульчируйте приствольный круг корой сосны на 5 см.</p>
            </div>
          `,
          actionsHtml: `
            <button onclick="askBotSuggested('Нужно ли укрывать саженцы на зиму?')" class="px-3 py-1.5 rounded-lg bg-pine-50 hover:bg-pine-100 text-pine-900 border border-pine-200 font-semibold text-xs cursor-pointer transition-colors">
              Про зимовку и защиту от солнца
            </button>
          `
        };
      }

      // 7. WINTERING & FROST PROTECTION
      if (q.includes('зима') || q.includes('зимов') || q.includes('мороз') || q.includes('укрыт') || q.includes('ожог') || q.includes('весна')) {
        return {
          html: `
            <div class="space-y-2">
              <h5 class="font-bold text-pine-950">Зимовка растений в Новгородской области:</h5>
              <p>• <strong>Морозостойкость:</strong> все наши растения закалены и спокойно переносят морозы <strong>до -40°C</strong> без утепления.</p>
              <p>• <strong>Солнцезащита:</strong> в феврале–марте солнце становится ярким, а земля ещё мёрзлая — хвоя испаряет влагу, которую корни не могут восполнить. Молодые туи первого года посадки рекомендуется притенить с южной стороны защитной притеночной сеткой или мешковиной.</p>
              <p class="text-rose-700 font-semibold text-[11px] inline-flex items-center gap-1"><svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> <span>Не оборачивайте туи</span> плотно спанбондом или пленкой — растение может выпреть во время оттепелей!</p>
            </div>
          `,
          actionsHtml: `
            <button onclick="askBotSuggested('Как правильно посадить тую?')" class="px-3 py-1.5 rounded-lg bg-pine-50 hover:bg-pine-100 text-pine-900 border border-pine-200 font-semibold text-xs cursor-pointer transition-colors">
              Правила посадки
            </button>
          `
        };
      }

      // 8. DELIVERY & PAYMENT
      if (q.includes('доставк') || q.includes('курьер') || q.includes('сдэк') || q.includes('почт') || q.includes('оплат') || q.includes('новгород')) {
        const threshold = siteSettings.freeDeliveryThreshold || 1500;
        const fee = siteSettings.deliveryFee || 250;
        return {
          html: `
            <div class="space-y-2">
              <h5 class="font-bold text-pine-950">Доставка и оплата:</h5>
              <div class="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div>• <strong>По Великому Новгороду:</strong> доставка курьером за 1–2 дня.</div>
                <div>• <strong>БЕСПЛАТНО</strong> при заказе от <strong>${threshold} ₽</strong>! (при заказе до ${threshold} ₽ — всего ${fee} ₽).</div>
              </div>
              <p>• <strong>По России:</strong> отправляем СДЭК и Почтой РФ в плотных вентилируемых боксах с увлажнённым земляным комом (до 14 дней в пути без потери качества).</p>
              <p>• <strong>Оплата:</strong> наличными курьеру или переводом при получении, либо онлайн при оформлении.</p>
            </div>
          `,
          actionsHtml: `
            <button onclick="document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs cursor-pointer transition-colors">
              Выбрать саженцы в каталоге
            </button>
          `
        };
      }

      // 9. LOCATION & PICKUP
      if (q.includes('где') || q.includes('адрес') || q.includes('лешино') || q.includes('самовывоз') || q.includes('приехать')) {
        return {
          html: `
            <div class="space-y-2">
              <h5 class="font-bold text-pine-950">Наш адрес и самовывоз:</h5>
              <p>• Питомник находится в <strong>Новгородской области, Новгородский район, деревня Лешино</strong>.</p>
              <p>• График работы: ежедневно с <strong>09:00 до 20:00</strong>.</p>
              <p>• Вы можете лично осмотреть саженцы на торговой площадке и забрать растения на своём авто.</p>
              <p class="inline-flex items-center gap-1"><svg class="w-3.5 h-3.5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> <span><em>Пожалуйста, предупредите нас за 1–2 часа до визита:</em> <strong>+7 (960) 203-60-65</strong>, чтобы мы встретили вас.</p>
            </div>
          `,
          actionsHtml: `
            <a href="tel:+79602036065" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors">
              Позвонить (+7 960 203-60-65)
            </a>
            <a href="https://t.me/hvoinyimir" target="_blank" class="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors">
              Наш Telegram
            </a>
          `
        };
      }

      // 10. PRICES & CATALOG SUMMARY
      if (q.includes('цена') || q.includes('прайс') || q.includes('скольк') || q.includes('стоит') || q.includes('каталог') || q.includes('ассортимент')) {
        const totalStock = PLANTS.reduce((acc, p) => acc + (p.stock !== undefined ? parseInt(p.stock) : 20), 0);
        return {
          html: `
            <div class="space-y-2">
              <h5 class="font-bold text-pine-950">Прайс-лист питомника «Хвойный мир» (сезон 2026):</h5>
              <div class="space-y-1 text-xs text-stone-700">
                <div>• <strong>Туи западные (Смарагд, Брабант, Рейнгольд и др.):</strong> от 490 ₽ до 1 500 ₽</div>
                <div>• <strong>Сортовая голубика (Блюкроп, Дюк, Патриот и др.):</strong> от 650 ₽ до 950 ₽</div>
                <div>• <strong>Гортензии метельчатые и спиреи:</strong> от 350 ₽ до 850 ₽</div>
                <div>• <strong>Декоративные травы и злаки:</strong> от 290 ₽</div>
                <div>• <strong>Клубника ремонтантная:</strong> от 120 ₽</div>
              </div>
              <p class="text-[11px] text-stone-500">Все растения в контейнерах с закрытой корневой системой (ЗКС). Общий остаток на складе: <strong>${totalStock} шт.</strong></p>
            </div>
          `,
          actionsHtml: `
            <button onclick="document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs cursor-pointer transition-colors">
              Открыть полный каталог
            </button>
          `
        };
      }

      // 11. DIRECT HUMAN CONTACTS
      if (q.includes('телефон') || q.includes('связат') || q.includes('позвон') || q.includes('whatsapp') || q.includes('вотсап') || q.includes('человек') || q.includes('оператор')) {
        return {
          html: `
            <div class="space-y-2">
              <h5 class="font-bold text-pine-950">Прямая связь с руководством питомника:</h5>
              <p>Мы всегда на связи и с радостью поможем вам с проектом озеленения:</p>
              <div class="p-3 bg-pine-50 rounded-xl border border-pine-200 space-y-1.5 text-xs text-pine-950">
                <div>• <strong>Телефон / WhatsApp:</strong> <a href="tel:+79602036065" class="font-bold text-pine-800 underline">+7 (960) 203-60-65</a></div>
                <div>• <strong>Telegram:</strong> <a href="https://t.me/hvoinyimir" target="_blank" class="font-bold text-sky-700 underline">@hvoinyimir</a></div>
                <div>• <strong>ВКонтакте:</strong> <a href="https://vk.ru/xvoinyimir" target="_blank" class="font-bold text-blue-700 underline">vk.ru/xvoinyimir</a></div>
              </div>
            </div>
          `,
          actionsHtml: `
            <a href="https://wa.me/79602036065" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors">
              Написать в WhatsApp
            </a>
            <a href="tel:+79602036065" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors">
              Позвонить
            </a>
          `
        };
      }

      // 12. GREETINGS & THANKS
      if (q.includes('привет') || q.includes('здравствуй') || q.includes('добрый день') || q.includes('доброе утро') || q.includes('добрый вечер')) {
        return {
          text: "Здравствуйте! Рад приветствовать вас в питомнике «Хвойный мир»! Чем я могу помочь вам сегодня? Могу рассказать о наличии саженцев, помочь с выбором сортов или рассчитать количество растений для живой изгороди.",
          actionsHtml: `
            <button onclick="askBotSuggested('Брабант или Смарагд для изгороди?')" class="px-3 py-1.5 rounded-lg bg-pine-50 hover:bg-pine-100 text-pine-900 border border-pine-200 font-semibold text-xs cursor-pointer transition-colors">
              Брабант или Смарагд?
            </button>
            <button onclick="askBotSuggested('Какой грунт нужен для голубики?')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-semibold text-xs cursor-pointer transition-colors">
              Грунт для голубики
            </button>
          `
        };
      }

      if (q.includes('спасибо') || q.includes('благодар') || q.includes('отлично') || q.includes('понятно') || q.includes('хорошо')) {
        return {
          text: "Всегда рад помочь! Пусть ваш сад растёт здоровым и радует зеленью круглый год. Если появятся ещё вопросы — я всегда здесь!",
          actionsHtml: `
            <button onclick="document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs cursor-pointer transition-colors">
              Перейти в каталог
            </button>
          `
        };
      }

      // 13. ANY MATCHING PLANT IN CATALOG
      const words = q.split(/\s+/).filter(w => w.length >= 3);
      for (const w of words) {
        const found = PLANTS.find(p => p.name.toLowerCase().includes(w) || 
                                       (p.desc && p.desc.toLowerCase().includes(w)));
        if (found) {
          const stock = found.stock !== undefined ? parseInt(found.stock) : 20;
          return {
            html: `
              <div class="space-y-2">
                <div class="flex items-center gap-3 bg-pine-50/70 p-2.5 rounded-xl border border-pine-200">
                  <img src="${found.image}" class="w-12 h-12 rounded-lg object-cover border border-pine-300 shrink-0" alt="${found.name}">
                  <div>
                    <h5 class="font-bold text-pine-950">${found.name}</h5>
                    <div class="text-[11px] text-stone-600">Контейнер: <strong>${found.pot}</strong> • Высота: <strong>${found.height}</strong></div>
                    <div class="text-xs font-black text-pine-900">${found.price} ₽ <span class="text-[10px] font-semibold text-stone-500">• В наличии: ${stock} шт.</span></div>
                  </div>
                </div>
                <p class="text-xs text-stone-700 leading-relaxed">${found.desc}</p>
              </div>
            `,
            actionsHtml: `
              <button onclick="botAddToCart(${found.id}, '${found.name}')" class="px-3 py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs cursor-pointer transition-colors">
                В корзину (${found.price} ₽)
              </button>
              <button onclick="document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });" class="px-3 py-1.5 rounded-lg bg-pine-50 hover:bg-pine-100 text-pine-900 border border-pine-200 font-semibold text-xs cursor-pointer transition-colors">
                Посмотреть в каталоге
              </button>
            `
          };
        }
      }

      // 14. GENERAL SMART FALLBACK
      return {
        html: `
          <div class="space-y-2">
            <p>Хороший вопрос! Чтобы ответить максимально точно с учётом вашего участка и почвы, вы можете:</p>
            <p>1. Выбрать одну из популярных тем ниже (посадка, голубика, изгородь, доставка).</p>
            <p>2. Либо написать напрямую нашему главному агроному в <strong>WhatsApp</strong> — он ответит на любой детальный вопрос в течение 10–15 минут!</p>
          </div>
        `,
        actionsHtml: `
          <a href="https://wa.me/79602036065" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors">
            Написать агроному в WhatsApp
          </a>
          <button onclick="askBotSuggested('Брабант или Смарагд для изгороди?')" class="px-3 py-1.5 rounded-lg bg-pine-50 hover:bg-pine-100 text-pine-900 border border-pine-200 font-semibold text-xs cursor-pointer transition-colors">
            Про изгородь
          </button>
          <button onclick="askBotSuggested('Какой грунт нужен для голубики?')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-semibold text-xs cursor-pointer transition-colors">
            Про голубику
          </button>
        `
      };
    }

    // Helper to add item to cart from bot response
    function botAddToCart(plantId, plantName) {
      addToCart(plantId);
    }

    function botQuickHedge(type) {
      selectHedgeType(type);
      const calcSection = document.getElementById('calculator');
      if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth' });
    }


    // ==========================================
    // COOKIE CONSENT & WHOLESALE INQUIRIES
    // ==========================================
    function checkCookieConsent() {
      try {
        const consent = localStorage.getItem('xvoinyimir_cookie_consent');
        if (!consent) {
          const banner = document.getElementById('cookieConsentBanner');
          if (banner) {
            setTimeout(() => {
              banner.classList.remove('hidden');
            }, 1200);
          }
        }
      } catch(e) {}
    }

    function acceptAllCookies() {
      try {
        localStorage.setItem('xvoinyimir_cookie_consent', 'accepted');
      } catch(e) {}
      const banner = document.getElementById('cookieConsentBanner');
      if (banner) banner.classList.add('hidden');
      showToast('Настройки cookie сохранены', 'success');
    }

    function closeCookieBanner() {
      try {
        localStorage.setItem('xvoinyimir_cookie_consent', 'essential_only');
      } catch(e) {}
      const banner = document.getElementById('cookieConsentBanner');
      if (banner) banner.classList.add('hidden');
    }

    function submitWholesaleInquiry(e) {
      e.preventDefault();
      const name = document.getElementById('wholesaleName').value.trim();
      const phone = document.getElementById('wholesalePhone').value.trim();
      const city = document.getElementById('wholesaleCity').value.trim();
      const comment = document.getElementById('wholesaleComment').value.trim();

      const orderObj = {
        id: 'OPT-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        name: name,
        phone: phone,
        delivery: `ОПТ: ${city || 'Доставка согласовывается'}`,
        type: 'Оптовая поставка',
        status: 'Новый',
        total: 0,
        interest: `Оптовый заказ: ${comment || 'Расчет прайс-листа и спецтранспорта'}`,
        items: []
      };

      const orders = getOrders();
      orders.unshift(orderObj);
      localStorage.setItem('xvoinyimir_orders', JSON.stringify(orders));

      // Broadcast to cloud broker so admin sees it instantly on all devices!
      broadcastOrderToCloud(orderObj);

      // Trigger Telegram notification
      if (typeof sendOrderToTelegram === 'function') {
        sendOrderToTelegram(orderObj);
      }

      renderAdminOrdersTable();

      showToast('Ваша оптовая заявка принята! Агроном свяжется с вами в течение 30 минут.', 'success');
      e.target.reset();
    }

    window.addEventListener('DOMContentLoaded', () => {
      checkCookieConsent();
      const wsPhone = document.getElementById('wholesalePhone');
      if (wsPhone) initPhoneMask(wsPhone);
      loadPlants();
      loadSalesLog();
      loadSiteSettings();
      renderProducts();
      updateSeasonHitUI();
      calcHedge();
      loadCart();
      initBotChat();
      initLiveCloudSync();

      // Initialize strict phone masks on all telephone inputs
      initPhoneMask(document.getElementById('orderPhone'));
      initPhoneMask(document.getElementById('consultPhone'));
      initPhoneMask(document.getElementById('settingsPhone'));

      // Secret Admin Access via URL hash #admin
      if (window.location.hash === '#admin') {
        openAdminModal();
      }
      window.addEventListener('hashchange', () => {
        if (window.location.hash === '#admin') {
          openAdminModal();
        }
      });

      // Initialize Anime.js living motion engine
      initAnimeEngine();

      // Escape key to close any active modal & arrow navigation for lightbox
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closePlantGallery();
          closeUserProfile();
          closePlantDetailModal();
          closeCart();
          closeCheckoutModal();
          closeConfirmActionModal();
          closeAdminModal();
        }
        if (currentGalleryPlant) {
          if (e.key === 'ArrowRight') nextGalleryPhoto();
          if (e.key === 'ArrowLeft') prevGalleryPhoto();
        }
        // Secret Hotkey Ctrl + Shift + A (supports any keyboard layout: Latin, Cyrillic, etc.)
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'Ф' || e.key === 'ф' || e.code === 'KeyA')) {
          e.preventDefault();
          openAdminModal();
        }
      });
    });

    // Secret Admin Triggers (Triple-click on Logo / Copyright, or #admin, or Ctrl+Shift+A)
    let secretAdminClickCount = 0;
    let secretAdminTimer = null;
    function handleSecretAdminTrigger(e) {
      secretAdminClickCount++;
      clearTimeout(secretAdminTimer);
      secretAdminTimer = setTimeout(() => {
        secretAdminClickCount = 0;
      }, 900);
      if (secretAdminClickCount >= 3) {
        secretAdminClickCount = 0;
        if (e && e.preventDefault) e.preventDefault();
        openAdminModal();
      }
    }

    // ==========================================
    // PROMOTIONS & BUNDLE HELPERS
    // ==========================================
    function addPromoHedgeBundle() {
      const smaragd = PLANTS.find(p => p.id === 1) || DEFAULT_PLANTS[0];
      const promoItem = {
        id: 1001,
        realPlantId: smaragd.id,
        name: 'Комплект «Живая изгородь 10+1» (Туя Смарагд 10 шт. + 1 в подарок)',
        price: 4950,
        qty: 1,
        pot: 'C2 (ЗКС) × 11 шт.',
        image: smaragd.image || 'assets/plants/plant_smaragd.jpg'
      };
      const existing = cart.find(i => i.id === promoItem.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push(promoItem);
      }
      saveCart();
      updateCartUI();
      openCart();
      showToast('Комплект «Живая изгородь 10+1» добавлен в корзину со скидкой 15%!', 'success');
    }

    function addPromoBerryTrio() {
      const promoItem = {
        id: 1002,
        realPlantId: 19,
        name: 'Набор «Ягодное трио опылителей» (Блюкроп + Дюк + Патриот)',
        price: 1560,
        qty: 1,
        pot: 'C3 (3 куста ЗКС)',
        image: 'assets/plants/plant_blueberry_bluecrop.jpg'
      };
      const existing = cart.find(i => i.id === promoItem.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push(promoItem);
      }
      saveCart();
      updateCartUI();
      openCart();
      showToast('Набор «Ягодное трио опылителей» добавлен в корзину со скидкой 20%!', 'success');
    }

    
    // ==========================================
    // ANIME.JS LIVING MOTION & MICRO-INTERACTIONS ENGINE
    // ==========================================

    function animateCartBadgePop() {
      const badge = document.getElementById('cartCountBadge');
      const cartBtn = document.getElementById('cartBtn');
      if (typeof anime === 'undefined') return;

      if (badge) {
        anime.remove(badge);
        anime({
          targets: badge,
          scale: [1, 1.48, 1],
          rotate: [-16, 16, -6, 6, 0],
          duration: 520,
          easing: 'easeOutElastic(1, .5)'
        });
      }
      if (cartBtn) {
        anime.remove(cartBtn);
        anime({
          targets: cartBtn,
          scale: [1, 1.07, 1],
          duration: 260,
          easing: 'easeOutQuad'
        });
      }
    }

    function animateFlyToCart(sourceEl, count = 1) {
      if (typeof anime === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animateCartBadgePop();
        return;
      }

      const cartBtn = document.getElementById('cartBtn');
      if (!cartBtn) {
        animateCartBadgePop();
        return;
      }

      // Micro-bounce clicked button
      if (sourceEl && sourceEl.getBoundingClientRect) {
        anime.remove(sourceEl);
        anime({
          targets: sourceEl,
          scale: [1, 0.88, 1.08, 1],
          duration: 320,
          easing: 'easeOutElastic(1, .6)'
        });
      }

      const cartRect = cartBtn.getBoundingClientRect();
      const startX = sourceEl && sourceEl.getBoundingClientRect ? sourceEl.getBoundingClientRect().left + sourceEl.getBoundingClientRect().width / 2 : window.innerWidth / 2;
      const startY = sourceEl && sourceEl.getBoundingClientRect ? sourceEl.getBoundingClientRect().top : window.innerHeight / 2;

      const flyer = document.createElement('div');
      flyer.className = 'fixed pointer-events-none z-[130] font-black text-xs text-white bg-emerald-600 px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 border border-emerald-400 select-none';
      flyer.innerHTML = `<span class="inline-flex items-center gap-1">${SVG_ICONS.leaf} <span>+${count}</span></span>`;
      flyer.style.left = startX + 'px';
      flyer.style.top = startY + 'px';
      flyer.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(flyer);

      const destX = cartRect.left + cartRect.width / 2;
      const destY = cartRect.top + cartRect.height / 2;

      anime({
        targets: flyer,
        left: destX,
        top: destY,
        scale: [
          { value: 1.35, duration: 180, easing: 'easeOutBack' },
          { value: 0.55, duration: 380, delay: 140, easing: 'easeInQuad' }
        ],
        opacity: [
          { value: 1, duration: 180 },
          { value: 0, duration: 140, delay: 420 }
        ],
        duration: 560,
        easing: 'easeInOutCubic',
        complete: function() {
          flyer.remove();
          animateCartBadgePop();
        }
      });
    }

    function initAnimeEngine() {
      if (typeof anime === 'undefined') {
        console.warn('Anime.js not loaded yet, skipping motion engine initialization.');
        return;
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('Reduced motion preferred, keeping animations instant.');
        return;
      }

      // 1. Hero Section Entrance Stagger Timeline
      anime.timeline({ easing: 'easeOutCubic' })
        .add({
          targets: '#hero .hero-stagger',
          translateY: [24, 0],
          opacity: [0, 1],
          delay: anime.stagger(90),
          duration: 650
        })
        .add({
          targets: '#heroSeasonHitCard',
          scale: [0.93, 1],
          opacity: [0, 1],
          duration: 500,
          easing: 'easeOutBack'
        }, '-=300');

      // 2. Ambient Organic Floating Breathing (Season Hit & Floating Bot)
      anime({
        targets: '#heroSeasonHitCard',
        translateY: [-3.5, 3.5],
        duration: 3200,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });

      anime({
        targets: '#floatingAssistantWidget button',
        translateY: [-3, 3],
        duration: 2600,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });

      // 3. Scroll-triggered Animated Counters
      const counters = document.querySelectorAll('.anime-counter');
      if ('IntersectionObserver' in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              obs.unobserve(el);
              const targetVal = parseFloat(el.getAttribute('data-target')) || 0;
              const suffix = el.getAttribute('data-suffix') || '';
              const prefix = el.getAttribute('data-prefix') || '';

              const counterObj = { val: 0 };
              anime({
                targets: counterObj,
                val: targetVal,
                round: 1,
                duration: 1800,
                easing: 'easeOutExpo',
                update: function() {
                  el.innerText = prefix + Math.round(counterObj.val).toLocaleString('ru-RU') + suffix;
                }
              });
            }
          });
        }, { threshold: 0.2 });

        counters.forEach(c => counterObserver.observe(c));
      }

      // 4. Scroll-triggered Staggered Section Reveals
      const scrollSections = document.querySelectorAll('#promotions, #about, #delivery');
      if ('IntersectionObserver' in window && scrollSections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              obs.unobserve(entry.target);
              const cards = entry.target.querySelectorAll('.grid > div');
              if (cards.length > 0) {
                anime({
                  targets: cards,
                  translateY: [22, 0],
                  opacity: [0, 1],
                  delay: anime.stagger(80, { start: 50 }),
                  duration: 520,
                  easing: 'easeOutCubic'
                });
              }
            }
          });
        }, { threshold: 0.15 });

        scrollSections.forEach(s => sectionObserver.observe(s));
      }

      console.log('✓ Anime.js Living Motion Engine initialized successfully!');
    }

    // RENDER PRODUCTS
    function buildProductCards(grid) {
      const search = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
      grid.innerHTML = '';

      const filtered = PLANTS.filter(item => {
        const matchCat = currentCategory === 'all' || 
          (currentCategory === 'promo' ? (item.promo || (item.badge && (item.badge.includes('хит') || item.badge.includes('От 10') || item.badge.includes('изгороди') || item.badge.includes('Скидка') || item.badge.includes('сладость')))) : item.category === currentCategory);
        const matchSearch = item.name.toLowerCase().includes(search) || 
                            item.latin.toLowerCase().includes(search) || 
                            item.desc.toLowerCase().includes(search);
        return matchCat && matchSearch;
      });

      const noResults = document.getElementById('noResults');
      if (filtered.length === 0) {
        if (noResults) noResults.classList.remove('hidden');
      } else {
        if (noResults) noResults.classList.add('hidden');
      }

      const fragment = document.createDocumentFragment();
      filtered.forEach(p => {
        const hasSizes = p.sizes && Array.isArray(p.sizes) && p.sizes.length > 1;
        const s0 = hasSizes ? p.sizes[0] : null;
        const curPrice = s0 ? s0.price : p.price;
        const curOldPrice = s0 ? (s0.oldPrice || p.oldPrice) : p.oldPrice;
        const curHeight = s0 ? (s0.height || p.height) : p.height;
        const curPot = s0 ? (s0.pot || p.pot) : p.pot;
        const curImage = s0 ? ((s0.images && s0.images[0]) || s0.image || p.image) : p.image;
        const curStock = s0 ? (s0.stock !== undefined ? parseInt(s0.stock) : (p.stock !== undefined ? parseInt(p.stock) : 20)) : (p.stock !== undefined ? parseInt(p.stock) : 20);

        const card = document.createElement('div');
        card.className = "bg-white rounded-xl sm:rounded-2xl border border-pine-200/90 hover:border-pine-400 overflow-hidden flex flex-col justify-between group transition-all duration-200 hover:shadow-md plant-card-item";
        card.setAttribute('data-plant-id', p.id);
        card.setAttribute('data-selected-size-idx', hasSizes ? '0' : '-1');

        card.innerHTML = `
          <div>
            <div class="relative h-36 xs:h-44 sm:h-56 overflow-hidden bg-stone-100 cursor-pointer plant-card-clickable" onclick="openPlantDetail(${p.id}, ${hasSizes ? 0 : -1})">
              <img src="${curImage}" alt="${p.name}" class="plant-card-main-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              
              <span class="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs text-pine-900 border border-pine-200/90 shadow-2xs">
                ${p.badge}
              </span>

              <button type="button" onclick="event.stopPropagation(); openPlantGallery(${p.id}, 0);" class="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white flex items-center justify-center transition-all shadow-xs cursor-pointer" title="Развернуть фото на весь экран">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
              </button>

              <span class="plant-card-pot-badge absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-[9px] sm:text-[11px] font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-stone-900/80 backdrop-blur-xs text-white border border-white/10 shadow-2xs">
                ${curPot}
              </span>
            </div>
            
            <div class="p-2.5 sm:p-5 space-y-1 sm:space-y-2">
              <div class="text-[9px] sm:text-[11px] text-pine-700 font-mono italic truncate">${p.latin}</div>
              <h3 onclick="openPlantDetail(${p.id}, ${hasSizes ? 0 : -1})" class="text-xs sm:text-base font-bold text-pine-950 group-hover:text-pine-700 transition-colors leading-tight cursor-pointer line-clamp-2">${p.name}</h3>
              <p onclick="openPlantDetail(${p.id}, ${hasSizes ? 0 : -1})" class="hidden sm:block text-xs text-stone-500 line-clamp-2 leading-relaxed cursor-pointer hover:text-stone-700">${p.desc}</p>
              
              <div class="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-1 text-xs">
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-pine-50/80 border border-pine-200/70 text-[9px] sm:text-[11px] font-medium text-pine-900">
                  <svg class="w-3 h-3 text-pine-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="5" y1="5" x2="19" y2="19"/><line x1="5" y1="19" x2="19" y2="5"/><polyline points="10 4 12 2 14 4"/><polyline points="10 20 12 22 14 20"/><polyline points="4 10 2 12 4 14"/><polyline points="20 10 22 12 20 14"/></svg>
                  <span>${p.frost}</span>
                </span>
                <span class="hidden xs:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-[9px] sm:text-[11px] font-medium text-stone-700">
                  <svg class="w-3 h-3 text-stone-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.3 8.7-5-5a2.12 2.12 0 0 0-3 0L2.7 14.3a2.12 2.12 0 0 0 0 3l5 5a2.12 2.12 0 0 0 3 0L21.3 11.7a2.12 2.12 0 0 0 0-3Z"/><path d="m14.5 5.5-2 2"/><path d="m11.5 8.5-2 2"/><path d="m8.5 11.5-2 2"/></svg>
                  <span class="plant-card-height-text">${curHeight}</span>
                </span>
                
                ${curStock > 10 ? `
                  <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-stone-100/90 border border-stone-200/80 text-[9px] sm:text-[11px] font-medium text-stone-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span> В наличии: ${curStock}
                  </span>
                ` : curStock > 0 ? `
                  <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-stone-100/90 border border-stone-200/80 text-[9px] sm:text-[11px] font-medium text-stone-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span> Осталось: ${curStock}
                  </span>
                ` : `
                  <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-stone-100/90 border border-stone-200/80 text-[9px] sm:text-[11px] font-medium text-stone-500">
                    <span class="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0"></span> Под заказ
                  </span>
                `}
              </div>

              ${hasSizes ? `
                <div class="pt-1.5 pb-0.5" onclick="event.stopPropagation()">
                  <div class="text-[9px] sm:text-[10px] text-stone-400 font-semibold uppercase mb-1">Размер саженца:</div>
                  <div class="flex flex-wrap items-center gap-1 plant-card-sizes">
                    ${p.sizes.map((s, sIdx) => `
                      <button type="button" onclick="selectCardPlantSize(${p.id}, ${sIdx}, this)" 
                        class="card-size-pill text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${sIdx === 0 ? 'bg-pine-800 text-white border-pine-900 font-bold shadow-2xs scale-102' : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200 font-medium'}">
                        ${s.name}
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="p-2.5 sm:p-5 pt-0 flex flex-col xs:flex-row items-stretch xs:items-center justify-between border-t border-botanic-border mt-2 sm:mt-3 gap-1.5 sm:gap-2">
            <div class="plant-card-price-container">
              <div class="plant-card-oldprice-row flex items-center gap-1 leading-none mb-0.5" style="${curOldPrice && curOldPrice > curPrice ? 'display:flex;' : 'display:none;'}">
                <span class="plant-card-oldprice text-[10px] sm:text-xs text-stone-400 line-through">${curOldPrice || ''} ₽</span>
                <span class="plant-card-discount-badge text-[9px] font-bold text-amber-800 bg-amber-100/90 px-1 py-0.5 rounded leading-none">-${curOldPrice ? Math.round((1 - curPrice / curOldPrice) * 100) : 0}%</span>
              </div>
              <div class="text-[9px] sm:text-[11px] text-stone-400 font-medium leading-none mb-0.5 plant-card-price-label" style="${curOldPrice && curOldPrice > curPrice ? 'display:none;' : 'display:block;'}">Цена:</div>
              <span class="plant-card-price text-sm sm:text-xl font-black text-pine-900 whitespace-nowrap leading-tight">${curPrice} ₽</span>
            </div>

            ${curStock <= 0 ? `
              <button disabled class="text-[11px] sm:text-xs px-2.5 sm:px-4 py-2 sm:py-2.5 bg-stone-100 text-stone-400 font-bold rounded-lg sm:rounded-xl border border-stone-200 cursor-not-allowed">
                Распродано
              </button>
            ` : `
              <button onclick="addToCardPlantSize(${p.id}, this, event)" class="plant-card-buy-btn text-[11px] sm:text-xs px-2.5 sm:px-4 py-2 sm:py-2.5 bg-pine-800 hover:bg-pine-700 active:scale-95 text-white font-bold rounded-lg sm:rounded-xl transition-all shadow-xs border-2 border-pine-700 hover:border-emerald-400 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap">
                <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>В корзину</span>
              </button>
            `}
          </div>
        `;
        fragment.appendChild(card);
      });
      grid.appendChild(fragment);
    }

    function selectCardPlantSize(plantId, sizeIdx, btnEl) {
      const card = btnEl.closest('.plant-card-item');
      if (!card) return;
      const plant = PLANTS.find(p => p.id === plantId);
      if (!plant || !plant.sizes || !plant.sizes[sizeIdx]) return;
      const size = plant.sizes[sizeIdx];

      card.setAttribute('data-selected-size-idx', sizeIdx);

      // Update pills styling
      const pills = card.querySelectorAll('.card-size-pill');
      pills.forEach((p, idx) => {
        if (idx === sizeIdx) {
          p.className = 'card-size-pill text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer bg-pine-800 text-white border-pine-900 font-bold shadow-2xs scale-102';
        } else {
          p.className = 'card-size-pill text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200 font-medium';
        }
      });

      // Update card image
      const sizeImg = (size.images && size.images[0]) || size.image || plant.image;
      const imgEl = card.querySelector('.plant-card-main-img');
      if (imgEl && sizeImg) imgEl.src = sizeImg;

      // Update pot badge
      const potEl = card.querySelector('.plant-card-pot-badge');
      if (potEl) potEl.innerText = size.pot || plant.pot;

      // Update height badge
      const heightEl = card.querySelector('.plant-card-height-text');
      if (heightEl) heightEl.innerText = size.height || plant.height;

      // Update price
      const priceEl = card.querySelector('.plant-card-price');
      if (priceEl) priceEl.innerText = `${size.price} ₽`;

      // Update old price
      const oldPriceRow = card.querySelector('.plant-card-oldprice-row');
      const priceLabel = card.querySelector('.plant-card-price-label');
      if (oldPriceRow && priceLabel) {
        if (size.oldPrice && size.oldPrice > size.price) {
          oldPriceRow.style.display = 'flex';
          priceLabel.style.display = 'none';
          const strikeEl = oldPriceRow.querySelector('.plant-card-oldprice');
          if (strikeEl) strikeEl.innerText = `${size.oldPrice} ₽`;
          const discEl = oldPriceRow.querySelector('.plant-card-discount-badge');
          if (discEl) discEl.innerText = `-${Math.round((1 - size.price / size.oldPrice) * 100)}%`;
        } else {
          oldPriceRow.style.display = 'none';
          priceLabel.style.display = 'block';
        }
      }

      // Update clickable open detail trigger
      const clickableArea = card.querySelector('.plant-card-clickable');
      if (clickableArea) {
        clickableArea.setAttribute('onclick', `openPlantDetail(${plant.id}, ${sizeIdx})`);
      }
    }

    function addToCardPlantSize(plantId, btn, evt) {
      const card = btn.closest('.plant-card-item');
      const sizeIdx = card ? parseInt(card.getAttribute('data-selected-size-idx')) : -1;
      addToCart(plantId, 1, evt, sizeIdx);
    }

    function renderProducts() {
      const grid = document.getElementById('plantsGrid');
      if (grid) buildProductCards(grid);
    }

    // ==========================================
    // PRODUCT DETAIL MODAL LOGIC
    // ==========================================
    let currentDetailPlant = null;
    let currentDetailQty = 1;
    let currentDetailSizeIndex = -1;

    function openPlantDetail(id, initialSizeIndex = -1) {
      const plant = PLANTS.find(p => p.id === id);
      if (!plant) return;
      currentDetailPlant = plant;
      currentDetailQty = 1;

      const hasSizes = plant.sizes && Array.isArray(plant.sizes) && plant.sizes.length > 1;
      currentDetailSizeIndex = hasSizes ? (initialSizeIndex >= 0 && initialSizeIndex < plant.sizes.length ? initialSizeIndex : 0) : -1;

      document.getElementById('detailPlantName').innerText = plant.name;
      document.getElementById('detailPlantLatin').innerText = plant.latin || '';
      document.getElementById('detailPlantBadge').innerText = plant.badge || 'Питомник «Хвойный мир»';
      document.getElementById('detailPlantDesc').innerText = plant.desc || '';

      const catLabels = {
        conifer: `${SVG_ICONS.tree} <span>Хвойные породы</span>`,
        blueberry: `${SVG_ICONS.berry} <span>Сортовая голубика</span>`,
        shrub: `${SVG_ICONS.leaf} <span>Декоративные кустарники</span>`,
        grass: `${SVG_ICONS.wheat} <span>Злаки и травы</span>`,
        strawberry: `${SVG_ICONS.strawberry} <span>Клубника и земляника</span>`
      };
      const catBadgeEl = document.getElementById('detailPlantCategoryBadge');
      if (catBadgeEl) {
        catBadgeEl.className = "text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-pine-800 text-white shadow-xs inline-flex items-center gap-1";
        catBadgeEl.innerHTML = catLabels[plant.category] || `${SVG_ICONS.sprout} <span>Саженцы ЗКС</span>`;
      }

      const frostDetailEl = document.getElementById('detailPlantFrost');
      if (frostDetailEl) frostDetailEl.innerHTML = `<span class="inline-flex items-center gap-1">${SVG_ICONS.snowflake} <span>${plant.frost || '-40°C'}</span></span>`;

      const soilSpec = document.getElementById('detailPlantSoilSpec');
      if (soilSpec) {
        if (plant.category === 'blueberry') {
          soilSpec.innerText = 'Кислый верховой торф (pH 3.5–4.5), хвойный опад, полив подкисленной водой';
        } else if (plant.category === 'conifer') {
          soilSpec.innerText = 'Дренированная, слабокислая садовая почва с песком, без застоя влаги';
        } else {
          soilSpec.innerText = 'Плодородная, рыхлая садовая земля с мульчированием корой';
        }
      }

      // Sizes switcher section
      const sizesSection = document.getElementById('detailPlantSizesSection');
      const sizesList = document.getElementById('detailPlantSizesList');
      if (hasSizes) {
        if (sizesSection) sizesSection.classList.remove('hidden');
        if (sizesList) {
          sizesList.innerHTML = plant.sizes.map((s, idx) => `
            <button type="button" onclick="selectDetailPlantSize(${idx})" 
              class="detail-size-btn px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${idx === currentDetailSizeIndex ? 'bg-pine-800 text-white border-pine-900 font-bold shadow-xs scale-102 ring-2 ring-emerald-500/30' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 font-medium'}">
              ${s.name}
            </button>
          `).join('');
        }
        selectDetailPlantSize(currentDetailSizeIndex);
      } else {
        if (sizesSection) sizesSection.classList.add('hidden');
        
        document.getElementById('detailPlantPrice').innerText = `${plant.price} ₽`;
        document.getElementById('detailPlantPot').innerText = plant.pot || 'ЗКС';
        const heightDetailEl = document.getElementById('detailPlantHeight');
        if (heightDetailEl) heightDetailEl.innerHTML = `<span class="inline-flex items-center gap-1">${SVG_ICONS.ruler} <span>${plant.height || '40–60 см'}</span></span>`;

        const stock = plant.stock !== undefined ? parseInt(plant.stock) : 20;
        updateDetailStockBadge(stock);

        currentDetailPhotoIndex = 0;
        const mainImg = document.getElementById('detailPlantImage');
        if (mainImg) {
          mainImg.src = plant.image;
          mainImg.alt = plant.name;
        }
        renderDetailThumbnails(plant, plant.images || [plant.image]);
        updateDetailQtyUI();
      }

      const modal = document.getElementById('plantDetailModal');
      if (modal) modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function selectDetailPlantSize(idx) {
      if (!currentDetailPlant || !currentDetailPlant.sizes || !currentDetailPlant.sizes[idx]) return;
      currentDetailSizeIndex = idx;
      const size = currentDetailPlant.sizes[idx];

      // Update size button pills styling
      const buttons = document.querySelectorAll('#detailPlantSizesList button');
      buttons.forEach((btn, bIdx) => {
        if (bIdx === idx) {
          btn.className = "detail-size-btn px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border bg-pine-800 text-white border-pine-900 font-bold shadow-xs scale-102 ring-2 ring-emerald-500/30";
        } else {
          btn.className = "detail-size-btn px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 font-medium";
        }
      });

      const badgeEl = document.getElementById('detailPlantSelectedSizeBadge');
      if (badgeEl) badgeEl.innerText = size.name;

      // Update price
      document.getElementById('detailPlantPrice').innerText = `${size.price} ₽`;

      // Update container & height
      document.getElementById('detailPlantPot').innerText = size.pot || currentDetailPlant.pot || 'ЗКС';
      const heightDetailEl = document.getElementById('detailPlantHeight');
      if (heightDetailEl) heightDetailEl.innerHTML = `<span class="inline-flex items-center gap-1">${SVG_ICONS.ruler} <span>${size.height || currentDetailPlant.height || '40–60 см'}</span></span>`;

      // Update stock
      const stock = size.stock !== undefined ? parseInt(size.stock) : (currentDetailPlant.stock !== undefined ? parseInt(currentDetailPlant.stock) : 20);
      updateDetailStockBadge(stock);

      // Update total sum
      updateDetailQtyUI();

      // Photos for this size ONLY
      const sizeImages = (size.images && size.images.length > 0) ? size.images : (size.image ? [size.image] : (currentDetailPlant.images || [currentDetailPlant.image]));
      currentDetailPhotoIndex = 0;
      const mainImg = document.getElementById('detailPlantImage');
      if (mainImg && sizeImages[0]) {
        mainImg.src = sizeImages[0];
        mainImg.alt = `${currentDetailPlant.name} (${size.name})`;
      }
      renderDetailThumbnails(currentDetailPlant, sizeImages);
    }

    function updateDetailStockBadge(stock) {
      const stockBadge = document.getElementById('detailPlantStockBadge');
      if (!stockBadge) return;
      if (stock > 10) {
        stockBadge.innerHTML = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100/90 border border-stone-200/90 text-xs font-semibold text-stone-700"><span class="w-2 h-2 rounded-full bg-emerald-600"></span>В наличии: ${stock} шт.</span>`;
      } else if (stock > 0) {
        stockBadge.innerHTML = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100/90 border border-stone-200/90 text-xs font-semibold text-stone-700"><span class="w-2 h-2 rounded-full bg-amber-500"></span>Осталось: ${stock} шт.</span>`;
      } else {
        stockBadge.innerHTML = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100/90 border border-stone-200/90 text-xs font-semibold text-stone-500"><span class="w-2 h-2 rounded-full bg-stone-400"></span>Под заказ</span>`;
      }
    }

    function getActiveDetailImages() {
      if (currentDetailPlant && currentDetailPlant.sizes && currentDetailSizeIndex >= 0) {
        const s = currentDetailPlant.sizes[currentDetailSizeIndex];
        if (s && s.images && s.images.length > 0) return s.images;
        if (s && s.image) return [s.image];
      }
      if (currentDetailPlant) {
        return (currentDetailPlant.images && currentDetailPlant.images.length > 0) ? currentDetailPlant.images : [currentDetailPlant.image];
      }
      return [];
    }

    function closePlantDetailModal() {
      const modal = document.getElementById('plantDetailModal');
      if (modal) modal.classList.add('hidden');
      document.body.style.overflow = '';
      currentDetailPlant = null;
      currentDetailSizeIndex = -1;
    }

    function changeDetailQty(delta) {
      if (!currentDetailPlant) return;
      const chosenSize = (currentDetailPlant.sizes && currentDetailSizeIndex >= 0) ? currentDetailPlant.sizes[currentDetailSizeIndex] : null;
      const stock = chosenSize ? (chosenSize.stock !== undefined ? parseInt(chosenSize.stock) : 20) : (currentDetailPlant.stock !== undefined ? parseInt(currentDetailPlant.stock) : 20);
      const next = currentDetailQty + delta;
      if (next < 1) return;
      if (next > stock) {
        showToast(`На складе доступно всего ${stock} шт. саженцев «${currentDetailPlant.name}${chosenSize ? ' (' + chosenSize.name + ')' : ''}».`, 'warning');
        return;
      }
      currentDetailQty = next;
      updateDetailQtyUI();
    }

    function updateDetailQtyUI() {
      if (!currentDetailPlant) return;
      const qtyEl = document.getElementById('detailPlantQty');
      const sumEl = document.getElementById('detailPlantTotalSum');
      const btn = document.getElementById('detailAddToCartBtn');
      
      const chosenSize = (currentDetailPlant.sizes && currentDetailSizeIndex >= 0) ? currentDetailPlant.sizes[currentDetailSizeIndex] : null;
      const unitPrice = chosenSize ? chosenSize.price : currentDetailPlant.price;
      const stock = chosenSize ? (chosenSize.stock !== undefined ? parseInt(chosenSize.stock) : 20) : (currentDetailPlant.stock !== undefined ? parseInt(currentDetailPlant.stock) : 20);

      if (qtyEl) qtyEl.innerText = currentDetailQty;
      const total = unitPrice * currentDetailQty;
      if (sumEl) sumEl.innerText = `${total.toLocaleString('ru-RU')} ₽`;

      if (btn) {
        if (stock <= 0) {
          btn.disabled = true;
          btn.className = "flex-1 py-3 px-4 rounded-xl bg-stone-100 text-stone-400 font-bold text-xs sm:text-sm border-2 border-stone-200 cursor-not-allowed text-center";
          btn.innerText = "Распродано";
        } else {
          btn.disabled = false;
          btn.className = "flex-1 py-3 px-4 rounded-xl bg-pine-800 hover:bg-pine-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs border-2 border-pine-900 hover:border-emerald-400 cursor-pointer";
          btn.innerHTML = `<span class="inline-flex items-center gap-1.5">${SVG_ICONS.cart} <span>В корзину (${total.toLocaleString('ru-RU')} ₽)</span></span>`;
        }
      }
    }

    function addCurrentDetailToCart() {
      if (!currentDetailPlant) return;
      addToCart(currentDetailPlant.id, currentDetailQty, null, currentDetailSizeIndex);
      closePlantDetailModal();
    }

    function askAgronomistAboutCurrentPlant() {
      if (!currentDetailPlant) return;
      const plantName = currentDetailPlant.name;
      closePlantDetailModal();
      scrollToAssistantChat();
      sendBotQuery(`Расскажи подробнее про ${plantName}: особенности посадки и ухода`);
    }

    // STRICT RUSSIAN PHONE MASKING (+7 (XXX) XXX-XX-XX)
        function initPhoneMask(inputEl) {
      if (!inputEl) return;

      function formatPhone(val) {
        let digits = (val || '').replace(/\D/g, '');
        if (!digits) return '';

        // If user typed 7 or 8 as first digit, strip it
        if (digits.startsWith('7') || digits.startsWith('8')) {
          digits = digits.slice(1);
        }
        digits = digits.slice(0, 10);

        let res = '+7';
        if (digits.length > 0) res += ' (' + digits.slice(0, 3);
        if (digits.length >= 3) res += ') ' + digits.slice(3, 6);
        if (digits.length >= 6) res += '-' + digits.slice(6, 8);
        if (digits.length >= 8) res += '-' + digits.slice(8, 10);

        return res;
      }

      // Handle Backspace and Delete smoothly character-by-character
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          const selStart = inputEl.selectionStart;
          const selEnd = inputEl.selectionEnd;

          // If no range is selected, delete the real preceding or following digit
          if (selStart === selEnd) {
            e.preventDefault();
            const val = inputEl.value;
            let digitsBefore = val.slice(0, selStart).replace(/\D/g, '');
            let digitsAfter = val.slice(selStart).replace(/\D/g, '');

            if (e.key === 'Backspace') {
              if (digitsBefore.length > 1) { // Keep country code 7
                digitsBefore = digitsBefore.slice(0, -1);
              } else if (digitsBefore.length === 1 && !digitsAfter.length) {
                inputEl.value = '';
                return;
              }
            } else if (e.key === 'Delete') {
              if (digitsAfter.length > 0) {
                digitsAfter = digitsAfter.slice(1);
              }
            }

            const allDigits = digitsBefore + digitsAfter;
            if (!allDigits || allDigits === '7' || allDigits === '8') {
              inputEl.value = '';
            } else {
              inputEl.value = formatPhone(allDigits);
            }
          }
        }
      });

      inputEl.addEventListener('input', (e) => {
        const val = inputEl.value;
        if (!val.trim()) {
          inputEl.value = '';
          return;
        }
        inputEl.value = formatPhone(val);
      });

      inputEl.addEventListener('focus', () => {
        if (!inputEl.value) {
          inputEl.value = '+7 (';
        }
      });

      inputEl.addEventListener('blur', () => {
        if (inputEl.value.trim() === '+7 (' || inputEl.value.trim() === '+7' || inputEl.value.trim() === '+7 (') {
          inputEl.value = '';
        }
      });
    }

    let isCategoryTransitioning = false;
    let pendingCategory = null;

    function updateCategoryPillsUI(activeCat) {
      document.querySelectorAll('.cat-pill').forEach(btn => {
        const btnCat = btn.getAttribute('data-cat');
        const isActive = (btnCat === activeCat);
        if (isActive) {
          if (btnCat === 'promo') {
            btn.className = "cat-pill px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap bg-amber-500 text-white shadow-xs border-2 border-amber-600 cursor-pointer shrink-0 inline-flex items-center gap-1.5";
          } else {
            btn.className = "cat-pill px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap bg-pine-800 text-white shadow-xs border-2 border-pine-900 cursor-pointer shrink-0 inline-flex items-center gap-1.5";
          }
        } else {
          if (btnCat === 'promo') {
            btn.className = "cat-pill px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-2xs cursor-pointer shrink-0 inline-flex items-center gap-1.5";
          } else {
            btn.className = "cat-pill px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap bg-white hover:bg-stone-50 text-stone-700 border-2 border-pine-200/90 hover:border-pine-400 shadow-2xs cursor-pointer shrink-0 inline-flex items-center gap-1.5";
          }
        }
      });
    }

    function setCategory(cat) {
      // Early return if clicked category is already active
      if (cat === currentCategory && !isCategoryTransitioning) {
        return;
      }

      // If transition is in flight, queue target category to prevent overlapping animations
      if (isCategoryTransitioning) {
        pendingCategory = cat;
        return;
      }

      isCategoryTransitioning = true;
      updateCategoryPillsUI(cat);

      const grid = document.getElementById('plantsGrid');
      if (!grid) {
        currentCategory = cat;
        isCategoryTransitioning = false;
        return;
      }

      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (typeof anime === 'undefined' || prefersReduced) {
        currentCategory = cat;
        buildProductCards(grid);
        isCategoryTransitioning = false;
        if (pendingCategory && pendingCategory !== currentCategory) {
          const next = pendingCategory;
          pendingCategory = null;
          setCategory(next);
        }
        return;
      }

      // Cleanly remove any running Anime.js animations on the grid or cards
      anime.remove(grid);
      anime.remove(grid.querySelectorAll('.plant-card-item'));

      // Smooth, snappy fade-out of current category (110ms)
      anime({
        targets: grid,
        opacity: [1, 0],
        translateY: [0, -6],
        duration: 110,
        easing: 'easeOutQuad',
        complete: function() {
          currentCategory = cat;
          buildProductCards(grid);

          // Position container for gentle slide up
          grid.style.opacity = '0';
          grid.style.transform = 'translateY(8px)';

          // Smooth, elegant fade & slide in (180ms)
          anime({
            targets: grid,
            opacity: [0, 1],
            translateY: [8, 0],
            duration: 180,
            easing: 'easeOutCubic',
            complete: function() {
              grid.style.opacity = '';
              grid.style.transform = '';
              isCategoryTransitioning = false;

              // Process next queued category if user clicked rapidly
              if (pendingCategory && pendingCategory !== currentCategory) {
                const next = pendingCategory;
                pendingCategory = null;
                setCategory(next);
              }
            }
          });
        }
      });
    }

    function filterPlants() {
      renderProducts();
    }

    // CART OPERATIONS (SAFE MODAL CONTROLS WITH ANIME.JS SPRING MOTION)
    function openCart() {
      const modal = document.getElementById('cartModal');
      if (!modal) return;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      if (typeof anime !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const backdrop = modal.querySelector('div:first-child');
        const drawer = modal.querySelector('.w-screen');
        if (backdrop) {
          anime.remove(backdrop);
          anime({ targets: backdrop, opacity: [0, 1], duration: 280, easing: 'easeOutQuad' });
        }
        if (drawer) {
          anime.remove(drawer);
          anime({
            targets: drawer,
            translateX: ['100%', '0%'],
            duration: 380,
            easing: 'easeOutCubic',
            complete: function() {
              const items = document.querySelectorAll('#cartItemsList > div');
              if (items.length > 0) {
                anime({
                  targets: items,
                  translateX: [25, 0],
                  opacity: [0, 1],
                  delay: anime.stagger(35),
                  duration: 280,
                  easing: 'easeOutQuad'
                });
              }
            }
          });
        }
      }
    }

    function closeCart() {
      const modal = document.getElementById('cartModal');
      if (!modal || modal.classList.contains('hidden')) return;

      if (typeof anime !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const backdrop = modal.querySelector('div:first-child');
        const drawer = modal.querySelector('.w-screen');
        if (drawer) {
          anime.remove(drawer);
          anime({
            targets: drawer,
            translateX: ['0%', '100%'],
            duration: 260,
            easing: 'easeInCubic'
          });
        }
        if (backdrop) {
          anime.remove(backdrop);
          anime({
            targets: backdrop,
            opacity: [1, 0],
            duration: 240,
            easing: 'easeInQuad',
            complete: function() {
              modal.classList.add('hidden');
              document.body.style.overflow = '';
            }
          });
        } else {
          setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
          }, 260);
        }
      } else {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    function toggleCart() {
      const modal = document.getElementById('cartModal');
      if (modal.classList.contains('hidden')) {
        openCart();
      } else {
        closeCart();
      }
    }

    // Robust matching of cart items to real catalog plants
    function findPlantForItem(item) {
      if (!item) return null;
      if (item.id) {
        const byId = PLANTS.find(p => p.id === item.id);
        if (byId) return byId;
      }
      if (item.name) {
        const exactName = PLANTS.find(p => p.name === item.name);
        if (exactName) return exactName;
        if (item.name.includes('Смарагд') || item.name.toLowerCase().includes('smaragd')) {
          const smaragd = PLANTS.find(p => p.id === 1);
          if (smaragd) return smaragd;
        }
        if (item.name.includes('Брабант') || item.name.toLowerCase().includes('brabant')) {
          const brabant = PLANTS.find(p => p.id === 2);
          if (brabant) return brabant;
        }
        const partialName = PLANTS.find(p => item.name.includes(p.name) || p.name.includes(item.name));
        if (partialName) return partialName;
      }
      if (item.image) {
        const byImage = PLANTS.find(p => p.image === item.image);
        if (byImage) return byImage;
      }
      return null;
    }

    function addToCart(plantId, quantity = 1, evt = null, sizeIndex = -1) {
      const plant = PLANTS.find(p => p.id === plantId);
      if (!plant) return;

      const hasSizes = plant.sizes && Array.isArray(plant.sizes) && plant.sizes.length > 1;
      const validIdx = (hasSizes && sizeIndex !== undefined && sizeIndex !== null && sizeIndex >= 0 && sizeIndex < plant.sizes.length) ? sizeIndex : -1;
      const chosenSize = validIdx >= 0 ? plant.sizes[validIdx] : (hasSizes ? plant.sizes[0] : null);

      const itemPrice = chosenSize ? chosenSize.price : plant.price;
      const itemOldPrice = chosenSize ? (chosenSize.oldPrice || plant.oldPrice) : plant.oldPrice;
      const itemStock = chosenSize ? (chosenSize.stock !== undefined ? parseInt(chosenSize.stock) : (plant.stock !== undefined ? parseInt(plant.stock) : 20)) : (plant.stock !== undefined ? parseInt(plant.stock) : 20);
      const itemName = chosenSize ? `${plant.name} (${chosenSize.name})` : plant.name;
      const itemImage = chosenSize ? ((chosenSize.images && chosenSize.images[0]) || chosenSize.image || plant.image) : plant.image;
      const itemHeight = chosenSize ? (chosenSize.height || plant.height) : plant.height;
      const itemPot = chosenSize ? (chosenSize.pot || plant.pot) : plant.pot;
      const cartItemId = chosenSize ? `${plant.id}_size_${validIdx}` : `${plant.id}`;

      if (itemStock <= 0) {
        showToast(`К сожалению, «${itemName}» сейчас закончились на складе.`, 'warning');
        return;
      }
      const qtyToAdd = Math.max(1, parseInt(quantity) || 1);
      const existing = cart.find(item => item.cartItemId === cartItemId || (!item.cartItemId && item.id === plant.id && !chosenSize));

      if (existing) {
        if (existing.qty + qtyToAdd > itemStock) {
          showToast(`На складе доступно всего ${itemStock} шт. «${itemName}».`, 'warning');
          return;
        }
        existing.qty += qtyToAdd;
      } else {
        if (qtyToAdd > itemStock) {
          showToast(`На складе доступно всего ${itemStock} шт. «${itemName}».`, 'warning');
          return;
        }
        cart.push({
          ...plant,
          cartItemId,
          plantId: plant.id,
          name: itemName,
          baseName: plant.name,
          sizeName: chosenSize ? chosenSize.name : '',
          sizeIndex: validIdx,
          price: itemPrice,
          oldPrice: itemOldPrice,
          stock: itemStock,
          image: itemImage,
          height: itemHeight,
          pot: itemPot,
          qty: qtyToAdd
        });
      }
      saveCart();
      updateCartUI();
      showToast(qtyToAdd > 1 ? `«${itemName}» (${qtyToAdd} шт.)` : itemName, true);

      // Trigger Anime.js tactile button bounce & Fly-to-Cart particle
      const srcBtn = (evt && evt.currentTarget) ? evt.currentTarget : (evt && evt.target ? evt.target.closest('button') : document.activeElement);
      if (typeof animateFlyToCart === 'function') {
        animateFlyToCart(srcBtn, qtyToAdd);
      } else if (typeof animateCartBadgePop === 'function') {
        animateCartBadgePop();
      }
    }

    function quickAdd(name, price, image) {
      const plant = findPlantForItem({ name, price, image }) || PLANTS[0];
      if (plant) addToCart(plant.id);
    }

    function changeQty(key, delta) {
      const item = cart.find(i => (i.cartItemId && i.cartItemId === String(key)) || i.id === key);
      if (!item) return;
      const plant = findPlantForItem(item);
      let stock = 999;
      if (item.stock !== undefined) {
        stock = parseInt(item.stock);
      } else if (plant && plant.stock !== undefined) {
        stock = parseInt(plant.stock);
      }
      if (delta > 0 && item.qty >= stock) {
        showToast(`На складе доступно всего ${stock} шт. саженцев «${item.name}».`, 'warning');
        return;
      }
      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter(i => (i.cartItemId ? i.cartItemId !== String(key) : i.id !== key));
      }
      saveCart();
      updateCartUI();
    }

    function saveCart() {
      try {
        localStorage.setItem('xvoinyimir_cart', JSON.stringify(cart));
      } catch (e) {}
    }

    function loadCart() {
      try {
        const saved = localStorage.getItem('xvoinyimir_cart');
        if (saved) cart = JSON.parse(saved);
      } catch (e) {}
      updateCartUI();
    }

    function updateCartUI() {
      const count = cart.reduce((acc, i) => acc + i.qty, 0);
      const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

      document.getElementById('cartCountBadge').innerText = count;
      document.getElementById('cartDrawerBadge').innerText = `${count} шт.`;
      document.getElementById('cartTotalSum').innerText = `${total.toLocaleString()} ₽`;
      
      const orderSummarySum = document.getElementById('orderSummarySum');
      if (orderSummarySum) orderSummarySum.innerText = `${total.toLocaleString()} ₽`;

      // Free Delivery Progress
      const threshold = (typeof siteSettings !== 'undefined' && siteSettings.freeDeliveryThreshold) ? siteSettings.freeDeliveryThreshold : 1500;
      const remaining = Math.max(0, threshold - total);
      const percent = Math.min(100, Math.round((total / threshold) * 100));
      
      const progressEl = document.getElementById('deliveryProgress');
      const remText = document.getElementById('deliveryRemainingText');
      const statusText = document.getElementById('deliveryStatusText');

      if (progressEl) progressEl.style.width = `${percent}%`;
      if (remText) {
        if (remaining === 0 && total > 0) {
          statusText.innerText = "Доставка по Великому Новгороду:";
          remText.innerText = "Бесплатно!";
        } else {
          statusText.innerText = "До бесплатной доставки по В. Новгороду:";
          remText.innerText = `${remaining.toLocaleString()} ₽`;
        }
      }

      // Checkout Button State
      const checkoutBtn = document.getElementById('checkoutBtn');
      if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

      // Render Drawer Items
      const list = document.getElementById('cartItemsList');
      if (!list) return;

      if (cart.length === 0) {
        list.innerHTML = `
          <div class="text-center py-12 text-stone-400">
            <div class="w-12 h-12 mx-auto mb-2 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <div class="text-sm font-semibold text-stone-700">Корзина пуста</div>
            <div class="text-xs text-stone-400 mt-1">Выберите саженцы из каталога</div>
          </div>
        `;
        return;
      }

      list.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <img src="${item.image}" class="w-14 h-14 rounded-xl object-cover" alt="${item.name}">
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-stone-900 truncate">${item.name}</h4>
            <div class="text-[11px] text-pine-800 font-bold">${item.price} ₽</div>
          </div>
          <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-stone-200">
            <button onclick="changeQty('${item.cartItemId || item.id}', -1)" class="text-stone-500 hover:text-stone-900 font-bold text-sm px-1">-</button>
            <span class="text-xs font-bold text-stone-800 w-4 text-center">${item.qty}</span>
            <button onclick="changeQty('${item.cartItemId || item.id}', 1)" class="text-stone-500 hover:text-stone-900 font-bold text-sm px-1">+</button>
          </div>
        </div>
      `).join('');
    }

    function toggleMobileNav(forceState) {
      const drawer = document.getElementById('mobileNavDrawer');
      const hamburger = document.getElementById('hamburgerIcon');
      const closeIcon = document.getElementById('closeMenuIcon');
      if (!drawer) return;
      const willOpen = forceState !== undefined ? forceState : drawer.classList.contains('hidden');
      if (willOpen) {
        drawer.classList.remove('hidden');
        if (hamburger) hamburger.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
      } else {
        drawer.classList.add('hidden');
        if (hamburger) hamburger.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
      }
    }

    function showToast(message, type = 'success') {
      const existing = document.getElementById('globalAppToast');
      if (existing && existing.remove) existing.remove();

      const toast = document.createElement('div');
      toast.id = 'globalAppToast';

      let bgClasses = "bg-[#0c2419] text-emerald-50 border-emerald-500/70 shadow-2xl shadow-emerald-950/40";
      let icon = SVG_ICONS.check;
      let iconColor = "text-emerald-400";
      let title = "";

      if (type === 'cart' || type === true) {
        bgClasses = "bg-[#092218] text-white border-emerald-400/80 shadow-2xl shadow-emerald-950/40";
        icon = SVG_ICONS.cart;
        iconColor = "text-emerald-300";
        message = typeof message === 'string' && !message.includes('добавлен') ? `«${message}» добавлен в корзину!` : message;
      } else if (type === 'warning') {
        bgClasses = "bg-[#2c1706] text-amber-50 border-amber-500/80 shadow-2xl shadow-amber-950/40";
        icon = SVG_ICONS.alert;
        iconColor = "text-amber-400";
        title = "Внимание";
      } else if (type === 'error') {
        bgClasses = "bg-[#2d090d] text-rose-50 border-rose-500/80 shadow-2xl shadow-rose-950/40";
        icon = SVG_ICONS.x;
        iconColor = "text-rose-400";
        title = "Ошибка";
      } else if (type === 'info') {
        bgClasses = "bg-[#0e2738] text-sky-50 border-sky-400/70 shadow-2xl shadow-sky-950/40";
        icon = SVG_ICONS.bell;
        iconColor = "text-sky-300";
      }

      toast.className = `fixed bottom-16 right-3 sm:bottom-22 sm:right-6 z-[120] max-w-[calc(100vw-24px)] sm:max-w-sm px-4 py-3.5 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all duration-300 ease-out select-none animate-toast-enter ${bgClasses}`;
      const cleanMsg = typeof message === 'string' ? message.replace(/^[✓✅🎉🔔☁️🌿⚠️]+\s*/, '') : message;
      toast.innerHTML = `
        <span class="${iconColor} shrink-0 flex items-center justify-center drop-shadow">${icon}</span>
        <div class="flex-1 min-w-0 leading-snug">
          ${title ? `<span class="font-extrabold block text-[10px] uppercase tracking-wider text-amber-300 mb-0.5">${title}</span>` : ''}
          <span class="text-white font-medium">${escapeHtml(cleanMsg)}</span>
        </div>
        <button onclick="this.closest('#globalAppToast').remove()" class="ml-1 text-white/70 hover:text-white p-1 leading-none cursor-pointer" title="Закрыть"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      `;

      document.body.appendChild(toast);

      if (typeof anime !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        anime({
          targets: toast,
          translateY: [28, 0],
          opacity: [0, 1],
          scale: [0.92, 1],
          duration: 440,
          easing: 'easeOutBack'
        });
      }

      setTimeout(() => {
        if (toast && toast.parentNode) {
          if (typeof anime !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            anime({
              targets: toast,
              translateY: [0, 18],
              opacity: [1, 0],
              scale: [1, 0.94],
              duration: 260,
              easing: 'easeInQuad',
              complete: function() {
                if (toast && toast.parentNode) toast.remove();
              }
            });
          } else {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => { if (toast && toast.parentNode) toast.remove(); }, 300);
          }
        }
      }, 4000);
    }

    // Completely override window.alert so that ANY third-party or native alert call becomes a toast
    window.alert = function(msg) {
      showToast(msg, 'warning');
    };

    function showAddedToast(name) {
      showToast(name, true);
    }

    // HEDGE CALCULATOR LOGIC
    let hedgeType = 'smaragd';

    function selectHedgeType(type) {
      hedgeType = type;
      const btnSmaragd = document.getElementById('btnSmaragd');
      const btnBrabant = document.getElementById('btnBrabant');
      if (type === 'smaragd') {
        btnSmaragd.className = "p-3.5 rounded-xl border-2 border-pine-700 bg-pine-50 text-left transition-all cursor-pointer";
        btnBrabant.className = "p-3.5 rounded-xl border-2 border-stone-200 bg-white hover:bg-stone-50 hover:border-pine-300 text-left transition-all cursor-pointer";
      } else {
        btnBrabant.className = "p-3.5 rounded-xl border-2 border-pine-700 bg-pine-50 text-left transition-all cursor-pointer";
        btnSmaragd.className = "p-3.5 rounded-xl border-2 border-stone-200 bg-white hover:bg-stone-50 hover:border-pine-300 text-left transition-all cursor-pointer";
      }
      calcHedge();
    }

    function calcHedge() {
      const len = parseInt(document.getElementById('hedgeRange').value);
      document.getElementById('hedgeLengthVal').innerText = `${len} м`;
      const density = document.getElementById('hedgeDensity').value;

      let step = 0.6;
      let pricePerUnit = 550;

      if (hedgeType === 'smaragd') {
        pricePerUnit = 550;
        if (density === 'dense') step = 0.6;
        else if (density === 'medium') step = 0.7;
        else step = 0.8;
      } else {
        pricePerUnit = 490;
        if (density === 'dense') step = 0.7;
        else if (density === 'medium') step = 0.85;
        else step = 1.0;
      }

      const count = Math.ceil(len / step);
      const total = count * pricePerUnit;

      document.getElementById('hedgeTotalCount').innerText = `${count} шт.`;
      document.getElementById('hedgeStep').innerText = `${step} м`;
      document.getElementById('hedgeTotalPrice').innerText = `${total.toLocaleString()} ₽`;

      if (typeof anime !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        anime.remove('#hedgeTotalPrice');
        anime({
          targets: '#hedgeTotalPrice',
          scale: [1, 1.07, 1],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    }

    function addHedgeToCart() {
      const plantId = hedgeType === 'smaragd' ? 1 : 2;
      const plant = PLANTS.find(p => p.id === plantId) || PLANTS[0];
      const countEl = document.getElementById('hedgeTotalCount');
      const count = parseInt(countEl?.innerText) || 10;
      const stock = plant && plant.stock !== undefined ? parseInt(plant.stock) : 20;

      if (stock <= 0) {
        showToast(`К сожалению, саженцы «${plant.name}» сейчас закончились на складе.`, 'warning');
        return;
      }

      const existing = cart.find(i => i.id === plant.id);
      if (existing) {
        if (existing.qty + count > stock) {
          showToast(`На складе доступно только ${stock} шт. саженцев «${plant.name}» (в корзине уже ${existing.qty} шт.).`, 'warning');
          return;
        }
        existing.qty += count;
      } else {
        cart.push({ ...plant, qty: count });
      }
      saveCart();
      updateCartUI();
      openCart();
      showToast(`Комплект «${plant.name}» (${count} шт.) добавлен в корзину!`, true);
    }

    // CHECKOUT MODAL
        let isEditingCheckoutProfile = false;
    
    function updateCheckoutLoyaltyDisplay(loyalty) {
      const loyaltyBadgeBox = document.getElementById('checkoutProfileLoyaltyBox');
      const loyaltyTextEl = document.getElementById('checkoutProfileLoyaltyText');
      const discountRow = document.getElementById('checkoutLoyaltyDiscountRow');
      const discountLabel = document.getElementById('checkoutLoyaltyDiscountLabel');
      const discountSumEl = document.getElementById('checkoutLoyaltyDiscountSum');
      const subtotalEl = document.getElementById('orderSummarySubtotal');
      const orderSummarySum = document.getElementById('orderSummarySum');

      const subtotal = (typeof cart !== 'undefined' && Array.isArray(cart)) ? cart.reduce((acc, i) => acc + (i.price * i.qty), 0) : 0;
      if (subtotalEl) subtotalEl.innerText = `${subtotal.toLocaleString()} ₽`;

      if (loyaltyBadgeBox && loyaltyTextEl) {
        if (loyalty && loyalty.level > 0) {
          loyaltyBadgeBox.classList.remove('hidden');
          loyaltyTextEl.className = `font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${loyalty.badgeClass}`;
          loyaltyTextEl.innerText = loyalty.title;
        } else {
          loyaltyBadgeBox.classList.add('hidden');
        }
      }

      if (loyalty && loyalty.discountPercent > 0) {
        const discountAmount = Math.round(subtotal * (loyalty.discountPercent / 100));
        const finalTotal = Math.max(0, subtotal - discountAmount);
        if (discountRow) discountRow.classList.remove('hidden');
        if (discountLabel) discountLabel.innerText = `Персональная скидка (${loyalty.discountPercent}%):`;
        if (discountSumEl) discountSumEl.innerText = `-${discountAmount.toLocaleString()} ₽`;
        if (orderSummarySum) orderSummarySum.innerText = `${finalTotal.toLocaleString()} ₽`;
      } else {
        if (discountRow) discountRow.classList.add('hidden');
        if (orderSummarySum) orderSummarySum.innerText = `${subtotal.toLocaleString()} ₽`;
      }
    }

    function updateCheckoutLoyaltyFromPhone() {
      const phone = document.getElementById('orderPhone')?.value || '';
      const loyalty = getCustomerLoyalty(phone);
      updateCheckoutLoyaltyDisplay(loyalty);
    }

    function openCheckoutModal() {
      if (cart.length === 0) return;
      closeCart();
      const modal = document.getElementById('checkoutModal');
      const formContainer = document.getElementById('checkoutFormContainer');
      const successContainer = document.getElementById('checkoutSuccessContainer');
      const submitBtn = document.getElementById('orderSubmitBtn');

      if (formContainer) formContainer.classList.remove('hidden');
      if (successContainer) successContainer.classList.add('hidden');

      // Check if user has saved profile
      let profile = null;
      try {
        const raw = localStorage.getItem('xvoinyimir_user_profile');
        if (raw) profile = JSON.parse(raw);
      } catch(e) {}

      const quickBox = document.getElementById('checkoutQuickProfileBox');
      const fieldsBox = document.getElementById('checkoutFieldsContainer');
      const nameInput = document.getElementById('orderName');
      const phoneInput = document.getElementById('orderPhone');
      const addrInput = document.getElementById('orderAddress');

      if (profile && profile.name && profile.phone && profile.phone.replace(/\D/g, '').length >= 10 && !isEditingCheckoutProfile) {
        nameInput.value = profile.name;
        phoneInput.value = profile.phone;
        if (profile.address && addrInput && !addrInput.value) addrInput.value = profile.address;

        const pName = document.getElementById('checkoutProfileNameDisplay');
        const pPhone = document.getElementById('checkoutProfilePhoneDisplay');
        const addrText = document.getElementById('checkoutProfileAddressText');
        if (pName) pName.innerText = profile.name;
        if (pPhone) pPhone.innerText = profile.phone;
        if (addrText) addrText.innerText = profile.address || 'Укажите при необходимости';

        if (quickBox) quickBox.classList.remove('hidden');
        if (fieldsBox) fieldsBox.classList.add('hidden');

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="inline-flex items-center gap-1.5"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Подтвердить заказ</span></span>';
          submitBtn.className = 'w-full py-3.5 bg-pine-850 hover:bg-pine-800 active:scale-95 text-white font-bold rounded-xl text-sm transition-all shadow-md border-2 border-pine-900 cursor-pointer flex items-center justify-center gap-2';
        }
      } else {
        if (quickBox) quickBox.classList.add('hidden');
        if (fieldsBox) fieldsBox.classList.remove('hidden');

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Оформить заказ на сайте</span>';
          submitBtn.className = 'w-full py-3.5 bg-pine-850 hover:bg-pine-800 active:scale-95 text-white font-bold rounded-xl text-sm transition-all shadow-xs border-2 border-pine-900 cursor-pointer flex items-center justify-center gap-2';
        }
      }

      // Calculate and display customer loyalty discount
      const activeCustomerPhone = (profile && profile.phone) ? profile.phone : (document.getElementById('orderPhone')?.value || '');
      const activeLoyalty = getCustomerLoyalty(activeCustomerPhone);
      updateCheckoutLoyaltyDisplay(activeLoyalty);

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function toggleEditCheckoutProfile() {
      isEditingCheckoutProfile = !isEditingCheckoutProfile;
      const quickBox = document.getElementById('checkoutQuickProfileBox');
      const fieldsBox = document.getElementById('checkoutFieldsContainer');
      if (isEditingCheckoutProfile) {
        if (quickBox) quickBox.classList.add('hidden');
        if (fieldsBox) fieldsBox.classList.remove('hidden');
      } else {
        openCheckoutModal();
      }
    }

    function closeCheckoutModal() {
      const modal = document.getElementById('checkoutModal');
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      const formContainer = document.getElementById('checkoutFormContainer');
      const successContainer = document.getElementById('checkoutSuccessContainer');
      if (formContainer) formContainer.classList.remove('hidden');
      if (successContainer) successContainer.classList.add('hidden');
    }

    function submitOrder(e) {
      e.preventDefault();
      const submitBtn = document.getElementById('orderSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="animate-pulse">⏳ Оформляем заказ...</span>';
      }

      const name = document.getElementById('orderName').value.trim() || 'Покупатель';
      let phone = document.getElementById('orderPhone').value.trim();
      let phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        showToast("Пожалуйста, укажите полный номер телефона (от 10 цифр)", "warning");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Подтвердить заказ на сайте</span>';
        }
        return;
      }
      // Auto-format Russian phone numbers whether 10 or 11 digits:
      if (phoneDigits.length === 10) {
        phone = '+7 (' + phoneDigits.slice(0, 3) + ') ' + phoneDigits.slice(3, 6) + '-' + phoneDigits.slice(6, 8) + '-' + phoneDigits.slice(8, 10);
      } else if (phoneDigits.length >= 11) {
        const d = (phoneDigits.startsWith('7') || phoneDigits.startsWith('8')) ? phoneDigits.slice(1, 11) : phoneDigits.slice(0, 10);
        phone = '+7 (' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6, 8) + '-' + d.slice(8, 10);
      }
      const delivery = document.getElementById('orderDelivery').value;
      const address = document.getElementById('orderAddress')?.value.trim() || '';
      const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
      const customerLoyalty = getCustomerLoyalty(phone);
      const discountPercent = customerLoyalty.discountPercent || 0;
      const discount = discountPercent > 0 ? Math.round(subtotal * (discountPercent / 100)) : 0;
      const total = Math.max(0, subtotal - discount);
      const itemsSnapshot = [...cart];

      // Save order to admin panel
      const orderData = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        type: 'Заказ товаров',
        name,
        phone,
        delivery: address ? `${delivery} (${address})` : delivery,
        items: itemsSnapshot,
        subtotal,
        discount,
        discountPercent,
        loyaltyLevel: customerLoyalty.level,
        total,
        status: 'Новый'
      };
      saveOrderToAdmin(orderData);
      saveOrderToCustomerProfile(orderData);
      broadcastOrderToCloud(orderData);
      sendOrderToTelegram(orderData);

      // Deduct stock and automatically record sales in reports log
      itemsSnapshot.forEach(item => {
        const qtyToDeduct = parseInt(item.qty) || 1;
        const plant = findPlantForItem(item);
        if (plant) {
          if (plant.stock === undefined || isNaN(plant.stock) || plant.stock === null) plant.stock = 20;
          plant.stock = Math.max(0, parseInt(plant.stock) - qtyToDeduct);
        }
        recordSale({
          orderId: orderData.id,
          date: orderData.date,
          plantId: plant ? plant.id : (item.id || 1),
          plantName: plant ? plant.name : item.name,
          quantity: qtyToDeduct,
          unitPrice: item.price || (plant ? plant.price : 550),
          totalPrice: (item.price || (plant ? plant.price : 550)) * qtyToDeduct,
          customer: name,
          phone: phone,
          channel: orderData.type,
          note: delivery
        });
      });

      // Save updated plants & refresh all UI
      savePlants();
      renderProducts();
      updateSeasonHitUI();
      renderAdminPlantsTable();
      renderAdminReportsTable();

      // Clear Cart
      cart = [];
      saveCart();
      updateCartUI();

      // Send Telegram push alert & save to customer profile
      saveOrderToCustomerProfile(orderData);
      sendOrderToTelegram(orderData);

      // Populate Success Screen
      const successOrderId = document.getElementById('checkoutSuccessOrderId');
      const successTotal = document.getElementById('checkoutSuccessTotal');
      const successCustomer = document.getElementById('checkoutSuccessCustomer');
      const successList = document.getElementById('checkoutSuccessItemsList');

      if (successOrderId) successOrderId.innerText = '#' + orderData.id;
      if (successTotal) successTotal.innerText = total.toLocaleString('ru-RU') + ' ₽';
      if (successCustomer) successCustomer.innerText = `${name} (${phone})`;
      if (successList) {
        successList.innerHTML = itemsSnapshot.map(i => `
          <div class="flex justify-between items-center py-1 border-b border-stone-100 last:border-0">
            <span class="truncate">• ${escapeHtml(i.name)} <strong class="text-pine-900">× ${Number(i.qty) || 1} шт.</strong></span>
            <span class="font-bold whitespace-nowrap ml-2">${(Number(i.price * i.qty) || 0).toLocaleString('ru-RU')} ₽</span>
          </div>
        `).join('');
      }

      // Switch to Success Confirmation View
      const formContainer = document.getElementById('checkoutFormContainer');
      const successContainer = document.getElementById('checkoutSuccessContainer');
      if (formContainer) formContainer.classList.add('hidden');
      if (successContainer) successContainer.classList.remove('hidden');

      showToast(`Заказ #${orderData.id} успешно принят!`);
    }

    function sendViaMessenger(app) {
      const name = document.getElementById('orderName').value.trim() || "Клиент";
      const phone = document.getElementById('orderPhone').value.trim() || "не указан";
      const delivery = document.getElementById('orderDelivery').value;
      const address = document.getElementById('orderAddress')?.value.trim() || '';
      const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
      const customerLoyalty = getCustomerLoyalty(phone);
      const discountPercent = customerLoyalty.discountPercent || 0;
      const discount = discountPercent > 0 ? Math.round(subtotal * (discountPercent / 100)) : 0;
      const total = Math.max(0, subtotal - discount);
      const itemsSnapshot = [...cart];

      // Save order to admin panel too
      const orderData = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        type: app === 'whatsapp' ? 'Заказ (WhatsApp)' : 'Заказ (Telegram)',
        name,
        phone,
        delivery: address ? `${delivery} (${address})` : delivery,
        items: itemsSnapshot,
        subtotal,
        discount,
        discountPercent,
        loyaltyLevel: customerLoyalty.level,
        total,
        status: 'Новый'
      };
      saveOrderToAdmin(orderData);
      saveOrderToCustomerProfile(orderData);
      sendOrderToTelegram(orderData);

      // Deduct stock and automatically record sales in reports log
      itemsSnapshot.forEach(item => {
        const qtyToDeduct = parseInt(item.qty) || 1;
        const plant = findPlantForItem(item);
        if (plant) {
          if (plant.stock === undefined || isNaN(plant.stock) || plant.stock === null) plant.stock = 20;
          plant.stock = Math.max(0, parseInt(plant.stock) - qtyToDeduct);
        }
        recordSale({
          orderId: orderData.id,
          date: orderData.date,
          plantId: plant ? plant.id : (item.id || 1),
          plantName: plant ? plant.name : item.name,
          quantity: qtyToDeduct,
          unitPrice: item.price || (plant ? plant.price : 550),
          totalPrice: (item.price || (plant ? plant.price : 550)) * qtyToDeduct,
          customer: name,
          phone: phone,
          channel: orderData.type,
          note: delivery
        });
      });

      // Save updated plants & refresh all UI
      savePlants();
      renderProducts();
      updateSeasonHitUI();
      renderAdminPlantsTable();
      renderAdminReportsTable();

      // Clear Cart
      cart = [];
      saveCart();
      updateCartUI();

      // Populate Success Screen
      const successOrderId = document.getElementById('checkoutSuccessOrderId');
      const successTotal = document.getElementById('checkoutSuccessTotal');
      const successCustomer = document.getElementById('checkoutSuccessCustomer');
      const successList = document.getElementById('checkoutSuccessItemsList');

      if (successOrderId) successOrderId.innerText = '#' + orderData.id;
      if (successTotal) successTotal.innerText = total.toLocaleString('ru-RU') + ' ₽';
      if (successCustomer) successCustomer.innerText = `${name} (${phone})`;
      if (successList) {
        successList.innerHTML = itemsSnapshot.map(i => `
          <div class="flex justify-between items-center py-1 border-b border-stone-100 last:border-0">
            <span class="truncate">• ${escapeHtml(i.name)} <strong class="text-pine-900">× ${Number(i.qty) || 1} шт.</strong></span>
            <span class="font-bold whitespace-nowrap ml-2">${(Number(i.price * i.qty) || 0).toLocaleString('ru-RU')} ₽</span>
          </div>
        `).join('');
      }

      // Switch to Success Confirmation View
      const formContainer = document.getElementById('checkoutFormContainer');
      const successContainer = document.getElementById('checkoutSuccessContainer');
      if (formContainer) formContainer.classList.add('hidden');
      if (successContainer) successContainer.classList.remove('hidden');

      const itemsText = itemsSnapshot.map(i => `• ${i.name} (${i.qty} шт.) = ${i.price * i.qty} ₽`).join('\n');
      const message = `🌿 Новый заказ с сайта «Хвойный мир»:\n\nПокупатель: ${name}\nТелефон: ${phone}\nДоставка: ${delivery} ${address ? `(${address})` : ''}\n\nСостав заказа:\n${itemsText}\n\nИтого: ${total} ₽`;

      const encoded = encodeURIComponent(message);
      if (app === 'whatsapp') {
        window.open(`https://wa.me/79602036065?text=${encoded}`, '_blank');
      } else {
        window.open(`https://t.me/hvoinyimir?text=${encoded}`, '_blank');
      }
      showToast(`Заказ передан в ${app === 'whatsapp' ? 'WhatsApp' : 'Telegram'}!`);
    }

    function handleConsultationSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('consultName').value.trim();
      const phone = document.getElementById('consultPhone').value.trim();
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 11) {
        showToast("Пожалуйста, укажите полный номер телефона: +7 (XXX) XXX-XX-XX", "warning");
        return;
      }
      const interest = document.getElementById('consultInterest').value;

      // Save consultation request to admin panel
      const reqData = {
        id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        type: 'Консультация',
        name,
        phone,
        interest,
        total: 0,
        status: 'Новый'
      };
      saveOrderToAdmin(reqData);

      document.getElementById('consultSuccess').classList.remove('hidden');
      setTimeout(() => {
        e.target.reset();
        document.getElementById('consultSuccess').classList.add('hidden');
      }, 4000);
    }

    // ==========================================
    // ADMIN PANEL & SITE SETTINGS LOGIC
    // ==========================================
    const DEFAULT_SETTINGS = {
      bannerEnabled: true,
      bannerText: '<svg class="w-3.5 h-3.5 text-emerald-400 shrink-0 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> <strong>Бесплатная доставка по Великому Новгороду</strong> при заказе от 1 500 ₽ • Отправляем по всей России (СДЭК / Почта РФ)',
      phone: "+7 (960) 203-60-65",
      phoneRaw: "79602036065",
      telegramUrl: "https://t.me/hvoinyimir",
      vkUrl: "https://vk.ru/xvoinyimir",
      freeDeliveryThreshold: 1500,
      deliveryFee: 250,
      seasonHitPlantId: 1,
      telegramBotToken: "",
      telegramChatId: "",
      cloudSyncUrl: "",
      cloudSyncTopic: "xvoinyimir_orders_live_sync_v1"
    };

    let siteSettings = { ...DEFAULT_SETTINGS };

    function loadSiteSettings() {
      try {
        const saved = localStorage.getItem('xvoinyimir_settings');
        if (saved) {
          siteSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
      } catch (e) {
        siteSettings = { ...DEFAULT_SETTINGS };
      }
      applySiteSettings();
    }

    function applySiteSettings() {
      const thresh = parseInt(siteSettings.freeDeliveryThreshold) || 1500;
      const fee = parseInt(siteSettings.deliveryFee) || 250;
      const threshFormatted = thresh.toLocaleString('ru-RU') + ' ₽';
      const feeFormatted = fee.toLocaleString('ru-RU') + ' ₽';

      // Banner visibility & dynamic text
      const bannerEl = document.getElementById('topBanner');
      const bannerTextEl = document.getElementById('topBannerText');
      if (bannerEl) {
        bannerEl.style.display = siteSettings.bannerEnabled ? 'flex' : 'none';
      }
      if (bannerTextEl && siteSettings.bannerText) {
        let bText = siteSettings.bannerText || '';
        bText = bText.replace(/^[🌿🚗🎉📦]+\s*/, '');
        if (!bText.includes('<svg') && !bText.includes('free-delivery-threshold-text')) {
          bText = '<svg class="w-3.5 h-3.5 text-emerald-400 shrink-0 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> ' + bText;
        }
        if (bText.includes('доставка') || bText.includes('Доставка')) {
          bText = bText.replace(/от\s+[\d\s]+₽/gi, `от <span class="free-delivery-threshold-text">${threshFormatted}</span>`);
        }
        bannerTextEl.innerHTML = bText;
      }

      // Nursery Phone links & texts
      const headerPhoneText = document.getElementById('headerPhoneText');
      const headerPhoneLink = document.getElementById('headerPhoneLink');
      const footerPhoneLink = document.getElementById('footerPhoneLink');
      const contactsPhoneText = document.getElementById('contactsPhoneText');
      const contactsPhoneLink = document.getElementById('contactsPhoneLink');
      if (headerPhoneText) headerPhoneText.innerText = siteSettings.phone;
      if (headerPhoneLink) headerPhoneLink.href = `tel:+${siteSettings.phoneRaw}`;
      if (footerPhoneLink) {
        footerPhoneLink.innerText = siteSettings.phone;
        footerPhoneLink.href = `tel:+${siteSettings.phoneRaw}`;
      }
      if (contactsPhoneText) contactsPhoneText.innerText = siteSettings.phone;
      if (contactsPhoneLink) contactsPhoneLink.href = `tel:+${siteSettings.phoneRaw}`;

      // Telegram links
      const headerTgLink = document.getElementById('headerTgLink');
      const footerTgLink = document.getElementById('footerTgLink');
      if (headerTgLink) headerTgLink.href = siteSettings.telegramUrl;
      if (footerTgLink) footerTgLink.href = siteSettings.telegramUrl;

      // VK link
      const heroVkLink = document.getElementById('heroVkLink');
      const footerVkLink = document.getElementById('footerVkLink');
      if (heroVkLink) heroVkLink.href = siteSettings.vkUrl;
      if (footerVkLink) footerVkLink.href = siteSettings.vkUrl;

      // Fill in admin settings inputs
      const bannerCheck = document.getElementById('settingsBannerEnabled');
      const bannerTextInp = document.getElementById('settingsBannerText');
      const phoneInp = document.getElementById('settingsPhone');
      const threshInp = document.getElementById('settingsThreshold');
      const feeInp = document.getElementById('settingsDeliveryFee');
      const tgInp = document.getElementById('settingsTg');
      const vkInp = document.getElementById('settingsVk');

      if (bannerCheck) bannerCheck.checked = siteSettings.bannerEnabled;
      if (bannerTextInp) bannerTextInp.value = siteSettings.bannerText;
      if (phoneInp) phoneInp.value = siteSettings.phone;
      if (threshInp) threshInp.value = thresh;
      if (feeInp) feeInp.value = fee;

      // Update all free delivery threshold and delivery fee texts across the entire site
      document.querySelectorAll('.free-delivery-threshold-text').forEach(el => {
        el.innerText = threshFormatted;
      });
      document.querySelectorAll('.free-delivery-threshold-val').forEach(el => {
        el.innerText = thresh;
      });
      document.querySelectorAll('.delivery-fee-text').forEach(el => {
        el.innerText = feeFormatted;
      });
      document.querySelectorAll('.delivery-fee-val').forEach(el => {
        el.innerText = fee;
      });

      const optVn = document.getElementById('checkoutDeliveryOptionVn');
      if (optVn) {
        optVn.innerText = `Доставка по Великому Новгороду (бесплатно от ${threshFormatted}, иначе ${feeFormatted})`;
      }
      if (tgInp) tgInp.value = siteSettings.telegramUrl;
      if (vkInp) vkInp.value = siteSettings.vkUrl;

      updateSeasonHitUI();
      updateCartUI();
    }

    function saveBannerSettings() {
      const bannerCheck = document.getElementById('settingsBannerEnabled');
      const bannerTextInp = document.getElementById('settingsBannerText');
      siteSettings.bannerEnabled = bannerCheck ? bannerCheck.checked : true;
      siteSettings.bannerText = bannerTextInp ? bannerTextInp.value.trim() : siteSettings.bannerText;
      localStorage.setItem('xvoinyimir_settings', JSON.stringify(siteSettings));
      applySiteSettings();
      showToast("Текст плашки оповещений обновлен!", "success");
    }

    function setBannerPreset(num) {
      const bannerTextInp = document.getElementById('settingsBannerText');
      if (!bannerTextInp) return;
      const threshFormatted = (siteSettings.freeDeliveryThreshold || 1500).toLocaleString('ru-RU') + ' ₽';
      if (num === 1) {
        bannerTextInp.value = '<svg class="w-3.5 h-3.5 text-emerald-400 shrink-0 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> <strong>Сезонная распродажа весна-лето 2026:</strong> саженцы туи от 490 ₽, голубика от 650 ₽ • Доставка по В. Новгороду!';
      } else if (num === 2) {
        bannerTextInp.value = `<svg class="w-3.5 h-3.5 text-emerald-400 shrink-0 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5a2 2 0 0 0-2 2v7h2m0 0a2 2 0 1 0 4 0m10 0a2 2 0 1 0 4 0"/></svg> <strong>Бесплатная доставка по Великому Новгороду</strong> при заказе от ${threshFormatted} • Отправляем по всей РФ (СДЭК/Почта)`;
      }
    }

    function saveContactSettings() {
      const phoneInp = document.getElementById('settingsPhone');
      const threshInp = document.getElementById('settingsThreshold');
      const feeInp = document.getElementById('settingsDeliveryFee');
      const tgInp = document.getElementById('settingsTg');
      const vkInp = document.getElementById('settingsVk');

      if (phoneInp && phoneInp.value) {
        siteSettings.phone = phoneInp.value.trim();
        siteSettings.phoneRaw = siteSettings.phone.replace(/\D/g, '');
      }
      if (threshInp && threshInp.value) {
        siteSettings.freeDeliveryThreshold = parseInt(threshInp.value) || 1500;
      }
      if (feeInp && feeInp.value) {
        siteSettings.deliveryFee = parseInt(feeInp.value) || 250;
      }
      if (tgInp && tgInp.value) siteSettings.telegramUrl = tgInp.value.trim();
      if (vkInp && vkInp.value) siteSettings.vkUrl = vkInp.value.trim();

      // Ensure banner reflects updated threshold
      const threshFormatted = (siteSettings.freeDeliveryThreshold || 1500).toLocaleString('ru-RU') + ' ₽';
      if (siteSettings.bannerText && (siteSettings.bannerText.includes('доставка') || siteSettings.bannerText.includes('Доставка'))) {
        siteSettings.bannerText = siteSettings.bannerText.replace(/от\s+[\d\s]+₽/gi, `от ${threshFormatted}`);
      }

      localStorage.setItem('xvoinyimir_settings', JSON.stringify(siteSettings));
      applySiteSettings();
      showToast("Контакты и условия доставки успешно обновлены!", "success");
    }

    function updateSeasonHitUI() {
      let hit = PLANTS.find(p => p.id === siteSettings.seasonHitPlantId);
      if (!hit) {
        hit = PLANTS.find(p => p.badge && p.badge.includes('хит')) || PLANTS[0];
      }
      if (!hit) return;

      const coverImgEl = document.getElementById('heroCoverImg');
      const imgEl = document.getElementById('heroSeasonHitImg');
      const nameEl = document.getElementById('heroSeasonHitName');
      const descEl = document.getElementById('heroSeasonHitDesc');
      const priceEl = document.getElementById('heroSeasonHitPrice');
      const btnEl = document.getElementById('heroSeasonHitBtn');

      if (coverImgEl && hit.image) {
        coverImgEl.src = hit.image;
        coverImgEl.alt = hit.name;
      }
      if (imgEl && hit.image) {
        imgEl.src = hit.image;
        imgEl.alt = hit.name;
      }
      if (nameEl) nameEl.innerText = hit.name;
      
      const hitStock = hit.stock !== undefined ? hit.stock : 20;
      if (descEl) descEl.innerText = `${hit.pot || 'ЗКС'} • ${hitStock > 0 ? `В наличии: ${hitStock} шт.` : 'Под заказ'}`;
      if (priceEl) priceEl.innerText = `от ${hit.price} ₽`;
      
      if (btnEl) {
        if (hitStock <= 0) {
          btnEl.disabled = true;
          btnEl.innerText = 'Закончился';
          btnEl.className = 'mt-1 text-xs px-3 sm:px-3.5 py-1.5 bg-stone-200 text-stone-500 font-bold rounded-xl shadow-xs border-2 border-stone-300 cursor-not-allowed whitespace-nowrap';
          btnEl.onclick = null;
        } else {
          btnEl.disabled = false;
          btnEl.innerText = '+ В корзину';
          btnEl.className = 'mt-1 text-xs px-3 sm:px-3.5 py-1.5 bg-pine-800 hover:bg-pine-700 active:scale-95 text-white font-bold rounded-xl transition-all shadow-xs border-2 border-pine-700 hover:border-emerald-400 cursor-pointer whitespace-nowrap';
          btnEl.onclick = () => addToCart(hit.id);
        }
      }
    }

    function setSeasonHit(plantId) {
      siteSettings.seasonHitPlantId = plantId;
      localStorage.setItem('xvoinyimir_settings', JSON.stringify(siteSettings));
      updateSeasonHitUI();
      renderAdminPlantsTable();
      showToast("Сезонный хит обновлен на главной странице!");
    }

    function getAdminPassword() {
      return localStorage.getItem('xvoinyimir_admin_pw') || 'admin123';
    }

    function openAdminModal() {
      if (sessionStorage.getItem('xvoinyimir_admin_auth') === 'true') {
        showAdminDashboard();
      } else {
        showAdminAuth();
      }
    }

    function showAdminAuth() {
      const modal = document.getElementById('adminAuthModal');
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      const input = document.getElementById('adminPasswordInput');
      input.value = '';
      document.getElementById('adminAuthError').classList.add('hidden');
      setTimeout(() => input.focus(), 100);
    }

    function closeAdminAuthModal() {
      document.getElementById('adminAuthModal').classList.add('hidden');
      document.body.style.overflow = '';
      if (window.location.hash === '#admin') {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }
    }

    function handleAdminAuth(e) {
      e.preventDefault();
      const entered = document.getElementById('adminPasswordInput').value;
      if (entered === getAdminPassword()) {
        sessionStorage.setItem('xvoinyimir_admin_auth', 'true');
        closeAdminAuthModal();
        showAdminDashboard();
      } else {
        document.getElementById('adminAuthError').classList.remove('hidden');
      }
    }

    function showAdminDashboard() {
      const modal = document.getElementById('adminPanelModal');
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      renderAdminPlantsTable();
      renderAdminOrdersTable();
      renderAdminReportsTable();
      switchAdminTab('plants');
      syncOrdersFromLiveCloud(false);
    }

    function closeAdminPanelModal() {
      document.getElementById('adminPanelModal').classList.add('hidden');
      document.body.style.overflow = '';
      if (window.location.hash === '#admin') {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }
    }

    function logoutAdmin() {
      sessionStorage.removeItem('xvoinyimir_admin_auth');
      closeAdminPanelModal();
    }

    function switchAdminTab(tab) {
      ['plants', 'orders', 'reports', 'settings'].forEach(t => {
        const tabEl = document.getElementById(`adminTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
        const btnEl = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
        if (t === tab) {
          if (tabEl) tabEl.classList.remove('hidden');
          if (btnEl) btnEl.className = "py-3.5 border-b-2 border-pine-800 text-pine-900 font-bold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer";
        } else {
          if (tabEl) tabEl.classList.add('hidden');
          if (btnEl) btnEl.className = "py-3.5 border-b-2 border-transparent text-stone-500 hover:text-stone-800 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer";
        }
      });

      if (tab === 'plants') renderAdminPlantsTable();
      if (tab === 'orders') {
        if (typeof toggleOrderSearchClear === 'function') toggleOrderSearchClear();
        renderAdminOrdersTable();
        syncOrdersFromLiveCloud(false);
      }
      if (tab === 'reports') {
        if (typeof toggleReportSearchClear === 'function') toggleReportSearchClear();
        renderAdminReportsTable();
      }
      if (tab === 'settings') applySiteSettings();
    }

    // ==========================================
    // TAB 1: PLANTS MANAGEMENT
    // ==========================================
    function renderAdminPlantsTable() {
      const tbody = document.getElementById('adminPlantsTableBody');
      const search = (document.getElementById('adminPlantSearch')?.value || '').toLowerCase().trim();
      const categoryFilter = document.getElementById('adminCategoryFilter')?.value || 'all';
      tbody.innerHTML = '';

      const countBadge = document.getElementById('adminPlantCountBadge');
      if (countBadge) countBadge.innerText = PLANTS.length;

      const filtered = PLANTS.filter(p => {
        const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
        const matchSearch = p.name.toLowerCase().includes(search) || 
                            (p.latin && p.latin.toLowerCase().includes(search));
        return matchCat && matchSearch;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-stone-400">Саженцы не найдены</td></tr>`;
        return;
      }

      filtered.forEach(p => {
        const isSeasonHit = p.id === siteSettings.seasonHitPlantId;
        const tr = document.createElement('tr');
        tr.className = `hover:bg-stone-50 transition-colors ${isSeasonHit ? 'bg-amber-50/30' : ''}`;
        tr.innerHTML = `
          <td class="py-2.5 px-4">
            <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover border border-stone-200" alt="${p.name}">
          </td>
          <td class="py-2.5 px-4">
            <div class="font-bold text-stone-900 flex items-center gap-1.5 flex-wrap">
              <span>${p.name}</span>
              ${isSeasonHit ? '<span class="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded-md font-extrabold border border-amber-300">ХИТ</span>' : ''}
              ${(p.sizes && p.sizes.length > 1) ? `<span class="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-bold border border-emerald-200" title="${p.sizes.map(s => s.name + ': ' + s.price + ' ₽').join(', ')}">${p.sizes.length} разм.</span>` : ''}
            </div>
            <div class="text-[10px] text-stone-400 font-mono italic">${p.latin || ''}</div>
          </td>
          <td class="py-2.5 px-4 text-stone-600 font-medium">
            ${getCategoryName(p.category)}
          </td>
          <td class="py-2.5 px-4 text-stone-600">
            ${p.pot || 'ЗКС'}
          </td>
          <td class="py-2.5 px-4">
            <div class="flex items-center gap-1.5">
              <input type="number" value="${p.price}" id="priceInput_${p.id}" onchange="saveQuickPrice(${p.id}, this.value)" class="w-20 px-2 py-1 text-xs font-bold border-2 border-stone-200 rounded-lg focus:outline-none focus:border-pine-700 bg-white">
              <span class="text-xs text-stone-500 font-bold">₽</span>
            </div>
          </td>
          <td class="py-2.5 px-4 text-center">
            <div class="inline-flex items-center gap-1 justify-center">
              <button onclick="changePlantStock(${p.id}, -1)" class="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center border border-stone-300 cursor-pointer" title="Уменьшить на 1">−</button>
              <input type="number" min="0" value="${p.stock !== undefined ? p.stock : 20}" onchange="setPlantStock(${p.id}, this.value)" class="w-14 px-1 py-1 text-xs text-center font-bold border-2 border-stone-200 rounded-lg focus:outline-none focus:border-pine-700 ${(p.stock <= 0) ? 'bg-rose-50 text-rose-700 border-rose-300' : (p.stock <= 5) ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-white text-stone-800'}">
              <button onclick="changePlantStock(${p.id}, 1)" class="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center border border-stone-300 cursor-pointer" title="Увеличить на 1">+</button>
              <button onclick="changePlantStock(${p.id}, 10)" class="px-1.5 h-6 rounded-md bg-pine-50 hover:bg-pine-100 text-pine-800 font-bold text-[10px] flex items-center justify-center border border-pine-200 cursor-pointer" title="Пополнить на +10 шт.">+10</button>
            </div>
          </td>
          <td class="py-2.5 px-4 text-center">
            <button onclick="setSeasonHit(${p.id})" class="px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border-2 cursor-pointer ${isSeasonHit ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-2xs' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:bg-amber-50'}" title="${isSeasonHit ? 'Активный сезонный хит на главной' : 'Сделать сезонным хитом в блоке Hero'}">
              ${isSeasonHit ? SVG_ICONS.starFilled + ' <span>Активный хит</span>' : SVG_ICONS.star + ' <span>Сделать хитом</span>'}
            </button>
          </td>
          <td class="py-2.5 px-4 text-right whitespace-nowrap">
            <button onclick="openAddPlantModal(${p.id})" class="p-1.5 text-stone-500 hover:text-pine-800 transition-colors border border-stone-200 hover:border-pine-400 rounded-lg bg-white mr-1 flex items-center justify-center" title="Редактировать">
              ${SVG_ICONS.pencil}
            </button>
            <button onclick="deletePlant(${p.id})" class="p-1.5 text-stone-400 hover:text-red-600 transition-colors border border-stone-200 hover:border-red-400 rounded-lg bg-white flex items-center justify-center" title="Удалить">
              ${SVG_ICONS.trash}
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function getCategoryName(cat) {
      const map = {
        'conifer': 'Хвойные породы',
        'blueberry': 'Сортовая голубика',
        'grass': 'Декоративные травы',
        'shrub': 'Кустарники',
        'strawberry': 'Клубника'
      };
      return map[cat] || cat;
    }

    function saveQuickPrice(id, newPrice) {
      const price = parseInt(newPrice);
      if (isNaN(price) || price <= 0) return;
      const plant = PLANTS.find(p => p.id === id);
      if (plant) {
        plant.price = price;
        savePlants();
        renderProducts();
        updateSeasonHitUI();
        renderAdminReportsTable();
        showToast(`Цена «${plant.name}» обновлена: ${price} ₽`);
      }
    }

    function togglePlantStock(id) {
      const plant = PLANTS.find(p => p.id === id);
      if (plant) {
        plant.outOfStock = !plant.outOfStock;
        savePlants();
        renderAdminPlantsTable();
        renderProducts();
      }
    }

    let editingPlantSizes = [];

    function renderAdminPlantSizesList() {
      const container = document.getElementById('plantSizesListContainer');
      if (!container) return;

      if (!editingPlantSizes || editingPlantSizes.length === 0) {
        container.innerHTML = `
          <div class="text-center py-4 px-3 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500 text-xs">
            Размеры не добавлены. Будет использоваться один стандартный размер из полей выше.
            <button type="button" onclick="addPlantSizeRow()" class="block mx-auto mt-2 text-pine-700 hover:text-pine-900 font-bold hover:underline cursor-pointer">+ Добавить первый вариант размера</button>
          </div>
        `;
        return;
      }

      container.innerHTML = editingPlantSizes.map((s, idx) => `
        <div class="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 plant-size-row" data-size-idx="${idx}">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 flex-1">
              <span class="w-5 h-5 rounded-full bg-pine-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">${idx + 1}</span>
              <input type="text" class="size-name w-full bg-white border border-stone-300 focus:border-pine-700 rounded-lg px-2.5 py-1 text-xs text-stone-900 font-bold" placeholder="Название размера (напр. Маленький, Средний, 40-50 см)" value="${escapeHtml(s.name || '')}" required oninput="editingPlantSizes[${idx}].name = this.value">
            </div>
            <button type="button" onclick="removePlantSizeRow(${idx})" class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all cursor-pointer shrink-0" title="Удалить этот размер">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span class="block text-[10px] text-stone-500 font-semibold mb-0.5">Цена (₽) *</span>
              <input type="number" min="1" class="size-price w-full bg-white border border-stone-300 focus:border-pine-700 rounded-lg px-2 py-1 text-xs font-bold" placeholder="550" value="${s.price || ''}" oninput="editingPlantSizes[${idx}].price = parseInt(this.value)||0">
            </div>
            <div>
              <span class="block text-[10px] text-stone-500 font-semibold mb-0.5">Старая цена (₽)</span>
              <input type="number" min="0" class="size-oldprice w-full bg-white border border-stone-300 focus:border-pine-700 rounded-lg px-2 py-1 text-xs" placeholder="650" value="${s.oldPrice || ''}" oninput="editingPlantSizes[${idx}].oldPrice = parseInt(this.value)||0">
            </div>
            <div>
              <span class="block text-[10px] text-stone-500 font-semibold mb-0.5">Высота</span>
              <input type="text" class="size-height w-full bg-white border border-stone-300 focus:border-pine-700 rounded-lg px-2 py-1 text-xs" placeholder="40-50 см" value="${escapeHtml(s.height || '')}" oninput="editingPlantSizes[${idx}].height = this.value">
            </div>
            <div>
              <span class="block text-[10px] text-stone-500 font-semibold mb-0.5">Контейнер / ЗКС</span>
              <input type="text" class="size-pot w-full bg-white border border-stone-300 focus:border-pine-700 rounded-lg px-2 py-1 text-xs" placeholder="C2 (2 л)" value="${escapeHtml(s.pot || '')}" oninput="editingPlantSizes[${idx}].pot = this.value">
            </div>
          </div>
          <div>
            <span class="block text-[10px] text-stone-500 font-semibold mb-0.5">Фотографии этого размера (URL через запятую):</span>
            <textarea rows="2" class="size-images w-full bg-white border border-stone-300 focus:border-pine-700 rounded-lg px-2.5 py-1 text-xs font-mono" placeholder="assets/plants/photo1.jpg, assets/plants/photo2.jpg" oninput="editingPlantSizes[${idx}].rawImages = this.value">${escapeHtml((s.images && s.images.length > 0) ? s.images.join(', ') : (s.image || ''))}</textarea>
          </div>
        </div>
      `).join('');
    }

    function addPlantSizeRow() {
      const defaultPrice = parseInt(document.getElementById('editPlantPrice')?.value) || 550;
      const defaultPot = document.getElementById('editPlantPot')?.value || 'C2 (ЗКС)';
      const defaultHeight = document.getElementById('editPlantHeight')?.value || '40-60 см';
      const defaultStock = parseInt(document.getElementById('editPlantStock')?.value) || 20;
      const defaultImage = document.getElementById('editPlantImage')?.value || 'assets/plants/plant_smaragd.jpg';

      const nextNum = editingPlantSizes.length + 1;
      const defaultName = nextNum === 1 ? 'Маленький' : nextNum === 2 ? 'Средний' : nextNum === 3 ? 'Большой' : `Размер ${nextNum}`;

      editingPlantSizes.push({
        name: defaultName,
        price: defaultPrice,
        oldPrice: 0,
        height: defaultHeight,
        pot: defaultPot,
        stock: defaultStock,
        images: [defaultImage]
      });
      renderAdminPlantSizesList();
    }

    function removePlantSizeRow(idx) {
      editingPlantSizes.splice(idx, 1);
      renderAdminPlantSizesList();
    }

    function openAddPlantModal(editId = null) {
      const modal = document.getElementById('plantEditModal');
      const title = document.getElementById('plantEditModalTitle');
      const form = modal.querySelector('form');
      form.reset();

      if (editId) {
        const plant = PLANTS.find(p => p.id === editId);
        if (plant) {
          title.innerText = "Редактирование растения";
          document.getElementById('editPlantId').value = plant.id;
          document.getElementById('editPlantName').value = plant.name;
          document.getElementById('editPlantLatin').value = plant.latin || '';
          document.getElementById('editPlantCategory').value = plant.category;
          document.getElementById('editPlantPrice').value = plant.price;
          if (document.getElementById('editPlantStock')) {
            document.getElementById('editPlantStock').value = plant.stock !== undefined ? plant.stock : 20;
          }
          document.getElementById('editPlantPot').value = plant.pot || '';
          document.getElementById('editPlantHeight').value = plant.height || '';
          document.getElementById('editPlantFrost').value = plant.frost || '';
          document.getElementById('editPlantImage').value = plant.image;
          document.getElementById('editPlantBadge').value = plant.badge || '';
          document.getElementById('editPlantDesc').value = plant.desc || '';

          editingPlantSizes = (plant.sizes && Array.isArray(plant.sizes) && plant.sizes.length > 0) ? JSON.parse(JSON.stringify(plant.sizes)) : [];
          renderAdminPlantSizesList();
        }
      } else {
        title.innerText = "Добавление нового саженца";
        document.getElementById('editPlantId').value = '';
        if (document.getElementById('editPlantStock')) document.getElementById('editPlantStock').value = 20;
        document.getElementById('editPlantImage').value = 'assets/plants/plant_smaragd.jpg';
        editingPlantSizes = [];
        renderAdminPlantSizesList();
      }

      modal.classList.remove('hidden');
    }

    function closePlantEditModal() {
      document.getElementById('plantEditModal').classList.add('hidden');
    }

    function handleSavePlant(e) {
      e.preventDefault();
      const idVal = document.getElementById('editPlantId').value;
      const name = document.getElementById('editPlantName').value.trim();
      const latin = document.getElementById('editPlantLatin').value.trim();
      const category = document.getElementById('editPlantCategory').value;
      const price = parseInt(document.getElementById('editPlantPrice').value);
      const stock = parseInt(document.getElementById('editPlantStock')?.value) || 20;
      const pot = document.getElementById('editPlantPot').value.trim() || 'ЗКС';
      const height = document.getElementById('editPlantHeight').value.trim() || '30-40 см';
      const frost = document.getElementById('editPlantFrost').value.trim() || '-35°C';
      const image = document.getElementById('editPlantImage').value.trim() || 'assets/plants/plant_smaragd.jpg';
      const badge = document.getElementById('editPlantBadge').value.trim() || 'Питомник';
      const desc = document.getElementById('editPlantDesc').value.trim() || 'Здоровый крепкий саженец из питомника.';

      // Parse sizes
      const sizeRows = document.querySelectorAll('.plant-size-row');
      const parsedSizes = [];
      sizeRows.forEach((row, idx) => {
        const sName = row.querySelector('.size-name')?.value.trim();
        const sPrice = parseInt(row.querySelector('.size-price')?.value) || price;
        const sOldPrice = parseInt(row.querySelector('.size-oldprice')?.value) || 0;
        const sHeight = row.querySelector('.size-height')?.value.trim() || height;
        const sPot = row.querySelector('.size-pot')?.value.trim() || pot;
        const sStock = parseInt(row.querySelector('.size-stock')?.value) || stock;
        const rawImages = row.querySelector('.size-images')?.value || '';
        const images = rawImages.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);

        if (sName && sPrice > 0) {
          parsedSizes.push({
            name: sName,
            price: sPrice,
            oldPrice: sOldPrice > sPrice ? sOldPrice : 0,
            height: sHeight,
            pot: sPot,
            stock: sStock,
            images: images.length > 0 ? images : [image]
          });
        }
      });

      if (idVal) {
        const plant = PLANTS.find(p => p.id == idVal);
        if (plant) {
          Object.assign(plant, { name, latin, category, price, stock, pot, height, frost, image, badge, desc });
          if (parsedSizes.length > 0) {
            plant.sizes = parsedSizes;
            plant.price = parsedSizes[0].price;
            plant.height = parsedSizes[0].height || plant.height;
            plant.pot = parsedSizes[0].pot || plant.pot;
            plant.images = parsedSizes[0].images || plant.images;
            plant.image = (parsedSizes[0].images && parsedSizes[0].images[0]) || plant.image;
          } else {
            delete plant.sizes;
          }
        }
      } else {
        const newId = Date.now();
        const newPlant = {
          id: newId,
          name, latin, category, price, stock, pot, height, frost, image, badge, desc
        };
        if (parsedSizes.length > 0) {
          newPlant.sizes = parsedSizes;
          newPlant.price = parsedSizes[0].price;
          newPlant.height = parsedSizes[0].height || newPlant.height;
          newPlant.pot = parsedSizes[0].pot || newPlant.pot;
          newPlant.images = parsedSizes[0].images || [image];
          newPlant.image = (parsedSizes[0].images && parsedSizes[0].images[0]) || image;
        }
        PLANTS.unshift(newPlant);
      }

      savePlants();
      renderProducts();
      renderAdminPlantsTable();
      renderAdminReportsTable();
      updateSeasonHitUI();
      closePlantEditModal();
      showToast("Каталог успешно сохранён!");
    }

    function deletePlant(id) {
      const plant = PLANTS.find(p => p.id === id);
      if (!plant) return;
      openConfirmActionModal({
        title: "Удаление саженца",
        message: `Вы уверены, что хотите удалить «${plant.name}» из каталога? Товар перестанет отображаться на сайте.`,
        icon: 'trash',
        confirmText: "Удалить из каталога",
        confirmClass: "px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer",
        onConfirm: () => {
          PLANTS = PLANTS.filter(p => p.id !== id);
          savePlants();
          renderProducts();
          renderAdminPlantsTable();
          renderAdminReportsTable();
          updateSeasonHitUI();
          showToast(`Саженец «${plant.name}» удален из каталога`, "info");
        }
      });
    }

    // ==========================================
    // TAB 2: ORDERS MANAGEMENT
    // ==========================================
    let currentOrderFilter = 'all';

    const DEFAULT_ORDERS = [
      {
        id: 'ORD-1042',
        date: '20.10.2026, 14:30',
        type: 'Заказ товаров',
        name: 'Алексей (Новгород)',
        phone: '+7 (911) 602-14-55',
        delivery: 'Доставка по городу',
        items: [
          { id: 1, name: 'Туя западная «Смарагд»', price: 550, qty: 6 }
        ],
        total: 3300,
        status: 'Выполнен'
      },
      {
        id: 'ORD-1038',
        date: '19.10.2026, 17:15',
        type: 'Заказ товаров',
        name: 'Елена М.',
        phone: '+7 (921) 730-88-12',
        delivery: 'Самовывоз Лешино',
        items: [
          { id: 19, name: 'Голубика высокорослая «Блюкроп»', price: 650, qty: 4 }
        ],
        total: 2600,
        status: 'Выполнен'
      },
      {
        id: 'ORD-1035',
        date: '19.10.2026, 11:20',
        type: 'Живая изгородь',
        name: 'Михаил Дмитриевич',
        phone: '+7 (905) 290-33-40',
        delivery: 'Доставка по городу',
        items: [
          { id: 2, name: 'Туя западная «Брабант»', price: 490, qty: 10 }
        ],
        total: 4900,
        status: 'Выполнен'
      },
      {
        id: 'ORD-1045',
        date: '21.10.2026, 09:30',
        type: 'Заказ товаров',
        name: 'Дмитрий Васильев',
        phone: '+7 (960) 203-12-34',
        delivery: 'Доставка по городу (ул. Псковская, 28)',
        items: [
          { id: 1, name: 'Туя западная «Смарагд»', price: 550, qty: 4 },
          { id: 18, name: 'Голубика высокорослая «Дюк»', price: 650, qty: 2 }
        ],
        total: 3500,
        status: 'Новый'
      },
      {
        id: 'ORD-1044',
        date: '20.10.2026, 18:40',
        type: 'Консультация агронома',
        name: 'Анна Павлова',
        phone: '+7 (911) 605-77-88',
        delivery: 'Самовывоз',
        items: [
          { id: 3, name: 'Туя западная «Рейнгольд»', price: 1200, qty: 2 }
        ],
        total: 2400,
        status: 'В работе'
      }
    ];

    function getOrders() {
      try {
        const isCleared = localStorage.getItem('xvoinyimir_orders_cleared') === 'true';
        const saved = localStorage.getItem('xvoinyimir_orders');
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            if (parsed.length > 0 || isCleared) return parsed;
          }
        }
        localStorage.setItem('xvoinyimir_orders', JSON.stringify(DEFAULT_ORDERS));
        return JSON.parse(JSON.stringify(DEFAULT_ORDERS));
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_ORDERS));
      }
    }

    // ==========================================
    // CUSTOMER LOYALTY & DISCOUNT LEVELS SYSTEM
    // ==========================================
    // 0 - 4 completed purchases -> Level 0: 0% discount (Садовод-новичок)
    // 5 - 9 completed purchases -> Level 1: 5% discount (1-й уровень)
    // 10 - 14 completed purchases -> Level 2: 10% discount (2-й уровень)
    // 15+ completed purchases   -> Level 3: 15% discount (3-й уровень)

    function normalizePhoneDigits(phone) {
      if (!phone) return '';
      const digits = String(phone).replace(/\D/g, '');
      return digits.length >= 10 ? digits.slice(-10) : digits;
    }

    function isOrderCompleted(order) {
      if (!order || !order.status) return false;
      const s = String(order.status).trim().toLowerCase();
      return s === 'выполнен' || s === 'доставлен' || s === 'оплачен' || s === 'завершен' || s === 'завершён';
    }

    function getCustomerCompletedOrders(phone, allOrders = null) {
      const orders = allOrders || (typeof getOrders === 'function' ? getOrders() : []);
      const cleanPhone = normalizePhoneDigits(phone);
      const completedMap = new Map();

      orders.forEach(o => {
        if (!o || !o.id) return;
        if (!isOrderCompleted(o)) return;

        const oPhone = normalizePhoneDigits(o.phone);
        if (!cleanPhone) {
          let profilePhone = '';
          try {
            const raw = localStorage.getItem('xvoinyimir_user_profile');
            if (raw) profilePhone = normalizePhoneDigits(JSON.parse(raw).phone);
          } catch(e) {}

          if (profilePhone && oPhone && (oPhone.includes(profilePhone) || profilePhone.includes(oPhone))) {
            if (!completedMap.has(o.id)) completedMap.set(o.id, o);
          }
        } else if (oPhone && (oPhone.includes(cleanPhone) || cleanPhone.includes(oPhone))) {
          if (!completedMap.has(o.id)) completedMap.set(o.id, o);
        }
      });

      return Array.from(completedMap.values());
    }

    function calculateCustomerLoyalty(completedCount) {
      const count = Math.max(0, parseInt(completedCount, 10) || 0);

      if (count >= 15) {
        return {
          level: 3,
          levelNum: 3,
          levelName: '3-й уровень',
          discountPercent: 15,
          completedOrdersCount: count,
          nextLevelOrdersNeeded: 0,
          title: '3-й уровень (Скидка 15%)',
          badgeTitle: 'Премиум-садовод (3-й ур.)',
          shortBadge: '3-й ур. (15%)',
          description: 'Максимальная скидка постоянного клиента 15% на весь ассортимент питомника',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-400 shadow-2xs',
          iconColor: 'text-amber-600',
          isMaxLevel: true
        };
      } else if (count >= 10) {
        const needed = 15 - count;
        return {
          level: 2,
          levelNum: 2,
          levelName: '2-й уровень',
          discountPercent: 10,
          completedOrdersCount: count,
          nextLevelOrdersNeeded: needed,
          title: '2-й уровень (Скидка 10%)',
          badgeTitle: 'VIP-садовод (2-й ур.)',
          shortBadge: '2-й ур. (10%)',
          description: `Персональная скидка 10% на весь ассортимент. До 3-го уровня (15%) осталось покупок: ${needed}`,
          badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
          iconColor: 'text-sky-600',
          isMaxLevel: false
        };
      } else if (count >= 5) {
        const needed = 10 - count;
        return {
          level: 1,
          levelNum: 1,
          levelName: '1-й уровень',
          discountPercent: 5,
          completedOrdersCount: count,
          nextLevelOrdersNeeded: needed,
          title: '1-й уровень (Скидка 5%)',
          badgeTitle: 'Постоянный покупатель (1-й ур.)',
          shortBadge: '1-й ур. (5%)',
          description: `Персональная скидка 5% на весь ассортимент. До 2-го уровня (10%) осталось покупок: ${needed}`,
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          iconColor: 'text-emerald-600',
          isMaxLevel: false
        };
      } else {
        const needed = 5 - count;
        return {
          level: 0,
          levelNum: 0,
          levelName: 'Без уровня',
          discountPercent: 0,
          completedOrdersCount: count,
          nextLevelOrdersNeeded: needed,
          title: 'Садовод-новичок (без скидки)',
          badgeTitle: 'Садовод-новичок',
          shortBadge: 'Новичок (0%)',
          description: `Завершите 5 выполненных покупок для получения скидки 1-го уровня (5%). Осталось: ${needed}`,
          badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
          iconColor: 'text-stone-400',
          isMaxLevel: false
        };
      }
    }

    function getCustomerLoyalty(phone, allOrders = null) {
      const completedOrders = getCustomerCompletedOrders(phone, allOrders);
      return calculateCustomerLoyalty(completedOrders.length);
    }

    function getRussianPlural(n, one, few, many) {
      const mod10 = n % 10;
      const mod100 = n % 100;
      if (mod100 >= 11 && mod100 <= 19) return many;
      if (mod10 === 1) return one;
      if (mod10 >= 2 && mod10 <= 4) return few;
      return many;
    }

    // Helper: Smart query matcher for orders (Russian morphology, items, addresses, multi-word)
    function matchesOrderQuery(o, q) {
      if (!q) return true;
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      const itemsStr = o.items ? o.items.map(i => `${i.name || ''} ${i.qty || ''} шт`).join(' ') : (o.interest || '');
      const textCorpus = [
        o.id || '',
        o.name || '',
        o.phone || '',
        o.delivery || '',
        o.status || '',
        o.type || '',
        o.date || '',
        itemsStr,
        o.total ? `${o.total} руб` : '',
        o.status === 'Выполнен' ? 'выполнен выполненные выполнено завершен завершенные' : '',
        o.status === 'Новый' ? 'новый новые новенькие' : '',
        o.status === 'В работе' ? 'в работе работа обрабатывается' : '',
        o.status === 'Отменен' ? 'отменен отмененные отмена' : ''
      ].join(' ').toLowerCase();

      return terms.every(term => textCorpus.includes(term));
    }

    function toggleOrderSearchClear() {
      const val = (document.getElementById('adminOrderSearch')?.value || '').trim();
      const btn = document.getElementById('clearOrderSearchBtn');
      if (btn) {
        if (val.length > 0) btn.classList.remove('hidden');
        else btn.classList.add('hidden');
      }
    }

    function clearOrderSearch() {
      const input = document.getElementById('adminOrderSearch');
      if (input) {
        input.value = '';
        input.focus();
      }
      toggleOrderSearchClear();
      renderAdminOrdersTable();
    }

    function resetOrderSearchAndFilter() {
      const input = document.getElementById('adminOrderSearch');
      if (input) input.value = '';
      toggleOrderSearchClear();
      filterAdminOrdersByStatus('all');
      showToast("Показаны все заказы");
    }

    function openClearOrdersModal() {
      openConfirmActionModal({
        title: 'Очистить журнал заказов?',
        message: 'Вы уверены, что хотите полностью очистить весь журнал заказов? Все существующие заявки будут удалены. Вы всегда сможете восстановить демо-заказы кнопкой «Сброс / Восстановить демо».',
        confirmText: 'Да, очистить заказы',
        icon: 'box',
        confirmClass: 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-xs',
        onConfirm: performClearOrders
      });
    }

    function clearAllOrders() {
      openClearOrdersModal();
    }

    function performClearOrders() {
      try {
        localStorage.setItem('xvoinyimir_orders', JSON.stringify([]));
        localStorage.setItem('xvoinyimir_orders_cleared', 'true');
      } catch (e) {}

      const sInput = document.getElementById('adminOrderSearch');
      if (sInput) sInput.value = '';
      toggleOrderSearchClear();
      currentOrderFilter = 'all';
      const filterMap = {
        'all': 'orderFilterBtn_all',
        'Новый': 'orderFilterBtn_new',
        'В работе': 'orderFilterBtn_work',
        'Выполнен': 'orderFilterBtn_done'
      };
      Object.keys(filterMap).forEach(key => {
        const btn = document.getElementById(filterMap[key]);
        if (!btn) return;
        if (key === 'all') {
          btn.className = "order-filter-pill px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-pine-800 bg-pine-800 text-white cursor-pointer transition-all";
        } else {
          btn.className = "order-filter-pill px-3 py-1.5 rounded-xl text-xs font-semibold border-2 border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer transition-all";
        }
      });

      renderAdminOrdersTable();
      showToast("Журнал заказов успешно очищен");
    }

    function saveOrderToAdmin(orderData) {
      const orders = getOrders();
      const existingIdx = orders.findIndex(o => o.id === orderData.id);
      if (existingIdx >= 0) {
        orders[existingIdx] = orderData;
      } else {
        orders.unshift(orderData);
      }
      localStorage.setItem('xvoinyimir_orders', JSON.stringify(orders));
      try {
        localStorage.removeItem('xvoinyimir_orders_cleared');
      } catch(e) {}
      const badge = document.getElementById('adminOrderCountBadge');
      if (badge) badge.innerText = orders.length;

      // AUTOMATICALLY BROADCAST EVERY ORDER TO CLOUD:
      if (typeof broadcastOrderToCloud === 'function') {
        broadcastOrderToCloud(orderData);
      }
    }

    function filterAdminOrdersByStatus(status) {
      currentOrderFilter = status;
      const filterMap = {
        'all': 'orderFilterBtn_all',
        'Новый': 'orderFilterBtn_new',
        'В работе': 'orderFilterBtn_work',
        'Выполнен': 'orderFilterBtn_done'
      };

      Object.keys(filterMap).forEach(key => {
        const btn = document.getElementById(filterMap[key]);
        if (!btn) return;
        if (key === status) {
          btn.className = "order-filter-pill px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-pine-800 bg-pine-800 text-white cursor-pointer transition-all";
        } else {
          btn.className = "order-filter-pill px-3 py-1.5 rounded-xl text-xs font-semibold border-2 border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer transition-all";
        }
      });

      renderAdminOrdersTable();
    }

    function renderAdminOrdersTable() {
      const tbody = document.getElementById('adminOrdersTableBody');
      const orders = getOrders();
      const search = (document.getElementById('adminOrderSearch')?.value || '').toLowerCase().trim();
      tbody.innerHTML = '';

      const countBadge = document.getElementById('adminOrderCountBadge');
      if (countBadge) countBadge.innerText = orders.length;

      // KPI Stats
      const totalCount = orders.length;
      const newCount = orders.filter(o => o.status === 'Новый').length;
      const workCount = orders.filter(o => o.status === 'В работе').length;
      const doneCount = orders.filter(o => o.status === 'Выполнен').length;
      const rev = orders.reduce((sum, o) => sum + (o.total || 0), 0);

      document.getElementById('statTotalOrders').innerText = totalCount;
      document.getElementById('statNewOrders').innerText = newCount;
      const workEl = document.getElementById('statWorkOrders');
      if (workEl) workEl.innerText = workCount;
      document.getElementById('statTotalRevenue').innerText = `${rev.toLocaleString()} ₽`;

      // Filter Pill Badges
      const countAll = document.getElementById('countOrdersAll');
      const countNew = document.getElementById('countOrdersNew');
      const countWork = document.getElementById('countOrdersWork');
      const countDone = document.getElementById('countOrdersDone');
      if (countAll) countAll.innerText = totalCount;
      if (countNew) countNew.innerText = newCount;
      if (countWork) countWork.innerText = workCount;
      if (countDone) countDone.innerText = doneCount;

      const filtered = orders.filter(o => {
        const matchStatus = currentOrderFilter === 'all' || o.status === currentOrderFilter;
        return matchStatus && matchesOrderQuery(o, search);
      });

      if (filtered.length === 0) {
        if (orders.length > 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="9" class="text-center py-10 px-4">
                <div class="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
                  <div class="w-12 h-12 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>
                  <div class="font-bold text-stone-800 text-sm">По текущему фильтру заказов не найдено</div>
                  <div class="text-xs text-stone-500">
                    ${search ? `По запросу «<span class="font-semibold text-pine-900">${escapeHtml(search)}</span>» ничего не найдено.` : 'В выбранном статусе пока нет заказов.'}
                    Всего в журнале: <strong class="text-stone-700">${orders.length}</strong> заказов.
                  </div>
                  <button onclick="resetOrderSearchAndFilter()" class="mt-3 px-4 py-2 rounded-xl bg-pine-800 hover:bg-pine-700 active:scale-95 text-white font-bold text-xs transition-all shadow-xs border-2 border-pine-900 cursor-pointer flex items-center gap-1.5">
                    <span>↺</span> Сбросить фильтр и показать все заказы (${orders.length})
                  </button>
                </div>
              </td>
            </tr>
          `;
        } else {
          tbody.innerHTML = `
            <tr>
              <td colspan="9" class="text-center py-10 px-4">
                <div class="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
                  <div class="w-12 h-12 rounded-2xl bg-stone-100 border-2 border-stone-200 flex items-center justify-center text-stone-600 shadow-2xs"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></div>
                  <div class="font-bold text-stone-800 text-sm">Журнал заказов пуст</div>
                  <div class="text-xs text-stone-500 text-center">
                    Новые заявки с сайта, звонков или корзины появятся здесь автоматически.
                  </div>
                  <button onclick="restoreDemoReports()" class="mt-3 px-3.5 py-2 rounded-xl border-2 border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-all cursor-pointer">
                    <span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg> <span>Восстановить демо-заказы</span></span>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }
        return;
      }

      filtered.forEach(o => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-stone-50 transition-colors";
        
        let itemsHtml = '';
        if (o.items && o.items.length) {
          itemsHtml = o.items.map(i => `${escapeHtml(i.name)} (${Number(i.qty) || 1} шт.)`).join(', ');
        } else if (o.interest) {
          itemsHtml = `Тема: ${escapeHtml(o.interest)}`;
        }

        const safeOrderId = escapeHtml(o.id || '');
        const cleanPhone = (o.phone || '').replace(/\D/g, '');
        const waMsg = encodeURIComponent(`Здравствуйте, ${o.name || 'клиент'}! Питомник «Хвойный мир» по поводу вашего заказа ${o.id || ''}.`);
        const customerLoyalty = getCustomerLoyalty(o.phone, orders);

        tr.innerHTML = `
          <td class="py-3 px-3.5 font-mono font-bold text-pine-950 align-top">
            <span class="text-xs">${safeOrderId || '#'}</span><br>
            <span class="text-[10px] text-stone-400 font-normal block leading-tight mt-0.5">${escapeHtml(o.date || '')}</span>
            <span class="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${o.type === 'Консультация' ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-stone-100 text-stone-700 border border-stone-200'}">
              ${escapeHtml(o.type || 'Заказ')}
            </span>
          </td>
          <td class="py-3 px-3.5 align-top">
            <div class="font-bold text-stone-900 leading-tight">${escapeHtml(o.name || '—')}</div>
            <a href="tel:${cleanPhone}" class="text-pine-800 hover:underline font-bold text-xs block mt-0.5">${escapeHtml(o.phone || '—')}</a>
            <div class="mt-1 flex items-center gap-1.5 flex-wrap">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${customerLoyalty.badgeClass}" title="Фактически завершённых покупок: ${customerLoyalty.completedOrdersCount}">
                ${customerLoyalty.shortBadge}
              </span>
              ${cleanPhone ? `<a href="https://wa.me/${cleanPhone}?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:underline font-semibold"><svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg><span>Написать</span></a>` : ''}
            </div>
          </td>
          <td class="py-3 px-3.5 text-xs text-stone-600 align-top">
            <div class="font-medium text-stone-800 line-clamp-2" title="${itemsHtml}">${itemsHtml}</div>
            <div class="text-[11px] text-stone-400 truncate mt-1" title="${escapeHtml(o.delivery || '')}">${SVG_ICONS.pin} ${escapeHtml(o.delivery || 'Самовывоз')}</div>
          </td>
          <td class="py-3 px-3.5 font-black text-pine-950 whitespace-nowrap align-top">
            <span class="text-sm">${o.total ? Number(o.total).toLocaleString('ru-RU') + ' ₽' : '—'}</span>
          </td>
          <td class="py-3 px-3.5 align-top">
            <select onchange="updateOrderStatus('${safeOrderId}', this.value)" class="text-xs bg-stone-50 hover:bg-white border-2 border-stone-200 rounded-xl px-2 py-1.5 font-bold focus:outline-none focus:border-pine-700 cursor-pointer w-full">
              <option value="Новый" ${o.status === 'Новый' ? 'selected' : ''}>Новый</option>
              <option value="В работе" ${o.status === 'В работе' ? 'selected' : ''}>В работе</option>
              <option value="В пути" ${o.status === 'В пути' ? 'selected' : ''}>В пути (доставка)</option>
              <option value="Выполнен" ${o.status === 'Выполнен' ? 'selected' : ''}>Выполнен</option>
              <option value="Отменен" ${o.status === 'Отменен' ? 'selected' : ''}>Отменен</option>
            </select>
          </td>
          <td class="py-3 px-3.5 text-right whitespace-nowrap align-top">
            <div class="flex items-center justify-end gap-1">
              <button onclick="openOrderDetailModal('${safeOrderId}')" class="p-1.5 text-stone-600 hover:text-pine-800 border-2 border-stone-200 hover:border-pine-400 rounded-xl bg-stone-50 hover:bg-white cursor-pointer shadow-2xs flex items-center justify-center" title="Открыть карточку заказа">
                ${SVG_ICONS.eye}
              </button>
              <button onclick="deleteOrder('${safeOrderId}')" class="p-1.5 text-stone-400 hover:text-rose-600 border-2 border-stone-200 hover:border-rose-300 rounded-xl bg-stone-50 hover:bg-white cursor-pointer shadow-2xs flex items-center justify-center" title="Удалить заявку">
                ${SVG_ICONS.trash}
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function updateOrderStatus(id, newStatus) {
      const orders = getOrders();
      const order = orders.find(o => o.id === id);
      if (order) {
        order.status = newStatus;
        localStorage.setItem('xvoinyimir_orders', JSON.stringify(orders));

        // Broadcast status update directly to the cloud broker so customer's phone updates in real time!
        if (typeof broadcastOrderToCloud === 'function') {
          broadcastOrderToCloud(order);
        }

        if (newStatus === 'Выполнен') {
          try {
            const raw = localStorage.getItem('xvoinyimir_cleared_order_ids');
            if (raw) {
              let cids = JSON.parse(raw);
              if (Array.isArray(cids)) {
                cids = cids.filter(cid => cid !== id);
                localStorage.setItem('xvoinyimir_cleared_order_ids', JSON.stringify(cids));
              }
            }
          } catch(e) {}
        }
        
        // Immediate bidirectional sync with reports & sales journal
        if (typeof syncCompletedOrdersToReports === 'function') {
          syncCompletedOrdersToReports();
        }
        
        renderAdminOrdersTable();
        if (typeof renderAdminReportsTable === 'function') {
          renderAdminReportsTable();
        }

        if (document.getElementById('userProfileModal') && !document.getElementById('userProfileModal').classList.contains('hidden')) {
          renderProfileOrders();
        }

        // Real-time update of order detail modal if open
        if (typeof activeDetailOrderId !== 'undefined' && activeDetailOrderId === id) {
          const detailLoyaltyBadge = document.getElementById('orderDetailLoyaltyBadge');
          if (detailLoyaltyBadge) {
            const updatedLoyalty = getCustomerLoyalty(order.phone, orders);
            detailLoyaltyBadge.className = `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${updatedLoyalty.badgeClass}`;
            detailLoyaltyBadge.innerHTML = `<span>${updatedLoyalty.title}</span><span class="opacity-70 text-[11px]">(${updatedLoyalty.completedOrdersCount} ${getRussianPlural(updatedLoyalty.completedOrdersCount, 'завершённая покупка', 'завершённые покупки', 'завершённых покупок')})</span>`;
          }
        }

        if (newStatus === 'Выполнен') {
          showToast(`Заказ ${order.id} выполнен и занесён в отчётность!`, 'success');
        } else {
          showToast(`Статус заказа ${order.id} изменен на «${newStatus}» и передан клиенту!`, 'info');
        }
      }
    }

    function deleteOrder(id) {
      openConfirmActionModal({
        title: 'Удалить заявку?',
        message: `Удалить заказ ${id} из журнала заказов?`,
        confirmText: 'Удалить',
        icon: 'trash',
        confirmClass: 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-xs',
        onConfirm: () => {
          let orders = getOrders();
          orders = orders.filter(o => o.id !== id);
          localStorage.setItem('xvoinyimir_orders', JSON.stringify(orders));
          renderAdminOrdersTable();
          if (document.getElementById('userProfileModal') && !document.getElementById('userProfileModal').classList.contains('hidden')) {
            renderProfileOrders();
          }
          showToast(`Заказ ${id} удалён`);
        }
      });
    }

    function clearAllOrders() {
      openClearOrdersModal();
    }

    function exportOrdersCSV() {
      const orders = getOrders();
      if (orders.length === 0) {
        showToast("Журнал заказов пока пуст.", "info");
        return;
      }

      const headers = ["№ Заказа", "Дата", "Тип", "Покупатель", "Телефон", "Доставка/Адрес", "Состав заказа", "Сумма (₽)", "Статус"];
      const rows = orders.map(o => {
        const itemsStr = o.items ? o.items.map(i => `${i.name} (${i.qty} шт.)`).join('; ') : (o.interest || '');
        return [
          `"${o.id || ''}"`,
          `"${o.date || ''}"`,
          `"${o.type || ''}"`,
          `"${(o.name || '').replace(/"/g, '""')}"`,
          `"${o.phone || ''}"`,
          `"${(o.delivery || '').replace(/"/g, '""')}"`,
          `"${itemsStr.replace(/"/g, '""')}"`,
          `"${o.total || 0}"`,
          `"${o.status || ''}"`
        ].join(';');
      });

      const csvContent = "\uFEFF" + [headers.join(';'), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `xvoinyimir_orders_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    // ==========================================
    // ORDER DETAILS MODAL
    // ==========================================
    let activeDetailOrderId = null;

    function openOrderDetailModal(orderId) {
      const orders = getOrders();
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      activeDetailOrderId = orderId;

      document.getElementById('orderDetailId').innerText = order.id || '#';
      document.getElementById('orderDetailDate').innerText = `Оформлен: ${order.date || ''}`;

      const statusBadge = document.getElementById('orderDetailStatusBadge');
      statusBadge.innerText = order.status;
      if (order.status === 'Новый') statusBadge.className = "text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300";
      else if (order.status === 'В работе') statusBadge.className = "text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300";
      else if (order.status === 'Выполнен') statusBadge.className = "text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300";
      else statusBadge.className = "text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300";

      document.getElementById('orderDetailName').innerText = order.name || 'Не указано';
      
      const cleanPhone = (order.phone || '').replace(/\D/g, '');
      const phoneLink = document.getElementById('orderDetailPhoneLink');
      phoneLink.innerText = order.phone || 'Не указан';
      phoneLink.href = cleanPhone ? `tel:+${cleanPhone}` : '#';

      const waLink = document.getElementById('orderDetailWaLink');
      const waMsg = encodeURIComponent(`Здравствуйте, ${order.name || 'клиент'}! Питомник «Хвойный мир» по поводу вашего заказа ${order.id}.`);
      waLink.href = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waMsg}` : '#';

      document.getElementById('orderDetailDelivery').innerText = order.delivery || 'Самовывоз';
      document.getElementById('orderDetailTotal').innerText = `${(order.total || 0).toLocaleString()} ₽`;
      document.getElementById('orderDetailStatusSelect').value = order.status || 'Новый';

      // Customer Loyalty Badge in Admin Order Detail
      const customerLoyalty = getCustomerLoyalty(order.phone, orders);
      const loyaltyBadge = document.getElementById('orderDetailLoyaltyBadge');
      if (loyaltyBadge) {
        loyaltyBadge.className = `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${customerLoyalty.badgeClass}`;
        loyaltyBadge.innerHTML = `<span>${customerLoyalty.title}</span><span class="opacity-70 text-[11px]">(${customerLoyalty.completedOrdersCount} ${getRussianPlural(customerLoyalty.completedOrdersCount, 'завершённая покупка', 'завершённые покупки', 'завершённых покупок')})</span>`;
      }

      const itemsBody = document.getElementById('orderDetailItemsBody');
      itemsBody.innerHTML = '';
      if (order.items && order.items.length) {
        order.items.forEach(it => {
          const row = document.createElement('tr');
          row.className = "hover:bg-stone-50";
          row.innerHTML = `
            <td class="py-2.5 px-3 font-semibold text-stone-900 flex items-center gap-2">
              <img src="${escapeHtml(it.image || 'assets/vk_avatar.jpg')}" class="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0" alt="${escapeHtml(it.name || 'Товар')}">
              <span class="truncate max-w-xs">${escapeHtml(it.name || 'Товар')}</span>
            </td>
            <td class="py-2.5 px-3 text-center font-bold text-stone-700">${Number(it.qty) || 1} шт.</td>
            <td class="py-2.5 px-3 text-right text-stone-600">${Number(it.price) || 0} ₽</td>
            <td class="py-2.5 px-3 text-right font-black text-pine-900">${((Number(it.price) || 0) * (Number(it.qty) || 1)).toLocaleString('ru-RU')} ₽</td>
          `;
          itemsBody.appendChild(row);
        });
      } else {
        itemsBody.innerHTML = `<tr><td colspan="4" class="py-3 px-3 text-stone-500">${order.interest ? 'Тема обращения: ' + escapeHtml(order.interest) : 'Консультация по подбору саженцев'}</td></tr>`;
      }

      document.getElementById('orderDetailModal').classList.remove('hidden');
    }

    function updateOrderDetailStatus(newStatus) {
      if (!activeDetailOrderId) return;
      updateOrderStatus(activeDetailOrderId, newStatus);
      openOrderDetailModal(activeDetailOrderId);
    }

    function closeOrderDetailModal() {
      document.getElementById('orderDetailModal').classList.add('hidden');
      activeDetailOrderId = null;
    }

    // ==========================================
    // TAB 3: SETTINGS & BACKUP/RESTORE
    // ==========================================
    function saveAdminPassword() {
      const newPw = document.getElementById('newAdminPassword').value.trim();
      if (!newPw) return;
      localStorage.setItem('xvoinyimir_admin_pw', newPw);
      document.getElementById('newAdminPassword').value = '';
      const alertEl = document.getElementById('passwordSaveAlert');
      alertEl.classList.remove('hidden');
      setTimeout(() => alertEl.classList.add('hidden'), 3000);
    }

    function resetToDefaultCatalog() {
      openConfirmActionModal({
        title: "Сброс каталога к заводским",
        message: "Сбросить весь каталог к изначальным 25 сортам саженцев питомника? Ваши изменения цен и добавленные позиции будут обновлены.",
        icon: 'refresh',
        confirmText: "Сбросить каталог",
        confirmClass: "px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer",
        onConfirm: () => {
          PLANTS = JSON.parse(JSON.stringify(DEFAULT_PLANTS));
          savePlants();
          renderProducts();
          renderAdminPlantsTable();
          updateSeasonHitUI();
          showToast('Каталог успешно синхронизирован с ассортиментом питомника (25 сортов)!', 'success');
        }
      });
    }

    function exportCatalogJSON() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PLANTS, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "xvoinyimir_catalog.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Файл каталога экспортирован (JSON)', 'info');
    }

    function importCatalogJSON(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
            PLANTS = imported;
            savePlants();
            renderProducts();
            renderAdminPlantsTable();
            updateSeasonHitUI();
            showToast('Каталог успешно импортирован!', 'success');
          } else {
            showToast('Ошибка: файл не содержит массив растений.', 'error');
          }
        } catch (err) {
          showToast('Ошибка чтения JSON: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    }

    function exportFullBackupJSON() {
      const backup = {
        version: "2.0",
        exportDate: new Date().toISOString(),
        plants: PLANTS,
        orders: getOrders(),
        settings: siteSettings
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `xvoinyimir_full_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Полный бэкап сохранен на ваше устройство!', 'info');
    }

    function importFullBackupJSON(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const backup = JSON.parse(e.target.result);
          if (backup.plants && Array.isArray(backup.plants)) {
            PLANTS = backup.plants;
            savePlants();
          }
          if (backup.orders && Array.isArray(backup.orders)) {
            localStorage.setItem('xvoinyimir_orders', JSON.stringify(backup.orders));
          }
          if (backup.settings) {
            siteSettings = { ...DEFAULT_SETTINGS, ...backup.settings };
            localStorage.setItem('xvoinyimir_settings', JSON.stringify(siteSettings));
          }
          applySiteSettings();
          renderProducts();
          renderAdminPlantsTable();
          renderAdminOrdersTable();
          showToast("Полный бэкап сайта успешно восстановлен!", "success");
        } catch (err) {
          showToast("Ошибка восстановления бэкапа: " + err.message, "error");
        }
      };
      reader.readAsText(file);
    }

    // ==========================================
    // FULLSCREEN LIGHTBOX & TOUCH SWIPE GALLERY
    // ==========================================
    let currentGalleryPlant = null;
    let currentGalleryPhotoIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    let currentGalleryCustomImages = null;

    function openPlantGallery(plantId, photoIndex = 0, customImages = null) {
      const plant = PLANTS.find(p => p.id === plantId);
      if (!plant) return;
      currentGalleryPlant = plant;
      currentGalleryCustomImages = (customImages && customImages.length > 0) ? customImages : null;
      const images = getGalleryImages();
      currentGalleryPhotoIndex = Math.max(0, Math.min(photoIndex, images.length - 1));
      
      updateGalleryUI();

      const modal = document.getElementById('plantGalleryModal');
      if (modal) modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function openPlantGalleryFromDetail() {
      if (currentDetailPlant) {
        const activeImages = getActiveDetailImages();
        openPlantGallery(currentDetailPlant.id, currentDetailPhotoIndex || 0, activeImages);
      }
    }

    function getGalleryImages() {
      if (currentGalleryCustomImages && currentGalleryCustomImages.length > 0) {
        return currentGalleryCustomImages;
      }
      if (currentGalleryPlant) {
        return (currentGalleryPlant.images && currentGalleryPlant.images.length > 0) ? currentGalleryPlant.images : [currentGalleryPlant.image];
      }
      return [];
    }

    function closePlantGallery() {
      const modal = document.getElementById('plantGalleryModal');
      if (modal) modal.classList.add('hidden');
      if (!document.getElementById('plantDetailModal') || document.getElementById('plantDetailModal').classList.contains('hidden')) {
        document.body.style.overflow = '';
      }
      currentGalleryPlant = null;
      currentGalleryCustomImages = null;
    }

    function nextGalleryPhoto() {
      if (!currentGalleryPlant) return;
      const images = getGalleryImages();
      currentGalleryPhotoIndex = (currentGalleryPhotoIndex + 1) % images.length;
      updateGalleryUI();
    }

    function prevGalleryPhoto() {
      if (!currentGalleryPlant) return;
      const images = getGalleryImages();
      currentGalleryPhotoIndex = (currentGalleryPhotoIndex - 1 + images.length) % images.length;
      updateGalleryUI();
    }

    function setGalleryPhoto(idx) {
      currentGalleryPhotoIndex = idx;
      updateGalleryUI();
    }

    function updateGalleryUI() {
      if (!currentGalleryPlant) return;
      const images = getGalleryImages();
      const currentUrl = images[currentGalleryPhotoIndex] || currentGalleryPlant.image;

      const imgEl = document.getElementById('galleryMainImg');
      if (imgEl) {
        imgEl.src = currentUrl;
        imgEl.alt = currentGalleryPlant.name;
      }

      const nameEl = document.getElementById('galleryPlantName');
      if (nameEl) {
        const sizeName = (currentDetailPlant && currentDetailPlant.id === currentGalleryPlant.id && currentDetailPlant.sizes && currentDetailSizeIndex >= 0) ? ` (${currentDetailPlant.sizes[currentDetailSizeIndex].name})` : '';
        nameEl.innerText = currentGalleryPlant.name + sizeName;
      }

      const counterEl = document.getElementById('galleryPhotoCounter');
      if (counterEl) counterEl.innerText = `Фото ${currentGalleryPhotoIndex + 1} из ${images.length} • Свайпайте влево/вправо`;

      const priceEl = document.getElementById('galleryPlantPrice');
      if (priceEl) {
        const price = (currentDetailPlant && currentDetailPlant.id === currentGalleryPlant.id && currentDetailPlant.sizes && currentDetailSizeIndex >= 0) ? currentDetailPlant.sizes[currentDetailSizeIndex].price : currentGalleryPlant.price;
        priceEl.innerText = `${price} ₽`;
      }

      const thumbsEl = document.getElementById('galleryThumbnails');
      if (thumbsEl) {
        thumbsEl.innerHTML = images.map((img, i) => `
          <button onclick="setGalleryPhoto(${i})" class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 ${i === currentGalleryPhotoIndex ? 'border-emerald-400 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'} transition-all shrink-0 cursor-pointer">
            <img src="${img}" class="w-full h-full object-cover">
          </button>
        `).join('');
      }
    }

    function addGalleryPlantToCart() {
      if (currentGalleryPlant) {
        addToCart(currentGalleryPlant.id);
        showToast(`«${currentGalleryPlant.name}» добавлен в корзину!`);
      }
    }

    // Touch Swipe Event Listeners for Lightbox
    const galleryStage = document.getElementById('galleryStage');
    if (galleryStage) {
      galleryStage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      galleryStage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleGallerySwipe();
      }, { passive: true });
    }

    function handleGallerySwipe() {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          nextGalleryPhoto(); // Swiped left -> next
        } else {
          prevGalleryPhoto(); // Swiped right -> prev
        }
      } else if (deltaY > 70 && Math.abs(deltaY) > Math.abs(deltaX)) {
        closePlantGallery(); // Swiped down -> close
      }
    }

    // Detail Modal Thumbnails
    let currentDetailPhotoIndex = 0;
    function renderDetailThumbnails(plant, customImages = null) {
      const thumbsContainer = document.getElementById('detailThumbnailsRow');
      if (!thumbsContainer) return;
      const images = (customImages && customImages.length > 0) ? customImages : getActiveDetailImages();
      if (images.length <= 1) {
        thumbsContainer.innerHTML = '';
        return;
      }
      thumbsContainer.innerHTML = images.map((img, idx) => `
        <button type="button" onclick="switchDetailPhoto(${idx})" class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border-2 ${idx === currentDetailPhotoIndex ? 'border-pine-400 shadow-md scale-105' : 'border-white/70 opacity-70 hover:opacity-100'} transition-all shrink-0 cursor-pointer bg-white/40 backdrop-blur-xs">
          <img src="${img}" class="w-full h-full object-cover">
        </button>
      `).join('');
    }

    function switchDetailPhoto(idx) {
      if (!currentDetailPlant) return;
      const images = getActiveDetailImages();
      currentDetailPhotoIndex = idx;
      const img = document.getElementById('detailPlantImage');
      if (img && images[idx]) {
        img.src = images[idx];
      }
      renderDetailThumbnails(currentDetailPlant, images);
    }

    // ==========================================
    // CUSTOMER PROFILE & ORDER HISTORY TRACKING
    // ==========================================
    function openUserProfile() {
      loadUserProfileData();
      renderProfileOrders();
      const modal = document.getElementById('userProfileModal');
      if (modal) modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      const phoneInput = document.getElementById('profilePhoneInput');
      if (phoneInput && !phoneInput.dataset.maskBound) {
        initPhoneMask(phoneInput);
        phoneInput.dataset.maskBound = 'true';
      }
    }

    function closeUserProfile() {
      const modal = document.getElementById('userProfileModal');
      if (modal) modal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    function loadUserProfileData() {
      try {
        const saved = localStorage.getItem('xvoinyimir_user_profile');
        if (saved) {
          const profile = JSON.parse(saved);
          if (profile.phone) document.getElementById('profilePhoneInput').value = profile.phone;
          if (profile.name) document.getElementById('profileNameInput').value = profile.name;
          if (profile.address) document.getElementById('profileAddressInput').value = profile.address;
        } else {
          // Pre-populate with last checkout input if available
          const lastPhone = document.getElementById('orderPhone')?.value;
          const lastName = document.getElementById('orderName')?.value;
          const lastAddress = document.getElementById('orderAddress')?.value;
          if (lastPhone) document.getElementById('profilePhoneInput').value = lastPhone;
          if (lastName) document.getElementById('profileNameInput').value = lastName;
          if (lastAddress) document.getElementById('profileAddressInput').value = lastAddress;
        }
      } catch(e) {}
    }

    function saveUserProfile() {
      const phone = document.getElementById('profilePhoneInput').value.trim();
      const name = document.getElementById('profileNameInput').value.trim();
      const address = document.getElementById('profileAddressInput').value.trim();

      const profileData = { phone, name, address };
      try {
        localStorage.setItem('xvoinyimir_user_profile', JSON.stringify(profileData));
        const notice = document.getElementById('profileSaveNotice');
        if (notice) {
          notice.classList.remove('hidden');
          setTimeout(() => notice.classList.add('hidden'), 3000);
        }
        showToast('Данные профиля успешно сохранены!', 'success');
        renderProfileOrders();
      } catch(e) {}
    }

    function renderProfileOrders() {
      const listEl = document.getElementById('profileOrdersList');
      if (!listEl) return;

      const profilePhone = (document.getElementById('profilePhoneInput')?.value || '').replace(/\D/g, '');
      const allOrders = getOrders();

      // Match orders by phone or if no phone specified, show local device orders
      let customerOrders = allOrders;
      if (profilePhone.length >= 7) {
        customerOrders = allOrders.filter(o => {
          const orderPhoneDigits = (o.phone || '').replace(/\D/g, '');
          return orderPhoneDigits.includes(profilePhone) || profilePhone.includes(orderPhoneDigits);
        });
      }

      // Calculate loyalty strictly based on unique completed orders
      const completedOrders = getCustomerCompletedOrders(profilePhone, allOrders);
      const loyalty = calculateCustomerLoyalty(completedOrders.length);

      // Update badge and loyalty level
      const countBadge = document.getElementById('profileOrdersCountBadge');
      if (countBadge) {
        countBadge.innerText = `${loyalty.completedOrdersCount} ${getRussianPlural(loyalty.completedOrdersCount, 'покупка', 'покупки', 'покупок')}`;
        countBadge.title = `Фактически завершённых покупок: ${loyalty.completedOrdersCount} (из ${customerOrders.length} всех созданных заявок)`;
      }

      const loyaltyLevelEl = document.getElementById('profileLoyaltyLevel');
      const loyaltyDescEl = document.getElementById('profileLoyaltyDesc');
      if (loyaltyLevelEl) {
        loyaltyLevelEl.innerText = loyalty.title;
        loyaltyLevelEl.className = `text-xs font-bold uppercase tracking-wide ${loyalty.level >= 1 ? 'text-emerald-900' : 'text-stone-700'}`;
      }
      if (loyaltyDescEl) {
        loyaltyDescEl.innerText = loyalty.description;
      }

      // Update tiers pill highlights
      const t1 = document.getElementById('loyaltyTierPill1');
      const t2 = document.getElementById('loyaltyTierPill2');
      const t3 = document.getElementById('loyaltyTierPill3');
      if (t1) t1.className = `py-1 px-1.5 rounded-lg border text-center transition-all ${loyalty.level === 1 ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs font-extrabold' : loyalty.level > 1 ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' : 'bg-white text-stone-500 border-stone-200'}`;
      if (t2) t2.className = `py-1 px-1.5 rounded-lg border text-center transition-all ${loyalty.level === 2 ? 'bg-sky-600 text-white border-sky-700 shadow-2xs font-extrabold' : loyalty.level > 2 ? 'bg-sky-100 text-sky-900 border-sky-300 font-bold' : 'bg-white text-stone-500 border-stone-200'}`;
      if (t3) t3.className = `py-1 px-1.5 rounded-lg border text-center transition-all ${loyalty.level === 3 ? 'bg-amber-600 text-white border-amber-700 shadow-2xs font-extrabold' : 'bg-white text-stone-500 border-stone-200'}`;

      if (customerOrders.length === 0) {
        listEl.innerHTML = `
          <div class="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <div class="w-12 h-12 mx-auto mb-2 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12c0-3.5 2.5-6 7-6-1 4-3.5 6-7 6z"/><path d="M12 15c0-2.5-2-4.5-5.5-4.5.5 3 2.5 4.5 5.5 4.5z"/></svg>
            </div>
            <h5 class="font-bold text-stone-800 text-sm">У вас пока нет оформленных заказов</h5>
            <p class="text-xs text-stone-500 mt-1 max-w-sm mx-auto">Выберите саженцы в каталоге, и статус вашего заказа появится здесь для отслеживания в реальном времени</p>
            <button onclick="closeUserProfile(); document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });" class="mt-3 px-4 py-2 bg-pine-800 hover:bg-pine-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs">
              Перейти к каталогу саженцев →
            </button>
          </div>
        `;
        return;
      }

      listEl.innerHTML = customerOrders.map(order => {
        // Status definition
        let statusStep = 1;
        let statusColor = 'bg-amber-100 text-amber-900 border-amber-300';
        const st = (order.status || '').toLowerCase();
        if (st.includes('выполнен') || st.includes('доставлен')) {
          statusStep = 4;
          statusColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
        } else if (st.includes('пути') || st.includes('готов')) {
          statusStep = 3;
          statusColor = 'bg-sky-100 text-sky-900 border-sky-300';
        } else if (st.includes('работе') || st.includes('собирается') || st.includes('подтвержден')) {
          statusStep = 2;
          statusColor = 'bg-blue-100 text-blue-900 border-blue-300';
        }

        const items = order.items || [];
        const itemsListHtml = items.map(i => `
          <div class="flex justify-between items-center text-xs py-1 border-b border-stone-100 last:border-0">
            <span class="truncate text-stone-800">• ${escapeHtml(i.name)} <strong class="text-pine-900 font-bold">× ${Number(i.qty) || 1} шт.</strong></span>
            <span class="font-bold text-stone-900 ml-2 whitespace-nowrap">${((Number(i.price) || 0) * (Number(i.qty) || 1)).toLocaleString('ru-RU')} ₽</span>
          </div>
        `).join('');

        return `
          <div class="bg-white rounded-2xl border-2 border-pine-200/90 p-4 shadow-sm hover:shadow-md transition-all space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-stone-100 gap-2">
              <div>
                <span class="font-mono font-bold text-pine-900 text-sm">#${escapeHtml(order.id)}</span>
                <span class="text-[11px] text-stone-400 block sm:inline sm:ml-2">${escapeHtml(order.date || '')}</span>
              </div>
              <span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColor} whitespace-nowrap">
                ${escapeHtml(order.status || 'Принят')}
              </span>
            </div>

            <!-- Visual Progress Stepper -->
            <div class="py-1">
              <div class="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold text-stone-500 mb-1">
                <span class="${statusStep >= 1 ? 'text-pine-900 font-bold' : ''}">Принят</span>
                <span class="${statusStep >= 2 ? 'text-pine-900 font-bold' : ''}">Сборка</span>
                <span class="${statusStep >= 3 ? 'text-pine-900 font-bold' : ''}">В пути</span>
                <span class="${statusStep >= 4 ? 'text-emerald-700 font-bold' : ''}">Выполнен</span>
              </div>
              <div class="h-2 w-full bg-stone-100 rounded-full overflow-hidden flex">
                <div class="h-full bg-emerald-500 transition-all duration-500" style="width: ${statusStep * 25}%"></div>
              </div>
            </div>

            <div class="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-1">
              ${itemsListHtml}
            </div>

            <div class="flex items-center justify-between pt-1 text-xs">
              <div>
                <span class="text-stone-500">Доставка:</span>
                <span class="font-semibold text-stone-800 ml-1 truncate max-w-[200px] inline-block align-bottom">${order.delivery || 'По договоренности'}</span>
              </div>
              <div class="text-right">
                <span class="text-stone-400 text-[11px]">Итого:</span>
                <span class="font-extrabold text-pine-900 text-sm ml-1">${(order.total || 0).toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <div class="pt-2 border-t border-stone-100 flex items-center justify-end">
              <button onclick="repeatCustomerOrder('${order.id}')" class="px-3 py-1.5 rounded-xl bg-pine-50 hover:bg-pine-100 text-pine-900 border border-pine-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                <span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg> <span>Повторить заказ</span></span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    function repeatCustomerOrder(orderId) {
      const order = getOrders().find(o => o.id === orderId);
      if (!order || !order.items || order.items.length === 0) return;
      order.items.forEach(item => {
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
          existing.qty += (item.qty || 1);
        } else {
          cart.push({ ...item });
        }
      });
      saveCart();
      updateCartUI();
      closeUserProfile();
      openCart();
      showToast(`Товары из заказа #${orderId} добавлены в корзину!`, 'success');
    }

    function saveOrderToCustomerProfile(orderData) {
      try {
        let profile = {};
        const saved = localStorage.getItem('xvoinyimir_user_profile');
        if (saved) profile = JSON.parse(saved);
        if (!profile.phone && orderData.phone) profile.phone = orderData.phone;
        if (!profile.name && orderData.name) profile.name = orderData.name;
        if (!profile.address && orderData.delivery) profile.address = orderData.delivery;
        localStorage.setItem('xvoinyimir_user_profile', JSON.stringify(profile));
      } catch(e) {}
    }

    // ==========================================
    // TELEGRAM NOTIFICATIONS & CROSS-DEVICE SYNC
    // ==========================================
    function sendOrderToTelegram(orderData) {
      const itemsLines = (orderData.items || []).map((i, idx) => `${idx + 1}. ${escapeHtml(i.name)} — ${Number(i.qty) || 1} шт. × ${Number(i.price) || 0} ₽ = ${(Number(i.qty) || 1) * (Number(i.price) || 0)} ₽`).join('\n');
      const message = `🌲 <b>НОВЫЙ ЗАКАЗ #${escapeHtml(orderData.id)}</b>\n\n` +
                      `👤 <b>Клиент:</b> ${escapeHtml(orderData.name)}\n` +
                      `📞 <b>Телефон:</b> ${escapeHtml(orderData.phone)}\n` +
                      `🚚 <b>Доставка:</b> ${escapeHtml(orderData.delivery)}\n` +
                      `💰 <b>Сумма:</b> ${(orderData.total || 0).toLocaleString('ru-RU')} ₽\n\n` +
                      `🌿 <b>Состав заказа:</b>\n${itemsLines}\n\n` +
                      `⏰ <i>${escapeHtml(orderData.date)}</i>`;

      // 1. Try secure Cloudflare Pages Function (server-side environment variables, token hidden)
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message, order: orderData })
      })
      .then(r => r.json())
      .then(res => {
        if (res && res.ok) {
          console.log('Telegram order notification dispatched via Cloudflare Pages Function');
          return;
        }
        dispatchClientTelegramFallback(message);
      })
      .catch(() => {
        dispatchClientTelegramFallback(message);
      });

      function dispatchClientTelegramFallback(textMsg) {
        const token = siteSettings.telegramBotToken || '';
        const chatId = siteSettings.telegramChatId || '';
        if (!token || !chatId) {
          console.log('Telegram Bot Token or Chat ID not configured. Configure in Admin Settings or Cloudflare Pages env vars.');
          return;
        }
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: textMsg,
            parse_mode: 'HTML'
          })
        }).then(res => res.json()).then(data => {
          console.log('Telegram client fallback response:', data);
        }).catch(err => {
          console.warn('Telegram notification failed:', err);
        });
      }
    }

    function testTelegramAlert() {
      const token = document.getElementById('settingsTelegramToken').value.trim();
      const chatId = document.getElementById('settingsTelegramChatId').value.trim();
      if (!token || !chatId) {
        showToast('Введите Telegram Bot Token и Chat ID для отправки теста', 'warning');
        return;
      }
      showToast('Отправка тестового сообщения...', 'info');
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🌿 <b>Питомник «Хвойный мир»</b>\nТестовое уведомление успешно доставлено на ваш телефон!',
          parse_mode: 'HTML'
        })
      }).then(res => res.json()).then(data => {
        if (data.ok) {
          showToast('Тест успешно доставлен в Telegram на ваш телефон!', 'success');
        } else {
          showToast('Ошибка Telegram: ' + (data.description || 'проверьте токен и chat_id'), 'error');
        }
      }).catch(err => {
        showToast('Ошибка отправки: ' + err.message, 'error');
      });
    }

    function saveTelegramSettings() {
      const token = document.getElementById('settingsTelegramToken').value.trim();
      const chatId = document.getElementById('settingsTelegramChatId').value.trim();
      const cloudUrl = document.getElementById('settingsCloudSyncUrl').value.trim();

      siteSettings.telegramBotToken = token;
      siteSettings.telegramChatId = chatId;
      siteSettings.cloudSyncUrl = cloudUrl;

      try {
        localStorage.setItem('xvoinyimir_settings', JSON.stringify(siteSettings));
        const alertEl = document.getElementById('telegramSaveAlert');
        if (alertEl) {
          alertEl.classList.remove('hidden');
          setTimeout(() => alertEl.classList.add('hidden'), 3500);
        }
        showToast('Настройки уведомлений сохранены!', 'success');
      } catch(e) {}
    }

    function syncOrdersFromCloud() {
      const cloudUrl = (siteSettings.cloudSyncUrl || '').trim();
      if (!cloudUrl) {
        showToast('Укажите URL облачной синхронизации (Webhook или Apps Script)', 'warning');
        return;
      }
      showToast('Синхронизация заказов...', 'info');
      fetch(cloudUrl)
        .then(res => res.json())
        .then(remoteOrders => {
          if (Array.isArray(remoteOrders)) {
            const currentOrders = getOrders();
            const orderIds = new Set(currentOrders.map(o => o.id));
            let addedCount = 0;
            remoteOrders.forEach(ro => {
              if (ro && ro.id && !orderIds.has(ro.id)) {
                currentOrders.unshift(ro);
                addedCount++;
              }
            });
            localStorage.setItem('xvoinyimir_orders', JSON.stringify(currentOrders));
            renderAdminOrdersTable();
            showToast(`Синхронизировано новых заказов: ${addedCount}`, 'success');
          }
        })
        .catch(err => {
          showToast('Не удалось загрузить заказы из облака: ' + err.message, 'error');
        });
    }


    // ==========================================
    // REAL-TIME CLOUD SYNC ENGINE (BULLETPROOF MULTI-DEVICE & DUAL-TOPIC BROKER)
    // ==========================================
    const DEFAULT_CLOUD_TOPIC = 'xvoinyimir_orders_live_sync_v1';
    const BACKUP_CLOUD_TOPIC = 'xvoinyimir_orders_live_sync_v2';

    function getCloudTopic() {
      return (siteSettings && siteSettings.cloudSyncTopic) ? siteSettings.cloudSyncTopic : DEFAULT_CLOUD_TOPIC;
    }

    // Strip bulky fields (descriptions, full gallery photo arrays) so payload is < 400 bytes and NEVER converted to attachment!
    function prepareOrderForCloud(orderData) {
      if (!orderData) return null;
      return {
        id: orderData.id,
        date: orderData.date,
        type: orderData.type || 'Заказ товаров',
        name: orderData.name || 'Покупатель',
        phone: orderData.phone || '',
        delivery: orderData.delivery || '',
        interest: orderData.interest || '',
        total: orderData.total || 0,
        status: orderData.status || 'Новый',
        items: (orderData.items || []).map(i => ({
          id: i.id || 1,
          name: i.name || 'Растение',
          price: i.price || 0,
          qty: i.qty || 1,
          image: i.image || ''
        }))
      };
    }

    // Persistent Outbox Queue in localStorage so orders are NEVER lost on mobile disconnects
    function getPendingCloudOrders() {
      try {
        return JSON.parse(localStorage.getItem('xvoinyimir_pending_cloud_orders') || '[]');
      } catch(e) { return []; }
    }

    function savePendingCloudOrder(cleanOrder) {
      try {
        const list = getPendingCloudOrders();
        if (!list.find(o => o.id === cleanOrder.id)) {
          list.push(cleanOrder);
          localStorage.setItem('xvoinyimir_pending_cloud_orders', JSON.stringify(list));
        }
      } catch(e) {}
    }

    function removePendingCloudOrder(id) {
      try {
        let list = getPendingCloudOrders();
        list = list.filter(o => o.id !== id);
        localStorage.setItem('xvoinyimir_pending_cloud_orders', JSON.stringify(list));
      } catch(e) {}
    }

    function broadcastOrderToCloud(orderData) {
      if (!orderData || !orderData.id) return;
      const cleanOrder = prepareOrderForCloud(orderData);
      if (!cleanOrder) return;

      // 1. Save to pending outbox
      savePendingCloudOrder(cleanOrder);

      // 2. Broadcast with keepalive:true across primary and backup topics
      const topics = [getCloudTopic(), BACKUP_CLOUD_TOPIC];
      const payload = JSON.stringify(cleanOrder);

      topics.forEach(t => {
        try {
          fetch('https://ntfy.sh/' + t, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: payload,
            keepalive: true
          }).then(res => {
            if (res.ok) {
              removePendingCloudOrder(cleanOrder.id);
              console.log('✓ Order broadcasted to cloud broker (' + t + '):', cleanOrder.id);
            }
          }).catch(err => {
            console.warn('Cloud broadcast network error for topic ' + t + ':', err);
          });
        } catch(e) {}
      });
    }

    function flushPendingCloudOrders() {
      const pending = getPendingCloudOrders();
      if (!pending || pending.length === 0) return;
      pending.forEach((ord, idx) => {
        setTimeout(() => {
          const payload = JSON.stringify(ord);
          [getCloudTopic(), BACKUP_CLOUD_TOPIC].forEach(t => {
            try {
              fetch('https://ntfy.sh/' + t, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true
              }).then(res => {
                if (res.ok) removePendingCloudOrder(ord.id);
              }).catch(() => {});
            } catch(e) {}
          });
        }, idx * 300);
      });
    }

    function broadcastLocalOrdersToCloud() {
      const orders = getOrders();
      if (!Array.isArray(orders) || orders.length === 0) return;
      orders.slice(0, 5).forEach((ord, idx) => {
        setTimeout(() => broadcastOrderToCloud(ord), idx * 300);
      });
      showToast('Последние заказы отправлены в облако для синхронизации!', 'info');
    }

    async function syncOrdersFromLiveCloud(manual = false) {
      if (manual) showToast('Проверка новых заказов в облаке...', 'info');

      // Flush any local pending orders first
      flushPendingCloudOrders();

      const topics = [getCloudTopic(), BACKUP_CLOUD_TOPIC];
      const currentOrders = getOrders();
      let addedCount = 0;

      for (const t of topics) {
        try {
          const res = await fetch('https://ntfy.sh/' + t + '/json?poll=1&since=all');
          if (!res.ok) continue;
          const text = await res.text();
          if (!text.trim()) continue;

          const lines = text.trim().split('\n');
          for (const line of lines) {
            try {
              const record = JSON.parse(line);
              let orderObj = null;

              if (record.message) {
                try {
                  orderObj = typeof record.message === 'string' ? JSON.parse(record.message) : record.message;
                } catch(e) {}
              }

              // Fallback if ntfy ever attached as file
              if (!orderObj && record.attachment && record.attachment.url) {
                try {
                  const attRes = await fetch(record.attachment.url);
                  if (attRes.ok) orderObj = await attRes.json();
                } catch(e) {}
              }

              if (orderObj && orderObj.id) {
                const existing = currentOrders.find(o => o.id === orderObj.id);
                if (existing) {
                  if (orderObj.status && existing.status !== orderObj.status) {
                    existing.status = orderObj.status;
                    addedCount++;
                  }
                } else {
                  currentOrders.unshift(orderObj);
                  addedCount++;
                }
              }
            } catch(e) {}
          }
        } catch(e) {
          console.warn('Sync topic fetch error:', e);
        }
      }

      if (addedCount > 0) {
        localStorage.setItem('xvoinyimir_orders', JSON.stringify(currentOrders));
        renderAdminOrdersTable();
        const badge = document.getElementById('adminOrderCountBadge');
        if (badge) badge.innerText = currentOrders.length;
        
        if (document.getElementById('userProfileModal') && !document.getElementById('userProfileModal').classList.contains('hidden')) {
          renderProfileOrders();
        }

        if (manual) {
          showToast(`Синхронизировано новых заказов из облака: ${addedCount}!`, 'success');
        }
      } else if (manual) {
        showToast('Все заказы с телефонов и других устройств актуальны (' + currentOrders.length + ' заказов в базе)', 'success');
      }
    }

    function initLiveCloudSync() {
      const topic = getCloudTopic();

      // 1. Connect real-time Server-Sent Events (SSE) stream for instant updates
      if (window.EventSource) {
        try {
          const sse = new EventSource('https://ntfy.sh/' + topic + '/sse');
          sse.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data.event === 'message' && data.message) {
                let incomingOrder = null;
                try {
                  incomingOrder = typeof data.message === 'string' ? JSON.parse(data.message) : data.message;
                } catch(e) {}

                if (incomingOrder && incomingOrder.id) {
                  const orders = getOrders();
                  const existing = orders.find(o => o.id === incomingOrder.id);
                  if (existing) {
                    if (incomingOrder.status && existing.status !== incomingOrder.status) {
                      existing.status = incomingOrder.status;
                      localStorage.setItem('xvoinyimir_orders', JSON.stringify(orders));
                      renderAdminOrdersTable();
                      if (document.getElementById('userProfileModal') && !document.getElementById('userProfileModal').classList.contains('hidden')) {
                        renderProfileOrders();
                      }
                      showToast(`Статус заказа #${incomingOrder.id} обновлен на «${incomingOrder.status}»!`, 'info');
                    }
                  } else {
                    orders.unshift(incomingOrder);
                    localStorage.setItem('xvoinyimir_orders', JSON.stringify(orders));
                    renderAdminOrdersTable();
                    const badge = document.getElementById('adminOrderCountBadge');
                    if (badge) badge.innerText = orders.length;

                    if (document.getElementById('userProfileModal') && !document.getElementById('userProfileModal').classList.contains('hidden')) {
                      renderProfileOrders();
                    }

                    // Only notify if admin dashboard is logged in:
                    if (sessionStorage.getItem('xvoinyimir_admin_auth') === 'true') {
                      showToast(`Новый заказ #${incomingOrder.id} от ${incomingOrder.name} (${(incomingOrder.total||0).toLocaleString('ru-RU')} ₽)!`, 'success');
                    }
                  }
                }
              }
            } catch(err) {
              console.warn('SSE order parse error:', err);
            }
          };
          sse.onerror = () => {
            // Reconnect handled automatically by EventSource
          };
        } catch(e) {}
      }

      // 2. Poll immediately on load
      syncOrdersFromLiveCloud(false);

      // 3. Flush any pending unsent orders from this device
      setTimeout(() => {
        flushPendingCloudOrders();
      }, 1200);

      // 4. Regular background check every 15 seconds, on window focus, and when coming online
      setInterval(() => syncOrdersFromLiveCloud(false), 15000);
      window.addEventListener('focus', () => syncOrdersFromLiveCloud(false));
      window.addEventListener('online', () => {
        flushPendingCloudOrders();
        syncOrdersFromLiveCloud(false);
      });
    }

    // ROCK-SOLID HEADROOM HEADER (WORKS FROM ANY PART OF THE SITE)
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let headroomTouchStartY = 0;
    let isHeaderVisible = true;

    function showMainHeader() {
      const wrapper = document.getElementById('stickyHeaderWrapper');
      if (wrapper && !isHeaderVisible) {
        wrapper.style.transform = 'translateY(0)';
        wrapper.classList.add('shadow-md');
        isHeaderVisible = true;
      }
    }

    function hideMainHeader() {
      const wrapper = document.getElementById('stickyHeaderWrapper');
      const drawer = document.getElementById('mobileNavDrawer');
      if (drawer && !drawer.classList.contains('hidden')) return;
      if (wrapper && isHeaderVisible) {
        wrapper.style.transform = 'translateY(-100%)';
        isHeaderVisible = false;
      }
    }

    // Scroll listener: detects direction from anywhere on the page
    window.addEventListener('scroll', () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const delta = currentScrollY - lastScrollY;

      // At the top of the page: always visible
      if (currentScrollY <= 30) {
        showMainHeader();
      } else if (delta > 8 && currentScrollY > 70) {
        // Scrolling down: hide header smoothly
        hideMainHeader();
      } else if (delta < -4) {
        // Any slight scroll up: immediately show header from ANYWHERE on the page!
        showMainHeader();
      }

      lastScrollY = Math.max(0, currentScrollY);
    }, { passive: true });

    // Direct touch gesture detection for instant mobile swipe response
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        headroomTouchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!e.touches || !e.touches[0]) return;
      const currentY = e.touches[0].clientY;
      const touchDiff = currentY - headroomTouchStartY;
      
      // If user drags finger downward (which scrolls page upward) by > 6px: instantly reveal!
      if (touchDiff > 6) {
        showMainHeader();
      } else if (touchDiff < -18 && (window.pageYOffset || document.documentElement.scrollTop) > 80) {
        hideMainHeader();
      }
      headroomTouchStartY = currentY; // Update per-tick so continuous drags work seamlessly!
    }, { passive: true });

    // ==========================================
    // DEDICATED WHOLESALE MODAL CONTROLS
    // ==========================================
    function openWholesaleModal() {
      const modal = document.getElementById('wholesaleModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeWholesaleModal() {
      const modal = document.getElementById('wholesaleModal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#wholesale') {
        history.replaceState(null, '', window.location.pathname + '#catalog');
      }
    });

    if (window.location.hash === '#wholesale') {
      history.replaceState(null, '', window.location.pathname + '#catalog');
    }
  
