import requests 
from bs4 import BeautifulSoup
import json

class EbayScraper():
    current_page = 1
    product = ""
    proceed = True
    pages_to_search = 1
    id = 0

    def __init__(self, product, pages_to_search):
        self.product = product
        self.pages_to_search = pages_to_search
        self.url = "https://www.ebay.com/sch/i.html?_from=R40&_nkw="+self.product+"&_pgn="+str(self.current_page)+""

    def scrape(self):
        return_products = []      
        while(self.proceed):
            page = requests.get(self.url)
            soup = BeautifulSoup(page.text, "html.parser")
            

            if soup.find("p", class_ = "error-header-v2__title") == "We looked everywhere.":
                self.proceed = False
            else:
                item = soup.find("div", class_ = "srp-river srp-layout-inner")
                items = item.find("ul", class_ = "srp-results srp-list clearfix")
                products = items.find_all("li", class_ = "s-item s-item__pl-on-bottom")  
                
                for product in products:
                    breakinto = product.find("div", class_ = "s-item__info clearfix")
                    product_details = {}
                    product_details['id'] = str(self.id)
                    product_details['title'] = breakinto.find("span").text
                    product_details['price'] = breakinto.find("span", class_ = "s-item__price").text
                    product_details['link'] = breakinto.find("a")["href"]
                    return_products.append(product_details)
                    self.id += 1
            if(self.current_page == self.pages_to_search):
                self.proceed = False
            else:
                self.current_page += 1

        return return_products

 