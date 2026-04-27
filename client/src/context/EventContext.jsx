import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  defaultEventSettings,
  normalizeEventSettings,
} from "../utils/eventSettings";

const EventContext = createContext({
  events: defaultEventSettings,
  getEvent: () => null,
  refreshEvents: async () => {},
  loading: true,
});

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(defaultEventSettings);
  const [loading, setLoading] = useState(true);

  const refreshEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(normalizeEventSettings(response.data));
    } catch (_error) {
      setEvents(defaultEventSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const getEvent = (key) => events[key] || defaultEventSettings[key] || null;

  return (
    <EventContext.Provider
      value={{ events, getEvent, refreshEvents, loading }}
    >
      {children}
    </EventContext.Provider>
  );
};
