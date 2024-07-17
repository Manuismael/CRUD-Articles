const firebaseConfig = {
    apiKey: "AIzaSyC_yUZI5AMc2GlT4ZMJKjf3M1AwEr21-po",
    authDomain: "gestion-104a9.firebaseapp.com",
    projectId: "gestion-104a9",
    storageBucket: "gestion-104a9.appspot.com",
    messagingSenderId: "333021748821",
    appId: "1:333021748821:web:0769cc4d3a8c9933557edc",
    measurementId: "G-YLJ0WLZ4K1"
};

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore();


document.addEventListener("DOMContentLoaded", ()=>{
    loadData();
})

function showCards() {
    document.getElementById('cards-view').style.display = 'block';
    document.getElementById('table-view').style.display = 'none';
}

function showTable() {
    document.getElementById('cards-view').style.display = 'none';
    document.getElementById('table-view').style.display = 'block';
}
function showLoader() {
    document.getElementById('loader').style.display='block';
    document.getElementById('table-view').style.display = 'none';
    document.getElementById('cards-view').style.display = 'none';
}
function hideLoader(){
    document.getElementById('loader').style.display='none';
    document.getElementById('table-view').style.display = 'block';
    
}
function addItem() {
    Swal.fire({
        title: 'Ajouter un Article',
        html: `
                <input type="text" id="item-nom" class="swal2-input" placeholder="Nom">
                <input type="text" id="item-content" class="swal2-input" placeholder="Contenu">`,
        confirmButtonText: 'Ajouter',
        focusConfirm: false,
        preConfirm: () => {
            const title = Swal.getPopup().querySelector('#item-nom').value;
            const description = Swal.getPopup().querySelector('#item-content').value;
            if (!title || !description) {
                Swal.showValidationMessage(`Veuillez entrer le nom et la description`);
            }
            return { title: title, description: description };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { title, description } = result.value;
            saveToFirestore(title, description)
        }
    });
}

function addCard(id,title, description, timestamp) {
    const cardContainer = document.getElementById('cards-view');
    const newCard = document.createElement('div');
    newCard.className = 'col-sm-6';
    newCard.dataset.id=id;
    newCard.innerHTML = `<div class="p-3 ">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <p class="card-text">Date: ${timestamp}</p>
                    <div class=" " role="group" aria-label="Basic mixed styles example">
                    <button onclick="deleteItem('${id}')" type="button" class="btn btn-danger">Supprimer</button>
                    <button onclick="editItem('${id}')" type="button" class="btn btn-success">Modifier</button>
                </div>
                </div>
            </div>
        </div>`;
    cardContainer.appendChild(newCard);
}

function addTable(id, title, description, timestamp) {
    const tableBody = document.querySelector('#table-view tbody');
    const newRow = document.createElement('tr');
    newRow.dataset.id=id;
    newRow.innerHTML = `<td>${title}</td> <td>${description}</td> <td>${timestamp}</td>
                    <td><div class="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button onclick="deleteItem('${id}')" type="button" class="btn btn-outline-danger btn-sm mx-1"><span class="material-icons" >delete</span></button>
                    <button onclick="editItem('${id}')" type="button" class="btn btn-outline-secondary btn-sm mx-1"><span class="material-icons" >edit</span></button>
                </div></td>`;
    tableBody.appendChild(newRow);
}


function saveToFirestore(title, description) {
    db.collection("articles").add({
        title: title,
        description: description,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then ((docRef)=>{
        console.log("Document enregistrer", docRef.id);
    })
    .catch((error)=>{
        console.error("Error", error);
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: `Erreur lors de l'ajout de l'article : ${error.message}`
        });
    })
}

function loadData(){
    showLoader();
    db.collection("articles").get().then((querySnapshot) =>{
        querySnapshot.forEach((doc)=>{
            const data = doc.data();
            const id =doc.id
            const title= data.title;
            const description= data.description;
            const timestamp = data.timestamp ? data.timestamp.toDate().toLocaleString() : "";
            addCard(id, title, description, timestamp);
            addTable(id, title, description, timestamp);
            hideLoader();
        });
    }).catch((error)=>{
        console.error("Erreur", error);
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: `Verifier votre connexion internet : ${error.message}`
        });
    })
}

function editItem(id){
    const card=document.querySelector(`.col-sm-6[data-id='${id}']`);
    const row = document.querySelector(`tr[data-id='${id}']`)
    const title = card.querySelector('h5').innerText;
    const description = card.querySelector('p').innerText;

    Swal.fire({
        title: 'Modifier un Article',
        html: `<input type="text" id="item-title" class="swal2-input" value="${title}" placeholder="Titre">
               <input type="text" id="item-description" class="swal2-input" value="${description}" placeholder="Description">`,
        confirmButtonText: 'Modifier',
        focusConfirm: false,
        preConfirm: () => {
            const newTitle = Swal.getPopup().querySelector('#item-title').value;
            const newDescription = Swal.getPopup().querySelector('#item-description').value;
            if (!newTitle || !newDescription) {
                Swal.showValidationMessage(`Veuillez entrer le titre et la description`);
            }
            return { newTitle: newTitle, newDescription: newDescription };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { newTitle, newDescription } = result.value;
            updateFirestore(id, newTitle, newDescription);
            card.querySelector('h5').innerText = newTitle;
            card.querySelector('p').innerText = newDescription;
            row.children[1].innerText = newTitle;
            row.children[2].innerText = newDescription;
        }
    });
}

function deleteItem(id){
    Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
        if (result.isConfirmed) {
            db.collection("articles").doc(id).delete().then(() => {
                document.querySelector(`.col[data-id='${id}']`).remove();
                document.querySelector(`tr[data-id='${id}']`).remove();
                Swal.fire(
                    'Supprimé!',
                    'L\'article a été supprimé.',
                    'success'
                );
            }).catch((error) => {
                console.error("Error removing document: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: `Erreur lors de la suppression de l'article : ${error.message}`
                });
            });
        }
    });
}


function updateFirestore(id, title, description) {
    db.collection("articles").doc(id).update({
        title: title,
        description: description,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("Document successfully updated!");
    }).catch((error) => {
        console.error("Error updating document: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: `Erreur lors de la mise à jour de l'article : ${error.message}`
        });
    });
}