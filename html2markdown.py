import html2text
import requests
import re
import pickle
import os
import html
from bs4 import BeautifulSoup

HISTORY_FILE = 'input_history.pkl'
ERROR_IMAGE_PATH = '/images/error.webp'

def set_login_cookie(session, cookie_name, time):
    from http.cookiejar import Cookie
    import time as time_module

    # Create a new cookie
    exp_time = int(time_module.time()) + time * 24 * 60 * 60
    cookie = Cookie(
        version=0, name=cookie_name, value='true', port=None, port_specified=False,
        domain='', domain_specified=False, domain_initial_dot=False,
        path='/', path_specified=True, secure=False, expires=exp_time,
        discard=False, comment=None, comment_url=None, rest={}, rfc2109=False
    )

    # Add the cookie to the session
    session.cookies.set_cookie(cookie)

def extract_container_content(html_content):
    # Parse HTML content and extract the element with id="container"
    soup = BeautifulSoup(html_content, 'html.parser')
    container = soup.find(id='container')
    return str(container) if container else ''

def remove_sidebar(html_content):
    # Remove content inside <aside class="sidebar">...</aside>
    sidebar_pattern = re.compile(r'<aside class="sidebar">.*?</aside>', re.DOTALL)
    processed_html = re.sub(sidebar_pattern, '', html_content)
    return processed_html

def preprocess_html(html_content):
    # First, extract container content
    html_content = extract_container_content(html_content)

    # Then, remove sidebar content
    html_content = remove_sidebar(html_content)

    # Match and replace code blocks with the appropriate language tag
    code_block_pattern = re.compile(r'<div class="language-(\w*) extra-class"><pre.*?><code>(.*?)</code>', re.DOTALL)

    def replace_code_block(match):
        language = match.group(1) if match.group(1) else 'javascript'  # Default to 'javascript' if no language specified
        code = match.group(2)
        return f'<br>```{language}<pre>{code}</pre>```'

    processed_html = re.sub(code_block_pattern, replace_code_block, html_content)
    return processed_html

def format_markdown_content(markdown_content):
    # Replace patterns like ```json\n\n\nCACHE MANIFEST\n with ```json\nCACHE MANIFEST\n
    formatted_content = re.sub(r'(```\w+)\n\s*\n', r'\1\n', markdown_content)
    # Replace patterns like \n\n\n```\n with \n```\n
    formatted_content = re.sub(r'\n\s*\n(```)', r'\n\1', formatted_content)
    # # # 替换成 #
    formatted_content = re.sub(r'# #', r'#', formatted_content)
    return formatted_content

def download_and_replace_images(session, html_content, markdown_file):
    # *.md 替换成 *
    # markdown_file = markdown_file.replace('.md', '')
    # Create image directory if it doesn't exist
    # image_dir = os.path.join('docs/.vuepress/public/images', markdown_file)
    image_dir = os.path.join('docs/.vuepress/public/images')

    os.makedirs(image_dir, exist_ok=True)

    # Find all img tags and replace their src with local paths
    soup = BeautifulSoup(html_content, 'html.parser')
    for img in soup.find_all('img'):
        img_url = img.get('data-src') or img.get('src')
        if img_url:
            # 去掉协议部分
            url_without_protocol = re.sub(r'^https?://', '', img_url)
            # 分离文件路径和文件扩展名
            file_path, file_extension = os.path.splitext(url_without_protocol)
            if not file_extension:
                file_extension = '.png'
            # 替换非字母和非数字字符为下划线
            img_name = re.sub(r'[^a-zA-Z0-9]', '_', file_path) + file_extension
            img_path = os.path.join(image_dir, img_name)
            # local_img_path = f'/images/{markdown_file}/{img_name}'
            local_img_path = f'/images/{img_name}'

            # Check if image already exists
            if not os.path.exists(img_path):
                try:
                    # Download the image
                    img_response = session.get(img_url)
                    img_response.raise_for_status()
                    with open(img_path, 'wb') as f:
                        f.write(img_response.content)
                except Exception as e:
                    print(f"Error downloading image {img_url}: {e}")
                    img['src'] = ERROR_IMAGE_PATH
                    img.insert_after(f'<br><p>出错的图片链接: <a href="{img_url}" target="_blank">{img_url}</a></p>')
            else:
                print(f"Image {img_name} already exists, skipping download.")
                img['src'] = local_img_path

    return str(soup)

def save_history(input_source, markdown_file, is_url):
    history = {'input_source': input_source, 'markdown_file': markdown_file, 'is_url': is_url}
    with open(HISTORY_FILE, 'wb') as f:
        pickle.dump(history, f)

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'rb') as f:
            return pickle.load(f)
    return {'input_source': '', 'markdown_file': '', 'is_url': True}

def html_to_markdown_from_url_or_file(input_source, markdown_file, is_url=True):
    try:
        # Create a session and set login cookies if input source is URL
        session = requests.Session()
        if is_url:
            set_login_cookie(session, '_local', 300)
            set_login_cookie(session, '_t', 300)

            # Get HTML content from the URL
            response = session.get(input_source)
            response.raise_for_status()
            html_content = response.text
        else:
            # Read HTML content from local file
            with open(input_source, 'r', encoding='utf-8') as file:
                html_content = file.read()

        # Preprocess HTML to handle code blocks correctly
        processed_html = preprocess_html(html_content)

        # Download images and replace their URLs
        processed_html = download_and_replace_images(session, processed_html, markdown_file)

        # Create converter instance
        converter = html2text.HTML2Text()
        converter.ignore_links = False

        # Convert HTML to Markdown
        markdown_content = converter.handle(processed_html)

        # Format the Markdown content
        formatted_markdown_content = format_markdown_content(markdown_content)

        # Ensure the output directory exists
        output_dir = os.path.join('docs')
        os.makedirs(output_dir, exist_ok=True)

        # Write Markdown content to file
        markdown_file_path = os.path.join(output_dir, markdown_file)
        with open(markdown_file_path, 'w', encoding='utf-8') as file:
            file.write(formatted_markdown_content)

        print(f"Markdown file '{markdown_file_path}' has been created successfully.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    try:
        # Load previous inputs
        previous_inputs = load_history()
    except FileNotFoundError:
        previous_inputs = {'input_source': '', 'markdown_file': '', 'is_url': True}

    input_source = input(f"Enter the URL or file path [{previous_inputs['input_source']}]: ") or previous_inputs['input_source']
    markdown_file = input(f"Enter the output Markdown file name [{previous_inputs['markdown_file']}]: ") or previous_inputs['markdown_file']
    is_url = input("Is the input source a URL? (yes/no) [yes]: ").lower() in ['yes', 'y', ''] if previous_inputs['is_url'] else input("Is the input source a URL? (yes/no) [no]: ").lower() in ['yes', 'y']

    # Save current inputs
    save_history(input_source, markdown_file, is_url)

    html_to_markdown_from_url_or_file(input_source, markdown_file, is_url)
