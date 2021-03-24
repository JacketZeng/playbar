import React from 'react';
import style from './style.less';
import time from './util/time';
import Slider from './slider'

class Playbar extends React.Component {


    componentDidMount() {
        this.loadAudio();
    }

    componentWillUnmount() {
        if (this.wavesurfer) {
            this.wavesurfer.destroy();
        };
    }

    constructor(props) {
        super(props);
        this.options = props.options;
        this.loadAudio = this.loadAudio.bind(this);
        this.playPause = this.playPause.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.setPlaybackRate = this.setPlaybackRate.bind(this);
        this.download = this.download.bind(this);
        this.playPrv = this.playPrv.bind(this);
        this.playNxt = this.playNxt.bind(this);
        this.wavesurfer;
        this.state = {
            rate: 1,
            current: '00:00',
            duration: '00:00',
            volume: 80,
            isLock: true,
            isShowVoice: false,
            isPlaying: false,
            visible: false
        };
    }
    loadAudio() {
        if (this.wavesurfer) this.wavesurfer.destroy();
        const wrapEle = document.getElementById('wrapEle');
        const voiceEle = document.getElementById('voiceEle');
        const options = {
            container: '#waveform',
            waveColor: '#dedfe4',
            backgroundColor: '#2d323e',
            progressColor: '#20bbff',
            cursorColor: '#20bbff',
            audioRate: this.rateVal,
            barHeight: 0.9,
            barMinHeight: 1,
            height: 26,
            barGap: 2,
            barWidth: 2,
            hideScrollbar: true,
            // plugins: [Cursor.create({
            //     color: '#20bbff',
            //     width: '1px',
            //     showTime: true,
            //     opacity: 1,
            //     customShowTimeStyle: {
            //         color: '#ffffff',
            //         fontSize: '12px',
            //         margin: '0 12px'
            //     }
            // })]
        };

        // Init wavesurfer
        this.wavesurfer = WaveSurfer.create(options);

        this.wavesurfer.on('ready', () => {

            this.setState({
                visible: true
            });
            wrapEle.onmouseout = (e) => {
                if (this.state.isLock) return;
                if (e.clientY < wrapEle.offsetTop) {
                    this.setState({
                        visible: false
                    });
                }
            }
            wrapEle.onmouseover = () => {
                this.setState({
                    visible: true
                });
            }
            document.body.onclick = (e) => {
                if (e.clientX < voiceEle.offsetLeft || e.clientX > voiceEle.offsetLeft + voiceEle.offsetWidth) {
                    this.setState({ isShowVoice: false });
                }
                if (e.clientY < wrapEle.offsetTop - 100) {
                    this.setState({ isShowVoice: false });
                }

            }

            this.isLoading = false;
            this.playPause();
            this.setVolume(this.state.volume);
            const duration = this.wavesurfer.getDuration();
            this.setState({ duration: duration });
        });
        this.wavesurfer.on("finish", () => {
            this.wavesurfer.stop();
            this.isPlaying = this.wavesurfer.isPlaying();
        });

        this.wavesurfer.on("audioprocess", () => {
            const current = Math.floor(this.wavesurfer.getCurrentTime());
            this.setState({ current: current });
        });


        this.wavesurfer.on("seek", () => {
            this.currentTime = Math.floor(this.wavesurfer.getCurrentTime());
        });

        this.wavesurfer.on("error", (error) => {
            this.message.error('录音获取失败！');
            console.log(error)
        });
        try {
            this.wavesurfer.load(this.options.url);
        } catch (error) {
            console.warn('录音获取失败！', error)
        }

    };

    playPause() {
        this.wavesurfer.playPause();
        this.setState({
            isPlaying: this.wavesurfer.isPlaying()
        });
    }

    play() {
        if (this.state.isPlaying) return;
        this.playPause();
    }

    pause() {
        if (!this.state.isPlaying) return;
        this.playPause();
    }

    setVolume(value) {
        this.setState({
            volume: value
        }, () => {
            this.wavesurfer.setVolume(this.state.volume / 100);
        });
    }

    setPlaybackRate(rate) {
        this.setState({
            rate: rate
        });

        this.wavesurfer.setPlaybackRate(rate);
    }

    playNxt() {
        const list = this.options.list;
        if (list.length <= 1) return;

        const index = list.findIndex(item => {
            return item.id === this.options.file.id;
        });
        if (index === -1) {
            return;
        }
        this.options.file.id = list[(index + 1) % list.length].id;
        this.options.file.name = list[(index + 1) % list.length].name;
        this.loadAudio();
    }

    playPrv() {
        const list = this.options.list;
        if (list.length <= 1) return;

        const index = list.findIndex(item => {
            return item.id === this.options.file.id;
        });
        if (index === -1) {
            return;
        }
        this.options.file.id = list[((index - 1) + list.length) % list.length].id;
        this.options.file.name = list[((index - 1) + list.length) % list.length].name;
        this.loadAudio();
    }

    download() {
        window.open(this.options.url, '_blank');
    }

    render() {
        const format = 'mm:ss';
        const currentRate = this.state.rate;
        const current = time.format(this.state.current, format);
        const duration = time.format(this.state.duration, format);

        const listRates = [1, 1.5, 2].map((rate) =>
            <span title={rate + '倍速播放'} className={rate === currentRate ? style.actived : ''} onClick={(e) => { this.setPlaybackRate(rate, e) }} key={rate.toString()}>
                {rate}&times;
            </span>
        );
        const fileName = this.options.file.name;

        let slider = '';
        if (this.state.isShowVoice) {
            slider = <Slider value={this.state.volume} setVolume={this.setVolume} />;
        }
        return (
            <div className={style.playbarWrap + ' ' + (this.state.visible ? style.visible : '')} id="wrapEle">
                <div className={style.playbar}>
                    <div className={style.prv} onClick={this.playPrv} title="上一条">
                    </div>
                    <div onClick={this.playPause} title="播放/暂停" className={this.state.isPlaying ? style.stopButton : style.playButton}></div>
                    <div className={style.nxt} onClick={this.playNxt} title="下一条">
                    </div>
                    <div className={style.bar}>
                        <div id="waveform"></div>
                    </div>
                    <div className={style.time}>
                        <span className={style.current}>{current}</span>
                        <span className={style.split}>/</span>
                        <span className={style.duration}>{duration}</span>
                    </div>
                    <div className={style.voice + ' ' + (this.state.volume == 0 ? style.unvoice : '')} id="voiceEle" onClick={(e) => { this.setState({ isShowVoice: !this.state.isShowVoice }) }}>
                        {slider}
                    </div>
                    <div className={style.download} onClick={this.download} title="下载">

                    </div>

                    <div className={style.rate}>
                        {listRates}
                    </div>

                    <div className={style.lockWrap}>
                        <div className={this.state.isLock ? style.lock : style.unlock} onClick={(e) => { this.setState({ isLock: !this.state.isLock }) }}>
                        </div>
                    </div>
                </div>

                <div className={style.filename}>{fileName}</div>
            </div>
        );
    }

}

export default Playbar;
