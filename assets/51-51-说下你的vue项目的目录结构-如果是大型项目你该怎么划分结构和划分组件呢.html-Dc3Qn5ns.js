import{_ as s,c as n,o as a,a as e}from"./app-BuhGo8SK.js";const p={},l=e(`<h1 id="_51-说下你的vue项目的目录结构-如果是大型项目你该怎么划分结构和划分组件呢" tabindex="-1"><a class="header-anchor" href="#_51-说下你的vue项目的目录结构-如果是大型项目你该怎么划分结构和划分组件呢"><span>51 说下你的vue项目的目录结构，如果是大型项目你该怎么划分结构和划分组件呢</span></a></h1><h3 id="为什么要划分" tabindex="-1"><a class="header-anchor" href="#为什么要划分"><span>为什么要划分</span></a></h3><p>使用<code>vue</code>构建项目，项目结构清晰会提高开发效率，熟悉项目的各种配置同样会让开发效率更高</p><p>在划分项目结构的时候，需要遵循一些基本的原则：</p><ul><li>文件夹和文件夹内部文件的语义一致性</li><li>单一入口/出口</li><li>就近原则，紧耦合的文件应该放到一起，且应以相对路径引用</li><li>公共的文件应该以绝对路径的方式从根目录引用</li><li><code>/src</code> 外的文件不应该被引入</li></ul><p><strong>文件夹和文件夹内部文件的语义一致性</strong></p><p>我们的目录结构都会有一个文件夹是按照路由模块来划分的，如<code>pages</code>文件夹，这个文件夹里面应该包含我们项目所有的路由模块，并且仅应该包含路由模块，而不应该有别的其他的非路由模块的文件夹</p><p>这样做的好处在于一眼就从 <code>pages</code>文件夹看出这个项目的路由有哪些</p><p><strong>单一入口/出口</strong></p><p>举个例子，在<code>pages</code>文件夹里面存在一个<code>seller</code>文件夹，这时候<code>seller</code> 文件夹应该作为一个独立的模块由外部引入，并且 <code>seller/index.js</code> 应该作为外部引入 seller 模块的唯一入口</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 错误用法</span></span>
<span class="line">    <span class="token keyword">import</span> sellerReducer <span class="token keyword">from</span> <span class="token string">&#39;src/pages/seller/reducer&#39;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 正确用法</span></span>
<span class="line">    <span class="token keyword">import</span> <span class="token punctuation">{</span> reducer <span class="token keyword">as</span> sellerReducer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;src/pages/seller&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样做的好处在于，无论你的模块文件夹内部有多乱，外部引用的时候，都是从一个入口文件引入，这样就很好的实现了隔离，如果后续有重构需求，你就会发现这种方式的优点</p><p><strong>就近原则，紧耦合的文件应该放到一起，且应以相对路径引用</strong></p><p>使用相对路径可以保证模块内部的独立性</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 正确用法</span></span>
<span class="line">    <span class="token keyword">import</span> styles <span class="token keyword">from</span> <span class="token string">&#39;./index.module.scss&#39;</span></span>
<span class="line">    <span class="token comment">// 错误用法</span></span>
<span class="line">    <span class="token keyword">import</span> styles <span class="token keyword">from</span> <span class="token string">&#39;src/pages/seller/index.module.scss&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举个例子</p><p>假设我们现在的 seller 目录是在 <code>src/pages/seller</code>，如果我们后续发生了路由变更，需要加一个层级，变成 <code>src/pages/user/seller</code>。</p><p>如果我们采用第一种相对路径的方式，那就可以直接将整个文件夹拖过去就好，<code>seller</code> 文件夹内部不需要做任何变更。</p><p>但是如果我们采用第二种绝对路径的方式，移动文件夹的同时，还需要对每个 <code>import</code> 的路径做修改</p><p><strong>公共的文件应该以绝对路径的方式从根目录引用</strong></p><p>公共指的是多个路由模块共用，如一些公共的组件，我们可以放在<code>src/components</code>下</p><p>在使用到的页面中，采用绝对路径的形式引用</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token comment">// 错误用法</span></span>
<span class="line">    <span class="token keyword">import</span> Input <span class="token keyword">from</span> <span class="token string">&#39;../../components/input&#39;</span></span>
<span class="line">    <span class="token comment">// 正确用法</span></span>
<span class="line">    <span class="token keyword">import</span> Input <span class="token keyword">from</span> <span class="token string">&#39;src/components/input&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样的，如果我们需要对文件夹结构进行调整。将 <code>/src/components/input</code> 变成 <code>/src/components/new/input</code>，如果使用绝对路径，只需要全局搜索替换</p><p>再加上绝对路径有全局的语义，相对路径有独立模块的语义</p><p><strong>src 外的文件不应该被引入</strong></p><p><code>vue-cli</code>脚手架已经帮我们做了相关的约束了，正常我们的前端项目都会有个<code>src</code>文件夹，里面放着所有的项目需要的资源，<code>js</code>,<code>css</code>, <code>png</code>, <code>svg</code> 等等。<code>src</code> 外会放一些项目配置，依赖，环境等文件</p><p>这样的好处是方便划分项目代码文件和配置文件</p><h3 id="目录结构" tabindex="-1"><a class="header-anchor" href="#目录结构"><span>目录结构</span></a></h3><p>单页面目录结构</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    project</span>
<span class="line">    │  <span class="token punctuation">.</span>browserslistrc</span>
<span class="line">    │  <span class="token punctuation">.</span>env<span class="token punctuation">.</span>production</span>
<span class="line">    │  <span class="token punctuation">.</span>eslintrc<span class="token punctuation">.</span>js</span>
<span class="line">    │  <span class="token punctuation">.</span>gitignore</span>
<span class="line">    │  babel<span class="token punctuation">.</span>config<span class="token punctuation">.</span>js</span>
<span class="line">    │  <span class="token keyword">package</span><span class="token operator">-</span>lock<span class="token punctuation">.</span>json</span>
<span class="line">    │  <span class="token keyword">package</span><span class="token punctuation">.</span>json</span>
<span class="line">    │  <span class="token constant">README</span><span class="token punctuation">.</span>md</span>
<span class="line">    │  vue<span class="token punctuation">.</span>config<span class="token punctuation">.</span>js</span>
<span class="line">    │  yarn<span class="token operator">-</span>error<span class="token punctuation">.</span>log</span>
<span class="line">    │  yarn<span class="token punctuation">.</span>lock</span>
<span class="line">    │</span>
<span class="line">    ├─<span class="token keyword">public</span></span>
<span class="line">    │      favicon<span class="token punctuation">.</span>ico</span>
<span class="line">    │      index<span class="token punctuation">.</span>html</span>
<span class="line">    │</span>
<span class="line">    <span class="token operator">|</span><span class="token operator">--</span> src</span>
<span class="line">        <span class="token operator">|</span><span class="token operator">--</span> components</span>
<span class="line">            <span class="token operator">|</span><span class="token operator">--</span> input</span>
<span class="line">                <span class="token operator">|</span><span class="token operator">--</span> index<span class="token punctuation">.</span>js</span>
<span class="line">                <span class="token operator">|</span><span class="token operator">--</span> index<span class="token punctuation">.</span>module<span class="token punctuation">.</span>scss</span>
<span class="line">        <span class="token operator">|</span><span class="token operator">--</span> pages</span>
<span class="line">            <span class="token operator">|</span><span class="token operator">--</span> seller</span>
<span class="line">                <span class="token operator">|</span><span class="token operator">--</span> components</span>
<span class="line">                    <span class="token operator">|</span><span class="token operator">--</span> input</span>
<span class="line">                        <span class="token operator">|</span><span class="token operator">--</span> index<span class="token punctuation">.</span>js</span>
<span class="line">                        <span class="token operator">|</span><span class="token operator">--</span> index<span class="token punctuation">.</span>module<span class="token punctuation">.</span>scss</span>
<span class="line">                <span class="token operator">|</span><span class="token operator">--</span> reducer<span class="token punctuation">.</span>js</span>
<span class="line">                <span class="token operator">|</span><span class="token operator">--</span> saga<span class="token punctuation">.</span>js</span>
<span class="line">                <span class="token operator">|</span><span class="token operator">--</span> index<span class="token punctuation">.</span>js</span>
<span class="line">                <span class="token operator">|</span><span class="token operator">--</span> index<span class="token punctuation">.</span>module<span class="token punctuation">.</span>scss</span>
<span class="line">            <span class="token operator">|</span><span class="token operator">--</span> buyer</span>
<span class="line">                <span class="token operator">|</span><span class="token operator">--</span> index<span class="token punctuation">.</span>js</span>
<span class="line">            <span class="token operator">|</span><span class="token operator">--</span> index<span class="token punctuation">.</span>js</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>多页面目录结构</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    my<span class="token operator">-</span>vue<span class="token operator">-</span>test<span class="token operator">:</span><span class="token punctuation">.</span></span>
<span class="line">    │  <span class="token punctuation">.</span>browserslistrc</span>
<span class="line">    │  <span class="token punctuation">.</span>env<span class="token punctuation">.</span>production</span>
<span class="line">    │  <span class="token punctuation">.</span>eslintrc<span class="token punctuation">.</span>js</span>
<span class="line">    │  <span class="token punctuation">.</span>gitignore</span>
<span class="line">    │  babel<span class="token punctuation">.</span>config<span class="token punctuation">.</span>js</span>
<span class="line">    │  <span class="token keyword">package</span><span class="token operator">-</span>lock<span class="token punctuation">.</span>json</span>
<span class="line">    │  <span class="token keyword">package</span><span class="token punctuation">.</span>json</span>
<span class="line">    │  <span class="token constant">README</span><span class="token punctuation">.</span>md</span>
<span class="line">    │  vue<span class="token punctuation">.</span>config<span class="token punctuation">.</span>js</span>
<span class="line">    │  yarn<span class="token operator">-</span>error<span class="token punctuation">.</span>log</span>
<span class="line">    │  yarn<span class="token punctuation">.</span>lock</span>
<span class="line">    │</span>
<span class="line">    ├─<span class="token keyword">public</span></span>
<span class="line">    │      favicon<span class="token punctuation">.</span>ico</span>
<span class="line">    │      index<span class="token punctuation">.</span>html</span>
<span class="line">    │</span>
<span class="line">    └─src</span>
<span class="line">        ├─apis <span class="token comment">//接口文件根据页面或实例模块化</span></span>
<span class="line">        │      index<span class="token punctuation">.</span>js</span>
<span class="line">        │      login<span class="token punctuation">.</span>js</span>
<span class="line">        │</span>
<span class="line">        ├─components <span class="token comment">//全局公共组件</span></span>
<span class="line">        │  └─header</span>
<span class="line">        │          index<span class="token punctuation">.</span>less</span>
<span class="line">        │          index<span class="token punctuation">.</span>vue</span>
<span class="line">        │</span>
<span class="line">        ├─config <span class="token comment">//配置（环境变量配置不同passid等）</span></span>
<span class="line">        │      env<span class="token punctuation">.</span>js</span>
<span class="line">        │      index<span class="token punctuation">.</span>js</span>
<span class="line">        │</span>
<span class="line">        ├─contant <span class="token comment">//常量</span></span>
<span class="line">        │      index<span class="token punctuation">.</span>js</span>
<span class="line">        │</span>
<span class="line">        ├─images <span class="token comment">//图片</span></span>
<span class="line">        │      logo<span class="token punctuation">.</span>png</span>
<span class="line">        │</span>
<span class="line">        ├─pages <span class="token comment">//多页面vue项目，不同的实例</span></span>
<span class="line">        │  ├─index <span class="token comment">//主实例</span></span>
<span class="line">        │  │  │  index<span class="token punctuation">.</span>js</span>
<span class="line">        │  │  │  index<span class="token punctuation">.</span>vue</span>
<span class="line">        │  │  │  main<span class="token punctuation">.</span>js</span>
<span class="line">        │  │  │  router<span class="token punctuation">.</span>js</span>
<span class="line">        │  │  │  store<span class="token punctuation">.</span>js</span>
<span class="line">        │  │  │</span>
<span class="line">        │  │  ├─components <span class="token comment">//业务组件</span></span>
<span class="line">        │  │  └─pages <span class="token comment">//此实例中的各个路由</span></span>
<span class="line">        │  │      ├─amenu</span>
<span class="line">        │  │      │      index<span class="token punctuation">.</span>vue</span>
<span class="line">        │  │      │</span>
<span class="line">        │  │      └─bmenu</span>
<span class="line">        │  │              index<span class="token punctuation">.</span>vue</span>
<span class="line">        │  │</span>
<span class="line">        │  └─login <span class="token comment">//另一个实例</span></span>
<span class="line">        │          index<span class="token punctuation">.</span>js</span>
<span class="line">        │          index<span class="token punctuation">.</span>vue</span>
<span class="line">        │          main<span class="token punctuation">.</span>js</span>
<span class="line">        │</span>
<span class="line">        ├─scripts <span class="token comment">//包含各种常用配置，工具函数</span></span>
<span class="line">        │  │  map<span class="token punctuation">.</span>js</span>
<span class="line">        │  │</span>
<span class="line">        │  └─utils</span>
<span class="line">        │          helper<span class="token punctuation">.</span>js</span>
<span class="line">        │</span>
<span class="line">        ├─store <span class="token comment">//vuex仓库</span></span>
<span class="line">        │  │  index<span class="token punctuation">.</span>js</span>
<span class="line">        │  │</span>
<span class="line">        │  ├─index</span>
<span class="line">        │  │      actions<span class="token punctuation">.</span>js</span>
<span class="line">        │  │      getters<span class="token punctuation">.</span>js</span>
<span class="line">        │  │      index<span class="token punctuation">.</span>js</span>
<span class="line">        │  │      mutation<span class="token operator">-</span>types<span class="token punctuation">.</span>js</span>
<span class="line">        │  │      mutations<span class="token punctuation">.</span>js</span>
<span class="line">        │  │      state<span class="token punctuation">.</span>js</span>
<span class="line">        │  │</span>
<span class="line">        │  └─user</span>
<span class="line">        │          actions<span class="token punctuation">.</span>js</span>
<span class="line">        │          getters<span class="token punctuation">.</span>js</span>
<span class="line">        │          index<span class="token punctuation">.</span>js</span>
<span class="line">        │          mutation<span class="token operator">-</span>types<span class="token punctuation">.</span>js</span>
<span class="line">        │          mutations<span class="token punctuation">.</span>js</span>
<span class="line">        │          state<span class="token punctuation">.</span>js</span>
<span class="line">        │</span>
<span class="line">        └─styles <span class="token comment">//样式统一配置</span></span>
<span class="line">            │  components<span class="token punctuation">.</span>less</span>
<span class="line">            │</span>
<span class="line">            ├─animation</span>
<span class="line">            │      index<span class="token punctuation">.</span>less</span>
<span class="line">            │      slide<span class="token punctuation">.</span>less</span>
<span class="line">            │</span>
<span class="line">            ├─base</span>
<span class="line">            │      index<span class="token punctuation">.</span>less</span>
<span class="line">            │      style<span class="token punctuation">.</span>less</span>
<span class="line">            │      <span class="token keyword">var</span><span class="token punctuation">.</span>less</span>
<span class="line">            │      widget<span class="token punctuation">.</span>less</span>
<span class="line">            │</span>
<span class="line">            └─common</span>
<span class="line">                    index<span class="token punctuation">.</span>less</span>
<span class="line">                    reset<span class="token punctuation">.</span>less</span>
<span class="line">                    style<span class="token punctuation">.</span>less</span>
<span class="line">                    transition<span class="token punctuation">.</span>less</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>小结</strong></p><p>项目的目录结构很重要，因为目录结构能体现很多东西，怎么规划目录结构可能每个人有自己的理解，但是按照一定的规范去进行目录的设计，能让项目整个架构看起来更为简洁，更加易用</p>`,35),i=[l];function c(t,o){return a(),n("div",null,i)}const r=s(p,[["render",c],["__file","51-51-说下你的vue项目的目录结构-如果是大型项目你该怎么划分结构和划分组件呢.html.vue"]]),u=JSON.parse('{"path":"/Vue/51-51-%E8%AF%B4%E4%B8%8B%E4%BD%A0%E7%9A%84vue%E9%A1%B9%E7%9B%AE%E7%9A%84%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84-%E5%A6%82%E6%9E%9C%E6%98%AF%E5%A4%A7%E5%9E%8B%E9%A1%B9%E7%9B%AE%E4%BD%A0%E8%AF%A5%E6%80%8E%E4%B9%88%E5%88%92%E5%88%86%E7%BB%93%E6%9E%84%E5%92%8C%E5%88%92%E5%88%86%E7%BB%84%E4%BB%B6%E5%91%A2.html","title":"说下你的vue项目的目录结构 如果是大型项目你该怎么划分结构和划分组件呢","lang":"zh-CN","frontmatter":{"title":"说下你的vue项目的目录结构 如果是大型项目你该怎么划分结构和划分组件呢","description":"51 说下你的vue项目的目录结构，如果是大型项目你该怎么划分结构和划分组件呢 为什么要划分 使用vue构建项目，项目结构清晰会提高开发效率，熟悉项目的各种配置同样会让开发效率更高 在划分项目结构的时候，需要遵循一些基本的原则： 文件夹和文件夹内部文件的语义一致性 单一入口/出口 就近原则，紧耦合的文件应该放到一起，且应以相对路径引用 公共的文件应该以...","head":[["meta",{"property":"og:url","content":"https://interview.leeguoo.com/Vue/51-51-%E8%AF%B4%E4%B8%8B%E4%BD%A0%E7%9A%84vue%E9%A1%B9%E7%9B%AE%E7%9A%84%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84-%E5%A6%82%E6%9E%9C%E6%98%AF%E5%A4%A7%E5%9E%8B%E9%A1%B9%E7%9B%AE%E4%BD%A0%E8%AF%A5%E6%80%8E%E4%B9%88%E5%88%92%E5%88%86%E7%BB%93%E6%9E%84%E5%92%8C%E5%88%92%E5%88%86%E7%BB%84%E4%BB%B6%E5%91%A2.html"}],["meta",{"property":"og:site_name","content":"前端面试题集锦"}],["meta",{"property":"og:title","content":"说下你的vue项目的目录结构 如果是大型项目你该怎么划分结构和划分组件呢"}],["meta",{"property":"og:description","content":"51 说下你的vue项目的目录结构，如果是大型项目你该怎么划分结构和划分组件呢 为什么要划分 使用vue构建项目，项目结构清晰会提高开发效率，熟悉项目的各种配置同样会让开发效率更高 在划分项目结构的时候，需要遵循一些基本的原则： 文件夹和文件夹内部文件的语义一致性 单一入口/出口 就近原则，紧耦合的文件应该放到一起，且应以相对路径引用 公共的文件应该以..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-07-06T04:15:51.000Z"}],["meta",{"property":"article:modified_time","content":"2026-07-06T04:15:51.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"说下你的vue项目的目录结构 如果是大型项目你该怎么划分结构和划分组件呢\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2026-07-06T04:15:51.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":3,"title":"为什么要划分","slug":"为什么要划分","link":"#为什么要划分","children":[]},{"level":3,"title":"目录结构","slug":"目录结构","link":"#目录结构","children":[]}],"git":{"updatedTime":1783311351000,"contributors":[{"name":"leeguooooo","email":"guoli@zhihu.com","commits":2}]},"autoDesc":true,"filePathRelative":"Vue/51-51-说下你的vue项目的目录结构-如果是大型项目你该怎么划分结构和划分组件呢.md","excerpt":"\\n<h3>为什么要划分</h3>\\n<p>使用<code>vue</code>构建项目，项目结构清晰会提高开发效率，熟悉项目的各种配置同样会让开发效率更高</p>\\n<p>在划分项目结构的时候，需要遵循一些基本的原则：</p>\\n<ul>\\n<li>文件夹和文件夹内部文件的语义一致性</li>\\n<li>单一入口/出口</li>\\n<li>就近原则，紧耦合的文件应该放到一起，且应以相对路径引用</li>\\n<li>公共的文件应该以绝对路径的方式从根目录引用</li>\\n<li><code>/src</code> 外的文件不应该被引入</li>\\n</ul>\\n<p><strong>文件夹和文件夹内部文件的语义一致性</strong></p>"}');export{r as comp,u as data};
