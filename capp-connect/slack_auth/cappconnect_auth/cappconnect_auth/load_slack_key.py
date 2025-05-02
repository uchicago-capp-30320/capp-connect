import base64
import jwt
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

def load_rsa_public_key(n_b64, e_b64):
    n_int = int.from_bytes(base64.urlsafe_b64decode(n_b64 + '=='), "big")
    e_int = int.from_bytes(base64.urlsafe_b64decode(e_b64 + '=='), "big")
    pub_numbers = rsa.RSAPublicNumbers(e_int, n_int)
    pub_key = pub_numbers.public_key(default_backend())
    return pub_key