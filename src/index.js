// In Node.js
const { mnemonicToEntropy } = require('bip39')
const wasm = require('@emurgo/cardano-serialization-lib-nodejs')
const express = require('express')
const {json} = require('express')


const app = express()
app.use(json())
const port = process.env.SVPORT? process.env.SVPORT: 3000


function harden(num) {
  return 0x80000000 + num;
}

app.post('/xpub', (req, res) => {
  const mnemonic = req.body.mnemonic
 
  const entropy = mnemonicToEntropy(mnemonic);
  const rootKey = wasm.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, 'hex'),
    Buffer.from(''),
  );
  const xpub = rootKey
                .derive(harden(1852))
                .derive(harden(1815))
                .derive(harden(0))
                .to_public();

  res.status(200).send(xpub.to_bech32())
})


app.get('/address/:xpub/:index', (req, res) => {
  const xpub = req.params.xpub
  const index = req.params.index

  const pub = wasm.Bip32PublicKey
                .from_bech32(xpub)
                .derive(0) 
                .derive(index)

const enterpriseAddr = wasm.EnterpriseAddress.new(
    wasm.NetworkInfo.mainnet().network_id(),
    wasm.StakeCredential.from_keyhash(pub.to_raw_key().hash(), 2))
                .to_address()
                .to_bech32()
  res.status(200).send(enterpriseAddr)

})

app.listen(port, () => {
  console.log(`server started on port ${port}`)
})
