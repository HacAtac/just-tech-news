async function commentFormHandler(event) {
  // async function to handle comment form submission and prevent default form submission behaviour (which is to refresh the page) and to handle the response from the server (which is to update the comment list)
  event.preventDefault(); // Prevent the default form submission behavior of the browser.

  const comment_text = document
    .querySelector('textarea[name="comment-body"]') // get the comment text from the form field in the html file (comment-body)
    .value.trim(); // trim() removes whitespace from the beginning and end of a string (string.prototype.trim())

  const post_id = window.location.toString().split("/")[ // get post id from url path (e.g. /posts/1) and convert to int (e.g. 1)
    window.location.toString().split("/").length - 1 //get the last element of the array which is the post id number in this case it is the last element of the url
  ];

  if (comment_text) {
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        post_id,
        comment_text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      document.location.reload(); // reload the page to update the comment list
    } else {
      alert(response.statusText);
    }
  }
}

document // get the comment form from the html file (comment-form) and add an event listener to it (commentFormHandler) when the form is submitted (submit) the commentFormHandler function is called (commentFormHandler) and the event is passed to it (event) and the function is called with the event as the first argument (event) and the function is called with the event as the first argument (event)
  .querySelector(".comment-form")
  .addEventListener("submit", commentFormHandler);
