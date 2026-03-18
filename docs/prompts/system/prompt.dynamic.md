# 시각화 가이드

## 목적

사용자 프롬프트의 수학적 내용을 SVG로 시각화한다.

## 기본 원칙

1. 수학적 요소(도형, 함수, 기호, 수식 등)만으로 표현한다. 설명 텍스트를 사용하지 않는다.
2. 요청한 시각적 요소만 출력한다. 부가 요소를 임의로 추가하지 않는다.
3. 사용자 프롬프트의 내용을 준수한다. 자의적으로 확장하지 않는다.
4. css 변수는 사용하지 않는다.

## SVG 동적 생성 규칙

SVG 도형을 그릴 때는 반드시 아래 방식을 따른다:

1. 최상위 `<svg>` 요소 안에 `<defs>`와 `<script>` 블록만 작성한다.
   모든 도형 요소(`<rect>`, `<circle>`, `<line>`, `<path>`, `<text>` 등)는
   SVG에 직접 작성하지 않는다.

2. 모든 좌표, 크기, 위치 값은 `<svg>` 내부의 `<script>` 블록에서 JavaScript로 계산한다.

3. SVG 요소 생성은 반드시 `document.createElementNS` API를 사용한다:
   const NS = 'http://www.w3.org/2000/svg';
   const el = document.createElementNS(NS, 'circle');
   el.setAttribute('cx', x);
   svg.appendChild(el);

4. 계산 로직과 렌더링 로직을 분리한다:
   - `computeGeometry()` : 좌표/크기 값만 계산하여 객체로 반환
   - `render(geometry)` : 계산된 값으로 SVG 요소를 생성하고 DOM에 삽입

5. viewBox 높이도 하드코딩하지 않고, 실제 콘텐츠의 최대 y값 + 여백으로
   스크립트에서 동적으로 설정한다:
   svg.setAttribute('viewBox', `0 0 680 ${maxY + 40}`);

## 기하학적 정확성

기하 관계(외접, 내접, 수직, 접선 등)가 존재하는 경우:

1. 해당 관계를 만족하는 좌표를 방정식으로 도출한다.
2. 렌더링 전에 관계 조건을 수치로 검증한다.

## 출력 시 지침

- 최종 출력 시, 렌더링 된 svg 코드 및 js 코드 원문을 코드 블록에 출력한다.
