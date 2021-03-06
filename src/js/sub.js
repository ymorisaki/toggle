export function toggle() {
  'use strict';

  const FOCUSABLE = 'a, area, input, button, select, option, textarea, output, summary, video, audio, object, embed, iframe';
  const TRANSITIONEND = 'transitionend';

  /**
   * トグル機能
   * @constructor
   */
  class Toggle {
    constructor (root, options) {
      const o = {
        hook: '.toggle__hook',
        content: '.toggle__content',
        openTxt: 'トグルを開く',
        closeTxt: 'トグルを閉じる',
        duration: 300,
        easing: 'ease'
      };

      Object.assign(o, options);

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

      this.setStyle();
      this.setAccessibility();
      this.clickEvent();
    };

    /**
     * トグルのスタイルを追加
     * @returns {void}
     */
    setStyle () {
      const triggerIcon = document.createElement('span');
      const triggerInitTxt = document.createTextNode(this.openTxt);

      this.content.style.transitionDuration = this.duration / 1000 + 's';
      this.content.style.transitionTimingFunction = this.easing;
      triggerIcon.appendChild(triggerInitTxt);
      this.hook.appendChild(triggerIcon);
      this.buttonTxt = this.hook.querySelector('span');
    }

    /**
     * アクセシビリティ要項追加
     * @returns {void}
     */
    setAccessibility () {
      this.hook.setAttribute('aria-expanded', false);
      this.content.setAttribute('aria-hidden', true);
    }

    /**
     * クリック時の処理
     * @returns {void}
     */
    clickEvent () {
      this.hook.addEventListener('click', (e) => {
        const ariaHookState = e.target.getAttribute('aria-expanded');

        if (this.isSliding) {
          return;
        }

        this.isSliding = true;

        if (ariaHookState === 'false') {
          this.openToggle();
        } else {
          this.closeToggle();
        }

        this.changeTabIndex();
        this.content.addEventListener(TRANSITIONEND, () => {
          this.transitionEvent(this);
        });
      });
    }

    /**
     * 開閉アニメーション終了後の処理
     * @returns {void}
     */
    transitionEvent (self) {
      if (self.content.offsetHeight === 0) {
        self.content.setAttribute('aria-hidden', true);
      }

      self.content.style.height = '';
      self.isSliding = false;
    }

    /**
     * トグルを開く機能
     * @returns {void}
     */
    openToggle () {
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
    }

    /**
     * トグルを閉じる機能
     * @returns {void}
     */
    closeToggle () {
      this.height = this.content.offsetHeight;
      this.content.style.height = this.height + 'px';
      this.hook.setAttribute('aria-expanded', false);
      this.buttonTxt.textContent = this.openTxt;

      if (this.content.offsetHeight !== this.height) {
        return;
      }

      this.content.style.height = 0;
    }

    /**
     * タブインデックスの操作
     * @returns {void}
     */
    changeTabIndex () {
      const ariaHookState = this.hook.getAttribute('aria-expanded');

      if (!this.focusEl.length) {
        return;
      }

      this.focusEl.forEach((el) => {
        if (ariaHookState === 'true') {
          el.removeAttribute('tabindex');
        } else {
          el.tabIndex = -1;
        }
      });
    }
  }

  document.querySelectorAll('.toggle').forEach((el) => {
    new Toggle(el);
  });
}
