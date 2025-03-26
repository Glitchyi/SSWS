from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Set your Groq API key
load_dotenv()

# Load the HTML file
def load_html_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            html_content = file.read()
        return html_content
    except Exception as e:
        print(f"Error loading HTML file: {e}")
        return None

# Extract meta tags from HTML content
def extract_meta_tags(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Find all meta tags
    meta_tags = soup.find_all('meta')
    
    # Create a list to store meta tag information
    meta_info = []
    
    for tag in meta_tags:
        tag_info = {}
        
        # Get all attributes
        for attr, value in tag.attrs.items():
            tag_info[attr] = value
            
        meta_info.append(tag_info)
        
    return meta_info

# Load and process the HTML file
html_file_path = "../public/summary.html"  # Adjusted path since we're in utils folder
html_content = load_html_file(html_file_path)

if html_content:
    # Extract meta tags
    meta_tags = extract_meta_tags(html_content)
    
    # Print the extracted meta tags
    print("\n----- META TAGS -----\n")
    if meta_tags:
        for i, tag in enumerate(meta_tags, 1):
            print(f"Meta Tag #{i}:")
            for attr, value in tag.items():
                print(f"  {attr}: {value}")
            print()
    else:
        print("No meta tags found in the HTML file.")
    print("--------------------------\n")
    
else:
    print("Failed to load HTML file. Please check the file path.")