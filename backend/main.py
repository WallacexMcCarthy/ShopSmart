from flask import Flask, request, jsonify
from flask_cors import CORS
from ebay_scraper import EbayScraper

app = Flask(__name__)

CORS(app)

@app.route("/ebay", methods=['GET', 'POST'])
def get_ebay_products():
    if request.method == 'POST':
        product = request.json['product']
        pages = request.json['pages']
        result = EbayScraper(str(product), int(pages)).scrape()
        
        scraping = {str(product): result }  
        
        print(scraping)
        return jsonify(scraping) 
    
    else:
        result = EbayScraper("microwave", 1).scrape()
        scraping = {"products": result}
        return jsonify(scraping) 

if __name__ == "__main__":
    app.run(debug=True)
