<img src="public/img/README_img/タイトル.png">

## Know How Note 　(作成期間 '23 年 2〜9 月)

### **https://knowhownote-106672fa32dd.herokuapp.com/**

<br>

## サービス概要

業務で得たノウハウや学びを一括管理し、フレンドに共有することのできる Web サービスです。

相手の「利用者 ID」を登録することによりフレンドへの追加が可能で、個人で作成したノウハウを共有し合うことができます。また、独自のグループを作成することにより、グループへ配属されたフレンド全員へ一括共有することも可能です。

業務内や学習の中で得たノウハウを管理することは非常に大事なことです。ノウハウを効果的に蓄積・共有すれば、「業務効率化・生産性向上」に繋がりますし、学習したことを復習として学び直すことにより「記憶の定着」に繋がります。<br>「どこでノウハウを管理していたか忘れてしまった・・・」<br>「ノウハウを簡単に共有出来るようにしたい」<br>そんな方にお勧めの、直感的にノウハウを蓄積・管理・共有できる Web サービスです。

<br>

## メイン機能

**1.ノウハウの作成** <br>
「ノウハウ追加」、「フォルダ追加」ボタンからそれぞれノウハウ・フォルダを作成し、フォルダごとにまとめて一括管理することが可能です。 <br>
フォルダのコンテキストメニューからもノウハウ・フォルダそれぞれ作成可能で、対象のフォルダの配下に作成されます。

| ![ノウハウ作成](public/img/README_img/ノウハウ作成.png) |
| :-----------------------------------------------------: |
|                     ノウハウの作成                      |

<br>

**2.ノウハウの共有** <br>
作成したノウハウはメッセージを添えて「共有」ボタンから任意のユーザーに共有可能です。グループを選択した際にはグループに配属しているユーザーにも共有可能になります。 <br>

| ![共有ボタン](public/img/README_img/共有ボタン.png) | ![フレンドリスト](public/img/README_img/フレンドリスト.png) |
| :-------------------------------------------------: | :---------------------------------------------------------: |
|                  共有ポップアップ                   |                       フレンドリスト                        |

共有されたノウハウは、右側リストの「シェアノウハウ」タブへ追加され、コンテキストメニューの「マイノウハウへ追加」を押下時にマイノウハウへ追加されます。<br>

| ![シェアノウハウ_コンテキストメニュー](public/img/README_img/シェアノウハウ_コンテキストメニュー.png) |
| :---------------------------------------------------------------------------------------------------: |
|                                   共有ノウハウの右クリックメニュー                                    |

**3.ノウハウ・フォルダの配置** <br>
ノウハウまたはフォルダをドラッグ&ドロップすることによりお好みの位置に配置することが可能です。 <br>
移動したノウハウやフォルダはその位置が DB に保存されるため、次回以降後も同じ構成で使用することができます。

| ![ドラッグアンドドロップ](public/img/README_img/ドラッグアンドドロップ.png) |
| :-------------------------------------------------------------------------: |
|                           ドラッグアンドドロップ                            |

**4.ノウハウの表示** <br>
作成したノウハウをクリックすることにより、タブが生成され、ノウハウの内容を確認することができます。 <br>
右側のタブ画面から、ノウハウの「編集」「保存」「共有」が可能になり、右下に最終保存日付が表示されます。

| ![タブ作成](public/img/README_img/タブ作成.png) |
| :---------------------------------------------: |
|                   タブの作成                    |

**5.ユーザー新規登録 & ユーザーログイン & パスワードリセット機能** <br>
TOP 画面から新規登録・ログイン・ゲストログイン・パスワードリセットを行う事ができます。フレンドの追加や利用者 ID の更新、パスワードとメールアドレスの更新以外は、未登録のゲストユーザーでも操作可能となっています。

| ![パスワード変更](public/img/README_img/パスワード変更.png) |
| :---------------------------------------------------------: |
|                       パスワード変更                        |

**6.その他機能** <br>
ノウハウの共有履歴の確認やタブ・背景の配色変更、共有機能の ON/OFF が個別設定から変更が可能です。

| ![共有履歴](public/img/README_img/共有履歴.png) | ![タブ色](public/img/README_img/タブ色.png) | ![個別設定](public/img/README_img/個別設定.png) |
| :---------------------------------------------: | :-----------------------------------------: | :---------------------------------------------: |
|              共有履歴ポップアップ               |                タブの色変更                 |              個別設定ポップアップ               |

## DB テーブル定義

**register_user テーブル**
| カラム名 | データ型 | Null | デフォルト |
| :---: | :---: | :---: | :---: |
| id | int | NO | NULL |
| UserName | varchar | YES | NULL |
| Email | varchar | YES | - |
| HashedPassword | varchar | YES | NULL |
| CreationDay | varchar | YES | NULL |
| LoginDate | varchar | YES | NULL |
| BackgroundColor | varchar | YES | blue |
| DummyPassword | varchar | YES | NULL |
| ShareFlg | varchar | YES | ON |
| Authentication_ID | varchar | YES | NULL |

**it_memo テーブル**
| カラム名 | データ型 | Null | デフォルト |
| :---: | :---: | :---: | :---: |
| id | int | NO | NULL |
| title | text | YES | NULL |
| memo_text | text | YES | NULL |
| title_color | varchar | YES | NULL |
| tab_color | varchar | YES | NULL |
| saved_time | varchar | YES | NULL |
| parent_id | int | YES | NULL |
| folder_order | int | YES | NULL |
| Type | varchar | YES | NULL |
| UserID | int | YES | NULL |
| Message | varchar | YES | NULL |
| Share_User | varchar | YES | NULL |

**folder テーブル**
| カラム名 | データ型 | Null | デフォルト |
| :---: | :---: | :---: | :---: |
| id | int | NO | NULL |
| folder_name | text | YES | NULL |
| parent_id | int | YES | NULL |
| closed | varchar | YES | NULL |
| folder_order | int | YES | NULL |
| UserID | int | YES | NULL |
| Type | varchar | YES | NULL |

**share_user テーブル**
| カラム名 | データ型 | Null | デフォルト |
| :---: | :---: | :---: | :---: |
| id | int | NO | NULL |
| UserName | varchar | YES | NULL |
| date | varchar | YES | NULL |
| ShareNoteTitle | varchar | YES | NULL |
| UserID | int | YES | NULL |
| Share_ToDo_Flg | varchar | YES | NULL |

**tab_hold テーブル**
| カラム名 | データ型 | Null | デフォルト |
| :---: | :---: | :---: | :---: |
| id | int | NO | NULL |
| focus | int | YES | NULL |
| tabOrder | int | YES | NULL |
| tabTitle | varchar | YES | NULL |
| UserID | int | YES | NULL |
| label_color | varchar | YES | #FFFFFF |

**friend_list テーブル**
| カラム名 | データ型 | Null | デフォルト |
| :---: | :---: | :---: | :---: |
| id | int | NO | NULL |
| user_name | varchar | YES | NULL |
| UserID | int | YES | NULL |
| date | varchar | YES | NULL |
| Changed_Name | varchar | YES | NULL |
| User_Group | varchar | YES | NULL |

**group_list テーブル**
| カラム名 | データ型 | Null | デフォルト |
| :---: | :---: | :---: | :---: |
| id | int | NO | NULL |
| User_Group | varchar | YES | NULL |
| UserID | int | YES | NULL |

**inquiry テーブル**
| カラム名 | データ型 | Null | デフォルト |
| :---: | :---: | :---: | :---: |
| id | int | NO | NULL |
| user | varchar | YES | NULL |
| date | varchar | YES | NULL |
| type | varchar | YES | NULL |
| content | text | YES | NULL |

<!--
## 👀 全体的な仕組み

ここにシステムの図を入れる
-->
<br>

## 開発環境

- HTML
- CSS
- Javascriprt
  - jQuery
- Node.js
  - Express
- MySQL
- HEROKU
- VSCode（Visual Studio Code）

<br>

## 画面仕様/画面遷移図

[Figma]https://www.figma.com/file/tWQotfqXduFKvUqG8kdO6k/%E3%83%8E%E3%82%A6%E3%83%8F%E3%82%A6%E3%83%8E%E3%83%BC_%E7%94%BB%E9%9D%A2%E4%BB%95%E6%A7%98%2F%E7%94%BB%E9%9D%A2%E9%81%B7%E7%A7%BB?type=design&node-id=0%3A1&mode=design&t=WK2vuTqV996VRYNG-1

<br>

## 🌐 App URL

### **https://knowhownote-106672fa32dd.herokuapp.com/**
