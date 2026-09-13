# 制作引き継ぎ書：ライバー準備ページ一式（別サービス版 新規制作用）

> これは制作引き継ぎ書です。新しいチャットのClaudeへ。
> このファイルの仕様に**厳密に**従って、SELFiA の「ライバー準備ページ」と同じ構成・同じテイストのページを、別サービス向けに新規制作してください。値は推測せず、ここに書かれたものをそのまま使うこと。

作成日: 2026-09-13
元リポジトリ: sunodesign/Selfia（GitHub Pages 公開）

---

## 0. まず決めること（差し替え変数）

構成・デザインは元と同一。以下だけ新サービス用に差し替える。本書では `{{...}}` で示す。

| 変数 | 元の値（SELFiA版） | 新サービスでの値 |
|---|---|---|
| `{{BRAND}}` サービス名 | SELFiA | （決める） |
| `{{BRAND_LOGO}}` ヘッダーロゴ | base64埋め込みwebp（高さ32px表示） | （ロゴ画像をbase64化して埋め込む） |
| `{{APP}}` 配信アプリ名 | IRIAM | （決める） |
| `{{SNS}}` 連携SNS | X（旧Twitter） | （決める） |
| `{{LINE_URL}}` 相談導線 | https://lin.ee/PqAMqo4 | （決める） |
| `{{COPYRIGHT}}` フッター文言 | © SELFiA — 自分らしさを最高の輝きに。 | （決める） |
| ブランドカラー | 下記カラートークン（コーラル〜ゴールドの暖色） | 同じでよければそのまま。変える場合は「9-3. 色を差し替える場合」参照 |

---

## 1. プロジェクト概要

- Vライバー事務所の「ライバー準備」セクション。所属前後のユーザーが配信開始までの準備を1人で進められるようにする案内ページ群。
- 3ページ構成（すべて自己完結型の単一HTMLファイル）:
  1. **準備トップ**（`liver-prep/index.html`）… 準備メニューのハブ。STEPカード2枚（診断／アカウント作成）＋LINE相談CTA
  2. **設定ガイド**（`setup/index.html`）… アプリのアカウント作成 → SNSアカウント作成 → 両者の連携、をスマホスクショ画像付きステップで案内
  3. **タイプ診断**（`assess/index.html`）… 12問で8タイプのどれかに判定する診断コンテンツ（妖精タイプ診断）
- 想定ユーザー: 配信未経験の応募者・新規所属ライバー。**スマホ閲覧が主**。
- 完成度: 3ページとも完成・公開済み。この引き継ぎ書は「同じ構成の別サービス版」を新規で作るためのもの。

---

## 2. デザイントーン

### コンセプト
- 一言で: 「暖色グラデ×クリーム地の、やわらかくきらめくポップ」。白ではなくクリーム系の紙色に、コーラル→ゴールドのグラデーションをアクセントとして一貫使用。
- 装飾: 背景に固定のぼかし円（オーラ）3つ＋下から舞い上がるスパークル（✦✧·✩*）。ただし `prefers-reduced-motion` で全停止。
- 避けたもの: 青系・グレー系の事務的なトーン、角ばった要素（角丸は最低14px、ボタン・タグは完全ピル形）。

### カラー（実際に使用している全色）

| 変数名 | 値 | 用途 |
|---|---|---|
| `--coral` | `#F4623A` | メインアクセント。ホバー文字色、強調`<b>`、進捗数字 |
| `--orange` | `#FA8B33` | eyebrow・タグ文字色 |
| `--amber` | `#FFA42B` | ホバー時ボーダー、スパークル基本色 |
| `--gold` | `#FFC12E` | グラデ終点 |
| `--grad` | `linear-gradient(115deg,#F4623A 0%,#FA8B33 42%,#FFC12E 100%)` | ボタン、カードヘッダー、見出しグラデ文字、進捗バー |
| `--grad-soft` | `linear-gradient(115deg,#FFF1EA 0%,#FFF6E8 100%)` | 引用風ボックス、プレースホルダー背景 |
| `--ink` | `#3A2E2A` | 本文（焦げ茶。黒は使わない） |
| `--ink-soft` | `#8B7A70` | サブ本文・説明文 |
| `--ink-faint` | `#B8A99F` | 注釈・フッター |
| `--paper` | `#FFFDFB` | ページ背景 |
| `--paper-2` | `#FFF7F0` | タグ背景・画像枠背景・ホバー背景 |
| `--line` | `#F2E4D9` | ボーダー全般 |
| `--sh` | `0 12px 32px -14px rgba(244,98,58,.28)` | 標準シャドウ（コーラル色付き） |
| `--sh-lg` | `0 24px 60px -22px rgba(244,98,58,.36)` | ホバー・強調シャドウ |
| （固定値） | `#06C755` | LINEボタンのみ（shadow: `0 12px 26px -14px rgba(6,199,85,.5)`） |
| （固定値） | `#000` | 「結果をXでシェア」ボタンのみ |
| （固定値） | `#fff` | カード背景・ボタン文字 |

補足:
- 背景オーラ: `rgba(244,98,58,.15)` / `rgba(255,193,46,.19)` / `rgba(250,139,51,.13)`
- Coming Soon カード（無効状態）: グラデ `linear-gradient(115deg,#B8A99F,#8B7A70)`、opacity .65
- スパークルJSの色配列: `["#F4623A","#FA8B33","#FFA42B","#FFC12E"]`

### タイポグラフィ

| 用途 | font-family | size | weight | line-height |
|---|---|---|---|---|
| ヒーローh1 | `--f-jp` | `clamp(28px,6vw,42px)`（トップ）/ `clamp(26px,5.4vw,38px)`（ガイド） | 900 | 1.45 |
| セクションh2 `.sect-title` | `--f-jp` | `clamp(22px,4vw,28px)` | 900 | 1.45 |
| CTA h2 | `--f-jp` | 20〜23px | 900 | 1.55 |
| カードタイトル | `--f-jp` | 16.5〜19px | 900 | 1.4〜1.5 |
| リード文 `.lead` | `--f-jp` | 14.5px | 500(bodyの継承) | 2 |
| 説明文 `.card-desc` `.step-desc` | `--f-jp` | 13.5px | 500 | 1.9 |
| eyebrow / 英字ラベル | `--f-en` | 10.5〜11px | 600〜700 | — |
| 注釈 `.note`・フッター | `--f-jp` | 11.5px | 500 | — |

- `--f-jp: 'Zen Kaku Gothic New',system-ui,sans-serif`（日本語すべて）
- `--f-en: 'Outfit',system-ui,sans-serif`（英字ラベル専用。`letter-spacing:.14em〜.26em` を必ず付ける）
- 読み込み（3ページ共通、head内）:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
```

- body 基本: `font-weight:500; line-height:1.9; -webkit-font-smoothing:antialiased`
- 見出しの強調は必ず weight 900。700は小見出し・タグ・ボタン以外に使わない。

### スペーシング
- コンテナ: `max-width:900px`（準備トップ・ガイド）/ `680px`（診断）/ ガイドPC時のみ `1080px`。左右 padding は常に `22px`。
- ヒーロー: `padding:56px 0 44px`（ガイドは `52px 0 40px`）
- セクション: `padding:44px 0 28px`、セクション見出し下 `margin-bottom:32px`
- カード間 gap: 18〜22px（PC4カラム時 16px）
- カード内 padding: 22〜26px 系（`26px 24px 22px` など）
- 刻みの規則: 厳密な4/8px グリッドではなく 2px 刻みの手調整（10/12/14/16/18/22/24/26px が頻出）。**新規要素もこの近傍値で合わせる。**

### その他のスタイル値
- border-radius: カード大 `22〜28px`、画像 `14px`、ボックス `16〜18px`、ピル（ボタン・タグ・バッジ）`100px`、丸 `50%`
- transition: ホバー系 `transform .18s, box-shadow .2s`、色系 `.2s`
- ホバー動作: カード `translateY(-4px)`＋shadow強化、ボタン `translateY(-2px)`、小要素 `translateY(-2〜-3px)`
- アニメーション方針: 常時アニメはスパークル上昇・妖精ふわふわ（`fl` 4.2s）・結果カードの星屑明滅（`tw` 3.4s）のみ。**必ず以下を入れる:**

```css
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}html{scroll-behavior:auto}#sparkles{display:none}}
```

### レスポンシブ
- **モバイルファースト**（基本1カラム、min-widthで拡張）
- ブレークポイント実値: `max-width:400px`（極小スマホ縮小）/ `max-width:560px or 600px`（グリッド2列化・ステップ画像縮小）/ `min-width:720px`（トップのカード2列化）/ `min-width:768px`（診断モーダル横型化）/ `min-width:880px`（ガイドのステップ4列縦型カード化）

---

## 3. 技術構成

- 素の HTML/CSS/JS のみ。**ビルドなし・フレームワークなし・ライブラリなし。**
- 1ページ = 1つの `index.html` に CSS（`<style>`）と JS（`<script>`）を全部インライン。外部CSS/JSファイルは準備ページ群では使わない。
- 画像はすべて **base64 data URI で埋め込み**（ロゴwebp、スクショ、妖精イラスト）。外部画像リクエストゼロ。ガイドページは約630KBになるが許容している。
- フォントのみ Google Fonts CDN。
- ホスティング: GitHub Pages（`actions/deploy-pages@v4` でリポジトリ直下をそのまま公開。`.nojekyll` をルートに置く）。別サービス版のホスティングは新規に決めてよいが、静的ファイルのみで動く構成を維持する。

---

## 4. コード規約

- クラス名: **短い省略形ケバブケース**。BEMではない。例: `.sh-in`（site header inner）、`.sect-head`、`.step-img`、`.fc`（fairy card）、`.rcard`（result card）。新規クラスもこの短縮スタイルで。
- 色・フォント・影は必ず `:root` のカスタムプロパティ経由。ハードコード可なのは LINE緑・シェア黒・`#fff` と rgba影のみ。
- CSS: **1ルール1行の詰め書き**（プロパティ間スペースなし、最後のセミコロン省略）。メディアクエリ内のみ2スペースインデントで複数行。

```css
.btn{display:inline-block;background:var(--grad);color:#fff;border:none;border-radius:100px;padding:14px 30px;font-family:var(--f-jp);font-weight:900;font-size:15px;cursor:pointer;text-decoration:none;box-shadow:var(--sh);transition:transform .18s}
```

- CSSコメントは `/* Site header */` のようなセクション区切りのみ。
- JS: vanilla。`const $ = s => document.querySelector(s);` ヘルパー、データはオブジェクト/配列リテラルで先頭に定義し、レンダー関数で `innerHTML` 組み立て。即時関数 `(function(){...})()` でスパークル生成。
- HTML: インデント2スペース。セクションコメント `<!-- ① IRIAM -->` を入れる。
- インラインstyle禁止（JSからの動的設定を除く）。`!important` は reduced-motion 内のみ。

---

## 5. ファイル構成

```
（公開ルート）
├── index.html            … 事務所トップ（今回のスコープ外。ただし戻り先として存在する前提）
├── liver-prep/index.html … ① 準備トップ
├── setup/index.html      … ② 設定ガイド
├── assess/index.html     … ③ タイプ診断
└── .nojekyll
```

- ページ間リンクはすべて相対パス: 各ページのヘッダー → `../`（サイトトップ）、ガイド・診断の末尾バックリンク → `../liver-prep/`、準備トップのカード → `../assess/` `../setup/`

---

## 6. 共通コンポーネント（コード全文）

3ページで完全に共通のコード。**そのままコピーして使う。**

### 6-1. HTML骨格 + ベースCSS（head〜bodyの土台）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ページ名 | {{BRAND}}</title>
<meta name="description" content="（ページ説明）{{BRAND}}｜Vライバー配信事務所">
<meta property="og:type" content="website">
<meta property="og:title" content="ページ名 | {{BRAND}}">
<meta property="og:description" content="（短い説明）">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --coral:#F4623A; --orange:#FA8B33; --amber:#FFA42B; --gold:#FFC12E;
  --grad:linear-gradient(115deg,#F4623A 0%,#FA8B33 42%,#FFC12E 100%);
  --grad-soft:linear-gradient(115deg,#FFF1EA 0%,#FFF6E8 100%);
  --ink:#3A2E2A; --ink-soft:#8B7A70; --ink-faint:#B8A99F;
  --paper:#FFFDFB; --paper-2:#FFF7F0; --line:#F2E4D9;
  --f-jp:'Zen Kaku Gothic New',system-ui,sans-serif;
  --f-en:'Outfit',system-ui,sans-serif;
  --sh:0 12px 32px -14px rgba(244,98,58,.28);
  --sh-lg:0 24px 60px -22px rgba(244,98,58,.36);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--f-jp);background:var(--paper);color:var(--ink);line-height:1.9;font-weight:500;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{display:block;max-width:100%;height:auto}
</style>
</head>
```

### 6-2. 背景オーラ + スパークル（CSS / HTML / JS）

CSS:

```css
.aura{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0}
.aura.a{width:480px;height:480px;background:rgba(244,98,58,.15);top:-160px;right:-140px}
.aura.b{width:420px;height:420px;background:rgba(255,193,46,.19);top:44%;left:-170px}
.aura.c{width:380px;height:380px;background:rgba(250,139,51,.13);bottom:-140px;right:6%}
#sparkles{position:fixed;inset:0;pointer-events:none;z-index:1}
.sp{position:absolute;animation:rise linear infinite;opacity:0;font-size:12px;color:var(--amber)}
@keyframes rise{0%{transform:translateY(0) rotate(0) scale(.5);opacity:0}12%{opacity:1}88%{opacity:.6}100%{transform:translateY(-108vh) rotate(180deg) scale(1);opacity:0}}
```

body 直下のHTML:

```html
<div class="aura a"></div><div class="aura b"></div><div class="aura c"></div>
<div id="sparkles" aria-hidden="true"></div>
```

`</body>` 直前のJS（生成数は案内ページ18個、診断ページ24個）:

```html
<script>
(function(){
  const box = document.getElementById('sparkles');
  const glyphs = ["✦","✧","·","✩","*"];
  const cols = ["#F4623A","#FA8B33","#FFA42B","#FFC12E"];
  for(let i = 0; i < 18; i++){
    const s = document.createElement('span');
    s.className = 'sp';
    s.textContent = glyphs[i % glyphs.length];
    s.style.fontSize = (8 + Math.random() * 12) + 'px';
    s.style.color = cols[i % 4];
    s.style.left = Math.random() * 100 + '%';
    s.style.top = (100 + Math.random() * 20) + '%';
    s.style.animationDuration = (14 + Math.random() * 10) + 's';
    s.style.animationDelay = -(Math.random() * 20) + 's';
    box.appendChild(s);
  }
})();
</script>
```

### 6-3. サイトヘッダー（sticky・ぼかし背景）

```css
.site-hdr{position:sticky;top:0;z-index:50;background:rgba(255,253,251,.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.sh-in{max-width:900px;margin:0 auto;padding:10px 22px;display:flex;justify-content:space-between;align-items:center;gap:12px}
.sh-brand{display:flex;align-items:center;text-decoration:none;flex:none}
.sh-brand img{display:block;height:32px;width:auto}
.sh-home{flex:none;font-family:var(--f-jp);font-size:12.5px;font-weight:700;color:var(--ink-soft);text-decoration:none;padding:7px 14px;border-radius:100px;border:1px solid var(--line);background:#fff;transition:color .2s,border-color .2s,background .2s;white-space:nowrap}
.sh-home:hover{color:var(--coral);border-color:var(--amber);background:var(--paper-2)}
@media(max-width:400px){
  .sh-brand img{height:28px}
  .sh-home{font-size:11.5px;padding:6px 11px}
}
```

```html
<header class="site-hdr">
  <div class="sh-in">
    <a href="../" class="sh-brand" aria-label="{{BRAND}} トップへ">
      <img src="{{BRAND_LOGO（base64 data URI）}}" alt="{{BRAND}}">
    </a>
    <a href="../" class="sh-home">← トップへ戻る</a>
  </div>
</header>
```

※ `.sh-in` の max-width はページのコンテナ幅に合わせる（診断ページは680px）。

### 6-4. コンテナ・ヒーロー・eyebrow・グラデ文字

```css
.wrap{position:relative;z-index:2;max-width:900px;margin:0 auto;padding:0 22px}
.hero{padding:56px 0 44px;text-align:center}
.eyebrow{display:inline-block;font-family:var(--f-en);font-size:11px;font-weight:600;letter-spacing:.26em;color:var(--orange);padding-bottom:10px;margin-bottom:18px;position:relative}
.eyebrow::after{content:"";position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:26px;height:2px;background:var(--grad);border-radius:2px}
.hero h1{font-weight:900;font-size:clamp(28px,6vw,42px);line-height:1.45;margin-bottom:18px}
.grad-text{background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.hero .lead{font-size:14.5px;color:var(--ink-soft);max-width:520px;margin:0 auto;line-height:2;text-align:left}
```

```html
<section class="hero">
  <div class="eyebrow">SECTION LABEL（英語大文字）</div>
  <h1>通常テキスト<br><span class="grad-text">強調部分</span></h1>
  <p class="lead">リード文。<br>2〜3行で。</p>
</section>
```

ヒーローh1のパターン: 1〜2行構成で、キーワード部分だけ `.grad-text`。

### 6-5. ボタン（全バリアント）

```css
.btn{display:inline-block;background:var(--grad);color:#fff;border:none;border-radius:100px;padding:14px 30px;font-family:var(--f-jp);font-weight:900;font-size:15px;cursor:pointer;text-decoration:none;box-shadow:var(--sh);transition:transform .18s,box-shadow .2s;text-align:center}
.btn:hover{transform:translateY(-2px);box-shadow:var(--sh-lg)}
.btn.line{background:#06C755;box-shadow:0 12px 26px -14px rgba(6,199,85,.5)}
.btn.dark{background:#000;box-shadow:0 12px 26px -14px rgba(0,0,0,.4)}
.btn.ghost{background:transparent;color:var(--ink-soft);border:1.5px solid var(--line);box-shadow:none}
.btn.ghost:hover{background:var(--paper-2)}
.btns{display:flex;flex-direction:column;gap:10px;max-width:340px;margin:0 auto}
```

用途固定: グラデ=主要アクション / `.line`=LINE誘導のみ / `.dark`=Xシェアのみ / `.ghost`=副次アクション。

### 6-6. CTAカード

```css
.cta{background:#fff;border-radius:26px;padding:36px 26px 30px;text-align:center;box-shadow:var(--sh);margin:56px 0 32px}
.cta .tag{display:inline-block;font-family:var(--f-en);font-size:10.5px;font-weight:600;letter-spacing:.24em;color:var(--orange);margin-bottom:12px}
.cta h2{font-weight:900;font-size:21px;line-height:1.55;margin-bottom:14px}
.cta h2 em{font-style:normal;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.cta p{font-size:13.5px;line-height:1.95;color:var(--ink-soft);margin-bottom:20px;text-align:left}
.note{font-size:11.5px;color:var(--ink-faint);margin-top:12px}
```

```html
<div class="cta">
  <div class="tag">SUPPORT</div>
  <h2>迷ったら、<em>気軽にご相談ください。</em></h2>
  <p>準備の途中でうまく進まないとき、いつでも公式LINEで相談できます。<br>{{BRAND}} スタッフが個別にサポートします。</p>
  <a class="btn line" href="{{LINE_URL}}" target="_blank" rel="noopener">公式LINEで相談する</a>
  <p class="note">相談だけでもOK。</p>
</div>
```

h2 内の `<em>` がグラデ強調。tag は英語大文字1語（SUPPORT / NEXT STEP など）。

### 6-7. バックリンク + フッター

```css
.backlink-wrap{text-align:center;margin:8px 0 32px}
.backlink{display:inline-flex;align-items:center;font-family:var(--f-jp);font-size:13.5px;font-weight:700;color:var(--ink-soft);text-decoration:none;padding:12px 24px;border-radius:100px;border:1px solid var(--line);background:#fff;transition:all .2s}
.backlink:hover{color:var(--coral);border-color:var(--amber);background:var(--paper-2);transform:translateY(-2px)}
footer{text-align:center;padding:36px 22px 46px;font-size:11.5px;color:var(--ink-faint)}
```

```html
<div class="backlink-wrap">
  <a href="../liver-prep/" class="backlink">← ライバー準備トップに戻る</a>
</div>
<footer>{{COPYRIGHT}}</footer>
```

---

## 7. ページ別仕様

### 7-1. 準備トップ（liver-prep/index.html）

構成（上から順に）: ヘッダー → ヒーロー（eyebrow: `LIVER PREPARATION`）→ メニューカードグリッド → LINE相談CTA → フッター。

メニューカードのコード全文:

```css
.menu{display:grid;grid-template-columns:1fr;gap:18px;padding:8px 0 40px}
@media(min-width:720px){
  .menu{grid-template-columns:repeat(2,1fr);gap:22px}
}
.card{background:#fff;border:1px solid var(--line);border-radius:24px;overflow:hidden;box-shadow:var(--sh);transition:transform .2s,box-shadow .2s;text-decoration:none;color:inherit;display:flex;flex-direction:column}
.card:hover{transform:translateY(-4px);box-shadow:var(--sh-lg)}
.card-top{position:relative;padding:26px 24px 22px;text-align:center;overflow:hidden;background:var(--grad)}
.card-top::before{content:"";position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(circle at 16% 22%,rgba(255,255,255,.55) 0 1.5px,transparent 3px),
  radial-gradient(circle at 84% 16%,rgba(255,255,255,.5) 0 2px,transparent 4px),
  radial-gradient(circle at 74% 84%,rgba(255,255,255,.45) 0 1.5px,transparent 3px),
  radial-gradient(circle at 22% 86%,rgba(255,255,255,.4) 0 1px,transparent 2.5px)}
.card-num{position:relative;font-family:var(--f-en);font-size:11px;font-weight:600;letter-spacing:.26em;color:rgba(255,255,255,.9);margin-bottom:10px}
.card-emoji{position:relative;font-size:46px;line-height:1;margin-bottom:10px;display:inline-block;filter:drop-shadow(0 6px 14px rgba(58,46,42,.22))}
.card-title{position:relative;font-weight:900;font-size:19px;color:#fff;line-height:1.4;text-shadow:0 2px 8px rgba(58,46,42,.2)}
.card-body{padding:22px 24px 22px;flex:1;display:flex;flex-direction:column}
.card-desc{font-size:13.5px;line-height:1.9;color:var(--ink-soft);flex:1;margin-bottom:16px}
.card-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.card-tag{font-size:11px;font-weight:700;color:var(--orange);background:var(--paper-2);border:1px solid var(--line);border-radius:100px;padding:4px 11px}
.card-cta{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:var(--f-jp);font-weight:900;font-size:14px;color:#fff;background:var(--grad);border-radius:100px;padding:12px 22px;text-align:center;transition:transform .18s;box-shadow:0 8px 20px -12px rgba(244,98,58,.5)}
.card:hover .card-cta{transform:translateX(2px)}
.card-cta svg{width:14px;height:14px}
.card.soon{opacity:.65;pointer-events:none}
.card.soon .card-top{background:linear-gradient(115deg,#B8A99F,#8B7A70)}
.card.soon .card-cta{background:#B8A99F;box-shadow:none}
.soon-badge{display:inline-block;font-family:var(--f-en);font-size:10px;font-weight:600;letter-spacing:.2em;color:var(--ink-faint);background:var(--paper-2);border:1px solid var(--line);border-radius:100px;padding:3px 10px;margin-top:8px}
```

```html
<section class="menu">
  <a class="card" href="../assess/">
    <div class="card-top">
      <div class="card-num">STEP 01</div>
      <div class="card-emoji">🧚</div>
      <div class="card-title">妖精タイプ診断</div>
    </div>
    <div class="card-body">
      <p class="card-desc">12の質問であなたに宿る「配信の妖精」がわかる診断。声を使った副業として、あなたに向いてる型をチェック。</p>
      <div class="card-tags">
        <span class="card-tag">約2分</span>
        <span class="card-tag">全12問</span>
        <span class="card-tag">未経験OK</span>
      </div>
      <span class="card-cta">診断をはじめる <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </div>
  </a>

  <a class="card" href="../setup/">
    <div class="card-top">
      <div class="card-num">STEP 02</div>
      <div class="card-emoji">📱</div>
      <div class="card-title">各種アカウントの作成</div>
    </div>
    <div class="card-body">
      <p class="card-desc">{{APP}} のアカウント作成、{{SNS}}アカウント作成、両者の連携までを画像付きで案内する設定ガイド。</p>
      <div class="card-tags">
        <span class="card-tag">{{APP}}</span>
        <span class="card-tag">{{SNS}}</span>
        <span class="card-tag">連携</span>
      </div>
      <span class="card-cta">ガイドを開く <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </div>
  </a>
</section>
```

- カードの絵文字アイコンは1文字（46px）。準備メニューが増えたら `STEP 03` として同型カードを追加。未公開機能は `.card.soon` + `.soon-badge`（文言例: `COMING SOON`）。
- このページのCTAは 6-6 のLINE相談型（tag: SUPPORT）。CTA margin は `16px 0 24px`、padding `34px 26px 30px`、h2 20px。

### 7-2. 設定ガイド（setup/index.html）

構成: ヘッダー → ヒーロー（eyebrow: `SETUP GUIDE`、h1「はじめての<br>アプリ設定ガイド」）→ ページ内TOC → セクション×3（① {{APP}} アカウント作成 / ② {{SNS}} アカウント作成 / ③ 連携）→ 完了報告CTA → バックリンク → フッター。

**データ駆動レンダリング**が肝: 手順は HTML に直書きせず、JS のデータ配列 → `renderSteps()` で生成する。

追加CSS（共通分以外の全文）:

```css
/* TOC nav */
.toc{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin:24px 0 10px}
.toc a{font-family:var(--f-en);font-size:11px;font-weight:700;color:var(--ink-soft);background:var(--paper-2);border:1px solid var(--line);border-radius:100px;padding:7px 14px;text-decoration:none;letter-spacing:.06em;transition:all .2s}
.toc a:hover{background:#fff;border-color:var(--amber);color:var(--coral)}

/* Section */
.sect{padding:44px 0 28px}
.sect-head{text-align:center;margin-bottom:32px}
.sect-tag{display:inline-block;font-family:var(--f-en);font-size:11px;font-weight:700;letter-spacing:.24em;color:#fff;background:var(--grad);border-radius:100px;padding:6px 16px;margin-bottom:14px}
.sect-title{font-weight:900;font-size:clamp(22px,4vw,28px);line-height:1.45;margin-bottom:10px}
.sect-lead{font-size:13.5px;color:var(--ink-soft);max-width:520px;margin:0 auto;line-height:1.95;text-align:left}

/* Sub-section divider */
.subhead{display:flex;align-items:center;gap:12px;margin:32px auto 22px;max-width:720px;font-weight:900;font-size:14px;color:var(--coral)}
.subhead::before,.subhead::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--line),transparent)}

/* Steps grid */
.steps{display:grid;grid-template-columns:1fr;gap:22px}
.step{background:#fff;border:1px solid var(--line);border-radius:22px;overflow:hidden;box-shadow:0 8px 24px -14px rgba(244,98,58,.2);transition:transform .18s,box-shadow .2s}
.step:hover{transform:translateY(-2px);box-shadow:0 14px 34px -16px rgba(244,98,58,.32)}
.step-inner{display:grid;grid-template-columns:180px 1fr;gap:20px;padding:18px 22px 18px 18px;align-items:center}
.step-img{border-radius:14px;overflow:hidden;background:var(--paper-2);aspect-ratio:9/19.5;display:grid;place-items:center;border:1px solid var(--line)}
.step-img img{width:100%;height:100%;object-fit:cover}
.step.no-img .step-inner{grid-template-columns:1fr;padding:20px 22px}
.step.no-img .step-body{padding:0}
.step-body{min-width:0}
.step-num{display:inline-flex;align-items:center;justify-content:center;font-family:var(--f-en);font-weight:700;font-size:14px;color:#fff;background:var(--grad);width:34px;height:34px;border-radius:50%;margin-bottom:10px;letter-spacing:.02em}
.step-title{font-weight:900;font-size:16.5px;line-height:1.5;margin-bottom:8px}
.step-desc{font-size:13.5px;line-height:1.9;color:var(--ink-soft)}
.step-desc b{color:var(--coral);font-weight:700}

/* PC (>=880px): 4 columns, vertical stacked cards */
@media(min-width:880px){
  .wrap{max-width:1080px}
  .sh-in{max-width:1080px}
  .steps{grid-template-columns:repeat(4,1fr);gap:16px}
  .step-inner{grid-template-columns:1fr;gap:0;padding:0;align-items:stretch}
  .step-img{border-radius:0;border:0;border-bottom:1px solid var(--line);background:var(--paper-2)}
  .step.no-img{grid-column:1 / -1}
  .step.no-img .step-inner{grid-template-columns:1fr;padding:18px 22px}
  .step.no-img .step-body{padding:0}
  .step.no-img .step-title{font-size:15.5px}
  .step.no-img .step-desc{font-size:13px}
  .step-body{padding:16px 16px 20px}
  .step-num{width:30px;height:30px;font-size:13px;margin-bottom:8px}
  .step-title{font-size:14.5px;line-height:1.45;margin-bottom:6px}
  .step-desc{font-size:12.5px;line-height:1.8}
  .subhead{grid-column:1 / -1;margin:16px auto 4px;font-size:13.5px}
}
@media(max-width:600px){
  .step-inner{grid-template-columns:120px 1fr;gap:14px;padding:14px 16px 14px 14px}
  .step-num{width:30px;height:30px;font-size:13px;margin-bottom:8px}
  .step-title{font-size:15px}
  .step-desc{font-size:13px}
  .toc a{font-size:10.5px;padding:6px 12px}
}
@media(max-width:400px){
  .step-inner{grid-template-columns:100px 1fr;gap:12px;padding:12px 14px}
  .step-title{font-size:14.5px}
}
```

本文HTML:

```html
<main class="wrap">
  <section class="hero">
    <div class="eyebrow">SETUP GUIDE</div>
    <h1>はじめての<br><span class="grad-text">アプリ設定ガイド</span></h1>
    <p class="lead">配信をはじめる前の準備。<br>{{APP}} のアカウント作成から、{{SNS}} との連携まで<br>画像付きで丁寧に案内します。</p>
    <nav class="toc" aria-label="ページ内ナビ">
      <a href="#app">① {{APP}}</a>
      <a href="#sns">② {{SNS}} アカウント</a>
      <a href="#link">③ {{APP}} × {{SNS}} 連携</a>
    </nav>
  </section>

  <section class="sect" id="app">
    <div class="sect-head">
      <span class="sect-tag">STEP 01</span>
      <h2 class="sect-title">{{APP}} のアカウントを作る</h2>
      <p class="sect-lead">まずは配信用のアプリ「{{APP}}」をダウンロードし、アカウント作成 → メールアドレス登録までを行います。</p>
    </div>
    <div class="steps" id="appSteps"></div>
  </section>

  <!-- 同型で id="sns" / id="link" のセクションを続ける -->

  <div class="cta">
    <div class="tag">NEXT STEP</div>
    <h2>設定が終わったら、<br><em>担当マネージャーに完了の報告</em>をお願いします。</h2>
  </div>

  <div class="backlink-wrap">
    <a href="../liver-prep/" class="backlink">← ライバー準備トップに戻る</a>
  </div>

  <footer>{{COPYRIGHT}}</footer>
</main>
```

ステップデータとレンダラー（JS全文。データ内容は新サービスのアプリ手順に差し替え）:

```js
const IMG = {
  "app_1": "data:image/webp;base64,....",  // スクショをbase64で。キーは「セクション略称_連番」
  // ...
};

// ステップの形: n=表示番号(文字列), img=IMGのキー or null(画像なし), title, desc(HTML可)
// section を持たせると、その手前に .subhead 区切りが入る
const APP_STEPS = [
  {n:"1", img:"app_1", title:"新しくはじめる", desc:"アプリを起動し、「新しくはじめる」をタップ。"},
  {n:"6", img:"app_6", title:"歯車マーク（設定）をタップ", section:"【メールアドレス登録】", desc:"マイページ右上の歯車マーク（設定）をタップ。"},
  {n:"9", img:null, title:"メールアドレスを入力・認証", desc:"メールアドレスを入力すると、認証メールが届きます。<b>メール内のコード</b>を入力して登録完了。"}
];

function renderSteps(target, list){
  let out = '';
  list.forEach(s => {
    if(s.section){
      out += '<div class="subhead">' + s.section + '</div>';
    }
    const noImg = !s.img;
    const imgBlock = s.img
      ? '<div class="step-img"><img src="' + IMG[s.img] + '" alt="ステップ' + s.n + '"></div>'
      : '';
    out += '<article class="step' + (noImg ? ' no-img' : '') + '">' +
      '<div class="step-inner">' +
        imgBlock +
        '<div class="step-body">' +
          '<div class="step-num">' + s.n + '</div>' +
          '<h3 class="step-title">' + s.title + '</h3>' +
          '<p class="step-desc">' + s.desc + '</p>' +
        '</div>' +
      '</div>' +
    '</article>';
  });
  target.innerHTML = out;
}
renderSteps(document.getElementById('appSteps'), APP_STEPS);
```

ライティングのルール（元ページの実例に合わせる）:
- title は操作の命令形・体言止め（「生年月日を入力」「〜をタップ」）。
- desc は敬体1〜2文。**注意点・忘れやすい点だけ `<b>` で強調**（コーラル色になる）。例: 「<b>ログイン情報は忘れないようにメモ</b>してください。」
- スクショは縦長スマホ画面（aspect-ratio 9/19.5 に合わせる）。撮れない手順は `img:null` で文字のみカードにする（PC時はフル幅化される）。
- ヒーローの eyebrow・TOC・sect-tag の英字は大文字。

### 7-3. タイプ診断（assess/index.html）

コンテナは `max-width:680px`。構成: ヘッダー → ヒーロー（タイプ一覧グリッド8体 + 開始ボタン + メタチップ）→ クイズ画面（sticky進捗バー + 質問 + 選択肢）→ 結果画面（結果カード + CTA + 再診断 + 全タイプ一覧）→ タイプ詳細モーダル。

画面遷移は SPA 風に `display:none/block` の切り替えのみ（`#hero` / `#quiz` / `#result` の3セクション）。

データ構造（内容は新サービスの世界観で作り直してよいが、**形は維持**）:

```js
const IMG = { "タイプ画像キー": "data:image/...base64...", /* 8体分 */ };

const TYPES = {
  タイプキー: {
    key:"タイプキー", img:"画像キー", en:"英語名", fname:"妖精名", tname:"〇〇型",
    catch:"キャッチコピー1行",
    lore:"世界観の短い物語（2文程度）",
    lead:"あなたはこういうタイプ、という導入文",
    strong:["強み1","強み2","強み3"],
    grow:["伸ばすポイント1","2","3"],
    style:"副業としてのはじめ方の具体提案（配信頻度・時間帯・スタイル）"
  },
  // ×8タイプ
};
const ORDER = [/* 8キーの表示順 */];

const QUESTIONS = [
  {q:"質問文",o:[
    ["選択肢文言",{タイプキー:加点,タイプキー:加点}],
    // 選択肢は各問4つ
  ]},
  // ×12問
];
```

スコアリング: 選択肢ごとの加点オブジェクトを合算し、最高得点のタイプが結果（同点は ORDER の先勝ち）。「ひとつ前にもどる」は履歴 `history` から減算で復元。

主要な画面パーツの実値:
- 進捗バー: sticky `top:57px`（ヘッダー高に一致させる）、バー高さ5px、`.fill` は `--grad` で `width` を `transition:width .34s ease`
- 質問切替アニメ: `@keyframes qin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}` を `.34s ease` で
- 選択肢ボタン `.opt`: 白背景、`border:1.5px solid var(--line)`、`border-radius:18px`、`padding:18px 22px`、14.5px/700。hover でアンバー枠+paper-2
- 結果カード `.rcard`: radius 28px、`--sh-lg`。ヘッダー部 `.rtop` はグラデ+白点の星屑（`radial-gradient` 4つ重ね、`tw` 3.4s 明滅）。円形イラスト `.rfig` は白フチ `padding:12px` + ふわふわ `fl` 3.4s
- lore の引用風ボックス `.rlore`: `--grad-soft` 背景、左にグラデの縦線3px
- 結果CTAのボタン3つ: LINE相談（`.line`）/ Xシェア（`.dark`、`twitter.com/intent/tweet` に `text`+`url`）/ 結果コピー（`.ghost`、`navigator.clipboard`）
- モーダル: `.mask`（`rgba(58,46,42,.5)`+blur 5px）、`.modal` radius 26px、出現 `mup .34s cubic-bezier(.25,1.2,.4,1)`。Escape・背景クリックで閉じる。768px以上で横型グリッドに
- シェア文言の形: `私に宿る配信の妖精は「(妖精名)」\n(型名)\n(キャッチ)\n\n#配信の妖精タイプ診断 #{{BRAND}}`

※ 診断エンジンの完全なコードは元リポジトリ `assess/index.html` の `<script>` 部にある。ロジックはそのまま流用し、TYPES / QUESTIONS / IMG のデータだけ差し替えるのが最短。

---

## 8. 完了 / 未完了（元プロジェクトの状態）

- [x] 準備トップ・設定ガイド・タイプ診断の3ページすべて完成、公開中
- [ ] 別サービス版（この引き継ぎ書で新規制作するもの）

新規制作の推奨手順:
1. 差し替え変数（0章）を確定する
2. 準備トップを共通コンポーネントで組む
3. 新サービスのアプリでスクショを撮り、base64化して設定ガイドを組む
4. 診断はエンジン流用、データ8タイプ×12問を新サービスの世界観で用意
5. 実機スマホ幅（375px前後）と400px以下・880px以上を必ず目視確認

---

## 9. 守るべきルール・やらないこと

ユーザー指示として確定しているルール（会話・修正履歴由来）:

1. **`<p>` は基本左揃え。** 中央揃えのブロック（hero、sect-head、cta）の中でも、リード文・説明文は `text-align:left` を明示する。見出し・タグ・ボタンだけ中央。
2. **設定ガイドのCTAはシンプルに。** ボタンを置かず「設定が終わったら、担当マネージャーに完了の報告をお願いします。」の見出しのみ。LINEボタンや複数ボタンを足さない（一度実装して削除された経緯あり）。
3. **画像が用意できないステップは無理に画像枠を置かない。** `img:null` → `.no-img` の文字専用カードで見せる。プレースホルダー画像・ダミー画像は使わない。
4. スクショが用意できるまでセクションを仮置きする場合は `.placeholder`（`--grad-soft` 背景 + `1.5px dashed var(--line)`、radius 22px）を使う。
5. `prefers-reduced-motion: reduce` 対応を省略しない。
6. 黒(#000)・純白背景を地の色に使わない（黒はXシェアボタンのみ、白はカード面のみ）。テキストは必ず `--ink` 系3色。
7. 角丸なしの要素・四角いボタンを作らない。ボタン/タグ/チップは常にピル形（radius 100px）。
8. 外部画像URL参照をしない。画像はbase64埋め込みで自己完結させる。

### 9-3. 色を差し替える場合（新サービスのブランドカラーにするとき）

`:root` の変数だけでは完結しない。以下の**ハードコード箇所も一括で**差し替えること:
- `--sh` / `--sh-lg` と各所の `rgba(244,98,58,…)` 影（メイン色のRGB値）
- `.aura.a/.b/.c` の rgba 3色
- スパークルJSの `cols = ["#F4623A","#FA8B33","#FFA42B","#FFC12E"]`（3ページ各所）
- `.card-cta` の影 `rgba(244,98,58,.5)`、`.step` の影2つ
- テキスト色 `--ink` 系はブランド色の同系統の暗色にする（現状はオレンジ系に合わせた焦げ茶）

---

## 10. ハマった点・注意点

- **sticky の重なり:** 診断ページの進捗バーは `top:57px`。これはサイトヘッダーの実高（ロゴ32px + padding 10px×2 + border 1px ≒ 53〜57px）に依存する。ヘッダーの高さを変えたら追従させること。
- **backdrop-filter:** iOS Safari 用に `-webkit-backdrop-filter` を必ず併記（ヘッダー・進捗バー・モーダル背景）。
- **base64画像でファイルが巨大化する:** 設定ガイドは約630KB。スクショは webp 化・幅720px程度に縮小してからbase64にする。1ページ1MB以内を目安。
- **グラデ文字の Safari 対策:** `.grad-text` は `-webkit-background-clip:text` と標準 `background-clip:text` を両方書き、`color:transparent` も併記。
- **モーダル表示中のスクロール:** `document.body.style.overflow = "hidden"` で背面固定、閉じるときに戻す。`overscroll-behavior:contain` もマスクに付与。
- **X の共有URL:** `https://twitter.com/intent/tweet?text=...&url=...`（x.com ではなく twitter.com のままで動作確認済み）。
- **ページを事務所トップと同一リポジトリに置く場合:** 準備ページ群は自己完結HTMLなので、トップの `css/style.css` や `js/main.js` を読み込まないこと（混ぜると崩れる）。
