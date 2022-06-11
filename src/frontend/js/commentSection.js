const form = document.getElementById('commentFrom');
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const videoContainer = document.getElementById("videoContainer")
const commentLists = document.getElementById("commentList")

const handleDelete = async (event) =>{
    const {dataset:{id:videoId}} = videoContainer
    const list = event.target.parentElement.parentElement
    const {dataset:{id:commentId}} = list
    const response = await fetch(`/api/videos/${videoId}/comment/delete`,{
        method:"DELETE",
        headers:{
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({
            commentId,
            videoId
        })
    })
    if (response.status === 200){
        list.parentElement.removeChild(list);
    }
}

const makeEvents = () =>{
    for (i = 0; i < commentLists.children.length; i = i+ 1)
    {
        if (commentLists.children[i].lastChild)
            commentLists.children[i].lastChild.addEventListener("click",handleDelete)
    }
}

makeEvents();

const addComment = (text, id) =>{
    const videoComments = document.querySelector(".video__comments ul")
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement('i')
    icon.className = "fas fa-comment";
    const span = document.createElement("span")
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span")
    span2.className = "delete__comment"
    const icon2 = document.createElement('i')
    span2.addEventListener("click",handleDelete)
    icon2.className = "fas fa-ban";
    span2.appendChild(icon2)
    newComment.appendChild(icon);
    newComment.appendChild(span)
    newComment.appendChild(span2)

    videoComments.prepend(newComment);
}

const handleSubmit = async (event) =>{
    event.preventDefault();
    const {dataset:{id:videoId}} = videoContainer
    const text = textarea.value;
    if (text === "" || text.trim() === "")
        return;
   const response =  await fetch(`/api/videos/${videoId}/comment`,{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({text})
    })
    textarea.value = ""
    const responseData = await response.json()
    if (response.status === 201){
        console.log(responseData);
        addComment(text, responseData.newCommentId);
    }
}

form.addEventListener("submit",handleSubmit);