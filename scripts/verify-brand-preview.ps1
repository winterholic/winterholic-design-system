$ErrorActionPreference = 'Stop'

$outputDirectory = Join-Path ([System.IO.Path]::GetTempPath()) 'winterholic-brand-preview'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$stockPreview = ([System.Uri](Join-Path $repositoryRoot 'stock-gosu\examples\preview.html')).AbsoluteUri
$memoirPreview = ([System.Uri](Join-Path $repositoryRoot 'memoir\examples\preview.html')).AbsoluteUri

$cases = @(
  @{ Name = 'stock-gosu-light'; Url = $stockPreview; Scheme = 'light'; Selector = '.logo--default' },
  @{ Name = 'stock-gosu-dark'; Url = $stockPreview; Scheme = 'dark'; Selector = '.logo--inverse' },
  @{ Name = 'memoir-light'; Url = $memoirPreview; Scheme = 'light'; Selector = '.brand-lockup--default' },
  @{ Name = 'memoir-dark'; Url = $memoirPreview; Scheme = 'dark'; Selector = '.brand-lockup--inverse' }
)

foreach ($case in $cases) {
  $screenshot = Join-Path $outputDirectory "$($case.Name).png"
  & npx.cmd playwright screenshot --browser chromium --color-scheme $case.Scheme --viewport-size '1440,1000' --wait-for-selector $case.Selector --wait-for-timeout 150 --timeout 15000 $case.Url $screenshot
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $screenshot)) {
    throw "$($case.Name) 렌더 검증에 실패했습니다."
  }
  $size = (Get-Item -LiteralPath $screenshot).Length
  if ($size -lt 10000) { throw "$($case.Name) 스크린샷이 비정상적으로 작습니다: $size bytes" }
  Write-Output "$($case.Name): $size bytes"
}

Write-Output "screenshots=$outputDirectory"
