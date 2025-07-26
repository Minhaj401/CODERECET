# main.py
# A Flask server to generate educational flashcards using the Gemini API
# with a reliable fallback to a local database.

import os
import json
import random
import re
from flask import Flask, request, jsonify
from flask_cors import CORS

# Attempt to import the Google Generative AI library
try:
    from google import genai
except ImportError:
    print("Error: The 'google-generativeai' library is not installed.")
    print("Please install it using: pip install google-generativeai")
    exit()

# --- Configuration & Initialization ---

# Initialize Flask App
app = Flask(__name__)
# Configure CORS to allow credentials and restrict to the React app's origin
CORS(app,
     origins=["http://localhost:3000"],  # Your React app's origin
     supports_credentials=True,          # This is a key setting
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

# --- Gemini API Setup ---

# 🔐 IMPORTANT: Force the SDK to use the API key and not look for other credentials.
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "false"

# ⚠️ WARNING: Hardcoding API keys is not recommended for production.
# Load from environment variables or a secure vault instead.
API_KEY = "" # Replace with your actual Gemini API key

# Initialize the client using genai.Client
client = None
if "YOUR_API_KEY_HERE" in API_KEY:
    print("="*60)
    print("⚠️  WARNING: Please replace 'YOUR_API_KEY_HERE' with your actual")
    print("           Gemini API key in the script.")
    print("           The app will run in FALLBACK-ONLY mode.")
    print("="*60)
else:
    try:
        client = genai.Client(api_key=API_KEY)
    except Exception as e:
        print(f"Error initializing Gemini client: {e}. Running in FALLBACK-ONLY mode.")
        client = None


# --- Data Definitions ---

# Names for the learning modules, corresponding to the database keys
MODULE_NAMES = {
    1: "Cell: The Basic Unit of Life",
    2: "Human Digestive System",
    3: "Human Respiratory System",
    4: "Human Circulatory System",
    5: "Human Nervous System"
}

# Plan B: A local database of flashcards to be used if the Gemini API call fails.
FLASHCARD_FALLBACK_DATABASE = {
    # Module 1 – Cell: The Basic Unit of Life
    1: {
        "positive": [
            {"front": "Differentiate prokaryotic vs eukaryotic cells.", "back": "Prokaryotes lack nucleus, eukaryotes have it."},
            {"front": "What is the role of ribosomes?", "back": "Protein synthesis – ribosomes make proteins for the cell."},
            {"front": "Why are chloroplasts essential?", "back": "They make food for plants via photosynthesis."},
            {"front": "What makes stem cells unique?", "back": "They can transform into many different cell types."}
        ],
        "neutral": [
            {"front": "Why are cells called the structural unit of life?", "back": "Because they build the body and perform its functions."},
            {"front": "Which organelle is the powerhouse of the cell?", "back": "Mitochondria – they produce energy."},
            {"front": "Name 2 differences between plant and animal cells.", "back": "Plant cells have cell walls and chloroplasts."},
            {"front": "Give an example of a specialized cell.", "back": "Nerve cell or muscle cell."}
        ],
        "negative": [
            {"front": "What is the basic unit of life?", "back": "Cell."},
            {"front": "Which part is called the brain of the cell?", "back": "Nucleus."},
            {"front": "Which cells have a cell wall?", "back": "Plant cells."},
            {"front": "What do many cells together form?", "back": "Tissues."}
        ]
    },

    # Module 2 – Human Digestive System
    2: {
        "positive": [
            {"front": "What’s the difference between mechanical and chemical digestion?", "back": "Mechanical = physical breakdown, Chemical = enzyme action."},
            {"front": "What is the wave-like movement of the food pipe called?", "back": "Peristalsis."},
            {"front": "Why are villi important in the small intestine?", "back": "They absorb nutrients efficiently by increasing surface area."},
            {"front": "Which enzyme breaks down starch?", "back": "Amylase."}
        ],
        "neutral": [
            {"front": "Where does digestion start?", "back": "Mouth – with chewing and saliva."},
            {"front": "Which fluid in the mouth helps digest food?", "back": "Saliva."},
            {"front": "What is the function of bile?", "back": "It helps break down fats in digestion."},
            {"front": "What carries absorbed nutrients around the body?", "back": "Bloodstream."}
        ],
        "negative": [
            {"front": "What is the food pipe called?", "back": "Esophagus."},
            {"front": "Which organ churns food?", "back": "Stomach."},
            {"front": "Where are nutrients absorbed?", "back": "Small intestine."},
            {"front": "What is stored in the large intestine?", "back": "Waste material before removal."}
        ]
    },

    # Module 3 – Human Respiratory System
    3: {
        "positive": [
            {"front": "What energy molecule is made in respiration?", "back": "ATP (Adenosine Triphosphate)."},
            {"front": "What carries oxygen in the blood?", "back": "Hemoglobin in red blood cells."},
            {"front": "What triggers faster breathing?", "back": "Higher carbon dioxide (CO₂) in the blood."},
            {"front": "Name one way to keep lungs healthy.", "back": "Exercise regularly or avoid smoking."}
        ],
        "neutral": [
            {"front": "Name two parts of the respiratory system.", "back": "Nose and lungs."},
            {"front": "What muscle helps us breathe?", "back": "Diaphragm – it contracts and relaxes to move air."},
            {"front": "Where does gas exchange happen in the lungs?", "back": "In alveoli (tiny air sacs)."},
            {"front": "How is breathing different from respiration?", "back": "Breathing is moving air, respiration is energy release in cells."}
        ],
        "negative": [
            {"front": "What gas do we breathe in to live?", "back": "Oxygen."},
            {"front": "What is the windpipe called?", "back": "Trachea."},
            {"front": "What are the tiny sacs in lungs called?", "back": "Alveoli."},
            {"front": "What gas do we exhale?", "back": "Carbon dioxide."}
        ]
    },

    # Module 4 – Human Circulatory System
    4: {
        "positive": [
            {"front": "What is the difference between pulmonary and systemic circulation?", "back": "Pulmonary = lungs, Systemic = whole body."},
            {"front": "What is the role of heart valves?", "back": "Prevent backflow and keep blood flowing one way."},
            {"front": "Which vessels usually carry deoxygenated blood?", "back": "Veins (except the pulmonary vein)."},
            {"front": "Name one way to keep the circulatory system healthy.", "back": "Exercise regularly or eat healthy foods."}
        ],
        "neutral": [
            {"front": "Why is it called double circulation?", "back": "Blood moves through two loops – lungs and body."},
            {"front": "How many chambers does the heart have?", "back": "Four – two atria and two ventricles."},
            {"front": "What do we call the force of blood in vessels?", "back": "Blood pressure."},
            {"front": "What is the role of white blood cells?", "back": "Fight infections and protect the body."}
        ],
        "negative": [
            {"front": "What organ pumps blood in our body?", "back": "Heart."},
            {"front": "Which blood cells carry oxygen?", "back": "Red blood cells."},
            {"front": "Which blood vessels carry blood back to the heart?", "back": "Veins."},
            {"front": "What is this blood movement around the body called?", "back": "Circulation."}
        ]
    },

    # Module 5 – Human Nervous System
    5: {
        "positive": [
            {"front": "What is the tiny gap between neurons called?", "back": "Synapse – where neurons communicate."},
            {"front": "What part controls involuntary actions like heartbeat?", "back": "Autonomic nervous system."},
            {"front": "Which part of the brain controls balance?", "back": "Cerebellum."},
            {"front": "How fast can nerve messages travel?", "back": "Up to 300 km/h or more."}
        ],
        "neutral": [
            {"front": "What does the peripheral nervous system include?", "back": "All nerves outside the brain and spinal cord."},
            {"front": "What cell sends messages in the nervous system?", "back": "Neurons – specialized signal carriers."},
            {"front": "Which nerves send commands from the brain?", "back": "Motor nerves."},
            {"front": "Name one way to protect the nervous system.", "back": "Wear helmets or eat healthy food."}
        ],
        "negative": [
            {"front": "What does the nervous system control?", "back": "Movement, thoughts, and body reactions."},
            {"front": "Name the three main parts of the nervous system.", "back": "Brain, spinal cord, and nerves."},
            {"front": "What organ is the control center of the body?", "back": "Brain."},
            {"front": "What do we call quick, automatic actions?", "back": "Reflexes."}
        ]
    }
}


# --- Helper Functions ---

def get_sentiment_from_cookie(cookie_value):
    """Extract sentiment from the latestSentiment cookie value"""
    if not cookie_value:
        return "neutral"  # Default sentiment
    
    try:
        sentiment_data = json.loads(cookie_value)
        sentiment = sentiment_data.get('sentiment', 'neutral').lower()
    except (json.JSONDecodeError, TypeError, AttributeError):
        sentiment = str(cookie_value).lower()
    
    if any(word in sentiment for word in ['positive', 'happy', 'joy', 'excited', 'good', 'great']):
        return "positive"
    elif any(word in sentiment for word in ['negative', 'frustrated', 'angry', 'sad', 'bad', 'upset']):
        return "negative"
    else:
        return "neutral"

def clean_and_parse_json(text):
    """Cleans Gemini response by removing markdown and parses it as JSON."""
    match = re.search(r'```(json)?\s*([\s\S]*?)\s*```', text)
    json_str = match.group(2) if match else text
    try:
        return json.loads(json_str.strip())
    except json.JSONDecodeError:
        print(f"JSON Parsing Error. Original text was: {text}")
        return None


# --- API Endpoints ---

@app.route('/api/flashcards', methods=['GET'])
def get_flashcards():
    """Get flash cards based on module number and sentiment, trying Gemini first."""
    try:
        module_number = request.args.get('module', type=int)
        if not module_number or module_number not in MODULE_NAMES:
            return jsonify({'error': 'Invalid module number', 'available_modules': list(MODULE_NAMES.keys())}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Module ID must be an integer"}), 400

    latest_sentiment_cookie = request.cookies.get('latestSentiment')
    sentiment = get_sentiment_from_cookie(latest_sentiment_cookie)
    module_name = MODULE_NAMES.get(module_number)

    # --- Plan A: Attempt to generate flashcards using the Gemini API ---
    if client:
        try:
            prompt = (
    f"Generate exactly 5 flashcards for a student. "
    f"The topic is '{module_name}'. "
    f"The student's current emotional state is '{sentiment}', so adjust the difficulty and tone accordingly "
    f"(positive = more challenging, negative = simpler and more supportive, neutral = balanced). "
    f"Each flashcard must have a 'front' and 'back' key only. "
    f"The 'back' side should be no more than 3 sentences. "
    f"Return ONLY a valid JSON array of 5 objects with no extra text or formatting."
)
            
            # --- FIX: Use client.models.generate_content, compatible with older versions ---
            response = client.models.generate_content(
                model="models/gemini-1.5-flash", 
                contents=[prompt]
            )
            
            cards = clean_and_parse_json(response.text)
            
            if isinstance(cards, list) and len(cards) > 0 and all("front" in c and "back" in c for c in cards):
                print(f"Successfully generated {len(cards)} cards for '{module_name}' via Gemini.")
                return jsonify({
                    'source': 'gemini',
                    'module': module_number,
                    'sentiment': sentiment,
                    'cards': cards,
                    'total_cards': len(cards)
                })
            else:
                print("Gemini response was not in the expected format. Proceeding to fallback.")
        except Exception as e:
            print(f"An error occurred with the Gemini API: {e}. Proceeding to fallback.")

    # --- Plan B: Fallback to the local database if API fails or is disabled ---
    print(f"Using fallback database for module '{module_name}' with sentiment '{sentiment}'.")
    try:
        module_cards = FLASHCARD_FALLBACK_DATABASE.get(module_number, {})
        cards_for_sentiment = module_cards.get(sentiment, module_cards.get("neutral", []))
        
        num_cards = min(random.randint(3, 5), len(cards_for_sentiment))
        selected_cards = random.sample(cards_for_sentiment, num_cards) if cards_for_sentiment else []
        
        return jsonify({
            'source': 'fallback',
            'module': module_number,
            'sentiment': sentiment,
            'cards': selected_cards,
            'total_cards': len(selected_cards)
        })
    except Exception as e:
        return jsonify({'error': 'Internal server error in fallback', 'message': str(e)}), 500


@app.route('/api/modules', methods=['GET'])
def get_available_modules():
    """Get list of available modules."""
    return jsonify([{"id": k, "name": v} for k, v in MODULE_NAMES.items()])

@app.route('/api/sentiment-test', methods=['GET'])
def test_sentiment():
    """Test endpoint to see what sentiment is being detected from the cookie."""
    latest_sentiment = request.cookies.get('latestSentiment')
    detected_sentiment = get_sentiment_from_cookie(latest_sentiment)
    return jsonify({
        'raw_cookie': latest_sentiment,
        'detected_sentiment': detected_sentiment
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to confirm the server is running."""
    return jsonify({'status': 'healthy', 'message': 'Flash card server is running'})


# --- Run the Application ---
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5050)
