import React from "react";
import './DataManage.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {EmployeeEditNav} from "./EmployeeEditNav";
import {CustomerEditNav} from "./CustomerEditNav";
import {Col, Container, Row, Tab, Tabs} from "react-bootstrap";

export function DataManage() {
    return (
        <Container fluid>
            <Tabs defaultActiveKey="Employees">
                <Tab eventKey="Employees" title="Employees">
                    <Col>
                        <Row>
                            <EmployeeEditNav/>
                        </Row>
                        <Row className="h-100 overflow-auto">
                        </Row>
                    </Col>
                </Tab>

                <Tab eventKey="Customer" title="Customer">
                    <Col>
                        <Row>
                            <CustomerEditNav/>
                        </Row>
                        <Row className="h-100 overflow-auto">
                        </Row>
                    </Col>
                </Tab>
            </Tabs>
        </Container>
    );
}

export default DataManage;