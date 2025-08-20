const $ = (sel) => document.querySelector(sel);
let noteId = null;
let saveTimer = null;

window.notesAPI.onInit((note) => {
  noteId = note.id;
  $('#content').innerHTML = note.content || '';
  $('#opacity').value = note.opacity || 0.92;
});

function debounceSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const content = $('#content').innerHTML;
    window.notesAPI.update({ id: noteId, content });
  }, 250);
}

$('#content').addEventListener('input', debounceSave);

$('#opacity').addEventListener('input', (e) => {
  const opacity = Number(e.target.value);
  window.notesAPI.setOpacity({ id: noteId, opacity });
});

$('#btnDelete').addEventListener('click', () => {
  window.notesAPI.delete(noteId);
});

$('#btnNew').addEventListener('click', () => {
  const old = $('#content').innerHTML;
  $('#content').innerHTML = old + (old ? '<br>' : '') + '<i>Tip: Press Ctrl/Cmd+Alt+N to create a new note.</i>';
  debounceSave();
});
