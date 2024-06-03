import{_ as n,c as s,o as a,a as e}from"./app-ByrCXkCX.js";const t={},o=e(`<p>原文链接: <a href="https://interview.poetries.top/principle-docs/vue/07-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8B%E6%8C%82%E8%BD%BD.html" target="_blank" rel="noopener noreferrer">https://interview.poetries.top/principle-docs/vue/07-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8B%E6%8C%82%E8%BD%BD.html</a></p><hr><h2 id="sidebardepth-4" tabindex="-1"><a class="header-anchor" href="#sidebardepth-4"><span>sidebarDepth: 4</span></a></h2><p>TIP</p><p>本章主要讲解渲染器将各种类型的 <code>VNode</code> 挂载为真实 DOM 的原理，阅读本章内容你将对 <code>Fragment</code> 和 <code>Portal</code> 有更加深入的理解，同时渲染器对有状态组件和函数式组件的挂载实际上也透露了有状态组件和函数式组件的实现原理，这都会包含在本章的内容之中。另外本章的代码将使用上一章所编写的 <code>h</code> 函数，所以请确保你已经阅读了上一章的内容。</p><h2 id="责任重大的渲染器" tabindex="-1"><a class="header-anchor" href="#责任重大的渲染器"><span>责任重大的渲染器</span></a></h2><p>所谓渲染器，简单的说就是将 <code>Virtual DOM</code> 渲染成特定平台下真实 <code>DOM</code> 的工具(就是一个函数，通常叫 <code>render</code>)，渲染器的工作流程分为两个阶段：<code>mount</code> 和 <code>patch</code>，如果旧的 <code>VNode</code> 存在，则会使用新的 <code>VNode</code> 与旧的 <code>VNode</code> 进行对比，试图以最小的资源开销完成 <code>DOM</code> 的更新，这个过程就叫 <code>patch</code>，或“打补丁”。如果旧的 <code>VNode</code> 不存在，则直接将新的 <code>VNode</code> 挂载成全新的 <code>DOM</code>，这个过程叫做 <code>mount</code>。</p><p>通常渲染器接收两个参数，第一个参数是将要被渲染的 <code>VNode</code> 对象，第二个参数是一个用来承载内容的容器(<code>container</code>)，通常也叫挂载点，如下代码所示：</p><pre><code>function render(vnode, container) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，只有新的 VNode。使用 \`mount\` 函数挂载全新的 VNode
      mount(vnode, container)
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，也有新的 VNode。则调用 \`patch\` 函数打补丁
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
</code></pre><p>整体思路非常简单，如果旧的 <code>VNode</code> 不存在且新的 <code>VNode</code> 存在，那就直接挂载(<code>mount</code>)新的 <code>VNode</code> ；如果旧的 <code>VNode</code> 存在且新的 <code>VNode</code> 不存在，那就直接将 <code>DOM</code> 移除；如果新旧 <code>VNode</code> 都存在，那就打补丁(<code>patch</code>)：</p><table><thead><tr><th>旧 VNode</th><th>新 VNode</th><th>操作</th></tr></thead><tbody><tr><td>❌</td><td>✅</td><td>调用 <code>mount</code> 函数</td></tr><tr><td>✅</td><td>❌</td><td>移除 <code>DOM</code></td></tr><tr><td>✅</td><td>✅</td><td>调用 <code>patch</code> 函数</td></tr></tbody></table><p>之所以说渲染器的责任非常之大，是因为它不仅仅是一个把 <code>VNode</code> 渲染成真实 <code>DOM</code> 的工具，它还负责以下工作：</p><ul><li>控制部分组件生命周期钩子的调用</li></ul><p>在整个渲染周期中包含了大量的 <code>DOM</code> 操作、组件的挂载、卸载，控制着组件的生命周期钩子调用的时机。</p><ul><li>多端渲染的桥梁</li></ul><p>渲染器也是多端渲染的桥梁，自定义渲染器的本质就是把特定平台操作“DOM”的方法从核心算法中抽离，并提供可配置的方案。</p><ul><li>与异步渲染有直接关系</li></ul><p><code>Vue3</code> 的异步渲染是基于调度器的实现，若要实现异步渲染，组件的挂载就不能同步进行，DOM的变更就要在合适的时机，一些需要在真实DOM存在之后才能执行的操作(如 <code>ref</code>)也应该在合适的时机进行。对于时机的控制是由调度器来完成的，但类似于组件的挂载与卸载以及操作 <code>DOM</code> 等行为的入队还是由渲染器来完成的，这也是为什么 <code>Vue2</code> 无法轻易实现异步渲染的原因。</p><ul><li>包含最核心的 Diff 算法</li></ul><p><code>Diff</code> 算法是渲染器的核心特性之一，可以说正是 <code>Diff</code> 算法的存在才使得 <code>Virtual DOM</code> 如此成功。</p><h2 id="挂载普通标签元素" tabindex="-1"><a class="header-anchor" href="#挂载普通标签元素"><span>挂载普通标签元素</span></a></h2><h3 id="基本原理" tabindex="-1"><a class="header-anchor" href="#基本原理"><span>基本原理</span></a></h3><p>渲染器的责任重大，所以它做的事情也非常多，一口吃成胖子是不太现实的，我们需要一点点地消化。</p><p>在初次调用渲染器渲染某个 <code>VNode</code> 时：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> vnode <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token comment">/*...*/</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>由于没有旧的 <code>VNode</code> 存在，所以会调用 <code>mount</code> 函数挂载全新的 <code>VNode</code> ，这个小节我们就探讨一下渲染器的 <code>mount</code> 函数是如何把 <code>VNode</code> 渲染成真实 <code>DOM</code> 的，以及其中一些核心的关键点。</p><p><code>mount</code> 函数的作用是把一个 <code>VNode</code> 渲染成真实 <code>DOM</code>，根据不同类型的 <code>VNode</code> 需要采用不同的挂载方式，如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mount</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">const</span> <span class="token punctuation">{</span> flags <span class="token punctuation">}</span> <span class="token operator">=</span> vnode</span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">ELEMENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 挂载普通标签</span></span>
<span class="line">        <span class="token function">mountElement</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 挂载组件</span></span>
<span class="line">        <span class="token function">mountComponent</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">TEXT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 挂载纯文本</span></span>
<span class="line">        <span class="token function">mountText</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">FRAGMENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 挂载 Fragment</span></span>
<span class="line">        <span class="token function">mountFragment</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">PORTAL</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 挂载 Portal</span></span>
<span class="line">        <span class="token function">mountPortal</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们根据 <code>VNode</code> 的 <code>flags</code> 属性值能够区分一个 <code>VNode</code> 对象的类型，不同类型的 <code>VNode</code> 采用不同的挂载函数：</p><p>我们首先来讨论一下 <code>mountElement</code> 函数，它用于挂载普通标签元素。我们在&quot;组件的本质&quot;一章中曾经编写过如下这段代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mountElement</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">const</span> el <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>tag<span class="token punctuation">)</span></span>
<span class="line">      container<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>el<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一个极简的用于挂载普通标签元素的 <code>mountElement</code> 函数，它会调用浏览器提供的 <code>document.createElement</code> 函数创建元素，接着调用 <code>appendChild</code> 函数将元素添加到 <code>container</code> 中，但它具有以下缺陷：</p><ul><li>1、<code>VNode</code> 被渲染为真实DOM之后，没有引用真实DOM元素</li><li>2、没有将 <code>VNodeData</code> 应用到真实DOM元素上</li><li>3、没有继续挂载子节点，即 <code>children</code></li><li>4、不能严谨地处理 <code>SVG</code> 标签</li></ul><p>针对这四个问题，我们逐个去解决。先来看第一个问题：<strong><code>VNode</code> 被渲染为真实DOM之后，没有引用真实DOM元素</strong>，这个问题很好解决，只需要添加一行代码即可：</p><pre><code>function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)
  vnode.el = el
  container.appendChild(el)
}
</code></pre><p>再来看第二个问题：<strong>没有将<code>VNodeData</code> 应用到元素上</strong>，我们知道 <code>VNodeData</code> 作为 <code>VNode</code> 的描述，对于标签元素来说它包含了元素的样式、事件等诸多信息，我们需要将这些信息应用到新创建的真实DOM元素上，假设我们有如下 <code>VNode</code>：</p><p>TIP</p><p>再次强调，本章使用上一章节中所编写的 <code>h</code> 函数。</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> elementVnode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span></span>
<span class="line">      <span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">style</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token string">&#39;100px&#39;</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token string">&#39;100px&#39;</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">background</span><span class="token operator">:</span> <span class="token string">&#39;red&#39;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们使用 <code>h</code> 函数创建了一个描述 <code>div</code> 标签的 <code>VNode</code> 对象，观察 <code>VNodeData</code> 可以发现，它拥有一些内联样式，所以在 <code>mountElement</code> 函数内，我们需要将这些内联样式应用到元素上，我们给 <code>mountElement</code> 增加如下代码：</p><pre><code>function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)

  // 拿到 VNodeData
  const data = vnode.data
  if (data) {
    // 如果 VNodeData 存在，则遍历之
    for(let key in data) {
      // key 可能是 class、style、on 等等
      switch(key) {
        case &#39;style&#39;:
          // 如果 key 的值是 style，说明是内联样式，逐个将样式规则应用到 el
          for(let k in data.style) {
            el.style[k] = data.style[k]
          }
        break
      }
    }
  }

  container.appendChild(el)
}
</code></pre><p>如上代码所示，在创建真实DOM之后，我们需要检查 <code>VNodeData</code> 是否存在，如果 <code>VNodeData</code> 存在则遍历之。由于 <code>VNodeData</code> 中不仅仅包含内联样式的描述(即 <code>style</code>)，还可能包含其他描述如 <code>class</code>、事件等等，所以我们使用 <code>switch...case</code> 语句对不同的 <code>key</code> 值做区分处理，以 <code>style</code> 为例，我们只需要将 <code>data.style</code> 中的样式规则应用到真实DOM即可。使用渲染器渲染 <code>elementVNode</code> 的效果如下：</p><p>对于 <code>class</code> 或事件或其他DOM属性都是类似的处理方式，为了不偏题我们放到后面统一讲解，接下来我们来看第三个问题：<strong>没有继续挂载子节点，即<code>children</code></strong>，我们知道 <code>VNode</code> 是有可能存在子节点的，现在的 <code>mountElement</code> 函数仅仅将该 <code>VNode</code> 本身所描述的DOM元素添加到了页面中，却没有理会其子节点，为了递归地挂载子节点，我们需要为 <code>mountElement</code> 函数增加如下代码：</p><pre><code>function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)
  vnode.el = el
  // 省略处理 VNodeData 相关的代码

  // 递归挂载子节点
  if (vnode.children) {
    for (let i = 0; i &lt; vnode.children.length; i++) {
      mountElement(vnode.children[i], el)
    }
  }

  container.appendChild(el)
}
</code></pre><p>观察如上代码中用来递归挂载子节点的代码，我们默认把 <code>vnode.children</code> 当作数组来处理，同时递归挂载的时候调用的仍然是 <code>mountElement</code> 函数。这存在两个瑕疵，第一个瑕疵是 <code>VNode</code> 对象的 <code>children</code> 属性不总是数组，因为当 <code>VNode</code> 只有一个子节点时，该 <code>VNode</code> 的 <code>children</code> 属性直接指向该子节点，且 <code>VNode</code> 的 <code>childFlags</code> 的值为 <code>ChildrenFlags.SINGLE_VNODE</code>，所以我们不应该总是使用 <code>for</code> 循环遍历 <code>vnode.children</code>。第二个瑕疵是我们在 <code>for</code> 循环内部直接调用了 <code>mountElement</code> 属性去挂载每一个 <code>children</code> 中的 <code>VNode</code> 对象，但问题是 <code>children</code> 中的 <code>VNode</code> 对象可能是任意类型的，所以我们不应该直接调用 <code>mountElement</code> 函数，而是应该调用 <code>mount</code> 函数。更加严谨的代码如下：</p><pre><code>function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)
  vnode.el = el
  // 省略处理 VNodeData 的代码

  // 拿到 children 和 childFlags
  const childFlags = vnode.childFlags
  const children = vnode.children
  // 检测如果没有子节点则无需递归挂载
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags &amp; ChildrenFlags.SINGLE_VNODE) {
      // 如果是单个子节点则调用 mount 函数挂载
      mount(children, el)
    } else if (childFlags &amp; ChildrenFlags.MULTIPLE_VNODES) {
      // 如果是单多个子节点则遍历并调用 mount 函数挂载
      for (let i = 0; i &lt; children.length; i++) {
        mount(children[i], el)
      }
    }
  }

  container.appendChild(el)
}
</code></pre><p>如上代码所示，我们通过 <code>vnode.childFlags</code> 拿到该 <code>VNode</code> 子节点的类型，接着检测其是否含有子节点，如果存在子节点，会检测是单个子节点还是多个子节点，只有当存在多个子节点时其 <code>children</code> 属性才是可遍历的数组，最后调用 <code>mount</code> 函数挂载之。</p><p>我们尝试修改之前的 <code>elementVNode</code>，为其添加子节点：</p><pre><code>const elementVnode = h(
  &#39;div&#39;,
  {
    style: {
      height: &#39;100px&#39;,
      width: &#39;100px&#39;,
      background: &#39;red&#39;
    }
  },
  h(&#39;div&#39;, {
    style: {
      height: &#39;50px&#39;,
      width: &#39;50px&#39;,
      background: &#39;green&#39;
    }
  })
)
</code></pre><p>如上代码可知，我们为 <code>elementVnode</code> 添加了一个子节点，该子节点是一个边长为 <code>50px</code> 的绿色正方形，使用渲染器渲染修改后的 <code>elementVnode</code> 的效果如下：</p><p>接着我们来看最后一个问题：<strong>不能严谨地处理<code>SVG</code> 标签</strong>，在之前的 <code>mountElement</code> 函数中我们使用 <code>document.createElement</code> 函数创建DOM元素，但是对于 <code>SVG</code> 标签，更加严谨的方式是使用 <code>document.createElementNS</code> 函数，修改 <code>mountElement</code> 如下：</p><pre><code>function mountElement(vnode, container) {
  const isSVG = vnode.flags &amp; VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS(&#39;http://www.w3.org/2000/svg&#39;, vnode.tag)
    : document.createElement(vnode.tag)
  vnode.el = el
  // 省略...
}
</code></pre><p>我们通过 <code>vnode.flags</code> 来判断一个标签是否是 <code>SVG</code>，但是大家不要忘记 <code>vnode.flags</code> 是如何被标记为 <code>VNodeFlags.ELEMENT_SVG</code>的，我们在讲解 <code>h</code> 函数时说明过这个问题，如下代码所示：</p><pre><code>function h(tag, data, children) {
  let flags = null
  if (typeof tag === &#39;string&#39;) {
    flags = tag === &#39;svg&#39; ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  }
}
</code></pre><p>我们注意到，只有当标签名字全等于字符串 <code>&#39;svg&#39;</code> 时，该 <code>VNode</code> 的 <code>flags</code> 才会被标记为 <code>VNodeFlags.ELEMENT_SVG</code>，这意味着 <code>&lt;circle/&gt;</code> 标签不会被标记为 <code>VNodeFlags.ELEMENT_SVG</code>，所以在创建 <code>&lt;circle/&gt;</code> 元素时并不会使用 <code>document.createElementNS</code> 函数，但 <code>&lt;circle/&gt;</code> 标签确实是 <code>svg</code> 标签，如何解决这个问题呢？其实很简单，因为 <strong><code>svg</code> 的书写总是以 <code>&lt;svg&gt;</code> 标签开始的，所有其他 <code>svg</code> 相关的标签都是 <code>&lt;svg&gt;</code> 标签的子代元素</strong>。所以解决方案就是：在 <code>mountElement</code> 函数中一旦 <code>isSVG</code> 为真，那么后续创建的所有子代元素都会被认为是 <code>svg</code> 标签，我们需要修改 <code>mountElement</code> 函数，为其添加第三个参数，如下：</p><pre><code>function mountElement(vnode, container, isSVG) {
  isSVG = isSVG || vnode.flags &amp; VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS(&#39;http://www.w3.org/2000/svg&#39;, vnode.tag)
    : document.createElement(vnode.tag)
  // 省略处理 VNodeData 的代码

  const childFlags = vnode.childFlags
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags &amp; ChildrenFlags.SINGLE_VNODE) {
      // 这里需要把 isSVG 传递下去
      mount(children, el, isSVG)
    } else if (childFlags &amp; ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i &lt; children.length; i++) {
        // 这里需要把 isSVG 传递下去
        mount(children[i], el, isSVG)
      }
    }
  }

  container.appendChild(el)
}
</code></pre><p>如上代码所示，我们为 <code>mountElement</code> 增加了第三个参数 <code>isSVG</code>，接着在判断一个 <code>VNode</code> 是否是 <code>svg</code> 元素时优先使用参数中的 <code>isSVG</code> 作为判断条件，并且使用 <code>vnode.flags &amp; VNodeFlags.ELEMENT_SVG</code> 作为回退判断条件，最后在挂载子节点的时候将 <code>isSVG</code> 参数传递下去。这样我们就能达到一个目的：<strong>即使<code>&lt;circle/&gt;</code> 标签对应的 <code>vnode.flags</code> 不是 <code>VNodeFlags.ELEMENT_SVG</code>，但在 <code>mountElement</code> 函数看来它依然是 <code>svg</code> 标签</strong>。</p><p>TIP</p><p>实际上我们也应该对大部分挂载函数做一定的修改，即增加第三个参数，这里就省略了。完整可运行代码请查看：<a href="https://codesandbox.io/s/6v38x6k0nw" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/6v38x6k0nw</a><a href="https://codesandbox.io/s/6v38x6k0nw" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="class的处理" tabindex="-1"><a class="header-anchor" href="#class的处理"><span>class的处理</span></a></h3><p>前面我们在 <code>mountElement</code> 函数中实现了将内联样式应用到元素的功能，接着我们来想办法将 <code>class</code> 也应用到元素上，在开始实现功能之前我们第一步要做的是：<strong>设计数据结构</strong> ，比如我们采用了 <code>data.style</code> 来存储内联样式的数据，并且其数据结构就是一个 <code>key-value</code> 的映射，对于 <code>class</code> 我们希望使用 <code>data.class</code> 来存储其数据，并且我们希望 <code>data.class</code> 的值就是类名字符串，例如：</p><pre><code>const elementVnode = h(
  &#39;div&#39;,
  {
    class: &#39;cls-a cls-b&#39;
  }
)
</code></pre><p>这样我们就可以轻松将类名列表添加到DOM元素上，我们为 <code>mountElement</code> 添加如下代码：</p><pre><code>function mountElement(vnode, container, isSVG) {
  // 省略...

  const data = vnode.data
  if (data) {
    for (let key in data) {
      switch (key) {
        case &#39;style&#39;:
          for (let k in data.style) {
            el.style[k] = data.style[k]
          }
          break
        case &#39;class&#39;:
          el.className = data[key]
          break
        default:
          break
      }
    }
  }

  // 省略...
}
</code></pre><p>如上高亮代码所示，我们给 <code>switch</code> 添加了一个 <code>case</code> 语句块，用来匹配 <code>VNodeData</code> 中的 <code>class</code> 数据，由于我们将 <code>data.class</code> 设计成了可直接使用的类名列表字符串，所以只需要直接将 <code>data.class</code> 赋值给 <code>el.className</code> 即可，如下是渲染 <code>elementVNode</code> 的效果：</p><p>效果已经达到了，但是我们需要额外思考一些东西。在上面的讲解中我们直接把 <code>data.class</code> 的数据结构设计成可直接使用的类名列表字符串，但这是很底层的设计，换句话说这是框架层面的设计，我们还需要考虑应用层的设计，什么意思呢？来看如下这段模板：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>cls-a<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dynamicClass<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这段模板中我们同时使用了 <code>class</code> 属性和绑定的 <code>:class</code> 属性，对于非绑定的 <code>class</code> 属性来说它的值就是我们最终想要的类名列表字符串，但是对于绑定的 <code>:class</code> 属性来说它的值是动态的 <code>javascript</code> 值，所以我们需要设计一下哪些值是被允许的。</p><p>首先数组应该是被允许的：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    dynamicClass <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&#39;class-b&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;class-c&#39;</span><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>对象也应该是被允许的：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    dynamicClass <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token string-property property">&#39;class-b&#39;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token string-property property">&#39;class-c&#39;</span><span class="token operator">:</span> <span class="token boolean">true</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在编译器对模板进行编译时，我们把非绑定和绑定的 <code>class</code> 属性值合并，如下是我们期望编译器对上面模板的编译结果：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">class</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;class-a&#39;</span><span class="token punctuation">,</span> dynamicClass<span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果 <code>dynamicClass</code> 是数组，那么如上代码等价于：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">class</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;class-a&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">&#39;class-b&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;class-c&#39;</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果 <code>dynamicClass</code> 是对象，那么编译的结果等价于：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">class</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token string">&#39;class-a&#39;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">          <span class="token string-property property">&#39;class-b&#39;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token string-property property">&#39;class-c&#39;</span><span class="token operator">:</span> <span class="token boolean">true</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到在使用 <code>h</code> 函数创建 <code>VNode</code> 时，<code>VNodeData</code> 中的 <code>class</code> 还不可能是我们最终想要的类名列表字符串，那怎么办呢？很简单，我们只需要在 <code>h</code> 函数内部编写一个函数将如上数据结构序列化成我们想要的类名列表字符串就可以了，这就像一个小小的算法题目，相信大家都写的出来，这里就不展开讲解，下面的链接中拥有完整的可执行代码。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/397w7kxy1" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/397w7kxy1</a><a href="https://codesandbox.io/s/397w7kxy1" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>实际上，通过对 <code>class</code> 的讲解，我们涉及了在框架设计中比较重要的概念：<strong>应用层的设计</strong> ，这是框架设计的核心，在设计一个功能的时候，你首先要考虑的应该是应用层的使用，然后再考虑如何与底层衔接。还是以 <code>class</code> 为例，为一个标签元素设置类名的方法是可定的(调用 <code>el.className</code> 或 <code>setAttribute</code>)，关键就在于你想在应用层做出怎样的设计，很自然的你要思考如何转化应用层的数据结构与底层衔接。</p><h3 id="attributes-和-dom-properties" tabindex="-1"><a class="header-anchor" href="#attributes-和-dom-properties"><span>Attributes 和 DOM Properties</span></a></h3><p>接下来我们讲一讲DOM的 <code>Attributes</code> 以及 <code>Properties</code>，下面我们分别简称他们为 <code>attr</code> 和 <code>DOM Prop</code>，那么他们两个之间有什么区别呢？这里我们简单解释一下，我们知道浏览器在加载页面之后会对页面中的标签进行解析，并生成与之相符的 DOM 对象，每个标签中都可能包含一些属性，如果这些属性是<strong>标准属性</strong> ，那么解析生成的DOM对象中也会包含与之对应的属性，例如：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>page<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>由于 <code>id</code> 是标准属性，所以我们可以通过 <code>document.body.id</code> 来访问它的值，实际上我们常说的 <code>Attr</code> 指的就是那些存在于标签上的属性，而 <code>DOM Prop</code> 就是存在于DOM对象上的属性。但是当标签上存在非标准属性时，该属性不会被转化为 <code>DOM Prop</code>，例如：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token operator">&lt;</span>body custom<span class="token operator">=</span><span class="token string">&quot;val&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>body<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>由于 <code>custom</code> 是非标准属性，所以当你尝试通过 <code>document.body.custom</code> 访问其值时会得到 <code>undefined</code>，这也是为什么 <code>setAttribute</code> 方法存在的原因，因为该方法允许我们为 DOM 元素设置自定义属性（不会初始化同名的 <code>property</code>）。另外该方法也允许我们为 DOM 元素设置标准属性的值，所以我们可不可以总是使用 <code>setAttribute</code> 设置全部的 <code>DOM</code> 属性呢？答案是：不行。举个例子：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// checkbox 元素</span></span>
<span class="line">    <span class="token keyword">const</span> checkboxEl <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;input&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token comment">// 使用 setAttribute 设置 checked 属性为 false</span></span>
<span class="line">    checkboxEl<span class="token punctuation">.</span><span class="token function">setAttribute</span><span class="token punctuation">(</span><span class="token string">&#39;checked&#39;</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>checkboxEl<span class="token punctuation">.</span>checked<span class="token punctuation">)</span> <span class="token comment">// true</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到虽然我们使用 <code>setAttribute</code> 函数将复选框的 <code>checked</code> 属性设置为 <code>false</code>，但是当我们访问 <code>checkboxEl.checked</code> 时得到的依然是 <code>true</code>，这是因为在 <code>setAttribute</code> 函数为元素设置属性时，无论你传递的值是什么类型，它都会将该值转为字符串再设置到元素上，所以如下两句代码是等价的：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    checkboxEl<span class="token punctuation">.</span><span class="token function">setAttribute</span><span class="token punctuation">(</span><span class="token string">&#39;checked&#39;</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token comment">// 等价于</span></span>
<span class="line">    checkboxEl<span class="token punctuation">.</span><span class="token function">setAttribute</span><span class="token punctuation">(</span><span class="token string">&#39;checked&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;false&#39;</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>TIP</p><p>一些特殊的 <code>attribute</code>，比如 <code>checked/disabled</code> 等，只要出现了，对应的 <code>property</code> 就会被初始化为 <code>true</code>，无论设置的值是什么,只有调用 <code>removeAttribute</code> 删除这个 <code>attribute</code>，对应的 <code>property</code> 才会变成 <code>false</code>。</p><p>这就指引我们有些属性不能通过 <code>setAttribute</code> 设置，而是应该直接通过 DOM 元素设置：<code>el.checked = true</code>。好在这样的属性不多，我们可以列举出来：<code>value</code>、<code>checked</code>、<code>selected</code>、<code>muted</code>。除此之外还有一些属性也需要使用 <code>Property</code> 的方式设置到 DOM 元素上，例如 <code>innerHTML</code> 和 <code>textContent</code> 等等。</p><p>刚才我们讲解了为什么同样是写在标签上的属性，却要区分对待的原因，接下来我们进入正题，开始完成将属性应用到 DOM 元素上的实现，到目前为止，我们已经为 <code>VNodeData</code> 设计了三个属性，如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">style</span><span class="token operator">:</span> <span class="token operator">...</span><span class="token punctuation">,</span> <span class="token comment">// 内联样式数据</span></span>
<span class="line">      <span class="token keyword">class</span><span class="token operator">:</span> <span class="token operator">...</span><span class="token punctuation">,</span> <span class="token comment">// class 数据</span></span>
<span class="line">      <span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token operator">...</span> <span class="token comment">// Portal 的挂载目标</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来我们还会为 <code>VNodeData</code> 添加更多属性，用来存储标签的数据，如下 <code>input</code> 标签所示：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>cls-a<span class="token punctuation">&quot;</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>checkbox<span class="token punctuation">&quot;</span></span> <span class="token attr-name">checked</span> <span class="token attr-name">custom</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>1<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>它有四个属性，我们打算在 <code>VNodeData</code> 中存储其属性名以及数据：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;input&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">class</span><span class="token operator">:</span> <span class="token string">&#39;cls-a&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;checkbox&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">checked</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">custom</span><span class="token operator">:</span> <span class="token string">&#39;1&#39;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，我们已经实现了关于 <code>class</code>、<code>style</code> 的处理，所以接下来我们要处理的就是 <code>VNodeData</code> 中除 <code>class</code> 和 <code>style</code> 之外的全部数据，当然也要排除 <code>VNodeData</code> 中的 <code>target</code> 属性，因为它只用于 <code>Portal</code>。处理方式很简单，我们为 <code>mountElement</code> 函数添加如下高亮代码：</p><pre><code>const domPropsRE = /\\[A-Z]|^(?:value|checked|selected|muted)$/
function mountElement(vnode, container, isSVG) {
  // 省略...

  const data = vnode.data
  if (data) {
    for (let key in data) {
      switch (key) {
        case &#39;style&#39;:
          for (let k in data.style) {
            el.style[k] = data.style[k]
          }
          break
        case &#39;class&#39;:
          el.className = data[key]
          break
        default:
          if (domPropsRE.test(key)) {
            // 当作 DOM Prop 处理
            el[key] = data[key]
          } else {
            // 当作 Attr 处理
            el.setAttribute(key, data[key])
          }
          break
      }
    }
  }

  // 省略...
}
</code></pre><p>如上高亮代码所示，我们首先创建了一个正则表达式 <code>domPropsRE</code>，用来检测那些应该以 <code>Property</code> 的方式添加到 DOM 元素上的属性，其他的属性使用 <code>setAttribute</code> 方法设置。另外我们注意到正则 <code>domPropsRE</code> 除了用来匹配我们前面说过的固定的几个属性之外，它还能匹配那些拥有大写字母的属性，这是为了匹配诸如 <code>innerHTML</code>、<code>textContent</code> 等属性设计的，同时这也顺便实现了一个特性，即拥有大写字母的属性我们都会采用 <code>el[key] = xxx</code> 的方式将其添加到 DOM 元素上。</p><p>如下是渲染上面 <code>input</code> 标签的效果图：</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/821421zvp8" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/821421zvp8</a><a href="https://codesandbox.io/s/821421zvp8" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="事件的处理" tabindex="-1"><a class="header-anchor" href="#事件的处理"><span>事件的处理</span></a></h3><p>现在我们只剩下为 DOM 元素添加事件了，实际上在 <code>mount</code> 阶段为 DOM 元素添加事件很容易，我们只需要在元素对象上调用 <code>addEventListener</code> 方法即可，关键在于我们的 <code>VNodeData</code> 要如何设计。</p><p>通常我们给元素添加事件的规则是<strong>使用<code>v-on</code> 或 <code>@</code> 符号加上事件名字</strong>，例如给元素添加点击事件：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>handler<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>当然事件名字中不包含 <code>&#39;on&#39;</code> 前缀，即 <code>click</code> 而不是 <code>onclick</code>，我们可以用如下 <code>VNode</code> 对象来描述如上模板：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> elementVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">click</span><span class="token operator">:</span> handler</span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然而这么做是有问题的，如上代码所示 <code>elementVNode</code> 的 <code>VNodeData</code> 中的 <code>click</code> 属性没办法与其他DOM属性区分，所以渲染器并不知道 <code>click</code> 属性代表的是事件，当然我们可以做出规定，例如我们规定 <code>VNodeData</code> 中的 <code>click</code> 属性是个特殊的属性，它用来存储事件回调函数，但这是很笨的方法，因为 DOM 原生事件很多，这种方案需要我们一一列举所有 DOM 事件并且扩展性很差。所以我们需要考虑如何将事件与属性区分，其实我们就沿用原生 DOM 对象的设计即可，在原生 DOM 对象中所有事件函数的名字都是 <code>&#39;on&#39; + 事件名称</code> 的形式，所以我们可以在 <code>VNodeData</code> 中使用 <code>onclick</code> 代替 <code>click</code>：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> elementVNode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">onclick</span><span class="token operator">:</span> handler</span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然从模板到 <code>VNodeData</code> 的这个变化是由编译器来做的，这样设计之后我们就可以很容易地区分 <code>VNodeData</code> 中的某个属性是 DOM 属性还是 DOM 事件：<strong>只需要检测属性名的前两个字符是不是<code>&#39;on&#39;</code> 即可</strong>。</p><p>在区分出事件之后，我们就可以着手将事件添加到 DOM 元素上了，只需调用 <code>el.addEventListener</code> 方法即可，如下：</p><pre><code>function mountElement(vnode, container, isSVG) {
  // 省略...

  const data = vnode.data
  if (data) {
    for (let key in data) {
      switch (key) {
        case &#39;style&#39;:
          for (let k in data.style) {
            el.style[k] = data.style[k]
          }
          break
        case &#39;class&#39;:
          if (isSVG) {
            el.setAttribute(&#39;class&#39;, data[key])
          } else {
            el.className = data[key]
          }
          break
        default:
          if (key[0] === &#39;o&#39; &amp;&amp; key[1] === &#39;n&#39;) {
            // 事件
            el.addEventListener(key.slice(2), data[key])
          } else if (domPropsRE.test(key)) {
            // 当作 DOM Prop 处理
            el[key] = data[key]
          } else {
            // 当作 Attr 处理
            el.setAttribute(key, data[key])
          }
          break
      }
    }
  }

  // 省略...
}
</code></pre><p>如上高亮代码所示，我们通过检查 <code>VNodeData</code> 对象的键名(<code>key</code>)的前两个字符是否是 <code>&#39;on&#39;</code>，来区分其是否是事件，如果是事件则调用 <code>el.addEventListener</code> 将事件回调函数添加到元素上。</p><p>我们可以测试一下我们的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 事件回调函数</span></span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">handler</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">&#39;click me&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// VNode</span></span>
<span class="line">    <span class="token keyword">const</span> elementVnode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">style</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token string">&#39;100px&#39;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token string">&#39;100px&#39;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">backgroundColor</span><span class="token operator">:</span> <span class="token string">&#39;red&#39;</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token comment">// 点击事件</span></span>
<span class="line">      <span class="token literal-property property">onclick</span><span class="token operator">:</span> handler</span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>elementVnode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其效果如下，当点击红色方块时会触发点击事件执行回调函数：</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/jzvjwp7p75" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/jzvjwp7p75</a><a href="https://codesandbox.io/s/jzvjwp7p75" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>需要强调的是，在 <code>mount</code> 阶段我们没有考虑事件更新的情况，我们会在讲解 <code>patch</code> 阶段的内容时说明。</p><h2 id="挂载纯文本、fragment-和-portal" tabindex="-1"><a class="header-anchor" href="#挂载纯文本、fragment-和-portal"><span>挂载纯文本、Fragment 和 Portal</span></a></h2><h3 id="挂载文本节点" tabindex="-1"><a class="header-anchor" href="#挂载文本节点"><span>挂载文本节点</span></a></h3><p>如果一个 <code>VNode</code> 的类型是 <code>VNodeFlags.TEXT</code>，那么 <code>mount</code> 函数会调用 <code>mountText</code> 函数挂载该纯文本元素：</p><pre><code>function mount(vnode, container, isSVG) {
  const { flags } = vnode
  if (flags &amp; VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG)
  } else if (flags &amp; VNodeFlags.COMPONENT) {
    // 挂载组件
    mountComponent(vnode, container, isSVG)
  } else if (flags &amp; VNodeFlags.TEXT) {
    // 挂载纯文本
    mountText(vnode, container)
  } else if (flags &amp; VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
    mountFragment(vnode, container, isSVG)
  } else if (flags &amp; VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container)
  }
}
</code></pre><p><code>mountText</code> 函数实现起来很简单，由于纯文本类型的 <code>VNode</code> 其 <code>children</code> 属性存储着与之相符的文本字符串，所以只需要调用 <code>document.createTextNode</code> 函数创建一个文本节点即可，然后将其添加到 <code>container</code> 中，如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mountText</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">const</span> el <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createTextNode</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>children<span class="token punctuation">)</span></span>
<span class="line">      vnode<span class="token punctuation">.</span>el <span class="token operator">=</span> el</span>
<span class="line">      container<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>el<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们修改一下之前的 <code>elementVNode</code>，为其添加一个文本子节点：</p><pre><code>const elementVNode = h(
  &#39;div&#39;,
  {
    style: {
      height: &#39;100px&#39;,
      width: &#39;100px&#39;,
      background: &#39;red&#39;
    }
  },
  &#39;我是文本&#39;
)
</code></pre><p>使用渲染器渲染如上 <code>elementVnode</code> 的结果如下图所示：</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/72zq40y0q6" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/72zq40y0q6</a><a href="https://codesandbox.io/s/72zq40y0q6" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="挂载-fragment" tabindex="-1"><a class="header-anchor" href="#挂载-fragment"><span>挂载 Fragment</span></a></h3><p>其实挂载 <code>Fragment</code> 和单纯地挂载一个 <code>VNode</code> 的 <code>children</code> 是没什么区别的，在没有 <code>Fragment</code> 时我们要想挂载一个片段，这个片段必须使用包裹元素包裹，如下：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token comment">&lt;!-- div 就是包裹元素 --&gt;</span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有了 <code>Fragment</code> 则不需要包裹元素：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Fragment</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Fragment</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这两段代码的区别是：<code>&lt;Fragment&gt;</code> 标签不会被渲染为真实DOM，也就不会产生多余的DOM元素，再来观察一下这两个模板片段对应的 <code>VNode</code>：</p><ul><li><p>没有 <code>Fragment</code>：</p><p>const elementVNode = { flags: VNodeFlags.ELEMENT_HTML, tag: &quot;div&quot;, data: null, childFlags: ChildrenFlags.MULTIPLE_VNODES, children: [ { flags: VNodeFlags.ELEMENT_HTML, tag: &#39;h1&#39;, data: null, childFlags: ChildrenFlags.NO_CHILDREN, children: null, el: null }, { flags: VNodeFlags.ELEMENT_HTML, tag: &#39;p&#39;, data: null childFlags: ChildrenFlags.NO_CHILDREN, children: null, el: null } ], el: null }</p></li><li><p>有 <code>Fragment</code>：</p><p>const elementVNode = { flags: VNodeFlags.FRAGMENT, tag: null, data: null, childFlags: ChildrenFlags.MULTIPLE_VNODES, children: [ { flags: VNodeFlags.ELEMENT_HTML, tag: &#39;h1&#39;, data: null, childFlags: ChildrenFlags.NO_CHILDREN, children: null, el: null }, { flags: VNodeFlags.ELEMENT_HTML, tag: &#39;p&#39;, data: null childFlags: ChildrenFlags.NO_CHILDREN, children: null, el: null } ], el: null }</p></li></ul><p>通过对比可以很容易地发现，使用包裹元素的模板与 <code>Fragment</code> 唯一的区别就是 <code>elementVNode.flags</code> 和 <code>elementVNode.tag</code> 的不同。在 <code>mount</code> 函数内部，如果一个 <code>VNode</code> 的类型是 <code>Fragment</code> (即 <code>VNodeFlags.FRAGMENT</code>)，则会使用 <code>mountFragment</code> 函数进行挂载，实际上对于 <code>Fragment</code> 类型的 <code>VNode</code> 的挂载，就等价于只挂载一个 <code>VNode</code> 的 <code>children</code>，仅此而已，实现如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mountFragment</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 拿到 children 和 childFlags</span></span>
<span class="line">      <span class="token keyword">const</span> <span class="token punctuation">{</span> children<span class="token punctuation">,</span> childFlags <span class="token punctuation">}</span> <span class="token operator">=</span> vnode</span>
<span class="line">      <span class="token keyword">switch</span> <span class="token punctuation">(</span>childFlags<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">case</span> ChildrenFlags<span class="token punctuation">.</span><span class="token constant">SINGLE_VNODE</span><span class="token operator">:</span></span>
<span class="line">          <span class="token comment">// 如果是单个子节点，则直接调用 mount</span></span>
<span class="line">          <span class="token function">mount</span><span class="token punctuation">(</span>children<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span></span>
<span class="line">          <span class="token keyword">break</span></span>
<span class="line">        <span class="token keyword">case</span> ChildrenFlags<span class="token punctuation">.</span><span class="token constant">NO_CHILDREN</span><span class="token operator">:</span></span>
<span class="line">          <span class="token comment">// 如果没有子节点，等价于挂载空片段，会创建一个空的文本节点占位</span></span>
<span class="line">          <span class="token keyword">const</span> placeholder <span class="token operator">=</span> <span class="token function">createTextVNode</span><span class="token punctuation">(</span><span class="token string">&#39;&#39;</span><span class="token punctuation">)</span></span>
<span class="line">          <span class="token function">mountText</span><span class="token punctuation">(</span>placeholder<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">          <span class="token keyword">break</span></span>
<span class="line">        <span class="token keyword">default</span><span class="token operator">:</span></span>
<span class="line">          <span class="token comment">// 多个子节点，遍历挂载之</span></span>
<span class="line">          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> children<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">mount</span><span class="token punctuation">(</span>children<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>逻辑非常简单，既然只需要挂载 <code>children</code>，那么就必须拿到 <code>children</code> 才行，顺便拿到 <code>children</code> 的类型 <code>childFlags</code>，然后根据不同的类型采用不同的挂载方式，其本质就是递归地调用 <code>mount</code> 函数进行挂载。</p><p>我们可以修改 <code>elementVnode</code>，让它的子节点是一个 <code>Fragment</code>。 如下：</p><pre><code>const elementVNode = h(
  &#39;div&#39;,
  {
    style: {
      height: &#39;100px&#39;,
      width: &#39;100px&#39;,
      background: &#39;red&#39;
    }
  },
  h(Fragment, null, [
    h(&#39;span&#39;, null, &#39;我是标题1......&#39;),
    h(&#39;span&#39;, null, &#39;我是标题2......&#39;)
  ])
)
</code></pre><p>最终的渲染效果如下图所示：</p><p>另外对于 <code>Fragment</code> 类型的 <code>VNode</code> 来说，当它被渲染为真实DOM之后，其 <code>el</code> 属性的引用是谁呢？这需要根据片段中节点的数量来决定，如果只有一个节点，那么 <code>el</code> 属性就指向该节点；如果有多个节点，则 <code>el</code> 属性值是第一个节点的引用；如果片段中没有节点，即空片段，则 <code>el</code> 属性引用的是占位的空文本节点元素，所以我们需要为 <code>mountFragment</code> 函数增加三句代码，如下：</p><pre><code>function mountFragment(vnode, container, isSVG) {
  const { children, childFlags } = vnode
  switch (childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      mount(children, container, isSVG)
      // 单个子节点，就指向该节点
      vnode.el = children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      const placeholder = createTextVNode(&#39;&#39;)
      mountText(placeholder, container)
      // 没有子节点指向占位的空文本节点
      vnode.el = placeholder.el
      break
    default:
      for (let i = 0; i &lt; children.length; i++) {
        mount(children[i], container, isSVG)
      }
      // 多个子节点，指向第一个子节点
      vnode.el = children[0].el
  }
}
</code></pre><p>那么这样设计有什么意义呢？这是因为在 <code>patch</code> 阶段对DOM元素进行移动时，应该确保将其放到正确的位置，而不应该始终使用 <code>appendChild</code> 函数，有时需要使用 <code>insertBefore</code> 函数，这时候我们就需要拿到相应的节点引用，这时候 <code>vnode.el</code> 属性是必不可少的，就像上面的代码中即使 <code>Fragment</code> 没有子节点我们依然需要一个占位的空文本节点作为位置的引用。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/109r8nlwk4" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/109r8nlwk4</a><a href="https://codesandbox.io/s/109r8nlwk4" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="挂载-portal" tabindex="-1"><a class="header-anchor" href="#挂载-portal"><span>挂载 Portal</span></a></h3><p>实际上 <code>Portal</code> 可以不严谨地认为是<strong>可以被到处挂载的<code>Fragment</code></strong>。类型为 <code>Fragment</code> 的 <code>VNode</code> 其 <code>tag</code> 属性值为 <code>null</code>，而类型是 <code>Portal</code> 的 <code>VNode</code> 其 <code>tag</code> 属性值为挂载点(选择器或真实DOM元素)。实现 <code>Portal</code> 的关键是要将其 <code>VNode</code> 的 <code>children</code> 中所包含的子 <code>VNode</code> 挂载到 <code>tag</code> 属性所指向的挂载点，<code>mountPortal</code> 函数的实现如下：</p><pre><code>function mountPortal(vnode, container) {
  const { tag, children, childFlags } = vnode

  // 获取挂载点
  const target = typeof tag === &#39;string&#39; ? document.querySelector(tag) : tag

  if (childFlags &amp; ChildrenFlags.SINGLE_VNODE) {
    // 将 children 挂载到 target 上，而非 container
    mount(children, target)
  } else if (childFlags &amp; ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i &lt; children.length; i++) {
      // 将 children 挂载到 target 上，而非 container
      mount(children[i], target)
    }
  }
}
</code></pre><p>如上代码所示，挂载 <code>Portal</code> 的关键是我们需要通过 <code>vnode.tag</code> 获取到真正的挂载点，也就是 <code>target</code>，真正挂载时使用此挂载点代替 <code>container</code> 即可。</p><p>那么对于 <code>Portal</code> 类型的 <code>VNode</code> 其 <code>el</code> 属性应该指向谁呢？应该指向挂载点元素吗？实际上虽然 <code>Portal</code> 所描述的内容可以被挂载到任何位置，但仍然需要一个占位元素，并且 <code>Portal</code> 类型的 <code>VNode</code> 其 <code>el</code> 属性应该指向该占位元素，为什么这么设计呢？这是因为 <code>Portal</code> 的另外一个特性：<strong>虽然<code>Portal</code> 的内容可以被渲染到任意位置，但它的行为仍然像普通的DOM元素一样，如事件的捕获/冒泡机制仍然按照代码所编写的DOM结构实施</strong>。要实现这个功能就必须需要一个占位的DOM元素来承接事件。但目前来说，我们用一个空的文本节点占位即可，我们为 <code>mountPortal</code> 函数添加如下代码：</p><pre><code>function mountPortal(vnode, container) {
  const { tag, children, childFlags } = vnode
  const target = typeof tag === &#39;string&#39; ? document.querySelector(tag) : tag
  if (childFlags &amp; ChildrenFlags.SINGLE_VNODE) {
    mount(children, target)
  } else if (childFlags &amp; ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i &lt; children.length; i++) {
      mount(children[i], target)
    }
  }

  // 占位的空文本节点
  const placeholder = createTextVNode(&#39;&#39;)
  // 将该节点挂载到 container 中
  mountText(placeholder, container, null)
  // el 属性引用该节点
  vnode.el = placeholder.el
}
</code></pre><p>如上高亮代码所示，我们创建了一个空文本节点，并将它挂载到 <code>container</code> 下(<strong>注意不是挂载到<code>target</code> 下</strong>)，最后让 <code>Portal</code> 类型的 <code>VNode</code> 节点的 <code>el</code> 属性引用该空文本节点。</p><p>为了测试我们的代码，我们修改 <code>elementVNode</code> 如下：</p><pre><code>const elementVNode = h(
  &#39;div&#39;,
  {
    style: {
      height: &#39;100px&#39;,
      width: &#39;100px&#39;,
      background: &#39;red&#39;
    }
  },
  h(Portal, { target: &#39;#portal-box&#39; }, [
    h(&#39;span&#39;, null, &#39;我是标题1......&#39;),
    h(&#39;span&#39;, null, &#39;我是标题2......&#39;)
  ])
)
</code></pre><p>使用渲染器渲染该 <code>elementVNode</code> 的效果图如下：</p><p>可以发现 <code>Portal</code> 的挂载点是 <code>#portal-box</code>，而非 <code>#app</code>。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/nr16wzln8m" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/nr16wzln8m</a><a href="https://codesandbox.io/s/nr16wzln8m" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h2 id="有状态组件的挂载和原理" tabindex="-1"><a class="header-anchor" href="#有状态组件的挂载和原理"><span>有状态组件的挂载和原理</span></a></h2><p>我们在“组件的本质”一章中讲到过：<strong>组件的产出是<code>VNode</code></strong>，当时我们也大致实现了有状态组件的挂载，其思路是<strong>拿到组件产出的<code>VNode</code>，并将之挂载到正确的 <code>container</code> 中</strong>，思路很简单，我们着手实现。</p><p>回顾一下我们的 <code>mount</code> 函数，如下高亮代码所示：</p><pre><code>function mount(vnode, container, isSVG) {
  const { flags } = vnode
  if (flags &amp; VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG)
  } else if (flags &amp; VNodeFlags.COMPONENT) {
    // 挂载组件
    mountComponent(vnode, container, isSVG)
  } else if (flags &amp; VNodeFlags.TEXT) {
    // 挂载纯文本
    mountText(vnode, container)
  } else if (flags &amp; VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
    mountFragment(vnode, container, isSVG)
  } else if (flags &amp; VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container, isSVG)
  }
}
</code></pre><p>当 <code>VNode</code> 的 <code>flags</code> 的值属于组件时(<code>VNodeFlags.COMPONENT</code>)，则会调用 <code>mountComponent</code> 函数挂载该 <code>VNode</code>，但是组件还分为有状态组件和函数式组件，所以在 <code>mountComponent</code> 函数内部，我们需要再次对组件的类型进行区分，并使用不同的挂载方式，如下是 <code>mountComponent</code> 函数的实现：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mountComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_STATEFUL</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">mountStatefulComponent</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">mountFunctionalComponent</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>道理很简单，我们通过检查 <code>vnode.flags</code> 判断要挂载的 <code>VNode</code> 是否属于有状态组件(即 <code>VNodeFlags.COMPONENT_STATEFUL</code>)，如果该 <code>VNode</code> 描述的是有状态组件则调用 <code>mountStatefulComponent</code> 函数挂载，否则将该 <code>VNode</code> 当作函数式组件的描述，使用 <code>mountFunctionalComponent</code> 挂载。</p><p>挂载一个有状态组件只需要四步，如下是 <code>mountStatefulComponent</code> 函数的实现：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mountStatefulComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 创建组件实例</span></span>
<span class="line">      <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">vnode<span class="token punctuation">.</span>tag</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// 渲染VNode</span></span>
<span class="line">      instance<span class="token punctuation">.</span>$vnode <span class="token operator">=</span> instance<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// 挂载</span></span>
<span class="line">      <span class="token function">mount</span><span class="token punctuation">(</span>instance<span class="token punctuation">.</span>$vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素</span></span>
<span class="line">      instance<span class="token punctuation">.</span>$el <span class="token operator">=</span> vnode<span class="token punctuation">.</span>el <span class="token operator">=</span> instance<span class="token punctuation">.</span>$vnode<span class="token punctuation">.</span>el</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>第一步：创建组件实例</li></ul><p>如果一个 <code>VNode</code> 描述的是有状态组件，那么 <code>vnode.tag</code> 属性值就是组件类的引用，所以通过 <code>new</code> 关键字创建组件实例。</p><ul><li>第二步：获取组件产出的 <code>VNode</code></li></ul><p>一个组件的核心就是其 <code>render</code> 函数，通过调用 <code>render</code> 函数可以拿到该组件要渲染的内容。</p><ul><li>第三步：<code>mount</code> 挂载</li></ul><p>既然已经拿到了 <code>VNode</code>，那么就将其挂载到 <code>container</code> 上就可以了。</p><ul><li>第四步：让组件实例的 <code>$el</code> 属性和 <code>vnode.el</code> 属性的值引用组件的根DOM元素</li></ul><p>组件的 <code>render</code> 函数会返回该组件产出的 <code>VNode</code>，当该 <code>VNode</code> 被挂载为真实DOM之后，就可以通过 <code>instance.$vnode.el</code> 元素拿到组件的根DOM元素，接着我们就可以让组件实例的 <code>$el</code> 属性和 <code>vnode.el</code> 属性的值都引用该DOM元素。如果组件的 <code>render</code> 返回的是一个片段(<code>Fragment</code>)，那么 <code>instance.$el</code> 和 <code>vnode.el</code> 引用的就是该片段的第一个DOM元素。</p><p>我们来测试一下我们的代码，假设我们要渲染的 <code>VNode</code> 如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// h 函数的第一个参数是组件类</span></span>
<span class="line">    <span class="token keyword">const</span> compVnode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>MyComponent<span class="token punctuation">)</span></span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>compVnode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如下是组件 <code>MyComponent</code> 组件的实现：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">class</span> <span class="token class-name">MyComponent</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span></span>
<span class="line">          <span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">{</span></span>
<span class="line">            <span class="token literal-property property">style</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token literal-property property">background</span><span class="token operator">:</span> <span class="token string">&#39;green&#39;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">[</span></span>
<span class="line">            <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;span&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;我是组件的标题1......&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;span&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;我是组件的标题2......&#39;</span><span class="token punctuation">)</span></span>
<span class="line">          <span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该组件的 <code>render</code> 函数返回了它要渲染的内容，如下是使用渲染器渲染后的效果：</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/2on8xyk01y" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/2on8xyk01y</a><a href="https://codesandbox.io/s/2on8xyk01y" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>这里再次强调一下，这就是<strong>有状态组件的挂载原理</strong> ，仅此而已。有的同学可能会产生疑惑，比如这里没有体现生命周期呀，也没有体现 <code>data</code>、<code>props</code>、<code>ref</code> 或者 <code>slots</code> 等等，实际上我们早在“组件的本质”一章中就提到过<strong>这些内容是在基本原理的基础上，再次设计的产物，它们为<code>render</code> 函数生成 <code>VNode</code> 的过程中提供数据来源服务</strong>，而<strong>组件产出<code>VNode</code> 才是永恒的核心</strong>，所以本节我们重在讲解原理，至于 <code>data</code>、<code>props</code>、<code>ref</code> 等内容属于组件实例的设计，我们会在后续的章节中统一讲解。</p><h2 id="函数式组件的挂载和原理" tabindex="-1"><a class="header-anchor" href="#函数式组件的挂载和原理"><span>函数式组件的挂载和原理</span></a></h2><p>函数式组件就更加简单了，它就是一个返回 <code>VNode</code> 的函数：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">MyFunctionalComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 返回要渲染的内容描述，即 VNode</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span></span>
<span class="line">        <span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">style</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token literal-property property">background</span><span class="token operator">:</span> <span class="token string">&#39;green&#39;</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">[</span></span>
<span class="line">          <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;span&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;我是组件的标题1......&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;span&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;我是组件的标题2......&#39;</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">]</span></span>
<span class="line">      <span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在挂载函数式组件的时候，比挂载有状态组件少了一个实例化的过程，如果一个 <code>VNode</code> 描述的是函数式组件，那么其 <code>tag</code> 属性值就是该函数的引用，如下：</p><p>如下是 <code>mountFunctionalComponent</code> 函数的实现：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">function</span> <span class="token function">mountFunctionalComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 获取 VNode</span></span>
<span class="line">      <span class="token keyword">const</span> $vnode <span class="token operator">=</span> vnode<span class="token punctuation">.</span><span class="token function">tag</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// 挂载</span></span>
<span class="line">      <span class="token function">mount</span><span class="token punctuation">(</span>$vnode<span class="token punctuation">,</span> container<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// el 元素引用该组件的根元素</span></span>
<span class="line">      vnode<span class="token punctuation">.</span>el <span class="token operator">=</span> $vnode<span class="token punctuation">.</span>el</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们来测试一下我们的代码：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> compVnode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span>MyFunctionalComponent<span class="token punctuation">)</span></span>
<span class="line">    <span class="token function">render</span><span class="token punctuation">(</span>compVnode<span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>最终的渲染效果如下：</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/02nrpqkvv" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/02nrpqkvv</a><a href="https://codesandbox.io/s/02nrpqkvv" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>实际上如果对于 <strong>有状态组件</strong> 和 <strong>函数式组件</strong> 具体的区别不太了解的同学看到这里或许会产生疑问，觉得 <strong>有状态组件</strong> 的实例化很多余，实际上实例化是必须的，因为 <strong>有状态组件</strong> 在实例化的过程中会初始化一系列 <strong>有状态组件</strong> 所特有的东西，诸如 <code>data(或state)</code>、<code>computed</code>、<code>watch</code>、生命周期等等。而函数式组件只有 <code>props</code> 和 <code>slots</code>，它要做的工作很少，所以性能上会更好。具体的关于本地数据、<code>props</code> 数据，计算属性，插槽等的设计和实现，我们在后面的章节中统一讲解，这里给大家展示的就是最根本的原理。</p><p>阅读全文</p>`,204),c=[o];function p(l,d){return a(),s("div",null,c)}const r=n(t,[["render",p],["__file","Vue-渲染器之挂载.html.vue"]]),u=JSON.parse('{"path":"/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8B%E6%8C%82%E8%BD%BD.html","title":"","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"sidebarDepth: 4","slug":"sidebardepth-4","link":"#sidebardepth-4","children":[]},{"level":2,"title":"责任重大的渲染器","slug":"责任重大的渲染器","link":"#责任重大的渲染器","children":[]},{"level":2,"title":"挂载普通标签元素","slug":"挂载普通标签元素","link":"#挂载普通标签元素","children":[{"level":3,"title":"基本原理","slug":"基本原理","link":"#基本原理","children":[]},{"level":3,"title":"class的处理","slug":"class的处理","link":"#class的处理","children":[]},{"level":3,"title":"Attributes 和 DOM Properties","slug":"attributes-和-dom-properties","link":"#attributes-和-dom-properties","children":[]},{"level":3,"title":"事件的处理","slug":"事件的处理","link":"#事件的处理","children":[]}]},{"level":2,"title":"挂载纯文本、Fragment 和 Portal","slug":"挂载纯文本、fragment-和-portal","link":"#挂载纯文本、fragment-和-portal","children":[{"level":3,"title":"挂载文本节点","slug":"挂载文本节点","link":"#挂载文本节点","children":[]},{"level":3,"title":"挂载 Fragment","slug":"挂载-fragment","link":"#挂载-fragment","children":[]},{"level":3,"title":"挂载 Portal","slug":"挂载-portal","link":"#挂载-portal","children":[]}]},{"level":2,"title":"有状态组件的挂载和原理","slug":"有状态组件的挂载和原理","link":"#有状态组件的挂载和原理","children":[]},{"level":2,"title":"函数式组件的挂载和原理","slug":"函数式组件的挂载和原理","link":"#函数式组件的挂载和原理","children":[]}],"git":{"updatedTime":1717376101000,"contributors":[{"name":"guoli","email":"guoli@zhihu.com","commits":1}]},"filePathRelative":"Vue-渲染器之挂载.md","excerpt":"<p>原文链接: <a href=\\"https://interview.poetries.top/principle-docs/vue/07-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8B%E6%8C%82%E8%BD%BD.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://interview.poetries.top/principle-docs/vue/07-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8B%E6%8C%82%E8%BD%BD.html</a></p>\\n<hr>\\n"}');export{r as comp,u as data};
