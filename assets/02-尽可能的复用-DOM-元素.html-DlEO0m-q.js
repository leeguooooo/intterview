import{_ as e}from"./s_poetries_work_uploads_2024_02_9e57680a134bdaa0-CiSEY1mO.js";import{_ as s,c as a,o,a as c}from"./app-D2IzyuJd.js";const t="/images/s_poetries_work_uploads_2024_02_d5905502c17b331e.webp",d="/images/s_poetries_work_uploads_2024_02_ac43bf3cdd9f397b.webp",p="/images/s_poetries_work_uploads_2024_02_5ef13e02c0e5ea87.webp",l="/images/s_poetries_work_uploads_2024_02_3b052cd3c8a45ffb.webp",i="/images/s_poetries_work_uploads_2024_02_0da6d975e4a8630b.webp",n="/images/s_poetries_work_uploads_2024_02_1e2aeebfe89f58f2.webp",r="/images/s_poetries_work_uploads_2024_02_0946ef93055c6933.webp",u={},k=c(`<h1 id="尽可能的复用-dom-元素" tabindex="-1"><a class="header-anchor" href="#尽可能的复用-dom-元素"><span>尽可能的复用 DOM 元素</span></a></h1><h3 id="key-的作用" tabindex="-1"><a class="header-anchor" href="#key-的作用"><span>key 的作用</span></a></h3><p>在上一小节中，我们通过减少 DOM 操作的次数使得更新的性能得到了提升，但它仍然存在可优化的空间，要明白如何优化，那首先我们需要知道问题出在哪里。还是拿上一节的例子来说，假设旧的 <code>children</code> 如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">[</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>新的 <code>children</code> 如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">[</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们来看一下，如果使用前面讲解的 <code>Diff</code> 算法来更新这对新旧 <code>children</code> 的话，会进行哪些操作：首先，旧 <code>children</code> 的第一个节点和新 <code>children</code> 的第一个节点进行比对(<code>patch</code>)，即：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token comment">// vs</span></span>
<span class="line">    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>patch</code> 函数知道它们是相同的标签，所以只会更新 <code>VNodeData</code> 和子节点，由于这两个标签都没有 <code>VNodeData</code>，所以只需要更新它们的子节点，旧的 <code>li</code> 元素的子节点是文本节点 <code>&#39;1&#39;</code>，而新的 <code>li</code> 标签的子节点是文本节点 <code>&#39;3&#39;</code>，所以最终会调用一次 <code>patchText</code> 函数将 <code>li</code> 标签的文本子节点由 <code>&#39;1&#39;</code> 更新为 <code>&#39;3&#39;</code>。接着，使用旧 <code>children</code> 的第二个节点和新 <code>children</code> 的第二个节点进行比对，结果同样是调用一次 <code>patchText</code> 函数用以更新 <code>li</code> 标签的文本子节点。类似的，对于新旧 <code>children</code> 的第三个节点同样也会调用一次 <code>patchText</code> 函数更新其文本子节点。而这，就是问题所在，实际上我们通过观察新旧 <code>children</code> 可以很容易的发现：新旧 <code>children</code> 中的节点只有顺序是不同的，所以最佳的操作应该是<strong>通过移动元素的位置来达到更新的目的</strong> 。</p><p>既然移动元素是最佳期望，那么我们就需要思考一下，能否通过移动元素来完成更新？能够移动元素的关键在于：我们需要在新旧 <code>children</code> 的节点中保存映射关系，以便我们能够在旧 <code>children</code> 的节点中找到可复用的节点。这时候我们就需要给 <code>children</code> 中的节点添加唯一标识，也就是我们常说的 <code>key</code>，在没有 <code>key</code> 的情况下，我们是没办法知道新 <code>children</code> 中的节点是否可以在旧 <code>children</code> 中找到可复用的节点的，如下图所示：</p><p><img src="`+t+`" alt=""></p><p>新旧 <code>children</code> 中的节点都是 <code>li</code> 标签，以新 <code>children</code> 的第一个 <code>li</code> 标签为例，你能说出在旧 <code>children</code> 中哪一个 <code>li</code> 标签可被它复用吗？不能，所以，为了明确的知道新旧 <code>children</code> 中节点的映射关系，我们需要在 <code>VNode</code> 创建伊始就为其添加唯一的标识，即 <code>key</code> 属性。</p><p>我们可以在使用 <code>h</code> 函数创建 <code>VNode</code> 时，通过 <code>VNodeData</code> 为即将创建的 <code>VNode</code> 设置一个 <code>key</code>：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">&#39;a&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>但是为了 <code>diff</code> 算法更加方便的读取一个 <code>VNode</code> 的 <code>key</code>，我们应该在创建 <code>VNode</code> 时将 <code>VNodeData</code> 中的 <code>key</code> 添加到 <code>VNode</code> 本身，所以我们需要修改一下 <code>h</code> 函数，如下：</p><pre><code>export function h(tag, data = null, children = null) {
  // 省略...

  // 返回 VNode 对象
  return {
    _isVNode: true,
    flags,
    tag,
    data,
    key: data &amp;&amp; data.key ? data.key : null,
    children,
    childFlags,
    el: null
  }
}
</code></pre><p>如上代码所示，我们在创建 <code>VNode</code> 时，如果 <code>VNodeData</code> 中存在 <code>key</code> 属性，则我们会把其添加到 <code>VNode</code> 对象本身。</p><p>现在，在创建 <code>VNode</code> 时已经可以为 <code>VNode</code> 添加唯一标识了，我们使用 <code>key</code> 来修改之前的例子，如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 旧 children</span></span>
<span class="line">    <span class="token punctuation">[</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">&#39;a&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">&#39;b&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">&#39;c&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 新 children</span></span>
<span class="line">    <span class="token punctuation">[</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">&#39;c&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">&#39;a&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">&#39;li&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">&#39;b&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有了 <code>key</code> 我们就能够明确的知道新旧 <code>children</code> 中节点的映射关系，如下图所示：</p><p><img src="`+d+`" alt=""></p><p>知道了映射关系，我们就很容易判断新 <code>children</code> 中的节点是否可被复用：只需要遍历新 <code>children</code> 中的每一个节点，并去旧 <code>children</code> 中寻找是否存在具有相同 <code>key</code> 值的节点，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 遍历新的 children</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> nextChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span></span>
<span class="line">      <span class="token keyword">let</span> j <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">      <span class="token comment">// 遍历旧的 children</span></span>
<span class="line">      <span class="token keyword">for</span> <span class="token punctuation">(</span>j<span class="token punctuation">;</span> j <span class="token operator">&lt;</span> prevChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>j<span class="token punctuation">]</span></span>
<span class="line">        <span class="token comment">// 如果找到了具有相同 key 值的两个节点，则调用 \`patch\` 函数更新之</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>nextVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> prevVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token function">patch</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">          <span class="token keyword">break</span> <span class="token comment">// 这里需要 break</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码中有两层嵌套的 <code>for</code> 循环语句，外层循环用于遍历新 <code>children</code>，内层循环用于遍历旧 <code>children</code>，其目的是尝试寻找具有相同 <code>key</code> 值的两个节点，如果找到了，则认为新 <code>children</code> 中的节点可以复用旧 <code>children</code> 中已存在的节点，这时我们仍然需要调用 <code>patch</code> 函数对节点进行更新，如果新节点相对于旧节点的 <code>VNodeData</code> 和子节点都没有变化，则 <code>patch</code> 函数什么都不会做(这是优化的关键所在)，如果新节点相对于旧节点的 <code>VNodeData</code> 或子节点有变化，则 <code>patch</code> 函数保证了更新的正确性。</p><h3 id="找到需要移动的节点" tabindex="-1"><a class="header-anchor" href="#找到需要移动的节点"><span>找到需要移动的节点</span></a></h3><p>现在我们已经找到了可复用的节点，并进行了合适的更新操作，下一步需要做的，就是判断一个节点是否需要移动以及如何移动。如何判断节点是否需要移动呢？为了弄明白这个问题，我们可以先考虑不需要移动的情况，当新旧 <code>children</code> 中的节点顺序不变时，就不需要额外的移动操作，如下：</p><p><img src="`+p+'" alt=""></p><p>上图中的数字代表着节点在旧 <code>children</code> 中的索引，我们来尝试执行一下本节介绍的算法，看看会发生什么：</p><ul><li>1、取出新 <code>children</code> 的第一个节点，即 <code>li-a</code>，并尝试在旧 <code>children</code> 中寻找 <code>li-a</code>，结果是我们找到了，并且 <code>li-a</code> 在旧 <code>children</code> 中的索引为 <code>0</code>。</li><li>2、取出新 <code>children</code> 的第二个节点，即 <code>li-b</code>，并尝试在旧 <code>children</code> 中寻找 <code>li-b</code>，也找到了，并且 <code>li-b</code> 在旧 <code>children</code> 中的索引为 <code>1</code>。</li><li>3、取出新 <code>children</code> 的第三个节点，即 <code>li-c</code>，并尝试在旧 <code>children</code> 中寻找 <code>li-c</code>，同样找到了，并且 <code>li-c</code> 在旧 <code>children</code> 中的索引为 <code>2</code>。</li></ul><p>总结一下我们在“寻找”的过程中，先后遇到的索引顺序为：<code>0</code>-&gt;<code>1</code>-&gt;<code>2</code>。这是一个递增的顺序，这说明<strong>如果在寻找的过程中遇到的索引呈现递增趋势，则说明新旧<code>children</code> 中节点顺序相同，不需要移动操作</strong>。相反的，<strong>如果在寻找的过程中遇到的索引值不呈现递增趋势，则说明需要移动操作</strong> ，举个例子，下图展示了新旧 <code>children</code> 中的节点顺序不一致的情况：</p><p><img src="'+e+`" alt=""></p><p>我们同样执行一下本节介绍的算法，看看会发生什么：</p><ul><li>1、取出新 <code>children</code> 的第一个节点，即 <code>li-c</code>，并尝试在旧 <code>children</code> 中寻找 <code>li-c</code>，结果是我们找到了，并且 <code>li-c</code> 在旧 <code>children</code> 中的索引为 <code>2</code>。</li><li>2、取出新 <code>children</code> 的第二个节点，即 <code>li-a</code>，并尝试在旧 <code>children</code> 中寻找 <code>li-a</code>，也找到了，并且 <code>li-a</code> 在旧 <code>children</code> 中的索引为 <code>0</code>。</li></ul><p>到了这里，<strong>递增</strong> 的趋势被打破了，我们在寻找的过程中先遇到的索引值是 <code>2</code>，接着又遇到了比 <code>2</code> 小的 <code>0</code>，这说明<strong>在旧<code>children</code> 中 <code>li-a</code> 的位置要比 <code>li-c</code> 靠前，但在新的 <code>children</code> 中 <code>li-a</code> 的位置要比 <code>li-c</code> 靠后</strong>。这时我们就知道了 <code>li-a</code> 是那个需要被移动的节点，我们接着往下执行。</p><ul><li>3、取出新 <code>children</code> 的第三个节点，即 <code>li-b</code>，并尝试在旧 <code>children</code> 中寻找 <code>li-b</code>，同样找到了，并且 <code>li-b</code> 在旧 <code>children</code> 中的索引为 <code>1</code>。</li></ul><p>我们发现 <code>1</code> 同样小于 <code>2</code>，这说明<strong>在旧<code>children</code> 中节点 <code>li-b</code> 的位置也要比 <code>li-c</code> 的位置靠前，但在新的 <code>children</code> 中 <code>li-b</code> 的位置要比 <code>li-c</code> 靠后</strong>。所以 <code>li-b</code> 也需要被移动。</p><p>以上我们过程就是我们寻找需要移动的节点的过程，在这个过程中我们发现一个重要的数字：<code>2</code>，是这个数字的存在才使得我们能够知道哪些节点需要移动，我们可以给这个数字一个名字，叫做：<strong>寻找过程中在旧<code>children</code> 中所遇到的最大索引值</strong>。如果在后续寻找的过程中发现存在索引值比<strong>最大索引值</strong> 小的节点，意味着该节点需要被移动。</p><p>实际上，这就是 <code>React</code> 所使用的算法。我们可以使用一个叫做 <code>lastIndex</code> 的变量存储寻找过程中遇到的最大索引值，并且它的初始值为 <code>0</code>，如下代码所示：</p><pre><code>// 用来存储寻找过程中遇到的最大索引值
let lastIndex = 0
// 遍历新的 children
for (let i = 0; i &lt; nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0
  // 遍历旧的 children
  for (j; j &lt; prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    // 如果找到了具有相同 key 值的两个节点，则调用 \`patch\` 函数更新之
    if (nextVNode.key === prevVNode.key) {
      patch(prevVNode, nextVNode, container)
      if (j &lt; lastIndex) {
        // 需要移动
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
      break // 这里需要 break
    }
  }
}
</code></pre><p>如上代码中，变量 <code>j</code> 是节点在旧 <code>children</code> 中的索引，如果它小于 <code>lastIndex</code> 则代表当前遍历到的节点需要移动，否则我们就使用 <code>j</code> 的值更新 <code>lastIndex</code> 变量的值，这就保证了 <code>lastIndex</code> 所存储的总是我们在旧 <code>children</code> 中所遇到的最大索引。</p><h3 id="移动节点" tabindex="-1"><a class="header-anchor" href="#移动节点"><span>移动节点</span></a></h3><p>现在我们已经有办法找到需要移动的节点了，接下来要解决的问题就是：应该如何移动这些节点？为了弄明白这个问题，我们还是先来看下图：</p><p><img src="`+e+'" alt=""></p><p>新 <code>children</code> 中的第一个节点是 <code>li-c</code>，它在旧 <code>children</code> 中的索引为 <code>2</code>，由于 <code>li-c</code> 是新 <code>children</code> 中的第一个节点，所以它始终都是不需要移动的，只需要调用 <code>patch</code> 函数更新即可，如下图：</p><p><img src="'+l+`" alt=""></p><p>这里我们需要注意的，也是非常重要的一点是：<strong>新<code>children</code> 中的 <code>li-c</code> 节点在经过 <code>patch</code> 函数之后，也将存在对真实 DOM 元素的引用</strong>。下面的代码可以证明这一点：</p><pre><code>function patchElement(prevVNode, nextVNode, container) {
  // 省略...

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  
  // 省略...
}

beforeCreate() {
  this.$options.data = {...}
}
</code></pre><p>如上代码所示，这是 <code>patchElement</code> 函数中的一段代码，在更新<strong>新旧</strong> <code>VNode</code> 时，新的 <code>VNode</code> 通过旧 <code>VNode</code> 的 <code>el</code> 属性实现了对真实 DOM 的引用。为什么说这一点很关键呢？继续往下看。</p><p><code>li-c</code> 节点更新完毕，接下来是新 <code>children</code> 中的第二个节点 <code>li-a</code>，它在旧 <code>children</code> 中的索引是 <code>0</code>，由于 <code>0 &lt; 2</code> 所以 <code>li-a</code> 是需要移动的节点，那应该怎么移动呢？很简单，新 <code>children</code> 中的节点顺序实际上就是更新完成之后，节点应有的最终顺序，通过观察新 <code>children</code> 可知，新 <code>children</code> 中 <code>li-a</code> 节点的前一个节点是 <code>li-c</code>，所以我们的移动方案应该是：<strong>把<code>li-a</code> 节点对应的真实 DOM 移动到 <code>li-c</code> 节点所对应真实 DOM 的后面</strong>。这里的关键在于<strong>移动的是真实 DOM 而非 VNode</strong> 。所以我们需要分别拿到 <code>li-c</code> 和 <code>li-a</code> 所对应的真实 DOM，这时就体现出了上面提到的关键点：<strong>新<code>children</code> 中的 <code>li-c</code> 已经存在对真实 DOM 的引用了</strong>，所以我们很容易就能拿到 <code>li-c</code> 对应的真实 DOM。对于获取 <code>li-a</code> 节点所对应的真实 DOM 将更加容易，由于我们当前遍历到的节点就是 <code>li-a</code>，所以我们可以直接通过旧 <code>children</code> 中的 <code>li-a</code> 节点拿到其真实 DOM 的引用，如下代码所示：</p><pre><code>// 用来存储寻找过程中遇到的最大索引值
let lastIndex = 0
// 遍历新的 children
for (let i = 0; i &lt; nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0
  // 遍历旧的 children
  for (j; j &lt; prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    // 如果找到了具有相同 key 值的两个节点，则调用 \`patch\` 函数更新之
    if (nextVNode.key === prevVNode.key) {
      patch(prevVNode, nextVNode, container)
      if (j &lt; lastIndex) {
        // 需要移动
        // refNode 是为了下面调用 insertBefore 函数准备的
        const refNode = nextChildren[i - 1].el.nextSibling
        // 调用 insertBefore 函数移动 DOM
        container.insertBefore(prevVNode.el, refNode)
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
      break // 这里需要 break
    }
  }
}
</code></pre><p>观察如上代码段中高亮的部分，实际上这两句代码即可完成 DOM 的移动操作。我们来对这两句代码的工作方式做一个详细的解释，假设我们当前正在更新的节点是 <code>li-a</code>，那么如上代码中的变量 <code>i</code> 就是节点 <code>li-a</code> 在新 <code>children</code> 中的位置索引。所以 <code>nextChildren[i - 1]</code> 就是 <code>li-a</code> 节点的前一个节点，也就是 <code>li-c</code> 节点，由于 <code>li-c</code> 节点存在对真实 DOM 的引用，所以我们可以通过其 <code>el</code> 属性拿到真实 DOM，到了这一步，<code>li-c</code> 节点的所对应的真实 DOM 我们已经得到了。但不要忘记我们的目标是：<strong>把<code>li-a</code> 节点对应的真实 DOM 移动到 <code>li-c</code> 节点所对应真实 DOM 的后面</strong>，所以我们的思路应该是<strong>想办法拿到<code>li-c</code> 节点对应真实 DOM 的下一个兄弟节点，并把 <code>li-a</code> 节点所对应真实 DOM 插到该节点的前面</strong>，这才能保证移动的正确性。所以上面的代码中常量 <code>refNode</code> 引用是 <code>li-c</code> 节点对应真实 DOM 的下一个兄弟节点。拿到了正确的 <code>refNode</code> 之后，我们就可以调用容器元素的 <code>insertBefore</code> 方法来完成 DOM 的移动了，移动的对象就是 <code>li-a</code> 节点所对应的真实 DOM，由于当前正在处理的就是 <code>li-a</code> 节点，所以 <code>prevVNode</code> 就是旧 <code>children</code> 中的 <code>li-a</code> 节点，它是存在对真实 DOM 的引用的，即 <code>prevVNode.el</code>。万事俱备，移动工作将顺利完成。说起来有些抽象，用一张图可以更加清晰的描述这个过程：</p><p><img src="`+i+'" alt=""></p><p>观察不同颜色的线条，关键在于我们要找到 <code>VNode</code> 所引用的真实 DOM，然后把真实 DOM 按照新 <code>children</code> 中节点间的关系进行移动，由于新 <code>children</code> 中节点的顺序就是最终的目标顺序，所以移动之后的真实 DOM 的顺序也会是最终的目标顺序。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/4x6qo5w34w" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/4x6qo5w34w</a><a href="https://codesandbox.io/s/4x6qo5w34w" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="添加新元素" tabindex="-1"><a class="header-anchor" href="#添加新元素"><span>添加新元素</span></a></h3><p>在上面的讲解中，我们一直忽略了一个问题，即新 <code>children</code> 中可能包含那些不能够通过移动来完成更新的节点，例如新 <code>children</code> 中包含了一个全新的节点，这意味着在旧 <code>children</code> 中是找不到该节点的，如下图所示：</p><p><img src="'+n+`" alt=""></p><p>节点 <code>li-d</code> 在旧的 <code>children</code> 中是不存在的，所以当我们尝试在旧的 <code>children</code> 中寻找 <code>li-d</code> 节点时，是找不到可复用节点的，这时就没办法通过移动节点来完成更新操作，所以我们应该使用 <code>mount</code> 函数将 <code>li-d</code> 节点作为全新的 <code>VNode</code> 挂载到合适的位置。</p><p>我们将面临两个问题，第一个问题是：如何知道一个节点在旧的 <code>children</code> 中是不存在的？这个问题比较好解决，如下代码所示：</p><pre><code>let lastIndex = 0
for (let i = 0; i &lt; nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0,
    find = false
  for (j; j &lt; prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    if (nextVNode.key === prevVNode.key) {
      find = true
      patch(prevVNode, nextVNode, container)
      if (j &lt; lastIndex) {
        // 需要移动
        const refNode = nextChildren[i - 1].el.nextSibling
        container.insertBefore(prevVNode.el, refNode)
        break
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
    }
  }
}
</code></pre><p>如上高亮代码所示，我们在原来的基础上添加了变量 <code>find</code>，它将作为一个标志，代表新 <code>children</code> 中的节点是否存在于旧 <code>children</code> 中，初始值为 <code>false</code>，一旦在旧 <code>children</code> 中寻找到了相应的节点，我们就将变量 <code>find</code> 的值设置为 <code>true</code>，所以<strong>如果内层循环结束后，变量<code>find</code> 的值仍然为 <code>false</code>，则说明在旧的 <code>children</code> 中找不到可复用的节点</strong>，这时我们就需要使用 <code>mount</code> 函数将当前遍历到的节点挂载到容器元素，如下高亮的代码所示：</p><pre><code>let lastIndex = 0
for (let i = 0; i &lt; nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0,
    find = false
  for (j; j &lt; prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    if (nextVNode.key === prevVNode.key) {
      find = true
      patch(prevVNode, nextVNode, container)
      if (j &lt; lastIndex) {
        // 需要移动
        const refNode = nextChildren[i - 1].el.nextSibling
        container.insertBefore(prevVNode.el, refNode)
        break
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
    }
  }
  if (!find) {
    // 挂载新节点
    mount(nextVNode, container, false)
  }
}
</code></pre><p>当内层循环结束之后，如果变量 <code>find</code> 的值仍然为 <code>false</code>，则说明 <code>nextVNode</code> 是全新的节点，所以我们直接调用 <code>mount</code> 函数将其挂载到容器元素 <code>container</code> 中。但是很遗憾，这段代码不能正常的工作，这是因为<strong>我们之前编写的<code>mountElement</code> 函数存在缺陷，它总是调用 <code>appendChild</code> 方法插入 DOM 元素</strong>，所以上面的代码始终会把新的节点作为容器元素的最后一个子节点添加到末尾，这不是我们想要的结果，我们应该按照节点在新的 <code>children</code> 中的位置将其添加到正确的地方，如下图所示：</p><p><img src="`+n+`" alt=""></p><p>新的 <code>li-d</code> 节点紧跟在 <code>li-a</code> 节点的后面，所以正确的做法应该是把 <code>li-d</code> 节点添加到 <code>li-a</code> 节点所对应真实 DOM 的后面才行。如何才能保证 <code>li-d</code> 节点始终被添加到 <code>li-a</code> 节点的后面呢？答案是使用 <code>insertBefore</code> 方法代替 <code>appendChild</code> 方法，我们可以找到 <code>li-a</code> 节点所对应真实 DOM 的下一个节点，然后将 <code>li-d</code> 节点插入到该节点之前即可，如下高亮代码所示：</p><pre><code>let lastIndex = 0
for (let i = 0; i &lt; nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0,
    find = false
  for (j; j &lt; prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    if (nextVNode.key === prevVNode.key) {
      find = true
      patch(prevVNode, nextVNode, container)
      if (j &lt; lastIndex) {
        // 需要移动
        const refNode = nextChildren[i - 1].el.nextSibling
        container.insertBefore(prevVNode.el, refNode)
        break
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
    }
  }
  if (!find) {
    // 挂载新节点
    // 找到 refNode
    const refNode =
      i - 1 &lt; 0
        ? prevChildren[0].el
        : nextChildren[i - 1].el.nextSibling
    mount(nextVNode, container, false, refNode)
  }
}
</code></pre><p>我们先找到当前遍历到的节点的前一个节点，即 <code>nextChildren[i - 1]</code>，接着找到该节点所对应真实 DOM 的下一个子节点作为 <code>refNode</code>，即 <code>nextChildren[i - 1].el.nextSibling</code>，但是由于当前遍历到的节点有可能是新 <code>children</code> 的第一个节点，这时 <code>i - 1 &lt; 0</code>，这将导致 <code>nextChildren[i - 1]</code> 不存在，所以当 <code>i - 1 &lt; 0</code> 时，我们就知道<strong>新的节点是作为第一个节点而存在的</strong> ，这时我们只需要把新的节点插入到最前面即可，所以我们使用 <code>prevChildren[0].el</code> 作为 <code>refNode</code>。最后调用 <code>mount</code> 函数挂载新节点时，我们为其传递了第四个参数 <code>refNode</code>，当 <code>refNode</code> 存在时，我们应该使用 <code>insertBefore</code> 方法代替 <code>appendChild</code> 方法，这就需要我们修改之前实现的 <code>mount</code> 函数了 <code>mountElement</code> 函数，为它们添加第四个参数，如下：</p><pre><code>// mount 函数
function mount(vnode, container, isSVG, refNode) {
  const { flags } = vnode
  if (flags &amp; VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG, refNode)
  }

  // 省略...
}

// mountElement 函数
function mountElement(vnode, container, isSVG, refNode) {
  // 省略...

  refNode ? container.insertBefore(el, refNode) : container.appendChild(el)
}
</code></pre><p>这样，当新 <code>children</code> 中存在全新的节点时，我们就能够保证正确的将其添加到容器元素内了。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/54215km3vn" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/54215km3vn</a><a href="https://codesandbox.io/s/54215km3vn" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>TIP</p><p>实际上，所有与挂载和 <code>patch</code> 相关的函数都应该接收 <code>refNode</code> 作为参数，这里我们旨在让读者掌握核心思路，避免讲解过程的冗杂。</p><h3 id="移除不存在的元素" tabindex="-1"><a class="header-anchor" href="#移除不存在的元素"><span>移除不存在的元素</span></a></h3><p>除了要将全新的节点添加到容器元素之外，我们还应该把已经不存在了的节点移除，如下图所示：</p><p><img src="`+r+`" alt=""></p><p>可以看出，新的 <code>children</code> 中已经不存在 <code>li-c</code> 节点了，所以我们应该想办法将 <code>li-c</code> 节点对应的真实 DOM 从容器元素内移除。但我们之前编写的算法还不能完成这个任务，因为外层循环遍历的是新的 <code>children</code>，所以外层循环会执行两次，第一次用于处理 <code>li-a</code> 节点，第二次用于处理 <code>li-b</code> 节点，此时整个算法已经运行结束了。所以，我们需要在外层循环结束之后，再优先遍历一次旧的 <code>children</code>，并尝试拿着旧 <code>children</code> 中的节点去新 <code>children</code> 中寻找相同的节点，如果找不到则说明该节点已经不存在于新 <code>children</code> 中了，这时我们应该将该节点对应的真实 DOM 移除，如下高亮代码所示：</p><pre><code>let lastIndex = 0
for (let i = 0; i &lt; nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0,
    find = false
  for (j; j &lt; prevChildren.length; j++) {
    // 省略...
  }
  if (!find) {
    // 挂载新节点
    // 省略...
  }
}
// 移除已经不存在的节点
// 遍历旧的节点
for (let i = 0; i &lt; prevChildren.length; i++) {
  const prevVNode = prevChildren[i]
  // 拿着旧 VNode 去新 children 中寻找相同的节点
  const has = nextChildren.find(
    nextVNode =&gt; nextVNode.key === prevVNode.key
  )
  if (!has) {
    // 如果没有找到相同的节点，则移除
    container.removeChild(prevVNode.el)
  }
}
</code></pre><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/844lp3mq72" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/844lp3mq72</a><a href="https://codesandbox.io/s/844lp3mq72" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>至此，第一个完整的 <code>Diff</code> 算法我们就讲解完毕了，这个算法就是 <code>React</code> 所采用的 <code>Diff</code> 算法。但该算法仍然存在可优化的空间，我们将在下一小节继续讨论。</p>`,82),h=[k];function m(g,v){return o(),a("div",null,h)}const _=s(u,[["render",m],["__file","02-尽可能的复用-DOM-元素.html.vue"]]),x=JSON.parse(`{"path":"/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%20Diff%20%E7%AE%97%E6%B3%95/02-%E5%B0%BD%E5%8F%AF%E8%83%BD%E7%9A%84%E5%A4%8D%E7%94%A8-DOM-%E5%85%83%E7%B4%A0.html","title":"尽可能的复用 DOM 元素","lang":"zh-CN","frontmatter":{"title":"尽可能的复用 DOM 元素","description":"尽可能的复用 DOM 元素 key 的作用 在上一小节中，我们通过减少 DOM 操作的次数使得更新的性能得到了提升，但它仍然存在可优化的空间，要明白如何优化，那首先我们需要知道问题出在哪里。还是拿上一节的例子来说，假设旧的 children 如下： 新的 children 如下： 我们来看一下，如果使用前面讲解的 Diff 算法来更新这对新旧 chil...","head":[["meta",{"property":"og:url","content":"https://interview.leeguoo.com/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%20Diff%20%E7%AE%97%E6%B3%95/02-%E5%B0%BD%E5%8F%AF%E8%83%BD%E7%9A%84%E5%A4%8D%E7%94%A8-DOM-%E5%85%83%E7%B4%A0.html"}],["meta",{"property":"og:site_name","content":"前端面试题集锦"}],["meta",{"property":"og:title","content":"尽可能的复用 DOM 元素"}],["meta",{"property":"og:description","content":"尽可能的复用 DOM 元素 key 的作用 在上一小节中，我们通过减少 DOM 操作的次数使得更新的性能得到了提升，但它仍然存在可优化的空间，要明白如何优化，那首先我们需要知道问题出在哪里。还是拿上一节的例子来说，假设旧的 children 如下： 新的 children 如下： 我们来看一下，如果使用前面讲解的 Diff 算法来更新这对新旧 chil..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_d5905502c17b331e.webp"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-07-06T04:15:51.000Z"}],["meta",{"property":"article:modified_time","content":"2026-07-06T04:15:51.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"尽可能的复用 DOM 元素\\",\\"image\\":[\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_d5905502c17b331e.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_ac43bf3cdd9f397b.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_5ef13e02c0e5ea87.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_9e57680a134bdaa0.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_9e57680a134bdaa0.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_3b052cd3c8a45ffb.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_0da6d975e4a8630b.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_1e2aeebfe89f58f2.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_1e2aeebfe89f58f2.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_0946ef93055c6933.webp\\"],\\"dateModified\\":\\"2026-07-06T04:15:51.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":3,"title":"key 的作用","slug":"key-的作用","link":"#key-的作用","children":[]},{"level":3,"title":"找到需要移动的节点","slug":"找到需要移动的节点","link":"#找到需要移动的节点","children":[]},{"level":3,"title":"移动节点","slug":"移动节点","link":"#移动节点","children":[]},{"level":3,"title":"添加新元素","slug":"添加新元素","link":"#添加新元素","children":[]},{"level":3,"title":"移除不存在的元素","slug":"移除不存在的元素","link":"#移除不存在的元素","children":[]}],"git":{"updatedTime":1783311351000,"contributors":[{"name":"leeguooooo","email":"guoli@zhihu.com","commits":3}]},"autoDesc":true,"filePathRelative":"Vue-渲染器的核心 Diff 算法/02-尽可能的复用-DOM-元素.md","excerpt":"\\n<h3>key 的作用</h3>\\n<p>在上一小节中，我们通过减少 DOM\\n操作的次数使得更新的性能得到了提升，但它仍然存在可优化的空间，要明白如何优化，那首先我们需要知道问题出在哪里。还是拿上一节的例子来说，假设旧的\\n<code>children</code> 如下：</p>\\n<div class=\\"language-javascript\\" data-highlighter=\\"prismjs\\" data-ext=\\"js\\" data-title=\\"js\\"><pre class=\\"language-javascript\\"><code><span class=\\"line\\">    <span class=\\"token punctuation\\">[</span></span>\\n<span class=\\"line\\">      <span class=\\"token function\\">h</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'li'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token keyword\\">null</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">,</span></span>\\n<span class=\\"line\\">      <span class=\\"token function\\">h</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'li'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token keyword\\">null</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">2</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">,</span></span>\\n<span class=\\"line\\">      <span class=\\"token function\\">h</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'li'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token keyword\\">null</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">3</span><span class=\\"token punctuation\\">)</span></span>\\n<span class=\\"line\\">    <span class=\\"token punctuation\\">]</span></span>\\n<span class=\\"line\\"></span></code></pre></div>"}`);export{_ as comp,x as data};
