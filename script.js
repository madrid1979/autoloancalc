function computeMonthlyPayment(prin, numPmts, intRate, paymentfrequency) {
  var pmtAmt = 0;

  if (intRate == 0) {
    pmtAmt = prin / numPmts;
  } else {
    intRate = intRate / 100.0 / paymentfrequency;

    var pow = 1;
    for (var j = 0; j < numPmts; j++)
      pow = pow * (1 + intRate);

    pmtAmt = (prin * pow * intRate) / (pow - 1);

  }
  return pmtAmt;
}

function sn(num) {
  num = num.toString();

  var len = num.length;
  var rnum = "";
  //var test = "";
  var j = 0;

  var b = num.substring(0, 1);
  if (b == "-") {
    rnum = "-";
  }

  for (i = 0; i <= len; i++) {
    b = num.substring(i, i + 1);
    if (b == "0" || b == "1" || b == "2" || b == "3" || b == "4" || b == "5" || b == "6" || b == "7" || b == "8" || b == "9" || b == ".") {
      rnum = rnum + "" + b;
    }
  }

  if (rnum == "" || rnum == "-") {
    rnum = 0;
  }

  rnum = Number(rnum);
  return rnum;
}

function fns(num, places, comma, type, show) {
  var sym_1 = "$";
  var sym_2 = "";
  var isNeg = 0;

  if (num < 0) {
    num = num * -1;
    isNeg = 1;
  }

  var myDecFact = 1;
  var myPlaces = 0;
  var myZeros = "";
  while (myPlaces < places) {
    myDecFact = myDecFact * 10;
    myPlaces = Number(myPlaces) + Number(1);
    myZeros = myZeros + "0";
  }

  onum = Math.round(num * myDecFact) / myDecFact;
  integer = Math.floor(onum);

  if (Math.ceil(onum) == integer) {
    decimal = myZeros;
  } else {
    decimal = Math.round((onum - integer) * myDecFact)
  }
  decimal = decimal.toString();
  if (decimal.length < places) {
    fillZeroes = places - decimal.length;
    for (z = 0; z < fillZeroes; z++) {
      decimal = "0" + decimal;
    }
  }

  if (places > 0) {
    decimal = "." + decimal;
  }

  if (comma == 1) {
    integer = integer.toString();
    var tmpnum = "";
    var tmpinteger = "";
    var y = 0;

    for (x = integer.length; x > 0; x--) {
      tmpnum = tmpnum + integer.charAt(x - 1);
      y = y + 1;
      if (y == 3 & x > 1) {
        tmpnum = tmpnum + ",";
        y = 0;
      }
    }

    for (x = tmpnum.length; x > 0; x--) {
      tmpinteger = tmpinteger + tmpnum.charAt(x - 1);
    }

    finNum = tmpinteger + "" + decimal;
  } else {
    finNum = integer + "" + decimal;
  }

  if (isNeg == 1) {
    if (type == 1 && show == 1) {
      finNum = "-" + sym_1 + "" + finNum + "" + sym_2;
    } else {
      finNum = "-" + finNum;
    }
  } else {
    if (show == 1) {
      if (type == 1) {
        finNum = sym_1 + "" + finNum + "" + sym_2;
      } else {
        if (type == 2) {
          finNum = finNum + "%";
        }
      }
    }
  }
  return finNum;
}

function computeForm(form) {
  var Vprice    = sn(document.calc.price.value);
  var VdownPmt  = sn(document.calc.downPmt.value);
  var Vtrade    = sn(document.calc.trade.value);
  // var Vpaymentsyears = sn(document.calc.payments.value);
  var Vtermtype = document.calc.termtype.options[document.calc.termtype.selectedIndex].value;
  var Vpfreq    = document.calc.pfreq.options[document.calc.pfreq.selectedIndex].value;
  // var Vpfreqword = document.calc.pfreq.options[document.calc.pfreq.selectedIndex].text;
  var Vpayments = sn(document.calc.payments.value) * Vpfreq / Vtermtype;
      Vpayments = Math.round(Vpayments);
  var Vinterest = sn(document.calc.interest.value);
  var Vtax      = sn(document.calc.taxes.value);
  var Vtradeowed = sn(document.calc.tradeowed.value);
  // var Vrebate = sn(document.calc.rebate.value); 
  // var Vaddrebate = document.calc.finst.options[document.calc.addrebate.selectedIndex].value;
  // var Vrebate = 0;
  // var Vaddrebate = 0;
  var Vfinst    = document.calc.finst.options[document.calc.finst.selectedIndex].value;

  {
    /* 
    var VloanAmt = Number(Vprice) + Number(Vtradeowed) - Number(VdownPmt) - Number(Vtrade) - Number(Vrebate) * Number(Vaddrebate); 
    */
    var VloanAmt = Number(Vprice) + Number(Vtradeowed) - Number(VdownPmt) - Number(Vtrade);
    if (Vtax > 0) {
      /* 
      VloanAmt = (Number(Vprice) - Number(Vtrade)) * (1 + Vtax * 0.01 * Vfinst) + Number(Vtradeowed) - Number(VdownPmt) - Number(Vrebate) * Number(Vaddrebate); 
      */
      VloanAmt = (Number(Vprice) - Number(Vtrade)) * (1 + Vtax * 0.01 * Vfinst) + Number(Vtradeowed) - Number(VdownPmt);
    }

    var Vpayment = 0;

    if (Vinterest == 0) {
      Vpayment = VloanAmt / Vpayments;
      var Vinteresttotal = 0;
      document.calc.payment.value       = fns(Vpayment, 2, 1, 1, 1);
      document.calc.interesttotal.value = fns(0, 2, 1, 1, 1);
      //document.calc.allintotal.value = fns((Vprice + (Vprice * Vtax / 100) - Vrebate), 2, 1, 1, 1);
      document.calc.allintotal.value    = fns((Vprice + (Vprice * Vtax / 100)), 2, 1, 1, 1);
      document.calc.taxestotal.value    = fns(((Number(Vprice) - Number(Vtrade)) * Vtax * 0.01), 2, 1, 1, 1);
      //document.calc.dtotal.value = fns((VdownPmt + (Vrebate * Vaddrebate) + Vtrade - Vtradeowed), 2, 1, 1, 1);
      document.calc.dtotal.value        = fns((VdownPmt + Vtrade - Vtradeowed), 2, 1, 1, 1);
    } else {
      var Vpayment = computeMonthlyPayment(VloanAmt, Vpayments, Vinterest, Vpfreq);
      document.calc.payment.value       = fns(Vpayment, 2, 1, 1, 1);
      var Vinteresttotal                = ((Vpayment * Vpayments) - VloanAmt);
      document.calc.interesttotal.value = fns(Vinteresttotal, 2, 1, 1, 1);
      //document.calc.allintotal.value = fns((Vprice + (Vprice * Vtax / 100) + Vinteresttotal - Vrebate), 2, 1, 1, 1);
      document.calc.allintotal.value    = fns((Vprice + (Vprice * Vtax / 100) + Vinteresttotal), 2, 1, 1, 1);
      document.calc.taxestotal.value    = fns(((Number(Vprice) - Number(Vtrade)) * Vtax * 0.01), 2, 1, 1, 1);
      //document.calc.dtotal.value = fns((VdownPmt + (Vrebate * Vaddrebate) + Vtrade - Vtradeowed), 2, 1, 1, 1);
      document.calc.dtotal.value        = fns((VdownPmt + Vtrade - Vtradeowed), 2, 1, 1, 1);
    }
    document.calc.loanAmt.value = fns(VloanAmt, 2, 1, 1, 1);
  }
}

function computeForm1(form1) {
  var VmoPmt          = sn(document.calc1.moPmt.value);
  var Vmonths         = sn(document.calc1.months.value * 12);
  {
    var Vsalestax     = sn(document.calc1.salestaxes.value) / 100;
    var VdownPay      = sn(document.calc1.downPay.value);
    var VintRate      = sn(document.calc1.intRate.value);
    var VtradeInVal   = sn(document.calc1.tradeInVal.value);
    //var Vrebate = sn(document.calc1.rebate.value);
    var Vrebate       = 0;
    var VtradeInDebt  = sn(document.calc1.tradeInDebt.value);

    var VloanAmt      = 0;
    var VaffordCost   = 0;
    if (VintRate == 0) {
      VloanAmt = VmoPmt * Vmonths;
      document.calc1.loanAmt.value = fns(VloanAmt, 0, 1, 1, 1);

      if (Vrebate > 0) {
        var Vrebtax = Number(Vrebate) * (Vsalestax);
        Vrebate = Number(Vrebate) * (Number(Vrebate) / (Number(Vrebate) + Number(Vrebtax)));
      }

      if (VdownPay > 0) {
        var Vdowntax = Number(VdownPay) * (Vsalestax);
        VdownPay = Number(VdownPay) * (Number(VdownPay) / (Number(VdownPay) + Number(Vdowntax)));
      }

      VaffordCost = Number(VloanAmt) + Number(VdownPay) + Number(VtradeInVal) + Number(Vrebate) - Number(VtradeInDebt);
      document.calc1.affordCost.value = fns(VaffordCost, 0, 1, 1, 1);
    } else {
      VintRate /= 100;
      VintRate /= 12;

      var pow = 1;

      for (var j = 0; j < Vmonths; j++) {
        pow = pow * (1 + VintRate);
      }

      VloanAmt = ((pow - 1) * VmoPmt) / (pow * VintRate);
      var Vsalestax2 = (VloanAmt - VtradeInVal) * Vsalestax;
      VloanAmt = VtradeInVal + (VloanAmt - VtradeInVal) * ((VloanAmt - VtradeInVal) / (VloanAmt + Vsalestax2 - VtradeInVal));
      document.calc1.loanAmt.value = fns(VloanAmt, 0, 1, 1, 1);

      if (Vrebate > 0) {
        var Vrebtax = Number(Vrebate) * (Vsalestax);
        Vrebate = Number(Vrebate) * (Number(Vrebate) / (Number(Vrebate) + Number(Vrebtax)));
      }

      if (VdownPay > 0) {
        var Vdowntax = Number(VdownPay) * (Vsalestax);
        VdownPay = Number(VdownPay) * (Number(VdownPay) / (Number(VdownPay) + Number(Vdowntax)));
      }

      VaffordCost = Number(VloanAmt) + Number(VdownPay) + Number(VtradeInVal) + Number(Vrebate) - Number(VtradeInDebt);
      document.calc1.affordCost.value = fns(VaffordCost, 0, 1, 1, 1);
    }
  }
}

function clear_results(form) {
  document.calc.loanAmt.value = "";
  document.calc.payment.value = "";
  document.calc.interesttotal.value = "";
  document.calc.taxestotal.value = "";
  document.calc.allintotal.value = "";
  document.calc.dtotal.value = "";
}

function clear_results1(form1) {
  document.calc1.loanAmt.value = "";
  document.calc1.affordCost.value = "";
}
