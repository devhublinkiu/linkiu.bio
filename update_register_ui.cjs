const fs = require('fs');
const path = require('path');

const filePath = path.join('resources', 'js', 'Pages', 'Auth', 'RegisterTenant.tsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Define the start and end markers for replacement
    // We look for where the Phone section starts and where the Password section begins
    const startMarkerRegex = /<label className="block text-sm font-semibold text-gray-900 mb-2">Celular \/ WhatsApp<\/label>/;
    const endMarkerRegex = /{\/\* Password \*\/}/;

    const startMatch = content.match(startMarkerRegex);
    const endMatch = content.match(endMarkerRegex);

    if (!startMatch || !endMatch) {
        console.error('Could not find start or end markers in the file.');
        console.log('Start found:', !!startMatch);
        console.log('End found:', !!endMatch);
        process.exit(1);
    }

    const startIndex = startMatch.index + startMatch[0].length;
    const endIndex = endMatch.index;

    // New content to insert
    const newContent = `
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-12 gap-3">
                                                    {/* Country Code */}
                                                    <div className="col-span-3 sm:col-span-2">
                                                        <select
                                                            value={phoneCode}
                                                            onChange={e => setPhoneCode(e.target.value)}
                                                            disabled={verificationStatus === 'verified' || verificationStatus === 'sending'}
                                                            className="w-full h-12 pl-2 pr-1 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed appearance-none"
                                                        >
                                                            <option value="+57">🇨🇴 +57</option>
                                                            <option value="+1">🇺🇸 +1</option>
                                                            <option value="+52">🇲🇽 +52</option>
                                                            <option value="+34">🇪🇸 +34</option>
                                                        </select>
                                                    </div>

                                                    {/* Phone Input */}
                                                    <div className="col-span-9 sm:col-span-6">
                                                        <input
                                                            type="text"
                                                            value={data.owner_phone ?? ''}
                                                            onChange={e => {
                                                                setData('owner_phone', e.target.value);
                                                                if (verificationStatus === 'verified') setVerificationStatus('idle');
                                                            }}
                                                            disabled={verificationStatus === 'verified'}
                                                            className={cn(
                                                                "w-full h-12 px-4 border placeholder-gray-400 focus:outline-none transition-all font-medium rounded-xl",
                                                                verificationStatus === 'verified'
                                                                    ? "bg-green-50 border-green-200 text-green-700"
                                                                    : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                                                            )}
                                                            placeholder="300 123 4567"
                                                        />
                                                    </div>

                                                    {/* Action Button (Full width on mobile, col-span-4 on desktop) */}
                                                    <div className="col-span-12 sm:col-span-4">
                                                        {verificationStatus === 'idle' && (
                                                            <button
                                                                type="button"
                                                                onClick={sendVerification}
                                                                className="w-full h-12 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
                                                            >
                                                                <MessageCircle className="w-4 h-4" />
                                                                Verificar
                                                            </button>
                                                        )}

                                                        {verificationStatus === 'sending' && (
                                                            <button disabled className="w-full h-12 rounded-xl bg-gray-100 text-gray-400 font-medium flex items-center justify-center gap-2 cursor-wait border border-gray-200 text-sm">
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Enviando...
                                                            </button>
                                                        )}

                                                        {verificationStatus === 'verified' && (
                                                            <div className="w-full h-12 rounded-xl bg-green-100 text-green-700 font-bold flex items-center justify-center gap-2 border border-green-200 animate-in fade-in text-sm">
                                                                <CheckCircle2 className="w-5 h-5" />
                                                                Verificado
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
`;

    // Reconstruct the file content
    // Note: We need to wrap our new content in the parent div that we removed implicitly by matching from the label
    // Wait, let's look at the markers. 
    // Start marker: <label ... >Celular / WhatsApp</label>
    // End marker: {/* Password */}

    // The original structure was:
    // <div className="md:col-span-2">
    //     <label ...>...</label>
    //     ... content ...
    // </div>
    // {/* Password */}

    // So we are replacing everything BETWEEN the label and the next section.
    // The previous implementation had the <div> wrapper around the <label>.
    // My regex matches the label itself. 
    // So I need to keep the label, then insert my new content, then close the parent div of the label.

    // Actually, looking at previous file dumps, the structure is:
    // <div className="md:col-span-2"> <!-- Parent -->
    //      <label ...>...</label>
    //      <div>...</div> <!-- The part we want to replace -->
    // </div>

    // So if I replace from "after label" to "before closing div of parent", that's tricky because nested divs.

    // Simpler approach: Include the parent div in the REPLACEMENT, but find the parent div in the SEARCH.
    // Search for: <div className="md:col-span-2">\s*<label[^>]*>Celular / WhatsApp</label>
    // Replace with: <div className="md:col-span-2"><label ...>...</label> [NEW CONTENT] </div>

    const refinedStartRegex = /<div className="md:col-span-2">\s*<label className="block text-sm font-semibold text-gray-900 mb-2">Celular \/ WhatsApp<\/label>/;
    const refinedStartMatch = content.match(refinedStartRegex);

    if (refinedStartMatch) {
        const preContent = content.substring(0, refinedStartMatch.index);
        const postContent = content.substring(endIndex);

        // Build the fully replaced block
        const fullReplacement = `                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">Celular / WhatsApp</label>
${newContent}`; // We appended the closing div in the newContent string in the variable above? No, wait. 

        // Let's check newContent variable. 
        // It starts with <div className="space-y-3">
        // It ends with </div> </div> (Closing space-y-3 and layout grid, and then... wait)

        // I put a closing </div> at the end of newContent variable in the string literal above.
        // Let's clean that up.

        const contentToInsert = `                                            <div className="space-y-3">
                                                <div className="grid grid-cols-12 gap-3">
                                                    {/* Country Code */}
                                                    <div className="col-span-3 sm:col-span-2">
                                                        <select
                                                            value={phoneCode}
                                                            onChange={e => setPhoneCode(e.target.value)}
                                                            disabled={verificationStatus === 'verified' || verificationStatus === 'sending'}
                                                            className="w-full h-12 pl-2 pr-1 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed appearance-none"
                                                        >
                                                            <option value="+57">🇨🇴 +57</option>
                                                            <option value="+1">🇺🇸 +1</option>
                                                            <option value="+52">🇲🇽 +52</option>
                                                            <option value="+34">🇪🇸 +34</option>
                                                        </select>
                                                    </div>

                                                    {/* Phone Input */}
                                                    <div className="col-span-9 sm:col-span-6">
                                                        <input
                                                            type="text"
                                                            value={data.owner_phone ?? ''}
                                                            onChange={e => {
                                                                setData('owner_phone', e.target.value);
                                                                if (verificationStatus === 'verified') setVerificationStatus('idle');
                                                            }}
                                                            disabled={verificationStatus === 'verified'}
                                                            className={cn(
                                                                "w-full h-12 px-4 border placeholder-gray-400 focus:outline-none transition-all font-medium rounded-xl",
                                                                verificationStatus === 'verified'
                                                                    ? "bg-green-50 border-green-200 text-green-700"
                                                                    : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                                                            )}
                                                            placeholder="300 123 4567"
                                                        />
                                                    </div>

                                                    {/* Action Button */}
                                                    <div className="col-span-12 sm:col-span-4">
                                                        {verificationStatus === 'idle' && (
                                                            <button
                                                                type="button"
                                                                onClick={sendVerification}
                                                                className="w-full h-12 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
                                                            >
                                                                <MessageCircle className="w-4 h-4" />
                                                                Verificar
                                                            </button>
                                                        )}

                                                        {verificationStatus === 'sending' && (
                                                            <button disabled className="w-full h-12 rounded-xl bg-gray-100 text-gray-400 font-medium flex items-center justify-center gap-2 cursor-wait border border-gray-200 text-sm">
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Enviando...
                                                            </button>
                                                        )}

                                                        {verificationStatus === 'verified' && (
                                                            <div className="w-full h-12 rounded-xl bg-green-100 text-green-700 font-bold flex items-center justify-center gap-2 border border-green-200 animate-in fade-in text-sm">
                                                                <CheckCircle2 className="w-5 h-5" />
                                                                Verificado
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
`;

        const finalFileContent = preContent + fullReplacement + '\n\n                                        ' + postContent;
        fs.writeFileSync(filePath, finalFileContent, 'utf8');
        console.log('Successfully updated RegisterTenant.tsx');
    } else {
        console.error('Could not find refined start marker');
        process.exit(1);
    }

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
