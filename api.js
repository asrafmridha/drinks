const drinkContainer = document.getElementById("drinkContainer");
const selectedDrinks = document.getElementById("product_cart_row");
const drinkCount = document.getElementById("drinkCount");

let groupDrinks = [];

const loadDrinks = (searchText = "") => {
  let url;

  if (searchText === "") {
    url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita";
  } else {
    url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`;
  }

  fetch(url)
    .then((response) => response.json())

    .then((data) => {
      if (searchText === "") {
        const drinks = data.drinks ? data.drinks.slice(0, 10) : [];

        displayDrinks(drinks);
      } else {
        displayDrinks(data.drinks);
      }
    })

    .catch((error) => {
      console.log(error);

      drinkContainer.innerHTML = `
                <div class="col-12">
                    <h4 class="text-danger text-center">
                        Something went wrong!
                    </h4>
                </div>
            `;
    });
};

const displayDrinks = (drinks) => {
  drinkContainer.innerHTML = "";

  if (!drinks || drinks.length === 0) {
    drinkContainer.innerHTML = `
            <div class="col-12 text-center">

                <h3 class="text-danger">
                    Drink Not Found
                </h3>

            </div>
        `;

    return;
  }

  drinks.forEach((drink) => {
    console.log(drink);
    const div = document.createElement("div");

    div.classList.add("col-md-6", "mb-4");

    div.innerHTML = `

            <div class="card drink-card shadow-sm">

                <img
                    src="${drink.strDrinkThumb}"
                    class="card-img-top drink-img"
                    alt="${drink.strDrink}"
                >

                <div class="card-body">

                    <h5 class="card-title">
                        ${drink.strDrink}
                    </h5>


                    <h6 class="text-muted">
                        Category:
                        ${drink.strCategory || "Unknown"}
                    </h6>


                    <p class="card-text">

                        ${getInstructions(drink.strInstructions)}

                    </p>


                    <button
                        class="btn btn-primary btn-sm"
                        onclick="addToCart('${drink.idDrink}')"
                    >
                        Add to Cart
                    </button>


                    <button
                        class="btn btn-success btn-sm"
                        onclick="showDetails('${drink.idDrink}')"
                    >
                        Details
                    </button>

                </div>

            </div>

        `;

    drinkContainer.appendChild(div);
  });
};

const getInstructions = (instructions) => {
  if (!instructions) {
    return "No instructions";
  }
  return instructions.slice(0, 30);
};

const addToCart = (drinkId) => {
  if (groupDrinks.length >= 7) {
    alert("You can not add more than 7 drinks to a group.");

    return;
  }

  const alreadyAdded = groupDrinks.find((drink) => drink.idDrink === drinkId);

  if (alreadyAdded) {
    alert("This drink is already added.");

    return;
  }

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    .then((response) => response.json())

    .then((data) => {
      const drink = data.drinks[0];

      groupDrinks.push(drink);

      displayGroupDrinks();
    })

    .catch((error) => {
      console.log(error);
    });
};

const displayGroupDrinks = () => {
  selectedDrinks.innerHTML = "";

  drinkCount.innerText = groupDrinks.length;

  if (groupDrinks.length === 0) {
    selectedDrinks.innerHTML = `
            <p class="text-muted">
                No drink selected.
            </p>
        `;

    return;
  }

  groupDrinks.forEach((drink, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `

    <td>${index + 1}.</td>
    <td>   <img
                    src="${drink.strDrinkThumb}"
                    class="card-img-top drink-img-cart"
                    alt="${drink.strDrink}"
                ></td>
    <td>${drink.strDrink}</td>

           

<td>
                <button
                    class="btn btn-sm btn-danger"
                    onclick="removeFromGroup('${drink.idDrink}')"
                >
                    X
                </button>
                </td>



        `;

    selectedDrinks.appendChild(tr);
  });
};

const removeFromGroup = (drinkId) => {
  groupDrinks = groupDrinks.filter((drink) => drink.idDrink !== drinkId);

  displayGroupDrinks();
};

const showDetails = (drinkId) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    .then((response) => response.json())

    .then((data) => {
      const drink = data.drinks[0];

      document.getElementById("modalDrinkName").innerText = drink.strDrink;

      document.getElementById("modalBody").innerHTML = `

                <div class="row">

                    <div class="col-md-5">

                        <img
                            src="${drink.strDrinkThumb}"
                            class="img-fluid rounded"
                            alt="${drink.strDrink}"
                        >

                    </div>


                    <div class="col-md-7">

                        <h5>
                            ${drink.strDrink}
                        </h5>


                        <p>
                            <strong>Category:</strong>
                            ${drink.strCategory || "N/A"}
                        </p>


                        <p>
                            <strong>Glass:</strong>
                            ${drink.strGlass || "N/A"}
                        </p>


                        <p>
                            <strong>Alcoholic:</strong>
                            ${drink.strAlcoholic || "N/A"}
                        </p>


                        <p>
                            <strong>IBA:</strong>
                            ${drink.strIBA || "N/A"}
                        </p>


                        <p>
                            <strong>Instructions:</strong>
                            ${drink.strInstructions || "N/A"}
                        </p>

                    </div>

                </div>

            `;

      // Bootstrap Modal
      const modal = new bootstrap.Modal(document.getElementById("drinkModal"));

      modal.show();
    })

    .catch((error) => {
      console.log(error);
    });
};

document.getElementById("searchBtn").addEventListener("click", () => {
  const searchValue = document.getElementById("search").value.trim();

  if (searchValue === "") {
    loadDrinks();

    return;
  }

  loadDrinks(searchValue);
});

document.getElementById("search").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    document.getElementById("searchBtn").click();
  }
});

loadDrinks();
