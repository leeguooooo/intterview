import{_ as n}from"./s_poetries_work_uploads_2024_02_7cb972d068b2d405-BoD5P4Oi.js";import{_ as s,c as a,o as e,a as p}from"./app-4ig7XT8g.js";const o={},t=p(`<p>原文链接: <a href="https://interview.poetries.top/principle-docs/vue/09-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html" target="_blank" rel="noopener noreferrer">https://interview.poetries.top/principle-docs/vue/09-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html</a></p><blockquote><p>在上一章中我们讲解并实现了渲染器的挂载逻辑，本质上就是将各种类型的 <code>VNode</code> 渲染成真实DOM的过程。渲染器除了将全新的 <code>VNode</code> 挂载成真实DOM之外，它的另外一个职责是负责对新旧 <code>VNode</code> 进行比对，并以合适的方式更新DOM，也就是我们常说的 <code>patch</code>。本章内容除了让你了解基本的比对逻辑之外，还讲述了在新旧 <code>VNode</code> 比对的过程中应该遵守怎样的原则，让我们开始吧！</p></blockquote><h2 id="基本原则" tabindex="-1"><a class="header-anchor" href="#基本原则"><span>基本原则</span></a></h2><p>通常重渲染(<code>re- render</code>)是由组件的更新开始的，因为在框架的使用层面开发者通过变更数据状态从而引起框架内部对UI的自动更新，但是组件的更新本质上还是对真实DOM的更新，或者说是对标签元素的更新，所以我们就优先来看一下如何更新一个标签元素。</p><p>我们首先回顾一下渲染器的代码，如下：</p><pre><code>function render(vnode, container) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，使用 \`mount\` 函数挂载全新的 VNode
      mount(vnode, container)
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，则调用 \`patch\` 函数打补丁
      patch(prevVNode, vnode, container)
      // 更新 container.vnode
      container.vnode = vnode
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}
</code></pre><p>如上高亮的两句代码所示，当使用 <code>render</code> 渲染器渲染一个全新的 <code>VNode</code> 时，会调用 <code>mount</code> 函数挂载该 <code>VNode</code>，同时让容器元素存储对该 <code>VNode</code> 对象的引用，这样当再次调用渲染器渲染新的 <code>VNode</code> 对象到相同的容器元素时，由于旧的 <code>VNode</code> 已经存在，所以会调用 <code>patch</code> 函数以合适的方式进行更新，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 旧的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 新的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;span&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 第一次渲染 VNode 到 #app，此时会调用 mount 函数</span></span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 第二次渲染新的 VNode 到相同的 #app 元素，此时会调用 patch 函数</span></span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>nextVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>patch</code> 函数会对新旧 <code>VNode</code> 进行比对，也就是我们所说的 <code>diff</code>，那么不同的两个 <code>VNode</code> 之间应该遵守怎样的比对规则呢？其实这个问题很容易回答，我们知道 <code>VNode</code> 有类型之分，不同类型的 <code>VNode</code> 之间存在一定的差异，所以不同的 <code>VNode</code> 之间第一个比对原则就是：<strong>只有相同类型的<code>VNode</code> 才有比对的意义</strong>，例如我们有两个 <code>VNode</code>，其中一个 <code>VNode</code> 的类型是标签元素，而另一个 <code>VNode</code> 的类型是组件，当这两个 <code>VNode</code> 进行比对时，最优的做法是<strong>使用新的<code>VNode</code> 完全替换旧的 <code>VNode</code></strong>，换句话说我们根本就没有做任何比对的操作，因为这完全没有意义，所以根据这个思想我们实现的 <code>patch</code> 函数如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">patch</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 分别拿到新旧 VNode 的类型，即 flags</span></span>
<span class="line">      <span class="token keyword">const</span> nextFlags <span class="token operator">=</span> nextVNode<span class="token punctuation">.</span>flags</span>
<span class="line">      <span class="token keyword">const</span> prevFlags <span class="token operator">=</span> prevVNode<span class="token punctuation">.</span>flags</span>
<span class="line">    </span>
<span class="line">      <span class="token comment">// 检查新旧 VNode 的类型是否相同，如果类型不同，则直接调用 replaceVNode 函数替换 VNode</span></span>
<span class="line">      <span class="token comment">// 如果新旧 VNode 的类型相同，则根据不同的类型调用不同的比对函数</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>prevFlags <span class="token operator">!==</span> nextFlags<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">replaceVNode</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>nextFlags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">patchElement</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>nextFlags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">patchComponent</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>nextFlags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">TEXT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">patchText</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>nextFlags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">FRAGMENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">patchFragment</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>nextFlags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">PORTAL</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">patchPortal</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，既然 <code>patch</code> 函数的作用是用来比对新旧 <code>VNode</code>，那么 <code>patch</code> 函数必然需要接收新旧 <code>VNode</code> 作为参数，我们使用 <code>prevVNode</code> 形参代表旧的 <code>VNode</code>，使用 <code>nextVNode</code> 形参代表新的 <code>VNode</code>，如上是很清晰的一段比对逻辑，首先我们需要拿到新旧 <code>VNode</code> 的类型(<code>flags</code>)，接着是一连串的 <code>if...else if</code> 语句，其核心原则是：<strong>如果类型不同，则直接调用<code>replaceVNode</code> 函数使用新的 <code>VNode</code> 替换旧的 <code>VNode</code>，否则根据不同的类型调用与之相符的比对函数</strong>，如下图所示：</p><h2 id="替换-vnode" tabindex="-1"><a class="header-anchor" href="#替换-vnode"><span>替换 VNode</span></a></h2><p>我们首先来研究一下如何替换 <code>VNode</code>，即 <code>replaceVNode</code> 函数应该做什么，我们先来复现需要替换 <code>VNode</code> 的场景，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 旧的 VNode 是一个 div 标签</span></span>
<span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;旧的 VNode&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">class</span> <span class="token class-name">MyComponent</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">render</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;h1&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;新的 VNode&#39;</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">// 新的 VNode 是一个组件</span></span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>MyComponent<span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 先后渲染新旧 VNode 到 #app</span></span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>nextVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在如上代码中，我们先后渲染了新旧 <code>VNode</code> 到 <code>#app</code> 元素，由于新旧 <code>VNode</code> 具有不同的类型，所以此时会触发 <code>VNode</code> 的替换操作，替换操作并不复杂，本质就是<strong>把旧的<code>VNode</code> 所渲染的DOM移除，再挂载新的 <code>VNode</code></strong>，如下是 <code>replaceVNode</code> 函数的实现：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">replaceVNode</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 将旧的 VNode 所渲染的 DOM 从容器中移除</span></span>
<span class="line">      container<span class="token punctuation">.</span><span class="token function">removeChild</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">.</span>el<span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// 再把新的 VNode 挂载到容器中</span></span>
<span class="line">      <span class="token function">mount</span><span class="token punctuation">(</span>nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/jlxjk18vm5" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/jlxjk18vm5</a><a href="https://codesandbox.io/s/jlxjk18vm5" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>看上去很简单，但实际上仅有这两行代码的话，是存在缺陷的。至于有何缺陷我们会在本章的后面讲解，因为目前我们的背景铺垫还不够。</p><h2 id="更新标签元素" tabindex="-1"><a class="header-anchor" href="#更新标签元素"><span>更新标签元素</span></a></h2><h3 id="更新标签元素的基本原则" tabindex="-1"><a class="header-anchor" href="#更新标签元素的基本原则"><span>更新标签元素的基本原则</span></a></h3><p>当新旧 <code>VNode</code> 的类型不同时，会调用 <code>replaceVNode</code> 函数直接使用新的 <code>VNode</code> 替换旧的 <code>VNode</code>。但如果新旧 <code>VNode</code> 的类型相同，则会根据不同的类型调用不同的比对函数，这一小节我们就来看看如何更新一个标签元素。</p><p>首先即使两个 <code>VNode</code> 的类型同为标签元素，但它们也可能是不同的标签，也就是说它们的 <code>tag</code> 属性值不尽相同。这就又引申出了一条更新原则：<strong>我们认为不同的标签渲染的内容不同</strong> ，例如 <code>ul</code> 标签下只能渲染 <code>li</code> 标签，所以拿 <code>ul</code> 标签和一个 <code>div</code> 标签进行比对是没有任何意义的，这种情况下我们不会对旧的标签元素打补丁，而是使用新的标签元素替换旧的标签元素，这就需要用到我们前面讲过的 <code>replaceVNode</code> 函数，如下 <code>patchElement</code> 函数所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">patchElement</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>prevVNode<span class="token punctuation">.</span>tag <span class="token operator">!==</span> nextVNode<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">replaceVNode</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么如果新旧 <code>VNode</code> 描述的是相同的标签呢？如果标签相同，那两个 <code>VNode</code> 之间的差异就只会出现在 <code>VNodeData</code> 和 <code>children</code> 上了，所以对于描述相同标签的两个 <code>VNode</code> 之间的比对，本质上就是对 <code>VNodeData</code> 和 <code>children</code> 的比对，我们先来看一下如何更新 <code>VNodeData</code>，如下面两个 <code>VNode</code> 所示：</p><pre><code>// 旧的 VNode
const prevVNode = h(&#39;div&#39;, {
  style: {
    width: &#39;100px&#39;,
    height: &#39;100px&#39;,
    backgroundColor: &#39;red&#39;
  }
})

// 新的 VNode
const nextVNode = h(&#39;div&#39;, {
  style: {
    width: &#39;100px&#39;,
    height: &#39;100px&#39;,
    border: &#39;1px solid green&#39;
  }
})
</code></pre><p>如上代码所示，新旧 <code>VNode</code> 描述的都是 <code>div</code> 标签，但是他们拥有不同的样式，旧的 <code>VNode</code> 描述的是一个红色背景的 <code>div</code>，而新的 <code>VNode</code> 描述的是拥有绿色边框的 <code>div</code>，如果仅针对这个案例而言，我们的更新规则应该是：<strong>先将红色背景从元素上移除，再为元素添加绿色边框</strong> 。如果我们把问题的解决方案宏观化，就变成了：<strong>将新的 VNodeData 全部应用到元素上，再把那些已经不存在于新的<code>VNodeData</code> 上的数据从元素上移除</strong>，根据这个思想，我们为 <code>patchElement</code> 函数增加如下高亮的代码：</p><pre><code>function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  // 拿到 新旧 VNodeData
  const prevData = prevVNode.data
  const nextData = nextVNode.data
  // 新的 VNodeData 存在时才有必要更新
  if (nextData) {
    // 遍历新的 VNodeData
    for (let key in nextData) {
      // 根据 key 拿到新旧 VNodeData 值
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      switch (key) {
        case &#39;style&#39;:
          // 遍历新 VNodeData 中的 style 数据，将新的样式应用到元素
          for (let k in nextValue) {
            el.style[k] = nextValue[k]
          }
          // 遍历旧 VNodeData 中的 style 数据，将已经不存在于新的 VNodeData 的数据移除
          for (let k in prevValue) {
            if (!nextValue.hasOwnProperty(k)) {
              el.style[k] = &#39;&#39;
            }
          }
          break
        default:
          break
      }
    }
  }
}
</code></pre><p>如上高亮代码所示，我们在更新 <code>VNodeData</code> 时的思路分为以下几步：</p><ul><li>第 1 步：当新的 <code>VNodeData</code> 存在时，遍历新的 <code>VNodeData</code>。</li><li>第 2 步：根据新 <code>VNodeData</code> 中的 <code>key</code>，分别尝试读取旧值和新值，即 <code>prevValue</code> 和 <code>nextValue</code>。</li><li>第 3 步：使用 <code>switch...case</code> 语句匹配不同的数据进行不同的更新操作</li></ul><p>以样式(<code>style</code>)的更新为例，如上代码所展示的更新过程是：</p><ul><li>1 ：遍历新的样式数据(<code>prevValue</code>)，将新的样式数据全部应用到元素上</li><li>2 ：遍历旧的样式数据(<code>nextValue</code>)，将那些已经不存在于新的样式数据中的样式从元素上移除，最终我们完成了元素样式的更新。</li></ul><p>这个过程实际上就是更新标签元素的基本规则。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/9l2mxjkw14" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/9l2mxjkw14</a><a href="https://codesandbox.io/s/9l2mxjkw14" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="更新-vnodedata" tabindex="-1"><a class="header-anchor" href="#更新-vnodedata"><span>更新 VNodeData</span></a></h3><p>观察我们在 <code>patchElement</code> 函数中用来更新样式的代码，大家有没有注意到似曾相识？没错，这段代码与 <code>mountElement</code> 函数内用来处理 <code>VNodeData</code> 的代码非常相似，这就指导我们封装一个函数用来统一处理 <code>VNodeData</code>，实际上无论是 <code>mountElement</code> 函数中用来处理 <code>VNodeData</code> 的代码还是 <code>patchElement</code> 函数中用来处理 <code>VNodeData</code> 的代码，它们的本质都是将 <code>VNodeData</code> 中的数据应用到 DOM 元素上，唯一的区别就是在 <code>mountElement</code> 函数中没有“旧”数据可言，而在 <code>patchElement</code> 函数中既有旧数据也有新数据，所以我们完全可以封装一个叫做 <code>patchData</code> 的函数，该函数接收新旧数据作为参数，对于 <code>mountElement</code> 函数来讲，由于它没有旧数据可言，所以在调用 <code>patchData</code> 函数时只需要传递 <code>null</code> 作为旧数据即可。</p><p>我们先来使用 <code>patchData</code> 函数修改 <code>patchElement</code> 函数的代码，如下：</p><pre><code>function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  const prevData = prevVNode.data
  const nextData = nextVNode.data

  if (nextData) {
    // 遍历新的 VNodeData，将旧值和新值都传递给 patchData 函数
    for (let key in nextData) {
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      patchData(el, key, prevValue, nextValue)
    }
  }
  if (prevData) {
    // 遍历旧的 VNodeData，将已经不存在于新的 VNodeData 中的数据移除
    for (let key in prevData) {
      const prevValue = prevData[key]
      if (prevValue &amp;&amp; !nextData.hasOwnProperty(key)) {
        // 第四个参数为 null，代表移除数据
        patchData(el, key, prevValue, null)
      }
    }
  }
}
</code></pre><p>如上高亮代码所示，使用 <code>patchData</code> 函数改写之后的代码变得较之前简洁了许多，核心思想没有变，仍然是：<strong>遍历新的<code>VNodeData</code>，将旧值和新值都传递给 <code>patchData</code> 函数，并由 <code>patchData</code> 函数负责更新数据；同时也需要遍历旧的 <code>VNodeData</code>，将已经不存在于新的 <code>VNodeData</code> 中的数据从元素上移除</strong>，所以我们可以看到在遍历旧 <code>VNodeData</code> 时如果没有旧数据，或者虽然有旧数据但旧数据已经不存在于新数据上了，这时我们传递给 <code>patchData</code> 函数的第四个参数为 <code>null</code>，意味着将该数据从元素上移除。如下是 <code>patchData</code> 函数的实现，本质就是把原来 <code>patchElement</code> 函数中的 <code>switch</code> 语句块移动到了 <code>patchData</code> 函数中：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">patchData</span><span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> key<span class="token punctuation">,</span> prevValue<span class="token punctuation">,</span> nextValue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">switch</span> <span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">case</span> <span class="token string">&#39;style&#39;</span><span class="token operator">:</span></span>
<span class="line">          <span class="token comment">// 将新的样式数据应用到元素</span></span>
<span class="line">          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> k <span class="token keyword">in</span> nextValue<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            el<span class="token punctuation">.</span>style<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> nextValue<span class="token punctuation">[</span>k<span class="token punctuation">]</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          <span class="token comment">// 移除已经不存在的样式</span></span>
<span class="line">          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> k <span class="token keyword">in</span> prevValue<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>nextValue<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>k<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">              el<span class="token punctuation">.</span>style<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&#39;&#39;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          <span class="token keyword">break</span></span>
<span class="line">        <span class="token keyword">default</span><span class="token operator">:</span></span>
<span class="line">          <span class="token keyword">break</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然以上 <code>patchData</code> 函数中的代码只包含对于样式(<code>style</code>)数据的处理，实际上我们可以把上一章中 <code>mountElement</code> 函数中完整的用来处理 <code>VNodeData</code> 数据的代码拷贝到 <code>patchData</code> 函数中，如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">patchData</span><span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> key<span class="token punctuation">,</span> prevValue<span class="token punctuation">,</span> nextValue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">switch</span> <span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">case</span> <span class="token string">&#39;style&#39;</span><span class="token operator">:</span></span>
<span class="line">          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> k <span class="token keyword">in</span> nextValue<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            el<span class="token punctuation">.</span>style<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> nextValue<span class="token punctuation">[</span>k<span class="token punctuation">]</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> k <span class="token keyword">in</span> prevValue<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>nextValue<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>k<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">              el<span class="token punctuation">.</span>style<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&#39;&#39;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          <span class="token keyword">break</span></span>
<span class="line">        <span class="token keyword">case</span> <span class="token string">&#39;class&#39;</span><span class="token operator">:</span></span>
<span class="line">          el<span class="token punctuation">.</span>className <span class="token operator">=</span> nextValue</span>
<span class="line">          <span class="token keyword">break</span></span>
<span class="line">        <span class="token keyword">default</span><span class="token operator">:</span></span>
<span class="line">          <span class="token keyword">if</span> <span class="token punctuation">(</span>key<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token string">&#39;o&#39;</span> <span class="token operator">&amp;&amp;</span> key<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token string">&#39;n&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 事件</span></span>
<span class="line">            el<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>key<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span> nextValue<span class="token punctuation">)</span></span>
<span class="line">          <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>domPropsRE<span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 当作 DOM Prop 处理</span></span>
<span class="line">            el<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> nextValue</span>
<span class="line">          <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 当作 Attr 处理</span></span>
<span class="line">            el<span class="token punctuation">.</span><span class="token function">setAttribute</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> nextValue<span class="token punctuation">)</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          <span class="token keyword">break</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样 <code>patchData</code> 函数就能够用来处理 <code>style</code>、<code>class</code>、<code>DOM Prop</code> 以及 <code>Attr</code> 的更新操作，并且可以同时满足 <code>mountElement</code> 和 <code>patchElement</code> 的需求。但 <code>patchData</code> 函数还不能够满足事件的更新操作，因为当新的 <code>VNodeData</code> 中已经不包含某个事件时，我们需要将旧的事件回调函数移除，解决办法很简单，如下：</p><pre><code>export function patchData(el, key, prevValue, nextValue) {
  switch (key) {
    case &#39;style&#39;:
      // 省略处理样式的代码...
    case &#39;class&#39;:
      // 省略处理 class 的代码...
    default:
      if (key[0] === &#39;o&#39; &amp;&amp; key[1] === &#39;n&#39;) {
        // 事件
        // 移除旧事件
        if (prevValue) {
          el.removeEventListener(key.slice(2), prevValue)
        }
        // 添加新事件
        if (nextValue) {
          el.addEventListener(key.slice(2), nextValue)
        }
      } else if (domPropsRE.test(key)) {
        // 当作 DOM Prop 处理
        el[key] = nextValue
      } else {
        // 当作 Attr 处理
        el.setAttribute(key, nextValue)
      }
      break
  }
}
</code></pre><p>如上高亮代码所示，如果旧的事件回调函数存在，我们先将其从 DOM 元素上移除，接着如果新的事件回调函数存在我们再将其添加到 DOM 元素中。至此我们的 <code>patchData</code> 函数就算大功告成了。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/wk8pl46o18" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/wk8pl46o18</a><a href="https://codesandbox.io/s/wk8pl46o18" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="更新子节点" tabindex="-1"><a class="header-anchor" href="#更新子节点"><span>更新子节点</span></a></h3><p>当 <code>VNodeData</code> 更新完成之后，对于新旧两个标签来说，就剩下子节点的差异了，所以我们在 <code>patchElement</code> 函数中最后一步需要做的事情就是递归地更新子节点，如下高亮的代码所示：</p><pre><code>function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  const prevData = prevVNode.data
  const nextData = nextVNode.data

  if (nextData) {
    // 遍历新的 VNodeData，将旧值和新值都传递给 patchData 函数
    for (let key in nextData) {
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      patchData(el, key, prevValue, nextValue)
    }
  }
  if (prevData) {
    // 遍历旧的 VNodeData，将已经不存在于新的 VNodeData 中的数据移除
    for (let key in prevData) {
      const prevValue = prevData[key]
      if (prevValue &amp;&amp; !nextData.hasOwnProperty(key)) {
        // 第四个参数为 null，代表移除数据
        patchData(el, key, prevValue, null)
      }
    }
  }

  // 调用 patchChildren 函数递归地更新子节点
  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    nextVNode.childFlags, // 新的 VNode 子节点的类型
    prevVNode.children,   // 旧的 VNode 子节点
    nextVNode.children,   // 新的 VNode 子节点
    el                    // 当前标签元素，即这些子节点的父节点
  )
}
</code></pre><p>我们在 <code>patchElement</code> 函数的最后调用了 <code>patchChildren</code> 函数，<code>patchChildren</code> 函数的作用就是对新旧 <code>VNode</code> 的子节点进行<strong>同层级</strong> 的比较，它接收五个参数，前四个参数分别是新旧 <code>VNode</code> 子节点以及子节点的类型，第五个参数 <code>el</code> 是这些子节点的父节点，也就是当前被更新的标签元素。</p><p>在开始实现同层级子节点的更新之前，需要根据我们目前掌握的知识思考一下应该如何做，<strong>思路是能够写出代码的原因</strong> 。我们观察如下两个 <code>div</code> 标签的子节点，我们用 <code>VNode</code> 来表示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;span&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示， <code>prevVNode</code> 所描述的 <code>div</code> 标签只有一个子节点，所以 <code>prevVNode</code> 的子节点类型应该是 <code>ChildrenFlags.SINGLE_VNODE</code>，而 <code>nextVNode</code> 所描述的 <code>div</code> 标签没有子节点，所以 <code>nextVNode</code> 的子节点类型应该是 <code>ChildrenFlags.NO_CHILDREN</code>。如果单纯地看这个例子，我们应该如何更新呢？很简单，我们只需要把 <code>prevVNode</code> 的子节点移除即可。再来看下面的两个 <code>VNode</code>：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;span&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个例子与之前的例子恰好相反，<code>prevVNode</code> 没有子节点而 <code>nextVNode</code> 有一个子节点，所以 <code>prevVNode</code> 和 <code>nextVNode</code> 的子节点的类型分别是 <code>ChildrenFlags.NO_CHILDREN</code> 和 <code>ChildrenFlags.SINGLE_VNODE</code>，这时我们的更新操作也很简单，只需要把 <code>nextVNode</code> 的子节点挂载到 <code>div</code> 标签即可。再来看下面的例子：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;span&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这个例子中，新旧 <code>div</code> 标签都有一个子节点，所以他们的子节点类型相同，这时子节点的更新操作就等价于两个子节点之间的 <code>patch</code>。</p><p>通过这些例子我们注意到，根据新旧标签的子节点的类型不同，我们可以轻松地找到合适的方式去更新它们，我们在讲解 <code>VNode</code> 的种类时就曾经强调过，<code>VNode</code> 的类型标识在 <code>patch</code> 阶段是非常重要的信息，在这里就体现了出来。</p><p>但无论是新标签还是旧标签，该标签的子节点都可以分为三种情况：只有一个子节点、没有子节点 以及 有多个子节点。至于一个标签的子节点属于哪种类型是可以通过该标签所对应的 <code>VNode</code> 对象的 <code>childFlags</code> 属性得知的。最终在这个思路的引导下我们就可以编写出 <code>patchChildren</code> 函数，如下代码所示：</p><pre><code>function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 旧的 children 是单个子节点，会执行该 case 语句块
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 也是单个子节点时，会执行该 case 语句块
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          break
      }
      break
    // 旧的 children 中没有子节点时，会执行该 case 语句块
    case ChildrenFlags.NO_CHILDREN:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 是单个子节点时，会执行该 case 语句块
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          break
      }
      break
    // 旧的 children 中有多个子节点时，会执行该 case 语句块
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 是单个子节点时，会执行该 case 语句块
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          break
      }
      break
  }
}
</code></pre><p>如上代码所示，虽然看上去代码很长，但是很有规律，我们使用了嵌套的 <code>switch...case</code> 语句，外层的 <code>switch...case</code> 语句用来匹配旧的 <code>children</code> 的类型，而内层的 <code>switch...case</code> 语句则用来匹配新的 <code>children</code> 的类型。由于新旧 <code>children</code> 各有三种情况，所以合起来共有九种(<code>3 * 3</code>)情况，根据不同的情况我们所做的操作也会不同。接下来我们逐个实现，当我们把这九种情况下的更新操作全部实现之后，我们的 <code>patchChildren</code> 函数就大功告成了。</p><p>我们先来看一下当旧的 <code>children</code> 类型为 <code>ChildrenFlags.SINGLE_VNODE</code> 且新的 <code>children</code> 类型也是 <code>ChildrenFlags.SINGLE_VNODE</code> 的情况，即新旧 <code>children</code> 都是单个子节点，我们上面提到过，在这种情况下新旧 <code>children</code> 的比较等价于两个 <code>children(单个子节点)</code>之间的比较，所以只需要递归地调用 <code>patch</code> 函数即可，如下：</p><pre><code>function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 此时 prevChildren 和 nextChildren 都是 VNode 对象
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          break
      }
      break

    // 省略...
  }
}
</code></pre><p>如上高亮代码所示，只需一行代码即可搞定，我们编写一个案例来测试我们的代码：</p><pre><code>// 旧的 VNode
const prevVNode = h(&#39;div&#39;, null,
  h(&#39;p&#39;, {
    style: {
      height: &#39;100px&#39;,
      width: &#39;100px&#39;,
      background: &#39;red&#39;
    }
  })
)

// 新的 VNode
const nextVNode = h(&#39;div&#39;, null,
  h(&#39;p&#39;, {
    style: {
      height: &#39;100px&#39;,
      width: &#39;100px&#39;,
      background: &#39;green&#39;
    }
  })
)

render(prevVNode, document.getElementById(&#39;app&#39;))

// 2秒后更新
setTimeout(() =&gt; {
  render(nextVNode, document.getElementById(&#39;app&#39;))
}, 2000)
</code></pre><p>如上代码所示，新旧 <code>VNode</code> 描述的都是只有一个 <code>p</code> 标签作为子节点的 <code>div</code> 标签，所以新旧 <code>div</code> 标签的 <code>children</code> 类型都是单个子节点，只不过这两个 <code>p</code> 标签拥有不同的背景颜色，然后我们先后调用 <code>render</code> 渲染器渲染了这两个 <code>VNode</code>，最终效果是 <code>p</code> 标签的背景色被正确地更新了。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/m3oqr3knq9" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/m3oqr3knq9</a><a href="https://codesandbox.io/s/m3oqr3knq9" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>接着我们来看一下当旧的 <code>children</code> 类型为 <code>ChildrenFlags.SINGLE_VNODE</code>，而新的 <code>children</code> 类型为 <code>ChildrenFlags.NO_CHILDREN</code> 时的情况，也就是说旧的 <code>children</code> 是单个子节点，而新的 <code>children</code> 为 <code>null</code>，即新的 <code>VNode</code> 没有子节点。在这种情况下我们只需要把旧的子节点移除即可，如下代码所示：</p><pre><code>function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 旧的 children 是单个子节点，会执行该 case 语句块
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 也是单个子节点时，会执行该 case 语句块
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          container.removeChild(prevChildren.el)
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          break
      }
      break

    // 省略...
  }
}
</code></pre><p>如上高亮代码所示，<code>container</code> 是父级元素，我们调用父级元素的 <code>removeChild</code> 方法将之前渲染好的 <code>prevChildren.el</code> 移除即可，同样只使用了一行代码就实现了功能。不过可能很多同学已经发现了这么做的问题所在，假如 <code>prevChildren</code> 的类型是一个片段的话，那么它可能渲染多个元素到容器中，所以我们需要对片段类型的 <code>VNode</code> 额外处理。但本质不变：<strong>想办法把已经渲染好了的 DOM 元素从页面上移除</strong> 。</p><p>最后我们使用如下例子测试我们的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 旧的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span></span>
<span class="line">      <span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">style</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token string">&#39;100px&#39;</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token string">&#39;100px&#39;</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">background</span><span class="token operator">:</span> <span class="token string">&#39;red&#39;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 新的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 2秒后更新</span></span>
<span class="line">    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span>nextVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上例中 <code>prevVNode</code> 描述的是：以一个红色背景的 <code>p</code> 标签作为子节点的 <code>div</code> 标签，而 <code>nextVNode</code> 是一个没有子节点的 <code>div</code> 标签，接着我们先后渲染了旧的和新的 <code>VNode</code>，最终效果是 <code>p</code> 标签被移除了。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/3roo60w1kp" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/3roo60w1kp</a><a href="https://codesandbox.io/s/3roo60w1kp" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>接着我们再来看一下当旧的 <code>children</code> 类型为 <code>ChildrenFlags.SINGLE_VNODE</code>，而新的 <code>children</code> 类型为多个子节点时的情况，在这种情况下由于旧的子节点只有一个，而新的子节点有多个，所以我们可以采用<strong>将旧的单个子节点移除，再将新的多个子节点挂载上去</strong> 的方案，在这个思路下我们可以做出如下实现，修改我们的 <code>patchChildren</code> 函数：</p><pre><code>function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 旧的 children 是单个子节点，会执行该 case 语句块
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          container.removeChild(prevChildren.el)
          break
        default:
          // 移除旧的单个子节点
          container.removeChild(prevChildren.el)
          // 遍历新的多个子节点，逐个挂载到容器中
          for (let i = 0; i &lt; nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break

    // 省略...
  }
}
</code></pre><p>如上高亮代码所示，实现起来也非常简单，我们使用了与之前一样的方法将旧的单个子节点移除，然后遍历新的多个子节点，并调用 <code>mount</code> 函数逐个将之挂载到容器中。我们可以使用下面的例子测试我们的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 旧的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;只有一个子节点&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 新的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;子节点 1&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;子节点 2&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 2秒后更新</span></span>
<span class="line">    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span>nextVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，旧的 <code>VNode</code> 是一个只有一个子节点的 <code>div</code> 标签，而新的 <code>VNode</code> 是一个拥有多个子节点的 <code>div</code> 标签。最终的效果是旧的单个子节点被移除，新的多个子节点全都被添加上去。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/lpm17161m" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/lpm17161m</a><a href="https://codesandbox.io/s/lpm17161m" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>以上我们讲解并实现了当旧的 <code>children</code> 类型为单个子节点时，所有情况下的更新操作，可以用一张图来总结，如下：</p><p>类似的，当旧的 <code>children</code> 类型为 <code>ChildrenFlags.NO_CHILDREN</code>，即没有子节点时，新的 <code>children</code> 依然可能有三种情况，我们也可以用一张图来表示：</p><p>我们来解释一下上图的操作：</p><ul><li>情况一：没有旧的子节点、新的子节点为单个子节点，此时只需要把新的单个子节点添加到容器元素即可。</li><li>情况二：没有旧的子节点、同时也没有新的子节点，那自然什么都不用做了。</li><li>情况三：没有旧的子节点、但有多个新的子节点，那把这多个子节点都添加到容器元素即可。</li></ul><p>基于此，我们可以轻松编写出对应的逻辑，如下 <code>patchChildren</code> 函数所示：</p><pre><code>function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 省略...

    // 旧的 children 中没有子节点时，会执行该 case 语句块
    case ChildrenFlags.NO_CHILDREN:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 是单个子节点时，会执行该 case 语句块
          // 使用 mount 函数将新的子节点挂载到容器元素
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          // 什么都不做
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          // 遍历多个新的子节点，逐个使用 mount 函数挂载到容器元素
          for (let i = 0; i &lt; nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break

    // 省略...
  }
}
</code></pre><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/62x41myyrz" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/62x41myyrz</a><a href="https://codesandbox.io/s/62x41myyrz" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>现在对于旧的 <code>children</code> 类型来说，我们只剩下最后一种情况没有处理了，就是当旧的 <code>children</code> 类型为多个子节点时，同样的我们来画一张图：</p><p><img src="`+n+`" alt=""></p><p>如上图所示，当旧的 <code>children</code> 类型为多个子节点时，新的 <code>children</code> 类型有三种情况，不同的情况采用不同的操作：</p><ul><li>情况一：有多个旧的子节点，但新的子节点是单个子节点，这时只需要把所有旧的子节点移除，再将新的单个子节点添加到容器元素即可。</li><li>情况二：有多个旧的子节点，但没有新的子节点，这时只需要把所有旧的子节点移除即可。</li><li>情况三：新旧子节点都是多个子节点，这时将进入到至关重要的一步，即核心 <code>diff</code> 算法的用武之地。</li></ul><p>实际上在整个新旧 <code>children</code> 的比对中，只有当新旧子节点都是多个子节点时才有必要进行真正的核心 <code>diff</code>，从而尽可能的复用子节点。</p><p>对于<strong>情况一</strong> 和<strong>情况二</strong> 而言，实现起来相当容易，如下代码所示：</p><pre><code>function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 省略...

    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          for (let i = 0; i &lt; prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          for (let i = 0; i &lt; prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          break
      }
      break
  }
}
</code></pre><p>如上高亮代码所示，对于新的 <code>children</code> 为单个子节点的情况，我们遍历旧的子节点逐个将之从容器元素中移除，并调用 <code>mount</code> 函数将新的子节点挂载到容器元素中，对于新的 <code>children</code> 为没有子节点的情况，我们则直接遍历旧的子节点将其全部从容器元素中移除即可。实际上整个 <code>children</code> 的 <code>patch</code> 过程中，最复杂的当属最后一种情况：<strong>新旧子节点都是多个子节点的情况</strong> ，之所以在这种情况下更新操作会变的复杂，是因为我们对“自己”的要求较高，因为假设按照之前的思路我们完全可以采用 <strong>“将旧的子节点全部移除，再将所有新的子节点添加”</strong> 的思路来完成更新，这样事情就会简单许多，不过虽然这么做可以实现最终的目的，但所有 DOM 的更新都毫无复用可言。限于本章的篇幅我们暂时采用简单的办法完成子节点的更新，对于真正的核心 <code>diff</code> 算法我们将会在下一章统一着重讲解，简化版本的实现如下：</p><pre><code>function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 省略...

    // 旧的 children 中有多个子节点时，会执行该 case 语句块
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          for (let i = 0; i &lt; prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          for (let i = 0; i &lt; prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          break
        default:
          // 遍历旧的子节点，将其全部移除
          for (let i = 0; i &lt; prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          // 遍历新的子节点，将其全部添加
          for (let i = 0; i &lt; nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
  }
}
</code></pre><p>如上高亮代码所示，我们先遍历旧的子节点，将其全部从容器元素中移除。然后再遍历新的子节点，并将其全部添加到容器元素中。这样我们就完成了更新的操作，但这里再次强调：我们这么做是限于篇幅，同时为了方便后续案例代码的编写，在下一章中我们将着重讲解<strong>当新旧子节点都是多个子节点时，应该如何尽可能的复用子节点</strong> 。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/ym6k442lmj" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/ym6k442lmj</a><a href="https://codesandbox.io/s/ym6k442lmj" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h2 id="更新文本节点" tabindex="-1"><a class="header-anchor" href="#更新文本节点"><span>更新文本节点</span></a></h2><p>我们花了很大的篇幅讲解了标签元素的更新，实际上标签元素的确是 DOM 更新中的主要操作，接下来我们讲解一下文本节点的更新。如果新旧两个 <code>VNode</code> 的类型都是纯文本类型，那么在 <code>patch</code> 内部会调用 <code>patchText</code> 函数更新旧的文本节点。文本节点的更新非常简单，如果一个 DOM 元素是文本节点或注释节点，那么可以通过调用该 DOM 对象的 <code>nodeValue</code> 属性读取或设置文本节点(或注释节点)的内容，例如：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 创建一个文本节点</span></span>
<span class="line">    <span class="token keyword">const</span> textEl <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createTextNode</span><span class="token punctuation">(</span><span class="token string">&#39;a&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    textEl<span class="token punctuation">.</span>nodeValue  <span class="token comment">// &#39;a&#39;</span></span>
<span class="line">    </span>
<span class="line">    textEl<span class="token punctuation">.</span>nodeValue <span class="token operator">=</span> <span class="token string">&#39;b&#39;</span></span>
<span class="line">    </span>
<span class="line">    textEl<span class="token punctuation">.</span>nodeValue  <span class="token comment">// &#39;b&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>利用这一点我们就可以轻松实现对于文本元素的更新，如下是 <code>patchText</code> 函数的实现：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">patchText</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 拿到文本元素 el，同时让 nextVNode.el 指向该文本元素</span></span>
<span class="line">      <span class="token keyword">const</span> el <span class="token operator">=</span> <span class="token punctuation">(</span>nextVNode<span class="token punctuation">.</span>el <span class="token operator">=</span> prevVNode<span class="token punctuation">.</span>el<span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// 只有当新旧文本内容不一致时才有必要更新</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>nextVNode<span class="token punctuation">.</span>children <span class="token operator">!==</span> prevVNode<span class="token punctuation">.</span>children<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        el<span class="token punctuation">.</span>nodeValue <span class="token operator">=</span> nextVNode<span class="token punctuation">.</span>children</span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>patchText</code> 函数接收新旧 <code>VNode</code> 作为参数，首先我们需要通过旧的 <code>prevVNode.el</code> 属性拿到已经渲染在页面上的文本节点元素，并让 <code>nextVNode.el</code> 指向它。接着由于对纯文本类型的 <code>VNode</code> 而言，它的 <code>children</code> 属性存储的就是其文本内容，所以通过对比新旧文本内容是否一致来决定是否需要更新，只有新旧文本内容不一致时我们才会设置文本节点的 <code>el.nodeValue</code> 属性的值，从而完成文本节点的更新。</p><p>我们可以使用如下例子测试我们的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 旧的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;旧文本&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 新的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;新文本&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 2秒后更新</span></span>
<span class="line">    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span>nextVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们先后创建了两个带有文本子节点的 <code>p</code> 标签，并调用 <code>render</code> 渲染器渲染了旧的 <code>VNode</code> 以及新的 <code>VNode</code>。最终效果是两秒之后文本被更新了。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/73zzzv9xn6" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/73zzzv9xn6</a><a href="https://codesandbox.io/s/73zzzv9xn6" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h2 id="更新-fragment" tabindex="-1"><a class="header-anchor" href="#更新-fragment"><span>更新 Fragment</span></a></h2><p>如果两个 <code>VNode</code> 的类型都是片段，则 <code>patch</code> 函数会调用 <code>patchFragment</code> 函数更新片段的内容。实际上<strong>片段的更新是简化版的标签元素的更新</strong> ，我们知道对于标签元素来说更新的过程分为两个步骤：首先需要更新标签本身的 <code>VNodeData</code>，其次更新其子节点。然而由于 <code>Fragment</code> 没有包裹元素，只有子节点，所以我们对 <code>Fragment</code> 的更新本质上就是更新两个片段的“子节点”。</p><p>如下是 <code>patchFragment</code> 函数的实现：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">patchFragment</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 直接调用 patchChildren 函数更新 新旧片段的子节点即可</span></span>
<span class="line">      <span class="token function">patchChildren</span><span class="token punctuation">(</span></span>
<span class="line">        prevVNode<span class="token punctuation">.</span>childFlags<span class="token punctuation">,</span> <span class="token comment">// 旧片段的子节点类型</span></span>
<span class="line">        nextVNode<span class="token punctuation">.</span>childFlags<span class="token punctuation">,</span> <span class="token comment">// 新片段的子节点类型</span></span>
<span class="line">        prevVNode<span class="token punctuation">.</span>children<span class="token punctuation">,</span>   <span class="token comment">// 旧片段的子节点</span></span>
<span class="line">        nextVNode<span class="token punctuation">.</span>children<span class="token punctuation">,</span>   <span class="token comment">// 新片段的子节点</span></span>
<span class="line">        container</span>
<span class="line">      <span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，我们直接调用 <code>patchChildren</code> 函数更新新旧片段的子节点即可，但是不要忘记更新 <code>nextVNode.el</code> 属性，就像我们当初实现 <code>mountFragment</code> 时一样，根据子节点的类型不同，<code>VNode</code> 所引用的元素也不同，我们为 <code>patchFragment</code> 添加如下代码：</p><pre><code>function patchFragment(prevVNode, nextVNode, container) {
  // 直接调用 patchChildren 函数更新 新旧片段的子节点即可
  patchChildren(
    prevVNode.childFlags, // 旧片段的子节点类型
    nextVNode.childFlags, // 新片段的子节点类型
    prevVNode.children,   // 旧片段的子节点
    nextVNode.children,   // 新片段的子节点
    container
  )

  switch (nextVNode.childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      nextVNode.el = nextVNode.children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      nextVNode.el = prevVNode.el
      break
    default:
      nextVNode.el = nextVNode.children[0].el
  }
}
</code></pre><p>如上高亮代码所示，我们通过检查新的片段的 <code>children</code> 类型，如果新的片段的 <code>children</code> 类型是单个子节点，则意味着其 <code>vnode.children</code> 属性的值就是 <code>VNode</code> 对象，所以直接将 <code>nextVNode.children.el</code> 赋值给 <code>nextVNode.el</code> 即可。如果新的片段没有子节点，我们知道对于没有子节点的片段我们会使用一个空的文本节点占位，而 <code>prevVNode.el</code> 属性引用的就是该空文本节点，所以我们直接通过旧片段的 <code>prevVNode.el</code> 拿到该空文本元素并赋值给新片段的 <code>nextVNode.el</code> 即可。如果新的片段的类型是多个子节点，则 <code>nextVNode.children</code> 是一个 <code>VNode</code> 数组，我们会让新片段的 <code>nextVNode.el</code> 属性引用数组中的第一个元素。实际上这段逻辑与我们在 <code>mountFragment</code> 函数中所实现的逻辑是一致的。</p><p>我们可以使用下面的例子测试我们的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 旧的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>Fragment<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;旧片段子节点 1&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;旧片段子节点 2&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 新的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>Fragment<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;新片段子节点 1&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;新片段子节点 2&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 2秒后更新</span></span>
<span class="line">    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span>nextVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上这段代码中我们创建了旧的和新的两个片段，并先后使用渲染器进行渲染，结果是片段得到了正确的更新。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/1r9k5y1ozq" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/1r9k5y1ozq</a><a href="https://codesandbox.io/s/1r9k5y1ozq" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h2 id="更新-portal" tabindex="-1"><a class="header-anchor" href="#更新-portal"><span>更新 Portal</span></a></h2><p>如果两个 <code>VNode</code> 的类型都是 <code>Portal</code>，那么 <code>patch</code> 函数内部会调用 <code>patchPortal</code> 函数进行更新。我们在“渲染器之挂载”一章中曾做出一个不严谨但很直观的比喻：可以把 <code>Portal</code> 当作可以到处挂载的 <code>Fragment</code>。实际上 <code>Portal</code> 的更新与 <code>Fragment</code> 类似，我们需要更新其子节点，但由于 <code>Portal</code> 可以被到处挂载，所以新旧 <code>Portal</code> 的挂载目标可能不同，所以对于 <code>Portal</code> 的更新除了要更新其子节点之外，还要对比新旧挂载目标是否相同，如果新的 <code>Portal</code> 的挂载目标变了我们就需要将 <code>Portal</code> 的内容从旧的容器中搬运到新的容器中。我们首先来更新 <code>Portal</code> 的子节点，如下代码所示，与更新 <code>Fragment</code> 的子节点相同：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">patchPortal</span> <span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">patchChildren</span><span class="token punctuation">(</span></span>
<span class="line">        prevVNode<span class="token punctuation">.</span>childFlags<span class="token punctuation">,</span></span>
<span class="line">        nextVNode<span class="token punctuation">.</span>childFlags<span class="token punctuation">,</span></span>
<span class="line">        prevVNode<span class="token punctuation">.</span>children<span class="token punctuation">,</span></span>
<span class="line">        nextVNode<span class="token punctuation">.</span>children<span class="token punctuation">,</span></span>
<span class="line">        prevVNode<span class="token punctuation">.</span>tag <span class="token comment">// 注意容器元素是旧的 container</span></span>
<span class="line">      <span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">      <span class="token comment">// 让 nextVNode.el 指向 prevVNode.el</span></span>
<span class="line">      nextVNode<span class="token punctuation">.</span>el <span class="token operator">=</span> prevVNode<span class="token punctuation">.</span>el</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，我们首先调用 <code>patchChildren</code> 函数更新 <code>Portal</code> 的子节点，其中需要注意的是 <code>patchChildren</code> 的第五个参数是旧的挂载容器，也就是说即使新的 <code>Portal</code> 的挂载目标变了，但是在这一步的更新完成之后 <code>Portal</code> 的内容仍然存在于旧的容器中。接着我们将 <code>prevVNode.el</code> 赋值给 <code>nextVNode.el</code>，这一步要比 <code>Fragment</code> 容易的多，因为我们知道对于 <code>Portal</code> 类型的 <code>VNode</code> 来说其 <code>el</code> 属性始终是一个占位的文本节点。</p><p>在如上这些工作完成之后，我们要思考的问题就是挂载目标了，由于新旧 <code>Portal</code> 的挂载目标可能是不同的，例如：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 挂载目标是 id=&quot;box1&quot; 的元素</span></span>
<span class="line">    <span class="token keyword">const</span> prevPortal <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>Portal<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token string">&#39;#box1&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 挂载目标是 id=&quot;box2&quot; 的元素</span></span>
<span class="line">    <span class="token keyword">const</span> nextPortal <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>Portal<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token string">&#39;#box2&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，旧的 <code>Portal</code> 的挂载目标是 <code>id=&quot;box1&quot;</code> 的容器元素，而新的 <code>Portal</code> 的挂载目标是 <code>id=&quot;box2&quot;</code> 的容器元素。但是由于我们在更新子节点的过程中，传递给 <code>patchChildren</code> 函数的容器元素始终都是旧的容器元素，所以最终结果是：<strong>更新后的子节点也存在于旧的容器中</strong> ，所以我们还需要做最后一步工作，就是<strong>把旧容器内的元素都搬运到新容器中</strong> ，我们给 <code>patchPortal</code> 函数增加如下代码：</p><pre><code>function patchPortal(prevVNode, nextVNode) {
  patchChildren(
    prevVNode.childFlags,
    nextVNode.childFlags,
    prevVNode.children,
    nextVNode.children,
    prevVNode.tag // 注意 container 是旧的 container
  )
  // 让 nextVNode.el 指向 prevVNode.el
  nextVNode.el = prevVNode.el

  // 如果新旧容器不同，才需要搬运
  if (nextVNode.tag !== prevVNode.tag) {
    // 获取新的容器元素，即挂载目标
    const container =
      typeof nextVNode.tag === &#39;string&#39;
        ? document.querySelector(nextVNode.tag)
        : nextVNode.tag

    switch (nextVNode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        // 如果新的 Portal 是单个子节点，就把该节点搬运到新容器中
        container.appendChild(nextVNode.children.el)
        break
      case ChildrenFlags.NO_CHILDREN:
        // 新的 Portal 没有子节点，不需要搬运
        break
      default:
        // 如果新的 Portal 是多个子节点，遍历逐个将它们搬运到新容器中
        for (let i = 0; i &lt; nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el)
        }
        break
    }
  }
}
</code></pre><p>如上高亮代码所示，我们通过 <code>nextVNode.tag !== prevVNode.tag</code> 来判断新旧 <code>Portal</code> 的容器是否相同，只有容器不同的情况下才需要搬运工作。搬运的原理是什么呢？我们知道当我们调用 <code>appendChild</code> 方法向 DOM 中添加元素时，如果被添加的元素已存在于页面上，那么就会移动该元素到目标容器元素下。我们利用这一点，由于经过 <code>patchChildren</code> 函数的处理之后，新的子节点已经存在于旧的容器中了，所以我们只需要在新容器元素上调用 <code>appendChild</code> 方法将这些已经存在于旧容器中的子节点搬运过去即可。</p><p>当然了，在搬运的过程中，我们要检查新的 <code>Portal</code> 的子节点类型，并采用合适的处理方式。我们可以使用如下例子测试我们的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 旧的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span></span>
<span class="line">      Portal<span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">{</span> <span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token string">&#39;#old-container&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;旧的 Portal&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 新的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span></span>
<span class="line">      Portal<span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">{</span> <span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token string">&#39;#new-container&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;p&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;新的 Portal&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 2秒后更新</span></span>
<span class="line">    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span>nextVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，在这个例子中 <code>prevVNode</code> 和 <code>nextVNode</code> 的类型都是 <code>Portal</code>，并且新旧 <code>Portal</code> 的挂载目标不同，分别是 <code>#old-container</code> 和 <code>#new-container</code>，如下是完整的代码和在线体验地址。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/xj118zm82o" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/xj118zm82o</a><a href="https://codesandbox.io/s/xj118zm82o" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h2 id="有状态组件的更新" tabindex="-1"><a class="header-anchor" href="#有状态组件的更新"><span>有状态组件的更新</span></a></h2><p>接下来我们要介绍的就是有状态组件的更新，首先我们需要思考的问题是：在什么情况下才会触发有状态组件的更新呢？实际上对于有状态组件来说它的更新方式有两种：<strong>主动更新</strong> 和 <strong>被动更新</strong> 。</p><p>什么是<strong>主动更新</strong> 呢？所谓主动更新指的是组件自身的状态发生变化所导致的更新，例如组件的 <code>data</code> 数据发生了变化就必然需要重渲染。但是大家不要忘记：一个组件所渲染的内容是很可能包含其它组件的，也就是子组件，对于子组件来讲，它除了自身状态之外，很可能还包含从父组件传递进来的外部状态(<code>props</code>)，所以父组件自身状态的变化很可能引起子组件外部状态的变化，此时就需要更新子组件，像这种因为外部状态变化而导致的组件更新就叫做<strong>被动更新</strong> 。</p><h3 id="主动更新" tabindex="-1"><a class="header-anchor" href="#主动更新"><span>主动更新</span></a></h3><p>我们先来讨论组件的主动更新，我们知道组件的核心是渲染函数，渲染函数会产出 <code>VNode</code>，渲染器会将渲染函数产出的 <code>VNode</code> 渲染为真实 DOM，当组件的状态变化时我们需要做的就是重新执行渲染函数并产出新的 <code>VNode</code>，最后通过新旧 <code>VNode</code> 之间的补丁算法完成真实 DOM 的更新。这里的关键点在于<strong>数据变化之后需要重新执行渲染函数，得到新的 VNode</strong> ，我们来回顾一下前面章节中讲解过的用于挂载有状态组件的 <code>mountStatefulComponent</code> 函数：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mountStatefulComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 创建组件实例</span></span>
<span class="line">      <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">vnode<span class="token punctuation">.</span>tag</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// 渲染VNode</span></span>
<span class="line">      instance<span class="token punctuation">.</span>$vnode <span class="token operator">=</span> instance<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// 挂载</span></span>
<span class="line">      <span class="token function">mount</span><span class="token punctuation">(</span>instance<span class="token punctuation">.</span>$vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素</span></span>
<span class="line">      instance<span class="token punctuation">.</span>$el <span class="token operator">=</span> vnode<span class="token punctuation">.</span>el <span class="token operator">=</span> instance<span class="token punctuation">.</span>$vnode<span class="token punctuation">.</span>el</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>组件挂载的核心步骤分为三步：1、创建组件实例，2、调用组件的 <code>render</code> 获得 <code>VNode</code>，3、将 <code>VNode</code> 挂载到容器元素。实际上我们可以把除了创建组件实例这一步之外的代码封装成一个函数，如下：</p><pre><code>function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = new vnode.tag()

  instance._update = function() {
    // 1、渲染VNode
    instance.$vnode = instance.render()
    // 2、挂载
    mount(instance.$vnode, container, isSVG)
    // 4、el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
    instance.$el = vnode.el = instance.$vnode.el
  }

  instance._update()
}
</code></pre><p>如上代码所示，在 <code>mountStatefulComponent</code> 函数内部，我们将除了创建组件实例之外的所有工作封装到了组件实例对象的 <code>instance._update</code> 函数中，紧接着在 <code>mountStatefulComponent</code> 函数的最后立即调用了 <code>_update</code> 函数，我们为什么要这么做呢？实际上 <code>_update</code> 函数所做的工作就是渲染组件，这样当组件自身状态发生变化后，我们就可以再次调用 <code>_update</code> 函数来完成组件的更新。</p><p>假设我们有 <code>MyComponent</code> 组件，如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">class</span> <span class="token class-name">MyComponent</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 自身状态 or 本地状态</span></span>
<span class="line">      localState <span class="token operator">=</span> <span class="token string">&#39;one&#39;</span></span>
<span class="line">    </span>
<span class="line">      <span class="token comment">// mounted 钩子</span></span>
<span class="line">      <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 两秒钟之后修改本地状态的值，并重新调用 _update() 函数更新组件</span></span>
<span class="line">        <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">this</span><span class="token punctuation">.</span>localState <span class="token operator">=</span> <span class="token string">&#39;two&#39;</span></span>
<span class="line">          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_update</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>localState<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上组件所示，该组件拥有一个叫做 <code>localState</code> 的数据，并且 <code>render</code> 函数中使用到了该数据。接着我们在组件的 <code>mounted</code> 钩子函数中设置了一个定时器，两秒钟之后会修改自身状态 <code>localState</code> 的值，由于我们目前没有讲解响应系统，所以我们暂时需要手动调用 <code>_update</code> 函数来完成组件的更新，等到后面响应系统相关的章节中我们再来详细讲解如何完成自动更新。另外在如上组件中我们使用了 <code>mounted</code> 生命周期钩子，但是就我们目前所实现的 <code>mountStatefulComponent</code> 函数而言，它并没有调用组件的任何生命周期函数的能力，为了代码的正常运行，我们需要为 <code>mountStatefulComponent</code> 函数添加执行 <code>mounted</code> 回调的能力，很简单我们只需要在组件被渲染为真实 DOM 之后调用该组件实例的 <code>mounted</code> 函数即可，如下高亮代码所示：</p><pre><code>function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = new vnode.tag()

  instance._update = function() {
    // 1、渲染VNode
    instance.$vnode = instance.render()
    // 2、挂载
    mount(instance.$vnode, container, isSVG)
    // 4、el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
    instance.$el = vnode.el = instance.$vnode.el
    // 5、调用 mounted 钩子
    instance.mounted &amp;&amp; instance.mounted()
  }

  instance._update()
}
</code></pre><p>这样当我们使用 <code>mountStatefulComponent</code> 函数挂载有状态组件时，如果组件提供了 <code>mounted</code> 方法，那么该方法就会被当作钩子函数调用，更多的关于生命周期钩子函数的内容我们暂且不做深入讨论，我们还是回到组件更新的问题上。现在 <code>MyComponent</code> 组件的 <code>mounted</code> 钩子函数已经可以被正确执行，我们在 <code>mounted</code> 钩子函数内修改了组件的自身状态的值并再次调用了 <code>_update</code> 函数进行组件的更新，但是在更新时我们不应该像初次挂载组件那样去调用 <code>mount</code> 函数，而是应该调用 <code>patch</code> 函数将组件新产出的 <code>VNode</code> 与初次挂载时产出的旧 <code>VNode</code> 做比较并完成更新，但无论是初次挂载还是后续更新我们调用的都是 <code>_update</code> 函数，可是 <code>_update</code> 函数怎么知道当前这次渲染到底是初次挂载还是后续更新呢？所以我们需要为组件实例设计一个 <code>boolean</code> 类型的状态标识，用来标记组件是否已经被挂载，这样 <code>_update</code> 函数就能够区分当前这次渲染到底是初次挂载还是后续更新了，如下是我们修改之后的 <code>mountStatefulComponent</code> 函数的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mountStatefulComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 创建组件实例</span></span>
<span class="line">      <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">vnode<span class="token punctuation">.</span>tag</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">      instance<span class="token punctuation">.</span><span class="token function-variable function">_update</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 如果 instance._mounted 为真，说明组件已挂载，应该执行更新操作</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>instance<span class="token punctuation">.</span>_mounted<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// 1、拿到旧的 VNode</span></span>
<span class="line">          <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> instance<span class="token punctuation">.</span>$vnode</span>
<span class="line">          <span class="token comment">// 2、重渲染新的 VNode</span></span>
<span class="line">          <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token punctuation">(</span>instance<span class="token punctuation">.</span>$vnode <span class="token operator">=</span> instance<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">          <span class="token comment">// 3、patch 更新</span></span>
<span class="line">          <span class="token function">patch</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> prevVNode<span class="token punctuation">.</span>el<span class="token punctuation">.</span>parentNode<span class="token punctuation">)</span></span>
<span class="line">          <span class="token comment">// 4、更新 vnode.el 和 $el</span></span>
<span class="line">          instance<span class="token punctuation">.</span>$el <span class="token operator">=</span> vnode<span class="token punctuation">.</span>el <span class="token operator">=</span> instance<span class="token punctuation">.</span>$vnode<span class="token punctuation">.</span>el</span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// 1、渲染VNode</span></span>
<span class="line">          instance<span class="token punctuation">.</span>$vnode <span class="token operator">=</span> instance<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">          <span class="token comment">// 2、挂载</span></span>
<span class="line">          <span class="token function">mount</span><span class="token punctuation">(</span>instance<span class="token punctuation">.</span>$vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span></span>
<span class="line">          <span class="token comment">// 3、组件已挂载的标识</span></span>
<span class="line">          instance<span class="token punctuation">.</span>_mounted <span class="token operator">=</span> <span class="token boolean">true</span></span>
<span class="line">          <span class="token comment">// 4、el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素</span></span>
<span class="line">          instance<span class="token punctuation">.</span>$el <span class="token operator">=</span> vnode<span class="token punctuation">.</span>el <span class="token operator">=</span> instance<span class="token punctuation">.</span>$vnode<span class="token punctuation">.</span>el</span>
<span class="line">          <span class="token comment">// 5、调用 mounted 钩子</span></span>
<span class="line">          instance<span class="token punctuation">.</span>mounted <span class="token operator">&amp;&amp;</span> instance<span class="token punctuation">.</span><span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">      instance<span class="token punctuation">.</span><span class="token function">_update</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，我们通过一个 <code>if...else</code> 语句判断组件实例的 <code>instance._mounted</code> 属性值的真假，来判断应该执行初次挂载操作还是更新操作。<code>if</code> 语句块内的代码用于执行更新操作，大致分为四个步骤：</p><ul><li>1、取得旧的 <code>VNode</code>，由于初次挂载组件时所产出的 <code>VNode</code> 存储在组件实例的 <code>$vnode</code> 属性中，所以我们可以通过 <code>$vnode</code> 属性拿到旧的 <code>VNode</code>。</li><li>2、重新调用 <code>render</code> 函数产出新的 <code>VNode</code>。</li><li>3、调用 <code>patch</code> 函数对比新旧 <code>VNode</code>，完成更新操作。</li></ul><p>除了以上三步之外，我们还应该使用新的真实 DOM 元素去更新 <code>vnode.el</code> 属性和组件实例的 <code>$el</code> 属性的值。另外大家注意我们在第三步中传递给 <code>patch</code> 函数的第三个参数，它是容器元素，这个容器元素可以通过获取旧的 <code>vnode.el</code> 的父节点得到。</p><p>现在组件的主动更新我们就讲解完了，下面的链接是完整代码和线上体验地址。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/jzl0nk81xy" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/jzl0nk81xy</a><a href="https://codesandbox.io/s/jzl0nk81xy" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="初步了解组件的外部状态-props" tabindex="-1"><a class="header-anchor" href="#初步了解组件的外部状态-props"><span>初步了解组件的外部状态 props</span></a></h3><p>上面我们讲解了有状态组件的主动更新，接下来我们本应该继续讲解有状态组件的被动更新，但是在讲解被动更新之前，需要花点时间来做一些铺垫，我们先了解一下组件的 <code>props</code>，为什么需要了解 <code>props</code> 呢？因为组件的被动更新是由组件的外部状态变化所导致的，而 <code>props</code> 就是组件的外部状态。不过本节不会深入讨论 <code>props</code>，点到为止，我们会在后续的章节中专门详细地讲解 <code>props</code>。</p><p>假设父组件的模板如下：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token comment">&lt;!-- 父组件模板 --&gt;</span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ChildComponent</span> <span class="token attr-name">:text</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>localState<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>父组件的模板中渲染了 <code>ChildComponent</code> 子组件，<code>ChildComponent</code> 子组件有一个 <code>text</code> 属性，它是一个绑定属性，绑定的变量是父组件的自身状态 <code>localState</code>。这段模板被编译后的渲染函数可以表示为：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span>ChildComponent<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>localState</span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段渲染函数就是父组件的渲染函数，所以我们可以这样定义父组件：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">class</span> <span class="token class-name">ParentComponent</span> <span class="token punctuation">{</span></span>
<span class="line">    </span>
<span class="line">      <span class="token comment">// 本地状态</span></span>
<span class="line">      localState <span class="token operator">=</span> <span class="token string">&#39;one&#39;</span></span>
<span class="line">    </span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        childCompVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>ChildComponent<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>localState</span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span> childCompVNode</span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，父组件渲染函数所返回的就是子组件的 <code>VNode</code>，即 <code>childCompVNode</code>。<code>childCompVNode</code> 将会被 <code>mountStatefulComponent</code> 函数挂载，挂载的步骤我们已经再熟悉不过了：1、创建组件实例，2、调用组件实例的 <code>render</code> 函数，3、调用 <code>mount</code> 函数挂载。实际上我们可以在组件实例创建之后立即初始化组件的 <code>props</code>。为 <code>mountStatefulComponent</code> 函数添加如下代码：</p><pre><code>function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = (vnode.children = new vnode.tag())
  // 初始化 props
  instance.$props = vnode.data

  // 省略...
}
</code></pre><p>如上高亮代码所示，在组件实例创建完成之后，我们为组件实例添加了 <code>$props</code> 属性，并且将 <code>vnode.data</code> 赋值给 <code>$props</code>。这样，子组件中就可以通过 <code>this.$props.text</code> 访问从父组件传递进来的 <code>props</code> 数据。如下是 <code>ChildComponent</code> 组件中使用外部数据的方式：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 子组件类</span></span>
<span class="line">    <span class="token keyword">class</span> <span class="token class-name">ChildComponent</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 通过 this.$props.text 访问外部数据</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$props<span class="token punctuation">.</span>text<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样我们就实现了父组件向子组件传递 <code>props</code> 的能力，不过在该实现中我们以最简单的方式，直接将 <code>VNodeData</code> 赋值给 <code>$props</code>，我们知道 <code>VNodeData</code> 中的数据并不全是 <code>props</code>，其中还包含事件以及其他重要的信息，所以在真正的实现中，我们会从 <code>VNodeData</code> 中提取 <code>props</code>。不过这并不是本章的重点内容，我们一切从简。</p><p>现在子组件已经有能力拿到从父组件传递进来的 <code>props</code> 数据了，我们可以使用如下例子测试我们的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 子组件类</span></span>
<span class="line">    <span class="token keyword">class</span> <span class="token class-name">ChildComponent</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 子组件中访问外部状态：this.$props.text</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$props<span class="token punctuation">.</span>text<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">// 父组件类</span></span>
<span class="line">    <span class="token keyword">class</span> <span class="token class-name">ParentComponent</span> <span class="token punctuation">{</span></span>
<span class="line">      localState <span class="token operator">=</span> <span class="token string">&#39;one&#39;</span></span>
<span class="line">    </span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span>ChildComponent<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// 父组件向子组件传递的 props</span></span>
<span class="line">          <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>localState</span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 有状态组件 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> compVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>ParentComponent<span class="token punctuation">)</span></span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>compVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里是完整的代码和在线体验地址：<a href="https://codesandbox.io/s/k5lll524m5" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/k5lll524m5</a><a href="https://codesandbox.io/s/k5lll524m5" target="_blank" rel="noopener noreferrer"> (opens new window)</a>，可以看到如上代码能够正确运行，子组件中可以访问由父组件传递进来的数据。</p><h3 id="被动更新" tabindex="-1"><a class="header-anchor" href="#被动更新"><span>被动更新</span></a></h3><p>有了 <code>props</code> 的铺垫之后，我们可以开始讨论有状态组件的<strong>被动更新</strong> 了。如前所述，被动更新指的是由外部状态变化而引起的更新操作，通常父组件自身状态的变化可能会引起子组件的更新，我们可以修改上面的例子，为父组件添加 <code>mounted</code> 钩子，并在该钩子函数中修改父组件的自身状态 <code>localState</code> 的值，如下：</p><pre><code>// 子组件类
class ChildComponent {
  render() {
    // 子组件中访问外部状态：this.$props.text
    return h(&#39;div&#39;, null, this.$props.text)
  }
}
// 父组件类
class ParentComponent {
  localState = &#39;one&#39;

  mounted() {
    // 两秒钟后将 localState 的值修改为 &#39;two&#39;
    setTimeout(() =&gt; {
      this.localState = &#39;two&#39;
      this._update()
    }, 2000)
  }

  render() {
    return h(ChildComponent, {
      // 父组件向子组件传递的 props
      text: this.localState
    })
  }
}

// 有状态组件 VNode
const compVNode = h(ParentComponent)
render(compVNode, document.getElementById(&#39;app&#39;))
</code></pre><p>如上高亮代码所示，我们为父组件定义了 <code>mounted</code> 钩子函数，在 <code>mounted</code> 钩子函数内我们设置了一个定时器，两秒钟后修改 <code>localState</code> 的值为 <code>&#39;two&#39;</code> 并调用 <code>_update</code> 方法更新父组件。这个过程我们可以理解为父组件 <code>ParentComponent</code> 先后产出了两个不同的 <code>VNode</code>：第一次渲染产出的 <code>VNode</code> 是：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> prevCompVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>ChildComponent<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;one&#39;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二次由于自身状态变化所产出的 <code>VNode</code> 为：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> nextCompVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>ChildComponent<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;two&#39;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以在 <code>_update</code> 函数内部的更新操作，等价于 <code>prevCompVNode</code> 和 <code>nextCompVNode</code> 之间的 <code>patch</code>，即：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">patch</span><span class="token punctuation">(</span>prevCompVNode<span class="token punctuation">,</span> nextCompVNode<span class="token punctuation">,</span> prevCompVNode<span class="token punctuation">.</span>el<span class="token punctuation">.</span>parentNode<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>由于 <code>prevCompVNode</code> 和 <code>nextCompVNode</code> 的类型都是组件类型的 <code>VNode</code>，所以在 <code>patch</code> 函数内部会调用 <code>patchComponent</code> 函数进行更新，如下高亮代码所示：</p><pre><code>function patch(prevVNode, nextVNode, container) {
  const nextFlags = nextVNode.flags
  const prevFlags = prevVNode.flags

  if (prevFlags !== nextFlags) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextFlags &amp; VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container)
  } else if (nextFlags &amp; VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container)
  } else if (nextFlags &amp; VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode)
  } else if (nextFlags &amp; VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container)
  } else if (nextFlags &amp; VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode)
  }
}
</code></pre><p><code>patchComponent</code> 函数接收三个参数，分别是旧的 <code>VNode</code> 和新的 <code>VNode</code> 以及容器元素 <code>container</code>，如下是 <code>patchComponent</code> 函数的实现：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">patchComponent</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 检查组件是否是有状态组件</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>nextVNode<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_STATEFUL_NORMAL</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 1、获取组件实例</span></span>
<span class="line">        <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token punctuation">(</span>nextVNode<span class="token punctuation">.</span>children <span class="token operator">=</span> prevVNode<span class="token punctuation">.</span>children<span class="token punctuation">)</span></span>
<span class="line">        <span class="token comment">// 2、更新 props</span></span>
<span class="line">        instance<span class="token punctuation">.</span>$props <span class="token operator">=</span> nextVNode<span class="token punctuation">.</span>data</span>
<span class="line">        <span class="token comment">// 3、更新组件</span></span>
<span class="line">        instance<span class="token punctuation">.</span><span class="token function">_update</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，我们通过检查组件的 <code>flags</code> 判断组件是否是有状态组件，如果是有状态组件则更新之。更新操作很简单，三步：</p><ul><li>1、通过 <code>prevVNode.children</code> 拿到组件实例</li><li>2、更新 <code>props</code>，使用新的 <code>VNodeData</code> 重新设置组件实例的 <code>$props</code> 属性</li><li>3、由于组件的 <code>$props</code> 已更新，所以调用组件的 <code>_update</code> 方法，让组件重渲染。</li></ul><p>这里需要澄清的一件事，我们之所以能够通过 <code>VNode</code> 的 <code>children</code> 属性来读取组件实例，例如上面代码中的 <code>prevVNode.children</code>，是因为每个类型为有状态组件的 <code>VNode</code>，在挂载期间我们都会让其 <code>children</code> 属性引用组件的实例，以便能够通过 <code>VNode</code> 访问组件实例对象。这一点我们早在“先设计 VNode 吧”一章中就有提及。所以我们需要修改 <code>mountStatefulComponent</code> 函数的代码，在创建组件实例后需要将实例对象赋值给 <code>vnode.children</code> 属性，如下：</p><pre><code>function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = (vnode.children = new vnode.tag())

  // 省略...
}
</code></pre><p>这样我们在 <code>patchComponent</code> 函数中就能够通过 <code>VNode</code> 拿到组件实例了，这里我们再次强调：<code>VNode</code> 的 <code>children</code> 属性本应该用来存储子节点，但是对于组件类型的 <code>VNode</code> 来说，它的子节点都应该作为插槽存在，并且我们选择将插槽内容存储在单独的 <code>slots</code> 属性中，而非存储在 <code>children</code> 属性中，这样 <code>children</code> 属性就可以用来存储组件实例了，这些内容我们会在后面章节中讲解插槽时再次说明。</p><p>如下是完整代码以及在线体验地址：</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/2z7335kn5y" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/2z7335kn5y</a><a href="https://codesandbox.io/s/2z7335kn5y" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>在上面的讲解中，父组件自身状态变化之后，它渲染的子组件并没有变化，仍然是 <code>ChildComponent</code>，仅仅是传递给子组件的 <code>props</code> 数据发生了变化。但是，有时父组件自身状态的变化会导致父组件渲染不同的子组件，如下代码所示：</p><pre><code>// 父组件类
class ParentComponent {
  isTrue = true

  mounted() {
    setTimeout(() =&gt; {
      this.isTrue = false
      this._update()
    }, 2000)
  }

  render() {
    // 如果 this.isTrue 的值为真，则渲染 ChildComponent1，否则渲染 ChildComponent2
    return this.isTrue ? h(ChildComponent1) : h(ChildComponent2)
  }
}
// 有状态组件 VNode
const compVNode = h(ParentComponent)

render(compVNode, document.getElementById(&#39;app&#39;))
</code></pre><p>如上代码所示，观察 <code>ParentComponent</code> 组件的 <code>render</code> 函数，当 <code>ParentComponent</code> 组件的自身状态 <code>isTrue</code> 为真时会渲染子组件 <code>ChildComponent1</code>，否则会渲染子组件 <code>ChildComponent2</code>。同时我们在 <code>mounted</code> 钩子中设置了定时器，两秒钟后将 <code>isTrue</code> 的值变更为 <code>false</code>，并调用 <code>_update</code> 方法更新 <code>ParentComponent</code> 组件。在这种情况下就会出现因父组件自身状态的变化而导致其渲染不同的组件，在初次挂载时 <code>ParentComponent</code> 组件所产出的 <code>VNode</code> 为：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> pervCompVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>ChildComponent1<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>更新之后 <code>ParentComponent</code> 组件所产出的 <code>VNode</code> 为：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> nextCompVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>ChildComponent2<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>虽然 <code>pervCompVNode</code> 和 <code>nextCompVNode</code> 的类型都是组件，但它们是不同的组件。拿上面的例子来说，<code>pervCompVNode</code> 描述的是组件 <code>ChildComponent1</code>，<code>nextCompVNode</code> 描述的是组件 <code>ChildComponent2</code>，也就是说新旧 <code>VNode</code> 所描述的不是同一个组件，这就引申出我们更新组件的一个原则：<strong>我们认为不同的组件渲染不同的内容</strong> ，所以对于不同的组件，我们采用的方案是使用新组件的内容替换旧组件渲染的内容。根据这个思想，我们修改 <code>patchComponent</code> 函数的代码，如下：</p><pre><code>function patchComponent(prevVNode, nextVNode, container) {
  // tag 属性的值是组件类，通过比较新旧组件类是否相等来判断是否是相同的组件
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextVNode.flags &amp; VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 获取组件实例
    const instance = (nextVNode.children = prevVNode.children)
    // 更新 props
    instance.$props = nextVNode.data
    // 更新组件
    instance._update()
  }
}
</code></pre><p>如上 <code>patchComponent</code> 函数中的高亮代码所示，增加了一个判断条件，我们知道对于组件类型的 <code>VNode</code> 而言，它的 <code>tag</code> 属性值引用的就是组件类本身，我们通过对比前后组件类是否相同来确定新旧组件是否是相同的组件，如果不相同则直接调用 <code>replaceVNode</code> 函数使用新组件替换旧的组件。大家还记的 <code>replaceVNode</code> 函数的实现方式吗？如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">replaceVNode</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      container<span class="token punctuation">.</span><span class="token function">removeChild</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">.</span>el<span class="token punctuation">)</span></span>
<span class="line">      <span class="token function">mount</span><span class="token punctuation">(</span>nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是我们之前实现过的 <code>replaceVNode</code> 函数，它的原理就是将旧的 <code>VNode</code> 所渲染的内容从容器元素中移除，并将新的 <code>VNode</code> 挂载到容器元素中。这段代码同样适用于组件，但是对于组件来说我们不能仅仅将组件所渲染的内容移除就算大功告成，我们还有另外一件事需要做，即调用 <code>unmounted</code> 钩子，所以我们为 <code>replaceVNode</code> 函数添加如下代码：</p><pre><code>function replaceVNode(prevVNode, nextVNode, container) {
  container.removeChild(prevVNode.el)
  // 如果将要被移除的 VNode 类型是组件，则需要调用该组件实例的 unmounted 钩子函数
  if (prevVNode.flags &amp; VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 类型为有状态组件的 VNode，其 children 属性被用来存储组件实例对象
    const instance = prevVNode.children
    instance.unmounted &amp;&amp; instance.unmounted()
  }
  mount(nextVNode, container)
}
</code></pre><p>如上高亮代码所示，如果将要被移除的 <code>prevVNode</code> 的类型是有状态组件，则需要调用该组件实例的 <code>unmounted</code> 钩子函数。这里是完整的代码以及在线体验地址：<a href="https://codesandbox.io/s/ll92yq0o2l" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/ll92yq0o2l</a><a href="https://codesandbox.io/s/ll92yq0o2l" target="_blank" rel="noopener noreferrer"> (opens new window)</a>。</p><h3 id="我们需要-shouldupdatecomponent" tabindex="-1"><a class="header-anchor" href="#我们需要-shouldupdatecomponent"><span>我们需要 shouldUpdateComponent</span></a></h3><p>【占位】</p><h2 id="函数式组件的更新" tabindex="-1"><a class="header-anchor" href="#函数式组件的更新"><span>函数式组件的更新</span></a></h2><p>接下来我们要讨论的是函数式组件的更新，其实无论是有状态组件还是函数式组件，它们的更新原理都是一样的：用组件新产出的 <code>VNode</code> 与之前产出的旧 <code>VNode</code> 进行比对，从而完成更新。为了让讲解不至于太抽象，我们还是拿一个具体的例子来说，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 子组件 - 函数式组件</span></span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">MyFunctionalComp</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> props<span class="token punctuation">.</span>text<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">// 父组件的 render 函数中渲染了 MyFunctionalComp 子组件</span></span>
<span class="line">    <span class="token keyword">class</span> <span class="token class-name">ParentComponent</span> <span class="token punctuation">{</span></span>
<span class="line">      localState <span class="token operator">=</span> <span class="token string">&#39;one&#39;</span></span>
<span class="line">    </span>
<span class="line">      <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">this</span><span class="token punctuation">.</span>localState <span class="token operator">=</span> <span class="token string">&#39;two&#39;</span></span>
<span class="line">          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_update</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span>MyFunctionalComp<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>localState</span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 有状态组件 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> compVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>ParentComponent<span class="token punctuation">)</span></span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>compVNode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>观察上面的代码，我们定义了 <code>ParentComponent</code> 组件，它是一个有状态组件，在它的 <code>render</code> 函数中渲染了 <code>MyFunctionalComp</code> 子组件，这个子组件是一个函数式组件。观察 <code>MyFunctionalComp</code> 函数的参数，由于函数式组件没有组件实例，所以在函数式组件中我们不能通过 <code>this.$props.xxx</code> 访问 <code>props</code> 数据，<code>props</code> 数据是作为函数的参数传递进去的，如下是我们之前实现的 <code>mountFunctionalComponent</code> 函数：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mountFunctionalComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 获取 VNode</span></span>
<span class="line">      <span class="token keyword">const</span> $vnode <span class="token operator">=</span> vnode<span class="token punctuation">.</span><span class="token function">tag</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// 挂载</span></span>
<span class="line">      <span class="token function">mount</span><span class="token punctuation">(</span>$vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// el 元素引用该组件的根元素</span></span>
<span class="line">      vnode<span class="token punctuation">.</span>el <span class="token operator">=</span> $vnode<span class="token punctuation">.</span>el</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了实现函数式组件的 <code>props</code> 传递，我们需要修对 <code>mountFunctionalComponent</code> 函数做一些修改，如下代码所示：</p><pre><code>function mountFunctionalComponent(vnode, container, isSVG) {
  // 获取 props
  const props = vnode.data
  // 获取 VNode
  const $vnode = (vnode.children = vnode.tag(props))
  // 挂载
  mount($vnode, container, isSVG)
  // el 元素引用该组件的根元素
  vnode.el = $vnode.el
}
</code></pre><p>如上高亮代码所示，我们在调用组件函数获取 <code>VNode</code> 之前，要先获取 <code>props</code>，这里我们同样直接将整个 <code>VNodeData</code> 作为 <code>props</code> 数据，前面我们已经解释了这么做的原因是出于简便。拿到 <code>props</code> 数据之后，在调用组件函数 <code>vnode.tag(props)</code> 时将 <code>props</code> 作为参数传递过去，这样子组件就可以通过参数访问由父组件传递过来的数据了。另外，我们将组件产出的 <code>VNode</code> 赋值给了 <code>vnode.children</code> 属性，这里需要做一些说明，通过之前的讲解可知，对于有状态组件类型的 <code>VNode</code> 来说，我们使用其 <code>children</code> 属性存储组件实例，并在将来会用 <code>slots</code> 属性存储插槽数据。同样的，在函数式组件中，由于函数式组件没有组件实例，所以对于函数式组件类型的 <code>VNode</code>，我们用其 <code>children</code> 属性存储组件产出的 <code>VNode</code>，将来也会使用 <code>slots</code> 属性存储插槽数据。这个是设计上的决定，并非一定要这么做，但为了与 <code>Vue3</code> 的设计保持一致，所以我们就沿用 <code>Vue3</code> 的设计。</p><p>现在我们已经实现了函数式组件接收 <code>props</code> 数据的功能，我们再来观察一下上面的例子，在这个例子中我们为有状态组件 <code>ParentComponent</code> 提供了 <code>mounted</code> 钩子函数，两秒之后修改自身状态 <code>localState</code> 的值，并调用 <code>_update</code> 函数重渲染，在重渲染的过程中，<code>_update</code> 函数内部发生的事情等价于：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 旧的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>MyFunctionalComp<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;one&#39;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 新的 VNode</span></span>
<span class="line">    <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>MyFunctionalComp<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;two&#39;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 更新</span></span>
<span class="line">    <span class="token function">patch</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> prevVNode<span class="token punctuation">.</span>el<span class="token punctuation">.</span>parentNode<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于 <code>prevVNode</code> 和 <code>nextVNode</code> 的类型都是组件，所以在 <code>patch</code> 函数内部会调用 <code>patchComponent</code> 函数更新，我们来回顾一下 <code>patchComponent</code> 函数的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">patchComponent</span><span class="token punctuation">(</span><span class="token parameter">prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>nextVNode<span class="token punctuation">.</span>tag <span class="token operator">!==</span> prevVNode<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">replaceVNode</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>nextVNode<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_STATEFUL_NORMAL</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 获取组件实例</span></span>
<span class="line">        <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token punctuation">(</span>nextVNode<span class="token punctuation">.</span>children <span class="token operator">=</span> prevVNode<span class="token punctuation">.</span>children<span class="token punctuation">)</span></span>
<span class="line">        <span class="token comment">// 更新 props</span></span>
<span class="line">        instance<span class="token punctuation">.</span>$props <span class="token operator">=</span> nextVNode<span class="token punctuation">.</span>data</span>
<span class="line">        <span class="token comment">// 更新组件</span></span>
<span class="line">        instance<span class="token punctuation">.</span><span class="token function">_update</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这段代码中 <code>if</code> 语句块内的代码用于处理两个不同组件之间的更新，<code>else...if</code> 语句块内的代码用于处理有状态组件的更新，所以<code>patchComponent</code> 函数还不能完成函数式组件的更新。为了达到目的，我们需要为 <code>patchComponent</code> 函数添加一段代码，用来处理函数式组件类型的 <code>VNode</code> 的更新，如下代码所示：</p><pre><code>function patchComponent(prevVNode, nextVNode, container) {
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextVNode.flags &amp; VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 省略...
  } else {
    // 在这里编写函数式组件的更新逻辑
  }
}
</code></pre><p>如上高亮代码所示，我们只需要为其添加 <code>else</code> 语句块即可，我们将在这里编写函数式组件的更新逻辑。但问题是，应该如何更新呢？在本节的开头我们就说过了，无论是有状态组件还是函数式组件，它们的更新原理不变，所以我们可以效仿有状态组件的实现方式。</p><p>挂载函数式组件的核心步骤只有两步：1、调用组件的定义函数，拿到组件产出的 <code>VNode</code>，2、将 <code>VNode</code> 挂载到容器元素。与挂载有状态组件类似，我们可以把这些步骤封装到一个函数中，当组件更新时再次调用这个函数即可。但是，与有状态组件不同，函数式组件没有组件实例，所以我们没办法封装类似 <code>instance._update</code> 这样的函数，那应该怎么办呢？很简单，我们把 <code>update</code> 函数定义在函数式组件的 <code>VNode</code> 上就可以了，如下代码所示：</p><pre><code>function mountFunctionalComponent(vnode, container, isSVG) {
  // 在函数式组件类型的 vnode 上添加 handle 属性，它是一个对象
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () =&gt; {
      // 初始化 props
      const props = vnode.data
      // 获取 VNode
      const $vnode = (vnode.children = vnode.tag(props))
      // 挂载
      mount($vnode, container, isSVG)
      // el 元素引用该组件的根元素
      vnode.el = $vnode.el
    }
  }

  // 立即调用 vnode.handle.update 完成初次挂载
  vnode.handle.update()
}
</code></pre><p>这是我们修改后的 <code>mountFunctionalComponent</code> 函数，可以看到我们给函数式组件类型的 <code>VNode</code> 添加了 <code>handle</code> 属性，它是一个拥有四个属性的对象：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    vnode<span class="token punctuation">.</span>handle <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">prev</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">next</span><span class="token operator">:</span> vnode<span class="token punctuation">,</span></span>
<span class="line">      container<span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">/*...*/</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们把之前用于挂载函数式组件的代码移动到了 <code>vnode.handle.update</code> 函数中，所以在 <code>mountFunctionalComponent</code> 函数的最后立即调用了 <code>vnode.handle.update</code> 函数，这样能够保证原始功能不变。<code>handle</code> 对象除了 <code>update</code> 方法之外还有其他三个属性，它们的作用分别是：</p><ul><li><code>handle.prev</code>：存储旧的函数式组件 <code>VNode</code>，在初次挂载时，没有旧的 <code>VNode</code> 可言，所以初始值为 <code>null</code>。</li><li><code>handle.next</code>：存储新的函数式组件 <code>VNode</code>，在初次挂载时，被赋值为当前正在挂载的函数式组件 <code>VNode</code>。</li><li><code>handle.container</code>：存储的是挂载容器</li></ul><p>现在已经有了 <code>handle.update</code> 函数，我们可以尝试在 <code>patchComponent</code> 函数内部通过调用 <code>handle.update</code> 函数完成函数式组件的更新，如下代码所示：</p><pre><code>function patchComponent(prevVNode, nextVNode, container) {
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextVNode.flags &amp; VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 省略...
  } else {
    // 更新函数式组件
    // 通过 prevVNode.handle 拿到 handle 对象
    const handle = (nextVNode.handle = prevVNode.handle)
    // 更新 handle 对象
    handle.prev = prevVNode
    handle.next = nextVNode
    handle.container = container

    // 调用 update 函数完成更新
    handle.update()
  }
}
</code></pre><p>如上高亮代码所示，我们首先通过旧的 <code>VNode(prevVNode)</code> 拿到 <code>handle</code> 对象，接着我们更新了 <code>handle</code> 对象下各个属性的值：</p><ul><li>1、将旧的函数式组件 <code>VNode(prevVNode)</code> 赋值给 <code>handle.prev</code>。</li><li>2、将新的函数式组件 <code>VNode(nextVNode)</code> 赋值给 <code>handle.next</code>。</li><li>3、更新 <code>container</code>（即使 <code>container</code> 未必会变，但仍要更新之）。</li></ul><p>最后我们调用了 <code>handle.update</code> 函数完成更新操作。我们再详细地了解一下在这个过程中发生了什么，在函数式组件初次挂载完成后 <code>handle</code> 对象的值为：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    handle <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">prev</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">next</span><span class="token operator">:</span> prevVNode<span class="token punctuation">,</span></span>
<span class="line">      container<span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">/* ... */</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在经过 <code>patchComponent</code> 函数对 <code>handle</code> 对象进行更新之后，<code>handle</code> 对象的值将变为：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    handle <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">prev</span><span class="token operator">:</span> prevVNode<span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">next</span><span class="token operator">:</span> nextVNode<span class="token punctuation">,</span></span>
<span class="line">      container<span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">/* ... */</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到此时的 <code>handle.prev</code> 属性已经非空了，<code>prev</code> 和 <code>next</code> 属性分别存储的是旧的和新的函数式组件类型的 <code>VNode</code>。这个更新的动作很关键。在更新完成之后，立即调用了 <code>handle.update</code> 函数进行重渲染，如下是目前我们所实现的 <code>handle.update</code> 函数：</p><pre><code>function mountFunctionalComponent(vnode, container, isSVG) {
  // 在函数式组件类型的 vnode 上添加 handle 属性，它是一个对象
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () =&gt; {
      // 初始化 props
      const props = vnode.data
      // 获取 VNode
      const $vnode = (vnode.children = vnode.tag(props))
      // 挂载
      mount($vnode, container, isSVG)
      // el 元素引用该组件的根元素
      vnode.el = $vnode.el
    }
  }

  // 立即调用 vnode.handle.update 完成初次挂载
  vnode.handle.update()
}
</code></pre><p>如上高亮代码所示，现在的 <code>update</code> 函数只能完成初次挂载的工作，当再次调用 <code>update</code> 函数进行更新时，我们是不能再次执行这段用于挂载的代码的，就像有状态组件的 <code>instance.update</code> 函数的实现一样，我们需要为 <code>handle.update</code> 函数添加更新逻辑，如下代码所示：</p><pre><code>function mountFunctionalComponent(vnode, container, isSVG) {
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () =&gt; {
      if (vnode.handle.prev) {
        // 更新的逻辑写在这里
      } else {
        // 获取 props
        const props = vnode.data
        // 获取 VNode
        const $vnode = (vnode.children = vnode.tag(props))
        // 挂载
        mount($vnode, container, isSVG)
        // el 元素引用该组件的根元素
        vnode.el = $vnode.el
      }
    }
  }

  // 立即调用 vnode.handle.update 完成初次挂载
  vnode.handle.update()
}
</code></pre><p>在上面的代码中，我们通过判断 <code>vnode.handle.prev</code> 是否存在来判断该函数式组件是初次挂载还是后续更新，由于在 <code>patchComponent</code> 函数内我们已经将 <code>vnode.handle.prev</code> 属性赋值为旧的组件 <code>VNode</code>，所以如果 <code>vnode.handle.prev</code> 存在则说明该函数式组件并非初次挂载，而是更新，所以我们会在 <code>if</code> 语句块内编写更新逻辑，而用于初次挂载的代码被我们放到了 <code>else</code> 语句块中。</p><p>那么更新的思路是什么呢？前面说过了，只要想办法分别拿到组件产出的新旧 <code>VNode</code> 即可，这样我们就可以通过 <code>patch</code> 函数更新之。如下代码所示：</p><pre><code>function mountFunctionalComponent(vnode, container, isSVG) {
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () =&gt; {
      if (vnode.handle.prev) {
        // 更新
        // prevVNode 是旧的组件VNode，nextVNode 是新的组件VNode
        const prevVNode = vnode.handle.prev
        const nextVNode = vnode.handle.next
        // prevTree 是组件产出的旧的 VNode
        const prevTree = prevVNode.children
        // 更新 props 数据
        const props = nextVNode.data
        // nextTree 是组件产出的新的 VNode
        const nextTree = (nextVNode.children = nextVNode.tag(props))
        // 调用 patch 函数更新
        patch(prevTree, nextTree, vnode.handle.container)
      } else {
        // 省略...
      }
    }
  }

  // 立即调用 vnode.handle.update 完成初次挂载
  vnode.handle.update()
}
</code></pre><p>如上高亮代码所示，由于我们在 <code>patchComponent</code> 函数内已经更新过了 <code>handle</code> 对象，所以此时我们可以通过 <code>vnode.handle.prev</code> 和 <code>vnode.handle.next</code> 分别拿到旧的组件 <code>VNode</code> 和新的组件 <code>VNode</code>，但大家不要搞混的是：<code>prevVNode</code> 和 <code>nextVNode</code> 是用来描述函数式组件的 <code>VNode</code>，并非函数式组件所产出的 <code>VNode</code>。因为函数式组件所产出的 <code>VNode</code> 存放在用来描述函数式组件的 <code>VNode</code> 的 <code>children</code> 属性中，所以在如上代码中我们通过 <code>prevVNode.children</code> 拿到了组件所产出的旧的 <code>VNode</code> 即 <code>prevTree</code>，接着使用新的 <code>props</code> 重新调用组件函数 <code>nextVNode.tag(props)</code> 得到新产出的 <code>VNode</code> 即 <code>nextTree</code>，有了 <code>prevTree</code> 和 <code>nextTree</code> 之后我们就可以调用 <code>patch</code> 函数执行更新操作了。</p><p>以上就是函数式组件的更新过程。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/5yz63qqx7p" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/5yz63qqx7p</a><a href="https://codesandbox.io/s/5yz63qqx7p" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>阅读全文</p>`,256),c=[t];function l(i,d){return e(),a("div",null,c)}const k=s(o,[["render",l],["__file","Vue-渲染器之patch.html.vue"]]),v=JSON.parse('{"path":"/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html","title":"","lang":"zh-CN","frontmatter":{"description":"原文链接: https://interview.poetries.top/principle-docs/vue/09-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html 在上一章中我们讲解并实现了渲染器的挂载逻辑，本质上就是将各种类型的 VNode 渲染成真实DOM的过程。渲染器除了将全新的 VNode 挂载成...","head":[["meta",{"property":"og:url","content":"https://interview.leeguoo.com/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html"}],["meta",{"property":"og:site_name","content":"前端面试题集锦"}],["meta",{"property":"og:description","content":"原文链接: https://interview.poetries.top/principle-docs/vue/09-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html 在上一章中我们讲解并实现了渲染器的挂载逻辑，本质上就是将各种类型的 VNode 渲染成真实DOM的过程。渲染器除了将全新的 VNode 挂载成..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_7cb972d068b2d405.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-03T00:55:01.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-03T00:55:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_7cb972d068b2d405.png\\"],\\"dateModified\\":\\"2024-06-03T00:55:01.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"基本原则","slug":"基本原则","link":"#基本原则","children":[]},{"level":2,"title":"替换 VNode","slug":"替换-vnode","link":"#替换-vnode","children":[]},{"level":2,"title":"更新标签元素","slug":"更新标签元素","link":"#更新标签元素","children":[{"level":3,"title":"更新标签元素的基本原则","slug":"更新标签元素的基本原则","link":"#更新标签元素的基本原则","children":[]},{"level":3,"title":"更新 VNodeData","slug":"更新-vnodedata","link":"#更新-vnodedata","children":[]},{"level":3,"title":"更新子节点","slug":"更新子节点","link":"#更新子节点","children":[]}]},{"level":2,"title":"更新文本节点","slug":"更新文本节点","link":"#更新文本节点","children":[]},{"level":2,"title":"更新 Fragment","slug":"更新-fragment","link":"#更新-fragment","children":[]},{"level":2,"title":"更新 Portal","slug":"更新-portal","link":"#更新-portal","children":[]},{"level":2,"title":"有状态组件的更新","slug":"有状态组件的更新","link":"#有状态组件的更新","children":[{"level":3,"title":"主动更新","slug":"主动更新","link":"#主动更新","children":[]},{"level":3,"title":"初步了解组件的外部状态 props","slug":"初步了解组件的外部状态-props","link":"#初步了解组件的外部状态-props","children":[]},{"level":3,"title":"被动更新","slug":"被动更新","link":"#被动更新","children":[]},{"level":3,"title":"我们需要 shouldUpdateComponent","slug":"我们需要-shouldupdatecomponent","link":"#我们需要-shouldupdatecomponent","children":[]}]},{"level":2,"title":"函数式组件的更新","slug":"函数式组件的更新","link":"#函数式组件的更新","children":[]}],"git":{"updatedTime":1717376101000,"contributors":[{"name":"guoli","email":"guoli@zhihu.com","commits":1}]},"autoDesc":true,"filePathRelative":"Vue-渲染器之patch.md","excerpt":"<p>原文链接: <a href=\\"https://interview.poetries.top/principle-docs/vue/09-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://interview.poetries.top/principle-docs/vue/09-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html</a></p>\\n<blockquote>\\n<p>在上一章中我们讲解并实现了渲染器的挂载逻辑，本质上就是将各种类型的 <code>VNode</code> 渲染成真实DOM的过程。渲染器除了将全新的 <code>VNode</code>\\n挂载成真实DOM之外，它的另外一个职责是负责对新旧 <code>VNode</code> 进行比对，并以合适的方式更新DOM，也就是我们常说的\\n<code>patch</code>。本章内容除了让你了解基本的比对逻辑之外，还讲述了在新旧 <code>VNode</code> 比对的过程中应该遵守怎样的原则，让我们开始吧！</p>\\n</blockquote>"}');export{k as comp,v as data};
