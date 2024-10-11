import requests
from bs4 import BeautifulSoup

class AmazonScraper:
    def __init__(self, product, pages_to_search):
        self.product = product.replace(" ", "+")
        self.pages_to_search = pages_to_search
        self.base_url = "https://www.amazon.com/s"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
        }

    def scrape(self):
        return_products = []
        
        for page in range(1, self.pages_to_search + 1):
            params = {
                "k": self.product,
                "page": page
            }
            response = requests.get(self.base_url, headers=self.headers, params=params)
            print(f"Fetching page {page}: Status Code: {response.status_code}")  # Check status code
            soup = BeautifulSoup(response.content, "html.parser")

            # Check the response content
            if response.status_code != 200:
                print("Failed to retrieve the page.")
                continue
            
            items = soup.find_all("div", {"data-component-type": "s-search-result"})
            if not items:
                print("No items found on the page.")
                break
            
            for product in items:
                product_details = {}
                title_element = product.find("span", class_="a-size-medium a-color-base a-text-normal")
                price_whole = product.find("span", class_="a-price-whole")
                price_fraction = product.find("span", class_="a-price-fraction")
                link = product.find("a", class_="a-link-normal s-no-outline")

                product_details['title'] = title_element.text if title_element else "N/A"
                product_details['price'] = f"${price_whole.text}.{price_fraction.text}" if price_whole and price_fraction else "N/A"
                product_details['link'] = f"https://www.amazon.com{link['href']}" if link else "N/A"

                return_products.append(product_details)

        return return_products

if __name__ == "__main__":
    scraper = AmazonScraper("laptop", 2)  # Search for "laptop" on 2 pages
    results = scraper.scrape()
    for product in results:
        print(product)
