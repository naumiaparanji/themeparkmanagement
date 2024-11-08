import { useEffect, useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import { api } from "../App";

export function RestaurantsEditView({ restaurants }) {
    return (
        <>
        {
            restaurants.map((restaurant) => (
                <div>
                    {`Restaurant ${restaurant.RestaurantID}: 
                    Capacity ${restaurant.SeatingCapacity} 
                    Opens ${restaurant.OpensAt} 
                    OpenFor ${restaurant.OpenDuration} 
                    Located@ ${restaurant.Location}`}
                </div>
            ))
        }
        </>
    )
}

export function ConcessionsEditView({ concessions }) {
    return (
        <>
        {
            concessions.map((concession) => (
                <div>
                    {`Concession ${concession.ConcessionID}: 
                    Opens ${concession.OpensAt} 
                    OpenFor ${concession.OpenDuration} 
                    Located@ ${concession.Location}`}
                </div>
            ))
        }
        </>
    )
}

export function AttractionsEditView() {
    const [restaurants, setRestaurants] = useState([]);
    const [concessions, setConcessions] = useState([]);

    const refreshRestaurants = () => {
        api.get("/restaurants")
        .then((response) => {
            setRestaurants(response.data.restaurants);
        })
        .catch((e) => console.log(e));
    }

    const refreshConcessions = () => {
        api.get("/concessions")
        .then((response) => {
            setConcessions(response.data.concessions);
        })
        .catch((e) => console.log(e));
    }

    useEffect(() => {
        refreshRestaurants();
        refreshConcessions();
    }, []);

    return (
        <Container>
            <Tabs
                defaultActiveKey="restaurants"
            >
                <Tab eventKey="restaurants" title="Restaurants">
                    <RestaurantsEditView restaurants={restaurants} />
                </Tab>
                <Tab eventKey="concessions" title="Concessions">
                    <ConcessionsEditView concessions={concessions} />
                </Tab>
            </Tabs>
        </Container>
    );

}