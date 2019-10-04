import React, {Component} from 'react';
import './BoundedInput.css';

class BoundedInput extends Component{
 
    constructor(props) {
      super(props);
  
      // Set initial state
      this.state = {
        count: null,
        progress: 38,
        status: 'safe',
        value: this.props.value ? this.props.value : '',
        valid: false
      }
  
      // Set variables
      this.min = this.props.min ? parseInt(this.props.min, 10) : 0;
      this.max = this.props.max ? parseInt(this.props.max, 10) : 'infinite';
      this.recommendedMin = this.props.recommendedMin ? parseInt(this.props.recommendedMin, 10) : 0;
      this.recommendedMax = this.props.recommendedMax ? parseInt(this.props.recommendedMax, 10) : 'infinite';
  
      // Set limit type
      if (this.checkForPixels([this.props.min, this.props.max, this.props.recommendedMin, this.props.recommendedMax]))
        this.type = 'pixel';
  
    }
  
    componentDidMount() {
      this.updateState();
    }
  
    handleTyping = (e) => {
      this.setState({value: e.target.value},() => {
        this.updateState();
      });
    }
  
    checkForPixels(limits) {
      var isPixelType = false;
      limits.forEach(function(e){
        if (e !== undefined && e.includes('px'))
          isPixelType = true;
      });
      console.log(isPixelType);
      return isPixelType;
    }
  
    // Save current input value and set displayed count text
    updateState() {
      const val = this.state.value;
      if (this.type !== 'pixel') {
        this.current = val.length;
        this.setState({count: this.current > 0 ? Math.round(this.current) : null});
        this.results();
      } else {
        this.setState({value: val},() => {
          this.current = this.clone.offsetWidth;
          this.setState({count: this.current > 0 ? Math.round(this.current) + 'px' : null});
          this.results();
        });
      }
    }
  
    results() {
      // Set current percentage of overall limit
      if (this.props.max === undefined && this.props.recommendedMax === undefined) {
        var percentage = this.props.recommendedMin !== undefined ? this.current / this.recommendedMin : this.current / this.min;
      } else {
        percentage = this.max !== 'infinite' ? this.current / this.max : this.current / this.recommendedMax;
      }
  
      // Update progress circle graphic
      this.setState({progress: Math.max(0, 38 - (38 * percentage))});
  
      // Empty
      if (percentage === 0) {
        this.setState({status: 'empty'});
        if (this.props.required) {
          this.setState({valid: false});
        } else {
          this.setState({valid: true});
        }
  
      // Error
      } else if (this.current < this.min || this.current > this.max) {
        this.setState({
          status: 'error',
          valid: false
        });
  
      // Warn
      } else if (this.current < this.recommendedMin || this.current > this.recommendedMax) {
        this.setState({
          status: 'warn',
          valid: false
        });
  
      // Safe
      } else {
        this.setState({
          status: 'safe',
          valid: true
        });
      }
    }

    result_status(){
      return this.state.status;
    }

    render() {
  
      const { count, progress, status, value } = this.state;
  
      const { type, rows, fontFamily, fontSize, fontWeight } = this.props;
  
      const cloneStyles = {
        position: 'absolute',
        whiteSpace: 'nowrap',
        fontFamily: fontFamily !== undefined ? fontFamily : 'arial, sans-serif',
        fontSize: fontSize !== undefined ? parseInt(fontSize) : 16,
        fontWeight: fontWeight !== undefined ? fontWeight : 400,
        visibility: 'hidden'
      }
  
      return (
        <div className={"bounded-input bounded-input--" + status}>
          {type === 'textarea' ? (
            <textarea rows={rows} onChange={this.handleTyping} value={value} />
          ) : (
            <input type={type} onChange={this.handleTyping} value={value} />
          )}
          <div className="bounded-input__limit-indicator">
                <span className="bounded-input__character-count">{count}</span>
                <svg className="bounded-input__radial-counter" height="10" width="10">
                    <circle className="bounded-input__progress-underlay" cx="50%" cy="50%" r="6" fill="none" strokeWidth="2"></circle>
                    <circle className="bounded-input__progress" cx="50%" cy="50%" r="6" fill="none" strokeWidth="2" style={{strokeDashoffset: progress, strokeDasharray: 38}}></circle>
                </svg>
            </div>
          {this.type === 'pixel' ? (
            <span ref={(el) => this.clone = el} style={cloneStyles}>{value}</span>
            ) : ''
          }
        </div>
      );
    }
    
  }

export default BoundedInput;