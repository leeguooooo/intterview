import{_ as e}from"./error-BYO_3BXn.js";import{_ as s,c as a,o as n,a as p}from"./app-f2Cpj3V4.js";const t="/images/s_poetries_work_gitee_2019_12_38.png",o="/images/s_poetries_work_gitee_2019_12_39.png",r="/images/s_poetries_work_gitee_2019_12_41.png",i="/images/s_poetries_work_gitee_2019_12_42.png",l={},c=p('<p>原文链接: <a href="https://interview.poetries.top/fe-base-docs/http-protocol/advance/20-%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E4%B8%8E%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86.html" target="_blank" rel="noopener noreferrer">https://interview.poetries.top/fe-base-docs/http-protocol/advance/20-%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E4%B8%8E%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86.html</a></p><p>由于 HTTPS、TLS 都运行在计算机上，所以“密钥”就是一长串的数字，但约定俗成的度量单位是“位”（bit），而不是“字节”（byte）。比如，说密钥长度是 128，就是 16 字节的二进制串，密钥长度 1024，就是 128 字节的二进制串。</p><p>按照密钥的使用方式，加密可以分为两大类：对称加密和非对称加密。</p><h2 id="对称加密" tabindex="-1"><a class="header-anchor" href="#对称加密"><span>对称加密</span></a></h2><p>“对称加密”很好理解，就是指加密和解密时使用的密钥都是同一个，是“对称”的。只要保证了密钥的安全，那整个通信过程就可以说具有了机密性。</p><p>举个例子，你想要登录某网站，只要事先和它约定好使用一个对称密码，通信过程中传输的全是用密钥加密后的密文，只有你和网站才能解密。黑客即使能够窃听，看到的也只是乱码，因为没有密钥无法解出明文，所以就实现了机密性。</p><p><img src="'+t+`" alt=""></p><p>TLS 里有非常多的对称加密算法可供选择，比如 RC4、DES、3DES、AES、ChaCha20 等，但前三种算法都被认为是不安全的，通常都禁止使用，目前常用的只有 AES 和 ChaCha20。</p><p>AES 的意思是“高级加密标准”（Advanced Encryption Standard），密钥长度可以是 128、192 或 256。它是 DES 算法的替代者，安全强度很高，性能也很好，而且有的硬件还会做特殊优化，所以非常流行，是应用最广泛的对称加密算法。</p><p>ChaCha20 是 Google 设计的另一种加密算法，密钥长度固定为 256 位，纯软件运行性能要超过 AES，曾经在移动客户端上比较流行，但 ARMv8 之后也加入了 AES 硬件优化，所以现在不再具有明显的优势，但仍然算得上是一个不错算法。</p><h2 id="加密分组模式" tabindex="-1"><a class="header-anchor" href="#加密分组模式"><span>加密分组模式</span></a></h2><p>对称算法还有一个“分组模式”的概念，它可以让算法用固定长度的密钥加密任意长度的明文，把小秘密（即密钥）转化为大秘密（即密文）。</p><p>最早有 ECB、CBC、CFB、OFB 等几种分组模式，但都陆续被发现有安全漏洞，所以现在基本都不怎么用了。最新的分组模式被称为 AEAD（Authenticated Encryption with Associated Data），在加密的同时增加了认证的功能，常用的是 GCM、CCM 和 Poly1305。</p><p>把上面这些组合起来，就可以得到 TLS 密码套件中定义的对称加密算法。</p><p>比如，AES128-GCM，意思是密钥长度为 128 位的 AES 算法，使用的分组模式是 GCM；ChaCha20-Poly1305 的意思是 ChaCha20 算法，使用的分组模式是 Poly1305。</p><p>你可以用实验环境的 URI“/24-1”来测试 OpenSSL 里的 AES128-CBC，在 URI 后用参数“key”“plain”输入密钥和明文，服务器会在响应报文里输出加密解密的结果</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    <span class="token literal-property property">https</span><span class="token operator">:</span><span class="token operator">/</span><span class="token operator">/</span>www<span class="token punctuation">.</span>chrono<span class="token punctuation">.</span>com<span class="token operator">/</span><span class="token number">24</span><span class="token operator">-</span><span class="token number">1</span><span class="token operator">?</span>key<span class="token operator">=</span><span class="token number">123456</span></span>
<span class="line">     </span>
<span class="line">    algo  <span class="token operator">=</span> aes_128_cbc</span>
<span class="line">    plain <span class="token operator">=</span> hello openssl</span>
<span class="line">    enc   <span class="token operator">=</span> 93a024a94083bc39fb2c2b9f5ce27c09</span>
<span class="line">    dec   <span class="token operator">=</span> hello openssl</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="非对称加密" tabindex="-1"><a class="header-anchor" href="#非对称加密"><span>非对称加密</span></a></h2><p>对称加密看上去好像完美地实现了机密性，但其中有一个很大的问题：如何把密钥安全地传递给对方，术语叫“密钥交换”。</p><p>因为在对称加密算法中只要持有密钥就可以解密。如果你和网站约定的密钥在传递途中被黑客窃取，那他就可以在之后随意解密收发的数据，通信过程也就没有机密性可言了。</p><p>这个问题该怎么解决呢？</p><p>你或许会说：“把密钥再加密一下发过去就好了”，但传输“加密密钥的密钥”又成了新问题。这就像是“鸡生蛋、蛋生鸡”，可以无限递归下去。只用对称加密算法，是绝对无法解决密钥交换的问题的。</p><p>所以，就出现了非对称加密（也叫公钥加密算法）。</p><p>它有两个密钥，一个叫“公钥”（public key），一个叫“私钥”（private key）。两个密钥是不同的，“不对称”，公钥可以公开给任何人使用，而私钥必须严格保密。</p><p>公钥和私钥有个特别的“单向”性，虽然都可以用来加密解密，但公钥加密后只能用私钥解密，反过来，私钥加密后也只能用公钥解密。</p><p>非对称加密可以解决“密钥交换”的问题。网站秘密保管私钥，在网上任意分发公钥，你想要登录网站只要用公钥加密就行了，密文只能由私钥持有者才能解密。而黑客因为没有私钥，所以就无法破解密文</p><p><img src="`+o+'" alt=""></p><p>非对称加密算法的设计要比对称算法难得多，在 TLS 里只有很少的几种，比如 DH、DSA、RSA、ECC 等。</p><p>RSA 可能是其中最著名的一个，几乎可以说是非对称加密的代名词，它的安全性基于“整数分解”的数学难题，使用两个超大素数的乘积作为生成密钥的材料，想要从公钥推算出私钥是非常困难的。</p><p>10 年前 RSA 密钥的推荐长度是 1024，但随着计算机运算能力的提高，现在 1024 已经不安全，普遍认为至少要 2048 位。</p><p>ECC（Elliptic Curve Cryptography）是非对称加密里的“后起之秀”，它基于“椭圆曲线离散对数”的数学难题，使用特定的曲线方程和基点生成公钥和私钥，子算法 ECDHE 用于密钥交换，ECDSA 用于数字签名。</p><p>目前比较常用的两个曲线是 P-256（secp256r1，在 OpenSSL 称为 prime256v1）和 x25519。P-256 是 NIST（美国国家标准技术研究所）和 NSA（美国国家安全局）推荐使用的曲线，而 x25519 被认为是最安全、最快速的曲线。</p><p>ECC 名字里的“椭圆”经常会引起误解，其实它的曲线并不是椭圆形，只是因为方程很类似计算椭圆周长的公式，实际的形状更像抛物线，比如下面的图就展示了两个简单的椭圆曲线</p><p><img src="'+e+`" alt=""><br><p>出错的图片链接: <a href="https://s.poetries.work/gitee/2019/12/40.png" target="_blank">https://s.poetries.work/gitee/2019/12/40.png</a></p></p><p>比起 RSA，ECC 在安全强度和性能上都有明显的优势。160 位的 ECC 相当于 1024 位的 RSA，而 224 位的 ECC 则相当于 2048 位的 RSA。因为密钥短，所以相应的计算量、消耗的内存和带宽也就少，加密解密的性能就上去了，对于现在的移动互联网非常有吸引力</p><h2 id="混合加密" tabindex="-1"><a class="header-anchor" href="#混合加密"><span>混合加密</span></a></h2><p>看到这里，你是不是认为可以抛弃对称加密，只用非对称加密来实现机密性呢？</p><p>很遗憾，虽然非对称加密没有“密钥交换”的问题，但因为它们都是基于复杂的数学难题，运算速度很慢，即使是 ECC 也要比 AES 差上好几个数量级。如果仅用非对称加密，虽然保证了安全，但通信速度有如乌龟、蜗牛，实用性就变成了零</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">    aes_128_cbc enc<span class="token operator">/</span>dec <span class="token number">1000</span> <span class="token literal-property property">times</span> <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">.</span>97ms<span class="token punctuation">,</span> <span class="token number">13</span><span class="token punctuation">.</span>11MB<span class="token operator">/</span>s</span>
<span class="line">     </span>
<span class="line">    rsa_1024 enc<span class="token operator">/</span>dec <span class="token number">1000</span> <span class="token literal-property property">times</span> <span class="token operator">:</span> <span class="token number">138</span><span class="token punctuation">.</span>59ms<span class="token punctuation">,</span> <span class="token number">93</span><span class="token punctuation">.</span>80KB<span class="token operator">/</span>s</span>
<span class="line">    rsa_1024<span class="token operator">/</span>aes ratio <span class="token operator">=</span> <span class="token number">143.17</span></span>
<span class="line">     </span>
<span class="line">    rsa_2048 enc<span class="token operator">/</span>dec <span class="token number">1000</span> <span class="token literal-property property">times</span> <span class="token operator">:</span> <span class="token number">840</span><span class="token punctuation">.</span>35ms<span class="token punctuation">,</span> <span class="token number">15</span><span class="token punctuation">.</span>47KB<span class="token operator">/</span>s</span>
<span class="line">    rsa_2048<span class="token operator">/</span>aes ratio <span class="token operator">=</span> <span class="token number">868.13</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，RSA 的运算速度是非常慢的，2048 位的加解密大约是 15KB/S（微秒或毫秒级），而 AES128 则是 13MB/S（纳秒级），差了几百倍。</p><p>那么，是不是能够把对称加密和非对称加密结合起来呢，两者互相取长补短，即能高效地加密解密，又能安全地密钥交换。</p><p>这就是现在 TLS 里使用的混合加密方式，其实说穿了也很简单：</p><p>在通信刚开始的时候使用非对称算法，比如 RSA、ECDHE，首先解决密钥交换的问题。</p><p>然后用随机数产生对称算法使用的“会话密钥”（session key），再用公钥加密。因为会话密钥很短，通常只有 16 字节或 32 字节，所以慢一点也无所谓。</p><p>对方拿到密文后用私钥解密，取出会话密钥。这样，双方就实现了对称密钥的安全交换，后续就不再使用非对称加密，全都使用对称加密。</p><p><img src="`+r+'" alt=""></p><p>这样混合加密就解决了对称加密算法的密钥交换问题，而且安全和性能兼顾，完美地实现了机密性。</p><p>不过这只是“万里长征的第一步”，后面还有完整性、身份认证、不可否认等特性没有实现，所以现在的通信还不是绝对安全</p><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><ul><li>加密算法的核心思想是“把一个小秘密（密钥）转化为一个大秘密（密文消息）”，守住了小秘密，也就守住了大秘密；</li><li>对称加密只使用一个密钥，运算速度快，密钥必须保密，无法做到安全的密钥交换，常用的有 AES 和 ChaCha20；</li><li>非对称加密使用两个密钥：公钥和私钥，公钥可以任意分发而私钥保密，解决了密钥交换问题但速度慢，常用的有 RSA 和 ECC；</li><li>把对称加密和非对称加密结合起来就得到了“又好又快”的混合加密，也就是 TLS 里使用的加密方式</li></ul><p><img src="'+i+'" alt=""></p><p>阅读全文</p>',52),E=[c];function d(A,m){return n(),a("div",null,E)}const u=s(l,[["render",d],["__file","http 基础-20-对称加密与非对称加密.html.vue"]]),g=JSON.parse('{"path":"/http%20%E5%9F%BA%E7%A1%80-20-%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E4%B8%8E%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86.html","title":"","lang":"zh-CN","frontmatter":{"description":"原文链接: https://interview.poetries.top/fe-base-docs/http-protocol/advance/20-%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E4%B8%8E%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86.html 由于 HTT...","head":[["meta",{"property":"og:url","content":"https://interview.leeguoo.com/http%20%E5%9F%BA%E7%A1%80-20-%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E4%B8%8E%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86.html"}],["meta",{"property":"og:site_name","content":"前端面试题集锦"}],["meta",{"property":"og:description","content":"原文链接: https://interview.poetries.top/fe-base-docs/http-protocol/advance/20-%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E4%B8%8E%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86.html 由于 HTT..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://interview.leeguoo.com/images/s_poetries_work_gitee_2019_12_38.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-06T05:59:31.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-06T05:59:31.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"https://interview.leeguoo.com/images/s_poetries_work_gitee_2019_12_38.png\\",\\"https://interview.leeguoo.com/images/s_poetries_work_gitee_2019_12_39.png\\",\\"https://interview.leeguoo.com/images/error.webp\\",\\"https://interview.leeguoo.com/images/s_poetries_work_gitee_2019_12_41.png\\",\\"https://interview.leeguoo.com/images/s_poetries_work_gitee_2019_12_42.png\\"],\\"dateModified\\":\\"2024-06-06T05:59:31.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"对称加密","slug":"对称加密","link":"#对称加密","children":[]},{"level":2,"title":"加密分组模式","slug":"加密分组模式","link":"#加密分组模式","children":[]},{"level":2,"title":"非对称加密","slug":"非对称加密","link":"#非对称加密","children":[]},{"level":2,"title":"混合加密","slug":"混合加密","link":"#混合加密","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]}],"git":{"updatedTime":1717653571000,"contributors":[{"name":"guoli","email":"guoli@zhihu.com","commits":1}]},"autoDesc":true,"filePathRelative":"http 基础-20-对称加密与非对称加密.md","excerpt":"<p>原文链接: <a href=\\"https://interview.poetries.top/fe-base-docs/http-protocol/advance/20-%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E4%B8%8E%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://interview.poetries.top/fe-base-docs/http-protocol/advance/20-%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E4%B8%8E%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86.html</a></p>"}');export{u as comp,g as data};
