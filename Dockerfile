FROM caddy:2.10-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html 404.html favicon.svg robots.txt /srv/
COPY privacy /srv/privacy
COPY assets /srv/assets
