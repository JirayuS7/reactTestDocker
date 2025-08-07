import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/react'
import { useRef, useState } from 'react'
import { Modal, Typography, Tag, Space } from 'antd'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const handleDateClick = (date: Date) => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.changeView('dayGridMonth', date)
    }
  }

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event)
    setModalVisible(true)
  }

  const updateMonthTitlesWithEventCounts = () => {
    const calendarApi = calendarRef.current?.getApi()
    if (!calendarApi) return

    // Get all events
    const allEvents = calendarApi.getEvents()
    
    // Find all month title elements in the year view
    const monthTitles = document.querySelectorAll('.fc-multimonth-title')
    
    monthTitles.forEach((titleElement) => {
      const titleText = titleElement.textContent || ''
      
      // Extract month name (remove any existing count)
      const monthName = titleText.replace(/\s*\(\d+\)$/, '')
      
      // Get the month element to find its date range
      const monthElement = titleElement.closest('.fc-multimonth-month')
      if (!monthElement) return
      
      // Get the month's date range
      const monthDateStr = monthElement.getAttribute('data-date')
      if (!monthDateStr) return
      
      const monthDate = new Date(monthDateStr + 'T00:00:00')
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59)
      
      // Count events in this month
      const eventsInMonth = allEvents.filter(event => {
        const eventStart = event.start
        const eventEnd = event.end || event.start
        
        if (!eventStart || !eventEnd) return false
        
        // Check if event overlaps with this month
        return (eventStart <= monthEnd && eventEnd >= monthStart)
      })
      
      // Update title with count
      const eventCount = eventsInMonth.length
      titleElement.textContent = `${monthName} (${eventCount})`
    })
  }

  // Sample events including today
  const events = [
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(), // Today
      end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      color: '#3788d8'
    },
    {
      id: '2',
      title: 'Project Deadline',
      start: new Date().toISOString().split('T')[0], // Today (all-day)
      allDay: true,
      color: '#f56565'
    },
    {
      id: '3',
      title: 'Code Review',
      start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour
      color: '#48bb78'
    },
    {
      id: '4',
      title: 'Weekly Planning',
      start: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow
      end: new Date(new Date().setDate(new Date().getDate() + 2) + 90 * 60 * 1000), // 1.5 hours
      color: '#ed8936'
    },
    {
      id: '5',
      title: 'Client Presentation',
      start: new Date(new Date().setDate(new Date().getDate() + 7)), // Next week
      allDay: true,
      color: '#9f7aea'
    }
  ]

  return (
    <div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, multiMonthPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,multiMonthYear'
        }}
        views={{
          multiMonthYear: {
            type: 'multiMonth',
            duration: { years: 1 },
            buttonText: 'Year',
            multiMonthTitleFormat: { month: 'long' }
          },
          timeGridWeek: {
            type: 'timeGrid',
            duration: { weeks: 1 },
            buttonText: 'Week',
            slotMinTime: '06:00:00',
            slotMaxTime: '22:00:00',
            allDaySlot: true
          }
        }}
        height="auto"
        navLinks={true}
        // Custom event count display for year view
        viewDidMount={(info) => {
          if (info.view.type === 'multiMonth') {
            setTimeout(() => {
              updateMonthTitlesWithEventCounts()
            }, 100)
          }
        }}
        eventsSet={() => {
          // Update counts when events change
          setTimeout(() => {
            if (calendarRef.current?.getApi().view.type === 'multiMonth') {
              updateMonthTitlesWithEventCounts()
            }
          }, 100)
        }}
        navLinkDayClick={(date) => {
          // When clicking on a day number, go to month view of that day
          handleDateClick(date)
        }}
        navLinkWeekClick={(weekStart) => {
          // When clicking on a week number, go to month view of that week
          handleDateClick(weekStart)
        }}
        eventClick={(info) => {
          handleEventClick(info)
        }}
      />
      
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <Title level={4} style={{ margin: 0 }}>
              Event Details
            </Title>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedEvent && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>Event Title:</Text>
              <br />
              <Title level={3} style={{ margin: '8px 0', color: selectedEvent.backgroundColor }}>
                {selectedEvent.title}
              </Title>
            </div>
            
            <div>
              <Text strong>
                <ClockCircleOutlined /> Date & Time:
              </Text>
              <br />
              <Text>
                {selectedEvent.allDay 
                  ? `All Day - ${selectedEvent.start?.toLocaleDateString()}`
                  : `${selectedEvent.start?.toLocaleString()} - ${selectedEvent.end?.toLocaleString()}`
                }
              </Text>
            </div>
            
            <div>
              <Text strong>Event Type:</Text>
              <br />
              <Tag 
                color={selectedEvent.backgroundColor}
                style={{ marginTop: 4 }}
              >
                {selectedEvent.allDay ? 'All Day Event' : 'Timed Event'}
              </Tag>
            </div>
            
            {selectedEvent.extendedProps && (
              <div>
                <Text strong>Additional Info:</Text>
                <br />
                <Text type="secondary">
                  Event ID: {selectedEvent.id}
                </Text>
              </div>
            )}
          </Space>
        )}
      </Modal>
    </div>
  )
}