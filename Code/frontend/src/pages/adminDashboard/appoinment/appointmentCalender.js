import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getRequest } from '../../../redux/modules/appoinment/slice';
import './appointment.css';
import { setRadiologyAppoinmentId } from '../../../redux/modules/radiology/slice';
import { Paper, Typography } from '@mui/material';
import moment from 'moment';


const AppointmentCalender = ({ toggleList, setAppoinmentDate }) => {
    const dispatch = useDispatch();
    let [calenderEvent, setCalenderEvent] = useState([]);
    let { currentBranch } = useSelector(state => state.branch);
    let { getRes } = useSelector(state => state.appointment);
    const [tooltipEvent, setTooltipEvent] = useState(null);

    useEffect(() => {
        if (!currentBranch) { return }
        dispatch(getRequest());
    }, [dispatch, currentBranch]);

    useEffect(() => {
        if (!getRes) { return }
        if (getRes?.success) {
            if (getRes?.data?.length > 0) {
                const eventList = getRes?.data.map(item => {
                    return {
                        appoinmentId: item._id,
                        title: `${item.appoinmentCategory}`,
                        start: item.startTime,
                        end: item.endTime,
                        color: item.appoinmentCategory === "Scheduled" ? '#FF5E2A' : "#2D33C0", // Border color
                        textColor: item.appoinmentCategory === "Scheduled" ? '#FF5E2A' : "#2D33C0", // Border color
                        backgroundColor: item.appoinmentCategory === "Scheduled" ? '#ff5f2a1e' : "#2D33C01e", // Border color
                        className: item.appoinmentCategory
                    }
                }
                );
                setCalenderEvent(eventList);
            } else {
                setCalenderEvent([]);
            }
        }
    }, [getRes, setCalenderEvent])

    const handleEventClick = (info) => {
        const event = info.event;
        toggleList();
        dispatch(setRadiologyAppoinmentId(event.extendedProps.appoinmentId));
    };

    const handleDateClick = (info) => {
        setAppoinmentDate(info.dateStr)
        dispatch(setRadiologyAppoinmentId(false));
    };

    const handleEventMouseEnter = (info) => {
        const eventElement = info.el;
        const eventRect = eventElement.getBoundingClientRect();
        const top = eventRect.top + window.scrollY - 10;
        const left = eventRect.left + window.scrollX; // Centered over the event

        setTooltipEvent({
            event: info.event,
            position: {
                top: top,
                left: left,
            },
        });
    };

    const handleEventMouseLeave = () => {
        setTooltipEvent(null);
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin,]}
                initialView={"dayGridMonth"}
                headerToolbar={{
                    start: `prev,next`, // will normally be on the left. if RTL, will be on the right
                    center: "title",
                    end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
                }}
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'short' // 'am' or 'pm'
                }}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                events={calenderEvent}
                eventMouseEnter={handleEventMouseEnter}
                eventMouseLeave={handleEventMouseLeave}
            />
            {tooltipEvent && (
                <Paper className="cardStyle custom-tooltip" style={{ top: tooltipEvent.position.top, left: tooltipEvent.position.left }}>
                    <Typography sx={{ fontSize: "16px" }} color="secondary.secondary" >Category - {tooltipEvent?.event?.title}</Typography>
                    <Typography sx={{ fontSize: "16px" }} color="secondary.secondary" >Start Time - {moment(tooltipEvent?.event?.start).format("MM-DD-YYYY HH:mm A")}</Typography>
                    <Typography sx={{ fontSize: "16px" }} color="secondary.secondary" >End Time - {moment(tooltipEvent?.event?.end).format("MM-DD-YYYY HH:mm A")}</Typography>
                </Paper>
            )}
        </div >
    )
}

export default AppointmentCalender;