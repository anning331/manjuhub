import { NextResponse } from "next/server";
import axios from "axios";

const SILICONFLOW_API_KEY = process.env.AI_SECRET_KEY!;

export async function POST(req: Request) {
  try {
    const { requestId } = await req.json();

    if (!requestId) {
      return NextResponse.json({ error: "缺少 requestId" }, { status: 400 });
    }

    const res = await axios.post(
      "https://api.siliconflow.cn/v1/video/status",
      { requestId },
      {
        headers: {
          Authorization: `Bearer ${SILICONFLOW_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const { status, results } = res.data ?? {};

    // 官方状态值：InQueue / InProgress / Succeed / Failed
    const videoUrl =
      status === "Succeed" ? (results?.videos?.[0]?.url ?? null) : null;

    return NextResponse.json({ status, videoUrl });
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      "查询失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}