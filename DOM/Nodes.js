import * as mDOMHelper from "../Helpers/DOMHelper.js";
import * as mExecQueue from "../Helpers/ExecQueue.js";
import * as mRBT from "../Helpers/RBT.js";

const CLASS = "nodes";
const CLASS_MAIN = CLASS + "-main";
const CLASS_NODES = CLASS + "-nodes";

var fnInitElement = mDOMHelper.initElement;
var fnVoid = mDOMHelper.void;

function fnCreate(oParams) {

  function fnTakeParams() {
    var ioTraits, fnCompareData;
    ({ compareData: fnCompareData,
       element: eMain,
       traits: ioTraits } = oParams);
    if(fnCompareData != null)
      fnSetCompareData(fnCompareData);
    fnCallTraits = mDOMHelper.createTraitsCaller(CLASS, ioTraits); }

  function fnInitialize() {
    eMain.classList.add(CLASS_MAIN);
    fnCallTraits("mainInitialized", eMain);
    eNodes = fnInitElement().par(eMain).tag("div").cls(CLASS_NODES).create().get();
    fnCallTraits("nodesInitialized", eNodes); }

  function fnSetCompareData(fnValue) {
    function fnInternalCompareData(oData1, oData2) {
      return fnValue(oData1.oPayload, oData2.oPayload); }
    var oNewRBT = mRBT.create(fnInternalCompareData);
    if(oRBT != null)
      oRBT.CopyTo(oNewRBT);
    oRBT = oNewRBT; }

  function fnAddNodes(ioData) {
    for(var oData of ioData) {
      var oDesc = {eNode: null, oPayload: oData };
      var oNext = oRBT.insert(oDesc).next;
      var eNode = fnInitElement().par(eNodes).bef(oNext != null ? oNext.data.eNode : null).tag("div").create().get();
      oDesc.eNode = eNode;
      fnCallTraits("nodeInitialized", {node: eNode, data: oData}); }}

  var oRBT;
  var fnCallTraits;
  var eMain, eNodes;
  var oExecQueue = mExecQueue.create(5);

  fnTakeParams();
  fnInitialize();

  return {
    set compareData(fnValue){fnSetCompareData(fnValue);},
    get count(){return oRBT.count;},
    addNodes: fnAddNodes,
    getNode(id){return oRBT.find(id);} };}

export {
  fnCreate as create };
