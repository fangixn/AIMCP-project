'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, ExternalLink, Filter, BarChart3, Search, Calendar, Tag, Globe, Star } from 'lucide-react';
import Link from 'next/link';

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

interface CollectionStats {
  total_resources: number;
  by_type: Record<string, number>;
  by_source: Record<string, number>;
  by_language: Record<string, number>;
  top_tags: Record<string, number>;
}

interface ReportData {
  resources: MCPResource[];
  stats: CollectionStats;
  collected_at: string;
}

const MCPReportPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [filteredResources, setFilteredResources] = useState<MCPResource[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 从 URL 参数或 localStorage 获取数据
  useEffect(() => {
    // 这里可以从 URL 参数、localStorage 或 API 获取报告数据
    // 暂时使用模拟数据
    const mockData: ReportData = {
      resources: [
        {
          title: "Model Context Protocol 官方文档",
          url: "https://modelcontextprotocol.io",
          type: "documentation",
          description: "MCP 的官方技术文档和协议规范",
          date_found: new Date().toISOString(),
          source: "官方",
          tags: ["official", "documentation", "protocol"],
          language: "en",
          rating: 5
        },
        {
          title: "MCP 服务器开发教程",
          url: "https://example.com/tutorial",
          type: "tutorial",
          description: "如何创建和部署 MCP 服务器的完整指南",
          date_found: new Date().toISOString(),
          source: "Community",
          tags: ["tutorial", "server", "development"],
          language: "zh",
          rating: 4
        },
        {
          title: "Anthropic MCP SDK",
          url: "https://github.com/anthropics/mcp-sdk",
          type: "tool",
          description: "官方 MCP 软件开发工具包",
          date_found: new Date().toISOString(),
          source: "GitHub",
          tags: ["sdk", "python", "typescript", "official"],
          language: "en",
          rating: 5
        }
      ],
      stats: {
        total_resources: 3,
        by_type: { documentation: 1, tutorial: 1, tool: 1 },
        by_source: { "官方": 1, "Community": 1, "GitHub": 1 },
        by_language: { en: 2, zh: 1 },
        top_tags: { official: 2, tutorial: 1, documentation: 1, protocol: 1, server: 1, development: 1, sdk: 1, python: 1, typescript: 1 }
      },
      collected_at: new Date().toISOString()
    };

    setReportData(mockData);
    setFilteredResources(mockData.resources);
    setLoading(false);
  }, []);

  // 过滤资源
  useEffect(() => {
    if (!reportData) return;

    let filtered = reportData.resources;

    // 按类型过滤
    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === selectedType);
    }

    // 按来源过滤
    if (selectedSource !== 'all') {
      filtered = filtered.filter(r => r.source === selectedSource);
    }

    // 按搜索词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredResources(filtered);
  }, [reportData, selectedType, selectedSource, searchQuery]);

  // 导出数据
  const exportData = (format: 'json' | 'csv' | 'html') => {
    if (!reportData) return;

    if (format === 'json') {
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mcp-report-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const csvHeaders = ['Title', 'URL', 'Type', 'Description', 'Source', 'Language', 'Rating', 'Tags'];
      const csvRows = reportData.resources.map(r => [
        r.title, r.url, r.type, r.description, r.source, r.language, r.rating, r.tags.join(';')
      ]);
      
      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mcp-report-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'html') {
      generateHTMLReport();
    }
  };

  // 生成 HTML 报告
  const generateHTMLReport = () => {
    if (!reportData) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MCP 资源收集报告</title>
    <style>
        body { font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; background: #0f172a; color: #e2e8f0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #7c3aed); padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5rem; font-weight: bold; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155; }
        .stat-card h3 { margin: 0 0 15px; color: #60a5fa; font-size: 1.1rem; }
        .stat-item { display: flex; justify-between; margin-bottom: 8px; }
        .resource-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .resource-type { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; color: white; font-weight: 600; margin-bottom: 10px; }
        .type-tutorial { background: #059669; }
        .type-documentation { background: #2563eb; }
        .type-tool { background: #7c3aed; }
        .type-service { background: #ea580c; }
        .type-article { background: #64748b; }
        .type-example { background: #eab308; color: #000; }
        .type-video { background: #dc2626; }
        .resource-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 8px; }
        .resource-title a { color: #e2e8f0; text-decoration: none; }
        .resource-title a:hover { color: #60a5fa; }
        .resource-meta { display: flex; gap: 15px; margin-bottom: 10px; font-size: 0.875rem; color: #94a3b8; }
        .resource-tags { margin-top: 12px; }
        .tag { display: inline-block; background: #374151; color: #d1d5db; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-right: 6px; margin-bottom: 4px; }
        .rating { color: #fbbf24; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 MCP 资源收集报告</h1>
            <p>收集时间: ${new Date(reportData.collected_at).toLocaleString('zh-CN')}</p>
            <p>总计资源: ${reportData.stats.total_resources} 个</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>📊 按类型分布</h3>
                ${Object.entries(reportData.stats.by_type).map(([type, count]) => 
                  `<div class="stat-item"><span>${type}</span><span>${count}</span></div>`
                ).join('')}
            </div>
            <div class="stat-card">
                <h3>🔗 按来源分布</h3>
                ${Object.entries(reportData.stats.by_source).map(([source, count]) => 
                  `<div class="stat-item"><span>${source}</span><span>${count}</span></div>`
                ).join('')}
            </div>
            <div class="stat-card">
                <h3>🌍 按语言分布</h3>
                ${Object.entries(reportData.stats.by_language).map(([lang, count]) => 
                  `<div class="stat-item"><span>${lang}</span><span>${count}</span></div>`
                ).join('')}
            </div>
            <div class="stat-card">
                <h3>🏷️ 热门标签</h3>
                ${Object.entries(reportData.stats.top_tags)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 8)
                  .map(([tag, count]) => 
                    `<div class="stat-item"><span>${tag}</span><span>${count}</span></div>`
                  ).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h2>📚 收集资源列表</h2>
        </div>
        
        ${reportData.resources.map(resource => `
            <div class="resource-card">
                <div class="resource-type type-${resource.type}">${resource.type.toUpperCase()}</div>
                <div class="resource-title">
                    <a href="${resource.url}" target="_blank">${resource.title}</a>
                </div>
                <div class="resource-meta">
                    <span>📍 来源: ${resource.source}</span>
                    <span>🌍 语言: ${resource.language}</span>
                    <span class="rating">⭐ 评分: ${resource.rating}/5</span>
                    <span>📅 ${new Date(resource.date_found).toLocaleDateString('zh-CN')}</span>
                </div>
                <p style="color: #cbd5e1; line-height: 1.6;">${resource.description}</p>
                <div class="resource-tags">
                    ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    const dataBlob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mcp-report-${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      tutorial: 'bg-green-500',
      documentation: 'bg-blue-500',
      service: 'bg-orange-500',
      tool: 'bg-purple-500',
      article: 'bg-gray-500',
      example: 'bg-yellow-500',
      video: 'bg-red-500',
      other: 'bg-gray-400'
    };
    return colors[type] || 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">加载报告数据中...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">未找到报告数据</h2>
          <p className="text-gray-400 mb-6">请先使用收集工具生成报告</p>
          <Link 
            href="/zh#playground"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            返回收集工具
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/zh#playground"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回收集工具
              </Link>
              <div className="border-l border-gray-700 pl-4">
                <h1 className="text-2xl font-bold">MCP 资源收集报告</h1>
                <p className="text-sm text-gray-400">
                  收集时间: {new Date(reportData.collected_at).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => exportData('json')}
                className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                JSON
              </button>
              <button
                onClick={() => exportData('csv')}
                className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </button>
              <button
                onClick={() => exportData('html')}
                className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                HTML
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">总资源数</p>
                <p className="text-2xl font-bold text-blue-400">{reportData.stats.total_resources}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">资源类型</p>
                <p className="text-2xl font-bold text-green-400">{Object.keys(reportData.stats.by_type).length}</p>
              </div>
              <Tag className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">数据来源</p>
                <p className="text-2xl font-bold text-purple-400">{Object.keys(reportData.stats.by_source).length}</p>
              </div>
              <Globe className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">支持语言</p>
                <p className="text-2xl font-bold text-yellow-400">{Object.keys(reportData.stats.by_language).length}</p>
              </div>
              <Globe className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 搜索 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">搜索资源</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索标题、描述或标签..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 类型筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">按类型筛选</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部类型</option>
                {Object.entries(reportData.stats.by_type).map(([type, count]) => (
                  <option key={type} value={type}>{type} ({count})</option>
                ))}
              </select>
            </div>

            {/* 来源筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">按来源筛选</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部来源</option>
                {Object.entries(reportData.stats.by_source).map(([source, count]) => (
                  <option key={source} value={source}>{source} ({count})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 结果统计 */}
        <div className="mb-6">
          <p className="text-gray-300">
            显示 {filteredResources.length} / {reportData.stats.total_resources} 个资源
          </p>
        </div>

        {/* 资源列表 */}
        <div className="space-y-6">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">没有找到符合条件的资源</p>
            </div>
          ) : (
            filteredResources.map((resource, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getTypeColor(resource.type)}`}>
                        {resource.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-400">{resource.source}</span>
                      <span className="text-sm text-gray-400">{resource.language}</span>
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm">{resource.rating}/5</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors flex items-center"
                      >
                        {resource.title}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </h3>
                    
                    <p className="text-gray-300 mb-4 leading-relaxed">{resource.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(resource.date_found).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MCPReportPage;