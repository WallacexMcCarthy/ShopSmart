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
        self.url = "https://www.amazon.com/s?k="+self.product+"&page=2&crid=P17BFKCQCE1E&qid=1727924411&sprefix="+self.product+"%2Caps%2C132&ref=sr_pg_"+str(self.current_page)

    def scrape(self):
        return_products = []      
        while(self.proceed):
            page = requests.get(self.url)
            soup = BeautifulSoup(page.text, "html.parser")
            

            if soup.find("img")["alt"] == "Sorry! We couldn't find that page. Try searching or go to Amazon's home page.":
                self.proceed = False
            else:
                items = soup.find_all("div", class_ = "sg-col-4-of-24 sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 AdHolder sg-col s-widget-spacing-small sg-col-4-of-20 gsx-ies-anchor")
                print(items)
                # item = items.find_all("div", class_ = "a-section a-spacing-base")
                
                for item in items:
                    title = item.find("div", class_ = "a-section a-spacing-none a-spacing-top-small s-title-instructions-style")
                    # print(title)
                    # product_details = {}
                    # product_details['id'] = str(self.id)
                    # product_details['title'] = title.find("span", class_ = "a-size-base-plus a-color-base a-text-normal").text
                    # product_details['price'] = item.find("span", class_ = "a-offscreen").text
                    # product_details['link'] = item.find("a", class_ = "a-link-normal s-no-hover s-underline-text s-underline-link-text s-link-style a-text-normal")["href"]
                    # return_products.append(product_details)
                    # print(product_details)
                    # self.id += 1
                    break
            if(self.current_page == self.pages_to_search):
                self.proceed = False
            else:
                self.current_page += 1

        return return_products

 