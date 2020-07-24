import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteCommentBtn = document.querySelectorAll(".commentDeleteBtn");

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
}

const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) -1;
}

const addComment = (comment) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const deleteButton = document.createElement("span")
    deleteButton.innerHTML = "<i class='fas fa-minus-circle'></i>";
    deleteButton.classList.add("video__comments-delete");
    deleteButton.classList.add("commentDeleteBtn");
    span.innerHTML = comment;
    li.appendChild(span);
    li.appendChild(deleteButton);

    deleteButton.addEventListener("click", handleDeleteComment)
    commentList.prepend(li);
}

const deleteComment = comment => {
    comment.parentNode.removeChild(comment);
  };

const sendComment = async comment => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
        url: `/api/${videoId}/comment`,
        method: "POST",
        data: {
            comment
        }
    });
    if (response.status == 200) {
        addComment(comment, response.data.commentid);
        increaseNumber();
    }
}

const handleSubmit = (event) => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
}

const handleDeleteComment = async event => {
    const videoId = window.location.href.split("/videos/")[1];
    const comment = event.target.parentNode.parentNode;
    const commentId = event.target.parentNode.dataset.commentid;
    comment.style.display = "none";
    decreaseNumber();

    const response = await axios({
        url: `/api/${videoId}/deleteComment`,
        method: "POST",
        data: {
          commentId
        }
      });
      if (response.status === 200) {
        deleteComment(comment);
      }
};

const init = () => {
    addCommentForm.addEventListener("submit", handleSubmit);
    Array.from(deleteCommentBtn).forEach(delBtn => {
        delBtn.addEventListener("click", handleDeleteComment);
    })
}

if (addCommentForm) {
    init();
}