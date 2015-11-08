音声読み上げプラグインさんです。

[注意事項！]

ブラウザでのみ動作します。

Win/Macのパッケージ版や、android/iPhoneのアプリ版では動作しません。


使い方

 - 1)プラグインマネージャで「 TTS 」を登録する。
 - 2)メッセージで「\T[hello]」と入れる。
 - 3)読み上げられる！

### 日本語の読み上げをやりたい場合

$dataSystem.locale が 「ja_JP」の場合は自動的に日本語読み上げ可能になってます。

手動で言語設定を切り替える場合は、

プラグインコマンドから「TTS setLang 'ja-JP'」と設定して下さい。



詳しい処理は TTS.js を見て下さい。



以下のネイティブプラグインを一部、オーバーライドしています。
- rpg_windows.js Window_Base

## History
version 0.0.1
- とりあえず動くようにしたよ！

version 0.0.2
- 読み上げの停止と割り込みについて処理を追加。
- 読み上げの完了を待機する処理については実装方法を検討中。
- いろいろありがとう！ @tkoolmv さん

## Author
saronpasu

- Twitter: https://twitter.com/saronpasu

## License
MIT ライセンス です。

