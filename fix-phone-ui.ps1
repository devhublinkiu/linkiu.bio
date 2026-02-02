$file = "f:\linkiu.bio\resources\js\Pages\Auth\RegisterTenant.tsx"
$content = Get-Content $file -Raw

# Fix the phone verification block
$oldBlock = @'
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-12 gap-2">
                                                    <select
                                                        value={phoneCode}
                                                        onChange={e => setPhoneCode(e.target.value)}
                                                        disabled={verificationStatus === 'verified' || verificationStatus === 'sending'}
                                                        className="col-span-2 h-12 pl-2 pr-1 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-0 cursor-pointer text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                                                    >
                                                        <option value="+57">🇨🇴 +57</option>
                                                        <option value="+1">🇺🇸 +1</option>
                                                        <option value="+52">🇲🇽 +52</option>
                                                        <option value="+34">🇪🇸 +34</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={data.owner_phone ?? ''}
                                                        onChange={e => {
                                                            setData('owner_phone', e.target.value);
                                                            if (verificationStatus === 'verified') setVerificationStatus('idle');
                                                        }}
                                                        disabled={verificationStatus === 'verified'}
                                                        className={cn(
                                                            "col-span-6 h-12 px-4 border text-gray-900 placeholder-gray-400 focus:outline-none transition-all font-medium rounded-xl",
                                                            verificationStatus === 'verified'
                                                                ? "bg-green-50 border-green-200 text-green-700"
                                                                : "bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                                                        )}
                                                        placeholder="300 123 4567"
                                                    />
                                                </div>


                                                {verificationStatus === 'idle' && (
                                                    <button
                                                        type="button"
                                                        onClick={sendVerification}
                                                        className="col-span-4 h-12 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        Verificar
                                                )}

                                                        {verificationStatus === 'sending' && (
                                                            <button disabled className="col-span-4 h-12 rounded-xl bg-gray-100 text-gray-400 font-medium flex items-center justify-center gap-2 cursor-wait border border-gray-200">
                                                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                                                Enviando...
                                                            </button>
                                                        )}

                                                        {verificationStatus === 'verified' && (
                                                            <div className="w-full px-4 h-12 rounded-xl bg-green-100 text-green-700 font-bold flex items-center justify-center gap-2 border border-green-200 whitespace-nowrap animate-in fade-in">
                                                                <CheckCircle2 className="w-5 h-5" />
                                                                Número Verificado
                                                            </div>
                                                        )}
                                                    </div>

                                            {/* OTP Input Area */}
                                                {verificationStatus === 'sent' && (
                                                    <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                        <p className="text-sm text-indigo-800 mb-3 font-medium">
                                                            Hemos enviado un código a tu WhatsApp. Ingrésalo aquí:
                                                        </p>
                                                        <div className="flex gap-3">
                                                            <input
                                                                type="text"
                                                                value={otpCode}
                                                                onChange={e => setOtpCode(e.target.value)}
                                                                placeholder="Código (Ej: 123456)"
                                                                className="flex-1 h-11 px-4 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-center tracking-widest text-lg"
                                                                maxLength={6}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={verifyOtp}
                                                                disabled={isVerifyingOtp || !otpCode}
                                                                className="px-6 h-11 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                                                            >
                                                                {isVerifyingOtp ? 'Validando...' : 'Confirmar'}
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={sendVerification}
                                                            className="text-xs text-indigo-500 underline mt-3 hover:text-indigo-700 font-medium"
                                                        >
                                                            No recibí el código, reenviar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
'@

$newBlock = @'
                                            <div className="space-y-3">
                                                {/* Grid: Select + Input + Button */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <select
                                                        value={phoneCode}
                                                        onChange={e => setPhoneCode(e.target.value)}
                                                        disabled={verificationStatus === 'verified' || verificationStatus === 'sending'}
                                                        className="col-span-2 h-12 pl-2 pr-1 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed appearance-none"
                                                    >
                                                        <option value="+57">🇨🇴 +57</option>
                                                        <option value="+1">🇺🇸 +1</option>
                                                        <option value="+52">🇲🇽 +52</option>
                                                        <option value="+34">🇪🇸 +34</option>
                                                    </select>
                                                    
                                                    <input
                                                        type="text"
                                                        value={data.owner_phone ?? ''}
                                                        onChange={e => {
                                                            setData('owner_phone', e.target.value);
                                                            if (verificationStatus === 'verified') setVerificationStatus('idle');
                                                        }}
                                                        disabled={verificationStatus === 'verified'}
                                                        className={cn(
                                                            "col-span-6 h-12 px-4 border text-gray-900 placeholder-gray-400 focus:outline-none transition-all font-medium rounded-xl",
                                                            verificationStatus === 'verified'
                                                                ? "bg-green-50 border-green-200 text-green-700"
                                                                : "bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                                                        )}
                                                        placeholder="300 123 4567"
                                                    />
                                                    
                                                    {verificationStatus === 'idle' && (
                                                        <button
                                                            type="button"
                                                            onClick={sendVerification}
                                                            className="col-span-4 h-12 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
                                                        >
                                                            <MessageCircle className="w-4 h-4" />
                                                            Verificar
                                                        </button>
                                                    )}
                                                    
                                                    {verificationStatus === 'sending' && (
                                                        <button disabled className="col-span-4 h-12 rounded-xl bg-gray-100 text-gray-400 font-medium flex items-center justify-center gap-2 cursor-wait border border-gray-200 text-sm">
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Enviando...
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Verified Status */}
                                                {verificationStatus === 'verified' && (
                                                    <div className="w-full px-4 h-12 rounded-xl bg-green-100 text-green-700 font-bold flex items-center justify-center gap-2 border border-green-200 animate-in fade-in">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        Número Verificado
                                                    </div>
                                                )}
                                            </div>
'@

$content = $content.Replace($oldBlock, $newBlock)
$content | Set-Content $file -NoNewline

Write-Host "Phone verification UI updated successfully!"
