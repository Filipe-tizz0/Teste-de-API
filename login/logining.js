import { mensagem_erro } from '/funcs/Messages.js';

document.getElementById("Form_login").addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Formulário submetido, mas o comportamento padrão foi prevenido.");

    const nome = document.getElementById("nome_login").value;
    const senha = document.getElementById("senha_login").value;

    console.log(`nome: ${nome}, senha: ${senha}`)
    if (!nome || !senha) {
        let message = "Todos os campos são obrigatórios"
        let color = "red";
        mensagem_erro(message, color);
        //alert("Todos os campos são obrigatórios");
    } else {
        await fetch(`http://localhost:3000/login/nome_senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: nome, senha: senha })
        })
            .then(response => response.json())
            .then(data => {

                let message = "";
                let color = "red";
                if (data.status_ == "Logado com sucesso") {
                    console.log("logado com sucesso");

                    let nome_session = data.username;
                    let user_id_session = data.user_id;

                    sessionStorage.setItem('user_logado', nome_session);
                    sessionStorage.setItem('user_id_logado', user_id_session);
                    window.location.href = 'loged.html';
                }
                if (data.status_ == "Dados incorretos") {
                    console.log("dados incorrtos");
                    message = "Login ou senha incorretos";

                    mensagem_erro(message, color);
                }
                if (data.status_ == "Não encontrado") {
                    console.log(`Usuário ${nome} não encontrado ou não cadastrado`);
                    message = "Usuário não encontrado ou não cadastrado";

                    mensagem_erro(message, color);
                }
                if (data.error == 'Erro ao comparar os dados') {
                    console.log("Problema na API");
                    message = "Problemas com a API";

                    mensagem_erro(message, color);
                }
            })
            .catch(error => {
                let message = `Não foi possível enviar - error: ${error}`;
                let color = "red";
                mensagem_erro(message, color);
                //alert(`Não foi possível enviar - error: ${error}`);
            });
    }
})