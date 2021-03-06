import * as React from 'react';

import { blockchains, contractProcessStatus, ethConstants } from '../../../constants/constants';
import Eos from '../../../helpers/eos';
import { getNetworkId, getTxReceipt, web3 as w3 } from '../../../helpers/eth';
import { getCtorUrl, sendStatusDappEvent } from '../../../helpers/statictics';
import Loader from '../../common/loader/Loader';
import UnlockMetamaskPopover from '../../common/unlock-metamask-popover/UnlockMetamaskPopover';
import Button from '../../ui-kit/button/Button';


interface IDeployStep2Props {
  deployId?: any;
  deployTxSent?: any;
  deployTxError?: any;
  deployTxMined?: any;
  metamaskStatus?: any;
  dapp?: any;
  ctor?: any;
  publicAccess?: any;
  status?: any;
  setPublicAccess?: any;
  blockchain?: any;
}

interface IDeployStep2State { }

export default class DeployStep2 extends React.PureComponent<IDeployStep2Props, IDeployStep2State> {
  constructor(props) {
    super(props);

    this.deploy = this.deploy.bind(this);
  }

  public componentWillMount() {
    window.scrollTo(0, 0);
  }

  public deploy() {
    const {
      deployId,
      deployTxSent,
      deployTxError,
      deployTxMined,
      metamaskStatus,
      dapp,
      ctor,
      publicAccess,
    } = this.props;

    const { bin, blockchain, abi, id } = dapp;
    // tslint:disable-next-line:variable-name
    const { price, id: constructor_id } = ctor;

    if (blockchain === blockchains.ethereum && metamaskStatus !== 'okMetamask') {
      return alert('Unlock metamask!');
    }

    switch (blockchain) {
      case blockchains.ethereum:
        w3.eth.sendTransaction(
          {
            data: `0x${bin}`,
            value: w3.toWei(price, 'ether'),
            gas: ethConstants.gas,
            gasPrice: ethConstants.gasPrice,
          },
          (err, txHash) => {
            if (err) {
              let errMsg = '';
              try {
                errMsg = err.message.split('\n')[0];
              } catch (error) {
                errMsg = 'Unknown error';
              }
              deployTxError(deployId, errMsg);
            } else {
              const dataEvent = {
                constructorId: getCtorUrl(constructor_id),
                blockchain,
                price,
                gasLimit: ethConstants.gas,
                gasPrice: ethConstants.gasPrice,
              };

              getNetworkId((netId) => {
                deployTxSent(deployId, netId, txHash, blockchain);

                dataEvent['networkId'] = netId;

                sendStatusDappEvent(id, constructor_id, {
                  status: contractProcessStatus.DEPLOY,
                  ...dataEvent,
                });
              });

              getTxReceipt(txHash, (receipt) => {
                if (!receipt.status || receipt.status === '0x0' || receipt.status === '0') {
                  deployTxError(deployId, 'Something went wrong!');
                } else {
                  deployTxMined(deployId, receipt.contractAddress);

                  sendStatusDappEvent(id, constructor_id, {
                    status: contractProcessStatus.MINED,
                    ...dataEvent,
                  });
                }
              });
            }
          },
        );
        break;

      case blockchains.eos:
        const dataEvent = {
          constructorId: getCtorUrl(constructor_id),
          blockchain,
        };

        // get chainId to set 'networkId'
        Eos.setChainId()
          .then(() => {
            dataEvent['networkId'] = Eos.configEosDapp.chainId;

            // get identity to set addressSender
            return Eos.getIdentity();
          })
          .then((identity) => {
            Eos.deployContract(bin, abi)
              .then(() => {
                deployTxMined(deployId, Eos.getAccountName(identity));

                sendStatusDappEvent(id, constructor_id, {
                  status: contractProcessStatus.MINED,
                  ...dataEvent,
                });
              })
              .catch((error) => {
                console.error(error);
                const msgError = error.message ? error.message : error;

                deployTxError(deployId, msgError);
              });

            deployTxSent(deployId, Eos.configEosDapp.chainId, null, blockchain);

            sendStatusDappEvent(id, constructor_id, {
              status: contractProcessStatus.DEPLOY,
              ...dataEvent,
            });

            if (this.props.ctor.schema.eosProps && this.props.ctor.schema.eosProps.permissions)
              return Eos.setPermissions(this.props.ctor.schema.eosProps.permissions);
          })
          .catch((error) => console.error(error));
        break;

      default:
        break;
    }
  }

  public render() {
    const {
      deployId,
      ctor,
      dapp,
      status,
      setPublicAccess,
      blockchain,
      metamaskStatus,
    } = this.props;

    return (
      <div>
        {/* popover 'Unlock metamask' */}
        {blockchain === blockchains.ethereum &&
          metamaskStatus === 'unlockMetamask' && <UnlockMetamaskPopover />}

        {status === 'construct_request' && (
          <div className="block__wrapper  block__wrapper--top">
            <Loader text="Preparing code, this can take some seconds..." />
          </div>
        )}

        {status === 'construct_success' && (
          <form>
            <div className="block__wrapper  block__wrapper--top">
              <fieldset className="form-block">
                <div className="form-field">
                  <label className="form-field__label">Your smart contract source code</label>
                  <span className="form-block__description">
                    Carefully prepared for you using only the finest ingredients
                  </span>
                  <div className="form-field__input-wrapper">
                    <div
                      id="textarea"
                      className="form-field__input  form-field__input--textarea"
                      style={{
                        height: '500px',
                        overflowY: 'auto',
                        fontSize: '12px',
                        whiteSpace: 'pre',
                        fontFamily: 'monospace',
                      }}>
                      {dapp.source ||
                        'If you don\'t see source code here, perhaps something gone wrong'}
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset className="block__wrapper  block__wrapper--terms">
                <fieldset className="form-block  form-block--terms">
                  <div className="form-field  form-field--terms">
                    <input
                      type="checkbox"
                      className="form-field__input  form-field__input--checkbox form-field__input--terms  visually-hidden"
                      id="restrict-public-access"
                      onChange={(e) => {
                        setPublicAccess(deployId, !e.target.checked);
                      }}
                    />
                    <label
                      className="form-field__label  form-field__label--checkbox  form-field__label--terms"
                      htmlFor="restrict-public-access">
                      <svg
                        className="form-field__icon  form-field__icon-checkbox"
                        width="23"
                        height="23">
                        <use className="form-field__icon-off" xlinkHref="#checkbox" />
                        <use className="form-field__icon-on" xlinkHref="#checkbox-on" />
                      </svg>
                      <span className="form-field__wrapper">
                        <b className="form-field__description  form-field__description--terms">
                          Restrict public access to the contract UI.
                        </b>
                      </span>
                    </label>
                  </div>
                </fieldset>
              </fieldset>
              <Button kind="large" onClick={this.deploy} >
                {ctor.price ? (
                  <span>Deploy now for {ctor.price} ETH</span>
                ) : (
                    <span>Deploy now for free</span>
                  )}
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  }
}
