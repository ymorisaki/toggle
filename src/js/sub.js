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
      closeTxt: 'トグルを閉じる'
    };

    if (options) {
      for (let key in options) {
        o[key] = options[key];
      }
    }

    return rootElement.forEach(function (i) {
      const root = i;
      const hook = o.hook;
      const content = o.content;

      /**
       * トグル機能
       * @constructor
       */
      const Toggle = function () {
        this.root = root;
        this.hook = root.querySelector(hook);
        this.content = root.querySelector(content);
        this.focusEl = this.content.querySelectorAll(FOCUSABLE);
        this.openTxt = o.openTxt;
        this.closeTxt = o.closeTxt;
        this.isSliding = false;
        this.height = 0;
      };

      Toggle.prototype = {
        init: function () {
          this.setAccessibility();
          this.clickHandler();
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
              self.changeTabIndex();
            } else {
              self.closeToggle();
              self.changeTabIndex();
            }

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
          this.content.style.height = this.height + 'px';
          this.hook.setAttribute('aria-expanded', false);
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
        },

        /**
         * アクセシビリティ要項追加
         * @returns {void}
         */
        setAccessibility: function () {
          let triggerIcon = document.createElement('span');
          let triggerInitTxt = document.createTextNode(this.openTxt);
          triggerIcon.appendChild(triggerInitTxt);
          this.hook.appendChild(triggerIcon);
          this.hook.setAttribute('aria-expanded', false);
          this.content.setAttribute('aria-hidden', true);
        }
      };

      let toggle = new Toggle();
      toggle.init();
    });
  }

}