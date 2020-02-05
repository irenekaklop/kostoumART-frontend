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

class FilterButtons extends Component {
    render(){
        return(
                <button class="FilterButton">
                    <svg class="Ellipse_1">
                        <ellipse fill="rgba(255,222,23,1)" id="Ellipse_1" rx="29.06102180480957" ry="29.06102180480957" cx="29.06102180480957" cy="29.06102180480957">
                        </ellipse>
                    </svg>
                    <svg class="Ellipse_2">
                        <ellipse fill="rgba(0,0,0,0)" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Ellipse_2" rx="2.6867401599884033" ry="2.6867401599884033" cx="2.6867401599884033" cy="2.6867401599884033">
                        </ellipse>
                    </svg>
                    <svg class="Line_1" viewBox="0 0 8.377 0">
                        <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_1" d="M 8.377081871032715 0 L 0 1.079570211004466e-09">
                        </path>
                    </svg>
                    <svg class="Ellipse_3">
                        <ellipse fill="rgba(0,0,0,0)" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Ellipse_3" rx="2.6867401599884033" ry="2.6867401599884033" cx="2.6867401599884033" cy="2.6867401599884033">
                        </ellipse>
                    </svg>
                    <svg class="Line_2" viewBox="0 0 8.377 0">
                        <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_2" d="M 8.377081871032715 0 L 0 1.079570211004466e-09">
                        </path>
                    </svg>
                    <svg class="Path_3" viewBox="2136.044 -1141.338 10.654 5.373">
                        <path fill="rgba(0,0,0,0)" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Path_3" d="M 2144.010986328125 -1135.964965820312 C 2145.4951171875 -1135.964965820312 2146.697998046875 -1137.16796875 2146.697998046875 -1138.651000976562 C 2146.697998046875 -1140.135009765625 2145.4951171875 -1141.338012695312 2144.010986328125 -1141.338012695312 L 2138.73095703125 -1141.338012695312 C 2137.2470703125 -1141.338012695312 2136.0439453125 -1140.135009765625 2136.0439453125 -1138.651000976562 C 2136.0439453125 -1137.16796875 2137.2470703125 -1135.964965820312 2138.73095703125 -1135.964965820312 L 2144.010986328125 -1135.964965820312 Z">
                        </path>
                    </svg>
                    <svg class="Line_3" viewBox="0 0 18.854 0">
                        <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_3" d="M 18.85396003723145 0 L 0 1.080479705706239e-09">
                        </path>
                    </svg>
                    <svg class="Path_4" viewBox="2117.19 -1157.051 10.654 5.374">
                        <path fill="rgba(0,0,0,0)" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Path_4" d="M 2119.876953125 -1151.677001953125 C 2118.39306640625 -1151.677001953125 2117.18994140625 -1152.880004882812 2117.18994140625 -1154.364013671875 C 2117.18994140625 -1155.848022460938 2118.39306640625 -1157.051025390625 2119.876953125 -1157.051025390625 L 2125.156982421875 -1157.051025390625 C 2126.64111328125 -1157.051025390625 2127.843994140625 -1155.848022460938 2127.843994140625 -1154.364013671875 C 2127.843994140625 -1152.880004882812 2126.64111328125 -1151.677001953125 2125.156982421875 -1151.677001953125 L 2119.876953125 -1151.677001953125 Z">
                        </path>
                    </svg>
                    <svg class="Line_4" viewBox="0 0 18.854 0">
                        <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_4" d="M 0 0 L 18.85396003723145 2.401066012680531e-10">
                        </path>
                    </svg>
                    <div id="FILTERS">
                        <span>FILTERS</span>
                    </div>
                </button>
        );
    }
}

export {
    EditButton,
    DeleteButton,
    FilterButtons
}
