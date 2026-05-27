# Wrapper so `gh` works in terminals opened before GitHub CLI was installed.
$env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')
& 'C:\Program Files\GitHub CLI\gh.exe' @args
