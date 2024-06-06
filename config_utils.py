import re
import json
from datetime import datetime

CONFIG_FILE = 'docs/.vuepress/config.js'

def update_config_file(title, origin_url, new_link):
    new_link = new_link.replace('.md', '.html')
    with open(CONFIG_FILE, 'r', encoding='utf-8') as file:
        config_content = file.read()

    config_json = extract_json_from_config(config_content)

    def update_or_add_item(nav_items, title, new_link, origin_url):
        for item in nav_items:
            if 'text' in item and item['text'] == title:
                item['link'] = new_link
                item['originUrl'] = origin_url
                item['updateTime'] = datetime.now().strftime("%Y-%m-%d %H.%M.%S")
                return True
            if 'children' in item:
                if update_or_add_item(item['children'], title, new_link, origin_url):
                    return True
        return False

    found = update_or_add_item(config_json['navbar'], title, new_link, origin_url)

    if not found:
        # 先安装 - 切割，获取前缀
        title_parts = title.split('-')
        category = title_parts[0]

        # 先判断分类是否存在
        for item in config_json['navbar']:
            if 'text' in item and item['text'] == category and 'children' in item:
                item['children'].append({
                    'text': title,
                    'link': new_link,
                    'originUrl': origin_url,
                    'updateTime': datetime.now().strftime("%Y-%m-%d %H.%M.%S")
                })
                break
        else:
            # 创建一个新的分类
            config_json['navbar'].append({
                'text': category,
                'children': [{
                    'text': title,
                    'link': new_link,
                    'originUrl': origin_url,
                    'updateTime': datetime.now().strftime("%Y-%m-%d %H.%M.%S")

                }]
            })

    new_config_content = replace_json_in_config(config_content, config_json)

    with open(CONFIG_FILE, 'w', encoding='utf-8') as file:
        file.write(new_config_content)
    print(f"Config file '{CONFIG_FILE}' has been updated successfully.")

def extract_json_from_config(config_content):
    config_pattern = re.compile(r'defaultTheme\((\{.*\})\)', re.DOTALL)
    match = config_pattern.search(config_content)
    if not match:
        raise ValueError("Could not find the main configuration object in config file.")
    config_str = match.group(1)
    config_str = re.sub(r'"plugins":\s*\[.*?viteBundler\(\)', '', config_str, flags=re.DOTALL)
    config_str = re.sub(r'\}\),', '', config_str, flags=re.DOTALL)
    config_json = json.loads(config_str)
    return config_json

def replace_json_in_config(config_content, config_json):
    json_str = json.dumps(config_json['navbar'], ensure_ascii=False, indent=2)
    navbar_pattern = re.compile(r'"navbar":\s*\[.*?\].*?\}\)', re.DOTALL)
    match = navbar_pattern.search(config_content)
    if not match:
        raise ValueError("Could not find the navbar configuration in config file.")
    config_content = navbar_pattern.sub(f'"navbar": {json_str}\\n}})', config_content)
    return config_content

def load_config():
    with open(CONFIG_FILE, 'r', encoding='utf-8') as file:
        config_content = file.read()

    config_json = extract_json_from_config(config_content)

    navbar = config_json['navbar']
    return navbar

def load_history():
    navbar = load_config()
    history_dict = {}
    for item in navbar:
        if 'originUrl' in item and 'text' in item and 'link' in item:
            history_dict[item['originUrl']] = {
                'markdown_file': item['link'],
                'title': item['text'],
                'updateTime': item['updateTime'],
                'canUpdate': item['canUpdate']
            }
        if 'children' in item:
            for child in item['children']:
                if 'originUrl' in child and 'text' in child and 'link' in child:
                    history_dict[child['originUrl']] = {
                            'markdown_file': child['link'],
                            'title': child['text'],
                            'updateTime': child['updateTime'],
                            'canUpdate': child['canUpdate']

                    }
    return history_dict

def generate_markdown_filename(url, title):
    import urllib.parse
    decoded_url = urllib.parse.unquote(url)
    parts = decoded_url.split('/')
    filename = parts[-1].replace('.html', '') if parts[-1] else parts[-2].replace('.html', '')
    filename = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fa5]', '-', filename)
    filename = re.sub(r'-+', '-', filename)
    if title:
        filename = f"{title}"
    else:
        filename = f"{filename}"
    return filename

def batch_update_navbar(nav_items, update_function):
    for item in nav_items:
        if 'originUrl' in item:
            update_function(item)
        if 'children' in item:
            batch_update_navbar(item['children'], update_function)

def update_navbar_items():
    with open(CONFIG_FILE, 'r', encoding='utf-8') as file:
        config_content = file.read()

    config_json = extract_json_from_config(config_content)

    def update_function(item):
        item['updateTime'] = datetime.now().strftime("%Y-%m-%d %H.%M.%S")

    batch_update_navbar(config_json['navbar'], update_function)

    new_config_content = replace_json_in_config(config_content, config_json)

    with open(CONFIG_FILE, 'w', encoding='utf-8') as file:
        file.write(new_config_content)
    print(f"All navbar items with 'originUrl' have been updated successfully.")
