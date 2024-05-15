[Webサーバ：Nginxの起動] ポート80番
sudo service nginx restart

[バックエンド1：Djangoの起動] ポート8000番 /api, /admin
cd ~/ysm_app/project
python3 manage.py runserver

[バックエンド2：経路探索プログラムの起動] ポート8081番
cd ~/ysm_app/tsp
python3 main.py

[フロントエンド：Vueの起動] ポート8080番 /, /ws
cd ~/ysm_app/vue
npm run serve

======
「nginxの設定例」

server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name _;

        ### Frontend
        ## Vue
        location / {
                proxy_pass http://localhost:8080/;
        }
        location /ws {
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_redirect http:// https://;
                proxy_pass http://localhost:8080/;
        }



        ### Backend
        ## Django
        location /admin {
                proxy_pass http://localhost:8000/admin;
        }
        location /api {
                proxy_pass http://localhost:8000/api;
        }


        ## Python
        location /tspapi {
               add_header Access-Control-Allow-Origin "*" always;
               add_header Access-Control-Allow-Methods "POST, GET, OPTIONS";
               add_header Access-Control-Allow-Headers "Origin, Authorization, \
Accept";
               add_header Access-Control-Allow-Credentials true;
               proxy_set_header X-Forwarded-Proto https;
               proxy_set_header X-Forwarded-Port 443;
               proxy_pass http://localhost:8081/;
        }
}

