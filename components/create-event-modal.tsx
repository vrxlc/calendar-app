"use client"

import { useState, type FormEvent } from "react"
import type { FC } from "react"

interface Calendar {
  id: string
  name: string
  color: string
}

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: any) => void
  calendars: Calendar[]
  selectedDate: Date
}

export const CreateEventModal: FC<CreateEventModalProps> = ({ isOpen, onClose, onSave, calendars, selectedDate }) => {
  const [title, setTitle] = useState("")
  const [calendarId, setCalendarId] = useState(calendars[0]?.id || "")
  const [startTime, setStartTime] = useState("12:00")
  const [endTime, setEndTime] = useState("13:00")

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newEvent = {
      title,
      date: selectedDate,
      startTime,
      endTime,
      calendarId,
      description: "",
      location: "",
      attendees: [],
      organizer: "You",
    }
    onSave(newEvent)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full max-w-md mx-4 border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-white">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-1">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white/10 p-2 rounded-md border border-white/20 text-white focus:ring-serene focus:border-serene"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="startTime" className="block text-sm font-medium text-white/80 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white/10 p-2 rounded-md border border-white/20 text-white focus:ring-serene focus:border-serene"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="endTime" className="block text-sm font-medium text-white/80 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white/10 p-2 rounded-md border border-white/20 text-white focus:ring-serene focus:border-serene"
              />
            </div>
          </div>
          <div>
            <label htmlFor="calendar" className="block text-sm font-medium text-white/80 mb-1">
              Calendar
            </label>
            <select
              id="calendar"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              className="w-full bg-white/10 p-2 rounded-md border border-white/20 text-white focus:ring-serene focus:border-serene"
            >
              {calendars.map((cal) => (
                <option key={cal.id} value={cal.id} className="bg-gray-800">
                  {cal.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white rounded-md hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-serene text-gray-800 font-semibold rounded-md hover:opacity-90 transition-opacity"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
