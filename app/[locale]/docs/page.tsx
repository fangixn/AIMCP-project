'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  BookOpen, 
  Code, 
  Settings, 
  Download, 
  ExternalLink, 
  ChevronRight,
  Play,
  FileText,
  Terminal,
  Database,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const DocsPage: React.FC = () => {
  const t = useTranslations();
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: t('docs.gettingStarted.title'),
      icon: <Play className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('docs.gettingStarted.title')}</h2>
            <p className="text-gray-300 text-lg mb-6">
              {t('docs.gettingStarted.subtitle')}
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Terminal className="h-5 w-5 mr-2 text-green-500" />
              {t('docs.gettingStarted.systemRequirements')}
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• {t('docs.gettingStarted.requirements.nodejs')}</li>
              <li>• {t('docs.gettingStarted.requirements.npm')}</li>
              <li>• {t('docs.gettingStarted.requirements.git')}</li>
              <li>• {t('docs.gettingStarted.requirements.browser')}</li>
            </ul>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.gettingStarted.installationSteps')}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300 mb-2">{t('docs.gettingStarted.step1')}</p>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <code className="text-green-400">git clone &lt;repository-url&gt;</code>
                </div>
              </div>
              <div>
                <p className="text-gray-300 mb-2">{t('docs.gettingStarted.step2')}</p>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <code className="text-green-400">npm install</code>
                </div>
              </div>
              <div>
                <p className="text-gray-300 mb-2">{t('docs.gettingStarted.step3')}</p>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <code className="text-green-400">npm run dev</code>
                </div>
              </div>
              <div>
                <p className="text-gray-300 mb-2">{t('docs.gettingStarted.step4')}</p>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <code className="text-blue-400">http://localhost:3000</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'architecture',
      title: t('docs.architecture.title'),
      icon: <Database className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('docs.architecture.title')}</h2>
            <p className="text-gray-300 text-lg mb-6">
              {t('docs.architecture.subtitle')}
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.architecture.techStack')}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">{t('docs.architecture.frontend')}</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• Next.js 13+ (App Router)</li>
                  <li>• React 18</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">{t('docs.architecture.uiComponents')}</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• Radix UI</li>
                  <li>• Lucide React Icons</li>
                  <li>• Chart.js</li>
                  <li>• shadcn/ui</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">{t('docs.architecture.i18n')}</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• next-intl</li>
                  <li>• {t('docs.architecture.i18nSupport')}</li>
                  <li>• {t('docs.architecture.dynamicRoutes')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">{t('docs.architecture.devTools')}</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• ESLint</li>
                  <li>• Prettier</li>
                  <li>• PostCSS</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.architecture.directoryStructure')}</h3>
            <div className="bg-gray-900 p-4 rounded border border-gray-600 text-sm">
              <pre className="text-gray-300">
{`AIMCP project/
├── app/                    # Next.js App Router
│   ├── [locale]/          # ${t('docs.architecture.i18n')}
│   │   ├── layout.tsx     # ${t('navigation.resources')}
│   │   ├── page.tsx       # ${t('navigation.features')}
│   │   ├── docs/          # ${t('navigation.docs')}
│   │   ├── resources/     # ${t('navigation.resources')}
│   │   └── report/        # Report pages
│   ├── api/               # API routes
│   │   ├── mcp-collect/   # Resource collection API
│   │   └── mcp-collect-progress/ # Progress API
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components
│   ├── LanguageSwitcher.tsx
│   └── MCPCollectorTool.tsx
├── messages/             # ${t('docs.architecture.i18n')} texts
│   ├── en.json          # English
│   └── zh.json          # Chinese
├── lib/                 # Utility libraries
├── hooks/               # React Hooks
├── mcp-website/         # Static website
└── public/              # Static assets`}
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api',
      title: t('docs.api.title'),
      icon: <Code className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('docs.api.title')}</h2>
            <p className="text-gray-300 text-lg mb-6">
              {t('docs.api.subtitle')}
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.api.mcpCollectApi')}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-blue-400">/api/mcp-collect</code>
                </div>
                <p className="text-gray-300 mb-3">{t('docs.api.startCollection')}</p>
                
                <h4 className="font-semibold mb-2">{t('docs.api.requestParams')}</h4>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <pre className="text-sm text-gray-300">
{`{
  "keywords": ["MCP tutorial", "Model Context Protocol"],
  "maxResults": 50,
  "includeGithub": true,
  "language": "zh"
}`}
                  </pre>
                </div>

                <h4 className="font-semibold mb-2 mt-4">{t('docs.api.responseExample')}</h4>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <pre className="text-sm text-gray-300">
{`{
  "success": true,
  "taskId": "task_123456",
  "message": "${t('docs.api.taskStarted')}",
  "estimatedTime": "${t('docs.api.estimatedTime')}"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.api.progressApi')}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-blue-400">/api/mcp-collect-progress</code>
                </div>
                <p className="text-gray-300 mb-3">{t('docs.api.queryProgress')}</p>
                
                <h4 className="font-semibold mb-2">{t('docs.api.queryParams')}</h4>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <code className="text-gray-300">?taskId=task_123456</code>
                </div>

                <h4 className="font-semibold mb-2 mt-4">{t('docs.api.responseExample')}</h4>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <pre className="text-sm text-gray-300">
{`{
  "taskId": "task_123456",
  "status": "running",
  "progress": 65,
  "currentStep": "${t('docs.api.currentStep')}",
  "resourcesFound": 42,
  "estimatedTimeRemaining": "${t('docs.api.timeRemaining')}"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'components',
      title: t('docs.components.title'),
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('docs.components.title')}</h2>
            <p className="text-gray-300 text-lg mb-6">
              {t('docs.components.subtitle')}
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">MCPCollectorTool</h3>
            <p className="text-gray-300 mb-4">{t('docs.components.mcpCollectorTool')}</p>
            
            <h4 className="font-semibold mb-2">{t('docs.components.features')}</h4>
            <ul className="space-y-1 text-gray-300 mb-4">
              <li>• {t('docs.components.featuresList.customKeywords')}</li>
              <li>• {t('docs.components.featuresList.realTimeProgress')}</li>
              <li>• {t('docs.components.featuresList.resourceFiltering')}</li>
              <li>• {t('docs.components.featuresList.dataVisualization')}</li>
              <li>• {t('docs.components.featuresList.exportFormats')}</li>
            </ul>

            <h4 className="font-semibold mb-2">{t('docs.components.usageExample')}</h4>
            <div className="bg-gray-900 p-4 rounded border border-gray-600">
              <pre className="text-sm text-gray-300">
{`import MCPCollectorTool from '@/components/MCPCollectorTool';

export default function Page() {
  return (
    <div>
      <MCPCollectorTool />
    </div>
  );
}`}
              </pre>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">LanguageSwitcher</h3>
            <p className="text-gray-300 mb-4">{t('docs.components.languageSwitcher')}</p>
            
            <h4 className="font-semibold mb-2">{t('docs.components.supportedLanguages')}</h4>
            <ul className="space-y-1 text-gray-300 mb-4">
              <li>• {t('common.chinese')} (zh)</li>
              <li>• {t('common.english')} (en)</li>
            </ul>

            <h4 className="font-semibold mb-2">{t('docs.components.usageExample')}</h4>
            <div className="bg-gray-900 p-4 rounded border border-gray-600">
              <pre className="text-sm text-gray-300">
{`import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'deployment',
      title: t('docs.deployment.title'),
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('docs.deployment.title')}</h2>
            <p className="text-gray-300 text-lg mb-6">
              {t('docs.deployment.subtitle')}
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.deployment.vercelDeployment')}</h3>
            <div className="space-y-4">
              <p className="text-gray-300">{t('docs.deployment.vercelDescription')}</p>
              
              <div>
                <h4 className="font-semibold mb-2">{t('docs.deployment.steps')}</h4>
                <ol className="space-y-2 text-gray-300">
                  <li>{t('docs.deployment.deploymentSteps.pushToGithub')}</li>
                  <li>{t('docs.deployment.deploymentSteps.importProject')}</li>
                  <li>{t('docs.deployment.deploymentSteps.configureEnv')}</li>
                  <li>{t('docs.deployment.deploymentSteps.deploy')}</li>
                </ol>
              </div>

              <div className="bg-gray-900 p-4 rounded border border-gray-600">
                <p className="text-gray-300 mb-2">{t('docs.deployment.cliDeployment')}</p>
                <code className="text-green-400">npx vercel --prod</code>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.deployment.netlifyDeployment')}</h3>
            <div className="space-y-4">
              <p className="text-gray-300">{t('docs.deployment.netlifyDescription')}</p>
              
              <div>
                <h4 className="font-semibold mb-2">{t('docs.deployment.buildSettings')}</h4>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <pre className="text-sm text-gray-300">
{`Build command: npm run build
Publish directory: out
Environment variables:
  NEXT_OUTPUT: export`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.deployment.dockerDeployment')}</h3>
            <div className="space-y-4">
              <p className="text-gray-300">{t('docs.deployment.dockerDescription')}</p>
              
              <div>
                <h4 className="font-semibold mb-2">{t('docs.deployment.dockerfile')}</h4>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <pre className="text-sm text-gray-300">
{`FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t('docs.deployment.buildAndRun')}</h4>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <pre className="text-sm text-gray-300">
{`docker build -t aimcp .
docker run -p 3000:3000 aimcp`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'configuration',
      title: t('docs.configuration.title'),
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('docs.configuration.title')}</h2>
            <p className="text-gray-300 text-lg mb-6">
              {t('docs.configuration.subtitle')}
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.configuration.i18nConfig')}</h3>
            <p className="text-gray-300 mb-4">{t('docs.configuration.configFile')} <code className="text-blue-400">i18n/request.ts</code></p>
            
            <div className="bg-gray-900 p-4 rounded border border-gray-600">
              <pre className="text-sm text-gray-300">
{`import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(\`../messages/\${locale}.json\`)).default
}));`}
              </pre>
            </div>

            <h4 className="font-semibold mb-2 mt-4">{t('docs.configuration.addNewLanguage')}</h4>
            <ol className="space-y-2 text-gray-300">
              <li>{t('docs.configuration.languageSteps.step1')}</li>
              <li>{t('docs.configuration.languageSteps.step2')}</li>
              <li>{t('docs.configuration.languageSteps.step3')}</li>
            </ol>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.configuration.nextjsConfig')}</h3>
            <p className="text-gray-300 mb-4">{t('docs.configuration.configFile')} <code className="text-blue-400">next.config.js</code></p>
            
            <div className="bg-gray-900 p-4 rounded border border-gray-600">
              <pre className="text-sm text-gray-300">
{`const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
  },
});`}
              </pre>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{t('docs.configuration.tailwindConfig')}</h3>
            <p className="text-gray-300 mb-4">{t('docs.configuration.configFile')} <code className="text-blue-400">tailwind.config.ts</code></p>
            
            <div className="bg-gray-900 p-4 rounded border border-gray-600">
              <pre className="text-sm text-gray-300">
{`module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom theme configuration
    },
  },
  plugins: [],
}`}
              </pre>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('docs.title')}</h1>
              <p className="text-gray-400">{t('docs.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 sticky top-8">
              <h3 className="font-semibold text-white mb-4">{t('docs.navigation')}</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {section.icon}
                    <span>{section.title}</span>
                    {activeSection === section.id && (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-8">
              {sections.find(s => s.id === activeSection)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage; 