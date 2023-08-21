![KnowHowNote-タイトル](https://github.com/kawahiro673/nodejs-itnote-app/assets/126426280/502a5c04-a2e4-4796-9ca2-57b060aa46b1)

##  Know How Note 

##  サービス概要

業務で得たノウハウや自宅学習での学びを一括管理し、フレンドに共有することのできる Web サービスです。

相手の「利用者ID」を登録することによりフレンドへの追加が可能で、個々人でノウハウを共有し合うことができます。また、独自のグループを作成することにより、グループへ配属されたフレンド全員へ一括共有することも可能です。

業務内や学習の中で得たノウハウを管理することは非常に大事なことです。ノウハウを効果的に蓄積・共有すれば、「業務効率化・生産性向上」に繋がりますし、学習したことを復習として学び直すことにより「記憶の定着」に繋がります。「どこでノウハウを管理していたか忘れてしまった・・・」そんな方にお勧めのWebサービスです。

##  メイン機能

**1.ノウハウの作成** <br>
「ノウハウ追加」、「フォルダ追加」ボタンからそれぞれノウハウ・フォルダを作成し、フォルダごとにまとめて一括管理することが可能です。 <br>
フォルダの右クリックメニューからも作成可能で、右クリックしたフォルダの配下に作成されます。
    
![ノウハウ追加ボタン](https://github.com/kawahiro673/nodejs-itnote-app/assets/126426280/c1942598-34a4-42fd-a99a-2f2bb5ff8254)

**2.ノウハウの共有** <br>
作成したノウハウを任意のメッセージを添えて「共有」ボタンから任意のユーザーに共有可能です。グループを選択した際にはグループに配属しているユーザーにも共有可能になります。 <br>
共有されたノウハウは、シェアノウハウのタブへ追加され、コンテキストメニューの「マイノウハウへ追加」を押下時にマイノウハウへ追加されます。
     
![共有ボタン](https://github.com/kawahiro673/nodejs-itnote-app/assets/126426280/f9901789-fa62-4aa6-85f0-bd3f2801b244)
![フレンドリスト](https://github.com/kawahiro673/nodejs-itnote-app/assets/126426280/2130da61-4d1f-4a3f-a1e3-14aea6ee9869)

**3.ノウハウ・フォルダの配置** <br>
ノウハウまたはフォルダをドラッグ&ドロップすることによりお好みの位置に配置することが可能です。 <br>
移動したノウハウやフォルダはその位置がDBに保存されるため、次回以降後も同じ構成で使用することができます。

![ドラッグアンドドロップ](https://github.com/kawahiro673/nodejs-itnote-app/assets/126426280/3a667feb-f816-4955-a634-c4c063d638bd)

**4.ノウハウの表示** <br>
作成したノウハウをクリックすることにより、タブが生成され、ノウハウの内容を確認することができます。 <br>
右側のタブ画面から、ノウハウの「編集」「保存」「共有」が可能になり、右下に最終保存日付が表示されます。

![タブ](https://github.com/kawahiro673/nodejs-itnote-app/assets/126426280/38b665f3-34e0-498e-a1ea-0800d97895cf)

**5.ユーザー新規登録 & ユーザーログイン & パスワードリセット機能** <br>
ユーザーの新規登録からログイン、パスワードリセットを行う事ができます。フレンドの追加や利用者IDの更新、パスワードとメールアドレスの更新以外は、未登録のゲストユーザーでも操作可能となっています。

![トップページ](https://github.com/kawahiro673/nodejs-itnote-app/assets/126426280/7d05f1e7-2626-4f4c-a82c-0d529e1e50ef)
    
**6.その他機能** <br>
ノウハウの共有履歴の確認やタブやノウハウ・背景の配色変更が可能です。

![共有履歴](https://github.com/kawahiro673/nodejs-itnote-app/assets/126426280/ed967563-07be-46fa-bf9b-ccdf4a805e8f)
![タブの色](https://github.com/kawahiro673/nodejs-itnote-app/assets/126426280/1a27572b-69fa-4e01-82a9-42e97e6d8966)

<!-- 
## 👀 全体的な仕組み

ここにシステムの図を入れる
-->
##  開発環境

- HTML
- CSS
- Javascriprt
- Node.js　(Express)
- MySQL
- HEROKU
- VSCode（Visual Studio Code）

##  画面仕様/画面遷移図
[Figma]https://www.figma.com/file/tWQotfqXduFKvUqG8kdO6k/%E3%83%8E%E3%82%A6%E3%83%8F%E3%82%A6%E3%83%8E%E3%83%BC_%E7%94%BB%E9%9D%A2%E4%BB%95%E6%A7%98%2F%E7%94%BB%E9%9D%A2%E9%81%B7%E7%A7%BB?type=design&node-id=0%3A1&mode=design&t=WK2vuTqV996VRYNG-1

## 🌐 App URL

### **https://nodejs-itnote-app.herokuapp.com**
