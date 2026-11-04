temple-patrons

Публичные данные о небесных покровителях храма и готовый виджет для вставки на сайт.

Адрес данных

https://ТВОЙ-ЛОГИН.github.io/temple-patrons/patrons.json
https://ТВОЙ-ЛОГИН.github.io/temple-patrons/daily.json

Формат patrons.json

version — версия схемы, сейчас 1.
updated — дата последнего ручного обновления.
patrons — массив записей, у каждой:
  id — уникальный идентификатор латиницей.
  name — полное имя с саном.
  shortName — короткое имя.
  rank — сан или чин.
  feastDays — массив дней памяти в формате MM-DD. У одного святого может быть несколько дней.
  description — краткое описание, необязательное.
  link — ссылка на подробности, необязательная.

Формат daily.json

date — дата в формате YYYY-MM-DD.
patrons — массив записей, у которых сегодня день памяти. Может быть пустым.

Как вставить виджет на сайт

В нужном месте HTML:

<div data-patron-widget></div>
<script src="https://ТВОЙ-ЛОГИН.github.io/temple-patrons/widget.js" defer></script>

Чтобы показать весь список, а не только сегодняшнего:

<div data-patron-widget="full"></div>

Можно вставить два блока с разными значениями атрибута, скрипт подхватит оба.

Как вставить через iframe

<iframe src="https://ТВОЙ-ЛОГИН.github.io/temple-patrons/widget.html" width="100%" height="400" style="border:0"></iframe>

Лицензия

MIT, см. LICENSE.