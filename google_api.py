from google import genai
from google.genai import types
import base64

def generate():
  client = genai.Client(
      vertexai=True,
      project="ivory-cycle-448301-q6",
      location="us-central1"
  )

  text1_1 = types.Part.from_text("""A user living in vancouver, BC, canada is getting a product shipped from USA. it is a OLLY Women's Multi Gummy Supplement with no artificial flavours and colours Blissful Berry multivitamin to help support women's health 45 day supply 90 gummies. it has dimensions 304.8 x 2 x 0.98 cm; 154.22 g. it is made with the following materials: Glucose Syrup, Beet Sugar, Water, Gelatin, Lactic Acid, Citric Acid, Pectin, Blackberry Flavour, Raspberry Flavour, Blueberry Flavour, Carrot Root Powder, Blueberry Powder, Anthocyanins, Maltodextrin. it is from the company OLLY. use this information and for the following metrics, please give me a score between 1-100 and a one sentence reason why you gave that score. 1. Shipping emissions 2. Material sustainability 3. lifecycle and durability of product 3. the Company's sustainability practices""")

  model = "gemini-2.0-flash-exp"
  contents = [
    types.Content(
      role="user",
      parts=[
        text1_1
      ]
    ),
  ]
  generate_content_config = types.GenerateContentConfig(
    temperature = 1,
    top_p = 0.95,
    max_output_tokens = 8192,
    response_modalities = ["TEXT"],
    safety_settings = [types.SafetySetting(
      category="HARM_CATEGORY_HATE_SPEECH",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_HARASSMENT",
      threshold="OFF"
    )],
  )

  for chunk in client.models.generate_content_stream(
    model = model,
    contents = contents,
    config = generate_content_config,
    ):
    print(chunk.text, end="")

generate()