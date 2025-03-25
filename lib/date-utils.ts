export function formatDate(dateString: string) {
    if (!dateString) return "N/A"
  
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }
  
  export function getMembershipDuration(dateString: string) {
    if (!dateString) return "N/A"
  
    try {
      const startDate = new Date(dateString)
      const currentDate = new Date()
      const diffTime = Math.abs(currentDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
      if (diffDays < 30) {
        return `${diffDays} days`
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `${months} month${months > 1 ? "s" : ""}`
      } else {
        const years = Math.floor(diffDays / 365)
        const remainingMonths = Math.floor((diffDays % 365) / 30)
        return `${years} year${years > 1 ? "s" : ""}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}` : ""}`
      }
    } catch (error) {
      console.error("Error calculating membership duration:", error)
      return "Unknown"
    }
  }
  
  