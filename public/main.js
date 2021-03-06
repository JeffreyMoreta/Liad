var pin = document.getElementsByClassName("bxs-pin");
var trash = document.getElementsByClassName("fa-trash");

Array.from(pin).forEach(function (element) {
  element.addEventListener("click", function () {
    var name = document.querySelector(".userName").innerHTML;

    var title = this.parentNode.parentNode.parentNode
    .querySelector(".title").innerText;

    var year = this.parentNode.parentNode.parentNode
    .querySelector(".date").innerText;

    var poster = this.parentNode.parentNode.parentNode
    .querySelector(".poster").src;

    fetch("searches", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        title: title,
        year: year,
        poster: poster,
        pinned: true,
      }),
    })
      .then(function (response) {
        if (response.ok) return response.json();
      })
      .then(function (data) {
        console.log(data);
        window.location.reload(true);
      });
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener("click", function () {
    var name = this.parentNode.parentNode.childNodes[1].innerText;
    var search = this.parentNode.parentNode.childNodes[3].innerText;
    fetch("searches", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        search: search,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});