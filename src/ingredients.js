// Function to load and extract all unique ingredients from training data
async function extractAllIngredients() {
  try {
    // Load training data (adjust path as necessary)
    const trainResponse = await fetch("./data/train.json");
    console.log("Loading training data...");
    const trainData = await trainResponse.json();

    // Shuffle the training data
    // trainData.sort(() => Math.random() - 0.5);

    // Divide the data for a shorter array
    const splitIndex = Math.floor(trainData.length / 3);

    // Select only the first portion for training
    const trainDataSelected = trainData.slice(0, splitIndex);
    console.log("Training data loaded");

    // Extract all unique ingredients
    const allIngredients = new Set();
    trainDataSelected.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => allIngredients.add(ingredient));
    });

    // Convert Set to Array and return
    return {
      trainDataSelected,
      allIngredients: Array.from(allIngredients),
    };
  } catch (error) {
    console.error("Error loading and extracting allIngredients:", error);
    return { trainDataSelected: [], allIngredients: [] };
  }
}
