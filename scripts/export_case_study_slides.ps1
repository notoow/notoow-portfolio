param(
    [string]$PresentationPath = 'C:\Users\tan01\Desktop\@ALLFILES\우탄개발폴더\탄_최종자료.pptx',
    [string]$OutputDir = 'C:\Users\tan01\Desktop\@ALLFILES\우탄개발폴더\notoow-portfolio\public\case-studies\claude-code',
    [int]$Width = 1600,
    [int]$Height = 900
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $PresentationPath)) {
    throw "Presentation not found: $PresentationPath"
}

if (Test-Path $OutputDir) {
    Remove-Item $OutputDir -Recurse -Force
}

New-Item -ItemType Directory -Path $OutputDir | Out-Null

$ppt = $null
$presentation = $null

try {
    $ppt = New-Object -ComObject PowerPoint.Application
    $ppt.Visible = $true
    $presentation = $ppt.Presentations.Open($PresentationPath, $true, $true, $false)
    $presentation.Export($OutputDir, 'JPG', $Width, $Height)

    $exported = Get-ChildItem -Path $OutputDir -Filter '*.JPG' | Sort-Object Name
    $index = 1
    foreach ($file in $exported) {
        $targetName = ('slide-{0:d2}.jpg' -f $index)
        Rename-Item -Path $file.FullName -NewName $targetName
        $index += 1
    }

    $count = (Get-ChildItem -Path $OutputDir -Filter 'slide-*.jpg').Count
    Write-Output "EXPORTED=$count"
}
finally {
    if ($presentation) {
        $presentation.Close()
    }

    if ($ppt) {
        $ppt.Quit()
    }
}
