'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Code, Database, Zap, FileText, Users, ExternalLink, Menu, X, Play, BookOpen, MessageSquare, HelpCircle, Globe } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import MCPCollectorTool from '../../components/MCPCollectorTool';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">AIMCP</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">
                {t('navigation.features')}
              </button>
              <button onClick={() => scrollToSection('playground')} className="text-gray-300 hover:text-white transition-colors">
                {t('navigation.playground')}
              </button>
              <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
                {t('navigation.docs')}
              </Link>
              <Link href="/resources" className="text-gray-300 hover:text-white transition-colors">
                {t('navigation.resources')}
              </Link>
              <button onClick={() => scrollToSection('servers')} className="text-gray-300 hover:text-white transition-colors">
                {t('navigation.servers')}
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800 py-4">
              <nav className="flex flex-col space-y-4">
                <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors text-left">
                  {t('navigation.features')}
                </button>
                <button onClick={() => scrollToSection('playground')} className="text-gray-300 hover:text-white transition-colors text-left">
                  {t('navigation.playground')}
                </button>
                <Link href="/docs" className="text-gray-300 hover:text-white transition-colors text-left">
                  {t('navigation.docs')}
                </Link>
                <Link href="/resources" className="text-gray-300 hover:text-white transition-colors text-left">
                  {t('navigation.resources')}
                </Link>
                <button onClick={() => scrollToSection('servers')} className="text-gray-300 hover:text-white transition-colors text-left">
                  {t('navigation.servers')}
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('playground')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Play className="h-5 w-5" />
              <span>{t('hero.tryPlayground')}</span>
            </button>
            <Link 
              href="/docs"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-600"
            >
              <BookOpen className="h-5 w-5" />
              <span>{t('hero.readDocs')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('features.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('features.contextStandardization.title')}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t('features.contextStandardization.description')}
              </p>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('features.multiModelCollaboration.title')}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t('features.multiModelCollaboration.description')}
              </p>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('features.serverArchitecture.title')}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t('features.serverArchitecture.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MCP Collector Tool Section */}
      <section id="playground" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('playground.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('playground.subtitle')}
            </p>
          </div>

          <MCPCollectorTool />
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('documentation.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('documentation.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/docs" className="block bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('documentation.quickStart.title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('documentation.quickStart.description')}
              </p>
            </Link>

            <Link href="/docs" className="block bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('documentation.protocolSpec.title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('documentation.protocolSpec.description')}
              </p>
            </Link>

            <Link href="/docs" className="block bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('documentation.serverDevelopment.title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('documentation.serverDevelopment.description')}
              </p>
            </Link>

            <Link href="/docs" className="block bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('documentation.apiReference.title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('documentation.apiReference.description')}
              </p>
            </Link>

            <Link href="/docs" className="block bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('documentation.examples.title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('documentation.examples.description')}
              </p>
            </Link>

            <Link href="/docs" className="block bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('documentation.bestPractices.title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('documentation.bestPractices.description')}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Resources Section - Based on MCP document */}
      <section id="resources" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('resources.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {t('resources.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/resources"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                {t('resources.viewResource')}
              </Link>
              <button
                onClick={() => scrollToSection('playground')}
                className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Code className="h-5 w-5 mr-2" />
                {t('playground.launchPlayground')}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Official Documentation */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('resources.officialDocs.title')}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('resources.officialDocs.description')}
              </p>
              <div className="space-y-3">
                <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-sm">Model Context Protocol</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
                <a href="https://github.com/modelcontextprotocol" target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-sm">GitHub Repository</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Platform Guides */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('resources.platformGuides.title')}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('resources.platformGuides.description')}
              </p>
              <div className="space-y-3">
                <a href="https://platform.openai.com/docs/mcp" target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-sm">OpenAI MCP</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
                <a href="https://www.anthropic.com/news/model-context-protocol" target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-sm">Anthropic MCP</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
                <a href="https://huggingface.co/blog/Kseniase/mcp" target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-sm">Hugging Face MCP</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Community Resources */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('resources.communityResources.title')}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('resources.communityResources.description')}
              </p>
              <div className="space-y-3">
                <a href="https://guangzhengli.com/blog/zh/model-context-protocol" target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-sm">MCP 终极指南</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
                <a href="https://blog.logto.io/th/what-is-mcp" target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-sm">Logto MCP Guide</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
                <a href="https://waleedk.medium.com/what-is-mcp-and-why-you-should-pay-attention-31524da7733f" target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-sm">Medium: What is MCP</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MCP Servers Section */}
      <section id="servers" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('servers.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('servers.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('servers.serverDirectory.title')}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('servers.serverDirectory.description')}
              </p>
              <a href="https://mcp.so/" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                <span>{t('servers.exploreServers')}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('servers.communityServers.title')}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('servers.communityServers.description')}
              </p>
              <a href="https://github.com/modelcontextprotocol" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors">
                <span>{t('resources.viewResource')}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('servers.discussions.title')}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('servers.discussions.description')}
              </p>
              <a href="https://www.reddit.com/r/ClaudeAI/comments/1h55zxd/can_someone_explain_mcp_to_me_how_are_you_using/" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors">
                <span>Join Discussion</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">AIMCP</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
              <div className="space-y-2">
                <button onClick={() => scrollToSection('features')} className="block text-gray-300 hover:text-white transition-colors">
                  {t('navigation.features')}
                </button>
                <button onClick={() => scrollToSection('resources')} className="block text-gray-300 hover:text-white transition-colors">
                  {t('navigation.resources')}
                </button>
                <button onClick={() => scrollToSection('servers')} className="block text-gray-300 hover:text-white transition-colors">
                  {t('navigation.servers')}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.resources')}</h3>
              <div className="space-y-2">
                <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                  {t('navigation.docs')}
                </a>
                <a href="https://github.com/modelcontextprotocol" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                  GitHub
                </a>
                <a href="https://mcp.so" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                  {t('servers.serverDirectory.title')}
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 