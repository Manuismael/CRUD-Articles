const firebaseConfig = {
    apiKey: "AIzaSyC_yUZI5AMc2GlT4ZMJKjf3M1AwEr21-po",
    authDomain: "gestion-104a9.firebaseapp.com",
    databaseURL: "https://gestion-104a9-default-rtdb.firebaseio.com",
    projectId: "gestion-104a9",
    storageBucket: "gestion-104a9.appspot.com",
    messagingSenderId: "333021748821",
    appId: "1:333021748821:web:141c320f71a46438557edc",
    measurementId: "G-YHNE34N676"
};

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore();


document.addEventListener("DOMContentLoaded", ()=>{
    loadData();
})
function showCards() {
    $("#cards-view").show();
    $("#table-view").hide();
}


function showTable() {
    $("#cards-view").hide();
    $("#table-view").show();
}

function hideAll() {
    $("#cards-view").hide();
    $("#table-view").hide();
}

function showLoader() {
    $("#cards-view").hide();
    $("#table-view").hide();
    $("#loader").show();
}
function hideLoader(){
    $("#table-view").show();
    $("#loader").hide();
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
            checkArticle(title, description);
        }
    });
}

function checkArticle(title, description){
    db.collection("articles").where("title", "==", title).get().then((querySnapshot)=>{
        if(querySnapshot.empty){
            saveToFirestore(title,description);
        }else{
            Swal.fire(
                'Article existant!',
                `${title} existe déjà !`,
                'error'
            );
        }
    })
}

// Fonction pour rechercher des articles par titre ou contenu et afficher les résultats
function searchArticles(query) {
    // Requêtes pour les articles où le titre ou la description correspond à la requête
    const titleQuery = db.collection("articles").where("title", "==", query).get();
    const contentQuery = db.collection("articles").where("description", "==", query).get();

    Promise.all([titleQuery, contentQuery])
        .then(([titleSnapshot, contentSnapshot]) => {
            const resultsDiv = $('tbody');
            const resultCard= $("#cards-view");
            //resultsDiv.html(''); // Clear previous results
            resultsDiv.html('');
            resultCard.html('');
            let articles = [];
            
            // Traiter les résultats de la requête par titre
            titleSnapshot.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                articles.push(data);
            });

            // Traiter les résultats de la requête par contenu
            contentSnapshot.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                articles.push(data);
            });

            // Supprimer les doublons
            const uniqueArticles = [...new Map(articles.map(item => [item.id, item])).values()];
            const numberOfArticles = uniqueArticles.length;
            //resultsDiv.html(`Nombre d'articles trouvés : ${numberOfArticles}<br><br>`);

            uniqueArticles.forEach((article) => {
                const { id, title, description, timestamp } = article;
                const formattedTimestamp = timestamp ? timestamp.toDate().toLocaleString() : "";
                //resultsDiv.append(`ID: ${id}<br>Titre: ${title}<br>Description: ${description}<br>Timestamp: ${formattedTimestamp}<br><br>`);
                const tableBody = document.querySelector('#table-view tbody');
                const newRow = document.createElement('tr');
                newRow.dataset.id=id;
                newRow.innerHTML = `<td>${title}</td> <td>${description}</td> <td>${formattedTimestamp}</td>
                                <td><div class="btn-group" role="group" aria-label="Basic mixed styles example">
                                <button onclick="deleteItem('${id}')" type="button" class="btn btn-outline-danger btn-sm mx-1"><span class="material-icons" >delete</span></button>
                                <button onclick="editItem('${id}')" type="button" class="btn btn-outline-secondary btn-sm mx-1"><span class="material-icons" >edit</span></button>
                            </div></td>`;
                tableBody.appendChild(newRow);

                const newCard= `<div class="di col-lg-3 col-md-4 col-sm-6 mb-4" data-id="${id}">
                <div class="card mx-2">
                    <div class="card-body p-2">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description}</p>
                        <p class="card-text">Date: ${formattedTimestamp}</p>
                        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                            <button onclick="deleteItem('${id}')" type="button" class="btn btn-danger mx-1">Supprimer</button>
                            <button onclick="editItem('${id}')" type="button" class="btn btn-success mx-1">Modifier</button>
                        </div>
                    </div>
                </div>`;
                $('#cards-view').append(newCard);
            });
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des articles :", error);
            // Afficher une alerte ou un message d'erreur en cas d'erreur de récupération
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: `Erreur lors de la récupération des articles : ${error.message}`
            });
        });
}

// Gestionnaire d'événement pour détecter la touche Entrée
$('#search').on('keyup', function(event) {
    if (event.key === 'Enter') {
        const query = $(this).val();
        console.log(`Entrée détectée, recherche pour : ${query}`); // Débogage
        searchArticles(query);
        //hideAll();
    }
});

function addCard(id,title, description, timestamp) {
    const newCard= `<div class="di col-lg-3 col-md-4 col-sm-6 mb-4" data-id="${id}">
    <div class="card mx-2">
        <div class="card-body p-2">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
            <p class="card-text">Date: ${timestamp}</p>
            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button onclick="deleteItem('${id}')" type="button" class="btn btn-danger mx-1">Supprimer</button>
                <button onclick="editItem('${id}')" type="button" class="btn btn-success mx-1">Modifier</button>
            </div>
        </div>
    </div>`;
    $('#cards-view').append(newCard);
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
        location.reload();
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
    //$('body').hide();
    showLoader();
    db.collection("articles").get().then((querySnapshot) =>{
        const count= querySnapshot.size;
        printArticleCount(count);
        querySnapshot.forEach((doc)=>{
            const data = doc.data();
            const id =doc.id
            const title= data.title;
            const description= data.description;
            const timestamp = data.timestamp ? data.timestamp.toDate().toLocaleString() : "";
            addCard(id, title, description, timestamp);
            addTable(id, title, description, timestamp);
            hideLoader();
            //$('body').show();
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

            db.collection("articles").where("title", "==", title).get().then((querySnapshot)=>{
                if(querySnapshot.empty){
                    updateFirestore(id, newTitle, newDescription);
                    card.querySelector('h5').innerText = newTitle;
                    card.querySelector('p').innerText = newDescription;
                    row.children[1].innerText = newTitle;
                    row.children[2].innerText = newDescription;
                }else{
                    Swal.fire(
                        'Article existant!',
                        `${title} existe déjà !`,
                        'error'
                    );
                }
            });
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
                document.querySelector(`.di[data-id='${id}']`).remove();
                document.querySelector(`tr[data-id='${id}']`).remove();
                Swal.fire(
                    'Supprimé!',
                    'L\'article a été supprimé.',
                    'success'
                );
                location.reload();
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
        Swal.fire(
            'Modifié!',
            'L\'article a été modifié.',
            'success'
        );
        location.reload();
    }).catch((error) => {
        console.error("Error updating document: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: `Erreur lors de la mise à jour de l'article : ${error.message}`
        });
    });
}

function printArticleCount(count){
    const number=`Total : ${count}`;
    $('#article-count').append(number);
}
