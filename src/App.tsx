import { useState } from 'react';
import SvgRenderPanel from './components/SvgRenderPanel';
import { resultPairsByTab, systemPromptByTabVariant, type RenderableResultTab, type ResultTab } from './data/catalog';

const tabs: ResultTab[] = ['result1', 'result2', 'result3', 'result4', 'result5'];

// 탭 설명은 여기에서 직접 수정하세요.
const defaultTabDescriptions: Record<ResultTab, string> = {
  result1: 'SVG 정적 생성 방식 vs SVG 동적 생성 방식 비교 (sonnet-4.6)',
  result2:
    'SVG 정적 생성 방식 vs SVG 동적 생성 방식 비교 (시스템 프롬프트 수정 - show me 기능에서 사용하는 문서 지침 적용 / sonnet-4.6)',
  result3: '유저 프롬프트 난이도 상승 비교 — 기존 프롬프트(좌) vs 수정 프롬프트(우) (v4 시스템 프롬프트 동일 / sonnet-4.6)',
  result4: '시스템 프롬프트 비교 — prompt.dynamic v1(좌) vs math-visualization v4(우) (동일 유저 프롬프트 / sonnet-4.6)',
  result5: 'SVG 코드 파라미터 수정 비교 — 원본 코드(좌) vs 수정 코드(우) (result2/dynamic 기반)',
};

function isRenderableResultTab(tab: ResultTab): tab is RenderableResultTab {
  return tab === 'result1' || tab === 'result2' || tab === 'result3' || tab === 'result4' || tab === 'result5';
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
  const isResult3 = activeTab === 'result3';
  const isResult4 = activeTab === 'result4';
  const isResult5 = activeTab === 'result5';

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

      <main className="mx-auto w-full max-w-[1600px] px-4 py-6">
        <header className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
          <h1 className="text-lg font-semibold">{activeTab}</h1>
          <p className="mt-2 text-sm text-slate-600">{defaultTabDescriptions[activeTab]}</p>
          {renderableTab ? (
            <p className="mt-2 text-sm text-slate-600">
              파일쌍 {resultPairsByTab[renderableTab].length}개 / 렌더 패널 {resultPairsByTab[renderableTab].length * 2}
              개
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-600">준비중 탭입니다.</p>
          )}
        </header>

        {renderableTab ? (
          <section>
            <div className="space-y-6">
              {resultPairsByTab[renderableTab].map(pair => (
                <section key={pair.fileName} className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
                  <h2 className="mb-3 text-sm font-semibold text-slate-800">{pair.fileName}</h2>
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
                        systemPrompt={systemPromptByTabVariant[renderableTab].dynamic}
                      />
                    ) : (
                      <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">dynamic</p>
                        <p className="mt-2 text-sm text-slate-700">이 파일은 dynamic 데이터가 없습니다.</p>
                      </article>
                    )}
                  </div>
                  {isResult5 && pair.changeDescription && (
                    <div className="mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      <span className="font-semibold">변경 내용: </span>{pair.changeDescription}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </section>
        ) : (
          <TabPlaceholder tab={activeTab} />
        )}
      </main>
    </div>
  );
}
