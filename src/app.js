let mobilenet;
let nn;

// Event listener for Classify Ingredients button
document.getElementById("pairAndPredictBtn").addEventListener("click", classifyIngredients);

nn = ml5.neuralNetwork({ task: "classification", debug: true });
nn.load("../model/model.json", () => modelLoaded());

function modelLoaded(error, model) {
  if (!nn) {
    console.error("Failed to load model:");
    return;
  }

  console.log("Custom model loaded successfully.");
}

async function classifyIngredients() {
  const ingredientsInput = document.getElementById("foodInput").value.trim();

  if (ingredientsInput === "") {
    alert("Please enter at least one ingredient.");
    return;
  }

  try {
    const { trainDataSelected, allIngredients } = await extractAllIngredients();

    // Convert input ingredients to array
    const inputIngredients = ingredientsInput.split(",").map((item) => item.trim());

    // One hot encode inputs to ensure a working classification
    const inputVector = oneHotEncode(inputIngredients, allIngredients);

    // Making prediction
    console.log("Making prediction..");
    const pred = await nn.classify(inputVector);

    // Get the result with the highest confidence
    const topResult = getTopPrediction(pred);

    // Display prediction results
    displayResults(topResult);

    // Recommend ingredients based on predicted cuisine
    recommendIngredients(topResult.label, inputIngredients, trainDataSelected);
  } catch (error) {
    console.error("Error classifying with ingredients:", error);
  }
}

// Function to get the result with the highest confidence
function getTopPrediction(predictions) {
  return predictions.reduce((max, current) => (current.confidence > max.confidence ? current : max), predictions[0]);
}

function displayResults(result) {
  console.log(result);
  const outputSection = document.querySelector(".outputSection");
  outputSection.style.display = "block";

  const confidencePercent = (result.confidence * 100).toFixed(2);
  cuisinePrediction.innerHTML = `I am ${confidencePercent}% sure you are making ${result.label} food!`;
}

function recommendIngredients(predictedCuisine, userInputs, trainDataSelected) {
  // Find recipes matching the predicted cuisine from the training data
  const recipesForCuisine = trainDataSelected.filter((recipe) => recipe.cuisine === predictedCuisine);

  if (recipesForCuisine.length === 0) {
    console.warn(`No recipes found for cuisine '${predictedCuisine}' in training data.`);
    return;
  }

  // Track the recipe with the most matched ingredients
  let maxMatchedIngredients = 0;
  let bestRecipe = null;

  // Iterate through each recipe to find the one with the most matched ingredients
  recipesForCuisine.forEach((recipe) => {
    const matchedIngredients = recipe.ingredients.filter((ingredient) => userInputs.includes(ingredient));
    console.log(matchedIngredients);
    if (matchedIngredients.length > maxMatchedIngredients) {
      maxMatchedIngredients = matchedIngredients.length;
      bestRecipe = recipe;
    }
  });

  if (!bestRecipe) {
    alert(`No suitable recipe found for cuisine '${predictedCuisine}' and user inputs.`);
    console.warn(`No suitable recipe found for cuisine '${predictedCuisine}' and user inputs.`);
    return;
  }

  // Display the ingredients of the best matching recipe
  displayRecommendedIngredients(bestRecipe.ingredients);
}

function displayRecommendedIngredients(bestRecipe) {
  const recommendationList = document.querySelector("#recommendedPairings");
  // Clear previous recommendations
  recommendationList.innerHTML = "";

  // Iterate through the best recipe
  bestRecipe.forEach((ingredient) => {
    // Create a list item element
    const li = document.createElement("li");
    li.textContent = ingredient;

    // Append the list item to the recommendation list
    recommendationList.appendChild(li);
  });
}

function oneHotEncode(ingredients, allIngredients) {
  return allIngredients.map((ingredient) => (ingredients.includes(ingredient) ? 1 : 0));
}
