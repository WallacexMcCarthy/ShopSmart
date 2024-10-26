import requests
from bs4 import BeautifulSoup

class AmazonScraper():
    current_page = 1
    product = ""
    proceed = True
    pages_to_search = 1
    id = 0

    def __init__(self, product, pages_to_search):
        self.product = product
        self.pages_to_search = pages_to_search
        # Amazon search URL format
        self.url = f"https://www.amazon.com/s?k={self.product}&page={self.current_page}"

    def scrape(self):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
        return_products = []      
        while self.proceed:
            page = requests.get(self.url, headers=headers)
            soup = BeautifulSoup(page.text, "html.parser")
            
            # Check if the results page is valid
            if soup.find("div", {"class": "s-main-slot"}):
                item_list = soup.find_all("div", {"data-component-type": "s-search-result"})
                
                for product in item_list:
                    product_details = {}
                    title_elem = product.find("span", class_="a-size-medium a-color-base a-text-normal")
                    price_elem = product.find("span", class_="a-price-whole")
                    link_elem = product.find("a", class_="a-link-normal s-no-outline")

                    if title_elem and price_elem and link_elem:
                        product_details['id'] = self.id
                        product_details['title'] = title_elem.text.strip()
                        product_details['price'] = price_elem.text.strip()
                        product_details['link'] = "https://www.amazon.com" + link_elem["href"]
                        return_products.append(product_details)
                        self.id += 1
            else:
                self.proceed = False

            if self.current_page >= self.pages_to_search:
                self.proceed = False
            else:
                self.current_page += 1
                self.url = f"https://www.amazon.com/s?k={self.product}&page={self.current_page}"

        return return_products
