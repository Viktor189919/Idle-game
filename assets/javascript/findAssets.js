export function findNewAssets(data, initialRender) {
    
    if (initialRender) {
        const assets = data.filter(asset => asset.unlocked === true);
        return assets;

    } else {
        let nextAsset = data.find(asset => asset.unlocked === false);
        nextAsset = [nextAsset];
        return nextAsset;
    }
}


