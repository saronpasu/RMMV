### これは何？

位置情報を取得する基本モジュールのプラグインさんです。

モジュールのデモ用として、万歩計（移動中の距離を記録し続ける機能）をツクってみました。

このプラグインを使えば、割とシンプルに位置ゲーがツクれる・・・・・・かも、しれません。

主にスマホ（タブレット）向けの機能です。

使い方は、 js/plugins フォルダへ入れてプラグインマネージャーで登録するだけです。

「GeoManager.js」は、位置情報を取得する機能と、距離計算機能だけの単機能モジュールです。

プラグイン開発者の方は、こちらを組み込んで自由にお使い下さい。

「GeoLogger.js」は、ゲームのバックグラウンドで実行して、定期的に位置情報を取得します。

移動距離を累計してくれる、いわゆる万歩計プラグインです。



詳しい処理は GeoManager.js, GeoLogger.js を見て下さい。



### 注意事項

このプラグインは、ブラウザ版と Android 版に対応しています。

ＰＣ版（NWｊｓ）には非対応です。

また、検証環境がないため iOS アプリ版については動作未確認となります。


### 主な機能と使い方

「GeoLogger」は主にプラグインコマンドで制御します。

- GeoLogger isSupport 1
   - 位置情報の取得に対応しているかどうかを変数「０００１」へ返します。（対応なら１、非対応なら０）
- GeoLogger start
   - 位置情報の記録を開始します
- GeoLogger stop
   - 位置情報の記録を終了します
- GeoLogger clear
   - 位置情報の記録を削除します
- GeoLogger isRunning 1
   - 位置情報の取得を実行しているかどうかを変数「０００１」へ返します。（実行中なら１、停止中なら０）
- GeoLogger ChangeUnit km
   - 移動距離の単位を変更します。（対応している単位は、メートル「m」、キロメートル「km」、フィート「ft」、マイル「ml」です。
- GeoLogger totalDistance 1
   - 移動距離を変数「０００１」へ返します。（正しく取得できなかった場合は０を返します）

プラグインパラメータは次の通りです。

- Unit
   - 移動距離の単位です。初期値は「メートル(m)」です。（キロメートル、フィート、マイルにも対応）
- HighAccuracy
   - ジオロケーションAPIのオプション値です。初期値は「true」です。
- MaximumAge
   - ジオロケーションAPIのオプション値です。初期値は「0」です。
- Timeout
   - ジオロケーションAPIのオプション値です。初期値は「10000」です。（単位はミリ秒）
- Interval
   - 位置情報の取得間隔です。初期値は「１０」です。（単位は秒）


その他に、スクリプト実行にも対応しています。


- Imported.GeoLogger.start()
   - 位置情報の記録を開始します。
- Imported.GeoLogger.stop()
   - 位置情報の記録を終了します。
- Imported.GeoLogger.clear()
   - 位置情報の記録を削除します。
- Imported.GeoLogger.getCurrent()
   - 現在位置の緯度、経度を取得します。
- Imported.GeoLogger.getTotalDistance()
   - 移動距離を取得します。

しかし、プラグイン製作者の方には「GeoLogger.js」ではなく。「GeoManager.js」を使うことをオススメします。

おそらく、その方が汎用性は高いでしょう。

### プラグインの仕様について

- どうして watchPosition 使わないで getCurrentPosition なの？
   - watchPosition だと。スタンバイ中でもバリバリ測位してバッテリー消耗するみたいだから。

- 位置情報はどこに記録しているの？
   - セーブデータに記録しています。セーブしないと位置情報は保存されません。

- 位置情報をネットでサーバへ送ったりしていない？
   - していません。


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

> xwalk_permissions
>> Geolocation

この設定が「位置情報取得を許可する」やつです。

これで、「位置情報取得」のパーミッションは設定できました。

あとは、マニュアル記載通りの手順でビルドすれば完成です。


### 動作確認編

1) まず。次のようなイベントを登録しましょう。
- Control　Variables： 0001 = 0
- Text: メニュー
- Show Choices: 動作確認，記録スタート，記録ストップ，記録クリア，移動距離を取得，やめる
- When 動作確認
   - Plugin Command: GeoLogger isSupport 1
   - If : #0001 = 1
      - Text: 位置情報が取得可能です
   - Else
      - Text: 位置情報は取得できません
   - End
   - Jump to Label: End
- When 記録スタート
   - Text: 記録をスタートします
   - Plugin Command: GeoLogger start
   - Jump to Label: End
- When 記録ストップ
   - Text: 記録をストップします
   - Plugin Command: GeoLogger stop
   - Jump to Label: End
- When 記録クリア
   - Text: 記録をクリアします
   - Plugin Command GeoLogger clear
   - Jump to Label: End
- When 移動距離を取得
   - Text: 移動距離を取得します
   - Plugin Command: GeoLogger totalDistance 1
   - Text: 移動距離は、「\V[1] メートル」です
   - Jump to Label: End
- Label: End
- Control Variables: 0001 = 0

2) このイベントで実機で動作確認を行ってみてください。

当然ですが。同じ場所で記録しつづけても距離は変化しません。

ある程度の距離を移動してから再度、イベント経由で記録を実行するか。

バックグラウンド操作での記録をお願いします。

なお、「機内モード」など。ＧＰＳやWifi、電波のない状態では位置情報は取得できません。



## History
version 0.0.1
- 基本動作ができました。 Android 版とブラウザ版のみ対応。iOS は開発環境がないため未対応です。

## Author
saronpasu

- Twitter: https://twitter.com/saronpasu

## License
MIT ライセンス です。
