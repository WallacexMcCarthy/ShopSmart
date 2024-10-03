from flask import jsonify
import json
from config import app
from ebay_scraper import EbayScraper


@app.route("/ebay")
def get_products():
    result = EbayScraper("microwave", 1).scrape()
    scraping = {"products": result}
    with open('./ebay_products.json', 'w') as data:
        json.dump(scraping, data, indent= 4)
    return jsonify(scraping)


if __name__ == "__main__":
    app.run(debug=True)