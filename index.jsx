import React from 'react';
import ReactDOM from 'react-dom';
import Playbar from './playbar';

export class Core {
    constructor(options) {
        const container = document.getElementById(options.el);
        ReactDOM.unmountComponentAtNode(container)
        this.myRef = React.createRef();
        ReactDOM.render(<Playbar options={options} ref={this.myRef} />, container);
    }

    play() {
        this.myRef.current.play();
    }

    pause() {
        this.myRef.current.pause();
    }

}
