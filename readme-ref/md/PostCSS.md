# PostCSS

- PostCSS 자체는 아무 일도 하지 않는다.
- 다양한 플러그인과, 그 플러그인을 추가할 수 있는 환경을 제공할 뿐이다.
- PstCSS 플러그인 리스트
  <https://github.com/postcss/postcss/blob/main/docs/plugins.md>
- 자주 사용하는 플러그인

  - autoprefixer

    - -webkit- 등의 prefix 없이 스타일 지정

    ```css
    a {
      display: flex;
    }

    /* result */
    a {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }
    ```

  - postcss-color-function

    - color modifier를 사용할 수 있게 해줌

    ```css
    a {
      color: color(red lightness(+10%));
    }

    /* result */
    a {
      color: rgb(255, 51, 51);
    }
    ```

  - postcss-custom-properties

    - CSS에서 변수를 사용할 수 있게 해줌

    ```css
    :root {
      --color: red;
    }

    div {
      color: var(--color);
    }

    /* result */
    div {
      color: red;
    }
    ```

  - postcss-import

    - css @import 룰을 사용할 수 있게 해줌

    ```css
    /* foo.css */
    .foo {
      width: 100px;
    }
    /* bar.css */
    .bar {
      height: 20px;
    }

    /* index.css */
    @import 'foo.css';
    @import 'bar.css';

    /* result of index.css */
    .foo {
      width: 100px;
    }
    .bar {
      height: 20px;
    }
    ```

  - postcss-nesting

    - nesting 문법을 사용할 수 있게 해줌

    ```css
    a,
    b {
      color: red;
      & c,
      & d {
        color: white;
      }
      &:hover {
        color: black;
      }
      @nest div > & {
        color: blue;
      }
    }

    /* result */
    a,
    b {
      color: red;
    }
    a c,
    a d,
    b c,
    b d {
      color: white;
    }
    a:hover,
    b:hover {
      color: black;
    }
    div > a,
    div > b {
      color: blue;
    }
    ```

  - postcss-for

    - css 내에서 for문을 사용할 수 있게 해줌

    ```css
    @for $i from 1 to 3 {
      .icon-$(i) {
        background-position: 0 calc($(i) * 20px);
      }
    }

    /* result */
    .icon-1 {
      background-position: 0 calc(1 * 20px);
    }
    .icon-2 {
      background-position: 0 calc(2 * 20px);
    }
    .icon-3 {
      background-position: 0 calc(3 * 20px);
    }
    ```

  - postcss-assets

    - url() 내에 들어가는 파일의 경로를 편리하게 작성하거나, 이미지의 사이즈를 측정하고 가져올 수 있게 도와줌

    ```css
    /* with loadPath settings */
    body {
      background: resolve('bg.png');
    }
    .warn {
      width: width('warn.png'); /* calculate image size */
      background: resolve('warn.png');
    }

    /* result */
    body {
      background: url('/images/bg.png');
    }
    .warn {
      width: 320px;
      background: url('/images/template/warn.png');
    }
    ```
