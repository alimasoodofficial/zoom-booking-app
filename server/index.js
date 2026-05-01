import express from 'express';
import axios from 'axios';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Admin client that bypasses RLS (Safe only on server)
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.supabase_secret_key
);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Zoom Booking API is running...');
});

// Admin: Create Slot
app.post('/api/slots', async (req, res) => {
  try {
    const { date, start_time, end_time } = req.body;
    
    // Ensure HH:mm:ss format for Postgres TIME type
    const startTimeFormatted = start_time.length === 5 ? `${start_time}:00` : start_time;
    const endTimeFormatted = end_time.length === 5 ? `${end_time}:00` : end_time;

    const { data, error } = await supabaseAdmin
      .from('slots')
      .insert([{ 
        date, 
        start_time: startTimeFormatted, 
        end_time: endTimeFormatted, 
        is_booked: false 
      }])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete Slot
app.delete('/api/slots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('slots')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({ error: error.message });
  }
});

// Zoom credentials
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to get Zoom Access Token
async function getZoomAccessToken() {
  const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
  try {
    const response = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
      {},
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Zoom access token:', error.response?.data || error.message);
    throw error;
  }
}

// Endpoint to create a Zoom meeting
app.post('/api/create-meeting', async (req, res) => {
  const { name, email, startTime, topic } = req.body;

  try {
    const accessToken = await getZoomAccessToken();

    const meetingResponse = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: `Consultation with ${name}`,
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration: 30,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          audio: 'both',
          auto_recording: 'none',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const meetingLink = meetingResponse.data.join_url;

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Consultation Booking Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #3b82f6;">Hello ${name},</h2>
          <p>Your consultation has been booked successfully!</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Topic:</strong> ${topic}</p>
            <p><strong>Time:</strong> ${new Date(startTime).toLocaleString()}</p>
            <p><strong>Zoom Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
          </div>
          <p>We look forward to seeing you!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      meetingLink,
      data: meetingResponse.data
    });

  } catch (error) {
    console.error('Error in create-meeting:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
