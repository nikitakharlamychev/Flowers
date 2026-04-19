// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ==========================================
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('vanilla_cart')) || [];
} catch (e) {
    console.warn('localStorage not available');
}
let currentCategory = 'bouquet';
const flowerPrices = { roses: 150, tulips: 90, peonies: 350, greenery: 50 };
const decorationPrices = { wrap: 200, card: 100 };
let bouquet = { flowers: { roses: 0, tulips: 0, peonies: 0, greenery: 0 }, decorations: { wrap: 0, card: 0 } };
let interiorDensity = 'light', interiorRate = 1000;

const portfolioData = { 
    light: [{title:'Ресепшн', desc:'Акцентная композиция', img:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80'}, {title:'Зона отдыха', desc:'Напольный декор', img:'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&q=80'}, {title:'Переговорная', desc:'Минимализм', img:'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80'}], 
    medium: [{title:'Фотозона', desc:'Стена из зелени', img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80'}, {title:'Ресторан', desc:'Подвесные конструкции', img:'https://images.unsplash.com/photo-1478146896981-b80c463ab234?w=400&q=80'}, {title:'Входная группа', desc:'Арка', img:'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80'}], 
    dense: [{title:'Свадьба', desc:'Полное покрытие', img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80'}, {title:'Сцена', desc:'Премиум', img:'https://images.unsplash.com/photo-1507699622177-98884f8279f4?w=400&q=80'}, {title:'VIP зал', desc:'Эксклюзив', img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80'}] 
};

const catalogData = {
    bouquet: [
        {name:'Утренняя роса', subtitle:'Белые розы, эвкалипт', price:3500, img:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80'},
        {name:'Кармин', subtitle:'Красные розы', price:5200, img:'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&q=80'},
        {name:'Пробуждение', subtitle:'Тюльпаны', price:2800, img:'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80'},
        {name:'Симфония', subtitle:'Пионы, зелень', price:8900, img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80'}
    ],
    toy: [
        {name:'Медвежонок', subtitle:'Плюшевый мишка', price:1500, img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'},
        {name:'Кролик', subtitle:'Мягкая игрушка', price:1200, img:'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400&q=80'}
    ],
    candy: [
        {name:'Шоколадный набор', subtitle:'Разные вкусы', price:800, img:'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80'},
        {name:'Конфеты ручной работы', subtitle:'Фруктовые', price:600, img:'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80'}
    ]
};

// ==========================================
// ОБЩИЕ ФУНКЦИИ
// ==========================================
function updateCartBadge() { 
    const badge = document.getElementById('cartBadge'); 
    if(!badge) return;
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0); 
    badge.textContent = totalQty; 
    badge.classList.toggle('hidden', totalQty === 0); 
}
function saveCart() { 
    try {
        localStorage.setItem('vanilla_cart', JSON.stringify(cart)); 
    } catch (e) {
        console.warn('localStorage not available');
    }
    updateCartBadge(); 
}

function toggleCart() { 
    const modal = document.getElementById('cartModal'); 
    if(!modal) return;
    modal.classList.contains('active') ? modal.classList.remove('active') : (renderCart(), modal.classList.add('active'));
}

function renderCart() { 
    const container = document.getElementById('cartItems'), totalEl = document.getElementById('cartTotal'); 
    if(!container || !totalEl) return;
    if(!cart.length) { container.innerHTML = '<p class="text-stone-400 text-center py-8 font-light text-sm">Корзина пуста</p>'; totalEl.textContent = '0 ₽'; return; }
    let total = 0; 
    container.innerHTML = cart.map(item => { total += item.price * item.qty; return `<div class="flex items-center justify-between p-3 border border-stone-100 rounded-xl bg-stone-50/50"><div><div class="text-sm font-medium text-stone-800">${item.name}</div><div class="text-xs text-stone-500 mt-0.5">${item.qty} × ${item.price} ₽</div></div><div class="text-sm font-medium text-stone-900">${item.price * item.qty} ₽</div></div>`; }).join(''); 
    totalEl.textContent = `${total.toLocaleString('ru-RU')} ₽`; 
}

function addToCart(name, price) { 
    const existing = cart.find(item => item.name === name); 
    if(existing) existing.qty++; else cart.push({name, price, qty: 1}); 
    saveCart();
}

function openOrderFromCart() { 
    if(!cart.length) { alert('Корзина пуста'); return; }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const comment = document.getElementById('orderComment');
    if(comment) comment.value = `🛒 КОРЗИНА\n${cart.map(i => `• ${i.name} × ${i.qty} = ${i.price*i.qty} ₽`).join('\n')}\n💰 Итого: ${total} ₽`;
    document.getElementById('cartModal')?.classList.remove('active');
    document.getElementById('orderFormModal')?.classList.add('active');
}

function closeOrderForm() { document.getElementById('orderFormModal')?.classList.remove('active'); document.getElementById('orderForm')?.reset(); }
function closeSuccessModal() { document.getElementById('successModal')?.classList.remove('active'); cart = []; saveCart(); if(typeof resetBouquet === 'function') resetBouquet(); }

function submitOrder(e) { 
    e.preventDefault();
    const phone = document.getElementById('phoneInput')?.value.trim();
    if(!phone || phone.length < 10) { alert('Введите корректный номер телефона'); return; }
    const btn = document.getElementById('submitBtn');
    if(btn) { const orig = btn.textContent; btn.textContent = 'Отправка...'; btn.disabled = true; }
    
    const orderData = { customer: { name: document.getElementById('customerName')?.value, phone, social: document.getElementById('socialInput')?.value }, timestamp: new Date().toISOString(), cart: [...cart] };
    console.log('📦 ЗАКАЗ:', orderData);
    
    setTimeout(() => {
        if(btn) { btn.textContent = orig; btn.disabled = false; }
        closeOrderForm(); document.getElementById('successModal')?.classList.add('active');
    }, 1500);
}

// ==========================================
// БУКЕТЫ (bouquet.html)
// ==========================================
function selectCategory(c) { 
    currentCategory = c; 
    document.querySelectorAll('.cat-btn')?.forEach(b => { b.classList.remove('border-stone-800','text-stone-900','shadow-sm'); b.classList.add('border-stone-200','text-stone-600'); });
    const a = document.getElementById(`cat-${c}`); if(a) { a.classList.add('border-stone-800','text-stone-900','shadow-sm'); a.classList.remove('border-stone-200','text-stone-600'); }
    renderCatalog();
}
function toggleFlower(t) { document.getElementById(`flower-${t}`)?.classList.toggle('selected'); }
function changeQuantity(t, d) { 
    if(!bouquet.flowers[t]) return;
    bouquet.flowers[t] = Math.max(0, bouquet.flowers[t] + d); 
    document.getElementById(`qty-${t}`).textContent = bouquet.flowers[t]; 
    const c = document.getElementById(`flower-${t}`);
    if(bouquet.flowers[t]>0) { c.classList.add('border-[#E11D48]','bg-[#FFE4E6]'); c.classList.remove('border-stone-200/70','bg-white'); }
    else { c.classList.remove('border-[#E11D48]','bg-[#FFE4E6]'); c.classList.add('border-stone-200/70','bg-white'); }
    updatePreview(); calculateTotal(); 
}
function toggleDecoration(t) { document.getElementById(`decor-${t}`)?.classList.toggle('selected'); }
function changeDecorationQty(t, d) { 
    if(!bouquet.decorations[t]) return;
    bouquet.decorations[t] = Math.max(0, bouquet.decorations[t] + d); 
    document.getElementById(`qty-${t}`).textContent = bouquet.decorations[t]; 
    const c = document.getElementById(`decor-${t}`);
    if(bouquet.decorations[t]>0) { c.classList.add('border-[#E11D48]','bg-[#FFE4E6]'); c.classList.remove('border-stone-200/70','bg-white'); }
    else { c.classList.remove('border-[#E11D48]','bg-[#FFE4E6]'); c.classList.add('border-stone-200/70','bg-white'); }
    updatePreview(); calculateTotal(); 
}
function updatePreview() { 
    const l = document.getElementById('previewList'); if(!l) return;
    let items=[], n={roses:'Розы',tulips:'Тюльпаны',peonies:'Пионы',greenery:'Зелень',wrap:'Упаковка',card:'Открытка'}; 
    Object.entries(bouquet.flowers).forEach(([t,q])=>{if(q>0)items.push({name:n[t],qty:q,price:flowerPrices[t]*q})}); 
    Object.entries(bouquet.decorations).forEach(([t,q])=>{if(q>0)items.push({name:n[t],qty:q,price:decorationPrices[t]*q})}); 
    l.innerHTML = items.length===0 ? '<p class="text-stone-400 font-light text-center py-4">Добавьте элементы слева</p>' : items.map(x=>`<div class="preview-item"><span class="text-stone-600">${x.name} <span class="text-stone-400 text-xs ml-1">× ${x.qty}</span></span><span class="font-medium text-stone-900">${x.price} ₽</span></div>`).join('');
}
function calculateTotal() { 
    let t=0; Object.entries(bouquet.flowers).forEach(([k,v])=>t+=flowerPrices[k]*v); Object.entries(bouquet.decorations).forEach(([k,v])=>t+=decorationPrices[k]*v); 
    if(document.getElementById('delivery')?.checked) t+=300; if(document.getElementById('urgentBouquet')?.checked) t*=1.2; 
    document.getElementById('totalPrice').textContent = `${Math.round(t).toLocaleString('ru-RU')} ₽`; return Math.round(t);
}
function resetBouquet() { 
    Object.keys(bouquet.flowers).forEach(t=>{bouquet.flowers[t]=0;document.getElementById(`qty-${t}`).textContent='0';const c=document.getElementById(`flower-${t}`);if(c){c.classList.remove('border-[#E11D48]','bg-[#FFE4E6]');c.classList.add('border-stone-200/70','bg-white');}}); 
    Object.keys(bouquet.decorations).forEach(t=>{bouquet.decorations[t]=0;document.getElementById(`qty-${t}`).textContent='0';const c=document.getElementById(`decor-${t}`);if(c){c.classList.remove('border-[#E11D48]','bg-[#FFE4E6]');c.classList.add('border-stone-200/70','bg-white');}}); 
    ['delivery','urgentBouquet'].forEach(id=>{const e=document.getElementById(id);if(e)e.checked=false}); updatePreview(); calculateTotal();
}
function renderCatalog() { 
    const g=document.getElementById('bestsellerGrid'); if(!g) return;
    const data = catalogData[currentCategory] || catalogData.bouquet;
    g.innerHTML = data.map(i=>`<div class="product-card"><div class="relative h-56 overflow-hidden bg-stone-100"><img src="${i.img}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"></div><div class="p-5"><h3 class="font-serif text-base font-medium tracking-tight text-stone-900 mb-1">${i.name}</h3><p class="text-xs text-stone-500 mb-4 font-light truncate">${i.subtitle}</p><div class="flex items-center justify-between mt-auto"><span class="text-sm font-medium text-stone-900">${i.price.toLocaleString('ru-RU')} ₽</span><button onclick="addToCart('${i.name}',${i.price})" class="flex items-center justify-center w-8 h-8 bg-stone-50 rounded-lg text-stone-500 hover:bg-[#E11D48] hover:text-white transition-colors border border-stone-200/60 hover:border-transparent"><iconify-icon icon="solar:cart-plus-linear" class="text-lg"></iconify-icon></button></div></div></div>`).join('');
}
function openOrderForm() { 
    const total = calculateTotal(); if(total===0 && !cart.length) { alert('Добавьте элементы в заказ'); return; }
    const items=[]; Object.entries(bouquet.flowers).forEach(([t,q])=>{if(q>0)items.push(`${t}: ${q} шт.`)}); Object.entries(bouquet.decorations).forEach(([t,q])=>{if(q>0)items.push(`${t}: ${q} шт.`)});
    let s=`🌸 БУКЕТ\n${items.length?'Состав: '+items.join(', ')+'\n':''}${document.getElementById('delivery')?.checked?'🚚 Доставка: +300 ₽\n':''}${document.getElementById('urgentBouquet')?.checked?'⚡ Срочно: +20%\n':''}💰 Итого: ${total} ₽`;
    document.getElementById('orderComment').value=s; document.getElementById('orderFormModal').classList.add('active');
    setTimeout(()=>document.getElementById('customerName')?.focus(),300);
}

// ==========================================
// ИНТЕРЬЕР (interior.html)
// ==========================================
function syncAreaFromSlider(v) { const n=parseInt(v)||1; if(document.getElementById('areaInput'))document.getElementById('areaInput').value=n; calculateInteriorPrice(); }
function syncAreaFromInput(v) { let n=parseInt(v); if(isNaN(n)||n<1)n=1; if(n>500)n=500; if(document.getElementById('areaRange'))document.getElementById('areaRange').value=n; calculateInteriorPrice(); }
function selectDensity(t,r) { 
    interiorDensity=t; interiorRate=r; 
    document.querySelectorAll('.density-btn')?.forEach(b=>{b.classList.remove('border-[#10B981]','bg-[#ECFDF5]','selected');b.classList.add('border-stone-200','bg-white')});
    const a=document.getElementById(`density-${t}`); if(a){a.classList.add('border-[#10B981]','bg-[#ECFDF5]','selected');a.classList.remove('border-stone-200','bg-white')}
    if(document.getElementById('densityLabel'))document.getElementById('densityLabel').textContent={light:'точечное',medium:'стандартное',dense:'плотное'}[t]; 
    showPortfolio(t); calculateInteriorPrice();
}
function showPortfolio(t) { 
    const s=document.getElementById('portfolioSection'),g=document.getElementById('portfolioGrid'); if(!s||!g)return;
    s.classList.remove('hidden'); g.innerHTML=portfolioData[t].map(i=>`<div class="portfolio-item bg-white border border-stone-200/60 rounded-2xl overflow-hidden group"><div class="overflow-hidden h-36"><img src="${i.img}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"></div><div class="p-4"><div class="text-sm font-medium text-stone-900 mb-0.5">${i.title}</div><div class="text-xs text-stone-500 font-light truncate">${i.desc}</div></div></div>`).join('');
    g.querySelectorAll('.portfolio-item').forEach(el=>el.classList.remove('show')); setTimeout(()=>{g.querySelectorAll('.portfolio-item').forEach((it,idx)=>setTimeout(()=>it.classList.add('show'),idx*100))},50);
}
function calculateInteriorPrice() { 
    const a=parseInt(document.getElementById('areaRange')?.value)||1; let p=a*interiorRate; if(document.getElementById('urgentInterior')?.checked)p*=1.2; 
    document.getElementById('interiorTotalPrice').textContent=`от ${Math.max(5000,Math.round(p)).toLocaleString('ru-RU')} ₽`; return Math.max(5000,Math.round(p));
}
function openOrderFormInterior() { 
    const a=document.getElementById('areaInput')?.value||50, t=calculateInteriorPrice();
    const opts=[]; if(document.getElementById('decoratorVisit')?.checked)opts.push('Выезд декоратора'); if(document.getElementById('legalEntity')?.checked)opts.push('Работа с юрлицом'); if(document.getElementById('urgentInterior')?.checked)opts.push('Срочно (+20%)');
    document.getElementById('orderComment').value=`🏢 ИНТЕРЬЕР\nПлощадь: ${a} м²\nГустота: ${document.getElementById('densityLabel')?.textContent}${opts.length?'\nОпции: '+opts.join(', '):''}\n💰 От ${t} ₽`;
    document.getElementById('orderFormModal').classList.add('active'); setTimeout(()=>document.getElementById('customerName')?.focus(),300);
}

// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================
document.addEventListener('DOMContentLoaded', () => { 
    updateCartBadge();
    if(document.getElementById('bestsellerGrid')) { selectCategory('bouquet'); renderCatalog(); updatePreview(); calculateTotal(); }
    if(document.getElementById('interiorPage')) selectDensity('light', 1000);
    
    document.querySelectorAll('.modal').forEach(m => { m.addEventListener('click', e => { if(e.target===m) { if(m.id==='orderFormModal')closeOrderForm(); else if(m.id==='successModal')closeSuccessModal(); else toggleCart(); }}); });
    document.addEventListener('keydown', e => { if(e.key==='Escape') document.querySelectorAll('.modal.active').forEach(m => { if(m.id==='orderFormModal')closeOrderForm(); else if(m.id==='successModal')closeSuccessModal(); else toggleCart(); }); });
});
