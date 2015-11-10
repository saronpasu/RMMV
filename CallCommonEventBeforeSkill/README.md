男爵さんオーダーメイドのプラグインです。
オーダー内容は「スキル使用前にコモンイベント」です。

使い方は、 js/plugins フォルダへ入れてプラグインマネージャーで登録する。

そのあと、適当なコモンイベントを登録して、スキルのメモに「\<before:CommonEvent:1\>」とか書く。

詳しい処理は CallCommonEventBeforeSkill.js を見て下さい。

以下のネイティブプラグインを一部、エイリアスしています。
- rpg_objects.js
- rpg_scenes.js
- rpg_manager.js

## History
version 0.0.1
- とりあえず動くようにしたよ！

version 0.0.2
- まともに動作しなかった不具合を修正

version 0.1.0
- コモンイベントが正しく実行されなかった不具合を修正

version 0.1.2
- スキル前にコモンイベントを呼べていなかった不具合を修正

version 0.1.4
- 最初の一回しか動作しなかった不具合を修正　けい＠ABOW さんありがとう！！

## Author
saronpasu

## Specian Thanks
- けい＠ABOW さん

- Twitter: https://twitter.com/saronpasu

## License
MIT ライセンス です。
