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

## CloudBase GitHub 部署

环境：`aurora-d4g5u80cq1b5f11de`；应用：`vera-rubin-nvl72`；代码分支：`main`。

| 控制台字段 | 设置 |
|---|---|
| 项目框架 | React（Vite构建）；无React选项时用其他并手填命令 |
| Node.js | 24；项目`.nvmrc`也指定24 |
| 目标目录 | `./` |
| 安装命令 | `npm ci` |
| 构建命令 | `npm run build` |
| 构建产物 | `./dist` |
| 部署路径 | `/vera-rubin-nvl72` |

必须先安装依赖并构建，再上传dist。dist是构建产物，不提交到GitHub；直接执行`tcb hosting deploy ./dist`会因为未生成目录而失败。Node18不满足Vite8要求，须用20.19+或22.12+；本环境选Node24。

Vite的`base`设为`./`，PDF链接也使用Vite公共路径，因此JS/CSS、动态加载的3D组件和PDF都能从应用子目录访问。分享链接应包含部署路径和末尾的`/`。

如果使用自定义部署命令（运行环境须先切到Node24）：

```bash
npm ci && npm run build && tcb hosting deploy ./dist /vera-rubin-nvl72 -e aurora-d4g5u80cq1b5f11de
```

不要将部署目录改成仓库根目录；需要上传的是编译后的dist文件。官方说明：[CloudBase静态托管](https://docs.cloudbase.net/cli-v1/hosting)、[CloudBase React部署](https://docs.cloudbase.net/recipes/add-hosting-react)、[Vite Node.js要求](https://vite.dev/guide/)。

CloudBase公开网址：https://aurora-d4g5u80cq1b5f11de-1464571490.tcloudbaseapp.com/vera-rubin-nvl72/

2026-10-10发布版本`vera-rubin-nvl72-002`，构建任务`2608445606`。控制台状态成功；11个远端文件的HTTP状态、MIME及SHA-256与本地构建一致。核验记录：`research/cloudbase-deployment.json`。PDF位于同一应用路径下的`guides/nvl72-user-guide.pdf`。

## Sentry深入研究版发布

Cloudflare版本：`b54fd233-311e-4c79-b47f-4e709ec03918`。本次新增8个Sentry章节、固定OpenShell v0.1.3证据、策略教学交互，并更新49页/20张截图的PDF。Cloudflare的11个文件已进行HTTP、MIME与SHA-256核验。两处平台可分别执行`node scripts/verify-public.mjs <版本标识> cloudflare`或末参数`cloudbase`复验。

CloudBase的Sentry深入研究版由用户在控制台手动更新，随后公网核验11个文件全部HTTP200、MIME正确、SHA-256匹配同一份新版产物，PDF为49页/20张截图。未读取控制台版本编号；核验详情见`research/cloudbase-deployment.json`。两处托管现已同步到相同内容。
