// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ==========================================
let cart = JSON.parse(localStorage.getItem('vanilla_cart')) || [];
let currentCategory = 'bouquet';

// Цены для конструктора букетов
const flowerPrices = { roses: 150, tulips: 90, peonies: 350, greenery: 50 };
const decorationPrices = { wrap: 200, card: 100 };

// Состояние конструктора букетов
let bouquet = { 
    flowers: { roses: 0, tulips: 0, peonies: 0, greenery: 0 }, 
    decorations: { wrap: 0, card: 0 } 
};

// Состояние калькулятора интерьера
let interiorDensity = 'light', interiorRate = 1000, interiorBasePrice = 50000;

// Данные для портфолио и каталога
const portfolioData = { 
    light: [
        {title:'Ресепшн', desc:'Акцентная композиция', img:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80'}, 
        {title:'Зона отдыха', desc:'Напольный декор', img:'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&q=80'}, 
        {title:'Переговорная', desc:'Минимализм', img:'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80'}
    ], 
    medium: [
        {title:'Фотозона', desc:'Стена из зелени', img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80'}, 
        {title:'Ресторан', desc:'Подвесные конструкции', img:'https://images.unsplash.com/photo-1478146896981-b80c463ab234?w=400&q=80'}, 
        {title:'Входная группа', desc:'Арка', img:'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80'}
    ], 
    dense: [
        {title:'Свадьба', desc:'Полное покрытие', img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80'}, 
        {title:'Сцена', desc:'Премиум', img:'https://images.unsplash.com/photo-1507699622177-98884f8279f4?w=400&q=80'}, 
        {title:'VIP зал', desc:'Эксклюзив', img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80'}
    ] 
};

const catalogData = [
    {name:'Утренняя роса', subtitle:'Белые розы, эвкалипт', price:3500, img:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80'},
    {name:'Кармин', subtitle:'Красные розы', price:5200, img:'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&q=80'},
    {name:'Пробуждение', subtitle:'Тюльпаны', price:2800, img:'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80'},
    {name:'Симфония', subtitle:'Пионы, зелень', price:8900, img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80'}
];

// ==========================================
// ОБЩИЕ ФУНКЦИИ
// ==========================================

// Обновление бейджа корзины
function updateCartBadge() { 
    const badge = document.getElementById('cartBadge'); 
    if(!badge) return;
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0); 
    badge.textContent = totalQty; 
    badge.classList.toggle('hidden', totalQty === 0); 
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('vanilla_cart', JSON.stringify(cart));
    updateCartBadge();
}

// Переключение корзины
function toggleCart() { 
    const modal = document.getElementById('cartModal'); 
    if(!modal) return;
    if(modal.classList.contains('active')) {
        modal.classList.remove('active'); 
    } else {
        renderCart(); 
        modal.classList.add('active'); 
    } 
}

// Рендер корзины
function renderCart() { 
    const container = document.getElementById('cartItems'); 
    const totalEl = document.getElementById('cartTotal'); 
    if(!container || !totalEl) return;
    
    if(!cart.length) {
        container.innerHTML = '<p class="text-stone-400 text-center py-8 font-light text-sm">Корзина пуста</p>';
        totalEl.textContent = '0 ₽';
        return;
    }
    let total = 0; 
    container.innerHTML = cart.map(item => { 
        total += item.price * item.qty; 
        return `<div class="flex items-center justify-between p-3 border border-stone-100 rounded-xl bg-stone-50/50"><div><div class="text-sm font-medium text-stone-800">${item.name}</div><div class="text-xs text-stone-500 mt-0.5">${item.qty} × ${item.price} ₽</div></div><div class="text-sm font-medium text-stone-900">${item.price * item.qty} ₽</div></div>`; 
    }).join(''); 
    totalEl.textContent = `${total.toLocaleString('ru-RU')} ₽`; 
}

// Добавление в корзину
function addToCart(name, price) { 
    const existing = cart.find(item => item.name === name); 
    if(existing) existing.qty++; else cart.push({name: name, price: price, qty: 1}); 
    saveCart();
    
    // Визуальная обратная связь
    const btn = event?.currentTarget;
    if(btn) {
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = '', 200);
    }
}

// Открытие формы заказа из корзины
function openOrderFromCart() { 
    if(!cart.length) {
        alert('Корзина пуста');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const comment = document.getElementById('orderComment');
    if(comment) {
        comment.value = `🛒 КОРЗИНА\n${cart.map(i => `• ${i.name} × ${i.qty} = ${i.price * i.qty} ₽`).join('\n')}\n💰 Итого: ${total} ₽`;
    }
    document.getElementById('cartModal')?.classList.remove('active');
    document.getElementById('orderFormModal')?.classList.add('active');
}

// Закрытие модальных окон
function closeOrderForm() { 
    document.getElementById('orderFormModal')?.classList.remove('active');
    document.getElementById('orderForm')?.reset();
}

function closeSuccessModal() { 
    document.getElementById('successModal')?.classList.remove('active'); 
    // Очистка после успешного заказа
    cart = [];
    saveCart();
    if(typeof resetBouquet === 'function') resetBouquet();
}

// Обработчик отправки формы
function submitOrder(e) { 
    e.preventDefault();
    
    const phone = document.getElementById('phoneInput')?.value.trim();
    if(!phone || phone.length < 10) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    if(submitBtn) {
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
    }
    
    // Сбор данных заказа
    const orderData = {
        customer: {
            name: document.getElementById('customerName')?.value.trim(),
            phone: phone,
            social: document.getElementById('socialInput')?.value.trim()
        },
        order: {
            comment: document.getElementById('orderComment')?.value,
            timestamp: new Date().toISOString()
        },
        cart: JSON.parse(JSON.stringify(cart))
    };
    
    // Добавляем данные из конструктора букетов, если на той странице
    if(typeof bouquet !== 'undefined') {
        orderData.bouquet = JSON.parse(JSON.stringify(bouquet));
    }
    
    // Добавляем данные из калькулятора интерьера, если на той странице
    if(typeof interiorDensity !== 'undefined') {
        orderData.interior = {
            density: interiorDensity,
            area: document.getElementById('areaInput')?.value || 50
        };
    }
    
    console.log('📦 НОВЫЙ ЗАКАЗ:', orderData);
    
    // Имитация отправки
    setTimeout(() => {
        if(submitBtn) {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
        closeOrderForm();
        document.getElementById('successModal')?.classList.add('active');
    }, 1500);
}

// ==========================================
// ФУНКЦИИ КОНСТРУКТОРА БУКЕТОВ (bouquet.html)
// ==========================================

function selectCategory(category) { 
    currentCategory = category; 
    document.querySelectorAll('.cat-btn')?.forEach(btn => {
        btn.classList.remove('border-stone-800', 'text-stone-900', 'shadow-sm');
        btn.classList.add('border-stone-200', 'text-stone-600');
    });
    const active = document.getElementById(`cat-${category}`); 
    if(active) {
        active.classList.add('border-stone-800', 'text-stone-900', 'shadow-sm'); 
        active.classList.remove('border-stone-200', 'text-stone-600'); 
    }
}

function toggleFlower(type) { 
    document.getElementById(`flower-${type}`)?.classList.toggle('selected'); 
}

function changeQuantity(type, delta) { 
    if(!bouquet.flowers[type]) return;
    bouquet.flowers[type] = Math.max(0, bouquet.flowers[type] + delta); 
    document.getElementById(`qty-${type}`).textContent = bouquet.flowers[type]; 
    const card = document.getElementById(`flower-${type}`);
    if(bouquet.flowers[type] > 0) {
        card.classList.add('border-[#E11D48]', 'bg-[#FFE4E6]');
        card.classList.remove('border-stone-200/70', 'bg-white');
    } else {
        card.classList.remove('border-[#E11D48]', 'bg-[#FFE4E6]');
        card.classList.add('border-stone-200/70', 'bg-white');
    }
    updatePreview(); 
    calculateTotal(); 
}

function toggleDecoration(type) { 
    document.getElementById(`decor-${type}`)?.classList.toggle('selected'); 
}

function changeDecorationQty(type, delta) { 
    if(!bouquet.decorations[type]) return;
    bouquet.decorations[type] = Math.max(0, bouquet.decorations[type] + delta); 
    document.getElementById(`qty-${type}`).textContent = bouquet.decorations[type]; 
    const card = document.getElementById(`decor-${type}`);
    if(bouquet.decorations[type] > 0) {
        card.classList.add('border-[#E11D48]', 'bg-[#FFE4E6]');
        card.classList.remove('border-stone-200/70', 'bg-white');
    } else {
        card.classList.remove('border-[#E11D48]', 'bg-[#FFE4E6]');
        card.classList.add('border-stone-200/70', 'bg-white');
    }
    updatePreview(); 
    calculateTotal(); 
}

function updatePreview() { 
    const list = document.getElementById('previewList'); 
    if(!list) return;
    
    let items = [], names = {roses:'Розы', tulips:'Тюльпаны', peonies:'Пионы', greenery:'Зелень', wrap:'Упаковка', card:'Открытка'}; 
    Object.entries(bouquet.flowers).forEach(([t, q]) => { if(q > 0) items.push({name: names[t], qty: q, price: flowerPrices[t] * q}); }); 
    Object.entries(bouquet.decorations).forEach(([t, q]) => { if(q > 0) items.push({name: names[t], qty: q, price: decorationPrices[t] * q}); }); 
    
    list.innerHTML = items.length === 0 
        ? '<p class="text-stone-400 font-light text-center py-4">Добавьте элементы слева</p>' 
        : items.map(x => `<div class="preview-item"><span class="text-stone-600">${x.name} <span class="text-stone-400 text-xs ml-1">× ${x.qty}</span></span><span class="font-medium text-stone-900">${x.price} ₽</span></div>`).join(''); 
}

function calculateTotal() { 
    let total = 0; 
    Object.entries(bouquet.flowers).forEach(([k, v]) => total += flowerPrices[k] * v); 
    Object.entries(bouquet.decorations).forEach(([k, v]) => total += decorationPrices[k] * v); 
    if(document.getElementById('delivery')?.checked) total += 300; 
    if(document.getElementById('urgentBouquet')?.checked) total *= 1.2; 
    document.getElementById('totalPrice').textContent = `${Math.round(total).toLocaleString('ru-RU')} ₽`; 
    return Math.round(total); 
}

function resetBouquet() { 
    Object.keys(bouquet.flowers).forEach(t => {
        bouquet.flowers[t] = 0;
        document.getElementById(`qty-${t}`).textContent = '0';
        const c = document.getElementById(`flower-${t}`);
        if(c) {
            c.classList.remove('border-[#E11D48]', 'bg-[#FFE4E6]');
            c.classList.add('border-stone-200/70', 'bg-white');
        }
    }); 
    Object.keys(bouquet.decorations).forEach(t => {
        bouquet.decorations[t] = 0;
        document.getElementById(`qty-${t}`).textContent = '0';
        const c = document.getElementById(`decor-${t}`);
        if(c) {
            c.classList.remove('border-[#E11D48]', 'bg-[#FFE4E6]');
            c.classList.add('border-stone-200/70', 'bg-white');
        }
    }); 
    ['delivery', 'urgentBouquet'].forEach(id => { const e = document.getElementById(id); if(e) e.checked = false; }); 
    updatePreview(); 
    calculateTotal(); 
}

function renderCatalog() { 
    const grid = document.getElementById('bestsellerGrid');
    if(!grid) return;
    
    grid.innerHTML = catalogData.map(i => `
        <div class="product-card">
            <div class="relative h-56 overflow-hidden bg-stone-100">
                <img src="${i.img}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
            </div>
            <div class="p-5">
                <h3 class="font-serif text-base font-medium tracking-tight text-stone-900 mb-1">${i.name}</h3>
                <p class="text-xs text-stone-500 mb-4 font-light truncate">${i.subtitle}</p>
                <div class="flex items-center justify-between mt-auto">
                    <span class="text-sm font-medium text-stone-900">${i.price.toLocaleString('ru-RU')} ₽</span>
                    <button onclick="addToCart('${i.name}', ${i.price})" class="flex items-center justify-center w-8 h-8 bg-stone-50 rounded-lg text-stone-500 hover:bg-[#E11D48] hover:text-white transition-colors border border-stone-200/60 hover:border-transparent">
                        <iconify-icon icon="solar:cart-plus-linear" class="text-lg"></iconify-icon>
                    </button>
                </div>
            </div>
        </div>
    `).join(''); 
}

// Открытие формы заказа из конструктора букетов
function openOrderForm() { 
    const total = calculateTotal();
    if(total === 0 && !cart.length) {
        alert('Добавьте хотя бы один элемент в заказ');
        return;
    }
    
    const bouquetItems = [];
    Object.entries(bouquet.flowers).forEach(([type, qty]) => {
        if(qty > 0) bouquetItems.push(`${type}: ${qty} шт.`);
    });
    Object.entries(bouquet.decorations).forEach(([type, qty]) => {
        if(qty > 0) bouquetItems.push(`${type}: ${qty} шт.`);
    });
    
    let orderSummary = `🌸 БУКЕТ (Конструктор)\n`;
    if(bouquetItems.length > 0) {
        orderSummary += `Состав: ${bouquetItems.join(', ')}\n`;
    }
    if(document.getElementById('delivery')?.checked) orderSummary += `🚚 Доставка: +300 ₽\n`;
    if(document.getElementById('urgentBouquet')?.checked) orderSummary += `⚡ Срочно: +20%\n`;
    orderSummary += `💰 Итого: ${total} ₽`;
    
    const comment = document.getElementById('orderComment');
    if(comment) comment.value = orderSummary;
    
    document.getElementById('orderFormModal')?.classList.add('active');
    
    setTimeout(() => {
        document.getElementById('customerName')?.focus();
    }, 300);
}

// ==========================================
// ФУНКЦИИ КАЛЬКУЛЯТОРА ИНТЕРЬЕРА (interior.html)
// ==========================================

function syncAreaFromSlider(value) { 
    const num = parseInt(value) || 1; 
    const input = document.getElementById('areaInput');
    if(input) input.value = num;
    calculateInteriorPrice(); 
}

function syncAreaFromInput(value) { 
    let num = parseInt(value); 
    if(isNaN(num) || num < 1) num = 1; 
    if(num > 500) num = 500; 
    const range = document.getElementById('areaRange');
    if(range) range.value = num;
    calculateInteriorPrice(); 
}

function selectDensity(type, rate) { 
    interiorDensity = type; 
    interiorRate = rate; 
    document.querySelectorAll('.density-btn')?.forEach(btn => { 
        btn.classList.remove('border-[#10B981]', 'bg-[#ECFDF5]', 'selected'); 
        btn.classList.add('border-stone-200', 'bg-white'); 
    });
    const activeBtn = document.getElementById(`density-${type}`);
    if(activeBtn) {
        activeBtn.classList.add('border-[#10B981]', 'bg-[#ECFDF5]', 'selected'); 
        activeBtn.classList.remove('border-stone-200', 'bg-white');
    }
    const label = document.getElementById('densityLabel');
    if(label) label.textContent = {light:'точечное', medium:'стандартное', dense:'плотное'}[type]; 
    showPortfolio(type); 
    calculateInteriorPrice(); 
}

function showPortfolio(type) { 
    const section = document.getElementById('portfolioSection'); 
    const grid = document.getElementById('portfolioGrid'); 
    if(!section || !grid) return;
    
    section.classList.remove('hidden'); 
    grid.innerHTML = portfolioData[type].map(item => `
        <div class="portfolio-item bg-white border border-stone-200/60 rounded-2xl overflow-hidden group">
            <div class="overflow-hidden h-36">
                <img src="${item.img}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
            </div>
            <div class="p-4">
                <div class="text-sm font-medium text-stone-900 mb-0.5">${item.title}</div>
                <div class="text-xs text-stone-500 font-light truncate">${item.desc}</div>
            </div>
        </div>
    `).join('');
    grid.querySelectorAll('.portfolio-item').forEach(el => el.classList.remove('show'));
    setTimeout(() => { 
        grid.querySelectorAll('.portfolio-item').forEach((item, idx) => { 
            setTimeout(() => item.classList.add('show'), idx * 100); 
        }); 
    }, 50); 
}

function calculateInteriorPrice() { 
    const area = parseInt(document.getElementById('areaRange')?.value) || 1; 
    let price = area * interiorRate; 
    if(document.getElementById('urgentInterior')?.checked) price *= 1.2; 
    interiorBasePrice = Math.max(5000, Math.round(price)); 
    document.getElementById('interiorTotalPrice').textContent = `от ${interiorBasePrice.toLocaleString('ru-RU')} ₽`; 
    return interiorBasePrice; 
}

// Открытие формы заказа из калькулятора интерьера
function openOrderFormInterior() { 
    const area = document.getElementById('areaInput')?.value || 50;
    const total = calculateInteriorPrice();
    
    let orderSummary = `🏢 ИНТЕРЬЕР (Калькулятор)\n`;
    orderSummary += `Площадь: ${area} м²\n`;
    orderSummary += `Густота: ${document.getElementById('densityLabel')?.textContent}\n`;
    
    const options = [];
    if(document.getElementById('decoratorVisit')?.checked) options.push('Выезд декоратора');
    if(document.getElementById('legalEntity')?.checked) options.push('Работа с юрлицом');
    if(document.getElementById('urgentInterior')?.checked) options.push('Срочно (+20%)');
    
    if(options.length > 0) {
        orderSummary += `Опции: ${options.join(', ')}\n`;
    }
    orderSummary += `💰 Ориентировочно: от ${total} ₽`;
    
    const comment = document.getElementById('orderComment');
    if(comment) comment.value = orderSummary;
    
    document.getElementById('orderFormModal')?.classList.add('active');
    
    setTimeout(() => {
        document.getElementById('customerName')?.focus();
    }, 300);
}

// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================
document.addEventListener('DOMContentLoaded', () => { 
    // Обновление бейджа корзины при загрузке
    updateCartBadge();
    
    // Инициализация для страницы букетов
    if(document.getElementById('bouquetPage')) {
        selectCategory('bouquet'); 
        renderCatalog();
    }
    
    // Инициализация для страницы интерьера
    if(document.getElementById('interiorPage')) {
        selectDensity('light', 1000); 
    }
    
    // Закрытие модалок по клику на фон
    document.querySelectorAll('.modal').forEach(modal => { 
        modal.addEventListener('click', (e) => { 
            if(e.target === modal) {
                if(modal.id === 'orderFormModal') closeOrderForm();
                else if(modal.id === 'successModal') closeSuccessModal();
                else if(modal.id === 'cartModal') toggleCart();
            }
        }); 
    });
    
    // Закрытие модалок по Escape
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                if(modal.id === 'orderFormModal') closeOrderForm();
                else if(modal.id === 'successModal') closeSuccessModal();
                else if(modal.id === 'cartModal') toggleCart();
            });
        }
    });
});
