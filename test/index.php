<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="index.css" rel="stylesheet">
    <title>Gestion CRUD</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://www.gstatic.com/firebasejs/9.8.3/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore-compat.js"></script>
    <script defer src="index.js"></script>
    <script src="jquery-3.7.1.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand font-weight-bold" href="#">Espace Membre</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
            </div>
        </div>
    </nav>
    
    <div class="register-page m-5" id="register">
        <h1>Inscription</h1>

        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="username" placeholder="Username">
            <label for="floatingInput">Username</label>
        </div>

        <div class="form-floating mb-3">
            <input type="url" class="form-control" id="link" placeholder="Social link">
            <label for="floatingInput">Social link</label>
        </div>


        <div class="form-floating mb-3">
            <input type="email" class="form-control" id="mail" placeholder="name@example.com">
            <label for="floatingInput">Email address</label>
        </div>

        <div class="form-floating mb-3">
            <input type="password" class="form-control" id="password" placeholder="Password">
            <label for="floatingPassword">Password</label>
        </div>

        <div class="alert alert-danger" role="alert" id="alert">
            <p id="alert-msg"></p>
        </div>

        <button onclick="AddUser()" type="button" class="btn btn-success btn-lg">S'inscrire</button>
    </div>

</body>
</html>