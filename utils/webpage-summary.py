import modal

app = modal.App(name='web-sumaru')

image = modal.Image.debian_slim().pip_install("flask","langchain-groq", "langchain", "langchain-community", "langchain-huggingface", "langgraph", "bs4", "playwright", "chromadb")


@app.function(image=image, secrets=[modal.Secret.from_name("GROQ_API_KEY")])
@modal.wsgi_app()
def flask_app():
    import os
    from langchain_groq import ChatGroq
    from langchain_core.vectorstores import InMemoryVectorStore
    from lanchain
    from langchain_huggingface import HuggingFaceEmbeddings
    from flask import Flask, request, jsonify
    from langchain_community.document_loaders import WebBaseLoader
    from bs4 import BeautifulSoup
    from langchain_core.prompts import PromptTemplate
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_core.runnables import RunnablePassthrough
    from langchain_core.output_parsers import StrOutputParser

    web_app = Flask(__name__)
    
    
    llm = ChatGroq(model='llama-3.3-70b-versatile', api_key=os.environ["GROQ_API_KEY"])
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = InMemoryVectorStore(embeddings)
    

    # url = "https://www.writeoutloud.net/blogs/"
    
    prompt = PromptTemplate.from_template("""You will be provided with the contents of a webpage.
    Your task is to analyze the contents, summarize its contents in no more than 200 words, and optimize the summary for SEO.
    <context>
    {context}
    </context>
    Question={input}
    Follow these steps:
        1. Summarize the primary content of the website accurately.
        2. Optimize the summary for SEO, incorporating relevant keywords and phrases naturally.
        3. Ensure the summary is concise, clear, and engaging for SEO bots.
        4. Generate ONLY the summary, no need for any additional statements
        5. The summary should ONLY be in a simple HTML format with proper structure fit for SEO
        6. The output html SHOULD have head section body section and proper meta tags
    """)


    @web_app.post("/")
    def home():
        url = request.args.get('url')
        data = request.get_json()
        
        if not data or 'html' not in data:
            return jsonify({'error': 'No HTML content provided'}), 400
        
        # Get HTML content from request
        html_content = data['html']
        
        # Print the received HTML content
        print("Received HTML content:")
        print(html_content)
        
        loader = WebBaseLoader(
            web_paths=(url,),
        )
        html = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = text_splitter.split_documents(html)
        _ = vector_store.add_documents(documents=docs)
        retriever = vector_store.as_retriever()

        rag_chain = (
                {"context": retriever, "input": RunnablePassthrough()}
                | prompt
                | llm
                | StrOutputParser()
            )

        summary = rag_chain.invoke("Summarize")

        return summary


    return web_app

# !pip install langchain-groq langchain langchain-community langchain-huggingface langgraph bs4 playwright chromadb
