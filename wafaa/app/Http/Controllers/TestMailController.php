<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;   // ✅ bon chemin
use Illuminate\Support\Facades\Mail;

class TestMailController extends Controller
{
    public function sendTestMails()
    {

    // Test avec YourMailable
    Mail::to('essalhiwafaa195@gmail.com')->send(new \App\Mail\YourMailable());
    Mail::to('essalhiwafaa01@gmail.com')->send(new \App\Mail\YourMailable());

        return response()->json(['status' => 'Emails envoyés !']);
    }
}
