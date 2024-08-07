# BUILDER
FROM alpine:3 AS builder

ARG DEP_DEV="alpine-sdk zlib-dev pcre-dev openssl-dev gd-dev curl"
RUN apk add --no-cache ${DEP_DEV}

WORKDIR /build
ARG NGINX
RUN curl https://nginx.org/download/nginx-${NGINX}.tar.gz | tar xz
RUN mv nginx-${NGINX} nginx
RUN git clone --recursive https://github.com/google/ngx_brotli.git

WORKDIR /build/nginx
ARG NGINX_MODULES="--with-http_realip_module --with-threads --with-http_ssl_module --with-http_v2_module --with-http_image_filter_module --with-http_gzip_static_module --with-http_secure_link_module"
RUN ./configure ${NGINX_MODULES} --add-module=../ngx_brotli
RUN make
RUN make install


# RUNNER
FROM alpine

ARG DEP_RUN="pcre openssl gd tzdata"

COPY --from=builder /usr/local/nginx /usr/local/nginx
RUN apk add --no-cache ${DEP_RUN} \
	&& ln -sf /dev/stdout /usr/local/nginx/logs/access.log \
	&& ln -sf /dev/stderr /usr/local/nginx/logs/error.log
COPY ./conf/nginx.conf /usr/local/nginx/conf/nginx.conf
COPY ./conf/default.conf /usr/local/nginx/conf/sites/default.conf

EXPOSE 80
STOPSIGNAL SIGTERM
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]
