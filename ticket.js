// Inicialização do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js"

const firebaseConfig = {
    apiKey: "AIzaSyC2F1tg40ur_PrwxWVtVLqhwhMrfX0aLsY",
    authDomain: "hi-life-arena.firebaseapp.com",
    projectId: "hi-life-arena",
    storageBucket: "hi-life-arena.appspot.com",
    messagingSenderId: "454395537519",
    appId: "1:454395537519:web:9e3d84168acd40d1b0859a",
    measurementId: "G-872E1E12S8",
    databaseURL: "https://hi-life-arena-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to check ticket availability in a specific sector
function checkTicketAvailability(sector) {
    const sectorRef = ref(database, `sectors/${sector}`);

    // Query the database to get the number of available tickets in the sector
    return new Promise((resolve, reject) => {
        get(sectorRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const ticketsAvailable = data.availableTickets; // Assuming `data` is an object with this structure
                resolve(ticketsAvailable);
            } else {
                reject(new Error("Sector not found"));
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

// Function to purchase tickets in a specific sector
function buyTickets(sector, quantity) {
    const sectorRef = ref(database, `sectors/${sector}`);

    // Check the availability of tickets in the sector
    checkTicketAvailability(sector).then((ticketsAvailable) => {
        // Check if there are enough available tickets
        if (quantity > ticketsAvailable) {
            throw new Error("Not enough tickets available");
        }

        // Update the number of available tickets in the sector after the purchase
        return get(sectorRef); // First, get the current data
    }).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const updatedTicketsAvailable = data.availableTickets - quantity;

            // Then, set the updated number of tickets
            return set(sectorRef, { ...data, availableTickets: updatedTicketsAvailable });
        } else {
            throw new Error("Sector not found");
        }
    }).then(() => {
        // The purchase was successful
        console.log(`The purchase of ${quantity} tickets for the sector ${sector} was successful`);
    
 // Store the selected sector in localStorage
 localStorage.setItem('selectedSector', sector);
 
        // Redirect the user to the purchase page
        window.location.href = 'purchase.html';
    }).catch((error) => {
        // Handle errors during the purchase process
        console.error("Failed to purchase tickets:", error.message);
        // Show an error message to the user
        alert(error.message);
    });
}


// Export the necessary functions for use in other files
export { checkTicketAvailability, buyTickets };

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('findTickets').addEventListener('click', function() {
        const sector = document.getElementById('sector').value;
        const quantity = parseInt(document.getElementById('quantity').value, 10);
        buyTickets(sector, quantity);
    });
});