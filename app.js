document.addEventListener('DOMContentLoaded', () => {

  /* --- Sidebar nav active state --- */
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
    });
  });

  /* --- Sidebar toggle collapse --- */
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
  });

});