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


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db= firebase.firestore();


function ShowAlert(){
    $("#alert").show();
}

function HideAlert(){
    $("#alert").hide();
}

function CleanInput(){
    $("input[type='text'], input[type='password'], input[type='url'],input[type='mail']").val('');
}

function showLoader() {
    $("#cards-view").hide();
    $("#table-view").show();
    $("#loader").show();
}
function hideLoader(){
    $("#table-view").show();
    $("#loader").hide();
}

HideAlert();

function AddUser(){
    HideAlert();
    const username= $("#username").val();
    const social_link= $("#link").val();
    const mail= $("#mail").val();
    const password= $("#password").val();
    if (!username || !social_link || !mail || !password) {
        const errorAlert='Veuillez remplir tous les champs'
        $("#alert-msg").append(errorAlert);
        ShowAlert();
        //Swal.showValidationMessage(`Veuillez entrer le nom et la description`);
    }else{
        checkUsers(username, social_link, mail, password);
    }
    //return { title: title, description: description };
}

function checkUsers(username, social_link, mail, password){
    db.collection("users").where("mail", "==", mail).get().then((querySnapshot)=>{
        if(querySnapshot.empty){
            saveToFirestore(username, social_link, mail, password);
        }else{
            Swal.fire(
                'Email existant!',
                `${mail} est déjà associé à un compte !`,
                'error'
            );
        }
    })
}

function LogUser(){
    const email= $("#mail").val();
    const passwords= $("#password").val();
    db.collection("articles").where("mail","==", email).where("password", "==", passwords).get().then((querySnapshot) =>{
        
    });
}

function saveToFirestore(username, social_link, mail, password){
    db.collection("users").add({
        username: username,
        social_link: social_link,
        mail: mail,
        password: password,
    })
    .then ((docRef)=>{
        console.log("Document enregistrer", docRef.id);
        Swal.fire({
            icon: 'sucsess',
            title: 'Bienvenu',
            text: `Inscription réussie. Connectez vous à votre compte.`,
            confirmButtonText: 'Se connecter',
            preConfirm: () => {
                window.location.href="login.php";
            }
        });
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