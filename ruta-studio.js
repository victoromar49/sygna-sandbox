(function () {
  var KEY = "ruta-studio-v1";
  var items = {
    "RT-1041": "Calle Mayor 12",
    "RT-1042": "Av. del Puerto 48",
    "RT-1043": "Plaza Norte 3"
  };
  var IN_ROUTE = "En ruta", DONE = "Entregada";
  var state = { selected: "RT-1042", saved: {}, drafts: {} };
  try {
    var raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && items[raw.selected]) state = raw;
  } catch (e) {}
  state.saved = state.saved || {};
  state.drafts = state.drafts || {};

  var $ = function (id) { return document.getElementById(id); };
  var note = $("note");

  function savedOf(id) {
    return state.saved[id] || { status: IN_ROUTE, note: "" };
  }
  function draftOf(id) {
    return state.drafts[id] || savedOf(id);
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function dirty(id) {
    var s = savedOf(id), d = draftOf(id);
    return s.status !== d.status || s.note !== d.note;
  }

  function render(msg) {
    var id = state.selected, s = savedOf(id), d = draftOf(id);
    document.querySelectorAll(".item").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.id === id));
    });
    $("d-title").textContent = id;
    $("d-address").textContent = items[id];
    $("selection-text").textContent = id;
    $("saved-status").textContent = s.status;
    $("saved-status").className = s.status === DONE ? "done" : "";
    $("status-icon").hidden = s.status !== DONE;
    $("saved-note").textContent = s.note || "Sin nota guardada";
    $("draft-status").textContent = d.status;
    $("toggle-status").textContent = d.status === DONE ? "Volver a En ruta" : "Marcar como Entregada";
    if (note.value !== d.note) note.value = d.note;
    $("count").textContent = d.note.length;
    $("draft-flag").textContent = dirty(id) ? "Borrador sin guardar" : "Sin cambios";
    var m = $("save-msg");
    m.className = msg ? "ok" : "";
    m.textContent = msg || (dirty(id) ? "Cambios pendientes de guardar" : "Sin cambios pendientes");
  }

  document.querySelectorAll(".item").forEach(function (b) {
    b.addEventListener("click", function () {
      state.selected = b.dataset.id;
      persist();
      render();
    });
  });
  $("toggle-status").addEventListener("click", function () {
    var id = state.selected, d = draftOf(id);
    state.drafts[id] = { status: d.status === DONE ? IN_ROUTE : DONE, note: d.note };
    persist();
    render();
  });
  note.addEventListener("input", function () {
    var id = state.selected, d = draftOf(id);
    state.drafts[id] = { status: d.status, note: note.value };
    persist();
    render();
  });
  $("save").addEventListener("click", function () {
    var id = state.selected, d = draftOf(id);
    state.saved[id] = { status: d.status, note: d.note };
    delete state.drafts[id];
    persist();
    render("Guardado en este dispositivo");
  });

  render();
})();
