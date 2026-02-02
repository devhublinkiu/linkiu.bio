$file = "f:\linkiu.bio\resources\js\Layouts\SuperAdminLayout.tsx"
$content = Get-Content $file -Raw

# Target string to identify the notifications block
$target = "{/* Notifications */}"
$index = $content.IndexOf($target)

if ($index -ge 0) {
    # Find the closing tag of the Button following the comment
    $endTag = "</Button>"
    $endIndex = $content.IndexOf($endTag, $index)
    
    if ($endIndex -gt $index) {
        $length = ($endIndex + $endTag.Length) - $index
        $oldBlock = $content.Substring($index, $length)

        # Confirm it contains the Bell icon to be safe
        if ($oldBlock -match "Bell") {
            $newBlock = "{/* Notifications */}
                        <Button variant=`"ghost`" size=`"icon`" className=`"relative text-gray-400 hover:text-gray-600`">
                            <Bell className=`"h-5 w-5`" />
                            {newTenantsCount > 0 && (
                                <span className=`"absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white`" />
                            )}
                        </Button>"
            
            # Perform replacement
            $content = $content.Remove($index, $length).Insert($index, $newBlock)
            $content | Set-Content $file -NoNewline
            Write-Host "Notification badge added successfully."
        } else {
            Write-Host "Error: Target block does not contain Bell icon."
        }
    } else {
        Write-Host "Error: Could not find closing Button tag."
    }
} else {
    Write-Host "Error: Could not find Notifications comment block."
}
