const bcrypt = require("bcrypt");

const hash = "$2b$10$UZQT2CnLT2ql5bDncCJzz.tnVyEb5lqsJ/LFTGgjlYDqc8Ax9QZRG";

const test = async () => {
  const result = await bcrypt.compare("123456", hash);

  console.log(result);
};

test();
