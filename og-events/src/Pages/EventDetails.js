import React from 'react';
import { useParams } from "react-router";
import EventSingle from '../Components/EventSingle';

function EventDetails() {

    const { slug } = useParams();

    return (
        <>  
    
            <EventSingle uuid={slug} />

        </>
    );
    
}

export default EventDetails;