<?php

namespace App\Mail;

use App\Models\DoctorApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DoctorApplicationRejected extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public DoctorApplication $application
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Doctor Application Status - Clinify',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.doctor-application-rejected',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
