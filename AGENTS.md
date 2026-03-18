# AGENTS.md

이 파일은 이 저장소에서 작업하는 LLM에게 안내를 제공합니다.

## 언어

항상 한국어로 답변한다.

## 프로젝트 개요

**svg-analysis**는 LLM이 직접 생성한 수학 시각화 SVG 결과물을 기록·비교하는 프로젝트다. Claude, Gemini, ChatGPT 등의 LLM에게 시스템 프롬프트와 유저 프롬프트를 제공하고, LLM이 최종 생성한 SVG/HTML 코드를 그대로 이 저장소에 저장한다.

React + TypeScript + Vite 기반 웹 앱으로, `data/` 폴더의 SVG HTML 파일들을 불러와 카탈로그 형태로 렌더링한다. `data/` 디렉토리는 LLM이 생성한 파일들의 보관함으로, Claude Code가 직접 수정하지 않는다.

## 명령어

```bash
npm run dev      # Vite 개발 서버 실행 (HMR)
npm run build    # TypeScript 컴파일 + Vite 프로덕션 빌드
npm run lint     # ESLint (TypeScript 지원)
```

## 저장소 구조

- `src/main.tsx` — React 앱 진입점 (StrictMode)
- `src/App.tsx` — 메인 컴포넌트
- `docs/prompts/system/prompt.static.md` — 정적 SVG 파일 생성용 시스템 프롬프트
- `docs/prompts/system/prompt.dynamic.md` — JS 파일 생성용 시스템 프롬프트
- `docs/prompts/user/prompt.user.md` — 유저 프롬프트
- `docs/features.md` — 지원하는 모든 SVG 요소의 기능 매트릭스
- `docs/coordinate-plane.md` — 좌표계 SVG 요소 명세
- `docs/result.md` — 기능과 기존 구현체의 라인 번호 매핑

## SVG 기능 카테고리

`docs/features.md` 참고:

- **Points**: 좌표 기반, 구성점, 경로 위, 함수 위
- **Shapes**: 삼각형, 사각형, 원, 다각형, 호, 부채꼴, 타원, 적분 영역, 부등식 영역
- **Paths**: 선분, 화살표, 곡선, 브래킷, 직선, 점근선
- **Functions**: 1차~4차, 지수, 로그, 삼각, 절댓값, 유리, 분수, 정규분포
- **Annotations**: 각도, 직각, 길이 라벨, 텍스트 라벨, 눈금, 평행 표시, 각도 마커, 극한 마커
- **Diagrams**: 나눗셈, 최대공약수, 상태 기계 나눗셈, 벤 다이어그램
- **Solids**: 각기둥, 각뿔, 원기둥, 원뿔, 구
- **Charts**: 히스토그램, 상자 그림, 막대 차트, 꺾은선 차트, 원 차트, 산점도

## CSS 규칙

**Tailwind CSS만 사용한다.** 인라인 스타일(`style={{...}}`)이나 별도 CSS 파일 작성은 금지한다. 모든 스타일은 Tailwind 유틸리티 클래스로 처리한다. CSS 변수(`--var`)나 전역 스타일이 필요한 경우에만 `src/index.css`에 최소한으로 추가한다.

## TypeScript 설정

`tsconfig.app.json`: strict 모드, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. 타깃 ES2023, JSX는 `react-jsx`.
