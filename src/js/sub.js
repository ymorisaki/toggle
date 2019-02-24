export function toggle() {
  'use strict';

  setToggle('.toggle__hook');

  function setToggle(root) {
    const FOCUSABLE = 'a, area, input, button, select, option, textarea, output, summary, video, audio, object, embed, iframe';
    const trigger = document.querySelectorAll(root);
    let toggleContent = trigger.nextElementSibling;
    let height = 0;
    let isSliding = false;
    const openTxt = 'トグルを開く';
    const closeTxt = 'トグルを閉じる';
  
    function init () {
      trigger.forEach(function (i) {
        appendToggleIcon(i);
        setWaiAria(i);
        i.addEventListener('click', clickHandler);
        i.nextElementSibling.addEventListener('transitionend', transitionHandler);
      });
    }
  
    function appendToggleIcon(target) {
      let triggerIcon = document.createElement('span');
      let triggerInitTxt = document.createTextNode(openTxt);
      triggerIcon.appendChild(triggerInitTxt);
      target.appendChild(triggerIcon);
    }
  
    function setWaiAria(target) {
      target.setAttribute('aria-expanded', false);
      target.nextElementSibling.setAttribute('aria-hidden', true);
    }
  
    function clickHandler(e) {
      let hook = e.target;
      let content = hook.nextElementSibling;
      let hookState = hook.getAttribute('aria-expanded');
  
      e.preventDefault();
  
      if (isSliding) {
        return;
      }
  
      isSliding = true;
  
      if (hookState === 'false') {
        openToggle(hook, content);
      } else {
        closeToggle(hook, content);
      }
    }
  
    function transitionHandler(e) {
      let target = e.target;
  
      if (target.offsetHeight === 0) {
        target.setAttribute('aria-hidden', true);
      }
  
      target.style.height = '';
      isSliding = false;
    }
  
    function openToggle(target, targetNextEl) {
      changeTabindex(targetNextEl);
  
      target.setAttribute('aria-expanded', true);
      targetNextEl.setAttribute('aria-hidden', false);
      height = targetNextEl.offsetHeight;
      targetNextEl.style.height = '0';
  
      if (targetNextEl.offsetHeight !== 0) {
        requestAnimationFrame(openToggle);
        return;
      }
  
      targetNextEl.style.height = height + 'px';
    }
  
    function closeToggle(target, targetNextEl) {
      changeTabindex(targetNextEl);
  
      target.setAttribute('aria-expanded', false);
      height = targetNextEl.offsetHeight;
      targetNextEl.style.height = height + 'px';
  
      if (targetNextEl.offsetHeight !== height) {
        return;
      }
  
      targetNextEl.style.height = 0;
    }
    
    function changeTabindex(target) {
      let targetState = target.getAttribute('aria-hidden');
      let focusEl = target.querySelectorAll(FOCUSABLE);
  
      if (!focusEl.length) {
        return;
      }
  
      focusEl.forEach(function (i) {
        if (targetState === 'true') {
          i.setAttribute('tabindex', 0);
        } else {
          i.setAttribute('tabindex', -1);
        }
      });
    }
  
    // Just Do It!!!!!!
    init();
  }
}