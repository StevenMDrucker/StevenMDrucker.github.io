import * as React from 'react';
import  Slider  from 'react-slick';
import {  Grid, Row, Col, PanelGroup, Panel } from 'react-bootstrap';

const SandDanceImg = require("../../researchImages/SandDancePublic.jpg");
const TouchVisImg = require("../../researchImages/touchvis.png");
const AtomImg = require("../../researchImages/atom.png");

export class Feature extends React.Component<any, any> { 
    
    render() {
        var settings = {
            dots: true,
            infinite: true,
            adaptiveHeight: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,            
            centerMode: true 
        };
        var rowStyle = {
            margin: "0 0 0 25",
        }
        var buttonBarStyle = {
            margin: "0 0 10 0",
        }
        return (
              
            <Slider {...settings}>
                <div className = "featureDiv">
                    <h2 className="featureTitle">SandDance</h2>
                    <img className="featureImage" src={SandDanceImg} />
                    <div className="featureText"> 
                    SandDance is a browser based information visualization system prototype created at Microsoft SandDance lets you see both the individual records, and their overall structure. SandDance focusses on natural user interaction techniques. Touch interaction is a first class citizen, allowing the entire experience to be easily operated through a touch screen. The system also understand speech commands for searching, selecting, focusing and filtering the data. A kinect system can be used to sense gestures for moving between views of the data. Collaboration is supported by allowing multiple sets of people to interact with the same dataset. Selections and filters in one system are automatically replicated to other systems viewing the data.
                    </div>
                </div>
                <div className = "featureDiv">
                <h2 className="featureTitle">TouchVis</h2>
                    <img className="featureImage" src={TouchVisImg} />
                     
                    <div className="featureText">
                    As more applications move from the desktop to touch devices like tablets, designers must wrestle with the costs of porting a design with as little revision of the UI as possible from one device to the other, or of optimizing the interaction per device. We consider the tradeoffs between two versions of a UI for working with data on a touch tablet. One interface is based on using the conventional desktop metaphor (WIMP) with a control panel, push buttons, and checkboxes where the mouse click is effectively replaced by a finger tap. The other interface (which we call FLUID) eliminates the control panel and focuses touch actions on the data visualization itself. We describe our design process and evaluation of each interface. We discuss the significantly better task performance and preference for the FLUID interface, in particular how touch design may challenge certain assumptions about the performance benefits of WIMP interfaces that do not hold on touch devices, such as the superiority of gestural vs. control panel based interaction.
                    </div>
                </div>
                <div className = "featureDiv">
                <h2 className="featureTitle">Atom</h2>
                    <img className="featureImage" src={AtomImg} />
                     
                    <div className="featureText">
                    A Grammar for Unit Visualizations: 
                    Unit visualizations are a family of visualizations where every data item is represented by a unique visual mark-a visual unit-during visual encoding. For certain datasets and tasks, unit visualizations can provide more information, better match the user's mental model, and enable novel interactions compared to traditional aggregated visualizations. Current visualization grammars cannot fully describe the unit visualization family. In this paper, we characterize the design space of unit visualizations to derive a grammar that can express them. The resulting grammar is called Atom, and is based on passing data through a series of layout operations that divide the output of previous operations recursively until the size and position of every data point can be determined. We evaluate the expressive power of the grammar by both using it to describe existing unit visualizations, as well as to suggest new unit visualizations.
                    </div>
                </div>
            </Slider>            
     
        );
    }
}
