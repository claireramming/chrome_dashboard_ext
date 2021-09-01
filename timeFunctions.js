export function getToday() {
    const date = new Date()
    return new Intl.DateTimeFormat('en-US').format(date)
}

export function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", {timeStyle: "short"})
}

export function getMondayAndNextSunday() {
    const d = new Date()
    const offset = d.getTimezoneOffset() * 60*1000
    const day = d.getDay()
    const diff = d.getDate() - day + (day == 0 ? -6:1) // adjust when day is sunday
    const diff_date = new Date(d.setDate(diff))
    const monday = new Date(diff_date.getTime() - offset)
    const days_in_month = new Date(diff_date.getYear(), diff_date.getMonth()+1, 0).getDate()
    const sun_diff = (diff < 0) ? days_in_month + 6 + diff : diff + 6
    const sunday = new Date(diff_date.setDate(sun_diff))
    const mon = monday.toISOString().split('T')[0]
    const sun = new Date(sunday.getTime() - offset).toISOString().split('T')[0]
    return {mon, sun}
  }

