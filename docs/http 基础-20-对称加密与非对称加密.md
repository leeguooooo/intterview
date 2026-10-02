---
title: "http 基础 20 对称加密与非对称加密"
---

# 对称加密、非对称加密与混合加密

## 核心要点

| 方案 | 怎么用钥匙 | 代表算法 | 强项 | 短板 |
| --- | --- | --- | --- | --- |
| 对称加密 | 加密、解密共用一把密钥 | AES-128/256-GCM、ChaCha20-Poly1305 | 快，有 CPU 指令加速 | 双方怎么拿到同一把密钥？不安全的网络上没法直接传 |
| 非对称加密（公钥密码） | 公钥对外公开，私钥自己留着，两者成对 | RSA-2048、ECDHE、ECDSA | 不用事先共享秘密，天然解决“送钥匙”问题 | 慢，实测比 AES 慢上千倍 |
| 混合加密 | 握手时用非对称手段敲定一把会话密钥，之后全程对称加密 | TLS 的工作方式 | 安全和速度都要 | 只解决了机密性，完整性、身份认证还得靠别的机制 |

背下来就够用的几条：

- 加密的本质是用一个**短秘密（密钥）**守护一段**长秘密（密文）**：只要密钥不泄露，密文就是安全的。
- 对称加密卡在“密钥交换”上：想把密钥安全送过去，就得先加密它，而加密它又要另一把密钥，永远绕不出来。
- 公钥和私钥是单向配对的：公钥加密的东西只有对应的私钥能解开。反过来用私钥处理、公钥验证，在 RSA 里就是数字签名的原理。
- RSA 的安全性来自“大整数难以分解”，ECC 来自“椭圆曲线上的离散对数难以求解”。同等强度下 ECC 的密钥短得多：160 位 ECC 约等于 1024 位 RSA，224 位 ECC 约等于 2048 位 RSA。
- TLS 的套路是两步走：先用非对称算法（现在基本都是 ECDHE）协商出会话密钥，再用这把会话密钥做对称加密。
- TLS 1.3 去掉了 RSA 密钥交换和静态 DH：完整握手一律用临时（EC）DHE，带前向安全；会话恢复走 PSK，可以选配合 (EC)DHE 的 psk_dhe_ke，也可以选不带前向安全的纯 psk_ke。

## 先说清楚“密钥长度”

在计算机里，密钥其实就是一串随机的二进制数。业界习惯用**位（bit）**而不是字节来报它的长度：

| 说法 | 换算成字节 |
| --- | --- |
| 128 位密钥 | 16 字节 |
| 256 位密钥 | 32 字节 |
| 1024 位密钥 | 128 字节 |
| 2048 位密钥 | 256 字节 |

所以听到“AES-128”“RSA-2048”，后面的数字指的就是位数。注意不同类型的算法之间不能直接比位数：128 位的 AES 密钥远比 1024 位的 RSA 密钥更难破解，后面会讲原因。

根据密钥怎么用，加密算法分成两大派：对称加密和非对称加密。

## 对称加密：一把钥匙开一把锁

对称加密里，“锁上”和“打开”用的是同一把密钥。只要这把密钥只有通信双方知道，传输的内容就有了机密性。

换个场景来理解：一家咖啡店的点单系统和后台服务器提前约好了一把密钥。点单系统发出的每条订单都先用这把密钥加密，网络上跑的全是乱码。就算有人在中间抓包，没有密钥也还原不出订单内容，只有后台能解开。

![对称加密示意：发送方和接收方用同一把密钥 K 完成加密和解密，窃听者只能看到中间的密文](/images/rewrite/http-crypto/symmetric.webp)

### TLS 里能用的对称算法

历史上 TLS 支持过不少对称算法：RC4、DES、3DES、AES、ChaCha20 等。其中 RC4、DES、3DES 已经被证明不够安全，现代配置一律禁用，真正在用的只剩两个：

**AES（Advanced Encryption Standard，高级加密标准）**

- 取代 DES 的新一代标准，密钥长度可选 128、192、256 位。
- 安全性高、速度快，而且 x86 有 AES-NI 指令、ARMv8 有 Crypto 扩展，硬件直接加速。
- 是目前用得最多的对称算法，没有之一。

**ChaCha20**

- Google 主导推广的流密码，密钥固定 256 位。
- 在没有 AES 硬件加速的设备上，纯软件实现比 AES 快，所以早年在手机上很受欢迎。
- ARMv8 普及以后手机芯片也有了 AES 加速，ChaCha20 的速度优势基本没了，但它依然是一个安全可靠的备选，TLS 1.3 也把它列为标准套件之一。

> 补充：严格说，对称算法还能细分为**分组密码**（block cipher，一次处理固定长度的一块，比如 DES、AES 每块 16 字节）和**流密码**（stream cipher，生成密钥流逐字节异或，比如 RC4、ChaCha20）。

### 分组模式：让固定大小的算法处理任意长度的数据

AES 这样的分组密码每次只能加密 16 字节。真实数据有长有短，就需要一套规则把数据切块、并决定块与块之间怎么关联，这就是**分组模式**（也叫工作模式）。它让一把固定长度的密钥可以保护任意长度的明文。

| 模式 | 现状 |
| --- | --- |
| ECB | 相同的明文块加密出相同的密文块，图片加密后轮廓还看得出来，完全不安全 |
| CBC | 曾经是主力，但只加密、不防篡改，在 TLS 里先后出过 BEAST、Lucky13、POODLE 等攻击，TLS 1.3 已移除 |
| CFB、OFB | 同样没有内置完整性校验，基本不再用于 TLS |
| **AEAD 类**：GCM、CCM 等 | 当前主流，**加密的同时附带认证**，数据被改过一个比特都能发现 |

AEAD 的全称是 Authenticated Encryption with Associated Data，即“带关联数据的认证加密”。“关联数据”指那些不需要保密、但要防篡改的信息（比如 TLS 记录的头部），它们参与认证但不加密。

把算法、密钥长度和模式拼在一起，就是 TLS 密码套件里看到的对称部分：

- `AES128-GCM`（在 TLS 1.3 里写作 `TLS_AES_128_GCM_SHA256`）：128 位 AES，采用 GCM 模式。
- `ChaCha20-Poly1305`：ChaCha20 负责加密，Poly1305 负责生成认证码，两者组合成一个 AEAD 算法。

> 纠正一个常见说法：Poly1305 并不是 ChaCha20 的“分组模式”。ChaCha20 本身是流密码，不需要分组模式；Poly1305 是一个消息认证码（MAC）算法，和 ChaCha20 搭配后才构成 AEAD。

### 动手试一下

下面这段 Node.js 代码分别用老式的 AES-128-CBC 和推荐的 AES-256-GCM 加密同一条订单备注，并演示 GCM 如何发现篡改（Node 18+ 可直接运行，保存为 `.mjs`）：

```js
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

// 一份订单备注，作为要保护的明文
const memo = '订单 #8812：明早 9 点前送达';

// ---------- 老式写法：AES-128-CBC（只加密、不认证） ----------
const cbcKey = scryptSync('coffee-shop-secret', 'salt-01', 16); // 16 字节 = 128 位
const cbcIv = randomBytes(16);
const c1 = createCipheriv('aes-128-cbc', cbcKey, cbcIv);
const cbcCipher = Buffer.concat([c1.update(memo, 'utf8'), c1.final()]);
const d1 = createDecipheriv('aes-128-cbc', cbcKey, cbcIv);
const cbcPlain = Buffer.concat([d1.update(cbcCipher), d1.final()]).toString('utf8');
console.log('[CBC] 密文:', cbcCipher.toString('hex'));
console.log('[CBC] 解密:', cbcPlain);

// ---------- 推荐写法：AES-256-GCM（AEAD，加密 + 认证） ----------
const gcmKey = randomBytes(32);   // 256 位
const nonce = randomBytes(12);    // GCM 推荐 12 字节 nonce，同一密钥下绝不能重复
const aad = Buffer.from('shop-id=42'); // 关联数据：不加密，但受完整性保护

const enc = createCipheriv('aes-256-gcm', gcmKey, nonce);
enc.setAAD(aad);
const gcmCipher = Buffer.concat([enc.update(memo, 'utf8'), enc.final()]);
const tag = enc.getAuthTag();     // 16 字节认证标签
console.log('[GCM] 密文:', gcmCipher.toString('hex'), ' tag:', tag.toString('hex'));

function openGcm(cipherBuf, authTag) {
  const dec = createDecipheriv('aes-256-gcm', gcmKey, nonce);
  dec.setAAD(aad);
  dec.setAuthTag(authTag);
  return Buffer.concat([dec.update(cipherBuf), dec.final()]).toString('utf8');
}
console.log('[GCM] 解密:', openGcm(gcmCipher, tag));

// 篡改一个字节，GCM 会直接拒绝
const forged = Buffer.from(gcmCipher);
forged[0] ^= 0x01;
try {
  openGcm(forged, tag);
} catch (e) {
  console.log('[GCM] 篡改后解密失败:', e.message);
}
```

某次运行的输出。CBC 的密钥由 scryptSync 从固定口令派生，每次都一样；但 CBC 的 IV、GCM 的密钥和 nonce 每次都随机生成，所以每次运行的密文都不同：

```text
[CBC] 密文: a6966c6a89061af267bdcb1f0e640296475f8e58c1d8e78ca7912588e5e13b13734fef998f472eef6c9a7ac2099c8510
[CBC] 解密: 订单 #8812：明早 9 点前送达
[GCM] 密文: 64084325dc088d5ddce1fba12e54038b419fc74996ce925307f2e7efe8d557a830e41ac1  tag: 0014e1770b3f5fec539a81ab64a97a0b
[GCM] 解密: 订单 #8812：明早 9 点前送达
[GCM] 篡改后解密失败: Unsupported state or unable to authenticate data
```

能看出两点区别：CBC 密文被补齐到 16 字节的整数倍（这里是 48 字节），GCM 不需要补齐，密文和明文等长，另外多出一个认证标签；CBC 密文被改了解密方未必能察觉，GCM 则会直接报错。

也可以用 OpenSSL 命令行做同样的事：

```bash
echo -n 'order 8812' | openssl enc -aes-128-cbc -K 00112233445566778899aabbccddeeff -iv 0102030405060708090a0b0c0d0e0f10 | xxd -p
```

## 非对称加密：把锁发给所有人，钥匙自己留着

### 对称加密的死结：密钥怎么送过去

对称加密看起来很完美，但前提是双方已经持有同一把密钥。这把密钥最初是怎么到对方手里的？这个问题叫**密钥交换**。

对称算法里谁拿到密钥谁就能解密。如果咖啡店和后台约定密钥的那条消息被人截获，之后所有订单对攻击者都是透明的，加密形同虚设。

直觉上的解法是“把密钥也加密一下再发”。可加密这把密钥又需要另一把密钥，那一把又怎么送？问题只是被往后推了一层，可以无穷无尽地套下去。结论很明确：**单靠对称加密，永远解决不了密钥交换**。

### 公钥和私钥

非对称加密（也叫公钥密码学）换了一个思路：每一方生成**一对**彼此关联但不相同的密钥。

- **公钥**（public key）：可以随便发，挂在网站上、放进证书里都没问题。
- **私钥**（private key）：只保存在持有者本地，绝不外传。

这对密钥是“单向”配合的：用公钥加密的数据，只有配对的私钥能解开；公钥本身解不开自己加密的东西。在 RSA 中反方向也成立，用私钥处理过的数据可以用公钥还原，这正是数字签名的基础（实际的签名是对消息摘要做签名，并且有专门的填充方案，不等于“用私钥加密”）。

回到密钥交换的问题：网站保管好私钥，把公钥发给所有访客。任何访客想发秘密给网站，就用公钥加密，网络上即使有人截到密文，没有私钥也解不开。“送钥匙”这件事就不再需要一个事先存在的安全通道了。

![非对称加密示意：许多访客都持有同一份公钥用来加密，只有持有私钥的网站能解密](/images/rewrite/http-crypto/asymmetric.webp)

### 常见的非对称算法

非对称算法要依托严格的数学难题，设计难度远高于对称算法，所以 TLS 里能见到的屈指可数：DH、DSA、RSA、ECC 这几类。

**RSA**

- 名气最大，常被当作非对称加密的代名词。
- 安全性建立在**大整数分解**难题上：把两个很大的素数相乘很容易，但只给出乘积，想分解回那两个素数极其困难，所以从公钥推不出私钥。
- 密钥长度要跟着算力增长：十几年前 1024 位还被认为够用，现在已不安全，**至少 2048 位**，追求更长期安全可以选 3072 位。
- RSA 比较特殊，同一套算法既能做密钥交换（客户端用公钥加密预主密钥），也能做签名认证。

> 现代做法：TLS 1.3（RFC 8446，2018 年发布）把 RSA 密钥交换整个删掉了。原因是它没有**前向安全**（Forward Secrecy）：攻击者只要先把加密流量录下来，日后一旦拿到服务器私钥，就能把过去所有会话一次性解开。在 TLS 1.3 里，RSA 只用于**签名**，不再参与生成会话密钥：一是证书链上 CA 的签名（仍允许传统的 PKCS#1 v1.5 填充），二是握手中服务器用私钥对握手记录做的 CertificateVerify 签名，后者是证明「对方确实持有这张证书的私钥」的关键，TLS 1.3 规定这里的 RSA 签名必须使用 RSA-PSS 填充。

**ECC（Elliptic Curve Cryptography，椭圆曲线密码学）**

- 非对称家族里的后来者，安全性建立在**椭圆曲线离散对数**难题上：选定一条曲线和一个基点，私钥是一个随机数，公钥是把基点连续“自加”这么多次得到的点（记作 k·G，叫标量乘法；椭圆曲线上定义的运算是点加，不是数的乘方）；已知公钥反推次数在计算上不可行。
- ECC 本身只定义了怎么生成公私钥，要完成具体任务还要配合别的算法：和 DH 组合成 **ECDHE** 用于密钥交换，和 DSA 组合成 **ECDSA** 用于数字签名。
- 常用曲线：
  - **P-256**：也叫 secp256r1，在 OpenSSL 里的名字是 prime256v1，由 NIST（美国国家标准与技术研究院）发布，NSA 也曾推荐。
  - **x25519**：基于 Curve25519。部分密码学家对 NIST 曲线的参数来源存疑，于是设计了参数完全公开可解释的 Curve25519，名字来自它所在的素数域 2^255 − 19。它速度快、实现不容易出错，被普遍认为是目前最稳妥的选择之一，在经典曲线里是浏览器的首选。不过 Chrome 131+、Firefox 132+ 默认发出的 key share 已经换成后量子混合组 X25519MLKEM768（X25519 + ML-KEM-768），纯 x25519 只在对方不支持时作为回退。
  - **x448**：更高强度的曲线，素数为 2^448 − 2^224 − 1。
  - 题外话：比特币、以太坊等区块链用的也是 ECC，曲线是 **secp256k1**。

“椭圆曲线”这个名字常让人以为它是个椭圆。其实它的方程形如 `y² = x³ + ax + b`，之所以叫这个名字，是因为这类方程最早出现在计算椭圆弧长的积分研究里，跟图形长什么样无关。在实数平面上画出来，有的是一整条向两侧张开的曲线，有的是一个闭合的“蛋”加一条开口曲线：

![两条实数域上的椭圆曲线：y² = x³ − x + 1 是一整条曲线，y² = x³ − 2x + 0.6 分成闭环和开口两段，都不是椭圆形](/images/rewrite/http-crypto/elliptic-curves.webp)

> 实际密码学里的曲线定义在**有限域**上，“曲线”是一堆离散的点，画不出这样平滑的形状。上图只是帮助建立直观印象。

**ECC 和 RSA 怎么比**

| ECC 密钥 | 大致相当的 RSA 密钥 | 对应对称强度 |
| --- | --- | --- |
| 160 位 | 1024 位 | 约 80 位（已不安全） |
| 224 位 | 2048 位 | 约 112 位 |
| 256 位 | 3072 位 | 约 128 位 |

密钥更短意味着计算量更小、占用的内存和网络带宽更少，握手更快。在移动设备和高并发服务器上，这些优势都非常实际，所以今天的 HTTPS 握手基本都在用基于椭圆曲线的 ECDHE：经典组合是 x25519 或 P-256，主流浏览器默认则在 x25519 上再叠加 ML-KEM-768，组成后量子混合的 X25519MLKEM768。

下面用 Node.js 演示 ECDHE 的核心：双方只交换公钥，却能各自算出同一个共享秘密。

```js
import { generateKeyPairSync, diffieHellman } from 'node:crypto';

// 浏览器和服务器各自临时生成一对 X25519 密钥（用完即弃，这就是 ECDHE 里的 E）
const browser = generateKeyPairSync('x25519');
const site = generateKeyPairSync('x25519');

// 双方只交换公钥，各自用“自己的私钥 + 对方的公钥”算出共享秘密
const s1 = diffieHellman({ privateKey: browser.privateKey, publicKey: site.publicKey });
const s2 = diffieHellman({ privateKey: site.privateKey, publicKey: browser.publicKey });

console.log('共享秘密长度:', s1.length, '字节');
console.log('两边算出的结果相同:', s1.equals(s2));
```

```text
共享秘密长度: 32 字节
两边算出的结果相同: true
```

因为每次连接都换一对新的临时密钥，用完就扔，即便服务器的长期私钥日后泄露，攻击者也算不出过去任何一次的共享秘密，这就是前向安全。

## 混合加密：各取所长

### 只用非对称加密行不行

既然非对称加密没有送钥匙的烦恼，能不能干脆全程都用它？不行，原因是**太慢**。这类算法建立在复杂的数学运算上，就算是效率较高的 ECC，也比 AES 慢好几个数量级。如果所有数据都用 RSA 加密，安全是安全了，网页可能半天都打不开。

用 Node.js 做个粗略的测试：AES 一次性加密 64 MB 数据，RSA 则重复 500 次“加密 + 解密”一个最大块：

```js
import {
  generateKeyPairSync, publicEncrypt, privateDecrypt, constants,
  createCipheriv, randomBytes,
} from 'node:crypto';

const fmt = (bytesPerSec) =>
  bytesPerSec > 1024 * 1024
    ? `${(bytesPerSec / 1024 / 1024).toFixed(1)} MB/s`
    : `${(bytesPerSec / 1024).toFixed(1)} KB/s`;

// 对称：一次性加密 64 MB 数据，看吞吐量
const bulk = randomBytes(64 * 1024 * 1024);
const t0 = performance.now();
const c = createCipheriv('aes-128-gcm', randomBytes(16), randomBytes(12));
c.update(bulk); c.final();
const aesRate = bulk.length / ((performance.now() - t0) / 1000);
console.log(`aes-128-gcm        ${fmt(aesRate)}`);

// 非对称：RSA 每次只能处理很小一块，重复 500 次“加密 + 解密”
for (const bits of [1024, 2048]) {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: bits });
  const opts = { padding: constants.RSA_PKCS1_OAEP_PADDING };
  const block = randomBytes(bits / 8 - 42); // OAEP(SHA-1) 单块明文上限
  const t1 = performance.now();
  for (let i = 0; i < 500; i++) {
    privateDecrypt({ key: privateKey, ...opts }, publicEncrypt({ key: publicKey, ...opts }, block));
  }
  const rsaRate = (block.length * 500) / ((performance.now() - t1) / 1000);
  console.log(`rsa-${bits} enc+dec  ${fmt(rsaRate).padEnd(12)} 比 AES 慢约 ${Math.round(aesRate / rsaRate)} 倍`);
}
```

在一台 Apple Silicon 笔记本上的输出：

```text
aes-128-gcm        1704.5 MB/s
rsa-1024 enc+dec  851.5 KB/s   比 AES 慢约 2050 倍
rsa-2048 enc+dec  464.0 KB/s   比 AES 慢约 3762 倍
```

![加密吞吐量对比：AES-128-GCM 约 1.7 GB/s，RSA-1024 约 850 KB/s，RSA-2048 约 460 KB/s](/images/rewrite/http-crypto/speed.webp)

具体数字因机器而异：没有硬件加速、用老的 CBC 模式时，AES 可能只有十几 MB/s，与 RSA 的差距是几百倍；有 AES-NI/ARMv8 加速时差距能拉到几千倍。无论哪种情况，结论都一样：**RSA 单次运算在毫秒级，AES 处理一个分组只要纳秒级**，量级上的鸿沟没法忽略。想在服务器上自测，可以用 `openssl speed aes-128-gcm`、`openssl speed rsa2048`。

### 两者结合

既然一个安全送钥匙、一个高效干活，那就分工：

1. **握手阶段用非对称算法解决密钥交换**。经典做法是客户端随机生成一把**会话密钥**（session key），用服务器公钥加密后发过去。会话密钥只有 16 或 32 字节，非对称算法慢一点也无所谓。
2. 服务器用私钥解密，取出会话密钥。到这一步，双方就安全地拥有了同一把对称密钥。
3. **之后的所有数据都用会话密钥做对称加密**，非对称算法不再出场。

![混合加密流程：握手阶段客户端用服务器公钥加密会话密钥，服务器用私钥解开；数据阶段双方用这把会话密钥做 AES 加解密](/images/rewrite/http-crypto/hybrid.webp)

用代码把这个流程串起来：

```js
import {
  generateKeyPairSync, publicEncrypt, privateDecrypt, constants,
  createCipheriv, createDecipheriv, randomBytes,
} from 'node:crypto';

// 服务端：生成一对 RSA 密钥，公钥可以发给任何人，私钥留在本机
const server = generateKeyPairSync('rsa', { modulusLength: 2048 });

// 客户端：随机生成 32 字节会话密钥，用服务端公钥把它“装箱”
const sessionKey = randomBytes(32);
const sealedKey = publicEncrypt(
  { key: server.publicKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
  sessionKey,
);
console.log('会话密钥长度:', sessionKey.length, '字节；RSA 密文长度:', sealedKey.length, '字节');

// 服务端：用私钥拆箱，拿到同一把会话密钥
const serverSideKey = privateDecrypt(
  { key: server.privateKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
  sealedKey,
);
console.log('双方会话密钥一致:', serverSideKey.equals(sessionKey));

// 之后的业务数据全部走对称加密
function seal(key, text) {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([c.update(text, 'utf8'), c.final()]);
  return { iv, body, tag: c.getAuthTag() };
}
function open(key, { iv, body, tag }) {
  const d = createDecipheriv('aes-256-gcm', key, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(body), d.final()]).toString('utf8');
}
const packet = seal(sessionKey, 'GET /api/cart?user=lin');
console.log('服务端收到:', open(serverSideKey, packet));
```

```text
会话密钥长度: 32 字节；RSA 密文长度: 256 字节
双方会话密钥一致: true
服务端收到: GET /api/cart?user=lin
```

这样一来，对称加密的密钥交换难题被非对称算法解决了，大量数据又交给速度快的对称算法，安全和性能兼顾，机密性就有了保障。

> 现代做法：上面“客户端加密会话密钥发给服务器”的方式就是 TLS 1.2 里的 RSA 密钥交换，正因为没有前向安全，TLS 1.3 已经不再支持。TLS 1.3 的完整握手使用临时的 (EC)DHE：双方各自生成临时密钥对、交换公钥、各自算出相同的共享秘密，再派生出会话密钥，会话密钥本身从不在网络上传输。会话恢复则基于预共享密钥 PSK，RFC 8446 给了两种模式：psk_dhe_ke（PSK 再叠加一次 (EC)DHE，保留前向安全）和 psk_ke（只用 PSK，没有前向安全），实践中浏览器基本都选前者。经典曲线里首选 x25519，主流浏览器默认已改用 X25519MLKEM768 混合密钥交换；完整握手只要 1-RTT；恢复会话时还能用 0-RTT，在第一个包里就带上应用数据（代价是这部分数据可能被重放）。

### 混合加密之后还缺什么

有了混合加密，通信内容不会被偷看了，但这只是安全通信的第一块拼图：

- **完整性**：怎么保证数据没被改过？（AEAD 已经覆盖了一部分，握手过程本身还需要摘要算法保护）
- **身份认证**：拿到的“服务器公钥”真的是服务器的，还是中间人伪造的？
- **不可否认**：发出去的消息事后能不能抵赖？

这些要靠摘要算法、数字签名和证书体系来补齐，所以光有加密，通信还谈不上绝对安全。

### 顺带了解：TLS 规范要求必须实现的套件

| 版本 | 必须实现的套件 | 备注 |
| --- | --- | --- |
| TLS 1.2 | `TLS_RSA_WITH_AES_128_CBC_SHA` | RSA 密钥交换 + AES-128-CBC，今天看已经过时 |
| TLS 1.3 | `TLS_AES_128_GCM_SHA256` | 套件里只描述对称算法和哈希，密钥交换另外协商；出于前向安全的考虑，删除了 RSA 和静态 DH 密钥交换 |

## 回顾

- 加密的核心思路是用一个**小秘密（密钥）**守护一个**大秘密（密文）**，看住了密钥就等于看住了数据。
- 对称加密：一把密钥，速度快，但密钥必须保密且无法安全地交换。主流算法是 AES 和 ChaCha20，模式首选 GCM 这类 AEAD。
- 非对称加密：公钥随便发、私钥自己留，解决了密钥交换，但速度慢。主流算法是 RSA 和 ECC（ECDHE、ECDSA）。
- 混合加密：握手用非对称算法得到会话密钥，后续用对称算法传数据，又快又安全，这就是 TLS 的做法。TLS 1.3 删掉了 RSA 密钥交换，完整握手用临时 (EC)DHE 协商，保证前向安全（会话恢复的纯 psk_ke 模式例外）。

## 面试速答模板

> 加密分对称和非对称两类。对称加密加解密用同一把密钥，像 AES、ChaCha20，速度很快，一般配合 GCM 这类 AEAD 模式，同时提供加密和防篡改；它的问题是密钥交换，密钥不能在不安全的网络上明文传，加密后再传又需要另一把密钥，陷入死循环。非对称加密用一对公私钥，公钥公开、私钥保密，公钥加密的数据只有私钥能解，正好解决了密钥交换；代表是 RSA（基于大数分解）和 ECC（基于椭圆曲线离散对数，256 位 ECC 约等于 3072 位 RSA），缺点是比对称算法慢上千倍。所以 TLS 用混合加密：握手时用非对称算法协商出一把会话密钥，之后的数据全部用这把密钥做对称加密。TLS 1.3 删掉了 RSA 密钥交换和静态 DH，完整握手用临时的 (EC)DHE 协商来保证前向安全，RSA 只用于证书签名；会话恢复可以用 PSK，其中 psk_dhe_ke 仍有前向安全，纯 psk_ke 则没有。另外，加密只解决了机密性，完整性和身份认证还要靠摘要、数字签名和证书来保证。
