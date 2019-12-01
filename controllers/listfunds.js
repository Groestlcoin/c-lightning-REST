//This controller houses the listfunds functions

//Function # 1
//Invoke the 'lisfunds' command return the on-chain and channel fund information from the node
//Arguments - No arguments
/**
* @swagger
* /listFunds:
*   get:
*     tags:
*       - General Information
*     name: listfunds
*     summary: Lists on-chain and channel funds
*     responses:
*       200:
*         description: Returned fund information successfully
*       500:
*         description: Server error
*/
exports.listFunds = (req,res) => {
    global.logger.log('listFunds initiated...');
    function connFailed(err) { throw err }
    ln.on('error', connFailed);

    //Call the listfunds command
    ln.listfunds().then(data => {
        global.logger.log('listFunds success');
        res.status(200).json(data);
    }).catch(err => {
        global.logger.warn(err);
        res.status(500).json({error: err});
    });
    ln.removeListener('error', connFailed);
}