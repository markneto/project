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

// Função para verificar a disponibilidade de ingressos em um setor específico
function checkTicketAvailability(sector) {
  const sectorRef = ref(database, `sectors/${sector}`);
  
  return get(sectorRef).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("Sector not found");
    }
  });
}

// Função para comprar ingressos em um setor específico
function buyTickets(sector, quantity) {
  const sectorRef = ref(database, `sectors/${sector}`);
  
  checkTicketAvailability(sector).then((data) => {
    if (quantity > data.availableTickets) {
      throw new Error("Not enough tickets available");
    }
    
    const updatedTicketsAvailable = data.availableTickets - quantity;
    
    // Armazenar dados necessários no localStorage
    localStorage.setItem('selectedSector', sector);
    localStorage.setItem('selectedQuantity', quantity);
    localStorage.setItem('ticketPrice', data.ticketPrice);
    
    // Atualizar o banco de dados
    return set(sectorRef, { ...data, availableTickets: updatedTicketsAvailable });
  }).then(() => {
    // Compra foi bem-sucedida, redirecionar para a página de compra
    window.location.href = 'purchase.html';
  }).catch((error) => {
    console.error(error);
    alert(error.message);
  });
}

// Configurar evento de clique do botão para iniciar a compra
document.addEventListener('DOMContentLoaded', () => {
  const findTicketsButton = document.getElementById('findTickets');
  findTicketsButton.addEventListener('click', () => {
    const sector = document.getElementById('sector').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    
    buyTickets(sector, quantity);
  });
});