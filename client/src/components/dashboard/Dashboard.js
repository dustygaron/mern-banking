import React, { Component } from 'react'
import PlaidLinkButton from 'react-plaid-link-button'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAccounts, addAccount } from '../../actions/accountActions'
import Accounts from './Accounts'
import Spinner from './Spinner'
import blob from '../../img/blob-login.svg'


class Dashboard extends Component {
  componentDidMount() {
    this.props.getAccounts()
  }

  // Add account
  handleOnSuccess = (token, metadata) => {
    const plaidData = {
      public_token: token,
      metadata: metadata
    }
    this.props.addAccount(plaidData)
  }

  render() {
    const { user } = this.props.auth
    const { accounts, accountsLoading } = this.props.plaid
    let dashboardContent

    if (accounts === null || accountsLoading) {
      dashboardContent = <Spinner />
    } else if (accounts.length > 0) {
      // User has accounts linked
      dashboardContent = <Accounts user={user} accounts={accounts} />
    } else {
      // User has no accounts linked
      dashboardContent = (
        <div className='row dashboard-wrapper'>
          <img src={blob} alt='blob' className='blob' />
          <div className='col s12 center-align'>

            <div className='dashboard-wrapper'>
              <h4>
                <b>Welcome,</b> {user.name.split(' ')[0]}
              </h4>
              <p className='flow-text grey-text text-darken-1'>
                To get started, link your first bank account below.
              </p>
            </div>

            <div className='dashboard-wrapper'>
              <PlaidLinkButton
                buttonProps={{
                  className: 'btn btn-large waves-effect waves-light hoverable accent-3'
                }}
                plaidLinkProps={{
                  clientName: process.env.REACT_APP_PLAID_CLIENT_ID,
                  key: process.env.REACT_APP_PLAID_PUBLIC_KEY,
                  env: 'sandbox',
                  product: ['transactions'],
                  onSuccess: this.handleOnSuccess
                }}
                onScriptLoad={() => this.setState({ loaded: true })}
              >
                Link Account
              </PlaidLinkButton>
            </div>

          </div>
        </div>
      )
    }
    return <div className='container'>{dashboardContent}</div>
  }
}

Dashboard.propTypes = {
  getAccounts: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  plaid: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  plaid: state.plaid
})

export default connect(mapStateToProps, {
  getAccounts,
  addAccount
})(Dashboard)