/**
 * 세이브/로드 시스템
 * localStorage 기반 진행도 저장
 */

class SaveManager {
    constructor(gameId) {
        this.gameId = gameId;
        this.autoSaveKey = `story-save-${gameId}-auto`;
        this.manualSavePrefix = `story-save-${gameId}-slot`;
    }

    /**
     * 자동 저장
     * @param {string} stateJson - 스토리 상태 JSON
     */
    autoSave(stateJson) {
        try {
            const saveData = {
                state: stateJson,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem(this.autoSaveKey, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Auto-save failed:', e);
            return false;
        }
    }

    /**
     * 수동 저장 (슬롯)
     * @param {string} stateJson - 스토리 상태 JSON
     * @param {number} slot - 슬롯 번호 (1-3)
     * @param {string} name - 저장 이름
     */
    manualSave(stateJson, slot = 1, name = '') {
        try {
            const saveData = {
                state: stateJson,
                timestamp: Date.now(),
                name: name || `저장 ${slot}`,
                slot: slot,
                version: '1.0'
            };
            const key = `${this.manualSavePrefix}-${slot}`;
            localStorage.setItem(key, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Manual save failed:', e);
            return false;
        }
    }

    /**
     * 자동 저장 불러오기
     * @returns {string|null} 스토리 상태 JSON
     */
    loadAutoSave() {
        try {
            const saved = localStorage.getItem(this.autoSaveKey);
            if (!saved) return null;
            
            const saveData = JSON.parse(saved);
            return saveData.state;
        } catch (e) {
            console.error('Failed to load auto-save:', e);
            return null;
        }
    }

    /**
     * 수동 저장 불러오기
     * @param {number} slot - 슬롯 번호
     * @returns {string|null} 스토리 상태 JSON
     */
    loadManualSave(slot = 1) {
        try {
            const key = `${this.manualSavePrefix}-${slot}`;
            const saved = localStorage.getItem(key);
            if (!saved) return null;
            
            const saveData = JSON.parse(saved);
            return saveData.state;
        } catch (e) {
            console.error('Failed to load manual save:', e);
            return null;
        }
    }

    /**
     * 자동 저장 존재 여부
     */
    hasAutoSave() {
        return !!localStorage.getItem(this.autoSaveKey);
    }

    /**
     * 저장 정보 가져오기
     * @param {number} slot - 슬롯 번호 (null이면 자동 저장)
     */
    getSaveInfo(slot = null) {
        try {
            const key = slot === null 
                ? this.autoSaveKey 
                : `${this.manualSavePrefix}-${slot}`;
            
            const saved = localStorage.getItem(key);
            if (!saved) return null;
            
            const saveData = JSON.parse(saved);
            return {
                name: saveData.name || '자동 저장',
                timestamp: saveData.timestamp,
                date: new Date(saveData.timestamp).toLocaleString('ko-KR'),
                slot: saveData.slot
            };
        } catch (e) {
            return null;
        }
    }

    /**
     * 모든 저장 슬롯 정보 가져오기
     */
    getAllSaves() {
        const saves = [];
        
        // 자동 저장
        const autoSave = this.getSaveInfo(null);
        if (autoSave) {
            saves.push({ ...autoSave, type: 'auto' });
        }
        
        // 수동 저장 (1-3)
        for (let i = 1; i <= 3; i++) {
            const save = this.getSaveInfo(i);
            if (save) {
                saves.push({ ...save, type: 'manual' });
            }
        }
        
        return saves;
    }

    /**
     * 저장 삭제
     * @param {number} slot - 슬롯 번호 (null이면 자동 저장)
     */
    deleteSave(slot = null) {
        try {
            const key = slot === null 
                ? this.autoSaveKey 
                : `${this.manualSavePrefix}-${slot}`;
            
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Failed to delete save:', e);
            return false;
        }
    }

    /**
     * 모든 저장 삭제
     */
    deleteAllSaves() {
        this.deleteSave(null); // 자동 저장
        for (let i = 1; i <= 3; i++) {
            this.deleteSave(i);
        }
    }

    /**
     * 저장 용량 확인 (KB)
     */
    getSaveSize() {
        let total = 0;
        
        const checkSize = (key) => {
            const item = localStorage.getItem(key);
            if (item) {
                total += new Blob([item]).size / 1024; // KB
            }
        };
        
        checkSize(this.autoSaveKey);
        for (let i = 1; i <= 3; i++) {
            checkSize(`${this.manualSavePrefix}-${i}`);
        }
        
        return total.toFixed(2);
    }
}
