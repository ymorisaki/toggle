export function toggle() {
  'use strict';

  const FOCUSABLE = 'a, area, input, button, select, option, textarea, output, summary, video, audio, object, embed, iframe';

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
      const Toggle = function () {
        this.root = root;
        this.hook = root.querySelector(hook);
        this.content = root.querySelector(content);
        this.focusEl = root.querySelectorAll(FOCUSABLE);
        this.openTxt = o.openTxt;
        this.closeTxt = o.closeTxt;
        this.isSliding = false;
      };

      Toggle.prototype = {
        init: function () {
          this.setAccessibility();
          this.clickHandler();
        },

        clickHandler: function () {
          let self = this;

          this.hook.addEventListener('click', function (e) {
            let hookState = e.target.getAttribute('aria-expanded');

            if (this.isSliding) {
              return;
            }

            self.isSliding = true;

            if (hookState === 'false') {
              self.openToggle();
            } else {
              self.clolseToggle();
            }
          });
        },

        openToggle: function () {
        },

        clolseToggle: function () {
        },

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