import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import * as api from '../../api/apiRequests';
import CtorCard from '../common/ctor-card/CtorCard';
import Auth from '../auth/Auth';

class MyDapps extends Component {
  componentWillMount() {
    api.getConstructors();
  }

  render() {
    const { ctors, metamaskStatus } = this.props;

    const isAuthenticated = Auth.isAuthenticated();
    const userId = isAuthenticated && Auth.userProfile ? Auth.userProfile['sub'] : '-1';

    return (
      <main className="page-main  page-main--store">
        <div className="page-main__inner">
          {metamaskStatus &&
            <Alert standardAlert={metamaskStatus} />
          }

          <section className="contracts-gallery">
            <div className="contracts-gallery__gallery  gallery">
              {ctors &&
                <ul className="contracts-gallery__list  gallery__list">
                  {ctors.filter(el => isAuthenticated && el.user_id === userId).map((el, i) => (
                    <CtorCard key={i} ctor={el} />
                  ))}
                </ul>
              }

              {!ctors &&
                <Spinner text="Loading contracts" width="100" />
              }
            </div>
          </section>

          <Alert header="If you are developer"
            style={{ marginTop: '80px', background: '#88db88' }}
          >
            <p>You can <Link to="/ctor-add">add a smart contract</Link> to our platform.</p>
          </Alert>
        </div>
      </main>
    );
  }
}

export default MyDapps;
