# MCP Agent Website

专业的 Model Context Protocol 信息收集工具展示网站

## 功能特性

- 🎨 现代化响应式设计
- 📱 移动端友好界面
- 🎯 交互式演示功能
- 📊 数据可视化图表
- ⚡ 流畅的动画效果
- 🔍 SEO 优化

## 部署方式

### 1. 静态托管平台

#### Vercel 部署
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 部署
vercel --prod
```

#### Netlify 部署
```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 部署
netlify deploy --prod --dir=.
```

#### GitHub Pages 部署
1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源

### 2. 服务器部署

#### Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/mcp-website;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

#### Apache 配置
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/mcp-website
    
    <Directory /path/to/mcp-website>
        AllowOverride All
        Require all granted
    </Directory>

    # 启用 Gzip 压缩
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
    </Location>
</VirtualHost>
```

### 3. Docker 部署

#### Dockerfile
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  mcp-website:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

## 文件结构

```
mcp-website/
├── index.html              # 主页面
├── assets/
│   ├── css/
│   │   └── style.css       # 样式文件
│   ├── js/
│   │   └── main.js         # JavaScript 文件
│   └── images/             # 图片资源
├── mcp_agent.py            # 下载文件
├── README.md               # 说明文档
├── package.json            # 依赖配置
├── vercel.json             # Vercel 配置
└── netlify.toml            # Netlify 配置
```

## 自定义配置

### 修改品牌信息
编辑 `index.html` 中的以下部分：
- 网站标题和描述
- 品牌名称和图标
- 联系信息

### 添加新功能
在 `assets/js/main.js` 中添加新的 JavaScript 功能

### 样式定制
修改 `assets/css/style.css` 中的 CSS 变量来调整颜色主题

## 性能优化

- ✅ 图片懒加载
- ✅ CSS/JS 压缩
- ✅ Gzip 压缩
- ✅ 缓存优化
- ✅ 响应式图片

## 浏览器支持

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 开发环境

### 本地开发
```bash
# 使用 Python 简单服务器
python -m http.server 8000

# 或使用 Node.js
npx http-server .

# 访问 http://localhost:8000
```

### 实时预览
推荐使用 Live Server 扩展（VS Code）或类似工具进行实时预览

## 贡献指南

1. Fork 本仓库
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT License