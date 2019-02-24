export function toggle() {
  'use strict';

  const FOCUSABLE = 'a, area, input, button, select, option, textarea, output, summary, video, audio, object, embed, iframe';
  const TRANSITIONEND = 'transitionend';

  setToggle('.toggle');

  function setToggle (rootEl, options) {
    const rootElement = document.querySelectorAll(rootEl);
    let o = {
      hook: '.toggle__hook',
      content: '.toggle__content',
      openTxt: 'トグルを開く',
      closeTxt: 'トグルを閉じる',
      duration: 300,
      easing: 'ease'
    };

    if (options) {
      for (let key in options) {
        o[key] = options[key];
      }
    }

    return rootElement.forEach(function (i) {
      const root = i;

      /**
       * トグル機能
       * @constructor
       */
      const Toggle = function () {
        this.root = root;
        this.hook = root.querySelector(o.hook);
        this.content = root.querySelector(o.content);
        this.focusEl = this.content.querySelectorAll(FOCUSABLE);
        this.openTxt = o.openTxt;
        this.closeTxt = o.closeTxt;
        this.buttonTxt = null;
        this.duration = o.duration;
        this.easing = o.easing;
        this.isSliding = false;
        this.height = 0;
      };

      Toggle.prototype = {
        init: function () {
          this.setStyle();
          this.setAccessibility();
          this.clickHandler();
        },

        /**
         * トグルのスタイルを追加
         * @returns {void}
         */
        setStyle: function () {
          let triggerIcon = document.createElement('span');
          let triggerInitTxt = document.createTextNode(this.openTxt);

          this.content.style.transitionDuration = this.duration / 1000 + 's';
          this.content.style.transitionTimingFunction = this.easing;
          triggerIcon.appendChild(triggerInitTxt);
          this.hook.appendChild(triggerIcon);
          this.buttonTxt = this.hook.querySelector('span');
        },

        /**
         * アクセシビリティ要項追加
         * @returns {void}
         */
        setAccessibility: function () {
          this.hook.setAttribute('aria-expanded', false);
          this.content.setAttribute('aria-hidden', true);
        },

        /**
         * クリック時の処理
         * @returns {void}
         */
        clickHandler: function () {
          let self = this;

          this.hook.addEventListener('click', function (e) {
            let hookState = e.target.getAttribute('aria-expanded');

            if (self.isSliding) {
              return;
            }

            self.isSliding = true;

            if (hookState === 'false') {
              self.openToggle();
            } else {
              self.closeToggle();
            }

            self.changeTabIndex();
            self.content.addEventListener(TRANSITIONEND, function () {
              self.transitionHandler(self);
            });
          });
        },

        /**
         * 開閉アニメーション終了後の処理
         * @returns {void}
         */
        transitionHandler: function (self) {
          if (self.content.offsetHeight === 0) {
            self.content.setAttribute('aria-hidden', true);
          }

          self.content.style.height = '';
          self.isSliding = false;
        },

        /**
         * トグルを開く機能
         * @returns {void}
         */
        openToggle: function () {
          this.hook.setAttribute('aria-expanded', true);
          this.content.setAttribute('aria-hidden', false);
          this.buttonTxt.textContent = this.closeTxt;
          this.height = this.content.offsetHeight; 
          this.content.style.height = 0;

          if (this.content.offsetHeight !== 0) {
            requestAnimationFrame(this.openToggle);
            return;
          }

          this.content.style.height = this.height + 'px';
        },

        /**
         * トグルを閉じる機能
         * @returns {void}
         */
        closeToggle: function () {
          this.height = this.content.offsetHeight;
          this.content.style.height = this.height + 'px';
          this.hook.setAttribute('aria-expanded', false);
          this.buttonTxt.textContent = this.openTxt;

          if (this.content.offsetHeight !== this.height) {
            return;
          }

          this.content.style.height = 0;
        },

        /**
         * タブインデックスの操作
         * @returns {void}
         */
        changeTabIndex: function () {
          let hookState = this.hook.getAttribute('aria-expanded');

          if (!this.focusEl.length) {
            return;
          }

          this.focusEl.forEach(function (i) {
            if (hookState === 'true') {
              i.setAttribute('tabindex', 0);
            } else {
              i.setAttribute('tabindex', -1);
            }
          });
        }
      };

      let toggle = new Toggle();
      toggle.init();
    });
  }
}
