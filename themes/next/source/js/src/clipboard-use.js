/*页面载入完成后，创建复制按钮*/
!(function(e, t, a) {
  /* code */
  var initCopy = function() {
    var COPY_TEXT_NORMAL = "复制";
    var COPY_TEXT_SUCCESS = "复制成功";
    var COPY_TEXT_FAILED = "复制失败";
    var codes = document.querySelectorAll(".highlight .code pre");
    codes.forEach(function(codeElement) {
      codeElement.parentElement.insertBefore(createCopyBtn(), codeElement);
    });

    // $(".highlight .code pre").before(copyHtml);

    var clipboard = new ClipboardJS(".btn-copy", {
      target: function(trigger) {
        return trigger.nextElementSibling;
      }
    });
    clipboard.on("success", function(e) {
      e.trigger.textContent = COPY_TEXT_SUCCESS;
      reset(e.trigger);
    });
    clipboard.on("error", function() {
      e.trigger.textContent = COPY_TEXT_FAILED;
      reset(e.trigger);
    });

    function createCopyBtn() {
      var copyBtn = document.createElement("button");
      copyBtn.classList.add("btn-copy");
      copyBtn.textContent = COPY_TEXT_NORMAL;
      return copyBtn;
    }
    function reset(element,timeout) {
      setTimeout(function() {
        element.textContent = COPY_TEXT_NORMAL;
      }, timeout || 1000);
    }
  };
  initCopy();
})(window, document);
