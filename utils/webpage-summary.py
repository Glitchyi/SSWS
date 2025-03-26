import modal

app = modal.App(name='web-sumaru')

image = modal.Image.debian_slim().pip_install("flask","langchain-groq","langchain","langchain-community","langchain-huggingface","langgraph","playwright","chromadb")


@app.function(image=image, secrets=[modal.Secret.from_name("GROQ_API_KEY")])
@modal.wsgi_app()
def flask_app():
    from os import environ
    from flask import Flask, request, jsonify
    from langchain_groq import ChatGroq
    from langchain_core.vectorstores import InMemoryVectorStore
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain.schema import Document  
    from langchain_core.prompts import PromptTemplate
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_core.runnables import RunnablePassthrough
    from langchain_core.output_parsers import StrOutputParser

    web_app = Flask(__name__)
    
    groq_api_key = environ.get("GROQ_API_KEY")
    
    llm = ChatGroq(model='llama-3.3-70b-versatile', api_key=groq_api_key)


    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = InMemoryVectorStore(embeddings)
    

    prompt = PromptTemplate.from_template("""You will be provided with the contents of a webpage.
    Your task is to analyze the contents, summarize its contents in no more than 200 words, and optimize the summary for SEO.
    <context>
    {context}
    </context>
    Question={input}
    Follow these steps:
        1. Summarize the primary content of the website accurately.
        2. Make the summarised content very short fitting in a SINGLE LINE.
        2. Optimize the summary for SEO, incorporating relevant keywords and phrases naturally.
        3. Ensure the summary is concise, clear, and engaging for SEO bots.
        4. Generate ONLY the summary, no need for any additional statements.
        5. The summary should ONLY be in a simple HTML format with proper structure fit for SEO.
        6. The output html SHOULD ONLY have meta tags.
    """)


    @web_app.post("/")
    def home():
        data = request.get_json()
        
        if not data or 'html' not in data:
            return jsonify({'error': 'No HTML content provided'}), 400
        
        # Get HTML content from request
        docs = data['html']
        
        # Print the received HTML content
        print("Received HTML content:")
        print(docs)
        
        html = [Document(page_content=docs)]
        
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

