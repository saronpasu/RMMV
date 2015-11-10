### 注意事項

このプラグインは「未完成（開発中）」です。


### これは何？

位置情報を取得する基本モジュールのプラグインさんです。

モジュールのデモ用として、万歩計（移動中の距離を記録し続ける機能）をツクってみました。

このプラグインを使えば、割とシンプルに位置ゲーがツクれる・・・・・・かも、しれません。

主にスマホ（タブレット）向けの機能です。



使い方は、 js/plugins フォルダへ入れてプラグインマネージャーで登録するだけです。

詳しい処理は GeoManager.js, GeoLogger.js を見て下さい。



### 主な機能と使い方

あとで書く


### 準備編（Androidアプリ)

Android アプリのビルド方法は、 RPG ツクールMV(RPGMaker MV) の付属マニュアルを参照下さい。

マニュアル記載のビルド手順では、アプリのパーミッション（権限）が許可されません。

そこで、「位置情報取得を許可する」パーミッションでビルドしましょう。

マニュアル記載の手順で途中までビルド準備をします。

途中で作成する 「 manifest.json 」 ファイルに次のように編集を加えましょう。

```json:manifest.json
{
  "name": "GeoLoggerDemo",
  "xwalk_version": "0.0.1",
  "start_url": "index.html",
  "display": "fullscreen",
  "default_locale": "ja",
  "locale": "ja",
  "orientation": "portrait",
  "installLocation": "auto",
  "xwalk_permissions": [
    "Geolocation"
  ],
  "icons": [
    {
      "src": "icon/icon.png",
      "sizes": "48x48",
      "type": "image/png",
      "density": "4.0"
    }
}
```

これで、「位置情報取得」のパーミッションは設定できました。

あとは、マニュアル記載通りの手順でビルドすれば完成です。


### 動作確認編

あとで書く


## History
version 0.0.1
- Write It.

## Author
saronpasu

- Twitter: https://twitter.com/saronpasu

## License
MIT ライセンス です。
