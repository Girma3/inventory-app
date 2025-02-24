const navHolder = document.querySelector(".nav-holder");
const main = document.querySelector("main");
//category modal form
const categoryModal = document.querySelector(".category-modal");
const updateCategoryModal = document.querySelector(".update-category-modal");
//item modal
const itemModal = document.querySelector(".item-modal");
const updateItemModal = document.querySelector(".update-item-modal");

//delete category modal msg
const categoryDelModal = document.querySelector(
  '[data-name="del-category-modal"]'
);

const form = document.querySelector("form");
const formInputs = document.querySelectorAll("input");

formInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    if (input.name !== "itemImage") {
      input.value = e.target.value;
    }
  });
});
function toggleDropdown(cell) {
  const dropdown = cell.querySelector("#moveDropdown");
  dropdown.classList.toggle("show");
  if (dropdown.classList.contains("show")) {
    const items = dropdown.getElementsByClassName("category-li");
    Array.from(items).forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.1}s`;
    });
  }
}
function updateItemForm(data) {
  const itemForm = document.querySelector("#update-item");
  const submitBtn = itemForm.querySelector(".update-item");
  submitBtn.dataset.item = data.item_id;
  itemForm.querySelector("#itemName").value = data.item_name;
  itemForm.querySelector("#itemDescription").value = data.item_description;
  itemForm.querySelector("#itemPrice").value = data.item_price;
}

navHolder.addEventListener("click", async (e) => {
  if (e.target.matches(".edit-category")) {
    categoryModal.showModal();
  } else if (e.target.matches(".add-item-btn")) {
    itemModal.showModal();
  } else if (e.target.matches(".del-category")) {
    categoryDelModal.showModal();
  }
});
main.addEventListener("click", async function (e) {
  if (e.target.matches(".close-category-modal")) {
    categoryModal.close();
  } else if (e.target.matches(".close-item-modal")) {
    itemModal.close();
  } else if (e.target.matches(".closeBtn")) {
    console.log("close btn");
    categoryFormUpdate.close();
    itemModal.close();
    categoryModal.close();
  } else if (e.target.matches(".cancel-del-category")) {
    categoryDelModal.close();
  } else if (e.target.matches(".close-category-msg")) {
    categoryDelModal.close();
  } else if (e.target.matches(".delete-category-btn")) {
    const categoryNum = e.target.dataset.category;
    const endPoint = `/delete/category/${categoryNum}`;
    try {
      const response = await fetch(endPoint, { method: "delete" });
      const result = await response.json();
      if (result.redirect) {
        window.location.href = result.redirect;
      }
    } catch (err) {
      console.log(err, "can't delete category");
    }
  }
});

const categoryFormUpdate = document.querySelector("#category-form");

if (categoryFormUpdate) {
  categoryFormUpdate.addEventListener("submit", async function (e) {
    e.preventDefault();
    const submitBtn = categoryFormUpdate.querySelector(".update-category");
    const categoryNum = submitBtn.dataset.category;
    const formData = new FormData(categoryFormUpdate);
    const formJson = JSON.stringify(Object.fromEntries(formData.entries()));

    const endPoint = `/category/update/${categoryNum}`;

    try {
      const response = await fetch(endPoint, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: formJson,
      });
      const result = await response.json();
      console.log(result);

      if (response.status === 400 && result.errors) {
        displayErrors(result.errors, "cat-err-msg");
      }

      if (result.redirect) {
        clearErrMsg();
        categoryFormUpdate.reset();
        categoryModal.close();

        window.location.href = `${result.redirect}`;
      }
    } catch (err) {
      console.log(err, "can't update category");
    }
  });
}
const updateItem = document.querySelector("#update-item");
if (updateItem) {
  updateItem.addEventListener("submit", async function (e) {
    e.preventDefault();
    const updateItemBtn = updateItem.querySelector(".update-item");
    const itemId = updateItemBtn.dataset.item;
    const formData = new FormData(updateItem);
    const endPoint = `/update/item/${itemId}`;

    try {
      const response = await fetch(endPoint, {
        method: "put",
        body: formData,
      });
      const result = await response.json();

      if (response.status === 400 && result.errors) {
        displayErrors(result.errors, "update-msg");
        return;
      }
      if (result.redirect) {
        clearErrMsg();
        updateItem.reset();
        itemModal.close();
        window.location.href = result.redirect;
      }
    } catch (err) {
      console.log(err, "can't update item");
    }
  });
}
const itemForm = document.querySelector("#add-item");
if (itemForm) {
  itemForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = itemForm.querySelector("#item-btn");
    const formData = new FormData(itemForm);
    const categoryNum =
      document.querySelector(".add-item-btn").dataset.category;

    try {
      const response = await fetch(`/item/new/${categoryNum}`, {
        method: "post",
        body: formData,
      });
      const result = await response.json();
      if (result.errors) {
        displayErrors(result.errors, "item-msg");
      } else {
        clearErrMsg();
        itemForm.reset();
        itemModal.close();
        alert(result.message);
        window.location.href = result.redirect;
      }
    } catch (err) {
      console.log(err);
    }
  });
}

//card event to edit and delete items
const cardHolder = document.querySelector(".items-holder");
cardHolder.addEventListener("click", async function (e) {
  if (e.target.matches(".edit-item")) {
    //show item form to update
    const itemNumber = e.target.dataset.item;
    const endPoint = `/item/json/${itemNumber}`;
    try {
      const response = await fetch(endPoint, { method: "get" });
      const result = await response.json();
      updateItemModal.showModal();
      updateItemForm(result);
    } catch (err) {
      console.log(err, "can't get item json");
    }
  } else if (e.target.matches(".delete-item")) {
    //event to delete item
    const itemNumber = e.target.dataset.item;
    const endPoint = `/delete/item/${itemNumber}`;
    try {
      const response = await fetch(endPoint, { method: "delete" });
      const result = await response.json();

      if (result.redirect) {
        window.location.href = result.redirect;
      }
    } catch (err) {
      console.log(err, "can't delete item");
    }
  } else if (e.target.matches(".move-btn")) {
    const cardNum = e.target.dataset.move;
    const card = document.querySelector(`[data-card='${cardNum}']`);
    if (card) {
      toggleDropdown(card);
    }
  }
});
//item event to move to another category
const moveUl = document.querySelector(".move-ul");

if (moveUl) {
  moveUl.addEventListener("click", async function (e) {
    if (e.target.matches(".category-li")) {
      const categoryId = e.target.dataset.category;
      const itemId = moveUl.dataset.item;
      const endPoint = `/move/item/${itemId}/?category=${categoryId}`;
      if (!categoryId || !itemId) {
        console.log("item id and category id not selected");
        return;
      }
      try {
        const response = await fetch(endPoint, { method: "put" });
        const result = await response.json();
        if (result.redirect) {
          window.location.href = result.redirect;
        }
      } catch (err) {
        console.log(err, "can't move this item");
      }
    }
  });
}

function displayErrors(errors, className) {
  const errorSpans = document.querySelectorAll(`.${className}`);
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
