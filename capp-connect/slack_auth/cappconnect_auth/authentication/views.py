import urllib.parse
import uuid
import jwt
import requests
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from cappconnect_auth.load_slack_key import load_rsa_public_key



def slack_login_redirect(request):
    '''
    This function identifies our Slack OpenID connect endpoint (base_url) for a user to login 
    and verify their identity.

    Inputs: request: the incoming HTTP request object from the browser. 
    Ouputs: the redirect url to Slacks authorization request 
    '''
     #str(uuid.uuid4())  

    base_url = "https://slack.com/openid/connect/authorize" 
    #state = uuid.uuid4().hex + uuid.uuid1().hex #str(uuid.uuid4())  
    #nonce = uuid.uuid4().hex + uuid.uuid1().hex 
    params = {
        "client_id": settings.SLACK_CLIENT_ID,
        "scope": "openid profile email",
        "redirect_uri": settings.SLACK_REDIRECT_URI,
        "response_type": "code",
        "state": uuid.uuid4().hex + uuid.uuid1().hex,
        "nonce": uuid.uuid4().hex + uuid.uuid1().hex, #https://stackoverflow.com/questions/5590170/what-is-the-standard-method-for-generating-a-nonce-in-python
    }

    url = f"{base_url}?{urllib.parse.urlencode(params)}"
    return redirect(url)


def slack_callback(request):
    '''
    This function gets the autorization code from Slack, and exchanges it for an 
    JWT ID token. It then verifies the JWT signagture and decodes the payload. 
    Decoded version = the JSON response. 
    Input: request: the incoming HTTP request object from the browser. 
    Output: The decoded JSON showing user information such as name, slack_id, email, etc. 
    '''
    code = request.GET.get("code")
    if not code:
        return JsonResponse({"error": "Missing code"}, status=400)

    token_url = "https://slack.com/api/openid.connect.token"
    data = {
        "client_id": settings.SLACK_CLIENT_ID,
        "client_secret": settings.SLACK_CLIENT_SECRET,
        "code": code,
        "redirect_uri": settings.SLACK_REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    response = requests.post(token_url, data=data)
    token_data = response.json()

    if not response.ok or "id_token" not in token_data:
        return JsonResponse(
            {"error": "Failed to get tokens", "details": token_data}, status=400
        )

    id_token = token_data["id_token"]

    # This is  a static JWKS key. REMINDER:replace this with dynamic fetch later!!!
    n = "zQqzXfb677bpMKw0idKC5WkVLyqk04PWMsWYJDKqMUUuu_PmzdsvXBfHU7tcZiNoHDuVvGDqjqnkLPEzjXnaZY0DDDHvJKS0JI8fkxIfV1kNy3DkpQMMhgAwnftUiSXgb5clypOmotAEm59gHPYjK9JHBWoHS14NYEYZv9NVy0EkjauyYDSTz589aiKU5lA-cePG93JnqLw8A82kfTlrJ1IIJo2isyBGANr0YzR-d3b_5EvP7ivU7Ph2v5JcEUHeiLSRzIzP3PuyVFrPH659Deh-UAsDFOyJbIcimg9ITnk5_45sb_Xcd_UN6h5I7TGOAFaJN4oi4aaGD4elNi_K1Q"
    e = "AQAB"

    key = load_rsa_public_key(n, e)

    try:
        decoded = jwt.decode(
            id_token,
            key=key,
            algorithms=["RS256"],
            audience=settings.SLACK_CLIENT_ID,
            issuer="https://slack.com",
        )
    except jwt.PyJWTError as e:
        return JsonResponse(
            {"error": "Invalid token", "details": str(e)}, status=400
        )

    return JsonResponse(decoded)
