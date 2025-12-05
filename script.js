function onPageLoaded() {
    // Write your javascript code here
    console.log("page loaded");
}

document.addEventListener("DOMContentLoaded", function () {
    // Listen for clicks on elements with the class 'play-button'
    document.querySelectorAll(".play-button").forEach(function (button) {
        button.addEventListener("click", function () {
            // When a play button is clicked, simulate a click on the <a> tag within the same .video-container
            this.parentNode.querySelector("a").click();
        });
    });
});

const boardE1 = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const btnReset = document.getElementById('reset');
const btnResetAll = document.getElementById('reset-all');
const turnEl = document.getElementById('turn');
const stateEl = document.getElementById('state');
let board, current, active;

const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

//三格成直線狀態
const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diags
];

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

function endGame({winner, line}){
    active = false;
    if(winner){
        stateEl.textContent = `${winner} 勝利！`;
        line.forEach(i=> cells[i].classList.add('win'));
        if(winner === 'X') scoreX++; else scoreO++;
    }else{
        stateEl.textContent = '平手';
        scoreDraw++;
    }
    updateScoreboard();
    cells.forEach(c=> c.disabled = true);
}

function updateScoreboard(){
    scoreXEl.textContent = scoreX;
    scoreOEl.textContent = scoreO;
    scoreDrawEl.textContent = scoreDraw;
}

btnReset.addEventListener('click', init);
btnResetAll.addEventListener('click', ()=>{
    scoreX = scoreO = scoreDraw = 0;
    updateScoreboard();
    init();
});

// 起始函式
function init(){
    board = Array(9).fill('');
    current = 'X';
    active = true;
    cells.forEach(c=>{
        c.textContent = '';
        c.className = 'cell';
        c.disabled = false;
    });
    turnEl.textContent = current;
    stateEl.textContent = '';
}

// 下手
function place(idx){
    if(!active || board[idx]) return;
    board[idx] = current;
    const cell = cells[idx];
    cell.textContent = current;
    cell.classList.add(current.toLowerCase());
    const result = evaluate();
    if(result.finished){
        endGame(result);
    }else{
        switchTurn();
    }
}

// 換手函式
function switchTurn(){
    current = current === 'X' ? 'O' : 'X';
    turnEl.textContent = current;
}

// 下手後計算是否成一線結束遊戲的函式
function evaluate(){
    for(const line of WIN_LINES){
        const [a,b,c] = line;
        if(board[a] && board[a]===board[b] && board[a]===board[c]){
            return { finished:true, winner:board[a], line };
        }
    }
    if(board.every(v=>v)) return { finished:true, winner:null };
    return { finished:false };
}



//
cells.forEach(cell=>{
    cell.addEventListener('click', ()=>{
        const idx = +cell.getAttribute('data-idx');
        place(idx);
    });
});

btnReset.addEventListener('click', init);

//
init();
