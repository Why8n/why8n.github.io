// build time:Thu Feb 13 2020 19:46:38 GMT+0800 (China Standard Time)
!function(t,n,e){var r=function(){var n="复制";var e="复制成功";var r="复制失败";var o=document.querySelectorAll(".highlight .code pre");o.forEach(function(t){t.parentElement.insertBefore(c(),t)});var i=new ClipboardJS(".btn-copy",{target:function(t){return t.nextElementSibling}});i.on("success",function(t){t.trigger.textContent=e;u(t.trigger)});i.on("error",function(){t.trigger.textContent=r;u(t.trigger)});function c(){var t=document.createElement("button");t.classList.add("btn-copy");t.textContent=n;return t}function u(t,e){setTimeout(function(){t.textContent=n},e||1e3)}};r()}(window,document);
//rebuild by neat 