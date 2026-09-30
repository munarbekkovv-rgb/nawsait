# Сайт Lotsman Analytics

Лендинг ИП LOTSMAN ANALYTICS: внедрение amoCRM и Битрикс24, тарифы, гарантии, реквизиты и политика
конфиденциальности (нужна для проверки WhatsApp Business API в Wazzup и Meta).

## Что внутри

| Файл                  | Что это                                                                  |
| --------------------- | ------------------------------------------------------------------------ |
| `index.html`          | Главная страница                                                         |
| `privacy/index.html`  | Политика конфиденциальности (`/privacy/`), в т. ч. пункт 5 о рассылках   |
| `404.html`            | Страница «не найдено»                                                    |
| `assets/styles.css`   | Стили по бренд-гайду (Ночь / Песок / Янтарь), светлая и тёмная тема      |
| `assets/fonts/`       | Montserrat и Inter, свои файлы — сайт не ходит на сторонние серверы      |
| `assets/og.png`       | Картинка для превью ссылки в WhatsApp и Telegram                         |
| `Caddyfile`, `Dockerfile` | Веб-сервер Caddy для Railway                                         |

Сайт статический: сборки нет, правки делаются прямо в HTML.

## Подвал для проверки Meta

В подвале каждой страницы: юридическое наименование `ИП LOTSMAN ANALYTICS`, юридический адрес,
БИН (ИИН), банковские реквизиты, телефон, e-mail и ссылка на `/privacy/`. Наименование и адрес должны
совпадать с документами один в один — если в документах написано иначе, правьте подвал
(`index.html`, `privacy/index.html`, `404.html`) и таблицу в разделе 1 политики.

## Локальный просмотр

```bash
python3 -m http.server 8000   # затем открыть http://localhost:8000
```

## Публикация

Railway, проект `lotsman-site`: сервис собирается из `Dockerfile` этого репозитория. Порт берётся из
`$PORT`, HTTPS выдаёт Railway.

### Домен lotsman.kz

Домен куплен в ps.kz и добавлен в Railway (`lotsman.kz` и `www.lotsman.kz`). В DNS-зоне домена нужны
записи:

| Тип   | Имя (хост)             | Значение                                                                  |
| ----- | ---------------------- | ------------------------------------------------------------------------- |
| CNAME | `@` (lotsman.kz)       | `u6rqhqtv.up.railway.app`                                                 |
| TXT   | `_railway-verify`      | `railway-verify=42856135212e9f834d9cb4d5fdbda11e562919d3fafd49e760948d842e3317ea` |
| CNAME | `www`                  | `z7ab4rp3.up.railway.app`                                                 |
| TXT   | `_railway-verify.www`  | `railway-verify=795243b5cca335790feb4d1973ba5bcd7165c2ff994c017dfb2197e000ac15cc` |

Railway принимает для корня домена только CNAME с «выравниванием» (CNAME flattening) или ALIAS. Если
DNS ps.kz не даёт создать CNAME на `@`, домен переводят на бесплатный DNS Cloudflare (у него это
выравнивание есть) и заводят те же записи там.

Статус домена и сертификата: Railway → проект `lotsman-site` → сервис `web` → Settings → Networking.

### Подтверждение домена в Meta

Meta Business Manager → Настройки компании → Безопасность бренда → Домены → «Добавить» → способ
«Мета-тег». Скопированный тег `<meta name="facebook-domain-verification" ...>` вставить в `<head>`
файла `index.html` и выложить.

## Лицензии

Шрифты Inter и Montserrat распространяются по SIL Open Font License 1.1, иконки — Lucide (ISC).
