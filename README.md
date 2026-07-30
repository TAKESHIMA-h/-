# Claude Code × 動画切り抜きテンプレート

Claude Codeで作ったWebデザインの考え方を、そのまま縦動画にしたRemotionテンプレートです。

## できること

- 1080×1920の縦型リール動画
- 15秒、30fps
- 3本の動画切り抜きを順番に表示
- テロップ、フェード、ズーム、エンドカード付き
- MP4で書き出し

## 1. 起動

```bash
npm install
npm run start
```

ブラウザでRemotion Studioが開き、タイムラインを見ながら編集できます。

## 2. 素材を差し替える

以下の3ファイルを、自分の動画に置き換えます。

```text
public/clips/clip1.mp4
public/clips/clip2.mp4
public/clips/clip3.mp4
```

同じファイル名のまま上書きすればコード変更は不要です。

## 3. 長い動画から実際に切り抜く

例：元動画の12秒地点から4秒だけ切り抜く場合

```bash
ffmpeg -ss 00:00:12 -i input.mp4 -t 4 -c:v libx264 -c:a aac public/clips/clip1.mp4
```

2本目、3本目も開始位置と長さを変えて作ります。

## 4. テキストを変える

`src/Video.tsx` の最初にある `clips` を編集します。

```tsx
const clips = [
  {src: 'clips/clip1.mp4', label: '1つ目のテロップ'},
  {src: 'clips/clip2.mp4', label: '2つ目のテロップ'},
  {src: 'clips/clip3.mp4', label: '3つ目のテロップ'},
];
```

冒頭は `Hook`、最後は `EndCard` の文字を編集します。

## 5. MP4を書き出す

```bash
npm run render
```

完成動画：

```text
out/claude-code-reel.mp4
```

## Claude Codeにそのまま送れる指示

```text
このRemotionプロジェクトを編集してください。
動画はInstagramリール用の縦型1080×1920、15秒です。
public/clipsにある3つの動画素材を使い、テンポよく切り替えてください。
デザインは黒と黄色を基調に、太い日本語タイポグラフィを使ってください。
文字がスマホ画面の端で切れないよう左右64px以上の余白を確保してください。
src/Video.tsxを中心に編集し、npm run renderでMP4を書き出せる状態にしてください。
```
