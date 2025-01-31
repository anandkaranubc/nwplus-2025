from flask import Flask, request, jsonify
from transformers import BertTokenizer, BertForSequenceClassification, pipeline

# Initialize the Flask app
app = Flask(__name__)

# Load the FinBERT model and tokenizer
finbert = BertForSequenceClassification.from_pretrained('yiyanghkust/finbert-esg', num_labels=4)
tokenizer = BertTokenizer.from_pretrained('yiyanghkust/finbert-esg')
nlp = pipeline("text-classification", model=finbert, tokenizer=tokenizer)

# Define the GET endpoint
@app.route('/classify', methods=['GET'])
def classify_text():
    text = request.args.get('text')  # Get the 'text' query parameter from the request
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Run the model and get results
    results = nlp(text)
    
    # Return the results as JSON
    return jsonify({"results": results})

# Run the server
if __name__ == '__main__':
    app.run(debug=True)