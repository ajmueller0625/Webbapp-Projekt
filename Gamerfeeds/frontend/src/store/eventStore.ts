import { create } from "zustand";
const API_URL = import.meta.env.VITE_API_URL;

export interface EventData {
    id: number;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    logo_url: string;
    live_stream_url: string;
    event_urls: string[];
    videos: string[];

}

export interface SimpleEventData {
    id: number;
    name: string;
    logo_url: string;
}

export interface PaginationData {
    page: number;
    perPage: number;
    total_items: number;
    total_pages: number;
}

export interface PaginatedEvent {
    items: SimpleEventData[];
    pagination: PaginationData;
}

interface EventState {
    events: SimpleEventData[];
    event: EventData | null;
    pagination: PaginationData | null;
    isEventLoading: boolean;
    eventError: string | null;
    fetchEvents: (page: number, perPage: number) => Promise<void>;
    fetchEventByID: (id: number) => Promise<void>;
}

const useEventStore = create<EventState>((set) => ({
    events: [],
    event: null,
    pagination: null,
    isEventLoading: false,
    eventError: null,
    fetchEvents: async (page: number, perPage: number) => {
        try {
            set({ isEventLoading: true, eventError: null});
            const response = await fetch(`${API_URL}/events?page=${page}&perPage=${perPage}`);
            
                if (!response.ok) {
                    if (response.status === 404) {
                        set({
                            events: [],
                            pagination: {
                                page: page,
                                perPage: perPage,
                                total_items: 0,
                                total_pages: 0
                            },
                            isEventLoading: false,
                            eventError: null,
                        });
                        return;
                    }
                throw Error('Failed to fetch events');
            }

            const data: PaginatedEvent = await response.json();

            const eventData: SimpleEventData[] = data.items.map(item => ({
                id: item.id,
                name: item.name,
                logo_url: item.logo_url

            }));

            set({ 
                events: eventData,
                pagination: data.pagination, 
                isEventLoading: false, 
                eventError: null 
            });

        } catch (error) {
            set({eventError: (error as Error).message, isEventLoading: false});
        }
    },
    fetchEventByID: async (id: number) => {
        try {
            set({ isEventLoading: true, eventError: null });
            const response = await fetch(`${API_URL}/events/${id}`);

            if(!response.ok) {
                // Clear event when not found or any other error
                set({ event: null, isEventLoading: false, eventError: `Failed to fetch event with ID ${id}` });
                return;
            }

            const data = await response.json();
            set({ event: data, isEventLoading: false, eventError: null });

        } catch (error) {
            // Clear event on error
            set({ event: null, eventError: (error as Error).message, isEventLoading: false });
        }
    },
}));

export default useEventStore;