# Leaon 项目说明

## 识图能力（Vision）

本项目通过根目录的 `vision.js` 获得识图能力：当模型无法直接查看图片时，把图片转成文字再理解。

触发场景：
- 用户在对话中粘贴、拖入或发送图片（本地路径 / 网络 URL / 剪贴板粘贴的图片）
- 消息中出现 "Saved attachments:" 并列出图片
- 用户要求分析、描述、识别图片内容

执行方式（用启动器，Node 不在 PATH 时也能运行）：
- 本地图片：`& "D:\我的资料库\Documents\ChatGPT\Leaon\run-vision.cmd" "<图片绝对路径>" "<提示词>"`
- 网络图片：`& "D:\我的资料库\Documents\ChatGPT\Leaon\run-vision.cmd" --url "<图片URL>" "<提示词>"`
- 剪贴板图片：`& "D:\我的资料库\Documents\ChatGPT\Leaon\run-vision.cmd" --clipboard "<提示词>"`

规则：
- 遇到图片不要用 Read 工具直接"看"，改用上面的识图脚本。
- 默认用中文描述图片，除非用户要求其他语言。
- 配置在 `vision.js` 同目录的 `.env`（已配好智谱 glm-4.6v-flash）。绝不打印、绝不提交 API Key。
- 如果调用失败，把错误报告给用户，请其检查 Key / 模型 / 接口地址。