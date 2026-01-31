// ===== Utilities: close menus on outside click or Escape =====
function closeAllMenus() {
  // Close dropdowns
  document.querySelectorAll('.dropdown-content.open').forEach(m => m.classList.remove('open'));
  document.querySelectorAll('.dropbtn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));

  // Close filter menu (kept as-is)
  const filterButton = document.getElementById('filter-button');
  if (filterButton) filterButton.setAttribute('aria-expanded', 'false');
  document.getElementById('filter-menu')?.classList.remove('open');
}

document.addEventListener('click', (e) => {
  const isToggle        = e.target.closest('.dropbtn');             // updated
  const isMenu          = e.target.closest('.dropdown-content');    // updated
  const isFilterToggle  = e.target.closest('#filter-button');       // unchanged
  const isFilterMenu    = e.target.closest('#filter-menu');         // unchanged

  if (!isToggle && !isMenu && !isFilterToggle && !isFilterMenu) {
    closeAllMenus();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllMenus();
});

// ===== Left dropdowns (click-to-toggle; one open at a time) =====
document.querySelectorAll('.dropdown .dropbtn').forEach((btn) => {
  btn.addEventListener('click', () => {
    // New structure: the menu is the immediate sibling with class .dropdown-content
    const menu = btn.nextElementSibling;
    if (!menu || !menu.classList.contains('dropdown-content')) return;

    const isOpen = menu.classList.contains('open');
    closeAllMenus();
    if (!isOpen) {
      menu.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');

      // Focus first actionable item
      const firstItem = menu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
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