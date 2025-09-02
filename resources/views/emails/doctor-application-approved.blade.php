<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Application Approved</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2563eb;
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f8fafc;
            padding: 30px 20px;
            border-radius: 0 0 8px 8px;
        }
        .card {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .success {
            background-color: #10b981;
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 25px;
        }
        .credentials {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .credentials h3 {
            margin-top: 0;
            color: #92400e;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #374151;
        }
        .info-value {
            color: #6b7280;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Congratulations!</h1>
        <p>Your doctor application has been approved</p>
    </div>

    <div class="content">
        <div class="success">
            <h2>Welcome to Clinified Hub, Dr. {{ $application->full_name }}!</h2>
        </div>

        <div class="card">
            <p>Dear Dr. {{ $application->full_name }},</p>
            
            <p>We are thrilled to inform you that your doctor application has been <strong>approved</strong>! After careful review of your credentials and experience, we are excited to welcome you to the Clinified Hub platform.</p>

            <div class="credentials">
                <h3>🔐 Your Login Credentials</h3>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ $application->email }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Temporary Password:</span>
                    <span class="info-value"><strong>{{ $temporaryPassword }}</strong></span>
                </div>
                <p><strong>Important:</strong> Please change your password immediately after your first login for security purposes.</p>
            </div>

            <h3>📋 Application Details</h3>
            <div class="info-row">
                <span class="info-label">Specialty:</span>
                <span class="info-value">{{ $application->specialty }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">License Number:</span>
                <span class="info-value">{{ $application->license_number }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Years of Experience:</span>
                <span class="info-value">{{ $application->years_of_experience }} years</span>
            </div>
            <div class="info-row">
                <span class="info-label">Application Date:</span>
                <span class="info-value">{{ $application->created_at->format('M d, Y') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Approval Date:</span>
                <span class="info-value">{{ $application->reviewed_at->format('M d, Y') }}</span>
            </div>

            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/login" class="btn">Login to Your Account</a>
            </div>

            <h3>🚀 Next Steps</h3>
            <ol>
                <li><strong>Login:</strong> Use the credentials above to access your account</li>
                <li><strong>Complete Profile:</strong> Update your profile with additional information</li>
                <li><strong>Set Availability:</strong> Configure your appointment availability</li>
                <li><strong>Start Accepting Patients:</strong> Begin receiving appointment requests</li>
            </ol>

            <p>If you have any questions or need assistance getting started, please don't hesitate to contact our support team.</p>

            <p>Welcome aboard!</p>
        </div>
    </div>

    <div class="footer">
        <p>
            <strong>Clinified Hub</strong><br>
            Your Healthcare Appointment Platform<br>
        </p>
        <p style="font-size: 12px; color: #9ca3af;">
            This email was sent to {{ $application->email }} regarding your doctor application.
        </p>
    </div>
</body>
</html>