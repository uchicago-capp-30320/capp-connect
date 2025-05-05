import base64

from cryptography.hazmat.primitives.asymmetric.rsa import (
    RSAPublicKey,
    RSAPublicNumbers,
)


def load_rsa_public_key(n_b64: str, e_b64: str) -> RSAPublicKey:
    n_bytes = base64.urlsafe_b64decode(n_b64 + "==")
    e_bytes = base64.urlsafe_b64decode(e_b64 + "==")
    n_int = int.from_bytes(n_bytes, "big")
    e_int = int.from_bytes(e_bytes, "big")
    pub_numbers = RSAPublicNumbers(e_int, n_int)
    return pub_numbers.public_key()
