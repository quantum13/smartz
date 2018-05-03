import axios from 'axios';

import BaseWidget from "./BaseWidget";
import { web3 } from "../../../helpers/eth";
import { moneyAbbr2Symbol } from '../../../helpers/localization';


export default class EthCount extends BaseWidget {
  constructor(props) {
    super(props);

    this.state = {
      fnDescription: props.fnDescription,
      contractInstance: props.contractInstance,
      currency: null,
    }
  }

  componentDidMount() {
    const showCurrency = this.getOption('show_currency');

    if (showCurrency === undefined) {
      return null;
    }

    const url = `https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=${showCurrency}`;

    axios.get(url)
      .then(response => {
        const { data, status } = response;

        if (status === 200 && Array.isArray(data) && data.length > 0) {
          const priceString = data[0][`price_${showCurrency.toLowerCase()}`];
          const priceFloat = parseFloat(priceString).toFixed(2);

          this.setState({
            currency: `${moneyAbbr2Symbol(showCurrency)} ${priceFloat}`
          });
        }
      })
      .catch(error => {
        console.warn(error);
      });
  }

  render() {
    const { currency } = this.state;
    let res = web3.toBigNumber(this.getResult(0));
    res = res.div(web3.toWei(1, 'ether'));

    return currency === null ? res.valueOf() : `${res.valueOf()} (${currency})`;
  }
};
