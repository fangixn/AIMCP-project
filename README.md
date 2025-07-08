# AIMCP Web - Model Context Protocol

一个基于 Next.js 的中英双语 MCP (Model Context Protocol) 资源网站，提供全面的 MCP 学习资源、技术文档和智能资源收集工具。

## 🌟 特性

- **📱 响应式设计**: 支持桌面端和移动端
- **🌍 中英双语**: 完整的国际化支持，包含中文和英文界面  
- **🔧 资源收集工具**: 智能搜索和收集 MCP 相关资源，生成详细分析报告
- **📚 完整技术文档**: 包含快速开始、架构设计、API文档、组件说明、部署指南等
- **📊 数据可视化**: 资源统计分析和数据导出功能
- **🎨 现代设计**: 基于 Tailwind CSS 的现代化 UI 设计
- **⚡ 高性能**: 基于 Next.js 13+ 的 App Router 架构
- **🔍 SEO优化**: 完整的sitemap和robots.txt配置

## 🛠️ 技术栈

- **前端框架**: Next.js 13.5.1
- **样式框架**: Tailwind CSS
- **国际化**: next-intl
- **UI组件**: Radix UI + shadcn/ui
- **图标**: Lucide React  
- **类型检查**: TypeScript
- **数据可视化**: Recharts
- **状态管理**: React Hooks

## 📂 项目结构

```
AIMCP project/
├── app/
│   ├── [locale]/              # 国际化路由
│   │   ├── layout.tsx         # 布局组件
│   │   ├── page.tsx           # 主页
│   │   ├── docs/              # 技术文档页面
│   │   │   └── page.tsx
│   │   ├── resources/         # 资源页面
│   │   │   └── page.tsx
│   │   └── report/            # 报告页面
│   │       └── page.tsx
│   ├── api/                   # API 路由
│   │   ├── mcp-collect/       # 资源收集API
│   │   │   └── route.ts
│   │   └── mcp-collect-progress/ # 进度查询API
│   │       └── route.ts
│   └── globals.css            # 全局样式
├── components/
│   ├── ui/                    # UI 组件库
│   ├── LanguageSwitcher.tsx   # 语言切换组件
│   └── MCPCollectorTool.tsx   # MCP资源收集工具
├── messages/                  # 翻译文件
│   ├── en.json               # 英文翻译
│   └── zh.json               # 中文翻译
├── lib/
│   └── utils.ts              # 工具函数
├── hooks/                    # React Hooks
├── i18n/
│   └── request.ts            # 国际化请求配置
├── middleware.ts             # 中间件
├── next.config.js            # Next.js 配置
└── public/                   # 静态资源
    ├── sitemap.xml          # 站点地图
    └── robots.txt           # 搜索引擎配置
```

## 🚀 快速开始

### 系统要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- Git 版本控制
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建生产版本

```bash
npm run build
npm start
```

## 🌍 语言支持

该项目支持以下语言：

- **English** (`/en/`): 英文版本
- **中文** (`/zh/`): 中文版本

默认语言为英文，访问根路径 `/` 会自动重定向到 `/en/`。

## 📋 功能模块

### 主要页面

1. **首页** (`/[locale]/`): 
   - MCP 核心功能介绍
   - 交互式资源收集工具
   - 技术文档导航
   - 资源快速导航
   - 服务器目录展示

2. **技术文档** (`/[locale]/docs`):
   - 快速开始指南
   - 项目架构说明
   - API 接口文档
   - 组件使用说明
   - 部署指南
   - 配置说明

3. **资源页面** (`/[locale]/resources`):
   - 官方文档链接（20+个）
   - 平台实现指南
   - 社区资源集合（60+个）
   - MCP服务器目录
   - 社区讨论链接

4. **报告页面** (`/[locale]/report`):
   - 资源收集报告
   - 统计数据分析

### 核心组件

- **MCPCollectorTool**: 智能资源收集工具
  - 自定义关键词搜索
  - 实时进度显示
  - 资源分类和筛选
  - 统计数据可视化
  - JSON/CSV 数据导出
  - 收藏功能
  
- **LanguageSwitcher**: 语言切换组件
- **响应式导航**: 支持移动端菜单
- **资源卡片**: 可交互的资源展示卡片

### API 接口

1. **资源收集API** (`/api/mcp-collect`)
   - 支持自定义关键词搜索
   - GitHub 项目搜索
   - 资源去重和分类
   - 统计数据生成

2. **进度查询API** (`/api/mcp-collect-progress`)  
   - 实时进度更新
   - Server-Sent Events (SSE)
   - 收集状态监控

## 📖 基于的 MCP 资源

项目整合了89个精心策划的 MCP 资源：

### 官方文档
- [Model Context Protocol](https://modelcontextprotocol.io/introduction)
- [GitHub Repository](https://github.com/modelcontextprotocol)
- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)

### 平台指南
- [OpenAI MCP](https://platform.openai.com/docs/mcp)
- [Anthropic MCP](https://www.anthropic.com/news/model-context-protocol)
- [Hugging Face MCP](https://huggingface.co/blog/Kseniase/mcp)

### 社区资源
- [MCP 终极指南](https://guangzhengli.com/blog/zh/model-context-protocol)
- [Logto MCP Guide](https://blog.logto.io/th/what-is-mcp)
- [Medium: Understanding MCP](https://waleedk.medium.com/what-is-mcp-and-why-you-should-pay-attention-31524da7733f)
- [Awesome MCP](https://github.com/punkpeye/awesome-mcp)

### MCP服务器实现
- [MCP Filesystem Server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [MCP Git Server](https://github.com/modelcontextprotocol/servers/tree/main/src/git)
- [MCP Postgres Server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)

### 服务器目录
- [MCP Servers Directory](https://mcp.so/)
- [Reddit Community Discussion](https://www.reddit.com/r/ClaudeAI/comments/1h55zxd/can_someone_explain_mcp_to_me_how_are_you_using/)

## 🎨 设计特色

- **深色主题**: 专业的深色配色方案
- **渐变效果**: 现代化的渐变文字和按钮  
- **交互动画**: 流畅的悬停和点击效果
- **卡片设计**: 清晰的信息层次结构
- **响应式布局**: 适配各种屏幕尺寸
- **无障碍设计**: 支持键盘导航和屏幕阅读器

## 🔧 自定义配置

### 添加新语言

1. 在 `messages/` 目录下创建新的语言文件（如 `messages/fr.json`）
2. 更新 `i18n/request.ts` 中的配置
3. 更新 `middleware.ts` 中的支持语言列表
4. 在 `LanguageSwitcher.tsx` 中添加新语言选项

### 添加新资源

编辑 `/app/api/mcp-collect/route.ts` 中的 `REAL_MCP_RESOURCES` 数组，添加新的资源项目。

### 自定义主题

修改 `tailwind.config.ts` 中的主题配置，自定义颜色、字体等样式。

## 🚀 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量（如需要）
4. 点击部署

### Netlify 部署

```bash
# 构建设置
Build command: npm run build
Publish directory: out
Environment variables:
  NEXT_OUTPUT: export
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t aimcp .
docker run -p 3000:3000 aimcp
```

## 📊 性能指标

- **Lighthouse Score**: 95+ 
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🔍 SEO 优化

- 完整的 sitemap.xml 配置
- robots.txt 搜索引擎指令
- 多语言 hreflang 标签
- Meta 标签优化
- 结构化数据标记

## 📄 许可证

© 2025 AIMCP. All rights reserved.

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests 来改进项目！

### 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📞 联系我们

- Website: https://aimcpweb.com
- Email: contact@aimcpweb.com
- GitHub: https://github.com/your-org/aimcp-web

---

**让 AI 上下文理解成为可能** 🚀 