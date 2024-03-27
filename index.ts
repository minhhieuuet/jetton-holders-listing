import axios from 'axios';
const fs = require('fs');

(async() => {
  const jettons = ["EQDPb1kFuIy88GJmoFIHWDzzoggBarqWGlSbc8Z-OsaOYF2z"];
  const limitHolder = 226;
  
  for(let i = 0; i < jettons.length; i++) {
    const jetton = jettons[i];
    const url = `https://api.ton.cat/v2/contracts/jetton_minter/${jetton}/holders`;
    const response = await axios.get(url);
    const total = response.data.total;
    const limit = 100;
    let holders = [];
    console.log(total);
    // chunk 100 holder each to get from https://api.ton.cat/v2/contracts/jetton_minter/${jetton}/holders?limit=&offset=
    for(let offset = 0; offset < total; offset += limit) {
      const url = `https://api.ton.cat/v2/contracts/jetton_minter/${jetton}/holders?limit=${limit}&offset=${offset}`;
      console.log(url);
      const response = await axios.get(url);
      holders = holders.concat(response.data.holders);
      if(holders.length >= limitHolder) break;
    }
    // get only limitHolder holders
    holders = holders.slice(0, limitHolder);
    console.log(`Jetton: ${jetton}`);
    const wallets = holders.map((holder) => holder.holder_address);
    const balances = holders.map((holder) => holder.balance_normalized);
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