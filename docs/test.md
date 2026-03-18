## SVG 동적 생성 규칙

SVG 도형을 그릴 때는 반드시 아래 방식을 따른다:

1. HTML에는 최상위 `<svg>` 요소와 `<defs>` 블록만 작성한다.
   모든 도형 요소(`<rect>`, `<circle>`, `<line>`, `<path>`, `<text>` 등)는
   HTML에 직접 작성하지 않는다.

2. 모든 좌표, 크기, 위치 값은 `<script>` 블록 안에서 JavaScript로 계산한다.

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
