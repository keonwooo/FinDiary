/* animateCSS() 라는 함수 생성 */
const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
/* animateCSS 함수 사용 */
function ex_animateCSS() {
    animateCSS('.my-element', 'bounce'); // 선택자 와 애니메이션 명을 써주면 된다.

    animateCSS('.my-element', 'bounce')
        .then((message) => {
            // 콜백 실행도 가능하다.
        });
}

/* 잘못 입력했을 경우 빨간 테두리 shake
* ex) element : #test or .test or ...
* */
function wrongDivAnimation(element) {
    _$(element).attr("class", "c_validation_wrong");
    animateCSS(element, 'shakeX')
        .then(() => {
            _$(element).removeClass("c_validation_wrong");
        });
}

function toggleFadeDisplay(selector, duration = 300) {
    const el = document.querySelector(selector);
    if (!el) return;

    const isVisible = el.classList.contains('show');

    if (isVisible) {
        // 사라지게 하기 (fade-out)
        el.style.opacity = 0;
        setTimeout(() => {
            el.classList.remove('show');
            el.style.display = 'none';
        }, duration);
    } else {
        // 나타나게 하기 (fade-in)
        el.style.display = 'block';
        // 트리거를 위해 opacity 조절은 다음 프레임에
        requestAnimationFrame(() => {
            el.classList.add('show');
            el.style.opacity = 1;
        });
    }
}
