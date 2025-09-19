<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\SendEmailJob;

class MailController extends Controller
{
    public function send(Request $request)
    {
        $details = [
            'email' => $request->email,
            'name'  => $request->name,
        ];

        SendEmailJob::dispatch($details);

        return response()->json(['message' => 'Email ajouté à la queue']);
    }
}

