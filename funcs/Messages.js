export function mensagem_erro(message, color = "green", elementId = "div_login_incorreto") {
    let present_error = document.getElementById(elementId);
    present_error.innerHTML = "";

    let paragrafo_error = document.createElement('p');
    paragrafo_error.textContent = message;

    /*if (color == "red") {
        paragrafo_error.style.padding = "10px";
        paragrafo_error.style.backgroundColor = "rgb(236, 187, 187)";
        paragrafo_error.style.borderColor = "rgb(174, 0, 0)";
        paragrafo_error.style.borderWidth = "2px";
        paragrafo_error.style.borderRadius = "5px";
        paragrafo_error.style.textAlign = "center";
        paragrafo_error.style.borderStyle = "solid";
    } else {
        paragrafo_error.style.padding = "10px";
        paragrafo_error.style.backgroundColor = "rgb(203, 238, 193)";
        paragrafo_error.style.borderColor = "rgb(140, 181, 129)";
        paragrafo_error.style.borderWidth = "2px";
        paragrafo_error.style.borderRadius = "5px";
        paragrafo_error.style.textAlign = "center";
        paragrafo_error.style.borderStyle = "solid";
    }*/

    paragrafo_error.style.padding = "10px";
    paragrafo_error.style.backgroundColor = color === "red" ? "rgb(236, 187, 187)" : "rgb(203, 238, 193)";
    paragrafo_error.style.borderColor = color === "red" ? "rgb(174, 0, 0)" : "rgb(140, 181, 129)";
    paragrafo_error.style.borderWidth = "2px";
    paragrafo_error.style.borderRadius = "5px";
    paragrafo_error.style.textAlign = "center";
    paragrafo_error.style.borderStyle = "solid";

    const button_excluir_message = document.createElement('button');
    button_excluir_message.textContent = 'X';
    button_excluir_message.style.backgroundColor = 'transparent';
    button_excluir_message.style.border = 'none';
    button_excluir_message.style.marginLeft = '15px';
    button_excluir_message.style.cursor = 'pointer';

    paragrafo_error.appendChild(button_excluir_message);
    present_error.appendChild(paragrafo_error);

    button_excluir_message.addEventListener('click', function () {
        present_error.innerHTML = '';
    })
}