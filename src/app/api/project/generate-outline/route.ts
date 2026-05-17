import { NextResponse } from "next/server";

const SILICONFLOW_URL = "https://api.siliconflow.cn/v1/chat/completions";
const MODEL = "deepseek-ai/DeepSeek-V3";

const buildPrompt = (data: {
  title: string;
  genre: string;
  visualStyle: string;
  targetMarket: string;
  background: string;
  episodeCount: number;
}) => `
你是一位顶级短剧编剧，专精于短视频平台爆款内容创作。
请根据以下项目信息，生成一份完整的短剧故事大纲。

【项目信息】
- 剧名：${data.title}
- 题材：${data.genre}
- 画风：${data.visualStyle}
- 目标市场：${data.targetMarket}
- 原始素材/灵感：${data.background || "无，请自由发挥"}
- 计划集数：${data.episodeCount} 集

【输出要求】
严格按以下 JSON 格式输出，不要有任何多余文字或 markdown 代码块：

{
  "storyConcept": "核心爽点一句话（30字以内，要有强冲突感）",
  "characterArcs": "主要角色设定（每个角色一行，格式：姓名｜身份｜性格｜核心冲突）",
  "episodes": [
    {
      "episodeNum": 1,
      "title": "集标题",
      "outline": "本集核心剧情（100字左右，包含开场钩子、主要冲突、结尾悬念）"
    }
  ]
}

要求：
1. storyConcept 必须有强烈的爽感或反转，吸引用户追剧
2. 角色设定要有明显的对立关系
3. 每集结尾必须有让人想看下一集的钩子
4. 语言风格符合短视频平台受众习惯
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, genre, visualStyle, targetMarket, background, episodeCount = 3 } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "剧名不能为空" }, { status: 400 });
    }

    const apiKey = process.env.AI_SECRET_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key 未配置" }, { status: 500 });
    }

    console.log(`🎬 开始生成《${title}》的故事大纲...`);

    const res = await fetch(SILICONFLOW_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: buildPrompt({ title, genre, visualStyle, targetMarket, background, episodeCount }),
          },
        ],
        temperature: 0.8,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.message || `硅基流动请求失败: ${res.status}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";

    if (!content) {
      throw new Error("AI 未返回有效内容");
    }

    // 清理并解析 JSON
    const clean = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      // 尝试提取 JSON 片段
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("AI 返回内容无法解析为 JSON");
      }
    }

    console.log(`✅ 《${title}》大纲生成完毕，共 ${parsed.episodes?.length ?? 0} 集`);

    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("大纲生成失败:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "大纲生成失败，请重试" },
      { status: 500 }
    );
  }
}