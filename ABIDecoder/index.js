import { ethers } from "ethers";

export class ABIDecoder {
    constructor(provider, abi, contractName) {
        if (!Array.isArray(abi)) throw new Error("ABIDecoderError: ABI not array");
        if (typeof contractName != "string") throw new Error("ABIDecoderError: invalid contractName type")

        this.provider = provider;
        this.contractName = contractName;
        this.rawABI = abi;
        this.ABIInstance = null;
    }
}

ABIDecoder.prototype.decode = function (address) {
    let rawABI = this.rawABI;
    let contract = new ethers.Contract(address, rawABI, this.provider.getSigner());
    return _decode(rawABI, contract, address)
}

function _decode(abi, contract, address) {
    let obj = {
        address,
        events: {},
        methods: {},
        _constructor: {}
    };
    for (let i = 0; i < abi.length; i++) {
        let item = abi[i];
        let name = item.name;
        switch (item.type) {
            case "event":
                obj.events[name] = function (callback) {
                    contract.on(name, callback);
                }
                break;
            case "constructor":
                obj._constructor = item.inputs;
                break;
            case "function":
                let stateMutability = item.stateMutability;
                obj.methods[name] = null;
                switch (stateMutability) {
                    case "payable":
                        obj.methods[name] = async function (...args) {
                            let ret = await contract[name](...args);
                            return await ret.wait();
                        }
                        break;
                    case "view":
                        obj.methods[name] = async function (...args) {
                            return await contract[name](...args);
                        }
                        break;
                    case "nonpayable":
                        obj.methods[name] = async function (...args) {
                            let ret = await contract[name](...args);
                            return await ret.wait();
                        }
                        break;
                }
                break;
        }
    }

    return obj;
}
