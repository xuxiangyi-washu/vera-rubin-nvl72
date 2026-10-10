# Cloudflare Workers 部署

公开入口：https://vera-rubin-nvl72.xuxiangyi666.workers.dev/

项目：`vera-rubin-nvl72`。账户子域名：`xuxiangyi666`。部署模式为Workers Static Assets，构建产物目录为`dist/`，SPA导航回退到`index.html`。无需自建Node服务器、数据库或GPU云实例。

## 更新

```bash
npm install
npm test
npm run deploy
```

`npm run deploy`先执行TypeScript检查与Vite构建，再使用锁定版本的Wrangler上传静态资源。`npm run deploy:check`执行本地dry-run，不发布。Cloudflare登录凭证由Wrangler管理，不写入项目。

首次在其他电脑运行时：

```bash
npx wrangler login --device
```

在Cloudflare页面输入设备码并确认授权；设备码过期时重新执行。设备码登录不依赖`localhost:8976`浏览器回调。

## 产物和来源

只上传dist中的HTML、CSS、JavaScript、PDF使用手册和官方素材URL清单。官方图片由浏览器向NVIDIA加载，不在Cloudflare托管可独立使用的官方原图；PDF按用户要求包含实际界面截图中的图片缩略呈现。原始DOCX/PDF在本地，源码中的研究记录不属于网站静态根目录。

该站点是公开访问的结构仿真。图片中可能包含首发规格，须对照详情面板的冲突标记。参数化模型不是NVIDIA官方CAD，动画不是设备遥测。

## 验证

发布后检查首页及所有JS/CSS chunks及PDF的HTTP状态、Content-Type与本地SHA-256；结果记录在`research/cloudflare-deployment.json`。Wrangler版本ID用于回溯部署版本。

官方参考：[Workers静态资源](https://developers.cloudflare.com/workers/static-assets/get-started/)、[SPA路由](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)、[workers.dev域名](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)。

## 本次发布验收

版本：`1e91b1fa-f7c4-449e-837f-3ee2a8823d32`。11个静态文件均HTTP200，Content-Type正确，SHA-256与本地dist一致；PDF为47页、19张真实UI截图、6,207,201字节。核验记录：`research/cloudflare-deployment.json`、`research/pdf-verification.json`。
