function fnDefaultCatch(x) {
  console.log(`ExecQueue caught '${x.message}'`); }

function fnCreate(nMaxCount) {

  function fnOnChanged() {
    oEventTarget.dispatchEvent(new CustomEvent("changed")); }

  function fnAtMax() {
    return nCount >= nMaxCount; }

  function fnInc() {
    if(fnAtMax())
      throw new Error(`Max count ${nMaxCount} of ExecQueue has already been reached.`);
    ++nCount; }
  function fnDec() {
    --nCount; }

  function fnEnqueue(fn, fnCatch) {
    fnInc();
    pChain = pChain
    .finally(fn)
    .catch(fnCatch != null ? fnCatch : fnDefaultCatch)
    .finally(fnDec) ;}

  var oEventTarget = new EventTarget();
  var pChain = Promise.resolve();
  var nCount = 0;

  return {
    enqueue: fnEnqueue,
    get atMax(){return fnAtMax();},
    get count(){return nCount;},
    addEventListener: oEventTarget.addEventListener.bind(oEventTarget),
    removeEventListener: oEventTarget.removeEventListener.bind(oEventTarget) };}

export {
  fnCreate as create };
