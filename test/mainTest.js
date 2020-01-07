//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let configFile = './cl-rest-config.json';
fs = require( 'fs' );
//let should = chai.should();
var expect = require('chai').expect;
let macaroonFile = "./certs/access.macaroon";

//Read the macaroon file
var abc = fs.readFileSync (macaroonFile);
var macaroon = Buffer.from(abc).toString("base64");

//Read the config params
//If the cl-rest server is being run as plugin,
//the config params should match with the ones specified in the c-lightning config
let rawconfig = fs.readFileSync (configFile, function (err){
if (err){
        console.warn("Failed to read config key");
        console.error( error );
        process.exit(1);
}
});
let config = JSON.parse(rawconfig);
let server = config.PROTOCOL + "://localhost:" + config.PORT;

chai.use(chaiHttp);

if (config.PROTOCOL === 'https')
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//Parent block
describe('lnnode', () => {
    before((done) => {
           done();
    });

// Test the Getinfo route
describe('/GET getinfo', () => {
    it('it should return getinfo from the node', (done) => {
      chai.request(server)
          .get('/v1/getinfo')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body;
                expect(res).to.have.status(200);
                expect(body).to.contain.property('id');
                expect(body).to.contain.property('alias');
                expect(body).to.contain.property('color');
                expect(body).to.contain.property('num_peers');
                expect(body).to.contain.property('num_pending_channels');
                expect(body).to.contain.property('num_active_channels');
                expect(body).to.contain.property('num_inactive_channels');
                expect(body).to.contain.property('address');
                expect(body).to.contain.property('version');
                expect(body).to.contain.property('blockheight');
                expect(body).to.contain.property('network');
                expect(body).to.contain.property('msatoshi_fees_collected');
                expect(body).to.contain.property('fees_collected_msat');
            done();
          });
    });
});

// Test the localRemoteBal route
describe('/GET localremotebal', () => {
    it('it should return local and remote balance from the node', (done) => {
      chai.request(server)
          .get('/v1/channel/localremotebal')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body;
                expect(res).to.have.status(200);
                expect(body).to.contain.property('localBalance');
                expect(body).to.contain.property('remoteBalance');
            done();
          });
    });
});

// Test the listChannels route
describe('/GET listChannels', () => {
    it('it should return all channels from the node', (done) => {
      chai.request(server)
          .get('/v1/channel/listChannels')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body;
                expect(res).to.have.status(200);
                if(Object.keys(body).length){
                expect(body[0]).to.contain.property('id');
                expect(body[0]).to.contain.property('connected');
                expect(body[0]).to.contain.property('state');
                expect(body[0]).to.contain.property('short_channel_id');
                expect(body[0]).to.contain.property('channel_id');
                expect(body[0]).to.contain.property('funding_txid');
                expect(body[0]).to.contain.property('private');
                expect(body[0]).to.contain.property('msatoshi_to_us');
                expect(body[0]).to.contain.property('msatoshi_total');
                expect(body[0]).to.contain.property('their_channel_reserve_satoshis');
                expect(body[0]).to.contain.property('our_channel_reserve_satoshis');
                expect(body[0]).to.contain.property('spendable_msatoshi');
                expect(body[0]).to.contain.property('alias');
                }
            done();
          });
    });
});

// Test the listFunds route
describe('/GET listFunds', () => {
    it('it should return all on-chain and channel fund info from the node', (done) => {
      chai.request(server)
          .get('/v1/listFunds')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body.outputs;
                const body2 = res.body.channels;
                expect(res).to.have.status(200);
                if(Object.keys(body).length){
                expect(body[0]).to.contain.property('txid');
                expect(body[0]).to.contain.property('output');
                expect(body[0]).to.contain.property('value');
                expect(body[0]).to.contain.property('amount_msat');
                expect(body[0]).to.contain.property('address');
                expect(body[0]).to.contain.property('status');
                expect(body[0]).to.contain.property('blockheight');
                expect(body2[0]).to.contain.property('peer_id');
                expect(body2[0]).to.contain.property('short_channel_id');
                expect(body2[0]).to.contain.property('channel_sat');
                expect(body2[0]).to.contain.property('our_amount_msat');
                expect(body2[0]).to.contain.property('channel_total_sat');
                expect(body2[0]).to.contain.property('amount_msat');
                expect(body2[0]).to.contain.property('funding_txid');
                expect(body2[0]).to.contain.property('funding_output');
                }
            done();
          });
    });
});

// Test the getBalance route
describe('/GET getBalance', () => {
    it('it should return confirmed, un-confirmed and total on-chain balance from the node', (done) => {
      chai.request(server)
          .get('/v1/getBalance')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body;
                expect(res).to.have.status(200);
                expect(body).to.contain.property('totalBalance');
                expect(body).to.contain.property('confBalance');
                expect(body).to.contain.property('unconfBalance');
            done();
          });
    });
});

// Test the newaddr route
describe('/GET newaddr', () => {
    it('it should return a groestlcoin address from the node', (done) => {
      chai.request(server)
          .get('/v1/newaddr')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body;
                expect(res).to.have.status(200);
                expect(body).to.contain.property('address');
            done();
          });
    });
});

// Test the listpeers route
describe('/GET listPeers', () => {
    it('it should return list of connected peers from the node', (done) => {
      chai.request(server)
          .get('/v1/peer/listPeers')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body;
                expect(res).to.have.status(200);
                if(Object.keys(body).length){
                expect(body[0]).to.contain.property('id');
                expect(body[0]).to.contain.property('connected');
                expect(body[0]).to.contain.property('alias');
                }
            done();
          });
    });
});

// Test the listForwards route
describe('/GET listForwards', () => {
    it('it should return list of forwarded transactions from the node', (done) => {
      chai.request(server)
          .get('/v1/channel/listForwards')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body;
                expect(res).to.have.status(200);
                if(Object.keys(body).length){
                expect(body[0]).to.contain.property('in_channel');
                expect(body[0]).to.contain.property('out_channel');
                expect(body[0]).to.contain.property('in_msatoshi');
                expect(body[0]).to.contain.property('in_msat');
                expect(body[0]).to.contain.property('out_msatoshi');
                expect(body[0]).to.contain.property('out_msat');
                expect(body[0]).to.contain.property('fee');
                expect(body[0]).to.contain.property('fee_msat');
                expect(body[0]).to.contain.property('status');
                }
            done();
          });
    });
});

// Test the listPays route
describe('/GET listPays', () => {
    it('it should return list of payments made from the node', (done) => {
      chai.request(server)
          .get('/v1/pay/listPays')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body.pays;
                expect(res).to.have.status(200);
                if(Object.keys(body).length){
                expect(body[0]).to.contain.property('bolt11');
                expect(body[0]).to.contain.property('status');
                expect(body[0]).to.contain.property('payment_preimage');
                expect(body[0]).to.contain.property('amount_sent_msat');
                }
            done();
          });
    });
});

// Test the listPaymentss route
describe('/GET listPayments', () => {
    it('it should return list of payments made from the node', (done) => {
      chai.request(server)
          .get('/v1/pay/listPayments')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body.payments;
                expect(res).to.have.status(200);
                if(Object.keys(body).length){
                expect(body[0]).to.contain.property('id');
                expect(body[0]).to.contain.property('payment_hash');
                expect(body[0]).to.contain.property('destination');
                expect(body[0]).to.contain.property('msatoshi');
                expect(body[0]).to.contain.property('amount_msat');
                expect(body[0]).to.contain.property('msatoshi_sent');
                expect(body[0]).to.contain.property('amount_sent_msat');
                expect(body[0]).to.contain.property('created_at');
                expect(body[0]).to.contain.property('bolt11');
                expect(body[0]).to.contain.property('status');
                expect(body[0]).to.contain.property('payment_preimage');
                }
            done();
          });
    });
});

// Test the listInvoices route
describe('/GET listInvoices', () => {
    it('it should return list of invoices available on the node', (done) => {
      chai.request(server)
          .get('/v1/invoice/listInvoices')
          .set('macaroon', macaroon)
          .end((err, res) => {
                const body = res.body.invoices;
                expect(res).to.have.status(200);
                if(Object.keys(body).length){
                expect(body[0]).to.contain.property('label');
                expect(body[0]).to.contain.property('bolt11');
                expect(body[0]).to.contain.property('payment_hash');
                expect(body[0]).to.contain.property('msatoshi');
                expect(body[0]).to.contain.property('amount_msat');
                expect(body[0]).to.contain.property('status');
                expect(body[0]).to.contain.property('pay_index');
                expect(body[0]).to.contain.property('msatoshi_received');
                expect(body[0]).to.contain.property('amount_received_msat');
                expect(body[0]).to.contain.property('paid_at');
                expect(body[0]).to.contain.property('description');
                expect(body[0]).to.contain.property('expires_at');
                }
            done();
          });
    });
});

});
