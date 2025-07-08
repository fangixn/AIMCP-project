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

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
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
          资源收集器
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
          收集结果 ({resources.length})
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
          统计分析
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
              <div className="flex space-x-2">
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

      {/* 结果标签页 */}
      {activeTab === 'results' && (
        <div className="space-y-4">
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
              filteredResources.map((resource, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs text-white ${getTypeColor(resource.type)}`}>
                          {resource.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">{resource.source}</span>
                        <span className="text-xs text-gray-400">{resource.language}</span>
                      </div>
                      <h4 className="font-medium text-white mb-2">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-400 transition-colors"
                        >
                          {resource.title}
                        </a>
                      </h4>
                      <p className="text-sm text-gray-400 mb-2">{resource.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">
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
      )}

      {/* 统计标签页 */}
      {activeTab === 'stats' && stats && (
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
      )}
    </div>
  );
};

export default MCPCollectorTool;