import React from 'react';
import style from './slider.less';

class Slider extends React.Component {

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    constructor(props) {
        super(props);
        this.setVolume = props.setVolume;
        this.state = {
            value : props.value
        };
    }

    changeValue(value){
        this.setState({
            value : value
        },()=>{
            this.setVolume(value);
        })
    }



    render() {
        return (
            <div className={style.box}>
                <input type="range" min="0" max="100" step="1" onChange={(e)=>{this.changeValue(e.target.value)}} value={this.state.value} />
            </div>
        );
    }

}

export default Slider;
