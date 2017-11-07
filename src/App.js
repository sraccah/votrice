import React, { Component } from 'react'
import VotriceContract from '../build/contracts/Votrice.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

// The App
class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            web3: null,
            voted: "false",
            added: "false"
        }
        this.counter = 0
        this.projects = []
        this.getCounter = this.getCounter.bind(this)
        this.getWinners = this.getWinners.bind(this)
        this.addProject = this.addProject.bind(this)
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.
        getWeb3.then(results => {
            this.setState({
                web3: results.web3,
                nbr: this.counter
            })
            // Instantiate contract once web3 provided.
            this.instantiateContract()
        }).catch(() => {
            console.log('Error finding web3.')
        })
    }

    instantiateContract() {
        /*
        * SMART CONTRACT EXAMPLE
        *
        * Normally these functions would be called in the context of a
        * state management library, but for convenience I've placed them here.
        */
        const contract = require('truffle-contract')
        const votriceContract = contract(VotriceContract)
        votriceContract.setProvider(this.state.web3.currentProvider)
        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            votriceContract.deployed().then((instance) => {
                this.setState({
                    contract: instance.address
                })
            }).then((result) => {
                // Update state with the result.
                return this.setState({
                    user: accounts
                })
            }).catch((e) => {
                console.log("ERROR : " + e)
            })
        })
    }

    // Testing counter
    getCounter() {
        var tmp = this.counter += 1
        return this.setState({
            nbr: tmp
        })
    }

    // Add a project to the smart contract
    addProject() {
        var name = this.userEntry.value
        this.projects.push(name)
        this.setState({
            project: name,
            added: "true"
        })
        const contract = require('truffle-contract')
        const votriceContract = contract(VotriceContract)
        votriceContract.setProvider(this.state.web3.currentProvider)
        // Votrice instance to talk with the smart contract
        var VotriceInstance
        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            votriceContract.deployed().then((instance) => {
                VotriceInstance = instance
                // Get the value from the contract to prove it worked.
                return VotriceInstance.addChoice(name, { from: accounts[0] })
            }).catch((e) => {
                console.log("ERROR : " + e)
            })
        })
    }

    // getWinners handling in the contract
    getWinners() {
        const contract = require('truffle-contract')
        const votriceContract = contract(VotriceContract)
        votriceContract.setProvider(this.state.web3.currentProvider)
        // Votrice instance to talk with the smart contract
        var VotriceInstance
        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            votriceContract.deployed().then((instance) => {
                VotriceInstance = instance
                // Get the value from the contract to prove it worked.
                return VotriceInstance.getWinners.call(accounts[0])
            }).then((result) => {
                console.log(result)
                if (result.length !== 0) {
                    // Update state with the result.
                    return this.setState({ winners: result })
                } else {
                    return this.setState({ winners: "No winners yet !" })
                }
            }).catch((e) => {
                console.log("ERROR : " + e)
            })
        })
    }

    // The rendering in real time
    render() {
        return (
            <div className="App">
                <main className="container">
                    <div className="well col-sm-12">
                        <p>The number is: {this.state.nbr}</p>
                        <div>
                            <button onClick={this.getCounter} className="btn btn-danger">Inc count</button>
                        </div>
                    </div>
                    <div className="well col-sm-12">
                        <p>The project is: {this.state.project}</p>
                        <div className="form-group form-inline my-2 my-lg-0">
                            <input type="text" ref={ref => this.userEntry = ref} className="form-control mr-sm-2 projectNameToAdd" placeholder="name"></input>
                            <button onClick={this.addProject} className="btn btn-success">Add project</button>
                        </div>
                    </div>
                    <div className="well col-sm-12">
                        <div className="pure-u-1-1">
                            <p>Contract: {this.state.contract}</p>
                            <p>You are: {this.state.user} - voted: {this.state.voted} - added: {this.state.added}</p>
                        </div>
                        <div className="pure-u-1-1">
                            <p>Winners: <span className="winnerName">{this.state.winners}</span></p>
                            <div>
                                <button onClick={this.getWinners} className="btn btn-warning">Get</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default App
