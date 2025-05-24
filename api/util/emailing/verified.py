def verify(name):
    htmlString = f'''
<html>
<head>
  <meta charset="UTF-8">
  <title>ICS-STAR Event Invitation</title>
  <style>
    body {{
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
    }}
    .email-container {{
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      padding: 20px;
    }}
    .header {{
      text-align: center;
      padding: 20px 0;
    }}
    .header img {{
      width: 100%;
    }}
    .main-title {{
      font-size: 22px;
      font-weight: bold;
      color: #00369C;
      text-align: center;
      margin-bottom: 20px;
    }}
    .event-image {{
      width: 100%;
      height: auto;
      margin: 20px 0;
    }}
    .content {{
      font-size: 16px;
      color: #333333;
      line-height: 1.5;
    }}
    .button-container {{
      text-align: center;
      margin: 30px 0;
    }}
    .cta-button {{
      background-color: #00369C;
      color: white !important;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 6px;
      font-size: 16px;
      display: inline-block;
    }}
    .footer {{
      font-size: 13px;
      color: #666666;
      text-align: center;
      padding: 20px 10px;
      border-top: 1px solid #dddddd;
      margin-top: 40px;
    }}
    .footer-logo {{
      margin-bottom: 10px;
    }}
    .footer-logo img {{
      width: 120px;
    }}
    .footer a {{
      color: #00369C;
      text-decoration: none;
      margin: 0 10px;
    }}
    .social-icons img {{
      width: 20px;
      margin: 0 5px;
      vertical-align: middle;
    }}
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header with Logo -->
    <div class="header">
      <img src="https://rtyworjvisvjmixvxwmc.supabase.co/storage/v1/object/public/128storage/emailing_assets/Email%20Header.png" alt="ICS - STAR Logo">
    </div>

    <!-- Title -->
    <h1 style="color: #1D2939; font-size: 18px; text-align: center;">
    ICS-STAR Notification: <br>
    </h1>
    <div class="main-title">   
     Welcome, {name}! Your account has been verified
    </div>

    <!-- Body Content -->
    <p>Dear {name},</p>

    <p>We’re pleased to inform you that your <strong>ICS-STAR</strong> account has been successfully verified by the admin.</p>

    <p>You now have access to more features of the platform! To get the most out of ICS-STAR, we encourage you to log in and provide additional profile information.</p>

    <p>This will help us better tailor your experience and connect you with the most relevant opportunities and resources.</p>

    <p>Click below to log in and complete your profile:</p>

    <!-- CTA Button -->
    <div class="button-container">
      <a href="https://ics-star-app.vercel.app/login" class="cta-button">Start Onboarding</a>
    </div>

    <p>Welcome aboard, and we’re excited to have you as part of the ICS-STAR community!</p>

    <p>Best regards,<br>
    The ICS-STAR Team</p>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">
        <img src="https://rtyworjvisvjmixvxwmc.supabase.co/storage/v1/object/public/128storage/emailing_assets/Group%20250.png" alt="ICS-STAR Logo Footer">
      </div>
      <p>
        Institute of Computer Science <br>
        College of Arts and Sciences, UPLB <br>
        Los Baños, Laguna, Philippines 4031
      </p>
    </div>
  </div>
</body>
</html>
    '''
    return htmlString
