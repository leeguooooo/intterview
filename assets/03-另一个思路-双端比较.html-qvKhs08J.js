import{_ as d}from"./vue-diff-BW92NDcl.js";import{_ as o}from"./s_poetries_work_uploads_2024_02_9e57680a134bdaa0-CiSEY1mO.js";import{_ as n,c as a,o as t,a as c}from"./app-C0SBBF5d.js";const s="/images/s_poetries_work_uploads_2024_02_242541513654fb21.webp",e="/images/s_poetries_work_uploads_2024_02_9d3f42cbb025eedf.webp",l="/images/s_poetries_work_uploads_2024_02_5d6d3836641bc1a6.webp",p="/images/s_poetries_work_uploads_2024_02_a76e19b385e0bb88.webp",i="/images/s_poetries_work_uploads_2024_02_777fbf4df88821ac.webp",r="/images/s_poetries_work_uploads_2024_02_0d30dad1934f9ce7.webp",_="/images/s_poetries_work_uploads_2024_02_533db5e57c1ed0c9.webp",w="/images/s_poetries_work_uploads_2024_02_5350d50f9328eedc.webp",k="/images/s_poetries_work_uploads_2024_02_9285a505a83eb719.webp",u="/images/s_poetries_work_uploads_2024_02_0ba7c12f50e26c0d.webp",h="/images/s_poetries_work_uploads_2024_02_dbf60539b42d2d68.webp",m="/images/s_poetries_work_uploads_2024_02_4756ae61c44e317b.webp",V="/images/s_poetries_work_uploads_2024_02_eec6b6621fdbe3fe.webp",N="/images/s_poetries_work_uploads_2024_02_72b22a35eb649f11.webp",b="/images/s_poetries_work_uploads_2024_02_cf4b71dc23f86079.webp",x="/images/s_poetries_work_uploads_2024_02_bb19b23fd5e2f01e.webp",E="/images/s_poetries_work_uploads_2024_02_27d49216f446a731.webp",g="/images/s_poetries_work_uploads_2024_02_575d12760b7a214f.webp",S="/images/s_poetries_work_uploads_2024_02_df0e288269753200.webp",f="/images/s_poetries_work_uploads_2024_02_2ed47ccfa8f1d761.webp",v="/images/s_poetries_work_uploads_2024_02_84170a714397cccf.webp",y="/images/s_poetries_work_uploads_2024_02_951e167b611e2bbd.webp",I={},O=c('<h1 id="另一个思路-双端比较" tabindex="-1"><a class="header-anchor" href="#另一个思路-双端比较"><span>另一个思路 - 双端比较</span></a></h1><h3 id="双端比较的原理" tabindex="-1"><a class="header-anchor" href="#双端比较的原理"><span>双端比较的原理</span></a></h3><p><img src="'+d+'" alt="双端比较:新旧 children 各设头尾两个指针,一轮最多做头头、尾尾、头尾、尾头四次比较,命中即复用并向中间收拢"></p><p>刚刚提到了 <code>React</code> 的 <code>Diff</code> 算法是存在优化空间的，想要要找到优化的关键点，我们首先要知道它存在什么问题。来看下图：</p><p><img src="'+s+'" alt=""></p><p>在这个例子中，我们可以通过肉眼观察从而得知最优的解决方案应该是：<strong>把<code>li-c</code> 节点对应的真实 DOM 移动到最前面即可</strong>，只需要一次移动即可完成更新。然而，<code>React</code> 所采用的 <code>Diff</code> 算法在更新如上案例的时候，会进行两次移动：</p><p><img src="'+e+'" alt=""></p><p>显然，这种做法必然会造成额外的性能开销。那么有没有办法来避免这种多余的 DOM 移动呢？当然有办法，那就是我们接下来要介绍的一个新的思路：<strong>双端比较</strong> 。</p><p>所谓双端比较，就是同时从新旧 <code>children</code> 的两端开始进行比较的一种方式，所以我们需要四个索引值，分别指向新旧 <code>children</code> 的两端，如下图所示：</p><p><img src="'+l+`" alt=""></p><p>我们使用四个变量 <code>oldStartIdx</code>、<code>oldEndIdx</code>、<code>newStartIdx</code> 以及 <code>newEndIdx</code> 分别存储旧 <code>children</code> 和新 <code>children</code> 的两个端点的位置索引，可以用如下代码来表示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">let</span> oldStartIdx <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">    <span class="token keyword">let</span> oldEndIdx <span class="token operator">=</span> prevChildren<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span></span>
<span class="line">    <span class="token keyword">let</span> newStartIdx <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">    <span class="token keyword">let</span> newEndIdx <span class="token operator">=</span> nextChildren<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除了位置索引之外，我们还需要拿到四个位置索引所指向的 <code>VNode</code>：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">let</span> oldStartVNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>oldStartIdx<span class="token punctuation">]</span></span>
<span class="line">    <span class="token keyword">let</span> oldEndVNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>oldEndIdx<span class="token punctuation">]</span></span>
<span class="line">    <span class="token keyword">let</span> newStartVNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>newStartIdx<span class="token punctuation">]</span></span>
<span class="line">    <span class="token keyword">let</span> newEndVNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>newEndIdx<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有了这些基础信息，我们就可以开始执行双端比较了，在一次比较过程中，最多需要进行四次比较：</p><ul><li>1、使用旧 <code>children</code> 的头一个 <code>VNode</code> 与新 <code>children</code> 的头一个 <code>VNode</code> 比对，即 <code>oldStartVNode</code> 和 <code>newStartVNode</code> 比较对。</li><li>2、使用旧 <code>children</code> 的最后一个 <code>VNode</code> 与新 <code>children</code> 的最后一个 <code>VNode</code> 比对，即 <code>oldEndVNode</code> 和 <code>newEndVNode</code> 比对。</li><li>3、使用旧 <code>children</code> 的头一个 <code>VNode</code> 与新 <code>children</code> 的最后一个 <code>VNode</code> 比对，即 <code>oldStartVNode</code> 和 <code>newEndVNode</code> 比对。</li><li>4、使用旧 <code>children</code> 的最后一个 <code>VNode</code> 与新 <code>children</code> 的头一个 <code>VNode</code> 比对，即 <code>oldEndVNode</code> 和 <code>newStartVNode</code> 比对。</li></ul><p>在如上四步比对过程中，试图去寻找可复用的节点，即拥有相同 <code>key</code> 值的节点。这四步比对中，在任何一步中寻找到了可复用节点，则会停止后续的步骤，可以用下图来描述在一次比对过程中的四个步骤：</p><p><img src="`+p+`" alt=""></p><p>如下代码是该比对过程的实现：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>oldStartVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newStartVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 步骤一：oldStartVNode 和 newStartVNode 比对</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>oldEndVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newEndVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 步骤二：oldEndVNode 和 newEndVNode 比对</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>oldStartVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newEndVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 步骤三：oldStartVNode 和 newEndVNode 比对</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>oldEndVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newStartVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 步骤四：oldEndVNode 和 newStartVNode 比对</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每次比对完成之后，如果在某一步骤中找到了可复用的节点，我们就需要将相应的位置索引<strong>后移/前移</strong> 一位。以上图为例：</p><ul><li>第一步：拿旧 <code>children</code> 中的 <code>li-a</code> 和新 <code>children</code> 中的 <code>li-d</code> 进行比对，由于二者 <code>key</code> 值不同，所以不可复用，什么都不做。</li><li>第二步：拿旧 <code>children</code> 中的 <code>li-d</code> 和新 <code>children</code> 中的 <code>li-c</code> 进行比对，同样不可复用，什么都不做。</li><li>第三步：拿旧 <code>children</code> 中的 <code>li-a</code> 和新 <code>children</code> 中的 <code>li-c</code> 进行比对，什么都不做。</li><li>第四部：拿旧 <code>children</code> 中的 <code>li-d</code> 和新 <code>children</code> 中的 <code>li-d</code> 进行比对，由于这两个节点拥有相同的 <code>key</code> 值，所以我们在这次比对的过程中找到了可复用的节点。</li></ul><p>由于我们在第四步的比对中找到了可复用的节点，即 <code>oldEndVNode</code> 和 <code>newStartVNode</code> 拥有相同的 <code>key</code> 值，这说明：<strong><code>li-d</code> 节点所对应的真实 DOM 原本是最后一个子节点，并且更新之后它应该变成第一个子节点</strong>。所以我们需要把 <code>li-d</code> 所对应的真实 DOM 移动到最前方即可：</p><pre><code>if (oldStartVNode.key === newStartVNode.key) {
  // 步骤一：oldStartVNode 和 newStartVNode 比对
} else if (oldEndVNode.key === newEndVNode.key) {
  // 步骤二：oldEndVNode 和 newEndVNode 比对
} else if (oldStartVNode.key === newEndVNode.key) {
  // 步骤三：oldStartVNode 和 newEndVNode 比对
} else if (oldEndVNode.key === newStartVNode.key) {
  // 步骤四：oldEndVNode 和 newStartVNode 比对

  // 先调用 patch 函数完成更新
  patch(oldEndVNode, newStartVNode, container)
  // 更新完成后，将容器中最后一个子节点移动到最前面，使其成为第一个子节点
  container.insertBefore(oldEndVNode.el, oldStartVNode.el)
  // 更新索引，指向下一个位置
  oldEndVNode = prevChildren[--oldEndIdx]
  newStartVNode = nextChildren[++newStartIdx]
}
</code></pre><p>这一步更新完成之后，新的索引关系可以用下图来表示：</p><p><img src="`+i+'" alt=""></p><p>由于 <code>li-d</code> 节点所对应的真实 DOM 元素已经更新完成且被移动，所以现在真实 DOM 的顺序是：<code>li-d</code>、<code>li-a</code>、<code>li-b</code>、<code>li-c</code>，如下图所示：</p><p><img src="'+r+`" alt=""></p><p>这样，一次比对就完成了，并且位置索引已经更新，我们需要进行下轮的比对，那么什么时候比对才能结束呢？如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">while</span> <span class="token punctuation">(</span>oldStartIdx <span class="token operator">&lt;=</span> oldEndIdx <span class="token operator">&amp;&amp;</span> newStartIdx <span class="token operator">&lt;=</span> newEndIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>oldStartVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newStartVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 步骤一：oldStartVNode 和 newStartVNode 比对</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>oldEndVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newEndVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 步骤二：oldEndVNode 和 newEndVNode 比对</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>oldStartVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newEndVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 步骤三：oldStartVNode 和 newEndVNode 比对</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>oldEndVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newStartVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 步骤四：oldEndVNode 和 newStartVNode 比对</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们将每一轮比对所做的工作封装到一个 <code>while</code> 循环内，循环结束的条件是要么 <code>oldStartIdx</code> 大于 <code>oldEndIdx</code>，要么 <code>newStartIdx</code> 大于 <code>newEndIdx</code>。</p><p>还是观察上图，我们继续进行第二轮的比对：</p><ul><li><p>第一步：拿旧 <code>children</code> 中的 <code>li-a</code> 和新 <code>children</code> 中的 <code>li-b</code> 进行比对，由于二者 <code>key</code> 值不同，所以不可复用，什么都不做。</p></li><li><p>第二步：拿旧 <code>children</code> 中的 <code>li-c</code> 和新 <code>children</code> 中的 <code>li-c</code> 进行比对，此时，由于二者拥有相同的 <code>key</code>，所以是可复用的节点，但是由于二者在新旧 <code>children</code> 中都是最末尾的一个节点，所以是不需要进行移动操作的，只需要调用 <code>patch</code> 函数更新即可，同时将相应的索引前移一位，如下高亮代码所示：</p><p>while (oldStartIdx &lt;= oldEndIdx &amp;&amp; newStartIdx &lt;= newEndIdx) { if (oldStartVNode.key === newStartVNode.key) { // 步骤一：oldStartVNode 和 newStartVNode 比对 } else if (oldEndVNode.key === newEndVNode.key) { // 步骤二：oldEndVNode 和 newEndVNode 比对</p><pre><code>// 调用 patch 函数更新
patch(oldEndVNode, newEndVNode, container)
// 更新索引，指向下一个位置
oldEndVNode = prevChildren[--oldEndIdx]
newEndVNode = nextChildren[--newEndIdx]
</code></pre><p>} else if (oldStartVNode.key === newEndVNode.key) { // 步骤三：oldStartVNode 和 newEndVNode 比对 } else if (oldEndVNode.key === newStartVNode.key) { // 步骤四：oldEndVNode 和 newStartVNode 比对</p><pre><code>// 先调用 patch 函数完成更新
patch(oldEndVNode, newStartVNode, container)
// 更新完成后，将容器中最后一个子节点移动到最前面，使其成为第一个子节点
container.insertBefore(oldEndVNode.el, oldStartVNode.el)
// 更新索引，指向下一个位置
oldEndVNode = prevChildren[--oldEndIdx]
newStartVNode = nextChildren[++newStartIdx]
</code></pre><p>} }</p></li></ul><p>由于没有进行移动操作，所以在这一轮比对中，真实 DOM 的顺序没有发生变化，下图表示了在这一轮比对结束之后的状况：</p><p><img src="`+_+`" alt=""></p><p>由于此时循环条件成立，所以会继续下一轮的比较：</p><ul><li>第一步：拿旧 <code>children</code> 中的 <code>li-a</code> 和新 <code>children</code> 中的 <code>li-b</code> 进行比对，由于二者 <code>key</code> 值不同，所以不可复用，什么都不做。</li><li>第二步：拿旧 <code>children</code> 中的 <code>li-b</code> 和新 <code>children</code> 中的 <code>li-a</code> 进行比对，不可复用，什么都不做。</li><li>第三步：拿旧 <code>children</code> 中的 <code>li-a</code> 和新 <code>children</code> 中的 <code>li-a</code> 进行比对，此时，我们找到了可复用的节点。</li></ul><p>这一次满足的条件是：<strong><code>oldStartVNode.key === newEndVNode.key</code></strong> ，这说明：<strong><code>li-a</code> 节点所对应的真实 DOM 原本是第一个子节点，但现在变成了“最后”一个子节点</strong>，这里的“最后”一词使用了引号，这是因为大家要明白“最后”的真正含义，它并不是指真正意义上的最后一个节点，而是指当前索引范围内的最后一个节点。所以移动操作也是比较明显的，我们将 <code>oldStartVNode</code> 对应的真实 DOM 移动到 <code>oldEndVNode</code> 所对应真实 DOM 的后面即可，如下高亮代码所示：</p><pre><code>while (oldStartIdx &lt;= oldEndIdx &amp;&amp; newStartIdx &lt;= newEndIdx) {
  if (oldStartVNode.key === newStartVNode.key) {
    // 步骤一：oldStartVNode 和 newStartVNode 比对
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 步骤二：oldEndVNode 和 newEndVNode 比对

    // 调用 patch 函数更新
    patch(oldEndVNode, newEndVNode, container)
    // 更新索引，指向下一个位置
    oldEndVNode = prevChildren[--oldEndIdx]
    newEndVNode = nextChildren[--newEndIdx]
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 步骤三：oldStartVNode 和 newEndVNode 比对

    // 调用 patch 函数更新
    patch(oldStartVNode, newEndVNode, container)
    // 将 oldStartVNode.el 移动到 oldEndVNode.el 的后面，也就是 oldEndVNode.el.nextSibling 的前面
    container.insertBefore(
      oldStartVNode.el,
      oldEndVNode.el.nextSibling
    )
    // 更新索引，指向下一个位置
    oldStartVNode = prevChildren[++oldStartIdx]
    newEndVNode = nextChildren[--newEndIdx]
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 步骤四：oldEndVNode 和 newStartVNode 比对

    // 先调用 patch 函数完成更新
    patch(oldEndVNode, newStartVNode, container)
    // 更新完成后，将容器中最后一个子节点移动到最前面，使其成为第一个子节点
    container.insertBefore(oldEndVNode.el, oldStartVNode.el)
    // 更新索引，指向下一个位置
    oldEndVNode = prevChildren[--oldEndIdx]
    newStartVNode = nextChildren[++newStartIdx]
  }
}
</code></pre><p>在这一步的更新中，真实 DOM 的顺序是有变化的，<code>li-a</code> 节点对应的真实 DOM 被移到了 <code>li-b</code> 节点对应真实 DOM 的后面，同时由于位置索引也在相应的移动，所以在这一轮更新之后，现在的结果看上去应该如下图所示：</p><p><img src="`+w+`" alt=""></p><p>现在 <code>oldStartIdx</code> 和 <code>oldEndIdx</code> 指向了同一个位置，即旧 <code>children</code> 中的 <code>li-b</code> 节点。同样的 <code>newStartIdx</code> 和 <code>newEndIdx</code> 也指向了同样的位置，即新 <code>children</code> 中的 <code>li-b</code>。由于此时仍然满足循环条件，所以会继续下一轮的比对：</p><ul><li>第一步：拿旧 <code>children</code> 中的 <code>li-b</code> 和新 <code>children</code> 中的 <code>li-b</code> 进行比对，二者拥有相同的 <code>key</code>，可复用。</li></ul><p>此时，在第一步的时候就已经找到了可复用的节点，满足的条件是：<strong>oldStartVNode.key === newStartVNode.key</strong> ，但是由于该节点无论是在新 <code>children</code> 中还是旧 <code>children</code> 中，都是“第一个”节点，所以位置不需要变化，即不需要移动操作，只需要调用 <code>patch</code> 函数更新即可，同时也要将相应的位置所以下移一位，如下高亮代码所示：</p><pre><code>while (oldStartIdx &lt;= oldEndIdx &amp;&amp; newStartIdx &lt;= newEndIdx) {
  if (oldStartVNode.key === newStartVNode.key) {
    // 步骤一：oldStartVNode 和 newStartVNode 比对

    // 调用 patch 函数更新
    patch(oldStartVNode, newStartVNode, container)
    // 更新索引，指向下一个位置
    oldStartVNode = prevChildren[++oldStartIdx]
    newStartVNode = nextChildren[++newStartIdx]
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 省略...
  }
}
</code></pre><p>在这一轮更新完成之后，虽然没有进行任何移动操作，但是我们发现，真实 DOM 的顺序，已经与新 <code>children</code> 中节点的顺序保持一致了，也就是说我们圆满的完成了目标，如下图所示：</p><p><img src="`+k+'" alt=""></p><p>另外，观察上图可以发现，此时 <code>oldStartIdx</code> 和 <code>newStartIdx</code> 分别比 <code>oldEndIdx</code> 和 <code>newEndIdx</code> 要大，所以这将是最后一轮的比对，循环将终止，以上就是双端比较的核心原理。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/xvmqn58jqw" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/xvmqn58jqw</a><a href="https://codesandbox.io/s/xvmqn58jqw" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="双端比较的优势" tabindex="-1"><a class="header-anchor" href="#双端比较的优势"><span>双端比较的优势</span></a></h3><p>理解了双端比较的原理之后，我们来看一下双端比较所带来的优势，还是拿之前的例子，如下：</p><p><img src="'+o+'" alt=""></p><p>前面分析过，如果采用 <code>React</code> 的方式来对上例进行更新，则会执行两次移动操作，首先会把 <code>li-a</code> 节点对应的真实 DOM 移动到 <code>li-c</code> 节点对应的真实 DOM 的后面，接着再把 <code>li-b</code> 节点所对应的真实 DOM 移动到 <code>li-a</code> 节点所对应真实 DOM 的后面，即：</p><p><img src="'+e+'" alt=""></p><p>接下来我们采用双端比较的方式，来完成上例的更新，看看会有什么不同，如下图所示：</p><p><img src="'+u+'" alt=""></p><p>我们按照双端比较的思路开始第一轮比较，按步骤执行：</p><ul><li>第一步：拿旧 <code>children</code> 中的 <code>li-a</code> 和新 <code>children</code> 中的 <code>li-c</code> 进行比对，由于二者 <code>key</code> 值不同，所以不可复用，什么都不做。</li><li>第二步：拿旧 <code>children</code> 中的 <code>li-c</code> 和新 <code>children</code> 中的 <code>li-b</code> 进行比对，不可复用，什么都不做。</li><li>第三步：拿旧 <code>children</code> 中的 <code>li-a</code> 和新 <code>children</code> 中的 <code>li-b</code> 进行比对，不可复用，什么都不做。</li><li>第四步：拿旧 <code>children</code> 中的 <code>li-c</code> 和新 <code>children</code> 中的 <code>li-c</code> 进行比对，此时，两个节点拥有相同的 <code>key</code> 值，可复用。</li></ul><p>到了第四步，对于 <code>li-c</code> 节点来说，它原本是整个 <code>children</code> 的最后一个子节点，但是现在变成了新 <code>children</code> 的第一个子节点，按照上端比较的算法逻辑，此时会把 <code>li-c</code> 节点所对应的真实 DOM 移动到 <code>li-a</code> 节点所对应真实 DOM 的前面，即：</p><p><img src="'+h+'" alt=""></p><p>可以看到，我们只通过一次 DOM 移动，就使得真实 DOM 的顺序与新 <code>children</code> 中节点的顺序一致，完成了更新。换句话说，双端比较在移动 DOM 方面更具有普适性，不会因为 DOM 结构的差异而产生影响。</p><h3 id="非理想情况的处理方式" tabindex="-1"><a class="header-anchor" href="#非理想情况的处理方式"><span>非理想情况的处理方式</span></a></h3><p>在之前的讲解中，我们所采用的是较理想的例子，换句话说，在每一轮的比对过程中，总会满足四个步骤中的一步，但实际上大多数情况下并不会这么理想，如下图所示：</p><p><img src="'+m+`" alt=""></p><p>上图中 ①、②、③、④ 这四步中的每一步比对，都无法找到可复用的节点，这时应该怎么办呢？没办法，我们只能拿新 <code>children</code> 中的第一个节点尝试去旧 <code>children</code> 中寻找，试图找到拥有相同 <code>key</code> 值的节点，如下高亮代码所示：</p><pre><code>while (oldStartIdx &lt;= oldEndIdx &amp;&amp; newStartIdx &lt;= newEndIdx) {
  if (oldStartVNode.key === newStartVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 省略...
  } else {
    // 遍历旧 children，试图寻找与 newStartVNode 拥有相同 key 值的元素
    const idxInOld = prevChildren.findIndex(
      node =&gt; node.key === newStartVNode.key
    )
  }
}
</code></pre><p>这段代码增加了 <code>else</code> 分支，用来处理在四个步骤的比对中都没有成功的情况，我们遍历了旧的 <code>children</code>，并试图找到与新 <code>children</code> 中第一个节点拥有相同 <code>key</code> 值的节点，并把该节点在旧 <code>children</code> 中的位置索引记录下来，存储到 <code>idxInOld</code> 常量中。这里的关键点并不在于我们找到了位置索引，而是要明白**在旧的 <code>children</code> 中找到了与新 <code>children</code> 中第一个节点拥有相同 <code>key</code> 值的节点，意味着什么？**这意味着：<strong>旧<code>children</code> 中的这个节点所对应的真实 DOM 在新 <code>children</code> 的顺序中，已经变成了第一个节点</strong>。所以我们需要把该节点所对应的真实 DOM 移动到最前头，如下图所示：</p><p><img src="`+V+`" alt=""></p><p>可以用如下高亮的代码来实现这个过程：</p><pre><code>while (oldStartIdx &lt;= oldEndIdx &amp;&amp; newStartIdx &lt;= newEndIdx) {
  if (oldStartVNode.key === newStartVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 省略...
  } else {
    // 遍历旧 children，试图寻找与 newStartVNode 拥有相同 key 值的元素
    const idxInOld = prevChildren.findIndex(
      node =&gt; node.key === newStartVNode.key
    )
    if (idxInOld &gt;= 0) {
      // vnodeToMove 就是在旧 children 中找到的节点，该节点所对应的真实 DOM 应该被移动到最前面
      const vnodeToMove = prevChildren[idxInOld]
      // 调用 patch 函数完成更新
      patch(vnodeToMove, newStartVNode, container)
      // 把 vnodeToMove.el 移动到最前面，即 oldStartVNode.el 的前面
      container.insertBefore(vnodeToMove.el, oldStartVNode.el)
      // 由于旧 children 中该位置的节点所对应的真实 DOM 已经被移动，所以将其设置为 undefined
      prevChildren[idxInOld] = undefined
    }
    // 将 newStartIdx 下移一位
    newStartVNode = nextChildren[++newStartIdx]
  }
}
</code></pre><p>如果 <code>idxInOld</code> 存在，说明我们在旧 <code>children</code> 中找到了相应的节点，于是我们拿到该节点，将其赋值给 <code>vnodeToMove</code> 常量，意味着该节点是需要被移动的节点，同时调用 <code>patch</code> 函数完成更新，接着将该节点所对应的真实 DOM 移动到最前面，也就是 <code>oldStartVNode.el</code> 前面，由于该节点所对应的真实 DOM 已经被移动，所以我们将该节点置为 <code>undefined</code>，这是很关键的一步，最后我们将 <code>newStartIdx</code> 下移一位，准备进行下一轮的比较。我们用一张图来描述这个过程结束之后的状态：</p><p><img src="`+N+`" alt=""></p><p>这里大家需要注意，由上图可知，由于原本旧 <code>children</code> 中的 <code>li-b</code> 节点，此时已经变成了 <code>undefined</code>，所以在后续的比对过程中 <code>oldStartIdx</code> 或 <code>oldEndIdx</code> 二者当中总会有一个位置索引优先达到这个位置，也就是说此时 <code>oldStartVNode</code> 或 <code>oldEndVNode</code> 两者之一可能是 <code>undefined</code>，这说明该位置的元素在之前的比对中被移动到别的位置了，所以不再需要处理该位置的节点，这时我们需要跳过这一位置，所以我们需要增加如下高亮代码来完善我们的算法：</p><pre><code>while (oldStartIdx &lt;= oldEndIdx &amp;&amp; newStartIdx &lt;= newEndIdx) {
  if (!oldStartVNode) {
    oldStartVNode = prevChildren[++oldStartIdx]
  } else if (!oldEndVNode) {
    oldEndVNode = prevChildren[--oldEndIdx]
  } else if (oldStartVNode.key === newStartVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 省略...
  } else {
    const idxInOld = prevChildren.findIndex(
      node =&gt; node.key === newStartVNode.key
    )
    if (idxInOld &gt;= 0) {
      const vnodeToMove = prevChildren[idxInOld]
      patch(vnodeToMove, newStartVNode, container)
      prevChildren[idxInOld] = undefined
      container.insertBefore(vnodeToMove.el, oldStartVNode.el)
    }
    newStartVNode = nextChildren[++newStartIdx]
  }
}
</code></pre><p>当 <code>oldStartVNode</code> 或 <code>oldEndVNode</code> 不存在时，说明该节点已经被移动了，我们只需要跳过该位置即可。以上就是我们所说的双端比较的非理想情况的处理方式。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/vjp265qxnl" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/vjp265qxnl</a><a href="https://codesandbox.io/s/vjp265qxnl" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="添加新元素" tabindex="-1"><a class="header-anchor" href="#添加新元素"><span>添加新元素</span></a></h3><p>在上一小节中，我们尝试拿着新 <code>children</code> 中的第一个节点去旧 <code>children</code> 中寻找与之拥有相同 <code>key</code> 值的可复用节点，然后并非总是能够找得到，当新的 <code>children</code> 中拥有全新的节点时，就会出现找不到的情况，如下图所示：</p><p><img src="`+b+`" alt=""></p><p>在新 <code>children</code> 中，节点 <code>li-d</code> 是一个全新的节点。在这个例子中 ①、②、③、④ 这四步的比对仍然无法找到可复用节点，所以我们会尝试拿着新 <code>children</code> 中的 <code>li-d</code> 节点去旧的 <code>children</code> 寻找与之拥有相同 <code>key</code> 值的节点，结果很显然，我们无法找到这样的节点。这时说明该节点是一个全新的节点，我们应该将其挂载到容器中，不过应该将其挂载到哪里呢？稍作分析即可得出结论，由于 <code>li-d</code> 节点的位置索引是 <code>newStartIdx</code>，这说明 <code>li-d</code> 节点是当前这一轮比较中的“第一个”节点，所以只要把它挂载到位于 <code>oldStartIdx</code> 位置的节点所对应的真实 DOM 前面就可以了，即 <code>oldStartVNode.el</code>，我们只需要增加一行代码即可实现该功能：</p><pre><code>while (oldStartIdx &lt;= oldEndIdx &amp;&amp; newStartIdx &lt;= newEndIdx) {
  if (!oldStartVNode) {
    oldStartVNode = prevChildren[++oldStartIdx]
  } else if (!oldEndVNode) {
    oldEndVNode = prevChildren[--oldEndIdx]
  } else if (oldStartVNode.key === newStartVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 省略...
  } else {
    const idxInOld = prevChildren.findIndex(
      node =&gt; node.key === newStartVNode.key
    )
    if (idxInOld &gt;= 0) {
      const vnodeToMove = prevChildren[idxInOld]
      patch(vnodeToMove, newStartVNode, container)
      prevChildren[idxInOld] = undefined
      container.insertBefore(vnodeToMove.el, oldStartVNode.el)
    } else {
      // 使用 mount 函数挂载新节点
      mount(newStartVNode, container, false, oldStartVNode.el)
    }
    newStartVNode = nextChildren[++newStartIdx]
  }
}
</code></pre><p>如上高亮代码所示，如果条件 <code>idxInOld &gt;= 0</code> 不成立，则说明 <code>newStartVNode</code> 是一个全新的节点，我们添加了 <code>else</code> 语句块用来处理全新的节点，在 <code>else</code> 语句块内调用 <code>mount</code> 函数挂载该全新的节点，根据上面的分析，我们只需要把该节点挂载到 <code>oldStartVNode.el</code> 之前即可，所以我们传递给 <code>mount</code> 函数的第四个参数就是 <code>oldStartVNode.el</code>。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/n7y46ojv4m" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/n7y46ojv4m</a><a href="https://codesandbox.io/s/n7y46ojv4m" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>但这么做真的就完美了吗？不是的，来看下面这个例子，我们更换新 <code>children</code> 中节点的顺序，如下图所示：</p><p><img src="`+x+'" alt=""></p><p>与之前的案例不同，在之前的案例中新 <code>children</code> 中节点的顺序为 <code>li-d</code>、<code>li-a</code>、<code>li-c</code> 最后是 <code>li-b</code>，我们观察上图可以发现，本例中新 <code>children</code> 的节点顺序为 <code>li-d</code>、<code>li-a</code>、<code>li-b</code> 最后是 <code>li-c</code>，那么顺序的不同会对结果产生影响吗？想弄明白这个问题很简单，我们只需要按照双端比较算法的思路来模拟执行一次即可得出结论：</p><ul><li>第一步：拿旧 <code>children</code> 中的 <code>li-a</code> 和新 <code>children</code> 中的 <code>li-d</code> 进行比对，由于二者 <code>key</code> 值不同，所以不可复用，什么都不做。</li><li>第二步：拿旧 <code>children</code> 中的 <code>li-c</code> 和新 <code>children</code> 中的 <code>li-c</code> 进行比对，此时，二者拥有相同的 <code>key</code> 值。</li></ul><p>在第二步中找到了可复用节点，接着使用 <code>patch</code> 函数对该节点进行更新，同时将相应的位置索引下移一位，如下图所示：</p><p><img src="'+E+'" alt=""></p><p>接着，开始下一轮的比较，重新从第一步开始。结果和上一轮相似，同样在第二步中找到可复用的节点，所以在在这一轮的更新完成之后，其状态如下图所示：</p><p><img src="'+g+'" alt=""></p><p>由上图可知，此时的 <code>oldStartIdx</code> 与 <code>oldEndIdx</code> 已经重合，它们的值都是 <code>0</code>，但是此时仍然满足循环条件，所以比对不会停止，会继续下一轮的比较。在新的一轮比较中，仍然会在第二步找到可复用的节点，所以在这一轮更新完成之后 <code>oldEndIdx</code> 将比 <code>oldStartIdx</code> 的值要小，如下图所示：</p><p><img src="'+S+`" alt=""></p><p>此时 <code>oldEndIdx</code> 的值将变成 <code>-1</code>，它要小于 <code>oldStartIdx</code> 的值，这时循环的条件不在满足，意味着更新完成。然而通过上图可以很容易的发现 <code>li-d</code> 节点被遗漏了，它没有得到任何的处理，通过这个案例我们意识到了之前的算法是存在缺陷的，为了弥补这个缺陷，我们需要在循环终止之后，对 <code>oldEndIdx</code> 和 <code>oldStartIdx</code> 的值进行检查，如果在循环结束之后 <code>oldEndIdx</code> 的值小于 <code>oldStartIdx</code> 的值则说明新的 <code>children</code> 中存在<strong>还没有被处理的全新节点</strong> ，这时我们应该调用 <code>mount</code> 函数将其挂载到容器元素中，观察上图可知，我们只需要把这些全新的节点添加到 <code>oldStartIdx</code> 索引所指向的节点之前即可，如下高亮代码所示：</p><pre><code>while (oldStartIdx &lt;= oldEndIdx &amp;&amp; newStartIdx &lt;= newEndIdx) {
  // 省略...
}
if (oldEndIdx &lt; oldStartIdx) {
  // 添加新节点
  for (let i = newStartIdx; i &lt;= newEndIdx; i++) {
    mount(nextChildren[i], container, false, oldStartVNode.el)
  }
}
</code></pre><p>我们在循环结束之后，立即判断 <code>oldEndIdx</code> 的值是否小于 <code>oldStartIdx</code> 的值，如果条件成立，则需要使用 <code>for</code> 循环把所有位于 <code>newStartIdx</code> 到 <code>newEndIdx</code> 之间的元素都当做全新的节点添加到容器元素中，这样我们就完整的实现了完整的添加新节点的功能。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/ryryx6n42m" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/ryryx6n42m</a><a href="https://codesandbox.io/s/ryryx6n42m" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="移除不存在的元素" tabindex="-1"><a class="header-anchor" href="#移除不存在的元素"><span>移除不存在的元素</span></a></h3><p>对于双端比较，最后一个需要考虑的情况是：当有元素被移除时的情况，如下图所示：</p><p><img src="`+f+'" alt=""></p><p>观察上图可以发现，在新 <code>children</code> 中 <code>li-b</code> 节点已经不存在了，所以完整的更新过程应该包含：<strong>移除已不存在节点所对应真实 DOM 的功能</strong> 。为了找到哪些节点需要移除，我们首先还是按照双端比较的算法步骤模拟执行一下即可：</p><ul><li>第一步：拿旧 <code>children</code> 中的 <code>li-a</code> 和新 <code>children</code> 中的 <code>li-a</code> 进行比对，此时，二者拥有相同的 <code>key</code> 值。</li></ul><p>在第一轮的第一步比对中，我们就找到了可复用节点，所以此时会调用 <code>patch</code> 函数更新该节点，并更新相应的索引值，可以用下图表示这一轮更新完成之后算法所处的状态：</p><p><img src="'+v+'" alt=""></p><p>这时 <code>newStartIdx</code> 和 <code>newEndIdx</code> 的值相等，都是 <code>1</code>，不过循环的条件仍然满足，所以会立即进行下一轮比较：</p><ul><li>第一步：拿旧 <code>children</code> 中的 <code>li-b</code> 和新 <code>children</code> 中的 <code>li-c</code> 进行比对，由于二者 <code>key</code> 值不同，所以不可复用，什么都不做。</li><li>第二步：拿旧 <code>children</code> 中的 <code>li-c</code> 和新 <code>children</code> 中的 <code>li-c</code> 进行比对，此时，二者拥有相同的 <code>key</code> 值。</li></ul><p>在第二步的比对中找到了可复用节点 <code>li-c</code>，接着更新该节点，并将 <code>oldEndIdx</code> 和 <code>newEndIdx</code> 分别前移一位，最终结果如下：</p><p><img src="'+y+`" alt=""></p><p>由于此时 <code>newEndIdx</code> 的值小于 <code>newStartIdx</code> 的值，所以循环将终止，但是通过上图可以发现，旧 <code>children</code> 中的 <code>li-b</code> 节点没有得到被处理的机会，我们应该将其移除才行，然后本次循环结束之后并不满足条件 <code>oldEndIdx &lt; oldStartIdx</code> 而是满足条件 <code>newEndIdx &lt; newStartIdx</code>，基于此，我们可以认为<strong>循环结束后，一旦满足条件<code>newEndIdx &lt; newStartIdx</code> 则说明有元素需要被移除</strong>。我们增加如下代码来实现该功能：</p><pre><code>while (oldStartIdx &lt;= oldEndIdx &amp;&amp; newStartIdx &lt;= newEndIdx) {
  // 省略...
}
if (oldEndIdx &lt; oldStartIdx) {
  // 添加新节点
  for (let i = newStartIdx; i &lt;= newEndIdx; i++) {
    mount(nextChildren[i], container, false, oldStartVNode.el)
  }
} else if (newEndIdx &lt; newStartIdx) {
  // 移除操作
  for (let i = oldStartIdx; i &lt;= oldEndIdx; i++) {
    container.removeChild(prevChildren[i].el)
  }
}
</code></pre><p>如上高亮代码所示，增加 <code>else...if</code> 语句块，用来处理当 <code>newEndIdx &lt; newStartIdx</code> 时的情况，我们同样开启一个 <code>for</code> 循环，把所有位于 <code>oldStartIdx</code> 和 <code>oldEndIdx</code> 之间的节点所对应的真实 DOM 全部移除即可。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/9jnvjj1mko" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/9jnvjj1mko</a><a href="https://codesandbox.io/s/9jnvjj1mko" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><p>以上就是相对完整的双端比较算法的实现，这是 <code>Vue2</code> 所采用的算法，借鉴于开源项目：<a href="https://github.com/snabbdom/snabbdom" target="_blank" rel="noopener noreferrer">snabbdom (opens new window)</a>，但最早采用双端比较算法的库是 <a href="https://github.com/joelrich/citojs" target="_blank" rel="noopener noreferrer">citojs (opens new window)</a>。</p>`,118),M=[O];function C(D,j){return t(),a("div",null,M)}const F=n(I,[["render",C],["__file","03-另一个思路-双端比较.html.vue"]]),q=JSON.parse('{"path":"/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%20Diff%20%E7%AE%97%E6%B3%95/03-%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%80%9D%E8%B7%AF-%E5%8F%8C%E7%AB%AF%E6%AF%94%E8%BE%83.html","title":"另一个思路 双端比较","lang":"zh-CN","frontmatter":{"title":"另一个思路 双端比较","description":"另一个思路 - 双端比较 双端比较的原理 双端比较:新旧 children 各设头尾两个指针,一轮最多做头头、尾尾、头尾、尾头四次比较,命中即复用并向中间收拢 刚刚提到了 React 的 Diff 算法是存在优化空间的，想要要找到优化的关键点，我们首先要知道它存在什么问题。来看下图： 在这个例子中，我们可以通过肉眼观察从而得知最优的解决方案应该是：把l...","head":[["meta",{"property":"og:url","content":"https://interview.leeguoo.com/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%20Diff%20%E7%AE%97%E6%B3%95/03-%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%80%9D%E8%B7%AF-%E5%8F%8C%E7%AB%AF%E6%AF%94%E8%BE%83.html"}],["meta",{"property":"og:site_name","content":"前端面试题集锦"}],["meta",{"property":"og:title","content":"另一个思路 双端比较"}],["meta",{"property":"og:description","content":"另一个思路 - 双端比较 双端比较的原理 双端比较:新旧 children 各设头尾两个指针,一轮最多做头头、尾尾、头尾、尾头四次比较,命中即复用并向中间收拢 刚刚提到了 React 的 Diff 算法是存在优化空间的，想要要找到优化的关键点，我们首先要知道它存在什么问题。来看下图： 在这个例子中，我们可以通过肉眼观察从而得知最优的解决方案应该是：把l..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://interview.leeguoo.com/images/diagrams/vue-diff.webp"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-07-06T04:15:51.000Z"}],["meta",{"property":"article:modified_time","content":"2026-07-06T04:15:51.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"另一个思路 双端比较\\",\\"image\\":[\\"https://interview.leeguoo.com/images/diagrams/vue-diff.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_242541513654fb21.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_9d3f42cbb025eedf.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_5d6d3836641bc1a6.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_a76e19b385e0bb88.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_777fbf4df88821ac.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_0d30dad1934f9ce7.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_533db5e57c1ed0c9.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_5350d50f9328eedc.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_9285a505a83eb719.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_9e57680a134bdaa0.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_9d3f42cbb025eedf.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_0ba7c12f50e26c0d.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_dbf60539b42d2d68.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_4756ae61c44e317b.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_eec6b6621fdbe3fe.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_72b22a35eb649f11.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_cf4b71dc23f86079.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_bb19b23fd5e2f01e.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_27d49216f446a731.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_575d12760b7a214f.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_df0e288269753200.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_2ed47ccfa8f1d761.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_84170a714397cccf.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_951e167b611e2bbd.webp\\"],\\"dateModified\\":\\"2026-07-06T04:15:51.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":3,"title":"双端比较的原理","slug":"双端比较的原理","link":"#双端比较的原理","children":[]},{"level":3,"title":"双端比较的优势","slug":"双端比较的优势","link":"#双端比较的优势","children":[]},{"level":3,"title":"非理想情况的处理方式","slug":"非理想情况的处理方式","link":"#非理想情况的处理方式","children":[]},{"level":3,"title":"添加新元素","slug":"添加新元素","link":"#添加新元素","children":[]},{"level":3,"title":"移除不存在的元素","slug":"移除不存在的元素","link":"#移除不存在的元素","children":[]}],"git":{"updatedTime":1783311351000,"contributors":[{"name":"leeguooooo","email":"guoli@zhihu.com","commits":3}]},"autoDesc":true,"filePathRelative":"Vue-渲染器的核心 Diff 算法/03-另一个思路-双端比较.md","excerpt":"\\n<h3>双端比较的原理</h3>\\n<p><img src=\\"/images/diagrams/vue-diff.webp\\" alt=\\"双端比较:新旧 children 各设头尾两个指针,一轮最多做头头、尾尾、头尾、尾头四次比较,命中即复用并向中间收拢\\"></p>\\n<p>刚刚提到了 <code>React</code> 的 <code>Diff</code> 算法是存在优化空间的，想要要找到优化的关键点，我们首先要知道它存在什么问题。来看下图：</p>\\n<p><img src=\\"/images/s_poetries_work_uploads_2024_02_242541513654fb21.webp\\" alt=\\"\\"></p>"}');export{F as comp,q as data};
