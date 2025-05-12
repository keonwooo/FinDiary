/**
 * Chart.js 공통 차트 생성 함수
 *
 * @param {string} canvasId - 차트를 그릴 canvas 요소의 id
 * @param {string} chartType - 'bar', 'line', 'pie' 등 Chart.js 지원 차트 타입
 * @param {Array<string>} labels - x축 또는 범례 레이블
 * @param {Array<Object>} datasets - Chart.js 데이터셋 배열
 * @param {Object} options - Chart.js 옵션 (선택)
 */
function renderChart(canvasId, chartType, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // 기존 차트 제거 (중복 생성 방지)
    if (window[canvasId + 'Instance']) {
        window[canvasId + 'Instance'].destroy();
    }

    // 차트 생성
    window[canvasId + 'Instance'] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: options,
    });
}

function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = Math.floor((360 / count) * i); // 색상 원에서 골고루 분산
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
}