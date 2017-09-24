import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import * as ACTIONS from 'actions'
import t from 'translations'
import DealModal from '../deal-modal/DealModal'
import Signup from 'components/auth/signup/Signup'
import Login from 'components/auth/login/Login'
import { overwriteLocalStorage } from 'scripts/storage'
import './header.scss'

class Header extends Component {
  constructor() {
    super()
    this.state = {
      openLogin: false,
      openSignup: false,
      loggedUser: false,
      user: {}
    }

    this.openLogin = this.openLogin.bind(this)
    this.openSignup = this.openSignup.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.user) {
      this.closeLogin()

      this.setState({
        loggedUser: true,
        user: nextProps.user
      })
    }
  }

  componentWillMount() {
    const userID = window.localStorage.getItem('uid')

    if (userID) {
      this.props.actions.getUserByID(userID)
      this.setState({
        loggedUser: true
      })
    }
  }

  componentDidMount() {
    overwriteLocalStorage(() => {
      console.log('set storage')
    }, () => {
      console.log('clear storage')
      this.setState({
        loggedUser: false
      })
    })
  }

  logout() {
    const {
      actions
    } = this.props

    window.localStorage.clear()
    actions.logout()
  }

  openLogin() {
    this.setState({
      openLogin: true
    })
  }

  closeLogin() {
    this.setState({
      openLogin: false
    })
  }

  openSignup() {
    this.setState({
      openSignup: true
    })
  }

  closeSignup() {
    this.setState({
      openSignup: false
    })
  }

  closeSignupOpenLogin() {
    this.setState({
      openSignup: false,
      openLogin: true
    })
  }

  closeLoginOpenSignup() {
    this.setState({
      openSignup: true,
      openLogin: false
    })
  }

  render() {
    let {
      openLogin,
      openSignup,
      loggedUser,
      user
    } = this.state

    let {
      favourites
    } = this.props
    let favClass = ''

    user = _.isEmpty(user) ? this.props.user : user

    if (!favourites && user.favourites) {
      favourites = user.favourites
      favClass = favourites.length > 9 ? ' large-number' : ''
    }

    return (
      <div className="header__wrapper">
        <Link className='header__logo' to='/'><img src='/images/deal-logo.png' /></Link>
        <div className='header__auth'>
          {
            loggedUser && user ? (
              <div>
                <p className='header__auth__message'>
                  Здравей,
                  <span className='names'> {user.firstName} {user.lastName} </span>
                </p>

                <Link className='header__fav' to={`/favourites/${user.favID}`}>
                  <img className='header__fav-icon' src='/images/favorite-heart.svg' />
                  <span className={`header__fav-counter${favClass}`}>{favourites.length}</span>
                </Link>
                <button onClick={this.logout}>Изход</button>
              </div>
            ) : (
              <div className="header__login-section">
                <a className="header__login-section__login" onClick={this.openLogin} href="javascript:void(0);">
                  {t('login')}
                </a>
                <DealModal
                  header={t('login.title')}
                  open={openLogin}
                  size='medium'
                  onClose={() => this.closeLogin()}
                >
                  <Login openSignup={() => this.closeLoginOpenSignup()} />
                </DealModal>

                <a className="header_wrapper__login-section__signup" onClick={this.openSignup} href="javascript:void(0);">
                  {t('sign.up')}
                </a>
                <DealModal
                  header={t('sign.up.title')}
                  open={openSignup}
                  size='medium'
                  onClose={() => this.closeSignup()}
                >
                  <Signup openLogin={() => this.closeSignupOpenLogin()} />
                </DealModal>
              </div>
            )

          }
        </div>

      </div>
    )
  }
}

Header.defaultProps = {
  user: {
    favourites: []
  }
}

const mapStateToProps = (state) => {

  return {
    user: state.user.user,
    favourites: state.favourites.favourites
  }
}

const mapDispatchToProps = (dispatch) => {
  const actions = ACTIONS
  const actionMap = {
    actions: bindActionCreators(actions, dispatch)
  }

  return actionMap
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
