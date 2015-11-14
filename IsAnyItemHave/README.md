「いずれかのアイテムを持っているかどうかを確認する」プラグイン。

登録方法は、 js/plugins フォルダへ入れてプラグインマネージャーで登録するだけです。

### 使い方
プラグインマネージャかスクリプトコマンドで使います。

- プラグインコマンドの場合

```
IsAnyItemHave スイッチID アイテム名１ アイテム名２ アイテム名３ ...
```
- コマンド名は「IsAnyItemHave」です。
- スイッチIDは数字で入力して下さい。そのIDのスイッチに結果が入ります。(ON:持ってる/OFF:持ってない)
- アイテム名は確認したいアイテム名を入れます。いくつでも入れられます。
   - 注意事項：プラグインコマンドは半角スペースで区切って下さい。

- スクリプトコマンドの場合

```javascript
$gameParty.isAnyItemHave(['アイテム名１', 'アイテム名２']);
```
- 結果は、アイテムを持っている場合は true 持ってない場合は false が返ります。



詳しい処理は IsAnyItemHave.js を見て下さい。



## History
version 0.0.1
- ツクった！

## Author
saronpasu

- Twitter: https://twitter.com/saronpasu

## License
MIT ライセンス です。
