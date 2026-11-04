(function () {
  var BASE = 'https://cdn.jsdelivr.net/gh/evgeniihram/temple-patrons@main';
  var nodes = document.querySelectorAll('[data-patron-widget]');
  if (!nodes.length) return;

  function load() {
    return Promise.all([
      fetch(BASE + '/patrons.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }),
      fetch(BASE + '/daily.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; })
    ]);
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateKey(d) { d = d || new Date(); return pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fullKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  function findToday(patrons, key) {
    return patrons.filter(function (p) { return p.feastDays.indexOf(key) !== -1; });
  }

  function findNext(patrons, fromDate) {
    var d = new Date(fromDate);
    for (var i = 1; i <= 366; i++) {
      d.setDate(d.getDate() + 1);
      var key = dateKey(d);
      var found = findToday(patrons, key);
      if (found.length) return { date: new Date(d), patrons: found, days: i };
    }
    return null;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function render(node, data, daily) {
    var mode = node.getAttribute('data-patron-widget') || 'today';
    var box = el('div', 'patron-widget-box');
    var patrons = (data && data.patrons) || [];
    var key = dateKey();
    var todays = [];
    var todayFull = fullKey();

    if (daily && daily.date === todayFull && daily.patrons && daily.patrons.length) {
      todays = daily.patrons;
    } else {
      todays = findToday(patrons, key);
    }

    if (mode === 'full') {
      var list = el('ul', 'patron-list');
      patrons.slice().sort(function (a, b) {
        return a.feastDays[0] < b.feastDays[0] ? -1 : 1;
      }).forEach(function (p) {
        var li = el('li', 'patron-item');
        li.appendChild(el('span', 'patron-date', p.feastDays.join(', ')));
        li.appendChild(el('span', 'patron-name', p.name));
        if (p.description) li.appendChild(el('span', 'patron-desc', p.description));
        list.appendChild(li);
      });
      box.appendChild(list);
    } else {
      if (todays.length) {
        box.appendChild(el('div', 'patron-label', 'Сегодня, ' + todayFull));
        todays.forEach(function (p) {
          box.appendChild(el('div', 'patron-name', p.name));
          if (p.description) box.appendChild(el('div', 'patron-desc', p.description));
        });
      } else {
        var nxt = findNext(patrons, new Date());
        if (nxt) {
          box.appendChild(el('div', 'patron-label', 'Ближайший поминальный день через ' + nxt.days + ' дн., ' + fullKey(nxt.date)));
          nxt.patrons.forEach(function (p) {
            box.appendChild(el('div', 'patron-name', p.name));
            if (p.description) box.appendChild(el('div', 'patron-desc', p.description));
          });
        } else {
          box.appendChild(el('div', 'patron-empty', 'Нет данных'));
        }
      }
    }
    node.textContent = '';
    node.appendChild(box);
  }

  load().then(function (res) {
    var data = res[0], daily = res[1];
    nodes.forEach(function (n) {
      try { render(n, data, daily); } catch (e) { n.textContent = 'Ошибка виджета'; }
    });
  }).catch(function () {
    nodes.forEach(function (n) { n.textContent = 'Не удалось загрузить покровителей'; });
  });
})();