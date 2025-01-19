function scrapeProductData() {
  // Select all spans with the class 'a-text-bold'
  const boldElements = document.querySelectorAll('.a-text-bold');

  let countryOfOrigin = 'N/A';
  let productDimensions = 'N/A';  // Fixed typo: 'productDimentions' -> 'productDimensions'

  boldElements.forEach((boldElement) => {
    if (boldElement.innerText.includes('Country of origin')) {
      const valueElement = boldElement.nextElementSibling;
      if (valueElement) {
        countryOfOrigin = valueElement.innerText;
      }
    }
    if (boldElement.innerText.includes('Product Dimensions')) {
      const valueElement = boldElement.nextElementSibling;
      if (valueElement) {
        productDimensions = valueElement.innerText;
      }
    }
  });

  const ingredientsContainer = document.querySelector('#important-information .a-section.content > p:nth-child(3)');

  let ingredients = 'N/A';
  if (ingredientsContainer) {
    ingredients = ingredientsContainer.innerText.trim();
  }

  let companyName = 'N/A';
  const anchorElement = document.querySelector('#bylineInfo');
  if (anchorElement) {
    const fullText = anchorElement.textContent;
    companyName = fullText.replace("Visit the ", "").replace(" Store", "");
  }

  const productTitle = document.querySelector('#productTitle')?.innerText || 'N/A';
  const userLocation = 'Vancouver, BC, Canada';

  return {
    productTitle,
    userLocation,
    countryOfOrigin,
    productDimensions,
    ingredients,
    companyName,
  };
}

const productData = scrapeProductData();
console.log('Scraped Product Data:', productData);
