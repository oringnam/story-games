/**
 * Save System
 * localStorage 기반 세이브/로드 시스템
 */

class SaveSystem {
    constructor(gameId) {
        this.gameId = gameId;
        this.storageKey = `story-game-${gameId}`;
        this.autoSaveKey = `${this.storageKey}-auto`;
    }

    /**
     * 게임 저장
     */
    save(slotName, data) {
        try {
            const saveData = {
                ...data,
                savedAt: Date.now(),
                slotName: slotName
            };

            localStorage.setItem(
                `${this.storageKey}-${slotName}`,
                JSON.stringify(saveData)
            );

            return true;
        } catch (error) {
            console.error('Save failed:', error);
            return false;
        }
    }

    /**
     * 게임 로드
     */
    load(slotName) {
        try {
            const data = localStorage.getItem(`${this.storageKey}-${slotName}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Load failed:', error);
            return null;
        }
    }

    /**
     * 자동 저장
     */
    autoSave(data) {
        return this.save('auto', data);
    }

    /**
     * 자동 저장 로드
     */
    loadAutoSave() {
        return this.load('auto');
    }

    /**
     * 저장 슬롯 목록
     */
    listSaves() {
        const saves = [];
        const prefix = `${this.storageKey}-`;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    const slotName = key.replace(prefix, '');
                    saves.push({
                        slotName,
                        savedAt: data.savedAt,
                        currentScene: data.currentScene
                    });
                } catch (error) {
                    console.error('Failed to parse save:', key, error);
                }
            }
        }

        // 최신순 정렬
        return saves.sort((a, b) => b.savedAt - a.savedAt);
    }

    /**
     * 저장 삭제
     */
    deleteSave(slotName) {
        try {
            localStorage.removeItem(`${this.storageKey}-${slotName}`);
            return true;
        } catch (error) {
            console.error('Delete failed:', error);
            return false;
        }
    }

    /**
     * 모든 저장 삭제
     */
    deleteAllSaves() {
        const prefix = `${this.storageKey}-`;
        const keysToDelete = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => localStorage.removeItem(key));
        return true;
    }

    /**
     * 저장 가능 여부 체크
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveSystem;
}
