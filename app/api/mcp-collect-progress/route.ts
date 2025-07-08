import { NextRequest, NextResponse } from 'next/server';

interface CollectionProgress {
  step: string;
  progress: number;
  total_steps: number;
  current_keyword?: string;
  collected_count: number;
  message: string;
}

// 模拟收集进度的生成器函数
async function* collectMCPResourcesWithProgress(keywords: string[], includeGithub: boolean = true) {
  const totalSteps = keywords.length + (includeGithub ? 5 : 0); // 5 GitHub keywords
  let currentStep = 0;
  let collectedCount = 0;
  
  // 网页搜索阶段
  for (const keyword of keywords) {
    currentStep++;
    yield {
      step: 'web_search',
      progress: currentStep,
      total_steps: totalSteps,
      current_keyword: keyword,
      collected_count: collectedCount,
      message: `搜索关键词: ${keyword}`
    };
    
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟收集到的资源数量
    collectedCount += Math.floor(Math.random() * 5) + 2;
  }
  
  // GitHub搜索阶段
  if (includeGithub) {
    const githubKeywords = ["MCP", "model-context-protocol", "anthropic mcp", "mcp server", "mcp client"];
    
    for (const keyword of githubKeywords) {
      currentStep++;
      yield {
        step: 'github_search',
        progress: currentStep,
        total_steps: totalSteps,
        current_keyword: keyword,
        collected_count: collectedCount,
        message: `搜索 GitHub: ${keyword}`
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      collectedCount += Math.floor(Math.random() * 8) + 3;
    }
  }
  
  // 去重处理
  yield {
    step: 'deduplication',
    progress: totalSteps,
    total_steps: totalSteps,
    collected_count: collectedCount,
    message: '正在去重和整理资源...'
  };
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 完成
  yield {
    step: 'completed',
    progress: totalSteps,
    total_steps: totalSteps,
    collected_count: collectedCount,
    message: `收集完成！共收集到 ${collectedCount} 个资源`
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { keywords = [], includeGithub = true } = body;
  
  // 默认关键词
  const defaultKeywords = [
    "Model Context Protocol MCP",
    "MCP tutorial",
    "MCP server implementation",
    "MCP client examples",
    "Anthropic MCP"
  ];
  
  const searchKeywords = keywords.length > 0 ? keywords : defaultKeywords;
  
  // 创建可读流
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const progressGenerator = collectMCPResourcesWithProgress(searchKeywords, includeGithub);
        
        for await (const progress of progressGenerator) {
          const data = `data: ${JSON.stringify(progress)}\n\n`;
          controller.enqueue(encoder.encode(data));
        }
        
        controller.close();
      } catch (error) {
        const errorData = `data: ${JSON.stringify({ error: 'Collection failed', message: error })}\n\n`;
        controller.enqueue(encoder.encode(errorData));
        controller.close();
      }
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'MCP Resource Collection Progress API',
    description: 'Use POST to start collection with real-time progress updates',
    format: 'Server-Sent Events (SSE)',
    version: '1.0.0'
  });
}