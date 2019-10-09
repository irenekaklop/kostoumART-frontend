import React, { Component, PropTypes } from 'react';
import { Tabs } from 'react-tabs';
import { TabList } from 'react-tabs';
import { Tab } from 'react-tabs';
import { TabPanel } from 'react-tabs';
import InsertCostume from "../InsertCostume/InsertCostume";
import "../../styles/tabs.css";
import "./Insert.css";
import InsertUse from '../InsertUse/InsertUse';

class Insert extends Component{
    render(){
        return(
            <div className="tabs-container">
                <Tabs>
                    <TabList>
                        <Tab>Κοστούμι</Tab>
                        <Tab>Χρήση</Tab>
                    </TabList>

                    <TabPanel>
                        <InsertCostume/>
                    </TabPanel>
                    <TabPanel>
                        <InsertUse></InsertUse>
                    </TabPanel>
                </Tabs>
      </div>
        );
    }
}

export default Insert;