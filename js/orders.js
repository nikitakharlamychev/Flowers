const KEY = 'vanilla_orders';
export const STATUS = { PENDING: 'pending', READY: 'ready', DELIVERED: 'delivered' };
export const STATUS_LABELS = { pending: 'Принят', ready: 'Готов', delivered: 'Доставлен' };

function get() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); window.dispatchEvent(new Event('orders:sync')); }
function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

export async function create(data) {
  const list = get();
  const order = { id: id(), ...data, status: STATUS.PENDING, createdAt: new Date().toISOString() };
  list.unshift(order); save(list); return order;
}
export async function updateStatus(orderId, newStatus) {
  const list = get();
  const order = list.find(o => o.id === orderId);
  if (!order) throw new Error('Заказ не найден');
  order.status = newStatus; order.updatedAt = new Date().toISOString();
  save(list);
}

export function subscribe(callback) {
  const sync = () => callback(get());
  window.addEventListener('storage', e => { if (e.key === KEY) sync(); });
  window.addEventListener('orders:sync', sync);
  sync();
  return () => { window.removeEventListener('storage', sync); window.removeEventListener('orders:sync', sync); };
}

export const fmtPrice = n => new Intl.NumberFormat('ru-RU', { style:'currency', currency:'RUB' }).format(n||0);
export const fmtDate = iso => new Date(iso).toLocaleString('ru-RU', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
export const badge = s => {
  const m = { pending:{t:'Принят',c:'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}, ready:{t:'Готов',c:'bg-green-500/20 text-green-400 border-green-500/30'}, delivered:{t:'Доставлен',c:'bg-blue-500/20 text-blue-400 border-blue-500/30'} };
  const {t,c} = m[s]||m.pending;
  return `<span class="px-2 py-1 rounded-full text-xs font-medium border ${c}">${t}</span>`;
};
