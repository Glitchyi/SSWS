import requests
from bs4 import BeautifulSoup

def scrape_text_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        text_content = soup.get_text()
        return text_content
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return None

if __name__ == "__main__":
    url = "http://localhost:8080/"  # Replace with the target URL
    # url = "https://en.wikipedia.org/wiki/Skibidi_Toilet"  # Replace with the target URL
    content = scrape_text_content(url)
    if content:
        print(content)