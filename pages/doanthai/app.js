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

document.querySelectorAll('.status-select').forEach(select => {
  const statusClasses = ['status-active', 'status-maintenance', 'status-inactive'];

  const updateStatusColour = () => {
    select.classList.remove(...statusClasses);
    select.classList.add(`status-${select.value}`);
  };

  updateStatusColour();
  select.addEventListener('change', updateStatusColour);
});

/* Modal */
const modals = document.querySelectorAll(".modal");
const theaterNames = document.querySelectorAll(".theaterName");

theaterNames.forEach((theaterName, index) => {
  theaterName.addEventListener("click", () => {
    modals[index].style.display = "flex";
  });
});

modals.forEach(modal => {
  const closeButton = modal.querySelector(".close");

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
