<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InfobipService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $from;

    public function __construct()
    {
        $this->apiKey = config('infobip.api_key');
        $this->baseUrl = rtrim(config('infobip.base_url'), '/');
        $this->from = config('infobip.sender');
    }

    /**
     * Send a WhatsApp template message.
     *
     * @param string $to The destination phone number (with country code)
     * @param string $templateName The name of the template registered in Infobip
     * @param array $placeholders Array of values for {{1}}, {{2}}, etc.
     * @param string|null $buttonParameter Optional parameter for the URL button
     * @param string $language Language code (default 'es')
     * @return array|null Response from API or null on failure
     */
    public function sendTemplate(string $to, string $templateName, array $placeholders = [], string $buttonParameter = null, string $language = 'es')
    {
        // 1. Plan Enforcement (The Golden Rule)
        // If we are in a tenant context, we MUST check if the feature is enabled in the plan
        if (app()->bound('currentTenant')) {
            $tenant = app('currentTenant');
            if (!$tenant->hasFeature('whatsapp')) {
                Log::info("WhatsApp blocked for tenant {$tenant->slug}: Feature 'whatsapp' not in plan.");
                return null;
            }
        }

        if (empty($this->apiKey) || empty($this->baseUrl)) {
            Log::error("Infobip credentials missing in .env");
            return null;
        }

        $url = "{$this->baseUrl}/whatsapp/1/message/template";

        // Map placeholders to Infobip format
        $mappedPlaceholders = collect($placeholders)->map(fn($val) => (string)$val)->toArray();

        $payload = [
            'messages' => [
                [
                    'from' => $this->from,
                    'to' => $to,
                    'content' => [
                        'templateName' => $templateName,
                        'templateData' => [
                            'body' => [
                                'placeholders' => $mappedPlaceholders
                            ],
                        ],
                        'language' => $language,
                    ]
                ]
            ]
        ];

        // Add button parameter if provided
        if ($buttonParameter) {
            $payload['messages'][0]['content']['templateData']['buttons'] = [
                [
                    'type' => 'URL',
                    'parameter' => $buttonParameter
                ]
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "App {$this->apiKey}",
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($url, $payload);

            if ($response->failed()) {
                Log::error("Infobip API Error: " . $response->body());
                return null;
            }

            return $response->json();
        }
        catch (\Exception $e) {
            Log::error("Infobip Connection Error: " . $e->getMessage());
            return null;
        }
    }
}
