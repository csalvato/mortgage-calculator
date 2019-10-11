'use strict';

var Mortgage = require('./mortgage');
var print = require('node-print');

const currentAmount = 305763.75
const originalAmount = 317925

const scenarios = [
  { name: 'New 30 year', amount: currentAmount, rolledInFees: 1500, interest: 3.6 / 100, years: 30, desiredMonthlyPayment: 3500 },
  { name: 'New 30 year', amount: currentAmount, rolledInFees: 0, interest: 3.6 / 100, years: 30, desiredMonthlyPayment: 3500 },
  { name: 'New 30 year', amount: currentAmount, rolledInFees: 1500, interest: 3.6 / 100, years: 30, desiredMonthlyPayment: 2100 },
  { name: 'New 30 year', amount: currentAmount, rolledInFees: 0, interest: 3.6 / 100, years: 30, desiredMonthlyPayment: 2100 },
  { name: 'New 30 year', amount: currentAmount, rolledInFees: 1500, interest: 3.6 / 100, years: 30, desiredMonthlyPayment: 1540.82 },
  { name: 'New 30 year', amount: currentAmount, rolledInFees: 0, interest: 3.6 / 100, years: 30, desiredMonthlyPayment: 1540.82 },
  { name: 'New 30 year', amount: currentAmount, rolledInFees: 1500, interest: 3.6 / 100, years: 30, desiredMonthlyPayment: null },
  { name: 'New 30 year', amount: currentAmount, rolledInFees: 0, interest: 3.6 / 100, years: 30, desiredMonthlyPayment: null },
  { name: 'Original 30 year', amount: originalAmount, rolledInFees: 0, interest: 4.125 / 100, years: 30, desiredMonthlyPayment: 3500 },
  { name: 'Original 30 year', amount: originalAmount, rolledInFees: 0, interest: 4.125 / 100, years: 30, desiredMonthlyPayment: 2100 },
  { name: 'Original 30 year', amount: originalAmount, rolledInFees: 0, interest: 4.125 / 100, years: 30, desiredMonthlyPayment: null },
]

let table = []
scenarios.forEach((scenario) => {
  const { name, amount, rolledInFees, interest, years, desiredMonthlyPayment } = scenario
  var mortgage = new Mortgage(amount, rolledInFees, interest, years, desiredMonthlyPayment);
  var payment = mortgage.fixedMonthlyPayment();
  var monthOfPrincipalDominance = mortgage.monthOfPrincipalDominance()
  var amortTable = mortgage.amortizationTable();
  // var amortList = amortTable.map(function (row, i) {
  //   return {
  //     'Month': i + 1,
  //     'Payment': row[0],
  //     'Principal Paid': row[1],
  //     'Interest Paid': row[2],
  //     'Total Interest': row[3],
  //     'Total Payment': row[4],
  //     'Balance': row[5]
  //   };
  // });


  const currencyFormat = (number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)

  table.push({
    'Name': name,
    'Minimum Payment': currencyFormat(mortgage.minimumPayment()),
    'Monthly Payment': currencyFormat(payment),
    'Rate':  Math.round(((interest)*100000))/1000 + '%',
    'Rolled In Fees': currencyFormat(rolledInFees),
    'Total Payments': currencyFormat(amortTable[amortTable.length-1][4]),
    'Total Interest': currencyFormat(amortTable[amortTable.length-1][3]),
    'Full term': Math.round(((amortTable.length / 12)*100))/100 + ' years',
    'Principal Dominance': Math.round(((monthOfPrincipalDominance / 12)*100))/100 + ' years'
  })
})

// console.log('Minimum Payment: ', mortgage.minimumPayment());
// console.log('Fixed monthly payments: ' + payment);
// console.log('Total Payments:', amortTable[amortTable.length-1][4]);
// console.log('Total Interest:', amortTable[amortTable.length-1][3]);
// console.log('Full term in years:', amortTable.length / 12)
// console.log('Time Until Principal Dominance', Math.round(((monthOfPrincipalDominance / 12)*100))/100)

// console.log('Amortization table:');
// print.pt(amortList);
print.pt(table)
