/* 生成单文件版：把 css/js 全部内联进一个 HTML，便于手机离线打开 */
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2];
const OUT = process.argv[3] || path.join(ROOT, 'Leano-单文件版.html');

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// 内联 CSS
html = html.replace(/<link rel="stylesheet" href="css\/([^"]+)">/g, (m, f) => {
  const css = fs.readFileSync(path.join(ROOT, 'css', f), 'utf8');
  return '<style>\n' + css + '\n</style>';
});
// 内联 JS（按原顺序）
html = html.replace(/<script src="js\/([^"]+)"><\/script>/g, (m, f) => {
  const js = fs.readFileSync(path.join(ROOT, 'js', f), 'utf8');
  return '<script>\n' + js + '\n</' + 'script>';
});
// 确保没有残留外部引用
if (/<script src=|<link rel="stylesheet"/.test(html)) {
  console.error('still external refs'); process.exit(1);
}
fs.writeFileSync(OUT, html, 'utf8');
console.log('written', OUT, (html.length/1024).toFixed(1)+'KB');