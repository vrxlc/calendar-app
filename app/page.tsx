"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Menu,
  Clock,
  MapPin,
  Users,
  CalendarIcon,
} from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isToday,
  addDays,
} from "date-fns"

import { CreateEventModal } from "@/components/create-event-modal"

// --- DATA STRUCTURES ---

const myCalendars = [
  { id: "work", name: "Work", color: "bg-pistachio" },
  { id: "personal", name: "Personal", color: "bg-blossom" },
  { id: "family", name: "Family", color: "bg-latte" },
  { id: "project", name: "Coding Project", color: "bg-serene" },
]

const initialEvents = [
  {
    id: 1,
    title: "Group Meeting",
    date: new Date(2025, 6, 15), // July 15, 2025
    startTime: "10:00",
    endTime: "11:30",
    calendarId: "work",
    description: "Weekly sync-up with the project team.",
    location: "Conference Room 4",
    attendees: ["Dev Team", "Product Manager"],
    organizer: "You",
  },
  {
    id: 2,
    title: "Coding Project",
    date: new Date(2025, 6, 16), // July 16, 2025
    startTime: "13:00",
    endTime: "16:00",
    calendarId: "project",
    description: "Dedicated time for working on the new feature.",
    location: "Home Office",
    attendees: [],
    organizer: "You",
  },
  {
    id: 3,
    title: "Lunch with Mum",
    date: new Date(2025, 6, 17), // July 17, 2025
    startTime: "12:00",
    endTime: "13:00",
    calendarId: "family",
    description: "Catch up over lunch.",
    location: "The Corner Cafe",
    attendees: ["Mum"],
    organizer: "You",
  },
  {
    id: 4,
    title: "Chores",
    date: new Date(2025, 6, 19), // July 19, 2025
    startTime: "09:00",
    endTime: "11:00",
    calendarId: "personal",
    description: "Groceries and house cleaning.",
    location: "Home",
    attendees: [],
    organizer: "You",
  },
]

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 16))
  const [events, setEvents] = useState(initialEvents)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // --- DATE & CALENDAR LOGIC ---

  const firstDayOfWeek = startOfWeek(currentDate)
  const daysInWeek = eachDayOfInterval({
    start: firstDayOfWeek,
    end: endOfWeek(currentDate),
  })

  const firstDayOfMonth = startOfMonth(currentDate)
  const lastDayOfMonth = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth })
  const startingDayIndex = firstDayOfMonth.getDay()

  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToPrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7))
  const goToPrevWeek = () => setCurrentDate(addDays(currentDate, -7))
  const goToToday = () => setCurrentDate(new Date())

  // --- EVENT HANDLING ---

  const handleEventClick = (event) => {
    const calendar = myCalendars.find((c) => c.id === event.calendarId)
    setSelectedEvent({ ...event, color: calendar ? calendar.color : "bg-gray-500" })
  }

  const getEventColor = (calendarId) => {
    const calendar = myCalendars.find((c) => c.id === calendarId)
    return calendar ? calendar.color : "bg-gray-500"
  }

  const handleCreateEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, { ...newEvent, id: Date.now() }])
    setIsModalOpen(false)
  }

  // --- UI & ANIMATION ---

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8) // 8 AM to 4 PM

  const calculateEventStyle = (startTime, endTime) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 8) * 80 // 80px per hour
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/la-skyline.jpg"
        alt="City skyline at night with palm trees"
        fill
        className="object-cover"
        quality={100}
        priority
      />

      <header
        className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6 opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 text-white" />
          <span className="text-2xl font-semibold text-white drop-shadow-lg">Calendar</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              placeholder="Search"
              className="rounded-full bg-white/10 backdrop-blur-sm pl-10 pr-4 py-2 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          <Settings className="h-6 w-6 text-white drop-shadow-md" />
          <div className="h-10 w-10 rounded-full bg-serene flex items-center justify-center text-gray-800 font-bold shadow-md text-xl">
            V
          </div>
        </div>
      </header>

      <main className="relative h-screen w-full pt-20 flex">
        <div
          className={`w-64 h-full bg-black/20 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 rounded-tr-3xl opacity-0 ${isLoaded ? "animate-fade-in" : ""} flex flex-col justify-between`}
          style={{ animationDelay: "0.4s" }}
        >
          <div>
            <button
              className="mb-6 flex items-center justify-center gap-2 rounded-full bg-serene px-4 py-3 text-gray-800 w-full font-semibold"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-5 w-5" />
              <span>Create</span>
            </button>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">{format(currentDate, "MMMM yyyy")}</h3>
                <div className="flex gap-1">
                  <button onClick={goToPrevMonth} className="p-1 rounded-full hover:bg-white/20">
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </button>
                  <button onClick={goToNextMonth} className="p-1 rounded-full hover:bg-white/20">
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="text-xs text-white/70 font-medium py-1">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startingDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map((day) => (
                  <button
                    key={day.toString()}
                    onClick={() => setCurrentDate(day)}
                    className={`text-xs rounded-full w-7 h-7 flex items-center justify-center ${
                      isSameDay(day, currentDate)
                        ? "bg-serene text-gray-800"
                        : isToday(day)
                          ? "text-serene font-bold"
                          : "text-white hover:bg-white/20"
                    }`}
                  >
                    {format(day, "d")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-3">My calendars</h3>
              <div className="space-y-2">
                {myCalendars.map((cal) => (
                  <div key={cal.id} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-sm ${cal.color}`}></div>
                    <span className="text-white text-sm">{cal.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-serene p-4 text-gray-800 w-14 h-14 self-start"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        <div
          className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-4">
              <button onClick={goToToday} className="px-4 py-2 text-gray-800 bg-serene rounded-md font-semibold">
                Today
              </button>
              <div className="flex">
                <button onClick={goToPrevWeek} className="p-2 text-white hover:bg-white/10 rounded-l-md">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={goToNextWeek} className="p-2 text-white hover:bg-white/10 rounded-r-md">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-white">{format(currentDate, "MMMM d, yyyy")}</h2>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full">
              <div className="grid grid-cols-8 border-b border-white/20">
                <div className="p-2 text-center text-white/50 text-xs"></div>
                {daysInWeek.map((day) => (
                  <div key={day.toString()} className="p-2 text-center border-l border-white/20">
                    <div className="text-xs text-white/70 font-medium">{format(day, "EEE")}</div>
                    <div
                      className={`text-lg font-medium mt-1 ${
                        isSameDay(day, currentDate)
                          ? "bg-serene text-gray-800 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                          : "text-white"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-8">
                <div className="text-white/70">
                  {timeSlots.map((time) => (
                    <div key={time} className="h-20 border-b border-white/10 pr-2 text-right text-xs">
                      {format(new Date(2000, 0, 1, time), "ha")}
                    </div>
                  ))}
                </div>

                {daysInWeek.map((day) => (
                  <div key={day.toString()} className="border-l border-white/20 relative">
                    {timeSlots.map((time) => (
                      <div key={time} className="h-20 border-b border-white/10"></div>
                    ))}
                    {events
                      .filter((event) => isSameDay(event.date, day))
                      .map((event) => (
                        <div
                          key={event.id}
                          className={`absolute ${getEventColor(
                            event.calendarId,
                          )} rounded-md p-2 text-gray-800 text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg`}
                          style={{
                            ...calculateEventStyle(event.startTime, event.endTime),
                            left: "4px",
                            right: "4px",
                          }}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${selectedEvent.color} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{selectedEvent.title}</h3>
              <div className="space-y-3 text-gray-800">
                <p className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {selectedEvent.location}
                </p>
                <p className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {format(selectedEvent.date, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="flex items-start">
                  <Users className="mr-2 h-5 w-5 mt-1" />
                  <span>
                    <strong>Attendees:</strong>
                    <br />
                    {selectedEvent.attendees.join(", ") || "No attendees"}
                  </span>
                </p>
                <p>
                  <strong>Organizer:</strong> {selectedEvent.organizer}
                </p>
                <p>
                  <strong>Description:</strong> {selectedEvent.description}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-white/50 text-gray-800 px-4 py-2 rounded hover:bg-white/70 transition-colors"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateEvent}
          calendars={myCalendars}
          selectedDate={currentDate}
        />
      </main>
    </div>
  )
}
