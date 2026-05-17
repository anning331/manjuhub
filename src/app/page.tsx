import Link from "next/link";

/** 玄学静态黑金：线色与辉光基准 */
const DG = "#B89765";
const DG_SOFT = "#C5A880";
const DG_DEEP = "#7A6147";

const navItems = [
  { label: "首页", href: "#top" },
  { label: "工作台", href: "/workspace" },
  { label: "价格方案", href: "#pricing" },
] as const;

const features = [
  {
    title: "剧本爻象拆解",
    description:
      "智能洞察场次起伏与人物情愫，将万字剧本化为丝丝入扣的生产工单。",
    accent: "from-[#B89765]/22 via-[#4f3f2e]/10 to-transparent",
    borderHover: "hover:border-[#B89765]/40",
    glow: "hover:shadow-[0_24px_90px_-48px_rgba(184,151,101,0.28)]",
    badge: "爻象引擎",
  },
  {
    title: "意象分镜显化",
    description:
      "镜头语言与光影质感的极致对齐，将每一幕文字虚空幻化为多规格高清画质。",
    accent: "from-[#C5A880]/18 via-[#5c4832]/10 to-transparent",
    borderHover: "hover:border-[#C5A880]/38",
    glow: "hover:shadow-[0_24px_90px_-48px_rgba(197,168,128,0.26)]",
    badge: "显化之境",
  },
  {
    title: "相貌乾坤锁定",
    description:
      "跨场次精准锁定角色骨相，保障剧情连贯性，无惧千变万化的角色流转。",
    accent: "from-[#9A7B58]/22 via-[#3d3428]/12 to-transparent",
    borderHover: "hover:border-[#9A7B58]/36",
    glow: "hover:shadow-[0_24px_90px_-48px_rgba(154,123,88,0.24)]",
    badge: "乾坤锁定",
  },
  {
    title: "异步造物工厂",
    description:
      "云端并行渲染与合成序列，进度随心可视化，成片破茧而出无需死守终端。",
    accent: "from-[#B89765]/20 via-[#6b5238]/08 to-transparent",
    borderHover: "hover:border-[#8E7355]/40",
    glow: "hover:shadow-[0_24px_90px_-48px_rgba(139,115,85,0.22)]",
    badge: "造物序列",
  },
] as const;

function ManjuMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="manjuHubMarkGrad"
          x1="6"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={DG_SOFT} />
          <stop offset="0.45" stopColor={DG} />
          <stop offset="1" stopColor={DG_DEEP} />
        </linearGradient>
      </defs>
      <path
        d="M16 5L26 11V21L16 27L6 21V11L16 5Z"
        stroke="url(#manjuHubMarkGrad)"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M16 11v10M11 14l10 4M21 14l-10 4"
        stroke="url(#manjuHubMarkGrad)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div
      id="top"
      className="relative min-h-screen overflow-x-hidden bg-black text-zinc-100 selection:bg-[#B89765]/20 selection:text-white"
    >
      {/* 泼墨底韵 · 纯静态 */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_72%_at_50%_100%,rgba(38,30,22,0.42),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_56%_at_14%_18%,rgba(10,10,10,0.92),transparent_56%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_48%_at_86%_28%,rgba(197,168,128,0.035),transparent_52%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.038)_1px,transparent_1px)] bg-[length:100%_52px] opacity-[0.12]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_92%_at_50%_50%,transparent_44%,rgba(62,48,34,0.16)_90%,rgba(24,18,14,0.38)_100%)]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#B89765]/10 bg-black/50 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-black/32">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="#top"
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#B89765]/22 bg-white/[0.02] shadow-[0_0_0_1px_rgba(197,168,128,0.1)_inset,0_14px_44px_-28px_rgba(40,30,22,0.7)] transition-[border-color,box-shadow] duration-300 group-hover:border-[#C5A880]/42 group-hover:shadow-[0_0_0_1px_rgba(184,151,101,0.18)_inset,0_18px_52px_-26px_rgba(90,72,52,0.45)]">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#B89765]/14 via-transparent to-[#5c4832]/12 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
              <ManjuMark className="relative h-[22px] w-[22px]" />
            </span>
            <span className="bg-gradient-to-r from-[#F3EFE6] via-[#C5A880] to-[#8E7356] bg-clip-text text-[15px] font-semibold tracking-[0.04em] text-transparent drop-shadow-[0_0_28px_rgba(28,22,18,0.75)]">
              ManjuHub
            </span>
          </Link>

          <nav
            className="hidden items-center gap-8 text-sm font-medium text-zinc-500 md:flex"
            aria-label="主导航"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-[#C5A880]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#start"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#B89765]/28 bg-black/50 px-4 text-sm font-semibold text-[#EDE8DD] shadow-[0_0_36px_-18px_rgba(184,151,101,0.42)] backdrop-blur-sm transition-[border-color,box-shadow,background-color,color] hover:border-[#C5A880]/52 hover:bg-white/[0.05] hover:text-white hover:shadow-[0_0_48px_-14px_rgba(197,168,128,0.42)]"
            >
              开始使用
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:pb-32 lg:pt-32">
        {/* Hero · 太极金光晕 · 零外链 */}
        <section
          aria-label="首页主视觉"
          className="relative mx-auto max-w-4xl isolate py-14 text-center sm:py-20"
        >
          <p className="relative z-10 mb-8 inline-flex items-center gap-2 rounded-full border border-[#B89765]/24 bg-black/45 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur-md">
            <span
              className="inline-flex h-1.5 w-1.5 rounded-full bg-[#C5A880] shadow-[0_0_14px_rgba(197,168,128,0.45)]"
              aria-hidden
            />
            太极推演 · 玄象为纬
          </p>

          {/* 玄学太极极光晕 — 在主标题后方 */}
          <div className="relative z-10 mx-auto flex flex-col items-center gap-12">
            <div className="relative mx-auto w-full max-w-4xl">
              <div
                className="pointer-events-none absolute left-1/2 top-[44%] z-0 h-[600px] w-[600px] max-h-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[150px]"
                style={{
                  background:
                    "radial-gradient(circle at 42% 40%, #B89765 0%, #111C1D 48%, #000000 78%, #000000 100%)",
                }}
                aria-hidden
              />

              <h1 className="relative z-10 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-white drop-shadow-[0_4px_40px_rgba(0,0,0,0.92)] sm:text-5xl lg:text-[3.12rem] lg:leading-[1.06]">
                <span className="bg-gradient-to-br from-[#FFFBF2] via-[#E9DCC0] to-[#B89765] bg-clip-text text-transparent">
                  ManjuHub ｜ AI 短剧全息推演矩阵
                </span>
              </h1>

              <p className="relative z-10 mx-auto mt-8 max-w-2xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
                以算法窥见剧本乾坤，凭算力幻化高清分镜。指尖落子，一键生成属于你的爆款短剧。
              </p>
            </div>

            <div
              id="start"
              className="relative z-10 flex scroll-mt-32 flex-col items-center gap-4"
            >
              <Link
                href="/workspace/init"
                className="group relative inline-flex items-center justify-center rounded-full border border-[#C5A880]/52 bg-black/82 px-8 py-3.5 text-sm font-semibold shadow-[0_22px_80px_-42px_rgba(0,0,0,0.88),0_0_72px_-40px_rgba(184,151,101,0.42)] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89765]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black hover:border-[#E9DDC4]/82 hover:bg-black/92 hover:shadow-[0_28px_100px_-40px_rgba(0,0,0,0.92)]"
              >
                <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_50%_-28%,rgba(236,217,178,0.12),transparent_58%)]" />
                <span className="relative bg-gradient-to-r from-[#F6F3EA] via-[#DDC9A8] to-[#9B7F62] bg-clip-text text-transparent">
                  立即开始创作
                </span>
                <svg
                  className="relative ml-2 h-4 w-4 text-[#C5A880] transition-transform duration-300 group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <p className="max-w-xl text-[0.8rem] leading-relaxed text-zinc-500 sm:text-xs">
                协同推演以待 · 私有化部署恭候晤谈
              </p>
            </div>
          </div>
        </section>

        {/* Bento */}
        <section
          id="workspace"
          className="mx-auto mt-20 max-w-6xl scroll-mt-28 lg:mt-28"
          aria-labelledby="features-heading"
        >
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="features-heading"
                className="text-lg font-semibold tracking-tight text-white sm:text-xl"
              >
                四象推演矩阵
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">
                乾坤已定，算力为笔；一念起势，万象皆可编排入轨。
              </p>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-600">
              Matrix · 全息套件
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((item) => (
              <article
                key={item.title}
                className={`group relative overflow-hidden rounded-2xl border border-[#B89765]/12 bg-black/35 p-6 shadow-[0_0_0_1px_rgba(62,48,34,0.35)_inset] transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-black/40 ${item.borderHover} ${item.glow}`}
              >
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${item.accent} blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                  aria-hidden
                />
                <div className="relative flex flex-col gap-4">
                  <span className="inline-flex w-fit rounded-full border border-[#B89765]/24 bg-black/55 px-2.5 py-1 text-[11px] font-medium text-[#E4DACC]/95 backdrop-blur-md">
                    {item.badge}
                  </span>
                  <h3 className="text-base font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs font-medium text-[#C5A880] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="h-px w-8 bg-gradient-to-r from-[#B89765]/95 to-transparent" />
                    窥见玄机
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="pricing"
          className="mx-auto mt-16 max-w-6xl scroll-mt-28 rounded-2xl border border-dashed border-[#B89765]/35 bg-black/35 px-6 py-10 text-center shadow-[0_0_56px_-40px_rgba(55,42,30,0.55)] backdrop-blur-sm"
          aria-label="价格方案"
        >
          <p className="text-sm font-medium text-[#D9CBB0]">价格方案</p>
          <p className="mt-2 text-sm text-zinc-500">
            命理套餐与按量推演模型即将释出，欢迎提前预约演盘。
          </p>
        </section>

        <footer className="mx-auto mt-20 max-w-6xl border-t border-[#B89765]/15 pt-10 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} ManjuHub · AI 短剧全息推演矩阵
        </footer>
      </main>
    </div>
  );
}
