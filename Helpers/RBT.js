function fnCreate(fnCompareData) {

  function fnInnerCreate(oRoot, fnCompareData) {

    function fnRet(oNode) {
      return oNode !== oNil ? oNode.oItf : null; }

    function fnCreateNode(oParent, fRed, nCount, oData) {
      var oRet = {
        oParent: oParent,
        oLeft: oNil, oRight: oNil,
        fRed: fRed,
        nCount: nCount,
        oData: oData };
      oRet.oItf = {
        get data(){return oRet.oData;},
        get index(){return fnIndexOf(oRet);},
        get next(){return fnRet(fnNext(oRet));},
        get prev(){return fnRet(fnPrev(oRet));},
        get parent() {
          return fnRet(oRet.oParent); },
        get left() {
          return fnRet(oRet.oLeft); },
        get right() {
          return fnRet(oRet.oRight); },
        remove(){fnRemove(oRet);}};
      return oRet; }

    function fnCopyNode(oParent, oNode) {
      var oRet = fnCreateNode(
        oParent,
        oNode.fRed,
        oNode.nCount,
        oNode.oData );
      var oLeft = oNode.oLeft;
      if(oLeft !== oNil)
        oRet.oLeft = fnCopyNode(oRet, oLeft);
      var oRight = oNode.oRight;
      if(oRight !== oNil)
        oRet.oRight = fnCopyNode(oRet, oRight);
      return oRet; }

    function fnGetAt(nIndex) {
      function fnFind(oRet, nIndex) {
        if(oRet === oNil)return null;
        var oLeft = oRet.oLeft;
        var nCount = oLeft.nCount;
        if(nCount < nIndex)
            return fnFind(oRet.oRight, nIndex - nCount - 1);
          else if(nCount > nIndex)
            return fnFind(oLeft, nIndex);
          else
            return oRet.oItf; }
      return fnFind(oRoot, nIndex); }
      
    function fnFind(oData) {
      function fnInner(oNode) {
        var nCompare = fnCompareData(oData, oNode.oData);
        if(nCompare < 0) {
            var oLeft = oNode.oLeft;
            if(oLeft !== oNil)
                return fnInner(oLeft);
              else
                return null; }
          else if(nCompare > 0) {
            var oRight = oNode.oRight;
            if(oRight !== oNil)
                return fnInner(oRight);
              else
                return null; }
          else
            return oNode.oItf; }
      return fnInner(oRoot); }

    function fnIndexOf(oNode) {
      function fnUp(oNode, nRet) {
        var oParent = oNode.oParent;
        if(oParent === oNil)return nRet;
        if(oNode === oParent.oRight)
            return fnUp(oParent, oParent.oLeft.nCount + nRet + 1);
          else
            return fnUp(oParent, nRet); }
      return fnUp(oNode, oNode.oLeft.nCount); }

    function fnNext(oNode) {
      var oRet = oNode.oRight;
      if(oRet !== oNil)
          while(true) {
            if(oRet.oLeft === oNil)return oRet;
            oRet = oRet.oLeft; }
        else {
          oRet = oNode.oParent;
          while(oRet !== oNil) {
            if(oRet.oLeft === oNode)return oRet;
            oNode = oRet;
            oRet = oRet.oParent; }
          return oNil; }}
    function fnPrev(oNode) {
      var oRet = oNode.oLeft;
      if(oRet !== oNil)
          while(true) {
            if(oRet.oRight === oNil)return oRet;
            oRet = oRet.oRight; }
        else {
          oRet = oNode.oParent;
          while(oRet !== oNil) {
            if(oRet.oRight === oNode)return oRet;
            oNode = oRet;
            oRet = oRet.oParent; }
          return oNil; }}

    function fnRotateLeft(oNode) {
      var oChild = oNode.oRight;
      var oParent = oNode.oParent;
      var nTmp = oChild.nCount;
      oChild.nCount = oNode.nCount;
      oNode.nCount -= nTmp - oChild.oLeft.nCount;
      oNode.oRight = oChild.oLeft;
      oChild.oLeft = oNode;
      oNode.oParent = oChild;
      if(oNode.oRight !== oNil)
        oNode.oRight.oParent = oNode;
      if(oParent !== oNil) {
          if(oNode === oParent.oLeft)
              oParent.oLeft = oChild;
            else
              oParent.oRight = oChild;
          oChild.oParent = oParent; }
        else {
          oRoot = oChild;
          oChild.oParent = oNil; }}
    function fnRotateRight(oNode) {
      var oChild = oNode.oLeft;
      var oParent = oNode.oParent;
      var nTmp = oChild.nCount;
      oChild.nCount = oNode.nCount;
      oNode.nCount -= nTmp - oChild.oRight.nCount;
      oNode.oLeft = oChild.oRight;
      oChild.oRight = oNode;
      oNode.oParent = oChild;
      if(oNode.oLeft !== oNil)
        oNode.oLeft.oParent = oNode;
      if(oParent !== oNil) {
          if(oNode === oParent.oRight)
              oParent.oRight = oChild;
            else
              oParent.oLeft = oChild;
          oChild.oParent = oParent; }
        else {
          oRoot = oChild;
          oChild.oParent = oNil; }}

    function fnRemove(oNode) {
      function fnFind() {
        if(oNode.oLeft.nCount > oNode.oRight.nCount) {
            oDel = oNode.oLeft;
            if(oDel !== oNil) {
              fR = false;
              while(oDel.oRight !== oNil) {
                oDel = oDel.oRight;
                fR = true; }}}
          else {
            oDel = oNode.oRight;
            if(oDel !== oNil) {
              fR = true;
              while(oDel.oLeft !== oNil) {
                oDel = oDel.oLeft;
                fR = false; }}}
        if(oDel === oNil) {
          var oParent = oNode.oParent;
          if(oParent !== oNil)
            fR = oParent.oRight === oNode; }
        return oDel; }
      function fnPrep() {
        if(fR == null)return;
        if(oDel !== oNil) {
            var oTmpData = oNode.oData;
            oNode.oData = oDel.oData;
            oDel.oData = oTmpData; }
          else
            oDel = oNode; }
      function fnFree(oAttach) {
        if(fR != null) {
            var oParent = oDel.oParent;
            if(oAttach !== oNil)
              oAttach.oParent = oParent;
            if(fR)
                oParent.oRight = oAttach;
              else
                oParent.oLeft = oAttach;
            while(oParent !== oNil) {
              --oParent.nCount;
              oParent = oParent.oParent; }
            oDel.oParent = oNil;
            oDel.oLeft = oDel.oRight = oNil; }
          else
            oRoot = oNil; }
      function fnBlackChild(oDel) {
        var oParent = oDel.oParent;
        if(oParent === oNil)return;
        var oLeft = oParent.oLeft;
        var fL = oDel === oLeft;
        var oSibling = fL ? oParent.oRight : oLeft;
        if(oSibling.fRed) {
            if(fL)
                fnRotateLeft(oParent);
              else
                fnRotateRight(oParent);
            oParent.fRed = true;
            oSibling.fRed = false;
            fnBlackChild(oDel); }
          else {
            var oLeftNephew = oSibling.oLeft;
            var oRightNephew = oSibling.oRight;
            if(! oLeftNephew.fRed && ! oRightNephew.fRed) {
                if(! oParent.fRed) {
                    oSibling.fRed = true;
                    fnBlackChild(oParent); }
                  else {
                    oParent.fRed = false;
                    oSibling.fRed = true; }}
              else if(fL && oLeftNephew.fRed && ! oRightNephew.fRed) {
                fnRotateRight(oSibling);
                fnRotateLeft(oParent);
                oLeftNephew.fRed = oParent.fRed;
                oParent.fRed = false; }
              else if(! fL && ! oLeftNephew.fRed && oRightNephew.fRed) {
                fnRotateLeft(oSibling);
                fnRotateRight(oParent);
                oRightNephew.fRed = oParent.fRed;
                oParent.fRed = false; }
              else if(fL && ! oLeftNephew.fRed) {
                fnRotateLeft(oParent);
                oSibling.fRed = oParent.fRed;
                oParent.fRed = false;
                oRightNephew.fRed = false; }
              else if(! fL && ! oRightNephew.fRed) {
                fnRotateRight(oParent);
                oSibling.fRed = oParent.fRed;
                oParent.fRed = false;
                oLeftNephew.fRed = false; }
              else if(oLeftNephew.fRed && oRightNephew.fRed) {
                if(fL) {
                    fnRotateLeft(oParent);
                    oRightNephew.fRed = false; }
                  else {
                    fnRotateRight(oParent);
                    oLeftNephew.fRed = false; }
                if(oParent.fRed) {
                    oSibling.fRed = true;
                    oParent.fRed = false; }}}}

      var oDel, fR;
      fnFind();

      fnPrep();
      if(fR == null)
          fnFree();
        else if(oDel.fRed)
          fnFree(oNil);
        else {
          var oChild = oDel.oLeft;
          if(oChild === oNil)
            oChild = oDel.oRight;
          if(oChild.fRed) {
              oChild.fRed = false;
              fnFree(oChild); }
            else
              fnBlackChild(oDel); }
      fnFree(oNil); }

    function fnInsert(oData) {

      function fnFix(oNode) {
        function fnGetUncle() {
          var oLeft = oGrandParent.oLeft;
          return oLeft === oParent ? oGrandParent.oRight : oLeft; }
        function fnFixRedUncle() {
          oParent.fRed = false;
          fnGetUncle().fRed = false;
          oGrandParent.fRed = true;
          fnFix(oGrandParent); }
        function fnFixBlackUncle() {
          if(oNode === oParent.oLeft) {
              if(oParent === oGrandParent.oRight) {
                  fnRotateRight(oParent);
                  fnRotateLeft(oGrandParent);
                  oNode.fRed = false; }
                else {
                  fnRotateRight(oGrandParent);
                  oParent.fRed = false; }}
            else {
              if(oParent === oGrandParent.oLeft) {
                  fnRotateLeft(oParent);
                  fnRotateRight(oGrandParent);
                  oNode.fRed = false; }
                else {
                  fnRotateLeft(oGrandParent);
                  oParent.fRed = false; }}
          oGrandParent.fRed = true; }
        var oParent = oNode.oParent;
        if(oParent === oNil) {
            oNode.fRed = false;
            return; }
          else if(! oParent.fRed)return;
        var oGrandParent = oParent.oParent;
        if(fnGetUncle().fRed)
            fnFixRedUncle();
          else
            fnFixBlackUncle(); }

      function fnInner(oData, oParent) {
        var oNode = fnCreateNode(oNil, true, 1, oData);
        if(oParent !== oNil) {
          if(fnCompareData(oData, oParent.oData) < 0) {
              var oLeft = oParent.oLeft;
              if(oLeft !== oNil)
                  return fnInner(oData, oLeft);
                else
                  (oParent.oLeft = oNode).oParent = oParent; }
            else {
              var oRight = oParent.oRight;
              if(oRight !== oNil)
                  return fnInner(oData, oRight);
                else
                  (oParent.oRight = oNode).oParent = oParent; }}
        while(oParent !== oNil) {
          ++oParent.nCount;
          oParent = oParent.oParent; }
        return oNode; }

      var oNode = fnInner(oData, oRoot);
      if(oRoot === oNil)
        oRoot = oNode;
      fnFix(oNode);

      return oNode.oItf; }

    function fnClone(fnCompareData_) {
      if(fnCompareData_ != null) {
          var oRet = fnInnerCreate(oNil, fnCompareData_);
          var oNode = fnGetAt(0);
          while(! oNode.isNil) {
            oRet.insert(oNode.data);
            oNode = oNode.next; }
          return oRet; }
        else
          return fnInnerCreate(fnCopyNode(oNil, oRoot), fnCompareData); }

    return {
      get count(){return oRoot.nCount;},
      getAt: fnGetAt,
      find: fnFind,
      insert: fnInsert,
      clone: fnClone };}

  return fnInnerCreate(oNil, fnCompareData); }

var oNil = {
  get oParent(){return oNil;},
  get fRed(){return false;},
  get nCount(){return 0;} };

export {
  fnCreate as create };
