<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Application Status</title>
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
            background-color: #dc2626;
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
        .rejection-notice {
            background-color: #fef2f2;
            border: 1px solid #fca5a5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .rejection-notice h3 {
            margin-top: 0;
            color: #dc2626;
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
        .encouragement {
            background-color: #eff6ff;
            border: 1px solid #93c5fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .encouragement h3 {
            margin-top: 0;
            color: #1d4ed8;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Application Status Update</h1>
        <p>Regarding your doctor application</p>
    </div>

    <div class="content">
        <div class="card">
            <p>Dear {{ $application->full_name }},</p>
            
            <p>Thank you for your interest in joining the Clinified Hub platform and for taking the time to submit your doctor application. We appreciate the effort you put into your application.</p>

            <div class="rejection-notice">
                <h3>❌ Application Status: Not Approved</h3>
                <p>After careful review, we regret to inform you that your application has not been approved at this time.</p>
                
                @if($application->rejection_reason)
                <h4>Reason for Rejection:</h4>
                <p><strong>{{ $application->rejection_reason }}</strong></p>
                @endif
            </div>

            <h3>📋 Application Details</h3>
            <div class="info-row">
                <span class="info-label">Full Name:</span>
                <span class="info-value">{{ $application->full_name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ $application->email }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Specialty:</span>
                <span class="info-value">{{ $application->specialty }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">License Number:</span>
                <span class="info-value">{{ $application->license_number }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Application Date:</span>
                <span class="info-value">{{ $application->created_at->format('M d, Y') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Review Date:</span>
                <span class="info-value">{{ $application->reviewed_at->format('M d, Y') }}</span>
            </div>

            <div class="encouragement">
                <h3>💡 We Encourage You to Reapply</h3>
                <p>This decision does not reflect your capabilities as a healthcare professional. We encourage you to address the concerns mentioned above and reapply in the future.</p>
                
                <h4>Tips for Future Applications:</h4>
                <ul>
                    <li>Ensure all required documentation is complete and up-to-date</li>
                    <li>Verify that all credentials are clearly visible and valid</li>
                    <li>Double-check that your license information matches official records</li>
                    <li>Provide detailed information about your experience and specializations</li>
                </ul>
            </div>

            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/doctor-application" class="btn">Submit New Application</a>
            </div>

            <p>If you have any questions about this decision or need clarification on the rejection reason, please feel free to contact our support team. We're here to help you through the process.</p>

            <p>Thank you for your understanding, and we hope to hear from you again soon.</p>

            <p>Best regards,<br>The Clinified Hub Team</p>
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