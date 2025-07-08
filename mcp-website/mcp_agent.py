#!/usr/bin/env python3
"""
MCP Information Collection Agent
收集市面上关于MCP (Model Context Protocol) 的一切内容、教程、服务、发展等信息
"""

import requests
import json
import time
import os
from datetime import datetime
from typing import List, Dict, Any
import logging
from dataclasses import dataclass, asdict
from urllib.parse import urljoin, urlparse
import re

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class MCPResource:
    """MCP资源数据结构"""
    title: str
    url: str
    type: str  # tutorial, service, documentation, news, tool, etc.
    description: str
    date_found: str
    source: str
    tags: List[str]
    language: str = "en"
    rating: int = 0

class MCPAgent:
    """MCP信息收集代理"""
    
    def __init__(self, output_dir: str = "mcp_data"):
        self.output_dir = output_dir
        self.resources: List[MCPResource] = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        
        # 创建输出目录
        os.makedirs(output_dir, exist_ok=True)
        
        # 搜索关键词组合
        self.search_keywords = [
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
        ]
        
        # 重要的MCP相关网站
        self.important_domains = [
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
        ]

    def search_web(self, query: str, max_results: int = 20) -> List[Dict]:
        """使用搜索引擎搜索MCP相关内容"""
        logger.info(f"搜索关键词: {query}")
        
        # 这里可以集成多个搜索API
        # 示例使用DuckDuckGo的非官方API (需要安装duckduckgo-search包)
        try:
            from duckduckgo_search import DDGS
            
            results = []
            with DDGS() as ddgs:
                ddgs_results = ddgs.text(query, max_results=max_results)
                for result in ddgs_results:
                    results.append({
                        'title': result.get('title', ''),
                        'url': result.get('href', ''),
                        'description': result.get('body', ''),
                        'source': 'DuckDuckGo'
                    })
            return results
            
        except ImportError:
            logger.warning("duckduckgo-search 包未安装，请运行: pip install duckduckgo-search")
            return []
        except Exception as e:
            logger.error(f"搜索出错: {e}")
            return []

    def search_github(self, query: str) -> List[Dict]:
        """搜索GitHub上的MCP相关项目"""
        try:
            url = "https://api.github.com/search/repositories"
            params = {
                'q': f'{query} language:python OR language:typescript',
                'sort': 'stars',
                'order': 'desc',
                'per_page': 30
            }
            
            response = self.session.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                results = []
                
                for repo in data.get('items', []):
                    results.append({
                        'title': repo['name'],
                        'url': repo['html_url'],
                        'description': repo.get('description', ''),
                        'stars': repo.get('stargazers_count', 0),
                        'language': repo.get('language', ''),
                        'updated': repo.get('updated_at', ''),
                        'source': 'GitHub'
                    })
                
                return results
            else:
                logger.error(f"GitHub API请求失败: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"GitHub搜索出错: {e}")
            return []

    def classify_resource_type(self, title: str, description: str, url: str) -> str:
        """根据标题、描述和URL分类资源类型"""
        content = (title + " " + description).lower()
        
        if any(word in content for word in ['tutorial', '教程', 'guide', '指南', 'how to']):
            return 'tutorial'
        elif any(word in content for word in ['documentation', '文档', 'docs', 'api']):
            return 'documentation'
        elif any(word in content for word in ['server', 'service', '服务', 'integration']):
            return 'service'
        elif 'github.com' in url and any(word in content for word in ['example', 'demo', 'sample']):
            return 'example'
        elif 'github.com' in url:
            return 'tool'
        elif any(word in content for word in ['news', '新闻', 'announcement', '发布']):
            return 'news'
        elif any(word in content for word in ['blog', '博客', 'article', '文章']):
            return 'article'
        elif 'youtube.com' in url or 'video' in content:
            return 'video'
        else:
            return 'other'

    def extract_tags(self, title: str, description: str) -> List[str]:
        """从标题和描述中提取标签"""
        content = (title + " " + description).lower()
        tags = []
        
        # 技术标签
        tech_tags = ['python', 'typescript', 'javascript', 'nodejs', 'claude', 'anthropic', 
                    'openai', 'chatgpt', 'llm', 'ai', 'sdk', 'api', 'rest', 'websocket']
        
        for tag in tech_tags:
            if tag in content:
                tags.append(tag)
        
        # MCP特定标签
        mcp_tags = ['server', 'client', 'protocol', 'integration', 'tool', 'resource', 'prompt']
        for tag in mcp_tags:
            if tag in content:
                tags.append(f"mcp-{tag}")
        
        return list(set(tags))

    def collect_all_resources(self):
        """收集所有MCP相关资源"""
        logger.info("开始收集MCP相关资源...")
        
        # 1. 搜索网页内容
        for keyword in self.search_keywords:
            logger.info(f"搜索关键词: {keyword}")
            web_results = self.search_web(keyword)
            
            for result in web_results:
                resource = MCPResource(
                    title=result['title'],
                    url=result['url'],
                    type=self.classify_resource_type(result['title'], result['description'], result['url']),
                    description=result['description'],
                    date_found=datetime.now().isoformat(),
                    source=result.get('source', 'web'),
                    tags=self.extract_tags(result['title'], result['description']),
                    language='zh' if any(char for char in result['title'] if '\u4e00' <= char <= '\u9fff') else 'en'
                )
                self.resources.append(resource)
            
            time.sleep(1)  # 避免请求过于频繁

        # 2. 搜索GitHub项目
        github_keywords = ["MCP", "model-context-protocol", "anthropic mcp", "mcp server", "mcp client"]
        for keyword in github_keywords:
            logger.info(f"搜索GitHub: {keyword}")
            github_results = self.search_github(keyword)
            
            for result in github_results:
                resource = MCPResource(
                    title=result['title'],
                    url=result['url'],
                    type='tool' if result.get('language') else 'example',
                    description=result['description'],
                    date_found=datetime.now().isoformat(),
                    source='GitHub',
                    tags=self.extract_tags(result['title'], result['description']) + [result.get('language', '').lower()],
                    rating=min(result.get('stars', 0) // 10, 5)  # 基于star数评分
                )
                self.resources.append(resource)
            
            time.sleep(1)

    def remove_duplicates(self):
        """去除重复资源"""
        seen_urls = set()
        unique_resources = []
        
        for resource in self.resources:
            if resource.url not in seen_urls:
                seen_urls.add(resource.url)
                unique_resources.append(resource)
        
        self.resources = unique_resources
        logger.info(f"去重后共有 {len(self.resources)} 个资源")

    def save_results(self):
        """保存收集结果"""
        # 保存为JSON格式
        json_file = os.path.join(self.output_dir, f"mcp_resources_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump([asdict(resource) for resource in self.resources], f, ensure_ascii=False, indent=2)
        
        # 生成HTML报告
        self.generate_html_report()
        
        # 生成分类统计
        self.generate_statistics()
        
        logger.info(f"结果已保存到 {self.output_dir} 目录")

    def generate_html_report(self):
        """生成HTML格式的报告"""
        html_content = """
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MCP资源收集报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .resource-card { background: white; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .resource-type { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; display: inline-block; margin-right: 10px; }
        .tutorial { background-color: #4CAF50; }
        .documentation { background-color: #2196F3; }
        .service { background-color: #FF9800; }
        .tool { background-color: #9C27B0; }
        .article { background-color: #607D8B; }
        .example { background-color: #795548; }
        .video { background-color: #F44336; }
        .tags { margin-top: 10px; }
        .tag { background-color: #e0e0e0; padding: 2px 6px; border-radius: 3px; font-size: 11px; margin-right: 5px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .filter-buttons { margin-bottom: 20px; }
        .filter-btn { padding: 8px 16px; margin-right: 10px; border: none; border-radius: 4px; background-color: #ddd; cursor: pointer; }
        .filter-btn.active { background-color: #667eea; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 MCP (Model Context Protocol) 资源收集报告</h1>
            <p>收集时间: """ + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + f"""</p>
            <p>总计资源数量: {len(self.resources)}</p>
        </div>
        
        <div class="stats">
"""

        # 添加统计信息
        type_counts = {}
        for resource in self.resources:
            type_counts[resource.type] = type_counts.get(resource.type, 0) + 1
        
        for resource_type, count in type_counts.items():
            html_content += f"""
            <div class="stat-card">
                <h3>{resource_type.title()}</h3>
                <div style="font-size: 24px; font-weight: bold; color: #667eea;">{count}</div>
            </div>
"""

        html_content += """
        </div>
        
        <div class="filter-buttons">
            <button class="filter-btn active" onclick="filterResources('all')">全部</button>
"""

        for resource_type in type_counts.keys():
            html_content += f"""
            <button class="filter-btn" onclick="filterResources('{resource_type}')">{resource_type.title()}</button>
"""

        html_content += """
        </div>
        
        <div id="resources">
"""

        # 添加资源列表
        for resource in self.resources:
            html_content += f"""
            <div class="resource-card" data-type="{resource.type}">
                <div>
                    <span class="resource-type {resource.type}">{resource.type.upper()}</span>
                    <strong><a href="{resource.url}" target="_blank">{resource.title}</a></strong>
                </div>
                <p>{resource.description}</p>
                <div class="tags">
                    来源: <span class="tag">{resource.source}</span>
                    语言: <span class="tag">{resource.language}</span>
"""
            
            for tag in resource.tags:
                html_content += f'<span class="tag">{tag}</span>'
            
            html_content += """
                </div>
            </div>
"""

        html_content += """
        </div>
    </div>
    
    <script>
        function filterResources(type) {
            const cards = document.querySelectorAll('.resource-card');
            const buttons = document.querySelectorAll('.filter-btn');
            
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            cards.forEach(card => {
                if (type === 'all' || card.dataset.type === type) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    </script>
</body>
</html>
"""

        html_file = os.path.join(self.output_dir, f"mcp_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html")
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)

    def generate_statistics(self):
        """生成统计信息"""
        stats = {
            'total_resources': len(self.resources),
            'by_type': {},
            'by_source': {},
            'by_language': {},
            'top_tags': {}
        }
        
        # 按类型统计
        for resource in self.resources:
            stats['by_type'][resource.type] = stats['by_type'].get(resource.type, 0) + 1
            stats['by_source'][resource.source] = stats['by_source'].get(resource.source, 0) + 1
            stats['by_language'][resource.language] = stats['by_language'].get(resource.language, 0) + 1
            
            for tag in resource.tags:
                stats['top_tags'][tag] = stats['top_tags'].get(tag, 0) + 1
        
        # 保存统计信息
        stats_file = os.path.join(self.output_dir, f"mcp_statistics_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        with open(stats_file, 'w', encoding='utf-8') as f:
            json.dump(stats, f, ensure_ascii=False, indent=2)

    def run(self):
        """运行收集任务"""
        logger.info("MCP信息收集代理启动...")
        
        try:
            self.collect_all_resources()
            self.remove_duplicates()
            self.save_results()
            
            logger.info(f"✅ 收集完成！共收集到 {len(self.resources)} 个MCP相关资源")
            logger.info(f"📊 结果保存在 {self.output_dir} 目录中")
            
        except Exception as e:
            logger.error(f"❌ 收集过程中出现错误: {e}")
            raise

if __name__ == "__main__":
    # 创建并运行MCP收集代理
    agent = MCPAgent()
    agent.run()