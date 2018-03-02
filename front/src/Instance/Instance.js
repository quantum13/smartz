import React, {Component} from 'react';
import {find} from 'lodash';

import api from 'Api/Api';
import {processControlForm,
        processResult,
        getNetworkName,
        getNetworkEtherscanAddress,
        checkMetaMask} from 'Eth/Eth';
import FunctionCard from './FunctionCard';
import Alert from 'Common/Alert';

import './Instance.css';

class Instance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth.isAuthenticated(),
      instanceId: this.props.match.params.id
    };
  }

  componentWillMount() {
    api(this.props.auth).post('/get_instance_details', {'instance_id': this.state.instanceId})

      // Got instance details
      .then(response => {
        this.setState({instance: response.data});
        return response.data;
      })

      .then(instance => {
        const nextInstance = Object.assign({}, instance);
        api(this.props.auth).post('/list_ctors')
          .then(response => {
            nextInstance.ctor = find(response.data, {ctor_id: instance.ctor_id});
            this.setState({instance: nextInstance});
            this.getConstants();
          })
      })

      .catch(error => this.setState({message: error.message}));

    let noMetamask = false;
    setInterval(() => {
      if (noMetamask !== checkMetaMask()) {
        noMetamask = checkMetaMask();
        this.setState({noMetamask});
      }
    }, 100);
  }

  getConstants() {
    const instance = Object.assign({}, this.state.instance);
    instance.functions.forEach((func, i) => {
      if (func.constant && func.inputs.minItems === 0) {
        processControlForm(instance.abi, func, [], instance.address,
                          (error, result) => {
          if (!error) {
            instance.functions[i].value = processResult(result);
          } else
            console.error(i, error);

            // console.log(i, func);
        });
      }
    });
    window.setTimeout(() => {this.setState({instance})}, 500);
  }

  render() {
    const {noMetamask, message, instance} = this.state;

    if(noMetamask) return <Alert message={checkMetaMask()} />;

    return (
      <div>
        <div className="container">
          {instance &&
            <div className="instance">
              <h1>
                {instance.instance_title}
                {instance.ctor &&
                  <span>
                    &emsp;(
                    <a href={`/deploy/${instance.ctor.ctor_id}`}>
                      {instance.ctor.ctor_name}
                    </a>)
                  </span>
                }
              </h1>

              {instance.address &&
                <p className="address">
                  {instance.address + ` (${getNetworkName(instance.network_id.toString())})`}
                  &emsp;
                  <a className="etherscan" href={getNetworkEtherscanAddress(instance.network_id.toString()) + `/address/${instance.address}`}>
                    see on Etherscan
                  </a>
                </p>
              }

              <h3>View functions</h3>
              <p>This functions just provide an information about contract states and values.</p>
              <div className="instance-functions view-functions">
                {instance.functions.map((func, i) => {
                  if (func.constant && func.inputs.minItems === 0)
                    return <FunctionCard func={func} key={i} />;
                  else
                    return null;
                })}
              </div>

              <h3>Ask functions</h3>
              <p>This functions also provide an information about contract states and values, but related to some address or other conditions which you should provide. No any changes in blockchain are done by this functions.</p>
              <div className="instance-functions">
                {instance.functions.map((func, i) => {
                  if (func.constant && func.inputs.minItems !== 0)
                    return <FunctionCard instance={instance} func={func} key={i} />;
                  else
                    return null;
                })}
              </div>

              <h3>Write functions</h3>
              <p>This functions are changing states and values of smart contract, placing new information to the blockchain. All this functions consume some amount of gas. Be careful, some of their actions can not be undone.</p>
              <div className="instance-functions">
                {instance.functions.map((func, i) => {
                  if (!func.constant)
                    return <FunctionCard instance={instance} func={func} key={i}
                      refresh={this.getConstants.bind(this)} />;
                  else
                    return null;
                })}
              </div>
            </div>
          }

          {message &&
            <div className="alert alert-danger" role="alert">
              <p>{message}</p>
            </div>
          }

        </div>
      </div>
    );
  }
}

export default Instance;
