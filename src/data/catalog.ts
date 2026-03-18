import dynamicSystemPrompt from '../../docs/prompts/system/prompt.dynamic.md?raw';
import result2DynamicSystemPrompt from '../../docs/prompts/system/math-visualization-system-prompt-v4.md?raw';
import result2StaticSystemPrompt from '../../docs/prompts/system/math-visualization-system-prompt-v3.md?raw';
import staticSystemPrompt from '../../docs/prompts/system/prompt.static.md?raw';
import userPromptsRaw from './user-prompts.json?raw';
import result3UserPromptsRaw from './user-prompts-result3.json?raw';
import changeDescriptionsRaw from './change-descriptions-result5.json?raw';

export type Variant = 'static' | 'dynamic' | 'original' | 'modified' | 'v1' | 'v4' | 'before' | 'after';
export type ResultTab = 'result1' | 'result2' | 'result3' | 'result4' | 'result5';
export type RenderableResultTab = 'result1' | 'result2' | 'result3' | 'result4' | 'result5';

type PromptMap = Record<string, string>;

export interface PairItem {
  fileName: string;
  staticHtml: string;
  dynamicHtml?: string;
  userPrompt: string;
  modifiedUserPrompt?: string;
  changeDescription?: string;
}

export const systemPromptByTabVariant: Record<RenderableResultTab, Record<'static' | 'dynamic', string>> = {
  result1: {
    static: staticSystemPrompt,
    dynamic: dynamicSystemPrompt,
  },
  result2: {
    static: result2StaticSystemPrompt,
    dynamic: result2DynamicSystemPrompt,
  },
  result3: {
    static: result2DynamicSystemPrompt,
    dynamic: result2DynamicSystemPrompt,
  },
  result4: {
    static: dynamicSystemPrompt,
    dynamic: result2DynamicSystemPrompt,
  },
  result5: {
    static: result2DynamicSystemPrompt,
    dynamic: result2DynamicSystemPrompt,
  },
};

const userPromptMap = JSON.parse(userPromptsRaw) as PromptMap;
const result3UserPromptMap = JSON.parse(result3UserPromptsRaw) as PromptMap;
const changeDescriptionMap = JSON.parse(changeDescriptionsRaw) as PromptMap;

const result1StaticModules = import.meta.glob('../../data/result1/static/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const result1DynamicModules = import.meta.glob('../../data/result1/dynamic/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const result2StaticModules = import.meta.glob('../../data/result2/static/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const result2DynamicModules = import.meta.glob('../../data/result2/dynamic/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const result3Modules = import.meta.glob('../../data/result3/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const result5Modules = import.meta.glob('../../data/result5/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

function extractFileName(modulePath: string): string {
  const segments = modulePath.split('/');
  return segments[segments.length - 1] ?? modulePath;
}

function toFileMap(modules: Record<string, string>): Record<string, string> {
  const fileMap: Record<string, string> = {};

  for (const [modulePath, htmlText] of Object.entries(modules)) {
    const fileName = extractFileName(modulePath);
    fileMap[fileName] = htmlText;
  }

  return fileMap;
}

function sortByKoreanNumericOrder(a: string, b: string): number {
  return a.localeCompare(b, 'ko-KR', { numeric: true, sensitivity: 'base' });
}

function buildPairs(staticModules: Record<string, string>, dynamicModules: Record<string, string>): PairItem[] {
  const staticByFile = toFileMap(staticModules);
  const dynamicByFile = toFileMap(dynamicModules);

  return Object.keys(staticByFile)
    .sort(sortByKoreanNumericOrder)
    .map(fileName => ({
      fileName,
      staticHtml: staticByFile[fileName],
      dynamicHtml: dynamicByFile[fileName],
      userPrompt: userPromptMap[fileName] ?? '프롬프트 없음',
    }));
}

function buildResult3Pairs(): PairItem[] {
  const leftByFile = toFileMap(result2DynamicModules);
  const rightByFile = toFileMap(result3Modules);

  return Object.keys(leftByFile)
    .sort(sortByKoreanNumericOrder)
    .map(fileName => ({
      fileName,
      staticHtml: leftByFile[fileName],
      dynamicHtml: rightByFile[fileName],
      userPrompt: userPromptMap[fileName] ?? '프롬프트 없음',
      modifiedUserPrompt: result3UserPromptMap[fileName],
    }));
}

function buildResult5Pairs(): PairItem[] {
  const leftByFile = toFileMap(result2DynamicModules);
  const rightByFile = toFileMap(result5Modules);

  return Object.keys(leftByFile)
    .sort(sortByKoreanNumericOrder)
    .map(fileName => ({
      fileName,
      staticHtml: leftByFile[fileName],
      dynamicHtml: rightByFile[fileName],
      userPrompt: userPromptMap[fileName] ?? '프롬프트 없음',
      changeDescription: changeDescriptionMap[fileName],
    }));
}

function buildResult4Pairs(): PairItem[] {
  const leftByFile = toFileMap(result1DynamicModules);
  const rightByFile = toFileMap(result2DynamicModules);

  // result2/dynamic 파일명 기준으로 20개만 추출
  return Object.keys(rightByFile)
    .sort(sortByKoreanNumericOrder)
    .map(fileName => ({
      fileName,
      staticHtml: leftByFile[fileName] ?? '',
      dynamicHtml: rightByFile[fileName],
      userPrompt: userPromptMap[fileName] ?? '프롬프트 없음',
    }));
}

export const resultPairsByTab: Record<RenderableResultTab, PairItem[]> = {
  result1: buildPairs(result1StaticModules, result1DynamicModules),
  result2: buildPairs(result2StaticModules, result2DynamicModules),
  result3: buildResult3Pairs(),
  result4: buildResult4Pairs(),
  result5: buildResult5Pairs(),
};
