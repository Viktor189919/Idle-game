export function getLocalStorage() {
    try {
        
        const savedData = localStorage.getItem("playerState");
        
        return savedData;

    } catch(error) {
        console.error("Get from local storage: ", error);
        return null;
    }
}

export function setLocalStorage(data) {
    
    try {
        localStorage.setItem("playerState", JSON.stringify(data));
    
    } catch(error) {
        console.error("Save to local storage: ", error)
    }
}