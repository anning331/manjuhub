import { NextResponse } from "next/server";
import axios from "axios";

// 📡 从环境变量读取你的硅基流动 API Key
const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY;

export async function POST(req: Request) {
  try {
    const { title, background, genre, visualStyle, targetMarket, episodeCount } = await req.json();

    if (!title || !genre) {
      return NextResponse.json({ error: "项目名称和题材题材为必填项" }, { status: 400 });
    }

    // 🧠 构造极度严格的结构化 Prompt，逼迫 DeepSeek-V3 吐出干净的 JSON
    const systemPrompt = `你是一位精通爆款网络短剧、出海短剧的王牌编剧。
你的任务是根据用户提供的项目背景，输出完整的故事概念大纲和分集规划。
请严格按照以下 JSON 格式输出，不要包含任何 Markdown 格式包裹（绝对不要加 \`\`\`json 等标记），不要有任何前言或后语，确保可以被 JSON.parse 完美解析。

期望的 JSON 结构：
{
  "storyConcept": "整体剧情概念与爽点核心描述",
  "characterArcs": "核心人物设定（如男主、女主、大反派）及各自的利益冲突变化",
  "episodes": [
    {
      "episodeNum": 1,
      "title": "单集小标题",
      "outline": "本集的详细核心剧情大纲，包含核心冲突、打脸或留钩子的反转点"
    }
  ]
}`;

    const userPrompt = `项目标题：《${title}》
故事背景/原著灵感：${background || "未指定"}
短剧题材：${genre}
视觉画风：${visualStyle}
目标市场：${targetMarket}
计划总集数：${episodeCount || 3}集`;

    // 🚀 呼叫硅基流动 DeepSeek-V3 算力中心
    const response = await axios.post(
      "https://api.siliconflow.cn/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-V3",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" } // 强制模型输出结构化 JSON
      },
      {
        headers: {
          "Authorization": `Bearer ${SILICONFLOW_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const rawJsonText = response.data.choices[0].message.content.trim();
    
    // 解析并回传给前端状态机
    const parsedData = JSON.parse(rawJsonText);
    return NextResponse.json({ success: true, data: parsedData });

} catch (error: any) {
    console.error("❌ 大纲演算链路断联:", error);
    return NextResponse.json(
      { error: error.response?.data?.error || error.message || "内部服务器推演异常" },
      { status: 500 }
    );
  }