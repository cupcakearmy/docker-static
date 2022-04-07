# NGINX Static Server

![Docker Pulls](https://img.shields.io/docker/pulls/cupcakearmy/static?style=flat-square)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/cupcakearmy/static/latest?style=flat-square)
![Docker Image Version (tag latest semver)](https://img.shields.io/docker/v/cupcakearmy/static/latest?style=flat-square)

This is a little docker image for histing static content efficiently.
**Supports ETags & Brotli/GZip** compression out of the box.

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
