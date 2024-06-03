import{_ as s,c as n,o as a,a as e}from"./app-ByrCXkCX.js";const p="/images/s_poetries_work_uploads_2024_02_91644f2f0ad1d19b.png",t={},o=e(`<p>原文链接: <a href="https://interview.poetries.top/principle-docs/vue/04-%E8%AE%BE%E8%AE%A1%20VNode.html" target="_blank" rel="noopener noreferrer">https://interview.poetries.top/principle-docs/vue/04-%E8%AE%BE%E8%AE%A1%20VNode.html</a></p><p>上一章讲述了组件的本质，知道了一个组件的产出是 <code>VNode</code>，渲染器(<code>Renderer</code>)的渲染目标也是 <code>VNode</code>。可见 <code>VNode</code> 在框架设计的整个环节中都非常重要，甚至<strong>设计<code>VNode</code> 本身就是在设计框架</strong>，<code>VNode</code> 的设计还会对后续算法的性能产生影响。本章我们就着手对 <code>VNode</code> 进行一定的设计，尝试用 <code>VNode</code> 描述各类渲染内容。</p><h2 id="用-vnode-描述真实-dom" tabindex="-1"><a class="header-anchor" href="#用-vnode-描述真实-dom"><span>用 VNode 描述真实 DOM</span></a></h2><p>一个 <code>html</code> 标签有它的名字、属性、事件、样式、子节点等诸多信息，这些内容都需要在 <code>VNode</code> 中体现，我们可以用如下对象来描述一个红色背景的正方形 <code>div</code> 元素：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> elementVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">style</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token string">&#39;100px&#39;</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token string">&#39;100px&#39;</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">backgroundColor</span><span class="token operator">:</span> <span class="token string">&#39;red&#39;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们使用 <code>tag</code> 属性来存储标签的名字，用 <code>data</code> 属性来存储该标签的附加信息，比如 <code>style</code>、<code>class</code>、事件等，通常我们把一个 <code>VNode</code> 对象的 <code>data</code> 属性称为 <code>VNodeData</code>。</p><p>为了描述子节点，我们需要给 <code>VNode</code> 对象添加 <code>children</code> 属性，如下 <code>VNode</code> 对象用来描述一个有子节点的 <code>div</code> 元素：</p><pre><code>const elementVNode = {
  tag: &#39;div&#39;,
  data: null,
  children: {
    tag: &#39;span&#39;,
    data: null
  }
}
</code></pre><p>若有多个子节点，则可以把 <code>children</code> 属性设计为一个数组：</p><pre><code>const elementVNode = {
  tag: &#39;div&#39;,
  data: null,
  children: [
    {
      tag: &#39;h1&#39;,
      data: null
    },
    {
      tag: &#39;p&#39;,
      data: null
    }
  ]
}
</code></pre><p>除了标签元素之外，DOM 中还有文本节点，我们可以用如下 <code>VNode</code> 对象来描述一个文本节点：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> textVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token string">&#39;文本内容&#39;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上，由于文本节点没有标签名字，所以它的 <code>tag</code> 属性值为 <code>null</code>。由于文本节点也无需用额外的 <code>VNodeData</code> 来描述附加属性，所以其 <code>data</code> 属性值也是 <code>null</code>。</p><p>唯一需要注意的是我们使用 <code>children</code> 属性来存储一个文本节点的文本内容。有的同学可能会问：“可不可以新建一个属性 <code>text</code> 来存储文本内容呢？”</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> textVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;文本内容&#39;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这完全没有问题，这取决于你如何设计，但是<strong>尽可能的在保证语义能够说得通的情况下复用属性，会使<code>VNode</code> 对象更加轻量</strong>，所以我们采取使用 <code>children</code> 属性来存储文本内容的方案。</p><p>如下是一个以文本节点作为子节点的 <code>div</code> 标签的 <code>VNode</code> 对象：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> elementVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token string">&#39;文本内容&#39;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="用-vnode-描述抽象内容" tabindex="-1"><a class="header-anchor" href="#用-vnode-描述抽象内容"><span>用 VNode 描述抽象内容</span></a></h2><p>什么是抽象内容呢？组件就属于抽象内容，比如你在 模板 或 <code>jsx</code> 中使用了一个组件，如下：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MyComponent</span> <span class="token punctuation">/&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你的意图并不是要在页面中渲染一个名为 <code>MyComponent</code> 的标签元素，而是要渲染 <code>MyComponent</code> 组件所产出的内容。</p><p>但我们仍然需要使用 <code>VNode</code> 来描述 <code>&lt;MyComponent/&gt;</code>，并给此类用来描述组件的 <code>VNode</code> 添加一个标识，以便在挂载的时候有办法区分一个 <code>VNode</code> 到底是普通的 <code>html</code> 标签还是组件。</p><p>我们可以使用如下 <code>VNode</code> 对象来描述上面的模板：</p><pre><code>const elementVNode = {
  tag: &#39;div&#39;,
  data: null,
  children: {
    tag: MyComponent,
    data: null
  }
}
</code></pre><p>如上，用来描述组件的 <code>VNode</code> 其 <code>tag</code> 属性值引用的就是组件类(或函数)本身，而不是标签名称字符串。所以理论上：<strong>我们可以通过检查<code>tag</code> 属性值是否是字符串来确定一个 <code>VNode</code> 是否是普通标签</strong>。</p><p>除了组件之外，还有两种抽象的内容需要描述，即 <code>Fragment</code> 和 <code>Portal</code>。我们先来了解一下什么是 <code>Fragment</code> 以及它所解决的问题。</p><p><code>Fragment</code> 的寓意是要渲染一个片段，假设我们有如下模板：</p><pre><code>&lt;template&gt;
  &lt;table&gt;
    &lt;tr&gt;
      &lt;Columns /&gt;
    &lt;/tr&gt;
  &lt;/table&gt;
&lt;/template&gt;
</code></pre><p>组件 <code>Columns</code> 会返回多个 <code>&lt;td&gt;</code> 元素：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大家思考一个问题，如上模板的 <code>VNode</code> 如何表示？如果模板中只有一个 <code>td</code> 标签，即只有一个根元素，这很容易表示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> elementVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;td&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是模板中不仅仅只有一个 <code>td</code> 标签，而是有多个 <code>td</code> 标签，即多个根元素，这如何表示？此时我们就需要引入一个抽象元素，也就是我们要介绍的 <code>Fragment</code>。</p><pre><code>const Fragment = Symbol()
const fragmentVNode = {
  // tag 属性值是一个唯一标识
  tag: Fragment,
  data: null,
  children: [
    {
      tag: &#39;td&#39;,
      data: null
    },
    {
      tag: &#39;td&#39;,
      data: null
    },
    {
      tag: &#39;td&#39;,
      data: null
    }
  ]
}
</code></pre><p>如上，我们把所有 <code>td</code> 标签都作为 <code>fragmentVNode</code> 的子节点，根元素并不是一个实实在在的真实 DOM，而是一个抽象的标识，即 <code>Fragment</code>。</p><p>当渲染器在渲染 <code>VNode</code> 时，如果发现该 <code>VNode</code> 的类型是 <code>Fragment</code>，就只需要把该 <code>VNode</code> 的子节点渲染到页面。</p><p>TIP</p><p>在上面的代码中 <code>fragmentVNode.tag</code> 属性的值是一个通过 <code>Symbol</code> 创建的唯一标识，但实际上我们更倾向于给 <code>VNode</code> 对象添加一个 <code>flags</code> 属性，用来代表该 <code>VNode</code> 的类型，这在本章的后面会详细说明。</p><p>再来看看 <code>Portal</code>，什么是 <code>Portal</code> 呢？</p><p>一句话：它允许你把内容渲染到任何地方。其应用场景是，假设你要实现一个蒙层组件 <code>&lt;Overlay/&gt;</code>，要求是该组件的 <code>z-index</code> 的层级最高，这样无论在哪里使用都希望它能够遮住全部内容，你可能会将其用在任何你需要蒙层的地方。</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>box<span class="token punctuation">&quot;</span></span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">z-index</span><span class="token punctuation">:</span> -1<span class="token punctuation">;</span></span><span class="token punctuation">&quot;</span></span></span><span class="token punctuation">&gt;</span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Overlay</span> <span class="token punctuation">/&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上，不幸的事情发生了，在没有 <code>Portal</code> 的情况下，上面的 <code>&lt;Overlay/&gt;</code> 组件的内容只能渲染到 <code>id=&quot;box&quot;</code> 的 <code>div</code> 标签下，这就会导致蒙层的层级失效甚至布局都可能会受到影响。</p><p>其实解决办法也很简单，假如 <code>&lt;Overlay/&gt;</code> 组件要渲染的内容不受 DOM 层级关系限制，即可以渲染到任何位置，该问题将迎刃而解。</p><p>使用 <code>Portal</code> 可以这样编写 <code>&lt;Overlay/&gt;</code> 组件的模板：</p><pre><code>&lt;template&gt;
  &lt;Portal target=&quot;#app-root&quot;&gt;
    &lt;div class=&quot;overlay&quot;&gt;&lt;/div&gt;
  &lt;/Portal&gt;
&lt;/template&gt;
</code></pre><p>其最终效果是，无论你在何处使用 <code>&lt;Overlay/&gt;</code> 组件，它都会把内容渲染到 <code>id=&quot;app-root&quot;</code> 的元素下。由此可知，所谓 <code>Portal</code> 就是把子节点渲染到给定的目标，我们可以使用如下 <code>VNode</code> 对象来描述上面这段模板：</p><pre><code>const Portal = Symbol()
const portalVNode = {
  tag: Portal,
  data: {
    target: &#39;#app-root&#39;
  },
  children: {
    tag: &#39;div&#39;,
    data: {
      class: &#39;overlay&#39;
    }
  }
}
</code></pre><p><code>Portal</code> 类型的 <code>VNode</code> 与 <code>Fragment</code> 类型的 <code>VNode</code> 类似，都需要一个唯一的标识，来区分其类型，目的是告诉渲染器如何渲染该 <code>VNode</code>。</p><h2 id="vnode-的种类" tabindex="-1"><a class="header-anchor" href="#vnode-的种类"><span>VNode 的种类</span></a></h2><p>当 <code>VNode</code> 描述不同的事物时，其属性的值也各不相同。比如一个 <code>VNode</code> 对象是 <code>html</code> 标签的描述，那么其 <code>tag</code> 属性值就是一个字符串，即标签的名字；如果是组件的描述，那么其 <code>tag</code> 属性值则引用组件类(或函数)本身；如果是文本节点的描述，那么其 <code>tag</code> 属性值为 <code>null</code>。</p><p>最终我们发现，<strong>不同类型的<code>VNode</code> 拥有不同的设计</strong>，这些差异积少成多，所以我们完全可以将它们分门别类。</p><p>总的来说，我们可以把 <code>VNode</code> 分成五类，分别是：<strong><code>html/svg</code> 元素</strong>、<strong>组件</strong> 、<strong>纯文本</strong> 、<strong>Fragment</strong> 以及 <strong>Portal</strong> ：</p><p>如上图所示，我们可以把组件细分为 <strong>有状态组件</strong> 和 <strong>函数式组件</strong> 。同时有状态组件还可以细分为三部分：<strong>普通的有状态组件</strong> 、<strong>需要被 keepAlive 的有状态组件</strong> 以及 <strong>已经被 keepAlive 的有状态组件</strong> 。</p><p>但无论是普通的有状态组件还是 <code>keepAlive</code> 相关的有状态组件，它们都是<strong>有状态组件</strong> 。所以我们在设计 <code>VNode</code> 时可以将它们作为一类看待。</p><h2 id="使用-flags-作为-vnode-的标识" tabindex="-1"><a class="header-anchor" href="#使用-flags-作为-vnode-的标识"><span>使用 flags 作为 VNode 的标识</span></a></h2><p>既然 <code>VNode</code> 有类别之分，我们就有必要使用一个唯一的标识，来标明某一个 <code>VNode</code> 属于哪一类。同时给 <code>VNode</code> 添加 <code>flags</code> 也是 <code>Virtual DOM</code> 算法的优化手段之一。</p><p>比如在 <code>Vue2</code> 中区分 <code>VNode</code> 是 <code>html</code> 元素还是组件亦或是普通文本，是这样做的：</p><ul><li>1、拿到 <code>VNode</code> 后先尝试把它当作组件去处理，如果成功地创建了组件，那说明该 <code>VNode</code> 就是组件的 <code>VNode</code></li><li>2、如果没能成功地创建组件，则检查 <code>vnode.tag</code> 是否有定义，如果有定义则当作普通标签处理</li><li>3、如果 <code>vnode.tag</code> 没有定义则检查是否是注释节点</li><li>4、如果不是注释节点，则会把它当作文本节点对待</li></ul><p>以上这些判断都是在挂载(或<code>patch</code>)阶段进行的，换句话说，一个 <code>VNode</code> 到底描述的是什么是在挂载或 <code>patch</code> 的时候才知道的。这就带来了两个难题：<strong>无法从<code>AOT</code> 的层面优化</strong>、<strong>开发者无法手动优化</strong> 。</p><p>为了解决这个问题，我们的思路是在 <code>VNode</code> 创建的时候就把该 <code>VNode</code> 的类型通过 <code>flags</code> 标明，这样在挂载或 <code>patch</code> 阶段通过 <code>flags</code> 可以直接避免掉很多消耗性能的判断，我们先提前感受一下渲染器的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// VNode 是普通标签</span></span>
<span class="line">      <span class="token function">mountElement</span><span class="token punctuation">(</span><span class="token comment">/* ... */</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// VNode 是组件</span></span>
<span class="line">      <span class="token function">mountComponent</span><span class="token punctuation">(</span><span class="token comment">/* ... */</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">TEXT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// VNode 是纯文本</span></span>
<span class="line">      <span class="token function">mountText</span><span class="token punctuation">(</span><span class="token comment">/* ... */</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上，采用了位运算，在一次挂载任务中如上判断很可能大量的进行，使用位运算在一定程度上再次拉升了运行时性能。</p><p>TIP</p><p>实际上 <code>Vue3</code> 在 <code>Virtual DOM</code> 的优化上采用的就是 <a href="https://github.com/infernojs/inferno" target="_blank" rel="noopener noreferrer">inferno (opens new window)</a> 的手段。具体如何做我们会在后面的章节介绍。</p><p>这就意味着我们在设计 <code>VNode</code> 对象时，应该包含 <code>flags</code> 字段：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// VNode 对象</span></span>
<span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> <span class="token operator">...</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="枚举值-vnodeflags" tabindex="-1"><a class="header-anchor" href="#枚举值-vnodeflags"><span>枚举值 VNodeFlags</span></a></h2><p>那么一个 <code>VNode</code> 对象的 <code>flags</code> 可以是哪些值呢？那就看 <code>VNode</code> 有哪些种类就好了，每一个 <code>VNode</code> 种类我们都为其分配一个 <code>flags</code> 值即可，我们把它设计成一个枚举值并取名为 <code>VNodeFlags</code>，在 <code>javascript</code> 里就用一个对象来表示即可：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> VNodeFlags <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// html 标签</span></span>
<span class="line">      <span class="token constant">ELEMENT_HTML</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// SVG 标签</span></span>
<span class="line">      <span class="token constant">ELEMENT_SVG</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">    </span>
<span class="line">      <span class="token comment">// 普通有状态组件</span></span>
<span class="line">      <span class="token constant">COMPONENT_STATEFUL_NORMAL</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">2</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// 需要被keepAlive的有状态组件</span></span>
<span class="line">      <span class="token constant">COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">3</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// 已经被keepAlive的有状态组件</span></span>
<span class="line">      <span class="token constant">COMPONENT_STATEFUL_KEPT_ALIVE</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">4</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// 函数式组件</span></span>
<span class="line">      <span class="token constant">COMPONENT_FUNCTIONAL</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">5</span><span class="token punctuation">,</span></span>
<span class="line">    </span>
<span class="line">      <span class="token comment">// 纯文本</span></span>
<span class="line">      <span class="token constant">TEXT</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">6</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// Fragment</span></span>
<span class="line">      <span class="token constant">FRAGMENT</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">7</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// Portal</span></span>
<span class="line">      <span class="token constant">PORTAL</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">8</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上这些枚举属性所代表的意义能够与下面的图片一一对应上：</p><p><img src="`+p+`" alt=""></p><p>我们注意到，这些枚举属性的值基本都是通过将十进制数字 <code>1</code> 左移不同的位数得来的。根据这些基本的枚举属性值，我们还可以派生出额外的三个标识：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// html 和 svg 都是标签元素，可以用 ELEMENT 表示</span></span>
<span class="line">    VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT</span> <span class="token operator">=</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT_HTML</span> <span class="token operator">|</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT_SVG</span></span>
<span class="line">    <span class="token comment">// 普通有状态组件、需要被keepAlive的有状态组件、已经被keepAlice的有状态组件 都是“有状态组件”，统一用 COMPONENT_STATEFUL 表示</span></span>
<span class="line">    VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_STATEFUL</span> <span class="token operator">=</span></span>
<span class="line">      VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_STATEFUL_NORMAL</span> <span class="token operator">|</span></span>
<span class="line">      VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE</span> <span class="token operator">|</span></span>
<span class="line">      VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_STATEFUL_KEPT_ALIVE</span></span>
<span class="line">    <span class="token comment">// 有状态组件 和  函数式组件都是“组件”，用 COMPONENT 表示</span></span>
<span class="line">    VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span> <span class="token operator">=</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_STATEFUL</span> <span class="token operator">|</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_FUNCTIONAL</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中 <code>VNodeFlags.ELEMENT</code>、<code>VNodeFlags.COMPONENT_STATEFUL</code> 以及 <code>VNodeFlags.COMPONENT</code> 是由基本标识通过<code>按位或(|)</code>运算得到的，这三个派生值将用于辅助判断。</p><p>有了这些 <code>flags</code> 之后，我们在创建 <code>VNode</code> 的时候就可以预先为其打上 <code>flags</code>，以标明该 <code>VNode</code> 的类型：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// html 元素节点</span></span>
<span class="line">    <span class="token keyword">const</span> htmlVnode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT_HTML</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// svg 元素节点</span></span>
<span class="line">    <span class="token keyword">const</span> svgVnode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT_SVG</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;svg&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 函数式组件</span></span>
<span class="line">    <span class="token keyword">const</span> functionalComponentVnode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_FUNCTIONAL</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> MyFunctionalComponent</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 普通的有状态组件</span></span>
<span class="line">    <span class="token keyword">const</span> normalComponentVnode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_STATEFUL_NORMAL</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> MyStatefulComponent</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// Fragment</span></span>
<span class="line">    <span class="token keyword">const</span> fragmentVnode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">FRAGMENT</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token keyword">null</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// Portal</span></span>
<span class="line">    <span class="token keyword">const</span> portalVnode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">PORTAL</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识，tag 属性用来存储 Portal 的 target</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> target</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如下是利用 <code>VNodeFlags</code> 判断 <code>VNode</code> 类型的例子，比如判断一个 <code>VNode</code> 是否是组件：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 使用按位与(&amp;)运算</span></span>
<span class="line">    functionalComponentVnode<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span> <span class="token comment">// 真</span></span>
<span class="line">    normalComponentVnode<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span> <span class="token comment">// 真</span></span>
<span class="line">    htmlVnode<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span> <span class="token comment">// 假</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>熟悉位运算的话，理解起来很简单。这实际上是多种位运算技巧中的一个小技巧。我们可以列一个表格：</p><table><thead><tr><th>VNodeFlags</th><th>左移运算</th><th>32 位的 bit 序列(出于简略，只用 9 位表示)</th></tr></thead><tbody><tr><td>ELEMENT_HTML</td><td>无</td><td>00000000<code>1</code></td></tr><tr><td>ELEMENT_SVG</td><td>1 &lt;&lt; 1</td><td>0000000<code>1</code>0</td></tr><tr><td>COMPONENT_STATEFUL_NORMAL</td><td>1 &lt;&lt; 2</td><td>000000<code>1</code>00</td></tr><tr><td>COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE</td><td>1 &lt;&lt; 3</td><td>00000<code>1</code>000</td></tr><tr><td>COMPONENT_STATEFUL_KEPT_ALIVE</td><td>1 &lt;&lt; 4</td><td>0000<code>1</code>0000</td></tr><tr><td>COMPONENT_FUNCTIONAL</td><td>1 &lt;&lt; 5</td><td>000<code>1</code>00000</td></tr><tr><td>TEXT</td><td>1 &lt;&lt; 6</td><td>00<code>1</code>000000</td></tr><tr><td>FRAGMENT</td><td>1 &lt;&lt; 7</td><td>0<code>1</code>0000000</td></tr><tr><td>PORTAL</td><td>1 &lt;&lt; 8</td><td><code>1</code>00000000</td></tr></tbody></table><p>根据上表展示的基本 <code>flags</code> 值可以很容易地得出下表：</p><table><thead><tr><th>VNodeFlags</th><th>32 位的比特序列(出于简略，只用 9 位表示)</th></tr></thead><tbody><tr><td>ELEMENT</td><td>0000000<code>1</code> <code>1</code></td></tr><tr><td>COMPONENT_STATEFUL</td><td>0000<code>1</code> <code>1</code> <code>1</code>00</td></tr><tr><td>COMPONENT</td><td>000<code>1</code> <code>1</code> <code>1</code> <code>1</code>00</td></tr></tbody></table><p>所以很自然的，只有 <code>VNodeFlags.ELEMENT_HTML</code> 和 <code>VNodeFlags.ELEMENT_SVG</code> 与 <code>VNodeFlags.ELEMENT</code> 进行按位与(<code>&amp;</code>)运算才会得到非零值，即为真。</p><h2 id="children-和-childrenflags" tabindex="-1"><a class="header-anchor" href="#children-和-childrenflags"><span>children 和 ChildrenFlags</span></a></h2><p>DOM 是一棵树早已家至人说，既然 <code>VNode</code> 是真实渲染内容的描述，那么它必然也是一棵树。在之前的设计中，我们给 <code>VNode</code> 定义了 <code>children</code> 属性，用来存储子 <code>VNode</code>。大家思考一下，一个标签的子节点会有几种情况？</p><p>总的来说无非有以下几种：</p><ul><li>没有子节点</li><li>只有一个子节点</li><li>多个子节点 <ul><li>有 <code>key</code></li><li>无 <code>key</code></li></ul></li><li>不知道子节点的情况</li></ul><p>我们可以用一个叫做 <code>ChildrenFlags</code> 的对象来枚举出以上这些情况，作为一个 <code>VNode</code> 的子节点的类型标识：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> ChildrenFlags <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 未知的 children 类型</span></span>
<span class="line">      <span class="token constant">UNKNOWN_CHILDREN</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// 没有 children</span></span>
<span class="line">      <span class="token constant">NO_CHILDREN</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// children 是单个 VNode</span></span>
<span class="line">      <span class="token constant">SINGLE_VNODE</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">    </span>
<span class="line">      <span class="token comment">// children 是多个拥有 key 的 VNode</span></span>
<span class="line">      <span class="token constant">KEYED_VNODES</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">2</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// children 是多个没有 key 的 VNode</span></span>
<span class="line">      <span class="token constant">NONE_KEYED_VNODES</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">3</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于 <code>ChildrenFlags.KEYED_VNODES</code> 和 <code>ChildrenFlags.NONE_KEYED_VNODES</code> 都属于多个 <code>VNode</code>，所以我们可以派生出一个“多节点”标识，以方便程序的判断：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    ChildrenFlags<span class="token punctuation">.</span><span class="token constant">MULTIPLE_VNODES</span> <span class="token operator">=</span> ChildrenFlags<span class="token punctuation">.</span><span class="token constant">KEYED_VNODES</span> <span class="token operator">|</span> ChildrenFlags<span class="token punctuation">.</span><span class="token constant">NONE_KEYED_VNODES</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这样我们判断一个 <code>VNode</code> 的子节点是否是多个子节点就变得容易多了：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    someVNode<span class="token punctuation">.</span>childFlags <span class="token operator">&amp;</span> ChildrenFlags<span class="token punctuation">.</span><span class="token constant">MULTIPLE_VNODES</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>TIP</p><p>为什么 <code>children</code> 也需要标识呢？原因只有一个：<strong>为了优化</strong> 。在后面讲解 <code>diff</code> 算法的章节中你将会意识到，这些信息是至关重要的。</p><p>在一个 <code>VNode</code> 对象中，我们使用 <code>flags</code> 属性来存储该 <code>VNode</code> 的类型，类似的，我们将使用 <code>childFlags</code> 来存储子节点的类型，我们来举一些实际的例子：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 没有子节点的 div 标签</span></span>
<span class="line">    <span class="token keyword">const</span> elementVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT_HTML</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">childFlags</span><span class="token operator">:</span> ChildrenFlags<span class="token punctuation">.</span><span class="token constant">NO_CHILDREN</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 文本节点的 childFlags 始终都是 NO_CHILDREN</span></span>
<span class="line">    <span class="token keyword">const</span> textVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token string">&#39;我是文本&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">childFlags</span><span class="token operator">:</span> ChildrenFlags<span class="token punctuation">.</span><span class="token constant">NO_CHILDREN</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 拥有多个使用了key的 li 标签作为子节点的 ul 标签</span></span>
<span class="line">    <span class="token keyword">const</span> elementVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT_HTML</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;ul&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">childFlags</span><span class="token operator">:</span> ChildrenFlags<span class="token punctuation">.</span><span class="token constant">KEYED_VNODES</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token number">0</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token number">1</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 只有一个子节点的 Fragment</span></span>
<span class="line">    <span class="token keyword">const</span> elementVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">FRAGMENT</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">childFlags</span><span class="token operator">:</span> ChildrenFlags<span class="token punctuation">.</span><span class="token constant">SINGLE_VNODE</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">null</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但并非所有类型的 <code>VNode</code> 的 <code>children</code> 属性都是用来存储子 <code>VNode</code>，比如组件的“子 <code>VNode</code>”其实不应该作为 <code>children</code> 而是应该作为 <code>slots</code>，所以我们会定义 <code>VNode.slots</code> 属性来存储这些子 <code>VNode</code>，不过目前来说我们还不需要深入探讨有关插槽的知识。</p><h2 id="vnodedata" tabindex="-1"><a class="header-anchor" href="#vnodedata"><span>VNodeData</span></a></h2><p>前面提到过，<code>VNodeData</code> 指的是 <code>VNode</code> 的 <code>data</code> 属性，它是一个对象：</p><pre><code>{
  flags: ...,
  tag: ...,
  // VNodeData
  data: {
    ...
  }
}
</code></pre><p><code>VNodeData</code> 顾名思义，它就是 <code>VNode</code> 数据，用于对 <code>VNode</code> 进行描述。举个例子，假如一个 <code>VNode</code> 的类型是 <code>html</code> 标签，则 <code>VNodeData</code> 中可以包含 <code>class</code>、<code>style</code> 以及一些事件，这样渲染器在渲染此 <code>VNode</code> 时，才知道这个标签的背景颜色、字体大小以及监听了哪些事件等等。所以从设计角度来讲，任何可以对 <code>VNode</code> 进行描述的内容，我们都可以将其存放到 <code>VNodeData</code> 对象中，如：</p><pre><code>{
  flags: VNodeFlags.ELEMENT_HTML,
  tag: &#39;div&#39;,
  data: {
    class: [&#39;class-a&#39;, &#39;active&#39;],
    style: {
      background: &#39;red&#39;,
      color: &#39;green&#39;
    },
    // 其他数据...
  }
}
</code></pre><p>如果 <code>VNode</code> 的类型是组件，那么我们同样可以用 <code>VNodeData</code> 来描述组件，比如组件的事件、组件的 <code>props</code> 等等，假设有如下模板：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MyComponent</span> <span class="token attr-name">@some-event</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>handler<span class="token punctuation">&quot;</span></span> <span class="token attr-name">prop-a</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>1<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>则其对应的 <code>VNodeData</code> 应为：</p><pre><code>{
  flags: VNodeFlags.COMPONENT_STATEFUL,
  tag: &#39;div&#39;,
  data: {
    on: {
      &#39;some-event&#39;: handler
    },
    propA: &#39;1&#39;
    // 其他数据...
  }
}
</code></pre><p>当然了，只要能够正确地对 <code>VNode</code> 进行描述，具体的数据结构你可以随意设计。我们暂且不限制 <code>VNodeData</code> 的固定格式。</p><p>在后续章节中，我们会根据需求逐渐地完善 <code>VNodeData</code> 的设计。</p><p>至此，我们已经对 <code>VNode</code> 完成了一定的设计，目前为止我们所设计的 <code>VNode</code> 对象如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">VNode</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// _isVNode 属性在上文中没有提到，它是一个始终为 true 的值，有了它，我们就可以判断一个对象是否是 VNode 对象</span></span>
<span class="line">      <span class="token literal-property property">_isVNode</span><span class="token operator">:</span> <span class="token boolean">true</span></span>
<span class="line">      <span class="token comment">// el 属性在上文中也没有提到，当一个 VNode 被渲染为真实 DOM 之后，el 属性的值会引用该真实DOM</span></span>
<span class="line">      <span class="token literal-property property">el</span><span class="token operator">:</span> Element <span class="token operator">|</span> <span class="token keyword">null</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags</span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> string <span class="token operator">|</span> FunctionalComponent <span class="token operator">|</span> ComponentClass <span class="token operator">|</span> <span class="token keyword">null</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> VNodeData <span class="token operator">|</span> <span class="token keyword">null</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> VNodeChildren</span>
<span class="line">      <span class="token literal-property property">childFlags</span><span class="token operator">:</span> ChildrenFlags</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中 <code>_isVNode</code> 属性和 <code>el</code> 属性在上文中没有提到，<code>_isVNode</code> 属性是一个始终为 <code>true</code> 的值，有了它，我们就可以判断一个对象是否是 <code>VNode</code> 对象。<code>el</code> 属性的值在 <code>VNode</code> 被渲染为真实 DOM 之前一直都是 <code>null</code>，当 <code>VNode</code> 被渲染为真实 DOM 之后，<code>el</code> 属性的值会引用该真实 DOM。</p><p>实际上，如果你看过 <code>Vue3</code> 的源码，你会发现在源码中一个 <code>VNode</code> 对象除了包含本节我们所讲到的这些属性之外，还包含诸如 <code>handle</code> 和 <code>contextVNode</code>、<code>parentVNode</code>、<code>key</code>、<code>ref</code>、<code>slots</code> 等其他额外的属性。</p><p>我们之所以没有在本章中包含这些内容，是因为目前来讲，我们根本不需要这些属性，比如 <code>handle</code> 属性仅用于函数式组件，所以我们会在函数式组件原理相关的章节再讲。</p><p>阅读全文</p>`,116),l=[o];function c(d,i){return a(),n("div",null,l)}const u=s(t,[["render",c],["__file","Vue-VNode.html.vue"]]),k=JSON.parse('{"path":"/Vue-VNode.html","title":"","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"用 VNode 描述真实 DOM","slug":"用-vnode-描述真实-dom","link":"#用-vnode-描述真实-dom","children":[]},{"level":2,"title":"用 VNode 描述抽象内容","slug":"用-vnode-描述抽象内容","link":"#用-vnode-描述抽象内容","children":[]},{"level":2,"title":"VNode 的种类","slug":"vnode-的种类","link":"#vnode-的种类","children":[]},{"level":2,"title":"使用 flags 作为 VNode 的标识","slug":"使用-flags-作为-vnode-的标识","link":"#使用-flags-作为-vnode-的标识","children":[]},{"level":2,"title":"枚举值 VNodeFlags","slug":"枚举值-vnodeflags","link":"#枚举值-vnodeflags","children":[]},{"level":2,"title":"children 和 ChildrenFlags","slug":"children-和-childrenflags","link":"#children-和-childrenflags","children":[]},{"level":2,"title":"VNodeData","slug":"vnodedata","link":"#vnodedata","children":[]}],"git":{"updatedTime":1717376101000,"contributors":[{"name":"guoli","email":"guoli@zhihu.com","commits":1}]},"filePathRelative":"Vue-VNode.md","excerpt":"<p>原文链接: <a href=\\"https://interview.poetries.top/principle-docs/vue/04-%E8%AE%BE%E8%AE%A1%20VNode.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://interview.poetries.top/principle-docs/vue/04-%E8%AE%BE%E8%AE%A1%20VNode.html</a></p>\\n<p>上一章讲述了组件的本质，知道了一个组件的产出是 <code>VNode</code>，渲染器(<code>Renderer</code>)的渲染目标也是 <code>VNode</code>。可见 <code>VNode</code>\\n在框架设计的整个环节中都非常重要，甚至<strong>设计<code>VNode</code> 本身就是在设计框架</strong>，<code>VNode</code> 的设计还会对后续算法的性能产生影响。本章我们就着手对\\n<code>VNode</code> 进行一定的设计，尝试用 <code>VNode</code> 描述各类渲染内容。</p>"}');export{u as comp,k as data};
