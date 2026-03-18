import { useState } from 'react'
import SvgRenderPanel from './components/SvgRenderPanel'
import {
  resultPairsByTab,
  systemPromptByVariant,
  type RenderableResultTab,
  type ResultTab,
} from './data/catalog'

const tabs: ResultTab[] = ['result1', 'result2', 'result3', 'result4']

function isRenderableResultTab(tab: ResultTab): tab is RenderableResultTab {
  return tab === 'result1' || tab === 'result2'
}

function TabPlaceholder({ tab }: { tab: Exclude<ResultTab, 'result1' | 'result2'> }) {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
      <h2 className="mb-2 text-lg font-semibold text-slate-800">{tab}</h2>
      <p>준비중</p>
    </section>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ResultTab>('result1')

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-300 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-[1600px] gap-2 px-4 py-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1600px] px-4 py-6">
        {isRenderableResultTab(activeTab) ? (
          <section>
            <header className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
              <h1 className="text-lg font-semibold">{activeTab}</h1>
              <p className="text-sm text-slate-600">
                파일쌍 {resultPairsByTab[activeTab].length}개 / 렌더 패널{' '}
                {resultPairsByTab[activeTab].length * 2}개
              </p>
            </header>

            <div className="space-y-6">
              {resultPairsByTab[activeTab].map((pair) => (
                <section
                  key={pair.fileName}
                  className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm"
                >
                  <h2 className="mb-3 text-sm font-semibold text-slate-800">{pair.fileName}</h2>
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <SvgRenderPanel
                      fileName={pair.fileName}
                      variant="static"
                      htmlSource={pair.staticHtml}
                      userPrompt={pair.userPrompt}
                      systemPrompt={systemPromptByVariant.static}
                    />
                    {pair.dynamicHtml ? (
                      <SvgRenderPanel
                        fileName={pair.fileName}
                        variant="dynamic"
                        htmlSource={pair.dynamicHtml}
                        userPrompt={pair.userPrompt}
                        systemPrompt={systemPromptByVariant.dynamic}
                      />
                    ) : (
                      <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          dynamic
                        </p>
                        <p className="mt-2 text-sm text-slate-700">
                          이 파일은 dynamic 데이터가 없습니다.
                        </p>
                      </article>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ) : (
          <TabPlaceholder tab={activeTab} />
        )}
      </main>
    </div>
  )
}
