export function initialAssets(data) {

    const assets = data
                    .filter(worker => worker.unlocked === true)
                    .map(worker => {
                        return `<div data-id="${worker.id}" class="worker-container ${worker.name}">
                                    <p id="${worker.name}-qty-id" class="worker-qty">0</p>
                                    <img class="svg-img" src=${worker.avatar} alt="peasant-img-svg">
                                    <h3 class="worker-name">${worker.name}</h3>
                                    <p class="worker-cost">${worker.initialCost} gold</p>
                                </div>`
                    })
                    .join("");

    return assets;
}

export function findNewAsset(data) {

    const nextAsset = data.find(worker => worker.unlocked === false);
    
    return nextAsset;
}


