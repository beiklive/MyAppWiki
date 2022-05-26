> 关于nginx的一些常用配置


## Location子路径

### 代理

假设下面四种情况分别用 http://192.168.1.1/proxy/test.html 进行访问。

第一种：

```bash
location /proxy/ {
	proxy_pass http://127.0.0.1/;
}
```

代理到URL：http://127.0.0.1/test.html

第二种（相对于第一种，最后少一个 / ）

```bash
location /proxy/ {
	proxy_pass http://127.0.0.1;
}
```

代理到URL：http://127.0.0.1/proxy/test.html

第三种：

```bash
location /proxy/ {
	proxy_pass http://127.0.0.1/aaa/;
}
```

代理到URL：http://127.0.0.1/aaa/test.html

第四种（相对于第三种，最后少一个 / ）

```bash
location /proxy/ {
	proxy_pass http://127.0.0.1/aaa;
}
```

代理到URL：http://127.0.0.1/aaatest.html

### 静态路径

第一种（访问路径为静态目录下的子路径）

```bash
location /proxy {
	root /home/www;
}
```

则访问路径为：/home/www/proxy

第二种（访问路径为静态目录下的根路径）

```bash
location /proxy {
	alias /home/www;
}
```

则访问路径为：/home/www
