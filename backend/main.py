from flask import jsonify
from config import app
from ebay_scraper import EbayScraper
from amazon_scraper import AmazonScraper


@app.route("/ebay")
def get_ebay_products():
    result = EbayScraper("microwave", 1).scrape()
    scraping = {"products": result}
    return jsonify(scraping)

@app.route("/amazon")
def get_amazon_products():
    result = AmazonScraper("microwave", 1).scrape()
    scraping = {"products": result}
    return jsonify(scraping)


if __name__ == "__main__":
    app.run(debug=True)