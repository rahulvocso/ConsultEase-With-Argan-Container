const User = require("../database/models/userModel");
const Wallet = require("../database/models/walletModel");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getWallet = async (req) => {
  // << Known issue >>
  // security to be applied so it doesnt return other people's wallet

  try {
    let user = {};
    let wallet = {};

    //get Wallet by wallet_id
    if (req.query.wallet_id) {
      console.log("Wallet_ID - ", req.query.wallet_id);
      //wallet=await Wallet.findOne({"_id":new mongoose.Types.ObjectId(req.query.wallet_id)});
      wallet = await Wallet.findOne({ _id: req.query.wallet_id });
      //.maxTimeMS(30000);
    } else {
      if (req.header("auth_token"))
        user = await User.findOne({ auth_token: req.header("auth_token") });

      if (!user) throw new Error("unable to find user...");

      //check if wallet exists and create one if doesnt
      wallet = await Wallet.findOneAndUpdate(
        { user_id: user._id },
        { user_id: user._id, active: true },
        { upsert: true, new: true }
      );

      console.log("doc...", wallet);
    }

    if (!wallet) throw new Error("No wallet found...");

    return wallet;
  } catch (error) {
    console.log("Error / Wallet Service1 / ");
    throw new Error(error);
  }
};

// to be called internally only - not exposed to API
const updateWallet = async (wallet_id, amount) => {
  console.log("wallet update error", { wallet_id, amount });

  let wallet = await Wallet.findOneAndUpdate(
    {
      _id: wallet_id,
    },
    {
      $inc: { balance: amount },
    },
    { new: true }
  );

  if (!wallet) throw new Error("Error updating wallet...");

  return wallet;
};

module.exports.getWallet = getWallet;
module.exports.updateWallet = updateWallet;
