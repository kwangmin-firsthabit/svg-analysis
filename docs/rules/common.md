viewbox: 0, 0, 500, h(가변, 콘텐츠에 맞게 조정)
<svg width="100%" viewBox="0 0 500 H">

이렇게 설정한 이유: viewBox 너비 = iframe 컨테이너 너비 → 1:1 매칭이므로
iframe을 500 \* 500 사이즈로 설정하면 viewbox의 가로가 500으로 설정되어야 픽셀이 깨지지 않고 출력 가능.
