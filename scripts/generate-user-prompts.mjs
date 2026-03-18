import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const promptDocPath = path.join(rootDir, 'docs/prompts/user/prompt.user.md')
const dataDirs = [
  path.join(rootDir, 'data/result1/static'),
  path.join(rootDir, 'data/result1/dynamic'),
  path.join(rootDir, 'data/result2/static'),
  path.join(rootDir, 'data/result2/dynamic'),
]
const outputPath = path.join(rootDir, 'src/data/user-prompts.json')

const aliases = new Map([
  ['전개도', '직육면체전개도'],
  ['두부등식교집합', '두부등식의교집합'],
  ['두부등식합집합', '두부등식의합집합'],
])

function normalizeName(value) {
  return value.replace(/\s+/g, '')
}

function parsePromptMarkdown(markdownText) {
  const promptMap = new Map()
  const lines = markdownText.split(/\r?\n/)

  for (const line of lines) {
    const match = line.match(/^\-\s+([^:]+):\s+(.+)$/)
    if (!match) continue

    const rawName = match[1].trim()
    const promptText = match[2].trim()
    const normalizedName = normalizeName(rawName)

    if (!promptMap.has(normalizedName)) {
      promptMap.set(normalizedName, promptText)
    }
  }

  return promptMap
}

function readHtmlFilesFromDir(dirPath) {
  if (!fs.existsSync(dirPath)) return []
  return fs
    .readdirSync(dirPath)
    .filter((name) => name.endsWith('.html'))
}

function sortKoreanNumeric(a, b) {
  return a.localeCompare(b, 'ko-KR', { numeric: true, sensitivity: 'base' })
}

function buildUserPromptJson(promptMap, fileNames) {
  const result = {}
  const missing = []

  for (const fileName of fileNames) {
    const baseName = normalizeName(fileName.replace(/^\d+\./, '').replace(/\.html$/, ''))
    const canonicalName = aliases.get(baseName) ?? baseName
    const userPrompt = promptMap.get(canonicalName)

    if (userPrompt) {
      result[fileName] = userPrompt
    } else {
      missing.push(fileName)
    }
  }

  return { result, missing }
}

function main() {
  const promptMarkdown = fs.readFileSync(promptDocPath, 'utf8')
  const promptMap = parsePromptMarkdown(promptMarkdown)

  const allFileSet = new Set()
  for (const dataDir of dataDirs) {
    for (const fileName of readHtmlFilesFromDir(dataDir)) {
      allFileSet.add(fileName)
    }
  }

  const allFileNames = Array.from(allFileSet).sort(sortKoreanNumeric)
  const { result, missing } = buildUserPromptJson(promptMap, allFileNames)

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')

  console.log(`[generate:user-prompts] generated ${Object.keys(result).length} entries`)
  console.log(`[generate:user-prompts] output: ${path.relative(rootDir, outputPath)}`)

  if (missing.length > 0) {
    console.warn(`[generate:user-prompts] missing prompt mappings: ${missing.length}`)
    for (const fileName of missing) {
      console.warn(`- ${fileName}`)
    }
  }
}

main()
