import CryptoJS from 'crypto-js'

export async function generateSymmetricKey() {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export const encryptWithSymmetricKey = (key, plaintext) => {
  const iv = CryptoJS.lib.WordArray.random(16); 
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv: iv });
  return {
    iv: iv.toString(CryptoJS.enc.Base64),
    ciphertext: encrypted.toString(),
  };
};

export const decryptWithSymmetricKey = (key, ciphertext, iv) => {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: CryptoJS.enc.Base64.parse(iv) });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export async function encryptGroupKeyForMember(groupKey, memberPublicKey) {
  const exportedKey = await window.crypto.subtle.exportKey("raw", groupKey);
  return await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    memberPublicKey,
    exportedKey
  );
}

export async function decryptGroupKey(encryptedGroupKey, privateKey) {
  const decryptedKey = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedGroupKey
  );
  return await window.crypto.subtle.importKey(
    "raw",
    decryptedKey,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}

