# Installs the latest public Windows release. Works in Windows PowerShell 5.1 and PowerShell 7.
$ErrorActionPreference = 'Stop'
$api = 'https://api.github.com/repos/will-krof/sketchspace/releases/latest'
$headers = @{ 'User-Agent' = 'Sketchspace-Installer'; 'Accept' = 'application/vnd.github+json' }
$release = Invoke-RestMethod -Uri $api -Headers $headers
$installer = @($release.assets | Where-Object { $_.name -match '^Sketchspace-Setup-\d+\.\d+\.\d+\.exe$' })
if ($installer.Count -ne 1) { throw 'No Sketchspace Windows installer was found in the latest release.' }
$checksum = @($release.assets | Where-Object { $_.name -eq ($installer[0].name + '.sha512') })
if ($checksum.Count -ne 1) { throw 'The release checksum is missing.' }
$folder = Join-Path ([System.IO.Path]::GetTempPath()) ('sketchspace-install-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $folder | Out-Null
try {
    $installerPath = Join-Path $folder $installer[0].name
    $checksumPath = Join-Path $folder $checksum[0].name
    Invoke-WebRequest -Uri $installer[0].browser_download_url -OutFile $installerPath -UseBasicParsing
    Invoke-WebRequest -Uri $checksum[0].browser_download_url -OutFile $checksumPath -UseBasicParsing
    $expected = ((Get-Content $checksumPath -Raw).Trim() -split '\s+')[0]
    $actual = (Get-FileHash -Path $installerPath -Algorithm SHA512).Hash
    if ($expected -notmatch '^[a-fA-F0-9]{128}$' -or $actual -ne $expected) { throw 'Installer checksum verification failed.' }
    Write-Host "Installing Sketchspace $($release.tag_name)..."
    $process = Start-Process -FilePath $installerPath -Wait -PassThru
    if ($process.ExitCode -ne 0) { throw "Installer exited with code $($process.ExitCode)." }
} finally {
    Remove-Item -LiteralPath $folder -Recurse -Force -ErrorAction SilentlyContinue
}
