import dynamicSystemPrompt from '../../docs/prompts/system/prompt.dynamic.md?raw'
import staticSystemPrompt from '../../docs/prompts/system/prompt.static.md?raw'
import userPromptsRaw from './user-prompts.json?raw'

export type Variant = 'static' | 'dynamic'
export type ResultTab = 'result1' | 'result2' | 'result3' | 'result4'
export type RenderableResultTab = 'result1' | 'result2'

type PromptMap = Record<string, string>

export interface PairItem {
  fileName: string
  staticHtml: string
  dynamicHtml?: string
  userPrompt: string
}

export const systemPromptByVariant: Record<Variant, string> = {
  static: staticSystemPrompt,
  dynamic: dynamicSystemPrompt,
}

const userPromptMap = JSON.parse(userPromptsRaw) as PromptMap

const result1StaticModules = import.meta.glob('../../data/result1/static/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const result1DynamicModules = import.meta.glob('../../data/result1/dynamic/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const result2StaticModules = import.meta.glob('../../data/result2/static/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const result2DynamicModules = import.meta.glob('../../data/result2/dynamic/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

function extractFileName(modulePath: string): string {
  const segments = modulePath.split('/')
  return segments[segments.length - 1] ?? modulePath
}

function toFileMap(modules: Record<string, string>): Record<string, string> {
  const fileMap: Record<string, string> = {}

  for (const [modulePath, htmlText] of Object.entries(modules)) {
    const fileName = extractFileName(modulePath)
    fileMap[fileName] = htmlText
  }

  return fileMap
}

function sortByKoreanNumericOrder(a: string, b: string): number {
  return a.localeCompare(b, 'ko-KR', { numeric: true, sensitivity: 'base' })
}

function buildPairs(
  staticModules: Record<string, string>,
  dynamicModules: Record<string, string>,
): PairItem[] {
  const staticByFile = toFileMap(staticModules)
  const dynamicByFile = toFileMap(dynamicModules)

  return Object.keys(staticByFile)
    .sort(sortByKoreanNumericOrder)
    .map((fileName) => ({
      fileName,
      staticHtml: staticByFile[fileName],
      dynamicHtml: dynamicByFile[fileName],
      userPrompt: userPromptMap[fileName] ?? '프롬프트 없음',
    }))
}

export const resultPairsByTab: Record<RenderableResultTab, PairItem[]> = {
  result1: buildPairs(result1StaticModules, result1DynamicModules),
  result2: buildPairs(result2StaticModules, result2DynamicModules),
}
