# Сайт Lotsman Analytics

Лендинг ИП Lotsman Analytics: внедрение amoCRM и Битрикс24, калькулятор потерь, пакеты (без цен),
гарантии, реквизиты и политика конфиденциальности (нужна для проверки WhatsApp Business API в Wazzup и Meta).

## Что внутри

| Файл                  | Что это                                                                  |
| --------------------- | ------------------------------------------------------------------------ |
| `index.html`          | Главная страница                                                         |
| `privacy/index.html`  | Политика конфиденциальности (`/privacy/`), в т. ч. пункт 5 о рассылках   |
| `404.html`            | Страница «не найдено»                                                    |
| `assets/styles.css`   | Стили по бренд-гайду (Ночь / Песок / Янтарь), светлая и тёмная тема      |
| `assets/site.js`      | Меню, анимации при прокрутке, калькулятор потерь, нижняя кнопка на телефоне |
| `assets/fonts/`       | Montserrat и Inter, свои файлы — сайт не ходит на сторонние серверы      |
| `assets/og.jpg`       | Картинка для превью ссылки в WhatsApp и Telegram                         |
| `Caddyfile`, `Dockerfile` | Веб-сервер Caddy для Railway                                         |

Сайт статический: сборки нет, правки делаются прямо в HTML.

## Подвал для проверки Meta

Блок «Реквизиты» в подвале совпадает с бизнес-портфолио Meta (ID 1103492265369557) символ в символ:

```
Наименование: ИП Lotsman Analytics
Адрес: Ораз Жандосов көшесі 98, Алматы, Almaty 050042, Казахстан
Телефон: +77064203259
```

В «Контактах» — номер для клиентов и WhatsApp `+77007759815`, почта и ссылка на `/privacy/`.
Если в портфолио что-то поменяется, правьте подвал (`index.html`, `privacy/index.html`, `404.html`) и
таблицу в разделе 1 политики.

## Локальный просмотр

```bash
python3 -m http.server 8000   # затем открыть http://localhost:8000
```

## Публикация

Railway, проект `lotsman-site`: сервис собирается из `Dockerfile` этого репозитория. Порт берётся из
`$PORT`, HTTPS выдаёт Railway.

### Домен lotsman.kz

Домен куплен в ps.kz, DNS-зона — на серверах ps.kz. В Railway добавлены `lotsman.kz` и `www.lotsman.kz`,
сертификаты выпущены. `www.lotsman.kz` переадресуется на `https://lotsman.kz` (см. `Caddyfile`).

| Тип   | Имя (хост)             | Значение                                                                  |
| ----- | ---------------------- | ------------------------------------------------------------------------- |
| A     | `@` (lotsman.kz)       | `69.46.46.91` — IP адреса `u6rqhqtv.up.railway.app`                       |
| TXT   | `_railway-verify`      | `railway-verify=42856135212e9f834d9cb4d5fdbda11e562919d3fafd49e760948d842e3317ea` |
| CNAME | `www`                  | `z7ab4rp3.up.railway.app`                                                 |
| TXT   | `_railway-verify.www`  | `railway-verify=795243b5cca335790feb4d1973ba5bcd7165c2ff994c017dfb2197e000ac15cc` |

Корень домена смотрит на Railway через A-запись: DNS ps.kz не даёт CNAME на `@`. Railway официально
поддерживает для корня только CNAME flattening или ALIAS, поэтому если Railway сменит IP, lotsman.kz
перестанет открываться (www продолжит работать). Проверка: `u6rqhqtv.up.railway.app` должен
резолвиться в тот же IP, что и `lotsman.kz`. Надёжное решение — перенести DNS на Cloudflare и поставить
CNAME `@` → `u6rqhqtv.up.railway.app`.

Запись `mail.lotsman.kz` из шаблона ps.kz тоже указывает на IP сайта, поэтому почта на `@lotsman.kz`
сейчас не работает. Для доменной почты её нужно настроить отдельно.

Статус домена и сертификата: Railway → проект `lotsman-site` → сервис `web` → Settings → Networking.

### Подтверждение домена в Meta

Meta Business Manager → Настройки компании → Безопасность бренда → Домены → «Добавить» → способ
«Мета-тег». Скопированный тег `<meta name="facebook-domain-verification" ...>` вставить в `<head>`
файла `index.html` и выложить.

## Лицензии

Шрифты Inter и Montserrat распространяются по SIL Open Font License 1.1, иконки — Lucide (ISC).
