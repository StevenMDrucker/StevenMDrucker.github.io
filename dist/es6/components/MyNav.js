import { Navbar, Nav, NavItem, Row, Col } from 'react-bootstrap';
import * as React from 'react';
export class MyNav extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement(Row, null,
                React.createElement(Col, { lg: 1, md: 1, sm: 1 }),
                React.createElement(Col, { lg: 8, md: 8, sm: 8 },
                    React.createElement(Navbar, null,
                        React.createElement(Navbar.Header, null,
                            React.createElement(Navbar.Toggle, null)),
                        React.createElement(Navbar.Collapse, null,
                            React.createElement(Nav, { bsStyle: "pills" },
                                React.createElement(NavItem, { eventKey: 1, href: "/about" }, " Bio "),
                                React.createElement(NavItem, { eventKey: 2, href: "/Featured" }, " Featured "),
                                React.createElement(NavItem, { eventKey: 3, href: "/two" }, " Research "),
                                React.createElement(NavItem, { eventKey: 4, href: "/CV" }, " CV "))))),
                React.createElement(Col, { lg: 1, md: 1, sm: 1 }))));
    }
}
/*
 <LinkContainer to="/about">
                    <NavItem eventKey={1}> Bio </NavItem>
                </LinkContainer>
                <LinkContainer to="/one">
                    <NavItem eventKey={2}> Featured </NavItem>
                </LinkContainer>
                <LinkContainer to="/two">
                    <NavItem eventKey={3}> Research </NavItem>
                </LinkContainer>
                <LinkContainer to="/one">
                    <NavItem eventKey={4}> CV </NavItem>
                </LinkContainer>
                */ 
