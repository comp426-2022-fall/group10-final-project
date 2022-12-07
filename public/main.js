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