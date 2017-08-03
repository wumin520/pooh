# pooh

> 钱咖广告主平台前端代码仓库。`pooh`，小熊维尼，跳跳虎的好朋友。

## Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

```

## Build

```bash
$ npm run build
```

## Code

- **src** 单页应用代码目录
- **homepage** 门户页目录


## Publish

- 打包

```bash
$ npm install
$ npm build
```

- nginx 配置

```bash
# 前端资源目录
location / {
    root <path-to-pooh>/dist;
    index index.html;
}

# 前端单页应用路由
location /v2 {
    try_files $uri $uri/ /<path-to-pooh>/index.html;
}

# Python API
location /v2/api {
    proxy_pass http://127.0.0.1:8081/v2/api;
}
```
