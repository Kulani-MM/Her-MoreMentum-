// Update the navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  // Remove the single-page navigation logic
  const navButtons = document.querySelectorAll('.nav-btn');
  const views = document.querySelectorAll('.view');
  
  // Keep only the functionality that's needed for each page
  if (document.getElementById('mentorshipForm')) {
    // Initialize mentorship page functionality
    initMentorshipPage();
  }
  
  if (document.getElementById('ai-coach')) {
    // Initialize AI coach page functionality
    initAICoachPage();
  }
  
  // Add other page-specific initializations as needed
});

// Move all page-specific functions here
function initMentorshipPage() {
  // Mentorship page specific code
}

function initAICoachPage() {
  // AI Coach page specific code
}

// Add other initialization functions for each page