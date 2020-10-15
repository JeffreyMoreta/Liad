var pin = document.getElementsByClassName("bxs-pin");

Array.from(pin).forEach(function (element) {
  element.addEventListener("click", function () {
    var name = document.querySelector(".userName").innerHTML;

    var title = this.parentNode.parentNode.parentNode
    .querySelector(".title").innerText;

    var year = this.parentNode.parentNode.parentNode
    .querySelector(".date").innerText;

    var poster = this.parentNode.parentNode.parentNode
    .querySelector(".poster").src;

    fetch("pinned", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        year: year,
      }),
    })
      .then(function (data) {
        window.location.reload(true);
      });
  });
});
