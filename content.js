function scrapeProductData() {
  const productName = document.querySelector('h1.product-title')?.innerText || 'N/A';
  const brandName = document.querySelector('.brand-name')?.innerText || 'N/A';
  const price = document.querySelector('.price')?.innerText || 'N/A';

  return {
    productName,
    brandName,
    price
  };
}

const productData = scrapeProductData();
console.log('Scraped Product Data:', productData);

// Send the data to your LLM endpoint
fetch('https://your-llm-endpoint.com/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
})
.then(response => response.json())
.then(data => console.log('LLM Response:', data))
.catch(error => console.error('Error:', error));