import { NextResponse } from "next/server";
import axios from "axios";

const SILICONFLOW_API_KEY = "sk-mroibyhscgsaxuiwxzhtuvchpjzguvbpljdulacwzqtiwajw"; 

export async function POST(request: Request) {
  try {
    const { prompt, index } = await request.json();
    if (!prompt) {
      return NextResponse.json({ imageUrl: null, error: "画面描述不能为空" });
    }

    console.log(`📡 [硅基算力] 正在为第 ${(index || 0) + 1} 爻调度最新 Tongyi-MAI 极速生图引擎...`);

    // 🚀 100% 对齐截图中的最新免费模型：Tongyi-MAI/Z-Image-Turbo
    const response = await axios.post(
      "https://api.siliconflow.cn/v1/images/generations",
      {
        model: "Tongyi-MAI/Z-Image-Turbo", 
        prompt: `${prompt}, cinematic movie still, 16:9 aspect ratio, 8k resolution, clear details`,
        image_size: "1024x576", // 保持契合电影剧本的 16:9 比例画幅
        batch_size: 1,
        num_inference_steps: 1 // Turbo 模型特性：单步极速生成，防止接口超时
      },
      {
        headers: {
          "Authorization": `Bearer ${SILICONFLOW_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 25000 
      }
    );

    const remoteImageUrl = response.data?.data?.[0]?.url;

    if (!remoteImageUrl) {
      throw new Error("硅基流动未返回有效的图片URL，请检查账户额度或网络");
    }

    console.log(`✨ [硅基算力] 第 ${(index || 0) + 1} 爻意象通过 Z-Image-Turbo 显化成功！`);
    
    return NextResponse.json({ imageUrl: remoteImageUrl, error: null });

  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || "未知算力波动";
    console.error("⚠️ [硅基算力] 核心代理屏障捕获:", errorMsg);
    
    return NextResponse.json({ 
      imageUrl: null, 
      error: `算力调度受限: ${errorMsg}` 
    }, { status: 200 });
  }
}