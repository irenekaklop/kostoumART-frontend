import React, { Component, PropTypes } from 'react';
import ReactTabs from 'react-tabs';
import { Tabs } from 'react-tabs';
import { TabList } from 'react-tabs';
import { Tab } from 'react-tabs';
import { TabPanel } from 'react-tabs';
import InsertCostume from "../InsertCostume/InsertCostume";
import "../../styles/tabs.css";
import "./Insert.css";

class Insert extends Component{
    render(){
        return(
            <div className="tabs-container">
                <Tabs>
                <TabList>
                    <Tab>Κοστούμι</Tab>
                    <Tab>Χρήση</Tab>
                    <Tab>Συνοδευτικό</Tab>
                </TabList>

                <TabPanel>
                <InsertCostume/>
                </TabPanel>
                <TabPanel>
                    <h2>Handlebars</h2>
                    <p>Write dramatically less code with Ember's Handlebars integrated templates that update automatically when the underlying data changes.</p>

                    <h2>Architecture</h2>
                    <p>Don't waste time making trivial choices. Ember.js incorporates common idioms so you can focus on what makes your app special, not reinventing the wheel.</p>
                    <h2>Productivity</h2>
                    <p>Ember.js is built for productivity. Designed with developer ergonomics in mind, its friendly APIs help you get your job done—fast.</p>
                    <p>Source: <a href="http://emberjs.com/" target="_blank">Ember</a></p>
                </TabPanel>
                <TabPanel>
                    <h2>Why AngularJS?</h2>
                    <p>HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic views in web-applications. AngularJS lets you extend HTML vocabulary for your application. The resulting environment is extraordinarily expressive, readable, and quick to develop.</p>
                    <h2>Alternatives</h2>
                    <p>Other frameworks deal with HTML’s shortcomings by either abstracting away HTML, CSS, and/or JavaScript or by providing an imperative way for manipulating the DOM. Neither of these address the root problem that HTML was not designed for dynamic views.</p>
                    <h2>Extensibility</h2>
                    <p>AngularJS is a toolset for building the framework most suited to your application development. It is fully extensible and works well with other libraries. Every feature can be modified or replaced to suit your unique development workflow and feature needs. Read on to find out how.</p>
                    <p>Source: <a href="https://angularjs.org/" target="_blank">Angular</a></p>
                </TabPanel>
                </Tabs>
      </div>
        );
    }
}

export default Insert;