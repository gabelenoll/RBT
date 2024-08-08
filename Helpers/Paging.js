function fnCreate() {

  function fnSetCount(nValue) {
    nCount = nValue;
    oEventTarget.dispatchEvent(new CustomEvent("countchanged")); }

  var nCount = 0, nFirst = -1, nLast = 0;

  var oEventTarget = new EventTarget();







  return {
    set count(nValue){fnSetCount(nValue);}



    };}

export {
  fnCreate as create };
