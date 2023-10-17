// 指定されたセレクターの最初のものを返す
// 存在しない場合はnullが返される
let container = document.querySelector('.container');
// querySelector()のID版見たなもの
let gridButton = document.getElementById('submit-grid');
let clearGridButton = document.getElementById('clear-grid');
let gridWidth = document.getElementById('width-range');
let gridHeight = document.getElementById('height-range');
let colorButton = document.getElementById('color-input');
let eraseBtn = document.getElementById('erase-btn');
let paintBtn = document.getElementById('paint-btn');
let widthValue = document.getElementById('width-value');
let heightValue = document.getElementById('height-value');

// マウスイベントとタッチイベントをの種類を整理して格納するオブジェクト（オブジェクトリテラル）
let events = {
    mouse:{
        down: 'mousedown',
        move: 'mousemove',
        up: 'mouseup',
    },

    touch:{
        down: 'touchstart',
        move: 'touchmove',
        up: 'touchend',
    }
};

let deviceType = '';

let down = false;
let erase = false;

// デバイスがPCかスマホかを判定する関数
const isTouchDevice = () => {
    // document.createEvent('TouchEvent');が生成できればスマホ
    try {
        document.createEvent('TouchEvent');
        deviceType = 'touch';
        return true;
    // document.createEvent('TouchEvent');が生成できなければエラーがでてPCと判断する
    } catch (e) {
        deviceType = 'mouse';
        return false;
    }
};

isTouchDevice();

gridButton.addEventListener('click', ()=>{
    // container内の全ての子要素、テキストをからにしている（削除している）。
    container.innerHTML = '';
    let count = 0;
    // .valueはinputタグやtextareaタグがもつ属性の値
    for (let i = 0; i < gridHeight.value; i++) {
        count += 2;
        let div = document.createElement('div'); // 新しいdivタグを生成している
        div.classList.add('gridRow'); // 新しく作ったdivタグにクラスを指定している

        for (let j = 0; j < gridWidth.value; j++) {
            count += 2;
            let col = document.createElement('div');
            col.classList.add('gridCol');
            col.setAttribute('id', `gridCol${count}`);//作成したdivタグcolにidを設定している
            col.addEventListener(events[deviceType].down, ()=>{ //デバイスによって先ほどのeventsオブジェクトからイベントを追加している
                draw = true;
                if (erase) {
                    col.style.backgroundColor = 'transparent';
                } else {
                    col.style.backgroundColor = colorButton.value;
                }
            });

            col.addEventListener(events[deviceType].move, (e) => {
                let elementId = document.elementFromPoint(
                    // 三項演算子(条件式?式１:式2,)
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                ).id ; //指定された座標上の最前面のid属性(プロパティ)を指定している
                checker(elementId);
            });

            //クリックしていない又は、タッチしていない時の処理
            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });

            div.appendChild(col); //55~59で作った新しいdivタグの中にcolを追加している

        }

        container.appendChild(div); //containerにcolの入ったdivタグを追加していく

    }
});

//81で使われてる関数
function checker(elementId) {
    //全ての.gridColをgridColumnsというNodeListに格納している
    let gridColumns = document.querySelectorAll('.gridCol');
    //gridColumns内の各要素を順番にelementに入れて処理を行っていくコールバック関数
    gridColumns.forEach((element) => {
        if (elementId == element.id) {
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value;
            } else if (draw && erase) {
                element.style.backgroundColor = 'transparent';
            }
        }
    });
}

// containerの中を空に（削除）して初期化
clearGridButton.addEventListener('click', () => {
    container.innerHTML = '';
});

// 消しゴム機能をオンにする
eraseBtn.addEventListener('click', () => {
    erase = true;
});

// 消し号機能をオフにする
paintBtn.addEventListener('click', () => {
    erase = false;
});

// 三項演算子
// gridWidth.valueが一桁の時に最初に0を入れてユーザーにわかりやすくするための設定
gridWidth.addEventListener('input', () => {
    widthValue.innerHTML = gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
});

// 同様
gridHeight.addEventListener('input', () => {
    heightValue.innerHTML = gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value;
});

// window.onloadはページ全体が読み込まれた後に実行されるイベントハンドラー
window.onload = () => {
    gridHeight.value = 0;
    gridWidth.value = 0;
};