import requests
from bs4 import BeautifulSoup

class MacysScraper():
    current_page = 1
    product = ""
    proceed = True
    pages_to_search = 1
    id = 0

    def __init__(self, product, pages_to_search):
        self.product = product
        self.pages_to_search = pages_to_search
        # Macy's search URL format
        self.url = f"https://www.macys.com/shop/featured/{self.product}?pageIndex={self.current_page}"

    def scrape(self):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
        return_products = []      
        while self.proceed:
            page = requests.get(self.url, headers=headers)
            soup = BeautifulSoup(page.text, "html.parser")
            
            # Check if the results page contains product items
            if soup.find("ul", class_="items"):
                item_list = soup.find_all("li", class_="cell productThumbnailItem")
                
                for product in item_list:
                    product_details = {}
                    title_elem = product.find("div", class_="productDescription")
                    price_elem = product.find("div", class_="prices")
                    link_elem = product.find("a", class_="productDescLink")

                    if title_elem and price_elem and link_elem:
                        product_details['id'] = self.id
                        product_details['title'] = title_elem.find("a").text.strip()
                        product_details['price'] = price_elem.find("span", class_="regular").text.strip() if price_elem.find("span", class_="regular") else "Price not available"
                        product_details['link'] = "https://www.macys.com" + link_elem["href"]
                        return_products.append(product_details)
                        self.id += 1
            else:
                self.proceed = False

            if self.current_page >= self.pages_to_search:
                self.proceed = False
            else:
                self.current_page += 1
                self.url = f"https://www.macys.com/shop/featured/{self.product}?pageIndex={self.current_page}"

        return return_products
