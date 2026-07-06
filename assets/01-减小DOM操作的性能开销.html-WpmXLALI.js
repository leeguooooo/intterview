import{_ as n}from"./s_poetries_work_uploads_2024_02_7cb972d068b2d405-2w8zVw84.js";import{_ as e,c as s,o as a,a as t}from"./app-BiVF96gJ.js";const o="/images/s_poetries_work_uploads_2024_02_ac9f3b53fa31e426.webp",c="/images/s_poetries_work_uploads_2024_02_f29c1e3d3ec2e9cd.webp",p="/images/s_poetries_work_uploads_2024_02_c51050b67f2e6cce.webp",i="/images/s_poetries_work_uploads_2024_02_40dce2fec8ddba9a.webp",l={},d=t('<h1 id="减小dom操作的性能开销" tabindex="-1"><a class="header-anchor" href="#减小dom操作的性能开销"><span>减小DOM操作的性能开销</span></a></h1><p>上一章我们讨论了渲染器是如何更新各种类型的 <code>VNode</code> 的，实际上，上一章所讲解的内容归属于完整的 <code>Diff</code> 算法之内，但并不包含核心的 <code>Diff</code> 算法。那什么才是核心的 <code>Diff</code> 算法呢？看下图：</p><p><img src="'+n+`" alt=""></p><p>我们曾在上一章中讲解子节点更新的时候见到过这张图，当时我们提到<strong>只有当新旧子节点的类型都是多个子节点时，核心<code>Diff</code> 算法才派得上用场</strong>，并且当时我们采用了一种仅能实现目标但并不完美的算法：<strong>遍历旧的子节点，将其全部移除；再遍历新的子节点，将其全部添加</strong> ，如下高亮代码所示：</p><pre><code>function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 省略...

    // 旧的 children 中有多个子节点
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 省略...
        case ChildrenFlags.NO_CHILDREN:
          // 省略...
        default:
          // 新的 children 中有多个子节点
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
</code></pre><p>为了便于表述，我们把这个算法称为：<strong>简单 Diff 算法</strong> 。<strong>简单 Diff 算法</strong> 虽然能够达到目的，但并非最佳处理方式。我们经常会遇到可排序的列表，假设我们有一个由 <code>li</code> 标签组成的列表：</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>2<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>3<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>列表中的 <code>li</code> 标签是 <code>ul</code> 标签的子节点，我们可以使用下面的数组来表示 <code>ul</code> 标签的 <code>children</code>：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">[</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接着由于数据变化导致了列表的顺序发生了变化，新的列表顺序如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">[</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>新的列表和旧的列表构成了新旧 <code>children</code>，当我们使用<strong>简单 Diff 算法</strong> 更新这两个列表时，其操作行为可以用下图表示：</p><p><img src="`+o+'" alt=""></p><p>在这张图中我们使用圆形表示真实 DOM 元素，用菱形表示 <code>VNode</code>，旧的 <code>VNode</code> 保存着对真实 DOM 的引用(即 <code>vnode.el</code> 属性)，新的 <code>VNode</code> 是不存在对真实 DOM 的引用的。上图描述了<strong>简单 Diff 算法</strong> 的操作行为，首先遍历旧的 <code>VNode</code>，通过旧 <code>VNode</code> 对真实 DOM 的引用取得真实 DOM，即可将已渲染的 DOM 移除。接着遍历新的 <code>VNode</code> 并将其全部添加到页面中。</p><p>在这个过程中我们能够注意到：更新前后的真实 DOM 元素都是 <code>li</code> 标签。那么可不可以复用 <code>li</code> 标签呢？这样就能减少“移除”和“新建” DOM 元素带来的性能开销，实际上是可以的，我们在讲解 <code>pathcElement</code> 函数时了解到，当新旧 <code>VNode</code> 所描述的是相同标签时，那么这两个 <code>VNode</code> 之间的差异就仅存在于 <code>VNodeData</code> 和 <code>children</code> 上，所以我们完全可以通过遍历新旧 <code>VNode</code>，并一一比对它们，这样对于任何一个 DOM 元素来说，由于它们都是相同的标签，所以更新的过程是不会“移除”和“新建”任何 DOM 元素的，而是复用已有 DOM 元素，需要更新的只有 <code>VNodeData</code> 和 <code>children</code>。优化后的更新操作可以用下图表示：</p><p><img src="'+c+`" alt=""></p><p>用代码实现起来也非常简单，如下高亮代码所示：</p><pre><code>function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 省略...

    // 旧的 children 中有多个子节点
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 省略...
        case ChildrenFlags.NO_CHILDREN:
          // 省略...
        default:
          for (let i = 0; i &lt; prevChildren.length; i++) {
            patch(prevChildren[i], nextChildren[i], container)
          }
          break
      }
      break
  }
}
</code></pre><p>通过遍历旧的 <code>children</code>，将新旧 <code>children</code> 中相同位置的节点拿出来作为一对“新旧 <code>VNode</code>”，并调用 <code>patch</code> 函数更新之。由于新旧列表的标签相同，所以这种更新方案较之前相比，省去了“移除”和“新建” DOM 元素的性能开销。而且从实现上看，代码也较之前少了一些，真可谓一举两得。但不要高兴的太早，细心的同学可能已经发现问题所在了，如上代码中我们遍历的是旧的 <code>children</code>，如果新旧 <code>children</code> 的长度相同的话，则这段代码可以正常工作，但是一旦新旧 <code>children</code> 的长度不同，这段代码就不能正常工作了，如下图所示：</p><p><img src="`+p+'" alt=""></p><p>当新的 <code>children</code> 比旧的 <code>children</code> 的长度要长时，多出来的子节点是没办法应用 <code>patch</code> 函数的，此时我们应该把多出来的子节点作为新的节点添加上去。类似的，如果新的 <code>children</code> 比旧的 <code>children</code> 的长度要短时，我们应该把旧的 <code>children</code> 中多出来的子节点移除，如下图所示：</p><p><img src="'+i+`" alt=""></p><p>通过分析我们得出一个规律，我们不应该总是遍历旧的 <code>children</code>，而是应该遍历新旧 <code>children</code> 中长度较短的那一个，这样我们能够做到尽可能多的应用 <code>patch</code> 函数进行更新，然后再对比新旧 <code>children</code> 的长度，如果新的 <code>children</code> 更长，则说明有新的节点需要添加，否则说明有旧的节点需要移除。最终我们得到如下实现：</p><pre><code>function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 省略...

    // 旧的 children 中有多个子节点
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 省略...
        case ChildrenFlags.NO_CHILDREN:
          // 省略...
        default:
          // 新的 children 中有多个子节点
          // 获取公共长度，取新旧 children 长度较小的那一个
          const prevLen = prevChildren.length
          const nextLen = nextChildren.length
          const commonLength = prevLen &gt; nextLen ? nextLen : prevLen
          for (let i = 0; i &lt; commonLength; i++) {
            patch(prevChildren[i], nextChildren[i], container)
          }
          // 如果 nextLen &gt; prevLen，将多出来的元素添加
          if (nextLen &gt; prevLen) {
            for (let i = commonLength; i &lt; nextLen; i++) {
              mount(nextChildren[i], container)
            }
          } else if (prevLen &gt; nextLen) {
            // 如果 prevLen &gt; nextLen，将多出来的元素移除
            for (let i = commonLength; i &lt; prevLen; i++) {
              container.removeChild(prevChildren[i].el)
            }
          }
          break
      }
      break
  }
}
</code></pre><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/qqxxlxzwm6" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/qqxxlxzwm6</a><a href="https://codesandbox.io/s/qqxxlxzwm6" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>实际上，这个算法就是在没有 <code>key</code> 时所采用的算法，该算法是存在优化空间的，下面我们将分析如何进一步优化。</p>`,27),r=[d];function u(h,g){return a(),s("div",null,r)}const _=e(l,[["render",u],["__file","01-减小DOM操作的性能开销.html.vue"]]),f=JSON.parse('{"path":"/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%20Diff%20%E7%AE%97%E6%B3%95/01-%E5%87%8F%E5%B0%8FDOM%E6%93%8D%E4%BD%9C%E7%9A%84%E6%80%A7%E8%83%BD%E5%BC%80%E9%94%80.html","title":"减小DOM操作的性能开销","lang":"zh-CN","frontmatter":{"title":"减小DOM操作的性能开销","description":"减小DOM操作的性能开销 上一章我们讨论了渲染器是如何更新各种类型的 VNode 的，实际上，上一章所讲解的内容归属于完整的 Diff 算法之内，但并不包含核心的 Diff 算法。那什么才是核心的 Diff 算法呢？看下图： 我们曾在上一章中讲解子节点更新的时候见到过这张图，当时我们提到只有当新旧子节点的类型都是多个子节点时，核心Diff 算法才派得上...","head":[["meta",{"property":"og:url","content":"https://interview.leeguoo.com/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%20Diff%20%E7%AE%97%E6%B3%95/01-%E5%87%8F%E5%B0%8FDOM%E6%93%8D%E4%BD%9C%E7%9A%84%E6%80%A7%E8%83%BD%E5%BC%80%E9%94%80.html"}],["meta",{"property":"og:site_name","content":"前端面试题集锦"}],["meta",{"property":"og:title","content":"减小DOM操作的性能开销"}],["meta",{"property":"og:description","content":"减小DOM操作的性能开销 上一章我们讨论了渲染器是如何更新各种类型的 VNode 的，实际上，上一章所讲解的内容归属于完整的 Diff 算法之内，但并不包含核心的 Diff 算法。那什么才是核心的 Diff 算法呢？看下图： 我们曾在上一章中讲解子节点更新的时候见到过这张图，当时我们提到只有当新旧子节点的类型都是多个子节点时，核心Diff 算法才派得上..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_7cb972d068b2d405.webp"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-07-06T04:15:51.000Z"}],["meta",{"property":"article:modified_time","content":"2026-07-06T04:15:51.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"减小DOM操作的性能开销\\",\\"image\\":[\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_7cb972d068b2d405.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_ac9f3b53fa31e426.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_f29c1e3d3ec2e9cd.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_c51050b67f2e6cce.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_40dce2fec8ddba9a.webp\\"],\\"dateModified\\":\\"2026-07-06T04:15:51.000Z\\",\\"author\\":[]}"]]},"headers":[],"git":{"updatedTime":1783311351000,"contributors":[{"name":"leeguooooo","email":"guoli@zhihu.com","commits":3}]},"autoDesc":true,"filePathRelative":"Vue-渲染器的核心 Diff 算法/01-减小DOM操作的性能开销.md","excerpt":"\\n<p>上一章我们讨论了渲染器是如何更新各种类型的 <code>VNode</code> 的，实际上，上一章所讲解的内容归属于完整的 <code>Diff</code> 算法之内，但并不包含核心的\\n<code>Diff</code> 算法。那什么才是核心的 <code>Diff</code> 算法呢？看下图：</p>\\n<p><img src=\\"/images/s_poetries_work_uploads_2024_02_7cb972d068b2d405.webp\\" alt=\\"\\"></p>\\n<p>我们曾在上一章中讲解子节点更新的时候见到过这张图，当时我们提到<strong>只有当新旧子节点的类型都是多个子节点时，核心<code>Diff</code>\\n算法才派得上用场</strong>，并且当时我们采用了一种仅能实现目标但并不完美的算法：<strong>遍历旧的子节点，将其全部移除；再遍历新的子节点，将其全部添加</strong>\\n，如下高亮代码所示：</p>"}');export{_ as comp,f as data};
