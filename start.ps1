while ($true) {
	pnpm start
	if ($LASTEXITCODE -ne 0) {
		Write-Host "Command failed with exit code $LASTEXITCODE. Restarting..."
	} else {
		Write-Host "Command succeeded. Restarting..."
	}
	Start-Sleep -Seconds 1  # Ждать 1 секунду перед повторным запуском
}