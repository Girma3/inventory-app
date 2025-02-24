const addCategoryBtn = document.querySelector('[data-category="add-cat"]');
const closeModalBtn = document.querySelector('[data-name="close-modal"]');
const formModal = document.querySelector(".form-modal");
const categoryForm = document.querySelector("#category-form");
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
const submitBtn = categoryForm.querySelector(".add-category");
if (submitBtn) {
  categoryForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(categoryForm);
    const formJson = JSON.stringify(Object.fromEntries(formData.entries()));

    try {
      const response = await fetch("/create/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formJson,
      });
      const result = await response.json();

      if (result.errors) {
        displayErrors(result.errors, "cat-err-msg");
      } else if (result.redirect) {
        alert(result.message);
        clearErrMsg();
        categoryForm.reset();
        formModal.close();
        window.location.href = result.redirect;
      }
    } catch (err) {
      console.error("An error occurred:", err);
    }
  });
}

//search input  event
const searchForm = document.querySelector("#search-form");
const searchInput = searchForm.querySelector("#searchInput");
 const errSpan = document.querySelector(".err-msg-search");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value;
  if (query.length < 3) {
   
    errSpan.textContent = "Search query must be at least 3 characters long.";
    return;
  }
errSpan.textContent = ""
  performSearch(query);
});

if (searchInput) {
  searchInput.addEventListener(
    "input",
    debounce(async (e) => {
      const query = e.target.value;
      if (query.length < 3) {
        const searchUl = document.querySelector(".search-ul");
        errSpan.textContent = ""
        if (searchUl.firstChild) {
          while (searchUl.firstChild) {
            searchUl.removeChild(searchUl.firstChild);
          }
        }
        return;
      }
      performSearch(query);
    }, 300)
  );
}

async function performSearch(query) {
  const searchUl = document.querySelector(".search-ul");
  searchUl.innerHTML = ""; // Clear previous results

  try {
    const result = await search(query);
    if (result.categories) {
      const p = document.createElement("p");
      p.textContent = "Categories";
      searchUl.appendChild(p);
      result.categories.forEach((category) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        li.setAttribute("class", "search-li");
        link.setAttribute("href", `/category/${category.category_id}`);
        link.textContent = `${category.category_name}`;
        li.appendChild(link);
        searchUl.appendChild(li);
      });
    }
    if (result.items) {
      const p = document.createElement("p");
      p.textContent = "Items";
      searchUl.appendChild(p);
      result.items.forEach((item) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        li.setAttribute("class", "search-li");
        link.setAttribute("href", `/category/${item.item_category_id}`);
        link.textContent = `${item.item_name}`;
        li.appendChild(link);
        searchUl.appendChild(li);
      });
    }
    if (result.message) {
      const p = document.createElement("p");
      p.textContent = `${result.message}`;
      searchUl.appendChild(p);
    }
  } catch (err) {
    console.error("Error while searching:", err);
  }
}

async function search(value) {
  const endPoint = `/search/${value}`;
  try {
    const response = await fetch(endPoint, { method: "GET" });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error("Error while searching:", err);
    return [];
  }
}

function debounce(func, delay) {
  let debounceTimer;
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}
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
