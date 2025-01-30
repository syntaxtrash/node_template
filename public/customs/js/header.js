$(document).ready(function() {
    $("#logout-link").on("click", handleLogout);
});

function handleLogout(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to logout?")) {
        window.location.href = "/logout";
    }
}