# NGINX Static Server

This is a little docker image for histing static content efficiently.
Supports ETags & Brotli/GZip compression out of the box.

## Quickstart 🚀

```yaml
# docker-compose.yml
version: '3.7'

services:
  server:
    image: cupcakearmy/static
    restart: unless-stopped
    ports:
      - 80:80
    volumes:
      - ./public:/srv:ro
```

```bash
docker-compose up -d
```

### Custom Configuration

```
# my.conf
server {
    listen 80;
    server_name _;

    location / {
        root   /srv;
        try_files $uri /index.html =404;
    }
}
```

```yaml
version: '3.7'

services:
  server:
    # ...
    volumes:
      - ./my.conf:/usr/local/nginx/conf/sites/default.conf
    # ...
```
