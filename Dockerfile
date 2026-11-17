FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html style.css app.js data.js /usr/share/nginx/html/
COPY vendor /usr/share/nginx/html/vendor

EXPOSE 80
