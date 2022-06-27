
// import { ethers } from "ethers";
const { ethers } = require("./node_modules/ethers");
import { ABIDecoder } from "./ABIDecoder";
import abi from "./mock/abi.js";


if (window.ethereum) {
    window.ethereum.enable();
    console.log("xxx");
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let decoder = new ABIDecoder(provider, abi.abi, "MyToken");
    let contract = decoder.decode("0x574D9D81eCa93E45102dA03900c885a9cCd729B5");

    (async () => {
        let a = await provider.getSigner().getAddress();
        console.log(a);
        await contract.methods.botId();
    })()

}
