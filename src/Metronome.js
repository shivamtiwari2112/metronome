import React, { Component } from 'react';
import './Metronome.css';
import click1 from './click1.wav';
import click2 from './click2.wav';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Navigation from './components/Navigation/Navigation';

const initialState = {
    playing: false,
    count: 0,
    bpm: 100,
    beatsPerMeasure: 4,
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        joined: ''
    }
}

class Metronome extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.click1 = new Audio(click1);
        this.click2 = new Audio(click2);
    } // end of contructor

    handleBpmChange = event => {
        const bpm = event.target.value;

        if (this.state.playing) {
            // Stop the old timer and start a new one
            clearInterval(this.timer);
            this.timer = setInterval(this.playClick, (60 / bpm) * 1000);

            // Set the new BPM, and reset the beat counter
            this.setState({
                count: 0,
                bpm
            });
        } else {
            // Otherwise just update the BPM
            this.setState({ bpm });
        }
    };

    startStop = () => {
        if (this.state.playing) {
            // Stop the timer
            clearInterval(this.timer);
            this.setState({
                playing: false
            });
        } else {
            // Start a timer with the current BPM
            this.timer = setInterval(
                this.playClick,
                (60 / this.state.bpm) * 1000
            );
            this.setState(
                {
                    count: 0,
                    playing: true
                    // Play a click "immediately" (after setState finishes)
                },
                this.playClick
            );
        }
    };

    playClick = () => {
        const { count, beatsPerMeasure } = this.state;

        // The first beat will have a different sound than the others
        if (count % beatsPerMeasure === 0) {
            this.click2.play();
        } else {
            this.click1.play();
        }

        // Keep track of which beat we're on
        this.setState(state => ({
            count: (state.count + 1) % state.beatsPerMeasure
        }));
    };
    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                joined: data.joined
            }
        })
    }
    handleRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState)
        } else if (route === 'home') {
            this.setState({ isSignedIn: true })
        }
        this.setState({ route: route });
    }

    render() {
        const { playing, bpm, route } = this.state;
        return (
            <React.Fragment>
            <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.handleRouteChange} />
                {
                    route === 'home'
                        ?
                        <div className="metronome">
                            <div className="bpm-slider">
                                <div>{bpm} BPM</div>
                                <input type="range" min="60" max="240" value={bpm} onChange={this.handleBpmChange} />
                            </div>
                            <button onClick={this.startStop}>{playing ? 'Stop' : 'Start'}</button>
                        </div>
                        : (
                            route === 'signin'
                                ? <Signin loadUser={this.loadUser} onRouteChange={this.handleRouteChange} />
                                : <Register loadUser={this.loadUser} onRouteChange={this.handleRouteChange} />
                        )
                }
            </React.Fragment>
        );
    }
}

export default Metronome;

