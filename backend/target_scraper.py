import requests
from bs4 import BeautifulSoup

class TargetScraper:
    current_page = 1
    product = ""
    proceed = True
    pages_to_search = 1
    id = 0

    def __init__(self, product, pages_to_search):
        self.product = product
        self.pages_to_search = pages_to_search
        self.url = f"https://www.target.com/s?searchTerm={self.product}&page={self.current_page}"

    def scrape(self):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
        return_products = []

        while self.proceed:
            page = requests.get(self.url, headers=headers)
            soup = BeautifulSoup(page.content, "html.parser")
            
            if not soup.find_all("li", class_="Col-favj32-0"):
                self.proceed = False
            else:
                items = soup.find_all("li", class_="Col-favj32-0")
                
                for product in items:
                    product_details = {}
                    title_element = product.find("a", class_="Link__StyledLink-sc-4b9qcv-0")
                    price_element = product.find("span", {"data-test": "current-price"})
                    link = product.find("a", class_="Link__StyledLink-sc-4b9qcv-0")["href"]

                    product_details['id'] = self.id
                    product_details['title'] = title_element.text if title_element else "N/A"
                    product_details['price'] = price_element.text if price_element else "N/A"
                    product_details['link'] = f"https://www.target.com{link}"

                    return_products.append(product_details)
                    self.id += 1

            if self.current_page >= self.pages_to_search:
                self.proceed = False
            else:
                self.current_page += 1
                self.url = f"https://www.target.com/s?searchTerm={self.product}&page={self.current_page}"

        return return_products
