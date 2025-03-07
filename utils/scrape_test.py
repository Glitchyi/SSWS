from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
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

# Extract text from HTML content
def extract_text_from_html(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.extract()
    
    # Get text
    text = soup.get_text(separator=" ", strip=True)
    return text

# Load and process the HTML file
html_file_path = "../static/index.html"  # Adjusted path since we're in utils folder
html_content = load_html_file(html_file_path)

if html_content:
    # Extract text from HTML
    text_content = extract_text_from_html(html_content)
    
    # Print the extracted content
    print("\n----- WEBSITE CONTENT -----\n")
    print(text_content)
    print("\n--------------------------\n")
    
    # Print some statistics about the content
    print(f"Content length: {len(text_content)} characters")
    print(f"Word count: {len(text_content.split())}")
    
    # Optional: Print a sample of the beginning of the content
    print("\nSample of content (first 500 characters):")
    print(text_content[:500])
    
else:
    print("Failed to load HTML file. Please check the file path.")