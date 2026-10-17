(function(){
/**
 * Handles the context menu trigger to block it.
 * @param {Event} event The event data.
 * @returns {Boolean} true
 */
function onContextMenu(event) {
  event.preventDefault();
  return true;
}

// set a context menu handler
document.addEventListener('contextmenu', onContextMenu);

function unregister() {
  document.removeEventListener('contextmenu', onContextMenu);
}
window.unregister = unregister;
}());
