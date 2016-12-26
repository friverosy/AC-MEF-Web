function logout(){
  console.log("Local Storage Clear... Redireccionando");
  localStorage.clear();
  //$window.location.href = '/login';
  location="/login"
};

function pasuser(form) {
        localStorage.setItem("email", form.email.value);
        localStorage.setItem("password", form.password.value);
        localStorage.setItem("verificador", false);
        location="/#/dashboard"
}
