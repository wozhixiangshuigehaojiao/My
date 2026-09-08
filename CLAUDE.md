# 识图能力

本项目用根目录的 vision.js 识图（智谱 glm-4.6v-flash）。底层模型不具备原生识图能力时，遇到图片不要用 Read 工具，改用：

& "D:\我的资料库\Documents\ChatGPT\Leaon\run-vision.cmd" "<图片路径>" "用中文描述这张图片"

配置在 vision.js 同目录的 .env，绝不打印或提交 API Key。