/*! For license information please see bundle.js.LICENSE.txt */
(()=>{"use strict";var t={d:(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)};function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}function n(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,r(o.key),o)}}function o(t,e,n){return(e=r(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(t){var n=function(t){if("object"!=e(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var o=n.call(t,"string");if("object"!=e(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==e(n)?n:n+""}t.d({},{Pk:()=>dt,Y2:()=>ft,mz:()=>ht});var i=function(){return t=function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),o(this,"isConnected",!1),o(this,"value",!1),o(this,"outputs",new Set),this.onChangeCallback=e},(e=[{key:"connect",value:function(t){this.outputs.has(t)||(this.outputs.add(t),this.isConnected=!0,t.setValue(this.value))}},{key:"disconnect",value:function(t){this.outputs.has(t)&&(this.outputs.delete(t),0===this.outputs.size&&(this.isConnected=!1))}},{key:"setValue",value:function(t){this.value!==t&&(this.value=t,this.propagate(),this.onChangeCallback(this.value))}},{key:"getValue",value:function(){return this.value}},{key:"propagate",value:function(){var t=this;this.outputs.forEach((function(e){e.setValue(t.value)}))}}])&&n(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function a(t){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a(t)}function u(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,c(o.key),o)}}function c(t){var e=function(t){if("object"!=a(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var n=e.call(t,"string");if("object"!=a(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==a(e)?e:e+""}var s=function(){return t=function t(e,n,o){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.path=e,this.sourcePort=n,this.targetPort=o},(e=[{key:"remove",value:function(){try{(this.targetPort.target instanceof AudioNode||this.targetPort.target instanceof AudioParam||this.targetPort.target instanceof i)&&this.sourcePort.source.disconnect(this.targetPort.target)}catch(t){console.log("Connection already disconnected")}}}])&&u(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function l(t,e){try{t&&e&&t.disconnect(e)}catch(t){console.log("Audio node already disconnected")}}function d(t){return d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},d(t)}function f(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,p(o.key),o)}}function h(t,e,n){return e&&f(t.prototype,e),n&&f(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function p(t){var e=function(t){if("object"!=d(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var n=e.call(t,"string");if("object"!=d(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==d(e)?e:e+""}function v(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var m=h((function t(e,n,o,r){v(this,t);var i=document.getElementById("template-button");if(null===i)throw new Error("template button not found");this.element=i.content.cloneNode(!0);var a=this.element.querySelector("button");null==a||a.addEventListener("mousedown",o.bind(this)),null==a||a.addEventListener("mouseup",r.bind(this)),a&&(a.textContent=n),e.element.appendChild(this.element)})),y=h((function t(e,n,o,r){var i;v(this,t);var a=document.getElementById("template-select");if(null===a)throw new Error("template select not found");this.element=a.content.cloneNode(!0),this.select=this.element.querySelector("select");for(var u=0,c=Array.from(o.keys());u<c.length;u++){var s,l=c[u],d=document.createElement("option");d.value=l,d.textContent=o.get(l)||"",null===(s=this.select)||void 0===s||s.appendChild(d)}if(this.label=this.element.querySelector(".label"),null===this.label)throw new Error("label is not defined");this.label.textContent=n,e.element.appendChild(this.element),null===(i=this.select)||void 0===i||i.addEventListener("change",(function(t){console.log(t.target.value),r(t.target.value)}))})),g=function(){return h((function t(e,n,o,r){var i=this;v(this,t),this.callback=r,this.rotating=!1,this.startRotation=300*o,this.startY=0;var a=document.getElementById("template-knob");if(null===a)throw new Error("template knob not found");if(this.element=a.content.cloneNode(!0),this.knob=this.element.querySelector(".knob"),null===this.knob)throw new Error("knob is not defined");if(this.label=this.element.querySelector(".label"),null===this.label)throw new Error("label is not defined");this.label.textContent=n,e.element.appendChild(this.element),this.knob.style.transform="rotate(".concat(this.startRotation,"deg)"),r(this.startRotation/300),this.knob.addEventListener("mousedown",(function(t){var e,n;i.rotating=!0,i.startY=t.clientY;var o=null===(e=i.knob)||void 0===e?void 0:e.style.transform;i.startRotation=o?parseInt((null===(n=o.match(/rotate\((\d+)deg\)/))||void 0===n?void 0:n[1])||"0"):0,t.stopPropagation()})),document.addEventListener("mousemove",(function(t){if(i.rotating){var e=i.startY-t.clientY,n=Math.min(300,Math.max(0,i.startRotation+e));if(null===i.knob)throw new Error("knob is not defined");i.knob.style.transform="rotate(".concat(n,"deg)"),r(n/300),t.stopPropagation()}})),document.addEventListener("mouseup",(function(){i.rotating=!1}))}),[{key:"setValue",value:function(t){if(null===this.knob)throw new Error("knob is not defined");var e=300*t;this.knob.style.transform="rotate(".concat(e,"deg)"),this.callback(t)}}])}();function b(t){return b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},b(t)}function w(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,C(o.key),o)}}function N(t,e,n){return e&&w(t.prototype,e),n&&w(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function C(t){var e=function(t){if("object"!=b(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var n=e.call(t,"string");if("object"!=b(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==b(e)?e:e+""}function P(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function O(t,e,n){return e=S(e),function(t,e){if(e&&("object"==b(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}(t,E()?Reflect.construct(e,n||[],S(t).constructor):e.apply(t,n))}function x(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&k(t,e)}function E(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(E=function(){return!!t})()}function k(t,e){return k=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},k(t,e)}function S(t){return S=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},S(t)}var T=function(){return N((function t(e,n){var o=this;P(this,t),this.module=e,this.title=n,this.port=document.createElement("div"),this.port.className="port",this.port.title=n,this.port.addEventListener("mousedown",(function(t){if(t.stopPropagation(),o instanceof j){var e=o.module.inputConnections.find((function(t){return t.targetPort.port.port===o}));if(e){var n=e,r=n.sourcePort,i=n.sourcePort.module;l(r.source,o.target);var a=o.module.inputConnections.indexOf(n);-1!==a&&o.module.inputConnections.splice(a,1);var u=i.outputConnections.indexOf(n);-1!==u&&i.outputConnections.splice(u,1);var c=o.module.globals.connections.indexOf(n);return-1!==c&&o.module.globals.connections.splice(c,1),n.path.remove(),dt(r),void ht(t)}}dt(o)})),this.port.port=this,this.module.element.appendChild(this.port)}),[{key:"category",get:function(){return"none"}}])}(),j=function(t){function e(t,n,o){var r;return P(this,e),(r=O(this,e,[t,n])).target=o,r.port.className+=" input-port",r}return x(e,t),N(e)}(T),A=function(t){function e(t,n,o){var r;return P(this,e),(r=O(this,e,[t,n])).source=o,r.port.className+=" output-port",r}return x(e,t),N(e)}(T),L=function(t){function e(t,n,o){var r;return P(this,e),(r=O(this,e,[t,n,o])).port.className+=" cv-port",r}return x(e,t),N(e,[{key:"category",get:function(){return"cv"}}])}(j),M=function(t){function e(t,n,o){var r;return P(this,e),(r=O(this,e,[t,n,o])).port.className+=" cv-port",r}return x(e,t),N(e,[{key:"category",get:function(){return"cv"}}])}(A),I=function(t){function e(t,n,o){var r;return P(this,e),(r=O(this,e,[t,n,o])).port.className+=" gate-port",r}return x(e,t),N(e,[{key:"category",get:function(){return"gate"}}])}(j),V=function(t){function e(t,n,o){var r;return P(this,e),(r=O(this,e,[t,n,o])).port.className+=" gate-port",r}return x(e,t),N(e,[{key:"category",get:function(){return"gate"}}])}(A),_=function(t){function e(t,n,o){var r;return P(this,e),(r=O(this,e,[t,n,o])).port.className+=" audio-port",r}return x(e,t),N(e,[{key:"category",get:function(){return"audio"}}])}(j),q=function(t){function e(t,n,o){var r;return P(this,e),(r=O(this,e,[t,n,o])).port.className+=" audio-port",r}return x(e,t),N(e,[{key:"category",get:function(){return"audio"}}])}(A);function G(t){return G="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},G(t)}function R(t,e,n){return(e=U(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function B(t,e,n){return e=D(e),function(t,e){if(e&&("object"==G(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}(t,F()?Reflect.construct(e,n||[],D(t).constructor):e.apply(t,n))}function F(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(F=function(){return!!t})()}function D(t){return D=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},D(t)}function Y(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&K(t,e)}function K(t,e){return K=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},K(t,e)}function X(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function z(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,U(o.key),o)}}function W(t,e,n){return e&&z(t.prototype,e),n&&z(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function U(t){var e=function(t){if("object"!=G(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var n=e.call(t,"string");if("object"!=G(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==G(e)?e:e+""}function H(t){var e=t.sourcePort.port.getBoundingClientRect(),n=t.targetPort.port.getBoundingClientRect(),o=e.left+e.width/2,r=e.top+e.height/2,i=n.left+n.width/2,a=n.top+n.height/2,u=Math.abs(i-o)/2;t.path.setAttribute("d","M ".concat(o," ").concat(r," C ").concat(o+u," ").concat(r,", ").concat(i-u," ").concat(a,", ").concat(i," ").concat(a))}var Q=function(){return W((function t(e,n,o,r){X(this,t),this.globals=e,this.x=o,this.y=r,this.id="module_"+Math.random().toString(36).substr(2,9),this.inputConnections=[],this.outputConnections=[],this.ports=[],this.element=document.createElement("div"),this.element.className="module",this.element.id=this.id,this.element.style.left=o+"px",this.element.style.top=r+"px",this.element.addEventListener("mousedown",this.onClick.bind(this));var i=document.createElement("h3");i.textContent=n.toUpperCase(),this.element.appendChild(i),this.element.addEventListener("mousedown",this.startDragging.bind(this)),document.body.appendChild(this.element)}),[{key:"startDragging",value:function(t){this.globals.draggedModule=this,this.globals.activeModule=this,ft();var e=this.element.getBoundingClientRect();this.globals.dragOffset.x=t.clientX-e.left,this.globals.dragOffset.y=t.clientY-e.top}},{key:"updatePosition",value:function(t,e){this.x=t,this.y=e,this.element.style.left=t+"px",this.element.style.top=e+"px",this.updateConnections()}},{key:"updateConnections",value:function(){this.outputConnections.forEach(H),this.inputConnections.forEach(H)}},{key:"updateConnected",value:function(){this.outputConnections.forEach((function(t){t.sourcePort.source.connect(t.targetPort.target)})),this.outputConnections.forEach((function(t){t.targetPort.module.updateConnected()}))}},{key:"onClick",value:function(t){}}])}(),$=function(t){function e(t,n,o){var r;X(this,e),(r=B(this,e,[t,"lfo",n,o])).lfoNode=t.audioContext.createOscillator(),r.lfoNode.start(),r.scalingNode=t.audioContext.createGain(),r.scalingNode.gain.value=.5,r.offsetNode=t.audioContext.createConstantSource(),r.offsetNode.offset.value=.5,r.offsetNode.start(),r.gainNode=t.audioContext.createGain(),r.lfoNode.connect(r.scalingNode),r.adderNode=t.audioContext.createGain(),r.scalingNode.connect(r.adderNode),r.offsetNode.connect(r.adderNode),r.adderNode.connect(r.gainNode),r.knob=new g(r,"Frequency",.3,(function(e){var n=Math.round(10*e);r.lfoNode.frequency.setValueAtTime(n,t.audioContext.currentTime)}));var i=new Map;return i.set("sine","Sine"),i.set("square","Square"),i.set("sawtooth","Sawtooth"),i.set("triangle","Triangle"),r.knob=new g(r,"Gain",1,(function(e){var n=e;r.gainNode.gain.setValueAtTime(n,t.audioContext.currentTime)})),r.select=new y(r,"Waveform",i,(function(t){r.lfoNode.type=t})),r.outputPort1=new q(r,"Audio",r.gainNode),r}return Y(e,t),W(e,[{key:"stop",value:function(){this.lfoNode.stop(),this.offsetNode.stop(),this.lfoNode.disconnect(this.scalingNode),this.scalingNode.disconnect(this.adderNode),this.offsetNode.disconnect(this.adderNode),this.adderNode.disconnect(this.gainNode)}}])}(Q),J=function(t){function e(t,n,o){var r;X(this,e),(r=B(this,e,[t,"osc",n,o])).oscNode=t.audioContext.createOscillator(),r.oscNode.start(),r.gainNode=t.audioContext.createGain(),r.oscNode.connect(r.gainNode),r.lfo=!1,r.knob=new g(r,"Frequency",.3,(function(e){Math.round(20*Math.pow(1e3,e)),r.oscNode.frequency.setValueAtTime(0,t.audioContext.currentTime)})),r.knob=new g(r,"Gain",1,(function(e){var n=e;r.gainNode.gain.setValueAtTime(n,t.audioContext.currentTime)}));var i=new Map;return i.set("sine","Sine"),i.set("square","Square"),i.set("sawtooth","Sawtooth"),i.set("triangle","Triangle"),r.select=new y(r,"Waveform",i,(function(t){r.oscNode.type=t})),r.audioOutput=new q(r,"Audio",r.gainNode),r.pitchInput=new L(r,"Frequency Mod",r.oscNode.frequency),r}return Y(e,t),W(e,[{key:"stop",value:function(){this.oscNode.stop(),this.oscNode.disconnect(this.gainNode)}}])}(Q),Z=function(t){function e(t,n,o){var r;return X(this,e),(r=B(this,e,[t,"vca",n,o])).vca=t.audioContext.createGain(),r.vca.gain.setValueAtTime(.5,t.audioContext.currentTime),r.knob=new g(r,"Gain",.5,(function(e){var n=e;r.vca.gain.setValueAtTime(n,t.audioContext.currentTime)})),r.audioInput=new _(r,"Audio",r.vca),r.cvInput=new L(r,"Modulation",r.vca.gain),r.audioOutput=new q(r,"Audio",r.vca),r}return Y(e,t),W(e,[{key:"stop",value:function(){this.vca.disconnect()}},{key:"onClick",value:function(t){console.log(this)}}])}(Q),tt=function(t){function e(t,n,o){var r;return X(this,e),(r=B(this,e,[t,"mixer",n,o])).gainNode1=t.audioContext.createGain(),r.gainNode2=t.audioContext.createGain(),r.gainNode1.gain.setValueAtTime(.5,t.audioContext.currentTime),r.gainNode2.gain.setValueAtTime(.5,t.audioContext.currentTime),r.knob=new g(r,"Mix",.5,(function(e){var n=e;r.gainNode1.gain.setValueAtTime(n,t.audioContext.currentTime),r.gainNode2.gain.setValueAtTime(1-n,t.audioContext.currentTime)})),r.merger=t.audioContext.createChannelMerger(2),r.gainNode1.connect(r.merger,0,0),r.gainNode1.connect(r.merger,0,1),r.gainNode2.connect(r.merger,0,0),r.gainNode2.connect(r.merger,0,1),r.inputPort1=new _(r,"Audio",r.gainNode1),r.inputPort2=new _(r,"Audio",r.gainNode2),r.outputPort1=new q(r,"Audio",r.merger),r}return Y(e,t),W(e,[{key:"stop",value:function(){this.gainNode1.disconnect(this.merger),this.gainNode2.disconnect(this.merger)}}])}(Q),et=function(t){function e(t,n,o){var r;return X(this,e),(r=B(this,e,[t,"speaker",n,o])).audioInput=new _(r,"Audio",t.audioContext.destination),r}return Y(e,t),W(e,[{key:"stop",value:function(){}}])}(Q),nt=function(t){function e(t,n,o){var r;return X(this,e),(r=B(this,e,[t,"midi",n,o])).activeNotes=[],r.constantSource=t.audioContext.createConstantSource(),r.constantSource.start(),r.constantSource.offset.value=1,r.gateNode=new i((function(t){})),r.gainNode=t.audioContext.createGain(),r.gainNode.gain.setValueAtTime(440,t.audioContext.currentTime),r.constantSource.connect(r.gainNode),r.button=new m(r,"Play Note",(function(t){r.handleNoteOn(68,128)}),(function(t){r.handleNoteOff(68)})),r.pitchOutput=new M(r,"Pitch CV",r.gainNode),r.gateOutput=new V(r,"Gate",r.gateNode),r}return Y(e,t),W(e,[{key:"handleNoteOn",value:function(t,e){this.activeNotes.includes(t)||this.activeNotes.push(t);var n=440*Math.pow(2,(t-69)/12);this.gainNode.gain.setValueAtTime(n,this.globals.audioContext.currentTime),this.gateNode.setValue(!0)}},{key:"handleNoteOff",value:function(t){var e=this.activeNotes.indexOf(t);if(-1!==e&&this.activeNotes.splice(e,1),this.activeNotes.length>0){var n=this.activeNotes[this.activeNotes.length-1],o=440*Math.pow(2,(n-69)/12);this.gainNode.gain.setValueAtTime(o,this.globals.audioContext.currentTime)}else this.gateNode.setValue(!1)}},{key:"stop",value:function(){this.constantSource.disconnect(),this.gainNode.disconnect()}}])}(Q),ot=function(t){function e(t,n,o){var r;return X(this,e),R(r=B(this,e,[t,"adsr",n,o]),"attackTime",.1),R(r,"decayTime",.1),R(r,"sustainLevel",.5),R(r,"releaseTime",.1),r.constantNode=t.audioContext.createConstantSource(),r.constantNode.start(),r.constantNode.offset.value=1,r.gainNode=t.audioContext.createGain(),r.gainNode.gain.setValueAtTime(0,t.audioContext.currentTime),r.gateNode=new i((function(t){r.handleTrigger(t)})),r.constantNode.connect(r.gainNode),r.gateInput=new I(r,"Trigger",r.gateNode),r.envelopeOutput=new M(r,"Envelope",r.gainNode),r.attackKnob=new g(r,"Attack",.1,(function(t){return r.attackTime=t})),r.decayKnob=new g(r,"Decay",.1,(function(t){return r.decayTime=t})),r.sustainKnob=new g(r,"Sustain",.5,(function(t){return r.sustainLevel=t})),r.releaseKnob=new g(r,"Release",.1,(function(t){return r.releaseTime=t})),r}return Y(e,t),W(e,[{key:"handleTrigger",value:function(t){var e=this.globals.audioContext.currentTime;t?(console.log("Trigger On"),this.gainNode.gain.cancelScheduledValues(e),this.gainNode.gain.linearRampToValueAtTime(1,e+this.attackTime),this.gainNode.gain.linearRampToValueAtTime(this.sustainLevel,e+this.attackTime+this.decayTime)):(console.log("Trigger Off"),this.gainNode.gain.cancelScheduledValues(e),this.gainNode.gain.linearRampToValueAtTime(0,e+this.releaseTime))}},{key:"stop",value:function(){this.constantNode.stop(),this.constantNode.disconnect(),this.gainNode.disconnect()}}])}(Q),rt=function(t){function e(t,n,o){var r;return X(this,e),(r=B(this,e,[t,"vcf",n,o])).gainNode=t.audioContext.createGain(),r.gainNode.gain.value=2e4,r.filterNode=t.audioContext.createBiquadFilter(),r.filterNode.type="lowpass",r.filterNode.frequency.setValueAtTime(1e3,t.audioContext.currentTime),r.gainNode.connect(r.filterNode.frequency),r.frequencyKnob=new g(r,"Frequency",.5,(function(e){var n=20+1e4*e;r.filterNode.frequency.setValueAtTime(n,t.audioContext.currentTime)})),r.resKnob=new g(r,"Resonance",.5,(function(e){r.filterNode.Q.setValueAtTime(5*e,t.audioContext.currentTime)})),r.frequencyModInput=new L(r,"Freq Mod",r.gainNode),r.audioInput=new _(r,"Audio In",r.filterNode),r.audioOutput=new q(r,"Audio Out",r.filterNode),r}return Y(e,t),W(e,[{key:"stop",value:function(){this.filterNode.disconnect()}},{key:"onClick",value:function(t){console.log(this)}}])}(Q);function it(t){return it="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},it(t)}function at(){at=function(){return e};var t,e={},n=Object.prototype,o=n.hasOwnProperty,r=Object.defineProperty||function(t,e,n){t[e]=n.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",u=i.asyncIterator||"@@asyncIterator",c=i.toStringTag||"@@toStringTag";function s(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,n){return t[e]=n}}function l(t,e,n,o){var i=e&&e.prototype instanceof y?e:y,a=Object.create(i.prototype),u=new j(o||[]);return r(a,"_invoke",{value:E(t,n,u)}),a}function d(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var f="suspendedStart",h="suspendedYield",p="executing",v="completed",m={};function y(){}function g(){}function b(){}var w={};s(w,a,(function(){return this}));var N=Object.getPrototypeOf,C=N&&N(N(A([])));C&&C!==n&&o.call(C,a)&&(w=C);var P=b.prototype=y.prototype=Object.create(w);function O(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,e){function n(r,i,a,u){var c=d(t[r],t,i);if("throw"!==c.type){var s=c.arg,l=s.value;return l&&"object"==it(l)&&o.call(l,"__await")?e.resolve(l.__await).then((function(t){n("next",t,a,u)}),(function(t){n("throw",t,a,u)})):e.resolve(l).then((function(t){s.value=t,a(s)}),(function(t){return n("throw",t,a,u)}))}u(c.arg)}var i;r(this,"_invoke",{value:function(t,o){function r(){return new e((function(e,r){n(t,o,e,r)}))}return i=i?i.then(r,r):r()}})}function E(e,n,o){var r=f;return function(i,a){if(r===p)throw Error("Generator is already running");if(r===v){if("throw"===i)throw a;return{value:t,done:!0}}for(o.method=i,o.arg=a;;){var u=o.delegate;if(u){var c=k(u,o);if(c){if(c===m)continue;return c}}if("next"===o.method)o.sent=o._sent=o.arg;else if("throw"===o.method){if(r===f)throw r=v,o.arg;o.dispatchException(o.arg)}else"return"===o.method&&o.abrupt("return",o.arg);r=p;var s=d(e,n,o);if("normal"===s.type){if(r=o.done?v:h,s.arg===m)continue;return{value:s.arg,done:o.done}}"throw"===s.type&&(r=v,o.method="throw",o.arg=s.arg)}}}function k(e,n){var o=n.method,r=e.iterator[o];if(r===t)return n.delegate=null,"throw"===o&&e.iterator.return&&(n.method="return",n.arg=t,k(e,n),"throw"===n.method)||"return"!==o&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+o+"' method")),m;var i=d(r,e.iterator,n.arg);if("throw"===i.type)return n.method="throw",n.arg=i.arg,n.delegate=null,m;var a=i.arg;return a?a.done?(n[e.resultName]=a.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,m):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,m)}function S(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(S,this),this.reset(!0)}function A(e){if(e||""===e){var n=e[a];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var r=-1,i=function n(){for(;++r<e.length;)if(o.call(e,r))return n.value=e[r],n.done=!1,n;return n.value=t,n.done=!0,n};return i.next=i}}throw new TypeError(it(e)+" is not iterable")}return g.prototype=b,r(P,"constructor",{value:b,configurable:!0}),r(b,"constructor",{value:g,configurable:!0}),g.displayName=s(b,c,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,b):(t.__proto__=b,s(t,c,"GeneratorFunction")),t.prototype=Object.create(P),t},e.awrap=function(t){return{__await:t}},O(x.prototype),s(x.prototype,u,(function(){return this})),e.AsyncIterator=x,e.async=function(t,n,o,r,i){void 0===i&&(i=Promise);var a=new x(l(t,n,o,r),i);return e.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},O(P),s(P,c,"Generator"),s(P,a,(function(){return this})),s(P,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),n=[];for(var o in e)n.push(o);return n.reverse(),function t(){for(;n.length;){var o=n.pop();if(o in e)return t.value=o,t.done=!1,t}return t.done=!0,t}},e.values=A,j.prototype={constructor:j,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var n in this)"t"===n.charAt(0)&&o.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function r(o,r){return u.type="throw",u.arg=e,n.next=o,r&&(n.method="next",n.arg=t),!!r}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var c=o.call(a,"catchLoc"),s=o.call(a,"finallyLoc");if(c&&s){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var i=r;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),T(n),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var o=n.completion;if("throw"===o.type){var r=o.arg;T(n)}return r}}throw Error("illegal catch attempt")},delegateYield:function(e,n,o){return this.delegate={iterator:A(e),resultName:n,nextLoc:o},"next"===this.method&&(this.arg=t),m}},e}function ut(t,e,n,o,r,i,a){try{var u=t[i](a),c=u.value}catch(t){return void n(t)}u.done?e(c):Promise.resolve(c).then(o,r)}function ct(t,e){if(t){if("string"==typeof t)return st(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?st(t,e):void 0}}function st(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=Array(e);n<e;n++)o[n]=t[n];return o}var lt={modules:[],connections:[],draggedModule:null,activeModule:null,dragOffset:{x:0,y:0},connectingPort:null,audioContext:new window.AudioContext};function dt(t){lt.connectingPort=t,document.addEventListener("mousemove",ht),document.addEventListener("mouseup",pt)}function ft(){var t,e=function(t){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=ct(t))){e&&(t=e);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,i=!0,a=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){a=!0,r=t},f:function(){try{i||null==e.return||e.return()}finally{if(a)throw r}}}}(lt.modules);try{for(e.s();!(t=e.n()).done;){var n=t.value;n===lt.activeModule?n.element.classList.add("active"):n.element.classList.remove("active")}}catch(t){e.e(t)}finally{e.f()}}function ht(t){if(lt.connectingPort){var e=document.getElementById("connections"),n=document.getElementById("temp-connection");n&&n.remove();var o=lt.connectingPort.port.getBoundingClientRect(),r=o.left+o.width/2,i=o.top+o.height/2,a=document.createElementNS("http://www.w3.org/2000/svg","path");a.id="temp-connection",a.setAttribute("class","connection active "+lt.connectingPort.category),a.setAttribute("d","M ".concat(r," ").concat(i," C ").concat(r+100," ").concat(i,", ").concat(t.clientX-100," ").concat(t.clientY,", ").concat(t.clientX," ").concat(t.clientY)),null==e||e.appendChild(a)}}function pt(t){var e;document.removeEventListener("mousemove",ht),document.removeEventListener("mouseup",pt);var n=document.getElementById("temp-connection");if(n&&n.remove(),lt.connectingPort){var o=null===(e=document.elementsFromPoint(t.clientX,t.clientY).find((function(t){return t.classList.contains("port")})))||void 0===e?void 0:e.port;if(o&&o!==lt.connectingPort){if(void 0===o.module)return;lt.connectingPort instanceof A&&o.port.classList.contains("input-port")?(lt.connectingPort instanceof q&&o instanceof _||lt.connectingPort instanceof M&&o instanceof L||lt.connectingPort instanceof V&&o instanceof I)&&vt(lt.connectingPort,o):lt.connectingPort instanceof j&&o.port.classList.contains("output-port")&&(lt.connectingPort instanceof _&&o instanceof q||lt.connectingPort instanceof L&&o instanceof M||lt.connectingPort instanceof I&&o instanceof V)&&vt(o,lt.connectingPort)}lt.connectingPort=null}}function vt(t,e){var n=document.getElementById("connections"),o=document.createElementNS("http://www.w3.org/2000/svg","path");if(o.setAttribute("class","connection "+t.category),e.module!==t.module){var r=new s(o,t,e),i=e.module.inputConnections.find((function(t){return t.targetPort===e}));if(i){var a=lt.connections.indexOf(i);if(-1!==a){lt.connections.splice(a,1),i.remove(),i.path.remove();var u=e.module.inputConnections.indexOf(i);-1!==u&&e.module.inputConnections.splice(u,1)}}t.module.outputConnections.push(r),e.module.inputConnections.push(r),lt.connections.push(r),null==n||n.appendChild(o),H(r),t.module.updateConnected(),console.log(lt.connections)}}function mt(){var t=document.getElementById("connections");null==t||t.setAttribute("width",window.innerWidth.toString()),null==t||t.setAttribute("height",window.innerHeight.toString())}function yt(){var t;return t=at().mark((function t(){return at().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(navigator.requestMIDIAccess){t.next=3;break}return console.error("MIDI not supported in this browser."),t.abrupt("return");case 3:return t.next=5,navigator.requestMIDIAccess();case 5:t.sent.inputs.forEach((function(t){t.onmidimessage=gt}));case 7:case"end":return t.stop()}}),t)})),yt=function(){var e=this,n=arguments;return new Promise((function(o,r){var i=t.apply(e,n);function a(t){ut(i,o,r,a,u,"next",t)}function u(t){ut(i,o,r,a,u,"throw",t)}a(void 0)}))},yt.apply(this,arguments)}function gt(t){var e,n,o=(e=t.data,n=3,function(t){if(Array.isArray(t))return t}(e)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var o,r,i,a,u=[],c=!0,s=!1;try{if(i=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;c=!1}else for(;!(c=(o=i.call(n)).done)&&(u.push(o.value),u.length!==e);c=!0);}catch(t){s=!0,r=t}finally{try{if(!c&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(s)throw r}}return u}}(e,n)||ct(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),r=o[0],i=o[1],a=o[2],u=lt.modules.find((function(t){return t instanceof nt}));u&&(144===r&&a>0?u.handleNoteOn(i,a):(128===r||144===r&&0===a)&&u.handleNoteOff(i))}window.addMixerModule=function(){var t=new tt(lt,100,100);return lt.modules.push(t),t},window.addVCAModule=function(){var t=new Z(lt,100,100);return lt.modules.push(t),t},window.addOSCModule=function(){var t=new J(lt,100,100);return lt.modules.push(t),t},window.addLFOModule=function(){var t=new $(lt,100,100);return lt.modules.push(t),t},window.addSpeakerModule=function(){var t=new et(lt,100,100);return lt.modules.push(t),t},window.addMIDIModule=function(){var t=new nt(lt,100,100);return lt.modules.push(t),t},window.addADSRModule=function(){var t=new ot(lt,100,100);return lt.modules.push(t),t},window.addVCFModule=function(){var t=new rt(lt,100,100);return lt.modules.push(t),t},document.addEventListener("mousedown",(function(t){console.log("pressed body"),document.elementFromPoint(t.clientX,t.clientY)===document.body&&(console.log("set active module null"),lt.activeModule=null,ft())})),document.addEventListener("mousemove",(function(t){if(lt.draggedModule){var e=t.clientX-lt.dragOffset.x,n=t.clientY-lt.dragOffset.y;lt.draggedModule.updatePosition(e,n)}})),document.addEventListener("mouseup",(function(){lt.draggedModule=null})),document.addEventListener("keydown",(function(t){"Delete"!==t.key&&"Backspace"!==t.key||function(t){if(t.activeModule){var e=t.activeModule;e.inputConnections.forEach((function(e){if(e)try{var n=e.sourcePort;n.source&&e.targetPort.target&&l(n.source,e.targetPort.target);var o=e.sourcePort.module,r=o.outputConnections.indexOf(e);-1!==r&&o.outputConnections.splice(r,1);var i=t.connections.indexOf(e);-1!==i&&t.connections.splice(i,1),e.path.remove()}catch(t){console.log("Error removing input connection:",t)}})),e.outputConnections.forEach((function(e){try{e.sourcePort.source&&e.targetPort.target&&l(e.sourcePort.source,e.targetPort.target),e.targetPort.module.inputConnections.find((function(t){return t===e}));var n=t.connections.indexOf(e);-1!==n&&t.connections.splice(n,1),e.path.remove()}catch(t){console.log("Error removing output connection:",t)}}));var n=t.modules.indexOf(e);-1!==n&&t.modules.splice(n,1),e.element.remove(),e.stop(),t.activeModule=null,ft()}}(lt)})),document.addEventListener("DOMContentLoaded",(function(){window.addEventListener("resize",mt),mt()})),window.start=function(){!function(){yt.apply(this,arguments)}();var t=window.addMIDIModule();t.updatePosition(10,100);var e=window.addADSRModule();e.updatePosition(10,250);var n=window.addOSCModule();n.updatePosition(200,100);var o=window.addVCAModule();o.updatePosition(400,100);var r=window.addSpeakerModule();r.updatePosition(600,100),vt(e.envelopeOutput,o.cvInput),vt(t.gateOutput,e.gateInput),vt(t.pitchOutput,n.pitchInput),vt(n.audioOutput,o.audioInput),vt(o.audioOutput,r.audioInput),o.knob.setValue(0)}})();