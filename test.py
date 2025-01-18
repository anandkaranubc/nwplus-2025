from transformers import BertTokenizer, BertForSequenceClassification, pipeline

# Load the FinBERT-ESG model and tokenizer
finbert = BertForSequenceClassification.from_pretrained('yiyanghkust/finbert-esg', num_labels=4)
tokenizer = BertTokenizer.from_pretrained('yiyanghkust/finbert-esg')

# Create a pipeline for text classification
nlp = pipeline("text-classification", model=finbert, tokenizer=tokenizer)

# Input text for analysis
text = 'Rhonda has been volunteering for several years for a variety of charitable community programs.'

# Get the classification result
results = nlp(text)
print(results)
