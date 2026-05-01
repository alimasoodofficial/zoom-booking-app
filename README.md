# Zoom Consultation Booking App

A modern, full-stack booking application built with React, Vite, Express, Supabase, and Zoom API.

## Features
- **Modern UI**: Glassmorphism design with sleek animations.
- **Booking Flow**: Intuitive calendar and time slot selection.
- **Admin Dashboard**: Overview of bookings and availability management.
- **Zoom Integration**: Automatically creates Zoom meetings upon booking.
- **Email Notifications**: Sends meeting links to clients via Nodemailer.

## Prerequisites
- Node.js installed.
- Supabase account and project.
- Zoom Server-to-Server OAuth credentials.
- Gmail account (for Nodemailer).

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory (one is already provided as a template) and fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `EMAIL_USER` (Your Gmail)
   - `EMAIL_PASS` (Your Gmail App Password)
   - Zoom keys (Pre-filled from your zoom keys.txt)

3. **Supabase Database**:
   Run the SQL script provided in `supabase_setup.sql` in your Supabase SQL Editor.

4. **Running the App**:
   - Start the **Frontend**: `npm run dev`
   - Start the **Backend Server**: `node server/index.js` (Open a separate terminal)

## Admin Dashboard
Access the admin dashboard at `http://localhost:5173/admin`.

## Technology Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: Supabase.
- **Communication**: Zoom API, Nodemailer.
- **Styling**: Vanilla CSS with modern CSS variables.
# zoom-booking-app
