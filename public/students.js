document.addEventListener("DOMContentLoaded", function (event) {

    students = document.querySelector("ul.students");
    var link = document.createElement("a");	
    link.textContent = "Create Student";
    document.body.appendChild(link);
    link.setAttribute("href","/students/Create");
    link.addEventListener("click", function (event) {
        alert("CLICKED!");
      });

});