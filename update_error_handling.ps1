$path = "f:\linkiu.bio\resources\js\Pages\Auth\RegisterTenant.tsx"
$content = [System.IO.File]::ReadAllText($path)

# Pattern to find onError block precisely
$pattern = "onError:\s*\(\)\s*=>\s*\{\s*clearInterval\(interval\);\s*setViewState\('form'\);\s*setBuildStep\(0\);\s*toast\.error\('Verifica los campos marcados en rojo'\);\s*\}"

if ($content -match $pattern) {
    $replacement = "onError: (errors: any) => {
                clearInterval(interval);
                setViewState('form');
                setBuildStep(0);
                const firstError = Object.values(errors)[0];
                toast.error(typeof firstError === 'string' ? firstError : 'Verifica los campos marcados en rojo');
                console.error('Validation Errors:', errors);
            }"
    $content = $content -replace $pattern, $replacement
    [System.IO.File]::WriteAllText($path, $content)
    Write-Host "Success"
} else {
    Write-Host "Pattern not found"
}
