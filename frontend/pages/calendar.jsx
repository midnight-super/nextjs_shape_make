import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DateClickArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { EventClickArg, EventInput } from "@fullcalendar/core";

// Components
import AddEditEvent from "./AddEditEvent";
import PageBreadcrumb from "@/components/PageBreadcrumb";
// Dummy data
import { defaultEvents } from "../utils/data";

const Calendar = ({
  onDateClick,
  onEventClick,
  onDrop,
  onEventDrop,
  events,
}) => {
  /*
   * handle calendar methods
   */
  const handleDateClick = (arg) => {
    onDateClick(arg);
  };
  const handleEventClick = (arg) => {
    onEventClick(arg);
  };
  const handleDrop = (arg) => {
    onDrop(arg);
  };
  const handleEventDrop = (arg) => {
    onEventDrop(arg);
  };

  return (
    <>
      {/* full calendar control */}
      <div id="calendar">
        <FullCalendar
          initialView="dayGridMonth"
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            listPlugin,
          ]}
          handleWindowResize={true}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            list: "List",
            prev: "Prev",
            next: "Next",
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
          }}
          editable={true}
          selectable={true}
          droppable={true}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          drop={handleDrop}
          eventDrop={handleEventDrop}
        />
      </div>
    </>
  );
};

const SidePanel = () => {
  // External events
  const externalEvents = [
    // {
    //   id: 1,
    //   variant: "success",
    //   title: "New Theme Release",
    // },
    // {
    //   id: 2,
    //   variant: "info",
    //   title: "My Event",
    // },
    // {
    //   id: 3,
    //   variant: "warning",
    //   title: "Meet manager",
    // },
    // {
    //   id: 4,
    //   variant: "danger",
    //   title: "Create New theme",
    // },
  ];

  return (
    <>
      <div id="external-events" className="flex flex-col gap-1">
        <p className="text-sm text-slate-700 dark:text-slate-400 mb-4">
          Drag and drop your event or click in the calendar
        </p>
        {(externalEvents || []).map((eve, idx) => {
          return (
            <button
              key={idx}
              className={`external-event bg-${eve.variant} px-3 py-2 rounded text-white text-base text-start w-full mb-2`}
              title={eve.title}
              data-class={`bg-${eve.variant}`}
            >
              <i className="mgc_round_fill me-3 vertical-middle"></i>
              {eve.title}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <h5 className="text-center mb-2">How It Works ?</h5>
        <ul className="ps-3">
          <li className="text-sm text-slate-700 dark:text-slate-400 mb-3">
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
          </li>
          <li className="text-sm text-slate-700 dark:text-slate-400 mb-3">
            Richard McClintock, a Latin professor at Hampden-Sydney College in
            Virginia, looked up one of the more obscure Latin words,
            consectetur, from a Lorem Ipsum passage.
          </li>
          <li className="text-sm text-slate-700 dark:text-slate-400 mb-3">
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
          </li>
        </ul>
      </div>
    </>
  );
};

const CalendarApp = () => {
  /*
   * modal handling
   */
  const [show, setShow] = useState(false);
  const onCloseModal = () => {
    setShow(false);
    setEventData({});
    setDateInfo({});
  };
  const onOpenModal = () => setShow(true);
  const [isEditable, setIsEditable] = useState(false);

  /*
   * event data
   */
  const [events, setEvents] = useState([...defaultEvents]);
  const [eventData, setEventData] = useState({});
  const [dateInfo, setDateInfo] = useState({});

  useEffect(() => {
    // create draggable events
    const draggableEl = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".external-event",
    });
  }, []);

  /*
   * calendar events
   */
  // on date click
  const onDateClick = (arg) => {
    setDateInfo(arg);
    onOpenModal();
    setIsEditable(false);
  };

  // on event click
  const onEventClick = (arg) => {
    const event = {
      id: String(arg.event.id),
      title: arg.event.title,
      className: arg.event.classNames[0],
    };
    setEventData(event);
    setIsEditable(true);
    onOpenModal();
  };

  // on drop
  const onDrop = (arg) => {
    const dropEventData = arg;
    const title = dropEventData.draggedEl.title;
    if (title !== null) {
      const newEvent = {
        id: String(events.length + 1),
        title: title,
        start: dropEventData ? dropEventData.dateStr : new Date(),
        className: dropEventData.draggedEl.attributes["data-class"]["value"],
      };
      const modifiedEvents = [...events];
      modifiedEvents.push(newEvent);
      setEvents(modifiedEvents);
    }
  };

  /*
   * on add event
   */
  const onAddEvent = (data) => {
    const modifiedEvents = [...events];
    const event = {
      id: String(modifiedEvents.length + 1),
      title: data.title,
      start: Object.keys(dateInfo).length !== 0 ? dateInfo.date : new Date(),
      className: data.className,
    };
    modifiedEvents.push(event);
    setEvents(modifiedEvents);
    onCloseModal();
  };

  /*
   * on update event
   */
  const onUpdateEvent = (data) => {
    const modifiedEvents = [...events];
    const idx = modifiedEvents.findIndex((e) => e.id === eventData.id);
    modifiedEvents[idx].title = data.title;
    modifiedEvents[idx].className = data.className;
    setEvents(modifiedEvents);
    setIsEditable(false);
    onCloseModal();
  };

  /*
   * on remove event
   */
  const onRemoveEvent = () => {
    const modifiedEvents = [...events];
    const idx = modifiedEvents.findIndex((e) => e.id === eventData.id);
    modifiedEvents.splice(idx, 1);
    setEvents(modifiedEvents);
    onCloseModal();
  };

  /*
   * on event drop
   */
  const onEventDrop = (arg) => {
    const modifiedEvents = [...events];
    const idx = modifiedEvents.findIndex((e) => e.id === arg.event.id);
    modifiedEvents[idx].title = arg.event.title;
    modifiedEvents[idx].className = arg.event.classNames;
    modifiedEvents[idx].start = arg.event.start;
    modifiedEvents[idx].end = arg.event.end;
    setEvents(modifiedEvents);
    setIsEditable(false);
  };

  // create new event
  const createNewEvent = () => {
    setIsEditable(false);
    onOpenModal();
  };

  return (
    <>
      <PageBreadcrumb
        title="Calendar"
        name="Calendar"
        breadCrumbItems={["XZIST", "Calendar"]}
      />
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="p-6">
            <button
              className="px-3 py-2 rounded bg-primary text-white text-base w-full mb-4"
              id="btn-new-event"
              onClick={createNewEvent}
            >
              <i className="mgc_add_line" />
              &nbsp;Create New Event
            </button>
            <SidePanel />
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="card">
            <div className="p-6">
              <Calendar
                onDateClick={onDateClick}
                onEventClick={onEventClick}
                onDrop={onDrop}
                onEventDrop={onEventDrop}
                events={events}
              />
            </div>
          </div>
        </div>
      </div>

      {/* add new event modal */}
      {show && (
        <AddEditEvent
          isOpen={show}
          onClose={onCloseModal}
          isEditable={isEditable}
          eventData={eventData}
          onUpdateEvent={onUpdateEvent}
          onRemoveEvent={onRemoveEvent}
          onAddEvent={onAddEvent}
        />
      )}
    </>
  );
};

export default CalendarApp;
