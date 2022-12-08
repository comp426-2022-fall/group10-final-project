var apiUrl = 'http://localhost:5000/app/allposts';

fetch(apiUrl).then(response => {
    return response.json();;
}).then(data => {
    data.forEach(element => {
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

var savedUsername;
var savedPassword;
function login() {
    tempUser = document.getElementById("user").value;
    tempPass = document.getElementById("pass").value;
    if (!tempUser || !tempPass) {
        alert("Please enter a username and password");
        return;
    }
    if(tempUser == "" || tempPass == "") {
        alert("Please enter a username and password");
        return;
    }
    let postStuff = {username: tempUser, password: tempPass};
    fetch('http://localhost:5000/app/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(postStuff),
    }).then(response => {
        return response.text();
    }).then(response => {
        if (response.charAt(0) == 'T'){
            alert("No such User exists");
        } else {
            savedUsername = tempUser;
            savedPassword = tempPass;
            console.log("User Logged In");
        } 
    }).catch(err => {
        console.log(err);
    });        
}
