男爵さんオーダーメイドのプラグインです。
オーダー内容は「スキルのコストに変数xをｎ点使用する」です。

使い方は、 js/plugins フォルダへ入れてプラグインマネージャーで登録する。
そのあと、適当なコモンイベントを登録して、スキルのメモに「\<variableCost:[1, 5]\>」とか書く。

詳しい処理は SkillCostVariable.js を見て下さい。

以下のネイティブプラグインを一部、オーバーライドしています。
- rpg_objects.js

## History
version 0.0.1
- とりあえず動くようにしたよ！

## Author
saronpasu

- Twitter: https://twitter.com/saronpasu

## License
MIT ライセンス です。
