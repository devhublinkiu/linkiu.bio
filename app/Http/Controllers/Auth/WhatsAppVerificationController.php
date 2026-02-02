<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppVerificationController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:7',
            'country_code' => 'nullable|string',
        ]);

        $phone = $request->phone;
        $countryCode = $request->country_code ?? '57'; // Default to Colombia if not provided

        // Limpiar para asegurar solo numeros
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        $cleanCountryCode = preg_replace('/[^0-9]/', '', $countryCode);

        // Combinar pais + numero
        $fullNumber = $cleanCountryCode . $cleanPhone;

        if (strlen($fullNumber) < 10) {
            return response()->json(['message' => 'Número de teléfono o código de país inválido'], 422);
        }

        // Generar OTP de 6 dígitos
        $otp = rand(100000, 999999);

        // Guardar OTP en Cache por 10 minutos
        Cache::put('whatsapp_otp_' . $fullNumber, $otp, 600);

        $apiKey = env('INFOBIP_API_KEY');
        $baseUrl = env('INFOBIP_BASE_URL');
        $sender = env('INFOBIP_WHATSAPP_SENDER');

        if (!$apiKey || !$baseUrl || !$sender) {
            Log::error('Infobip Config Missing', ['key' => (bool) $apiKey, 'url' => (bool) $baseUrl]);
            return response()->json(['message' => 'Error de configuración del servicio de mensajería'], 500);
        }

        $url = rtrim($baseUrl, '/') . '/whatsapp/1/message/template';

        // Estructura según la plantilla proporcionada verify_number_register_es
        // buttons type URL parameter lleva el código.
        $payload = [
            "messages" => [
                [
                    "from" => $sender,
                    "to" => $fullNumber,
                    "content" => [
                        "templateName" => "verify_number_register_es",
                        "templateData" => [
                            "body" => [
                                "placeholders" => [(string) $otp]
                            ],
                            "buttons" => [
                                ["type" => "URL", "parameter" => (string) $otp]
                            ]
                        ],
                        "language" => "es"
                    ]
                ]
            ]
        ];

        try {
            Log::info('Enviando WhatsApp a Infobip', [
                'to' => $fullNumber,
                'payload_preview' => json_encode($payload)
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'App ' . $apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($url, $payload);

            Log::info('Respuesta Infobip', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                return response()->json(['message' => 'Código enviado correctamente', 'status' => 'sent', 'debug_otp' => app()->environment('local') ? $otp : null]);
            } else {
                Log::error('Infobip API Error', ['status' => $response->status(), 'body' => $response->body()]);
                return response()->json(['message' => 'Error al enviar el mensaje de WhatsApp. Ver logs.', 'details' => $response->json()], 500);
            }
        } catch (\Exception $e) {
            Log::error('Infobip Exception', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error de conexión con servicio de mensajería', 'error' => $e->getMessage()], 500);
        }
    }

    public function verify(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string'
        ]);

        $cleanPhone = preg_replace('/[^0-9]/', '', $request->phone);
        $countryCode = $request->country_code ?? '57';
        $cleanCountryCode = preg_replace('/[^0-9]/', '', $countryCode);
        $fullNumber = $cleanCountryCode . $cleanPhone;

        $cachedOtp = Cache::get('whatsapp_otp_' . $fullNumber);

        if (!$cachedOtp) {
            return response()->json(['message' => 'El código ha expirado o no existe. Solicita uno nuevo.', 'verified' => false], 422);
        }

        if ((string) $cachedOtp === (string) $request->code) {
            Cache::forget('whatsapp_otp_' . $cleanPhone);
            return response()->json(['message' => 'Número verificado correctamente', 'verified' => true]);
        }

        return response()->json(['message' => 'Código incorrecto', 'verified' => false], 422);
    }
}
