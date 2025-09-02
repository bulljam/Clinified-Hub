<?php

namespace App\Mail;

use App\Models\DoctorApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DoctorApplicationApproved extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public DoctorApplication $application,
        public string $temporaryPassword
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Doctor Application Approved - Welcome to Clinify',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.doctor-application-approved',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
