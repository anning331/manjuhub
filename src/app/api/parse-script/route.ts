import { NextResponse } from "next/server";

const SILICONFLOW_URL = "https://api.siliconflow.cn/v1/chat/completions";
const MODEL = "deepseek-ai/DeepSeek-V3";

// ── DeepSeek 拆镜 ──────────────────────────────────────────────
async function parseScriptWithAI(script: string, apiKey: string) {
  const prompt = `你是一位顶级短剧分镜师。请将以下剧本精准拆解为分镜表。

【剧本内容】
${script}

【输出要求】
严格输出 JSON 数组，不要任何多余文字或代码块标记，格式如下：
[
  {
    "shot_number": "SHOT-01",
    "visual_description": "画面描述（中文，具体可画面化，20-40字）",
    "character_actions": "人物动作与情绪",
    "camera_movement": "运镜方式（特写推镜/全景拉镜/环绕运镜/低角仰拍/跟镜等）",
    "audio_effects": "音效与BGM描述",
    "subtitles": "该镜头的台词或字幕（无台词则填空字符串）",
    "english_prompt": "该画面的英文生图提示词（用于AI绘图，30字以内）"
  }
]

要求：
1. 根据剧本长度拆解 3-6 个镜头
2. 每个镜头画面描述要具体、有画面感
3. english_prompt 要简洁精准，适合 Stable Diffusion 生图
4. 只输出 JSON 数组，不要任何其他内容`;

  const res = await fetch(SILICONFLOW_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message || `DeepSeek 请求失败: ${res.status}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";

  // 清理并解析 JSON
  const clean = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed)) return parsed;
    throw new Error("返回格式不是数组");
  } catch {
    const match = clean.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    throw new Error("AI 返回内容无法解析为 JSON");
  }
}

// ── 生图 ────────────────────────────────────────────────────────
async function generateSceneImage(prompt: string): Promise<{ base64: string | null; sourceUrl: string }> {
  const seed = Math.floor(Math.random() * 999999);
  const enhancedPrompt = `${prompt}, dramatic cinematic lighting, 8k resolution, photorealistic, masterpiece`;
  const sourceUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=640&height=360&seed=${seed}&nologo=true`;

  try {
    const res = await fetch(sourceUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return { base64: null, sourceUrl };

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return { base64: `data:image/jpeg;base64,${base64}`, sourceUrl };
  } catch (e) {
    console.error(`⚠️ 生图失败:`, e);
    return { base64: null, sourceUrl };
  }
}

// ── 顺序生图（避免限流）────────────────────────────────────────
async function generateShotsSequentially(aiShots: any[]) {
  const shots = [];

  for (let i = 0; i < aiShots.length; i++) {
    const shot = aiShots[i];
    // 优先用英文 prompt 生图，效果更好
    const imagePrompt = shot.english_prompt || shot.visual_description;

    console.log(`🎨 正在显化第 [${i + 1}] 镜真实图像资产...`);
    const { base64, sourceUrl } = await generateSceneImage(imagePrompt);

    shots.push({
      id: `shot_${i}_${Date.now()}`,
      shot_number: shot.shot_number || `SHOT-${String(i + 1).padStart(2, "0")}`,
      visual_description: shot.visual_description,
      character_actions: shot.character_actions || "情绪张力饱满",
      camera_movement: shot.camera_movement || "固定镜头",
      audio_effects: shot.audio_effects || "环境音",
      subtitles: shot.subtitles || "",
      image_url: base64 || null,
      source_url: sourceUrl,
    });

    if (i < aiShots.length - 1) {
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  return shots;
}

// ── 本地兜底（无 API Key 时）────────────────────────────────────
function fallbackParse(script: string) {
  const lines = script
    .split(/[\n。]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 8 && !l.startsWith("#"));

  if (lines.length === 0) lines.push(script.slice(0, 100));

  const movements = ["特写推镜头", "全景拉镜头", "180度环绕运镜", "低角度仰拍"];
  const audios = ["环境音骤停，BGM拉满", "清脆的钟鸣转场", "急促的心跳声逐步放大", "骤雨声伴随雷鸣"];

  return lines.slice(0, 4).map((line, i) => ({
    shot_number: `SHOT-${String(i + 1).padStart(2, "0")}`,
    visual_description: line.replace(/^([0-9]+\.|[-*•])\s*/, ""),
    character_actions: "情绪张力饱满，身处画面焦点",
    camera_movement: movements[i % movements.length],
    audio_effects: audios[i % audios.length],
    subtitles: "",
    english_prompt: line.slice(0, 50),
  }));
}

// ── 主入口 ──────────────────────────────────────────────────────
export async function POST(request: Request) {
  console.log("🔮 接收到前端大纲资产，接入卦象交割通道...");

  let scriptText = "";
  try {
    const body = await request.json();
    scriptText = body.script || "";
  } catch {
    return NextResponse.json({ message: "请求体解析失败" }, { status: 400 });
  }

  const cleanScript = scriptText
    .replace(/#\s*短剧全集大纲/g, "")
    .replace(/基于您提供的素材：/g, "")
    .trim();

  if (!cleanScript) {
    return NextResponse.json({ message: "注入的剧本大纲资产为空" }, { status: 400 });
  }

  const apiKey = process.env.AI_SECRET_KEY;
  let aiShots: any[];

  if (apiKey) {
    try {
      console.log("🧠 正在调用 DeepSeek-V3 动态推演智能剧本分镜...");
      aiShots = await parseScriptWithAI(cleanScript, apiKey);
      console.log(`✅ DeepSeek 拆解完成，共 ${aiShots.length} 个镜头`);
    } catch (err) {
      console.warn("⚠️ DeepSeek 调用失败，启动本地兜底:", err);
      aiShots = fallbackParse(cleanScript);
    }
  } else {
    console.warn("⚠️ 未配置 API Key，启动本地兜底模式");
    aiShots = fallbackParse(cleanScript);
  }

  // 最多处理 4 镜，防止超时
  const finalShots = aiShots.slice(0, 4);

  console.log(`🎨 开始顺序生图，共 ${finalShots.length} 镜...`);
  const shots = await generateShotsSequentially(finalShots);

  console.log("✅ 资产交割完毕，成功送往前端画布！");
  return NextResponse.json({ shots });
}