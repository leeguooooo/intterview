# 第105题 HTMLCollection和NodeList的区别

**Node和Element**

  * `DOM`是一棵树，所有节点都是`Node`
  * `Node`是`Element`的基类
  * `Element`是其他`HTML`元素的基类，如`HTMLDivElement`、`HTMLImageElement`等

![](/images/s_poetries_work_uploads_2023_01_ede61848ee4d078c.webp)

  * `HTMLCollection`是`Element`的集合
  * `NodeList`是`Node`的集合，包含`Text`和`Comment`节点
  * `ele.children` 返回`HTMLCollection`集合
  * `ele.childNodes` 返回`NodeList`集合
  * `HTMLCollection`和`NodeList`是类数组 
    * 使用`Array.from(list)`转化数组
    * 使用`Array.prototype.slice.call(list)`转化数组
    * 使用`[...list]`转化数组
```html
    <p id="p1"><b>node</b> vs <em>element</em><!--注释--></p>
    
    <script>
      const p1 = document.getElementById('p1')
      // console.log(p1.children) // HTMLCollection
      console.log(p1.childNodes) // NodeList
    
      // p1.tagName // Element类型一定有tagName
      // p1.nodeType/nodeName // node节点
    
      class Node {}
    
      // document
      class Document extends Node {}
      class DocumentFragment extends Node {}
      
      // 文本和注释
      class CharacterData extends Node {}
      class Comment extends CharacterData {}
      class Text extends CharacterData {}
    
      // elem
      class Element extends Node {}
      class HTMLElement extends Element {}
      class HTMLDivElement extends HTMLElement {}
      class HTMLInputElement extends HTMLElement {}
      // ...
    </script>
```
