export const APP_NAME = "Ikon Cuts";
export const CURRENCY = "R"; // South African Rand or generic
export const TIME_ZONE = "Africa/Johannesburg"; // Adjust as needed, loosely implied by context/user name but can be generic

export const OPENING_HOUR = 8;
export const CLOSING_HOUR = 17;
export const SLOT_DURATION_MINUTES = 50;
export const BREAK_DURATION_MINUTES = 40; // Break between slots? Or just one break?
// User said: "50 minutes for each haircut with a 40 minutes break in between for each day around 12:00 lunch time"
// This implies one specific break at 12:00, OR a break after every haircut?
// "50 minutes for each haircut with a 40 minutes break in between for each day around 12:00 lunch time"
// Logic: 08:00 - 08:50, 09:00 - 09:50...
// "break in between for each day around 12:00" -> This sounds like ONE lunch break.
// But "40 minutes break in between" could mean between slots?
// Let's assume standard slots and ONE lunch break for now, but design for flexibility.
// The user said "takes about 50 minutes... with a 40 minutes break in between for each day around 12:00".
// Syntactically "break in between ... around 12:00" strongly suggests a lunch break.
// 08:00, 09:00, 10:00, 11:00 -> 12:00 (Break) -> 13:00?
// If slots are 50 mins, there is an implicit 10 min buffer if scheduled hourly?
// Or 08:00-08:50, 08:50-09:40?
// User said: "50 minutes for each haircut"
// User said: "40 minutes break in between for each day around 12:00"
// I will implement a flexible slot generator in proper step.

export const LUNCH_BREAK_START_HOUR = 12;
export const LUNCH_BREAK_DURATION_MINUTES = 40;

export const AVAILABLE_DAYS = [0, 6]; // 0=Sunday, 6=Saturday
