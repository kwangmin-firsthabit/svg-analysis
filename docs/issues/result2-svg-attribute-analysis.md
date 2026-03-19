# result2 동적 SVG 속성 분석

업데이트 일자: 2026-03-19

## 범위

이 문서는 `data/result2/dynamic`의 83개 파일을 대상으로, SVG 태그 속성 사용 패턴을 집계한 결과를 정리한다.

- SVG 기반 파일: 73개
- Chart.js/canvas 기반 파일: 10개
- 분석 방법: 정적 `<svg>` 블록과 스크립트 내부의 `el('tag', {...})` 호출을 함께 파싱해 태그/속성/값 분포를 집계했다.
- 비교 기준: `docs/prompts/system/math-visualization-system-prompt-v4.md`

주의: `...attrs` 같은 spread override는 최종 렌더 값이 정적으로 보이지 않는 경우가 있어서, 일부 값은 `동적 할당`으로만 잡히거나 보수적으로 누락될 수 있다.

Chart.js 파일은 SVG 태그를 생성하지 않으므로, SVG 태그/속성 통계에서는 제외했다.

## 전체 현황


| 항목                   | 값   |
| -------------------- | --- |
| 전체 파일 수              | 83  |
| SVG 기반 파일 수          | 73  |
| Chart.js/canvas 파일 수 | 10  |
| 사용된 SVG 태그 수         | 11  |
| 사용된 속성 수             | 36  |


### viewBox 높이 분포

모든 SVG 파일은 `viewBox="0 0 680 H"` 형태를 유지했고, 너비는 680으로 고정됐다. 높이만 콘텐츠에 맞게 달라졌다.


| 높이  | 파일 수 |
| --- | ---- |
| 160 | 1    |
| 240 | 1    |
| 260 | 1    |
| 280 | 3    |
| 300 | 1    |
| 310 | 1    |
| 320 | 7    |
| 330 | 2    |
| 340 | 3    |
| 360 | 4    |
| 370 | 2    |
| 380 | 4    |
| 390 | 1    |
| 400 | 2    |
| 410 | 2    |
| 420 | 1    |
| 440 | 7    |
| 450 | 1    |
| 460 | 4    |
| 480 | 5    |
| 500 | 7    |
| 520 | 4    |
| 540 | 2    |
| 560 | 7    |


## 태그별 빈도


| 태그         | 전체 사용 횟수 | 사용 파일 수 | 대표 속성                                                                                                          |
| ---------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `line`     | 162      | 52      | `x1`, `x2`, `y1`, `y2`, `stroke`, `stroke-width`, `marker-end`, `stroke-dasharray`, `marker-start`             |
| `text`     | 85       | 73      | `x`, `y`, `dominant-baseline`, `fill`, `font-size`, `text-anchor`, `font-weight`                               |
| `svg`      | 73       | 73      | `id`, `viewBox`, `width`, `xmlns`                                                                              |
| `circle`   | 68       | 47      | `cx`, `cy`, `fill`, `r`, `stroke`, `stroke-width`, `fill-opacity`                                              |
| `defs`     | 63       | 63      | 대부분 비어 있음                                                                                                      |
| `path`     | 58       | 34      | `d`, `fill`, `stroke`, `stroke-width`, `stroke-linecap`, `stroke-linejoin`, `fill-opacity`, `stroke-dasharray` |
| `polygon`  | 43       | 31      | `points`, `fill`, `stroke`, `stroke-width`, `fill-opacity`                                                     |
| `rect`     | 39       | 24      | `fill`, `height`, `width`, `x`, `y`, `stroke`, `stroke-width`, `rx`, `fill-opacity`                            |
| `marker`   | 28       | 23      | `id`, `markerWidth`, `markerHeight`, `refX`, `refY`, `orient`, `viewBox`                                       |
| `polyline` | 27       | 18      | `fill`, `points`, `stroke`, `stroke-width`, `stroke-linejoin`                                                  |
| `ellipse`  | 3        | 2       | `cx`, `cy`, `rx`, `ry`, `fill`, `stroke`                                                                       |


### 태그별 해석

- `line`은 좌표축, 보조선, 치수선, 화살표에 가장 많이 쓰인다.
- `text`는 모든 SVG 파일에서 거의 필수이며, 라벨/제목/눈금값을 담당한다.
- `path`는 함수 그래프, 곡선, 마커 화살표, 부등식 영역 경계에 집중된다.
- `rect`는 배경, 격자, 직사각형/상자류, 테이블 셀에 쓰이며 `rx`로 둥근 모서리를 자주 만든다.
- `marker`는 화살표가 필요한 파일에만 붙는다.

## 전체 속성 빈도


| 속성                  | 전체 사용 횟수 | 사용 파일 수 |
| ------------------- | -------- | ------- |
| `fill`              | 311      | 73      |
| `stroke`            | 298      | 70      |
| `stroke-width`      | 283      | 70      |
| `x1`                | 162      | 52      |
| `x2`                | 162      | 52      |
| `y1`                | 162      | 52      |
| `y2`                | 162      | 52      |
| `width`             | 112      | 73      |
| `x`                 | 110      | 73      |
| `y`                 | 110      | 73      |
| `id`                | 101      | 73      |
| `viewBox`           | 90       | 73      |
| `dominant-baseline` | 84       | 73      |
| `font-size`         | 84       | 73      |
| `text-anchor`       | 83       | 73      |
| `font-weight`       | 80       | 73      |
| `xmlns`             | 73       | 73      |
| `cx`                | 71       | 49      |
| `cy`                | 71       | 49      |
| `points`            | 70       | 43      |
| `r`                 | 68       | 47      |
| `d`                 | 58       | 34      |
| `fill-opacity`      | 48       | 39      |
| `height`            | 39       | 24      |
| `stroke-dasharray`  | 37       | 24      |
| `marker-end`        | 36       | 19      |
| `stroke-linejoin`   | 29       | 17      |
| `markerHeight`      | 28       | 23      |
| `markerWidth`       | 28       | 23      |
| `orient`            | 28       | 23      |


### 자주 보이는 추가 속성

아래 속성들은 프롬프트 예시보다 실제 데이터에서 더 뚜렷하게 반복된다.

- `rx`: 12회, `rect`의 둥근 모서리 표현에 사용
- `stroke-linecap`: 17회, 주로 `path` 화살표/곡선 끝처리에 사용
- `stroke-linejoin`: 17회, 주로 `path`와 `polyline`에서 꺾이는 모서리 처리에 사용
- `marker-start`: 8회, 양방향 화살표나 왼쪽 방향 화살표 표현에 사용

## 속성값 분포

### 색상 계열


| 속성       | 주요 값                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| `fill`   | `#475569` 77, `none` 72, `#3B82F6` 47, `#1D4ED8` 38, `#F8FAFC` 15, `#1E293B` 13, `#2563EB` 7                       |
| `stroke` | `#1D4ED8` 99, `#374151` 55, `#94A3B8` 53, `#2563EB` 18, `context-stroke` 17, `#475569` 14, `none` 13, `#CBD5E1` 10 |


해석:

- 파랑 계열(`#3B82F6`, `#1D4ED8`, `#2563EB`)이 도형/강조선의 기본 축을 이룬다.
- 회색 계열(`#475569`, `#94A3B8`, `#374151`)은 텍스트, 보조선, 축에 집중된다.
- `none`은 선형 그래프나 경계선 내부 채우기를 끌 때 자주 보인다.
- `context-stroke`는 17개 파일에서 화살표 마커의 내부 경로에 사용된다.

### 두께와 크기


| 속성             | 주요 값                                                          |
| -------------- | ------------------------------------------------------------- |
| `stroke-width` | `1.5` 132, `1` 72, `1.2` 24, `2` 24, `0.8` 12, `3` 7, `2.5` 6 |
| `font-size`    | `12` 63, `14` 11, `13` 7, `11` 3                              |
| `font-weight`  | `400` 73, `500` 4, `600` 3                                    |
| `r`            | `3` 18, `3.5` 16, `4` 10, `6` 9, `5` 4, `110` 2, `2.5` 2      |


해석:

- `stroke-width=1.5`가 가장 강한 기본값이다.
- `font-size=12`와 `font-weight=400`이 기본 본문 라벨로 사실상 표준이다.
- 문서 규칙의 12/14px, 400/500보다 실제 산출물은 더 넓은 범위를 쓴다.

### 정렬과 점선


| 속성                  | 주요 값                                                               |
| ------------------- | ------------------------------------------------------------------ |
| `text-anchor`       | `middle` 76, 동적 할당 5, `end` 1, `start` 1                           |
| `dominant-baseline` | `central` 84                                                       |
| `fill-opacity`      | `0.12` 37, 동적 할당 4, `0.15` 3, `0.08` 1, `0.18` 1, `0.2` 1, `0.3` 1 |
| `stroke-dasharray`  | `4 3` 24, `5 4` 8, `5,4` 3, `3,3` 1, `4,3` 1                       |


해석:

- `text-anchor="middle"`가 기본이지만, 꼭짓점 라벨이나 길이 표시는 `start`/`end`를 섞는다.
- `dominant-baseline="central"`은 사실상 고정 패턴이다.
- `fill-opacity`는 문서 예시보다 `0.12`가 더 우세하다.
- `stroke-dasharray`는 공백 구분형과 쉼표 구분형이 함께 쓰여 스타일이 완전히 통일되지는 않았다.

### 화살표 관련


| 속성             | 주요 값                              |
| -------------- | --------------------------------- |
| `marker-end`   | `url(#arrow)` 36                  |
| `marker-start` | `url(#arrowL)` 7, `url(#arrow)` 1 |


해석:

- 화살표 끝은 거의 모두 `marker-end="url(#arrow)"` 방식이다.
- 시작점 화살표는 `arrowL`을 따로 정의하는 방식과, 한 파일에서 `arrow`를 재사용하는 방식이 혼재한다.

## 프롬프트 대비 실제 패턴


| 프롬프트 규칙/예시                                                 | 실제 83개 파일에서 보인 패턴                                                                          | 판정    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----- |
| `viewBox="0 0 680 H"`                                      | 73개 SVG 모두 680 너비 고정                                                                       | 일치    |
| `<defs>`는 arrow marker, clipPath, linearGradient 등을 둘 수 있음 | 63개 파일이 `defs`를 갖지만 대부분 비어 있고, 실제로는 marker 위주다. clipPath/linearGradient는 이 코퍼스에서 관찰되지 않았다. | 부분 일치 |
| `font-size`는 14px/12px 중심                                  | 12px가 최빈값이며 11/13/14가 literal로 확인되고, 일부 파일은 spread override로 18px도 사용한다                    | 차이    |
| `font-weight`는 400/500 중심                                  | 400이 최빈값이지만 600도 3회 등장                                                                     | 차이    |
| `text-anchor="middle"` 중심                                  | middle이 우세하지만 start/end와 동적 할당이 존재                                                         | 차이    |
| 예시의 `fill-opacity="0.15"`                                  | 실제로는 `0.12`가 가장 많다                                                                         | 차이    |
| 예시의 arrow marker는 `context-stroke`/`auto-start-reverse`    | 실제로는 `context-stroke` marker도 17개 파일에서 쓰이지만, `arrowL`을 별도로 두는 파일도 5개 있다                    | 혼용    |
| 예시에서는 `stroke-linejoin="round"`를 보여줌                       | 실제 데이터는 `path`와 `polyline`에서 `stroke-linejoin`/`stroke-linecap`을 선택적으로 쓴다                  | 부분 일치 |


## 요약

- 이 데이터셋의 SVG는 `polygon`, `line`, `text`, `circle`, `path`, `rect`를 중심으로 매우 정형화되어 있다.
- 색상은 파랑/회색 팔레트로 강하게 수렴한다.
- 문서 예시보다 실제 결과는 `font-size`, `font-weight`, `text-anchor`, `fill-opacity`, `stroke-dasharray`가 더 다양하다.
- `marker`와 `dasharray`는 화살표/축/부등식 시각화에서 반복 패턴이 강하게 나타난다.
- `rx`, `stroke-linecap`, `stroke-linejoin`, `marker-start` 같은 속성은 예시보다 실제 코퍼스에서 더 중요한 보조 패턴이다.

