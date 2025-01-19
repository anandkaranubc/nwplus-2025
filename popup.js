document.getElementById('analyzeBtn').addEventListener('click', () => {
  console.log('Analyze button clicked');
  document.getElementById('loading').style.display = 'block';

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      console.log("No active tab found");
      return;
    }
    console.log("Active tab:", tabs[0]);

    // Inject content.js into the active tab
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js']
    }, () => {
      console.log("content.js injected");

      // Now execute scrapeProductData
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => scrapeProductData() // Run the function within the tab's context
      }, (injectedResults) => {
        if (chrome.runtime.lastError) {
          console.log("Error executing script:", chrome.runtime.lastError.message);
          return;
        }
        if (!injectedResults || injectedResults.length === 0) {
          console.log("No results returned from script");
          return;
        }

        const productData = injectedResults[0].result;
        console.log("Product data:", productData);

        // Send API request
        fetch('http://localhost:3000/get_score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        })
        .then(response => response.json())
        .then(data => {
          console.log("API response:", data);
          document.getElementById('loading').style.display = 'none';
          // document.getElementById('result').textContent = data;
          renderSustainabilityDashboard(data);
        })
        .catch(error => {
          console.log("API error:", error.message);
          document.getElementById('loading').style.display = 'none';
          document.getElementById('result').textContent = 'Error: ' + error.message;
        });
      });
    });
  });
});

function renderSustainabilityDashboard(data) {
  const result = document.getElementById('result');
  result.innerHTML = ''; // Clear previous content
  
  Object.entries(data).forEach(([category, { score, reason }]) => {
    const div = document.createElement('div');
    div.className = 'category';
    div.innerHTML = `
      <div class="header">
        <span class="category-name">${category}</span>
        <span class="score">${score}/100</span>
      </div>
      <div class="reason">${reason}</div>
    `;
    result.appendChild(div);
  });
}