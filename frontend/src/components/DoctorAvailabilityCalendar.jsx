// Composant DoctorAvailabilityCalendar.jsx
import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline'

function DoctorAvailabilityCalendar({ doctor, onSelectSlot, selectedDate, setSelectedDate }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1))
    return d
  })

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)

  // Analyser les disponibilités du médecin
  const getAvailability = () => {
    if (!doctor?.availability) return {}
    try {
      return JSON.parse(doctor.availability)
    } catch {
      return {}
    }
  }

  const availability = getAvailability()
  const dayNames = {
    monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi',
    thursday: 'Jeudi', friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche'
  }
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  const weekDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart)
      d.setDate(currentWeekStart.getDate() + i)
      days.push(d)
    }
    return days
  }

  const changeWeek = (dir) => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() + dir * 7)
    setCurrentWeekStart(d)
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString()
  }

  const handleSelectSlot = (date, timeSlot) => {
    const [start, end] = timeSlot.split('-')
    const selectedDateTime = new Date(date)
    const [hours, minutes] = start.split(':')
    selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0)
    
    setSelectedDate(selectedDateTime.toISOString())
    setSelectedTimeSlot(timeSlot)
    if (onSelectSlot) onSelectSlot(selectedDateTime.toISOString(), timeSlot)
  }

  return (
    <div style={{marginTop:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <h4 style={{fontSize:14, fontWeight:600, color:'var(--c-text)', margin:0}}>
          📅 Planning des disponibilités
        </h4>
        <div style={{display:'flex', gap:8}}>
          <button onClick={() => changeWeek(-1)} style={{padding:4, borderRadius:6, border:'1px solid var(--c-border)', background:'none', cursor:'pointer'}}>
            <ChevronLeftIcon style={{width:16,height:16}}/>
          </button>
          <span style={{fontSize:12, color:'var(--c-muted)'}}>
            {formatDate(weekDays()[0])} - {formatDate(weekDays()[6])}
          </span>
          <button onClick={() => changeWeek(1)} style={{padding:4, borderRadius:6, border:'1px solid var(--c-border)', background:'none', cursor:'pointer'}}>
            <ChevronRightIcon style={{width:16,height:16}}/>
          </button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8}}>
        {weekDays().map((day, idx) => {
          const dayKey = dayKeys[idx]
          const slots = availability[dayKey] || []
          const isDayToday = isToday(day)
          const dateStr = day.toISOString().split('T')[0]
          
          return (
            <div key={idx} style={{
              border: `1px solid ${isDayToday ? 'var(--c-accent)' : 'var(--c-border)'}`,
              borderRadius: 10, padding: 8, background: isDayToday ? '#eff6ff' : 'white'
            }}>
              <div style={{textAlign:'center', marginBottom:8}}>
                <p style={{fontSize:11, fontWeight:600, color: isDayToday ? 'var(--c-accent)' : 'var(--c-muted)', margin:0}}>
                  {dayNames[dayKey].substring(0,3)}
                </p>
                <p style={{fontSize:12, fontWeight:700, color: isDayToday ? 'var(--c-accent)' : 'var(--c-text)', margin:0}}>
                  {day.getDate()}
                </p>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:4}}>
                {slots.length === 0 ? (
                  <p style={{fontSize:10, color:'#ccc', textAlign:'center'}}>—</p>
                ) : (
                  slots.map(slot => {
                    const isSelected = selectedTimeSlot === slot && selectedDate?.startsWith(dateStr)
                    return (
                      <button
                        key={slot}
                        onClick={() => handleSelectSlot(day, slot)}
                        style={{
                          fontSize:10, padding:'4px 6px', borderRadius:6,
                          background: isSelected ? 'var(--c-accent)' : '#f3f4f6',
                          color: isSelected ? 'white' : 'var(--c-text)',
                          border:'none', cursor:'pointer', transition:'all .2s'
                        }}
                      >
                        <ClockIcon style={{width:10,height:10, display:'inline', marginRight:4}}/>
                        {slot}
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DoctorAvailabilityCalendar