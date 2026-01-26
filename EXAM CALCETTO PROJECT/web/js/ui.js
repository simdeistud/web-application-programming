// ===== Utilities: close menus on outside click or Escape =====
function closeAllMenus() {
    document.querySelectorAll('.menu.open').forEach(m => m.classList.remove('open'));
    document.querySelectorAll('.drop-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    const filterButton = document.getElementById('filter-button');
    if (filterButton) filterButton.setAttribute('aria-expanded', 'false');
    document.getElementById('filter-menu')?.classList.remove('open');
}
document.addEventListener('click', (e) => {
    const isToggle = e.target.closest('.drop-btn');
    const isMenu = e.target.closest('.menu');
    const isFilterToggle = e.target.closest('#filter-button');
    const isFilterMenu = e.target.closest('#filter-menu');
    if (!isToggle && !isMenu && !isFilterToggle && !isFilterMenu) {
        closeAllMenus();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllMenus();
});

// ===== Left dropdowns =====
document.querySelectorAll('.dropdown .drop-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const menuId = btn.getAttribute('aria-controls');
        const menu = document.getElementById(menuId);
        const isOpen = menu.classList.contains('open');
        closeAllMenus();
        if (!isOpen) {
            menu.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            const firstItem = menu.querySelector('[role="menuitem"]');
            if (firstItem) firstItem.focus({ preventScroll: true });
        }
    });
});

// ===== Search filter =====
const filterButton = document.getElementById('filter-button');
const filterMenu = document.getElementById('filter-menu');
const filterLabel = document.getElementById('filter-label');
const filterValue = document.getElementById('filter-value');

if (filterButton && filterMenu) {
    filterButton.addEventListener('click', () => {
        const isOpen = filterMenu.classList.contains('open');
        closeAllMenus();
        if (!isOpen) {
            filterMenu.classList.add('open');
            filterButton.setAttribute('aria-expanded', 'true');
            const first = filterMenu.querySelector('.filter-option');
            if (first) first.focus({ preventScroll: true });
        }
    });

    filterMenu.querySelectorAll('.filter-option').forEach((opt) => {
        opt.addEventListener('click', () => {
            const v = opt.dataset.value;
            filterLabel.textContent = v.toUpperCase();
            filterValue.value = v;
            closeAllMenus();
        });
    });
}

// ===== Demo-only search handler (prevent full reload) =====
function handleSearchSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams(new FormData(e.target));
    alert('QUERY EXECUTED: ' + params.toString());
    return false;
}
window.handleSearchSubmit = handleSearchSubmit;

// ===== AUTH SWITCH (for reference only; not executed) =====
// Example:
// const isAuthenticated = false; // toggle as needed from server template
// if (isAuthenticated) {
//   document.getElementById('btn-login')?.replaceWith(Object.assign(document.createElement('a'), {
//     className: 'btn',
//     href: '/profile',
//     id: 'btn-profile',
//     textContent: '[ MY PROFILE ]'
//   }));
//   document.getElementById('btn-register')?.replaceWith(Object.assign(document.createElement('a'), {
//     className: 'btn',
//     href: '/logout',
//     id: 'btn-logout',
//     textContent: '[ LOGOUT ]'
//   }));
// }