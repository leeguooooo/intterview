import{_ as n,c as s,o as a,a as e}from"./app-f2Cpj3V4.js";const p="/images/s_poetries_work_images_20210424180608.png",t="/images/s_poetries_work_images_20210424181240.png",o={},c=e('<p>原文链接: <a href="https://interview.poetries.top/principle-docs/node/01-Node%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86.html" target="_blank" rel="noopener noreferrer">https://interview.poetries.top/principle-docs/node/01-Node%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86.html</a></p><h2 id="node-js-事件循环" tabindex="-1"><a class="header-anchor" href="#node-js-事件循环"><span>Node.js 事件循环</span></a></h2><p>事件循环通俗来说就是一个无限的 while 循环。现在假设你对这个 while 循环什么都不了解，你一定会有以下疑问。</p><ol><li>谁来启动这个循环过程，循环条件是什么？</li><li>循环的是什么任务呢？</li><li>循环的任务是否存在优先级概念？</li><li>什么进程或者线程来执行这个循环？</li><li>无限循环有没有终点？</li></ol><p>带着这些问题，我们先来看看 Node.js 官网提供的事件循环原理图。</p><h2 id="node-js-循环原理" tabindex="-1"><a class="header-anchor" href="#node-js-循环原理"><span>Node.js 循环原理</span></a></h2><p>图 为 Node.js 官网的事件循环原理的核心流程图。</p><p><img src="'+p+`" alt=""></p><p>可以看到，这一流程包含 6 个阶段，每个阶段代表的含义如下所示。</p><p>（1）<code>timers</code>：本阶段执行已经被 <code>setTimeout() 和 setInterval()</code> 调度的回调函数，简单理解就是由这两个函数启动的回调函数。</p><p>（2）<code>pending callbacks</code>：本阶段执行某些系统操作（如 TCP 错误类型）的回调函数。</p><p>（3）<code>idle、prepare</code>：仅系统内部使用，你只需要知道有这 2 个阶段就可以。</p><p>（4）<code>poll</code>：检索新的 I/O 事件，执行与 I/O 相关的回调，其他情况 Node.js 将在适当的时候在此阻塞。这也是最复杂的一个阶段，所有的事件循环以及回调处理都在这个阶段执行，接下来会详细分析这个过程。</p><p>（5）<code>check</code>：setImmediate() 回调函数在这里执行，setImmediate 并不是立马执行，而是当事件循环 poll 中没有新的事件处理时就执行该部分，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;fs&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> <span class="token comment">// 新的事件循环的起点</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;1&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> </span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token function">setImmediate</span><span class="token punctuation">(</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;setImmediate 1&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">/// 将会在 poll 阶段执行</span></span>
<span class="line">    fs<span class="token punctuation">.</span><span class="token function">readFile</span><span class="token punctuation">(</span><span class="token string">&#39;./test.conf&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token literal-property property">encoding</span><span class="token operator">:</span> <span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> data</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">throw</span> err<span class="token punctuation">;</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;read file success&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">/// 该部分将会在首次事件循环中执行</span></span>
<span class="line">    Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;poll callback&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 首次事件循环执行</span></span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;2&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>在这一代码中有一个非常奇特的地方，就是 <code>setImmediate 会在 setTimeout 之后输出</code>。有以下几点原因：</p></blockquote><ul><li><code>setTimeout</code> 如果不设置时间或者设置时间为 0，则会默认为 \`1ms；\`\`</li><li>主流程执行完成后，超过 <code>1ms</code> 时，会将 <code>setTimeout</code> 回调函数逻辑插入到待执行回调函数 <code>poll</code> 队列中；</li><li>由于当前 poll 队列中存在可执行回调函数，因此需要先执行完，待完全执行完成后，才会执行check：setImmediate。</li></ul><blockquote><p><code>先执行回调函数，再执行 setImmediate</code></p></blockquote><p>（6）<code>close callbacks</code>：执行一些关闭的回调函数，如 <code>socket.on(&#39;close&#39;, ...)</code></p><p>以上就是循环原理的 6 个过程，针对上面的点，我们再来解答上面提出的 5 个疑问。</p><h2 id="运行起点" tabindex="-1"><a class="header-anchor" href="#运行起点"><span>运行起点</span></a></h2><p>从图 1 中我们可以看出事件循环的起点是 <code>timers</code>，如下代码所示：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;1&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;2&#39;</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在代码 <code>setTimeout</code> 中的回调函数就是新一轮事件循环的起点，看到这里有很多同学会提出非常合理的疑问：“为什么会先输出 2 然后输出 1，不是说 timer 的回调函数是运行起点吗？”</p><blockquote><p>当 Node.js 启动后，会初始化事件循环，处理已提供的输入脚本，它可能会先调用一些异步的 API、调度定时器，或者 <code>process.nextTick()</code>，然后再开始处理事件循环。因此可以这样理解，Node.js 进程启动后，就发起了一个新的事件循环，也就是事件循环的起点。</p></blockquote><p>总结来说，Node.js 事件循环的发起点有 4 个：</p><ul><li><code>Node.js</code> 启动后；</li><li><code>setTimeout</code> 回调函数；</li><li><code>setInterval</code> 回调函数；</li><li>也可能是一次 <code>I/O</code> 后的回调函数。</li></ul><h2 id="node-js-事件循环-1" tabindex="-1"><a class="header-anchor" href="#node-js-事件循环-1"><span>Node.js 事件循环</span></a></h2><blockquote><p>在了解谁发起的事件循环后，我们再来回答第 2 个问题，即循环的是什么任务。在上面的核心流程中真正需要关注循环执行的就是 poll 这个过程。在 poll 过程中，主要处理的是异步 I/O 的回调函数，以及其他几乎所有的回调函数，异步 I/O 又分为网络 I/O 和文件 I/O。这是我们常见的代码逻辑部分的异步回调逻辑。</p></blockquote><p><code>事件循环的主要包含微任务和宏任务。具体是怎么进行循环的呢</code>？如图</p><p><img src="`+t+`" alt=""></p><p>在解释上图之前，我们先来解释下两个概念，微任务和宏任务。</p><ul><li><strong>微任务</strong> ：在 Node.js 中微任务包含 2 种——<code>process.nextTick</code> 和 <code>Promise</code>。<code>微任务在事件循环中优先级是最高的</code>，因此在同一个事件循环中有其他任务存在时，优先执行微任务队列。并且<code>process.nextTick 和 Promise</code>也存在优先级，<code>process.nextTick</code> 高于 <code>Promise</code></li><li><strong>宏任务</strong> ：在 Node.js 中宏任务包含 4 种——<code>setTimeout</code>、<code>setInterval</code>、<code>setImmediate</code> 和 <code>I/O</code>。宏任务在微任务执行之后执行，因此在同一个事件循环周期内，如果既存在微任务队列又存在宏任务队列，那么优先将微任务队列清空，再执行宏任务队列</li></ul><p>我们可以看到有一个核心的主线程，它的执行阶段主要处理三个核心逻辑。</p><ul><li>同步代码。</li><li>将异步任务插入到微任务队列或者宏任务队列中。</li><li>执行微任务或者宏任务的回调函数。在主线程处理回调函数的同时，也需要判断是否插入微任务和宏任务。根据优先级，先判断微任务队列是否存在任务，存在则先执行微任务，不存在则判断在宏任务队列是否有任务，有则执行。</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;fs&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 首次事件循环执行</span></span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;start&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">/// 将会在新的事件循环中的阶段执行</span></span>
<span class="line">    fs<span class="token punctuation">.</span><span class="token function">readFile</span><span class="token punctuation">(</span><span class="token string">&#39;./test.conf&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token literal-property property">encoding</span><span class="token operator">:</span> <span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> data</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">throw</span> err<span class="token punctuation">;</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;read file success&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> <span class="token comment">// 新的事件循环的起点</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;setTimeout&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> </span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">/// 该部分将会在首次事件循环中执行</span></span>
<span class="line">    Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Promise callback&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">/// 执行 process.nextTick</span></span>
<span class="line">    process<span class="token punctuation">.</span><span class="token function">nextTick</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;nextTick callback&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 首次事件循环执行</span></span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;end&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分析下上面代码的执行过程</p><ul><li>第一个事件循环主线程发起，因此先执行同步代码，所以先输出 start，然后输出 end</li><li>第一个事件循环主线程发起，因此先执行同步代码，所以先输出 start，然后输出 end；</li><li>再从上往下分析，遇到微任务，插入微任务队列，遇到宏任务，插入宏任务队列，分析完成后，微任务队列包含：<code>Promise.resolve 和 process.nextTick</code>，宏任务队列包含：<code>fs.readFile 和 setTimeout</code>；</li><li>先执行微任务队列，但是根据优先级，先执行 <code>process.nextTick 再执行 Promise.resolve</code>，所以先输出 <code>nextTick callback</code> 再输出 <code>Promise callback</code>；</li><li>再执行宏任务队列，根据<code>宏任务插入先后顺序执行 setTimeout 再执行 fs.readFile</code>，这里需要注意，先执行 <code>setTimeout</code> 由于其回调时间较短，因此回调也先执行，并非是 <code>setTimeout</code> 先执行所以才先执行回调函数，但是它执行需要时间肯定大于 <code>1ms</code>，所以虽然 <code>fs.readFile</code> 先于<code>setTimeout</code> 执行，但是 <code>setTimeout</code> 执行更快，所以先输出 <code>setTimeout</code> ，最后输出 <code>read file success</code>。</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 输出结果</span></span>
<span class="line">    start</span>
<span class="line">    end</span>
<span class="line">    nextTick callback</span>
<span class="line">    Promise callback</span>
<span class="line">    setTimeout</span>
<span class="line">    read file success</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>当微任务和宏任务又产生新的微任务和宏任务时，又应该如何处理呢？如下代码所示：</p></blockquote><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;fs&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> <span class="token comment">// 新的事件循环的起点</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;1&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> </span>
<span class="line">        fs<span class="token punctuation">.</span><span class="token function">readFile</span><span class="token punctuation">(</span><span class="token string">&#39;./config/test.conf&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token literal-property property">encoding</span><span class="token operator">:</span> <span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> data</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">throw</span> err<span class="token punctuation">;</span></span>
<span class="line">            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;read file sync success&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">/// 回调将会在新的事件循环之前</span></span>
<span class="line">    fs<span class="token punctuation">.</span><span class="token function">readFile</span><span class="token punctuation">(</span><span class="token string">&#39;./config/test.conf&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token literal-property property">encoding</span><span class="token operator">:</span> <span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> data</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">throw</span> err<span class="token punctuation">;</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;read file success&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">/// 该部分将会在首次事件循环中执行</span></span>
<span class="line">    Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;poll callback&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 首次事件循环执行</span></span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;2&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面代码中，有 2 个宏任务和 1 个微任务，宏任务是 <code>setTimeout 和 fs.readFile</code>，微任务是 <code>Promise.resolve</code>。</p><ul><li>整个过程优先执行主线程的第一个事件循环过程，所以先执行同步逻辑，先输出 2。</li><li>接下来执行微任务，输出 <code>poll callback</code>。</li><li>再执行宏任务中的 <code>fs.readFile 和 setTimeout</code>，由于 <code>fs.readFile</code> 优先级高，先执行 <code>fs.readFile</code>。但是处理时间长于 <code>1ms</code>，因此会先执行 <code>setTimeout</code> 的回调函数，输出 <code>1</code>。这个阶段在执行过程中又会产生新的宏任务 <code>fs.readFile</code>，因此又将该 <code>fs.readFile 插入宏任务队列</code></li><li>最后由于只剩下宏任务了 <code>fs.readFile</code>，因此执行该宏任务，并等待处理完成后的回调，输出 <code>read file sync success</code>。</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 结果</span></span>
<span class="line">    <span class="token number">2</span></span>
<span class="line">    poll callback</span>
<span class="line">    <span class="token number">1</span></span>
<span class="line">    read file success</span>
<span class="line">    read file sync success</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>最后我们再来回答第 5 个问题，当所有的微任务和宏任务都清空的时候，虽然当前没有任务可执行了，但是也并不能代表循环结束了。因为可能存在当前还未回调的异步 I/O，所以这个循环是没有终点的，只要进程在，并且有新的任务存在，就会去执行。</p></blockquote><h2 id="单线程-多线程" tabindex="-1"><a class="header-anchor" href="#单线程-多线程"><span>单线程/多线程</span></a></h2><blockquote><p>相信在面试过程中，面试官经常会问这个问题“Node.js 是单线程的还是多线程的”。</p></blockquote><p>学完上面的内容后，你就可以回答了。</p><blockquote><p>主线程是单线程执行的，但是 Node.js 存在多线程执行，多线程包括 setTimeout 和异步 I/O 事件。其实 Node.js 还存在其他的线程，包括垃圾回收、内存优化等。</p></blockquote><p>这里也可以解释我们前面提到的第 4 个问题，主要还是主线程来循环遍历当前事件。</p><blockquote><p>你可以自行思考下这个问题：浏览器的事件循环原理和 Node.js 事件循环原理的区别以及联系有哪些点</p></blockquote><p>阅读全文</p>`,52),l=[c];function i(u,d){return a(),s("div",null,l)}const k=n(o,[["render",i],["__file","Node-01-Node事件循环机制原理.html.vue"]]),m=JSON.parse('{"path":"/Node-01-Node%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86.html","title":"","lang":"zh-CN","frontmatter":{"description":"原文链接: https://interview.poetries.top/principle-docs/node/01-Node%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86.html Node.js 事件循环 事件循环通俗来说就是一个无限的 while ...","head":[["meta",{"property":"og:url","content":"https://interview.leeguoo.com/Node-01-Node%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86.html"}],["meta",{"property":"og:site_name","content":"前端面试题集锦"}],["meta",{"property":"og:description","content":"原文链接: https://interview.poetries.top/principle-docs/node/01-Node%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86.html Node.js 事件循环 事件循环通俗来说就是一个无限的 while ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://interview.leeguoo.com/images/s_poetries_work_images_20210424180608.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-06T05:59:31.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-06T05:59:31.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"https://interview.leeguoo.com/images/s_poetries_work_images_20210424180608.png\\",\\"https://interview.leeguoo.com/images/s_poetries_work_images_20210424181240.png\\"],\\"dateModified\\":\\"2024-06-06T05:59:31.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Node.js 事件循环","slug":"node-js-事件循环","link":"#node-js-事件循环","children":[]},{"level":2,"title":"Node.js 循环原理","slug":"node-js-循环原理","link":"#node-js-循环原理","children":[]},{"level":2,"title":"运行起点","slug":"运行起点","link":"#运行起点","children":[]},{"level":2,"title":"Node.js 事件循环","slug":"node-js-事件循环-1","link":"#node-js-事件循环-1","children":[]},{"level":2,"title":"单线程/多线程","slug":"单线程-多线程","link":"#单线程-多线程","children":[]}],"git":{"updatedTime":1717653571000,"contributors":[{"name":"guoli","email":"guoli@zhihu.com","commits":1}]},"autoDesc":true,"filePathRelative":"Node-01-Node事件循环机制原理.md","excerpt":"<p>原文链接: <a href=\\"https://interview.poetries.top/principle-docs/node/01-Node%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://interview.poetries.top/principle-docs/node/01-Node%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86.html</a></p>"}');export{k as comp,m as data};
