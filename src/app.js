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
  outputSection.style.pointerEvents = "auto";
  outputSection.style.opacity = 0; // Start with opacity 0

  const confidencePercent = (result.confidence * 100).toFixed(2);
  const cuisinePrediction = `I am ${confidencePercent}% sure you are making ${result.label} food!`;

  // Fade out effect before updating content
  outputSection.style.transition = "opacity 0.5s ease-out";
  outputSection.style.opacity = 0;

  setTimeout(() => {
    // Update content and fade in
    outputSection.innerHTML = `
      <div class="cuisine">
        <h2>Predicted Cuisine:</h2>
        <p id="cuisinePrediction">${cuisinePrediction}</p>
      </div>
      <div class="pairings">
        <h2>Recommended Pairings:</h2>
        <ul id="recommendedPairings"></ul>
      </div>
    `;
    outputSection.style.opacity = 1; // Fade in
  }, 500); // Adjust timing as needed
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

  // Display the ingredients of the best matching recipe with animation
  setTimeout(() => {
    displayRecommendedIngredients(bestRecipe.ingredients);
  }, 500); // Wait for content to fade in
}

function displayRecommendedIngredients(bestRecipe) {
  const recommendationList = document.querySelector("#recommendedPairings");
  // Clear previous recommendations with fade out effect
  recommendationList.style.transition = "opacity 0.3s ease-out";
  recommendationList.style.opacity = 0;

  setTimeout(() => {
    // Update recommendations and fade in
    recommendationList.innerHTML = "";

    // Calculate number of items per column
    const itemsPerColumn = 10;
    const numColumns = Math.ceil(bestRecipe.length / itemsPerColumn);

    // Create columns
    for (let col = 0; col < numColumns; col++) {
      const column = document.createElement("div");
      column.className = "column";
      recommendationList.appendChild(column);

      // Populate each column with items
      for (let i = col * itemsPerColumn; i < (col + 1) * itemsPerColumn && i < bestRecipe.length; i++) {
        const li = document.createElement("li");
        li.textContent = bestRecipe[i];
        column.appendChild(li);
      }
    }

    recommendationList.style.opacity = 1; // Fade in
  }, 300); // Adjust timing as needed
}

function oneHotEncode(ingredients, allIngredients) {
  return allIngredients.map((ingredient) => (ingredients.includes(ingredient) ? 1 : 0));
}
