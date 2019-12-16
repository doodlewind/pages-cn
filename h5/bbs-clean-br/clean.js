window.onload = function() {
    var images = document.getElementsByTagName("img");
    for (var i = 0; i < images.length; i++) {
        images[i].style.display = "block";
    }

    var reKeepBr = /<br>(\s)+<br>/g;
    var reRemoveBr = /(\s)+<br>/g;
    var posts = document.getElementsByClassName("post_text");
    for (var i = 0; i < posts.length; i++) {
        posts[i].innerHTML = posts[i].innerHTML.replace(reKeepBr, '<div><br></div>').replace(reRemoveBr, '');
    }
};
