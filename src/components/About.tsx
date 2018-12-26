
import * as React from 'react';
import { Image,  Row, Col } from 'react-bootstrap';

const headShot = require("../../images/justheadmed.jpg");

export class About extends React.Component<any, any> {
    render() {
        return(
            <div>
             <Col lg={2} md={2} sm={1}>
             </Col>
             <Col lg={8} md={8} sm={10}>        
             <div className="bio">
               <Row>
                   <Col lg={3} md={4} sm={5}>
                       <Image src={headShot} responsive></Image>
                   </Col>
                   <Col lg={7} md={6} sm={5}>
                       <div>
                                   Dr. Steven M. Drucker is a Principal Researcher in the Visual Interaction in Business and Entertainment (<a href="http://research.microsoft.com/en-us/um/redmond/groups/vibe/vibewebpage/">vibe</a>) group at
                                   <a href="http://research.microsoft.com">Microsoft Research (MSR)</a> focusing on
                                   human computer interaction for dealing with large amounts of information. He is
                                   also an affiliate professor at the University of Washington Computer Science and
                                   Engineering Department. In the past he has been a Principal Scientist in the <a href="http://livelabs.com">LiveLabs</a> Research Group at Microsoft where he
                                   headed the Information Experiences Group working on user interaction and
                                   information visualization for web based projects; a Lead Researcher in the <a href="http://research.microsoft.com/nextmedia">Next Media Research Group</a>
                                   examining how the addition of user interaction transforms conventional media;
                                   and Lead Researcher in the Virtual Worlds Group creating a platform for
                                   multi-user virtual environments.
                       </div>
                       <div>
                                       Before coming to Microsoft, he received his Ph.D. from the Computer Graphics and
                                       Animation Group at the <a href="http://www.media.mit.edu"> MIT Media Lab </a> in
                                       May 1994. His thesis research was on intelligent camera control interfaces for
                                       graphical environments. Dr. Drucker graduated Magna Cum Laude with Honors in
                                       Neurosciences from <a href="http://www.brown.edu"> Brown University </a> where he also worked with the <a href="http://graphics.cs.brown.edu/">Brown Graphics Group</a>
                                       and
                                       went on to complete his masters at the <a href="http://www.csail.mit.edu">Artificial Intelligence Laboratory at MIT</a>
                                       doing research in robot learning.
                       </div>
                       <div>
                                       He has demonstrated his work on stage with
                                       Bill Gates at the Consumer Electronics Show (CES); shipped software on the web
                                       for gathering and acting on information collected on the web; was written up in
                                       the New York Times; filed over 108 patents; and published papers on technologies
                                       as diverse as exploratory search, information visualization, multi-user
                                       environments, online social interaction, hypermedia research, human and robot
                                       perceptual capabilities, robot learning, parallel computer graphics, spectator
                                       oriented gaming, and human interfaces for camera control.
                       </div>
                       <div>
                                       His email address is sdrucker (at) microsoft.com.
                       </div>
                   </Col>
   
                </Row>
           </div>
             </Col>          
             <Col lg={3} md={2} sm={1}>
             </Col>       
   
           </div>
           )
    }
}