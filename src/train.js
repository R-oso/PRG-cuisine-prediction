// Convert ingredients to a one-hot encoded format
function oneHotEncode(ingredients, allIngredients) {
  return allIngredients.map((ingredient) => (ingredients.includes(ingredient) ? 1 : 0));
}

async function trainModel() {
  try {
    const nn = ml5.neuralNetwork({ task: "classification", debug: true });
    const { trainDataSelected, allIngredients } = await extractAllIngredients(); // Extract all unique ingredients from training data

    console.log(`Extracted all ingredients`);

    // One hot encode the data and add it to the neural network
    trainDataSelected.forEach((recipe) => {
      const inputs = oneHotEncode(recipe.ingredients, allIngredients);
      const output = { cuisine: recipe.cuisine };
      nn.addData(inputs, output);
      console.log(`Adding data for recipes...`);
    });

    nn.normalizeData();
    console.log("Data normalized.");

    console.log("Training started...");

    const trainingOptions = {
      epochs: 19,
      batchSize: 7,
      validationSplit: 0.2,
      verbose: 1,
    };

    // Callback function for logging
    function onEpochEnd(epoch, logs) {
      console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
    }

    function onTrainingFinished() {
      console.log("Training completed.");

      console.log("Saving the model...");
      nn.save();
      console.log("Model trained and saved successfully.");

      console.log(`Final model:`, nn);
    }

    await nn.train(trainingOptions, onEpochEnd, onTrainingFinished);
  } catch (error) {
    console.error("Error during model training:", error);
  }
}

trainModel();
