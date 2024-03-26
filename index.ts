import axios from 'axios';
const fs = require('fs');

(async() => {
  const jettons = ["EQDPb1kFuIy88GJmoFIHWDzzoggBarqWGlSbc8Z-OsaOYF2z"];
  const limitHolder = 50;
  
  for(let i = 0; i < jettons.length; i++) {
    const jetton = jettons[i];
    const url = `https://api.ton.cat/v2/contracts/jetton_minter/${jetton}/holders?limit=${limitHolder}`;
    const response = await axios.get(url);
    console.log(`Jetton: ${jetton}`);
    const wallets = response.data.holders.map((holder) => holder.holder_address);
    const balances = response.data.holders.map((holder) => holder.balance_normalized);
    /// write to file holders/jetton_holders_${jetton}.csv
    const fileName = `holders/jetton_holders_${jetton}.csv`;
    let data = wallets.map((wallet, index) => `${wallet},${balances[index]}`).join('\n');
    /// mkdir holders if not exists
    if (!fs.existsSync('holders')) {
      fs.mkdirSync('holders');
    }
    data = `wallet,balance\n${data}`;
    fs.writeFileSync(fileName, data);

  }
})()