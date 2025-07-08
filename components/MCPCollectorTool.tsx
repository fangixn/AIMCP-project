'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Pause, Download, RefreshCw, Search, Filter, BarChart3, FileText } from 'lucide-react';

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

interface CollectionProgress {
  step: string;
  progress: number;
  total_steps: number;
  current_keyword?: string;
  collected_count: number;
  message: string;
}

const MCPCollectorTool: React.FC = () => {
  const t = useTranslations();
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState<CollectionProgress | null>(null);
  const [resources, setResources] = useState<MCPResource[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [customKeywords, setCustomKeywords] = useState<string>('');
  const [includeGithub, setIncludeGithub] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('collector');
  const [showSuccess, setShowSuccess] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // 加载收藏夹
  useEffect(() => {
    const savedFavorites = localStorage.getItem('mcpFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // 保存收藏夹到localStorage
  const saveFavorites = (newFavorites: Set<string>) => {
    localStorage.setItem('mcpFavorites', JSON.stringify(Array.from(newFavorites)));
  };

  // 切换收藏状态
  const toggleFavorite = (url: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(url)) {
      newFavorites.delete(url);
    } else {
      newFavorites.add(url);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  // 获取收藏的资源
  const favoriteResources = resources.filter(resource => favorites.has(resource.url));

  // 默认关键词
  const defaultKeywords = [
    "Model Context Protocol MCP",
    "MCP tutorial", 
    "MCP server implementation",
    "MCP client examples",
    "Anthropic MCP"
  ];

  // 开始收集资源
  const startCollection = async () => {
    if (isCollecting) return;
    
    setIsCollecting(true);
    setProgress(null);
    setResources([]);
    setStats(null);
    setShowSuccess(false);
    
    const keywords = customKeywords.trim() 
      ? customKeywords.split(',').map(k => k.trim())
      : defaultKeywords;
    
    try {
      // 启动实时进度监听
      const progressResponse = await fetch('/api/mcp-collect-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, includeGithub })
      });
      
      if (!progressResponse.ok) throw new Error('Failed to start collection');
      
      const reader = progressResponse.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                setProgress(data);
              } catch (e) {
                console.error('Failed to parse progress data:', e);
              }
            }
          }
        }
      }
      
      // 收集完成后获取实际数据
      const collectionResponse = await fetch('/api/mcp-collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, includeGithub })
      });
      
      if (collectionResponse.ok) {
        const result = await collectionResponse.json();
        if (result.success) {
          setResources(result.data.resources);
          setStats(result.data.stats);
          
          // 保存数据到 localStorage 用于报告页面
          localStorage.setItem('mcpCollectionData', JSON.stringify({
            resources: result.data.resources,
            stats: result.data.stats,
            timestamp: new Date().toISOString()
          }));

          // 收集完成后自动切换到结果标签页并显示成功提示
          setActiveTab('results');
          setShowSuccess(true);
          
          // 3秒后隐藏成功提示
          setTimeout(() => setShowSuccess(false), 3000);
        }
      }
      
    } catch (error) {
      console.error('Collection error:', error);
      setProgress({ 
        step: 'error', 
        progress: 0, 
        total_steps: 0, 
        collected_count: 0, 
        message: 'Collection failed. Please try again.' 
      });
    } finally {
      setIsCollecting(false);
    }
  };

  // 导出数据
  const exportData = (format: 'json' | 'csv') => {
    if (!resources.length) return;
    
    if (format === 'json') {
      const dataStr = JSON.stringify({ resources, stats }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mcp-resources-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const csvHeaders = ['Title', 'URL', 'Type', 'Description', 'Source', 'Language', 'Rating', 'Tags'];
      const csvRows = resources.map(r => [
        r.title, r.url, r.type, r.description, r.source, r.language, r.rating, r.tags.join(';')
      ]);
      
      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mcp-resources-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // 筛选资源
  const filteredResources = resources.filter(resource => {
    if (selectedFilter === 'all') return true;
    return resource.type === selectedFilter;
  });

  // 获取进度百分比
  const getProgressPercentage = () => {
    if (!progress) return 0;
    return Math.round((progress.progress / progress.total_steps) * 100);
  };

  // 资源类型颜色映射
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

  // 获取学习优先级
  const getLearningPriority = (resource: MCPResource) => {
    // 根据资源特征计算优先级
    const title = resource.title.toLowerCase();
    const tags = resource.tags.join(' ').toLowerCase();
    const source = resource.source.toLowerCase();
    
    // 高优先级：官方文档、入门教程、SDK
    if (source.includes('official') || 
        title.includes('official') || 
        title.includes('documentation') ||
        title.includes('sdk') ||
        tags.includes('official') ||
        tags.includes('beginner') ||
        resource.type === 'documentation' && resource.rating >= 4) {
      return { level: '高', color: 'bg-green-500', text: '推荐优先学习' };
    }
    
    // 中优先级：教程、示例、工具
    if (resource.type === 'tutorial' || 
        resource.type === 'example' ||
        title.includes('tutorial') ||
        title.includes('guide') ||
        tags.includes('tutorial') ||
        resource.rating >= 4) {
      return { level: '中', color: 'bg-yellow-500', text: '适合深入学习' };
    }
    
    // 低优先级：其他资源
    return { level: '低', color: 'bg-gray-500', text: '补充参考' };
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      {/* 成功提示 */}
      {showSuccess && (
        <div className="mb-4 bg-green-600 text-white p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{t('playground.collector.success.title')} {t('playground.collector.success.message', { count: resources.length })}</span>
          </div>
          <button 
            onClick={() => setShowSuccess(false)}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* 标签页 */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('collector')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'collector'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Search className="inline w-4 h-4 mr-2" />
          {t('playground.collector.tabs.collector')}
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'results'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="inline w-4 h-4 mr-2" />
          {t('playground.collector.tabs.results')} ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'stats'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 className="inline w-4 h-4 mr-2" />
          {t('playground.collector.tabs.stats')}
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="inline w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {t('playground.collector.tabs.favorites')} ({favorites.size})
        </button>
      </div>

      {/* 收集器标签页 */}
      {activeTab === 'collector' && (
        <div className="space-y-6">
          {/* 配置区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                搜索关键词 (用逗号分隔)
              </label>
              <textarea
                value={customKeywords}
                onChange={(e) => setCustomKeywords(e.target.value)}
                placeholder="输入自定义关键词，留空使用默认关键词"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                收集选项
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeGithub}
                    onChange={(e) => setIncludeGithub(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">包含 GitHub 项目搜索</span>
                </label>
              </div>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex space-x-4">
            <button
              onClick={startCollection}
              disabled={isCollecting}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isCollecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  收集中...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  开始收集
                </>
              )}
            </button>
            
            {resources.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <a
                  href="/report"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  查看详细报告
                </a>
                <button
                  onClick={() => exportData('json')}
                  className="flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出 JSON
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出 CSV
                </button>
              </div>
            )}
          </div>

          {/* 进度显示 */}
          {progress && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">
                  {progress.message}
                </span>
                <span className="text-sm text-gray-400">
                  {getProgressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                步骤 {progress.progress}/{progress.total_steps} • 
                已收集 {progress.collected_count} 个资源
                {progress.current_keyword && ` • 当前: ${progress.current_keyword}`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAQ部分 - 在收集器标签页添加 */}
      {activeTab === 'collector' && (
        <div className="mt-8 bg-gradient-to-r from-indigo-900/40 to-blue-900/40 rounded-lg p-6 border border-indigo-500">
          <h4 className="text-xl font-bold text-indigo-300 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            MCP Agent 常见问题解答
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-indigo-800/30 rounded-lg p-4">
                <h5 className="font-semibold text-indigo-200 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm mr-2">Q</span>
                  什么是 Model Context Protocol (MCP)?
                </h5>
                <p className="text-indigo-100 text-sm pl-8">
                  MCP 是 Anthropic 开发的开放协议，让AI助手能够安全地访问外部数据和工具。它建立了标准化的连接方式，使得Claude等AI可以与各种服务和数据源进行交互。
                </p>
              </div>
              
              <div className="bg-indigo-800/30 rounded-lg p-4">
                <h5 className="font-semibold text-indigo-200 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm mr-2">Q</span>
                  我需要什么技能才能开始使用 MCP?
                </h5>
                <p className="text-indigo-100 text-sm pl-8">
                  基础使用只需要会安装软件和阅读文档。如果要开发自定义服务器，建议掌握 Python 或 TypeScript 基础知识。大部分教程都有详细的步骤说明。
                </p>
              </div>
              
              <div className="bg-indigo-800/30 rounded-lg p-4">
                <h5 className="font-semibold text-indigo-200 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm mr-2">Q</span>
                  MCP 服务器运行需要什么环境?
                </h5>
                <p className="text-indigo-100 text-sm pl-8">
                  大多数 MCP 服务器可以在本地运行，支持 Windows、macOS 和 Linux。Python 服务器需要 Python 3.10+，TypeScript 服务器需要 Node.js 18+。
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-indigo-800/30 rounded-lg p-4">
                <h5 className="font-semibold text-indigo-200 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm mr-2">Q</span>
                  如何与 Claude Desktop 集成?
                </h5>
                <p className="text-indigo-100 text-sm pl-8">
                  需要修改 Claude Desktop 的配置文件，添加 MCP 服务器信息。具体路径：Windows 在 %APPDATA%/Claude/，macOS 在 ~/Library/Application Support/Claude/。
                </p>
              </div>
              
              <div className="bg-indigo-800/30 rounded-lg p-4">
                <h5 className="font-semibold text-indigo-200 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm mr-2">Q</span>
                  MCP 安全吗？会不会泄露数据?
                </h5>
                <p className="text-indigo-100 text-sm pl-8">
                  MCP 设计了严格的权限控制机制。服务器只能访问明确授权的资源，AI 不能直接执行系统命令。但仍建议不要在生产环境中暴露敏感数据。
                </p>
              </div>
              
              <div className="bg-indigo-800/30 rounded-lg p-4">
                <h5 className="font-semibold text-indigo-200 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm mr-2">Q</span>
                  遇到问题时应该怎么排查?
                </h5>
                <p className="text-indigo-100 text-sm pl-8">
                  首先检查服务器日志和 Claude Desktop 的连接状态。大多数问题都是配置错误或依赖缺失导致的。GitHub Issues 和社区论坛有很多解决方案。
                </p>
              </div>
            </div>
          </div>
          
          {/* 快速链接 */}
          <div className="mt-6 bg-indigo-700/30 rounded-lg p-4">
            <h5 className="font-medium text-indigo-200 mb-3">🔗 快速链接</h5>
            <div className="flex flex-wrap gap-3">
              <a href="https://modelcontextprotocol.io/quickstart" target="_blank" rel="noopener noreferrer" 
                 className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center">
                官方快速开始
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer"
                 className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center">
                官方服务器示例
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://github.com/modelcontextprotocol/python-sdk" target="_blank" rel="noopener noreferrer"
                 className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center">
                Python SDK
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noopener noreferrer"
                 className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center">
                TypeScript SDK
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 结果标签页 */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {/* MCP使用指南 */}
          {resources.length > 0 && (
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                MCP Agent 使用最佳实践与学习路径
              </h3>
              
              {/* 学习路径 */}
              <div className="mb-6">
                <h4 className="font-semibold text-blue-200 mb-3 text-lg">📚 推荐学习路径</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-800/30 rounded-lg p-4 border border-blue-600">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full mr-2">第1步</span>
                      <h5 className="font-medium text-blue-200">理解基础概念</h5>
                    </div>
                    <ul className="text-blue-100 text-sm space-y-1">
                      <li>• 阅读官方文档了解MCP协议</li>
                      <li>• 理解服务器-客户端架构</li>
                      <li>• 学习资源、工具、提示的概念</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-800/30 rounded-lg p-4 border border-green-600">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full mr-2">第2步</span>
                      <h5 className="font-medium text-green-200">动手实践</h5>
                    </div>
                    <ul className="text-green-100 text-sm space-y-1">
                      <li>• 安装Python/TypeScript SDK</li>
                      <li>• 运行文件系统服务器示例</li>
                      <li>• 配置Claude Desktop集成</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-600">
                    <div className="flex items-center mb-2">
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full mr-2">第3步</span>
                      <h5 className="font-medium text-purple-200">构建应用</h5>
                    </div>
                    <ul className="text-purple-100 text-sm space-y-1">
                      <li>• 开发自定义MCP服务器</li>
                      <li>• 集成数据库和API</li>
                      <li>• 部署和分享你的服务器</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 实用案例 */}
              <div className="mb-6">
                <h4 className="font-semibold text-blue-200 mb-3 text-lg">🛠️ 实际应用案例</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <h5 className="font-medium text-white mb-2 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      文件管理助手
                    </h5>
                    <p className="text-gray-300 text-sm mb-2">使用文件系统服务器让Claude帮你管理本地文件</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-green-600 text-xs text-white rounded">初学者友好</span>
                      <span className="px-2 py-1 bg-blue-600 text-xs text-white rounded">官方示例</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <h5 className="font-medium text-white mb-2 flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      代码仓库分析
                    </h5>
                    <p className="text-gray-300 text-sm mb-2">连接Git仓库，让Claude分析代码结构和历史</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-yellow-600 text-xs text-white rounded">中等难度</span>
                      <span className="px-2 py-1 bg-gray-600 text-xs text-white rounded">开发工具</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <h5 className="font-medium text-white mb-2 flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      数据库查询助手
                    </h5>
                    <p className="text-gray-300 text-sm mb-2">连接PostgreSQL，让Claude帮你写复杂SQL查询</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-red-600 text-xs text-white rounded">高级应用</span>
                      <span className="px-2 py-1 bg-indigo-600 text-xs text-white rounded">数据分析</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <h5 className="font-medium text-white mb-2 flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                      API集成中心
                    </h5>
                    <p className="text-gray-300 text-sm mb-2">创建统一接口，让Claude访问多个第三方API</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-orange-600 text-xs text-white rounded">企业级</span>
                      <span className="px-2 py-1 bg-teal-600 text-xs text-white rounded">集成方案</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 开发技巧 */}
              <div className="mb-6">
                <h4 className="font-semibold text-blue-200 mb-3 text-lg">💡 开发技巧与注意事项</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-green-300 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      最佳实践
                    </h5>
                    <ul className="text-blue-100 text-sm space-y-1">
                      <li>• 始终验证输入参数的有效性</li>
                      <li>• 提供清晰的错误消息和日志</li>
                      <li>• 使用类型提示提高代码质量</li>
                      <li>• 实现适当的权限和安全检查</li>
                      <li>• 编写单元测试覆盖核心功能</li>
                      <li>• 遵循官方命名和结构约定</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-red-300 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      常见陷阱
                    </h5>
                    <ul className="text-blue-100 text-sm space-y-1">
                      <li>• 不要在服务器中存储敏感信息</li>
                      <li>• 避免阻塞操作影响响应性能</li>
                      <li>• 注意处理大文件和内存使用</li>
                      <li>• 确保跨平台兼容性</li>
                      <li>• 不要忽略版本兼容性问题</li>
                      <li>• 避免过度复杂的嵌套结构</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 社区资源 */}
              <div>
                <h4 className="font-semibold text-blue-200 mb-3 text-lg">🌟 推荐优先学习的资源</h4>
                <div className="bg-gradient-to-r from-blue-800/40 to-purple-800/40 rounded-lg p-4 border border-blue-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h5 className="font-medium text-white text-sm">官方文档</h5>
                      <p className="text-blue-200 text-xs">权威、全面、及时更新</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h5 className="font-medium text-white text-sm">Python SDK</h5>
                      <p className="text-green-200 text-xs">最成熟的开发工具</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h5 className="font-medium text-white text-sm">文件系统示例</h5>
                      <p className="text-purple-200 text-xs">最佳入门起点</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 筛选器 */}
          {resources.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                全部 ({resources.length})
              </button>
              {stats && Object.entries(stats.by_type).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => setSelectedFilter(type)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedFilter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type} ({count})
                </button>
              ))}
            </div>
          )}

          {/* 资源列表 */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  {resources.length === 0 ? '暂无收集结果，请先开始收集' : '没有符合筛选条件的资源'}
                </p>
              </div>
            ) : (
              filteredResources.map((resource, index) => {
                const priority = getLearningPriority(resource);
                return (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2 flex-wrap">
                          <span className={`px-2 py-1 rounded text-xs text-white font-medium ${getTypeColor(resource.type)}`}>
                            {resource.type.toUpperCase()}
                          </span>
                          {/* 学习优先级指示器 */}
                          <span className={`px-2 py-1 rounded-full text-xs text-white font-medium ${priority.color}`}>
                            优先级: {priority.level}
                          </span>
                          <span className="text-xs text-gray-400">{resource.source}</span>
                          <span className="text-xs text-gray-400">{resource.language}</span>
                          {/* 推荐星级 */}
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${i < resource.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-gray-500 ml-1">({resource.rating}/5)</span>
                          </div>
                        </div>
                        <h4 className="font-medium text-white mb-2">
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition-colors flex items-center"
                          >
                            {resource.title}
                            <svg className="w-3 h-3 ml-1 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </h4>
                        <p className="text-sm text-gray-400 mb-3">{resource.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded hover:bg-gray-600 transition-colors">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* 收藏按钮 */}
                      <button
                        onClick={() => toggleFavorite(resource.url)}
                        className={`ml-4 p-2 rounded-lg transition-colors ${
                          favorites.has(resource.url)
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                        }`}
                        title={favorites.has(resource.url) ? '取消收藏' : '收藏'}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 统计标签页 */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          {/* 学习建议 */}
          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg p-6 border border-purple-500">
            <h4 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              基于收集结果的学习建议
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-lg p-4">
                <h5 className="font-medium text-purple-200 mb-2">📊 数据洞察</h5>
                <ul className="text-purple-100 text-sm space-y-1">
                  <li>• 共收集到 {stats.total_resources} 个相关资源</li>
                  <li>• 涵盖 {Object.keys(stats.by_type).length} 种不同类型</li>
                  <li>• 支持 {Object.keys(stats.by_language).length} 种语言</li>
                  <li>• 来自 {Object.keys(stats.by_source).length} 个不同来源</li>
                </ul>
              </div>
              <div className="bg-blue-800/30 rounded-lg p-4">
                <h5 className="font-medium text-blue-200 mb-2">🎯 学习重点</h5>
                <ul className="text-blue-100 text-sm space-y-1">
                  {stats.by_type.documentation && (
                    <li>• 优先阅读 {stats.by_type.documentation} 个官方文档</li>
                  )}
                  {stats.by_type.tutorial && (
                    <li>• 跟随 {stats.by_type.tutorial} 个教程进行实践</li>
                  )}
                  {stats.by_type.tool && (
                    <li>• 尝试使用 {stats.by_type.tool} 个开发工具</li>
                  )}
                  {stats.by_type.example && (
                    <li>• 研究 {stats.by_type.example} 个实际示例</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 className="font-medium text-white mb-3">按类型分布</h4>
            <div className="space-y-2">
              {Object.entries(stats.by_type).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-gray-300">{type}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 className="font-medium text-white mb-3">按来源分布</h4>
            <div className="space-y-2">
              {Object.entries(stats.by_source).map(([source, count]) => (
                <div key={source} className="flex justify-between items-center">
                  <span className="text-gray-300">{source}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 className="font-medium text-white mb-3">按语言分布</h4>
            <div className="space-y-2">
              {Object.entries(stats.by_language).map(([language, count]) => (
                <div key={language} className="flex justify-between items-center">
                  <span className="text-gray-300">{language}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 className="font-medium text-white mb-3">热门标签</h4>
            <div className="space-y-2">
              {Object.entries(stats.top_tags)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([tag, count]) => (
                  <div key={tag} className="flex justify-between items-center">
                    <span className="text-gray-300">{tag}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 个性化学习计划 */}
        <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 rounded-lg p-6 border border-green-500">
          <h4 className="text-xl font-bold text-green-300 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            AI生成的个性化学习计划
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 新手计划 */}
            <div className="bg-blue-800/30 rounded-lg p-5 border border-blue-600">
              <div className="flex items-center mb-3">
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full mr-3">新手路径</span>
                <span className="text-blue-300 text-sm">预计 3-5 天</span>
              </div>
              <h5 className="font-semibold text-blue-200 mb-3">MCP 快速入门</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-100">Day 1: 阅读官方文档基础部分</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-100">Day 2: 安装Python SDK并运行第一个示例</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-100">Day 3: 配置Claude Desktop集成</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-100">Day 4-5: 尝试文件系统服务器</span>
                </div>
              </div>
            </div>

            {/* 进阶计划 */}
            <div className="bg-purple-800/30 rounded-lg p-5 border border-purple-600">
              <div className="flex items-center mb-3">
                <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full mr-3">进阶路径</span>
                <span className="text-purple-300 text-sm">预计 1-2 周</span>
              </div>
              <h5 className="font-semibold text-purple-200 mb-3">自定义服务器开发</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-purple-100">Week 1: 深入理解MCP协议规范</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-purple-100">研究多个服务器实现案例</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-purple-100">Week 2: 开发你的第一个自定义服务器</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-purple-100">集成外部API和数据库</span>
                </div>
              </div>
            </div>

            {/* 专家计划 */}
            <div className="bg-orange-800/30 rounded-lg p-5 border border-orange-600">
              <div className="flex items-center mb-3">
                <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full mr-3">专家路径</span>
                <span className="text-orange-300 text-sm">持续学习</span>
              </div>
              <h5 className="font-semibold text-orange-200 mb-3">生态系统贡献</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-orange-100">构建企业级MCP解决方案</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-orange-100">为开源社区贡献代码</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-orange-100">编写教程和最佳实践文档</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-orange-100">参与协议标准制定</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 实用工具和技巧 */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-600">
          <h4 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            开发者实用工具箱
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h5 className="font-medium text-white mb-2">代码生成器</h5>
              <p className="text-gray-400 text-sm">基于模板快速生成MCP服务器骨架代码</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h5 className="font-medium text-white mb-2">调试助手</h5>
              <p className="text-gray-400 text-sm">实时监控MCP连接状态和消息流</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h5 className="font-medium text-white mb-2">配置管理</h5>
              <p className="text-gray-400 text-sm">统一管理多个MCP服务器配置</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="bg-orange-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h5 className="font-medium text-white mb-2">部署工具</h5>
              <p className="text-gray-400 text-sm">一键部署到Docker、云服务等平台</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 收藏夹标签页 */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteResources.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-400 mb-2">暂无收藏资源</h3>
              <p className="text-gray-500">在收集结果中点击⭐按钮即可收藏喜欢的资源</p>
              <button 
                onClick={() => setActiveTab('collector')}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                开始收集资源
              </button>
            </div>
          ) : (
            <>
              {/* 收藏夹统计 */}
              <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-lg p-4 border border-yellow-500">
                <h4 className="text-lg font-semibold text-yellow-300 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  我的收藏资源库
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-200">{favoriteResources.length}</div>
                    <div className="text-yellow-300">总收藏</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-200">
                      {new Set(favoriteResources.map(r => r.type)).size}
                    </div>
                    <div className="text-yellow-300">资源类型</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-200">
                      {new Set(favoriteResources.map(r => r.source)).size}
                    </div>
                    <div className="text-yellow-300">资源来源</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-200">
                      {(favoriteResources.reduce((sum, r) => sum + r.rating, 0) / favoriteResources.length).toFixed(1)}
                    </div>
                    <div className="text-yellow-300">平均评分</div>
                  </div>
                </div>
              </div>

              {/* 收藏的资源列表 */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {favoriteResources.map((resource, index) => {
                  const priority = getLearningPriority(resource);
                  return (
                    <div key={index} className="bg-gray-800 rounded-lg p-4 border border-yellow-600/30 hover:border-yellow-500/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2 flex-wrap">
                            <span className={`px-2 py-1 rounded text-xs text-white font-medium ${getTypeColor(resource.type)}`}>
                              {resource.type.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs text-white font-medium ${priority.color}`}>
                              优先级: {priority.level}
                            </span>
                            <span className="text-xs text-gray-400">{resource.source}</span>
                            <span className="text-xs text-gray-400">{resource.language}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 ${i < resource.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-xs text-gray-500 ml-1">({resource.rating}/5)</span>
                            </div>
                          </div>
                          <h4 className="font-medium text-white mb-2">
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-400 transition-colors flex items-center"
                            >
                              {resource.title}
                              <svg className="w-3 h-3 ml-1 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </a>
                          </h4>
                          <p className="text-sm text-gray-400 mb-3">{resource.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded hover:bg-gray-600 transition-colors">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(resource.url)}
                          className="ml-4 p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                          title="取消收藏"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MCPCollectorTool;