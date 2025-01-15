import { getLocalStorage, setLocalStorage} from "./localStorage.js"
import { getWorkers } from "./api.js"
import { findNewAssets } from "./findAssets.js";
import { updatePlayerObj } from "./updateObject.js";

// import { activateBtns } from "./startBtns.js";


const gameContainer = document.getElementById("game-container-id");
const resourceValue = document.getElementById("resource-value-id");
const assetsContainer = document.getElementById("assets-container-id");
const initGameContainer = document.getElementById("init-container-id");

let workerData = await getWorkers();
let playerObj = getLocalStorage();

// Global variables
let goldCounter; 
let accumulation; 

// Call function with truthy or falsy data
activateBtns(Boolean(playerObj))

function activateBtns(both) {
    const newGameBtn = document.getElementById("new-game-btn-id");
    newGameBtn.classList.add("active");
    newGameBtn.addEventListener("click", (e) => {
        newGame(playerObj);
    });
    if (both) {
        const loadGameBtn = document.getElementById("load-game-btn-id")
        loadGameBtn.classList.add("active");
        loadGameBtn.addEventListener("click", (e) => {
            loadGame();
        });
    }   
}

function newGame() {

    playerObj = {
                    gold: {
                        qty: 0,
                        accumulation: 1,
                    },
                    workers: workerData
                }
    goldCounter = playerObj.gold.qty;
    accumulation = playerObj.gold.accumulation;
    const initialRender = true;
    renderWorkers(playerObj.workers, initialRender);

    const displayedWorkers = assetsContainer.querySelectorAll("div");
    displayedWorkers.forEach(worker => {
        worker.addEventListener("click", (e) => {
            console.log(worker)
            const workerCostEl = worker.getElementsByClassName("worker-cost")[0];
            const workerCost = parseInt(workerCostEl.innerHTML);
            switch (worker.dataset.id) {
                case "1001":
                    if (goldCounter >= workerCost) {
                        const workerQtyEl = worker.getElementsByClassName("worker-qty")[0];
                        addWorker(workerData[0], workerCostEl, workerCost, workerQtyEl);
                    }
                    break;
                case "1002":
                    if (goldCounter >= workerCost) {
                        addWorker(workerData[1], worker);
                    }
                    break;
                case "1003":
                    if (goldCounter >= workerCost) {
                        addWorker(workerData[2], worker);
                    }
                    break;
            }
        })
    })

    initGameContainer.classList.add("collapsed")
    mainCounter();
    saveLoop();

}

function renderWorkers(playerWorkers, initialRender) {

    const workers = findNewAssets(playerWorkers, initialRender);
    workers.forEach(worker => {

        const newWorker = document.createElement("div");
        newWorker.dataset.id = worker.id;
        newWorker.classList.add("worker-container", `${worker.name}`)
        
        const newWorkerQty = document.createElement("p");
        newWorkerQty.id = `${worker.name}-qty-id`;
        newWorkerQty.classList.add("worker-qty")
        newWorkerQty.innerHTML = 0;

        const newWorkerImg = document.createElement("img");
        newWorkerImg.classList.add("svg-img");
        newWorkerImg.src = worker.avatar;
        newWorkerImg.alt = `${worker.name}-img-svg`;

        const newWorkerName = document.createElement("h3");
        newWorkerName.classList.add("worker-name");
        newWorkerName.innerText = worker.name;

        const newWorkerCost = document.createElement("p");
        newWorkerCost.classList.add("worker-cost");
        newWorkerCost.innerHTML = `${worker.initialCost} gold`;

        newWorker.appendChild(newWorkerQty);
        newWorker.appendChild(newWorkerImg);
        newWorker.appendChild(newWorkerName);
        newWorker.appendChild(newWorkerCost);

        assetsContainer.appendChild(newWorker);

        newWorker.addEventListener("click", () => {
            const workerCostEl = newWorker.getElementsByClassName("worker-cost")[0];
            const workerCost = parseInt(workerCostEl.innerHTML);
            const workerQtyEl = newWorker.getElementsByClassName("worker-qty")[0];
            
            if (goldCounter >= workerCost) {
                addWorker(worker, workerCostEl, workerCost, workerQtyEl);
            }
        })
    })
}

function loadGame() {

    newAsset(workerData, playerObj.workersUnlocked);

    initGameContainer.classList.add("collapsed")
    mainCounter();
    saveLoop();
}

function mainCounter() {
    setInterval(() => { 
        resourceValue.innerHTML = Math.floor(goldCounter);
        goldCounter += accumulation/10;

        // Unlock new worker when gold exceeds certain limit
        if (goldCounter >= playerObj.workers[1].initialCost && playerObj.workers[1].unlocked === false) {
            renderWorkers(playerObj.workers)
            playerObj.workers[1].unlocked = true;
        } else if (goldCounter >= playerObj.workers[2].initialCost && playerObj.workers[2].unlocked === false) {
            renderWorkers(playerObj.workers)
            playerObj.workers[2].unlocked = true;
        }
    },100)
}

function saveLoop() {
    setInterval(() => {
        console.log("save game");
        const workerPop = getWorkerPop()
        playerObj = updatePlayerObj(playerObj, goldCounter, accumulation, workerPop);
        console.log(playerObj)
        setLocalStorage(playerObj);
        gameSavedMsg();
    }, 10000)
}

function gameSavedMsg() {
    const msg = document.createElement("p");
    msg.classList.add("game-saved-msg");
    msg.textContent = "Game saved";
    gameContainer.prepend(msg);
    setTimeout(() => {
        msg.remove();
    }, 5000)
}

function getWorkerPop() {
    const workers = assetsContainer.querySelectorAll("div");
    const workerPop = {};
    workers.forEach(worker => {
        const workerId = worker.dataset.id;
        const workerQty = parseInt(worker.querySelector(".worker-qty").innerHTML);
        workerPop[workerId] = workerQty;
    })
    return workerPop
}

function addWorker(workerData, workerCostEl, workerCost, workerQtyEl) {
    goldCounter -= workerCost;
    workerQtyEl.innerHTML = parseInt(workerQtyEl.innerHTML) + 1; 
    workerCostEl.innerHTML = `${Math.ceil(workerCost * workerData.costIncreaseInterval)} gold`;
    accumulation += workerData.accumulationGrowth;
}