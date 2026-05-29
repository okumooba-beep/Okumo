/* ═══════════════════════════════════════
   OKUMO — Sabor Real · JS v3
   ═══════════════════════════════════════ */

/* ── DEFAULT DATA ── */
const DEFAULTS = {
  hero: {
    eyebrow:  'Dark Kitchen · Delivery Premium',
    headline: 'El sabor que te persigue',
    sub:      'Dark Kitchen · Delivery · Sabor que no olvidas'
  },
  heroImages:  ['', '', '', ''],
  brandImage:  '',
  logoImage:   '',
  whatsapp:    '5491176513545',
  instagram:   'okumo.ar',
  tiktok:      'okumo.saborreal',
  pin:         '1234',
  deliveryCost: 2500,
  waMsgTemplate: '🔥 *PEDIDO OKUMO — SABOR REAL* 🔥\n\n📋 *Detalle:*\n\n{items}\n💰 *Total estimado: {total} ARS*\n\n📍 Indicá tu dirección y te confirmamos. ¡Gracias!',
  stats: { v1:"4.9★", l1:"Rating", v2:"+500", l2:"Pedidos", v3:"30'", l3:"Entrega" },
  categories: [
    { id:'milanesas',  label:'Milanesas',       emoji:'🍗' },
    { id:'sandwiches', label:'Sandwiches',       emoji:'🥖' },
    { id:'carnes',     label:'Carnes',           emoji:'🥩' },
    { id:'bebidas',    label:'Bebidas',          emoji:'🥤' },
    { id:'extras',     label:'Extras y Salsas',  emoji:'🍟' }
  ],
  products: [
    { id:1,  nombre:'La Milanesa de la Abuela',    desc:'Jugosa Suprema de pollo de 250gr, acompañada de crujientes papas fritas o un cremoso puré de papa.',                                  precio:15000, cat:'milanesas',  img:'', badge:'',        disp:true },
    { id:2,  nombre:'La Clásica Napo Grande',      desc:'Suprema de pollo de 250gr bañada en salsa napolitana casera y gratinada con mozzarella. Con papas fritas o puré.',                   precio:17000, cat:'milanesas',  img:'', badge:'top',     disp:true },
    { id:3,  nombre:'Suprema Pesto',               desc:'Suprema de pollo de 200gr gratinada con mozzarella y cubierta con deliciosa salsa pesto. Con puré o papas fritas.',                  precio:16000, cat:'milanesas',  img:'', badge:'nuevo',   disp:true },
    { id:4,  nombre:'Imperial de Roast Beef',      desc:'Pan Ciabatta con 200gr de Roast Beef braseado, mozzarella, pepinillos agridulces y salsa de aceitunas + papas fritas.',              precio:18000, cat:'sandwiches', img:'', badge:'popular', disp:true },
    { id:5,  nombre:'Porteño de Bondiola',         desc:'Ciabatta con 200gr de bondiola braseada Okumo, mozzarella, pepinillos y salsa de morrones asados + papas fritas.',                   precio:18000, cat:'sandwiches', img:'', badge:'',        disp:true },
    { id:6,  nombre:'Morta & Straccia',            desc:'Mortadela con pistachos, stracciatella cremosa, rúcula fresca y pesto en ciabatta fina. El tesoro oculto del menú.',                precio:17000, cat:'sandwiches', img:'', badge:'tesoro',  disp:true },
    { id:7,  nombre:'Supremo Napolitano',          desc:'Ciabatta con suprema de pollo, salsa napolitana artesanal y abundante queso. Con papas fritas crujientes.',                          precio:16000, cat:'sandwiches', img:'', badge:'',        disp:true },
    { id:8,  nombre:'El Clásico del Bodegón',      desc:'Roast Beef braseado sobre cremoso puré de papas, con pepinillos y jugo de cocción. El comfort food definitivo.',                     precio:16000, cat:'carnes',     img:'', badge:'',        disp:true },
    { id:9,  nombre:'Roast Beef a Fuego Lento',    desc:'200gr de roast beef cocinado a fuego lento, servido sobre puré o papas rústicas con reducción de la cocción.',                      precio:18000, cat:'carnes',     img:'', badge:'top',     disp:true },
    { id:10, nombre:'Coca Cola Original',          desc:'Sabor clásico de siempre. Botella 600 ml.',                                                                                          precio:3000,  cat:'bebidas',    img:'', badge:'',        disp:true },
    { id:11, nombre:'Coca Cola Zero',              desc:'Sabor original sin azúcar. Botella 600 ml.',                                                                                          precio:2900,  cat:'bebidas',    img:'', badge:'',        disp:true },
    { id:12, nombre:'7Up Zero',                    desc:'Bebida gaseosa sin azúcar. Refrescante y ligera.',                                                                                   precio:2500,  cat:'bebidas',    img:'', badge:'',        disp:true },
    { id:13, nombre:'Agua sin Gas',                desc:'Agua personal sin gas · 375 ml.',                                                                                                    precio:1500,  cat:'bebidas',    img:'', badge:'',        disp:true },
    { id:14, nombre:'Papas Fritas Crujientes',     desc:'Porción de papas fritas doradas y crujientes.',                                                                                      precio:3500,  cat:'extras',     img:'', badge:'',        disp:true },
    { id:15, nombre:'Salsa de Morrones Asados',    desc:'Salsa casera de morrones asados. Ideal para acompañar todo.',                                                                        precio:1500,  cat:'extras',     img:'', badge:'',        disp:true },
    { id:16, nombre:'Salsa de Aceitunas Especial', desc:'Blend especial de aceitunas verdes y negras con aliño propio.',                                                                      precio:1500,  cat:'extras',     img:'', badge:'',        disp:true },
    { id:17, nombre:'Queso Extra',                 desc:'Mozzarella derretida adicional para tu plato.',                                                                                      precio:2200,  cat:'extras',     img:'', badge:'',        disp:true }
  ]
};

/* ── STATE ── */
let data          = loadData();
let cart          = [];
let currentCat    = 'todo';
let tapCount      = 0;
let tapTimer      = null;
let editMode      = false;
let pendingTarget = null;
let orderType     = 'delivery';

/* ── DATA PERSISTENCE ── */
function migrateStorage() {
  if (localStorage.getItem('okumo_v') !== '4') {
    /* Limpiar formato viejo (imágenes embebidas en okumo_data) */
    localStorage.removeItem('okumo_data');
    localStorage.setItem('okumo_v', '4');
  }
}
migrateStorage();

function loadData() {
  try {
    const saved = localStorage.getItem('okumo_data');
    let d;
    if (saved) {
      const p = JSON.parse(saved);
      d = {
        ...DEFAULTS, ...p,
        hero:       { ...DEFAULTS.hero,  ...(p.hero  || {}) },
        stats:      { ...DEFAULTS.stats, ...(p.stats || {}) },
        heroImages: ['','','',''],
        categories: p.categories?.length ? p.categories : DEFAULTS.categories,
        products:   p.products?.length   ? p.products   : DEFAULTS.products
      };
      /* Cargar imágenes desde claves separadas */
      d.heroImages = [0,1,2,3].map(i => localStorage.getItem('okumo_img_h'+i) || '');
      d.brandImage = localStorage.getItem('okumo_img_brand') || '';
      d.logoImage  = localStorage.getItem('okumo_img_logo')  || '';
      d.products.forEach(p => { p.img = localStorage.getItem('okumo_img_p'+p.id) || ''; });
      return d;
    }
  } catch(e) {}

  /* Sin localStorage → usar datos exportados (Netlify) o defaults */
  if (window.OKUMO_BAKED) return JSON.parse(JSON.stringify(window.OKUMO_BAKED));
  return JSON.parse(JSON.stringify(DEFAULTS));
}

function saveData() {
  /* Guardar config SIN imágenes — nunca falla por espacio de fotos */
  try {
    const cfg = {
      ...data,
      heroImages: ['','','',''], brandImage: '', logoImage: '',
      products: data.products.map(p => ({ ...p, img: '' }))
    };
    localStorage.setItem('okumo_data', JSON.stringify(cfg));
  } catch(e) {
    showToast('⚠️ No se pudo guardar la configuración.', '#e74c3c');
  }
  saveImages();
}

function saveImages() {
  [0,1,2,3].forEach(i => {
    try {
      const v = (data.heroImages||[])[i] || '';
      if (v) localStorage.setItem('okumo_img_h'+i, v);
      else   localStorage.removeItem('okumo_img_h'+i);
    } catch(e) { showToast('⚠️ Foto '+(i+1)+' no guardada: espacio lleno.', '#e74c3c'); }
  });
  try {
    if (data.brandImage) localStorage.setItem('okumo_img_brand', data.brandImage);
    else                 localStorage.removeItem('okumo_img_brand');
  } catch(e) {}
  try {
    if (data.logoImage) localStorage.setItem('okumo_img_logo', data.logoImage);
    else                localStorage.removeItem('okumo_img_logo');
  } catch(e) {}
  (data.products||[]).forEach(p => {
    try {
      if (p.img) localStorage.setItem('okumo_img_p'+p.id, p.img);
      else       localStorage.removeItem('okumo_img_p'+p.id);
    } catch(e) {}
  });
}

/* ── HELPERS ── */
function fmt(n) { return '$' + Number(n).toLocaleString('es-AR', { minimumFractionDigits:0 }); }
function waLink(msg) { const n = (data.whatsapp||'').replace(/\D/g,''); return `https://wa.me/${n}${msg?'?text='+encodeURIComponent(msg):''}`; }
function igLink() { return `https://www.instagram.com/${data.instagram||''}/`; }
function ttLink() { return `https://www.tiktok.com/@${data.tiktok||''}`; }

function getCat(id)     { return data.categories.find(c => c.id === id); }
function getCatLabel(id){ return getCat(id)?.label || id; }
function getCatEmoji(id){ return getCat(id)?.emoji || '🍽'; }
function getCatOrder()  { return data.categories.map(c => c.id); }

function badgeLabel(b) {
  const m = { popular:'⭐ Popular', nuevo:'🆕 Nuevo', tesoro:'💎 Tesoro', top:'🔥 Top' };
  return m[b] || b;
}

/* ── APPLY DATA TO DOM ── */
function applyData() {
  /* Hero eyebrow */
  const eyebrow = document.getElementById('heroEyebrow');
  if (eyebrow && !eyebrow.isContentEditable) {
    eyebrow.textContent = data.hero.eyebrow || DEFAULTS.hero.eyebrow;
  }

  /* Hero headline */
  const hl = document.getElementById('heroHeadline');
  if (hl) {
    const words = (data.hero.headline || '').trim().split(' ');
    const last  = words.pop();
    hl.innerHTML = words.join(' ') + ` <span class="accent-text">${last}</span>`;
  }

  /* Hero sub */
  const sub = document.getElementById('heroSub');
  if (sub) sub.textContent = data.hero.sub || '';

  /* Photo rail — fotos reales */
  (data.heroImages || []).forEach((src, i) => {
    const img = document.getElementById('heroSlide' + i);
    if (!img) return;
    if (src) {
      img.src = src; img.classList.add('loaded');
      img.onerror = () => img.classList.remove('loaded');
    } else { img.src = ''; img.classList.remove('loaded'); }
  });

  /* Photo rail — clones para scroll infinito */
  document.querySelectorAll('[data-clone]').forEach(img => {
    const src = (data.heroImages || [])[parseInt(img.dataset.clone)] || '';
    if (src) {
      img.src = src; img.classList.add('loaded');
      img.onerror = () => img.classList.remove('loaded');
    } else { img.src = ''; img.classList.remove('loaded'); }
  });

  /* Gallery strip */
  document.querySelectorAll('.gl-img').forEach(img => {
    const src = (data.heroImages || [])[parseInt(img.dataset.src)] || '';
    if (src) {
      img.src = src; img.classList.add('loaded');
      img.onerror = () => img.classList.remove('loaded');
    } else { img.src = ''; img.classList.remove('loaded'); }
  });

  /* Brand wordmark image */
  const brandImg      = document.getElementById('heroBrandImg');
  const brandFallback = document.getElementById('heroLogoFallback');
  if (brandImg) {
    if (data.brandImage) {
      brandImg.src = data.brandImage;
      brandImg.classList.add('show');
      brandImg.onerror = () => { brandImg.classList.remove('show'); if (brandFallback) brandFallback.classList.remove('hidden'); };
      if (brandFallback) brandFallback.classList.add('hidden');
    } else {
      brandImg.src = '';
      brandImg.classList.remove('show');
      if (brandFallback) brandFallback.classList.remove('hidden');
    }
  }

  /* Logo circle */
  const logoImg = document.getElementById('heroLogoImg');
  if (logoImg && data.logoImage) {
    logoImg.src = data.logoImage;
    logoImg.classList.add('show');
    logoImg.onerror = () => { logoImg.classList.remove('show'); };
  } else if (logoImg) {
    logoImg.src = '';
    logoImg.classList.remove('show');
  }

  /* Stats */
  const st = data.stats || DEFAULTS.stats;
  const sv = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  sv('statVal1', st.v1); sv('statLbl1', st.l1);
  sv('statVal2', st.v2); sv('statLbl2', st.l2);
  sv('statVal3', st.v3); sv('statLbl3', st.l3);

  /* Social links */
  const waUrl = waLink();
  document.querySelectorAll('#navWa,#heroWaBtn,#ctaWa,#floatWa').forEach(el => { if(el) el.href = waUrl; });
  document.querySelectorAll('#navIg,#ctaIg').forEach(el => { if(el) el.href = igLink(); });
  document.querySelectorAll('#navTt,#ctaTt').forEach(el => { if(el) el.href = ttLink(); });
  const igH = document.getElementById('igHandle'); if(igH) igH.textContent = '@'+(data.instagram||'');
  const ttH = document.getElementById('ttHandle'); if(ttH) ttH.textContent = '@'+(data.tiktok||'');
}


/* ── FILTER BUTTONS (dynamic) ── */
function renderFilterButtons() {
  const wrap = document.getElementById('filterWrap');
  if (!wrap) return;
  wrap.innerHTML = '';

  const all = document.createElement('button');
  all.className = 'filter-btn' + (currentCat === 'todo' ? ' active' : '');
  all.dataset.cat = 'todo';
  all.textContent = 'Todo';
  wrap.appendChild(all);

  data.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (currentCat === cat.id ? ' active' : '');
    btn.dataset.cat = cat.id;
    btn.textContent = cat.label;
    wrap.appendChild(btn);
  });
}

/* ── PRODUCTS ── */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const visible = currentCat === 'todo'
    ? data.products.filter(p => p.disp)
    : data.products.filter(p => p.cat === currentCat && p.disp);

  grid.innerHTML = '';

  if (!visible.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--gray)">No hay productos en esta categoría.</div>';
    return;
  }

  if (currentCat === 'todo') {
    getCatOrder().forEach(catId => {
      const items = visible.filter(p => p.cat === catId);
      if (!items.length) return;
      const row = document.createElement('div');
      row.className = 'cat-label-row';
      row.innerHTML = `<div class="cat-label">${getCatEmoji(catId)} ${getCatLabel(catId)}</div><div class="cat-divider"></div>`;
      grid.appendChild(row);
      items.forEach((p, i) => grid.appendChild(buildCard(p, i)));
    });
    data.categories
      .filter(c => !getCatOrder().includes(c.id))
      .forEach(cat => {
        const items = visible.filter(p => p.cat === cat.id);
        if (!items.length) return;
        const row = document.createElement('div');
        row.className = 'cat-label-row';
        row.innerHTML = `<div class="cat-label">${cat.emoji} ${cat.label}</div><div class="cat-divider"></div>`;
        grid.appendChild(row);
        items.forEach((p, i) => grid.appendChild(buildCard(p, i)));
      });
  } else {
    visible.forEach((p, i) => grid.appendChild(buildCard(p, i)));
  }
}

function buildCard(p, idx) {
  const card = document.createElement('div');
  card.className = 'product-card' + (p.disp ? '' : ' unavailable');
  card.style.animationDelay = `${idx * 0.045}s`;

  const badgeHTML = p.badge ? `<div class="card-badge badge-${p.badge}">${badgeLabel(p.badge)}</div>` : '';
  const catClass  = 'cat-' + (p.cat || 'custom');
  const emoji     = getCatEmoji(p.cat);

  card.innerHTML = `
    <div class="card-img-wrap editable-img" onclick="handleProductImgClick(${p.id})">
      ${p.img ? `<img class="card-img" src="${p.img}" alt="${p.nombre}" loading="lazy" onerror="this.style.display='none';this.nextSibling.style.display='flex'">` : ''}
      <div class="card-placeholder ${catClass}" ${p.img ? 'style="display:none"' : ''}>${emoji}</div>
      ${badgeHTML}
      <div class="edit-img-ov">
        <span class="eio-icon">📷</span>
        <span class="eio-text">Cambiar foto</span>
      </div>
    </div>
    <div class="card-body">
      <div class="card-name">${p.nombre}</div>
      <div class="card-desc">${p.desc}</div>
      <div class="card-foot">
        <div class="card-price">${fmt(p.precio)} <small>ARS</small></div>
        <button class="btn-add" data-id="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar
        </button>
      </div>
    </div>`;
  return card;
}

/* ── CATEGORY SELECTS (admin) ── */
function buildCategorySelects() {
  const selects = document.querySelectorAll('#fCat, #editCat');
  selects.forEach(sel => {
    const current = sel.value;
    sel.innerHTML = data.categories.map(c => `<option value="${c.id}">${c.emoji} ${c.label}</option>`).join('');
    if (current) sel.value = current;
  });
}

/* ── CART ── */
function addToCart(id) {
  const product = data.products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ id, nombre: product.nombre, precio: product.precio, qty: 1 }); }
  renderCart();
  openCart();
  animateCartBtn();
}
function removeFromCart(id) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  if (cart[idx].qty > 1) { cart[idx].qty--; } else { cart.splice(idx, 1); }
  renderCart();
}
function deleteFromCart(id) { cart = cart.filter(i => i.id !== id); renderCart(); }
function clearCart() { if(!cart.length) return; if(!confirm('¿Vaciar el carrito?')) return; cart=[]; renderCart(); }
function cartTotal() { return cart.reduce((s,i) => s + i.precio * i.qty, 0); }
function cartCount() { return cart.reduce((s,i) => s + i.qty, 0); }

function renderCart() {
  const count  = cartCount();
  const badge  = document.getElementById('cartBadge');
  const ctext  = document.getElementById('cartCountText');
  const empty  = document.getElementById('cartEmpty');
  const items  = document.getElementById('cartItems');
  const foot   = document.getElementById('cartFoot');
  const total  = document.getElementById('cartTotal');

  if (badge) { badge.textContent = count; badge.classList.toggle('show', count > 0); }
  if (ctext) ctext.textContent = count > 0 ? `(${count})` : '';

  if (!cart.length) {
    if(empty) empty.style.display = 'flex';
    if(items) items.style.display = 'none';
    if(foot)  foot.style.display  = 'none';
    return;
  }
  if(empty) empty.style.display = 'none';
  if(items) items.style.display = 'flex';
  if(foot)  foot.style.display  = 'flex';

  if (items) {
    items.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div class="ci-info">
          <div class="ci-name">${i.nombre}</div>
          <div class="ci-price">${fmt(i.precio * i.qty)}</div>
        </div>
        <div class="ci-controls">
          <button class="ci-btn" onclick="removeFromCart(${i.id})">−</button>
          <span class="ci-qty">${i.qty}</span>
          <button class="ci-btn" onclick="addToCart(${i.id})">+</button>
          <button class="ci-del" onclick="deleteFromCart(${i.id})" title="Quitar">✕</button>
        </div>
      </div>`).join('');
  }
  if (total) total.textContent = fmt(cartTotal());
}
function animateCartBtn() {
  const btn = document.getElementById('cartToggle');
  if(!btn) return;
  btn.style.transform = 'scale(1.3)';
  setTimeout(() => { btn.style.transform = ''; }, 200);
}

function openCart()  { document.getElementById('cartPanel')?.classList.add('open'); document.getElementById('cartOverlay')?.classList.add('show'); document.body.style.overflow='hidden'; }
function closeCart() { document.getElementById('cartPanel')?.classList.remove('open'); document.getElementById('cartOverlay')?.classList.remove('show'); document.body.style.overflow=''; }

/* ── CHECKOUT ── */
function openCheckout() {
  if (!cart.length) return;
  setOrderType(orderType);
  renderCheckoutSummary();
  document.getElementById('checkoutPanel')?.classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutPanel')?.classList.remove('open');
}

function setOrderType(type) {
  orderType = type;
  document.getElementById('ckBtnDelivery')?.classList.toggle('active', type === 'delivery');
  document.getElementById('ckBtnPickup')?.classList.toggle('active', type === 'pickup');

  const addrSection  = document.getElementById('ckAddressSection');
  const deliveryRow  = document.getElementById('ckDeliveryRow');
  const cashOption   = document.getElementById('ckCashOption');

  if (addrSection)  addrSection.style.display  = type === 'delivery' ? 'block' : 'none';
  if (deliveryRow)  deliveryRow.style.display   = type === 'delivery' ? 'flex'  : 'none';
  if (cashOption)   cashOption.style.display    = type === 'delivery' ? 'none'  : 'block';

  if (type === 'delivery') {
    const cashRadio = document.querySelector('input[name="ckPay"][value="efectivo"]');
    if (cashRadio?.checked) {
      const transRadio = document.querySelector('input[name="ckPay"][value="transferencia"]');
      if (transRadio) transRadio.checked = true;
    }
  }

  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  const subtotal     = cartTotal();
  const cost         = Number(data.deliveryCost ?? DEFAULTS.deliveryCost ?? 2500);
  const deliveryCost = orderType === 'delivery' ? cost : 0;
  const total        = subtotal + deliveryCost;

  const items = document.getElementById('ckSummaryItems');
  if (items) {
    items.innerHTML = cart.map(i => `
      <div class="ck-summary-item">
        <span>${i.nombre} <small style="color:var(--gray-2)">×${i.qty}</small></span>
        <span>${fmt(i.precio * i.qty)}</span>
      </div>`).join('');
  }

  const costEl = document.getElementById('ckDeliveryCostVal');
  if (costEl) costEl.textContent = cost > 0 ? fmt(cost) : 'A confirmar';

  const totalEl = document.getElementById('ckGrandTotal');
  if (totalEl) totalEl.textContent = fmt(total);
}

function confirmOrder() {
  const name     = (document.getElementById('ckName')?.value   || '').trim();
  const phone    = (document.getElementById('ckPhone')?.value  || '').trim();
  const street   = (document.getElementById('ckStreet')?.value || '').trim();
  const apt      = (document.getElementById('ckApt')?.value    || '').trim();
  const comments = (document.getElementById('ckComments')?.value || '').trim();
  const pay      = document.querySelector('input[name="ckPay"]:checked')?.value || 'transferencia';

  if (!name)  { showToast('Ingresá tu nombre para continuar.', '#e74c3c'); document.getElementById('ckName')?.focus();   return; }
  if (!phone) { showToast('Ingresá tu teléfono para continuar.', '#e74c3c'); document.getElementById('ckPhone')?.focus(); return; }
  if (orderType === 'delivery' && !street) { showToast('Ingresá tu dirección para continuar.', '#e74c3c'); document.getElementById('ckStreet')?.focus(); return; }

  const subtotal     = cartTotal();
  const cost         = Number(data.deliveryCost ?? DEFAULTS.deliveryCost ?? 2500);
  const deliveryCost = orderType === 'delivery' ? cost : 0;
  const total        = subtotal + deliveryCost;

  let msg = '🔥 *NUEVO PEDIDO — OKUMO* 🔥\n\n';

  if (orderType === 'delivery') {
    msg += `📦 *MODALIDAD:* Delivery 🛵\n`;
    msg += `📍 *DIRECCIÓN:* ${street}${apt ? ', ' + apt : ''}\n`;
  } else {
    msg += `📦 *MODALIDAD:* Para retirar 🏪\n`;
  }

  msg += `👤 *NOMBRE:* ${name}\n`;
  msg += `📱 *TELÉFONO:* ${phone}\n`;
  msg += `💳 *FORMA DE PAGO:* ${pay === 'efectivo' ? 'Efectivo' : 'Transferencia'}\n\n`;

  msg += `📋 *DETALLE DEL PEDIDO:*\n`;
  cart.forEach(i => { msg += `• ${i.nombre} ×${i.qty} — ${fmt(i.precio * i.qty)} ARS\n`; });

  msg += `\n💰 Subtotal: ${fmt(subtotal)} ARS`;
  if (orderType === 'delivery') {
    msg += `\n🛵 Envío: ${cost > 0 ? fmt(cost) + ' ARS' : 'a confirmar'}`;
  }
  msg += `\n💵 *TOTAL: ${fmt(total)} ARS*`;

  if (comments) msg += `\n\n💬 *Comentarios:* ${comments}`;

  msg += '\n\n¡Gracias por tu pedido! Te confirmamos en breve 🙏';

  window.open(waLink(msg), '_blank');
  closeCheckout();
  closeCart();
}

/* ── EDIT MODE ── */
function enterEditMode() {
  editMode = true;
  document.body.classList.add('edit-mode');
  document.getElementById('editBar')?.classList.remove('hidden');
  document.getElementById('slideEditPanel')?.classList.remove('hidden');
}

function exitEditMode() {
  editMode = false;
  document.body.classList.remove('edit-mode');
  document.getElementById('editBar')?.classList.add('hidden');
  document.getElementById('slideEditPanel')?.classList.add('hidden');
}

/* ── TOAST NOTIFICATION ── */
function showToast(msg, color) {
  color = color || 'rgba(232,76,30,0.95)';
  let el = document.getElementById('okumoToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'okumoToast';
    el.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);padding:12px 28px;border-radius:30px;font-size:.82rem;font-weight:700;z-index:9999;color:white;letter-spacing:.5px;transition:opacity .4s;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.background = color;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = '0'; }, 3000);
}

/* ── COMPRESIÓN DE IMAGEN VÍA CANVAS ── */
function compressImage(file, maxDim, quality, callback) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    let w = img.naturalWidth, h = img.naturalHeight;
    if (w > maxDim || h > maxDim) {
      if (w >= h) { h = Math.round(h * maxDim / w); w = maxDim; }
      else         { w = Math.round(w * maxDim / h); h = maxDim; }
    }
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    callback(canvas.toDataURL('image/jpeg', quality));
  };
  img.onerror = () => { URL.revokeObjectURL(url); callback(null); };
  img.src = url;
}

/* ── IMAGE EDITING ── */
function handleLogoClick() {
  if (!editMode) return;
  triggerPicker({ type: 'logo' });
}

function handleBrandClick() {
  if (!editMode) return;
  triggerPicker({ type: 'brand' });
}

function triggerPickerSlide(idx) {
  triggerPicker({ type: 'slide', idx });
}

function handleSlideItemClick(idx) {
  if (!editMode) return;
  triggerPicker({ type: 'slide', idx });
}

function handleProductImgClick(id) {
  if (!editMode) return;
  triggerPicker({ type: 'product', id });
}

function triggerPicker(target) {
  pendingTarget = target;
  const picker = document.getElementById('imgPicker');
  if (picker) { picker.value = ''; picker.click(); }
}

function handleImageSelected(file) {
  if (!file || !pendingTarget) return;
  const target = pendingTarget;
  pendingTarget = null;

  /* Dimensiones y calidad según el destino */
  const cfg = {
    slide:   { maxDim: 1400, q: 0.82 },
    brand:   { maxDim: 1000, q: 0.90 },
    logo:    { maxDim:  600, q: 0.90 },
    product: { maxDim:  900, q: 0.82 }
  }[target.type] || { maxDim: 1200, q: 0.82 };

  showToast('⏳ Procesando imagen...', 'rgba(30,30,30,0.92)');

  compressImage(file, cfg.maxDim, cfg.q, base64 => {
    if (!base64) { showToast('❌ No se pudo leer la imagen.', '#e74c3c'); return; }

    try {
      if (target.type === 'logo') {
        data.logoImage = base64;
        saveData(); applyData();

      } else if (target.type === 'brand') {
        data.brandImage = base64;
        saveData(); applyData();

      } else if (target.type === 'slide') {
        if (!Array.isArray(data.heroImages) || data.heroImages.length !== 4)
          data.heroImages = ['', '', '', ''];
        data.heroImages[target.idx] = base64;
        saveData(); applyData();

      } else if (target.type === 'product') {
        const p = data.products.find(p => p.id === target.id);
        if (p) { p.img = base64; saveData(); renderProducts(); }
      }
      showToast('✅ Imagen guardada', 'rgba(0,184,148,0.95)');
    } catch(e) {
      showToast('⚠️ No se pudo guardar. Espacio lleno.', '#e74c3c');
    }
  });
}

/* ── EYEBROW EDITABLE ── */
function makeEyebrowEditable() {
  if (!editMode) return;
  const el = document.getElementById('heroEyebrow');
  if (!el || el.contentEditable === 'true') return;
  el.contentEditable = 'true';
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  el.addEventListener('blur', saveEyebrow, { once: true });
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
  }, { once: true });
}

function saveEyebrow() {
  const el = document.getElementById('heroEyebrow');
  if (!el) return;
  el.contentEditable = 'false';
  const text = el.textContent.trim();
  if (text) { data.hero.eyebrow = text; saveData(); }
  else { el.textContent = data.hero.eyebrow || DEFAULTS.hero.eyebrow; }
}

function makeHeadlineEditable() {
  if (!editMode) return;
  const el = document.getElementById('heroHeadline');
  if (!el || el.contentEditable === 'true') return;
  el.contentEditable = 'true';
  el.textContent = data.hero.headline || DEFAULTS.hero.headline;
  el.focus();
  el.addEventListener('blur', saveHeadline, { once: true });
  el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } }, { once: true });
}
function saveHeadline() {
  const el = document.getElementById('heroHeadline');
  if (!el) return;
  el.contentEditable = 'false';
  const text = el.textContent.trim();
  if (text) { data.hero.headline = text; saveData(); }
  applyData();
}

function makeSubEditable() {
  if (!editMode) return;
  const el = document.getElementById('heroSub');
  if (!el || el.contentEditable === 'true') return;
  el.contentEditable = 'true';
  el.focus();
  el.addEventListener('blur', saveSub, { once: true });
  el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } }, { once: true });
}
function saveSub() {
  const el = document.getElementById('heroSub');
  if (!el) return;
  el.contentEditable = 'false';
  const text = el.textContent.trim();
  if (text) { data.hero.sub = text; saveData(); }
  applyData();
}

/* ── ADMIN LOGIN ── */
function openLogin() {
  document.getElementById('loginOverlay')?.classList.add('show');
  clearPinInputs();
  setTimeout(() => document.querySelector('.pin-digit')?.focus(), 100);
}
function closeLogin() { document.getElementById('loginOverlay')?.classList.remove('show'); clearPinInputs(); }
function clearPinInputs() {
  document.querySelectorAll('.pin-digit').forEach(d => { d.value=''; d.classList.remove('error'); });
  document.getElementById('pinError')?.classList.add('hidden');
}
function getPinValue() { return Array.from(document.querySelectorAll('.pin-digit')).map(d => d.value).join(''); }
function checkPin() {
  if (getPinValue() === (data.pin || '1234')) {
    closeLogin(); openAdmin();
  } else {
    document.querySelectorAll('.pin-digit').forEach(d => { d.classList.add('error'); setTimeout(()=>d.classList.remove('error'),500); d.value=''; });
    document.getElementById('pinError')?.classList.remove('hidden');
    document.querySelector('.pin-digit')?.focus();
  }
}

/* PIN auto-advance */
document.addEventListener('DOMContentLoaded', () => {
  const digits = document.querySelectorAll('.pin-digit');
  digits.forEach((d, i) => {
    d.addEventListener('input', () => {
      d.value = d.value.replace(/\D/g,'');
      if (d.value.length === 1 && i < digits.length - 1) digits[i+1].focus();
      if (getPinValue().length === 4) checkPin();
    });
    d.addEventListener('keydown', e => { if (e.key==='Backspace' && !d.value && i>0) digits[i-1].focus(); });
  });
});

/* ── LOGO TAP (5 taps en 2s) ── */
function handleLogoTap() {
  tapCount++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => { tapCount=0; }, 2000);
  if (tapCount >= 5) { tapCount=0; openLogin(); }
}

/* ── ADMIN PANEL ── */
function openAdmin() {
  document.getElementById('adminOverlay')?.classList.add('show');
  document.body.style.overflow = 'hidden';
  fillAdminConfig();
  renderAdminProducts();
  renderAdminCategories();
  buildCategorySelects();
  switchAdmTab('config');
  enterEditMode();
}
function closeAdmin() {
  document.getElementById('adminOverlay')?.classList.remove('show');
  document.body.style.overflow = '';
}

function fillAdminConfig() {
  const s = (id,v) => { const el=document.getElementById(id); if(el) el.value=v; };
  s('cfgEyebrow',  data.hero.eyebrow  || '');
  s('cfgHeadline', data.hero.headline || '');
  s('cfgSub',      data.hero.sub      || '');
  const st = data.stats || DEFAULTS.stats;
  s('cfgStat1Val', st.v1); s('cfgStat1Lbl', st.l1);
  s('cfgStat2Val', st.v2); s('cfgStat2Lbl', st.l2);
  s('cfgStat3Val', st.v3); s('cfgStat3Lbl', st.l3);
  s('cfgWa',           data.whatsapp    || '');
  s('cfgDeliveryCost', data.deliveryCost ?? DEFAULTS.deliveryCost ?? 2500);
  s('cfgIg',           data.instagram   || '');
  s('cfgTt',           data.tiktok      || '');
  s('cfgPin', data.pin       || '');
  s('cfgWaMsg', data.waMsgTemplate || DEFAULTS.waMsgTemplate);
  s('cfgGhToken', localStorage.getItem('okumo_gh_token') || '');
}

function saveConfig() {
  const g = id => (document.getElementById(id)?.value||'').trim();
  const eyebrow = g('cfgEyebrow');
  if (eyebrow) {
    data.hero.eyebrow = eyebrow;
    const el = document.getElementById('heroEyebrow');
    if (el) el.textContent = eyebrow;
  }
  data.hero.headline = g('cfgHeadline') || data.hero.headline;
  data.hero.sub      = g('cfgSub')      || data.hero.sub;
  if (!data.stats) data.stats = { ...DEFAULTS.stats };
  if (g('cfgStat1Val')) data.stats.v1 = g('cfgStat1Val');
  if (g('cfgStat1Lbl')) data.stats.l1 = g('cfgStat1Lbl');
  if (g('cfgStat2Val')) data.stats.v2 = g('cfgStat2Val');
  if (g('cfgStat2Lbl')) data.stats.l2 = g('cfgStat2Lbl');
  if (g('cfgStat3Val')) data.stats.v3 = g('cfgStat3Val');
  if (g('cfgStat3Lbl')) data.stats.l3 = g('cfgStat3Lbl');
  data.whatsapp    = (g('cfgWa') || data.whatsapp).replace(/\D/g,'');
  const rawDc = g('cfgDeliveryCost');
  if (rawDc !== '') data.deliveryCost = Math.max(0, parseInt(rawDc, 10) || 0);
  const rawIg    = g('cfgIg') || data.instagram;
  data.instagram = rawIg.replace(/^https?:\/\/(www\.)?instagram\.com\//,'').replace(/\/$/,'');
  data.tiktok    = (g('cfgTt') || data.tiktok).replace(/^@/,'');
  if (g('cfgPin').length === 4) data.pin = g('cfgPin');
  const waMsg = document.getElementById('cfgWaMsg')?.value || '';
  if (waMsg.trim()) data.waMsgTemplate = waMsg;
  const ghToken = (document.getElementById('cfgGhToken')?.value || '').trim();
  if (ghToken) localStorage.setItem('okumo_gh_token', ghToken);
  saveData(); applyData();
  const fb = document.getElementById('configFeedback');
  if (fb) { fb.classList.remove('hidden'); setTimeout(()=>fb.classList.add('hidden'), 2500); }
}

/* ── ADMIN TABS ── */
function switchAdmTab(tab) {
  document.querySelectorAll('.adm-tab').forEach(t => t.classList.toggle('active', t.dataset.atab===tab));
  document.querySelectorAll('.adm-content').forEach(c => c.classList.toggle('active', c.id==='adm-'+tab));
}

/* ── ADMIN CATEGORIES ── */
function renderAdminCategories() {
  const list = document.getElementById('admCatList');
  if (!list) return;
  list.innerHTML = '';
  data.categories.forEach(cat => {
    const usedCount = data.products.filter(p => p.cat === cat.id).length;
    const item = document.createElement('div');
    item.className = 'adm-cat-item';
    item.innerHTML = `
      <span class="adm-cat-emoji">${cat.emoji}</span>
      <span class="adm-cat-name">${cat.label}</span>
      <span class="adm-cat-count">${usedCount} producto${usedCount!==1?'s':''}</span>
      <button class="adm-cat-del" onclick="deleteCategory('${cat.id}')" ${usedCount>0?'disabled title="Reasigná los productos primero"':''}>Eliminar</button>`;
    list.appendChild(item);
  });
}

function addCategory() {
  const emoji = (document.getElementById('newCatEmoji')?.value||'').trim() || '🍽';
  const label = (document.getElementById('newCatLabel')?.value||'').trim();
  if (!label) { alert('Escribí un nombre para la categoría.'); return; }
  const id = label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  if (data.categories.find(c => c.id === id)) { alert('Ya existe una categoría similar.'); return; }
  data.categories.push({ id, label, emoji });
  saveData();
  renderAdminCategories();
  buildCategorySelects();
  renderFilterButtons();
  document.getElementById('newCatLabel').value = '';
  document.getElementById('newCatEmoji').value = '';
  const fb = document.getElementById('catFeedback');
  if (fb) { fb.classList.remove('hidden'); setTimeout(()=>fb.classList.add('hidden'), 2000); }
}

function deleteCategory(id) {
  const used = data.products.filter(p => p.cat === id).length;
  if (used > 0) { alert(`Esta categoría tiene ${used} producto(s). Reasignalos antes de eliminarla.`); return; }
  if (!confirm('¿Eliminar esta categoría?')) return;
  data.categories = data.categories.filter(c => c.id !== id);
  saveData();
  renderAdminCategories();
  buildCategorySelects();
  renderFilterButtons();
}

/* ── ADMIN PRODUCTS ── */
function renderAdminProducts() {
  const list = document.getElementById('admProductList');
  if (!list) return;
  list.innerHTML = '';
  if (!data.products.length) {
    list.innerHTML = '<p style="color:var(--gray);text-align:center;padding:20px">No hay productos</p>';
    return;
  }
  data.products.forEach(p => {
    const item = document.createElement('div');
    item.className = 'adm-prod-item' + (p.disp?'':' unavail');
    item.innerHTML = `
      <div class="adm-prod-info">
        <div class="adm-prod-name">${p.nombre}</div>
        <div class="adm-prod-meta">
          <span class="adm-prod-price">${fmt(p.precio)}</span>
          <span>${getCatLabel(p.cat)}</span>
          ${p.badge ? `<span>${badgeLabel(p.badge)}</span>` : ''}
          ${!p.disp ? '<span style="color:#e74c3c">No disponible</span>' : ''}
        </div>
      </div>
      <div class="adm-prod-btns">
        <button class="adm-toggle-btn" onclick="toggleProduct(${p.id})">${p.disp?'Pausar':'Activar'}</button>
        <button class="adm-edit-btn"   onclick="editProduct(${p.id})">Editar</button>
        <button class="adm-del-btn"    onclick="deleteProduct(${p.id})">Borrar</button>
      </div>`;
    list.appendChild(item);
  });
}

function toggleProduct(id) {
  const p = data.products.find(p=>p.id===id);
  if(p){ p.disp=!p.disp; saveData(); renderAdminProducts(); renderProducts(); }
}
function deleteProduct(id) {
  if(!confirm('¿Eliminar este producto?')) return;
  data.products = data.products.filter(p=>p.id!==id);
  saveData(); renderAdminProducts(); renderProducts();
}
function editProduct(id) {
  const p = data.products.find(p=>p.id===id);
  if(!p) return;
  const s = (elId,v) => { const el=document.getElementById(elId); if(el) el.value=v; };
  s('editId',  p.id);
  s('fNombre', p.nombre);
  s('fDesc',   p.desc);
  s('fPrecio', p.precio);
  s('fCat',    p.cat);
  s('fImg',    p.img||'');
  s('fBadge',  p.badge||'');
  const disp = document.getElementById('fDisp'); if(disp) disp.checked=p.disp;
  const btnSave   = document.getElementById('btnSaveProduct');
  const btnCancel = document.getElementById('btnCancelEdit');
  if(btnSave)   btnSave.textContent   = '💾 Guardar cambios';
  if(btnCancel) btnCancel.classList.remove('hidden');
  switchAdmTab('nuevo');
}
function cancelEdit() {
  clearProductForm();
  const btnSave   = document.getElementById('btnSaveProduct');
  const btnCancel = document.getElementById('btnCancelEdit');
  if(btnSave)   btnSave.textContent = '✅ Guardar producto';
  if(btnCancel) btnCancel.classList.add('hidden');
}
function clearProductForm() {
  ['editId','fNombre','fDesc','fPrecio','fImg'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  const cat=document.getElementById('fCat'); if(cat && data.categories[0]) cat.value=data.categories[0].id;
  const badge=document.getElementById('fBadge'); if(badge) badge.value='';
  const disp=document.getElementById('fDisp'); if(disp) disp.checked=true;
}
function saveProduct() {
  const g = id => (document.getElementById(id)?.value||'').trim();
  const nombre = g('fNombre'), desc = g('fDesc'), cat = g('fCat');
  const precio = parseFloat(g('fPrecio'));
  if (!nombre || !desc || isNaN(precio) || !cat) { alert('Completá: nombre, descripción, precio y categoría.'); return; }
  const editId = parseInt(g('editId'));
  const disp   = document.getElementById('fDisp')?.checked ?? true;
  if (editId) {
    const idx = data.products.findIndex(p=>p.id===editId);
    if(idx!==-1) {
      const existingImg = data.products[idx].img || localStorage.getItem('okumo_img_p'+editId) || '';
      data.products[idx] = { ...data.products[idx], nombre, desc, precio, cat, img:existingImg, badge:g('fBadge'), disp };
    }
  } else {
    const maxId = data.products.reduce((m,p)=>Math.max(m,p.id),0);
    data.products.push({ id:maxId+1, nombre, desc, precio, cat, img:g('fImg'), badge:g('fBadge'), disp });
  }
  saveData(); cancelEdit(); renderAdminProducts(); renderProducts(); renderFilterButtons();
  const fb = document.getElementById('productFeedback');
  if(fb){ fb.classList.remove('hidden'); setTimeout(()=>fb.classList.add('hidden'),2500); }
}

/* ── PUBLICAR EN GITHUB ── */
async function publishToGitHub() {
  const token = localStorage.getItem('okumo_gh_token') || '';
  if (!token) {
    showToast('⚠️ Primero configurá tu token de GitHub en el panel → Configuración.', '#e74c3c');
    return;
  }
  const btn = document.getElementById('btnPublish');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Publicando...'; }
  try {
    const exportData = {
      ...data,
      heroImages: [0,1,2,3].map(i => localStorage.getItem('okumo_img_h'+i) || ''),
      brandImage: localStorage.getItem('okumo_img_brand') || '',
      logoImage:  localStorage.getItem('okumo_img_logo')  || '',
      products:   data.products.map(p => ({ ...p, img: localStorage.getItem('okumo_img_p'+p.id) || p.img || '' }))
    };
    const jsContent = '/* OKUMO Datos — ' + new Date().toLocaleDateString('es-AR') + ' */\nwindow.OKUMO_BAKED = ' + JSON.stringify(exportData) + ';';
    const apiUrl = 'https://api.github.com/repos/okumooba-beep/Okumo/contents/js/data.js';
    const headers = { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };
    let sha = null;
    const getResp = await fetch(apiUrl, { headers });
    if (getResp.ok) { const fd = await getResp.json(); sha = fd.sha; }
    const encoded = btoa(unescape(encodeURIComponent(jsContent)));
    const body = { message: 'Actualizar datos OKUMO', content: encoded };
    if (sha) body.sha = sha;
    const putResp = await fetch(apiUrl, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (putResp.ok) {
      showToast('✅ ¡Publicado! El sitio se actualiza en 1-2 minutos.', 'rgba(0,184,148,0.95)');
    } else {
      const err = await putResp.json();
      throw new Error(err.message || 'Error al publicar');
    }
  } catch(e) {
    showToast('⚠️ Error: ' + e.message, '#e74c3c');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🚀 Guardar y publicar'; }
  }
}

/* ── EXPORTAR PARA NETLIFY ── */
function exportForNetlify() {
  const exportData = {
    ...data,
    heroImages: [0,1,2,3].map(i => localStorage.getItem('okumo_img_h'+i) || ''),
    brandImage: localStorage.getItem('okumo_img_brand') || '',
    logoImage:  localStorage.getItem('okumo_img_logo')  || '',
    products:   data.products.map(p => ({
      ...p, img: localStorage.getItem('okumo_img_p'+p.id) || p.img || ''
    }))
  };
  const js = '/* OKUMO Datos — ' + new Date().toLocaleDateString('es-AR') + ' */\nwindow.OKUMO_BAKED = ' + JSON.stringify(exportData) + ';';
  const a  = document.createElement('a');
  a.href   = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(js);
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('✅ data.js descargado — seguí los pasos del panel', 'rgba(0,184,148,0.95)');
}

/* ── CLEAR ALL IMAGES ── */
function clearAllImages() {
  if (!confirm('¿Borrar todas las fotos guardadas? Los productos y configuración se mantienen.')) return;
  data.heroImages = ['','','',''];
  data.brandImage = '';
  data.logoImage  = '';
  data.products.forEach(p => { p.img = ''; });
  [0,1,2,3].forEach(i => localStorage.removeItem('okumo_img_h'+i));
  localStorage.removeItem('okumo_img_brand');
  localStorage.removeItem('okumo_img_logo');
  data.products.forEach(p => localStorage.removeItem('okumo_img_p'+p.id));
  saveData(); applyData(); renderProducts();
  showToast('✅ Fotos borradas. Ya podés subir nuevas.', 'rgba(0,184,148,0.95)');
}

/* ── FILTER ── */
function setFilter(cat) {
  currentCat = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.cat===cat));
  renderProducts();
}

/* ── NAVBAR SHRINK ── */
function handleNavScroll() {
  document.getElementById('navbar')?.classList.toggle('shrunk', window.scrollY > 80);
}

/* ── SCROLL ANIMATIONS ── */
function setupScrollAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.menu-header, .contacto-inner, .c-card, .footer').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .65s ease, transform .65s ease';
    obs.observe(el);
  });
}

/* ── HAMBURGER ── */
function toggleMobileMenu() {
  document.getElementById('navMenu')?.classList.toggle('open');
  document.getElementById('hamburger')?.classList.toggle('open');
  document.body.style.overflow = document.getElementById('navMenu')?.classList.contains('open') ? 'hidden' : '';
}
function closeMobileMenu() {
  document.getElementById('navMenu')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══════════════ INIT ═══════════════ */
document.addEventListener('DOMContentLoaded', () => {
  applyData();
  renderFilterButtons();
  renderProducts();
  renderCart();
  buildCategorySelects();
  setupScrollAnimations();

  /* Scroll events */
  window.addEventListener('scroll', handleNavScroll, { passive:true });

  /* Logo tap → admin */
  document.getElementById('logoTap')?.addEventListener('click', handleLogoTap);

  /* Hamburger */
  document.getElementById('hamburger')?.addEventListener('click', toggleMobileMenu);
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeMobileMenu));

  /* Cart */
  document.getElementById('cartToggle')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', () => { closeCheckout(); closeCart(); });
  document.getElementById('btnFinalize')?.addEventListener('click', openCheckout);
  document.getElementById('btnClear')?.addEventListener('click', clearCart);

  /* Checkout */
  document.getElementById('ckBack')?.addEventListener('click', closeCheckout);
  document.getElementById('ckClose')?.addEventListener('click', () => { closeCheckout(); closeCart(); });
  document.getElementById('btnConfirmOrder')?.addEventListener('click', confirmOrder);

  /* Products grid delegation */
  document.getElementById('productsGrid')?.addEventListener('click', e => {
    const btn = e.target.closest('.btn-add');
    if (btn) addToCart(parseInt(btn.dataset.id));
  });

  /* Filter delegation */
  document.getElementById('filterWrap')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (btn) setFilter(btn.dataset.cat);
  });

  /* Admin login */
  document.getElementById('loginClose')?.addEventListener('click', closeLogin);
  document.getElementById('loginOverlay')?.addEventListener('click', e => { if(e.target===document.getElementById('loginOverlay')) closeLogin(); });

  /* Admin panel */
  document.getElementById('adminClose')?.addEventListener('click', closeAdmin);
  document.getElementById('adminOverlay')?.addEventListener('click', e => { if(e.target===document.getElementById('adminOverlay')) closeAdmin(); });

  /* Admin tabs */
  document.querySelectorAll('.adm-tab').forEach(t => t.addEventListener('click', () => switchAdmTab(t.dataset.atab)));

  /* Admin save buttons */
  document.getElementById('btnSaveConfig')?.addEventListener('click', saveConfig);
  document.getElementById('btnSaveProduct')?.addEventListener('click', saveProduct);
  document.getElementById('btnCancelEdit')?.addEventListener('click', cancelEdit);
  document.getElementById('btnAddCat')?.addEventListener('click', addCategory);

  /* Image picker */
  const picker = document.getElementById('imgPicker');
  if (picker) {
    picker.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handleImageSelected(file);
      /* Reset value so same file can be re-selected */
      setTimeout(() => { e.target.value = ''; }, 200);
    });
    /* Fallback: also listen on input event */
    picker.addEventListener('input', e => {
      const file = e.target.files[0];
      if (file && pendingTarget) handleImageSelected(file);
    });
  }
});
