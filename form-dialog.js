(() => {
  const dialogs = document.querySelectorAll('dialog.form-dialog');
  const dismiss = dialog => {
    if (dialog.dispatchEvent(new Event('cancel', { cancelable: true }))) dialog.close();
  };
  dialogs.forEach(dialog => {
    const outside = event => {
      const bounds = dialog.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom;
    };
    let startedOutside = false;
    dialog.addEventListener('pointerdown', event => { startedOutside = outside(event); });
    dialog.addEventListener('click', event => {
      if (startedOutside && outside(event)) dismiss(dialog);
      startedOutside = false;
    });
  });
  if (window.parent === window) return;
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.data?.type !== 'CLOSE_FORM_DIALOG') return;
    dialogs.forEach(dialog => { if (dialog.open) dismiss(dialog); });
  });
  const updateBackdrop = () => window.parent.postMessage({
    type: 'FORM_DIALOG_STATE',
    open: Boolean(document.querySelector('dialog.form-dialog[open]'))
  }, '*');
  const observer = new MutationObserver(updateBackdrop);
  dialogs.forEach(dialog => observer.observe(dialog, { attributes: true, attributeFilter: ['open'] }));
  updateBackdrop();
})();
