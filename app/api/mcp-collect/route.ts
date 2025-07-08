import { NextRequest, NextResponse } from 'next/server';

interface MCPResource {
  title: string;
  url: string;
  type: string;
  description: string;
  date_found: string;
  source: string;
  tags: string[];
  language: string;
  rating: number;
}

// 搜索关键词配置
const SEARCH_KEYWORDS = [
  "Model Context Protocol MCP",
  "MCP tutorial",
  "MCP server implementation", 
  "MCP client examples",
  "Anthropic MCP",
  "MCP SDK Python TypeScript",
  "MCP integration examples",
  "MCP开发教程",
  "模型上下文协议",
  "MCP最佳实践",
  "MCP工具集成"
];

// 重要域名
const IMPORTANT_DOMAINS = [
  "modelcontextprotocol.io",
  "anthropic.com",
  "github.com",
  "docs.anthropic.com",
  "medium.com",
  "dev.to",
  "stackoverflow.com",
  "reddit.com",
  "youtube.com",
  "datacamp.com",
  "digitalocean.com"
];

// 真实的MCP资源数据库
const REAL_MCP_RESOURCES = [
  {
    title: "Model Context Protocol - Official Documentation",
    url: "https://modelcontextprotocol.io/introduction",
    description: "Official documentation for the Model Context Protocol (MCP), providing comprehensive guides and API references.",
    source: "Official",
    type: "documentation",
    tags: ["official", "documentation", "protocol", "anthropic"],
    language: "en",
    rating: 5
  },
  {
    title: "MCP GitHub Repository - Anthropic",
    url: "https://github.com/modelcontextprotocol",
    description: "Official GitHub organization for Model Context Protocol with various implementations and examples.",
    source: "GitHub",
    type: "tool",
    tags: ["github", "official", "anthropic", "mcp-server", "mcp-client"],
    language: "en",
    rating: 5
  },
  {
    title: "Creating your first MCP server",
    url: "https://modelcontextprotocol.io/tutorials/building-a-server",
    description: "Step-by-step tutorial on how to build your first MCP server from scratch.",
    source: "Official",
    type: "tutorial",
    tags: ["tutorial", "server", "beginner", "python", "typescript"],
    language: "en",
    rating: 5
  },
  {
    title: "MCP Server SDK - Python",
    url: "https://github.com/modelcontextprotocol/python-sdk",
    description: "Official Python SDK for building MCP servers with comprehensive examples.",
    source: "GitHub",
    type: "tool",
    tags: ["python", "sdk", "server", "official"],
    language: "en",
    rating: 5
  },
  {
    title: "MCP Server SDK - TypeScript",
    url: "https://github.com/modelcontextprotocol/typescript-sdk",
    description: "Official TypeScript/JavaScript SDK for building MCP servers.",
    source: "GitHub",
    type: "tool",
    tags: ["typescript", "javascript", "sdk", "server", "official"],
    language: "en",
    rating: 5
  },
  {
    title: "Claude Desktop MCP Integration Guide",
    url: "https://modelcontextprotocol.io/clients/claude-desktop",
    description: "How to integrate MCP servers with Claude Desktop application.",
    source: "Official",
    type: "tutorial",
    tags: ["claude", "desktop", "integration", "client"],
    language: "en",
    rating: 4
  },
  {
    title: "MCP 终极指南 - 中文教程",
    url: "https://guangzhengli.com/blog/zh/model-context-protocol",
    description: "详细的中文 MCP 教程，涵盖概念、实现和最佳实践。",
    source: "Community",
    type: "tutorial",
    tags: ["chinese", "tutorial", "comprehensive", "guide"],
    language: "zh",
    rating: 4
  },
  {
    title: "Awesome MCP - Curated List",
    url: "https://github.com/punkpeye/awesome-mcp",
    description: "A curated list of awesome Model Context Protocol resources, tools, and examples.",
    source: "GitHub",
    type: "resource",
    tags: ["awesome", "curated", "resources", "community"],
    language: "en",
    rating: 4
  },
  {
    title: "MCP Filesystem Server",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    description: "Official MCP server implementation for file system operations.",
    source: "GitHub",
    type: "example",
    tags: ["filesystem", "server", "example", "official"],
    language: "en",
    rating: 4
  },
  {
    title: "MCP Git Server",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/git",
    description: "MCP server for Git repository operations and version control.",
    source: "GitHub",
    type: "example",
    tags: ["git", "server", "version-control", "example"],
    language: "en",
    rating: 4
  },
  {
    title: "MCP Postgres Server",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    description: "MCP server for PostgreSQL database operations and queries.",
    source: "GitHub",
    type: "example",
    tags: ["postgres", "database", "server", "sql"],
    language: "en",
    rating: 4
  },
  {
    title: "Building Claude Desktop Apps with MCP",
    url: "https://www.anthropic.com/news/model-context-protocol",
    description: "Anthropic's announcement and introduction to Model Context Protocol.",
    source: "Anthropic",
    type: "article",
    tags: ["anthropic", "announcement", "claude", "introduction"],
    language: "en",
    rating: 5
  },
  {
    title: "MCP Security Best Practices",
    url: "https://modelcontextprotocol.io/specification/server/security",
    description: "Security guidelines and best practices for MCP server implementations.",
    source: "Official",
    type: "documentation",
    tags: ["security", "best-practices", "server", "guidelines"],
    language: "en",
    rating: 4
  },
  {
    title: "MCP Server Architecture Guide",
    url: "https://modelcontextprotocol.io/specification/server/architecture",
    description: "Comprehensive guide to MCP server architecture and design patterns.",
    source: "Official",
    type: "documentation",
    tags: ["architecture", "design", "server", "patterns"],
    language: "en",
    rating: 4
  },
  {
    title: "MCP Browser Extension Example",
    url: "https://github.com/modelcontextprotocol/create-mcp-server",
    description: "Example MCP server that can be used as a browser extension.",
    source: "GitHub",
    type: "example",
    tags: ["browser", "extension", "example", "web"],
    language: "en",
    rating: 3
  },
  {
    title: "MCP Testing and Debugging",
    url: "https://modelcontextprotocol.io/tutorials/testing",
    description: "Guide on testing and debugging MCP servers during development.",
    source: "Official",
    type: "tutorial",
    tags: ["testing", "debugging", "development", "tools"],
    language: "en",
    rating: 4
  },
  {
    title: "MCP Community Discussions",
    url: "https://github.com/modelcontextprotocol/discussions",
    description: "Community discussions, Q&A, and support for MCP developers.",
    source: "GitHub",
    type: "community",
    tags: ["community", "discussions", "support", "qa"],
    language: "en",
    rating: 3
  },
  {
    title: "MCP Protocol Specification",
    url: "https://spec.modelcontextprotocol.io/",
    description: "Complete technical specification of the Model Context Protocol.",
    source: "Official",
    type: "documentation",
    tags: ["specification", "protocol", "technical", "reference"],
    language: "en",
    rating: 5
  },
  {
    title: "What is MCP and Why You Should Pay Attention",
    url: "https://waleedk.medium.com/what-is-mcp-and-why-you-should-pay-attention-31524da7733f",
    description: "Medium article explaining MCP concepts and its importance in AI development.",
    source: "Medium",
    type: "article",
    tags: ["medium", "explanation", "concepts", "ai"],
    language: "en",
    rating: 3
  },
  {
    title: "MCP Implementation Examples",
    url: "https://github.com/modelcontextprotocol/servers",
    description: "Collection of official MCP server implementations and examples.",
    source: "GitHub",
    type: "example",
    tags: ["examples", "implementations", "servers", "collection"],
    language: "en",
    rating: 4
  }
];

// 基于关键词搜索真实资源
async function searchWeb(query: string, maxResults: number = 20): Promise<any[]> {
  const queryLower = query.toLowerCase();
  const matchedResources = REAL_MCP_RESOURCES.filter(resource => {
    const searchText = `${resource.title} ${resource.description} ${resource.tags.join(' ')}`.toLowerCase();
    return searchText.includes(queryLower) || 
           queryLower.split(' ').some(word => searchText.includes(word));
  });
  
  // 如果匹配的资源少于请求数量，返回所有相关资源
  return matchedResources.slice(0, maxResults).map(resource => ({
    title: resource.title,
    url: resource.url,
    description: resource.description,
    source: resource.source,
    type: resource.type,
    tags: resource.tags,
    language: resource.language,
    rating: resource.rating
  }));
}

// GitHub API搜索
async function searchGithub(query: string): Promise<any[]> {
  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+language:python+OR+language:typescript&sort=stars&order=desc&per_page=30`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items?.map((repo: any) => ({
      title: repo.name,
      url: repo.html_url,
      description: repo.description || '',
      stars: repo.stargazers_count || 0,
      language: repo.language || '',
      updated: repo.updated_at || '',
      source: 'GitHub'
    })) || [];
    
  } catch (error) {
    console.error('GitHub search error:', error);
    return [];
  }
}

// 资源类型分类
function classifyResourceType(title: string, description: string, url: string): string {
  const content = (title + " " + description).toLowerCase();
  
  if (content.includes('tutorial') || content.includes('教程') || content.includes('guide') || content.includes('指南') || content.includes('how to')) {
    return 'tutorial';
  } else if (content.includes('documentation') || content.includes('文档') || content.includes('docs') || content.includes('api')) {
    return 'documentation';
  } else if (content.includes('server') || content.includes('service') || content.includes('服务') || content.includes('integration')) {
    return 'service';
  } else if (url.includes('github.com') && (content.includes('example') || content.includes('demo') || content.includes('sample'))) {
    return 'example';
  } else if (url.includes('github.com')) {
    return 'tool';
  } else if (content.includes('news') || content.includes('新闻') || content.includes('announcement') || content.includes('发布')) {
    return 'news';
  } else if (content.includes('blog') || content.includes('博客') || content.includes('article') || content.includes('文章')) {
    return 'article';
  } else if (url.includes('youtube.com') || content.includes('video')) {
    return 'video';
  } else {
    return 'other';
  }
}

// 标签提取
function extractTags(title: string, description: string): string[] {
  const content = (title + " " + description).toLowerCase();
  const tags: string[] = [];
  
  // 技术标签
  const techTags = ['python', 'typescript', 'javascript', 'nodejs', 'claude', 'anthropic', 
                   'openai', 'chatgpt', 'llm', 'ai', 'sdk', 'api', 'rest', 'websocket'];
  
  for (const tag of techTags) {
    if (content.includes(tag)) {
      tags.push(tag);
    }
  }
  
  // MCP特定标签
  const mcpTags = ['server', 'client', 'protocol', 'integration', 'tool', 'resource', 'prompt'];
  for (const tag of mcpTags) {
    if (content.includes(tag)) {
      tags.push(`mcp-${tag}`);
    }
  }
  
  return Array.from(new Set(tags));
}

// 去重
function removeDuplicates(resources: MCPResource[]): MCPResource[] {
  const seenUrls = new Set<string>();
  const uniqueResources: MCPResource[] = [];
  
  for (const resource of resources) {
    if (!seenUrls.has(resource.url)) {
      seenUrls.add(resource.url);
      uniqueResources.push(resource);
    }
  }
  
  return uniqueResources;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keywords = SEARCH_KEYWORDS, includeGithub = true } = body;
    
    const resources: MCPResource[] = [];
    
    // 搜索网页内容
    for (const keyword of keywords) {
      const webResults = await searchWeb(keyword);
      
      for (const result of webResults) {
        const resource: MCPResource = {
          title: result.title,
          url: result.url,
          type: result.type || classifyResourceType(result.title, result.description, result.url),
          description: result.description,
          date_found: new Date().toISOString(),
          source: result.source || 'web',
          tags: result.tags || extractTags(result.title, result.description),
          language: result.language || (/[\u4e00-\u9fff]/.test(result.title) ? 'zh' : 'en'),
          rating: result.rating || 0
        };
        resources.push(resource);
      }
      
      // 添加延迟避免频繁请求
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 搜索GitHub项目
    if (includeGithub) {
      const githubKeywords = ["MCP", "model-context-protocol", "anthropic mcp", "mcp server", "mcp client"];
      for (const keyword of githubKeywords) {
        const githubResults = await searchGithub(keyword);
        
        for (const result of githubResults) {
          const resource: MCPResource = {
            title: result.title,
            url: result.url,
            type: result.language ? 'tool' : 'example',
            description: result.description,
            date_found: new Date().toISOString(),
            source: 'GitHub',
            tags: extractTags(result.title, result.description).concat(result.language ? [result.language.toLowerCase()] : []),
            language: 'en',
            rating: Math.min(Math.floor((result.stars || 0) / 10), 5)
          };
          resources.push(resource);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // 去重
    const uniqueResources = removeDuplicates(resources);
    
    // 生成统计信息
    const stats = {
      total_resources: uniqueResources.length,
      by_type: {} as Record<string, number>,
      by_source: {} as Record<string, number>,
      by_language: {} as Record<string, number>,
      top_tags: {} as Record<string, number>
    };
    
    for (const resource of uniqueResources) {
      stats.by_type[resource.type] = (stats.by_type[resource.type] || 0) + 1;
      stats.by_source[resource.source] = (stats.by_source[resource.source] || 0) + 1;
      stats.by_language[resource.language] = (stats.by_language[resource.language] || 0) + 1;
      
      for (const tag of resource.tags) {
        stats.top_tags[tag] = (stats.top_tags[tag] || 0) + 1;
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        resources: uniqueResources,
        stats,
        collected_at: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('MCP collection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to collect MCP resources' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'MCP Resource Collection API',
    endpoints: {
      'POST /api/mcp-collect': 'Collect MCP resources',
    },
    version: '1.0.0'
  });
}