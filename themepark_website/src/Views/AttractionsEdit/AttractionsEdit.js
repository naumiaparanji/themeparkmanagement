import { RestaurantsEditView } from "./RestaurantsEditView";
import { ConcessionsEditView } from "./ConcessionsEditView";
import { GiftshopsEditView } from "./GiftshopsEditView";
import { Container, Tabs, Tab } from "react-bootstrap";

export function AttractionsEditView() {

    return (
        <Container>
            <Tabs
                defaultActiveKey="concessions"
            >
                <Tab eventKey="concessions" title="Concessions">
                    <ConcessionsEditView />
                </Tab>
                <Tab eventKey="restaurants" title="Restaurants">
                    <RestaurantsEditView />
                </Tab>
                <Tab eventKey="giftshops" title="Gift Shops">
                    <GiftshopsEditView />
                </Tab>
            </Tabs>
        </Container>
    );

}