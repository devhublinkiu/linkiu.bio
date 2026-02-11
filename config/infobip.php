<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Infobip API Key
    |--------------------------------------------------------------------------
    |
    | This key is used to authenticate with the Infobip API. 
    | You can find it in your Infobip dashboard under 'Settings' > 'API Keys'.
    |
    */
    'api_key' => env('INFOBIP_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Infobip Base URL
    |--------------------------------------------------------------------------
    |
    | Your custom API base URL provided by Infobip.
    | Example: https://kaldjy.api.infobip.com
    |
    */
    'base_url' => env('INFOBIP_BASE_URL'),

    /*
    |--------------------------------------------------------------------------
    | Infobip Sender Number
    |--------------------------------------------------------------------------
    |
    | The sender number or ID registered in Infobip for WhatsApp.
    |
    */
    'sender' => env('INFOBIP_WHATSAPP_SENDER'),
];
