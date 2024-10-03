from flask import Flask, request, jsonify
from flask_cors import CORS
from ebay_scraper import EbayScraper
from amazon_scraper import AmazonScraper

app = Flask(__name__)

CORS(app)

@app.route("/ebay", methods=['GET', 'POST'])
def get_ebay_products():
    if request.method == 'POST':
        product = request.json['product']
        print(product)
        result = EbayScraper(str(product), 1).scrape()
        scraping = {"products": result}
        return jsonify(scraping)
    result = EbayScraper("microwave", 1).scrape()
    scraping = {"products": result}
    return jsonify(scraping) 


if __name__ == "__main__":
    app.run(debug = True)