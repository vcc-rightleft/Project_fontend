function myFunction() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    let errorpass = document.getElementById("errorpass");
    let erroremail = document.getElementById("erroremail");
    let errorconfirm = document.getElementById("errorconfirm");
    erroremail.innerHTML = "";
    errorpass.innerHTML = "";
    errorconfirm.innerHTML = "";
    let flag= true;
if (username === "") {
    erroremail.innerHTML = "Không được để trống!!!";
    erroremail.style.color = "red";
    flag=false;
    return;
    }
if (password === "") {
    errorpass.innerHTML = "Không được để trống!!!";
    errorpass.style.color = "red";
    flag=false;
    return;
}
    if (password.length < 6) {
        errorpass.innerHTML = "Mật khẩu phải có ít nhất 6 ký tự!!!"; 
        errorpass.style.color = "red";
        flag=false;
    return;
}
    if (username.indexOf("@") === -1 || username.indexOf(".com") === -1) {
        erroremail.innerHTML = "Email phải có @ và .com!!!"; 
        erroremail.style.color = "red";
        flag=false;
    return;
    }
    if (password !== confirmPassword) {
        errorconfirm.innerHTML = "Mật khẩu phải trùng khớp!!!";
        errorconfirm.style.color = "red";
        flag=false;
    return;
}
    let userExists = users.some((user) => user.username === username);
    if (userExists) {
        errorconfirm.innerHTML = "Tài khoản đã tồn tại!!!";
        errorconfirm.style.color = "red";
        flag=false;
    return;
}

    users.push({ id, username, password });
    localStorage.setItem("users", JSON.stringify(users));
    showSnackbar("Đăng ký thành công!", "#4CAF50"); 
    setTimeout(function () {
    window.location.href = "./login.html";
}, 1500);
}

function showSnackbar(message, color) {
    let x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = message;
    x.style.backgroundColor = color; 
}
