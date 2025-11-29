import PyPDF2
import io
from werkzeug.datastructures import FileStorage


def extract_text_from_file(file: FileStorage) -> str:
    """
    Extract text from PDF or TXT file
    
    Args:
        file: FileStorage object from Flask request
    
    Returns:
        Extracted text string
    
    Raises:
        Exception: If file type is not supported or extraction fails
    """
    filename = file.filename.lower()
    
    if filename.endswith('.pdf'):
        return extract_text_from_pdf(file)
    elif filename.endswith('.txt'):
        return extract_text_from_txt(file)
    else:
        raise ValueError(f"Unsupported file type: {filename}")


def extract_text_from_pdf(file: FileStorage) -> str:
    """Extract text from PDF file"""
    try:
        pdf_file = io.BytesIO(file.read())
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
        
        return text
    
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")


def extract_text_from_txt(file: FileStorage) -> str:
    """Extract text from TXT file"""
    try:
        content = file.read()
        text = content.decode('utf-8')
        return text
    
    except UnicodeDecodeError:
        try:
            file.seek(0)
            content = file.read()
            text = content.decode('latin-1')
            return text
        except Exception as e:
            raise Exception(f"Error decoding TXT file: {str(e)}")
    except Exception as e:
        raise Exception(f"Error extracting text from TXT: {str(e)}")
