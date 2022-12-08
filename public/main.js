function refresh() {

    posts = Array.from(document.getElementsByClassName("post"));
    posts.forEach(element => {
        element.remove();
    });
    fetch('http://localhost:5000/app/allposts')
    .then(response => {
        return response.json();;
    }).then(data => {
        data.slice().reverse().forEach(element => {
            var temp = "User "+element.username+" Posted:	"+JSON.stringify(element.post)
            var text = document.createTextNode(temp);
            var element = document.createElement('div');
            element.classList.add("post")
            // element.style.fontSize = '20px'
            // element.style.margins = '14px 20px'
            // element.style.border = '1px solid black'
            // element.style.margin = '8px 0'
            // element.style.padding = '5px'
            element.appendChild(text);
            document.body.appendChild(element);
        });
    }).catch(err => {
        document.write(err);
    });
}

refresh();
var savedUsername;
var savedPassword;
function login() {
    tempUser = document.getElementById("user").value;
    tempPass = document.getElementById("pass").value;
    if (!tempUser || !tempPass) {
        alert("Please enter a username and password");
        return;
    }
    if(tempUser === "" || tempPass === "") {
        alert("Please enter a username and password");
        return;
    }
    let postStuff1 = {username:tempUser,password:tempPass};
    console.log(JSON.stringify(postStuff1));
    fetch('http://localhost:5000/app/login', {
        method: 'POST',
        body: JSON.stringify(postStuff1),
        headers: {
            'Content-Type': 'application/json',
        }
        
    }).then(response => {
        return response.text();
    }).then(response => {
        console.log(response);
        if (response.charAt(0) === 'T'){
            alert("No such User exists");
        } else {
            savedUsername = tempUser;
            savedPassword = tempPass;
            updateName();
            //console.log("User Logged In");
        } 
    }).catch(err => {
        console.log(err);
    });        
}

function post() {
    var resVal = document.getElementById("resVal")
    var postText = document.getElementById("post").value;
    let postStuff = {username: savedUsername, post: postText};
    fetch('http://localhost:5000/app/post/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(postStuff),
    }).then(response => {
        return response.text();
    }).then(response => {
        resVal.textContent = response;
        refresh();
    }).catch(err => {
        console.log(err);
    });   
}

function updateName(){
    var element = document.getElementById("userN");
    var element2 = document.getElementById("passW");

    if (element == undefined || element == null || element2 == undefined || element2 == null){
        element.innerHTML = "";
        element2.innerHTML = "";
        return;
    }

    element.innerHTML = "Username: " + savedUsername;
    element2.innerHTML = "Password: " + savedPassword;
}

function deleteUser(){
    if (savedUsername === undefined || savedUsername === null){
        alert("No user is logged in");
        return;
    }
    userInfo = {username: savedUsername, password: savedPassword};
    fetch('http://localhost:5000/app/user/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(userInfo),
    }).then(response => {
        return response.text();
    }).then(response => {
        savedPassword = undefined;
        savedUsername = undefined;
        updateName();
        refresh();
    }).catch(err => {
        console.log(err);
    });
}

function signup(){
    tempUser = document.getElementById("user").value;
    tempPass = document.getElementById("pass").value;
    if (!tempUser || !tempPass) {
        alert("Please enter a username and password");
        return;
    }
    if(tempUser === "" || tempPass === "") {
        alert("Please enter a username and password");
        return;
    }
    let postStuff = {username: tempUser, password: tempPass};
    fetch('http://localhost:5000/app/createuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(postStuff),
    }).then(response => {
        return response.text();
    }).then(response => {
        if (response.charAt(0) === 'T'){
            alert("Username already exists");
        }  else {
            savedUsername = tempUser;
            savedPassword = tempPass;
            updateName();
        } 
    }).catch(err => {
        console.log(err);
    });        
}

function logout(){
    if (!(savedUsername === undefined || savedUsername === null)){
        savedUsername = undefined;
        savedPassword = undefined;
        updateName();
        refresh();
    } else {
        alert("No user is logged in");
    }
}
