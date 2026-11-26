param([Parameter(Mandatory=$true)][string]$BriefPath, [string]$StagedPath)
$ErrorActionPreference = 'Stop'
$profileDir = [Environment]::GetFolderPath([Environment+SpecialFolder]::UserProfile)
$bree = [IO.Path]::Combine($profileDir, '.bree')
$briefs = [IO.Path]::Combine($bree, 'briefs')
$dateName = [IO.Path]::GetFileName($BriefPath)
if ($dateName -notmatch '^[0-9]{4}-[0-9]{2}-[0-9]{2}\.html$' -or
    [IO.Path]::Combine($briefs, $dateName) -ne $BriefPath) { throw 'Unexpected output path' }

function Read-PrivateAcl($Item) {
    if ($Item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Redirected output' }
    $acl = Get-Acl -LiteralPath $Item.FullName
    $descriptor = [Security.AccessControl.RawSecurityDescriptor]::new($acl.GetSecurityDescriptorBinaryForm(), 0)
    if ($null -eq $descriptor.DiscretionaryAcl) { throw 'Missing DACL' }
    $aces = @(foreach ($ace in $descriptor.DiscretionaryAcl) {
        @{ kind = $ace.AceType.ToString(); sid = $ace.SecurityIdentifier.Value }
    })
    @{ owner = $descriptor.Owner.Value; aces = $aces }
}

if ((Get-Item -Force -LiteralPath $profileDir).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Redirected profile' }
$records = @(foreach ($folder in @($bree, $briefs)) {
    if (-not (Test-Path -LiteralPath $folder)) { [void][IO.Directory]::CreateDirectory($folder) }
    $item = Get-Item -Force -LiteralPath $folder
    if (-not $item.PSIsContainer) { throw 'Expected a folder' }
    Read-PrivateAcl $item
})
if (Test-Path -LiteralPath $BriefPath) {
    $item = Get-Item -Force -LiteralPath $BriefPath
    if ($item.PSIsContainer) { throw 'Expected a page' }
    $records += Read-PrivateAcl $item
}
if ($StagedPath) {
    if ([IO.Path]::GetDirectoryName($StagedPath) -ne $briefs) { throw 'Unexpected temporary path' }
    $records += Read-PrivateAcl (Get-Item -Force -LiteralPath $StagedPath)
}
@{ user = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value; records = $records } | ConvertTo-Json -Depth 6 -Compress
