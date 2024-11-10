import { RestaurantsEditView } from "./RestaurantsEditView";
import { ConcessionsEditView } from "./ConcessionsEditView";
import { Container, Tabs, Tab } from "react-bootstrap";

export function AttractionsEditView() {

    return (
        <Container>
            <Tabs
                defaultActiveKey="restaurants"
            >
                <Tab eventKey="restaurants" title="Restaurants">
                    <RestaurantsEditView />
                </Tab>
                <Tab eventKey="concessions" title="Concessions">
                    <ConcessionsEditView />
                </Tab>
            </Tabs>
        </Container>
    );

}