console.log("Login Elmont carregado!");

const formLogin = document.getElementById("form-login");
const erroLogin = document.getElementById("erro-login");

if (formLogin) {

    formLogin.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        const email =
            document.getElementById("usuario").value.trim();

        const senha =
            document.getElementById("senha").value;

        erroLogin.textContent = "Entrando...";

        const {
            data,
            error
        } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha
        });

        if (error) {

            console.error(error);

            erroLogin.textContent =
                "E-mail ou senha incorretos.";

            return;
        }

        erroLogin.textContent = "";

        window.location.href = "painel.html";
    });

}