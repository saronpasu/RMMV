用語（Term）の言語を切り替えるプラグインですよ。

使い方は、 js/plugins フォルダにぶっ込むだけ。

［注意事項］文字コードは必ず「UTF-8」で保存してください！

詳しい処理は TranslateTerm.js を見て下さい。

以下のネイティブプラグインを一部、オーバーライドしています。
- rpg_manager.js Data_Manager
- rpg_manager.js Text_Manager
- rpg_manager.js Config_Manager
- rpg_window.js Window_Option

version 0.0.1
- とりあえず動くようにした。
- 用語（Term）のメッセージ周りは未訳です。

version 0.0.2
- テストモードでも動作するようにした。
- 用語(Term)のメッセージもだいたい翻訳した。

version 0.0.3
- $dataSystem.localeも変更するように修正。

version 0.0.4
- オプション設定が正しく読み込まれない不具合を修正。

## License
MIT ライセンス です。

