export async function getWorkers() {
    
    try {
        
        const response = await fetch("assets/workerdata.json");
        const data = await response.json();

        return data;

    } catch(error) {
        
        console.error("Error: ", error);
    }
}