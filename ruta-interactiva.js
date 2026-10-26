(function () {
  var KEY = 'ruta-interactiva-v1';
  var base = [
    { id: '1', code: 'RT-1041', dest: 'Calle Mayor 12, Valencia', estado: 'En ruta', nota: 'Sin nota' },
    { id: '2', code: 'RT-1042', dest: 'Av. del Puerto 80, Valencia', estado: 'En ruta', nota: 'Sin nota' }
  ];
  var data = { selected: '1', items: base };
  try {
    var raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && Array.isArray(raw.items) && raw.items.length === 2) data = raw;
  } catch (e) {}

  var $ = function (id) { return document.getElementById(id); };
  var draftEstado = '';

  function current() {
    return data.items.filter(function (i) { return i.id === data.selected; })[0] || data.items[0];
  }

  function render() {
    var it = current();
    draftEstado = it.estado;
    data.items.forEach(function (i) {
      var chip = $('chip-' + i.id);
      chip.textContent = i.estado;
      chip.className = 'chip' + (i.estado === 'Entregada' ? ' ok' : '');
      var b = $('btn-entrega-' + i.id);
      if (i.id === it.id) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    $('texto-seleccion').textContent = it.code;
    $('texto-destino').textContent = it.dest;
    $('texto-estado-guardado').textContent = it.estado;
    $('texto-nota-guardada').textContent = it.nota;
    $('campo-nota').value = it.nota === 'Sin nota' ? '' : it.nota;
    pressed();
  }

  function pressed() {
    $('btn-estado-en-ruta').setAttribute('aria-pressed', String(draftEstado === 'En ruta'));
    $('btn-estado-entregada').setAttribute('aria-pressed', String(draftEstado === 'Entregada'));
  }

  function say(msg, done) {
    var c = $('texto-confirmacion');
    c.textContent = msg;
    c.className = 'confirm' + (done ? ' done' : '');
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
  }

  data.items.forEach(function (i) {
    $('btn-entrega-' + i.id).addEventListener('click', function () {
      data.selected = i.id;
      persist();
      render();
      say('Sin cambios pendientes', false);
    });
  });

  ['btn-estado-en-ruta', 'btn-estado-entregada'].forEach(function (id) {
    $(id).addEventListener('click', function () {
      draftEstado = $(id).getAttribute('data-estado');
      pressed();
      say('Cambios sin guardar', false);
    });
  });

  $('campo-nota').addEventListener('input', function () {
    say('Cambios sin guardar', false);
  });

  $('btn-guardar').addEventListener('click', function () {
    var it = current();
    it.estado = draftEstado;
    it.nota = $('campo-nota').value.trim() || 'Sin nota';
    data.selected = it.id;
    var ok = persist();
    render();
    say(ok ? 'Guardado: ' + it.code + ' · ' + it.estado : 'No se pudo guardar en este navegador', ok);
  });

  render();
})();
