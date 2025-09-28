console.log("Клиентский скрипт загрузился!!!");

const form = document.querySelector("#main-form form");
const fieldset = document.querySelector("#main-form fieldset");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Обработчик события на отправку формы");

  hideError();
  hideSuccessMessage();

  const formData = new FormData(form);
  startFormSending();

  sendForm(formData);
});

function sendForm(formData) {
  console.log(formData.get("input-1"));

  fetch("/", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка сети или сервера: " + response.status);
      }

      return response.json();
    })
    .then((data) => {
      if (!data.success) {
        throw new Error("Неожиданный ответ от сервера");
      }

      showSuccessMessage();
    })
    .catch((error) => {
      showError();
    })
    .finally(() => {
      finishFormSending();
    });
}

function startFormSending() {
  fieldset.disabled = true;
}

function finishFormSending() {
  fieldset.disabled = false;
}

function showError() {
  const errorMessage = document.getElementById("error-message");

  errorMessage.style.display = "block";
}

function hideError() {
  const errorMessage = document.getElementById("error-message");

  errorMessage.style.display = null;
}

function showSuccessMessage() {
  const successMessage = document.getElementById("success-message");

  successMessage.style.display = "block";
}

function hideSuccessMessage() {
  const successMessage = document.getElementById("success-message");

  successMessage.style.display = null;
}
