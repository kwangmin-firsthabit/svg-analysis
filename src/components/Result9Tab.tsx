import { useLayoutEffect, useRef } from 'react';
import type { AnalysisEntry, Result9Category } from '../data/catalog';

const targetImageModules = import.meta.glob('../../data/result9/targets/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

function getTargetImageUrl(dirName: string): string | undefined {
  const num = dirName.split('.')[0]?.padStart(2, '0') ?? '';
  const key = Object.keys(targetImageModules).find(k => k.includes(`image${num}`));
  return key ? targetImageModules[key] : undefined;
}

function parseSvgSize(html: string): { width: number; height: number } {
  const svgTag = html.match(/<svg[^>]*>/)?.[0] ?? '';
  const w = parseFloat(svgTag.match(/width="(\d+(?:\.\d+)?)"/)?.at(1) ?? '');
  const h = parseFloat(svgTag.match(/height="(\d+(?:\.\d+)?)"/)?.at(1) ?? '');
  return {
    width: isNaN(w) ? 500 : w,
    height: isNaN(h) ? 420 : h,
  };
}

type DiffSegment = { text: string; changed: boolean };

function computeSentenceDiff(prev: string, curr: string): DiffSegment[] {
  const endsWithPeriod = curr.trimEnd().endsWith('.');
  const prevSentences = prev.replace(/\.\s*$/, '').split('. ');
  const currSentences = curr.replace(/\.\s*$/, '').split('. ');
  const m = prevSentences.length;
  const n = currSentences.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = prevSentences[i - 1] === currSentences[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const tokens: Array<{ sentence: string; changed: boolean }> = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && prevSentences[i - 1] === currSentences[j - 1]) {
      tokens.unshift({ sentence: currSentences[j - 1]!, changed: false });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tokens.unshift({ sentence: currSentences[j - 1]!, changed: true });
      j--;
    } else {
      i--;
    }
  }

  const segments: DiffSegment[] = [];
  tokens.forEach(({ sentence, changed }, k) => {
    const isLast = k === tokens.length - 1;
    const text = (k > 0 ? '. ' : '') + sentence + (isLast && endsWithPeriod ? '.' : '');
    const last = segments[segments.length - 1];
    if (last && last.changed === changed) {
      last.text += text;
    } else {
      segments.push({ text, changed });
    }
  });

  return segments;
}

function renderPromptWithDiff(curr: string, prev: string | undefined): React.ReactNode {
  if (!prev) return curr;

  const segments = computeSentenceDiff(prev, curr);
  if (segments.every(s => !s.changed)) return curr;

  return (
    <>
      {segments.map((seg, idx) =>
        seg.changed
          ? <span key={idx} className="text-blue-600">{seg.text}</span>
          : seg.text
      )}
    </>
  );
}

interface Result9ItemCardProps {
  index: number;
  html: string;
  userPrompt: string;
  prevUserPrompt: string | undefined;
  analysis: AnalysisEntry | undefined;
}

function Result9ItemCard({ index, html, userPrompt, prevUserPrompt, analysis }: Result9ItemCardProps) {
  const articleRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { width, height } = parseSvgSize(html);

  useLayoutEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.style.width = `${width}px`;
      iframeRef.current.style.height = `${height}px`;
    }
    if (articleRef.current) {
      articleRef.current.style.width = `${width + 24}px`; // p-3 padding 양쪽 12px
    }
  }, [width, height]);

  const handleLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;
    const scrollHeight = iframe.contentDocument.documentElement.scrollHeight;
    if (scrollHeight > 0) {
      iframe.style.height = `${scrollHeight}px`;
    }
  };

  return (
    <article ref={articleRef} className="shrink-0 rounded-xl border border-slate-300 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-4 py-2">
        <p className="text-xs font-semibold text-slate-500">#{index}</p>
      </header>

      <div className="border-b border-slate-200 bg-slate-50 p-3">
        <iframe
          ref={iframeRef}
          title={`result9-item-${index}`}
          srcDoc={html}
          loading="lazy"
          scrolling="no"
          onLoad={handleLoad}
          className="block rounded border border-slate-300 bg-white"
        />
      </div>

      <section className="space-y-3 p-4">
        <div>
          <h3 className="mb-1 text-xs font-semibold text-slate-600">유저 프롬프트</h3>
          <p className="rounded border border-slate-200 bg-slate-50 p-2 text-sm leading-relaxed text-slate-700">
            {renderPromptWithDiff(userPrompt, prevUserPrompt)}
          </p>
        </div>

        <details className="rounded border border-slate-200 bg-slate-50">
          <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-slate-600">
            코드
          </summary>
          <pre className="max-h-[600px] overflow-auto border-t border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
            {html}
          </pre>
        </details>

        {analysis && (
          <div className="rounded border border-indigo-200 bg-indigo-50 p-3 space-y-2">
            <div>
              <h3 className="mb-0.5 text-xs font-semibold text-indigo-700">목표한 바</h3>
              <p className="text-xs leading-relaxed text-indigo-900">{analysis.goal}</p>
            </div>
            <div>
              <h3 className="mb-0.5 text-xs font-semibold text-indigo-700">실제 동작</h3>
              <p className="text-xs leading-relaxed text-indigo-900">{analysis.actual}</p>
            </div>
          </div>
        )}
      </section>
    </article>
  );
}

interface CategoryRowProps {
  category: Result9Category;
}

function CategoryRow({ category }: CategoryRowProps) {
  const imageUrl = getTargetImageUrl(category.dirName);

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700">{category.dirName}</p>
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-start gap-3">
          {/* 타겟 이미지 — sticky left */}
          <div className="sticky left-0 z-10 w-[400px] shrink-0 self-stretch rounded-xl border border-slate-300 bg-white shadow-sm">
            {imageUrl ? (
              <div className="flex h-full flex-col">
                <div className="border-b border-slate-200 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-500">target</p>
                </div>
                <div className="flex flex-1 items-center justify-center bg-slate-50 p-2">
                  <img
                    src={imageUrl}
                    alt={`target for ${category.dirName}`}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-50 text-xs text-slate-400">
                이미지 없음
              </div>
            )}
          </div>

          {/* 항목 카드들 */}
          {category.items.map(item => (
            <Result9ItemCard
              key={item.index}
              index={item.index}
              html={item.html}
              userPrompt={item.userPrompt}
              prevUserPrompt={item.prevUserPrompt}
              analysis={item.analysis}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Result9Tab({ categories }: { categories: Result9Category[] }) {
  return (
    <main className="w-full pb-6">
      <div className="space-y-6 px-4 pt-3">
        {categories.map(category => (
          <CategoryRow key={category.dirName} category={category} />
        ))}
      </div>
    </main>
  );
}
