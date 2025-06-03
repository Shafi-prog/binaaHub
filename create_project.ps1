try {
    $headers = @{
        'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
        'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
        'Content-Type' = 'application/json'
        'Prefer' = 'return=representation'
    }

    Write-Host "Reading test project data..."
    $body = Get-Content 'test_project.json' -Raw
    Write-Host "Project data: $body"
    
    Write-Host "Sending request to Supabase..."
    
    try {
        $response = Invoke-WebRequest -Uri 'http://localhost:54321/rest/v1/projects' -Method POST -Headers $headers -Body $body
        Write-Host "Project created successfully!"
        Write-Host "Status: $($response.StatusCode)"
        Write-Host "Response: $($response.Content)"
    } catch {
        Write-Host "HTTP Error: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode
            $statusDescription = $_.Exception.Response.StatusDescription
            Write-Host "Status: $statusCode - $statusDescription"
            
            $responseStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($responseStream)
            $responseBody = $reader.ReadToEnd()
            Write-Host "Error response: $responseBody"
        }
    }
} catch {
    Write-Host "General error: $($_.Exception.Message)"
}
