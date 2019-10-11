'use strict';

var money = require('./money');

function Mortgage(amount, rolledInFees, interest, years, desiredMonthlyPayment) {
  this.amount = amount + rolledInFees;
  this.interest = interest / 12;
  this.months = years * 12;
  this.extraPayment = 0
  if(desiredMonthlyPayment) this.extraPayment = money.round(desiredMonthlyPayment - this.fixedMonthlyPayment());
}

Mortgage.prototype.minimumPayment = function () {
  var a = this.amount;
  var i = this.interest;
  var n = this.months;
  var payment = a * ((i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1))

  return payment.toFixed(2);
};

Mortgage.prototype.fixedMonthlyPayment = function () {
  var a = this.amount;
  var i = this.interest;
  var n = this.months;
  var payment = a * ((i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1))
  if (this.extraPayment) payment += this.extraPayment

  return payment.toFixed(2);
};

Mortgage.prototype.remainingLoanBalance = function (afterMonths) {
  var p = afterMonths;
  var a = this.amount;
  var i = this.interest;
  var n = this.months;
  var balance = a * ((Math.pow(1 + i, n) - Math.pow(1 + i, p)) / (Math.pow(1 + i, n) - 1));

  return balance.toFixed(2);
};

Mortgage.prototype.monthOfPrincipalDominance = function () {
  var balance = this.amount;
  var interest = this.interest;
  var payment = this.fixedMonthlyPayment();
  for (var i = 0; i < this.months; i++) {

    // TODO: decimal rounding
    var interestPaid = money.round(balance * interest);
    var principalPaid = money.round(payment - interestPaid);
    var minimumPrincipalPaid = money.round(principalPaid - this.extraPayment);
    if(interestPaid < minimumPrincipalPaid) return i + 1;
    balance = money.round(balance - principalPaid);
  }
}

// Returns a table of the following: payment, principal paid, interest paid, total interest, balance.
Mortgage.prototype.amortizationTable = function () {
  var balance = this.amount;
  var interest = this.interest;
  var payment = this.fixedMonthlyPayment();
  var totalInterestPaid = 0;
  var totalPrincipalPaid = 0;
  var totalPayments = 0;
  var table = [];

  for (var i = 0; i < this.months; i++) {

    // TODO: decimal rounding
    var interestPaid = money.round(balance * interest);
    var principalPaid = money.round(payment - interestPaid);
    var totalPayment = money.round(principalPaid + interestPaid)
    if(balance < totalPayment) principalPaid = money.round(balance - interestPaid)

    totalInterestPaid = money.round(totalInterestPaid + interestPaid);
    totalPrincipalPaid = money.round(totalPrincipalPaid + principalPaid);
    totalPayments = money.round(totalInterestPaid + totalPrincipalPaid)
    balance = money.round(balance - principalPaid);
    if(balance === 0) return table;

    table.push([
      payment,
      principalPaid,
      interestPaid,
      totalInterestPaid,
      totalPayments,
      balance
    ]);

  }

  return table;
};

module.exports = Mortgage;
