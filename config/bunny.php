<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Bunny Storage (Images, Files)
    |--------------------------------------------------------------------------
    | Used for tenant/superadmin assets. See config/filesystems.php disk 'bunny'.
    */
    'storage' => [
        'zone' => env('BUNNY_STORAGE_ZONE'),
        'api_key' => env('BUNNY_API_KEY'),
        'region' => env('BUNNY_REGION', 'ny'),
        'url' => env('BUNNY_URL'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Bunny Stream (Video - Shorts)
    |--------------------------------------------------------------------------
    | API: https://video.bunnycdn.com/library/{library_id}/videos
    | Embed: https://iframe.mediadelivery.net/embed/{library_id}/{video_id}
    */
    'stream' => [
        'library_id' => env('BUNNY_STREAM_LIBRARY_ID'),
        'api_key' => env('BUNNY_STREAM_API_KEY'),
        'enabled' => env('BUNNY_STREAM_ENABLED', false),
        'embed_base_url' => 'https://iframe.mediadelivery.net/embed',
        'api_base_url' => 'https://video.bunnycdn.com',
    ],

];
