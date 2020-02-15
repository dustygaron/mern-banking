import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import logo from '../../img/logo.svg'
import { logoutUser } from '../../actions/authActions'


class Navbar extends Component {

  onLogoutClick = e => {
    e.preventDefault()
    this.props.logoutUser()
  }

  render() {
    return (
      <nav>
        <div className='nav-wrapper container'>
          <Link to='/'>
            <img src={logo} alt='mern banking logo' className='piggy' />
          </Link>
          <ul id='nav-mobile' className='right hide-on-med-and-down'>
            <li>
              <button onClick={this.onLogoutClick} className='btn-logout btn btn-large btn-flat waves-effect white black-text'>
                Logout
              </button>
            </li>
            <li>
              <Link to='/login' >
                Login
              </Link>
            </li>

          </ul>
        </div>
      </nav>
    )
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(Navbar)
