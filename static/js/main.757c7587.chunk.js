(this["webpackJsonpuse-interaction"]=this["webpackJsonpuse-interaction"]||[]).push([[0],[,,,,,,function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},function(e,t,n){e.exports=n(15)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(5),c=n.n(r),l=(n(12),n(1)),u=n(6),i=n.n(u),s=(n(13),n(14),n(2)),m=n(3),d=[],f=function(e){return e.keyCode?e.keyCode:e.which},w=function(){var e=Object(a.useState)(null),t=Object(l.a)(e,2),n=t[0],o=t[1],r=Object(a.useState)(null),c=Object(l.a)(r,2),u=c[0],i=c[1],w=Object(a.useState)(!1),h=Object(l.a)(w,2),b=h[0],v=h[1],E=Object(a.useState)({touchStart:null,mouseMove:null,mouseOver:null,keyDown:null}),p=Object(l.a)(E,2),g=p[0],k=p[1],O=["input","select","textarea"],j={9:"tab",13:"enter",16:"shift",27:"esc",32:"space",33:"page up",34:"page down",35:"end",36:"home",37:"left arrow",38:"up arrow",39:"right arrow",40:"down arrow"},y=Object(a.useCallback)((function(){console.log("touchstart"),k((function(e){return Object(m.a)({},e,{touchStart:!0,mouseMove:!1})})),d=Object(s.a)(new Set([].concat(Object(s.a)(d),["touch"]))),o("touch"),v(!1)}),[k]),S=Object(a.useCallback)((function(){console.log("mousemove"),g.touchStart||k((function(e){return Object(m.a)({},e,{mouseMove:!0})})),g.keyDown&&k((function(e){return Object(m.a)({},e,{mouseMove:!1})})),k((function(e){return Object(m.a)({},e,{touchStart:!1,keyDown:!1})})),console.log(g),console.log(n),null!==g.mouseMove&&!0!==g.mouseMove&&!1!==g.touchStart||(d=Object(s.a)(new Set([].concat(Object(s.a)(d),["mouse"]))),o("mouse"),v(!0))}),[g,n,k,v]),C=Object(a.useCallback)((function(e){if(console.log("keydown",e),Object.prototype.hasOwnProperty.call(j,f(e))){if("tab"!==j[f(e)]&&O.indexOf(function(e){return e.target||e.srcElement}(e).nodeName.toLowerCase())>=0)return;if(k((function(e){return Object(m.a)({},e,{keyDown:!0,mouseMove:!1})})),"keyboard"===n)return;d=Object(s.a)(new Set([].concat(Object(s.a)(d),["keyboard"]))),o("keyboard"),v(!1)}}),[O,j,n,k]),L=Object(a.useCallback)((function(e){i(e.height)}),[i]);return Object(a.useEffect)((function(){return window.addEventListener("touchstart",y,!1),g.mouseMove?window.removeEventListener("mousemove",S,!1):window.addEventListener("mousemove",S,!1),window.addEventListener("keydown",C,!1),window.addEventListener("pointerdown",L,!1),function(){window.removeEventListener("touchstart",y,!1),window.removeEventListener("mousemove",S,!1),window.removeEventListener("keydown",C,!1),window.removeEventListener("pointerdown",L,!1)}}),[g.mouseMove,g.touchStart,C,S,L,y,O,j,n]),console.log(g),console.log([n,"[".concat(d.join(", "),"]"),u,b]),[n,d,u,b]},h=function(){var e=w(),t=Object(l.a)(e,4),n=t[0],a=t[1],r=t[2],c=t[3];return o.a.createElement("div",{className:"Demo","data-user-interaction":n,"data-user-can-hover":c},o.a.createElement("header",null,o.a.createElement("img",{src:i.a,className:"React-logo",alt:"logo"}),o.a.createElement("h1",null,"useInteraction")),o.a.createElement("main",null,o.a.createElement("section",{id:"image"},o.a.createElement("h2",null,"cat"),o.a.createElement("figure",{interaction:n},o.a.createElement("a",{href:"https://flic.kr/p/kq58ST",target:"_blank",rel:"noopener noreferrer"},o.a.createElement("img",{src:"https://farm8.staticflickr.com/7353/12743181443_9dfd24a886_z.jpg",alt:"Beautiful light"})),o.a.createElement("figcaption",null,o.a.createElement("h3",null,o.a.createElement("a",{href:"https://flic.kr/p/kq58ST",target:"_blank",rel:"noopener noreferrer"},"Beautiful light")," ","(CC BY-NC-ND 2.0)"),o.a.createElement("small",null,"by"," ",o.a.createElement("a",{href:"https://www.flickr.com/people/rfunnell/",target:"_blank",rel:"noopener noreferrer"},"Ross Funnell")),o.a.createElement("p",{className:"description"},"The room was vacant except for a metal slab that served as a bed and the six-legged, cat-like creature sitting on the edge of the bed watching its sleeping occupant.")))),o.a.createElement("section",{id:"form"},o.a.createElement("h2",null,"not cat"),o.a.createElement("form",null,o.a.createElement("input",{type:"text"}),o.a.createElement("select",null,o.a.createElement("option",{value:""}),o.a.createElement("option",{value:"0"},"0"),o.a.createElement("option",{value:"1"},"1")),o.a.createElement("textarea",null),o.a.createElement("button",null,"OKAY")))),o.a.createElement("footer",null,o.a.createElement("code",null,"interaction: ",n||"none",o.a.createElement("br",null),"history: ","[".concat(a.join(", "),"]"),o.a.createElement("br",null),"accuracy: ",r||"none",o.a.createElement("br",null),"can hover: ",c.toString())))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(h,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}],[[7,1,2]]]);
//# sourceMappingURL=main.757c7587.chunk.js.map