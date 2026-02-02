$path = "f:\linkiu.bio\resources\js\Pages\Auth\RegisterTenant.tsx"
$content = [System.IO.File]::ReadAllText($path)

# 1. Update function signature to accept errors
$funcDef = "onError: () =>"
if ($content.Contains($funcDef)) {
    $content = $content.Replace($funcDef, "onError: (errors: any) =>")
    Write-Host "Updated callback signature."
} else {
    Write-Host "Callback signature not found or already updated."
}

# 2. Update toast logic
$toastLine = "toast.error('Verifica los campos marcados en rojo');"
if ($content.Contains($toastLine)) {
    $logic = "const firstError = errors && Object.values(errors)[0] ? String(Object.values(errors)[0]) : 'Verifica los campos';`n                "
    $newToast = "toast.error(firstError);`n                console.error('Validation Errors:', errors);"
    $content = $content.Replace($toastLine, $logic + $newToast)
    Write-Host "Updated toast logic."
} else {
    Write-Host "Toast message line not found."
}

[System.IO.File]::WriteAllText($path, $content)
