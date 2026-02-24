# Nmap Visualizer 🌐

Nmapのスキャン結果をグラフィカルに可視化し、ネットワーク構成を直感的に把握するためのツールです。

![React Flow Canvas](docs/nmap_visualizer/react_flow_render.png)

## ✨ 特徴

- **直感的な可視化**: ホストとポートの関係をグラフ形式で表示
- **詳細情報のドリルダウン**: ノードをクリックすることで、バージョン情報やスクリプト実行結果（`-sC`, `-sV`）を詳細パネルで確認可能
- **Web & デスクトップ対応**: ブラウザ上で動作するWeb版と、Electronベースのデスクトップアプリ版の両方をサポート
- **モダンなUI**: Tailwind CSSを使用した美しいダークモードインターフェース

## 🚀 はじめ方

### インストール

```bash
git clone https://github.com/your-username/nmap-visualizer.git
cd nmap-visualizer
npm install
```

### 開発用サーバーの起動

**Web版:**
```bash
npm run dev
```

**Electron版:**
```bash
npm run dev:electron
```

### ビルド

**Web版 (GitHub Pages等):**
```bash
npm run build:web
```

**デスクトップアプリ版:**
```bash
npm run build
```

## 📖 使い方

1. Nmapでスキャンを実行し、その結果（テキスト）をコピーします。
   - 例: `nmap -sV -sC -oN scan.txt <target>`
2. 本ツールの左パネルにあるテキストエリアに貼り付けます。
3. 「Visualize Network」ボタンをクリックします。
4. 描画されたノードをクリックして詳細を確認します。

## 🛠️ 技術スタック

- React
- React Flow (グラフ描画)
- Tailwind CSS (スタイリング)
- Vite (開発/ビルドツール)
- Electron (デスクトッププラットフォーム)
- TypeScript

## 📄 ライセンス

MIT
