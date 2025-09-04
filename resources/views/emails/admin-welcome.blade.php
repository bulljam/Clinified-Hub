<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Clinified Hub - Admin Account</title>
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
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
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
        .welcome {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 20px;
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
        .role-badge {
            display: inline-block;
            padding: 8px 16px;
            background-color: {{ $admin->role === 'super_admin' ? '#dc2626' : '#14b8a6' }};
            color: white;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin: 10px 0;
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
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .security-note {
            background-color: #fee2e2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛡️ Welcome to Clinified Hub</h1>
        <p>Your administrator account has been created</p>
    </div>

    <div class="content">
        <div class="welcome">
            <h2>Welcome {{ $admin->name }}!</h2>
            <div class="role-badge">
                {{ $admin->role === 'super_admin' ? '👑 Super Administrator' : '🛡️ Administrator' }}
            </div>
        </div>

        <div class="card">
            <p>Dear {{ $admin->name }},</p>
            
            <p>A new administrator account has been created for you on <strong>Clinified Hub</strong>. You now have {{ $admin->role === 'super_admin' ? 'super administrator' : 'administrator' }} access to the platform with the ability to manage the healthcare appointment system.</p>

            <div class="credentials">
                <h3>🔐 Your Login Credentials</h3>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ $admin->email }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Temporary Password:</span>
                    <span class="info-value"><strong>{{ $temporaryPassword }}</strong></span>
                </div>
            </div>

            <div class="security-note">
                <strong>⚠️ Security Notice:</strong> This is a temporary password. You must change it immediately after your first login for security purposes.
            </div>

            <h3>📋 Account Details</h3>
            <div class="info-row">
                <span class="info-label">Full Name:</span>
                <span class="info-value">{{ $admin->name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Email Address:</span>
                <span class="info-value">{{ $admin->email }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Role:</span>
                <span class="info-value">{{ $admin->role === 'super_admin' ? 'Super Administrator' : 'Administrator' }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Account Created:</span>
                <span class="info-value">{{ $admin->created_at->format('M d, Y \a\t g:i A') }}</span>
            </div>

            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/login" class="btn">Login to Your Account</a>
            </div>

            <h3>🔑 Your Permissions</h3>
            @if($admin->role === 'super_admin')
            <ul>
                <li><strong>User Management:</strong> Create, edit, and manage all users (patients, providers, admins)</li>
                <li><strong>Admin Management:</strong> Create and manage other administrators</li>
                <li><strong>System Control:</strong> Full access to all system features and settings</li>
                <li><strong>Appointment Oversight:</strong> View and manage all appointments across the platform</li>
                <li><strong>Doctor Applications:</strong> Review and approve/reject doctor applications</li>
                <li><strong>Payment Management:</strong> Oversee all payment transactions and statuses</li>
                <li><strong>Complete System Access:</strong> Highest level of platform control</li>
            </ul>
            @else
            <ul>
                <li><strong>User Management:</strong> View and manage patients and providers</li>
                <li><strong>Appointment Management:</strong> Oversee appointment scheduling and status</li>
                <li><strong>Doctor Applications:</strong> Review and approve/reject doctor applications</li>
                <li><strong>Payment Oversight:</strong> Monitor payment transactions</li>
                <li><strong>Platform Administration:</strong> General administrative functions</li>
            </ul>
            @endif

            <h3>🚀 Getting Started</h3>
            <ol>
                <li><strong>Login:</strong> Use the credentials above to access your admin dashboard</li>
                <li><strong>Change Password:</strong> Immediately update your password for security</li>
                <li><strong>Explore Dashboard:</strong> Familiarize yourself with the admin interface</li>
                <li><strong>Review Users:</strong> Check current patients and providers in the system</li>
                <li><strong>Monitor Activity:</strong> Keep track of appointments and platform usage</li>
            </ol>

            <p>If you have any questions about your new administrator role or need assistance, please contact the Super Administrator or support team.</p>

            <p>Welcome to the team!</p>
        </div>
    </div>

    <div class="footer">
        <p>
            <strong>Clinified Hub</strong><br>
            Healthcare Appointment Management Platform<br>
        </p>
        <p style="font-size: 12px; color: #9ca3af;">
            This email was sent to {{ $admin->email }} regarding your new administrator account.
        </p>
    </div>
</body>
</html>