from flask import jsonify
import json
from config import app
from ebay_scraper import EbayScraper


@app.route("/ebay")
def get_products():
    result = EbayScraper("phone", 1).scrape()
    scraping = {"products": result}
    return jsonify(scraping)


if __name__ == "__main__":
    app.run(debug=True)