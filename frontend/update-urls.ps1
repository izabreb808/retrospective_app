$files = Get-ChildItem -Path . -Include *.tsx,*.ts -Recurse
foreach ($file in $files) {
    (Get-Content $file.FullName) -replace 'http://localhost:5000', 'https://retrospective-app-w474.onrender.com' | Set-Content $file.FullName
}
Write-Host "Updated all files!"
