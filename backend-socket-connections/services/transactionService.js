const User = require("../database/models/userModel");
const Wallet = require("../database/models/walletModel");
const Transaction = require("../database/models/transactionModel");
const { transferValidation } = require("../helpers/validation");
const defaults = require("../defaults");

const { getWallet, updateWallet } = require("../services/walletService");

const mongoose = require("mongoose");

const transfer = async (serviceData) => {
  // validate transaction data
  const { error } = transferValidation(serviceData);
  if (error) throw new Error(error);

  try {
    // add transaction
    let transaction = await new Transaction({ ...serviceData });
    transaction.save();
    if (!transaction) throw new Error("Error performing transaction");

    // update wallet balance - sender
    let wallet1 = await updateWallet(
      serviceData.from_wallet,
      -serviceData.amount
    );
    console.log("wallet 1 ", wallet1);

    console.log("---------servicedata", serviceData);
    // update wallet balance - receiver
    let wallet2 = await updateWallet(serviceData.to_wallet, serviceData.amount);
    console.log("wallet 2 ", wallet2);

    console.log("Debit successful", transaction);

    return await transaction;
  } catch (error) {
    console.log("Error / Transaction Service / ");
    throw new Error(error);
  }
};

const transferFee = async (serviceData) => {
  // from_wallet - caller
  // to_wallet - professional
  // system_wallet - admin's wallet for commissions

  // transfer from_wallet to to_wallet
  let transaction1 = transfer(serviceData);

  let commission_amount =
    (serviceData.amount * process.env.CALL_FEE_RATE) / 100;

  // transfer to_wallet to system_wallet
  let transaction2 = transfer({
    ...serviceData,
    from_wallet: serviceData.to_wallet,
    to_wallet: process.env.SYSTEM_WALLET_ID,
    type: "commission",
    amount: commission_amount,
  });

  return await transaction1;
};

module.exports.listTransactions_backup = async (req) => {
  const { createdAt = new Date() } = req.query;
  const wallet = await getWallet(req);

  console.log("wallet found", wallet);

  let where = {};

  where = {
    $and: [
      { createdAt: { $lt: new Date(createdAt) } },
      {
        $or: [{ from_wallet: wallet._id }, { to_wallet: wallet._id }],
      },
      { active: true },
    ],
  };

  try {
    // list transactions
    let transactions = await Transaction.find(where)
      .sort({ createdAt: "desc" })
      .limit(process.env.PAGE_SIZE);

    if (!transactions) throw new Error(" No transactions");

    console.log("Listing transactions...");

    return await transactions;
  } catch (error) {
    console.log("Error / Transaction Listing Service / ");
    throw new Error(error);
  }
};

module.exports.listTransactions = async (req) => {
  const {
    wallet_id,
    pageNumber = 1,
    sort = "createdAt",
    sort_type = -1,
  } = req.query;
  console.log("req", req.query);
  let dataResponse = { ...defaults.dataResponse };
  let skipCount = process.env.PAGE_SIZE * (pageNumber - 1);
  let count = 0;
  console.log("pageNumber - skipCount - sort - type", {
    pageNumber,
    skipCount,
    sort,
    sort_type,
  });

  const { createdAt = new Date() } = req.query;
  const wallet = await getWallet(req);
  console.log("wallet found", wallet);

  let where = {
    $and: [{ createdAt: { $lt: new Date(createdAt) } }, { active: true }],
    $or: [{ from_wallet: wallet._id }, { to_wallet: wallet._id }],
  };

  try {
    // list transactions
    const transactions = await Transaction.aggregate([
      {
        $match: where,
      },
      {
        $lookup: {
          from: "wallets",
          localField: "from_wallet",
          foreignField: "_id",
          as: "from_wallet",
        },
      },
      {
        $lookup: {
          from: "wallets",
          localField: "to_wallet",
          foreignField: "_id",
          as: "to_wallet",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "from_wallet.user_id",
          foreignField: "_id",
          as: "from_user",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "to_wallet.user_id",
          foreignField: "_id",
          as: "to_user",
        },
      },
      {
        $project: {
          _id: 1,
          created_at: 1,
          type: 1,
          amount: 1,
          createdAt: 1,
          from_wallet: { $arrayElemAt: ["$from_wallet._id", 0] },
          to_wallet: { $arrayElemAt: ["$to_wallet._id", 0] },
          from_user: { $arrayElemAt: ["$from_user.fname", 0] },
          to_user: { $arrayElemAt: ["$to_user.fname", 0] },
        },
      },
    ])
      .sort({ [sort]: sort_type })
      .skip(skipCount)
      .limit(parseInt(process.env.PAGE_SIZE));

    count = await Transaction.find(where).count();

    if (!transactions) {
      throw new Error("No transactions");
    }

    dataResponse.recordCount = count;
    dataResponse.pageCount = Math.ceil(count / process.env.PAGE_SIZE);
    dataResponse.pageNumber = parseInt(pageNumber);
    dataResponse.data = [...transactions];

    console.log(
      "Listing transactions...",
      count,
      Math.ceil(count / process.env.PAGE_SIZE),
      pageNumber
    );

    return dataResponse;
  } catch (error) {
    console.log("Error / Transaction Listing Service / ");
    throw new Error(error);
  }
};

module.exports.list = async ({
  pageNumber = 1,
  sort = "mobile",
  sort_type = -1,
  keyword = "",
}) => {
  let dataResponse = { ...defaults.dataResponse };
  let skipCount = process.env.PAGE_SIZE * (pageNumber - 1);
  let count = 0;
  console.log("pageNumber - skipCount - sort - type", {
    pageNumber,
    skipCount,
    sort,
    sort_type,
  });

  let where = {};

  where = {
    $and: [
      {
        $or: [
          { fname: new RegExp(keyword, "i") },
          { lname: new RegExp(keyword, "i") },
          { mobile: new RegExp(keyword, "i") },
          { handle: new RegExp(keyword, "i") },
        ],
      },
      { active: true },
    ],
  };

  try {
    // list users
    let randomObject = dummy(User, {
      ignore: [
        "_id",
        "created_at",
        "__v",
        "otp",
        "schedule",
        "profile.categories",
        "interests",
      ],
      returnDate: true,
    });
    //console.log(randomObject);
    // console.log("[generating new data]")
    // let userNew=new User(randomObject);
    //     userNew.save();
    // console.log("userNew",userNew)

    let users = await User.find(where)
      .sort({ [sort]: sort_type })
      .skip(skipCount)
      .limit(process.env.PAGE_SIZE);
    count = await User.find(where).count();

    if (!users) throw new Error(" User not found");

    dataResponse.recordCount = count;
    dataResponse.pageCount = Math.ceil(count / process.env.PAGE_SIZE);
    dataResponse.pageNumber = parseInt(pageNumber);
    dataResponse.data = [...users];

    console.log(
      "Listing users...",
      count,
      Math.ceil(count / process.env.PAGE_SIZE),
      pageNumber
    );

    return await dataResponse;
  } catch (error) {
    console.log("Error / User Service / ");
    throw new Error(error);
  }
};

module.exports.transfer = transfer;
module.exports.transferFee = transferFee;
