import * as mDOMHelper from "../Helpers/DOMHelper.js";

const CLASS = "diag";

var fnInitElement = mDOMHelper.initElement;

function fnCreate(oParams) {

  function fnTakeParams() {
    ({element: eMain} = oParams); }

  function fnInitialize() {
    function fnAdd() {
      oEventTarget.dispatchEvent(new CustomEvent("add", {detail: {text: e1.value}}));
      e1.value = ""; }
    var e1 = fnInitElement().par(eMain).tag("input").attr({type: "text"}).create().get();
    var e2 = fnInitElement().par(eMain).tag("input").attr([{name: "type", value: "button"}, {name: "value", value: "Add"}]).create().get();
    e1.addEventListener (
      "keydown",
      function(v) {
        if(v.code == "Enter")
          fnAdd(); },
      false );
    e2.addEventListener("click", fnAdd, false); }

  var eMain;
  var oEventTarget = new EventTarget();

  fnTakeParams();
  fnInitialize();

  return {
    addEventListener: oEventTarget.addEventListener.bind(oEventTarget),
    removeEventListener: oEventTarget.removeEventListener.bind(oEventTarget) };}

export {
  fnCreate as create };
