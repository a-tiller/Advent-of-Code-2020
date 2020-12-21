const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day21.input', 'utf8').split('\n').map(food => food.split(' (contains '));

function parseInput(foodList) {
  const ingredientToAllergens = new Map();
  const allergenToIngredients = new Map();
  const ingredientCounts = new Map();

  for (const [ingredientList, allergenList] of foodList) {
    const ingredients = ingredientList.split(' ');
    const allergens = allergenList.slice(0, -1).split(', ');

    for (const ingredient of ingredients) {
      if (!ingredientCounts.has(ingredient)) {
        ingredientCounts.set(ingredient, 1);
      } else {
        ingredientCounts.set(ingredient, ingredientCounts.get(ingredient) + 1);
      }

      if (!ingredientToAllergens.has(ingredient)) {
        ingredientToAllergens.set(ingredient, new Set());
      }
      for (const allergen of allergens) {
        ingredientToAllergens.get(ingredient).add(allergen);
      }
    }

    for (const allergen of allergens) {
      if (!allergenToIngredients.has(allergen)) {
        allergenToIngredients.set(allergen, new Set());
        for (const ingredient of ingredients) {
          allergenToIngredients.get(allergen).add(ingredient);
        }
      } else {
        for (const ingredient of allergenToIngredients.get(allergen)) {
          if (!ingredients.includes(ingredient)) {
            allergenToIngredients.get(allergen).delete(ingredient)
          }
        }
      }
    }
  }

  return { ingredientCounts, ingredientToAllergens, allergenToIngredients };
}

function possibleAllergenList(allergenToIngredients) {
  const possibleAllergenIngredients = new Set();

  for (const ingredientList of allergenToIngredients.values()) {
    for (const ingredient of ingredientList) {
      possibleAllergenIngredients.add(ingredient);
    }
  }

  return [...possibleAllergenIngredients]
}

function deduceAllegens(allergenToIngredients) {
  const workingCopy = new Map(allergenToIngredients);

  const allergenToIngredient = {};

  while (workingCopy.size) {
    workingCopy.forEach((ingredients, allergen) => {
      if (ingredients.size === 1) {
        const ingredient = [...ingredients][0];

        allergenToIngredient[allergen] = ingredient;
        workingCopy.forEach((innerIngredients, _) => {
          innerIngredients.delete(ingredient);
        });
      }

      if (ingredients.size === 0) workingCopy.delete(allergen);
    });
  }

  return allergenToIngredient;
}

function makeCanonicalList(allergenToIngredient) {
  return Object.entries(allergenToIngredient)
            .sort(([allergenA, ingredientA], [allergenB, ingredientB]) => (allergenA > allergenB ? 1 : -1))
            .map(([allergen, ingredient]) => (ingredient))
            .join(',');
}

const { ingredientCounts, ingredientToAllergens, allergenToIngredients } = parseInput(input);

let sum = [...ingredientCounts.values()].reduce((a, b) => (a + b));

for (const ingredient of possibleAllergenList(allergenToIngredients)) {
  sum -= ingredientCounts.get(ingredient);
}

console.log("Part 1: ", sum);
console.log("Part 2: ", makeCanonicalList(deduceAllegens(allergenToIngredients)));