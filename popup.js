document.getElementById('analyzeBtn').addEventListener('click', () => {
  console.log('Analyze button clicked');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const loadingDiv = document.getElementById('loading');
  const avgDiv = document.getElementById('avg');
  const resultDiv = document.getElementById('result');

  // Hide the button and avg/result sections
  analyzeBtn.style.display = 'none';
  avgDiv.style.display = 'none';
  resultDiv.style.display = 'none';

  // Show the loading GIF
  loadingDiv.style.display = 'block';

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let result = {};
    if (!tabs || tabs.length === 0) {
      console.log("No active tab found");
      loadingDiv.style.display = 'none';
      analyzeBtn.style.display = 'block'; // Show button back in case of error
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
          loadingDiv.style.display = 'none';
          analyzeBtn.style.display = 'block'; // Show button back in case of error
          return;
        }
        if (!injectedResults || injectedResults.length === 0) {
          console.log("No results returned from script");
          loadingDiv.style.display = 'none';
          analyzeBtn.style.display = 'block'; // Show button back in case of error
          return;
        }

        const productData = injectedResults[0].result;
        console.log("Product data:", productData);

        text = `A user living in ${productData.userLocation} is getting a product shipped from ${productData.countryOfOrigin}. It is a ${productData.productTitle}. It has dimensions ${productData.productDimensions}. It is made with the following materials: ${productData.ingredients}. It is from the company ${productData.companyName}. How sustainable is this action?`
        // fetch(
        //   `http://127.0.0.1:5000/classify?text=${encodeURIComponent(text)}`
        // )
        //   .then((response) => {
        //     console.log("Response received:", response);
        //     return response.json();
        //   })
        //   .then((data) => {
        //     console.log("Parsed JSON data:", data);
        //     const result_score = data.results[0];
        //     console.log("First result:", result);
        //     // document.getElementById("output").textContent = `Label: ${result.label
        //     //   }, Score: ${result.score.toFixed(4)}`;
        //   })
        //   .catch((err) => {
        //     console.error("Fetch error:", err);
        //     document.getElementById("output").textContent =
        //       "Error: " + err.message;
        //   });

        // // Send API request
        // fetch('http://localhost:3000/get_score', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(productData)
        // })
        //   .then(response => response.json())
        //   .then(data => {
        //     console.log("API response:", data);

        //     // Hide the loading GIF
        //     loadingDiv.style.display = 'none';

        //     // Show the avg and result sections
        //     avgDiv.style.display = 'block';
        //     resultDiv.style.display = 'block';

        //     // Render the data in the avg and result divs
        //     renderSustainabilityDashboard(data, result);
        //   })
        //   .catch(error => {
        //     console.log("API error:", error.message);
        //     loadingDiv.style.display = 'none';
        //     analyzeBtn.style.display = 'block'; // Show button back in case of error
        //     resultDiv.style.display = 'block';
        //     resultDiv.textContent = 'Error: ' + error.message;
        //   });
        fetch(
          `http://127.0.0.1:5000/classify?text=${encodeURIComponent(text)}`
        )
          .then((response) => {
            console.log("Response received:", response);
            return response.json();
          })
          .then((data) => {
            console.log("Parsed JSON data:", data);
            const result_score = data.results[0];
            console.log("First result:", result_score);
            // Pass result_score to the next fetch and render function
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
        
                // Hide the loading GIF
                loadingDiv.style.display = 'none';
        
                // Show the avg and result sections
                avgDiv.style.display = 'block';
                resultDiv.style.display = 'block';
        
                // Pass data and result_score to renderSustainabilityDashboard
                renderSustainabilityDashboard(data, result_score);
              })
              .catch(error => {
                console.log("API error:", error.message);
                loadingDiv.style.display = 'none';
                analyzeBtn.style.display = 'block'; // Show button back in case of error
                resultDiv.style.display = 'block';
                resultDiv.textContent = 'Error: ' + error.message;
              });
          })
          .catch((err) => {
            console.error("Fetch error:", err);
            document.getElementById("output").textContent =
              "Error: " + err.message;
          });
        
      });
    });
  });
});

function renderSustainabilityDashboard(data, result) {
  const avgDiv = document.getElementById('avg'); // Target the avg div
  const resultDiv = document.getElementById('result'); // Target the result div
  avgDiv.innerHTML = ''; // Clear previous content in avg div
  resultDiv.innerHTML = ''; // Clear previous content in result div

  let totalScore = result.score * 100;
  console.log(result.score);

  // Calculate the total score
  Object.entries(data).forEach(([_, { score }]) => {
    totalScore += score; // Accumulate scores
  });

  // Calculate the average score
  const averageScore = totalScore / 4;

  // Determine the color for the average score
  const avgColor = averageScore < 40 ? '#e53935' : averageScore < 70 ? '#FFB300' : '#4CAF50'; // Red, Yellow, Green

  // Create circular progress bar for the avg div
  const circularProgressDiv = document.createElement('div');
  circularProgressDiv.className = 'circular-progress';
  circularProgressDiv.style.setProperty('--progress', `${averageScore}%`);
  circularProgressDiv.style.setProperty('--progress-color', avgColor);

  const progressText = document.createElement('div');
  progressText.className = 'progress-text';
  progressText.innerHTML = `
    <span>${averageScore.toFixed(2)}%</span><br>
  `;

  circularProgressDiv.appendChild(progressText);
  avgDiv.appendChild(circularProgressDiv);

  // Determine the message based on the average score
  const avgMessage =
    averageScore < 40
      ? "This product is Silly 😩"
      : averageScore < 70
        ? "This product is kind of Silly 🫣"
        : "This product is not Silly 🙂‍↕️";

  // Create and append the message under the circular progress
  const messageDiv = document.createElement('div');
  messageDiv.className = 'avg-message';
  messageDiv.style.marginTop = '20px'; // Add spacing between the circle and the message
  messageDiv.style.textAlign = 'center'; // Center the message
  messageDiv.style.fontSize = '20px'; // Adjust the font size
  messageDiv.style.color = avgColor; // Use the same color as the progress bar
  messageDiv.textContent = avgMessage;

  avgDiv.appendChild(messageDiv);

  // Add individual category scores to the result div
  Object.entries(data).forEach(([category, { score, reason }]) => {
    // Determine the color for the category based on the score
    const categoryColor =
      score < 40 ? '#e53935' : score < 70 ? '#FFB300' : '#4CAF50'; // Red, Yellow, Green
    const backgroundColor =
      score < 40 ? '#ffebee' : score < 70 ? '#fff8e1' : '#e8f5e9'; // Lighter shades for background
    const scoreBackground =
      score < 40 ? '#ffcdd2' : score < 70 ? '#ffecb3' : '#a5d6a7'; // Lighter shades for score background

    const div = document.createElement('div');
    div.className = 'category';
    div.style.borderLeft = `5px solid ${categoryColor}`; // Apply dynamic border color
    div.style.backgroundColor = backgroundColor; // Apply dynamic background color

    div.innerHTML = `
      <div class="header">
        <span class="category-name" style="font-weight: bold; color: #333;">${category}</span>
        <span class="score" style="
          color: ${categoryColor}; 
          background: ${scoreBackground}; 
          font-weight: bold; 
          padding: 3px 6px; 
          border-radius: 4px;">
          ${score}%
        </span>
      </div>
      <div class="reason" style="color: #555;">${reason}</div>
    `;
    resultDiv.appendChild(div);
  });
}


