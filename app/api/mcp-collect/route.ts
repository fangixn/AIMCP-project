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

// 模拟搜索函数（实际应用中需要集成真实的搜索API）
async function searchWeb(query: string, maxResults: number = 20): Promise<any[]> {
  // 这里应该集成真实的搜索API，如DuckDuckGo或Google
  // 暂时返回模拟数据
  return [
    {
      title: `${query} - 完整教程`,
      url: `https://example.com/tutorial/${query.replace(/\s+/g, '-')}`,
      description: `关于${query}的详细教程和指南`,
      source: 'DuckDuckGo'
    },
    {
      title: `${query} - GitHub项目`,
      url: `https://github.com/example/${query.replace(/\s+/g, '-')}`,
      description: `${query}的开源实现和示例代码`,
      source: 'GitHub'
    }
  ];
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
          type: classifyResourceType(result.title, result.description, result.url),
          description: result.description,
          date_found: new Date().toISOString(),
          source: result.source || 'web',
          tags: extractTags(result.title, result.description),
          language: /[\u4e00-\u9fff]/.test(result.title) ? 'zh' : 'en',
          rating: 0
        };
        resources.push(resource);
      }
      
      // 添加延迟避免频繁请求
      await new Promise(resolve => setTimeout(resolve, 1000));
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