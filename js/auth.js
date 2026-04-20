export function getRole() { return localStorage.getItem('vanilla_role'); }
export function requireRole(role) {
  if (getRole() !== role) { window.location.href = 'index.html'; return false; }
  document.documentElement.setAttribute('data-role', role);
  return true;
}
export function setRole(role) {
  localStorage.setItem('vanilla_role', role);
  document.documentElement.setAttribute('data-role', role);
  const pages = { user: 'user.html', worker: 'worker.html', dev: 'dev.html' };
  window.location.href = pages[role];
}
export function logout() {
  localStorage.removeItem('vanilla_role');
  window.location.href = 'index.html';
}
