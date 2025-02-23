const addCategoryBtn = document.querySelector('[data-category="add-cat"]');
const closeModalBtn = document.querySelector('[data-name="close-modal"]');
const formModal = document.querySelector(".form-modal");
const form = document.querySelector("form");
const formInputs = document.querySelectorAll("input");

formInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    input.value = e.target.value;
  });
});

addCategoryBtn.addEventListener("click", (e) => {
  formModal.showModal();
});
closeModalBtn.addEventListener("click", (e) => {
  formModal.close();
});
const submitBtn = document.querySelector(".add-category");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(form);

  const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

  try {
    const response = await fetch("/create/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // set content type to JSON
      },
      body: jsonData,
    });

    const result = await response.json();

    if (result.errors) {
      displayErrors(result.errors);
    } else if (result.message) {
      alert(result.message);
      clearErrMsg();
      form.reset();
      window.location.href = result.redirect;
      formModal.close();
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
});

function displayErrors(errors) {
  const errorSpans = document.querySelectorAll(".err-msg");
  if (!errors) return;
  errors.forEach((error, index) => {
    errorSpans[index].textContent = error.msg;
  });
}
function clearErrMsg() {
  const errorSpans = document.querySelectorAll(".err-msg");
  if (!errorSpans) return;
  errorSpans.forEach((span) => {
    span.textContent = "";
  });
}
