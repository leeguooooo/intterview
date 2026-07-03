import{_ as n,c as s,o as a,a as o}from"./app-C51XJ4NN.js";const c="/images/s_poetries_work_uploads_2024_02_43852502ee805c67.webp",p="/images/s_poetries_work_uploads_2024_02_98ff5648c1f88aa0.webp",t="/images/s_poetries_work_uploads_2024_02_c305b75701e656bd.webp",d="/images/s_poetries_work_uploads_2024_02_34db6465517e137d.webp",l="/images/s_poetries_work_uploads_2024_02_551f06d3ef7d406c.webp",i="/images/s_poetries_work_uploads_2024_02_259e38c163a108f3.webp",r="/images/s_poetries_work_uploads_2024_02_bf0d01d8591785d5.webp",u="/images/s_poetries_work_uploads_2024_02_72ad5e212e91dd09.webp",k="/images/s_poetries_work_uploads_2024_02_e84d15488ca03103.webp",m="/images/s_poetries_work_uploads_2024_02_bd15caf79547be3b.webp",v="/images/s_poetries_work_uploads_2024_02_1769ec0ba9b839e8.webp",_="/images/s_poetries_work_uploads_2024_02_cca8bd2f87113572.webp",e="/images/s_poetries_work_uploads_2024_02_8357c1d08b890091.webp",b="/images/s_poetries_work_uploads_2024_02_0247ef85f7193595.webp",g="/images/s_poetries_work_uploads_2024_02_ad107acffec84302.webp",h="/images/s_poetries_work_uploads_2024_02_c76f51298d38eddc.webp",f="/images/s_poetries_work_uploads_2024_02_4c6368adfcffef30.webp",w="/images/s_poetries_work_uploads_2024_02_c85dd5b64334f95a.webp",x="/images/s_poetries_work_uploads_2024_02_1671dc4db3f0b758.webp",j="/images/s_poetries_work_uploads_2024_02_b15c88e922459f70.webp",y="/images/s_poetries_work_uploads_2024_02_b51e0457a2138c06.webp",E="/images/s_poetries_work_uploads_2024_02_ab459ef95b43afe5.webp",V="/images/s_poetries_work_uploads_2024_02_31c22d597b0f4086.webp",N="/images/s_poetries_work_uploads_2024_02_fdf441cff77e4b4e.webp",D="/images/s_poetries_work_uploads_2024_02_26b78b7de0b4667b.webp",C="/images/s_poetries_work_uploads_2024_02_a59d5b0f5089a1f8.webp",S="/images/s_poetries_work_uploads_2024_02_79ed601ba3ddbc27.webp",P="/images/s_poetries_work_uploads_2024_02_5c1b30cad22a4350.webp",q="/images/s_poetries_work_uploads_2024_02_a63d7f35a6dab937.webp",I={},A=o('<h1 id="inferno-所采用的核心-diff-算法及原理" tabindex="-1"><a class="header-anchor" href="#inferno-所采用的核心-diff-算法及原理"><span>inferno 所采用的核心 Diff 算法及原理</span></a></h1><p>在 <code>Vue3</code> 中将采用另外一种核心 <code>Diff</code> 算法，它借鉴于 <a href="https://github.com/localvoid/ivi" target="_blank" rel="noopener noreferrer">ivi (opens new window)</a> 和 <a href="https://github.com/infernojs/inferno" target="_blank" rel="noopener noreferrer">inferno (opens new window)</a>，看下图：</p><p><img src="'+c+`" alt=""></p><p>这张图来自 [js-framework-benchmark (opens new window)](https://krausest.github.io/js-framework- benchmark/current.html)，从上图中可以看到，在 DOM 操作的各个方面，<code>ivi</code> 和 <code>inferno</code> 都要稍优于 <code>vue2</code> 的双端比较。但总体上的性能表现并不是单纯的由核心 <code>Diff</code> 算法来决定的，我们在前面章节的讲解中已经了解到的了一些优化手段，例如<strong>在创建<code>VNode</code> 时就确定其类型，以及在 <code>mount/patch</code> 的过程中采用位运算来判断一个 <code>VNode</code> 的类型</strong>，在这个基础之上再配合核心的 <code>Diff</code> 算法，才使得性能上产生一定的优势，这也是 <code>Vue3</code> 接纳这种算法的原因之一，本节我们就着重讨论该核心 <code>Diff</code> 算法的实现原理。</p><h3 id="相同的前置和后置元素" tabindex="-1"><a class="header-anchor" href="#相同的前置和后置元素"><span>相同的前置和后置元素</span></a></h3><p>实际上本节介绍的 <code>Diff</code> 算法最早应用于两个不同文本之间的差异比较，在文本 <code>Diff</code> 中，真正进行核心的 <code>Diff</code> 算法之前，会有一个预处理的过程，例如可以先对两个文本进行“相等”比较：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>text1 <span class="token operator">===</span> text2<span class="token punctuation">)</span> <span class="token keyword">return</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>如果两个文本相等，则无需进行真正的 <code>Diff</code>，预处理的好处之一就是<strong>在某些情况下能够避免<code>Diff</code> 算法的执行</strong>，还有比这更加高效的方式吗？当然，这是一个简单的情形，除此之外，在文本的 <code>Diff</code> 中还有其他的预处理过程，其中就包含：去除<strong>相同的前缀和后缀</strong> 。什么意思呢？假设我们有如下两个文本：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token constant">TEXT1</span><span class="token operator">:</span> <span class="token constant">I</span> use vue <span class="token keyword">for</span> app development</span>
<span class="line">    <span class="token literal-property property">text2</span><span class="token operator">:</span> <span class="token constant">I</span> use react <span class="token keyword">for</span> app development</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>我们通过肉眼可以很容易的发现，这两段文本头部和尾部分别有一段相同的文本：</p><p><img src="`+p+`" alt=""></p><p>所以真正需要进行 <code>Diff</code> 的部分就变成了：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token literal-property property">text1</span><span class="token operator">:</span> vue</span>
<span class="line">    <span class="token literal-property property">text2</span><span class="token operator">:</span> react</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>这么做的好处是：在某些情况下，我们能够轻松的判断出单独的文本插入和删除，例如下面的例子：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token literal-property property">text1</span><span class="token operator">:</span> <span class="token constant">I</span> like you</span>
<span class="line">    <span class="token literal-property property">text2</span><span class="token operator">:</span> <span class="token constant">I</span> like you too</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>这两个文本在经过去除相同的前缀和后缀之后将变成：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token literal-property property">text1</span><span class="token operator">:</span></span>
<span class="line">    <span class="token literal-property property">text2</span><span class="token operator">:</span> too</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>所以当预处理结束之后，如果 <code>text1</code> 为空且 <code>text2</code> 不为空，则可以认为这是一个文本插入，相反的，如果将这两个文本互换位置就是一个文本删除的案例：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token literal-property property">text1</span><span class="token operator">:</span> <span class="token constant">I</span> like you too</span>
<span class="line">    <span class="token literal-property property">text2</span><span class="token operator">:</span> <span class="token constant">I</span> like you</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>则经过预处理之后将变成：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token literal-property property">text1</span><span class="token operator">:</span> too</span>
<span class="line">    <span class="token literal-property property">text2</span><span class="token operator">:</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>这代表文本被删除。</p><p>很显然，该预处理过程在上例的情况下能够避免 <code>Diff</code> 算法的执行，从而提高 <code>Diff</code> 效率。当然，换一个角度来看的话，这本身也是 <code>Diff</code> 策略的一部分，不过这显然要更高效。所以我们能否将此预处理步骤应用到 <code>VNode</code> 的 <code>Diff</code> 中呢？当然可以，来看下面的例子：</p><p><img src="`+t+`" alt=""></p><p>如上图所示，新旧 <code>children</code> 拥有相同的前缀节点和后缀节点，对于前缀节点，我们可以建立一个索引，指向新旧 <code>children</code> 中的第一个节点，并逐步向后遍历，直到遇到两个拥有不同 <code>key</code> 值的节点为止，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 更新相同的前缀节点</span></span>
<span class="line">    <span class="token comment">// j 为指向新旧 children 中第一个节点的索引</span></span>
<span class="line">    <span class="token keyword">let</span> j <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">    <span class="token keyword">let</span> prevVNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>j<span class="token punctuation">]</span></span>
<span class="line">    <span class="token keyword">let</span> nextVNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>j<span class="token punctuation">]</span></span>
<span class="line">    <span class="token comment">// while 循环向后遍历，直到遇到拥有不同 key 值的节点为止</span></span>
<span class="line">    <span class="token keyword">while</span> <span class="token punctuation">(</span>prevVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> nextVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 调用 patch 函数更新</span></span>
<span class="line">      <span class="token function">patch</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      j<span class="token operator">++</span></span>
<span class="line">      prevVNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>j<span class="token punctuation">]</span></span>
<span class="line">      nextVNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>j<span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以用下图描述这一步操作完成之后的状态：</p><p><img src="`+d+`" alt=""></p><p>这里大家需要注意的是，当 <code>while</code> 循环终止时，索引 <code>j</code> 的值为 <code>1</code>。接着，我们需要处理的是相同的后缀节点，由于新旧 <code>children</code> 中节点的数量可能不同，所以我们需要两个索引分别指向新旧 <code>children</code> 的最后一个节点，并逐步向前遍历，直到遇到两个拥有不同 <code>key</code> 值的节点为止，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 更新相同的后缀节点</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 指向旧 children 最后一个节点的索引</span></span>
<span class="line">    <span class="token keyword">let</span> prevEnd <span class="token operator">=</span> prevChildren<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span></span>
<span class="line">    <span class="token comment">// 指向新 children 最后一个节点的索引</span></span>
<span class="line">    <span class="token keyword">let</span> nextEnd <span class="token operator">=</span> nextChildren<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span></span>
<span class="line">    </span>
<span class="line">    prevVNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>prevEnd<span class="token punctuation">]</span></span>
<span class="line">    nextVNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>nextEnd<span class="token punctuation">]</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// while 循环向前遍历，直到遇到拥有不同 key 值的节点为止</span></span>
<span class="line">    <span class="token keyword">while</span> <span class="token punctuation">(</span>prevVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> nextVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 调用 patch 函数更新</span></span>
<span class="line">      <span class="token function">patch</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">      prevEnd<span class="token operator">--</span></span>
<span class="line">      nextEnd<span class="token operator">--</span></span>
<span class="line">      prevVNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>prevEnd<span class="token punctuation">]</span></span>
<span class="line">      nextVNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>nextEnd<span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以用下图来表示这一步更新完成之后的状态：</p><p><img src="`+l+`" alt=""></p><p>同样需要注意的是，在这一步更新完成之后 <code>prevEnd</code> 的值为 <code>0</code>，<code>nextEnd</code> 的值为 <code>1</code>。实际上三个索引 <code>j</code>、<code>prevEnd</code> 和 <code>nextEnd</code> 的值至关重要，它们之间的大小关系反映了新旧 <code>children</code> 的节点状况。前面我们在讲解文本 <code>Diff</code> 的时候曾说过，当“去掉”相同的前缀和后缀之后，如果旧文本为空，且新文本不为空，则说明有新的文本内容被添加，反之则说明有旧的文本被移除。现在三个索引的值如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token literal-property property">j</span><span class="token operator">:</span> <span class="token number">1</span></span>
<span class="line">    <span class="token literal-property property">prevEnd</span><span class="token operator">:</span> <span class="token number">0</span></span>
<span class="line">    <span class="token literal-property property">nextEnd</span><span class="token operator">:</span> <span class="token number">1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们发现 <code>j &gt; prevEnd</code> 并且 <code>j &lt;= nextEnd</code>，这说明当新旧 <code>children</code> 中相同的前缀和后缀被更新之后，旧 <code>children</code> 中的节点已经被更新完毕了，而新 <code>children</code> 中仍然有剩余节点，通过上图可以发现，新 <code>children</code> 中的 <code>li-d</code> 节点，就是这个剩余的节点。实际上新 <code>children</code> 中位于 <code>j</code> 到 <code>nextEnd</code> 之间的所有节点都应该是新插入的节点：</p><p><img src="`+i+`" alt=""></p><p>那么应该将这些新的节点插入到什么位置呢？观察上图，从新 <code>children</code> 中的节点顺序可以发现，新的节点都出现在 <code>li-b</code> 节点的前面，所以我们可以使用一个循环遍历索引 <code>j -&gt; nextEnd</code> 之间的节点，并逐个将其插入到 <code>li-b</code> 节点之前，这样当循环结束之后，新的节点就被插入到了正确的位置。我们还能发现 <code>li-b</code> 节点的位置可以用 <code>nextEnd + 1</code> 表示，最终我们可以使用如下代码来实现节点的插入：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 满足条件，则说明从 j -&gt; nextEnd 之间的节点应作为新节点插入</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>j <span class="token operator">&gt;</span> prevEnd <span class="token operator">&amp;&amp;</span> j <span class="token operator">&lt;=</span> nextEnd<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 所有新节点应该插入到位于 nextPos 位置的节点的前面</span></span>
<span class="line">      <span class="token keyword">const</span> nextPos <span class="token operator">=</span> nextEnd <span class="token operator">+</span> <span class="token number">1</span></span>
<span class="line">      <span class="token keyword">const</span> refNode <span class="token operator">=</span></span>
<span class="line">        nextPos <span class="token operator">&lt;</span> nextChildren<span class="token punctuation">.</span>length <span class="token operator">?</span> nextChildren<span class="token punctuation">[</span>nextPos<span class="token punctuation">]</span><span class="token punctuation">.</span>el <span class="token operator">:</span> <span class="token keyword">null</span></span>
<span class="line">      <span class="token comment">// 采用 while 循环，调用 mount 函数挂载节点</span></span>
<span class="line">      <span class="token keyword">while</span> <span class="token punctuation">(</span>j <span class="token operator">&lt;=</span> nextEnd<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">mount</span><span class="token punctuation">(</span>nextChildren<span class="token punctuation">[</span>j<span class="token operator">++</span><span class="token punctuation">]</span><span class="token punctuation">,</span> container<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> refNode<span class="token punctuation">)</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再来看如下案例：</p><p><img src="`+r+`" alt=""></p><p>在这个案例中，当“去掉”相同的前缀和后缀之后，三个索引的值为：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token literal-property property">j</span><span class="token operator">:</span> <span class="token number">1</span></span>
<span class="line">    <span class="token literal-property property">prevEnd</span><span class="token operator">:</span> <span class="token number">1</span></span>
<span class="line">    <span class="token literal-property property">nextEnd</span><span class="token operator">:</span> <span class="token number">0</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时条件 <code>j &gt; nextEnd</code> 并且 <code>j &lt;= prevEnd</code> 成立，通过上图可以很容的发现，旧 <code>children</code> 中的 <code>li-b</code> 节点应该被移除，实际上更加通用的规则应该是：在旧 <code>children</code> 中有位于索引 <code>j</code> 到 <code>prevEnd</code> 之间的节点，都应该被移除。如下图所示：</p><p><img src="`+u+`" alt=""></p><p>代码实现起来也很简单，如下高亮代码所示：</p><pre><code>if (j &gt; prevEnd &amp;&amp; j &lt;= nextEnd) {
  // j -&gt; nextEnd 之间的节点应该被添加
  const nextPos = nextEnd + 1
  const refNode =
    nextPos &lt; nextChildren.length ? nextChildren[nextPos].el : null
  while (j &lt;= nextEnd) {
    mount(nextChildren[j++], container, false, refNode)
  }
} else if (j &gt; nextEnd) {
  // j -&gt; prevEnd 之间的节点应该被移除
  while (j &lt;= prevEnd) {
    container.removeChild(prevChildren[j++].el)
  }
}
</code></pre><p>现在我们来观察一下总体的代码结构：</p><pre><code>// while 循环向后遍历，直到遇到拥有不同 key 值的节点为止
while (prevVNode.key === nextVNode.key) {
  // 调用 patch 函数更新
  // 省略...
  j++
  // 省略...
}

// while 循环向前遍历，直到遇到拥有不同 key 值的节点为止
while (prevVNode.key === nextVNode.key) {
  // 调用 patch 函数更新
  // 省略...
  prevEnd--
  nextEnd--
  // 省略...
}

// 满足条件，则说明从 j -&gt; nextEnd 之间的节点应作为新节点插入
if (j &gt; prevEnd &amp;&amp; j &lt;= nextEnd) {
  // j -&gt; nextEnd 之间的节点应该被添加
  // 省略...
} else if (j &gt; nextEnd) {
  // j -&gt; prevEnd 之间的节点应该被移除
  // 省略...
}
</code></pre><p>观察如上高亮的代码，我们发现，在两个 <code>while</code> 循环中，索引 <code>j</code> 和 索引 <code>prevEnd</code>、<code>nextEnd</code> 是以“从两端向中间靠拢”的趋势在变化的，而在两个 <code>while</code> 循环结束之后，我们会根据这三个索引的大小关系来决定应该做什么样的操作。现在我们思考一个问题，假设在第一个 <code>while</code> 循环结束之后，索引 <code>j</code> 的值已经大于 <code>prevEnd</code> 或 <code>nextEnd</code>，那么还有必须执行第二个 <code>while</code> 循环吗？答案是没有必要，这是因为一旦索引 <code>j</code> 大于 <code>prevEnd</code> 则说明旧 <code>children</code> 中的所有节点都已经参与了 <code>patch</code>，类似的，如果索引 <code>j</code> 大于 <code>nextEnd</code> 则说明新 <code>children</code> 中的所有节点都已经参与了 <code>patch</code>，这时当然没有必要再执行后续的操作了。所以出于性能的考虑，我们应该避免没有必要的代码执行，为了达到目的，可以使用 <code>javascript</code> 中的 <code>label</code> 语句，如下高亮代码所示：</p><pre><code>outer: {
  while (prevVNode.key === nextVNode.key) {
    patch(prevVNode, nextVNode, container)
    j++
    if (j &gt; prevEnd || j &gt; nextEnd) {
      break outer
    }
    prevVNode = prevChildren[j]
    nextVNode = nextChildren[j]
  }
  // 更新相同的后缀节点
  prevVNode = prevChildren[prevEnd]
  nextVNode = nextChildren[nextEnd]
  while (prevVNode.key === nextVNode.key) {
    patch(prevVNode, nextVNode, container)
    prevEnd--
    nextEnd--
    if (j &gt; prevEnd || j &gt; nextEnd) {
      break outer
    }
    prevVNode = prevChildren[prevEnd]
    nextVNode = nextChildren[nextEnd]
  }
}
</code></pre><p>我们定义了 <code>label</code> 名字为 <code>outer</code> 的 <code>label</code> 语句块，并分别在两个 <code>while</code> 循环中添加了判断语句，无论在哪个循环中，只要索引 <code>j</code> 的值大于了 <code>prevEnd</code> 或 <code>nextEnd</code> 二者之一，我们就 <code>break</code> 该语句块，从而避免了无用的代码执行。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/5yo3z824vp" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/5yo3z824vp</a><a href="https://codesandbox.io/s/5yo3z824vp" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="判断是否需要进行-dom-移动" tabindex="-1"><a class="header-anchor" href="#判断是否需要进行-dom-移动"><span>判断是否需要进行 DOM 移动</span></a></h3><p>刚刚我们讲解了一个很重要的预处理思路：“去掉”相同的前置/后置节点。并且我们分析了在一些情况下这种预处理操作能够避免真正 <code>Diff</code> 算法的执行：通过判断索引的大小关系，能够提前知道哪些元素被添加，哪些元素被移除。但这毕竟属于一种特殊情况，大部分情况下可能未必如此理想，来看如下案例：</p><p><img src="`+k+'" alt=""></p><p>观察上图中新旧 <code>children</code> 中节点的顺序，我们发现，这个案例在应用预处理步骤之后，只有 <code>li-a</code> 节点和 <code>li-e</code> 节点能够被提前 <code>patch</code>。换句话说在这种情况下没有办法简单的通过预处理就能够结束 <code>Diff</code> 逻辑。这时我们就需要进行下一步操作，实际上无论是 <code>React</code> 的 <code>Diff</code> 算法，还是 <code>Vue2(snabbdom)</code> 的 <code>Diff</code> 算法，其重点无非就是：<strong>判断是否有节点需要移动，以及应该如何移动</strong> 和<strong>寻找出那些需要被添加或移除</strong> 的节点，而本节我们所讲解的算法也不例外，所以接下来的任务就是：判断那些节点需要移动，以及如何移动。</p><p>为了让事情更直观我们把该案例在应用预处理之后的状态用下图描述出来：</p><p><img src="'+m+`" alt=""></p><p>观察上图可以发现，此时索引 <code>j</code> 既不大于 <code>prevEnd</code> 也不大于 <code>nextEnd</code>，所以如下代码将得不到执行：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 满足条件，则说明从 j -&gt; nextEnd 之间的节点应作为新节点插入</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>j <span class="token operator">&gt;</span> prevEnd <span class="token operator">&amp;&amp;</span> j <span class="token operator">&lt;=</span> nextEnd<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// j -&gt; nextEnd 之间的节点应该被添加</span></span>
<span class="line">      <span class="token comment">// 省略...</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>j <span class="token operator">&gt;</span> nextEnd<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// j -&gt; prevEnd 之间的节点应该被移除</span></span>
<span class="line">      <span class="token comment">// 省略...</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们需要为这段代码添加 <code>else</code> 语句块，用来处理该案例的情况，如下高亮代码所示：</p><pre><code>// 满足条件，则说明从 j -&gt; nextEnd 之间的节点应作为新节点插入
if (j &gt; prevEnd &amp;&amp; j &lt;= nextEnd) {
  // j -&gt; nextEnd 之间的节点应该被添加
  // 省略...
} else if (j &gt; nextEnd) {
  // j -&gt; prevEnd 之间的节点应该被移除
  // 省略...
} else {
  // 在这里编写处理逻辑
}
</code></pre><p>知道了应该在哪里编写处理逻辑，那么接下来我们就讲解一下该算法的思路。首先，我们需要构造一个数组 <code>source</code>，该数组的长度等于新 <code>children</code> 在经过预处理之后剩余未处理节点的数量，并且该数组中每个元素的初始值为 <code>-1</code>，如下图所示：</p><p><img src="`+v+`" alt=""></p><p>我们可以通过如下代码完成 <code>source</code> 数组的构造：</p><pre><code>if (j &gt; prevEnd &amp;&amp; j &lt;= nextEnd) {
  // 省略...
} else if (j &gt; nextEnd) {
  // 省略...
} else {
  // 构造 source 数组
  const nextLeft = nextEnd - j + 1  // 新 children 中剩余未处理节点的数量
  const source = []
  for (let i = 0; i &lt; nextLeft; i++) {
    source.push(-1)
  }
}
</code></pre><p>那么这个数组的作用是什么呢？通过上图可以发现，该数组中的每一个元素分别与新 <code>children</code> 中剩余未处理的节点对应，实际上 <code>source</code> 数组将用来存储<strong>新<code>children</code> 中的节点在旧 <code>children</code> 中的位置，后面将会使用它计算出一个最长递增子序列，并用于 DOM 移动</strong>。如下图所示：</p><p><img src="`+_+`" alt=""></p><p>我们可以通过两层 <code>for</code> 循环来完成这个工作，外层循环用于遍历旧 <code>children</code>，内层循环用于遍历新 <code>children</code>：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> prevStart <span class="token operator">=</span> j</span>
<span class="line">    <span class="token keyword">const</span> nextStart <span class="token operator">=</span> j</span>
<span class="line">    <span class="token comment">// 遍历旧 children</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> prevStart<span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> prevEnd<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">const</span> prevVNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span></span>
<span class="line">      <span class="token comment">// 遍历新 children</span></span>
<span class="line">      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> k <span class="token operator">=</span> nextStart<span class="token punctuation">;</span> k <span class="token operator">&lt;=</span> nextEnd<span class="token punctuation">;</span> k<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">const</span> nextVNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>k<span class="token punctuation">]</span></span>
<span class="line">        <span class="token comment">// 找到拥有相同 key 值的可复用节点</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>prevVNode<span class="token punctuation">.</span>key <span class="token operator">===</span> nextVNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// patch 更新</span></span>
<span class="line">          <span class="token function">patch</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">          <span class="token comment">// 更新 source 数组</span></span>
<span class="line">          source<span class="token punctuation">[</span>k <span class="token operator">-</span> nextStart<span class="token punctuation">]</span> <span class="token operator">=</span> i</span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上代码所示，外层循环逐个从旧 <code>children</code> 中取出未处理的节点，并尝试在新 <code>children</code> 中寻找拥有相同 <code>key</code> 值的可复用节点，一旦找到了可复用节点，则调用 <code>patch</code> 函数更新之。接着更新 <code>source</code> 数组中对应位置的值，这里需要注意的是，由于 <code>k - nextStart</code> 的值才是正确的位置索引，而非 <code>k</code> 本身，并且外层循环中变量 <code>i</code> 的值就代表了该节点在旧 <code>children</code> 中的位置，所以直接将 <code>i</code> 赋值给 <code>source[k - nextStart]</code> 即可达到目的，最终的效果就如上图中所展示的那样。可以看到 <code>source</code> 数组的第四个元素值仍然为初始值 <code>-1</code>，这是因为<strong>新<code>children</code> 中的 <code>li-g</code> 节点不存在于旧 <code>children</code> 中</strong>。除此之外，还有一件很重要的事儿需要做，即判断是否需要移动节点，判断的方式类似于 <code>React</code> 所采用的方式，如下高亮代码所示：</p><pre><code>const prevStart = j
const nextStart = j
let moved = false
let pos = 0
for (let i = prevStart; i &lt;= prevEnd; i++) {
  const prevVNode = prevChildren[i]
  for (let k = nextStart; k &lt;= nextEnd; k++) {
    const nextVNode = nextChildren[k]
    if (prevVNode.key === nextVNode.key) {
      // patch 更新
      patch(prevVNode, nextVNode, container)
      // 更新 source 数组
      source[k - nextStart] = i
      // 判断是否需要移动
      if (k &lt; pos) {
        moved = true
      } else {
        pos = k
      }
    }
  }
}
</code></pre><p>变量 <code>k</code> 代表我们在遍历新 <code>children</code> 中遇到的节点的位置索引，变量 <code>pos</code> 用来存储遇到的位置索引的最大值，一旦发现后来遇到索引比之前遇到的索引要小，即 <code>k &lt; pos</code>，则说明需要移动操作，这时我们更新变量 <code>moved</code> 的值为 <code>true</code>，<code>moved</code> 变量将会在后面使用。</p><p>不过在进一步讲解之前，我们需要回头思考一下上面的代码存在怎样的问题？上面的代码中我们采用两层嵌套的循环，其时间复杂度为 <code>O(n1 * n2)</code>，其中 <code>n1</code> 和 <code>n2</code> 为新旧 <code>children</code> 中节点的数量，我们也可以使用 <code>O(n^2)</code> 来表示，当新旧 <code>children</code> 中节点的数量较多时，则两层嵌套的循环会带来性能的问题，出于优化的目的，我们可以为新的 <code>children</code> 中的节点构建一个 <code>key</code> 到 <code>位置索引</code> 的<strong>索引表</strong> ，如下图所示：</p><p><img src="`+e+`" alt=""></p><p><code>Index Map</code> 中的键是节点的 <code>key</code>，值是节点在新 <code>children</code> 中的位置索引，由于数据结构带来的优势，使得我们能够非常快速的定位旧 <code>children</code> 中的节点在新 <code>children</code> 中的位置，落实的代码如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> prevStart <span class="token operator">=</span> j</span>
<span class="line">    <span class="token keyword">const</span> nextStart <span class="token operator">=</span> j</span>
<span class="line">    <span class="token keyword">let</span> moved <span class="token operator">=</span> <span class="token boolean">false</span></span>
<span class="line">    <span class="token keyword">let</span> pos <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">    <span class="token comment">// 构建索引表</span></span>
<span class="line">    <span class="token keyword">const</span> keyIndex <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> nextStart<span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> nextEnd<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      keyIndex<span class="token punctuation">[</span>nextChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> i</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">// 遍历旧 children 的剩余未处理节点</span></span>
<span class="line">    <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> prevStart<span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> prevEnd<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      prevVNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span></span>
<span class="line">      <span class="token comment">// 通过索引表快速找到新 children 中具有相同 key 的节点的位置</span></span>
<span class="line">      <span class="token keyword">const</span> k <span class="token operator">=</span> keyIndex<span class="token punctuation">[</span>prevVNode<span class="token punctuation">.</span>key<span class="token punctuation">]</span></span>
<span class="line">    </span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> k <span class="token operator">!==</span> <span class="token string">&#39;undefined&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        nextVNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>k<span class="token punctuation">]</span></span>
<span class="line">        <span class="token comment">// patch 更新</span></span>
<span class="line">        <span class="token function">patch</span><span class="token punctuation">(</span>prevVNode<span class="token punctuation">,</span> nextVNode<span class="token punctuation">,</span> container<span class="token punctuation">)</span></span>
<span class="line">        <span class="token comment">// 更新 source 数组</span></span>
<span class="line">        source<span class="token punctuation">[</span>k <span class="token operator">-</span> nextStart<span class="token punctuation">]</span> <span class="token operator">=</span> i</span>
<span class="line">        <span class="token comment">// 判断是否需要移动</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>k <span class="token operator">&lt;</span> pos<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          moved <span class="token operator">=</span> <span class="token boolean">true</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">          pos <span class="token operator">=</span> k</span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 没找到</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是典型的<strong>用空间换时间</strong> 的方式，复杂度能够降低到 <code>O(n)</code>。但无论采用哪一种方式，最终我们的目的是<strong>对新旧<code>children</code> 中具有相同 <code>key</code> 值的节点进行更新，同时检测是否需要移动操作</strong>。在如上代码执行完毕之后，如果发现变量 <code>moved</code> 的值为 <code>true</code>，则说明需要移动操作。</p><p>另外在上面的代码中，我们试图拿旧 <code>children</code> 中的节点尝试去新 <code>children</code> 中寻找具有相同 <code>key</code> 值的节点，但并非总是能够找得到，当 <code>typeof k === &#39;undefined&#39;</code> 时，说明该节点在新 <code>children</code> 中已经不存在了，这时我们应该将其移除，如下高亮代码所示：</p><pre><code>// 遍历旧 children 的剩余未处理节点
for(let i = prevStart; i &lt;= prevEnd; i++) {
  prevVNode = prevChildren[i]
  // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
  const k = keyIndex[prevVNode.key]

  if (typeof k !== &#39;undefined&#39;) {
    // 省略...
  } else {
    // 没找到，说明旧节点在新 children 中已经不存在了，应该移除
    container.removeChild(prevVNode.el)
  }
}
</code></pre><p>除此之外，我们还需要一个数量标识，用来代表<strong>已经更新过的节点的数量</strong> 。我们知道，<strong>已经更新过的节点数量</strong> 应该小于新 <code>children</code> 中需要更新的节点数量，一旦更新过的节点数量超过了新 <code>children</code> 中需要更新的节点数量，则说明该节点是多余的节点，我们也应该将其移除，如下高亮代码所示：</p><pre><code>let patched = 0
// 遍历旧 children 的剩余未处理节点
for (let i = prevStart; i &lt;= prevEnd; i++) {
  prevVNode = prevChildren[i]

  if (patched &lt; nextLeft) {
    // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
    const k = keyIndex[prevVNode.key]
    if (typeof k !== &#39;undefined&#39;) {
      nextVNode = nextChildren[k]
      // patch 更新
      patch(prevVNode, nextVNode, container)
      patched++
      // 更新 source 数组
      source[k - nextStart] = i
      // 判断是否需要移动
      if (k &lt; pos) {
        moved = true
      } else {
        pos = k
      }
    } else {
      // 没找到，说明旧节点在新 children 中已经不存在了，应该移除
      container.removeChild(prevVNode.el)
    }
  } else {
    // 多余的节点，应该移除
    container.removeChild(prevVNode.el)
  }
}
</code></pre><p>变量 <code>patched</code> 将作为数量标识，它的初始值为 <code>0</code>，只有当条件 <code>patched &lt; nextLeft</code> 不成立时，说明该节点已经不存在与新 <code>children</code> 中了，是一个多余的节点，于是我们将其移除。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/03o5plkv40" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/03o5plkv40</a><a href="https://codesandbox.io/s/03o5plkv40" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="dom-移动的方式" tabindex="-1"><a class="header-anchor" href="#dom-移动的方式"><span>DOM 移动的方式</span></a></h3><p>在上一小节，我们的主要目的有两个：1、判断出是否需要进行 DOM 移动操作，所以我们建立了 <code>moved</code> 变量作为标识，当它的值为 <code>true</code> 时则说明需要进行 DOM 移动；2、构建 <code>source</code> 数组，它的长度与“去掉”相同的前置/后置节点后新 <code>children</code> 中剩余未处理节点的数量相等，并存储着新 <code>children</code> 中的节点在旧 <code>children</code> 中位置，后面我们会根据 <code>source</code> 数组计算出一个最长递增子序列，并用于 DOM 移动操作。如下图所示：</p><p><img src="`+e+`" alt=""></p><p>现在我们已经可以通过判断变量 <code>moved</code> 的值来确定是否需要进行 DOM 移动操作：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>moved<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 如果 moved 为真，则需要进行 DOM 移动操作</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一旦需要进行 DOM 节点的移动，我们首先要做的就是根据 <code>source</code> 数组计算一个最长递增子序列：</p><pre><code>if (moved) {
  // 计算最长递增子序列
  const seq = lis(source) // [ 0, 1 ]
}
</code></pre><p>TIP</p><p>什么是最长递增子序列：给定一个数值序列，找到它的一个子序列，并且子序列中的值是递增的，子序列中的元素在原序列中不一定连续。</p><p>例如给定数值序列为：[ 0, 8, 4, 12 ]</p><p>那么它的最长递增子序列就是：[0, 8, 12]</p><p>当然答案可能有多种情况，例如：[0, 4, 12] 也是可以的</p><p>TIP</p><p>我们会在下一小节讲解 <code>lis</code> 函数的实现。</p><p>上面的代码中，我们调用 <code>lis</code> 函数求出数组 <code>source</code> 的最长递增子序列为 <code>[ 0, 1 ]</code>。我们知道 <code>source</code> 数组的值为 <code>[2, 3, 1, -1]</code>，很显然最长递增子序列应该是 <code>[ 2, 3 ]</code>，但为什么计算出的结果是 <code>[ 0, 1 ]</code> 呢？其实 <code>[ 0, 1 ]</code> 代表的是最长递增子序列中的各个元素在 <code>source</code> 数组中的位置索引，如下图所示：</p><p><img src="`+b+'" alt=""></p><p>我们对新 <code>children</code> 中的剩余未处理节点进行了重新编号，<code>li-c</code> 节点的位置是 <code>0</code>，以此类推。而最长递增子序列是 <code>[ 0, 1 ]</code> 这告诉我们：<strong>新<code>children</code> 的剩余未处理节点中，位于位置 <code>0</code> 和位置 <code>1</code> 的节点的先后关系与他们在旧 <code>children</code> 中的先后关系相同</strong>。或者我们可以理解为<strong>位于位置<code>0</code> 和位置 <code>1</code> 的节点是不需要被移动的节点</strong>，即上图中 <code>li-c</code> 节点和 <code>li-d</code> 节点将在接下来的操作中不会被移动。换句话说只有 <code>li-b</code> 节点和 <code>li-g</code> 节点是可能被移动的节点，但是我们发现与 <code>li-g</code> 节点位置对应的 <code>source</code> 数组元素的值为 <code>-1</code>，这说明 <code>li-g</code> 节点应该作为全新的节点被挂载，所以只有 <code>li-b</code> 节点需要被移动。我们来看下图：</p><p><img src="'+g+`" alt=""></p><p>使用两个索引 <code>i</code> 和 <code>j</code> 分别指向新 <code>children</code> 中剩余未处理节点的最后一个节点和最长递增子序列数组中的最后一个位置，并从后向前遍历，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>moved<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">const</span> seq <span class="token operator">=</span> <span class="token function">lis</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">// j 指向最长递增子序列的最后一个值</span></span>
<span class="line">      <span class="token keyword">let</span> j <span class="token operator">=</span> seq<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span></span>
<span class="line">      <span class="token comment">// 从后向前遍历新 children 中的剩余未处理节点</span></span>
<span class="line">      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> nextLeft <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">!==</span> seq<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// 说明该节点需要移动</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// 当 i === seq[j] 时，说明该位置的节点不需要移动</span></span>
<span class="line">          <span class="token comment">// 并让 j 指向下一个位置</span></span>
<span class="line">          j<span class="token operator">--</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>变量 <code>j</code> 指向最长递增子序列的最后一个位置，使用 <code>for</code> 循环从后向前遍历新 <code>children</code> 中剩余未处理的子节点，这里的技巧在于 <code>i</code> 的值的范围是 <code>0</code> 到 <code>nextLeft - 1</code>，这实际上就等价于我们对剩余节点进行了重新编号。接着判断当前节点的位置索引值 <code>i</code> 是否与子序列中位于 <code>j</code> 位置的值相等，如果不相等，则说明该节点需要被移动；如果相等则说明该节点不需要被移动，并且会让 <code>j</code> 指向下一个位置。但是我们观察上图可以发现 <code>li-g</code> 节点的位置索引是 <code>3</code>，它不等于 <code>1</code>(<code>seq[j]</code>)，难道说明 <code>li-g</code> 节点需要被移动吗？其实不是，我们还可以发现与 <code>li-g</code> 节点位置对应的 <code>source</code> 数组中的元素值为 <code>-1</code>，这说明 <code>li-g</code> 节点应该作为全新的节点挂载，所以我们还需增加一个判断，优先检查一个节点是否是全新的节点：</p><pre><code>if (moved) {
  const seq = lis(source)
  // j 指向最长递增子序列的最后一个值
  let j = seq.length - 1
  // 从后向前遍历新 children 中的剩余未处理节点
  for (let i = nextLeft - 1; i &gt;= 0; i--) {
    if (source[i] === -1) {
      // 作为全新的节点挂载

      // 该节点在新 children 中的真实位置索引
      const pos = i + nextStart
      const nextVNode = nextChildren[pos]
      // 该节点下一个节点的位置索引
      const nextPos = pos + 1
      // 挂载
      mount(
        nextVNode,
        container,
        false,
        nextPos &lt; nextChildren.length
          ? nextChildren[nextPos].el
          : null
      )
    } else if (i !== seq[j]) {
      // 说明该节点需要移动
    } else {
      // 当 i === seq[j] 时，说明该位置的节点不需要移动
      // 并让 j 指向下一个位置
      j--
    }
  }
}
</code></pre><p>如上代码的关键在于，为了将节点挂载到正确的位置，我们需要找到当前节点的真实位置索引(<code>i + nextStart</code>)，以及当前节点的后一个节点，并挂载该节点的前面即可。这样我们就完成了 <code>li-g</code> 节点的挂载。接着循环会继续执行，索引 <code>i</code> 将指向下一个位置，即指向 <code>li-b</code> 节点，如下图所示：</p><p><img src="`+h+`" alt=""></p><p><code>li-b</code> 节点的位置索引 <code>i</code> 的值为 <code>2</code>，由于 <code>source[2]</code> 的值为 <code>1</code>，不等于 <code>-1</code>，说明 <code>li-b</code> 节点不是全新的节点。接着会判断 <code>i !== seq[j]</code>，很显然 <code>2 !== 1</code>，这说明 <code>li-b</code> 节点是需要被移动的节点，那么应该如何移动呢？很简单，找到 <code>li-b</code> 节点的后一个节点(<code>li-g</code>)，将其插入到 <code>li-g</code> 节点的前面即可，由于 <code>li-g</code> 节点已经被挂载，所以我们能够拿到它对应的真实 DOM，如下高亮代码所示：</p><pre><code>if (moved) {
  const seq = lis(source)
  // j 指向最长递增子序列的最后一个值
  let j = seq.length - 1
  // 从后向前遍历新 children 中的剩余未处理节点
  for (let i = nextLeft - 1; i &gt;= 0; i--) {
    if (source[i] === -1) {
      // 作为全新的节点挂载

      // 该节点在新 children 中的真实位置索引
      const pos = i + nextStart
      const nextVNode = nextChildren[pos]
      // 该节点下一个节点的位置索引
      const nextPos = pos + 1
      // 挂载
      mount(
        nextVNode,
        container,
        false,
        nextPos &lt; nextChildren.length
          ? nextChildren[nextPos].el
          : null
      )
    } else if (i !== seq[j]) {
      // 说明该节点需要移动

      // 该节点在新 children 中的真实位置索引
      const pos = i + nextStart
      const nextVNode = nextChildren[pos]
      // 该节点下一个节点的位置索引
      const nextPos = pos + 1
      // 移动
      container.insertBefore(
        nextVNode.el,
        nextPos &lt; nextChildren.length
          ? nextChildren[nextPos].el
          : null
      )
    } else {
      // 当 i === seq[j] 时，说明该位置的节点不需要移动
      // 并让 j 指向下一个位置
      j--
    }
  }
}
</code></pre><p>到了这里 <code>li-b</code> 节点已经被我们移动到了正确的位置，接着会进行下一次循环，如下图所示：</p><p><img src="`+f+'" alt=""></p><p>此时索引 <code>j</code> 依然指向子序列的最后一个位置，索引 <code>i</code> 的值为 <code>1</code>，它指向 <code>li-d</code> 节点。同样的，由于 <code>source[1]</code> 的值为 <code>3</code> 不等于 <code>-1</code>，说明 <code>li-d</code> 节点也不是全新的节点。接着判断 <code>li-d</code> 节点的位置索引 <code>i</code> 的值与子序列 <code>seq[j]</code> 的值相等，都为 <code>1</code>，这说明 <code>li-d</code> 节点不需要被移动，此时会把索引 <code>j</code> 指向下一个位置，结束本次循环并开启下一次循环，下一次循环时的状态如下图所示：</p><p><img src="'+w+`" alt=""></p><p><code>li-c</code> 节点既不是新节点，也不需要被移动，至此循环结束，更新完成。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/4lrqpv0jm9" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/4lrqpv0jm9</a><a href="https://codesandbox.io/s/4lrqpv0jm9" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p><h3 id="求解最长递增子序列" tabindex="-1"><a class="header-anchor" href="#求解最长递增子序列"><span>求解最长递增子序列</span></a></h3><p>上一小节我们已经介绍了什么是最长递增子序列，同时我们使用 <code>lis</code> 函数求解一个给定序列的最长递增子序列，本节我们就来探索一下如何求出给定序列的最长递增子序列。</p><p>设给定的序列如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token punctuation">[</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">10</span> <span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>实际上，这是一个可以利用动态规划思想求解的问题。动态规划的思想是将一个大的问题分解成多个小的子问题，并尝试得到这些子问题的最优解，子问题的最优解有可能会在更大的问题中被利用，这样通过小问题的最优解最终求得大问题的最优解。那么对于一个序列而言，它的子问题是什么呢？很简单，序列是有长度的，所以我们可以通过序列的长度来划分子问题，如上序列所示，它有 <code>6</code> 个元素，即该序列的长度为 <code>6</code>，所以我们可不可以将这个序列拆解为长度更短的序列呢？并优先求解这些长度更短的序列的最长递增子序列，进而求得原序列的最长递增子序列？答案是肯定的，假设我们取出原序列的最后一个数字单独作为一个序列，那么该序列就只有一个元素：<code>[ 10 ]</code>，很显然这个只有一个元素的序列的长度为 <code>1</code>，已经不能更短了。那么序列 <code>[ 10 ]</code> 的最长递增子序列是什么呢？因为只有一个元素，所以毫无递增可言，但我们需要一个约定：<strong>当一个序列只有一个元素时，我们认为其递增子序列就是其本身</strong> ，所以序列 <code>[ 10 ]</code> 的最长递增子序列也是 <code>[ 10 ]</code>，其长度也是 <code>1</code>。</p><p>接着我们将子问题进行扩大，现在我们取出原序列中的最后两个数字作为一个序列，即 <code>[ 2, 10 ]</code>。对于这个序列而言，我们可以把它看作是<strong>由序列<code>[ 2 ]</code> 和序列 <code>[ 10 ]</code> 这两个序列所组成的</strong>。并且我们观察这两个序列中的数字，发现满足条件 <code>2 &lt; 10</code>，这满足了递增的要求，所以我们是否可以认为<strong>序列<code>[ 2, 10 ]</code> 的最长递增子序列等于序列 <code>[ 2 ]</code> 和序列 <code>[ 10 ]</code> 这两个序列的递增子序列“之和”</strong>？答案是肯定的，而且庆幸的是，我们在上一步中已经求得了序列 <code>[ 10 ]</code> 的最长递增子序列的长度是 <code>1</code>，同时序列 <code>[ 2 ]</code> 也是一个只有一个元素的序列，所以它的最长递增子序列也是它本身，长度也是 <code>1</code>，最后我们将两者做和，可知序列 <code>[ 2, 10 ]</code> 的最长递增子序列的长度应该是 <code>1 + 1 = 2</code>。实际上我们一眼就能够看得出来序列 <code>[ 2, 10 ]</code> 的最长递增子序列也是 <code>[ 2, 10 ]</code>，其长度当然为 <code>2</code> 啦。</p><p>为了不过于抽象，我们可以画出如下图所示的格子：</p><p><img src="`+x+'" alt=""></p><p>我们为原序列中的每个数字分配一个格子，并且这些格子填充 <code>1</code> 作为初始值：</p><p><img src="'+j+'" alt=""></p><p>根据前面的分析，我们分别求得子问题的序列 <code>[ 10 ]</code> 和 <code>[ 2, 10 ]</code> 的最长递增子序列的长度分别为 <code>1</code> 和 <code>2</code>，所以我们修改对应的格子中的值，如下：</p><p><img src="'+y+'" alt=""></p><p>如上图所示，原序列中数字 <code>10</code> 对应的格子的值依然是 <code>1</code>，因为序列 <code>[ 10 ]</code> 的最长递增子序列的长度是 <code>1</code>。而原序列中数字 <code>2</code> 对应的格子的值为 <code>2</code>，这是因为序列 <code>[ 2, 10 ]</code> 的最长递增子序列的长度是 <code>2</code>。所以你应该发现了格子中的值所代表的是<strong>以该格子所对应的数字为开头的递增子序列的最大长度</strong> 。</p><p>接下来我们继续扩大子问题，我们取出原序列中的最后三个数字作为子问题的序列：<code>[ 12, 2, 10 ]</code>。同样的，对于这个序列而言，我们可以把它看作是由序列 <code>[ 12 ]</code> 和序列 <code>[ 2, 10 ]</code> 这两个序列所组成的。但是我们发现条件 <code>12 &lt; 2</code> 并不成立，这说明什么呢？实际上这说明：<strong>以数字<code>12</code> 开头的递增子序列的最大长度就 等于 以数字 <code>2</code> 开头的递增子序列的最大长度</strong>。这时我们不需要修改原序列中数字 <code>12</code> 所对应的格子的值，如下图所示该格子的值仍然是 <code>1</code>：</p><p><img src="'+E+'" alt=""></p><p>但是这就结束了吗？还不行，大家思考一下，刚刚我们的判断条件是 <code>12 &lt; 2</code>，这当然是不成立的，但大家不要忘了，序列 <code>[ 12, 2, 10 ]</code> 中数字 <code>2</code> 的后面还有一个数字 <code>10</code>，我们是否要继续判断条件 <code>12 &lt; 10</code> 是否成立呢？当然有必要，道理很简单，假设我们的序列是 <code>[ 12, 2, 15 ]</code> 的话，你会发现，如果仅仅判断条件 <code>12 &lt; 2</code> 是不够的，虽然数字 <code>12</code> 不能和数字 <code>2</code> 构成递增的关系，但是数字 <code>12</code> 却可以和数字 <code>15</code> 构成递增的关系，因此我们得出<strong>当填充一个格子的值时，我们应该拿当前格子对应的数字逐个与其后面的所有格子对应的数字进行比较</strong> ，而不能仅仅与紧随其后的数字作比较。按照这个思路，我们继续判断条件 <code>12 &lt; 10</code> 是否成立，很显然是不成立的，所以原序列中数字 <code>12</code> 对应的格子的值仍然不需要改动，依然是 <code>1</code>。</p><p>接着我们进一步扩大子问题，现在我们抽取原序列中最后的四个数字作为子问题的序列：<code>[ 4, 12, 2, 10 ]</code>。还是同样的思路，我们可以把这个序列看作是由序列 <code>[ 4 ]</code> 和序列 <code>[ 12, 2, 10 ]</code> 所组成的，又因为条件 <code>4 &lt; 12</code> 成立，因此我们可以认为子问题序列的最长递增子序列的长度等于<strong>序列<code>[ 4 ]</code> 的最长递增子序列的长度与以数字 <code>12</code> 开头的递增子序列的最大长度之和</strong>，序列 <code>[ 4 ]</code> 的最长递增子序列的长度很显然是 <code>1</code>，而以数字 <code>12</code> 开头的递增子序列的最大长度实际上就是数字 <code>12</code> 对应的格子中的数值，我们在上一步已经求得这个值是 <code>1</code>，因此我们修改数字 <code>4</code> 对应的格子的值为 <code>1 + 1 = 2</code>：</p><p><img src="'+V+'" alt=""></p><p>当然了，着同样还没有结束，我们还要判断条件 <code>4 &lt; 2</code> 和 <code>4 &lt; 10</code> 是否成立，原因我们在前面已经分析过了。条件 <code>4 &lt; 2</code> 不成立，所以什么都不做，但条件 <code>4 &lt; 10</code> 成立，我们找到数字 <code>10</code> 对应的格子中的值：<code>1</code>，将这个值加 <code>1</code> 之后的值为 <code>2</code>，这与现在数字 <code>4</code> 对应的格子中的值相等，所以也不需要改动。</p><p>到现在为止，不知道大家发现什么规律没有？如何计算一个格子中的值呢？实际很简单，规则是：</p><ul><li>1、拿该格子对应的数字 <code>a</code> 与其后面的所有格子对应的数字 <code>b</code> 进行比较，如果条件 <code>a &lt; b</code> 成立，则用数字 <code>b</code> 对应格子中的值加 <code>1</code>，并将结果填充到数字 <code>a</code> 对应的格子中。</li><li>2、只有当计算出来的值大于数字 <code>a</code> 所对应的格子中的值时，才需要更新格子中的数值。</li></ul><p>有了这两条规则，我们就很容易填充剩余格子的值了，接下来我们来填充原序列中数字 <code>8</code> 所对应的格子的值。按照上面的分析，我们需要判断四个条件：</p><ul><li><code>8 &lt; 4</code></li><li><code>8 &lt; 12</code></li><li><code>8 &lt; 2</code></li><li><code>8 &lt; 10</code></li></ul><p>很显然条件 <code>8 &lt; 4</code> 不成立，什么都不做；条件 <code>8 &lt; 12</code> 成立，拿出数字 <code>12</code> 对应格子中的值：<code>1</code>，为这个值再加 <code>1</code> 得出的值为 <code>2</code>，大于数字 <code>8</code> 对应格子的当前值，所以更新该格子的值为 <code>2</code>；条件 <code>8 &lt; 2</code> 也不成立，什么都不做；条件 <code>8 &lt; 10</code> 成立，拿出数字 <code>10</code> 对应格子中的值 <code>1</code>，为这个值再加 <code>1</code> 得出的值为 <code>2</code>，不大于数字 <code>8</code> 所对应格子中的值，所以什么都不需要做，最终我们为数字 <code>8</code> 所对应的格子填充的值是 <code>2</code>：</p><p><img src="'+N+'" alt=""></p><p>现在，就剩下原序列中数字 <code>0</code> 对应的格子的值还没有被更新了，按照之前的思路，我们需要判断的条件如下：</p><ul><li><code>0 &lt; 8</code></li><li><code>0 &lt; 4</code></li><li><code>0 &lt; 12</code></li><li><code>0 &lt; 2</code></li><li><code>0 &lt; 10</code></li></ul><p>条件 <code>0 &lt; 8</code> 成立，拿出数字 <code>8</code> 对应格子中的值 <code>2</code>，为这个值再加 <code>1</code> 得出的值为 <code>3</code>，大于数字 <code>0</code> 对应格子的当前值，所以更新该格子的值为 <code>3</code>。重复执行上面介绍的步骤，最终原序列中数字 <code>0</code> 对应格子的值就是 <code>3</code>：</p><p><img src="'+D+'" alt=""></p><p>如上图所示，现在所有格子的值都已经更新完毕，接下来我们要做的就是根据这些值，找到整个序列的最长递增子序列。那么应该如何寻找呢？很简单，实际上这些格子中的最大值就代表了整个序列的递增子序列的最大长度，上图中数字 <code>0</code> 对应格子的值为 <code>3</code>，是最大值，因此原序列的最长递增子序列一定是以数字 <code>0</code> 开头的：</p><p><img src="'+C+'" alt=""></p><p>接着你需要在该值为 <code>3</code> 的格子后面的所有格子中寻找数值等于 <code>2</code> 的格子，你发现，有三个格子满足条件，分别是原序列中数字 <code>8</code>、<code>4</code>、<code>2</code> 所对应的格子。假设你选取的是数字 <code>4</code>：</p><p><img src="'+S+'" alt=""></p><p>同样的，你需要继续在数字 <code>4</code> 对应的格子后面的所有格子中寻找到数值为 <code>1</code> 的格子，你发现有两个格子是满足条件的，分别是原序列中数字 <code>12</code> 和数字 <code>10</code> 所对应的格子，我们再次随机选取一个值，假设我们选择的是数字 <code>10</code>：</p><p><img src="'+P+'" alt=""></p><p>由于格子中的最小值就是数字 <code>1</code>，因此我们不需要继续寻找了。观察上图可以发现，我们选取出来的三个数字其实就是原序列的最长递增子序列：<code>[ 0, 4, 10 ]</code>。当然，你可能已经发现了，答案并非只有一个，例如：</p><p><img src="'+q+'" alt=""></p><p>关键在于，有三个格子的数值是 <code>2</code>，因此你可以有三种选择：</p><ul><li><code>[ 0, 8 ]</code></li><li><code>[ 0, 4 ]</code></li><li><code>[ 0, 2 ]</code></li></ul><p>当你选择的是 <code>[ 0, 8 ]</code> 时，又因为数字 <code>8</code> 对应的格子后面的格子中，有两个数值为 <code>1</code> 的格子可供选择，所以你还有两种选择：</p><ul><li><code>[ 0, 8, 12 ]</code></li><li><code>[ 0, 8, 10 ]</code></li></ul><p>同样的，如果你选择的是 <code>[ 0, 4 ]</code>，也有两个选择：</p><ul><li><code>[ 0, 4, 12 ]</code></li><li><code>[ 0, 4, 10 ]</code></li></ul><p>但当你选择 <code>[ 0, 2 ]</code> 时，你就只有一个选择：</p><ul><li><code>[ 0, 2, 10 ]</code></li></ul><p>这是因为数字 <code>2</code> 所对应的格子后面，只有一个格子的数值是 <code>1</code>，即数字 <code>10</code> 所对应的那个格子，因此你只有一种选择。换句话说当你选择 <code>[ 0, 2 ]</code> 时，即使数字 <code>12</code> 对应的格子的值也是 <code>1</code>，你也不能选择它，因为数字 <code>12</code> 对应的格子在数字 <code>2</code> 对应的格子之前。</p><p>以上，就是我们求得给定序列的<strong>所有</strong> 最长递增子序列的算法。</p><p>TIP</p><p>上面的讲解中我们优先选择数值为 <code>3</code> 的格子，实际上我们也可以从小往大的选择，即先选择数值为 <code>1</code> 的格子，道理是一样。</p><p>TIP</p><p>完整代码&amp;在线体验地址：<a href="https://codesandbox.io/s/32wjmo7omq" target="_blank" rel="noopener noreferrer">https://codesandbox.io/s/32wjmo7omq</a><a href="https://codesandbox.io/s/32wjmo7omq" target="_blank" rel="noopener noreferrer"> (opens new window)</a></p>',170),B=[A];function O(M,T){return a(),s("div",null,B)}const L=n(I,[["render",O],["__file","04-inferno-所采用的核心-Diff-算法及原理.html.vue"]]),z=JSON.parse('{"path":"/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%20Diff%20%E7%AE%97%E6%B3%95/04-inferno-%E6%89%80%E9%87%87%E7%94%A8%E7%9A%84%E6%A0%B8%E5%BF%83-Diff-%E7%AE%97%E6%B3%95%E5%8F%8A%E5%8E%9F%E7%90%86.html","title":"inferno 所采用的核心 Diff 算法及原理","lang":"zh-CN","frontmatter":{"description":"inferno 所采用的核心 Diff 算法及原理 在 Vue3 中将采用另外一种核心 Diff 算法，它借鉴于 ivi (opens new window) 和 inferno (opens new window)，看下图： 这张图来自 [js-framework-benchmark (opens new window)](https://kraus...","head":[["meta",{"property":"og:url","content":"https://interview.leeguoo.com/Vue-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%20Diff%20%E7%AE%97%E6%B3%95/04-inferno-%E6%89%80%E9%87%87%E7%94%A8%E7%9A%84%E6%A0%B8%E5%BF%83-Diff-%E7%AE%97%E6%B3%95%E5%8F%8A%E5%8E%9F%E7%90%86.html"}],["meta",{"property":"og:site_name","content":"前端面试题集锦"}],["meta",{"property":"og:title","content":"inferno 所采用的核心 Diff 算法及原理"}],["meta",{"property":"og:description","content":"inferno 所采用的核心 Diff 算法及原理 在 Vue3 中将采用另外一种核心 Diff 算法，它借鉴于 ivi (opens new window) 和 inferno (opens new window)，看下图： 这张图来自 [js-framework-benchmark (opens new window)](https://kraus..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_43852502ee805c67.webp"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-06-25T14:39:47.000Z"}],["meta",{"property":"article:modified_time","content":"2026-06-25T14:39:47.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"inferno 所采用的核心 Diff 算法及原理\\",\\"image\\":[\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_43852502ee805c67.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_98ff5648c1f88aa0.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_c305b75701e656bd.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_34db6465517e137d.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_551f06d3ef7d406c.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_259e38c163a108f3.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_bf0d01d8591785d5.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_72ad5e212e91dd09.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_e84d15488ca03103.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_bd15caf79547be3b.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_1769ec0ba9b839e8.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_cca8bd2f87113572.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_8357c1d08b890091.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_8357c1d08b890091.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_0247ef85f7193595.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_ad107acffec84302.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_c76f51298d38eddc.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_4c6368adfcffef30.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_c85dd5b64334f95a.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_1671dc4db3f0b758.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_b15c88e922459f70.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_b51e0457a2138c06.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_ab459ef95b43afe5.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_31c22d597b0f4086.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_fdf441cff77e4b4e.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_26b78b7de0b4667b.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_a59d5b0f5089a1f8.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_79ed601ba3ddbc27.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_5c1b30cad22a4350.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2024_02_a63d7f35a6dab937.webp\\"],\\"dateModified\\":\\"2026-06-25T14:39:47.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":3,"title":"相同的前置和后置元素","slug":"相同的前置和后置元素","link":"#相同的前置和后置元素","children":[]},{"level":3,"title":"判断是否需要进行 DOM 移动","slug":"判断是否需要进行-dom-移动","link":"#判断是否需要进行-dom-移动","children":[]},{"level":3,"title":"DOM 移动的方式","slug":"dom-移动的方式","link":"#dom-移动的方式","children":[]},{"level":3,"title":"求解最长递增子序列","slug":"求解最长递增子序列","link":"#求解最长递增子序列","children":[]}],"git":{"updatedTime":1782398387000,"contributors":[{"name":"leeguooooo","email":"guoli@zhihu.com","commits":2}]},"autoDesc":true,"filePathRelative":"Vue-渲染器的核心 Diff 算法/04-inferno-所采用的核心-Diff-算法及原理.md","excerpt":"\\n<p>在 <code>Vue3</code> 中将采用另外一种核心 <code>Diff</code> 算法，它借鉴于 <a href=\\"https://github.com/localvoid/ivi\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">ivi (opens new\\nwindow)</a> 和 <a href=\\"https://github.com/infernojs/inferno\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">inferno (opens new\\nwindow)</a>，看下图：</p>"}');export{L as comp,z as data};
