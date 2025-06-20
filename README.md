# AIMCP Web - Model Context Protocol

一个基于 Next.js 的中英双语 MCP (Model Context Protocol) 资源网站，提供全面的 MCP 学习资源和技术文档。

## 🌟 特性

- **📱 响应式设计**: 支持桌面端和移动端
- **🌍 中英双语**: 完整的国际化支持，包含中文和英文界面
- **📚 资源整合**: 整合了官方文档、平台指南、社区资源和服务器目录
- **🎨 现代设计**: 基于 Tailwind CSS 的现代化 UI 设计
- **⚡ 高性能**: 基于 Next.js 13+ 的 App Router 架构

## 🛠️ 技术栈

- **前端框架**: Next.js 13.5.1
- **样式框架**: Tailwind CSS
- **国际化**: next-intl
- **UI组件**: Radix UI
- **图标**: Lucide React
- **类型检查**: TypeScript

## 📂 项目结构

```
AIMCP project/
├── app/
│   └── [locale]/           # 国际化路由
│       ├── layout.tsx      # 布局组件
│       ├── page.tsx        # 主页
│       └── resources/      # 资源页面
│           └── page.tsx
├── components/
│   ├── ui/                 # UI 组件库
│   └── LanguageSwitcher.tsx # 语言切换组件
├── messages/               # 翻译文件
│   ├── en.json            # 英文翻译
│   └── zh.json            # 中文翻译
├── lib/
│   └── utils.ts           # 工具函数
├── i18n.ts                # 国际化配置
├── middleware.ts          # 中间件
└── next.config.js         # Next.js 配置
```

## 🚀 快速开始

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
   - 资源快速导航
   - 服务器目录展示

2. **资源页面** (`/[locale]/resources`):
   - 官方文档链接
   - 平台实现指南
   - 社区资源集合
   - 服务器和讨论

### 核心组件

- **LanguageSwitcher**: 语言切换组件
- **响应式导航**: 支持移动端菜单
- **资源卡片**: 可交互的资源展示卡片

## 📖 基于的 MCP 资源

项目整合了以下 MCP 资源：

### 官方文档
- [Model Context Protocol](https://modelcontextprotocol.io/introduction)
- [GitHub Repository](https://github.com/modelcontextprotocol)

### 平台指南
- [OpenAI MCP](https://platform.openai.com/docs/mcp)
- [Anthropic MCP](https://www.anthropic.com/news/model-context-protocol)
- [Hugging Face MCP](https://huggingface.co/blog/Kseniase/mcp)

### 社区资源
- [MCP 终极指南](https://guangzhengli.com/blog/zh/model-context-protocol)
- [Logto MCP Guide](https://blog.logto.io/th/what-is-mcp)
- [Medium: Understanding MCP](https://waleedk.medium.com/what-is-mcp-and-why-you-should-pay-attention-31524da7733f)

### 服务器目录
- [MCP Servers Directory](https://mcp.so/)
- [Reddit Community Discussion](https://www.reddit.com/r/ClaudeAI/comments/1h55zxd/can_someone_explain_mcp_to_me_how_are_you_using/)

## 🎨 设计特色

- **深色主题**: 专业的深色配色方案
- **渐变效果**: 现代化的渐变文字和按钮
- **交互动画**: 流畅的悬停和点击效果
- **卡片设计**: 清晰的信息层次结构

## 🔧 自定义配置

### 添加新语言

1. 在 `messages/` 目录下创建新的语言文件（如 `messages/fr.json`）
2. 更新 `i18n.ts` 中的 `locales` 数组
3. 更新 `middleware.ts` 中的支持语言列表
4. 在 `LanguageSwitcher.tsx` 中添加新语言选项

### 添加新资源

编辑对应页面组件中的资源数据数组，添加新的资源项目。

## 📄 许可证

© 2025 AIMCP. All rights reserved.

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests 来改进项目！

---

**让 AI 上下文理解成为可能** 🚀 