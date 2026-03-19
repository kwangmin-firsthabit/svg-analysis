import { useState, useRef, useCallback } from 'react';
import SvgRenderPanel from './components/SvgRenderPanel';
import { resultPairsByTab, result7Items, result7SystemPrompt, systemPromptByTabVariant, result6R1DynamicPrompt, result6R2StaticPrompt, type RenderableResultTab, type ResultTab } from './data/catalog';

const tabs: ResultTab[] = ['result1', 'result2', 'result3', 'result4', 'result5', 'result6', 'result7'];

// 탭 설명은 여기에서 직접 수정하세요.
const defaultTabDescriptions: Record<ResultTab, string> = {
  result1: 'SVG 정적 생성 방식 vs SVG 동적 생성 방식 비교 (sonnet-4.6)',
  result2:
    'SVG 정적 생성 방식 vs SVG 동적 생성 방식 비교 (시스템 프롬프트 수정 - show me 기능에서 사용하는 문서 지침 적용 / sonnet-4.6)',
  result3: '유저 프롬프트 난이도 상승 비교 — 기존 프롬프트(좌) vs 수정 프롬프트(우) (v4 시스템 프롬프트 동일 / sonnet-4.6)',
  result4: '시스템 프롬프트 비교 — prompt.dynamic v1(좌) vs math-visualization v4(우) (동일 유저 프롬프트 / sonnet-4.6)',
  result5: 'SVG 코드 파라미터 수정 비교 — 원본 코드(좌) vs 수정 코드(우) (result2/dynamic 기반)',
  result6: '4가지 방식 전체 비교 — r1/static | r1/dynamic | r2/static(v3) | r2/dynamic(v4) (83개 주제)',
  result7: '모델별 비교 — Opus 4.6 / Sonnet 4.6 / Gemini 3.1 Pro / Gemini 3.1 Flash / GPT 5.4 Thinking / GPT 5.3 Instant (동일 시스템 프롬프트 v4 / 20개 주제)',
};

function isRenderableResultTab(tab: ResultTab): tab is RenderableResultTab {
  return tab === 'result1' || tab === 'result2' || tab === 'result3' || tab === 'result4' || tab === 'result5' || tab === 'result6';
}

function isResult7Tab(tab: ResultTab): boolean {
  return tab === 'result7';
}

function TabPlaceholder({ tab }: { tab: ResultTab }) {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
      <h2 className="mb-2 text-lg font-semibold text-slate-800">{tab}</h2>
      <p>준비중</p>
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ResultTab>('result1');
  const renderableTab = isRenderableResultTab(activeTab) ? activeTab : null;
  const result7HeaderRef = useRef<HTMLDivElement>(null);
  const syncHeaderScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (result7HeaderRef.current) {
      result7HeaderRef.current.scrollLeft = (e.currentTarget as HTMLDivElement).scrollLeft;
    }
  }, []);
  const isResult3 = activeTab === 'result3';
  const isResult4 = activeTab === 'result4';
  const isResult5 = activeTab === 'result5';
  const isResult6 = activeTab === 'result6';
  const isResult7 = isResult7Tab(activeTab);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-300 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-[1600px] gap-2 px-4 py-3">
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </header>

      {/* 탭 설명 헤더 */}
      <div className={(isResult7 || isResult6) ? 'px-4 pt-6' : 'mx-auto w-full max-w-[1600px] px-4 pt-6'}>
        <header className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
          <h1 className="text-lg font-semibold">{activeTab}</h1>
          <p className="mt-2 text-sm text-slate-600">{defaultTabDescriptions[activeTab]}</p>
          {renderableTab ? (
            <p className="mt-2 text-sm text-slate-600">
              파일 {resultPairsByTab[renderableTab].length}개 / 렌더 패널 {resultPairsByTab[renderableTab].length * (isResult6 ? 4 : 2)}개
            </p>
          ) : isResult7 ? (
            <p className="mt-2 text-sm text-slate-600">
              주제 {result7Items.length}개 / 모델 6개 / 렌더 패널 {result7Items.length * 6}개
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-600">준비중 탭입니다.</p>
          )}
        </header>
      </div>

      {renderableTab ? (
        <main className={isResult6 ? 'w-full px-4 pb-6' : 'mx-auto w-full max-w-[1600px] px-4 pb-6'}>
          <section>
            <div className="space-y-6">
              {resultPairsByTab[renderableTab].map(pair => (
                <section key={pair.fileName} className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
                  <h2 className="mb-3 text-sm font-semibold text-slate-800">{pair.fileName}</h2>
                  {isResult6 ? (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                      <SvgRenderPanel
                        fileName={pair.fileName}
                        variant="static"
                        htmlSource={pair.staticHtml}
                        userPrompt={pair.userPrompt}
                        systemPrompt={systemPromptByTabVariant.result6.static}
                        iframeClassName="h-[500px]"
                      />
                      {pair.dynamicHtml ? (
                        <SvgRenderPanel
                          fileName={pair.fileName}
                          variant="v1"
                          htmlSource={pair.dynamicHtml}
                          userPrompt={pair.userPrompt}
                          systemPrompt={result6R1DynamicPrompt}
                          iframeClassName="h-[500px]"
                        />
                      ) : (
                        <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">r1/dynamic</p>
                          <p className="mt-2 text-sm text-slate-700">데이터 없음</p>
                        </article>
                      )}
                      {pair.r2StaticHtml ? (
                        <SvgRenderPanel
                          fileName={pair.fileName}
                          variant="v3"
                          htmlSource={pair.r2StaticHtml}
                          userPrompt={pair.userPrompt}
                          systemPrompt={result6R2StaticPrompt}
                          iframeClassName="h-[500px]"
                        />
                      ) : (
                        <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">r2/static</p>
                          <p className="mt-2 text-sm text-slate-700">데이터 없음</p>
                        </article>
                      )}
                      {pair.r2DynamicHtml ? (
                        <SvgRenderPanel
                          fileName={pair.fileName}
                          variant="v4"
                          htmlSource={pair.r2DynamicHtml}
                          userPrompt={pair.userPrompt}
                          systemPrompt={systemPromptByTabVariant.result6.dynamic}
                          iframeClassName="h-[500px]"
                        />
                      ) : (
                        <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">r2/dynamic</p>
                          <p className="mt-2 text-sm text-slate-700">데이터 없음</p>
                        </article>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                      <SvgRenderPanel
                        fileName={pair.fileName}
                        variant={isResult5 ? 'before' : isResult3 ? 'original' : isResult4 ? 'v1' : 'static'}
                        htmlSource={pair.staticHtml}
                        userPrompt={pair.userPrompt}
                        systemPrompt={systemPromptByTabVariant[renderableTab].static}
                      />
                      {pair.dynamicHtml ? (
                        <SvgRenderPanel
                          fileName={pair.fileName}
                          variant={isResult5 ? 'after' : isResult3 ? 'modified' : isResult4 ? 'v4' : 'dynamic'}
                          htmlSource={pair.dynamicHtml}
                          userPrompt={isResult3 ? (pair.modifiedUserPrompt ?? pair.userPrompt) : pair.userPrompt}
                          userPromptOriginal={isResult3 ? pair.userPrompt : undefined}
                          systemPrompt={systemPromptByTabVariant[renderableTab].dynamic}
                        />
                      ) : (
                        <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">dynamic</p>
                          <p className="mt-2 text-sm text-slate-700">이 파일은 dynamic 데이터가 없습니다.</p>
                        </article>
                      )}
                    </div>
                  )}
                  {isResult5 && pair.changeDescription && (
                    <div className="mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      <span className="font-semibold">변경 내용: </span>{pair.changeDescription}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </section>
        </main>
      ) : isResult7 ? (
        <main className="w-full pb-6">
          {/* 모델 헤더 — sticky (overflow-x 컨테이너 바깥에 위치해 수직 sticky 정상 동작) */}
          <div className="sticky top-[61px] z-10 border-b border-slate-300 bg-slate-100">
            <div ref={result7HeaderRef} className="result7-header-scroll overflow-x-auto">
              <div className="flex min-w-max gap-2 px-4 py-2">
                {result7Items[0]?.models.map(m => (
                  <div
                    key={m.name}
                    className="w-[560px] shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-white"
                  >
                    {m.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 주제별 행 */}
          <div className="result7-content-scroll overflow-x-auto" onScroll={syncHeaderScroll}>
            <div className="min-w-max space-y-3 px-4 py-3">
              {result7Items.map(item => (
                <div key={item.fileName}>
                  <p className="mb-1 text-xs font-semibold text-slate-700">{item.fileName}</p>
                  <div className="flex items-start gap-2">
                  {item.models.map(m => (
                    m.html ? (
                      <div key={m.name} className="w-[560px] shrink-0">
                        <SvgRenderPanel
                          fileName={item.fileName}
                          variantLabel={m.name}
                          htmlSource={m.html}
                          userPrompt={item.userPrompt}
                          systemPrompt={result7SystemPrompt}
                          iframeClassName="h-[420px]"
                        />
                      </div>
                    ) : (
                      <article key={m.name} className="w-[560px] shrink-0 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
                        <div className="flex h-[420px] items-center justify-center bg-slate-50 text-sm text-slate-400">
                          데이터 없음
                        </div>
                      </article>
                    )
                  ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        <main className="mx-auto w-full max-w-[1600px] px-4 pb-6">
          <TabPlaceholder tab={activeTab} />
        </main>
      )}
    </div>
  );
}
