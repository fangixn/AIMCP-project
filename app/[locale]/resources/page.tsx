'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink, BookOpen, Github, Code, Users, MessageSquare, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const mcpResources = [
  {
    category: 'official',
    items: [
      {
        title: 'Model Context Protocol',
        description: 'Official MCP introduction and documentation',
        url: 'https://modelcontextprotocol.io/introduction',
        type: 'documentation'
      },
      {
        title: 'MCP GitHub Repository',
        description: 'Source code and community contributions',
        url: 'https://github.com/modelcontextprotocol',
        type: 'code'
      }
    ]
  },
  {
    category: 'platforms',
    items: [
      {
        title: 'OpenAI MCP',
        description: 'OpenAI\'s implementation and documentation for MCP',
        url: 'https://platform.openai.com/docs/mcp',
        type: 'documentation'
      },
      {
        title: 'Anthropic MCP',
        description: 'Anthropic\'s announcement and guide for MCP',
        url: 'https://www.anthropic.com/news/model-context-protocol',
        type: 'news'
      },
      {
        title: 'Hugging Face MCP',
        description: 'Hugging Face blog post about MCP implementation',
        url: 'https://huggingface.co/blog/Kseniase/mcp',
        type: 'blog'
      }
    ]
  },
  {
    category: 'community',
    items: [
      {
        title: 'MCP 终极指南',
        description: 'Comprehensive Chinese guide to Model Context Protocol',
        url: 'https://guangzhengli.com/blog/zh/model-context-protocol',
        type: 'tutorial'
      },
      {
        title: 'Logto MCP Guide',
        description: 'What is MCP and why it matters',
        url: 'https://blog.logto.io/th/what-is-mcp',
        type: 'blog'
      },
      {
        title: 'Medium: Understanding MCP',
        description: 'What is MCP and why you should pay attention',
        url: 'https://waleedk.medium.com/what-is-mcp-and-why-you-should-pay-attention-31524da7733f',
        type: 'blog'
      }
    ]
  },
  {
    category: 'servers',
    items: [
      {
        title: 'MCP Servers Directory',
        description: 'Comprehensive directory of available MCP servers',
        url: 'https://mcp.so/',
        type: 'directory'
      },
      {
        title: 'Reddit: MCP Discussion',
        description: 'Community discussion about MCP usage and implementation',
        url: 'https://www.reddit.com/r/ClaudeAI/comments/1h55zxd/can_someone_explain_mcp_to_me_how_are_you_using/',
        type: 'discussion'
      }
    ]
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'documentation':
      return <BookOpen className="h-5 w-5" />;
    case 'code':
      return <Github className="h-5 w-5" />;
    case 'blog':
    case 'tutorial':
      return <Code className="h-5 w-5" />;
    case 'directory':
      return <Users className="h-5 w-5" />;
    case 'discussion':
      return <MessageSquare className="h-5 w-5" />;
    default:
      return <ExternalLink className="h-5 w-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'documentation':
      return 'bg-blue-600';
    case 'code':
      return 'bg-gray-600';
    case 'blog':
    case 'tutorial':
      return 'bg-green-600';
    case 'directory':
      return 'bg-purple-600';
    case 'discussion':
      return 'bg-orange-600';
    default:
      return 'bg-gray-600';
  }
};

export default function ResourcesPage() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">{t('resources.title')}</h1>
              <p className="text-gray-400 mt-1">{t('resources.subtitle')}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Official Documentation */}
        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{t('resources.officialDocs.title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mcpResources.find(cat => cat.category === 'official')?.items.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${getTypeColor(resource.type)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {getIcon(resource.type)}
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Platform Guides */}
        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{t('resources.platformGuides.title')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {mcpResources.find(cat => cat.category === 'platforms')?.items.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${getTypeColor(resource.type)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {getIcon(resource.type)}
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Community Resources */}
        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{t('resources.communityResources.title')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {mcpResources.find(cat => cat.category === 'community')?.items.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${getTypeColor(resource.type)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {getIcon(resource.type)}
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* MCP Servers */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{t('servers.title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mcpResources.find(cat => cat.category === 'servers')?.items.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${getTypeColor(resource.type)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {getIcon(resource.type)}
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 