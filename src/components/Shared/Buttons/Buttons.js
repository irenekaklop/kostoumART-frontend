import React, {Component} from 'react';
import "./Buttons.css"

import IconButton from '@material-ui/core/IconButton';
import { Button } from '@material-ui/core';

class EditButton extends Component {
    
    onClick(){
        this.setState( ()=> {this.props.onClick()})
    }
    
    render(){
        return(
            <div className="EditButton">
                <button class="Group_34">
                    <div class="Group_5">
                            <svg class="Line_19" viewBox="0 0 13.613 13.613">
                            <path fill="transparent" stroke="rgba(56,56,56,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_19" d="M 13.61266231536865 0 L 0 13.61266231536865">
                            </path>
                            </svg>
                            <svg class="Path_7" viewBox="3948.728 -987.255 6.1 6.1">
                                <path fill="rgba(0,0,0,0)" stroke="rgba(56,56,56,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Path_7" d="M 3951.6640625 -981.6589965820312 C 3950.991943359375 -980.9869995117188 3949.903076171875 -980.9869995117188 3949.23193359375 -981.6589965820312 C 3948.56005859375 -982.3309936523438 3948.56005859375 -983.4190063476562 3949.23193359375 -984.0910034179688 L 3951.89208984375 -986.7509765625 C 3952.56396484375 -987.4229736328125 3953.653076171875 -987.4229736328125 3954.323974609375 -986.7509765625 C 3954.99609375 -986.0800170898438 3954.99609375 -984.9910278320312 3954.323974609375 -984.3189697265625 L 3951.6640625 -981.6589965820312 Z">
                                </path>
                            </svg>
                            <svg class="Path_8" viewBox="3948.038 -990.442 5.24 15.891">
                                <path fill="rgba(0,0,0,0)" stroke="rgba(56,56,56,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Path_8" d="M 3951.576904296875 -974.551025390625 C 3953.510986328125 -976.4840087890625 3954.4599609375 -980.0349731445312 3950.73388671875 -983.7620239257812 C 3946.445068359375 -988.051025390625 3948.55810546875 -989.531982421875 3948.55810546875 -989.531982421875 L 3949.468017578125 -990.4420166015625">
                                </path>
                            </svg>
                    </div>
                    <svg class="Ellipse_4">
                        <ellipse fill="rgba(0,0,0,0)" stroke="rgba(56,56,56,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Ellipse_4" rx="18.892915725708008" ry="18.892915725708008" cx="18.892915725708008" cy="18.892915725708008">
                        </ellipse>
                    </svg>
                </button>
               
            </div>
        );
    }
}

class DeleteButton extends Component {
    render(){
        return(
            <div className="DeleteButton">
                <button class="Group_35" onClick={this.props.onClick}>
                    <div class="Group_7">
                        <svg class="Line_20" viewBox="0 0 18.038 18.038">
                            <path fill="transparent" stroke="rgba(56,56,56,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_20" d="M 0 0 L 18.03840255737305 18.03840255737305">
                            </path>
                        </svg>
                        <svg class="Ellipse_5">
                            <ellipse fill="rgba(0,0,0,0)" stroke="rgba(56,56,56,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Ellipse_5" rx="1.4724581241607666" ry="1.4724581241607666" cx="1.4724581241607666" cy="1.4724581241607666">
                            </ellipse>
                        </svg>
                        <svg class="Line_21" viewBox="0 0 18.038 18.038">
                            <path fill="transparent" stroke="rgba(56,56,56,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_21" d="M 18.03840255737305 0 L 0 18.03840255737305">
                            </path>
                        </svg>
                        <svg class="Ellipse_6">
                            <ellipse fill="rgba(0,0,0,0)" stroke="rgba(56,56,56,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Ellipse_6" rx="1.4724581241607666" ry="1.4724581241607666" cx="1.4724581241607666" cy="1.4724581241607666">
                            </ellipse>
                        </svg>
                    </div>
                    <svg class="Ellipse_7">
                        <ellipse fill="rgba(0,0,0,0)" stroke="rgba(56,56,56,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Ellipse_7" rx="18.892915725708008" ry="18.892915725708008" cx="18.892915725708008" cy="18.892915725708008">
                        </ellipse>
                    </svg>
                    <div id="delete">
                        <span>delete</span>
                    </div>
                </button>
            </div>
        );
    }
}

class FilterButtons extends Component {
    render(){
        return(
            <div>
                <IconButton style={{overflow: 'visible', top: '0', left:'-5px', marginTop: '25px'}}>
                    <img src={require('../../../styles/images/FILTER_MENU_ICON@2x.png')}></img>
                    
                </IconButton>
                <span className="FILTERS">FILTERS</span>
            </div>
                
        );
    }
}

class SaveButton extends Component {
    render(){
        return(
            <div id="Group_83">
				<svg class="Path_21" viewBox="1014.687 -1452.241 104.628 37.787">
					<path fill="rgba(0,0,0,0)" stroke="rgba(255,222,23,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Path_21" d="M 1100.421997070312 -1414.453979492188 C 1110.85595703125 -1414.453979492188 1119.31494140625 -1422.911987304688 1119.31494140625 -1433.347045898438 C 1119.31494140625 -1443.781005859375 1110.85498046875 -1452.35302734375 1100.421997070312 -1452.239990234375 L 1033.579956054688 -1452.239990234375 C 1023.14599609375 -1452.35302734375 1014.68701171875 -1443.781005859375 1014.68701171875 -1433.347045898438 C 1014.68701171875 -1422.911987304688 1023.14501953125 -1414.453979492188 1033.578979492188 -1414.453979492188 L 1100.421997070312 -1414.453979492188 Z">
					</path>
				</svg>
				<div id="SAVE">
					<span>SAVE</span>
				</div>
			</div>
        )
    }
}

class CancelButton extends Component {
    render(){
        return(
            <div id="Group_84">
				<svg class="Path_22" viewBox="880.072 -1452.241 104.628 37.787">
					<path fill="rgba(0,0,0,0)" stroke="rgba(119,119,119,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Path_22" d="M 965.8070068359375 -1414.453979492188 C 976.2420043945312 -1414.453979492188 984.7000122070312 -1422.911987304688 984.7000122070312 -1433.347045898438 C 984.7000122070312 -1443.781005859375 976.2410278320312 -1452.35302734375 965.8070068359375 -1452.239990234375 L 898.9650268554688 -1452.239990234375 C 888.531005859375 -1452.35302734375 880.072021484375 -1443.781005859375 880.072021484375 -1433.347045898438 C 880.072021484375 -1422.911987304688 888.531005859375 -1414.453979492188 898.9650268554688 -1414.453979492188 L 965.8070068359375 -1414.453979492188 Z">
					</path>
				</svg>
				<div id="CANCEL">
					<span>CANCEL</span>
				</div>
			</div>
        )
    }
}

class ApplyButton extends Component {
    render(){
        return(
            <div className="ApplyButton">
                <svg class="Path_28" viewBox="2213.628 737.769 104.628 37.786">
                    <path fill="rgba(0,0,0,0)" stroke="rgba(255,222,23,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Path_28" d="M 2299.363037109375 775.5549926757812 C 2309.797119140625 775.5549926757812 2318.256103515625 767.0969848632812 2318.256103515625 756.6630249023438 C 2318.256103515625 746.22802734375 2309.797119140625 737.656982421875 2299.363037109375 737.77001953125 L 2232.52099609375 737.77001953125 C 2222.0869140625 737.656982421875 2213.6279296875 746.22802734375 2213.6279296875 756.6630249023438 C 2213.6279296875 767.0969848632812 2222.0859375 775.5549926757812 2232.52099609375 775.5549926757812 L 2299.363037109375 775.5549926757812 Z">
                    </path>
                    
                </svg>
                <div id="_________gh">
                    <span>ΕΦΑΡΜΟΓΗ</span>
                </div>
            </div>
            
        )

    }
}

class ResetButton extends Component {
    render(){
        return(
            <div className="ResetButton">
                <svg class="Path_29" viewBox="2406.15 737.769 104.629 37.786">
                    <path fill="rgba(0,0,0,0)" stroke="rgba(199,199,199,1)" stroke-width="0.7817211747169495px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Path_29" d="M 2491.885986328125 775.5549926757812 C 2502.320068359375 775.5549926757812 2510.779052734375 767.0969848632812 2510.779052734375 756.6630249023438 C 2510.779052734375 746.22802734375 2502.319091796875 737.656982421875 2491.885986328125 737.77001953125 L 2425.04296875 737.77001953125 C 2414.610107421875 737.656982421875 2406.14990234375 746.22802734375 2406.14990234375 756.6630249023438 C 2406.14990234375 767.0969848632812 2414.60888671875 775.5549926757812 2425.04296875 775.5549926757812 L 2491.885986328125 775.5549926757812 Z">
                    </path>
                </svg>
                <div id="__________gj">
                    <span>ΕΠΑΝΑΦΟΡΑ</span>
                </div>
            </div>
            
        )

    }
}

export {
    EditButton,
    DeleteButton,
    FilterButtons,
    SaveButton,
    CancelButton,
    ApplyButton,
    ResetButton
}
