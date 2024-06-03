import{_ as n,c as s,o as a,a as e}from"./app-ByrCXkCX.js";const t={},p=e(`<p>原文链接: <a href="https://interview.poetries.top/principle-docs/vue/06-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E5%92%8C%E5%BC%82%E6%AD%A5%E6%B8%B2%E6%9F%93.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86" target="_blank" rel="noopener noreferrer">https://interview.poetries.top/principle-docs/vue/06-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E5%92%8C%E5%BC%82%E6%AD%A5%E6%B8%B2%E6%9F%93.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86</a></p><blockquote><p>在本章之前，我们花费了很大的篇幅全面的讲解了一个普通渲染器的实现原理，它可以将 <code>Virtual DOM</code> 渲染为 Web 平台的真实 DOM。本章我们将在上一章的基础上讲解更加高级的渲染器：自定义渲染器(<code>Custom renderer</code>)以及异步渲染。</p></blockquote><h2 id="自定义渲染器的原理" tabindex="-1"><a class="header-anchor" href="#自定义渲染器的原理"><span>自定义渲染器的原理</span></a></h2><p>渲染器是围绕 <code>Virtual DOM</code> 而存在的，在 Web 平台下它能够把 <code>Virtual DOM</code> 渲染为浏览器中的真实 DOM 对象，通过前面几章的讲解，相信你已经能够认识到渲染器的实现原理，为了能够将 <code>Virtual DOM</code> 渲染为真实 DOM，渲染器内部需要调用浏览器提供的 DOM 编程接口，下面罗列了在出上一章中我们曾经使用到的那些浏览器为我们提供的 DOM 编程接口：</p><ul><li><code>document.createElement / createElementNS</code>：创建标签元素。</li><li><code>document.createTextNode</code>：创建文本元素。</li><li><code>el.nodeValue</code>：修改文本元素的内容。</li><li><code>el.removeChild</code>：移除 DOM 元素。</li><li><code>el.insertBefore</code>：插入 DOM 元素。</li><li><code>el.appendChild</code>：追加 DOM 元素。</li><li><code>el.parentNode</code>：获取父元素。</li><li><code>el.nextSibling</code>：获取下一个兄弟元素。</li><li><code>document.querySelector</code>：挂载 <code>Portal</code> 类型的 <code>VNode</code> 时，用它查找挂载点。</li></ul><p>这些 DOM 编程接口完成了 Web 平台(或者说浏览器)下对 DOM 的增加、删除、查找的工作，它是 Web 平台独有的，所以如果渲染器自身强依赖于这些方法(函数)，那么这个渲染器也只能够运行在浏览器中，它不具备跨平台的能力。换句话说，如果想要实现一个平台无关的渲染器，那么渲染器自身必须不能强依赖于任何一个平台下特有的接口，而是应该提供一个抽象层，将 “DOM” 的增加、删除、查找等操作使用抽象接口实现，具体到某个平台下时，由开发者决定如何使用该平台下的接口实现这个抽象层，这就是自定义渲染器的本质。</p><p>TIP</p><p>在下文中，我们将使用 “元素” 一词指代所有平台中的元素对象，例如在 Web 平台下 “元素” 一词指的就是 DOM 元素。</p><p>渲染器除了负责对元素的增加、删除、查找之外，它还负责修改某个特定元素自身的属性/特性，例如 Web 平台中元素具有 <code>id</code>、<code>href</code> 等属性/特性。在上一章中，我们使用 <code>patchData</code> 函数来完成元素自身属性/特性的更新，如下代码用于修改一个元素的类名列表(<code>class</code>)：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// patchData.js</span></span>
<span class="line">    <span class="token keyword">case</span> <span class="token string">&#39;class&#39;</span><span class="token operator">:</span></span>
<span class="line">      el<span class="token punctuation">.</span>className <span class="token operator">=</span> nextValue</span>
<span class="line">      <span class="token keyword">break</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码同样也只能运行在浏览器中，为了渲染器能够跨平台，那么修改一个元素自身的属性/特性的工作也应该作为可自定义的一部分才行，因此，一个跨平台的渲染器应该至少包含两个可自定义的部分：<strong>可自定义元素的增加、删除、查找等操作</strong> 、<strong>可自定义元素自身属性/特性的修改操作</strong> 。这样对于任何一个元素来说，它的增删改查都已经变成了可自定义的部分，我们只需要“告知”渲染器在对元素进行增删改查时应该做哪些具体的操作即可。</p><p>接下来我们就着手将一个普通渲染器修改为拥有自定义能力的渲染器，在之前的讲解中，我们将渲染器的代码存放在了 <code>render.js</code> 文件中，如下是整个 <code>render.js</code> 文件的核心代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 导出渲染器</span></span>
<span class="line">    <span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// ========== 挂载 ==========</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">mount</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">,</span> refNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">mountElement</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">,</span> refNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">mountText</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">mountFragment</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">mountPortal</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">mountComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">mountStatefulComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">mountFunctionalComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// ========== patch ==========</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">patch</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">replaceVNode</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">patchElement</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">patchChildren</span><span class="token punctuation">(</span></span>
<span class="line">      <span class="token parameter">prevChildFlags<span class="token punctuation">,</span></span>
<span class="line">      nextChildFlags<span class="token punctuation">,</span></span>
<span class="line">      prevChildren<span class="token punctuation">,</span></span>
<span class="line">      nextChildren<span class="token punctuation">,</span></span>
<span class="line">      container</span></span>
<span class="line">    <span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">patchText</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">patchFragment</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">patchPortal</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">patchComponent</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// https://en.wikipedia.org/wiki/Longest_increasing_subsequence</span></span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">lis</span><span class="token punctuation">(</span><span class="token parameter">arr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>观察如上代码结构，可以发现一个渲染器由两部分组成：<code>mount</code> 和 <code>patch</code>。在 <code>mount</code> 和 <code>patch</code> 中都会调用浏览器提供的 DOM 编程接口来完成真正的渲染工作。为了将浏览器提供的 DOM 编程接口与渲染器的代码分离，我们可以将如上代码封装到一个叫做 <code>createRenderer</code> 的函数中，如下代码所示：</p><pre><code>export default function createRenderer(options) {
  function render(vnode, container) { /* ... */ }

  // ========== 挂载 ==========

  function mount(vnode, container, isSVG, refNode) { /* ... */ }

  function mountElement(vnode, container, isSVG, refNode) { /* ... */ }

  function mountText(vnode, container) { /* ... */ }

  function mountFragment(vnode, container, isSVG) { /* ... */ }

  function mountPortal(vnode, container) { /* ... */ }

  function mountComponent(vnode, container, isSVG) { /* ... */ }

  function mountStatefulComponent(vnode, container, isSVG) { /* ... */ }

  function mountFunctionalComponent(vnode, container, isSVG) { /* ... */ }

  // ========== patch ==========

  function patch(prevVNode, nextVNode, container) { /* ... */ }

  function replaceVNode(prevVNode, nextVNode, container) { /* ... */ }

  function patchElement(prevVNode, nextVNode, container) { /* ... */ }

  function patchChildren(
    prevChildFlags,
    nextChildFlags,
    prevChildren,
    nextChildren,
    container
  ) { /* ... */ }

  function patchText(prevVNode, nextVNode) { /* ... */ }

  function patchFragment(prevVNode, nextVNode, container) { /* ... */ }

  function patchPortal(prevVNode, nextVNode) { /* ... */ }

  function patchComponent(prevVNode, nextVNode, container) { /* ... */ }

  return { render }
}

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis(arr) { /* ... */ }
</code></pre><p><code>createRenderer</code> 函数的返回值就是之前的 <code>render</code> 函数，也就是说调用 <code>createRenderer</code> 函数可以创建一个渲染器。<code>createRenderer</code> 函数接收一个参数 <code>options</code>，该参数的作用是为了允许外界有能力将操作元素的具体实现以选项的方式传递进来。</p><p>那么 <code>options</code> 参数中应该包含哪些选项呢？其实前面我们已经分析过了，只要是需要自定义的部分就应该作为选项传递进来，所以参数 <code>options</code> 中至少要包含两部分：一部分是元素的增加、删除、查找；另外一部分是元素的修改，即 <code>patchData</code> 函数。如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> <span class="token punctuation">{</span> render <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">createRenderer</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// nodeOps 是一个对象，该对象包含了所有用于操作节点的方法</span></span>
<span class="line">      <span class="token literal-property property">nodeOps</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">createElement</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function">createText</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">        <span class="token comment">// more...</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      patchData</span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基于此，在 <code>createRenderer</code> 函数内部我们就可以通过解构的方式从 <code>options</code> 参数中得到具体的方法：</p><pre><code>export default function createRenderer(options) {
  // options.nodeOps 选项中包含了本章开头罗列的所有操作 DOM 的方法
  // options.patchData 选项就是 patchData 函数
  const {
    nodeOps: {
      createElement: platformCreateElement,
      createText: platformCreateText,
      setText: platformSetText, // 等价于 Web 平台的 el.nodeValue
      appendChild: platformAppendChild,
      insertBefore: platformInsertBefore,
      removeChild: platformRemoveChild,
      parentNode: platformParentNode,
      nextSibling: platformNextSibling,
      querySelector: platformQuerySelector
    },
    patchData: platformPatchData
  } = options

  function render(vnode, container) { /* ... */ }

  // ========== 挂载 ==========
  // 省略...

  // ========== patch ==========
  // 省略...

  return { render }
}
</code></pre><p>如上代码所示，<code>options.nodeOps</code> 选项是一个对象，它包含了所有用于对元素进行增、删、查的操作，<code>options.patchData</code> 选项是一个函数，用于处理某个特定元素上的属性/特定，这些内容都是在创建渲染器时由外界来决定的。</p><p>接下来我们要做的就是将渲染器中原本使用了 Web 平台进行 DOM 操作的地方修改成使用通过解构得到的函数进行替代，例如在创建 DOM 元素时，原来的实现如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mountElement</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">,</span> refNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      isSVG <span class="token operator">=</span> isSVG <span class="token operator">||</span> vnode<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT_SVG</span></span>
<span class="line">      <span class="token keyword">const</span> el <span class="token operator">=</span> isSVG</span>
<span class="line">        <span class="token operator">?</span> document<span class="token punctuation">.</span><span class="token function">createElementNS</span><span class="token punctuation">(</span><span class="token string">&#39;http://www.w3.org/2000/svg&#39;</span><span class="token punctuation">,</span> vnode<span class="token punctuation">.</span>tag<span class="token punctuation">)</span></span>
<span class="line">        <span class="token operator">:</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>tag<span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// 省略...</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在我们应该使用 <code>platformCreateElement</code> 函数替代 <code>document.createElement(NS)</code>：</p><pre><code>function mountElement(vnode, container, isSVG, refNode) {
  isSVG = isSVG || vnode.flags &amp; VNodeFlags.ELEMENT_SVG
  const el = platformCreateElement(vnode.tag, isSVG)
  // 省略...
}
</code></pre><p>类似的，其他所有涉及 DOM 操作的地方都应该使用这些通过解构得到的抽象接口替代。当这部分工作完成之后，接下来要做的就是对这些用于操作节点的抽象方法进行实现，如下代码所示，我们实现了 Web 平台下创建 DOM 节点的方法：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> <span class="token punctuation">{</span> render <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">createRenderer</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">nodeOps</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">createElement</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">return</span> isSVG</span>
<span class="line">            <span class="token operator">?</span> document<span class="token punctuation">.</span><span class="token function">createElementNS</span><span class="token punctuation">(</span><span class="token string">&#39;http://www.w3.org/2000/svg&#39;</span><span class="token punctuation">,</span> tag<span class="token punctuation">)</span></span>
<span class="line">            <span class="token operator">:</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>tag<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再举一个例子，下面这条语句是我们之前实现的渲染器中用于移除旧 <code>children</code> 中节点的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    container<span class="token punctuation">.</span><span class="token function">removeChild</span><span class="token punctuation">(</span>prevChildren<span class="token punctuation">.</span>el<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>现在我们将之替换为 <code>platformRemoveChild</code> 函数：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">platformRemoveChild</span><span class="token punctuation">(</span>container<span class="token punctuation">,</span> prevVNode<span class="token punctuation">.</span>el<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>为了让这段代码在 Web 平台正常工作，我们需要在创建渲染器时实现 <code>nodeOps.removeChild</code> 函数：</p><pre><code>const { render } = createRenderer({
  nodeOps: {
    createElement(tag, isSVG) {
      return isSVG
        ? document.createElementNS(&#39;http://www.w3.org/2000/svg&#39;, tag)
        : document.createElement(tag)
    },
    removeChild(parent, child) {
      parent.removeChild(child)
    }
  }
})
</code></pre><p>也许你已经想到了，当我们实现了所有 <code>nodeOps</code> 下的规定的抽象接口之后，实际上就完成了一个面向 Web 平台的渲染器，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> <span class="token punctuation">{</span> render <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">createRenderer</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">nodeOps</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">createElement</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">return</span> isSVG</span>
<span class="line">            <span class="token operator">?</span> document<span class="token punctuation">.</span><span class="token function">createElementNS</span><span class="token punctuation">(</span><span class="token string">&#39;http://www.w3.org/2000/svg&#39;</span><span class="token punctuation">,</span> tag<span class="token punctuation">)</span></span>
<span class="line">            <span class="token operator">:</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>tag<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function">removeChild</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> child</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          parent<span class="token punctuation">.</span><span class="token function">removeChild</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function">createText</span><span class="token punctuation">(</span><span class="token parameter">text</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">return</span> document<span class="token punctuation">.</span><span class="token function">createTextNode</span><span class="token punctuation">(</span>text<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function">setText</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> text</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          node<span class="token punctuation">.</span>nodeValue <span class="token operator">=</span> text</span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function">appendChild</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> child</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          parent<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function">insertBefore</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> child<span class="token punctuation">,</span> ref</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          parent<span class="token punctuation">.</span><span class="token function">insertBefore</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> ref<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function">parentNode</span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">return</span> node<span class="token punctuation">.</span>parentNode</span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function">nextSibling</span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">return</span> node<span class="token punctuation">.</span>nextSibling</span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token parameter">selector</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">return</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span>selector<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然了，如上代码所创建的渲染器只能够完成 Web 平台中对 DOM 的增加、删除和查找的功能，为了能够修改 DOM 元素自身的属性和特性，我们还需要在创建渲染器时将 <code>patchData</code> 函数作为选项传递过去，好在我们之前已经封装了 <code>patchData</code> 函数，现在直接拿过来用即可：</p><pre><code>import { patchData } from &#39;./patchData&#39;
const { render } = createRenderer({
  nodeOps: {
    // 省略...
  },
  patchData
})
</code></pre><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/mq8v65qyry" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/mq8v65qyry</a><a href="https://codesandbox.io/s/mq8v65qyry" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>以上我们就完成了对渲染器的抽象，使它成为一个平台无关的工具。并基于此实现了一个 Web 平台的渲染器，专门用于浏览器环境。</p><h2 id="自定义渲染器的应用" tabindex="-1"><a class="header-anchor" href="#自定义渲染器的应用"><span>自定义渲染器的应用</span></a></h2><p><code>Vue3</code> 提供了一个叫做 <code>@vue/runtime-test</code> 的包，其作用是方便开发者在无 DOM 环境时有能力对组件的渲染内容进行测试，这实际上就是对自定义渲染器的应用。本节我们尝试来实现与 <code>@vue/runtime-test</code> 具有相同功能的渲染器。</p><p>原理其实很简单，如下代码所示，这是用于 Web 平台下创建真实 DOM 元素的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> <span class="token punctuation">{</span> render <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">createRenderer</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">nodeOps</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">createElement</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">return</span> isSVG</span>
<span class="line">            <span class="token operator">?</span> document<span class="token punctuation">.</span><span class="token function">createElementNS</span><span class="token punctuation">(</span><span class="token string">&#39;http://www.w3.org/2000/svg&#39;</span><span class="token punctuation">,</span> tag<span class="token punctuation">)</span></span>
<span class="line">            <span class="token operator">:</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>tag<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中 <code>nodeOps.createElement</code> 函数会返回一个真实的 DOM 对象，在其内部调用的是浏览器为我们提供的 <code>document.createElement/NS</code> 函数。实际上 <code>nodeOps.createElement</code> 函数的真正意图是：<strong>创建一个元素</strong> ，然而并没有规定这个元素应该由谁来创建，或这个元素应该具有什么样的特征，这就是自定义的核心所在。因此，我们完全使 <code>nodeOps.createElement</code> 函数返回一个普通对象来代指一个元素，后续的所有操作都是基于我们所规定的元素而进行，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> <span class="token punctuation">{</span> render <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">createRenderer</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">nodeOps</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">createElement</span><span class="token punctuation">(</span><span class="token parameter">tag</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">const</span> customElement <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;ELEMENT&#39;</span><span class="token punctuation">,</span></span>
<span class="line">            tag</span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          <span class="token keyword">return</span> customElement</span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这段代码中，我们自行规定了 <code>nodeOps.createElement</code> 函数所返回的元素的格式，即 <code>customElement</code> 对象，它包含两个属性，分别是 用来代表元素类型的 <code>type</code> 属性以及用来代表元素名称的 <code>tag</code> 属性。虽然看上去很奇怪，但这确实是一个完全符合要求的实现。这么做的结果就是：<strong><code>nodeOps.createElement</code> 函数所创建的元素不来自于浏览器的 DOM 编程接口，更不来自于任何其他平台的 API</strong>，因此，如上代码所创建的渲染器也将是一个平台无关的渲染器。这就是为什么 <code>@vue/runtime-test</code> 可以运行在 <code>NodeJs</code> 中的原因。</p><p>当然了，如上代码中 <code>customElement</code> 只有两个属性，实际上这并不能满足需求，即使元素的格式由我们自行定义，但还是要有一定的限制，例如元素会有子节点，子节点也需要保存对父节点的引用，元素自身也会有属性/特性等等。一个最小且完整的元素定义应该包含以下属性：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> customElement <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      type<span class="token punctuation">,</span> <span class="token comment">// 元素的类型：ELEMENT ---&gt; 标签元素；TEXT ---&gt; 文本</span></span>
<span class="line">      tag<span class="token punctuation">,</span> <span class="token comment">// 当 type === &#39;ELEMENT&#39; 时，tag 属性为标签名字</span></span>
<span class="line">      parentNode<span class="token punctuation">,</span> <span class="token comment">// 对父节点的引用</span></span>
<span class="line">      children<span class="token punctuation">,</span> <span class="token comment">// 子节点</span></span>
<span class="line">      props<span class="token punctuation">,</span>  <span class="token comment">// 当 type === &#39;ELEMENT&#39; 时，props 中存储着元素的属性/特性</span></span>
<span class="line">      eventListeners<span class="token punctuation">,</span>  <span class="token comment">// 当 type === &#39;ELEMENT&#39; 时，eventListeners 中存储着元素的事件信息</span></span>
<span class="line">      text  <span class="token comment">// 当 type === &#39;TEXT&#39; 时，text 存储着文本内容</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在 <code>customElement</code> 就是一个能完全代替真实 DOM 对象的模拟实现了，我们用它修改之前的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> <span class="token punctuation">{</span> render <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">createRenderer</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">nodeOps</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">createElement</span><span class="token punctuation">(</span><span class="token parameter">tag</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">const</span> customElement <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;ELEMENT&#39;</span><span class="token punctuation">,</span></span>
<span class="line">            tag<span class="token punctuation">,</span></span>
<span class="line">            <span class="token literal-property property">parentNode</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token literal-property property">eventListeners</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token keyword">null</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          <span class="token keyword">return</span> customElement</span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，由于 <code>nodeOps.createElement</code> 函数用于创建元素节点，因此 <code>type</code> 属性的值为 <code>&#39;ELEMENT&#39;</code>；刚刚创建的元素还不能确定其父节点，因此 <code>parentNode</code> 为 <code>null</code>；用于存储子节点的 <code>children</code> 属性被初始化为一个数组，<code>props</code> 属性和 <code>eventListeners</code> 被初始化为空对象；最后的 <code>text</code> 为 <code>null</code>，因为它不是一个文本节点。</p><p>现在创建元素节点的功能已经实现，那么创建文本节点呢？如下：</p><pre><code>const { render } = createRenderer({
  nodeOps: {
    createElement(tag) {
      const customElement = {/* 省略... */}
      return customElement
    },
    createText(text) {
      const customElement = {
        type: &#39;TEXT&#39;,
        parentNode: null,
        text: text
      }
      return customElement
    }
  }
})
</code></pre><p>文本元素的 <code>type</code> 类型值为 <code>&#39;TEXT&#39;</code>，<code>parentNode</code> 同样被初始化为 <code>unll</code>，<code>text</code> 属性存储着文本节点的内容。由于文本元素没有子节点、属性/特性、事件等信息，因此不需要其他描述信息。</p><p>文本节点与元素节点的创建都已经实现，接下来我们看看当元素被追加时应该如何处理，即 <code>nodeOps.appendChild</code> 函数的实现：</p><pre><code>const { render } = createRenderer({
  nodeOps: {
    createElement(tag) {
      const customElement = {/* 省略... */}
      return customElement
    },
    createText(text) {
      const customElement = {/* 省略... */}
      return customElement
    },
    appendChild(parent, child) {
      // 简历父子关系
      child.parentNode = parent
      parent.children.push(child)
    }
  }
})
</code></pre><p>如上高亮代码所示，追加节点时我们要做的就是建立节点间正确的父子关系，在 Web 平台下，当我们调用 <code>el.appendChild</code> 函数时，父子关系是由浏览器负责建立的，但在模拟实现中，这个关系需要我们自己来维护。不过好在这很简单，让子元素的 <code>parentNode</code> 指向父元素，同时将子元素添加到父元素的 <code>children</code> 数组中即可。</p><p>类似的，如下是 <code>nodeOps.removeChild</code> 函数的实现：</p><pre><code>const { render } = createRenderer({
  nodeOps: {
    createElement(tag) {/* 省略... */},
    createText(text) {/* 省略... */},
    appendChild(parent, child) {
      // 简历父子关系
      child.parentNode = parent
      parent.children.push(child)
    },
    removeChild(parent, child) {
      // 找到将要移除的元素 child 在父元素的 children 中的位置
      const i = parent.children.indexOf(child)
      if (i &gt; -1) {
        // 如果找到了，则将其删除
        parent.children.splice(i, 1)
      } else {
        // 没找到，说明渲染器出了问题，例如没有在 nodeOps.appendChild 函数中维护正确的父子关系等
        // 这时需要打印错误信息，以提示开发者
        console.error(&#39;target: &#39;, child)
        console.error(&#39;parent: &#39;, parent)
        throw Error(&#39;target 不是 parent 的子节点&#39;)
      }
      // 清空父子链
      child.parentNode = null
    }
  }
})
</code></pre><p>如上高亮代码所示，在移除节点时，思路也很简单，首先需要在父节点的 <code>children</code> 属性中查找即将要被移除的节点的位置索引，如果找到了，那么就直接将其从父节点的 <code>children</code> 数组中移除即可。如果没有找到则说明渲染器出问题了，例如在你实现自定义渲染器时没有在 <code>nodeOps.appendChild</code> 函数或 <code>nodeOps.insertBefore</code> 函数中维护正确的父子关系，这时我们需要打印错误信息以提示开发者。最后不要忘记清空父子链。</p><p>通过如上的讲解，你可能已经领会到了，我们所做的其实就是在模拟 Web 平台在操作元素时的行为，并且这个模拟的思路也及其简单。实际上，当我们实现了所有 <code>nodeOps</code> 下的抽象函数之后，那么这个类似于 <code>@vue/runtime-test</code> 的自定义渲染器就基本完成了。当然，不要忘记的是我们还需要实现 <code>patchData</code> 函数，这可能比你想象的要简单的多，如下高亮代码所示：</p><pre><code>const { render } = createRenderer({
  nodeOps: {
    createElement(tag) {/* 省略... */},
    createText(text) {/* 省略... */},
    appendChild(parent, child) {/* 省略... */},
    removeChild(parent, child) {/* 省略... */}
    // 其他 nodeOps 函数的实现
  },
  patchData(
    el,
    key,
    prevValue,
    nextValue
  ) {
    // 将属性添加到元素的 props 对象下
    el.props[key] = nextValue
    // 我们将属性名字中前两个字符是 &#39;o&#39; 和 &#39;n&#39; 的属性认为是事件绑定
    if (key[0] === &#39;o&#39; &amp;&amp; key[1] === &#39;n&#39;) {
      // 如果是事件，则将事件添加到元素的 eventListeners 对象下
      const event = key.slice(2).toLowerCase()
      ;(el.eventListeners || (el.eventListeners = {}))[event] = nextValue
    }
  }
})
</code></pre><p>在创建渲染器时我们需要实现 <code>patchData</code> 函数的功能，它的功能是用来更新元素自身的属性/特性的，在之前的讲解中我们实现了 Web 平台中 <code>patchData</code> 函数，然而在这个模拟实现中，我们要做的事情就少了很多。只需要把元素的属性添加到元素的 <code>props</code> 对象中即可，同时如果是事件的话，我们也只需要将其添加到元素的 <code>eventListeners</code> 对象中就可以了。</p><p>实际上，本节我们所实现的自定义渲染器，就能够满足我们对组件测试的需求，我们可以利用它来测试组件所渲染内容的正确性。如果你想要进一步提升该自定义渲染器的能力，例如希望该渲染器有能力在控制台中打印出操作元素的信息，也很简单，我们以创建元素为例，如下代码所示：</p><pre><code>const { render } = createRenderer({
  nodeOps: {
    createElement(tag) {
      const customElement = {
        type: &#39;ELEMENT&#39;,
        tag,
        parentNode: null,
        children: [],
        props: {},
        eventListeners: {},
        text: null
      }

      console.table({
        type: &#39;CREATE ELEMENT&#39;,
        targetNode: customElement
      })

      return customElement
    }
  }
})
</code></pre><p>只需要在 <code>nodeOps.createElement</code> 函数中调用 <code>console.table</code> 进行打印你想要的信息即可，例如我们打印了一个对象，该对象包含 <code>type</code> 属性用于指示当前操作元素的类型，所以对于创建元素来说，我们为 <code>type</code> 属性赋值了字符串 <code>&#39;CREATE ELEMENT&#39;</code>，同时将目标节点也打印了出来(即 <code>targetNode</code>)。类似的，追加节点可以打印如下信息：</p><pre><code>const { render } = createRenderer({
  nodeOps: {
    createElement(tag) {/* 省略... */},
    appendChild(parent, child) {
      // 简历父子关系
      child.parentNode = parent
      parent.children.push(child)

      console.table({
        type: &#39;APPEND&#39;,
        targetNode: child,
        parentNode: parent
      })
    }
  }
})
</code></pre><p>怎么样，是不是很简单。当然了这只是自定义渲染器的应用之一，对于自定义渲染器来说，它可发挥的空间还是非常大的，举几个例子：</p><ul><li>渲染到 <code>PDF</code>，我们可以实现一个自定义渲染器如 <code>vue-pdf-renderer</code>，它能够将 <code>Vue</code> 组件渲染为 <code>PDF</code> 文件。</li><li>渲染到文件系统，我们可以实现一个 <code>vue-file-renderer</code>，它可以根据 <code>VNode</code> 的结构在本地渲染与该结构相同的文件目录。</li><li><code>canvas</code> 渲染器，我们可以实现一个 <code>vue-canvas-renderer</code>，它可以从渲染器的层面渲染 <code>canvas</code>，而非组件层面。</li></ul><p>以上仅仅是简单的列了几个小想法，实际上由于自定义渲染器本身就是平台无关的，很多事情需要看特定平台的能力，渲染器为你提供的就是在组件层面的抽象能力以及虚拟 DOM 的更新算法，剩下的就靠社区的想象力和实现能力了。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/v39py7lxq5" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/v39py7lxq5</a><a href="https://codesandbox.io/s/v39py7lxq5" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h2 id="references" tabindex="-1"><a class="header-anchor" href="#references"><span>References</span></a></h2><ul><li><a href="https://www.youtube.com/watch?reload=9&amp;v=cCOL7MC4Pl0&amp;feature=youtu.be" target="_blank" rel="noopener noreferrer">Jake Archibald: In The Loop - JSConf.Asia 2018 (opens new window)</a></li><li><a href="https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context" target="_blank" rel="noopener noreferrer">https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context</a><a href="https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context" target="_blank" rel="noopener noreferrer"> (opens new window)</a></li><li><a href="https://html.spec.whatwg.org/#event-loop-processing-model" target="_blank" rel="noopener noreferrer">https://html.spec.whatwg.org/#event-loop-processing-model</a><a href="https://html.spec.whatwg.org/#event-loop-processing-model" target="_blank" rel="noopener noreferrer"> (opens new window)</a></li></ul><p>阅读全文</p>`,76),c=[p];function o(l,i){return a(),s("div",null,c)}const u=n(t,[["render",o],["__file","Vue-自定义渲染器和异步渲染.html.vue"]]),d=JSON.parse('{"path":"/Vue-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E5%92%8C%E5%BC%82%E6%AD%A5%E6%B8%B2%E6%9F%93.html","title":"","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"自定义渲染器的原理","slug":"自定义渲染器的原理","link":"#自定义渲染器的原理","children":[]},{"level":2,"title":"自定义渲染器的应用","slug":"自定义渲染器的应用","link":"#自定义渲染器的应用","children":[]},{"level":2,"title":"References","slug":"references","link":"#references","children":[]}],"git":{"updatedTime":1717376101000,"contributors":[{"name":"guoli","email":"guoli@zhihu.com","commits":1}]},"filePathRelative":"Vue-自定义渲染器和异步渲染.md","excerpt":"<p>原文链接: <a href=\\"https://interview.poetries.top/principle-docs/vue/06-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E5%92%8C%E5%BC%82%E6%AD%A5%E6%B8%B2%E6%9F%93.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://interview.poetries.top/principle-docs/vue/06-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E5%92%8C%E5%BC%82%E6%AD%A5%E6%B8%B2%E6%9F%93.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86</a></p>"}');export{u as comp,d as data};
