function fnCreateKeyValueIterator(sKeyName, sValueName) {
  return function(oData, fnCallback) {
    if(Array.isArray(oData))
        oData.forEach(function(oData, nIndex){fnCallback(oData[sKeyName], oData[sValueName], nIndex);});
      else {
        var nIndex = 0;
        for(var s in oData)
          fnCallback(s, oData[s], nIndex++); }}}

function fnObjectIterator(oData, fnCallback) {
  if(Array.isArray(oData))
      oData.forEach(function(oItem, nIndex){fnCallback(oItem, nIndex);});
    else
      fnCallback(oData, 0); }

function fnCreateInitializer( {
    propertySpecs: oPropertySpecs,
    methodSpecs: oMethodSpecs,
    createData: fnCreateData }) {

  return function(oParam) {
    var Initializer = function(){};
    for(var sKey in oMethodSpecs) {
      Initializer.prototype[sKey] =
        function() {
          var oRet = this.apply(oData, arguments);
          return oRet !== undefined ? oRet : oThis; }
        .bind(oMethodSpecs[sKey]) ;}
    var oData = fnCreateData == null ? {} : fnCreateData(oParam);
    var oThis = new Initializer();
    var oSpec;
    for(var sKey in oPropertySpecs) {
      var fnInit;
      var sName = oPropertySpecs[sKey];
      if(typeof sName === "string")
        oThis[sName] =
          function() {
            var fnInit = this.fnInit;
            oData[this.sKey] = fnInit != null
              ? fnInit.apply(null, arguments)
              : arguments[0];
            return oThis; }
          .bind({sKey: sKey, fnInit: fnInit}); }
    return oThis; };}

var fnKeyValueIterator = fnCreateKeyValueIterator("name", "value");

var fnInitElement = fnCreateInitializer( {
  propertySpecs: {
    eParent: "par",
    eInsertBefore: "bef",
    sTag: "tag",
    oClass: "cls",
    oStyles: "css",
    oAttributes: "attr",
    sTextContent: "txt" },
  methodSpecs: {
    create: fnCreate,
    get: fnGet },
  createData: function() {
    return {e: null}; }});

var fnWrapElement = fnCreateInitializer( {
  propertySpecs: {
    oStyles: "css",
    oRemoveStyles: "xcss",
    sTextContent: "txt" },
  methodSpecs: {
    update: fnUpdate,
    get: fnGet },
  createData: function(eElement) {
    return {e: eElement}; }});

function fnDecorate() {
  var e = this.e;
  var y = e.style;
  var eParent = this.eParent;
  if(eParent != null)
    eParent.insertBefore(e, this.eInsertBefore);
  var oClass = this.oClass;
  if(oClass != null) {
    if(Array.isArray(oClass)) {
        var oClassList = e.classList;
        oClass.forEach(function(s){oClassList.add(s);}); }
      else
        e.className = oClass; }
  var oRemoveStyles = this.oRemoveStyles;
  if(oRemoveStyles != null)
    fnObjectIterator(oRemoveStyles, function(sName){y.removeProperty(sName);});
  var oStyles = this.oStyles;
  if(oStyles != null)
    fnKeyValueIterator(oStyles, function(sName, sValue){y.setProperty(sName, sValue);});
  var oAttributes = this.oAttributes;
  if(oAttributes != null)
    fnKeyValueIterator(oAttributes, function(sName, sValue){e.setAttribute(sName, sValue);});
  var sTextContent = this.sTextContent;
  if(sTextContent != null) {
    e.textContent = sTextContent; }}

function fnCreate() {
  this.e = document.createElement(this.sTag);
  fnDecorate.call(this); }

function fnUpdate() {
  fnDecorate.call(this); }

function fnGet() {
  return this.e; }

var nId = 0;
function fnGetId(){return ++nId;}

export {
  fnInitElement as initElement,
  fnWrapElement as wrapElement,
  fnGetId as getId };
