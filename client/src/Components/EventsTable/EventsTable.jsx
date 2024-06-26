import React, { useContext } from "react";
import { EventContext } from "../../context/EventContext";
import { useNavigate } from "react-router-dom";
import { formateador } from "../../Utils/formatter";

import styles from "./EventsTable.module.css";

function EventsTable() {
    const { events } = useContext(EventContext);
    const navigate = useNavigate();

    const handleSeePayment = (
        eventId,
        eventTitle,
        comment,
        userName,
        eventCost
    ) => {
        navigate(`/events/${eventId}`, {
            state: {
                eventTitle: eventTitle,
                comment: comment,
                userName: userName,
                eventCost: eventCost,
            },
        });
        console.log(eventId, eventTitle, comment, userName, eventCost);
    };

    const handleMakePayment = (eventId, eventTitle, eventCost, comment) => {
        navigate(`/events/${eventId}/payment`, {
            state: {
                eventTitle: eventTitle,
                eventCost: eventCost,
                comment: comment,
            },
        });
    };

    const handleAddEvent = () => {
        navigate("/events/new");
    };

    return (
        <div className={styles.tableContainer}>
            <div>
                <h1>Events List</h1>
                <button onClick={handleAddEvent}>Add a New Event</button>
            </div>
            {events.length === 0 ? (
                <p>There are no events yet</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Event Cost</th>
                            <th>Remaining Cost</th>
                            <th>Total Participants</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event._id}>
                                <td>{event.title}</td>
                                <td>{formateador(event.eventCost)}</td>
                                <td>{formateador(event.remainingCost)}</td>
                                <td>{event.participants.length}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            handleSeePayment(
                                                event._id,
                                                event.title,
                                                event.comment,
                                                event.userName,
                                                event.eventCost
                                            );
                                        }}
                                    >
                                        See Payments
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleMakePayment(
                                                event._id,
                                                event.title,
                                                event.eventCost
                                            );
                                        }}
                                    >
                                        Make a payment
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default EventsTable;
