const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const defaults = require("../defaults");

module.exports.transfer = async (req, res) => {
  let response = { ...defaults.apiResponse };

  try {
    console.log(req.body);
    const service_response = await transactionService.transfer(req.body);

    response.status = 200;
    response.message = defaults.walletMessages.TRANSFER;
    response.body = service_response;
  } catch (error) {
    console.log("Transfer error ...", error);
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};
module.exports.transferFee = async (req, res) => {
  let response = { ...defaults.apiResponse };

  try {
    console.log(req.body);
    const service_response = await transactionService.transferFee(req.body);

    response.status = 200;
    response.message = defaults.walletMessages.TRANSFER_FEE;
    response.body = service_response;
  } catch (error) {
    console.log("Fee Transfer error ...", error);
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};

module.exports.getTransaction = async (req, res) => {
  let response = { ...defaults.apiResponse };

  try {
    const service_response = await transactionService.getTransaction(
      req.params._id
    );
    response.status = 200;
    response.message = defaults.transactionMessages.USER_INFO;
    response.body = service_response;
  } catch (error) {
    console.log("Get transaction error...", error);
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};

module.exports.listTransactions = async (req, res) => {
  let response = { ...defaults.apiResponse };
  try {
    const service_response = await transactionService.listTransactions(req);
    response.status = 200;
    response.message = defaults.walletMessages.LIST;
    response.body = service_response;
  } catch (error) {
    console.log("Listing transactions...", error);
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};
