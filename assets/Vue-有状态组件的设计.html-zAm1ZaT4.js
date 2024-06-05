import{_ as n,c as s,o as a,a as e}from"./app-BnrgralS.js";const t={},o=e(`<p>原文链接: <a href="https://interview.poetries.top/principle-docs/vue/03-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html" target="_blank" rel="noopener noreferrer">https://interview.poetries.top/principle-docs/vue/03-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html</a></p><p>假设我们有如下模板：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MyComponent</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>MyComponent</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由这段模板可知，我们为 <code>MyComponent</code> 组件提供了一个空的 <code>div</code> 标签作为默认插槽内容，从DOM结构上看 <code>&lt;MyComponent&gt;</code> 标签有一个 <code>div</code> 标签作为子节点，通常我们可以将其编译为如下 <code>VNode</code>：</p><pre><code>const compVNode = {
  flags: VNodeFlags.COMPONENT_STATEFUL_NORMAL,
  tag: MyComponent,
  children: {
    flags: VNodeFlags.ELEMENT,
    tag: &#39;div&#39;
  }
}
</code></pre><p>这其实没什么问题，但是我们更倾向于新建一个 <code>slots</code> 属性来存储这些子节点，这在语义上更加贴切，所以我们希望将模板编译为如下 <code>VNode</code>：</p><pre><code>const compVNode = {
  flags: VNodeFlags.COMPONENT,
  tag: MyComponent,
  children: null,
  slots: {
    // 默认插槽
    default: {
      flags: VNodeFlags.ELEMENT,
      tag: &#39;div&#39;
    }
  }
}
</code></pre><p>可以看到，如上 <code>VNode</code> 的 <code>children</code> 属性值为 <code>null</code>。当我们使用 <code>mountComponent</code> 函数挂载如上 <code>VNode</code> 时，我们可以在<strong>组件实例化之后</strong> 并且在<strong>组件的渲染函数执行之前</strong> 将 <code>compVNode.slots</code> 添加到组件实例对象上，这样当组件的渲染函数执行的时候，就可以访问插槽数据：</p><pre><code>function mountComponent(vnode, container) {
  // 创建组件实例
  const instance = new vnode.tag()

  // 设置 slots
  instance.$slots = vnode.slots

  // 渲染
  instance.$vnode = instance.render()
  // 挂载
  mountElement(instance.$vnode, container)

  vnode.ref &amp;&amp; vnode.ref(instance)
}
</code></pre><p>在 <code>MyComponent</code> 组件的 <code>render</code> 函数内，我们就可以通过组件实例访问 <code>slots</code> 数据：</p><pre><code>class MyComponent {
  render() {
    return {
      flags: VNodeFlags.ELEMENT,
      tag: &#39;h1&#39;
      children: this.$slots.default
    }
  }
}
</code></pre><p>实际上，这就是普通插槽的实现原理，至于作用域插槽(<code>scopedSlots</code>)，与普通插槽并没有什么本质的区别，我们知道作用域插槽可以访问子组件的数据，在实现上来看其实就是函数传参：</p><pre><code>class MyComponent {
  render() {
    return {
      flags: VNodeFlags.ELEMENT,
      tag: &#39;h1&#39;
      // 插槽变成了函数，可以传递参数
      children: this.$slots.default(1)
    }
  }
}
</code></pre><p>如上代码所示，只要 <code>this.$slots.default</code> 是函数即可实现，所以在模板编译时，我们最终需要得到如下 <code>VNode</code>：</p><pre><code>const compVNode = {
  flags: VNodeFlags.COMPONENT,
  tag: MyComponent,
  children: null,
  slots: {
    // 作用域插槽，可以接受组件传递过来的数据
    default: (arg) =&gt; {
      const tag = arg === 1 ? &#39;div&#39; : &#39;h1&#39;
      return {
        flags: VNodeFlags.ELEMENT,
        tag
      }
    }
  }
}
</code></pre><p>现在你应该明白为什么普通插槽和作用域插槽本质上并没有区别了，因为普通插槽也可以是函数，只是不接收参数罢了。这么看的话其实普通插槽是作用域插槽的子集，那为什么不将它们合并呢？没错从 <code>Vue2.6</code> 起已经将之合并，所有插槽在 <code>VNode</code> 中都是函数，一个返回 <code>VNode</code> 的函数。</p><p>TIP</p><p>用过 <code>React</code> 的朋友，这让你想起 <code>Render Prop</code> 了吗！</p><h2 id="key-和-ref" tabindex="-1"><a class="header-anchor" href="#key-和-ref"><span>key 和 ref</span></a></h2><p><code>key</code> 就像 <code>VNode</code> 的唯一标识，用于 <code>diff</code> 算法的优化，它可以是数字也可以是字符串：</p><pre><code>{
  flags: VNodeFlags.ELEMENT_HTML,
  tag: &#39;li&#39;,
  key: &#39;li_0&#39;
}
</code></pre><p><code>ref</code> 的设计是为了提供一种能够拿到真实DOM的方式，当然如果将 <code>ref</code> 应用到组件上，那么拿到的就是组件实例，我们通常会把 <code>ref</code> 设计成一个函数，假设我们有如下模板：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">:ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>el =&gt; elRef = el<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>我们可以把这段模板编译为如下 <code>VNode</code>：</p><pre><code>const elementVNode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: &#39;div&#39;,
  ref: el =&gt; elRef = el
}
</code></pre><p>在使用 <code>mountElement</code> 函数挂载如上 <code>VNode</code> 时，可以轻松的实现 <code>ref</code> 功能：</p><pre><code>function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)
  container.appendChild(el)
  vnode.ref &amp;&amp; vnode.ref(el)
}
</code></pre><p>如果挂载的是组件而非普通标签，那么只需要将组件实例传递给 <code>vnode.ref</code> 函数即可：</p><pre><code>function mountComponent(vnode, container) {
  // 创建组件实例
  const instance = new vnode.tag()
  // 渲染
  instance.$vnode = instance.render()
  // 挂载
  mountElement(instance.$vnode, container)

  vnode.ref &amp;&amp; vnode.ref(instance)
}
</code></pre><h2 id="parentvnode-以及它的作用" tabindex="-1"><a class="header-anchor" href="#parentvnode-以及它的作用"><span>parentVNode 以及它的作用</span></a></h2><p>与 <code>VNode</code> 的 <code>slots</code> 属性相同，<code>parentVNode</code> 属性也是给组件的 <code>VNode</code> 准备的，组件的 <code>VNode</code> 为什么需要这两个属性呢？它俩的作用又是什么呢？想弄清楚这些，我们至少要先弄明白：<strong>一个组件所涉及的<code>VNode</code> 都有哪些</strong>。什么意思呢？看如下模板思考一个问题：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MyComponent</span> <span class="token punctuation">/&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从这个模板来看 <code>MyComponent</code> 组件至少涉及到两个 <code>VNode</code>，第一个 <code>VNode</code> 是标签 <code>&lt;MyComponent /&gt;</code> 的描述，其次 <code>MyComponent</code> 组件本身也有要渲染的内容，这就是第二个 <code>VNode</code>。</p><ul><li>第一个 <code>VNode</code> 用来描述 <code>&lt;MyComponent /&gt;</code> 标签：</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 省略...</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> MyComponent</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>第二个 <code>VNode</code> 是组件渲染内容的描述，即组件的 <code>render</code> 函数产出的 <code>VNode</code>：</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">class</span> <span class="token class-name">MyComponent</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">render</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token comment">/* .. */</span><span class="token punctuation">}</span> <span class="token comment">// 产出的 VNode</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>组件实例的 <code>$vnode</code> 属性值就是组件 <code>render</code> 函数产出的 <code>VNode</code>，这通过如下代码可以一目了然：</p><pre><code>function mountComponent(vnode, container) {
  // 创建组件实例
  const instance = new vnode.tag()
  // 渲染，$vnode 的值就是组件 render 函数产出的 VNode
  instance.$vnode = instance.render()
  // 挂载
  mountElement(instance.$vnode, container)

  vnode.ref &amp;&amp; vnode.ref(instance)
}
</code></pre><p>而 <code>instance.$vnode.parentVNode</code> 的值就是用来描述组件(如：<code>&lt;MyComponent /&gt;</code>)标签的 <code>VNode</code>，我们只需在如上代码中添加一行代码即可实现：</p><pre><code>function mountComponent(vnode, container) {
  // 创建组件实例
  const instance = new vnode.tag()
  // 渲染，$vnode 的值就是组件 render 函数产出的 VNode
  instance.$vnode = instance.render()
  // vnode 就是用来描述组件标签的 VNode
  instance.$vnode.parentVNode = vnode
  // 挂载
  mountElement(instance.$vnode, container)

  vnode.ref &amp;&amp; vnode.ref(instance)
}
</code></pre><p>同时我们也可以在组件实例上添加 <code>$parentVNode</code> 属性，让其同样引用组件的标签描述：</p><pre><code>function mountComponent(vnode, container) {
  // 创建组件实例
  const instance = new vnode.tag()
  // 渲染，$vnode 的值就是组件 render 函数产出的 VNode
  instance.$vnode = instance.render()
  // vnode 就是用来描述组件标签的 VNode
  instance.$parentVNode = instance.$vnode.parentVNode = vnode
  // 挂载
  mountElement(instance.$vnode, container)

  vnode.ref &amp;&amp; vnode.ref(instance)
}
</code></pre><p>组件的实例为什么需要引用 <code>parentVNode</code> 呢？这是因为组件的事件监听器都在 <code>parentVNode</code> 上，如下模板所示：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MyComponent</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>handleClick<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这段模板可以用如下 <code>VNode</code> 描述：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> parentVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 省略...</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> MyComponent<span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function-variable function">onclick</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">handleClick</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当你在组件中发射(<code>emit</code>)事件时，就需要去 <code>parentVNode</code> 中找到对应的事件监听器并执行：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 组件实例的 $emit 实现</span></span>
<span class="line">    <span class="token keyword">class</span> <span class="token class-name">MyComponent</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">$emit</span><span class="token punctuation">(</span><span class="token parameter">eventName<span class="token punctuation">,</span> <span class="token operator">...</span>payload</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 通过 parentVNode 拿到其 VNodeData</span></span>
<span class="line">        <span class="token keyword">const</span> parentData <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$parentVNode<span class="token punctuation">.</span>data</span>
<span class="line">        <span class="token comment">// 执行 handler</span></span>
<span class="line">        parentData<span class="token punctuation">[</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">on</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>eventName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">]</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    </span>
<span class="line">      <span class="token function">handleClick</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 这里就可以通过 this.$emit 发射事件</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span><span class="token string">&#39;click&#39;</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，这就是事件的实现思路。由于 <code>$emit</code> 是框架层面的设计，所以我们在设计框架时可以提供一个最基本的组件，将框架层面的设计都归纳到该组件中：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">class</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">$emit</span><span class="token punctuation">(</span><span class="token parameter">eventName<span class="token punctuation">,</span> <span class="token operator">...</span>payload</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 通过 parentVNode 拿到其 VNodeData</span></span>
<span class="line">        <span class="token keyword">const</span> parentData <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$parentVNode<span class="token punctuation">.</span>data</span>
<span class="line">        <span class="token comment">// 执行 handler</span></span>
<span class="line">        parentData<span class="token punctuation">[</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">on</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>eventName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">]</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">      <span class="token comment">// 其他......</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样框架的使用者在开发组件时，只需要继承我们的 <code>Component</code> 即可：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 用户的代码</span></span>
<span class="line">    <span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">class</span> <span class="token class-name">MyComponent</span> <span class="token keyword">extends</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">handleClick</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 直接使用即可</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span><span class="token string">&#39;click&#39;</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="contextvnode" tabindex="-1"><a class="header-anchor" href="#contextvnode"><span>contextVNode</span></a></h2><p>我们已经知道了与一个组件相关的 <code>VNode</code> 有两个，一个是组件自身产出的 <code>VNode</code>，可以通过组件实例的 <code>instance.$vnode</code> 访问，另一个是当使用组件时用来描述组件标签的 <code>VNode</code>，我们可以通过组件实例的 <code>instance.$parentVNode</code> 访问，并且：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    instance<span class="token punctuation">.</span>$vnode<span class="token punctuation">.</span>parentVNode <span class="token operator">===</span> instance<span class="token punctuation">.</span>$parentVNode</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>那么 <code>contextVNode</code> 是什么呢？实际上<strong>子组件标签描述的<code>VNode.contextVNode</code> 是父组件的标签描述 <code>VNode</code></strong>，或者说<strong>子组件实例的<code>$parentVNode.contextVNode</code> 是父组件实例的 <code>$parentVNode</code></strong>，假设根组件渲染了 <code>Foo</code> 组件，而 <code>Foo</code> 组件又渲染 <code>Bar</code> 组件，此时就形成了一条父子链：<strong><code>Bar</code> 组件的父组件是 <code>Foo</code></strong>。</p><p>为什么子组件的标签描述 <code>VNode</code> 需要引用父组件的标签描述 <code>VNode</code> 呢？这是因为一个组件的标签描述 <code>VNode</code> 中存储着该组件的实例对象，即 <code>VNode.children</code> 属性。还记得之前我们讲到过，对于组件来说，它的 <code>VNode.children</code> 属性会存储组件实例对象吗。这样通过这一层引用关系，子组件就知道它的父组件是谁，同时父组件也知道它有哪些子组件。</p><p>语言描述会有些抽象，我们拿具体案例演示一下，假设我们的根组件有如下模板：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token comment">&lt;!-- 根组件模板 --&gt;</span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Foo</span><span class="token punctuation">/&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它对应的 <code>VNode</code> 如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> FooVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> Foo<span class="token punctuation">,</span> <span class="token comment">// Foo 指的是 class Foo {}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接着 <code>Foo</code> 组件的模板如下，它渲染了 <code>Bar</code> 组件：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token comment">&lt;!-- 组件 Foo 的模板 --&gt;</span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Bar</span><span class="token punctuation">/&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它对应的 <code>VNode</code> 如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> BarVNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">flags</span><span class="token operator">:</span> VNodeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> Bar<span class="token punctuation">,</span> <span class="token comment">// Foo 指的是 class Bar {}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们使用 <code>mountComponent</code> 函数挂载 <code>FooVNode</code> 组件：</p><pre><code>mountComponent(FooVNode, container)

function mountComponent(vnode, container) {
  // 创建 Foo 组件实例
  const instance = new vnode.tag()
  // 渲染，instance.$vnode 的值就是 BarVNode
  instance.$vnode = instance.render()
  // 使用 mountComponent 函数递归挂载 BarVNode
  mountComponent(instance.$vnode, container)

  vnode.ref &amp;&amp; vnode.ref(instance)
}
</code></pre><p>如上代码所示，首先我们调用 <code>mountComponent</code> 函数挂载 <code>FooVNode</code>，会创建 <code>Foo</code> 组件实例，接着调用 <code>Foo</code> 组件实例的 <code>render</code> 函数得到 <code>Foo</code> 组件产出的 <code>VNode</code>，这其实就是 <code>BarVNode</code>，由于 <code>BarVNode</code> 的类型也是组件，所以我们会递归调用 <code>mountComponent</code> 挂载 <code>BarVNode</code>，最终 <code>mountComponent</code> 函数会执行两次。接下来我们为使用 <code>contextVNode</code> 完善上面的代码，看看如何来建立起父子链：</p><pre><code>mountComponent(FooVNode, container)

function mountComponent(vnode, container, contextVNode = null) {
  // 创建组件实例
  const instance = new vnode.tag()

  if (contextVNode) {
    const parentComponent = contextVNode.children
    instance.$parent = parentComponent
    parentComponent.$children.push(instance)
    instance.$root = parentComponent.$root
  } else {
    instance.$root = instance
  }

  // 渲染
  instance.$vnode = instance.render()
  // 使用 mountComponent 函数递归挂载
  mountComponent(instance.$vnode, container, vnode)

  vnode.ref &amp;&amp; vnode.ref(instance)
}
</code></pre><p>如上高亮代码所示，我们为 <code>mountComponent</code> 函数添加了第三个参数 <code>contextVNode</code>，我们可以一下这个过程发生了什么：</p><ul><li>1、初次调用 <code>mountComponent</code> 挂载 <code>FooVNode</code> 时，没有传递第三个参数，所以 <code>contextVNode = null</code>，这时说明当前挂载的组件就是根组件，所以我们让当前组件实例的 <code>$root</code> 属性值引用其自身。</li><li>2、当递归调用 <code>mountComponent</code> 挂载 <code>BarVNode</code> 时，我们传递了第三个参数，并且点三个参数是 <code>FooVNode</code>。此时 <code>contextVNode = FooVNode</code>，我们通过 <code>contextVNode.children</code> 即可拿到 <code>Foo</code> 组件的实例，并把它赋值给 <code>Bar</code> 组件实例的 <code>$parent</code> 属性，同时把 <code>Bar</code> 组件实例添加到 <code>Foo</code> 组件实例的 <code>$children</code> 数组中，这样这条父子链就成功建立了。</li></ul><p>实际上，除了组件实例间建立父子关系，组件的 <code>VNode</code> 间也可以建立父子关系，只需要增加一行代码即可：</p><pre><code>mountComponent(FooVNode, container)

function mountComponent(vnode, container, contextVNode = null) {
  vnode.contextVNode = contextVNode
  // 省略...
}
</code></pre><p>为什么要在组件的 <code>VNode</code> 上也建立这种父子联系呢？答案是在其他地方有用到，这么做就是为了在某些情况下少传递一些参数，直接通过 <code>VNode</code> 之间的联系找到我们想要的信息即可。另外在如上的演示中，我们省略了避开函数式组件的逻辑，因为函数式组件没有组件实例，所谓的父子关系只针对于有状态组件。实现逻辑很简单，就是通过一个 <code>while</code> 循环<strong>沿着父子链一直向上找到第一个非函数式组件，并把该组件的实例作为当前组件实例的<code>$parent</code> 即可</strong>。</p><h2 id="el" tabindex="-1"><a class="header-anchor" href="#el"><span>el</span></a></h2><p><code>VNode</code> 既然是真实DOM的描述，那么理所应当的，当它被渲染完真实DOM之后，我们需要将真实DOM对象的引用添加到 <code>VNode</code> 的 <code>el</code> 属性上。由于 <code>VNode</code> 具有不同的类型，不同类型的 <code>VNode</code> 其 <code>el</code> 属性所引用的真实DOM对象也不同，下图展示了所有 <code>VNode</code> 类型：</p><ul><li>1、<code>html/svg</code> 标签</li></ul><p>其 <code>el</code> 属性值为真实DOM元素的引用：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">el</span><span class="token operator">:</span> div 元素的引用 <span class="token comment">// 如 document.createElement(&#39;div&#39;)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>2、组件</li></ul><p>其 <code>el</code> 属性值为组件本身所渲染真实DOM的根元素：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> MyComponent<span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">el</span><span class="token operator">:</span> instance<span class="token punctuation">.</span>$vnode<span class="token punctuation">.</span>el</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>3、纯文本</li></ul><p>其 <code>el</code> 属性值为文本元素的引用：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token string">&#39;txt&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">el</span><span class="token operator">:</span> 文本元素的引用 <span class="token comment">// 如 document.createTextNode(&#39;txt&#39;)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>4、Fragment</li></ul><p>其 <code>el</code> 属性值为片段中第一个DOM元素的引用：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;h1&#39;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&#39;h2&#39;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">el</span><span class="token operator">:</span> h1 元素的引用而非 h2</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然片段本身可能是一个空数组，即 <code>children</code> 属性值为 <code>[]</code>，此时代表该片段不渲染任何东西，但在框架设计中，我们会渲染一个空的文本节点占位，所以此时 <code>el</code> 属性值为该占位的空文本元素的引用：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">el</span><span class="token operator">:</span> 占位的空文本元素 <span class="token comment">// document.createTextNode(&#39;&#39;)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>5、Portal</li></ul><p><code>Portal</code> 比较特殊，根据 <code>Portal</code> 寓意，其内容可以被渲染到任何地方，但其真正的挂载点会有一个空文本节点占位，所以 <code>Portal</code> 的 <code>VNode.el</code> 属性值引用的始终是这个空文本节点。当然这是 <code>vue3</code> 的设计，理论上将我们完全可以做到让 <code>el</code> 引用真正的挂载容器元素。</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token operator">...</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">el</span><span class="token operator">:</span> 占位的空文本元素 <span class="token comment">// document.createTextNode(&#39;&#39;)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>阅读全文</p>`,95),p=[o];function c(l,i){return a(),s("div",null,p)}const r=n(t,[["render",c],["__file","Vue-有状态组件的设计.html.vue"]]),u=JSON.parse('{"path":"/Vue-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html","title":"","lang":"zh-CN","frontmatter":{"description":"原文链接: https://interview.poetries.top/principle-docs/vue/03-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html 假设我们有如下模板： 由这段模板可知，我们为 MyComponent 组件提供了...","head":[["meta",{"property":"og:url","content":"https://interview.leeguoo.com/Vue-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html"}],["meta",{"property":"og:site_name","content":"前端面试题集锦"}],["meta",{"property":"og:description","content":"原文链接: https://interview.poetries.top/principle-docs/vue/03-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html 假设我们有如下模板： 由这段模板可知，我们为 MyComponent 组件提供了..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-03T00:55:01.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-03T00:55:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-06-03T00:55:01.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"key 和 ref","slug":"key-和-ref","link":"#key-和-ref","children":[]},{"level":2,"title":"parentVNode 以及它的作用","slug":"parentvnode-以及它的作用","link":"#parentvnode-以及它的作用","children":[]},{"level":2,"title":"contextVNode","slug":"contextvnode","link":"#contextvnode","children":[]},{"level":2,"title":"el","slug":"el","link":"#el","children":[]}],"git":{"updatedTime":1717376101000,"contributors":[{"name":"guoli","email":"guoli@zhihu.com","commits":1}]},"autoDesc":true,"filePathRelative":"Vue-有状态组件的设计.md","excerpt":"<p>原文链接: <a href=\\"https://interview.poetries.top/principle-docs/vue/03-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://interview.poetries.top/principle-docs/vue/03-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html</a></p>"}');export{r as comp,u as data};
