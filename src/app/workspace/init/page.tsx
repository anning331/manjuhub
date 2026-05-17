'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StoryBibleInitPage() {
  const router = useRouter();

  // ---------- 状态定义 ----------
  const [projectName, setProjectName] = useState('');
  const [coreTags, setCoreTags] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [outlineResult, setOutlineResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ---------- localStorage 缓存逻辑 ----------
  useEffect(() => {
    const saved = localStorage.getItem('storyBibleInit');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setProjectName(data.projectName || '');
        setCoreTags(data.coreTags || '');
        setTargetMarket(data.targetMarket || '');
        setVisualPrompt(data.visualPrompt || '');
        setRawContent(data.rawContent || '');
        setOutlineResult(data.outlineResult || '');
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const toSave = {
      projectName,
      coreTags,
      targetMarket,
      visualPrompt,
      rawContent,
      outlineResult,
    };
    localStorage.setItem('storyBibleInit', JSON.stringify(toSave));
  }, [projectName, coreTags, targetMarket, visualPrompt, rawContent, outlineResult]);

  
  const handleGenerateOutline = async () => {
    if (!rawContent.trim()) {
      setError('请填写原始文本内容');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectName,
          background: rawContent,
          genre: coreTags,
          visualStyle: visualPrompt,
          targetMarket: targetMarket,
          episodeCount: 3,
        }),
      });
  
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '推演失败');
  
      const { storyConcept, characterArcs, episodes } = json.data;
  
      const formatted = [
        `# 短剧全集大纲`,
        ``,
        `## 故事概念`,
        storyConcept,
        ``,
        `## 人物弧光`,
        characterArcs,
        ``,
        `## 分集规划`,
        ...(episodes || []).map((ep: { episodeNum: number; title: string; outline: string }) =>
          `### 第${ep.episodeNum}集：${ep.title}\n${ep.outline}`
        ),
      ].join('\n');
  
      setOutlineResult(formatted);
    } catch (err: any) {
      setError(err.message || '推演失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // ---------- 传送至 Step 3 流水线 ----------
  const handleProceedToWorkspace = () => {
    if (!outlineResult) return;
    localStorage.setItem('manjuhub_cached_script', outlineResult);
    router.push('/workspace');
  };

  // ---------- 通用输入框样式 ----------
  const inputClasses =
    'w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200';
  const textareaClasses =
    'w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200 resize-y min-h-[100px]';

  return (
    <div className="h-screen bg-black text-white overflow-hidden p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        
        {/* 左侧卡片：故事圣经前置资产定义 */}
        <div className="flex flex-col bg-gray-950/40 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl overflow-hidden h-full">
          <div className="px-6 pt-5 pb-2 border-b border-gray-800/50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              ① 故事圣经 · 前置资产定义
            </h2>
            <p className="text-gray-400 text-sm mt-1">配置项目核心元数据与原始素材</p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">项目名</label>
              <input
                type="text"
                className={inputClasses}
                placeholder="例：重生之AI主宰"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">题材标签</label>
              <input
                type="text"
                className={inputClasses}
                placeholder="例：都市、重生、爽文"
                value={coreTags}
                onChange={(e) => setCoreTags(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">投放市场</label>
              <input
                type="text"
                className={inputClasses}
                placeholder="例：抖音、Reels、YouTube Shorts"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">视觉风格</label>
              <input
                type="text"
                className={inputClasses}
                placeholder="例：赛博朋克、暖色调胶片感"
                value={visualPrompt}
                onChange={(e) => setVisualPrompt(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">原始文本 (核心创意/梗概)</label>
              <textarea
                rows={4}
                className={textareaClasses}
                placeholder="请粘贴您的原始故事创意、人物小传或剧情片段..."
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm bg-red-950/30 p-3 rounded-lg border border-red-800">
                ⚠️ {error}
              </div>
            )}
          </div>

          <div className="flex-shrink-0 px-6 py-5 border-t border-gray-800/50 bg-gradient-to-t from-gray-950/80 to-transparent">
            <button
              onClick={handleGenerateOutline}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "推演中..." : "🔮 启动全集大纲智能推演"}
            </button>
          </div>
        </div>

        {/* 右侧卡片：故事圣经产物画布 */}
        <div className="flex flex-col bg-gray-950/40 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl overflow-hidden h-full">
          <div className="px-6 pt-5 pb-2 border-b border-gray-800/50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              ② 故事圣经 · 产物画布
            </h2>
            <p className="text-gray-400 text-sm mt-1">AI 生成的全集大纲展示区</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {outlineResult ? (
              <div className="prose prose-invert prose-amber max-w-none">
                <div className="whitespace-pre-wrap font-sans text-gray-200 leading-relaxed">
                  {outlineResult.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={i} className="text-2xl font-bold text-amber-400 mt-4 mb-2">{line.slice(2)}</h1>;
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-semibold text-amber-300 mt-3 mb-1">{line.slice(3)}</h2>;
                    }
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return <li key={i} className="ml-5 list-disc text-gray-300">{line.slice(2)}</li>;
                    }
                    if (line.trim() === '') {
                      return <br key={i} />;
                    }
                    return <p key={i} className="mb-2">{line}</p>;
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                  <span className="text-4xl">📜</span>
                </div>
                <p className="text-lg font-medium">Waiting for Generation...</p>
                <p className="text-sm mt-1">配置左侧资产并点击推演按钮</p>
              </div>
            )}
          </div>

          {/* 右侧底部固定过渡栏 */}
          {outlineResult && (
            <div className="flex-shrink-0 px-6 py-5 border-t border-gray-800/50 bg-gradient-to-t from-gray-950/80 to-transparent">
              <button
                onClick={handleProceedToWorkspace}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 text-base"
              >
                🎬 进入分镜编排流水线 (Step 3) →
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}