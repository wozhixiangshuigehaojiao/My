# 把 Leano 上传到 GitHub（一步步）

## 0. 准备（重要）
- 注册 GitHub 账号：https://github.com 然后新建一个仓库（Repository），名字可叫 Leano。
- 建议把仓库设为 **Private（私有）**，因为里面可能有你的设计参考和业务想法。
- 项目中这些内容**不要上传**（.gitignore 已自动排除）：
  `.env`（含识图 API Key）、`node_modules`、`参考图`、`预览`、`Leano-网页版.zip`。

## 方式一：GitHub Desktop（推荐，图形界面最简单）
1. 电脑下载安装 GitHub Desktop：https://desktop.github.com 并登录你的账号。
2. 菜单 File → Add local repository（添加本地仓库）→ 选择文件夹 `D:\我的资料库\Documents\ChatGPT\Leaon`。
3. 它会问是否创建仓库，选 Yes，然后点 Publish repository（发布仓库）。
4. 选择刚在网页上建好的仓库，发布即可。
5. 以后每次改完代码：GitHub Desktop 里点 Commit to main（提交），再点 Push origin（上传）。

## 方式二：网页直接拖拽上传
1. 打开你的仓库页面 → 点 Add file → Upload files。
2. 把以下内容拖进去（不要拖 .env / node_modules / 参考图 / 预览）：
   index.html、css 文件夹、js 文件夹、icons 文件夹、
   manifest.webmanifest、sw.js、Leano-单文件版.html、README-Leano.md
3. 文件多时网页上传较慢，推荐用方式一。

## 之后想“像 App 一样安装到手机”
1. 在仓库 Settings → Pages → Source 选 main 分支 / root 目录 → Save。
2. 等一两分钟，GitHub 会给一个 https 网址（例如 https://你的用户名.github.io/Leano/）。
3. 手机 Edge / Chrome 打开这个网址 → 菜单里选「添加到主屏幕 / 安装应用」。
4. 打开过第一次后即可离线使用（已内置离线缓存）。

> 说明：把项目传 GitHub 后，`.env` 里的识图 Key 不会上传（已在忽略名单），可以放心。