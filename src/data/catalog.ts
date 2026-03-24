import dynamicSystemPrompt from '../../docs/prompts/system/prompt.dynamic.md?raw';
import result2DynamicSystemPrompt from '../../docs/prompts/system/math-visualization-system-prompt-v4.md?raw';
import result2StaticSystemPrompt from '../../docs/prompts/system/math-visualization-system-prompt-v3.md?raw';
import result8SystemPromptRaw from '../../docs/prompts/system/math-visualization-system-prompt-v5.md?raw';
import staticSystemPrompt from '../../docs/prompts/system/prompt.static.md?raw';
import result9UserPromptsRaw from '../../docs/prompts/user/prompt.user1.md?raw';
import userPromptsRaw from './user-prompts.json?raw';
import result3UserPromptsRaw from './user-prompts-result3.json?raw';
import changeDescriptionsRaw from './change-descriptions-result5.json?raw';

export type Variant = 'static' | 'dynamic' | 'original' | 'modified' | 'v1' | 'v3' | 'v4' | 'before' | 'after';
export type ResultTab = 'result1' | 'result2' | 'result3' | 'result4' | 'result5' | 'result6' | 'result7' | 'result8' | 'result9';
export type RenderableResultTab = 'result1' | 'result2' | 'result3' | 'result4' | 'result5' | 'result6';

export interface AnalysisEntry {
  goal: string;
  actual: string;
}

export interface Result9CategoryItem {
  index: number;
  html: string;
  userPrompt: string;
  prevUserPrompt: string | undefined;
  analysis: AnalysisEntry | undefined;
}

export interface Result9Category {
  dirName: string;
  items: Result9CategoryItem[];
}

export interface Result7ModelItem {
  name: string;
  html: string;
}

export interface Result7Item {
  fileName: string;
  userPrompt: string;
  models: Result7ModelItem[];
}

type PromptMap = Record<string, string>;

export interface PairItem {
  fileName: string;
  staticHtml: string;
  dynamicHtml?: string;
  userPrompt: string;
  modifiedUserPrompt?: string;
  changeDescription?: string;
  r2StaticHtml?: string;
  r2DynamicHtml?: string;
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
  result6: {
    static: staticSystemPrompt,
    dynamic: result2DynamicSystemPrompt,
  },
};

export const result6R1DynamicPrompt: string = dynamicSystemPrompt;
export const result6R2StaticPrompt: string = result2StaticSystemPrompt;
export const result7SystemPrompt: string = result2DynamicSystemPrompt;

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

const result7OpusModules = import.meta.glob('../../data/result7/claude-opus-4-6/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const result7SonnetModules = import.meta.glob('../../data/result7/claude-sonnet-4-6/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const result7GeminiProModules = import.meta.glob('../../data/result7/gemini-3-1-pro/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const result7GeminiFlashModules = import.meta.glob('../../data/result7/gemini-3-1-flash/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const result7GPTThinkingModules = import.meta.glob('../../data/result7/chatgpt-5-4-thinking/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const result7GPTInstantModules = import.meta.glob('../../data/result7/chatgpt-5-3-instant/*.html', {
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

function buildResult6Pairs(): PairItem[] {
  const r1StaticByFile = toFileMap(result1StaticModules);
  const r1DynamicByFile = toFileMap(result1DynamicModules);
  const r2StaticByFile = toFileMap(result2StaticModules);
  const r2DynamicByFile = toFileMap(result2DynamicModules);

  return Object.keys(r1StaticByFile)
    .sort(sortByKoreanNumericOrder)
    .map(fileName => ({
      fileName,
      staticHtml: r1StaticByFile[fileName],
      dynamicHtml: r1DynamicByFile[fileName],
      userPrompt: userPromptMap[fileName] ?? '프롬프트 없음',
      r2StaticHtml: r2StaticByFile[fileName],
      r2DynamicHtml: r2DynamicByFile[fileName],
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

const RESULT7_MODELS: { name: string; modules: Record<string, string> }[] = [
  { name: 'Opus 4.6', modules: result7OpusModules },
  { name: 'Sonnet 4.6', modules: result7SonnetModules },
  { name: 'Gemini 3.1 Pro', modules: result7GeminiProModules },
  { name: 'Gemini 3.1 Flash', modules: result7GeminiFlashModules },
  { name: 'GPT 5.4 Thinking', modules: result7GPTThinkingModules },
  { name: 'GPT 5.3 Instant', modules: result7GPTInstantModules },
];

function buildResult7Items(): Result7Item[] {
  const sonnetByFile = toFileMap(result7SonnetModules);

  return Object.keys(sonnetByFile)
    .sort(sortByKoreanNumericOrder)
    .map(fileName => ({
      fileName,
      userPrompt: userPromptMap[fileName] ?? '프롬프트 없음',
      models: RESULT7_MODELS.map(({ name, modules }) => ({
        name,
        html: toFileMap(modules)[fileName] ?? '',
      })),
    }));
}

export const result7Items: Result7Item[] = buildResult7Items();

export const result8SystemPrompt: string = result8SystemPromptRaw;

const RESULT8_FILES = [
  '22.활꼴',
  '39.함수와내접하는도형',
  '44.삼각기둥',
  '83.원뿔전개도',
  '84.원뿔대',
];
const RESULT8_RUNS = 6;

export interface Result8RunItem {
  run: number;
  html: string;
}

export interface Result8Item {
  baseName: string;
  userPrompt: string;
  runs: Result8RunItem[];
}

const result8Modules = import.meta.glob('../../data/result8/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

function buildResult8Items(): Result8Item[] {
  const fileMap = toFileMap(result8Modules);
  return RESULT8_FILES.map(baseName => ({
    baseName,
    userPrompt: userPromptMap[`${baseName}.html`] ?? '프롬프트 없음',
    runs: Array.from({ length: RESULT8_RUNS }, (_, i) => ({
      run: i + 1,
      html: fileMap[`${baseName}_${i + 1}.html`] ?? '',
    })),
  }));
}

export const result8Items: Result8Item[] = buildResult8Items();

export const resultPairsByTab: Record<RenderableResultTab, PairItem[]> = {
  result1: buildPairs(result1StaticModules, result1DynamicModules),
  result2: buildPairs(result2StaticModules, result2DynamicModules),
  result3: buildResult3Pairs(),
  result4: buildResult4Pairs(),
  result5: buildResult5Pairs(),
  result6: buildResult6Pairs(),
};

// ─── result9 ────────────────────────────────────────────────────────────────

const result9AnalysisModules = import.meta.glob('../../data/result9/*/analysis.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

function parseAnalysis(raw: string): Record<number, AnalysisEntry> {
  const result: Record<number, AnalysisEntry> = {};
  const blocks = raw.split(/^### /m).filter(Boolean);
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    const index = parseInt(lines[0] ?? '', 10);
    if (isNaN(index)) continue;
    const goal = lines.find(l => l.startsWith('목표한 바:'))?.replace('목표한 바:', '').trim() ?? '';
    const actual = lines.find(l => l.startsWith('실제 동작:'))?.replace('실제 동작:', '').trim() ?? '';
    if (goal || actual) result[index] = { goal, actual };
  }
  return result;
}

function buildAnalysisMap(): Record<string, Record<number, AnalysisEntry>> {
  const map: Record<string, Record<number, AnalysisEntry>> = {};
  for (const [path, raw] of Object.entries(result9AnalysisModules)) {
    const segments = path.split('/');
    const dirName = segments[segments.length - 2] ?? '';
    map[dirName] = parseAnalysis(raw);
  }
  return map;
}

const result9AnalysisMap = buildAnalysisMap();

const result9Modules = import.meta.glob('../../data/result9/*/*.html', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

function parseResult9Prompts(raw: string): string[][] {
  return raw
    .split(/^---$/m)
    .map(section =>
      section
        .split('\n')
        .flatMap(line => {
          const m = line.match(/^\d+\.\s+(.+)$/);
          return m && m[1] ? [m[1].trim()] : [];
        })
    )
    .filter(prompts => prompts.length > 0);
}

function buildResult9Categories(): Result9Category[] {
  const promptsByCategoryIndex = parseResult9Prompts(result9UserPromptsRaw);

  const categoryMap: Record<string, Record<string, string>> = {};
  for (const [path, html] of Object.entries(result9Modules)) {
    const segments = path.split('/');
    const fileName = segments[segments.length - 1] ?? '';
    const dirName = segments[segments.length - 2] ?? '';
    if (!categoryMap[dirName]) categoryMap[dirName] = {};
    categoryMap[dirName][fileName] = html;
  }

  const sortedDirs = Object.keys(categoryMap).sort(sortByKoreanNumericOrder);

  return sortedDirs.map((dirName, categoryIdx) => {
    const fileMap = categoryMap[dirName]!;
    const categoryPrompts = promptsByCategoryIndex[categoryIdx] ?? [];

    const sortedFiles = Object.keys(fileMap).sort((a, b) => {
      const numA = parseInt(a.replace('.html', ''), 10);
      const numB = parseInt(b.replace('.html', ''), 10);
      return numA - numB;
    });

    const items: Result9CategoryItem[] = [];
    for (const fileName of sortedFiles) {
      const html = fileMap[fileName] ?? '';
      if (html.trim().length === 0) continue;

      const fileIndex = parseInt(fileName.replace('.html', ''), 10);
      const analysisEntry = result9AnalysisMap[dirName]?.[fileIndex];
      items.push({
        index: fileIndex,
        html,
        userPrompt: categoryPrompts[fileIndex - 1] ?? '',
        prevUserPrompt: fileIndex >= 2 ? (categoryPrompts[fileIndex - 2] ?? undefined) : undefined,
        analysis: analysisEntry,
      });
    }

    return { dirName, items };
  });
}

export const result9Categories: Result9Category[] = buildResult9Categories();
