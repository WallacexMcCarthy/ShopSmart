from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from ebay_scraper import EbayScraper
from amazon_scraper import AmazonScraper
from target_scraper import TargetScraper
from macys_scraper import MacysScraper

app = Flask(__name__)

# Enable CORS for the specified origin (your Netlify site)
CORS(app, resources={r"/ebay": {"origins": "https://shopssmart.netlify.app"}})
CORS(app, resources={r"/amazon": {"origins": "https://shopssmart.netlify.app"}})
CORS(app, resources={r"/target": {"origins": "https://shopssmart.netlify.app"}})
CORS(app, resources={r"/macys": {"origins": "https://shopssmart.netlify.app"}})

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# Serve other static files
@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)

@app.route("/ebay", methods=['GET', 'POST'])
def get_ebay_products():
    if request.method == 'POST':
        product = request.json['product']
        pages = request.json['pages']
        result = EbayScraper(str(product), int(pages)).scrape()
        
        scraping = {str(product): result}  
        
        print(scraping)
        return jsonify(scraping) 
    
    else:
        result = EbayScraper("microwave", 1).scrape()
        scraping = {"products": result}
        return jsonify(scraping)

@app.route("/amazon", methods=['GET', 'POST'])
def get_amazon_products():
    if request.method == 'POST':
        product = request.json['product']
        pages = request.json['pages']
        result = AmazonScraper(str(product), int(pages)).scrape()
        
        scraping = {str(product): result}  
        
        print(scraping)
        return jsonify(scraping) 
    
    else:
        result = AmazonScraper("microwave", 1).scrape()
        scraping = {"products": result}
        return jsonify(scraping)

@app.route("/target", methods=['GET', 'POST'])
def get_target_products():
    if request.method == 'POST':
        product = request.json['product']
        pages = request.json['pages']
        result = TargetScraper(str(product), int(pages)).scrape()
        
        scraping = {str(product): result}  
        
        print(scraping)
        return jsonify(scraping) 
    
    else:
        result = TargetScraper("microwave", 1).scrape()
        scraping = {"products": result}
        return jsonify(scraping)

@app.route("/macys", methods=['GET', 'POST'])
def get_macys_products():
    if request.method == 'POST':
        product = request.json['product']
        pages = request.json['pages']
        result = MacysScraper(str(product), int(pages)).scrape()
        
        scraping = {str(product): result}  
        
        print(scraping)
        return jsonify(scraping) 
    
    else:
        result = MacysScraper("microwave", 1).scrape()
        scraping = {"products": result}
        return jsonify(scraping)

if __name__ == "__main__":
    # Ensure your Flask app is accessible over the network
    app.run(host="0.0.0.0", port=5000, debug=True)
