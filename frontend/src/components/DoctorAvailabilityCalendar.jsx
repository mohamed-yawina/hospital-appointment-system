/**
 * Sélection de créneaux médecin — popup modale (style capture).
 */
import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const STEP_MS = 30 * 60 * 1000
const WORK_START_HOUR = 8
const WORK_END_HOUR = 19

export function toLocalDateTimeIso(date) {
  const pad = (n) => `${n}`.padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

export function slotsForCalendarDay(dayDate, availabilities) {
  if (!availabilities?.length) return []

  const workStart = new Date(dayDate)
  workStart.setHours(WORK_START_HOUR, 0, 0, 0)
  const workEnd = new Date(dayDate)
  workEnd.setHours(WORK_END_HOUR, 0, 0, 0)

  const out = []
  const now = Date.now()

  availabilities.forEach((av) => {
    const s = new Date(av.dateDebut)
    const e = new Date(av.dateFin)
    const overlapEndMs = Math.min(e.getTime(), workEnd.getTime())

    let t = workStart.getTime()
    while (t + STEP_MS <= overlapEndMs) {
      if (t >= s.getTime() && t + STEP_MS <= e.getTime() && t >= now) {
        out.push(new Date(t))
      }
      t += STEP_MS
    }
  })

  const map = new Map()
  out.forEach((d) => map.set(d.getTime(), d))
  return Array.from(map.values()).sort((a, b) => a.getTime() - b.getTime())
}

function getWeekStart(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function formatSlotLabel(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return (
    d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }) + ` à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
  )
}

const navBtnStyle = {
  padding: 8,
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  background: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  color: '#475569',
}

function DoctorAvailabilityCalendar({
  availabilities = [],
  onSelectSlot,
  selectedIso,
  doctorName = '',
  mode = 'popup',
  open: controlledOpen,
  onOpenChange,
  loading = false,
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const modalOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  const setModalOpen = (value) => {
    if (onOpenChange) onOpenChange(value)
    if (controlledOpen === undefined) setInternalOpen(value)
  }

  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart())
  const [activeDayIndex, setActiveDayIndex] = useState(null)
  const [pendingIso, setPendingIso] = useState(null)

  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart)
      d.setDate(currentWeekStart.getDate() + i)
      days.push(d)
    }
    return days
  }, [currentWeekStart])

  const slotsByDay = useMemo(
    () => weekDays.map((day) => slotsForCalendarDay(day, availabilities)),
    [weekDays, availabilities]
  )

  const initModalSelection = () => {
    const todayIdx = weekDays.findIndex((d) => d.toDateString() === new Date().toDateString())
    const firstWithSlots = slotsByDay.findIndex((s) => s.length > 0)
    setActiveDayIndex(todayIdx >= 0 && slotsByDay[todayIdx]?.length ? todayIdx : firstWithSlots)
    setPendingIso(selectedIso || null)
  }

  const openModal = () => {
    initModalSelection()
    setModalOpen(true)
  }

  useEffect(() => {
    if (modalOpen && !loading && availabilities.length > 0) {
      initModalSelection()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, loading, availabilities.length])

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, setModalOpen])

  const changeWeek = (dir) => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() + dir * 7)
    setCurrentWeekStart(d)
    setActiveDayIndex(null)
    setPendingIso(null)
  }

  const formatDate = (date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  const formatTimeSlot = (d) =>
    d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const isToday = (date) => date.toDateString() === new Date().toDateString()

  const activeSlots = activeDayIndex != null ? slotsByDay[activeDayIndex] || [] : []
  const activeDay = activeDayIndex != null ? weekDays[activeDayIndex] : null

  const handleConfirm = () => {
    if (!pendingIso) return
    const d = new Date(pendingIso)
    if (onSelectSlot) onSelectSlot(pendingIso, formatTimeSlot(d))
    setModalOpen(false)
  }

  const weekRangeLabel = `${formatDate(weekDays[0])} – ${formatDate(weekDays[6])}`

  const modalContent =
    modalOpen &&
    createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="slot-modal-title"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(13,27,46,.55)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
        onClick={() => setModalOpen(false)}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 580,
            maxHeight: '92vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 80px rgba(13,27,46,.25)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px 14px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <div>
              <h3
                id="slot-modal-title"
                style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}
              >
                Choisir un créneau
              </h3>
              {doctorName && (
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
                  Dr. {doctorName} · 8h00 – 19h00
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Fermer"
              style={{
                border: 'none',
                background: '#f1f5f9',
                borderRadius: 10,
                padding: 8,
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <XMarkIcon style={{ width: 20, height: 20 }} />
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#64748b', fontSize: 14 }}>
              Chargement des créneaux…
            </div>
          ) : availabilities.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#dc2626', fontSize: 14 }}>
              Aucune disponibilité publiée pour ce médecin.
            </div>
          ) : (
            <>
              {/* Week nav */}
              <div
                style={{
                  padding: '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                }}
              >
                <button type="button" onClick={() => changeWeek(-1)} style={navBtnStyle}>
                  <ChevronLeftIcon style={{ width: 18, height: 18 }} />
                </button>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
                  {weekRangeLabel}
                </span>
                <button type="button" onClick={() => changeWeek(1)} style={navBtnStyle}>
                  <ChevronRightIcon style={{ width: 18, height: 18 }} />
                </button>
              </div>

              {/* Days — 7 colonnes fixes */}
              <div
                style={{
                  padding: '14px 24px 10px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 6,
                }}
              >
                {weekDays.map((day, idx) => {
                  const count = slotsByDay[idx].length
                  const selected = activeDayIndex === idx
                  const today = isToday(day)
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={count === 0}
                      onClick={() => {
                        setActiveDayIndex(idx)
                        setPendingIso(null)
                      }}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 12,
                        border: selected
                          ? '2px solid #2563eb'
                          : `1px solid ${today ? '#93c5fd' : '#e2e8f0'}`,
                        background: selected ? '#eff6ff' : '#fff',
                        cursor: count === 0 ? 'not-allowed' : 'pointer',
                        opacity: count === 0 ? 0.4 : 1,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: selected ? '#2563eb' : '#64748b',
                        }}
                      >
                        {DAY_LABELS[idx]}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: '#0f172a',
                          marginTop: 2,
                        }}
                      >
                        {day.getDate()}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: count ? '#059669' : '#94a3b8',
                          marginTop: 4,
                          lineHeight: 1.2,
                        }}
                      >
                        {count ? `${count} créneau${count > 1 ? 'x' : ''}` : '—'}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Time slots — grille 5 colonnes */}
              <div
                style={{
                  padding: '4px 24px 16px',
                  overflowY: 'auto',
                  flex: 1,
                  minHeight: 180,
                  maxHeight: 320,
                }}
              >
                {activeDayIndex == null ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, padding: 24 }}>
                    Sélectionnez un jour
                  </p>
                ) : activeSlots.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, padding: 24 }}>
                    Aucun créneau ce jour-là
                  </p>
                ) : (
                  <>
                    <p
                      style={{
                        fontSize: 13,
                        color: '#64748b',
                        margin: '0 0 12px',
                        fontWeight: 600,
                      }}
                    >
                      {activeDay.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: 8,
                      }}
                    >
                      {activeSlots.map((slotStart) => {
                        const iso = toLocalDateTimeIso(slotStart)
                        const isSel =
                          pendingIso != null && pendingIso.slice(0, 16) === iso.slice(0, 16)
                        return (
                          <button
                            key={iso}
                            type="button"
                            onClick={() => setPendingIso(iso)}
                            style={{
                              padding: '10px 6px',
                              borderRadius: 10,
                              border: isSel ? '2px solid #2563eb' : '1px solid #e2e8f0',
                              background: isSel ? '#2563eb' : '#fff',
                              color: isSel ? '#fff' : '#334155',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                            }}
                          >
                            <ClockIcon style={{ width: 13, height: 13 }} />
                            {formatTimeSlot(slotStart)}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '14px 24px 20px',
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {pendingIso && (
                  <div
                    style={{
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: 10,
                      padding: '10px 14px',
                      fontSize: 13,
                      color: '#065f46',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {formatSlotLabel(pendingIso)}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                      color: '#475569',
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={!pendingIso}
                    onClick={handleConfirm}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: 'none',
                      background: pendingIso ? '#10b981' : '#cbd5e1',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: pendingIso ? 'pointer' : 'not-allowed',
                      color: '#fff',
                    }}
                  >
                    Confirmer le créneau
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>,
      document.body
    )

  if (mode === 'inline') {
    return (
      <div style={{ marginTop: 16 }}>
        <InlineWeekView
          weekDays={weekDays}
          slotsByDay={slotsByDay}
          weekRangeLabel={weekRangeLabel}
          changeWeek={changeWeek}
          selectedIso={selectedIso}
          onSelectSlot={onSelectSlot}
        />
      </div>
    )
  }

  return (
    <>
      {selectedIso ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <CalendarDaysIcon style={{ width: 20, height: 20, color: '#059669', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#065f46' }}>
              ✓ {formatSlotLabel(selectedIso)}
            </p>
          </div>
          <button
            type="button"
            onClick={openModal}
            style={{
              border: 'none',
              background: 'none',
              color: '#2563eb',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Modifier
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openModal}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            border: '2px dashed #93c5fd',
            background: '#f8fafc',
            color: '#2563eb',
            fontWeight: 700,
            fontSize: 14,
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <CalendarDaysIcon style={{ width: 20, height: 20 }} />
          {loading ? 'Chargement…' : 'Choisir date et heure'}
        </button>
      )}
      {modalContent}
    </>
  )
}

function InlineWeekView({
  weekDays,
  slotsByDay,
  weekRangeLabel,
  changeWeek,
  selectedIso,
  onSelectSlot,
}) {
  const formatTimeSlot = (d) =>
    d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const handlePick = (slotStart) => {
    const iso = toLocalDateTimeIso(slotStart)
    if (onSelectSlot) onSelectSlot(iso, formatTimeSlot(slotStart))
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Planning des créneaux</h4>
          <span style={{ fontSize: 11, color: 'var(--c-muted)' }}>8h00 – 19h00</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" onClick={() => changeWeek(-1)} style={navBtnStyle}>
            <ChevronLeftIcon style={{ width: 16, height: 16 }} />
          </button>
          <span style={{ fontSize: 12, color: 'var(--c-muted)' }}>{weekRangeLabel}</span>
          <button type="button" onClick={() => changeWeek(1)} style={navBtnStyle}>
            <ChevronRightIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {weekDays.map((day, idx) => {
          const slots = slotsByDay[idx]
          const isDayToday = day.toDateString() === new Date().toDateString()
          return (
            <div
              key={idx}
              style={{
                border: `1px solid ${isDayToday ? 'var(--c-accent)' : 'var(--c-border)'}`,
                borderRadius: 10,
                padding: 8,
                background: isDayToday ? '#eff6ff' : 'white',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 600, margin: 0 }}>{DAY_LABELS[idx]}</p>
                <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>{day.getDate()}</p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  maxHeight: 200,
                  overflowY: 'auto',
                }}
              >
                {slots.length === 0 ? (
                  <p style={{ fontSize: 10, color: '#ccc', textAlign: 'center' }}>—</p>
                ) : (
                  slots.map((slotStart) => {
                    const iso = toLocalDateTimeIso(slotStart)
                    const isSel =
                      selectedIso != null && selectedIso.slice(0, 16) === iso.slice(0, 16)
                    return (
                      <button
                        type="button"
                        key={iso}
                        onClick={() => handlePick(slotStart)}
                        style={{
                          fontSize: 10,
                          padding: '4px 6px',
                          borderRadius: 6,
                          background: isSel ? 'var(--c-accent)' : '#f3f4f6',
                          color: isSel ? 'white' : 'var(--c-text)',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {formatTimeSlot(slotStart)}
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default DoctorAvailabilityCalendar
