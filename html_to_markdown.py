import html2text
import requests
import re
import os
from bs4 import BeautifulSoup
from config_utils import (
    update_config_file,
    load_history,
    generate_markdown_filename
)

ERROR_IMAGE_PATH = '/images/error.webp'

def set_login_cookie(session, cookie_name, time):
    from http.cookiejar import Cookie
    import time as time_module

    exp_time = int(time_module.time()) + time * 24 * 60 * 60
    cookie = Cookie(
        version=0, name=cookie_name, value='true', port=None, port_specified=False,
        domain='', domain_specified=False, domain_initial_dot=False,
        path='/', path_specified=True, secure=False, expires=exp_time,
        discard=False, comment=None, comment_url=None, rest={}, rfc2109=False
    )
    session.cookies.set_cookie(cookie)

def extract_container_content(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    container = soup.find(id='container')
    return str(container) if container else ''

def remove_sidebar(html_content):
    sidebar_pattern = re.compile(r'<aside class="sidebar">.*?</aside>', re.DOTALL)
    processed_html = re.sub(sidebar_pattern, '', html_content)
    return processed_html

def preprocess_html(html_content):
    html_content = extract_container_content(html_content)
    html_content = remove_sidebar(html_content)

    soup = BeautifulSoup(html_content, 'html.parser')
    for div in soup.find_all('div', class_='code-copy'):
        div.decompose()
    html_content = str(soup)

    header_pattern = re.compile(r'<h(\d) id="[^"]*"><a[^>]*>#</a>(.*?)</h\d>', re.DOTALL)

    def replace_header(match):
        level = match.group(1)
        text = match.group(2).strip()
        return f"<h{level}>{text}</h{level}>\n"

    html_content = re.sub(header_pattern, replace_header, html_content)

    code_block_pattern = re.compile(r'<div class="language-(\w*) extra-class">\s*<pre.*?>\s*<code>(.*?)</code>\s*</pre>\s*</div>', re.DOTALL)

    def replace_code_block(match):
        language = match.group(1) if match.group(1) else 'javascript'
        code = match.group(2)
        return f'<br>```{language}<pre>{code}</pre>```'

    processed_html = re.sub(code_block_pattern, replace_code_block, html_content)
    return processed_html

def format_markdown_content(markdown_content):
    formatted_content = re.sub(r'(```\w+)\n\s*\n', r'\1\n', markdown_content)
    formatted_content = re.sub(r'\n\s*\n(```)', r'\n\1', formatted_content)
    formatted_content = re.sub(r'# #', r'#', formatted_content)

    return formatted_content

def download_and_replace_images(session, html_content, markdown_file):
    image_dir = os.path.join('docs/.vuepress/public/images')
    os.makedirs(image_dir, exist_ok=True)

    soup = BeautifulSoup(html_content, 'html.parser')
    for img in soup.find_all('img'):
        img_url = img.get('data-src') or img.get('src')
        if img_url:
            url_without_protocol = re.sub(r'^https?://', '', img_url)
            file_path, file_extension = os.path.splitext(url_without_protocol)
            if not file_extension:
                file_extension = '.png'
            img_name = re.sub(r'[^a-zA-Z0-9]', '_', file_path) + file_extension
            img_path = os.path.join(image_dir, img_name)
            local_img_path = f'/images/{img_name}'

            if not os.path.exists(img_path):
                try:
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

def html_to_markdown_from_url_or_file(input_source, markdown_file, title, is_url=True):
    update_config_file(title, input_source, f"{markdown_file}")

    session = requests.Session()
    if is_url:
        set_login_cookie(session, '_local', 300)
        set_login_cookie(session, '_t', 300)

        response = session.get(input_source)
        response.raise_for_status()
        html_content = response.text
    else:
        with open(input_source, 'r', encoding='utf-8') as file:
            html_content = file.read()

    processed_html = preprocess_html(html_content)
    processed_html = download_and_replace_images(session, processed_html, markdown_file)

    converter = html2text.HTML2Text()
    converter.ignore_links = False

    markdown_content = converter.handle(processed_html)
    formatted_markdown_content = format_markdown_content(markdown_content)

    if is_url:
        formatted_markdown_content = f"原文链接: [{input_source}]({input_source})\n\n{formatted_markdown_content}"

    output_dir = os.path.join('docs')
    os.makedirs(output_dir, exist_ok=True)

    markdown_file = markdown_file.replace('.html', '.md').replace('/', '')
    markdown_file_path = os.path.join(output_dir, markdown_file)
    print(f"Markdown file will be saved to '{markdown_file_path}'.")
    with open(markdown_file_path, 'w', encoding='utf-8') as file:
        file.write(formatted_markdown_content)

    os.system(f"npx prettier --write ./docs/.vuepress/config.js")
    print(f"Markdown file '{markdown_file_path}' has been created successfully.")

if __name__ == "__main__":
    history_dict = load_history()

    input_source = input("Enter the URL or file path: ").strip()
    markdown_file = ""
    title = ""

    if input_source in history_dict:
        markdown_file = history_dict[input_source]['markdown_file']
        title = history_dict[input_source]['title']
    else:
        title = input("Enter the title for the document (in Chinese): ").strip()
        markdown_file = generate_markdown_filename(input_source, title)
        history_dict[input_source] = {'markdown_file': markdown_file, 'title': title}

    is_url = input("Is the input source a URL? (yes/no) [yes]: ").lower() in ['yes', 'y', '']

    html_to_markdown_from_url_or_file(input_source, markdown_file, title, is_url)
