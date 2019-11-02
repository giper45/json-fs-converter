REALM="http://localhost:5001/oauth/token"
SCOPE="artifact-repository:org1/repo1:pull"

curl -s -X POST -H "Authorization: Bearer MASTERKEY" \
  "$REALM?grant_type=client_credentials&scope=$SCOPE" | jq .
