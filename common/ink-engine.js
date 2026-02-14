/**
 * Ink.js 스토리 엔진 래퍼
 * Ink.js 라이브러리를 쉽게 사용하기 위한 헬퍼 클래스
 */

class StoryEngine {
    constructor(storyJson, saveManager) {
        this.story = new inkjs.Story(storyJson);
        this.saveManager = saveManager;
        this.listeners = {
            onTextUpdate: [],
            onChoicesUpdate: [],
            onEnd: []
        };
        
        // 옵저버 등록
        this.story.onError = (msg, type) => {
            console.error('Ink Error:', msg, type);
        };
    }

    /**
     * 스토리 진행 (한 단락)
     * @returns {string} 텍스트
     */
    continue() {
        if (!this.story.canContinue) return null;
        
        const text = this.story.Continue();
        this._notifyTextUpdate(text);
        
        // 자동 저장
        if (this.saveManager) {
            this.saveManager.autoSave(this.getSaveState());
        }
        
        return text;
    }

    /**
     * 스토리를 끝까지 진행
     * @returns {string[]} 모든 텍스트 배열
     */
    continueMaximally() {
        const texts = [];
        while (this.story.canContinue) {
            texts.push(this.story.Continue());
        }
        this._notifyTextUpdate(texts.join('\n\n'));
        return texts;
    }

    /**
     * 현재 선택지 가져오기
     * @returns {Array} 선택지 배열
     */
    getChoices() {
        const choices = this.story.currentChoices.map(choice => ({
            index: choice.index,
            text: choice.text
        }));
        
        this._notifyChoicesUpdate(choices);
        return choices;
    }

    /**
     * 선택지 선택
     * @param {number} index - 선택지 인덱스
     */
    choose(index) {
        if (index < 0 || index >= this.story.currentChoices.length) {
            console.error('Invalid choice index:', index);
            return;
        }
        
        this.story.ChooseChoiceIndex(index);
        
        // 선택 후 자동 진행
        return this.continue();
    }

    /**
     * 스토리 변수 가져오기
     * @param {string} name - 변수명
     */
    getVariable(name) {
        return this.story.variablesState[name];
    }

    /**
     * 스토리 변수 설정
     * @param {string} name - 변수명
     * @param {any} value - 값
     */
    setVariable(name, value) {
        this.story.variablesState[name] = value;
    }

    /**
     * 저장 상태 가져오기
     * @returns {string} JSON 문자열
     */
    getSaveState() {
        return this.story.state.ToJson();
    }

    /**
     * 저장 상태 불러오기
     * @param {string} saveJson - 저장된 JSON
     */
    loadSaveState(saveJson) {
        try {
            this.story.state.LoadJson(saveJson);
            return true;
        } catch (e) {
            console.error('Failed to load save:', e);
            return false;
        }
    }

    /**
     * 스토리 재시작
     */
    restart() {
        this.story.ResetState();
    }

    /**
     * 스토리 종료 여부
     */
    hasEnded() {
        return !this.story.canContinue && this.story.currentChoices.length === 0;
    }

    /**
     * 이벤트 리스너 등록
     */
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    // 내부 메서드
    _notifyTextUpdate(text) {
        this.listeners.onTextUpdate.forEach(cb => cb(text));
    }

    _notifyChoicesUpdate(choices) {
        this.listeners.onChoicesUpdate.forEach(cb => cb(choices));
        
        // 스토리 종료 감지
        if (this.hasEnded()) {
            this.listeners.onEnd.forEach(cb => cb());
        }
    }
}
