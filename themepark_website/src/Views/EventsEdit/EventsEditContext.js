import React, {useState, useCallback, useEffect} from "react";
import { api } from "../../App";

function formatEventTime24H(startDate, duration) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

    const formatTo24H = (date) => {
        return date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "America/Chicago"
        });
    };

    const startTime = formatTo24H(startDateTime);
    const endTime = formatTo24H(endDateTime);

    return { startTime, endTime };
}

function generateEventStartAndDuration(startTime, endTime) {
    const currentDate = new Date();
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const startDate = new Date(currentDate);
    startDate.setHours(startHour, startMinute, 0, 0);
    const endDateTime = new Date(currentDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    let duration = (endDateTime - startDate) / (60 * 1000);
    if (duration < 0) {
        duration += 24 * 60;
    }
    return { startDate, duration };
}

function prepareEventPayload(event) {
    const {startDate, duration} = generateEventStartAndDuration(event.startTime, event.endTime);
    let payload = {...event};
    payload.EventDateTime = startDate;
    payload.EventDuration = duration;
    delete payload.startTime;
    delete payload.endTime;
    return payload;
}

export function updateEvent(event, onSuccess, onFailure) {
    let payload = prepareEventPayload(event);
    api.put(`/events/${event.EventID}`, payload)
    .then((response) => {
        onSuccess(response);
    })
    .catch((e) => {
        onFailure(e);
    });
}

export function addEvent(event, onSuccess, onFailure) {
    let payload = prepareEventPayload(event);
    delete payload.EventID;
    delete payload.Deleted;
    api.post(`/events`, payload)
    .then((response) => {
        onSuccess(response);
    })
    .catch((e) => {
        onFailure(e);
    });
}

export function deleteEvent(event, onSuccess, onFailure) {
    api.delete(`/events/${event.EventID}`)
    .then((response) => {
        onSuccess(response);
    })
    .catch((e) => {
        onFailure(e);
    })
}

const defaultFormState = {
    EventName: "",
    EventType: "",
    EventDateTime: "1970-01-01T06:00:00Z",
    EventDuration: 720,
    EventDesc: "",
    EventRestrictions: "",
    EventAgeLimit: 1,
    Location: "",
    Capacity: 1,
    startTime: "",
    endTime: ""
};

export const EventsEditContext = React.createContext();

// Contains all shared state variables and functions
// Also manages logic between component states
export function EventsEditContextProvider({children}) {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState(-1);
    const [displayEvents, setDisplayEvents] = useState([]);
    const [formEditState, setFormEditState] = useState(defaultFormState);
    const [newEventEditState, setNewEventEditState] = useState(defaultFormState);
    const [isFormStateValid, setIsFormStateValid] = useState(false);
    const [isNewEventValid, setIsNewEventValid] = useState(false);

    const refreshEvents = useCallback(() => {
        api.get("/events")
        .then((response) => {
            setEvents(response.data.events);
        })
        .catch((e) => console.log(e));
    }, []);

    const refreshCategories = useCallback(() => {
        api.get("/events/categories")
        .then((response) => {
            setCategories(response.data.categories);
        })
        .catch((e) => console.log(e));
    }, []);

    const refreshAll = useCallback(() => {
        refreshEvents();
        refreshCategories();
    }, [refreshEvents, refreshCategories]);
    
    const resetFormEditState = useCallback(() => {
        setFormEditState({
            ...defaultFormState,
            ...formatEventTime24H(defaultFormState.EventDateTime, defaultFormState.EventDuration)
        });
    }, []);

    const resetNewEventEditState = useCallback(() => {
        setNewEventEditState({
            ...defaultFormState,
            ...formatEventTime24H(defaultFormState.EventDateTime, defaultFormState.EventDuration)
        });
    }, []);

    const applyEventToFormState = useCallback((event) => {
        setFormEditState({
            ...event,
            ...formatEventTime24H(event.EventDateTime, event.EventDuration)
        });
    }, []);

    useEffect(() => {
        refreshEvents();
        refreshCategories();
    }, [refreshCategories, refreshEvents]);

    useEffect(() => {
        let newEvents = events;
        if (activeCategory >= 0) {
            newEvents = events.filter((event) => event.EventType === categories[activeCategory]);
        }
        if (search) {
            newEvents = newEvents.filter((event) => event.EventName.toLowerCase().indexOf(search.toLowerCase()) !== -1);
        }
        setDisplayEvents(newEvents);
    }, [activeCategory, search, categories, events]);

    useEffect(() => {
        setIsFormStateValid(Object.entries(formEditState).every(([k, v]) => k === "Deleted"? true : Boolean(v)));
    }, [formEditState]);

    useEffect(() => {
        setIsNewEventValid(Object.entries(newEventEditState).every(([k, v]) => k === "Deleted"? true : Boolean(v)));
    }, [newEventEditState]);

    return (
        <EventsEditContext.Provider value={{
            events, 
            refreshEvents, 
            categories, 
            refreshCategories,
            refreshAll,
            search,
            setSearch,
            activeCategory,
            setActiveCategory,
            displayEvents,
            formEditState,
            setFormEditState,
            resetFormEditState,
            resetNewEventEditState,
            applyEventToFormState,
            isFormStateValid,
            isNewEventValid,
            newEventEditState,
            setNewEventEditState
        }}>
            {children}
        </EventsEditContext.Provider>
    );

}