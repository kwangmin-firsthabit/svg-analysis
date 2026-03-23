import type { Result9Category } from '../data/catalog';

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

function renderPromptWithDiff(curr: string, prev: string | undefined): React.ReactNode {
  if (!prev) return curr;

  let prefixLen = 0;
  const minLen = Math.min(prev.length, curr.length);
  while (prefixLen < minLen && prev[prefixLen] === curr[prefixLen]) {
    prefixLen++;
  }

  if (prefixLen === curr.length && curr.length === prev.length) return curr;

  return (
    <>
      {curr.slice(0, prefixLen)}
      <span className="text-blue-600">{curr.slice(prefixLen)}</span>
    </>
  );
}

interface Result9ItemCardProps {
  index: number;
  html: string;
  userPrompt: string;
  prevUserPrompt: string | undefined;
}

function Result9ItemCard({ index, html, userPrompt, prevUserPrompt }: Result9ItemCardProps) {
  return (
    <article className="w-[480px] shrink-0 rounded-xl border border-slate-300 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-4 py-2">
        <p className="text-xs font-semibold text-slate-500">#{index}</p>
      </header>

      <div className="border-b border-slate-200 bg-slate-50 p-3">
        {/* scrolling="no": iframe 내부 스크롤 제거 */}
        <iframe
          title={`result9-item-${index}`}
          srcDoc={html}
          loading="lazy"
          scrolling="no"
          className="h-[420px] w-full rounded border border-slate-300 bg-white"
        />
      </div>

      <section className="space-y-3 p-4">
        <div>
          <h3 className="mb-1 text-xs font-semibold text-slate-600">유저 프롬프트</h3>
          <p className="rounded border border-slate-200 bg-slate-50 p-2 text-xs leading-relaxed text-slate-700">
            {renderPromptWithDiff(userPrompt, prevUserPrompt)}
          </p>
        </div>

        <details className="rounded border border-slate-200 bg-slate-50">
          <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-slate-600">
            코드
          </summary>
          <pre className="max-h-60 overflow-auto border-t border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
            {html}
          </pre>
        </details>
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
      {/* 가로 스크롤 컨테이너 */}
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
