// This code is a big questionmark. It is the first attempt to update the object in preparation of saving.
// My idea is that I update most of the data when the game saves to avoid a lot of constant updating.

export function updatePlayerObj(obj, gold, acc, pop) {
    obj.gold.qty = Math.floor(gold);
    obj.gold.accumulation = acc;
    console.log(pop)
    obj.workers.forEach(worker => {
        for (let popId in pop) {
            if (worker.id == popId) {
                console.log(`WorkerId: ${worker.id}, PopId: ${popId}`)
                worker.quantity = pop[popId];
                worker.currentCost = worker.initialCost * Math.floor(worker.costIncreaseInterval ** worker.quantity);
            }
        }
    })
    console.log(obj)
    return obj;
}