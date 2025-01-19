import express from 'express';   // Import Express
import { OpenAI } from 'openai';  // Import OpenAI module
import 'dotenv/config';          // Load environment variables from .env

// Initialize Express app
const app = express();
const port = 3000; // You can change the port if needed

app.use(express.json());

// Initialize OpenAI client with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Use environment variable for the key
});

// Define a function to get completion from OpenAI
async function getCompletion(productTitle, userLocation, countryOfOrigin, productDimensions, ingredients, companyName) {
  try {
    // !!!!!! ONLY UNCOMMENT THIS FOR DEMO THIS PART COSTS MONEY !!!!!!!!

    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-4', 
    //   messages: [
    //     { role: 'developer', content: 'You are a helpful assistant.' },
    //     { role: 'user', content: `A user living in ${userLocation} is getting a product shipped from ${countryOfOrigin}. 
    //     It is a ${productTitle}. It has dimensions ${productDimensions}. It is made with the following materials: ${ingredients}.
    //     It is from the company ${companyName}. Use this information and for the following metrics, please give me a score between
    //     1-100 and a one sentence reason why you gave that score. 1. Shipping emissions 2. Material sustainability 3. Lifecycle and
    //     durability of product 4. The company's sustainability practices. Please give your response in a json format, where each object would have a score key and a reason key` },
    //   ],
    // });
    // return completion.choices[0].message.content; 

    // USE THIS FOR FRONTEND TESTING IT HAS SAME STATIC RESPONSE
    return "{\n    \"Shipping Emissions\": {\n        \"score\": 70,\n        \"reason\": \"Given that a light product is being transported from the USA to Canada which is not an excessive distance but still international, its relative shipping emissions are moderate.\"\n    },\n    \"Material Sustainability\": {\n        \"score\": 80,\n        \"reason\": \"According to the materials described, mostly of natural origins, the product has a high material sustainability score, although scoring is impacted slightly negatively by the use of gelatin, whose production can have environmental drawbacks.\"\n    },\n    \"Lifecycle and Durability of Product\": {\n        \"score\": 60,\n        \"reason\": \"Being a consumable product with a 45-day lifecycle, it's not particularly durable, which affects its lifecycle sustainability.\"\n    },\n    \"The Company's Sustainability Practices\": {\n        \"score\": 60,\n        \"reason\": \"Without specific information on OLLY's sustainability practices, it's difficult to assign a fully accurate score, but based on the natural ingredients generally used in their products, a moderate score is given.\"\n    }\n}"
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    return 'Error getting response from OpenAI';
  }
}

app.post('/get_score', async (req, res) => {
  const {productTitle, userLocation, countryOfOrigin, productDimensions, ingredients, companyName} = req.body; 

  const response = await getCompletion(productTitle, userLocation, countryOfOrigin, productDimensions, ingredients, companyName);  
  res.json(JSON.parse(response));
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
