"use client";

import React, { useState, useEffect } from "react";
import axiosStatic from "axios";
import Link from "next/link";

type ShotData = {
  id: string;
  shot_number: string;
  visual_description: string;
  audio_effects: string;
  subtitles: string;
  character_actions: string;
  camera_movement: string;
  image_url?: string;
  source_url?: string; // Pollinations 公开 URL，供视频生成使用
  videoUrl?: string;   // 生成后的视频 URL
};

function ShotCard({
  shot,
  index,
  onUpdateShot,
}: {
  shot: ShotData;
  index: number;
  onUpdateShot: (updatedShot: ShotData) => void;
}) {
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState("");

  const hasValidImage = shot.image_url && shot.image_url.startsWith("data:image");

  const generateSingleVideo = async () => {
    const sourceUrl = shot.source_url;
    if (!sourceUrl) {
      setVideoError("缺少图片源 URL，无法生成视频");
      return;
    }
    setVideoLoading(true);
    setVideoError("");

    try {
      // ① 提交任务
      const submitRes = await axiosStatic.post("/api/generate-video", {
        imageUrl: sourceUrl,
        prompt: shot.visual_description,
      });

      const { requestId, error: submitError } = submitRes.data ?? {};
      if (!requestId) throw new Error(submitError || "提交失败，未获取到任务 ID");

      console.log(`🎬 [${shot.shot_number}] 视频任务提交成功，ID: ${requestId}`);

      // ② 前端 setInterval 轮询，每 8 秒查一次，最多 25 次（约 3.5 分钟）
      let attempts = 0;
      const MAX_ATTEMPTS = 60;

      const timer = setInterval(async () => {
        attempts++;
        console.log(`🔄 [${requestId}] 第 ${attempts} 次轮询...`);

        try {
          const statusRes = await axiosStatic.post("/api/video-status", { requestId });
          const { status, videoUrl: resVideoUrl, error: statusError } = statusRes.data ?? {};

          console.log(`📡 状态：${status}`);

          if (status === "Succeed" && resVideoUrl) {
            clearInterval(timer);
            onUpdateShot({ ...shot, videoUrl: resVideoUrl });
            setVideoLoading(false);
            return;
          }

          if (status === "Failed") {
            clearInterval(timer);
            setVideoError(statusError || "视频生成失败，请重试");
            setVideoLoading(false);
            return;
          }

          // InQueue / InProgress → 继续等
          if (attempts >= MAX_ATTEMPTS) {
            clearInterval(timer);
            setVideoError("生成超时（约3.5分钟），请稍后重试");
            setVideoLoading(false);
          }
        } catch (pollErr: any) {
          console.error("轮询出错:", pollErr.message);
          if (attempts >= MAX_ATTEMPTS) {
            clearInterval(timer);
            setVideoError("轮询超时，请重试");
            setVideoLoading(false);
          }
        }
      }, 8000);
    } catch (error: any) {
      setVideoError(error.response?.data?.error || error.message || "提交失败");
      setVideoLoading(false);
    }
  };

  return (
    <div className="w-[300px] shrink-0 bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-4 shadow-xl hover:border-amber-500/30 transition-all duration-300">
      <div className="flex justify-between items-center text-[10px] tracking-widest font-mono">
        <span className="font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
          Σ-{index + 1}
        </span>
        <span className="text-amber-500 font-medium">#{shot.shot_number}</span>
      </div>

      {/* 画面显化视窗 */}
      <div className="aspect-[9/16] w-full bg-neutral-900/60 rounded-lg overflow-hidden border border-neutral-800/80 relative flex flex-col items-center justify-center group">
        {shot.videoUrl ? (
          <video
            src={shot.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : hasValidImage ? (
          <img
            src={shot.image_url}
            alt={`Scene ${index + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 border border-amber-500/30 rounded-full animate-ping" />
              <span className="text-amber-500/80 text-xs font-mono">卦</span>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-amber-500/90 font-medium font-mono tracking-wider">IMAGE PENDING</p>
              <p className="text-[10px] text-neutral-500 max-w-[180px] leading-relaxed">灵力推演中，意象暂未具象化</p>
            </div>
          </div>
        )}

        {/* 视频生成中遮罩 */}
        {videoLoading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <span className="text-[10px] text-amber-400 font-mono tracking-widest">正在注入时间法则...</span>
          </div>
        )}
      </div>

      {/* 视频生成按钮 */}
      {hasValidImage && !shot.videoUrl && !videoLoading && (
        <button
          onClick={generateSingleVideo}
          className="w-full py-2 text-xs font-medium rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 hover:bg-amber-500 hover:text-black transition-all duration-200 flex items-center justify-center gap-1.5 font-mono"
        >
          <span>🎬</span> 一键让此分镜动起来
        </button>
      )}

      {shot.videoUrl && (
        <button
          onClick={() => onUpdateShot({ ...shot, videoUrl: undefined })}
          className="w-full py-1.5 text-[10px] rounded-lg bg-neutral-900/60 border border-dashed border-neutral-800 text-neutral-500 hover:text-red-400 hover:border-red-900/30 transition-all font-mono"
        >
          还原为静态分镜
        </button>
      )}

      {videoError && (
        <p className="text-[10px] text-red-400 bg-red-950/20 border border-red-900/30 px-2 py-1.5 rounded font-mono">
          ⚠️ {videoError}
        </p>
      )}

      {/* 视听语言解构面板 */}
      <div className="space-y-2.5 text-xs flex-1 overflow-y-auto pr-1 scrollbar-none">
        <div>
          <span className="text-[9px] text-neutral-500 block font-mono tracking-wide">视觉画面 [VISUAL]</span>
          <p className="text-neutral-300 leading-relaxed bg-neutral-900/40 p-2 rounded border border-neutral-900 mt-1">
            {shot.visual_description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 bg-neutral-900/20 p-2 rounded border border-neutral-900/60">
          <div>
            <span className="text-[9px] text-neutral-500 block font-mono">动作调度 [ACTION]</span>
            <p className="text-neutral-400 font-mono text-[10px] mt-0.5">{shot.character_actions || "主体情绪到位"}</p>
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 block font-mono">运镜轨迹 [CAMERA]</span>
            <p className="text-neutral-400 font-mono text-[10px] mt-0.5">{shot.camera_movement || "固定推镜头"}</p>
          </div>
        </div>
        <div>
          <span className="text-[9px] text-neutral-500 block font-mono">音频/环境音 [AUDIO]</span>
          <p className="text-neutral-400 font-mono text-[10px] bg-neutral-900/30 p-1 rounded mt-0.5">
            {shot.audio_effects || "转场氛围音效"}
          </p>
        </div>
        <div className="border-t border-neutral-900 pt-2">
          <span className="text-[9px] text-amber-500/70 block font-mono">字幕台词 [SUBTITLE]</span>
          <p className="text-amber-100/90 font-medium bg-amber-950/10 p-2 rounded border border-amber-900/20 mt-1 leading-relaxed">
            {shot.subtitles}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  const [script, setScript] = useState<string>("");
  const [shots, setShots] = useState<ShotData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const cachedScript = localStorage.getItem("manjuhub_cached_script");
    if (cachedScript) setScript(cachedScript);
    const cachedShots = localStorage.getItem("manjuhub_cached_shots");
    if (cachedShots) {
      try {
        setShots(JSON.parse(cachedShots));
      } catch (e) {}
    }
  }, []);

  const handleUpdateShot = (index: number, updatedShot: ShotData) => {
    const newShots = [...shots];
    newShots[index] = updatedShot;
    setShots(newShots);
    localStorage.setItem("manjuhub_cached_shots", JSON.stringify(newShots));
  };

  const handleParseShots = async () => {
    if (!script.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await axiosStatic.post("/api/parse-script", { script });
      if (response.data && response.data.shots) {
        setShots(response.data.shots);
        localStorage.setItem("manjuhub_cached_shots", JSON.stringify(response.data.shots));
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error("后端通道异常", err);
      setError(err.response?.data?.message || "资产交割异常，已自动切入本地防护机制");
    }

    // 本地兜底
    setTimeout(() => {
      const lines = script
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 3 && !l.startsWith("#"));

      if (lines.length === 0) lines.push(script.trim().slice(0, 100));

      const movements = ["特写推镜头", "全景拉镜头", "180度环绕运镜", "低角度仰拍"];
      const audios = ["环境音骤停，BGM拉满", "清脆的钟鸣声转场", "急促的心跳声逐步放大", "骤雨声伴随古琴鸣响"];

      const dynamicShots: ShotData[] = lines.map((line, idx) => {
        const quoteMatch = line.match(/[""'](.+?)[""']/);
        const subtitles = quoteMatch ? quoteMatch[0] : "（渲染氛围，留白观象）";
        const cleanVisual = line.replace(/^([0-9]+\.|[-*•])\s*/, "");
        return {
          id: `local_shot_${idx}_${Date.now()}`,
          shot_number: `SHOT-${String(idx + 1).padStart(2, "0")}`,
          visual_description: cleanVisual,
          character_actions: "主体情绪饱满，身处视觉焦点",
          camera_movement: movements[idx % movements.length],
          audio_effects: audios[idx % audios.length],
          subtitles,
        };
      });

      setShots(dynamicShots);
      localStorage.setItem("manjuhub_cached_shots", JSON.stringify(dynamicShots));
      setLoading(false);
    }, 800);
  };

  const handleResetWorkspace = () => {
    if (window.confirm("确定要清空工作台的所有分镜演化资产吗？")) {
      setScript("");
      setShots([]);
      localStorage.removeItem("manjuhub_cached_script");
      localStorage.removeItem("manjuhub_cached_shots");
      setError("");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black text-neutral-200 p-6 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <header className="flex-shrink-0 mb-6 flex justify-between items-end border-b border-neutral-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-black font-bold font-mono text-lg shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            爻
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-wider text-neutral-100 font-mono">
              ManjuHub // 爻象主推演工作台
            </h1>
            <p className="text-[10px] text-neutral-500 mt-0.5 tracking-widest">
              STEP ③: ASYNC SHOT PRODUCTION PIPELINE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/workspace/init"
            className="text-[11px] font-mono text-neutral-400 hover:text-amber-400 transition-all border border-neutral-800 bg-neutral-900/50 px-3 py-1.5 rounded-md hover:border-amber-500/30 inline-flex items-center"
          >
            ← 返回故事圣经配置
          </Link>
          <div className="h-4 w-px bg-neutral-800" />
          <button
            onClick={handleResetWorkspace}
            className="px-4 py-1.5 text-[11px] font-mono rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
          >
            清空推演
          </button>
        </div>
      </header>

      <main className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* 左侧输入控制台 */}
        <div className="w-[380px] flex-shrink-0 bg-neutral-950 border border-neutral-900 rounded-2xl p-5 flex flex-col gap-4 shadow-2xl h-full">
          <div className="flex items-center gap-2 border-b border-neutral-900 pb-3 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-xs font-medium text-neutral-300 tracking-wider font-mono">
              剧本输入与 analysis 卡片
            </h2>
          </div>

          <textarea
            value={script}
            onChange={(e) => {
              setScript(e.target.value);
              localStorage.setItem("manjuhub_cached_script", e.target.value);
            }}
            placeholder="请在此注入单集网文短剧剧本大纲或文本，系统将为您精准肢解因果镜头..."
            className="w-full flex-1 bg-neutral-900/30 border border-neutral-800 rounded-xl p-4 text-xs text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-amber-500/40 resize-none leading-relaxed font-mono"
          />

          <button
            onClick={handleParseShots}
            disabled={loading || !script.trim()}
            className="w-full py-4 px-4 rounded-xl font-bold font-mono text-xs tracking-widest transition-all duration-300 relative overflow-hidden active:scale-[0.98]
              disabled:bg-neutral-900 disabled:text-neutral-600 disabled:border-neutral-800 disabled:shadow-none
              bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black
              shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)]
              border border-yellow-300/40"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? "⚡ 卦象流转，正在渲染资产..." : "🎬 启动单集分镜解构 →"}
            </span>
          </button>

          {error && (
            <div className="p-3 bg-neutral-900 border border-amber-500/10 text-[10px] text-neutral-400 rounded-xl flex items-start gap-2 font-mono flex-shrink-0">
              <span className="text-amber-500">ℹ️</span>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* 右侧分镜画布 */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl px-5 py-3 shadow-md flex justify-between items-center flex-shrink-0">
            <h2 className="text-xs font-medium text-neutral-300 tracking-wider font-mono">
              分镜资产流水线画布
            </h2>
            {shots.length > 0 && (
              <span className="text-[10px] font-mono bg-neutral-900 px-2.5 py-0.5 rounded border border-neutral-800 text-amber-500">
                已成功显化 {shots.length} 个镜头
              </span>
            )}
          </div>

          <div className="flex-1 flex gap-5 overflow-x-auto overflow-y-hidden pb-4 pt-1 h-full scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent items-stretch">
            {shots.length === 0 && !loading && (
              <div className="w-full border border-dashed border-neutral-900 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-neutral-950/10">
                <span className="text-2xl text-neutral-800 mb-2">✦</span>
                <p className="text-xs text-neutral-400 tracking-wider font-mono max-w-md leading-relaxed">
                  工作台处于空置状态。请直接在左侧注入单集剧本大纲，开启流水线演化。
                </p>
              </div>
            )}

            {loading && (
              <div className="flex gap-5">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="w-[300px] bg-neutral-950 border border-neutral-800/40 rounded-2xl p-4 space-y-4 animate-pulse h-full flex flex-col justify-between"
                  >
                    <div className="h-4 bg-neutral-900 rounded w-1/4" />
                    <div className="flex-1 bg-neutral-900/60 rounded-lg my-2 min-h-[280px]" />
                    <div className="h-12 bg-neutral-900 rounded w-full" />
                  </div>
                ))}
              </div>
            )}

            {shots.length > 0 && !loading && (
              <div className="flex gap-5 h-full overflow-y-hidden overflow-x-visible">
                {shots.map((shot, index) => (
                  <div key={shot.id || index} className="h-full overflow-y-auto pb-2 scrollbar-none">
                    <ShotCard
                      shot={shot}
                      index={index}
                      onUpdateShot={(updatedShot) => handleUpdateShot(index, updatedShot)}
                    />
                  </div>
                ))}
                <div className="w-12 shrink-0" />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
