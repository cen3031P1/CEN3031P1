Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)\s*$') {
        [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim())
    }
}

$MONGO_URI = [System.Environment]::GetEnvironmentVariable("MONGO_URI")
$DATABASE = [System.Environment]::GetEnvironmentVariable("DATABASE")
$COLLECTION = [System.Environment]::GetEnvironmentVariable("COLLECTION")

mongosh $MONGO_URI --eval "db.getSiblingDB('$DATABASE').$COLLECTION.drop()"

Write-Host "Collection '$COLLECTION' dropped!"