/**
 * Story Engine
 * 스토리 분기 게임 핵심 엔진
 */

class StoryEngine {
    constructor(storyData, options = {}) {
        this.story = storyData;
        this.currentScene = options.startScene || 'start';
        this.history = []; // 선택 히스토리
        this.flags = {}; // 게임 플래그 (조건부 분기용)
        this.onSceneChange = options.onSceneChange || (() => {});
        this.onChoiceSelected = options.onChoiceSelected || (() => {});
        this.onGameEnd = options.onGameEnd || (() => {});
    }

    /**
     * 현재 씬 데이터 가져오기
     */
    getCurrentScene() {
        return this.story.scenes[this.currentScene];
    }

    /**
     * 특정 씬으로 이동
     */
    goToScene(sceneId) {
        if (!this.story.scenes[sceneId]) {
            console.error(`Scene not found: ${sceneId}`);
            return false;
        }

        this.currentScene = sceneId;
        const scene = this.getCurrentScene();
        
        this.onSceneChange(scene, sceneId);

        // 엔딩 체크
        if (scene.ending) {
            this.onGameEnd(scene, sceneId);
        }

        return true;
    }

    /**
     * 선택지 선택
     */
    selectChoice(choiceIndex) {
        const scene = this.getCurrentScene();
        const choice = scene.choices[choiceIndex];

        if (!choice) {
            console.error(`Invalid choice: ${choiceIndex}`);
            return false;
        }

        // 히스토리 저장
        this.history.push({
            scene: this.currentScene,
            choice: choiceIndex,
            choiceText: choice.text,
            timestamp: Date.now()
        });

        // 플래그 설정 (조건부 분기용)
        if (choice.setFlag) {
            Object.assign(this.flags, choice.setFlag);
        }

        // 콜백
        this.onChoiceSelected(choice, choiceIndex);

        // 다음 씬으로 이동
        const nextScene = this.getNextScene(choice);
        if (nextScene) {
            this.goToScene(nextScene);
        }

        return true;
    }

    /**
     * 다음 씬 결정 (조건부 분기 지원)
     */
    getNextScene(choice) {
        // 단순 분기
        if (typeof choice.next === 'string') {
            return choice.next;
        }

        // 조건부 분기
        if (Array.isArray(choice.next)) {
            for (const condition of choice.next) {
                if (this.checkCondition(condition.if)) {
                    return condition.scene;
                }
            }
        }

        return null;
    }

    /**
     * 조건 체크 (플래그 기반)
     */
    checkCondition(condition) {
        if (!condition) return true;

        for (const [key, value] of Object.entries(condition)) {
            if (this.flags[key] !== value) {
                return false;
            }
        }

        return true;
    }

    /**
     * 선택지 필터링 (조건부 선택지)
     */
    getAvailableChoices() {
        const scene = this.getCurrentScene();
        if (!scene.choices) return [];

        return scene.choices.filter(choice => {
            if (!choice.condition) return true;
            return this.checkCondition(choice.condition);
        });
    }

    /**
     * 게임 상태 저장 (직렬화)
     */
    saveState() {
        return {
            currentScene: this.currentScene,
            history: this.history,
            flags: this.flags,
            timestamp: Date.now()
        };
    }

    /**
     * 게임 상태 로드 (복원)
     */
    loadState(state) {
        this.currentScene = state.currentScene;
        this.history = state.history || [];
        this.flags = state.flags || {};
        this.goToScene(this.currentScene);
    }

    /**
     * 게임 재시작
     */
    restart() {
        this.currentScene = 'start';
        this.history = [];
        this.flags = {};
        this.goToScene(this.currentScene);
    }

    /**
     * 이전 선택으로 되돌리기
     */
    goBack() {
        if (this.history.length === 0) return false;

        const lastEntry = this.history.pop();
        this.goToScene(lastEntry.scene);
        return true;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoryEngine;
}
