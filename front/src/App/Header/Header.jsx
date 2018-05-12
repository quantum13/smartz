import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../auth/Auth';

import './Header.less';

class Header extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  logout() {
    Auth.logout();
  }

  render() {
    const { profile, location } = this.props;
    const isAuthenticated = Auth.isAuthenticated();

    return (
      <header className="page-header flex-v">
        <Link to="/" className="page-header__link" aria-label="Back to main page">
          <svg className="page-header__logo">
            <use href="#logo"></use>
          </svg>
        </Link>
        <nav className="main-navigation">
          <ul className="main-navigation__list">
            <li className={`main-navigation__item ${location.pathname === '/' ? 'active' : ''}`}>
              <Link
                to="/"
                className="main-navigation__link">
                Smart Store
              </Link>
            </li>
            <li className={`main-navigation__item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <Link
                to="/dashboard"
                className="main-navigation__link">
                Dashboard
              </Link>
            </li>
            <li className={`main-navigation__item ${location.pathname === '/docs' ? 'active' : ''}`}>
              <Link
                to="/docs"
                className="main-navigation__link">
                Docs
              </Link>
            </li>
            <li className={`main-navigation__item`}>
              <Link
                to="https://t.me/smartz_en"
                className="main-navigation__link">
                Chat
              </Link>
            </li>
          </ul>
        </nav>
        <div className="user-block">
          <Link
            to="/profile"
            className="user-block__link">
            {isAuthenticated
              ? <span className="user-block__name"
                style={{ display: 'inherit' }}>
                {profile && profile.name}
              </span>
              : <span>
                <svg className="user-block__icon user-block__icon--lock" width="11" height="14">
                  <use href="#lock" />
                </svg>
                <span className="user-block__login">Login</span>
              </span>
            }
          </Link>
        </div>
        {/*
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <div className="logo">
              <Navbar.Brand>
                <Link to="/">
                  <img src={require('./i/smartz-logo.jpg')} alt="Smartz logo" />
                </Link>
                <span className="version">v0.4.1 alpha</span>
              </Navbar.Brand>
            </div>

            <div className="nav-buttons">
              {!isAuthenticated && (
                <Button
                  bsStyle="primary"
                  className="btn-margin"
                  onClick={Auth.login}
                >
                  Log In
                </Button>
              )}

              {isAuthenticated && (
                <span>
                  <Link to={'/dashboard'} className="btn btn-primary btn-margin">
                    My contracts
                  </Link>
                  <Link to={'/profile'} className="btn btn-primary btn-margin">
                    Profile
                  </Link>
                  <Button className="btn btn-primary btn-margin" onClick={Auth.logout}>
                    Log Out
                  </Button>
                </span>
              )}
            </div>
          </Navbar.Header>
        </Navbar>
      </div>
      */}
      </header>
    );
  }
}

export default Header;
