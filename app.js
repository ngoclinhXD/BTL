(() => {

const content = document.getElementById('content');
const pageStyle = document.createElement('link');
pageStyle.rel = 'stylesheet';
pageStyle.id = 'page-style';
document.head.append(pageStyle);

let cleanupCurrentPage = () => {};

function loadPage() {
  const page = location.hash.slice(1) || 'booking';

  cleanupCurrentPage();
  cleanupCurrentPage = () => {};
  const definition = window.pages[page];
  if (definition) {
    content.innerHTML = definition.html;
    pageStyle.href = `pages/${page}/${page}.css`;
    cleanupCurrentPage = definition.init() || (() => {});
  } else {
    pageStyle.removeAttribute('href');
    content.innerHTML = '<p class="page-message">Trang này chưa được bổ sung.</p>';
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
}

document.querySelectorAll('.nav-item').forEach(link => {
  link.href = `#${link.dataset.page}`;
});

document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.body.classList.toggle('sidebar-collapsed');
});

window.addEventListener('hashchange', loadPage);
if (!location.hash) location.replace(`${location.href.split('#')[0]}#booking`);
loadPage();
})();
