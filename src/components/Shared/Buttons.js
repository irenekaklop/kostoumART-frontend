import React, {Component} from 'react';
import "../Shared/Buttons.css"

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
                    <div id="edit">
                        <span>edit</span>
                    </div>
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

export {
    EditButton,
    DeleteButton
}
