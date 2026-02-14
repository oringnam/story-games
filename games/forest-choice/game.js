/**
 * 숲의 선택 - Game Logic
 */

let engine;
let saveSystem;
let storyData;

// DOM Elements
const sceneText = document.getElementById('scene-text');
const choicesContainer = document.getElementById('choices-container');
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const restartButton = document.getElementById('restart-button');

/**
 * 게임 초기화
 */
async function initGame() {
    try {
        // Load story data
        const response = await fetch('story.json');
        storyData = await response.json();

        // Initialize systems
        saveSystem = new SaveSystem('forest-choice');
        engine = new StoryEngine(storyData, {
            startScene: 'start',
            onSceneChange: renderScene,
            onChoiceSelected: onChoiceSelected,
            onGameEnd: onGameEnd
        });

        // Auto-load if available
        const autoSave = saveSystem.loadAutoSave();
        if (autoSave && confirm('이전 진행 상황을 불러올까요?')) {
            engine.loadState(autoSave);
        } else {
            engine.goToScene('start');
        }

        // Setup controls
        setupControls();

    } catch (error) {
        console.error('Game initialization failed:', error);
        sceneText.textContent = '게임을 불러오는데 실패했습니다. 😢';
    }
}

/**
 * 씬 렌더링
 */
function renderScene(scene, sceneId) {
    // Clear container
    sceneText.textContent = '';
    choicesContainer.innerHTML = '';

    // Add fade-in animation
    const container = document.getElementById('scene-container');
    container.classList.remove('fade-in');
    void container.offsetWidth; // Force reflow
    container.classList.add('fade-in');

    // Render text
    sceneText.textContent = scene.text;

    // Render choices or ending
    if (scene.ending) {
        renderEnding(scene);
    } else {
        renderChoices(scene);
    }

    // Auto-save
    saveSystem.autoSave(engine.saveState());
}

/**
 * 선택지 렌더링
 */
function renderChoices(scene) {
    const choices = engine.getAvailableChoices();

    choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = choice.text;
        button.onclick = () => selectChoice(index);
        choicesContainer.appendChild(button);
    });
}

/**
 * 엔딩 렌더링
 */
function renderEnding(scene) {
    sceneText.innerHTML = `
        <div class="ending-screen">
            <div class="ending-title">${scene.endingTitle || '엔딩'}</div>
            <div class="ending-text">${scene.endingText || scene.text}</div>
        </div>
    `;

    // Restart button in choices area
    const restartBtn = document.createElement('button');
    restartBtn.className = 'choice-button';
    restartBtn.textContent = '🔄 다시 시작';
    restartBtn.onclick = restartGame;
    choicesContainer.appendChild(restartBtn);
}

/**
 * 선택지 선택
 */
function selectChoice(index) {
    // Visual feedback
    const buttons = choicesContainer.querySelectorAll('.choice-button');
    buttons[index].style.background = 'rgba(255, 255, 255, 0.3)';

    // Delay for visual feedback
    setTimeout(() => {
        engine.selectChoice(index);
    }, 200);
}

/**
 * 선택 콜백
 */
function onChoiceSelected(choice, index) {
    console.log('Choice selected:', choice.text);
}

/**
 * 게임 종료 콜백
 */
function onGameEnd(scene, sceneId) {
    console.log('Game ended:', scene.endingType);
}

/**
 * 컨트롤 설정
 */
function setupControls() {
    saveButton.onclick = saveGame;
    loadButton.onclick = loadGame;
    restartButton.onclick = confirmRestart;
}

/**
 * 게임 저장
 */
function saveGame() {
    const state = engine.saveState();
    const slotName = prompt('저장 이름을 입력하세요:', `세이브 ${new Date().toLocaleString()}`);
    
    if (slotName) {
        if (saveSystem.save(slotName, state)) {
            alert('저장되었습니다! 💾');
        } else {
            alert('저장 실패 😢');
        }
    }
}

/**
 * 게임 불러오기
 */
function loadGame() {
    const saves = saveSystem.listSaves();
    
    if (saves.length === 0) {
        alert('저장된 게임이 없습니다.');
        return;
    }

    // Simple load UI (first save)
    // TODO: Better load menu
    const save = saves[0];
    if (confirm(`"${save.slotName}"을(를) 불러올까요?`)) {
        const data = saveSystem.load(save.slotName);
        if (data) {
            engine.loadState(data);
            alert('불러오기 완료! 📂');
        }
    }
}

/**
 * 재시작 확인
 */
function confirmRestart() {
    if (confirm('정말 처음부터 다시 시작할까요?')) {
        restartGame();
    }
}

/**
 * 게임 재시작
 */
function restartGame() {
    engine.restart();
}

// Start game on load
window.addEventListener('DOMContentLoaded', initGame);
