
import { getAuth, onAuthStateChanged, updatePassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const auth = getAuth();
const database = getDatabase();

onAuthStateChanged(auth, (user) => {
    if (user) {

        document.getElementById('user-email').textContent = user.email;
        

        const ticketsRef = ref(database, `tickets/${user.uid}`);
        onValue(ticketsRef, (snapshot) => {
            const tickets = snapshot.val();
            const ticketsList = document.getElementById('tickets-list');
            ticketsList.innerHTML = ''; // Limpar lista atual
            for (const ticketId in tickets) {
                const li = document.createElement('li');
                li.textContent = `Setor: ${tickets[ticketId].sector}, Quantidade: ${tickets[ticketId].quantity}`;
                ticketsList.appendChild(li);
            }
        });
    } else {
        window.location.href = 'signin.html'; 
    }
});


document.getElementById('change-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    updatePassword(auth.currentUser, newPassword).then(() => {
        alert('Senha alterada com sucesso!');
    }).catch((error) => {
        alert(error.message);
    });
});
