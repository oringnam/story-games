/**
 * 스토리 게임 UI 컴포넌트
 * 텍스트 출력, 선택지 렌더링, 타이핑 효과 등
 */

class StoryUI {
    constructor(textContainer, choicesContainer) {
        this.textContainer = textContainer;
        this.choicesContainer = choicesContainer;
        this.typewriterSpeed = 30; // ms per character
        this.isTyping = false;
        this.currentTypewriterAbort = null;
    }

    /**
     * 텍스트를 타이핑 효과와 함께 출력
     * @param {string} text - 출력할 텍스트
     * @param {boolean} instant - 즉시 출력 여부
     */
    async displayText(text, instant = false) {
        if (this.currentTypewriterAbort) {
            this.currentTypewriterAbort();
        }

        // HTML 태그 지원 (<i>, <b>, <center> 등)
        const formattedText = this._formatText(text);

        if (instant) {
            this._appendText(formattedText);
            return;
        }

        // 타이핑 효과
        await this._typewriterEffect(formattedText);
    }

    /**
     * 선택지 버튼 렌더링
     * @param {Array} choices - 선택지 배열
     * @param {Function} onChoose - 선택 콜백
     */
    renderChoices(choices, onChoose) {
        this.choicesContainer.innerHTML = '';
        
        if (choices.length === 0) return;

        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.dataset.index = index;
            
            button.addEventListener('click', () => {
                this._disableChoices();
                onChoose(index);
            });
            
            this.choicesContainer.appendChild(button);
        });

        // 애니메이션
        setTimeout(() => {
            this.choicesContainer.querySelectorAll('.choice-button').forEach((btn, i) => {
                setTimeout(() => {
                    btn.classList.add('visible');
                }, i * 100);
            });
        }, 50);
    }

    /**
     * 엔딩 화면 표시
     * @param {string} title - 엔딩 제목
     * @param {Object} stats - 통계 정보
     */
    showEndingModal(title, stats = {}) {
        const modal = document.createElement('div');
        modal.className = 'ending-modal';
        
        let statsHtml = '';
        if (Object.keys(stats).length > 0) {
            statsHtml = '<div class="stats">';
            for (const [key, value] of Object.entries(stats)) {
                statsHtml += `<div class="stat-item"><span>${key}:</span> <strong>${value}</strong></div>`;
            }
            statsHtml += '</div>';
        }

        modal.innerHTML = `
            <div class="modal-content">
                <h2>${title}</h2>
                ${statsHtml}
                <div class="modal-buttons">
                    <button onclick="location.reload()">다시 플레이</button>
                    <button onclick="location.href='../../index.html'">메인으로</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // 애니메이션
        setTimeout(() => modal.classList.add('visible'), 50);
    }

    /**
     * 텍스트 영역 초기화
     */
    clearText() {
        this.textContainer.innerHTML = '';
    }

    /**
     * 선택지 비활성화
     */
    _disableChoices() {
        this.choicesContainer.querySelectorAll('.choice-button').forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disabled');
        });
    }

    /**
     * 타이핑 효과
     */
    async _typewriterEffect(html) {
        return new Promise((resolve) => {
            this.isTyping = true;
            let aborted = false;
            
            this.currentTypewriterAbort = () => {
                aborted = true;
                this._appendText(html);
                resolve();
            };

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const text = tempDiv.textContent;

            const p = document.createElement('p');
            this.textContainer.appendChild(p);

            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (aborted) {
                    clearInterval(typeInterval);
                    return;
                }

                if (charIndex < text.length) {
                    p.textContent += text[charIndex];
                    charIndex++;
                    
                    // 자동 스크롤
                    this.textContainer.scrollTop = this.textContainer.scrollHeight;
                } else {
                    clearInterval(typeInterval);
                    this.isTyping = false;
                    this.currentTypewriterAbort = null;
                    
                    // HTML 태그 적용된 버전으로 교체
                    p.innerHTML = html;
                    resolve();
                }
            }, this.typewriterSpeed);
        });
    }

    /**
     * 텍스트 즉시 추가
     */
    _appendText(html) {
        const p = document.createElement('p');
        p.innerHTML = html;
        this.textContainer.appendChild(p);
        this.textContainer.scrollTop = this.textContainer.scrollHeight;
        this.isTyping = false;
    }

    /**
     * 텍스트 포맷팅 (Ink 특수 문법 지원)
     */
    _formatText(text) {
        // 이미 HTML 태그가 있으면 그대로 사용
        return text
            .replace(/\n/g, '<br>')
            .trim();
    }

    /**
     * 타이핑 속도 설정
     */
    setTypewriterSpeed(ms) {
        this.typewriterSpeed = ms;
    }

    /**
     * 스킵 기능 (타이핑 즉시 완료)
     */
    skipTypewriter() {
        if (this.currentTypewriterAbort) {
            this.currentTypewriterAbort();
        }
    }
}
