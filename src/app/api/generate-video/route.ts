import { NextResponse } from "next/server";
import axios from "axios";

// 🔑 统一维护你的 SiliconFlow 核心密钥（你可以换成 process.env.AI_SECRET_KEY!）
const SILICONFLOW_API_KEY = "sk-mroibyhscgsaxuiwxzhtuvchpjzguvbpljdulacwzqtiwajw"; 

export async function POST(req: Request) {
  try {
    const { imageUrl, prompt } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "缺少源图片，无法启动化动流水线" }, { status: 400 });
    }

    console.log("📡 [异步算力] 正在向硅基流动提交 Wan2.2 图生视频任务...");
    console.log("🖼️ [异步算力] 当前传递的公开图片URL:", imageUrl);

    // 🚀 向目标通道提交任务
    const submitRes = await axios.post(
      "https://api.siliconflow.cn/v1/video/submit",
      {
        model: "Wan-AI/Wan2.2-I2V-A14B",  // ✅ 绝对正确的 A14B 旗舰模型
        prompt: prompt || "让分镜画面动起来，电影级微运镜，高清质感，保持人物一致性",
        image: imageUrl,                  // ✅ 直接投喂可公开访问的 HTTP 临时存储 URL
        image_size: "1280x720"            
      },
      {
        headers: {
          "Authorization": `Bearer ${SILICONFLOW_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000 // 轻量接口，15秒未响应直接断开
      }
    );

    // ⏳ 提取唯一的任务追踪标识符
    const requestId = submitRes.data?.requestId || submitRes.data?.task_id;
    
    if (!requestId) {
      console.error("❌ 硅基响应拦截:", submitRes.data);
      return NextResponse.json({ error: "算力网关未能在第一阶段下发任务 ID" }, { status: 502 });
    }

    console.log(`✨ [异步算力] 任务成功挂载集群！Token ID: ${requestId}。已立即将追踪权交还前端。`);
    
    // ✅ 立刻返回，绝不硬等超时
    return NextResponse.json({ requestId, error: null });

  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.response?.data?.error?.message || error.message || "未知算力海啸";
    console.error("⚠️ [异步算力] 后端核心屏障隔离捕获:", errorMsg);
    
    return NextResponse.json({ 
      requestId: null, 
      error: `异步任务提交受限: ${errorMsg}` 
    }, { status: 200 }); // 返回 200 状态码由前端组件处理优雅捕获
  }
}