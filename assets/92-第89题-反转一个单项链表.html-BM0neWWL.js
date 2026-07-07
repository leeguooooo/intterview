import{_ as n,c as s,o as a,a as e}from"./app-C0SBBF5d.js";const p="/images/s_poetries_work_uploads_2023_01_a593c1419eb0b7bc.webp",l="/images/s_poetries_work_uploads_2023_01_b02144ad8c3aa450.webp",t="/images/s_poetries_work_uploads_2023_01_8965f7e4f3a0e9af.webp",i="/images/s_poetries_work_uploads_2023_01_895e42ed871e87f8.webp",o="/images/s_poetries_work_uploads_2023_01_17d3b3dcdffbeb27.webp",c={},r=e('<h1 id="第89题-反转一个单项链表" tabindex="-1"><a class="header-anchor" href="#第89题-反转一个单项链表"><span>第89题 反转一个单项链表</span></a></h1><ul><li>链表是一个物理结构，类似于数组</li><li>数组需要一段连续的内存空间，而链表是零散的</li><li>链表节点的数据结构 <code>{value,next?, prev?}</code></li></ul><p><strong>链表vs数组</strong></p><ul><li>链表和数组都是有序结构</li><li>链表：查询慢（把链表全部遍历一遍查询）时间复杂度：<code>O(n)</code>，新增和删除快（修改指针指向）时间复杂度：<code>O(1)</code></li><li>数组：查询快（根据下标）时间复杂度：<code>O(1)</code>，新增和删除慢（移动元素）时间复杂度：<code>O(n)</code></li></ul><p><img src="'+p+'" alt=""><img src="'+l+'" alt=""></p><p><strong>链表的应用</strong></p><p><code>react fiber</code>使用了链表</p><p><img src="'+t+`" alt=""></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 双向链表基本结构演示</span></span>
<span class="line">    <span class="token keyword">const</span> n1 <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token literal-property property">value</span><span class="token operator">:</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token literal-property property">next</span><span class="token operator">:</span>n2<span class="token punctuation">}</span> <span class="token comment">// 头节点没有prev</span></span>
<span class="line">    <span class="token keyword">const</span> n2 <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token literal-property property">value</span><span class="token operator">:</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token literal-property property">next</span><span class="token operator">:</span>n3<span class="token punctuation">,</span><span class="token literal-property property">prev</span><span class="token operator">:</span>n1<span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">const</span> n3 <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token literal-property property">value</span><span class="token operator">:</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token literal-property property">next</span><span class="token operator">:</span>n4<span class="token punctuation">,</span><span class="token literal-property property">prev</span><span class="token operator">:</span>n2<span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">const</span> n4 <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token literal-property property">value</span><span class="token operator">:</span><span class="token number">4</span><span class="token punctuation">,</span><span class="token literal-property property">prev</span><span class="token operator">:</span>n3<span class="token punctuation">}</span> <span class="token comment">// 尾节点没有next</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 串联起来大致如下</span></span>
<span class="line">    <span class="token keyword">const</span> link <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">prev</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token operator">...</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">prev</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token operator">...</span></span>
<span class="line">          <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">4</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>反转一个单项链表解题思路</strong></p><ul><li>反转，即节点的<code>next</code>指向前一个节点</li><li>但很容易造成<code>nextNode</code>的丢失</li><li>需要三个指针 <code>prevNode</code>、<code>curNode</code>、<code>nextNode</code></li></ul><p><img src="`+i+'" alt=""><img src="'+o+`" alt=""></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// listNode的数据类型</span></span>
<span class="line">    <span class="token keyword">interface</span> <span class="token class-name">ILinkListNode</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">value</span><span class="token operator">:</span> number</span>
<span class="line">      next<span class="token operator">?</span><span class="token operator">:</span> ILinkListNode</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 反转单向链表，并返回反转之后的 head node</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">listNode</span> list head node</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">reverseLinkList</span><span class="token punctuation">(</span><span class="token parameter">listNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 定义三个指针</span></span>
<span class="line">        <span class="token keyword">let</span> prevNode <span class="token operator">=</span> <span class="token keyword">undefined</span> <span class="token comment">// 上一个节点</span></span>
<span class="line">        <span class="token keyword">let</span> curNode <span class="token operator">=</span> <span class="token keyword">undefined</span> <span class="token comment">// 当前节点</span></span>
<span class="line">        <span class="token keyword">let</span> nextNode <span class="token operator">=</span> listNode <span class="token comment">// 默认赋值listNode</span></span>
<span class="line">    </span>
<span class="line">        <span class="token comment">// 以 nextNode 为主，遍历链表</span></span>
<span class="line">        <span class="token keyword">while</span><span class="token punctuation">(</span>nextNode<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// ABCD 第一个元素A反转后没有next，需要删掉 next ，防止循环引用</span></span>
<span class="line">          <span class="token keyword">if</span> <span class="token punctuation">(</span>curNode <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>prevNode<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">delete</span> curNode<span class="token punctuation">.</span>next</span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">          <span class="token comment">// 反转指针</span></span>
<span class="line">          <span class="token keyword">if</span> <span class="token punctuation">(</span>curNode <span class="token operator">&amp;&amp;</span> prevNode<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            curNode<span class="token punctuation">.</span>next <span class="token operator">=</span> prevNode</span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">          <span class="token comment">// 整体向后移动三个指针</span></span>
<span class="line">          prevNode <span class="token operator">=</span> curNode <span class="token comment">// 把当前节点赋给上一个节点</span></span>
<span class="line">          curNode <span class="token operator">=</span> nextNode <span class="token comment">// 把下一个节点赋给当前节点</span></span>
<span class="line">          nextNode <span class="token operator">=</span> nextNode<span class="token punctuation">.</span>next <span class="token comment">// 把下一个节点的next节点赋给下一个节点</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">        <span class="token comment">// 对指针移动到最后一个元素nextNode的处理：当 nextNode 空时，此时 curNode 尚未设置 next</span></span>
<span class="line">        <span class="token comment">// https://s.poetries.work/uploads/2023/01/e3a852412a0563dd.png</span></span>
<span class="line">        curNode<span class="token punctuation">.</span>next <span class="token operator">=</span> prevNode</span>
<span class="line">    </span>
<span class="line">        <span class="token keyword">return</span> curNode</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 功能测试</span></span>
<span class="line">    </span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 根据数组创建单向链表</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">arr</span> number arr</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">function</span> <span class="token function">createLinkList</span><span class="token punctuation">(</span><span class="token parameter">arr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">const</span> length <span class="token operator">=</span> arr<span class="token punctuation">.</span>length</span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>length <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&#39;arr is empty&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">        <span class="token comment">// [1,2,3]</span></span>
<span class="line">        <span class="token comment">// 最后一个{value:3}</span></span>
<span class="line">        <span class="token keyword">let</span> curNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token literal-property property">value</span><span class="token operator">:</span> arr<span class="token punctuation">[</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>length <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">return</span> curNode</span>
<span class="line">    </span>
<span class="line">        <span class="token comment">// 从倒数第二个开始 [1,2,3]</span></span>
<span class="line">        <span class="token comment">// {value:2,next:{value:3}}</span></span>
<span class="line">        <span class="token comment">// {value:1,next:{value:2,next:{value:3}}}</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> length <span class="token operator">-</span> <span class="token number">2</span><span class="token punctuation">;</span> i <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            curNode <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token literal-property property">value</span><span class="token operator">:</span> arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token literal-property property">next</span><span class="token operator">:</span> curNode</span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">        <span class="token keyword">return</span> curNode</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">var</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">100</span><span class="token punctuation">,</span> <span class="token number">200</span><span class="token punctuation">,</span> <span class="token number">300</span><span class="token punctuation">,</span> <span class="token number">400</span><span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token keyword">var</span> list <span class="token operator">=</span> <span class="token function">createLinkList</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span></span>
<span class="line">    <span class="token doc-comment comment">/**反转前</span>
<span class="line">     * <span class="token punctuation">{</span></span>
<span class="line">     *    value: 100,</span>
<span class="line">     *    next: <span class="token punctuation">{</span></span>
<span class="line">     *      value: 200,</span>
<span class="line">     *      next: <span class="token punctuation">{</span></span>
<span class="line">     *        value:300,</span>
<span class="line">     *        next: <span class="token punctuation">{</span></span>
<span class="line">     *          value: 400,</span>
<span class="line">     *          next: <span class="token punctuation">{</span></span>
<span class="line">     *            value: 500</span>
<span class="line">     *          <span class="token punctuation">}</span></span>
<span class="line">     *        <span class="token punctuation">}</span></span>
<span class="line">     *      <span class="token punctuation">}</span></span>
<span class="line">     *    <span class="token punctuation">}</span></span>
<span class="line">     * <span class="token punctuation">}</span></span>
<span class="line">     */</span></span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&#39;list:&#39;</span><span class="token punctuation">,</span> list<span class="token punctuation">)</span> </span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">var</span> list1 <span class="token operator">=</span> <span class="token function">reverseLinkList</span><span class="token punctuation">(</span>list<span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token doc-comment comment">/**反转后</span>
<span class="line">     * <span class="token punctuation">{</span></span>
<span class="line">     *    value: 500,</span>
<span class="line">     *    next: <span class="token punctuation">{</span></span>
<span class="line">     *      value: 400,</span>
<span class="line">     *      next: <span class="token punctuation">{</span></span>
<span class="line">     *        value:300,</span>
<span class="line">     *        next: <span class="token punctuation">{</span></span>
<span class="line">     *          value: 200,</span>
<span class="line">     *          next: <span class="token punctuation">{</span></span>
<span class="line">     *            value: 100</span>
<span class="line">     *          <span class="token punctuation">}</span></span>
<span class="line">     *        <span class="token punctuation">}</span></span>
<span class="line">     *      <span class="token punctuation">}</span></span>
<span class="line">     *    <span class="token punctuation">}</span></span>
<span class="line">     * <span class="token punctuation">}</span></span>
<span class="line">     */</span></span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&#39;list1:&#39;</span><span class="token punctuation">,</span> list1<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,14),u=[r];function d(v,k){return a(),s("div",null,u)}const b=n(c,[["render",d],["__file","92-第89题-反转一个单项链表.html.vue"]]),_=JSON.parse('{"path":"/%E6%AF%8F%E6%97%A5%E4%B8%80%E9%A2%98-%E6%AF%8F%E6%97%A5%E4%B8%80%E9%A2%98/92-%E7%AC%AC89%E9%A2%98-%E5%8F%8D%E8%BD%AC%E4%B8%80%E4%B8%AA%E5%8D%95%E9%A1%B9%E9%93%BE%E8%A1%A8.html","title":"反转一个单项链表","lang":"zh-CN","frontmatter":{"title":"反转一个单项链表","description":"第89题 反转一个单项链表 链表是一个物理结构，类似于数组 数组需要一段连续的内存空间，而链表是零散的 链表节点的数据结构 {value,next?, prev?} 链表vs数组 链表和数组都是有序结构 链表：查询慢（把链表全部遍历一遍查询）时间复杂度：O(n)，新增和删除快（修改指针指向）时间复杂度：O(1) 数组：查询快（根据下标）时间复杂度：O(...","head":[["meta",{"property":"og:url","content":"https://interview.leeguoo.com/%E6%AF%8F%E6%97%A5%E4%B8%80%E9%A2%98-%E6%AF%8F%E6%97%A5%E4%B8%80%E9%A2%98/92-%E7%AC%AC89%E9%A2%98-%E5%8F%8D%E8%BD%AC%E4%B8%80%E4%B8%AA%E5%8D%95%E9%A1%B9%E9%93%BE%E8%A1%A8.html"}],["meta",{"property":"og:site_name","content":"前端面试题集锦"}],["meta",{"property":"og:title","content":"反转一个单项链表"}],["meta",{"property":"og:description","content":"第89题 反转一个单项链表 链表是一个物理结构，类似于数组 数组需要一段连续的内存空间，而链表是零散的 链表节点的数据结构 {value,next?, prev?} 链表vs数组 链表和数组都是有序结构 链表：查询慢（把链表全部遍历一遍查询）时间复杂度：O(n)，新增和删除快（修改指针指向）时间复杂度：O(1) 数组：查询快（根据下标）时间复杂度：O(..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://interview.leeguoo.com/images/s_poetries_work_uploads_2023_01_a593c1419eb0b7bc.webp"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-07-06T04:15:51.000Z"}],["meta",{"property":"article:modified_time","content":"2026-07-06T04:15:51.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"反转一个单项链表\\",\\"image\\":[\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2023_01_a593c1419eb0b7bc.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2023_01_b02144ad8c3aa450.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2023_01_8965f7e4f3a0e9af.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2023_01_895e42ed871e87f8.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_uploads_2023_01_17d3b3dcdffbeb27.webp\\"],\\"dateModified\\":\\"2026-07-06T04:15:51.000Z\\",\\"author\\":[]}"]]},"headers":[],"git":{"updatedTime":1783311351000,"contributors":[{"name":"leeguooooo","email":"guoli@zhihu.com","commits":3}]},"autoDesc":true,"filePathRelative":"每日一题-每日一题/92-第89题-反转一个单项链表.md","excerpt":"\\n<ul>\\n<li>链表是一个物理结构，类似于数组</li>\\n<li>数组需要一段连续的内存空间，而链表是零散的</li>\\n<li>链表节点的数据结构 <code>{value,next?, prev?}</code></li>\\n</ul>\\n<p><strong>链表vs数组</strong></p>\\n<ul>\\n<li>链表和数组都是有序结构</li>\\n<li>链表：查询慢（把链表全部遍历一遍查询）时间复杂度：<code>O(n)</code>，新增和删除快（修改指针指向）时间复杂度：<code>O(1)</code></li>\\n<li>数组：查询快（根据下标）时间复杂度：<code>O(1)</code>，新增和删除慢（移动元素）时间复杂度：<code>O(n)</code></li>\\n</ul>"}');export{b as comp,_ as data};
