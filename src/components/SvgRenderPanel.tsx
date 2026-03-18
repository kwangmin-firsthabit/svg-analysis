import type { Variant } from '../data/catalog'

interface SvgRenderPanelProps {
  fileName: string
  variant: Variant
  htmlSource: string
  userPrompt: string
  systemPrompt: string
}

const variantLabel: Record<Variant, string> = {
  static: 'static',
  dynamic: 'dynamic',
  original: '기존 프롬프트',
  modified: '수정 프롬프트',
  v1: 'prompt.dynamic (v1)',
  v4: 'math-visualization-v4',
  before: '원본 코드',
  after: '수정 코드',
}

export default function SvgRenderPanel({
  fileName,
  variant,
  htmlSource,
  userPrompt,
  systemPrompt,
}: SvgRenderPanelProps) {
  return (
    <article className="rounded-xl border border-slate-300 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {variantLabel[variant]}
        </p>
      </header>

      <div className="border-b border-slate-200 bg-slate-50 p-3">
        <iframe
          title={`${variant}-${fileName}`}
          srcDoc={htmlSource}
          loading="lazy"
          className="h-96 w-full rounded border border-slate-300 bg-white"
        />
      </div>

      <section className="space-y-3 p-4">
        <div>
          <h3 className="mb-1 text-sm font-semibold text-slate-800">유저 프롬프트</h3>
          <p className="rounded border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">
            {userPrompt}
          </p>
        </div>

        <details className="rounded border border-slate-200 bg-slate-50">
          <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-slate-800">
            시스템 프롬프트
          </summary>
          <pre className="max-h-72 overflow-auto border-t border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
            {systemPrompt}
          </pre>
        </details>

        <details className="rounded border border-slate-200 bg-slate-50">
          <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-slate-800">
            SVG 데이터 원본 (HTML 전체)
          </summary>
          <pre className="max-h-72 overflow-auto border-t border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
            {htmlSource}
          </pre>
        </details>
      </section>
    </article>
  )
}
