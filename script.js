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
  var Vprice = sn(document.calc.price.value);
  var VdownPmt = sn(document.calc.downPmt.value);
  var Vtrade = sn(document.calc.trade.value);
  // var Vpaymentsyears = sn(document.calc.payments.value);
  var Vtermtype = document.calc.termtype.options[document.calc.termtype.selectedIndex].value;
  var Vpfreq = document.calc.pfreq.options[document.calc.pfreq.selectedIndex].value;
  // var Vpfreqword = document.calc.pfreq.options[document.calc.pfreq.selectedIndex].text;
  var Vpayments = sn(document.calc.payments.value) * Vpfreq / Vtermtype;
      Vpayments = Math.round(Vpayments);
  var Vinterest = sn(document.calc.interest.value);
  var Vtax = sn(document.calc.taxes.value);
  var Vtradeowed = sn(document.calc.tradeowed.value);
  var Vrebate = sn(document.calc.rebate.value);
  var Vaddrebate = document.calc.finst.options[document.calc.addrebate.selectedIndex].value;
  var Vfinst = document.calc.finst.options[document.calc.finst.selectedIndex].value;
  
  //var Vdld = sn(document.calc.driveoffdepreciation.value);
  //var Vsad = sn(document.calc.annualdepreciation.value);
  //var Vdbu = sn(document.calc.depreciationtype.value);

  {
    var VloanAmt = Number(Vprice) + Number(Vtradeowed) - Number(VdownPmt) - Number(Vtrade) - Number(Vrebate) * Number(Vaddrebate);
    if (Vtax > 0) {
      VloanAmt = (Number(Vprice) - Number(Vtrade)) * (1 + Vtax * 0.01 * Vfinst) + Number(Vtradeowed) - Number(VdownPmt) - Number(Vrebate) * Number(Vaddrebate);
    }

    var Vpayment = 0;

    if (Vinterest == 0) {
      Vpayment = VloanAmt / Vpayments;
      var Vinteresttotal = 0;
      document.calc.payment.value = fns(Vpayment, 2, 1, 1, 1);
      document.calc.interesttotal.value = fns(0, 2, 1, 1, 1);
      //var Vallintotal = (Vprice + (Vprice * Vtax / 100) - Vrebate);
      document.calc.allintotal.value = fns((Vprice + (Vprice * Vtax / 100) - Vrebate), 2, 1, 1, 1);
      document.calc.taxestotal.value = fns(((Number(Vprice) - Number(Vtrade)) * Vtax * 0.01), 2, 1, 1, 1);
      document.calc.dtotal.value = fns((VdownPmt + (Vrebate * Vaddrebate) + Vtrade - Vtradeowed), 2, 1, 1, 1);
    } else {
      var Vpayment = computeMonthlyPayment(VloanAmt, Vpayments, Vinterest, Vpfreq);
      document.calc.payment.value = fns(Vpayment, 2, 1, 1, 1);
      var Vinteresttotal = ((Vpayment * Vpayments) - VloanAmt);
      document.calc.interesttotal.value = fns(Vinteresttotal, 2, 1, 1, 1);
      //var Vallintotal = (Vprice + (Vprice * Vtax / 100) + Vinteresttotal - Vrebate);
      document.calc.allintotal.value = fns((Vprice + (Vprice * Vtax / 100) + Vinteresttotal - Vrebate), 2, 1, 1, 1);
      document.calc.taxestotal.value = fns(((Number(Vprice) - Number(Vtrade)) * Vtax * 0.01), 2, 1, 1, 1);
      document.calc.dtotal.value = fns((VdownPmt + (Vrebate * Vaddrebate) + Vtrade - Vtradeowed), 2, 1, 1, 1);
    }
    document.calc.loanAmt.value = fns(VloanAmt, 2, 1, 1, 1);
  }
}

function createReport(form) {
  {
    var v_principal = sn(document.calc.loanAmt.value);
    var v_rate = sn(document.calc.interest.value);
    var v_termtype = document.calc.termtype.options[document.calc.termtype.selectedIndex].value;
    var v_term = sn(document.calc.payments.value) / v_termtype;
        v_term = Math.round(v_term);
    var v_interval = document.calc.pfreq.options[document.calc.pfreq.selectedIndex].value;
    var v_price = sn(document.calc.price.value);
    var v_npr = v_term * v_interval;

    var v_depreciationtype = sn(document.calc.depreciationtype.value);

    var v_payment = sn(document.calc.payment.value);

    var v_prin = v_principal;
    var v_int = v_rate;
        v_int /= 100;
        v_int /= v_interval;

    var v_driveoffdepreciationrate = sn(document.calc.driveoffdepreciation.value) / 100;
    var v_annualdepreciationrate = sn(document.calc.annualdepreciation.value) / 100;
    var v_driveoffdepreciation = v_driveoffdepreciationrate * v_price;
    var v_driveoffvalue = v_price - v_driveoffdepreciation;
    //var v_equity = v_driveoffvalue - v_prin;
    var v_downstuff = v_price - v_prin;

    var Vyear = Number(document.calc.startyear.value);
    //var Vyear1 = Vyear;
    var Vday = sn(document.calc.startday.value);
    var Vmonth = Number(document.calc.startmonth.selectedIndex);
    //var Vmonth1 = Vmonth;
    //var pmtMonth = Vmonth;
    if (Vmonth > 12) {
      Vmonth = 0;
      Vyear = Vyear + 1;
    }

    //var loandate = moment([Vyear, Vmonth - 1, Vday]);
    var calculateddate = moment([Vyear, Vmonth - 1, Vday]);
    while (!calculateddate.isValid()) {
      Vday = Vday - 1;
      calculateddate = moment([Vyear, Vmonth - 1, Vday]);
    }
    //var Vday1 = Vday;

    var v_int_port = 0;
    var v_accum_int = 0;
    var v_prin_port = 0;
    var v_accum_prin = 0;
    var v_count = 0;
    var v_pmt_row = "";
    var v_pmt_num = 0;
    var v_display_pmt_amt = 0;
    var v_accum_year_prin = 0;
    var v_accum_year_int = 0;
    var v_year = 1;

    //var v_int_text = "";
    if (v_interval == 365) {
      v_int_text = "daily";
    } else
      if (v_interval == 104) {
        v_int_text = "semiweekly";
      } else
        if (v_interval == 52) {
          v_int_text = "weekly";
        } else
          if (v_interval == 26) {
            v_int_text = "biweekly";
          } else
            if (v_interval == 24) {
              v_int_text = "semimonthly";
            } else
              if (v_interval == 12) {
                v_int_text = "monthly";
              } else
                if (v_interval == 6) {
                  v_int_text = "bimonthly";
                } else
                  if (v_interval == 4) {
                    v_int_text = "quarterly";
                  } else
                    if (v_interval == 2) {
                      v_int_text = "semi-annual";
                    } else
                      if (v_interval == 1) {
                        v_int_text = "annual";
                      }

    var v_currentvehiclevalue = v_driveoffvalue;
    var v_valuebeginyear = v_driveoffvalue;
    var v_yearlydepreciation = 0;
    var v_perioddepreciation = 0;
    var v_currentequity = 0;
    var v_accum_year_pay = 0;

    while (v_count < v_npr) {

      calculateddate = moment(calculateddate);
      if (v_interval == 52) {
        calculateddate.add(1, 'weeks');
      } else if (v_interval == 26) {
        calculateddate.add(2, 'weeks');
      } else if (v_interval == 24 && v_count % 5 == 0) {
        calculateddate.add(16, 'days');
      } else if (v_interval == 24 && v_count % 5 !== 0) {
        calculateddate.add(15, 'days');
      } else if (v_interval == 12) {
        calculateddate.add(1, 'months');
        while (Vday > 28 && moment(calculateddate).date() < Vday && moment(calculateddate).date() < moment(calculateddate).daysInMonth()) {
          calculateddate.add((1), 'days');
        }
      } else if (v_interval == 6) {
        calculateddate.add(2, 'months');
        while (Vday > 28 && moment(calculateddate).date() < Vday && moment(calculateddate).date() < moment(calculateddate).daysInMonth()) {
          calculateddate.add((1), 'days');
        }
      } else if (v_interval == 4) {
        calculateddate.add(3, 'months');
        while (Vday > 28 && moment(calculateddate).date() < Vday && moment(calculateddate).date() < moment(calculateddate).daysInMonth()) {
          calculateddate.add((1), 'days');
        }
      } else if (v_interval == 2) {
        calculateddate.add(6, 'months');
        while (Vday > 28 && moment(calculateddate).date() < Vday && moment(calculateddate).date() < moment(calculateddate).daysInMonth()) {
          calculateddate.add((1), 'days');
        }
      } else if (v_interval == 1) {
        calculateddate.add(1, 'years');
        while (Vday > 28 && moment(calculateddate).date() < Vday && moment(calculateddate).date() < moment(calculateddate).daysInMonth()) {
          calculateddate.add((1), 'days');
        }
      }

      if (v_count < (v_npr - 1)) {

        if (v_depreciationtype == 0) {
          v_yearlydepreciation = Number(v_annualdepreciationrate) * Number(v_valuebeginyear);
          v_perioddepreciation = Number(v_yearlydepreciation) / Number(v_interval);
          v_currentvehiclevalue = Number(v_currentvehiclevalue) - Number(v_perioddepreciation);
        }

        if (v_depreciationtype == 1) {
          v_yearlydepreciation = Number(v_principal) * Number(v_annualdepreciationrate);
          v_perioddepreciation = Number(v_yearlydepreciation) / Number(v_interval);
          v_currentvehiclevalue = Number(v_currentvehiclevalue) - Number(v_perioddepreciation);
        }

        if (v_currentvehiclevalue < 0) {
          v_currentvehiclevalue = 0;
          v_perioddepreciation = 0;
          v_yearlydepreciation = Number(v_valuebeginyear);
        }

        v_int_port = v_prin * v_int;
        v_int_port *= 100;
        v_int_port = Math.round(v_int_port);
        v_int_port /= 100;

        v_accum_int = Number(v_accum_int) + Number(v_int_port);
        v_accum_year_int = Number(v_accum_year_int) + Number(v_int_port);

        v_prin_port = Number(v_payment) - Number(v_int_port);
        v_prin_port *= 100;
        v_prin_port = Math.round(v_prin_port);
        v_prin_port /= 100;

        v_accum_prin = Number(v_accum_prin) + Number(v_prin_port);
        v_accum_year_prin = Number(v_accum_year_prin) + Number(v_prin_port);
        v_prin = Number(v_prin) - Number(v_prin_port);
        v_display_pmt_amt = Number(v_prin_port) + Number(v_int_port);
        v_currentequity = Number(v_currentvehiclevalue) - Number(v_prin);
        v_accum_year_pay = Number(v_accum_year_prin) + Number(v_accum_year_int);

      } else {

        if (v_depreciationtype == 0) {
          v_yearlydepreciation = (v_annualdepreciationrate * v_valuebeginyear);
          v_perioddepreciation = v_yearlydepreciation / v_interval;
          v_currentvehiclevalue = v_currentvehiclevalue - v_perioddepreciation;
        }

        if (v_depreciationtype == 1) {
          v_yearlydepreciation = (v_principal * v_annualdepreciationrate);
          v_perioddepreciation = v_yearlydepreciation / v_interval;
          v_currentvehiclevalue = v_currentvehiclevalue - v_perioddepreciation;
        }

        if (v_currentvehiclevalue < 0) {
          v_currentvehiclevalue = 0;
          v_perioddepreciation = 0;
          v_yearlydepreciation = v_valuebeginyear;
        }

        v_int_port = v_prin * v_int;
        v_int_port *= 100;
        v_int_port = Math.round(v_int_port);
        v_int_port /= 100;
        v_accum_int = Number(v_accum_int) + Number(v_int_port);
        v_accum_year_int = Number(v_accum_year_int) + Number(v_int_port);
        v_prin_port = v_prin;
        v_accum_prin = Number(v_accum_prin) + Number(v_prin_port);
        v_accum_year_prin = Number(v_accum_year_prin) + Number(v_prin_port);
        v_prin = 0;
        v_currentequity = v_currentvehiclevalue - v_prin;
        v_accum_year_pay = v_accum_year_prin + v_accum_year_int;
        v_display_pmt_amt = Number(v_prin_port) + Number(v_int_port);
      }

      v_count = Number(v_count) + Number(1);
      v_pmt_num = Number(v_pmt_num) + Number(1);

      v_pmt_row += "<tr><td align=center>";
      v_pmt_row += "" + v_pmt_num + "</td>";
      v_pmt_row += "<td align=right>" + calculateddate.format('ll') + "</td>";
      v_pmt_row += "<td align=right>$" + fns(v_display_pmt_amt, 2, 1, 0, 0) + "";
      v_pmt_row += "</td><td align=right>$" + fns(v_prin_port, 2, 1, 0, 0) + "";
      v_pmt_row += "</td><td align=right>";
      v_pmt_row += "$" + fns(v_int_port, 2, 1, 0, 0) + "";
      v_pmt_row += "</td><td align=right>";
      v_pmt_row += "$" + fns(v_prin, 2, 1, 0, 0) + "</td>";
      v_pmt_row += "<td align=right>$" + fns(v_perioddepreciation, 2, 1, 0, 0) + "</td>";
      v_pmt_row += "<td align=right>$" + fns(v_currentvehiclevalue, 2, 1, 0, 0) + "</td>";
      v_pmt_row += "<td align=right>$" + fns(v_currentequity, 2, 1, 0, 0) + "</td></tr>";

      if (v_pmt_num % v_interval == 0) {

        if (v_year == 1) {
          v_yearlydepreciation = v_yearlydepreciation + v_driveoffdepreciation;
          v_accum_year_pay = v_accum_year_pay + v_downstuff;
        }
        v_valuebeginyear = Number(v_valuebeginyear) * (1 - Number(v_annualdepreciationrate));

        v_pmt_row += "<tr bgcolor='#F0F7FA'><td align=left>";
        v_pmt_row += "Year " + v_year + "";
        v_pmt_row += "</td><td align=right>";
        v_pmt_row += " ";
        v_pmt_row += "</td><td align=right>";
        v_pmt_row += "$" + fns(v_accum_year_pay, 2, 1, 0, 0) + "";
        v_pmt_row += "</td><td align=right>";
        v_pmt_row += "$" + fns(v_accum_year_prin, 2, 1, 0, 0) + "";
        v_pmt_row += "</td><td align=right>";
        v_pmt_row += "$" + fns(v_accum_year_int, 2, 1, 0, 0) + "</td>";
        v_pmt_row += "<td align=right>";
        v_pmt_row += "$" + fns(v_prin, 2, 1, 0, 0) + "</td>";
        v_pmt_row += "<td align=right>";
        v_pmt_row += "$" + fns(v_yearlydepreciation, 2, 1, 0, 0) + "</td>";
        v_pmt_row += "<td align=right>";
        v_pmt_row += "$" + fns(v_currentvehiclevalue, 2, 1, 0, 0) + "</td>";
        v_pmt_row += "<td align=right>";
        v_pmt_row += "$" + fns(v_currentequity, 2, 1, 0, 0) + "</td></tr>";

        v_year += 1;
        v_accum_year_prin = 0;
        v_accum_year_int = 0;
      }

      if (v_count > 100 * v_interval) {
        alert("Using your current entries you will never pay off this loan.");
        break;
      } else {
        continue;
      }
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

function computeForm1(form1) {
  var VmoPmt = sn(document.calc1.moPmt.value);
  var Vmonths = sn(document.calc1.months.value * 12);

  {
    var Vsalestax = sn(document.calc1.salestaxes.value) / 100;
    var VdownPay = sn(document.calc1.downPay.value);
    var VintRate = sn(document.calc1.intRate.value);
    var VtradeInVal = sn(document.calc1.tradeInVal.value);
    var Vrebate = sn(document.calc1.rebate.value);
    var VtradeInDebt = sn(document.calc1.tradeInDebt.value);

    var VloanAmt = 0;
    var VaffordCost = 0;
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

function clear_results(form1) {
  document.calc1.loanAmt.value = "";
  document.calc1.affordCost.value = "";
}