const a = [
  {
    no: 'A',
    title: 'COMMISSION (FYC;SYC;RC;APB)',
    items: [[Object]],
    total: null,
  },
  {
    no: 'B',
    title: 'PERSONAL PRODUCTION BONUS',
    items: [[Object], [Object]],
    total: null,
  },
  {
    no: 'C',
    title: 'GROUP PRODUCTION BONUS',
    items: [[Object]],
    total: null,
  },
  { no: 'D', title: 'ALLOWANCE', items: [], total: null },
  { no: 'E', title: 'CONTEST & OTHER', items: [], total: null },
  { no: 'F', title: 'TOTAL INCOME', items: [], total: null },
  { no: 'G', title: 'TAX', items: [[Object], [Object]], total: null },
  {
    no: 'H',
    title: 'TAX ADJUSTMENT',
    items: [[Object], [Object]],
    total: null,
  },
  { no: 'I', title: 'NET INCOME', items: [], total: null },
  { no: 'J', title: 'DEDUCTION', items: [], total: null },
  { no: 'K', title: 'PENDING INCOME', items: [], total: null },
  { no: 'L', title: 'NET PAYMENT', items: [], total: null },
  { no: 'M', title: 'SAY (IN RUPIAH)', items: [], total: null },
];

console.log(a.map((s) => s.title));
